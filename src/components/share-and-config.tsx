import { Download, Link, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Params } from "@/lib/sfxr/sfxr";

export function ShareAndConfig({
  params,
  handleImportConfig,
}: {
  params: Params;
  handleImportConfig: (config: string) => void;
}) {
  // Copy permalink (b58) to clipboard.
  const handleCopyPermalink = async () => {
    try {
      const permaLink = window.location.href + "#" + params.toB58();
      await navigator.clipboard.writeText(permaLink);
      toast.success("Permalink copied to clipboard.");
    } catch (error) {
      console.error("Failed to copy permalink:", error);
      toast.error("Copy failed", {
        description: "There was an error copying the permalink.",
      });
    }
  };

  const handleExportConfig = () => {
    const configString = JSON.stringify(params, null, 2);
    return configString;
  };

  return (
    <>
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
          <Textarea
            value={handleExportConfig()}
            readOnly
            className="min-h-[200px] bg-muted text-foreground"
          />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center">
            <Upload className="mr-2 h-4 w-4" /> Import Config
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Import Configuration</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Paste your configuration JSON here"
            className="min-h-[200px] bg-muted text-foreground"
            onChange={(e) => handleImportConfig(e.target.value)}
          />
        </DialogContent>
      </Dialog>
      <Button onClick={handleCopyPermalink} className="flex items-center">
        <Link className="mr-2 h-4 w-4" /> Copy Permalink
      </Button>
    </>
  );
}
