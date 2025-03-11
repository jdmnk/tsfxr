import { useState, useCallback } from "react";

export const useClipboard = () => {
  const [copyStatus, setCopyStatus] = useState({
    isCopied: false,
    error: null as string | null,
    lastCopiedText: null as string | null,
  });

  const copyToClipboard = useCallback(
    async (text: string, triggerElement?: HTMLElement) => {
      // Reset status before attempting copy
      setCopyStatus({
        isCopied: false,
        error: null,
        lastCopiedText: null,
      });

      try {
        // First attempt: Modern Clipboard API (preferred method)
        if (navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(text);
            setCopyStatus({
              isCopied: true,
              error: null,
              lastCopiedText: text,
            });
            return true;
          } catch (clipboardError) {
            console.debug(
              "Clipboard API failed, falling back to execCommand",
              clipboardError
            );
          }
        }

        // Fallback: execCommand('copy')
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Make textarea invisible but accessible
        textArea.style.cssText =
          "position:fixed;pointer-events:none;opacity:0;z-index:9999;";

        // Insert the textarea near the trigger element or fall back to body
        const container = triggerElement?.parentElement || document.body;
        container.appendChild(textArea);

        try {
          textArea.focus();
          textArea.select();

          const successful = document.execCommand("copy");
          container.removeChild(textArea);

          if (successful) {
            setCopyStatus({
              isCopied: true,
              error: null,
              lastCopiedText: text,
            });
            return true;
          }

          throw new Error("execCommand('copy') failed");
        } catch (err) {
          container.removeChild(textArea);
          console.error("Fallback copy method failed", err);
          throw new Error("Fallback copy method failed");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to copy text to clipboard. Please try selecting and copying manually.";

        setCopyStatus({
          isCopied: false,
          error: errorMessage,
          lastCopiedText: null,
        });
        return false;
      }
    },
    []
  );

  // Optional: Reset copied status after a delay
  const resetCopyStatus = useCallback(() => {
    setCopyStatus((prev) => ({
      ...prev,
      isCopied: false,
    }));
  }, []);

  return {
    copyToClipboard,
    isCopied: copyStatus.isCopied,
    error: copyStatus.error,
    lastCopiedText: copyStatus.lastCopiedText,
    resetCopyStatus,
  };
};
