"use client";

import React, { useEffect } from "react";
import { convert, Params } from "@/lib/sfxr/sfxr";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { ParamToggleGroup } from "@/components/param-toggle-group";
import { Slider } from "@/components/ui/slider";
import { Oscilloscope } from "@/components/oscilloscope";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Label } from "@/components/ui/label";
import { UI_GENERATOR_CONFIG } from "@/lib/ui/ui.const";

import { WaveformBackground } from "@/components/waveform-background";
import { WaveTypeToggle } from "@/components/wave-type-toggle";
import { ManualSettings } from "@/components/sections/manual-settings";
import { FileExport } from "@/components/sections/file-export";
import { useSoundStore } from "@/lib/store/useSoundStore";
import { ExportConfigDialog } from "@/components/export-config-dialog";
import { ImportConfigDialog } from "@/components/import-config-dialog";
import { CopyPermalinkButton } from "@/components/copy-permalink-button";

export default function Home() {
  const {
    params,
    sound,
    analyser,
    fileName,
    setParams,
    play,
    updateParam,
    generateSoundFromPreset,
    mutateParams,
  } = useSoundStore();

  // Debounced play for use with sliders.
  const debouncedPlay = useDebouncedCallback(play, 300, { leading: true });

  // On mount, generate the sound from the permalink preset (if any).
  useEffect(() => {
    const hash = window.location.hash;

    if (hash.length > 1) {
      // Load sound, but don't play it.
      generateSoundFromPreset(hash);
    }
  }, []);

  const handleImportConfig = (config: any) => {
    try {
      if (config) {
        const newParams = new Params();
        Object.assign(newParams, config);
        setParams(newParams);
        play();
      }
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
                  onClick={() => {
                    generateSoundFromPreset(config.key);
                    play();
                  }}
                  className="w-full"
                >
                  {config.label}
                </Button>
              ))}

              <div className="space-y-2 pt-4">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    mutateParams(params);
                    play();
                  }}
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
              <WaveTypeToggle
                params={params}
                updateParam={(key, value) => {
                  updateParam(key, value);
                  play();
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ManualSettings
                params={params}
                updateParam={(key, value) => {
                  updateParam(key, value);
                  debouncedPlay();
                }}
              />
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

              <FileExport params={params} sound={sound} fileName={fileName} />
            </div>
          </div>
        </div>

        {/* Share and Configuration */}
        <div className="mt-6 bg-card text-card-foreground p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Share and Configuration
          </h2>
          <div className="flex flex-wrap gap-4">
            <ExportConfigDialog params={params} />
            <ImportConfigDialog handleImportConfig={handleImportConfig} />
            <CopyPermalinkButton params={params} />
          </div>
        </div>
      </main>
    </div>
  );
}
