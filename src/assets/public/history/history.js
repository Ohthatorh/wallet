import "../history/_history.scss";
import "../_config/header/header.js";
import { convertDate } from "../../components/convertDate/convertDate.js";
import { getFilteredAmountByDate } from "../../components/getFilteredAmountByDate.js";
import { getMonthsFromTransactions } from "../../components/getMonthsFromTransactions.js";
import { getAmountsFromTransactions } from "../../components/getAmountsFromTransactions.js";
import "../../../dist/scripts/chart.js";

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("bearerToken") && document.location.search) {
    refreshAccount(document.location.search.substring(1));
  } else {
    document.location.href = "index.html";
  }
});

document.addEventListener("click", (e) => {
  if (e.target.className === "main__panel-button button") {
    document.location.href = `account.html?${document.location.search.substring(
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
      const reverseTransactions = res.payload.transactions.slice().reverse();
      refreshCharts(reverseTransactions);
      refreshTable(reverseTransactions, res.payload);
    });
}

function refreshCharts(data) {
  const yearNow = new Date().getFullYear();
  const filteredData = getFilteredAmountByDate(
    data,
    document.location.search.substring(1)
  );
  const chartDynamicElement = document.querySelector(".chart-dynamic");
  const chartTransactionsElement = document.querySelector(".chart-transaction");
  chartDynamicElement.classList.remove("skeleton");
  chartTransactionsElement.classList.remove("skeleton");
  const chartBody = (chart) => {
    return `
      <h3 class="main__info-chart-title title">
        ${
          chart === "dynamic"
            ? "Динамика баланса"
            : "Соотношение входящих исходящих транзакций"
        }
      </h3>
      <canvas class="chart" id="${
        chart === "dynamic" ? "bar-chart-dynamic" : "bar-chart-transactions"
      }" width="510" height="165"></canvas>
    `;
  };
  chartDynamicElement.insertAdjacentHTML(
    "beforeend",
    chartBody("dynamic", filteredData)
  );
  chartTransactionsElement.insertAdjacentHTML(
    "beforeend",
    chartBody("transactions", filteredData)
  );
  const chartDynamic = new Chart(document.getElementById("bar-chart-dynamic"), {
    type: "bar",
    data: {
      labels: getMonthsFromTransactions(filteredData, yearNow),
      datasets: [
        {
          label: "Сумма в рублях",
          backgroundColor: ["#116AAC"],
          data: getAmountsFromTransactions(filteredData, yearNow),
        },
      ],
    },
    options: {
      legend: { display: false },
    },
  });
  const chartTransactions = new Chart(
    document.getElementById("bar-chart-transactions"),
    {
      type: "bar",
      data: {
        labels: getMonthsFromTransactions(filteredData, yearNow),
        datasets: [
          {
            label: "Сумма в рублях",
            backgroundColor: ["red", "green"],
            data: [[20, 200], 200],
          },
        ],
      },
      options: {
        legend: { display: false },
      },
    }
  );
  console.log(chartTransactions);
}

function refreshTable(transactions, account) {
  const transactionsSection = document.querySelector(".main__history");
  if (transactionsSection.classList.contains("skeleton")) {
    transactionsSection.classList.remove("skeleton");
    const transactionBody = `
      <h3 class="main__history-title title">
        История переводов
      </h3>
      <ul class="main__history-list">
        <li class="main__history-item list-titles">
          <p class="main__history-item-title">
            Счёт отправителя
          </p>
          <p class="main__history-item-title">
            Счёт получателя
          </p>
          <p class="main__history-item-title">
            Сумма
          </p>
          <p class="main__history-item-title">
            Дата
          </p>
        </li>
      </ul>
    `;
    transactionsSection.insertAdjacentHTML("beforeend", transactionBody);
  }
  const transactionsList = document.querySelector(".main__history-list");
  const transactionsItems = document.querySelectorAll(".main__history-item");
  transactionsItems.forEach((el, i) => (i !== 0 ? el.remove() : []));
  transactions.forEach((el, i) => {
    if (i < 5) {
      const item = `
        <li class="main__history-item">
          <p class="main__history-item-text">
          <span>Счёт отправителя</span>
            ${el.from}
          </p>
          <p class="main__history-item-text">
          <span>Счёт получателя</span>
            ${el.to}
          </p>
          <p class="main__history-item-text ${
            el.to === document.location.search.substring(1)
              ? "adding"
              : "decrease"
          }">
          <span>Сумма</span>
            ${el.amount} ₽
          </p>
          <p class="main__history-item-text">
          <span>Дата</span>
            ${convertDate(el.date)}
          </p>
        </li>
      `;
      transactionsList.insertAdjacentHTML("beforeend", item);
    }
  });
  const accountNumberElement = document.getElementById("account-number");
  const balanceElement = document.getElementById("balance");
  accountNumberElement.classList.remove("skeleton", "skeleton-title");
  accountNumberElement.textContent = `№ ${account.account}`;
  balanceElement.innerHTML = "";
  balanceElement.classList.remove("skeleton", "skeleton-text");
  balanceElement.insertAdjacentHTML(
    "beforeend",
    `Баланс: <span>${account.balance} ₽</span>`
  );
}
