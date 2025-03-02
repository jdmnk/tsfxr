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
import { useSoundStore } from "@/lib/store/use-sound-store";
import { ExportConfigDialog } from "@/components/export-config-dialog";
import { ImportConfigDialog } from "@/components/import-config-dialog";
import { CopyPermalinkButton } from "@/components/copy-permalink-button";
import { About } from "@/components/sections/about";
import { Logo } from "@/components/logo";
import { toast } from "sonner";
import { LoadingPage } from "@/components/loading-page";

const MemoizedOscilloscope = React.memo(Oscilloscope);
const MemoizedWaveformBackground = React.memo(WaveformBackground);

export default function Home() {
  const {
    params,
    sound,
    analyser,
    fileName,
    soundVol,
    sampleRate,
    sampleSize,
    b58,
    setParams,
    play,
    updateGlobalSetting,
    updateParam,
    generateSoundFromPreset,
    mutateParams,
  } = useSoundStore();

  // Debounced play for use with sliders.
  const debouncedPlay = useDebouncedCallback(play, 300, { leading: true });

  // On mount, generate the sound from the permalink preset (if any).
  useEffect(() => {
    // Init initial params (this must be done outside the store because the sfxr library uses the window object)
    const initialParams = new Params();
    updateGlobalSetting("soundVol", initialParams.sound_vol);
    updateGlobalSetting("sampleRate", initialParams.sample_rate);
    updateGlobalSetting("sampleSize", initialParams.sample_size);

    const hash = window.location.hash;

    // If there is a permalink, generate the sound from it.
    if (hash.length > 1) {
      try {
        generateSoundFromPreset(hash);
      } catch (error) {
        toast.error("Failed to load sound from permalink");
        console.error("Failed to load sound from permalink", error);
      }
    } else {
      // If there is no permalink, generate the sound from the initial params.
      setParams(initialParams);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImportConfig = (config: object) => {
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

  if (!params || !sound || !analyser) {
    return <LoadingPage />;
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground relative">
      <MemoizedWaveformBackground waveform={params.wave_type} />
      <main className="max-w-[1200px] mx-auto p-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Logo />
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

          <div className="flex flex-col gap-6">
            {/* Export Section */}
            <div className="bg-card text-card-foreground p-4 rounded-lg shadow space-y-6 flex-grow">
              <h2 className="text-lg font-semibold">Sound</h2>
              <div className="flex flex-col items-center gap-2">
                <MemoizedOscilloscope analyser={analyser} />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">Gain</Label>
                    <span className="text-sm text-muted-foreground">
                      {convert.units["sound_vol"](soundVol)}
                    </span>
                  </div>

                  <Slider
                    min={0}
                    max={1}
                    step={0.001}
                    value={[soundVol ? soundVol : 0]}
                    onValueChange={(e) => {
                      updateGlobalSetting("soundVol", e[0]);
                      debouncedPlay();
                    }}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Sample Rate (Hz)
                  </Label>

                  <ParamToggleGroup
                    options={["44100", "22050", "11025", "5512"]}
                    labels={["44k", "22k", "11k", "6k"]}
                    onChange={(value) => {
                      updateGlobalSetting("sampleRate", +value);
                      play();
                    }}
                    value={sampleRate.toString()}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sample Size</Label>

                  <ParamToggleGroup
                    options={["16", "8"]}
                    labels={["16 bit", "8 bit"]}
                    onChange={(value) => {
                      updateGlobalSetting("sampleSize", +value);
                      play();
                    }}
                    value={sampleSize.toString()}
                  ></ParamToggleGroup>
                </div>

                <FileExport params={params} sound={sound} fileName={fileName} />
              </div>
            </div>

            <div className="bg-card text-card-foreground p-4 rounded-lg shadow space-y-6 flex-grow">
              <h2 className="text-lg font-semibold">Share</h2>

              <div className="space-y-4">
                <ExportConfigDialog params={params} />
                <ImportConfigDialog handleImportConfig={handleImportConfig} />
                <CopyPermalinkButton b58={b58 ?? ""} />
              </div>
            </div>
          </div>
        </div>

        <About />
      </main>
    </div>
  );
}
