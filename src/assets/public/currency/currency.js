import { showMessage } from "../../components/showMessage/showMessage.js";
import "../../../dist/scripts/choices.js";
import "../_config/header/header.js";

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("bearerToken")) {
    getCurrensies();
    refreshCurrensies();
    getCurrencyFeed();
  } else {
    document.location.href = "index.html";
  }
});

const amountInputElement = document.querySelector("#amount");
const exchangeButtonElement = document.querySelector(".main__exchange-button");
amountInputElement.addEventListener("input", (e) => {
  if (e.currentTarget.value.length <= 0) {
    exchangeButtonElement.disabled = true;
  } else {
    exchangeButtonElement.disabled = false;
  }
});

document.addEventListener("click", (e) => {
  if (e.target.className === "main__exchange-button") {
    e.preventDefault();
    currencyBuy();
  }
});

async function refreshCurrensies() {
  const yourCurrencyList = document.querySelector(".main__yourcurrency-list");
  yourCurrencyList.innerHTML = "";
  const currensiesUrl = new URL("http://localhost:3000/currencies");
  return await fetch(currensiesUrl, {
    headers: {
      Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      for (let key in res.payload) {
        if (res.payload[key].amount !== 0) {
          const htmlElement = `
            <li>
              <p class="left">${res.payload[key].code}</p>
              <p class="right">${res.payload[key].amount}</p>
          </li>
          `;
          yourCurrencyList.insertAdjacentHTML("beforeend", htmlElement);
        }
      }
    });
}

async function getCurrensies() {
  const allCurrensiesUrl = new URL("http://localhost:3000/all-currencies");
  return await fetch(allCurrensiesUrl, {
    headers: {
      Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      const selectElements = document.querySelectorAll(".js-select");
      const selectOptions = {
        choices: res.payload.map((el) => {
          return {
            value: el,
            label: el,
          };
        }),
        allowHTML: false,
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: "",
      };
      selectElements.forEach((el) => new Choices(el, selectOptions));
    });
}

async function getCurrencyFeed() {
  const websocketCurrency = new WebSocket("ws://localhost:3000/currency-feed");
  const currencyList = document.querySelector(".main__right-column-list");
  websocketCurrency.onmessage = function (event) {
    const message = JSON.parse(event.data);
    const currencyElement = `
      <li class="${message.change === 1 ? "up" : "down"}">
        <p class="left">${message.from}/${message.to}</p>
        <p class="right">${message.rate}</p>
      </li>
    `;
    currencyList.insertAdjacentHTML("afterbegin", currencyElement);
  };
}

async function currencyBuy() {
  const currencyBuyUrl = new URL("http://localhost:3000/currency-buy");
  return await fetch(currencyBuyUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: document.querySelector("#selectFrom").value,
      to: document.querySelector("#selectTo").value,
      amount: amountInputElement.value,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.payload) {
        amountInputElement.value = "";
        exchangeButtonElement.disabled = true;
        showMessage("Обмен прошёл успешно!", "success");
        refreshCurrensies();
      }
      if (res.error) {
        switch (res.error) {
          case "Unknown currency code":
            showMessage(
              "Неверный валютный код, обратитесь к администратору",
              "error"
            );
            break;
          case "Not enough currency":
            showMessage("На валютном счёте списания нет средств", "error");
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
