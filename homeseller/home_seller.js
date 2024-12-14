document.addEventListener("DOMContentLoaded", () => {
    fetchTotalSales().then(details => {
        document.getElementById('total-sales').innerText = details.total;
        document.getElementById('qty').innerText = details.qty;
    }).catch(error => {
        console.error("Error fetching total sales:", error);
    });
});

const fetchTotalSales = async () => {
    const username = localStorage.getItem('uname');
    const response = await fetch(`http://localhost:3000/api/sales/total/${username}`);
    const data = await response.json();
    return data;
}
