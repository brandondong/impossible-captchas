export default function createCaptchaElement(elem) {
  const width = "300";
  const height = "70";
  
  const fixedSizeDiv = document.createElement("div");
  fixedSizeDiv.style.width = `${width}px`;
  fixedSizeDiv.style.height = `${height}px`;
  
  const iframe = document.createElement("iframe");
  iframe.src = "robot/index.html";
  iframe.width = width;
  iframe.height = height;
  iframe.style.border = "none";
  
  fixedSizeDiv.appendChild(iframe);
  elem.appendChild(fixedSizeDiv);
}