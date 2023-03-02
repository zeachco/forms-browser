export class AdItem {
  constructor(container, item) {
    this.container = container;
    const [type, ...rawPath] = item.split(/ ?: ?/);
    this.type = type.trim();
    this.path = rawPath.join(":").trim();
    this.#generateHTML();
  }

  exit() {
    this.el.classList.remove("enter");
    this.el.classList.add("exit");
    setTimeout(() => this.#remove(), 1000);
  }

  #remove() {
    this.container.removeChild(this.el);
  }

  #generateHTML() {
    this.el = document.createElement("div");
    this.el.classList.add("ad-item");
    switch (this.type) {
      case "video":
        const video = document.createElement("video");
        video.setAttribute("controls", "");
        video.setAttribute("autoplay", "");
        video.setAttribute("name", "media");
        const source = document.createElement("source");
        source.src = this.path;
        source.type = "video/mp4";
        video.appendChild(source);
        this.el.appendChild(video);
        break;
      case "image":
      case "img":
        const img = document.createElement("img");
        img.src = this.path;
        this.el.appendChild(img);
        break;
      case "site":
      case "frame":
        const frame = document.createElement("iframe");
        frame.src = this.path;
        frame.classList.add("ad-frame");
        this.el.appendChild(frame);
        break;
      default:
        console.log("Unknown file type");
    }
    this.container.appendChild(this.el);

    setTimeout(() => {
      this.el.classList.add("enter");
    });
  }
}
