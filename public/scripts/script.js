var ShoppingCart = (function ($) {
  "use strict";

  // Cache necessary DOM Elements
  var productsEl = document.querySelector(".products"),
      cartEl = document.querySelector(".shopping-cart-list"),
      totalPriceEl = document.querySelector(".total-price"),
      emptyCartEl = document.querySelector(".empty-cart-btn"),
      collectionToggleEl = document.querySelector(".collection-toggle"),
      submenuEl = document.querySelector(".submenu-list"),
      collectionPopupEl = document.querySelector(".collection-popup"),
      overlayEl = document.querySelector(".overlay");

  var products = [
    {
      id: 0,
      name: "T-Shirt - Basic White",
      description: "A comfortable and stylish basic white t-shirt, perfect for casual wear.",
      imageUrl: "https://www.qualitylogoproducts.com/custom-tshirts/gildan-dryblend-t-shirt-white-hq.jpg?size=details",
      price: 19.99,
    },
    {
      id: 1,
      name: "Jeans - Slim Fit",
      description: "Slim-fit jeans made from premium denim, providing a sleek and modern look.",
      imageUrl: "https://th.bing.com/th/id/OIP.xmOlwXgxnb1ofXpBK6TCxwHaLW?w=201&h=309&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      price: 49.99,
    },
    {
      id: 2,
      name: "Leather Jacket",
      description: "A classic leather jacket with a timeless design, perfect for all seasons.",
      imageUrl: "https://www.jacketsexpert.com/wp-content/uploads/2021/02/mens-sherpa-collar-brown-leather-jacket.jpg",
      price: 129.99,
    },
    {
      id: 3,
      name: "Hoodie - Grey",
      description: "A cozy grey hoodie with a soft fleece lining, perfect for colder weather.",
      imageUrl: "https://cdna.lystit.com/photos/matchesfashion/1156494-GREY-caab323d-.jpeg",
      price: 39.99,
    },
    {
      id: 4,
      name: "Sneakers - White",
      description: "Comfortable white sneakers with a clean design, suitable for all occasions.",
      imageUrl: "https://fashionweekdaily.com/wp-content/uploads/2020/08/lead_whitesneaker-1170x780.jpg",
      price: 69.99,
    },
    {
      id: 5,
      name: "Sweatpants - Black",
      description: "Soft and comfortable black sweatpants, great for lounging or workouts.",
      imageUrl: "https://th.bing.com/th/id/OIP.sjjPaEaBTx9JYvmV_Ln6qAHaKq?w=208&h=299&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      price: 29.99,
    },
    {
      id: 1,
      name: "Jeans - Slim Fit",
      description: "Slim-fit jeans made from premium denim, providing a sleek and modern look.",
      imageUrl: "https://th.bing.com/th/id/OIP.xmOlwXgxnb1ofXpBK6TCxwHaLW?w=201&h=309&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      price: 49.99,
    },
    {
      id: 2,
      name: "Leather Jacket",
      description: "A classic leather jacket with a timeless design, perfect for all seasons.",
      imageUrl: "https://www.jacketsexpert.com/wp-content/uploads/2021/02/mens-sherpa-collar-brown-leather-jacket.jpg",
      price: 129.99,
    },
  ];

  var collections = ["Men's Wear", "Women's Wear", "Accessories", "Footwear", "Sale"];
  var productsInCart = [];

  // Generate product list HTML
  var generateProductList = function () {
    products.forEach(function (item) {
      var productEl = document.createElement("div");
      productEl.className = "product";
      productEl.innerHTML = `<div class="product-image">
                                <img src="${item.imageUrl}" alt="${item.name}">
                             </div>
                             <div class="product-name"><span>Product:</span> ${item.name}</div>
                             <div class="product-description"><span>Description:</span> ${item.description}</div>
                             <div class="product-price"><span>Price:</span> $${item.price}</div>
                             <div class="product-add-to-cart">
                               <a href="#0" class="button see-more">More Details</a>
                               <a href="#0" class="button add-to-cart" data-id=${item.id}>Add to Cart</a>
                             </div>`;
      productsEl.appendChild(productEl);
    });
  };

  // Generate collections HTML
  var generateCollections = function () {
    collections.forEach(function (collection) {
      var collectionEl = document.createElement("div");
      collectionEl.className = "collection-item";
      collectionEl.innerHTML = `<a href="#0">${collection}</a>`;
      collectionPopupEl.appendChild(collectionEl);
    });
  };

  // Toggle collection submenu
  var togglePopup = function (event) {
    event.stopPropagation();
    if (collectionPopupEl.style.display === "block") {
      closePopup();
    } else {
      openPopup();
    }
  };

  // Open the popup
  var openPopup = function () {
    collectionPopupEl.style.display = "block";
    overlayEl.style.display = "block";
    updateArrow(true);
  };

  // Close the popup
  var closePopup = function () {
    collectionPopupEl.style.display = "none";
    overlayEl.style.display = "none";
    updateArrow(false);
  };

  // Update arrow direction
  var updateArrow = function (isOpen) {
    var arrowEl = collectionToggleEl.querySelector(".arrow");
    arrowEl.classList.toggle("down", !isOpen);
    arrowEl.classList.toggle("up", isOpen);
  };

  // Close popup on overlay click or outside click
  var setupCloseListeners = function () {
    document.addEventListener("click", closePopup);
    overlayEl.addEventListener("click", closePopup);
    collectionPopupEl.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent closing when clicking inside popup
    });
  };

  // Update the cart display
  var updateCartDisplay = function () {
    var cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartEl.innerHTML = ""; // Clear existing cart
    var totalPrice = 0;

    cartItems.forEach(function (item) {
      var cartItemEl = document.createElement("div");
      cartItemEl.className = "cart-item";
      cartItemEl.innerHTML = `
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price}</div>
      `;
      cartEl.appendChild(cartItemEl);
      totalPrice += item.price;
    });

    totalPriceEl.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
  };

  // Add product to cart
  var addToCart = function (productId) {
    var product = products.find(function (item) {
      return item.id === productId;
    });
    var cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems.push(product);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    updateCartDisplay();
  };

  // Attach event listener to the Add to Cart buttons
  var setupAddToCartListeners = function () {
    var addToCartBtns = document.querySelectorAll(".add-to-cart");
    addToCartBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var productId = parseInt(btn.getAttribute("data-id"));
        addToCart(productId);
      });
    });
  };

  // Empty cart functionality
  var setupEmptyCartListener = function () {
    emptyCartEl.addEventListener("click", function () {
      localStorage.removeItem("cart");
      updateCartDisplay();
    });
  };

  // Initialize the app
  var init = function () {
    generateProductList();
    generateCollections();
    setupCloseListeners();
    setupAddToCartListeners();
    setupEmptyCartListener();

    // Attach submenu toggle listener
    collectionToggleEl.addEventListener("click", togglePopup);
  };

  return {
    init: init,
  };
})(jQuery);

ShoppingCart.init();
