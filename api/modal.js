export default class Modal {
  constructor() {
    const width = "500";
    const height = "600";
    
    const md = document.createElement("div");
    md.style.display = "none";
    md.style.position = "fixed";
    md.style["z-index"] = "2000000";
    md.style.left = "0";
    md.style.top = "0";
    md.style.width = "100%";
    md.style.height = "100%";
    md.style["background-color"] = "rgba(0,0,0,0.5)";
    
    const mc = document.createElement("div");
    mc.style.position = "relative";
    mc.style.margin = "auto";
    mc.style.width = `${width}px`;
    mc.style.height = `${height}px`;
    mc.style["box-shadow"] = "0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)"
    mc.style.top = "50%";
    mc.style["margin-top"] = `-${parseInt(height) / 2}px`;
    
    const iframe = document.createElement("iframe");
    iframe.src = "modal/index.html";
    iframe.width = width;
    iframe.height = height;
    iframe.style.border = "none";
    
    const xButton = document.createElement("span");
    xButton.innerHTML = "&times;";
    xButton.style.position = "absolute";
    xButton.style.right = "0px";
    xButton.style.top = "-9px";
    xButton.style.cursor = "pointer";
    xButton.style.color = "white";
    xButton.style["font-size"] = "36px";
    xButton.style["font-weight"] = "bold";
    xButton.addEventListener("click", () => {
      md.style.display = "none";
    });
    
    mc.appendChild(iframe);
    md.appendChild(xButton);
    md.appendChild(mc);
    document.body.appendChild(md);
    this.md = md;
    this.mc = mc;
  }
  
  open() {
    this.md.style.display = "block";
    this.mc.animate([ 
      { opacity: 0 }, 
      { opacity: 1 }
    ], { ease: "ease", duration: 400 });
  }
}