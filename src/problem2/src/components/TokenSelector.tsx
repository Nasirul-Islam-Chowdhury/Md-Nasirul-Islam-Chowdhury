import { useState, useRef, useEffect } from 'react';
import type { Token } from '../types/token';
import './TokenSelector.css';

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
  label: string;
  disabled?: boolean;
}

export function TokenSelector({
  tokens,
  selectedToken,
  onSelect,
  label,
  disabled = false,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredTokens = tokens.filter((token) =>
    token.currency.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (token: Token) => {
    onSelect(token);
    setIsOpen(false);
    setSearch('');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'flex';
  };

  return (
    <div className="token-selector" ref={dropdownRef}>
      <label className="token-selector-label">{label}</label>
      <button
        type="button"
        className={`token-selector-button ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedToken ? (
          <div className="selected-token">
            <div className="token-icon-wrapper">
              <img
                src={selectedToken.icon}
                alt={selectedToken.currency}
                className="token-icon"
                onError={handleImageError}
              />
              <div className="token-icon-fallback" style={{ display: 'none' }}>
                {selectedToken.currency.charAt(0)}
              </div>
            </div>
            <span className="token-currency">{selectedToken.currency}</span>
          </div>
        ) : (
          <span className="placeholder">Select token</span>
        )}
        <svg
          className={`chevron ${isOpen ? 'rotated' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="token-dropdown">
          <div className="search-container">
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
            <input
              ref={inputRef}
              type="text"
              className="token-search"
              placeholder="Search tokens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="token-list">
            {filteredTokens.length === 0 ? (
              <div className="no-results">No tokens found</div>
            ) : (
              filteredTokens.map((token) => (
                <button
                  key={token.currency}
                  type="button"
                  className={`token-option ${
                    selectedToken?.currency === token.currency ? 'selected' : ''
                  }`}
                  onClick={() => handleSelect(token)}
                >
                  <div className="token-icon-wrapper">
                    <img
                      src={token.icon}
                      alt={token.currency}
                      className="token-icon"
                      onError={handleImageError}
                    />
                    <div className="token-icon-fallback" style={{ display: 'none' }}>
                      {token.currency.charAt(0)}
                    </div>
                  </div>
                  <div className="token-info">
                    <span className="token-currency">{token.currency}</span>
                    <span className="token-price">${token.price.toFixed(4)}</span>
                  </div>
                  {selectedToken?.currency === token.currency && (
                    <svg
                      className="check-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
