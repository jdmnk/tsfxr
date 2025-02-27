import { Params } from "@/lib/sfxr/sfxr";

export type UpdateParamFn = <K extends keyof Params>(
  key: K,
  value: Params[K]
) => void;
