import { showMessage } from "../../components/showMessage/showMessage.js";
import "../../../dist/styles/choices.min.css";
import "../../../dist/scripts/choices.js";
import "../_config/header/header.js";
import "../currency/currency.css";

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("bearerToken")) {
    refreshCurrensies();
  } else {
    document.location.href = "index.html";
  }
});

function generateBody() {
  const yourCurrencyElement = document.querySelector(".main__yourcurrency");
  yourCurrencyElement.classList.remove("skeleton");
  const yourCurrencyBody = `
    <h3 class="main__yourcurrency-title title">
      Ваши валюты
    </h3>
    <ul class="main__yourcurrency-list">
    </ul>
  `;
  yourCurrencyElement.insertAdjacentHTML("beforeend", yourCurrencyBody);
  const exchangeElement = document.querySelector(".main__exchange");
  exchangeElement.classList.remove("skeleton");
  const exchangeBody = `
    <h3 class="main__exchange-title title">
      Обмен валюты
    </h3>
    <div class="main__exchange-left">
      <label class="main__exchange-label">
        Из
        <select class="js-select" id="selectFrom" name="Из">
        </select>
      </label>
      <label class="main__exchange-label">
        В
        <select class="js-select" id="selectTo" name="В">
        </select>
      </label>
      <label class="main__exchange-label">
        Сумма
        <input id="amount" type="number" class="main__exchange-input" placeholder="Сумма">
      </label>
    </div>
    <button disabled class="main__exchange-button">
      Обменять
    </button>
    `;
  exchangeElement.insertAdjacentHTML("beforeend", exchangeBody);
  const amountInputElement = document.querySelector("#amount");
  const exchangeButtonElement = document.querySelector(
    ".main__exchange-button"
  );
  amountInputElement.addEventListener("input", (e) => {
    if (e.currentTarget.value.length <= 0) {
      exchangeButtonElement.disabled = true;
    } else {
      exchangeButtonElement.disabled = false;
    }
  });
  exchangeButtonElement.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.classList.add("loading");
    currencyBuy(exchangeButtonElement, amountInputElement);
  });
}

async function refreshCurrensies() {
  const currensiesUrl = new URL("http://localhost:3000/currencies");
  return await fetch(currensiesUrl, {
    headers: {
      Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (
        document
          .querySelector(".main__yourcurrency")
          .classList.contains("skeleton")
      ) {
        generateBody();
        getCurrensies();
        getCurrencyFeed();
      }
      const yourCurrencyList = document.querySelector(
        ".main__yourcurrency-list"
      );
      yourCurrencyList.innerHTML = "";
      for (let key in res.payload) {
        if (res.payload[key].amount !== 0) {
          const liElement = `
            <li>
              <p class="left">${res.payload[key].code}</p>
              <p class="right">${res.payload[key].amount.toFixed(2)}</p>
            </li>
          `;
          yourCurrencyList.insertAdjacentHTML("beforeend", liElement);
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
  const currencyfeedElement = document.querySelector(".main__right-column");
  currencyfeedElement.classList.remove("skeleton");
  const currencyfeedBody = `
    <h3 class="main__right-column-title title">
      Изменение курсов в режиме реального времени
    </h3>
    <ul class="main__right-column-list">
    </ul>
  `;
  currencyfeedElement.insertAdjacentHTML("beforeend", currencyfeedBody);
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

async function currencyBuy(exchangeButtonElement, amountInputElement) {
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
      exchangeButtonElement.classList.remove("loading");
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
