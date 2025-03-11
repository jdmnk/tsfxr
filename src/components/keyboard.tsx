import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { MinusCircle, PlusCircle } from "lucide-react";

const octaveNotes = [
  { note: "C", key: "A", frequency: 261.63 },
  { note: "C#", key: "W", frequency: 277.18 },
  { note: "D", key: "S", frequency: 293.66 },
  { note: "D#", key: "E", frequency: 311.13 },
  { note: "E", key: "D", frequency: 329.63 },
  { note: "F", key: "F", frequency: 349.23 },
  { note: "F#", key: "T", frequency: 369.99 },
  { note: "G", key: "G", frequency: 392.0 },
  { note: "G#", key: "Y", frequency: 415.3 },
  { note: "A", key: "H", frequency: 440.0 },
  { note: "A#", key: "U", frequency: 466.16 },
  { note: "B", key: "J", frequency: 493.88 },
];

interface KeyboardProps {
  onNotePlay: (frequency: number) => void;
}

export function Keyboard({ onNotePlay }: KeyboardProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [octave, setOctave] = useState(4); // Default octave

  const getFrequencyForNote = (baseFreq: number, targetOctave: number) => {
    const octaveDiff = targetOctave - 4; // Our base frequencies are in octave 4
    return baseFreq * Math.pow(2, octaveDiff);
  };

  const changeOctave = (delta: number) => {
    setOctave((prev) => {
      const newOctave = prev + delta;
      return Math.min(Math.max(newOctave, 0), 8);
    });
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "z") {
        changeOctave(-1);
        return;
      }
      if (e.key.toLowerCase() === "x") {
        changeOctave(1);
        return;
      }

      const note = octaveNotes.find(
        (n) => n.key.toLowerCase() === e.key.toLowerCase()
      );
      if (note && !e.repeat) {
        setActiveKey(note.key);
        onNotePlay(getFrequencyForNote(note.frequency, octave));
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      const note = octaveNotes.find(
        (n) => n.key.toLowerCase() === e.key.toLowerCase()
      );
      if (note) {
        setActiveKey(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [octave, onNotePlay]);

  return (
    <div className="w-full bg-card text-card-foreground p-4 sm:p-6 rounded-lg shadow space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
          Keyboard
        </h2>
        <div className="flex items-center justify-center sm:justify-end gap-2 bg-muted/50 px-3 py-2 rounded-lg self-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeOctave(-1)}
            disabled={octave === 0}
            className="hover:bg-background/50 h-8 w-8 p-0"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <div className="flex flex-col items-center min-w-[2.5rem]">
            <span className="text-lg font-mono font-bold leading-none">
              {octave}
            </span>
            <span className="text-xs text-muted-foreground">(Z/X)</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeOctave(1)}
            disabled={octave === 8}
            className="hover:bg-background/50 h-8 w-8 p-0"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-2 sm:pb-4">
        <div className="flex relative min-w-[320px] sm:min-w-[600px] max-w-full mx-auto">
          {octaveNotes.map((note) => (
            <Button
              key={note.key}
              className={cn(
                "h-36 sm:h-48 relative border border-border transition-colors",
                "flex-1 min-w-[2rem] sm:min-w-[3.5rem]",
                note.note.includes("#")
                  ? "bg-primary text-secondary -mx-[1rem] sm:-mx-[1.25rem] z-10 h-24 sm:h-32 hover:bg-primary/50"
                  : "bg-background text-foreground hover:bg-accent",
                activeKey === note.key &&
                  (note.note.includes("#") ? "bg-primary/70" : "bg-accent")
              )}
              onMouseDown={() => {
                setActiveKey(note.key);
                onNotePlay(getFrequencyForNote(note.frequency, octave));
              }}
              onMouseUp={() => setActiveKey(null)}
              onMouseLeave={() => activeKey === note.key && setActiveKey(null)}
            >
              <div className="absolute bottom-2 left-2 flex flex-col items-start">
                <span className="text-xs sm:text-sm opacity-50">
                  {note.key}
                </span>
                <span className="text-sm sm:text-base font-medium">
                  {note.note}
                  <sub>{octave}</sub>
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
