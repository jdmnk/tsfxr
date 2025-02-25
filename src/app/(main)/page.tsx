"use client";

import React, { useState, useEffect, useMemo, useCallback, use } from "react";
import { Params, SoundEffect } from "@/lib/sfxr/sfxr";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { ParamSection } from "@/components/param-section";
import { ParamToggleGroup } from "@/components/param-toggle-group";
import { Slider } from "@/components/ui/slider";
import { Oscilloscope } from "@/components/oscilloscope";

export default function Home() {
  // State for the current sound parameters.
  const [params, setParams] = useState<Params>(new Params());
  // File name cannot be directly derived from params, so we use a separate state.
  const [fileName, setFileName] = useState<string>("sfx.wav");

  // Derived values.
  const b58 = useMemo(() => params.toB58(), [params]);
  const sound = useMemo(() => new SoundEffect(params).generate(), [params]);
  const audio = useMemo(() => sound.getAudio(), [sound]);

  // TODO: This is a bit fucked up, maybe a separate state for analyser? idk
  const analyser = useMemo(() => audio.analyser, [sound]);

  console.log(audio);
  console.log(analyser);

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

  const play = useCallback(() => {
    audio.play();
  }, [sound]);

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
  const copy = () => {
    navigator.clipboard.writeText(b58);
  };

  // On mount, generate a default sound.
  useEffect(() => {
    const hash = window.location.hash || "pickupCoin";

    gen(hash, false); // False = Don't play on mount
  }, []);

  return (
    <main className="flex flex-wrap m-3 md:m-4 lg:m-8 justify-center gap-4">
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
          <Button variant="outline" onClick={() => play()}>
            Play
          </Button>
        </div>
      </div>

      {/* Manual Settings Section */}
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-lg">Manual Settings</h2>

        <div className="flex">
          <ParamToggleGroup
            options={["0", "1", "2", "3"]}
            labels={["Square", "Sawtooth", "Sine", "Noise"]}
            onChange={(value) => {
              updateParam("wave_type", +value);
            }}
            value={params.wave_type.toString()}
          />
        </div>

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

      {/* Export Section */}
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-lg">Sound</h2>

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

          {analyser && <Oscilloscope analyser={analyser} />}

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
    </main>
  );
}
