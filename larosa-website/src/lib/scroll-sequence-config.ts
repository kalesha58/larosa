export const SEQUENCE_1 = {
  basePath: "/Sequence-1",
  frameCount: 150,
  filePrefix: "ezgif-frame",
  extension: "png",
} as const;

export function sequence1FrameUrl(index: number): string {
  const frameNumber = String(index + 1).padStart(3, "0");
  return `${SEQUENCE_1.basePath}/${SEQUENCE_1.filePrefix}-${frameNumber}.${SEQUENCE_1.extension}`;
}

export function getAllSequence1Urls(): string[] {
  return Array.from({ length: SEQUENCE_1.frameCount }, (_, i) =>
    sequence1FrameUrl(i)
  );
}
