import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export function ParamToggleGroup({
  value,
  options,
  labels,
  onChange,
}: {
  value: string;
  options: string[];
  labels: string[];
  onChange: (value: string) => void;
}) {
  return (
    <ToggleGroup value={value} onValueChange={onChange}>
      {options.map((option, index) => (
        <ToggleGroupItem key={option} value={option} className="flex-1">
          {labels[index]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
