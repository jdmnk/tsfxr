import { Params } from "@/lib/sfxr/sfxr";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";
import { Button } from "../ui/button";

export function FileExport({
  params,
  sound,
  fileName,
}: {
  params: Params;
  sound: any;
  fileName: string;
}) {
  const fileSize = Math.round(sound.wav.length / 1024) + "kB";
  const numSamples =
    sound.header.subChunk2Size / (sound.header.bitsPerSample >> 3);
  const clipping = sound.clipping;

  // Function to trigger download
  const handleDownload = () => {
    if (sound?.dataURI) {
      const link = document.createElement("a");
      link.href = sound.dataURI;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <div className="space-y-2 pt-6">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Duration:</div>
          <div> {(+numSamples / params.sample_rate).toFixed(2)}s</div>
          <div>File size:</div>
          <div>{fileSize}</div>
          <div>Samples:</div>
          <div>{numSamples}</div>
          <div className="flex items-center">
            Clipped:
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Clipping occurs when the audio signal exceeds the maximum
                  amplitude that can be represented in the digital format. This
                  can result in distortion of the sound. Reducing the overall
                  volume or adjusting the envelope can help minimize clipping.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div>{clipping}</div>
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <Button className="w-full" onClick={handleDownload}>
          Download
        </Button>
      </div>
    </>
  );
}
