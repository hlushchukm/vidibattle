import { convertMemorySize, convertTime } from "./conversion";
import { getFileSizeInKB } from "./file";

export function validateImageSize(
  file: File,
  validationRule: { value: number; unit: string }
): boolean {
  if (!validationRule) return true;

  const normalizedData = convertMemorySize(
    getFileSizeInKB(file.size),
    "kb",
    validationRule.unit as "kb" | "mb" | "gb"
  );

  return validationRule.value >= normalizedData;
}

export function validateVideoSize(
  file: File,
  validationRule: { value: number; unit: string }
): boolean {
  if (!validationRule) return true;

  const normalizedData = convertMemorySize(
    getFileSizeInKB(file.size),
    "kb",
    validationRule.unit as "kb" | "mb" | "gb"
  );

  return validationRule.value >= normalizedData;
}

export function validateVideoLength(
  duration: number,
  validationRule: { value: number; unit: string }
): boolean {
  if (!validationRule) return true;

  const normalizedRule = convertTime(
    validationRule.value,
    validationRule.unit as "sec" | "min" | "hr",
    "sec"
  );

  return normalizedRule >= duration;
}
