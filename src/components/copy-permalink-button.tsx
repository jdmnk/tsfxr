import { toast } from "sonner";
import { Button } from "./ui/button";
import { Link } from "lucide-react";
import { useClipboard } from "@/lib/hooks/use-clipboard";

export function CopyPermalinkButton({ b58 }: { b58: string }) {
  const { copyToClipboard } = useClipboard();

  // Copy permalink (b58) to clipboard.
  const handleCopyPermalink = async () => {
    const rootUrl = window.location.origin;
    const permaLink = `${rootUrl}/#${b58}`;
    const success = await copyToClipboard(permaLink);

    if (success) {
      toast.success("Permalink copied to clipboard.");
    } else {
      toast.error("Copy failed", {
        description: "There was an error copying the permalink.",
      });
    }
  };

  return (
    <Button onClick={handleCopyPermalink} className="flex items-center w-full">
      <Link className="mr-2 h-4 w-4" /> Copy Permalink
    </Button>
  );
}
