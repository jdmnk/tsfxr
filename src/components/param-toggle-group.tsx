import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export function ParamToggleGroup(props: {
  value: string;
  options: string[];
  labels: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="">
      <ToggleGroup
        type="single"
        value={props.value}
        onValueChange={props.onChange}
      >
        {props.options.map((option, index) => (
          <ToggleGroupItem key={option} value={option}>
            {props.labels[index]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
