import React, { useMemo } from 'react';

// =============================================================================
// Type Definitions
// =============================================================================

/**
 * Supported blockchain types for wallet balances
 */
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

/**
 * Wallet balance data structure
 * FIX: Added 'blockchain' property that was missing in the original interface
 */
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

/**
 * Extended wallet balance with formatted amount string
 */
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

/**
 * Price mapping from currency to USD value
 */
interface Prices {
  [currency: string]: number;
}

/**
 * Component props - extending BoxProps if using a component library
 * FIX: Removed empty interface, using type alias instead for clarity
 */
interface BoxProps {
  className?: string;
  // Add other BoxProps as needed from your component library
}

type WalletPageProps = BoxProps;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Priority mapping for blockchain sorting
 * FIX: Moved outside component to prevent recreation on each render
 * FIX: Changed parameter type from 'any' to 'Blockchain'
 */
const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? -99;
};

// =============================================================================
// Placeholder Components & Hooks (would be imported in real implementation)
// =============================================================================

// These would be imported from your actual implementation
declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): Prices;

interface WalletRowProps {
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

declare const WalletRow: React.FC<WalletRowProps>;

// =============================================================================
// Main Component
// =============================================================================

const WalletPage: React.FC<WalletPageProps> = (props) => {
  // FIX: Removed unused 'children' destructuring
  const { ...rest } = props;

  const balances = useWalletBalances();
  const prices = usePrices();

  /**
   * Filter and sort balances by blockchain priority
   *
   * FIXES:
   * 1. Changed 'lhsPriority' to 'balancePriority' (undefined variable)
   * 2. Fixed filter logic - now keeps positive balances with valid priority
   *    (original logic was inverted, keeping zero/negative balances)
   * 3. Removed 'prices' from dependency array (wasn't used in computation)
   * 4. Added explicit return 0 for equal priorities in sort
   * 5. Simplified sort comparison
   */
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // FIX: Corrected logic - keep balances with valid priority AND positive amount
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // FIX: Simplified sort comparison, handles equal case explicitly
        return rightPriority - leftPriority;
      });
  }, [balances]); // FIX: Removed 'prices' - it wasn't used in this computation

  /**
   * Add formatted amount to each balance
   */
  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return sortedBalances.map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2), // FIX: Added decimal places for better formatting
    }));
  }, [sortedBalances]);

  /**
   * Generate row components
   *
   * FIXES:
   * 1. Now using 'formattedBalances' instead of 'sortedBalances'
   *    (original created formattedBalances but didn't use it)
   * 2. Using currency as key instead of index (better for React reconciliation)
   * 3. Added null check for prices[currency] to prevent NaN
   * 4. Memoized to prevent unnecessary re-renders
   * 5. Replaced undefined 'classes.row' with inline className
   */
  const rows = useMemo(() => {
    return formattedBalances.map((balance) => {
      // FIX: Added fallback for missing price to prevent NaN
      const price = prices[balance.currency] ?? 0;
      const usdValue = price * balance.amount;

      return (
        <WalletRow
          className="wallet-row" // FIX: Replaced undefined 'classes.row'
          key={`${balance.blockchain}-${balance.currency}`} // FIX: Using unique key instead of index
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
