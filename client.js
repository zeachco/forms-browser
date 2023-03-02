let adsShowTimeout = 0;
let currentAd;
let previousAd;

function init(config) {
  console.table(config);

  const resetFormBtn = document.createElement("button");
  resetFormBtn.classList.add("reset-form");
  resetFormBtn.innerHTML = "Revenir au concours";
  document.body.appendChild(resetFormBtn);

  resetFormBtn.addEventListener("click", () => {
    window.location.reload();
  });

  const top = document.getElementById("top");

  window.sleep = function goToSleep() {
    console.log("goToSleep");
    top.classList.add("active");
    itemIndex = 0;
    showNextItem();
  };

  window.wake = function wakeUp() {
    console.log("wakeUp");
    top.classList.remove("active");
    clearTimeout(adsShowTimeout);
  };

  function showNextItem() {
    itemIndex++;
    if (itemIndex >= config.ads_items.length) {
      itemIndex = 0;
    }

    previousAd = currentAd;
    currentAd = new AdItem(top, config.ads_items[itemIndex]);

    if (previousAd) {
      previousAd.exit();
    }

    clearTimeout(adsShowTimeout);
    adsShowTimeout = setTimeout(showNextItem, +config.ads_show_time_ms);
  }
}

function toggleTop(top) {
  top.classList.toggle("active");
}

function createAds(top, items) {
  items.forEach((item, index) => {
    const adItem = document.createElement("div");
    adItem.classList.add("ad-item");
    adItem.setAttribute("data-index", index);
    adItem.setAttribute("meta-path", item);

    const [type, ...rawPath] = item.split(/ ?: ?/);
    const path = rawPath.join(":").trim();

    top.appendChild(adItem);
  });
}

function createAdd() {
  const adItem = document.createElement("div");
  adItem.classList.add("ad-item");
  adItem.setAttribute("data-index", index);
  adItem.setAttribute("meta-path", item);

  const [type, ...rawPath] = item.split(/ ?: ?/);
  const path = rawPath.join(":").trim();

  switch (type.trim()) {
    case "video":
      const video = document.createElement("video");
      video.setAttribute("controls", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("name", "media");
      const source = document.createElement("source");
      source.src = path;
      source.type = "video/mp4";
      video.appendChild(source);

      video.src = path;
      adItem.appendChild(video);
      break;
    case "image":
    case "img":
      const img = document.createElement("img");
      img.src = path;
      adItem.appendChild(img);
      break;
    case "site":
    case "frame":
      const frame = document.createElement("iframe");
      frame.src = path;
      frame.classList.add("ad-frame");
      adItem.appendChild(frame);
      break;
    default:
      console.log("Unknown file type");
  }
  top.appendChild(adItem);
}

class AdItem {
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
