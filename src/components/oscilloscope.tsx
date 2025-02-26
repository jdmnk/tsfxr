import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";

export function Oscilloscope({ analyser }: { analyser: AnalyserNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = canvas.parentElement?.clientHeight || 200;
    };

    const draw = () => {
      if (!ctx) return;

      analyser.getByteTimeDomainData(dataArray);

      const backgroundColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim();
      const foregroundColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim();

      ctx.fillStyle = `hsl(${backgroundColor})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = `hsl(${foregroundColor})`;
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // Normalize
        const y = (v * canvas.height) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [analyser, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-48 bg-muted rounded overflow-hidden"
    />
  );
}
