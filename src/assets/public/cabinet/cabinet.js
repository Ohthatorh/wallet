import { showMessage } from "../../components/showMessage/showMessage.js";
import { convertDate } from "../../components/convertDate/convertDate.js";
import "../cabinet/_cabinet.scss";
import "../_config/header/header.js";
document.addEventListener("DOMContentLoaded", () => {
  const selectWrap = document.querySelector(".main__wrap-sort");
  if (localStorage.getItem("bearerToken")) {
    refreshAccounts();
  } else {
    document.location.href = "index.html";
  }
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
    if (e.target.className == "main__wrap-sort-item is-active") refreshAccounts(e.target.id)
  });
  async function refreshAccounts(sort) {
    const IS_SORT = sort ? sort : false;
    const accountsUrl = new URL("http://localhost:3000/accounts");
    return await fetch(accountsUrl, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        generateBody();
        if (IS_SORT) {
          switch(IS_SORT) {
            case 'sort-balance':
              res.payload.sort((a,b) => a.balance - b.balance);
              break;
            case 'sort-number':
              res.payload.sort((a,b) => a.account - b.account);
              break;
            case 'sort-transaction':
              res.payload.sort((a,b) => (a.transactions[0] && b.transactions[0]) ? a.transactions[0].date - b.transactions[0].date : null);
              break;
          }
        }
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
              ${e.balance} ??
            </p>
            <p class="main__wrap-item-date">
              ?????????????????? ????????????????????:<br>
              <span>
              ${
                e.transactions[0]
                  ? convertDate(e.transactions[e.transactions.length - 1].date)
                  : `??????????????????????`
              }
              </span>
            </p>
          </div>
          <button class="main__wrap-item-button">
            ??????????????
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
        ????????????????????
      </p>
      <ul class="main__wrap-sort-list">
        <li id="sort-account" class="main__wrap-sort-item">???? ????????????</li>
        <li id="sort-balance" class="main__wrap-sort-item">???? ??????????????</li>
        <li id="sort-transaction" class="main__wrap-sort-item">???? ?????????????????? ????????????????????</li>
      </ul>
    `;
    const createAccountButtonElement =
      document.querySelector(".main__wrap-button");
    createAccountButtonElement.classList.remove("skeleton");
    createAccountButtonElement.addEventListener("click", async () => {
      createAccountButtonElement.classList.add("loading");
      const createAccountUrl = new URL("http://localhost:3000/create-account");
      await fetch(createAccountUrl, {
        method: "POST",
        headers: {
          Authorization: `Basic ${localStorage.getItem("bearerToken")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          createAccountButtonElement.classList.remove("loading");
          if (res.payload) {
            showMessage("???????? ?????????????? ????????????!", "success");
            refreshAccounts();
          }
          if (res.error) {
            showMessage(
              "??????-???? ?????????? ???? ??????, ???????????????????? ???????????????????? ?? ????????????????????????????",
              "error"
            );
          }
        });
    });
    selectWrap.insertAdjacentHTML("beforeend", sortBody);
  }
});
