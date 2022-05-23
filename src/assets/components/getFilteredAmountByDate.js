export const getFilteredAmountByDate = (arr, account) => {
  let amountsByMonths = {};
  arr.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    if (
      !Object.prototype.hasOwnProperty.call(
        amountsByMonths,
        transactionDate.getFullYear()
      )
    ) {
      amountsByMonths[transactionDate.getFullYear()] = [
        { adding: 0, decrease: 0, amount: 0 },
        { adding: 0, decrease: 0, amount: 0 },
        { adding: 0, decrease: 0, amount: 0 },
        { adding: 0, decrease: 0, amount: 0 },
        { adding: 0, decrease: 0, amount: 0 },
        { adding: 0, decrease: 0, amount: 0 },
        { adding: 0, decrease: 0, amount: 0 },
        { adding: 0, decrease: 0, amount: 0 },
        { adding: 0, decrease: 0, amount: 0 },
        { adding: 0, decrease: 0, amount: 0 },
        { adding: 0, decrease: 0, amount: 0 },
        { adding: 0, decrease: 0, amount: 0 },
      ];
    }
    if (transaction.to == account) {
      amountsByMonths[transactionDate.getFullYear()][
        transactionDate.getMonth()
      ]["adding"] += transaction.amount;
      amountsByMonths[transactionDate.getFullYear()][
        transactionDate.getMonth()
      ]["amount"] += transaction.amount;
    } else {
      amountsByMonths[transactionDate.getFullYear()][
        transactionDate.getMonth()
      ]["decrease"] += transaction.amount;
    }
  });
  return amountsByMonths;
};
