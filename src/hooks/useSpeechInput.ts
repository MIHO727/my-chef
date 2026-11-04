import { useCallback, useEffect, useRef, useState } from 'react';

const PERMISSION_ERROR = 'マイクの使用が許可されていません。ブラウザの設定で許可してください';

interface SpeechResultEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechErrorEvent extends Event {
  error: string;
}

interface SpeechRecognizer {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognizerConstructor = new () => SpeechRecognizer;

const speechWindow = window as Window & {
  SpeechRecognition?: SpeechRecognizerConstructor;
  webkitSpeechRecognition?: SpeechRecognizerConstructor;
};

const Recognizer = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

export function useSpeechInput(onText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const recognizerRef = useRef<SpeechRecognizer | null>(null);
  const onTextRef = useRef(onText);
  onTextRef.current = onText;

  const toggle = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      return;
    }
    if (!Recognizer) return;

    const recognizer = new Recognizer();
    recognizer.lang = 'ja-JP';
    recognizer.continuous = true;
    recognizer.interimResults = false;

    recognizer.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0].transcript.trim();
        if (result.isFinal && text) {
          onTextRef.current(text);
        }
      }
    };

    recognizer.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError(PERMISSION_ERROR);
      }
    };

    recognizer.onend = () => {
      recognizerRef.current = null;
      setListening(false);
    };

    setError('');
    recognizerRef.current = recognizer;
    recognizer.start();
    setListening(true);
  }, []);

  // stop() と違い、聞き取り途中の言葉を破棄して止める
  const cancel = useCallback(() => {
    recognizerRef.current?.abort();
  }, []);

  useEffect(() => cancel, [cancel]);

  return { supported: Boolean(Recognizer), listening, error, toggle, cancel };
}
