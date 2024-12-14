document.addEventListener('DOMContentLoaded', () => {
    const orderItemsContainer = document.getElementById('order-items');
    const totalPriceElement = document.getElementById('total-price');
    const sellerIdElement = document.getElementById('seller-id');
    const buyNowForm = document.getElementById('buy-now-form');

    populateOrderSummary();

    function populateOrderSummary() {
        // Get the cart from local storage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const sellerId = localStorage.getItem('seller-id') || ''; // Retrieve seller ID
        console.log(cart);

        let total = 0;
        const productMap = {};

        // Aggregate product quantities and prices
        cart.forEach(product => {
            const productKey = `${product.name}-${product.price}`;
            if (!productMap[productKey]) {
                productMap[productKey] = { ...product, quantity: 0 };
            }
            productMap[productKey].quantity += 1;
        });

        // Clear existing order items
        orderItemsContainer.innerHTML = '';

        // Create and append order items
        Object.values(productMap).forEach(product => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <p>${product.name} - $${parseFloat(product.price.replace('$', '')).toFixed(2)} x ${product.quantity}</p>
            `;
            orderItemsContainer.appendChild(orderItem);

            total += parseFloat(product.price.replace('$', '')) * product.quantity;
        });

        totalPriceElement.textContent = total.toFixed(2);
        sellerIdElement.value = sellerId; // Set the seller ID value
    }

    buyNowForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(buyNowForm);
        const data = Object.fromEntries(formData.entries());

        // Check if the cart has items to process
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Cart is empty. Please add items before proceeding.');
            return;
        }

        // Log the token and cart for debugging
        const token = localStorage.getItem('token'); // Adjust if token retrieval differs
        console.log('Token:', token); 
        console.log('Cart data:', cart);

        // Iterate through cart items and send data for each product
        for (let i = 0; i < cart.length; i++) {
            const product = cart[i];
            const orderData = {
                sellerId: product.seller,
                productName: product.name,
                price: parseFloat(product.price.replace('$', '')),
                category: product.category, // Adjust if you have specific categories
                quantity: 1, // Set the desired quantity or modify according to the cart item
            };

            try {
                const response = await fetch('https://project-co7s.onrender.com/api/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add token to headers if needed for authentication
                        // 'Authorization': `Bearer ${token}`, // Uncomment if authorization is required
                    },
                    body: JSON.stringify(orderData),
                });

                if (response.ok) {
                    console.log(`Order placed successfully for ${product.name}`);
                    cart.splice(i, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    i--; // Decrement index to handle the next item correctly after removal
                } else {
                    console.error(`Error placing order for ${product.name}`);
                    alert(`Error placing order for ${product.name}. Please try again.`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`Error placing order for ${product.name}. Please try again.`);
            }
        }

        // Check if all items are processed and then redirect
        if (cart.length === 0) {
            alert('All orders placed successfully!');
            localStorage.removeItem('cart'); // Clear the cart after successful purchases
            window.location.href = '../homepage/homepage.html'; // Redirect to home page
        }
    });
});
