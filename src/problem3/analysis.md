# Problem 3: Messy React - Code Analysis & Refactoring

## Overview

This document analyzes the computational inefficiencies and anti-patterns in the provided React code, along with explanations of how to fix them.

---

## Issues Identified

### 1. **Undefined Variable Reference (`lhsPriority`)**
**Location**: Line in filter callback
```typescript
if (lhsPriority > -99) {
```

**Problem**: The variable `lhsPriority` is never declared. This is likely a typo and should be `balancePriority`, which is defined on the previous line.

**Impact**: This will cause a runtime `ReferenceError`, crashing the component.

**Fix**: Change `lhsPriority` to `balancePriority`.

---

### 2. **Inverted Filter Logic**
**Location**: Filter callback in `useMemo`
```typescript
.filter((balance: WalletBalance) => {
  const balancePriority = getPriority(balance.blockchain);
  if (lhsPriority > -99) {
     if (balance.amount <= 0) {
       return true;
     }
  }
  return false
})
```

**Problem**: The filter logic appears inverted. It returns `true` for balances with `amount <= 0` (keeping zero/negative balances), and `false` for positive balances. This seems backwards - typically you'd want to show balances with positive amounts and valid blockchain priority.

**Impact**: Will display wallets with zero or negative balances, hiding useful wallet information.

**Fix**: Invert the logic to keep balances with valid priority AND positive amounts:
```typescript
.filter((balance: WalletBalance) => {
  const balancePriority = getPriority(balance.blockchain);
  return balancePriority > -99 && balance.amount > 0;
})
```

---

### 3. **Missing `blockchain` Property in Type Definition**
**Location**: `WalletBalance` interface
```typescript
interface WalletBalance {
  currency: string;
  amount: number;
}
```

**Problem**: The code accesses `balance.blockchain` but this property doesn't exist in the `WalletBalance` interface. TypeScript should catch this, but if using `any` types or ignoring errors, it will fail silently.

**Impact**: Type safety violation, potential undefined behavior.

**Fix**: Add `blockchain` property to the interface:
```typescript
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
```

---

### 4. **Unnecessary `prices` Dependency in `useMemo`**
**Location**: `useMemo` dependency array
```typescript
}, [balances, prices]);
```

**Problem**: The `prices` variable is included in the dependency array but is never used in the `useMemo` computation. This causes unnecessary recalculations whenever `prices` changes.

**Impact**: Performance degradation - the memoized computation reruns even when the result wouldn't change.

**Fix**: Remove `prices` from the dependency array:
```typescript
}, [balances]);
```

---

### 5. **Incomplete Sort Comparison Function**
**Location**: Sort callback
```typescript
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  if (leftPriority > rightPriority) {
    return -1;
  } else if (rightPriority > leftPriority) {
    return 1;
  }
});
```

**Problem**: No return value when priorities are equal. This returns `undefined` implicitly, which JavaScript converts to `0`, but it's better to be explicit and shows incomplete thinking.

**Impact**: Works coincidentally but is unclear and could cause issues if the comparison function is used elsewhere.

**Fix**: Add explicit return for equal case:
```typescript
.sort((lhs, rhs) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  return rightPriority - leftPriority; // Simplified descending sort
});
```

---

### 6. **`getPriority` Function Defined Inside Component**
**Location**: Inside `WalletPage` component
```typescript
const getPriority = (blockchain: any): number => {
```

**Problem**: This function is recreated on every render. Since it has no dependencies on component state or props, it should be defined outside the component.

**Impact**: Minor performance overhead and potential closure-related bugs if used as a dependency.

**Fix**: Move `getPriority` outside the component or memoize it with `useCallback`.

---

### 7. **Use of `any` Type**
**Location**: `getPriority` parameter
```typescript
const getPriority = (blockchain: any): number => {
```

**Problem**: Using `any` bypasses TypeScript's type checking, losing the benefits of type safety.

**Impact**: Potential runtime errors that TypeScript could have caught.

**Fix**: Use a proper type (string or a union type of blockchain names):
```typescript
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';
const getPriority = (blockchain: Blockchain): number => {
```

---

### 8. **Unused `formattedBalances` Variable**
**Location**: After `sortedBalances`
```typescript
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed()
  }
})
```

**Problem**: `formattedBalances` is computed but never used. The `rows` mapping uses `sortedBalances` directly, but casts it to `FormattedWalletBalance`, expecting a `formatted` property that doesn't exist.

**Impact**: Memory waste (computed but unused), and the `rows` mapping will have undefined `formattedAmount` props.

**Fix**: Use `formattedBalances` instead of `sortedBalances` in the `rows` mapping:
```typescript
const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
```

---

### 9. **Using Array Index as React Key**
**Location**: `rows` mapping
```typescript
key={index}
```

**Problem**: Using array indices as keys is an anti-pattern when the list can change (items reordered, added, or removed). React uses keys to identify which items have changed.

**Impact**: Poor performance when list changes, potential bugs with component state preservation.

**Fix**: Use a unique identifier from the data:
```typescript
key={balance.currency}
// or
key={`${balance.blockchain}-${balance.currency}`}
```

---

### 10. **Redundant Interface Extension**
**Location**: Props interface
```typescript
interface Props extends BoxProps {

}
```

**Problem**: Empty interface extension provides no additional type information and adds noise.

**Impact**: Code clarity - no functionality impact but unnecessary complexity.

**Fix**: Either add specific props or use `BoxProps` directly:
```typescript
type Props = BoxProps;
// or just use BoxProps directly in the component signature
```

---

### 11. **Destructuring `children` Without Using It**
**Location**: Component body
```typescript
const { children, ...rest } = props;
```

**Problem**: `children` is destructured but never used or passed down. If `BoxProps` includes children and they should be rendered, this is a bug.

**Impact**: If children are passed to the component, they will be silently ignored.

**Fix**: Either use children or remove from destructuring:
```typescript
const { ...rest } = props;
// or
return (
  <div {...rest}>
    {rows}
    {children}
  </div>
)
```

---

### 12. **Missing Memoization for `rows`**
**Location**: `rows` computation
```typescript
const rows = sortedBalances.map(...)
```

**Problem**: The `rows` array is recreated on every render, even if `sortedBalances` and `prices` haven't changed. This can cause unnecessary re-renders of child components.

**Impact**: Performance degradation, especially with many rows.

**Fix**: Use `useMemo`:
```typescript
const rows = useMemo(() =>
  formattedBalances.map((balance, index) => ...)
, [formattedBalances, prices]);
```

---

### 13. **Potential Division by Zero / Invalid Price Access**
**Location**: `rows` mapping
```typescript
const usdValue = prices[balance.currency] * balance.amount;
```

**Problem**: No check for whether `prices[balance.currency]` exists. If the currency isn't in the prices object, this will result in `undefined * number = NaN`.

**Impact**: UI may display "NaN" for USD values.

**Fix**: Add a fallback:
```typescript
const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
```

---

### 14. **Undefined `classes` Object**
**Location**: `rows` mapping
```typescript
className={classes.row}
```

**Problem**: The `classes` object is never defined in the code. This suggests CSS-in-JS (like Material-UI's `makeStyles`) was intended but not implemented.

**Impact**: Runtime error - `classes is not defined`.

**Fix**: Either define a `classes` object using a styling solution or use plain CSS class names:
```typescript
className="wallet-row"
```

---

## Summary Table

| Issue | Severity | Type |
|-------|----------|------|
| Undefined `lhsPriority` variable | Critical | Bug |
| Inverted filter logic | Critical | Logic Error |
| Missing `blockchain` in interface | High | Type Safety |
| Unused `prices` in dependency array | Medium | Performance |
| Incomplete sort return | Low | Code Quality |
| `getPriority` defined inside component | Low | Performance |
| Use of `any` type | Medium | Type Safety |
| Unused `formattedBalances` | High | Bug |
| Array index as React key | Medium | Performance/Bug |
| Empty interface extension | Low | Code Quality |
| Unused `children` destructuring | Low | Code Quality |
| Missing memoization for `rows` | Medium | Performance |
| No price validation | Medium | Bug |
| Undefined `classes` object | Critical | Bug |

---

## Refactored Code

See `refactored.tsx` for the complete refactored solution.
