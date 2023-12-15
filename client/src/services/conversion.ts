export function convertTime(
  time: number,
  fromUnit: "sec" | "min" | "hr",
  toUnit: "sec" | "min" | "hr"
) {
  const units = {
    sec: 1,
    min: 60,
    hr: 3600,
  };

  if (!units[fromUnit] || !units[toUnit]) {
    return time;
  }

  const seconds = time * units[fromUnit];
  const convertedTime = seconds / units[toUnit];

  return convertedTime;
}

export function convertMemorySize(
  size: number,
  fromUnit: "kb" | "mb" | "gb",
  toUnit: "kb" | "mb" | "gb"
) {
  const units = {
    kb: 1,
    mb: 1024,
    gb: 1024 * 1024,
  };

  if (!units[fromUnit] || !units[toUnit]) {
    return size;
  }

  const bytes = size * units[fromUnit];
  const convertedSize = bytes / units[toUnit];

  return convertedSize;
}
