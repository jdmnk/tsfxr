import { Check, Copy, Download } from "lucide-react";
import { Params } from "@/lib/sfxr/sfxr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useRef } from "react";
import { useClipboard } from "@/lib/hooks/use-clipboard";
import { toast } from "sonner";

export function ExportConfigDialog({ params }: { params: Params }) {
  const exportTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const { copyToClipboard, isCopied, resetCopyStatus } = useClipboard();

  const handleExportConfig = () => {
    return JSON.stringify(params, null, 2);
  };

  const handleCopyExport = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    try {
      const configString = handleExportConfig();
      const success = await copyToClipboard(configString, event.currentTarget);

      if (success) {
        setTimeout(resetCopyStatus, 2000);
      } else {
        // If copying failed, try to select the text for manual copying
        if (exportTextAreaRef.current) {
          exportTextAreaRef.current.select();
        }
        toast.error("Failed to copy", {
          description: "Please press Cmd/Ctrl+C to copy the selected text",
        });
      }
    } catch (err) {
      console.error("Copy failed:", err);
      if (exportTextAreaRef.current) {
        exportTextAreaRef.current.select();
      }
      toast.error("Failed to copy", {
        description: "Please press Cmd/Ctrl+C to copy the selected text",
      });
    }
  };

  const handleDownloadConfig = () => {
    const configString = handleExportConfig();
    const blob = new Blob([configString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "synthesizer-config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center w-full">
          <Download className="mr-2 h-4 w-4" /> Export Config
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Export Configuration</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Textarea
            ref={exportTextAreaRef}
            value={handleExportConfig()}
            readOnly
            className="min-h-[200px] bg-muted text-foreground pr-10"
          />
          <Button
            size="sm"
            onClick={handleCopyExport}
            className="absolute top-2 right-2"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        {isCopied && (
          <p className="text-sm text-green-500 mt-2">Copied to clipboard!</p>
        )}
        <Button onClick={handleDownloadConfig} className="mt-4">
          Download JSON
        </Button>
      </DialogContent>
    </Dialog>
  );
}
