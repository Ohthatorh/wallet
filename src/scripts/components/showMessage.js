export const showMessage = (message, status) => {
  if (document.querySelector(".message"))
    document.querySelector(".message").remove();
  const errorMessageHtml = `
    <div class="message" style="padding: 20px 60px; position: fixed; bottom: 20px; right: 20px; width: 400px; border-radius: 10px; box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.25); border-left: 10px solid var(${
      status === "error" ? "--red-color" : "--green-color"
    }); background-color: var(--white-color); background-image: url('/src/img/${status}.svg'); background-repeat: no-repeat; background-position: 10px center; opacity: 1; transition: opacity 2s ease; background-size: 40px;">
      <h2 class="title" style="font-size: 16px; margin-bottom: 10px;">${
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
