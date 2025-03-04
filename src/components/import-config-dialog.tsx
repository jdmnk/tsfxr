"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, AlertCircle, Check } from "lucide-react";

export function ImportConfigDialog({
  handleImportConfig,
}: {
  handleImportConfig: (config: object) => void;
}) {
  const [importConfig, setImportConfig] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (configString: string) => {
    setImportConfig(configString);
    setImportError(null);
    setImportSuccess(false);

    try {
      const importedConfig = JSON.parse(configString);
      setImportSuccess(true);
      handleImportConfig(importedConfig);
    } catch {
      setImportError("Invalid JSON format");
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === "string") {
          handleOnChange(content);
        }
      };
      reader.readAsText(file);

      event.target.value = ""; // Reset the input
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center w-full">
          <Upload className="mr-2 h-4 w-4" /> Import Config
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Import Configuration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Paste your configuration JSON here"
            className="min-h-[200px] bg-muted text-foreground"
            value={importConfig}
            onChange={(e) => handleOnChange(e.target.value)}
          />
          {importError && (
            <div className="flex items-center text-red-500">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>{importError}</span>
            </div>
          )}
          {importSuccess && (
            <div className="flex items-center text-green-500">
              <Check className="mr-2 h-4 w-4" />
              <span>Configuration successfully imported!</span>
            </div>
          )}
          <div>
            <Button onClick={() => fileInputRef.current?.click()}>
              Import from File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              style={{ display: "none" }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
