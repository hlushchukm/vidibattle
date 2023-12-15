export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " bytes";
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    return sizeInKB + " KB";
  } else {
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    return sizeInMB + " MB";
  }
}

export function getFileSizeInKB(sizeInBytes: number): number {
  if (sizeInBytes < 1024) {
    return sizeInBytes;
  } else {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB;
  }
}
