document.addEventListener("click", (e) => {
  if (e.target.id === "logout") {
    localStorage.clear();
    document.location.href = "index.html";
  }
});
