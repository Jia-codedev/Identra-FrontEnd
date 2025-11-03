export function numericSeriesFromWorkHourTrends(payload: any): number[] {
  // Expected payload.data = [{ date: '2025-10-01', hours: 7.5 }, ...] or array of numbers
  if (!payload) return [];
  const d = payload.data ?? payload;
  if (!Array.isArray(d)) return [];

  // If array of numbers
  if (d.every((x: any) => typeof x === "number")) return d;

  // If array of objects with hours or value
  return d.map((item: any) => {
    if (typeof item === "number") return item;
    if (item == null) return 0;
    return Number(item.hours ?? item.value ?? item.y ?? 0) || 0;
  });
}
