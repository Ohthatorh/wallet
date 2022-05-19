import "./_showMessage.scss";
export const showMessage = (message, status) => {
  if (document.querySelector(".message"))
    document.querySelector(".message").remove();
  const errorMessageHtml = `
    <div class="message ${status}">
      <h2 class="title-message">${
        status === "error" ? "Ошибка!" : "Успешно!"
      }</h2>
      <p>${message}</p>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", errorMessageHtml);
  if (document.querySelector(".message")) {
    setTimeout(
      () => (document.querySelector(".message").style.opacity = "0"),
      3000
    );
  }
  document
    .querySelector(".message")
    .addEventListener("transitionend", function () {
      document.querySelector(".message").remove();
    });
};
