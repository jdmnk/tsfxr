import { Download } from "lucide-react";
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

export function ExportConfigDialog({ params }: { params: Params }) {
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
    </>
  );
}
