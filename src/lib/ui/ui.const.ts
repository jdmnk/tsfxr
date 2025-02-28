import { Params } from "@/lib/sfxr/sfxr";

type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type NumericParamsKeys = NumericKeys<Params>;

export const UI_PARAMS_MAP: Partial<Record<NumericParamsKeys, string>> = {
  p_env_attack: "Attack Time",
  p_env_sustain: "Sustain Time",
  p_env_punch: "Sustain Punch",
  p_env_decay: "Decay Time",

  p_base_freq: "Start Frequency",
  p_freq_limit: "Min Frequency Cutoff",
  p_freq_ramp: "Slide",
  p_freq_dramp: "Delta Slide",

  p_vib_strength: "Vibrato Strength",
  p_vib_speed: "Vibrato Speed",

  p_arp_mod: "Arpeggio Multiplier",
  p_arp_speed: "Arpeggio Speed",

  p_duty: "Duty Cycle",
  p_duty_ramp: "Duty Cycle Sweep",

  p_repeat_speed: "Retrigger Rate",

  p_pha_offset: "Flanger Offset",
  p_pha_ramp: "Flanger Sweep",

  p_lpf_freq: "Low-Pass Cutoff Frequency",
  p_lpf_ramp: "Low-Pass Cutoff Sweep",
  p_lpf_resonance: "Low-Pass Resonance",

  p_hpf_freq: "High-Pass Cutoff Frequency",
  p_hpf_ramp: "High-Pass Cutoff Sweep",
} as const;

export const UI_PARAMS_GROUPS_DESC = {
  envelope:
    "Controls the shape of the sound over time, including attack, sustain, and decay.",
  frequency:
    "Defines the starting frequency and modulation of pitch over time.",
  vibrato: "Applies periodic modulation to the frequency for a vibrato effect.",
  arpeggio:
    "Modifies the frequency in discrete steps to create an arpeggiated effect.",
  dutyCycle:
    "Controls the duty cycle of the waveform, affecting timbre and harmonics.",
  retrigger: "Defines how often the sound retriggers automatically.",
  flanger:
    "Applies a flanger effect by delaying and modulating a copy of the sound.",
  lowPassFilter:
    "Filters out high frequencies and controls how they evolve over time.",
  highPassFilter:
    "Filters out low frequencies and controls how they evolve over time.",
} as const;

export type UiParamsMapKey = keyof typeof UI_PARAMS_MAP;

export const UI_GENERATOR_CONFIG = [
  { key: "random", label: "Random" },
  { key: "pickupCoin", label: "Pickup/Coin" },
  { key: "laserShoot", label: "Laser/Shoot" },
  { key: "explosion", label: "Explosion" },
  { key: "powerUp", label: "Power-up" },
  { key: "hitHurt", label: "Hit/Hurt" },
  { key: "jump", label: "Jump" },
  { key: "click", label: "Click" },
  { key: "blipSelect", label: "Blip/Select" },
  { key: "synth", label: "Synth" },
  { key: "tone", label: "Tone" },
] as const;
