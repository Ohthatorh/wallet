import "./header.js";
import { convertDate } from "./addons/convertDate.js";
import "./addons/chart.js";

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("bearerToken") && document.location.search) {
    refreshAccount(document.location.search.substring(1));
  } else {
    document.location.href = "index.html";
  }
});

document.addEventListener("click", async (e) => {
  if (e.target.className === "main__panel-button button") {
    document.location.href = "cabinet.html";
  }
  if (e.target.className === "main__info-form-button") {
    e.preventDefault();
    const transferUrl = new URL(`http://localhost:3000/transfer-funds`);
    const accountFrom = document
      .getElementById("account-number")
      .textContent.substring(1);
    const accountTo = document.getElementById("account-to").value;
    const amount = document.getElementById("amount").value;
    console.log(accountFrom);
    return await fetch(transferUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
      },
      body: JSON.stringify({
        from: accountFrom,
        to: accountTo,
        amount: amount,
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
    // .then((res) => {
    //   document.getElementById("balance").textContent =
    //     res.payload.balance + " ₽";
    //   refreshChart(res.payload.transactions);
    //   refreshTable(res.payload.transactions);
    // });
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
      console.log(res);
      document.getElementById("account-number").textContent =
        "№ " + res.payload.account;
      document.getElementById("balance").textContent =
        res.payload.balance + " ₽";
      refreshChart(res.payload.transactions);
      refreshTable(res.payload.transactions);
    });
}

function refreshChart(data) {
  const chart = new Chart(document.getElementById("bar-chart"), {
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
  });
}
function refreshTable(data) {
  const reversedData = data.reverse();
  reversedData.forEach((el, i) => {
    if (i < 11) {
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
      document
        .querySelector(".main__history-list")
        .insertAdjacentHTML("beforeend", item);
    }
  });
}
