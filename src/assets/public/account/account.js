import "../_config/header/header.js";
import { convertDate } from "../../components/convertDate/convertDate.js";
import "../../../dist/scripts/chart.js";
import { showMessage } from "../../components/showMessage/showMessage.js";

document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("allAccounts");
  if (localStorage.getItem("bearerToken") && document.location.search) {
    refreshAccount(document.location.search.substring(1));
  } else {
    document.location.href = "index.html";
  }
});
const accountTo = document.getElementById("account-to");
const amount = document.getElementById("amount");
const transferButtonElement = document.querySelector(".main__info-form-button");

document.querySelectorAll(".main__info-form-input").forEach((input) => {
  input.addEventListener("input", () => {
    if (accountTo.value.length && amount.value.length) {
      transferButtonElement.disabled = false;
    } else {
      transferButtonElement.disabled = true;
    }
  });
});

document.addEventListener("click", async (e) => {
  if (e.target.className === "main__panel-button button") {
    document.location.href = "cabinet.html";
  }
  if (e.target.className === "main__info-form-button") {
    e.preventDefault();
    const transferUrl = new URL(`http://localhost:3000/transfer-funds`);
    return await fetch(transferUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: document.location.search.substring(1),
        to: accountTo.value,
        amount: amount.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.payload) {
          showMessage("Перевод прошёл успешно!", "success");
          document.getElementById("balance").textContent =
            res.payload.balance + " ₽";
          accountTo.value = "";
          amount.value = "";
          // refreshChart(res.payload.transactions);
          refreshTable(res.payload.transactions);
        }
        if (res.error) {
          switch (res.error) {
            case "Invalid account from":
              showMessage(
                "Не указан адрес счёта списания, или этот счёт не принадлежит нам",
                "error"
              );
              break;
            case "Invalid account to":
              showMessage(
                "Не указан счёт зачисления, или этого счёта не существует",
                "error"
              );
              break;
            case "Invalid amount":
              showMessage(
                "Не указана сумма перевода, или она отрицательная",
                "error"
              );
              break;
            case "Overdraft prevented":
              showMessage("На счёте не хватает средств", "error");
              break;
          }
        }
      });
  }
  if (e.target.className === "chart") {
    document.location.href = `history.html?${document.location.search.substring(
      1
    )}`;
  }
});

async function refreshAccount(account) {
  const accountsUrl = new URL(`http://localhost:3000/account/${account}`);
  return await fetch(accountsUrl, {
    headers: {
      Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      // const allAccounts = [];
      // res.payload.transactions.forEach((transaction) => {
      //   if (!allAccounts.find((element) => element === transaction.to)) {
      //     allAccounts.push(transaction.to);
      //   }
      // });
      res.payload.transactions.reverse();
      document.getElementById("account-number").textContent =
        "№ " + res.payload.account;
      document.getElementById("balance").textContent =
        res.payload.balance + " ₽";
      refreshChart(res.payload.transactions);
      refreshTable(res.payload.transactions);
    });
}
function refreshChart(data) {
  const dateNow = new Date().getFullYear();
  const filteredData = getFilteredAmountByDate(data);
  const yearListElement = document.querySelector(".main__info-chart-year-list");
  let chart = new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
      labels: getMonthsFromTransactions(filteredData, dateNow),
      datasets: [
        {
          label: "Сумма в рублях",
          backgroundColor: ["#116AAC"],
          data: getAmountsFromTransactions(filteredData, dateNow),
        },
      ],
    },
    options: {
      legend: { display: false },
    },
  });
  Object.keys(filteredData).forEach((date) => {
    const yearLiElement = document.createElement("li");
    yearLiElement.classList.add(
      "main__info-chart-year",
      `${date == dateNow ? "active" : "none"}`
    );
    yearLiElement.textContent = date;
    yearLiElement.addEventListener("click", (e) => {
      document
        .querySelectorAll(".main__info-chart-year")
        .forEach((el) => el.classList.remove("active"));
      e.currentTarget.classList.add("active");
      chart.destroy();
      chart = new Chart(document.getElementById("chart"), {
        type: "bar",
        data: {
          labels: getMonthsFromTransactions(filteredData, date),
          datasets: [
            {
              label: "Сумма в рублях",
              backgroundColor: ["#116AAC"],
              data: getAmountsFromTransactions(filteredData, date),
            },
          ],
        },
        options: {
          legend: { display: false },
        },
      });
    });
    yearListElement.append(yearLiElement);
  });
}
function refreshTable(data) {
  const transactionsList = document.querySelector(".main__history-list");
  for (let key of transactionsList.children) {
    if (!key.classList.contains("list-titles")) key.remove();
  }
  data.forEach((el, i) => {
    if (i < 10) {
      const item = `
        <li class="main__history-item">
          <p class="main__history-item-text">
            ${el.from}
          </p>
          <p class="main__history-item-text">
            ${el.to}
          </p>
          <p class="main__history-item-text ${
            el.to === document.location.search.substring(1)
              ? "adding"
              : "decrease"
          }">
            ${el.amount} ₽
          </p>
          <p class="main__history-item-text">
            ${convertDate(el.date)}
          </p>
        </li>
      `;
      transactionsList.insertAdjacentHTML("beforeend", item);
      document
        .querySelectorAll(".main__history-item")
        [++i].addEventListener("click", () => {
          document.location.href = `history.html?${document.location.search.substring(
            1
          )}`;
        });
    }
  });
}
function getMonthsFromTransactions(arr, year) {
  let months = [];
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
}
function getAmountsFromTransactions(arr, year) {
  return arr[year].filter((el) => el > 0);
}
function getFilteredAmountByDate(arr) {
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
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ];
    }
    amountsByMonths[transactionDate.getFullYear()][
      transactionDate.getMonth()
    ] += transaction.amount;
  });
  return amountsByMonths;
}
