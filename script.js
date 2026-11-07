
// RESTAURANT RATE - MAIN JAVASCRIPT

const foods = [
  {
    id: 1,
    name: "Paneer Tikka",
    category: "Starters",
    price: 179,
    description: "Delicious grilled paneer with Indian spices.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800"
  },
  {
    id: 2,
    name: "Butter Chicken",
    category: "Main Course",
    price: 249,
    description: "Creamy and delicious butter chicken curry.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800"
  },
  {
    id: 3,
    name: "Chicken Biryani",
    category: "Biryani",
    price: 199,
    description: "Traditional aromatic chicken dum biryani.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800"
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 129,
    description: "Rich chocolate brownie with a soft centre.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800"
  },
  {
    id: 5,
    name: "Chicken 65",
    category: "Starters",
    price: 189,
    description: "Spicy and crispy fried chicken.",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800"
  },
  {
    id: 6,
    name: "Fresh Juice",
    category: "Drinks",
    price: 89,
    description: "Fresh and refreshing orange juice.",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800"
  },
  {
    id: 7,
    name: "Veg Fried Rice",
    category: "Main Course",
    price: 149,
    description: "Fresh vegetables tossed with fried rice.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800"
  },
  {
    id: 8,
    name: "Gulab Jamun",
    category: "Desserts",
    price: 79,
    description: "Soft and sweet traditional Indian dessert.",
    image: "https://images.unsplash.com/photo-1666190092159-2e5c4e8f3a5e?w=800"
  }
];

const categories = [
  "All",
  "Starters",
  "Biryani",
  "Main Course",
  "Desserts",
  "Drinks"
];

let selectedCategory = "All";
let userRatings = JSON.parse(
  localStorage.getItem("restaurantRatings") || "{}"
);

let scanner = null;
let scannerRunning = false;

// CATEGORY BUTTONS

function renderCategories() {
  const container = document.getElementById("categories");

  container.innerHTML = categories.map(category => `
    <button
      onclick="filterCategory('${category}')"
      style="${selectedCategory === category
        ? 'background:#ffb84d;color:#171717;'
        : ''}">
      ${category}
    </button>
  `).join("");
}

function filterCategory(category) {
  selectedCategory = category;
  renderCategories();
  renderMenu();
}

// FOOD MENU

function renderMenu() {
  const menu = document.getElementById("menu");
  const search = document.getElementById("searchInput")
    .value.toLowerCase();

  const filtered = foods.filter(food => {
    const matchesCategory =
      selectedCategory === "All" ||
      food.category === selectedCategory;

    const matchesSearch =
      food.name.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    menu.innerHTML = "<p>No food items found.</p>";
    return;
  }

  menu.innerHTML = filtered.map(food => {
    const rating = userRatings[food.id] || 0;

    return `
      <div class="food-card">
        <img
          src="${food.image}"
          alt="${food.name}"
          loading="lazy"
          onerror="this.src='https://placehold.co/600x400/171b25/ffffff?text=Food+Image'">

        <div class="food-info">
          <h3>${food.name}</h3>

          <div class="description">
            ${food.description}
          </div>

          <div class="price">
            ₹${food.price} · ${food.category}
          </div>

          <div class="rating">
            Your rating: ${rating ? rating + "/5 ⭐" : "Not rated"}
          </div>

          <div class="stars">
            ${[1,2,3,4,5].map(number => `
              <button
                onclick="rateFood(${food.id},${number})"
                style="color:${number <= rating ? '#ffb84d' : '#888'}">
                ★
              </button>
            `).join("")}
          </div>

          <button
            class="rate-btn"
            onclick="submitRating(${food.id})">
            Submit Rating
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// SELECT RATING

function rateFood(id, value) {
  userRatings[id] = value;

  localStorage.setItem(
    "restaurantRatings",
    JSON.stringify(userRatings)
  );

  renderMenu();
}

// SUBMIT RATING

function submitRating(id) {
  if (!userRatings[id]) {
    alert("Please select a star rating first!");
    return;
  }

  alert(
    "Thank you! Your " +
    userRatings[id] +
    "-star rating has been saved on this device."
  );
}

// SEARCH

document.getElementById("searchInput")
  .addEventListener("input", renderMenu);

// QR CODE GENERATION

document.getElementById("generateQR")
  .addEventListener("click", function() {

    const name =
      document.getElementById("restaurantName").value.trim();

    const id =
      document.getElementById("restaurantId").value.trim();

    if (!name || !id) {
      alert("Enter restaurant name and ID!");
      return;
    }

    if (typeof QRCode === "undefined") {
      alert("QR library not loaded. Check your internet connection.");
      return;
    }

    const qrContainer = document.getElementById("qrcode");

    qrContainer.innerHTML = "";

    const qrURL = new URL(window.location.href);
    qrURL.searchParams.set("restaurant", id);

    new QRCode(qrContainer, {
      text: qrURL.href,
      width: 220,
      height: 220,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    localStorage.setItem("restaurantName", name);
    localStorage.setItem("restaurantId", id);

    alert("QR code generated successfully!");
});

// DOWNLOAD QR CODE

document.getElementById("downloadQR")
  .addEventListener("click", function() {

    const container = document.getElementById("qrcode");

    const qrImage = container.querySelector("img");
    const qrCanvas = container.querySelector("canvas");

    let imageURL = "";

    if (qrImage && qrImage.src) {
      imageURL = qrImage.src;
    } else if (qrCanvas) {
      imageURL = qrCanvas.toDataURL("image/png");
    }

    if (!imageURL) {
      alert("Generate a QR code first!");
      return;
    }

    const link = document.createElement("a");

    link.href = imageURL;
    link.download = "RestaurantRate-QR.png";

    document.body.appendChild(link);
    link.click();
    link.remove();
});

// QR SCANNER

document.getElementById("startScanner")
  .addEventListener("click", async function() {

    if (scannerRunning) return;

    if (typeof Html5Qrcode === "undefined") {
      alert("QR scanner library not loaded. Check internet.");
      return;
    }

    scanner = new Html5Qrcode("reader");

    try {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 }
        },
        async function(decodedText) {

          if (scannerRunning) {
            scannerRunning = false;

            try {
              await scanner.stop();
            } catch (error) {
              console.log(error);
            }
          }

          alert("QR code detected!");

          if (
            decodedText.startsWith("https://") ||
            decodedText.startsWith("http://")
          ) {
            window.location.href = decodedText;
          } else {
            alert("QR content: " + decodedText);
          }
        }
      );

      scannerRunning = true;

    } catch (error) {
      scanner = null;
      alert(
        "Camera error: " +
        error +
        ". Use HTTPS and allow camera permission."
      );
    }
});

// STOP SCANNER

document.getElementById("stopScanner")
  .addEventListener("click", async function() {

    if (scanner && scannerRunning) {
      try {
        await scanner.stop();
        scannerRunning = false;
        alert("Scanner stopped.");
      } catch (error) {
        alert("Unable to stop scanner.");
      }
    }
});

// INITIALIZE

renderCategories();
renderMenu();

// READ RESTAURANT ID FROM QR LINK

const params = new URLSearchParams(window.location.search);
const restaurantId = params.get("restaurant");

if (restaurantId) {
  console.log("Restaurant ID:", restaurantId);
}
