import { Params, waveforms } from "@/lib/sfxr/sfxr";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Badge } from "./ui/badge";
import { UpdateParamFn } from "@/types";

export function WaveTypeToggle({
  params,
  updateParam,
}: {
  params: Params;
  updateParam: UpdateParamFn;
}) {
  return (
    <ToggleGroup
      value={params.wave_type.toString()}
      onValueChange={(value) => updateParam("wave_type", +value)}
      className="gap-4"
    >
      <ToggleGroupItem className="flex-1" value={waveforms.SQUARE.toString()}>
        Square
      </ToggleGroupItem>
      <ToggleGroupItem className="flex-1" value={waveforms.SAWTOOTH.toString()}>
        Sawtooth
      </ToggleGroupItem>
      <ToggleGroupItem className="flex-1" value={waveforms.SINE.toString()}>
        Sine
      </ToggleGroupItem>
      <ToggleGroupItem
        className="flex-1 relative"
        value={waveforms.TRIANGLE.toString()}
      >
        Triangle
        <Badge
          className="absolute -top-2 -right-2 px-1 py-0.5 text-[10px] bg-primary text-primary-foreground"
          variant="secondary"
        >
          NEW
        </Badge>
      </ToggleGroupItem>
      <ToggleGroupItem className="flex-1" value={waveforms.NOISE.toString()}>
        Noise
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
