import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Token } from '../types/token';
import { useTokens } from '../hooks/useTokens';
import { TokenSelector } from './TokenSelector';
import { AmountInput } from './AmountInput';
import { SwapButton } from './SwapButton';
import { SubmitButton } from './SubmitButton';
import { ExchangeRate } from './ExchangeRate';
import { SuccessModal } from './SuccessModal';
import './CurrencySwap.css';

export function CurrencySwap() {
  const { tokens, loading, error } = useTokens();

  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  // Set default tokens once loaded
  useEffect(() => {
    if (tokens.length > 0 && !fromToken) {
      const eth = tokens.find((t) => t.currency === 'ETH');
      const usdc = tokens.find((t) => t.currency === 'USDC');
      setFromToken(eth || tokens[0]);
      setToToken(usdc || tokens[1] || null);
    }
  }, [tokens, fromToken]);

  // Calculate exchange rate
  const exchangeRate = useMemo(() => {
    if (!fromToken || !toToken) return 0;
    return fromToken.price / toToken.price;
  }, [fromToken, toToken]);

  // Calculate to amount when from amount changes
  useEffect(() => {
    if (fromAmount && exchangeRate) {
      const numAmount = parseFloat(fromAmount);
      if (!isNaN(numAmount)) {
        const calculated = numAmount * exchangeRate;
        setToAmount(calculated.toFixed(8).replace(/\.?0+$/, ''));
      }
    } else {
      setToAmount('');
    }
  }, [fromAmount, exchangeRate]);

  // Validate input
  useEffect(() => {
    if (!fromAmount) {
      setInputError(null);
      return;
    }

    const numAmount = parseFloat(fromAmount);
    if (isNaN(numAmount)) {
      setInputError('Please enter a valid number');
    } else if (numAmount <= 0) {
      setInputError('Amount must be greater than 0');
    } else if (numAmount > 1000000000) {
      setInputError('Amount exceeds maximum limit');
    } else {
      setInputError(null);
    }
  }, [fromAmount]);

  // Handle swap tokens
  const handleSwapTokens = useCallback(() => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
  }, [fromToken, toToken, toAmount]);

  // Filter out selected tokens from opposite selector
  const availableFromTokens = useMemo(() => {
    return tokens.filter((t) => t.currency !== toToken?.currency);
  }, [tokens, toToken]);

  const availableToTokens = useMemo(() => {
    return tokens.filter((t) => t.currency !== fromToken?.currency);
  }, [tokens, fromToken]);

  // Calculate USD values
  const fromUsdValue = useMemo(() => {
    if (!fromAmount || !fromToken) return undefined;
    const numAmount = parseFloat(fromAmount);
    if (isNaN(numAmount)) return undefined;
    return numAmount * fromToken.price;
  }, [fromAmount, fromToken]);

  const toUsdValue = useMemo(() => {
    if (!toAmount || !toToken) return undefined;
    const numAmount = parseFloat(toAmount);
    if (isNaN(numAmount)) return undefined;
    return numAmount * toToken.price;
  }, [toAmount, toToken]);

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      fromToken &&
      toToken &&
      fromAmount &&
      parseFloat(fromAmount) > 0 &&
      !inputError
    );
  }, [fromToken, toToken, fromAmount, inputError]);

  // Handle submit
  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccess(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowSuccess(false);
    setFromAmount('');
    setToAmount('');
  };

  // Get submit button text
  const getSubmitText = () => {
    if (!fromToken || !toToken) return 'Select tokens';
    if (!fromAmount) return 'Enter an amount';
    if (inputError) return inputError;
    return 'Swap';
  };

  if (error) {
    return (
      <div className="currency-swap-container">
        <div className="swap-card error-card">
          <div className="error-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2>Unable to Load Tokens</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="currency-swap-container">
      <div className="swap-card">
        <div className="card-header">
          <h1>Swap</h1>
          <p>Trade tokens instantly at the best rates</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading tokens...</p>
          </div>
        ) : (
          <form className="swap-form" onSubmit={(e) => e.preventDefault()}>
            {/* From Section */}
            <div className="swap-section from-section">
              <div className="section-row">
                <AmountInput
                  value={fromAmount}
                  onChange={setFromAmount}
                  label="You pay"
                  usdValue={fromUsdValue}
                  error={inputError || undefined}
                  placeholder="0.00"
                />
                <TokenSelector
                  tokens={availableFromTokens}
                  selectedToken={fromToken}
                  onSelect={setFromToken}
                  label="Token"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="swap-button-container">
              <SwapButton onClick={handleSwapTokens} disabled={!fromToken || !toToken} />
            </div>

            {/* To Section */}
            <div className="swap-section to-section">
              <div className="section-row">
                <AmountInput
                  value={toAmount}
                  onChange={() => {}}
                  label="You receive"
                  usdValue={toUsdValue}
                  disabled
                  placeholder="0.00"
                />
                <TokenSelector
                  tokens={availableToTokens}
                  selectedToken={toToken}
                  onSelect={setToToken}
                  label="Token"
                />
              </div>
            </div>

            {/* Exchange Rate */}
            <ExchangeRate fromToken={fromToken} toToken={toToken} />

            {/* Submit Button */}
            <SubmitButton
              onClick={handleSubmit}
              disabled={!isFormValid}
              loading={isSubmitting}
            >
              {getSubmitText()}
            </SubmitButton>
          </form>
        )}
      </div>

      {/* Success Modal */}
      {fromToken && toToken && (
        <SuccessModal
          isOpen={showSuccess}
          onClose={handleCloseModal}
          fromToken={fromToken}
          toToken={toToken}
          fromAmount={fromAmount}
          toAmount={toAmount}
        />
      )}
    </div>
  );
}
