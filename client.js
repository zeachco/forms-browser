let idleTimeout = 0;
let adsShowTimeout = 0;

function init(config) {
  const resetFormBtn = document.createElement("button");
  resetFormBtn.classList.add("reset-form");
  resetFormBtn.innerHTML = "Revenir au concours";
  document.body.appendChild(resetFormBtn);

  resetFormBtn.addEventListener("click", () => {
    window.location.reload();
  });

  const top = document.getElementById("top");

  createAds(top, config.ads_idle_items);

  console.log(config);

  // Idle detection
  window.addEventListener("mousemove", resetIdleTimer);
  window.addEventListener("mousedown", resetIdleTimer);
  window.addEventListener("keypress", resetIdleTimer);
  window.addEventListener("DOMMouseScroll", resetIdleTimer);
  window.addEventListener("mousewheel", resetIdleTimer);
  window.addEventListener("touchmove", resetIdleTimer);
  window.addEventListener("MSPointerMove", resetIdleTimer);

  function resetIdleTimer() {
    if (top.classList.contains("active")) {
      window.location.reload();
      top.classList.remove("active");
    }
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(turnIdle, +config.ads_idle_time_ms);
  }

  function turnIdle() {
    console.log("turnIdle");
    top.classList.add("active");
    itemIndex = 0;
    showNextItem();
  }

  function showNextItem() {
    itemIndex++;
    if (itemIndex >= config.ads_idle_items.length) {
      itemIndex = 0;
    }

    document.querySelectorAll(".ad-item").forEach((item, index) => {
      if (index === itemIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    clearTimeout(adsShowTimeout);
    adsShowTimeout = setTimeout(showNextItem, +config.ads_show_time_ms);
  }

  resetIdleTimer();
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
  });
}
