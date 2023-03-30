// Récupère l'ordreId de l'URL
let orderId = new URLSearchParams(window.location.search).get('orderId');

// Met le N° de commande dans la zone HTML réservé à l'affichage
document.getElementById('orderId').textContent = orderId;

// Vide le localStorage
window.localStorage.clear();