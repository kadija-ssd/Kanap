// récupère l'URL et l'ID de l'article

let urlId= new URLSearchParams(window.location.search).get('id');
ProductPage();

// fonction qui repère un produit grace à son id et qui charge une fonction

async function ProductPage() {
	await fetch('http://localhost:3000/api/products/' + urlId)
		.then((res) => res.json())
		.then((data) => page(data))
		.catch((error) => {
			console.log(error);
			window.alert('Connexion au serveur impossible !');
		});
}

// fonction appelé directement après récupération des données du fetch

function page(data) {
	if (data != null) {
		let ficheProduct = document.querySelector('.item__img');
		ficheProduct.innerHTML += `<img src="${data.imageUrl}" alt="${data.altTxt}">`;

		ficheProduct = document.querySelector('#title');
		ficheProduct.textContent = data.name;

		ficheProduct = document.querySelector('#price');
		ficheProduct.textContent = data.price;

		ficheProduct = document.querySelector('#description');
		ficheProduct.textContent = data.description;

		for (let i = 0; i < data.colors.length; i++) {
			canapColors(data.colors[i]);
		}
	}
}
// creation du choix de couleur du canapé
function canapColors(varChoix) {
	const varOption = document.createElement('option');
	varOption.value = varChoix;
	varOption.textContent = varChoix;
	const ficheProduct = document.querySelector('#colors');
	ficheProduct.appendChild(varOption);
}

// function qui contrôle la quantité tapé directement

function controlQuantity() {
	const quantity = document.querySelector('#quantity').value;
	if (quantity != null) {
		if (quantity < 0) document.querySelector('#quantity').value = 0;
		if (quantity > 100) document.querySelector('#quantity').value = 100;
	}
}


// déclenche la fonction addQuantityToCard au click sur le bouton
document.querySelector('#addToCart').addEventListener('click', addQuantityToCart);
//
//-----------------------------------------------------
// déclenche la fonction modifyQuantity lorsque la quantité est modifié, et la met à jour
//-----------------------------------------------------
//
document.querySelector('[name="itemQuantity"]').addEventListener('input', modifyQuantity);
document.querySelector('[name="itemQuantity"]').addEventListener('keyup', controlQuantity);

// ajout au panier 

// function qui ajoute un article et test s'il existe déjà, si oui, alors il ajoute la quantité à l'article existant
//-----------------------------------------------------
//
function addQuantityToCart() {
	// récupère la quantité et la couleur sélectionné
	const newQuantity = document.querySelector('#quantity').value;
	const currentColor = document.querySelector('#colors').value;

	if (newQuantity > 0 && newQuantity <= 100 && currentColor != '') {
		let arrayProduct = JSON.parse(localStorage.getItem('product'));
		colorGrisBorder();
		let objJson = {
			id: urlId,
			quantity: parseInt(newQuantity),
			color: currentColor,
		};
		if (arrayProduct == null) {
			arrayProduct = [];
			arrayProduct.push(objJson);
		} else {
			const productSearch = arrayProduct.find((product) => product.id == objJson.id && product.color == objJson.color);
			if (productSearch != undefined) {
				const valeurActuelle = productSearch.quantity;
				const addValue = parseInt(valeurActuelle) + parseInt(newQuantity);
				if (addValue > 100) {
					arrayProduct.quantity = 100;
					let max = 100 - valeurActuelle;
					if (max > 100) {
						alert(`vous avez déjà ${valeurActuelle} article(s) dans votre panier, 
                        il est limité à 100 articles ! 
                        ${max} articles sont ajouté au panier !`);
						document.getElementById("addToCart").disabled = true;
					} else {
						alert('Le panier à atteint sa limite maximale');
						document.getElementById("addToCart").disabled = true;
					}
				} else {
					arrayProduct.quantity = addValue;
				}
				arrayProduct.forEach((product) => {
					if (product.id == objJson.id && product.color == objJson.color) {
						if (addValue <= 100) {
							product.quantity = parseInt(product.quantity) + parseInt(objJson.quantity);
						} else {
							product.quantity = 100;
						}
					}
				});
			} else {
				arrayProduct.push(objJson);
			}
		}
		localStorage.setItem('product', JSON.stringify(arrayProduct));
		window.location.href = 'index.html';
	} else {
		// test le/les champs qui n'ont pas été renseigné.
		testContentFields(newQuantity, currentColor);
	}
}
//
//-----------------------------------------------------
// fonction qui récupère la quantité MAJ et l'enregistre dans le localStorage
//-----------------------------------------------------
//
function modifyQuantity() {
	const currentColor = parseInt(document.querySelector('#colors').value);
	let arrayProduct = findIdColor(urlId, currentColor);
	let currentQuantity = parseInt(document.querySelector('#quantity').value);
	if (currentQuantity != null && arrayProduct != undefined) {
		arrayProduct.quantity = currentQuantity;
		localStorage.setItem('product', JSON.stringify(arrayProduct));
	}
}
//
//-----------------------------------------------------
// fonction qui recherche un doublon ou les paramètres "id" et "color" sont ceux de l'article en cours
//-----------------------------------------------------
//
function findIdColor(id, color) {
	let item = {};
	for (let i = 0; i < localStorage.length; i++) {
		item = JSON.parse(localStorage.getItem('product', i));
		if (item.id == id && item.color == color) return item;
	}
	return undefined;
}
//
//-----------------------------------------------------
// fonction qui test si les champs sont remplis, sinon change les bordures en rouge
//-----------------------------------------------------
//
function testContentFields(varQuantity, varColor) {
	if (varQuantity <= 0 || varQuantity > 100) {
		const varElement = document.querySelector('input');
		const varParent = document.getElementById('#quantity');
		varElement.setAttribute('style', 'border:2px solid #FF0000;');
	} else {
		const varSelect = document.querySelector('input');
		const varColors = document.getElementById('#quantity');
		varSelect.setAttribute('style', 'border:1px solid #767676;');
	}
	if (varColor == '') {
		const varElement = document.querySelector('select');
		const varParent = document.getElementById('#colors');
		varElement.setAttribute('style', 'border:2px solid #FF0000;');
	} else {
		const varElement = document.querySelector('select');
		const varParent = document.getElementById('#colors');
		varElement.setAttribute('style', 'border:1px solid #767676;');
	}
}
//
//-----------------------------------------------------
// fonction qui met les bordures en gris
//-----------------------------------------------------
//
function colorGrisBorder() {
	const varInput = document.querySelector('input');
	const varQuantity = document.getElementById('#quantity');
	varInput.setAttribute('style', 'border:1px solid #767676;');

	const varSelect = document.querySelector('select');
	const varColors = document.getElementById('#colors');
	varSelect.setAttribute('style', 'border:1px solid #767676;');
}

