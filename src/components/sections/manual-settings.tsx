import { Params, waveforms } from "@/lib/sfxr/sfxr";
import { ParamsGroup } from "../params-group";
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
      <ParamsGroup
        title="Envelope"
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
        uiParams={["p_lpf_freq", "p_lpf_ramp", "p_lpf_resonance"]}
        params={params}
        updateParam={updateParam}
      />
      <ParamsGroup
        title="High-Pass Filter"
        uiParams={["p_hpf_freq", "p_hpf_ramp"]}
        params={params}
        updateParam={updateParam}
      />
      <ParamsGroup
        title="Vibrato"
        uiParams={["p_vib_strength", "p_vib_speed"]}
        params={params}
        updateParam={updateParam}
      />
      <ParamsGroup
        title="Arpeggiation"
        uiParams={["p_arp_mod", "p_arp_speed"]}
        params={params}
        updateParam={updateParam}
      />
      <ParamsGroup
        title="Duty"
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
        uiParams={["p_pha_offset", "p_pha_ramp"]}
        params={params}
        updateParam={updateParam}
      />
      <ParamsGroup
        title="Retrigger"
        uiParams={["p_repeat_speed"]}
        params={params}
        updateParam={updateParam}
      />
    </>
  );
}
