"use client";

import React, { useState, useEffect } from "react";
import { Params, SoundEffect } from "@/lib/sfxr/sfxr";

// Assume external libraries (riffwave.js, sfxr.js) are loaded globally,
// so that the globals Params and SoundEffect exist.
const SOUND_VOL = 0.25;
const SAMPLE_RATE = 44100;
const SAMPLE_SIZE = 8;

export function SoundGenerator() {
  // Keep params and sound in state.
  const [params, setParams] = useState<any>(new Params());
  const [sound, setSound] = useState<any>(null);
  const [b58, setB58] = useState<string>("");
  // For stats display.
  const [fileSize, setFileSize] = useState<string>("");
  const [numSamples, setNumSamples] = useState<string>("");
  const [clipping, setClipping] = useState<string>("");

  // Update UI state based on params.
  const updateUi = (p: any) => {
    // In a React app the UI is automatically synced to state.
    // If any additional processing is needed (for example slider conversion), do it here.
    // (Left empty as original conversion functions are not ported.)
  };

  // Play sound and update stats.
  const play = (p: any, noregen?: boolean) => {
    if (!noregen) {
      const newB58 = p.toB58();
      setB58(newB58);
      // Optionally update location.hash if desired.
      const newSound = new SoundEffect(p).generate();
      setSound(newSound);
      setFileSize(Math.round(newSound.wav.length / 1024) + "kB");
      setNumSamples(
        (
          newSound.header.subChunk2Size /
          (newSound.header.bitsPerSample >> 3)
        ).toString()
      );
      setClipping(newSound.clipping);
    }
    // Play audio.
    sound?.getAudio().play();
  };

  // Generate a new sound.
  const gen = (fx: string) => {
    const newParams = new Params();
    newParams.sound_vol = SOUND_VOL;
    newParams.sample_rate = SAMPLE_RATE;
    newParams.sample_size = SAMPLE_SIZE;
    if (fx.startsWith("#")) {
      newParams.fromB58(fx.slice(1));
      // Download name becomes "random.wav"
    } else {
      // @ts-ignore
      if (typeof newParams[fx] === "function") {
        // @ts-ignore
        newParams[fx]();
      }
      // Download name becomes fx+".wav"
    }
    setParams(newParams);
    updateUi(newParams);
    play(newParams);
  };

  // Mutate current parameters.
  const mut = () => {
    params.mutate();
    setParams({ ...params });
    updateUi(params);
    play(params);
  };

  // Copy b58 code to clipboard.
  const copy = () => {
    navigator.clipboard.writeText(b58);
  };

  // On mount, generate a default sound.
  useEffect(() => {
    const hash = window.location.hash.substring(1) || "pickupCoin";
    gen(hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ textAlign: "center", maxWidth: "800px", margin: "auto" }}>
      <h1>jsfxr</h1>

      {/* Generator Section */}
      <div id="generators">
        <h2>Generator</h2>
        <button onClick={() => gen("random")}>Random</button>
        <br />
        <br />
        <button onClick={() => gen("pickupCoin")}>Pickup/coin</button>
        <br />
        <button onClick={() => gen("laserShoot")}>Laser/shoot</button>
        <br />
        <button onClick={() => gen("explosion")}>Explosion</button>
        <br />
        <button onClick={() => gen("powerUp")}>Powerup</button>
        <br />
        <button onClick={() => gen("hitHurt")}>Hit/hurt</button>
        <br />
        <button onClick={() => gen("jump")}>Jump</button>
        <br />
        <button onClick={() => gen("click")}>Click</button>
        <br />
        <button onClick={() => gen("blipSelect")}>Blip/select</button>
        <br />
        <button onClick={() => gen("synth")}>Synth</button>
        <br />
        <button onClick={() => gen("tone")}>Tone</button>
        <br />
        <br />
        <button onClick={mut}>Mutate</button>
        <br />
        <p>
          <button onClick={() => play(params, true)}>Play</button>
          <br />
        </p>
        <input id="copybuffer" value={b58} readOnly />
      </div>

      {/* Manual Settings Section */}
      <div className="demo">
        <h2>Manual Settings</h2>
        <form>
          <div id="shape">
            <input
              type="radio"
              id="square"
              name="shape"
              value="0"
              checked={params.wave_type === 0}
              onChange={() => {
                params.wave_type = 0;
                updateUi(params);
                play(params);
                setParams({ ...params });
              }}
            />
            <label htmlFor="square">Square</label>
            <input
              type="radio"
              id="sawtooth"
              name="shape"
              value="1"
              checked={params.wave_type === 1}
              onChange={() => {
                params.wave_type = 1;
                updateUi(params);
                play(params);
                setParams({ ...params });
              }}
            />
            <label htmlFor="sawtooth">Sawtooth</label>
            <input
              type="radio"
              id="sine"
              name="shape"
              value="2"
              checked={params.wave_type === 2}
              onChange={() => {
                params.wave_type = 2;
                updateUi(params);
                play(params);
                setParams({ ...params });
              }}
            />
            <label htmlFor="sine">Sine</label>
            <input
              type="radio"
              id="noise"
              name="shape"
              value="3"
              checked={params.wave_type === 3}
              onChange={() => {
                params.wave_type = 3;
                updateUi(params);
                play(params);
                setParams({ ...params });
              }}
            />
            <label htmlFor="noise">Noise</label>
          </div>
        </form>
        <br />

        {/* Example slider: Attack time */}
        <table style={{ margin: "auto" }}>
          <tbody>
            <tr>
              <th colSpan={2}>Envelope</th>
            </tr>
            <tr>
              <td>
                <input
                  type="range"
                  id="p_env_attack"
                  min={0}
                  max={1000}
                  value={params.env_attack ? params.env_attack * 1000 : 0}
                  onChange={(e) => {
                    params.env_attack = parseFloat(e.target.value) / 1000;
                    setParams({ ...params });
                    play(params);
                  }}
                />
              </td>
              <th>Attack time</th>
            </tr>
            <tr>
              <td>
                <input
                  type="range"
                  id="p_env_sustain"
                  min={0}
                  max={1000}
                  value={params.env_sustain ? params.env_sustain * 1000 : 0}
                  onChange={(e) => {
                    params.env_sustain = parseFloat(e.target.value) / 1000;
                    setParams({ ...params });
                    play(params);
                  }}
                />
              </td>
              <th>Sustain time</th>
            </tr>
            {/* Additional sliders would follow a similar pattern. */}
            {/* For any complex conversion (e.g. using custom convert functions), leave a comment */}
          </tbody>
        </table>
      </div>

      {/* Export Section */}
      <div id="export">
        <h2>Sound</h2>
        <button onClick={() => play(params, true)}>Play</button>
        <br />
        <div id="soundexport">
          Download:
          <br />
          <a id="wav" href={sound?.dataURI || "#"} download={b58 + ".wav"}>
            sfx.wav
          </a>
          <br />
          <table id="stats" style={{ margin: "auto" }}>
            <tbody>
              <tr>
                <th>File size:</th>
                <td>{fileSize}</td>
              </tr>
              <tr>
                <th>Samples:</th>
                <td>{numSamples}</td>
              </tr>
              <tr>
                <th>Clipped:</th>
                <td>{clipping}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <form>
          Gain <label htmlFor="sound_vol"></label>
          <br />
          <input
            type="range"
            id="sound_vol"
            min={0}
            max={1000}
            value={params.sound_vol ? params.sound_vol * 1000 : 0}
            onChange={(e) => {
              params.sound_vol = parseFloat(e.target.value) / 1000;
              setParams({ ...params });
              play(params);
            }}
          />
          <br />
          <br />
          Sample Rate (Hz)
          <br />
          <div id="hz">
            <input
              type="radio"
              id="44100"
              name="hz"
              value="44100"
              checked={params.sample_rate === 44100}
              onChange={() => {
                params.sample_rate = 44100;
                setParams({ ...params });
                play(params);
              }}
            />
            <label htmlFor="44100">44k</label>
            <input
              type="radio"
              id="22050"
              name="hz"
              value="22050"
              checked={params.sample_rate === 22050}
              onChange={() => {
                params.sample_rate = 22050;
                setParams({ ...params });
                play(params);
              }}
            />
            <label htmlFor="22050">22k</label>
            <input
              type="radio"
              id="11025"
              name="hz"
              value="11025"
              checked={params.sample_rate === 11025}
              onChange={() => {
                params.sample_rate = 11025;
                setParams({ ...params });
                play(params);
              }}
            />
            <label htmlFor="11025">11k</label>
            <input
              type="radio"
              id="5512"
              name="hz"
              value="5512"
              checked={params.sample_rate === 5512}
              onChange={() => {
                params.sample_rate = 5512;
                setParams({ ...params });
                play(params);
              }}
            />
            <label htmlFor="5512">6k</label>
          </div>
          <br />
          <br />
          Sample size
          <br />
          <div id="bits">
            <input
              type="radio"
              id="16"
              name="bits"
              value="16"
              checked={params.sample_size === 16}
              onChange={() => {
                params.sample_size = 16;
                setParams({ ...params });
                play(params);
              }}
            />
            <label htmlFor="16">16 bit</label>
            <input
              type="radio"
              id="8"
              name="bits"
              value="8"
              checked={params.sample_size === 8}
              onChange={() => {
                params.sample_size = 8;
                setParams({ ...params });
                play(params);
              }}
            />
            <label htmlFor="8">8 bit</label>
          </div>
        </form>
        <p>
          <a id="share" href={"#" + b58}>
            🔗 permalink
          </a>
        </p>
        <p>
          <button onClick={copy}>Copy code</button>
        </p>
      </div>

      {/* Serialize/Deserialize Section */}
      <div id="data">
        <button
          onClick={() => {
            // Serialization UI not fully implemented.
            // e.g. Show a textarea with JSON.stringify(params, null, 2)
          }}
        >
          ▼ Serialize
        </button>
        <button
          onClick={() => {
            // Deserialization UI not implemented.
          }}
        >
          ▲ Deserialize
        </button>
      </div>

      {/* About jsfxr Section */}
      <div id="links">
        <h1>about jsfxr</h1>
        <p>
          Jsfxr is an online 8 bit sound maker and sfx generator. All you need
          to make retro sound effects with jsfxr is a web browser. It's a
          JavaScript port of the original{" "}
          <a href="http://www.drpetter.se/project_sfxr.html">sfxr</a> by
          DrPetter. You can also use it as a{" "}
          <a href="https://github.com/chr15m/jsfxr#use">JavaScript library</a>{" "}
          for playing and rendering sfxr sound effects in your games.
        </p>
        <br />
        (Port of <a href="http://www.drpetter.se/project_sfxr.html">sfxr</a> by
        DrPetter)
        <br />
        <a href="UNLICENSE">¢</a> 2011
        <a href="http://fredricksen.net/">Eric Fredricksen</a>
        <br />
        With <a href="https://github.com/chr15m/jsfxr">contributions</a> from
        Chris McCormick
        <br />
        <br />
        <a href="https://github.com/chr15m/jsfxr" id="source">
          (Source code)
        </a>
        <br />
        <p>
          <a href="https://github.com/chr15m/jsfxr#use">
            See the documentation for using these sounds in your JavaScript game
          </a>
        </p>
        <p>
          Tip: use the <code>sfxr-to-wav</code> nodejs script to convert to a
          wave file on the command line.
        </p>
      </div>
    </div>
  );
}
