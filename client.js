console.log("client loaded");

function createAds(items) {
  const adItem = document.createElement("div");
  // check if item is movie or not

  //   const frame = document.createElement("iframe");
  // document.body.appendChild(frame);
  // frame.src = "./pubs/${first.file}";

  console.log({ items });

  items.forEach((item) => {
    adItem.classList.add("ad-item");
    adItem.innerHTML = `
    <div class="ad-item__image">
    <img src="${item}" alt="" />
    </div>
`;
  });
}
