import { Params } from "@/lib/sfxr/sfxr";
import { ParamSection } from "./param-section";
import { UpdateParamFn } from "@/types";

export function ManualSettings({
  params,
  updateParam,
}: {
  params: Params;
  updateParam: UpdateParamFn;
}) {
  return (
    <>
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
    </>
  );
}
