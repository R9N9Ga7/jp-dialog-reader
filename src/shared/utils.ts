export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const parseIntOrDefault = (value: string | null): number => {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) ? parsedValue : 0;
}
