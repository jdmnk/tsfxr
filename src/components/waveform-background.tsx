import { waveforms } from "@/lib/sfxr/sfxr";

export function WaveformBackground({ waveform }: { waveform: number }) {
  const width = 200; // Ensures a smooth repeating pattern
  const height = 40; // Provides a balanced wave appearance

  const getWaveformPath = (type: number) => {
    let path = "";

    if (type === waveforms.SINE) {
      path = `M0 ${height / 2}`;
      for (let i = 0; i < 2; i++) {
        // Two sine cycles for smooth repeat
        path += ` Q${width / 8 + (i * width) / 2} 0 ${
          width / 4 + (i * width) / 2
        } ${height / 2}`;
        path += ` T${width / 2 + (i * width) / 2} ${height / 2}`;
      }
    } else if (type === waveforms.SQUARE) {
      // Square waves with vertical spacing
      const squareSteps = 2; // Defines two full cycles
      const squareWidth = width / squareSteps;
      const pulseHeight = height * 0.6; // Makes pulses smaller to avoid touching
      const baseY = height * 0.7; // Lowers the wave slightly for spacing

      path = `M0 ${baseY}`;
      for (let i = 0; i < squareSteps; i++) {
        const x = i * squareWidth;
        path += ` L${x} ${baseY}`; // Start at base
        path += ` L${x} ${baseY - pulseHeight}`; // Pulse up
        path += ` L${x + squareWidth / 2} ${baseY - pulseHeight}`; // Hold high
        path += ` L${x + squareWidth / 2} ${baseY}`; // Pulse down
      }
      path += ` L${width} ${baseY}`; // Connect back to base
    } else if (type === waveforms.SAWTOOTH) {
      const sawSteps = 2; // Number of repeating cycles
      const sawWidth = width / sawSteps;
      const baseY = height * 0.7; // Lower the wave for spacing
      const peakY = baseY - height * 0.6; // Ensure it doesn't touch the top

      path = `M0 ${baseY}`; // Start at baseline

      for (let i = 0; i < sawSteps; i++) {
        const xStart = i * sawWidth;
        path += ` L${xStart + sawWidth} ${peakY}`; // Diagonal up
        path += ` L${xStart + sawWidth} ${baseY}`; // Vertical drop
      }
    } else if (type === waveforms.TRIANGLE) {
      // Ensure the sawtooth is perfectly repeating with no gaps
      path = `M0 ${height}`;
      for (let i = 0; i < 2; i++) {
        // Two cycles
        path += ` L${width / 4 + (i * width) / 2} 0`;
        path += ` L${width / 2 + (i * width) / 2} ${height}`;
      }
    } else if (type === waveforms.NOISE) {
      // Generate randomized points but ensure seamless looping
      const noiseSteps = 20;
      const noiseStep = width / noiseSteps;
      path = `M0 ${height / 2}`;
      for (let i = 0; i <= noiseSteps; i++) {
        const x = i * noiseStep;
        const y = Math.random() * height * 0.8 + height * 0.1;
        path += ` L${x} ${y}`;
      }
    }
    return path;
  };

  return (
    <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <pattern
          id={`pattern-${waveform}`}
          x="0"
          y="0"
          width={width} // Ensures waves flow smoothly
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={getWaveformPath(waveform)}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill={`url(#pattern-${waveform})`}
        />
      </svg>
    </div>
  );
}
