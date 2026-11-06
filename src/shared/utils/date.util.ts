export function formatShowtime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

export function isUpcoming(isoString: string): boolean {
  return new Date(isoString).getTime() > Date.now();
}
