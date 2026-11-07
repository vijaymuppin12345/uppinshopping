
// Get HTML Elements
const productContainer = document.getElementById("productContainer");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const cartSection = document.getElementById("cartSection");
const cartButton = document.getElementById("cartButton");
const closeCart = document.getElementById("closeCart");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

// Store Products and Cart
let products = [];
let cart = [];

// Load Products from JSON File
async function loadProducts() {
    try {
        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {
        productContainer.innerHTML = `
            <p class="no-products">
                Failed to load products.
                Please run the project using Live Server.
            </p>
        `;

        console.error(error);
    }
}

// Display Products Dynamically
function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {
        productContainer.innerHTML = `
            <p class="no-products">No products found!</p>
        `;
        return;
    }

    productList.forEach(product => {

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}"
                     alt="${product.name}"
                     loading="lazy">
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="rating">
                    ★★★★★
                    <span>(${product.rating})</span>
                </div>

                <div class="product-bottom">

                    <span class="price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </span>

                    <button class="add-btn"
                            data-id="${product.id}">
                        + Add
                    </button>

                </div>

            </div>
        `;

        productContainer.appendChild(productCard);
    });
}

// Add Event Listener to Product Buttons
productContainer.addEventListener("click", function(event) {

    const button = event.target.closest(".add-btn");

    if (!button) return;

    const productId = Number(button.dataset.id);

    addToCart(productId);
});

// Add Product to Cart
function addToCart(productId) {

    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();

}

// Update Shopping Cart
function updateCart() {

    cartCount.textContent = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">Your cart is empty!</p>
        `;

    }

    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>
                    ₹${item.price.toLocaleString("en-IN")}
                    × ${item.quantity}
                </p>
            </div>

            <button data-id="${item.id}" class="remove-btn">
                Remove
            </button>
        `;

        cartItems.appendChild(cartItem);

    });

    // Calculate Total Price
    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartTotal.textContent =
        "₹" + total.toLocaleString("en-IN");

}

// Remove Product from Cart
cartItems.addEventListener("click", function(event) {

    const button = event.target.closest(".remove-btn");

    if (!button) return;

    const productId = Number(button.dataset.id);

    cart = cart.filter(item => item.id !== productId);

    updateCart();

});

// Open Cart
cartButton.addEventListener("click", function() {

    cartSection.classList.add("active");

});

// Close Cart
closeCart.addEventListener("click", function() {

    cartSection.classList.remove("active");

});

// Search Products
function searchProducts() {

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = products.filter(product => {

        return product.name.toLowerCase().includes(searchValue) ||
               product.category.toLowerCase().includes(searchValue);

    });

    displayProducts(filteredProducts);

}

// Search Button
searchBtn.addEventListener("click", searchProducts);

// Search While Typing
searchInput.addEventListener("input", searchProducts);

// Checkout Button
checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your shopping cart is empty!");

    } else {

        alert("Thank you for shopping with ShopZone!");

        cart = [];

        updateCart();

        cartSection.classList.remove("active");

    }

});

// Load Products When Website Opens
loadProducts();
