// Récupère l'ordreId de l'URL
let orderId = new URLSearchParams(window.location.search).get('orderId');

// Met le numéro de commande dans la zone HTML réservé à l'affichage
document.getElementById('orderId').textContent = orderId;

// Vide le localStorage à la suite de la commande
window.localStorage.clear();