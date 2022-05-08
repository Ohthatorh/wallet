document.addEventListener("click", (e) => {
  if (e.target.id === "logout") {
    localStorage.clear();
    document.location.href = "index.html";
  }
  if (e.target.id === "atms") document.location.href = "atms.html";
  if (e.target.id === "currency") document.location.href = "currency.html";
  if (e.target.id === "accounts" || e.target.id === "logo")
    document.location.href = "cabinet.html";
});
