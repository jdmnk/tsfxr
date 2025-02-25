import { Params, convert, parameters } from "@/lib/sfxr/sfxr";
import { UI_PARAMS, UiParam } from "@/lib/ui.const";
import { Slider } from "./ui/slider";

export function ParamSection({
  title,
  uiParamsPrefix,
  params,
  updateParam,
}: {
  title: string;
  uiParamsPrefix: string;
  params: Params;
  updateParam: <K extends keyof Params>(key: K, value: Params[K]) => void;
}) {
  const uiParams = UI_PARAMS.filter((param) =>
    param.key.startsWith(uiParamsPrefix)
  );
  return (
    <>
      <h3 className="font-bold text-md mt-4">{title}</h3>
      <div className="flex flex-col gap-2">
        {uiParams.map((param) => {
          const paramName = param.key;
          const paramLabel = param.label;

          const signed = parameters.signed.includes(paramName);
          const min = signed ? -1 : 0;
          const max = 1;
          const value = params[paramName] ? params[paramName] : 0;

          // @ts-ignore
          const convertFn = convert.sliders[paramName];
          // @ts-ignore
          const unitsFn = convert.units[paramName];

          return (
            <div key={paramName} className="grid grid-cols-[auto_250px] gap-4">
              <Slider
                min={min}
                max={max}
                step={0.001}
                value={[value]}
                onValueChange={(e) => {
                  updateParam(paramName, e[0]);
                }}
                className="w-32"
              />
              <div className="">
                <span className="text-sm font-semibold">
                  {paramLabel}:&nbsp;
                </span>
                <span className="text-xs">{unitsFn(convertFn(value))}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
