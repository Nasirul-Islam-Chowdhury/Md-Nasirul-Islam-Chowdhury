# 99Tech Code Challenge - Md Nasirul Islam Chowdhury

## Overview

This repository contains my solutions for the 99Tech code challenge. All three problems have been completed.

---

## Problem 1: Three Ways to Sum to n

**Location**: `src/problem1/index.js`

### Task
Implement 3 unique functions to calculate the sum from 1 to n.

### Solutions

1. **`sum_to_n_a`** - Mathematical Formula (Gauss's Formula)
   - Uses the closed-form formula: `n * (n + 1) / 2`
   - Time Complexity: O(1)
   - Space Complexity: O(1)

2. **`sum_to_n_b`** - Iterative Loop
   - Uses a simple for loop to accumulate the sum
   - Time Complexity: O(n)
   - Space Complexity: O(1)

3. **`sum_to_n_c`** - Recursive Approach
   - Uses recursion: `sum(n) = n + sum(n-1)`
   - Time Complexity: O(n)
   - Space Complexity: O(n) due to call stack

### Running the Code
```bash
node src/problem1/index.js
```

---

## Problem 2: Fancy Form (Currency Swap)

**Location**: `src/problem2/`

### Task
Create an intuitive and visually attractive currency swap form.

### Technology Stack
- **Vite** (bonus requirement met!)
- **React 19** with TypeScript
- **CSS** (no external UI libraries - custom design)

### Features
- Real-time token price fetching from the provided API
- Dynamic exchange rate calculation
- Searchable token dropdown with icons
- USD value display for amounts
- Input validation with error messages
- Loading states and animations
- Success modal with transaction summary
- Responsive design (mobile-friendly)
- Token icons from Switcheo repository (with fallback for missing icons)

### Running the Application
```bash
cd src/problem2
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

### Building for Production
```bash
cd src/problem2
npm run build
```

---

## Problem 3: Messy React

**Location**: `src/problem3/`

### Files
- `analysis.md` - Detailed analysis of all issues found
- `refactored.tsx` - Refactored version of the code

### Issues Identified (14 total)

#### Critical Issues
1. **Undefined variable** - `lhsPriority` is referenced but never declared
2. **Inverted filter logic** - Keeps zero/negative balances instead of positive ones
3. **Undefined `classes` object** - `classes.row` is never defined

#### High Severity
4. **Missing `blockchain` property** in `WalletBalance` interface
5. **Unused `formattedBalances`** - Computed but `sortedBalances` is used instead

#### Medium Severity
6. **Unnecessary dependency** - `prices` in useMemo dependency array
7. **Array index as React key** - Should use unique identifier
8. **No price validation** - `prices[currency]` may be undefined
9. **Use of `any` type** - Loses TypeScript benefits

#### Low Severity
10. **Incomplete sort comparison** - Missing explicit return for equal case
11. **`getPriority` inside component** - Recreated on every render
12. **Empty interface extension** - `Props extends BoxProps {}`
13. **Unused `children` destructuring**
14. **Missing memoization for rows**

See `src/problem3/analysis.md` for complete explanations and fixes.

---

## Repository Structure

```
├── readme.md           # This file
├── src/
│   ├── problem1/
│   │   └── index.js    # Three sum implementations
│   ├── problem2/       # Vite + React currency swap form
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── ...
│   │   ├── package.json
│   │   └── ...
│   └── problem3/
│       ├── analysis.md    # Detailed issue analysis
│       └── refactored.tsx # Refactored code
```

---

## Notes

- All solutions prioritize code quality, readability, and performance
- Problem 2 uses Vite as requested in the bonus section
- Problem 3 includes both analysis (more important per instructions) and refactored code

---

Thank you for reviewing my submission!
