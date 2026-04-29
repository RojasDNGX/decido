const IP_LIMIT = 5;

// Simples cache em memória para o MVP
// Chave: IP:Data (ex: 127.0.0.1:2026-04-29)
// Valor: count
const ipCache = new Map<string, number>();

export function checkIpLimit(ip: string): { allowed: boolean; count: number } {
  const today = new Date().toISOString().slice(0, 10);
  const key = `${ip}:${today}`;
  
  const currentCount = ipCache.get(key) || 0;
  
  if (currentCount >= IP_LIMIT) {
    return { allowed: false, count: currentCount };
  }
  
  return { allowed: true, count: currentCount };
}

export function incrementIpCount(ip: string): void {
  const today = new Date().toISOString().slice(0, 10);
  const key = `${ip}:${today}`;
  const currentCount = ipCache.get(key) || 0;
  ipCache.set(key, currentCount + 1);
  
  // Limpeza básica do cache para não vazar memória infinitamente
  // Remove chaves de dias anteriores se o cache crescer muito
  if (ipCache.size > 1000) {
    for (const [k] of ipCache) {
      if (!k.endsWith(today)) {
        ipCache.delete(k);
      }
    }
  }
}
