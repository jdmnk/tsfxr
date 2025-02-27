import { waveforms } from "@/lib/sfxr/sfxr";

export function WaveformBackground({ waveform }: { waveform: number }) {
  const width = 200; // Increased width for a more natural flow
  const height = 40; // Adjusted height for better spacing

  const getWaveformPath = (type: number) => {
    let path = "";

    switch (type) {
      case waveforms.SINE:
        // Use multiple sine cycles to ensure seamless pattern
        path = `M0 ${height / 2}`;
        for (let i = 0; i < 2; i++) {
          // Repeat two cycles
          path += ` Q${width / 8 + (i * width) / 2} 0 ${
            width / 4 + (i * width) / 2
          } ${height / 2}`;
          path += ` T${width / 2 + (i * width) / 2} ${height / 2}`;
        }
        break;
      case waveforms.SQUARE:
        path = `M0 ${height / 2}`;
        for (let i = 0; i < 4; i++) {
          const x = (i * width) / 4;
          path += ` L${x} ${i % 2 === 0 ? 0 : height}`;
        }
        path += ` L${width} ${height / 2}`;
        break;
      case waveforms.SAWTOOTH:
        path = `M0 ${height}`;
        for (let i = 0; i < 2; i++) {
          // Two repeating cycles
          path += ` L${width / 4 + (i * width) / 2} 0`;
          path += ` L${width / 2 + (i * width) / 2} ${height}`;
        }
        break;
      case waveforms.TRIANGLE:
        path = `M0 ${height / 2}`;
        for (let i = 0; i < 2; i++) {
          // Two repeating cycles
          path += ` L${width / 8 + (i * width) / 2} 0`;
          path += ` L${width / 4 + (i * width) / 2} ${height}`;
          path += ` L${width / 2 + (i * width) / 2} ${height / 2}`;
        }
        break;
      case waveforms.NOISE:
        const noiseSteps = 20;
        const noiseStep = width / noiseSteps;
        path = `M0 ${height / 2}`;
        for (let i = 0; i <= noiseSteps; i++) {
          const x = i * noiseStep;
          const y = Math.random() * height * 0.8 + height * 0.1;
          path += ` L${x} ${y}`;
        }
        break;
      default:
        path = `M0 ${height / 2} L${width} ${height / 2}`;
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
          width={width} // Wider width ensures seamless repeating pattern
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
