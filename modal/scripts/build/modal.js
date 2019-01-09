(function () {
  'use strict';

  function main() {
    const submitButton = document.getElementById("submit");
    const toggleLink = document.getElementById("toggle");
    const imageContainers = document.getElementsByClassName("image-container");
    
    submitButton.addEventListener("click", () => {
      alert("hi");
    });
    toggleLink.addEventListener("click", () => {
      alert("hola");
    });
    for (const ic of imageContainers) {
      ic.addEventListener("click", () => {
        alert("img");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", main);

}());
