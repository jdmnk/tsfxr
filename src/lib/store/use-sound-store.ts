import { create } from "zustand";
import { Params, SoundEffect } from "@/lib/sfxr/sfxr";

type SoundStore = {
  // Core sound parameters
  params: Params | null;

  // Global settings that affect sound generation
  soundVol: number;
  sampleRate: number;
  sampleSize: number;

  // Generated audio state
  sound: SoundEffect | null;
  audio: any;
  analyser: AnalyserNode | null;
  b58: string | null;

  // UI state
  fileName: string;

  // Actions
  setParams: (newParams: Params) => void;
  updateGlobalSetting: <K extends "soundVol" | "sampleRate" | "sampleSize">(
    key: K,
    value: number
  ) => void;
  updateParam: <K extends keyof Params>(key: K, value: Params[K]) => void;
  generateSoundFromPreset: (fx: string) => void;
  mutateParams: (params: Params) => void;
  play: () => void;
};

export const useSoundStore = create<SoundStore>((set, get) => {
  // Helper function to generate sound from parameters
  const generateSound = (params: Params) => {
    const clonedParams = params.clone();
    clonedParams.sound_vol = get().soundVol;
    clonedParams.sample_rate = get().sampleRate;
    clonedParams.sample_size = get().sampleSize;

    const sound = new SoundEffect(clonedParams).generate();
    const audio = sound.getAudio();
    const b58 = clonedParams.toB58();

    return { sound, audio, analyser: audio.analyser, b58 };
  };

  return {
    // Initial state (null values due to SSR constraints)
    params: null,
    soundVol: 0,
    sampleRate: 0,
    sampleSize: 0,
    sound: null,
    audio: null,
    analyser: null,
    b58: null,
    fileName: "sfx.wav",

    // Core parameter updates
    setParams: (newParams) => {
      const { sound, audio, analyser, b58 } = generateSound(newParams);
      set({ params: newParams, sound, audio, analyser, b58 });
    },

    // Global settings updates
    updateGlobalSetting: (key, value) => {
      set({ [key]: value });
      const { params } = get();
      if (params) get().setParams(params);
    },

    // Update a single parameter
    updateParam: <K extends keyof Params>(key: K, value: Params[K]) => {
      const { params } = get();
      if (!params) return;

      const newParams = params.clone();
      newParams[key] = value;
      get().setParams(newParams);
    },

    // Mutate (slightly randomize) the parameters
    mutateParams: (params) => {
      const newParams = params.clone();
      newParams.mutate();
      get().setParams(newParams);
    },

    generateSoundFromPreset: (fx) => {
      const newParams = new Params();
      let fileName = "preset.wav";

      if (fx.startsWith("#")) {
        const b58 = fx.slice(1);
        // Note: global parameters are not included in the b58 string
        newParams.fromB58(b58);
      } else {
        // @ts-ignore
        if (typeof newParams[fx] === "function") {
          // @ts-ignore
          newParams[fx]();
          fileName = `${fx}.wav`;
        }
      }

      set({ fileName });
      get().setParams(newParams);
    },

    play: () => {
      const { audio } = get();
      if (!audio) return;
      audio.play();
    },
  };
});
