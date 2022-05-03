document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("bearerToken"))
    document.location.href = "cabinet.html";
});
const authorizationLink = document.querySelector(".main__form-link");
authorizationLink.addEventListener("click", async (e) => {
  e.preventDefault();
  const loginUrl = new URL("http://localhost:3000/login");
  const paramsAuth = {
    login: "developer",
    password: "skillbox",
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
    });
});
