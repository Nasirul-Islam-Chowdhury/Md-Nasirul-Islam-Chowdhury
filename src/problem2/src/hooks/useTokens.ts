import { useState, useEffect, useMemo } from 'react';
import type { Token, TokenPrice } from '../types/token';

const PRICES_URL = 'https://interview.switcheo.com/prices.json';
const ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export function useTokens() {
  const [tokenPrices, setTokenPrices] = useState<TokenPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(PRICES_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch token prices');
        }
        const data: TokenPrice[] = await response.json();
        setTokenPrices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  // Process tokens: deduplicate by currency (keep latest price) and filter out zero/undefined prices
  const tokens = useMemo<Token[]>(() => {
    const tokenMap = new Map<string, TokenPrice>();

    // Keep the latest entry for each currency (entries are sorted by date in the API)
    tokenPrices.forEach((tp) => {
      if (tp.price && tp.price > 0) {
        const existing = tokenMap.get(tp.currency);
        if (!existing || new Date(tp.date) > new Date(existing.date)) {
          tokenMap.set(tp.currency, tp);
        }
      }
    });

    return Array.from(tokenMap.values())
      .map((tp) => ({
        currency: tp.currency,
        price: tp.price,
        icon: `${ICON_BASE_URL}/${tp.currency}.svg`,
      }))
      .sort((a, b) => a.currency.localeCompare(b.currency));
  }, [tokenPrices]);

  return { tokens, loading, error };
}
