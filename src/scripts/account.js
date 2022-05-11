import "./header.js";
import { convertDate } from "./addons/convertDate.js";
import "./addons/chart.js";
import { showMessage } from "./components/showMessage.js";

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
  const transactionsList = document.querySelector(".main__history-list");
  for (let key of transactionsList.children) {
    if (!key.classList.contains("list-titles")) key.remove();
  }
  const reversedData = data.reverse();
  reversedData.forEach((el, i) => {
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
