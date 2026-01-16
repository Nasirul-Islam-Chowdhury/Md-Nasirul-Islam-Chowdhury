import type { Token } from '../types/token';
import './ExchangeRate.css';

interface ExchangeRateProps {
  fromToken: Token | null;
  toToken: Token | null;
}

export function ExchangeRate({ fromToken, toToken }: ExchangeRateProps) {
  if (!fromToken || !toToken) {
    return null;
  }

  const rate = fromToken.price / toToken.price;
  const inverseRate = toToken.price / fromToken.price;

  const formatRate = (r: number): string => {
    if (r >= 1000) {
      return r.toFixed(2);
    } else if (r >= 1) {
      return r.toFixed(4);
    } else {
      return r.toFixed(6);
    }
  };

  return (
    <div className="exchange-rate">
      <div className="rate-icon">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
      </div>
      <div className="rate-content">
        <span className="rate-text">
          1 {fromToken.currency} = {formatRate(rate)} {toToken.currency}
        </span>
        <span className="rate-secondary">
          1 {toToken.currency} = {formatRate(inverseRate)} {fromToken.currency}
        </span>
      </div>
    </div>
  );
}
