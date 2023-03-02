let adsShowTimeout = 0;
let currentAd;
let previousAd;
let itemIndex = 0;

function init(config) {
  console.debug(config);

  const top = document.createElement("div");
  top.id = "top";
  document.body.appendChild(top);

  console.log({ top });

  showNextItem();

  async function showNextItem() {
    const { AdItem } = await import("./client/AdItem.class.js");
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
