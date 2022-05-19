export const getMonthsFromTransactions = (arr, year) => {
  let months = [];
  if (Object.keys(arr).length === 0) return;
  arr[year].forEach((el, i) => {
    if (el > 0) {
      switch (i) {
        case 0:
          months.push("Январь");
          break;
        case 1:
          months.push("Февраль");
          break;
        case 2:
          months.push("Март");
          break;
        case 3:
          months.push("Апрель");
          break;
        case 4:
          months.push("Май");
          break;
        case 5:
          months.push("Июнь");
          break;
        case 6:
          months.push("Июль");
          break;
        case 7:
          months.push("Август");
          break;
        case 8:
          months.push("Сентябрь");
          break;
        case 9:
          months.push("Октябрь");
          break;
        case 10:
          months.push("Ноябрь");
          break;
        case 11:
          months.push("Декабрь");
          break;
      }
    }
  });
  return months;
};
