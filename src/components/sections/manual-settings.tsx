import { Params, waveforms } from "@/lib/sfxr/sfxr";
import { ParamsGroup } from "../params-group";
import { UpdateParamFn } from "@/types";
import { UI_PARAMS_GROUPS_DESC } from "@/lib/ui/ui.const";

export function ManualSettings({
  params,
  updateParam,
}: {
  params: Params;
  updateParam: UpdateParamFn;
}) {
  return (
    <>
      <ParamsGroup
        title="Envelope"
        tooltip={UI_PARAMS_GROUPS_DESC.envelope}
        uiParams={[
          "p_env_attack",
          "p_env_sustain",
          "p_env_punch",
          "p_env_decay",
        ]}
        params={params}
        updateParam={updateParam}
      />
      <ParamsGroup
        title="Frequency"
        tooltip={UI_PARAMS_GROUPS_DESC.frequency}
        uiParams={[
          "p_base_freq",
          "p_freq_limit",
          "p_freq_ramp",
          "p_freq_dramp",
        ]}
        params={params}
        updateParam={updateParam}
      />
      <ParamsGroup
        title="Low-Pass Filter"
        tooltip={UI_PARAMS_GROUPS_DESC.lowPassFilter}
        uiParams={["p_lpf_freq", "p_lpf_ramp", "p_lpf_resonance"]}
        params={params}
        updateParam={updateParam}
      />
      <ParamsGroup
        title="High-Pass Filter"
        tooltip={UI_PARAMS_GROUPS_DESC.highPassFilter}
        uiParams={["p_hpf_freq", "p_hpf_ramp"]}
        params={params}
        updateParam={updateParam}
      />
      <ParamsGroup
        title="Vibrato"
        tooltip={UI_PARAMS_GROUPS_DESC.vibrato}
        uiParams={["p_vib_strength", "p_vib_speed"]}
        params={params}
        updateParam={updateParam}
      />
      <ParamsGroup
        title="Arpeggiation"
        tooltip={UI_PARAMS_GROUPS_DESC.arpeggio}
        uiParams={["p_arp_mod", "p_arp_speed"]}
        params={params}
        updateParam={updateParam}
      />
      <ParamsGroup
        title="Duty"
        tooltip={UI_PARAMS_GROUPS_DESC.dutyCycle}
        uiParams={["p_duty", "p_duty_ramp"]}
        params={params}
        updateParam={updateParam}
        disabled={
          params.wave_type !== waveforms.SQUARE &&
          params.wave_type !== waveforms.SAWTOOTH
        }
      />
      <ParamsGroup
        title="Flanger"
        tooltip={UI_PARAMS_GROUPS_DESC.flanger}
        uiParams={["p_pha_offset", "p_pha_ramp"]}
        params={params}
        updateParam={updateParam}
      />
      <ParamsGroup
        title="Retrigger"
        tooltip={UI_PARAMS_GROUPS_DESC.retrigger}
        uiParams={["p_repeat_speed"]}
        params={params}
        updateParam={updateParam}
      />
    </>
  );
}
