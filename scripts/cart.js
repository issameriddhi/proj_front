document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const billItemsContainer = document.getElementById('bill-items');
    const totalPriceElement = document.getElementById('total-price');
    
    updateCart();
    updateBasketCount();

    function updateCart() {
        // Get the cart from local storage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log(cart);

        // Clear existing cart items
        cartItemsContainer.innerHTML = '';
        billItemsContainer.innerHTML = '';

        let total = 0;

        cart.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-details">
                    <h2>Name: ${product.name}</h2>
                    <h3>Category: ${product.category}</h3>
                    <p>Price: ${product.price}</p>
                    <p>Seller: ${product.seller}</p>
                </div>
                <button class="remove-from-cart" data-index="${index}">Remove</button>
            `;

            cartItemsContainer.appendChild(productCard);

            // Add to bill details
            const billItem = document.createElement('div');
            billItem.className = 'bill-item';
            billItem.innerHTML = `
                <p>${product.name} - $${parseFloat(product.price.replace('$', '')).toFixed(2)}</p>
            `;
            billItemsContainer.appendChild(billItem);

            // Update total
            total += parseFloat(product.price.replace('$', ''));
        });

        totalPriceElement.textContent = total.toFixed(2);

        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                removeProductFromCart(index);
            });
        });
    }

    function updateBasketCount() {
        // Get the cart from local storage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Update the basket count
        document.getElementById('basket-count').textContent = cart.length;
    }

    function removeProductFromCart(index) {
        // Get the cart from local storage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Remove the product at the specified index
        cart.splice(index, 1);
        // Save the updated cart back to local storage
        localStorage.setItem('cart', JSON.stringify(cart));
        // Update the cart
        updateCart();
        updateBasketCount();
    }
});
