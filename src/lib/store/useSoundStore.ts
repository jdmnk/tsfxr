import { create } from "zustand";
import { Params, SoundEffect } from "@/lib/sfxr/sfxr";

type SoundStore = {
  params: Params;
  soundVol: number;
  sampleRate: number;
  sampleSize: number;

  sound: SoundEffect;
  audio: any;
  analyser: AnalyserNode;
  fileName: string;

  setParams: (newParams: Params) => void;
  setSoundVol: (soundVol: number) => void;
  setSampleRate: (sampleRate: number) => void;
  setSampleSize: (sampleSize: number) => void;
  generateSound: () => void;
  play: () => void;
  updateParam: <K extends keyof Params>(key: K, value: Params[K]) => void;
  generateSoundFromPreset: (fx: string) => void;
  mutateParams: (params: Params) => void;
};

// Ensure sound is generated on store creation to avoid null issues
const initialParams = new Params();
const initialSound = new SoundEffect(new Params()).generate();
const initialAudio = initialSound.getAudio();

export const useSoundStore = create<SoundStore>((set, get) => ({
  params: new Params(),

  // These params are set globally for all sounds
  soundVol: initialParams.sound_vol,
  sampleRate: initialParams.sample_rate,
  sampleSize: initialParams.sample_size,
  // End global params

  sound: initialSound,
  audio: initialAudio,
  analyser: initialAudio.analyser,
  fileName: "sfx.wav",

  setParams: (newParams) => {
    set({ params: newParams });
  },

  setSoundVol: (soundVol: number) => {
    set({ soundVol });
  },

  setSampleRate: (sampleRate: number) => {
    set({ sampleRate });
  },

  setSampleSize: (sampleSize: number) => {
    set({ sampleSize });
  },

  generateSound: () => {
    const params = get().params.clone();
    params.sound_vol = get().soundVol;
    params.sample_rate = get().sampleRate;
    params.sample_size = get().sampleSize;
    const sound = new SoundEffect(params).generate();
    const audio = sound.getAudio();

    set({
      sound,
      audio,
      analyser: audio.analyser,
    });
  },

  generateSoundFromPreset: (fx: string) => {
    const newParams = new Params();
    let fileName = "preset.wav";

    if (fx.startsWith("#")) {
      newParams.fromB58(fx.slice(1));
    } else {
      // @ts-ignore
      if (typeof newParams[fx] === "function") {
        // @ts-ignore
        newParams[fx]();
        fileName = `${fx}.wav`;
      }
    }
    set({ params: newParams, fileName });
  },

  // Mutate (slightly change) current parameters.
  mutateParams: (params: Params) => {
    const newParams = params.clone();
    newParams.mutate();
    set({ params: newParams });
  },

  updateParam<K extends keyof Params>(key: K, value: Params[K]) {
    const newParams = get().params.clone();
    newParams[key] = value;
    set({ params: newParams });
  },

  play: () => {
    get().generateSound();
    get().audio?.play();
  },
}));
