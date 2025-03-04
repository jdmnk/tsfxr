import { useState, useCallback } from "react";

export const useClipboard = () => {
  const [copyStatus, setCopyStatus] = useState({
    isCopied: false,
    error: null as string | null,
    lastCopiedText: null as string | null,
  });

  const copyToClipboard = useCallback(
    async (text: string, container?: HTMLElement) => {
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
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.opacity = "0";
        textArea.style.width = "1px";
        textArea.style.height = "1px";
        textArea.style.padding = "0";
        textArea.style.pointerEvents = "none";
        textArea.style.position = "fixed";
        textArea.style.zIndex = "9999";

        // Use the provided container or fall back to document.body
        const targetContainer = container || document.body;
        targetContainer.appendChild(textArea);

        try {
          textArea.focus();
          textArea.select();

          const successful = document.execCommand("copy");
          targetContainer.removeChild(textArea);

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
          targetContainer.removeChild(textArea);
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
