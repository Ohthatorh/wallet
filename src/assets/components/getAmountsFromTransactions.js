export const getAmountsFromTransactions = (arr, year) => {
  if (Object.keys(arr).length === 0) return;
  const result = [];
  arr[year].forEach((el) => {
    if (el.amount > 0) result.push(el.amount.toFixed(2));
  });
  return result;
};
