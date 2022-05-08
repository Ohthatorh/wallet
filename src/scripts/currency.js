import "./addons/choices.min.js";
import "./header.js";

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("bearerToken")) {
    getCurrensies();
    refreshCurrensies();
    getCurrencyFeed();
  } else {
    document.location.href = "index.html";
  }
});

async function refreshCurrensies() {
  const currensiesUrl = new URL("http://localhost:3000/currencies");
  return await fetch(currensiesUrl, {
    headers: {
      Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      const yourCurrencyList = document.querySelector(
        ".main__yourcurrency-list"
      );
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
