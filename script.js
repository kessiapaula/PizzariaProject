const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const aboutBtn = document.getElementById("bottom");
const aboutDesc = document.getElementById("about");
const fecharBtnAbout = document.getElementById("fecharAbout");
let cart = [];

//About
aboutBtn.addEventListener("click", function () {
    aboutDesc.style.display = "flex";
});
aboutDesc.addEventListener("click", function (event) {
    if (event.target === aboutDesc)
        aboutDesc.style.display = "none";
});

fecharBtnAbout.addEventListener("click", function () {
    aboutDesc.style.display = "none";
});

//Open Modal
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
});

//Close Modal
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

//Add to cart
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.quantity * existingItem.pricePerUnit;
    } else {
        cart.push({
            name,
            pricePerUnit: price,
            quantity: 1,
            totalPrice: price,
        });
    }
    updateCartModal();
}

//Update cart
function updateCartModal() {
    cartItemContainer.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p class="font-medium mt-2">€ ${item.totalPrice.toFixed(2)}</p>
                </div>
                <button class="remove-btn" data-name="${item.name}">
                    Remove
                </button>
            </div>
        `;
        total += item.totalPrice;
        totalItems += item.quantity;

        cartItemContainer.appendChild(cartItemElement);
    });
    cartTotal.textContent = `€ ${total.toFixed(2)}`;
    cartCounter.textContent = totalItems;
}

//Remove item
cartItemContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name");
        removeFromCart(name);
    }
});

function removeFromCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            item.totalPrice = item.quantity * item.pricePerUnit;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});

checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressWarn.classList.add("border-red-500");
        return;
    }

    // API WhatsApp
    const cartItems = cart.map((item) => {
        return `${item.name}/ Qtd: ${item.quantity} = €${item.totalPrice.toFixed(2)} |`;
    }).join("");

    const totalPrice = cart.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);
    const message = encodeURIComponent(`${cartItems} Total: €${totalPrice} Address: ${addressInput.value}`);
    const phone = "+351917757439";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart.length = 0;
    updateCartModal();
});
