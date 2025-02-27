"use client";

import React, { useState, useEffect, useMemo } from "react";
import { convert, Params, SoundEffect, waveforms } from "@/lib/sfxr/sfxr";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { ParamSection } from "@/components/param-section";
import { ParamToggleGroup } from "@/components/param-toggle-group";
import { Slider } from "@/components/ui/slider";
import { Oscilloscope } from "@/components/oscilloscope";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Label } from "@/components/ui/label";
import { UI_GENERATOR_CONFIG } from "@/lib/ui/ui.const";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Download, Info, Link, Share2, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WaveformBackground } from "@/components/waveform-background";

export default function Home() {
  // State for the current sound parameters.
  const [params, setParams] = useState<Params>(new Params());
  // File name cannot be directly derived from params, so we use a separate state.
  const [fileName, setFileName] = useState<string>("sfx.wav");

  // Derived values.
  const b58 = useMemo(() => params.toB58(), [params]);
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

  // Generate a new sound.
  const gen = (fx: string, shouldPlay: boolean = true) => {
    const newParams = params.clone();

    if (fx.startsWith("#")) {
      newParams.fromB58(fx.slice(1));

      // Download name becomes "random.wav"
      setFileName("random.wav");
    } else {
      // @ts-ignore
      if (typeof newParams[fx] === "function") {
        // @ts-ignore
        newParams[fx]();

        // Download name becomes fx+".wav"
        setFileName(fx + ".wav");
      }
    }
    setParams(newParams);
    // shouldPlay && play();
  };

  // Mutate (slightly change) current parameters.
  const mut = () => {
    const newp = params.clone();
    newp.mutate();
    setParams(newp);
  };

  // Copy b58 code to clipboard.
  const handleCopyPermalink = async () => {
    try {
      const permaLink = window.location.href + "#" + params.toB58();
      await navigator.clipboard.writeText(permaLink);
      toast.success("Permalink copied to clipboard.", {
        // description: "Permalink copied .",
      });
    } catch (error) {
      console.error("Failed to copy permalink:", error);
      toast.error("Copy failed", {
        description: "There was an error copying the permalink.",
      });
    }
  };

  // On mount, generate a default sound.
  useEffect(() => {
    const hash = window.location.hash || "pickupCoin";

    gen(hash, false); // False = Don't play on mount
  }, []);

  const handleShare = async () => {
    const configString = handleExportConfig();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Synthesizer Configuration",
          text: "Check out my synthesizer configuration!",
          url: window.location.href,
        });
        toast.success("Shared successfully", {
          description: "Your configuration has been shared.",
        });
      } catch (error) {
        // Do nothing if user cancels
      }
    } else {
      try {
        await navigator.clipboard.writeText(configString);
        toast("Copied to clipboard", {
          description: "Your configuration has been copied to the clipboard.",
        });
      } catch (error) {
        console.error("Error copying configuration to clipboard:", error);
        toast("Copy failed", {
          description: "There was an error copying your configuration.",
        });
      }
    }
  };

  const handleExportConfig = () => {
    const configString = JSON.stringify(params, null, 2);
    return configString;
  };

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
                  onClick={() => gen(config.key)}
                  className="w-full"
                >
                  {config.label}
                </Button>
              ))}

              <div className="space-y-2 pt-4">
                <Button className="w-full" variant="outline" onClick={mut}>
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
              <ToggleGroup
                type="single"
                value={params.wave_type.toString()}
                onValueChange={(value) => updateParam("wave_type", +value)}
                className="gap-4"
              >
                <ToggleGroupItem
                  className="flex-1"
                  value={waveforms.SQUARE.toString()}
                >
                  Square
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="flex-1"
                  value={waveforms.SAWTOOTH.toString()}
                >
                  Sawtooth
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="flex-1"
                  value={waveforms.SINE.toString()}
                >
                  Sine
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="flex-1 relative"
                  value={waveforms.TRIANGLE.toString()}
                >
                  Triangle
                  <Badge
                    className="absolute -top-2 -right-2 px-1 py-0.5 text-[10px] bg-primary text-primary-foreground"
                    variant="secondary"
                  >
                    NEW
                  </Badge>
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="flex-1"
                  value={waveforms.NOISE.toString()}
                >
                  Noise
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ParamSection
                title="Envelope"
                uiParamsPrefix="p_env"
                params={params}
                updateParam={updateParam}
              />
              <ParamSection
                title="Frequency"
                uiParamsPrefix="p_freq"
                params={params}
                updateParam={updateParam}
              />
              <ParamSection
                title="Vibrato"
                uiParamsPrefix="p_vib"
                params={params}
                updateParam={updateParam}
              />
              <ParamSection
                title="Arpeggiation"
                uiParamsPrefix="p_arp"
                params={params}
                updateParam={updateParam}
              />
              <ParamSection
                title="Duty"
                uiParamsPrefix="p_duty"
                params={params}
                updateParam={updateParam}
              />
              <ParamSection
                title="Retrigger"
                uiParamsPrefix="p_repeat"
                params={params}
                updateParam={updateParam}
              />
              <ParamSection
                title="Flanger"
                uiParamsPrefix="p_pha"
                params={params}
                updateParam={updateParam}
              />
              <ParamSection
                title="Low-Pass Filter"
                uiParamsPrefix="p_lpf"
                params={params}
                updateParam={updateParam}
              />
              <ParamSection
                title="High-Pass Filter"
                uiParamsPrefix="p_hpf"
                params={params}
                updateParam={updateParam}
              />
            </div>
          </div>

          {/* Export Section */}
          <div className="space-y-6 bg-card text-card-foreground p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Sound</h2>

            {/* <Button variant="default" className="w-full">
            Play
          </Button> */}
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

          {/* Serialize/Deserialize Section */}
          {/* <div className="flex flex-col gap-2">
          <h2 className="font-bold text-lg">Share</h2>
          <div>
            <Button>
              <a
                className="flex items-center gap-2"
                id="share"
                href={"#" + b58}
              >
                <Link /> Copy permalink
              </a>
            </Button>
          </div>
          <div>
            <Button onClick={copy}>Copy code</Button>
          </div>
          <Button
            onClick={() => {
             
            }}
          >
            ▼ Export config
          </Button>
          <Button
            onClick={() => {
            }}
          >
            ▲ Import config
          </Button>
          <Button
            onClick={() => {
            }}
          >
            Download config
          </Button>
        </div> */}
        </div>
        <div className="mt-6 bg-card text-card-foreground p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Share and Configuration
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleShare} className="flex items-center">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Download className="mr-2 h-4 w-4" /> Export Config
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background text-foreground">
                <DialogHeader>
                  <DialogTitle>Export Configuration</DialogTitle>
                </DialogHeader>
                <Textarea
                  value={handleExportConfig()}
                  readOnly
                  className="min-h-[200px] bg-muted text-foreground"
                />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" /> Import Config
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background text-foreground">
                <DialogHeader>
                  <DialogTitle>Import Configuration</DialogTitle>
                </DialogHeader>
                <Textarea
                  placeholder="Paste your configuration JSON here"
                  className="min-h-[200px] bg-muted text-foreground"
                  onChange={(e) => handleImportConfig(e.target.value)}
                />
              </DialogContent>
            </Dialog>
            <Button onClick={handleCopyPermalink} className="flex items-center">
              <Link className="mr-2 h-4 w-4" /> Copy Permalink
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
