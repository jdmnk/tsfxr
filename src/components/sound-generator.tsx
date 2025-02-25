"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Params, SoundEffect, convert, parameters } from "@/lib/sfxr/sfxr";
import { Button } from "./ui/button";
import { useDebouncedCallback } from "use-debounce";
import { ParamToggleGroup } from "./param-toggle-group";
import { Slider } from "./ui/slider";

type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type NumericParamsKeys = NumericKeys<Params>;

const UI_PARAMS: { key: NumericParamsKeys; label: string }[] = [
  { key: "p_env_attack", label: "Attack Time" },
  { key: "p_env_sustain", label: "Sustain Time" },
  { key: "p_env_punch", label: "Sustain Punch" },
  { key: "p_env_decay", label: "Decay Time" },

  { key: "p_base_freq", label: "Start Frequency" },
  { key: "p_freq_limit", label: "Min Frequency Cutoff" },
  { key: "p_freq_ramp", label: "Slide" },
  { key: "p_freq_dramp", label: "Delta Slide" },

  { key: "p_vib_strength", label: "Vibrato Strength" },
  { key: "p_vib_speed", label: "Vibrato Speed" },

  { key: "p_arp_mod", label: "Arpeggio Multiplier" },
  { key: "p_arp_speed", label: "Arpeggio Speed" },

  { key: "p_duty", label: "Duty Cycle" },
  { key: "p_duty_ramp", label: "Duty Cycle Sweep" },

  { key: "p_repeat_speed", label: "Retrigger Rate" },

  { key: "p_pha_offset", label: "Flanger Offset" },
  { key: "p_pha_ramp", label: "Flanger Sweep" },

  { key: "p_lpf_freq", label: "Low-Pass Cutoff Frequency" },
  { key: "p_lpf_ramp", label: "Low-Pass Cutoff Sweep" },
  { key: "p_lpf_resonance", label: "Low-Pass Resonance" },

  { key: "p_hpf_freq", label: "High-Pass Cutoff Frequency" },
  { key: "p_hpf_ramp", label: "High-Pass Cutoff Sweep" },
];

export function SoundGenerator() {
  // State for the current sound parameters.
  const [params, setParams] = useState<Params>(new Params());
  // File name cannot be directly derived from params, so we use a separate state.
  const [fileName, setFileName] = useState<string>("sfx.wav");

  // Derived values.
  const b58 = useMemo(() => params.toB58(), [params]);
  const sound = useMemo(() => new SoundEffect(params).generate(), [params]);
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

  /**
   * Update the sound and stats.
   *
   * The noregen flag acts as a "no regeneration" switch.
   * When set to true, it tells the play function not to generate a new sound, but rather to use the existing one.
   * This allows you to simply play the current sound without recalculating or updating it.
   */
  const play = useCallback(
    (p: Params, noregen?: boolean) => {
      if (!noregen) {
        // Optionally update location.hash if desired.
        const newSound = new SoundEffect(p).generate();
        newSound.getAudio().play();
      } else {
        sound?.getAudio().play();
      }
    },
    [sound]
  );

  // Debounced play to be used for example with sliders.
  const debouncedPlay = useDebouncedCallback(play, 300, { leading: true });

  const updateParam = <K extends keyof Params>(key: K, value: Params[K]) => {
    const newParams = params.clone();
    newParams[key] = value;
    debouncedPlay(newParams);
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
    shouldPlay && play(newParams);
  };

  // Mutate (slightly change) current parameters.
  const mut = () => {
    const newp = params.clone();
    newp.mutate();
    setParams(newp);
    play(newp);
  };

  // Copy b58 code to clipboard.
  const copy = () => {
    navigator.clipboard.writeText(b58);
  };

  // On mount, generate a default sound.
  useEffect(() => {
    const hash = window.location.hash || "pickupCoin";

    gen(hash, false); // False = Don't play on mount
  }, []);

  return (
    <div className="flex gap-4">
      {/* Generator Section */}
      <div className="flex flex-col gap-2 w-32">
        <h2 className="font-bold text-lg">Generator</h2>
        <Button onClick={() => gen("random")}>Random</Button>
        <Button onClick={() => gen("pickupCoin")}>Pickup/coin</Button>
        <Button onClick={() => gen("laserShoot")}>Laser/shoot</Button>
        <Button onClick={() => gen("explosion")}>Explosion</Button>
        <Button onClick={() => gen("powerUp")}>Powerup</Button>
        <Button onClick={() => gen("hitHurt")}>Hit/hurt</Button>
        <Button onClick={() => gen("jump")}>Jump</Button>
        <Button onClick={() => gen("click")}>Click</Button>
        <Button onClick={() => gen("blipSelect")}>Blip/select</Button>
        <Button onClick={() => gen("synth")}>Synth</Button>
        <Button onClick={() => gen("tone")}>Tone</Button>

        <div className="flex flex-col gap-2 mt-4">
          <Button variant="outline" onClick={mut}>
            Mutate
          </Button>
          <Button variant="outline" onClick={() => play(params, true)}>
            Play
          </Button>
        </div>
      </div>

      {/* Manual Settings Section */}
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-lg">Manual Settings</h2>

        <div className="flex gap-2">
          <ParamToggleGroup
            options={["0", "1", "2", "3"]}
            labels={["Square", "Sawtooth", "Sine", "Noise"]}
            onChange={(value) => {
              updateParam("wave_type", +value);
            }}
            value={params.wave_type.toString()}
          />
        </div>

        {/* Detailed parameters section */}
        <div className="flex flex-col gap-2">
          {UI_PARAMS.map((param) => {
            const paramName = param.key;
            const paramLabel = param.label;

            const signed = parameters.signed.includes(paramName);
            const min = signed ? -1 : 0;
            const max = 1;
            const value = params[paramName] ? params[paramName] : 0;

            // @ts-ignore
            const convertFn = convert.sliders[paramName];
            // @ts-ignore
            const unitsFn = convert.units[paramName];

            return (
              <div
                key={paramName}
                className="grid grid-cols-[auto_250px] gap-4"
              >
                <Slider
                  min={min}
                  max={max}
                  step={0.001}
                  value={[value]}
                  onValueChange={(e) => {
                    updateParam(paramName, e[0]);
                  }}
                  className="w-32"
                />
                <div className="">
                  <span className="text-sm font-semibold">
                    {paramLabel}:&nbsp;
                  </span>
                  <span className="text-xs">{unitsFn(convertFn(value))}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Section */}
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-lg">Sound</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="w-32"
            onClick={() => play(params, true)}
          >
            Play
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <span className="text-sm">Sample Rate (Hz)</span>
            <div className="flex gap-2">
              <ParamToggleGroup
                options={["44100", "22050", "11025", "5512"]}
                labels={["44k", "22k", "11k", "6k"]}
                onChange={(value) => {
                  updateParam("sample_rate", +value);
                }}
                value={params.sample_rate.toString()}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm">Sample size</span>
            <div className="flex gap-2">
              <ParamToggleGroup
                options={["16", "8"]}
                labels={["16 bit", "8 bit"]}
                onChange={(value) => {
                  updateParam("sample_size", +value);
                }}
                value={params.sample_size.toString()}
              ></ParamToggleGroup>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="text-sm">Gain</span>
            <Slider
              min={0}
              max={1}
              step={0.001}
              value={[params.sound_vol ? params.sound_vol : 0]}
              onValueChange={(e) => {
                updateParam("sound_vol", e[0]);
              }}
            />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <div>
              <span className="pr-1">Download:</span>
              <a id="wav" href={sound?.dataURI || "#"} download={fileName}>
                {fileName}
              </a>
            </div>
            <div>
              <div>File size: {fileSize}</div>
              <div>Samples: {numSamples}</div>
              <div>Clipped:{clipping}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Serialize/Deserialize Section */}
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-lg">Share</h2>
        <div>
          <a id="share" href={"#" + b58}>
            🔗 permalink
          </a>
        </div>
        <div>
          <Button onClick={copy}>Copy code</Button>
        </div>
        <Button
          onClick={() => {
            // Serialization UI not fully implemented.
            // e.g. Show a textarea with JSON.stringify(params, null, 2)
          }}
        >
          ▼ Serialize
        </Button>
        <Button
          onClick={() => {
            // Deserialization UI not implemented.
          }}
        >
          ▲ Deserialize
        </Button>
      </div>
    </div>
  );
}
