// ============================
// SHOPPING CART FUNCTIONALITY
// ============================

// Initialize cart from localStorage
function getCart() {
  const cart = localStorage.getItem("shoppingCart");
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
  updateCartCount();
}

// Update cart count in navigation
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update all cart count elements
  document.querySelectorAll("#cartCount").forEach((el) => {
    el.textContent = totalItems;
  });
}

// Add item to cart
function addToCart(item) {
  const cart = getCart();

  // Check if item already exists
  const existingItem = cart.find((cartItem) => cartItem.name === item.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...item,
      quantity: 1,
      id: Date.now(),
    });
  }

  saveCart(cart);
}

function isLoggedIn() {
  const user = JSON.parse(localStorage.getItem("currentUser") || null);
  if (user == null) {
    return false;
  }

  return true;
}

// Remove item from cart
function removeFromCart(itemId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== itemId);
  saveCart(cart);
  displayCart();
}

// Update item quantity
function updateQuantity(itemId, change) {
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === itemId);

  if (item) {
    item.quantity += change;

    if (item.quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    saveCart(cart);
    displayCart();
  }
}

// Display cart items
function displayCart() {
  const cart = getCart();
  const emptyCart = document.getElementById("emptyCart");
  const cartItems = document.getElementById("cartItems");
  const cartItemsList = document.getElementById("cartItemsList");

  if (cart.length === 0) {
    emptyCart.style.display = "block";
    cartItems.style.display = "none";
    return;
  }

  emptyCart.style.display = "none";
  cartItems.style.display = "flex";

  // Clear current items
  cartItemsList.innerHTML = "";

  let subtotal = 0;

  // Display each item
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemElement = document.createElement("div");
    itemElement.className = "list-group-item";
    itemElement.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-2 col-3">
                    <img src="${item.image}" class="img-fluid rounded" alt="${item.name}" 
                         style="width: 80px; height: 80px; object-fit: cover;">
                </div>
                <div class="col-md-4 col-9">
                    <h5 class="mb-1">${item.name}</h5>
                    <p class="mb-0 text-muted small">${item.description}</p>
                </div>
                <div class="col-md-2 col-4 mt-2 mt-md-0">
                    <span class="badge bg-primary fs-6">${item.price} ₸</span>
                </div>
                <div class="col-md-3 col-4 mt-2 mt-md-0">
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary" type="button" 
                                onclick="updateQuantity(${item.id}, -1)">-</button>
                        <input type="text" class="form-control text-center" 
                               value="${item.quantity}" readonly>
                        <button class="btn btn-outline-secondary" type="button" 
                                onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="col-md-1 col-4 mt-2 mt-md-0 text-end">
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})"
                            title="Remove from cart">
                        🗑️
                    </button>
                </div>
            </div>
        `;

    cartItemsList.appendChild(itemElement);
  });

  // Update summary
  document.getElementById("summaryItemCount").textContent = cart.length;
  document.getElementById(
    "summarySubtotal"
  ).textContent = `${subtotal.toLocaleString()} ₸`;
  document.getElementById(
    "summaryTotal"
  ).textContent = `${subtotal.toLocaleString()} ₸`;
}

// Clear entire cart
function clearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    localStorage.removeItem("shoppingCart");
    updateCartCount();
    displayCart();
    showNotification("🗑️ Cart cleared successfully!", "info");
  }
}

// Place order
function placeOrder() {
  const cart = getCart();

  if (cart.length === 0) {
    showNotification("❌ Your cart is empty!", "warning");
    return;
  }

  if (isLoggedIn()) {
    // Show loading state
    const orderBtn = document.getElementById("placeOrderBtn");
    const originalText = orderBtn.innerHTML;
    orderBtn.disabled = true;
    orderBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';

    // Simulate order processing
    setTimeout(() => {
      // Clear cart
      localStorage.removeItem("shoppingCart");
      updateCartCount();

      // Show success message
      showNotification(
        "✅ Order successfully placed! Thank you for your order!",
        "success"
      );

      // Reset button
      orderBtn.disabled = false;
      orderBtn.innerHTML = originalText;

      // Display empty cart
      displayCart();

      // Play success sound
      if (typeof playSuccessSound === "function") {
        playSuccessSound();
      }

      // Optionally redirect to home after 3 seconds
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    }, 1500);
  } else {
    showNotification(
      "Please login to the account! Redirecting to the login page...",
      "error"
    );
    setTimeout(() => {
      window.location.href = "login.html";
    }, 3000);
  }
}

// Show notification
function showNotification(message, type = "info") {
  const types = {
    success: "alert-success",
    info: "alert-info",
    warning: "alert-warning",
    error: "alert-danger",
  };

  const notification = document.createElement("div");
  notification.className = `alert ${types[type]} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-5`;
  notification.style.zIndex = "9999";
  notification.style.minWidth = "350px";
  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  document.body.appendChild(notification);

  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 150);
  }, 4000);
}

// Initialize cart page
document.addEventListener("DOMContentLoaded", function () {
  // Update cart count on all pages
  updateCartCount();

  // If on cart page, display cart
  if (window.location.pathname.includes("cart.html")) {
    displayCart();

    // Add event listeners
    document
      .getElementById("clearCartBtn")
      ?.addEventListener("click", clearCart);
    document
      .getElementById("placeOrderBtn")
      ?.addEventListener("click", placeOrder);
  }

  // Add "Order Now" button handlers on menu page
  if (window.location.pathname.includes("menu.html")) {
    document.querySelectorAll(".btn-outline-primary").forEach((button) => {
      if (button.textContent.includes("Order Now")) {
        button.addEventListener("click", function (e) {
          e.preventDefault();

          // Get item details from card
          const card = this.closest(".card");
          const name = card.querySelector(".card-title").textContent.trim();
          const description = card
            .querySelector(".card-text")
            .textContent.trim();
          const priceText = card.querySelector(".badge").textContent.trim();
          const price = parseInt(priceText.replace(/[^\d]/g, ""));
          const image = card.querySelector("img").src;

          // Add to cart
          addToCart({
            name: name,
            description: description,
            price: price,
            image: image,
          });
        });
      }
    });
  }
});

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.placeOrder = placeOrder;
