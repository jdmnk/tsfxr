import { RIFFWAVE } from "@/lib/sfxr/riffwave";

// Define common parameter types
type SynthDef = Record<string, number | string>;
type AudioContext = typeof window.AudioContext;
type WaveType = 0 | 1 | 2 | 3 | 4; // SQUARE | SAWTOOTH | SINE | NOISE | TRIANGLE

interface GenerateOptions {
  sound_vol?: number;
  sample_rate?: number;
  sample_size?: number;
}

// Main sfxr namespace
export namespace sfxr {
  function toBuffer(synthdef: SynthDef): number[];
  function toWebAudio(
    synthdef: SynthDef,
    audiocontext: AudioContext
  ): AudioBufferSourceNode;
  function toWave(synthdef: SynthDef): RIFFWave;
  function toAudio(synthdef: SynthDef): AudioElement;
  function play(synthdef: SynthDef): AudioElement;
  function b58decode(b58encoded: string): Record<string, number>;
  function b58encode(synthdef: SynthDef): string;
  function generate(algorithm: string, options?: GenerateOptions): Params;
}

// Define the Params class with proper types
export class Params {
  oldParams: boolean;
  wave_type: WaveType;
  p_env_attack: number;
  p_env_sustain: number;
  p_env_punch: number;
  p_env_decay: number;
  p_base_freq: number;
  p_freq_limit: number;
  p_freq_ramp: number;
  p_freq_dramp: number;
  p_vib_strength: number;
  p_vib_speed: number;
  p_arp_mod: number;
  p_arp_speed: number;
  p_duty: number;
  p_duty_ramp: number;
  p_repeat_speed: number;
  p_pha_offset: number;
  p_pha_ramp: number;
  p_lpf_freq: number;
  p_lpf_ramp: number;
  p_lpf_resonance: number;
  p_hpf_freq: number;
  p_hpf_ramp: number;
  sound_vol: number;
  sample_rate: number;
  sample_size: number;

  constructor();
  toB58(): string;
  fromB58(b58encoded: string): this;
  fromJSON(struct: Partial<Params>): this;
  pickupCoin(): this;
  laserShoot(): this;
  explosion(): this;
  powerUp(): this;
  hitHurt(): this;
  jump(): this;
  blipSelect(): this;
  synth(): this;
  tone(): this;
  click(): this;
  random(): this;
  mutate(): this;
  clone(): Params;
}

// Define the SoundEffect class with proper types
export class SoundEffect {
  constructor(ps: string | Params);

  parameters: Params;
  waveShape: WaveType;
  fltw: number;
  enableLowPassFilter: boolean;
  fltw_d: number;
  fltdmp: number;
  flthp: number;
  flthp_d: number;
  vibratoSpeed: number;
  vibratoAmplitude: number;
  envelopeLength: [number, number, number];
  envelopePunch: number;
  flangerOffset: number;
  flangerOffsetSlide: number;
  repeatTime: number;
  gain: number;
  sampleRate: number;
  bitsPerChannel: number;
  elapsedSinceRepeat: number;
  period: number;
  periodMax: number;
  enableFrequencyCutoff: boolean;
  periodMult: number;
  periodMultSlide: number;
  dutyCycle: number;
  dutyCycleSlide: number;
  arpeggioMultiplier: number;
  arpeggioTime: number;

  init(ps: Params): void;
  initForRepeat(): void;
  getRawBuffer(): {
    buffer: number[];
    normalized: number[];
    clipped: number;
  };
  generate(): RIFFWave;
}

// Define converter function types with proper number parameters
interface ConverterFunction {
  (v: number): number;
}

interface StringConverterFunction {
  (v: number): string;
}

// Export constants and namespaces
export const SQUARE = 0;
export const SAWTOOTH = 1;
export const SINE = 2;
export const NOISE = 3;
export const TRIANGLE = 4;

export const convert: {
  sliders: Record<string, ConverterFunction>;
  domain: Record<string, ConverterFunction>;
  sliders_inverse: Record<string, ConverterFunction>;
  domain_inverse: Record<string, ConverterFunction>;
  units: Record<string, StringConverterFunction>;
};

export const parameters: {
  order: string[];
  signed: string[];
};

export const waveforms: {
  SQUARE: 0;
  SAWTOOTH: 1;
  SINE: 2;
  NOISE: 3;
  TRIANGLE: 4;
};

// Define RIFFWave interface (you may want to put this in a separate file)
interface RIFFWave extends RIFFWAVE {
  Make(buffer: number[]): void;
  clipping: number;
  buffer: number[];
  dataURI: string;
  getAudio(): AudioElement;
}

// Define AudioElement interface (browser audio element)
interface AudioElement extends HTMLAudioElement {
  setVolume(v: number): AudioElement;
  play(): AudioElement;
  analyser: AnalyserNode;
}
