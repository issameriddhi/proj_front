document.addEventListener('DOMContentLoaded', () => {
    fetchProductsByCategory('accessories');
    updateBasketCount()
});

async function fetchProductsByCategory(category) {
    try {
        const response = await fetch(`https://project-co7s.onrender.com/products/category/${category}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        displayErrorMessage('Could not load products. Please try again later.');
    }
}

// Display products
function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) {
        console.error('Product grid element not found');
        return;
    }
    productGrid.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        const { id, image, name, description, price, seller } = product;

        // Create the product card
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-product-id', id); // Set data-product-id

        // Set up the inner HTML with fallback values
        productCard.innerHTML = `
            <img src="${image || 'placeholder.jpg'}" alt="${name || 'Product Image'}">
            <h2>${name || 'Unnamed Product'}</h2>
            <p>${description || 'No description available'}</p>
            <div class="price">$${price || 'N/A'}</div>
            <div class="seller">Seller ID: ${seller || 'Unknown'}</div>
            <button class="add-to-cart" data-seller-id="${seller}">Add to Cart</button>
            <button class="buy-now">Buy Now</button>
        `;

        // Append the product card to the grid
        productGrid.appendChild(productCard);
    });

    // Add event listeners after products are displayed
    addEventListenersToCartButtons();
}

function displayErrorMessage(message) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    // Display an error message inside the grid
    productGrid.innerHTML = `<div class="error">${message}</div>`;
}

// Add event listeners to "Add to Cart" buttons
function addEventListenersToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('h2').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;
            const sellerId = event.target.getAttribute('data-seller-id'); // Retrieve seller ID from button attribute

            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                seller: sellerId,
                category: "Accessories"
            };

            addProductToLocalStorage(product);
        });
    });
}

function addProductToLocalStorage(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Item added to cart successfully!');
    updateBasketCount()
}
function updateBasketCount() {
    // Get the cart from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Update the basket count
    document.getElementById('basket-count').textContent = cart.length;
}
