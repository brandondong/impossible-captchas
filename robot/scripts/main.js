function main() {
  const checkbox = document.getElementById("checkbox");
  checkbox.addEventListener("click", () => {
    checkbox.classList.add("success");
  });
}

document.addEventListener("DOMContentLoaded", main);