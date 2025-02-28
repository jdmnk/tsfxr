import { create } from "zustand";
import { Params, SoundEffect } from "@/lib/sfxr/sfxr";

type SoundStore = {
  params: Params;
  sound: SoundEffect;
  audio: any;
  analyser: AnalyserNode;
  fileName: string;

  setParams: (newParams: Params) => void;
  generateSound: () => void;
  play: () => void;
  updateParam: <K extends keyof Params>(key: K, value: Params[K]) => void;
  generateSoundFromPreset: (fx: string) => void;
  mutateParams: (params: Params) => void;
};

// Ensure sound is generated on store creation to avoid null issues
const initialSound = new SoundEffect(new Params()).generate();
const initialAudio = initialSound.getAudio();

export const useSoundStore = create<SoundStore>((set, get) => ({
  params: new Params(),
  sound: initialSound,
  audio: initialAudio,
  analyser: initialAudio.analyser,
  fileName: "sfx.wav",

  setParams: (newParams) => {
    set({ params: newParams });
  },

  generateSound: () => {
    const params = get().params;
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
