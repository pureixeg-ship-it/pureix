let cart = [];

function resetCart(){
    cart = [];
    renderCart()
} 

function addToCart(img, name, price) {
    // Scroll to order form
    document.getElementById("order-form").scrollIntoView({ behavior: "smooth" });

    let item = cart.find(p => p.name === name);

    if (item) {
        item.qty += 1;
    } else {
        cart.push({ img, name, price, qty: 1 });
    }

    saveCart();
    renderCart();
}

function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    renderCart();
}

function changeQty(name, qty) {
    let item = cart.find(p => p.name === name);
    if (item) {
        item.qty = parseInt(qty);
    }
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
    const cartDiv = document.getElementById("cart");
    const orderContainer = document.getElementById("order-container");
    const emptyCartContainer = document.getElementById("empty-cart");

    console.log(cart.length)
   
    orderContainer.classList.toggle("hidden", cart.length === 0);
    emptyCartContainer.classList.toggle("hidden", cart.length !== 0);
    

    cartDiv.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;

        cartDiv.innerHTML += `
            <div class="cart-item">
                <div class="form-group">
                    <div class="form-row-4">
                        <img style="width: 70px" src="${item.img}"/>
                        <label for="f-product-${item.name}">${item.name} - ${item.price} EGP</label>
                        <input id="f-product-${item.name}" name="product" type="number" min="1" value="${item.qty}" onchange="changeQty('${item.name}', this.value)" />
                        
                        <button class="btn-remove" onclick="removeItem('${item.name}')">❌</button>
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById("total").innerText = total;
}


renderCart();