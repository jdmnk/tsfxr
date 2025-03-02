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
    <div className="w-full bg-card text-card-foreground p-6 rounded-lg shadow space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Keyboard</h2>
        <div className="flex items-center gap-4 bg-muted/50 px-6 py-3 rounded-lg">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => changeOctave(-1)}
            disabled={octave === 0}
            className="hover:bg-background/50"
          >
            <MinusCircle className="h-5 w-5" />
          </Button>
          <div className="flex flex-col items-center min-w-[4rem]">
            <span className="text-2xl font-mono font-bold">{octave}</span>
            <span className="text-xs text-muted-foreground mt-1">
              (Z/X keys)
            </span>
          </div>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => changeOctave(1)}
            disabled={octave === 8}
            className="hover:bg-background/50"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-4">
        <div className="flex relative min-w-[600px] max-w-full mx-auto">
          {octaveNotes.map((note) => (
            <Button
              key={note.key}
              className={cn(
                "h-48 relative border border-border transition-colors",
                "flex-1 min-w-[3.5rem]",
                note.note.includes("#")
                  ? "bg-primary text-secondary -mx-[1.25rem] z-10 h-32 hover:bg-primary/50"
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
              <div className="absolute bottom-3 left-3 flex flex-col items-start">
                <span className="text-sm opacity-50">{note.key}</span>
                <span className="text-base font-medium">
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
