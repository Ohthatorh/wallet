import "regenerator-runtime/runtime";
import { showMessage } from "../../components/showMessage/showMessage.js";
import "../_config/header/header.js";
import "../index/index.css";
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("bearerToken"))
    document.location.href = "cabinet.html";
});

const loginInputElement = document.querySelector("#login");
const passwordInputElement = document.querySelector("#password");
const authorizationLink = document.querySelector(".main__form-link");
const enterFields = document.querySelectorAll(".main__form-input");

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 13 && !authorizationLink.classList.contains("disabled"))
    authorizationLink.click();
});

loginInputElement.value = "developer";
passwordInputElement.value = "skillbox";

enterFields.forEach((input) => {
  input.addEventListener("input", (e) => {
    e.currentTarget.value = e.currentTarget.value.replace(/\s/g, "");
    if (e.currentTarget.value.length < 6)
      e.currentTarget.classList.add("error-field");
    else {
      e.currentTarget.classList.remove("error-field");
    }
    if (document.querySelector(".error-field")) {
      authorizationLink.classList.add("disabled");
    } else {
      authorizationLink.classList.remove("disabled");
    }
  });
});

authorizationLink.addEventListener("click", async (e) => {
  e.preventDefault();
  const loginUrl = new URL("http://localhost:3000/login");
  const paramsAuth = {
    login: loginInputElement.value,
    password: passwordInputElement.value,
  };
  await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paramsAuth),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.payload) {
        localStorage.setItem("bearerToken", res.payload.token);
        document.location.href = "cabinet.html";
      }
      if (res.error) {
        showMessage("Неверный логин или пароль", "error");
      }
    });
});
