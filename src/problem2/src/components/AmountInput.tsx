import './AmountInput.css';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  usdValue?: number;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
}

export function AmountInput({
  value,
  onChange,
  label,
  usdValue,
  disabled = false,
  error,
  placeholder = '0.00',
}: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(newValue) || newValue === '') {
      onChange(newValue);
    }
  };

  const formatUsdValue = (usd: number): string => {
    if (usd >= 1000000) {
      return `$${(usd / 1000000).toFixed(2)}M`;
    } else if (usd >= 1000) {
      return `$${(usd / 1000).toFixed(2)}K`;
    }
    return `$${usd.toFixed(2)}`;
  };

  return (
    <div className={`amount-input ${error ? 'has-error' : ''}`}>
      <label className="amount-label">{label}</label>
      <div className="input-wrapper">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`amount-field ${disabled ? 'disabled' : ''}`}
        />
        {usdValue !== undefined && value && !error && (
          <span className="usd-value">{formatUsdValue(usdValue)}</span>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
