import "./_index.scss";
import "../_config/header/header.js";
import { showMessage } from "../../components/showMessage/showMessage.js";
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("bearerToken"))
    document.location.href = "cabinet.html";
  const loginInputElement = document.querySelector("#login");
  const passwordInputElement = document.querySelector("#password");
  const authorizationButton = document.querySelector(".main__form-button");
  const enterFields = document.querySelectorAll(".main__form-input");

  document.addEventListener("keydown", (e) => {
    if (e.keyCode == 13 && !authorizationButton.classList.contains("disabled"))
      authorizationButton.click();
  });

  enterFields.forEach((input) => {
    input.addEventListener("input", (e) => {
      e.currentTarget.value = e.currentTarget.value.replace(/\s/g, "");
      enterFields.forEach(el => {
        if (el.value.length < 6){
          el.classList.add("error-field");
        }
        else {
          el.classList.remove("error-field");
        }
      })
      if (document.querySelector(".error-field")) {
        authorizationButton.disabled = true;
      } else {
        authorizationButton.disabled = false;
      }
    });
  });

  authorizationButton.addEventListener("click", async (e) => {
    e.preventDefault();
    authorizationButton.classList.add("loading");
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
        authorizationButton.classList.remove("loading");
        if (res.payload) {
          localStorage.setItem("bearerToken", res.payload.token);
          document.location.href = "cabinet.html";
        }
        if (res.error) {
          showMessage("Неверный логин или пароль", "error");
        }
      });
  });
});
