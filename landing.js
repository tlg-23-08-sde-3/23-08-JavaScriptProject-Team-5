const imageFolder = "images/";

const numColumns = Math.floor(window.innerWidth / 300);
const numRows = Math.floor(window.innerHeight / 300) + 1;
// calculate margin left
const marginLeft = (window.innerWidth - numColumns * 300) / numColumns;
document.querySelector(".bg-card-grid").style.marginLeft = `${marginLeft}px`;

const numCards = numColumns * numRows;

for (let i = 1; i <= numCards; i++) {
  // choose random number for i from 1 to 48
  //   let imageNum = Math.floor(Math.random() * 48) + 1;

  //   // check if the image is already in the grid
  //   while (
  //     document.querySelector(
  //       `.bg-card-img[src="${imageFolder}image (${imageNum}).jpg"]`
  //     )
  //   ) {
  //     imageNum = Math.floor(Math.random() * 48) + 1;
  //   }
  //   console.log(imageNum);
  createCardWithImages(i);
}

function createCardWithImages(cardNumber) {
  const card = document.createElement("div");
  card.className = "bg-card";
  card.style.paddingTop = `${marginLeft}px`;

  const frontFilename = `image (${cardNumber}).jpg`;
  const backFilename = `image (${cardNumber + 5}).jpg`;
  const frontImageUrl = `${imageFolder}${frontFilename}`;
  const backImageUrl = `${imageFolder}${backFilename}`;

  card.innerHTML = `
            <div class="bg-card-inner">
                <div class="bg-card-face">
                    <img class="bg-card-img" src="${frontImageUrl}" alt="Image Front">
                </div>
                <div class="bg-card-back">
                    <img class="bg-card-img" src="${backImageUrl}" alt="Image Back">
                </div>
            </div>
        `;

  document.querySelector(".bg-card-grid").appendChild(card);
}

function flipRandomCard() {
  const cards = document.querySelectorAll(".bg-card-inner");
  const randomIndex = Math.floor(Math.random() * cards.length);
  const card = cards[randomIndex];
  card.style.transform = "rotateY(180deg)";
  setTimeout(() => {
    card.style.transform = "rotateY(0deg)";
    setTimeout(flipRandomCard, Math.random() * 500 + 500);
  }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  flipRandomCard(); // Call the function after the DOM is fully loaded
});
