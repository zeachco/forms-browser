let adsShowTimeout = 0;
let currentAd;
let previousAd;

async function init(config) {
  const { AdItem } = await import("./client/AdItem.class.js");
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
    top.classList.add("active");
    itemIndex = 0;
    showNextItem();
  };

  window.wake = function wakeUp() {
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
