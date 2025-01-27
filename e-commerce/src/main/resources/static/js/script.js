async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function displayProducts() {
    const products = await fetchProducts();
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.imageURL}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

let cart = [];

function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

function addToCart(id, name, price) {
    const existingProduct = cart.find(item => item.id === id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCart();
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cart-item'; // Add a class for styling
        li.innerHTML = `
            ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}
            <div class="cart-item-buttons">
                <button onclick="increaseQuantity(${item.id})">+</button>
                <button onclick="decreaseQuantity(${item.id})">-</button>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(li);
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    document.getElementById('total-price').textContent = `Total: $${total}`;
}

function increaseQuantity(itemId) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity++;
        updateCart();
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function decreaseQuantity(itemId) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            removeFromCart(itemId);
        }
        updateCart();
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    const receipt = document.getElementById('receipt');
    receipt.innerHTML = '';

    cart.forEach(item => {
        const receiptItem = document.createElement('div');
        receiptItem.className = 'receipt-item'; 
        receiptItem.innerHTML = `${item.name} x ${item.quantity} <span style="float: right;">$${(item.price * item.quantity).toFixed(2)}</span>`;
        receipt.appendChild(receiptItem);
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    const totalItem = document.createElement('div');
    totalItem.className = 'receipt-total'; 
    totalItem.innerHTML = `Total: <span style="font-weight: bold;">$${total}</span>`;
    receipt.appendChild(totalItem);

    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
}

function confirmPurchase() {
    alert('Thank you for your purchase!');
    console.log('Order placed successfully!');
    cart = []; 
    localStorage.removeItem('cart'); 
    updateCart();
    closeModal();
}

window.onload = () => {
    loadCart(); 
    displayProducts();
    updateCart();
};