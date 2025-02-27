"use client";

import React, { useState, useEffect, useMemo } from "react";
import { convert, Params, SoundEffect } from "@/lib/sfxr/sfxr";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { ParamToggleGroup } from "@/components/param-toggle-group";
import { Slider } from "@/components/ui/slider";
import { Oscilloscope } from "@/components/oscilloscope";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Label } from "@/components/ui/label";
import { UI_GENERATOR_CONFIG } from "@/lib/ui/ui.const";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WaveformBackground } from "@/components/waveform-background";
import { WaveTypeToggle } from "@/components/wave-type-toggle";
import { ManualSettings } from "@/components/manual-settings";
import { ShareAndConfig } from "@/components/share-and-config";
import { Info } from "lucide-react";

export default function Home() {
  // State for the current sound parameters.
  const [params, setParams] = useState<Params>(new Params());
  // File name cannot be directly derived from params, so we use a separate state.
  const [fileName, setFileName] = useState<string>("sfx.wav");

  // Derived values.
  const sound = useMemo(() => new SoundEffect(params).generate(), [params]);
  const audio = useMemo(() => sound.getAudio(), [sound]);
  const analyser = useMemo(() => audio.analyser, [sound]);

  const fileSize = useMemo(
    () => Math.round(sound.wav.length / 1024) + "kB",
    [sound]
  );
  const numSamples = useMemo(
    () =>
      (
        sound.header.subChunk2Size /
        (sound.header.bitsPerSample >> 3)
      ).toString(),
    [sound]
  );
  const clipping = sound.clipping;

  // We only want to play the sound when the audio buffer is updated.
  // By reacting to the audio buffer, we can assure that the analyser node is also updated.
  useEffect(() => {
    debouncedPlay();
  }, [audio]);

  const play = () => {
    audio.play();
  };

  // Debounced play to be used for example with sliders.
  const debouncedPlay = useDebouncedCallback(play, 300, { leading: true });

  const updateParam = <K extends keyof Params>(key: K, value: Params[K]) => {
    const newParams = params.clone();
    newParams[key] = value;
    setParams(newParams);
  };

  // Generate a new sound based on a preset.
  const generateSoundFromPreset = (fx: string) => {
    const newParams = params.clone();

    if (fx.startsWith("#")) {
      newParams.fromB58(fx.slice(1));

      setFileName("random.wav");
    } else {
      // @ts-ignore
      if (typeof newParams[fx] === "function") {
        // @ts-ignore
        newParams[fx]();

        setFileName(fx + ".wav");
      }
    }
    setParams(newParams);
  };

  // Mutate (slightly change) current parameters.
  const mutateParams = () => {
    const newp = params.clone();
    newp.mutate();
    setParams(newp);
  };

  // On mount, generate the sound from the permalink preset (if any).
  useEffect(() => {
    const hash = window.location.hash;

    if (hash.length > 1) {
      generateSoundFromPreset(hash);
    }
  }, []);

  const handleImportConfig = (configString: string) => {
    try {
      const importedConfig = JSON.parse(configString);

      // TODO
    } catch (error) {
      console.error("Failed to import configuration:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground relative">
      <WaveformBackground waveform={params.wave_type} />
      <main className="max-w-[1200px] mx-auto p-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Synthesizer</h1>
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Main app */}
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-6">
          {/* Generator Section */}
          <div className="space-y-2 bg-card text-card-foreground p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Generator</h2>
            <div className="space-y-2">
              {UI_GENERATOR_CONFIG.map((config) => (
                <Button
                  key={config.key}
                  onClick={() => generateSoundFromPreset(config.key)}
                  className="w-full"
                >
                  {config.label}
                </Button>
              ))}

              <div className="space-y-2 pt-4">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={mutateParams}
                >
                  Mutate
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => play()}
                >
                  Play
                </Button>
              </div>
            </div>
          </div>

          {/* Manual Settings Section */}
          <div className="space-y-6 bg-card text-card-foreground p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Manual Settings</h2>

            <div className="space-y-4">
              <WaveTypeToggle params={params} updateParam={updateParam} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ManualSettings params={params} updateParam={updateParam} />
            </div>
          </div>

          {/* Export Section */}
          <div className="space-y-6 bg-card text-card-foreground p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Sound</h2>
            <div className="flex flex-col items-center gap-2">
              {analyser && <Oscilloscope analyser={analyser} />}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm">Gain</Label>
                  <span className="text-sm text-muted-foreground">
                    {convert.units["sound_vol"](params.sound_vol)}
                  </span>
                </div>

                <Slider
                  min={0}
                  max={1}
                  step={0.001}
                  value={[params.sound_vol ? params.sound_vol : 0]}
                  onValueChange={(e) => {
                    updateParam("sound_vol", e[0]);
                  }}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sample Rate (Hz)</Label>

                <ParamToggleGroup
                  options={["44100", "22050", "11025", "5512"]}
                  labels={["44k", "22k", "11k", "6k"]}
                  onChange={(value) => {
                    updateParam("sample_rate", +value);
                  }}
                  value={params.sample_rate.toString()}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Sample Rate (Hz)</Label>

                <ParamToggleGroup
                  options={["16", "8"]}
                  labels={["16 bit", "8 bit"]}
                  onChange={(value) => {
                    updateParam("sample_size", +value);
                  }}
                  value={params.sample_size.toString()}
                ></ParamToggleGroup>
              </div>

              <div className="space-y-2 pt-6">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Duration:</div>
                  <div> {(+numSamples / params.sample_rate).toFixed(2)}s</div>
                  <div>File size:</div>
                  <div>{fileSize}</div>
                  <div>Samples:</div>
                  <div>{numSamples}</div>
                  <div className="flex items-center">
                    Clipped:
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Clipping occurs when the audio signal exceeds the
                          maximum amplitude that can be represented in the
                          digital format. This can result in distortion of the
                          sound. Reducing the overall volume or adjusting the
                          envelope can help minimize clipping.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div>{clipping}</div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <Button className="w-full">
                  <a id="wav" href={sound?.dataURI || "#"} download={fileName}>
                    Download
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Share and Configuration */}
        <div className="mt-6 bg-card text-card-foreground p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Share and Configuration
          </h2>
          <div className="flex flex-wrap gap-4">
            <ShareAndConfig
              params={params}
              handleImportConfig={handleImportConfig}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
