import './SubmitButton.css';

interface SubmitButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export function SubmitButton({
  onClick,
  disabled = false,
  loading = false,
  children,
}: SubmitButtonProps) {
  return (
    <button
      type="button"
      className={`submit-button ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="loading-content">
          <div className="spinner"></div>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
