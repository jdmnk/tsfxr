import { create } from "zustand";
import { Params, SoundEffect } from "@/lib/sfxr/sfxr";

type SoundStore = {
  params: Params;
  sound: SoundEffect;
  audio: any; // Some custom sfxr type (TODO: update types?)
  analyser: AnalyserNode;
  fileName: string;

  setParams: (newParams: Params) => void;
  generateSound: () => void;
  play: () => void;
  updateParam: <K extends keyof Params>(key: K, value: Params[K]) => void;
};

// **Ensure sound is generated on store creation to avoid null issues**
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
      fileName: "generated.wav",
    });
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
