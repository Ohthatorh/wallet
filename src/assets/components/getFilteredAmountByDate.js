export const getFilteredAmountByDate = (arr) => {
  let amountsByMonths = {}
  arr.forEach((transaction) => {
    const transactionDate = new Date(transaction.date)
    if (
      !Object.prototype.hasOwnProperty.call(
        amountsByMonths,
        transactionDate.getFullYear()
      )
    ) {
      amountsByMonths[transactionDate.getFullYear()] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]
    }
    amountsByMonths[transactionDate.getFullYear()][
      transactionDate.getMonth()
    ] += transaction.amount
  })
  return amountsByMonths
}
