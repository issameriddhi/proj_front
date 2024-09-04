document.addEventListener('DOMContentLoaded', () => {
    fetchProductsByCategory('accessories');
});

async function fetchProductsByCategory(category) {
    try {
        const response = await fetch(`http://localhost:3000/products/category/${category}`);
        const products = await response.json();
        console.log(products)
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="price">$${product.price}</div>
            <div class="seller">Seller ID: ${product.seller}</div>
            <button class="add-to-cart">Add to Cart</button>
            <button class="buy-now">Buy Now</button>
        `;

        productGrid.appendChild(productCard);
    });
}