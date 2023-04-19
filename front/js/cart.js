// variable qui recupere la valeur du panier dans le ls 
const valeurPanier = JSON.parse(localStorage.getItem("kanapLs"));

// déclaration de la fonction du fetch pour acceder aux infos hors Scope sinon la portée sera limitée
async function fetchApi() {    
let panierArrayFull = []; // tableau vide qui va contenir les objets créés en suite
let PanierClassFull = JSON.parse(localStorage.getItem("kanapLs"));
if (PanierClassFull !== null) {
for (let i = 0; i < PanierClassFull.length; i++) {
	await fetch("http://localhost:3000/api/products/" + PanierClassFull[i].idSelectedProduct)
		.then((res) => res.json())
		.then((canap) => {
			const article = {
				//création d'un objet qui va regrouper les informations dont on aura besoin par la suite
				_id: canap._id,
				name: canap.name,
				price: canap.price,
				color: PanierClassFull[i].colorSelectedProduct,
				quantity: PanierClassFull[i].quantity,
				alt: canap.altTxt,
				img: canap.imageUrl,
			};
			panierArrayFull.push(article); //ajout de l'objet article au tableau 
		})
		.catch(function (err) {
			console.log(err);
		});
}
}
return panierArrayFull;
};

// fonction d'affichage du DOM //
async function vuDuPanier() {
	const reponseFetch = await fetchApi(); // on appel de la fonction FETCH et on attent de sa réponse
	const valeurPanier = JSON.parse(localStorage.getItem("kanapLs"));
	if (valeurPanier !== null && valeurPanier.length !== 0) {
		const zonePanier = document.querySelector("#cart__items");
		reponseFetch.forEach((product) => { // injection dynamique des produits dans le DOM
			zonePanier.innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                <div class="cart__item__img">
                    <img src= "${product.img}" alt="Photoiraphie d'un canapé">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.color}</p>
                    <p>${product.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                    </div>
                </div>
                </article>`;
		});
	} else {
		return messagePanierVide(); //si Ls vide, affichage du message Panier Vide
	}

};
//////////////création des fonctions de modif et suppression d'articles du panier/////////////////

function apercuPanier() {  // fonction de récupération du LocalStorage//////
    return JSON.parse(localStorage.getItem("kanapLs"));
};

//Fonction permettant de modifier le nombre d'éléments dans le panier

async function modifQuantite() {
	await fetchApi(); //on attend que le fetch soit terminé
	const quantiteAuPanier = document.querySelectorAll(".itemQuantity");
	for (let input of quantiteAuPanier) {
		input.addEventListener("change", function () {
			//écoute du chaniement de qty
			let valeurPanier = apercuPanier();
			//On récupère l'ID de la donnée modifiée
			let idModif = this.closest(".cart__item").dataset.id;
			//On récupère la couleur de la donnée modifiée
			let colorModif = this.closest(".cart__item").dataset.color;
			//On filtre le Ls avec l'iD du canap modifié
			let findId = valeurPanier.filter((e) => e.idSelectedProduct === idModif);
			//Puis on cherche le canap même id par sa couleur 
			let findColor = findId.find((e) => e.colorSelectedProduct === colorModif);
			if (this.value > 0) {
				// si la couleur et l'id sont trouvés, on modifie la quantité en fonction
				findColor.quantity = this.value;
				//On Push le panier dans le local Storaie
				localStorage.setItem("kanapLs", JSON.stringify(valeurPanier));
				calculQteTotale();
				calculPrixTotal();
			} else {
				calculQteTotale();
				calculPrixTotal();
			}
			localStorage.setItem("kanapLs", JSON.stringify(valeurPanier));
		});
	}
};

////////////////Supprimer un kanap avec le bouton delete////////

async function supprimeArticle() {
	await fetchApi();
	const suppressionCanap = document.querySelectorAll(".deleteItem"); //crée un tableau avec les boutons suppr
	suppressionCanap.forEach((article) => {
		article.addEventListener("click", function (event) {
			let valeurPanier = apercuPanier();
			//On récupère l'ID de la donnée concernée
			const idDelete = event.target.closest("article").getAttribute("data-id");
			//On récupère la couleur de la donnée concernée
			const colorDelete = event.target
				.closest("article")
				.getAttribute("data-color");
			const searchDeleteKanap = valeurPanier.find(  // on cherche l'élément du Ls concerné 
				(element) => element.idSelectedProduct == idDelete && element.colorSelectedProduct == colorDelete
			);
			valeurPanier = valeurPanier.filter(  // et on filtre le Ls avec l'élément comme modèle
				(item) => item != searchDeleteKanap
			);
			localStorage.setItem("kanapLs", JSON.stringify(valeurPanier)); // on met à jour le Ls
			const getSection = document.querySelector("#cart__items");
			getSection.removeChild(event.target.closest("article")); // on supprime l'élément du DOM
			alert("article supprimé !");
			calculQteTotale();
			calculPrixTotal();  // on met à jour les qty et prix dynamiquement
		});
	});
	if (apercuPanier() !== null && apercuPanier().length === 0) {
		localStorage.clear();       //////// si le Ls est vide, on le clear et on affiche le message 
		return messagePanierVide();
	}
};
supprimeArticle();

/// Initialisation des fonctions ///////////

initialize();

async function initialize() {
vuDuPanier();         ////// affichaie du DOM ( avec rappel du fetchApi //////
supprimeArticle();		  ////// suppression dynamique des articles du panier et 
modifQuantite();	  ////// modification des quantités

calculQteTotale();	  ////// mise à jour dynamique des quantités et prix totaux
calculPrixTotal();
};

//////////////// Messaie si panier vide ////////////////////

function messagePanierVide() {
	const cartTitle = document.querySelector(
		"#limitedWidthBlock div.cartAndFormContainer > h1"
	); //emplacement du message
	const emptyCartMessage = "Vous n'avez encore aucun article au panier!";
	cartTitle.textContent = emptyCartMessage;
	cartTitle.style.fontSize = "40px";

	document.querySelector(".cart__order").style.display = "none"; //masque le formulaire si panier vide
	document.querySelector(".cart__price").style.display = "none"; // masque le prix total si panier vide
};

////////////////////////Fonction addition quantités et Prix pour Total////////////////

function calculQteTotale() {
	let valeurPanier = apercuPanier();
	const zoneTotalQuantity = document.querySelector("#totalQuantity");
	let quantityInBasket = []; // création d'un tableau vide pour accumuler les qtés
	if (valeurPanier === null || valeurPanier.length === 0) {
		messagePanierVide();
	} else {
	for (let kanap of valeurPanier) {
		quantityInBasket.push(parseInt(kanap.quantity)); //push des qtés
		const reducer = (accumulator, currentValue) => accumulator + currentValue; // addition des objets du tableau par reduce
		zoneTotalQuantity.textContent = quantityInBasket.reduce(reducer, 0); //valeur initiale à 0 pour eviter erreur quand panier vide
	}
}};

async function calculPrixTotal() {
	const reponseFetch = await fetchApi();
	let valeurPanier = apercuPanier();
	const zoneTotalPrice = document.querySelector("#totalPrice");
    finalTotalPrice = [];
    for (let p = 0; p < reponseFetch.length; p++) { //produit du prix unitaire et de la quantité
	let sousTotal = parseInt(reponseFetch[p].quantity) * parseInt(reponseFetch[p].price);
	finalTotalPrice.push(sousTotal);

	const reducer = (accumulator, currentValue) => accumulator + currentValue; // addition des prix du tableau par reduce
	zoneTotalPrice.textContent = finalTotalPrice.reduce(reducer, 0); //valeur initiale à 0 pour eviter erreur quand panier vide
	localStorage.setItem("kanapLs", JSON.stringify(valeurPanier));
}};

modifQuantite();
supprimeArticle();


//On Push le panier dans le local Storaie
localStorage.setItem("kanapLs", JSON.stringify(valeurPanier));

///////////////// FORMULAIRE ///////////////////////////////////////////////

// déclaration des différentes zones d'input et de messaies d'erreur //

const zoneFirstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
const zoneLastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
const zoneAddressErrorMsg = document.querySelector("#addressErrorMsg");
const zoneCityErrorMsg = document.querySelector("#cityErrorMsg");
const zoneEmailErrorMsg = document.querySelector("#emailErrorMsg");

const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAddress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputEmail = document.getElementById("email");

// déclaration des regex de contrôle des inputs du formulaire //

const regexFirstName = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
const regexLastName = regexFirstName;
const regexAddress = /^[#.0-9a-zA-ZÀ-ÿ\s,-]{2,60}$/; 
const regexCity = regexFirstName;
const regexEmail = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;

// écoute du clic sur le bouton COMMANDER //

const zoneOrderButton = document.querySelector("#order");

zoneOrderButton.addEventListener("click", function(e) {
	e.preventDefault(); // on empeche le formulaire de fonctionner par defaut si aucun contenu

	// recupération des inputs du formulaire //

	let checkFirstName = inputFirstName.value;
	let checkLastName = inputLastName.value;
	let checkAddress = inputAddress.value;
	let checkCity = inputCity.value;
	let checkEmail = inputEmail.value;

	// mise en place des conditions de validation des champs du formulaire //

function commandeValide() {
	let valeurPanier = apercuPanier();

	// si une erreur est trouvée, un messaie est retourné et la valeur false éialement //

	if (regexFirstName.test(checkFirstName) == false || checkFirstName === null) {
		inputFirstName.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
		zoneFirstNameErrorMsg.innerHTML = "Veuillez de renseigner un prénom valide";
		return false;
	} else if (regexLastName.test(checkLastName) == false ||checkLastName === null) {
		inputLastName.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
		zoneLastNameErrorMsg.innerHTML = "Veuillez de renseigner un nom valide";
		return false;
	} else if (regexAddress.test(checkAddress) == false ||checkAddress === null) {
		inputAddress.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
		zoneAddressErrorMsg.innerHTML ="Veuillez renseigner une adresse valide (Numéro, voie, nom de la voie, code postale";
		return false;
	} else if (regexCity.test(checkCity) == false || checkCity === null) {
		inputCity.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
		zoneCityErrorMsg.innerHTML = "Veuillez de renseigner un nom de ville valide";
		return false;
	} else if (regexEmail.test(checkEmail) == false || checkEmail === null) {
		inputEmail.setAttribute('style', 'border:1px solid #FF0000; padding-left: 15px;');
		zoneEmailErrorMsg.innerHTML ="Veuillez de renseigner une adresse email valide";
		return false;
	}
	// si tous les champs du formulaire sont correctement remplis //
	else {
		// on crée un objet contact pour l'envoi par l'API //

		let contact = {
			firstName: checkFirstName,
			lastName: checkLastName,
			address: checkAddress,
			city: checkCity,
			email: checkEmail,
		};

		// on crée un tableau vide qui va récupérer les articles du panier à envoyer à l'API //

		let products = [];

		// la requête POST ne prend en compte QUE l'ID des produits du panier //
		// On ne push donc QUE les ID des canapés du panier dans le tableau créé //

		for (let canapId of valeurPanier) {
			products.push(canapId.idSelectedProduct);
		}

		// on crée l'objet contenant les infos de la commande //

		let finalOrderObject = { contact, products };

		// récupération de l'ID de commande après fetch POST vers API   //

		const orderId = fetch("http://localhost:3000/api/products/order", {
			method: "POST",
			body: JSON.stringify(finalOrderObject),
			headers: {
				"Content-type": "application/json",
			},
		});
		orderId.then(async function (response) {
			// réponse de l'API //
			const retour = await response.json();
			//renvoi vers la paie de confirmation avec l'ID de commande //
			window.location.href = `confirmation.html?orderId=${retour.orderId}`;
		}) 
	}
}
commandeValide();
}); 

