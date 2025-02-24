import { Slider } from "./ui/slider";

export function ParamSlider(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
}) {
  return (
    <div className="grid grid-cols-[200px_auto_150px] gap-2">
      <label className="text-sm">{props.label}</label>
      <Slider
        min={props.min}
        max={props.max}
        step={props.step || 1}
        value={[props.value]}
        onValueChange={(e) => props.onChange(e[0])}
        className="w-32"
      />
      <span className="pl-2 text-sm">{props.format(props.value)}</span>
    </div>
  );
}
