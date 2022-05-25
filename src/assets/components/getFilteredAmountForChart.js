export const getFilteredAmountForChart = (arr, year) => {
  const amountsAdding = [];
  const amountsDecrease = [];
  arr[year].forEach((month) => {
    if (month.amount === 0) return;
    amountsAdding.push(month.adding);
    amountsDecrease.push(month.decrease);
  });
  return { amountsDecrease, amountsAdding };
};
