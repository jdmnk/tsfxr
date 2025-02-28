import { Params, convert, parameters } from "@/lib/sfxr/sfxr";
import { Slider } from "./ui/slider";
import { UI_PARAMS_MAP, UiParamsMapKey } from "@/lib/ui/ui.const";
import { Label } from "./ui/label";
import { UpdateParamFn } from "@/types";

export function ParamsGroup({
  title,
  uiParams,
  params,
  updateParam,
  disabled,
}: {
  title: string;
  uiParams: UiParamsMapKey[];
  params: Params;
  updateParam: UpdateParamFn;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">{title}</Label>
      {uiParams.map((param) => {
        const paramName = param;
        const paramLabel = UI_PARAMS_MAP[param];

        const signed = parameters.signed.includes(paramName);
        const min = signed ? -1 : 0;
        const max = 1;
        const value = params[paramName] ? params[paramName] : 0;

        // @ts-ignore
        const convertFn = convert.sliders[paramName];
        // @ts-ignore
        const unitsFn = convert.units[paramName];

        return (
          <div
            key={paramName}
            className={`space-y-2 ${disabled ? "opacity-50" : ""}`}
          >
            <div className="flex justify-between">
              <Label className="text-sm">{paramLabel}</Label>
              <span className="text-sm text-muted-foreground">
                {unitsFn(convertFn(value))}
              </span>
            </div>
            <Slider
              min={min}
              max={max}
              step={0.001}
              value={[value]}
              onValueChange={(e) => {
                updateParam(paramName, e[0]);
              }}
              className="w-full"
              disabled={disabled}
            />
          </div>
        );
      })}
    </div>
  );
}
