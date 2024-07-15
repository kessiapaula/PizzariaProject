const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const aboutBtn = document.getElementById("bottom")
const aboutDesc = document.getElementById("about")
const fecharBtnAbout = document.getElementById("fecharAbout")
let cart = []

//About
aboutBtn.addEventListener("click", function () {
    aboutDesc.style.display = "flex"
})
aboutDesc.addEventListener("click", function (event) {
    if (event.target === aboutDesc)
        aboutDesc.style.display = "none"
})

fecharBtnAbout.addEventListener("click", function () {
    aboutDesc.style.display = "none"
})

//Open Modal
cartBtn.addEventListener("click", function () {
    updateCartModal()
    cartModal.style.display = "flex"

})

//Close Modal
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

//Add to cart
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal()
}

//Update cart
function updateCartModal() {
    cartItemContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium mt-2">${item.name}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p class="font-medium">€ ${item.price.toFixed(2)}</p>
                </div>
            
                <button class= "remove-btn" data-name="${item.name}">
                    Remove
                </button>
            
            </div>
        `
        total += item.price * item.quantity

        cartItemContainer.appendChild(cartItemElement)
    })
    cartTotal.textContent = `€ ${total.toFixed(2)}`

    cartCounter.innerHTML = cart.length
}

//Remove item
cartItemContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name")
        removeFromCArt(name)
    }
})

function removeFromCArt(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity -= 1
            updateCartModal()
            return
        }

        cart.splice(index, 1)
        updateCartModal()
    }
}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) return
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressWarn.classList.add("border-red-500")
        return
    }

//API whats
const cartItems = cart.map((item) => {
    return (
        `${item.name} /Qtd: ${item.quantity} /Price: €${item.price.toFixed(2)} |`
    )
}).join("")
    
const message = encodeURIComponent(cartItems)
const phone = "+351917757439"

window.open(`https://wa.me/${phone}?text=${message} Address: ${addressInput.value}`, "_blank")

cart.length = 0
updateCartModal()
})