function main() {
  alert("Hello");
}

// Taken from https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded#Checking_whether_loading_is_already_complete.
if (document.readyState === "loading") {  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", main);
} else {  // `DOMContentLoaded` has already fired
  main();
}