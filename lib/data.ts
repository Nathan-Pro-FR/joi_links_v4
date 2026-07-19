export const SORTS = [
  { value: "recent", label: "Recently added" },
  { value: "rating", label: "Highest rated" },
  { value: "duration_asc", label: "Shortest first" },
  { value: "duration_desc", label: "Longest first" },
  { value: "title", label: "Title A→Z" },
] as const;

export type SortValue = (typeof SORTS)[number]["value"];

export function durToSec(d: string): number {
  const parts = d.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}
