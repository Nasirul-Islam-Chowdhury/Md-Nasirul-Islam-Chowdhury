import type { Token } from '../types/token';
import './SuccessModal.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2 className="modal-title">Swap Successful!</h2>
        <p className="modal-description">Your transaction has been completed.</p>
        <div className="swap-summary">
          <div className="swap-item">
            <span className="swap-label">From</span>
            <span className="swap-value">
              {parseFloat(fromAmount).toLocaleString()} {fromToken.currency}
            </span>
          </div>
          <div className="swap-arrow">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </div>
          <div className="swap-item">
            <span className="swap-label">To</span>
            <span className="swap-value">
              {parseFloat(toAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}{' '}
              {toToken.currency}
            </span>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
