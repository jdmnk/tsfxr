import { Params, convert, parameters } from "@/lib/sfxr/sfxr";
import { Slider } from "./ui/slider";
import { UI_PARAMS_MAP, UiParamsMapKey } from "@/lib/ui/ui.const";
import { Label } from "./ui/label";
import { UpdateParamFn } from "@/types";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import { Button } from "./ui/button";

export function ParamsGroup({
  title,
  tooltip,
  uiParams,
  params,
  updateParam,
  disabled,
}: {
  title: string;
  tooltip: string;
  uiParams: UiParamsMapKey[];
  params: Params;
  updateParam: UpdateParamFn;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">{title}</Label>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Info className="h-4 w-4" />
              <span className="sr-only">Info for {title}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {uiParams.map((param) => {
        const paramName = param;
        const paramLabel = UI_PARAMS_MAP[param];

        const signed = parameters.signed.includes(paramName);
        const min = signed ? -1 : 0;
        const max = 1;
        const value = params[paramName] ? params[paramName] : 0;

        // @ts-expect-error
        const convertFn = convert.sliders[paramName];
        // @ts-expect-error
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
