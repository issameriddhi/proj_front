const sellerId = localStorage.getItem('uname');
document.addEventListener('DOMContentLoaded', () => {

    // Function to fetch products by sellerId
    
    // Retrieve the seller ID from localStorage
   

    if (sellerId) {
        fetchProductsBySeller(sellerId); // Fetch products for the current seller
    } else {
        console.log('Seller ID not found');
    }
});
async function fetchProductsBySeller(sellerId) {
    try {
        const response = await fetch(`http://localhost:3000/api/sales-report/${sellerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' // Optional for GET requests, but good practice
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok. Status: ${response.status}, Message: ${errorText}`);
        }

        const products = await response.json();
        console.log("hello",products);

        // Process or display the products as needed
        displayProducts(products);

    } catch (e) {
        console.error('Error fetching products:', e);
        // Optionally display a user-friendly message or handle errors appropriately
        displayErrorMessage('Could not load products. Please try again later.');
    }
}

// Function to display products in the UI
function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) {
        console.error('Product grid element not found');
        return;
    }
    productGrid.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        const { sellerId,date, productName, price, category, quantity } = product;
        const total = parseInt(price)*parseInt(quantity); 
        // Create a new table row
        const productRow = document.createElement('tr');
        productRow.setAttribute('data-product-id', sellerId); // Set data-product-id

        // Set up the row with cells and fallback values
        productRow.innerHTML = `
            <td>${sellerId}</td>
            <td>${productName || 'Unnamed Product'}</td>
            <td>$${price || 'N/A'}</td>
            <td>${category || 'No category available'}</td>
            <td>${quantity || 'N/A'}</td>
            <td>${date || 'N/A'}</td>
            <td>${total || 'N/A'}</td>
  
        `;

        // Append the row to the tbody
        productGrid.appendChild(productRow);
    });

    // Add event listeners after products are displayed
    addEventListenersToCartButtons();
}


// Function to display an error message
function displayErrorMessage(message) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    // Display an error message inside the grid
    productGrid.innerHTML = `<div class="error">${message}</div>`;
}

// Function to add event listeners to "Add to Cart" buttons
function addEventListenersToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('h2').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;
            const sellerId = localStorage.getItem('uname');

            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                seller: sellerId
            };

            addProductToLocalStorage(product);
        });
    });
}

// Function to add product to local storage
function addProductToLocalStorage(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Item added to cart successfully!');
}

async function filterReport(){
    const category = document.getElementById("category").value;
    if (category == "All"){
        fetchProductsBySeller(sellerId)
        return
    }
    try {
        const response = await fetch(`http://localhost:3000/api/sales-report/${sellerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' // Optional for GET requests, but good practice
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok. Status: ${response.status}, Message: ${errorText}`);
        }

        let products = await response.json();
        products = products.filter(product => product.category === category)

        // Process or display the products as needed
        displayProducts(products);

    } catch (e) {
        console.error('Error fetching products:', e);
        // Optionally display a user-friendly message or handle errors appropriately
        displayErrorMessage('Could not load products. Please try again later.');
    }
}
