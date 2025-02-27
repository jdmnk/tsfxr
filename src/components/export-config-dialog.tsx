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
import { useRef, useState } from "react";

export function ExportConfigDialog({ params }: { params: Params }) {
  const [exportCopied, setExportCopied] = useState(false);
  const exportTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleExportConfig = () => {
    return JSON.stringify(params, null, 2);
  };

  const handleCopyExport = async () => {
    if (exportTextAreaRef.current) {
      exportTextAreaRef.current.select();
      await navigator.clipboard.writeText(exportTextAreaRef.current.value);
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2000); // Reset the msg after 2 seconds
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center">
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
            {exportCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        {exportCopied && (
          <p className="text-sm text-green-500 mt-2">Copied to clipboard!</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
