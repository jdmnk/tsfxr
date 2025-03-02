export class FastBase64 {
  static chars: string;
  static encLookup: string[];
  static Init(): void;
  static Encode(src: number[]): string;
}

export interface RIFFWAVEHeader {
  chunkId: number[];
  chunkSize: number;
  format: number[];
  subChunk1Id: number[];
  subChunk1Size: number;
  audioFormat: number;
  numChannels: number;
  sampleRate: number;
  byteRate: number;
  blockAlign: number;
  bitsPerSample: number;
  subChunk2Id: number[];
  subChunk2Size: number;
}

export class RIFFWAVE {
  data: number[];
  wav: number[];
  dataURI: string;
  header: RIFFWAVEHeader;

  constructor(data?: number[]);
  Make(data?: number[]): void;
}
