var sum_to_n_a = function(n) {
    if (n >= 0) {
        return (n * (n + 1)) / 2;
    } else {
        return (n * (Math.abs(n) + 1)) / 2;
    }
};

var sum_to_n_b = function(n) {
    let sum = 0;
    if (n >= 0) {
        for (let i = 1; i <= n; i++) {
            sum += i;
        }
    } else {
        for (let i = n; i <= -1; i++) {
            sum += i;
        }
    }
    return sum;
};

var sum_to_n_c = function(n) {
    if (n === 0) {
        return 0;
    } else if (n > 0) {
        return n + sum_to_n_c(n - 1);
    } else {
        return n + sum_to_n_c(n + 1);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };
}

console.log("Testing sum_to_n implementations:\n");

const testCases = [0, 1, 5, 10, 100, -3, -5];

testCases.forEach(n => {
    const a = sum_to_n_a(n);
    const b = sum_to_n_b(n);
    const c = sum_to_n_c(n);

    console.log(`n = ${n}:`);
    console.log(`  sum_to_n_a (Formula):    ${a}`);
    console.log(`  sum_to_n_b (Iterative):  ${b}`);
    console.log(`  sum_to_n_c (Recursive):  ${c}`);
    console.log(`  All match: ${a === b && b === c ? '✓' : '✗'}\n`);
});
