import { showMessage } from "../../components/showMessage/showMessage.js";
import { convertDate } from "../../components/convertDate/convertDate.js";
import "../cabinet/cabinet.css";
import "../_config/header/header.js";

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("bearerToken")) {
    refreshAccounts();
  } else {
    document.location.href = "index.html";
  }
});
const selectWrap = document.querySelector(".main__wrap-sort");
document.addEventListener("keydown", (e) => {
  if (e.keyCode == 27) {
    if (selectWrap.classList.contains("is-active"))
      selectWrap.classList.remove("is-active");
  }
});
document.addEventListener("click", async (e) => {
  const withinBoundaries = e.composedPath().includes(selectWrap);
  if (!withinBoundaries) selectWrap.classList.remove("is-active");
  if (
    e.target.className === "main__wrap-sort" ||
    e.target.className === "main__wrap-sort-placeholder"
  ) {
    selectWrap.classList.toggle("is-active");
  }
  if (
    e.target.className == "main__wrap-sort-item" ||
    e.target.className == "main__wrap-sort-item is-active"
  ) {
    e.target.classList.toggle("is-active");
  }
});
async function refreshAccounts() {
  const accountsUrl = new URL("http://localhost:3000/accounts");
  return await fetch(accountsUrl, {
    headers: {
      Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      generateBody();
      generateAccounts(res.payload);
    });
}
function generateAccounts(payload) {
  const listAccountsElement = document.querySelector(".main__wrap-list");
  listAccountsElement.innerHTML = "";
  payload.forEach((e, i) => {
    const item = `
      <li class="main__wrap-item">
        <div class="main__wrap-item-description">
          <h2 class="main__wrap-item-title">
            ${e.account}
          </h2>
          <p class="main__wrap-item-sum">
            ${e.balance} Р
          </p>
          <p class="main__wrap-item-date">
            Последняя транзакция:<br>
            <span>
            ${
              e.transactions[0]
                ? convertDate(e.transactions[e.transactions.length - 1].date)
                : `Отсутствует`
            }
            </span>
          </p>
        </div>
        <button class="main__wrap-item-button">
          Открыть
        </button>
    </li>
    `;
    listAccountsElement.insertAdjacentHTML("beforeend", item);
    document
      .querySelectorAll(`.main__wrap-item-button`)
      [i].addEventListener(
        "click",
        () => (document.location.href = `account.html?${e.account}`)
      );
  });
}

function generateBody() {
  if (selectWrap.children.length) return;
  selectWrap.classList.remove("skeleton");
  const sortBody = `
    <p class="main__wrap-sort-placeholder">
      Сортировка
    </p>
    <ul class="main__wrap-sort-list">
      <li class="main__wrap-sort-item">По номеру</li>
      <li class="main__wrap-sort-item">По балансу</li>
      <li class="main__wrap-sort-item">По последней транзакции</li>
    </ul>
  `;
  const createAccountButtonElement =
    document.querySelector(".main__wrap-button");
  createAccountButtonElement.classList.remove("skeleton");
  createAccountButtonElement.addEventListener("click", async () => {
    const createAccountUrl = new URL("http://localhost:3000/create-account");
    await fetch(createAccountUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.payload) {
          showMessage("Счёт успешно создан!", "success");
          refreshAccounts();
        }
        if (res.error) {
          showMessage(
            "Что-то пошло не так, пожалуйста обратитесь к администратору",
            "error"
          );
        }
      });
  });
  selectWrap.insertAdjacentHTML("beforeend", sortBody);
}
