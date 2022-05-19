export const getAmountsFromTransactions = (arr, year) => {
  if (Object.keys(arr).length === 0) return;
  return arr[year].filter((el) => el > 0);
};
