// ================================
// Memory Formatter Utility
// Project: Billing & Inventory Management System
// Sprint: 1.9 — Health API
// ================================

export interface MemoryStats {
  heapUsed:  string;
  heapTotal: string;
  rss:       string;
}

export function formatMemory(): MemoryStats {
  const mem  = process.memoryUsage();
  const toMB = (bytes: number): string =>
    `${Math.round(bytes / 1024 / 1024)} MB`;

  return {
    heapUsed:  toMB(mem.heapUsed),
    heapTotal: toMB(mem.heapTotal),
    rss:       toMB(mem.rss),
  };
}