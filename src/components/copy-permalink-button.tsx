import { toast } from "sonner";
import { Button } from "./ui/button";
import { Link } from "lucide-react";

export function CopyPermalinkButton({ b58 }: { b58: string }) {
  // Copy permalink (b58) to clipboard.
  const handleCopyPermalink = async () => {
    try {
      const rootUrl = window.location.origin;
      const permaLink = `${rootUrl}/#${b58}`;
      await navigator.clipboard.writeText(permaLink);
      toast.success("Permalink copied to clipboard.");
    } catch (error) {
      console.error("Failed to copy permalink:", error);
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
