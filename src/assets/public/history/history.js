import "../_config/header/header.js";
import "../../../dist/scripts/chart.js";
import { convertDate } from "../../components/convertDate/convertDate.js";

document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("allAccounts");
  if (localStorage.getItem("bearerToken") && document.location.search) {
    refreshCharts(document.location.search.substring(1));
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

async function refreshCharts(account) {
  const accountsUrl = new URL(`http://localhost:3000/account/${account}`);
  return await fetch(accountsUrl, {
    headers: {
      Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      refreshTable(res.payload.transactions);
      document.getElementById("account-number").textContent =
        "№ " + res.payload.account;
      document.getElementById("balance").textContent =
        res.payload.balance + " ₽";
      const chartDynamic = new Chart(
        document.getElementById("bar-chart-dynamic"),
        {
          type: "bar",
          data: {
            labels: ["мар", "апр", "май", "июн", "июл", "авг"],
            datasets: [
              {
                backgroundColor: ["#116ACC"],
                data: [3000, 2000, 1000, 502, 402, 112],
              },
            ],
          },
          options: {
            plugins: false,
          },
        }
      );
      const chartTransactions = new Chart(
        document.getElementById("bar-chart-transactions"),
        {
          type: "bar",
          data: {
            labels: ["мар", "апр", "май", "июн", "июл", "авг"],
            datasets: [
              {
                backgroundColor: ["#116ACC"],
                data: [3000, 2000, 1000, 502, 402, 112],
              },
            ],
          },
          options: {
            plugins: false,
          },
        }
      );
    });
}

function refreshTable(data) {
  const transactionsList = document.querySelector(".main__history-list");
  for (let key of transactionsList.children) {
    if (!key.classList.contains("list-titles")) key.remove();
  }
  const reversedData = data.reverse();
  reversedData.forEach((el, i) => {
    if (i < 5) {
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
    }
  });
}
