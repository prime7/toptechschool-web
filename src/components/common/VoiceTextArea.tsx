import React, { useState, useRef, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff } from "lucide-react";

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

// Utility function to combine class names
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface VoiceTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  micClassName?: string;
  showStatus?: boolean;
  mode?: "hold" | "toggle"; // "hold" for press-and-hold, "toggle" for click-to-toggle
  micIcon?: React.ReactNode;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onError?: (error: string) => void;
}

export const VoiceTextarea: React.FC<VoiceTextareaProps> = ({
  value,
  onChange,
  placeholder = "Type your message or use the microphone to speak...",
  className,
  disabled = false,
  micClassName,
  showStatus = false,
  mode = "hold", // Default to hold mode
  micIcon,
  onRecordingStart,
  onRecordingStop,
  onError,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const baseTextRef = useRef("");
  const lastSpeechTimeRef = useRef<number>(0);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionClass);

    if (SpeechRecognitionClass) {
      recognitionRef.current = new SpeechRecognitionClass();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";
    }
  }, []);

  // Function to add proper punctuation to text
  const addPunctuation = useCallback((text: string): string => {
    if (!text.trim()) return text;

    let processedText = text.trim();

    // Don't add punctuation if text already ends with punctuation
    if (/[.!?]$/.test(processedText)) {
      return processedText;
    }

    // Add period for sentence completion
    processedText += ".";

    return processedText;
  }, []);

  // Function to handle silence detection and auto-punctuation
  const handleSilenceDetection = useCallback(() => {
    const now = Date.now();
    const timeSinceLastSpeech = now - lastSpeechTimeRef.current;

    // If there's been silence for more than 2 seconds, add punctuation
    if (timeSinceLastSpeech > 2000 && baseTextRef.current) {
      const textWithPunctuation = addPunctuation(baseTextRef.current);
      if (textWithPunctuation !== baseTextRef.current) {
        baseTextRef.current = textWithPunctuation;
        onChange(textWithPunctuation);
      }
    }
  }, [addPunctuation, onChange]);

  // Function to format and combine text segments
  const formatTextSegments = useCallback(
    (baseText: string, newText: string): string => {
      if (!baseText.trim()) return newText;
      if (!newText.trim()) return baseText;

      // Ensure proper spacing between segments
      const needsSpace =
        !baseText.endsWith(" ") &&
        !baseText.endsWith(".") &&
        !baseText.endsWith("!") &&
        !baseText.endsWith("?");
      return baseText + (needsSpace ? " " : "") + newText;
    },
    []
  );

  const startRecording = useCallback(() => {
    if (!isSupported || disabled || !recognitionRef.current) return;

    setError(null);
    setIsRecording(true);
    setInterimText("");
    onRecordingStart?.();

    // Store the current text as base text
    baseTextRef.current = value;
    lastSpeechTimeRef.current = Date.now();

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      // Update last speech time when we receive results
      lastSpeechTimeRef.current = Date.now();

      // Clear any existing silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update interim text for live display
      if (interimTranscript) {
        setInterimText(interimTranscript);
        // Show live transcription in the textarea
        const liveText = formatTextSegments(
          baseTextRef.current,
          interimTranscript
        );
        onChange(liveText);

        // Set a timeout to detect silence and add punctuation
        silenceTimeoutRef.current = setTimeout(handleSilenceDetection, 2500);
      }

      // When we get final results, update the base text
      if (finalTranscript) {
        const cleanedTranscript = finalTranscript.trim();
        if (cleanedTranscript) {
          const newBaseText = formatTextSegments(
            baseTextRef.current,
            cleanedTranscript
          );
          baseTextRef.current = newBaseText;
          onChange(newBaseText);
        }
        setInterimText("");

        // Set a timeout to add punctuation after a pause
        silenceTimeoutRef.current = setTimeout(handleSilenceDetection, 2500);
      }
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      const errorMessage = `Speech recognition error: ${event.error}`;
      setError(errorMessage);
      setIsRecording(false);
      setInterimText("");
      onError?.(errorMessage);

      // Clear any timeouts
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }

      // Restore original text on error
      onChange(baseTextRef.current);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      setInterimText("");
      onRecordingStop?.();

      // Clear any timeouts
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }

      // Add final punctuation if needed
      if (baseTextRef.current) {
        const finalText = addPunctuation(baseTextRef.current);
        if (finalText !== baseTextRef.current) {
          baseTextRef.current = finalText;
          onChange(finalText);
        }
      }
    };

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      const errorMessage = "Failed to start speech recognition";
      setError(errorMessage);
      setIsRecording(false);
      setInterimText("");
      onError?.(errorMessage);
    }
  }, [
    isSupported,
    disabled,
    value,
    onChange,
    onRecordingStart,
    onRecordingStop,
    onError,
    addPunctuation,
    formatTextSegments,
    handleSilenceDetection,
  ]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }

    // Clear any timeouts
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    setIsRecording(false);
    setInterimText("");
  }, [isRecording]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Toggle mode handler
  const handleToggleClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Hold mode handlers
  const handleMouseDown = useCallback(() => {
    if (mode === "hold") {
      startRecording();
    }
  }, [mode, startRecording]);

  const handleMouseUp = useCallback(() => {
    if (mode === "hold") {
      stopRecording();
    }
  }, [mode, stopRecording]);

  const handleMouseLeave = useCallback(() => {
    if (mode === "hold") {
      stopRecording();
    }
  }, [mode, stopRecording]);

  // Touch events for mobile (hold mode)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (mode === "hold") {
        e.preventDefault();
        startRecording();
      }
    },
    [mode, startRecording]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (mode === "hold") {
        e.preventDefault();
        stopRecording();
      }
    },
    [mode, stopRecording]
  );

  // Handle manual text changes
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      // Update base text ref when user manually types
      if (!isRecording) {
        baseTextRef.current = newValue;
      }
    },
    [onChange, isRecording]
  );

  const renderIcon = () => {
    if (micIcon) {
      return micIcon;
    }

    return isRecording ? (
      <Mic className="h-4 w-4" />
    ) : (
      <MicOff className="h-4 w-4" />
    );
  };

  // Get button title based on mode
  const getButtonTitle = () => {
    if (!isSupported) return "Speech recognition not supported";

    if (mode === "toggle") {
      return isRecording
        ? "Click to stop recording"
        : "Click to start recording";
    }

    return isRecording ? "Recording... Release to stop" : "Hold to record";
  };

  return (
    <div className="relative">
      <div className="relative">
        <Textarea
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          className={cn(
            "pr-12",
            isRecording &&
              "ring-2 ring-red-500/50 border-red-300 dark:border-red-700",
            className
          )}
          disabled={disabled}
        />

        {/* Microphone button inside textarea */}
        <button
          type="button"
          className={cn(
            "absolute top-3 right-3 p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
            isRecording
              ? "bg-red-500 text-white shadow-lg focus:ring-red-500"
              : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground focus:ring-primary",
            isRecording && mode === "hold" && "animate-pulse",
            !isSupported && "opacity-50 cursor-not-allowed",
            disabled && "opacity-50 cursor-not-allowed",
            micClassName
          )}
          disabled={!isSupported || disabled}
          onClick={mode === "toggle" ? handleToggleClick : undefined}
          onMouseDown={mode === "hold" ? handleMouseDown : undefined}
          onMouseUp={mode === "hold" ? handleMouseUp : undefined}
          onMouseLeave={mode === "hold" ? handleMouseLeave : undefined}
          onTouchStart={mode === "hold" ? handleTouchStart : undefined}
          onTouchEnd={mode === "hold" ? handleTouchEnd : undefined}
          title={getButtonTitle()}
        >
          {renderIcon()}
        </button>
      </div>

      {/* Optional status display */}
      {showStatus && (
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {isRecording && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-600 font-medium">
                  {interimText ? "Transcribing..." : "Listening..."}
                </span>
              </div>
            )}

            {!isSupported && (
              <span className="text-orange-500">Voice input not supported</span>
            )}

            {error && <span className="text-red-500">{error}</span>}
          </div>

          <div className="text-right">
            {isSupported && !disabled && (
              <span>
                {mode === "toggle"
                  ? "Click mic to record"
                  : "Hold mic to speak"}{" "}
                • Auto-punctuation enabled
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
