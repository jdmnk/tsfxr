import { Params } from "@/lib/sfxr/sfxr";

type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type NumericParamsKeys = NumericKeys<Params>;

export type UiParam = {
  key: NumericParamsKeys;
  label: string;
};

export const UI_PARAMS: UiParam[] = [
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
];
