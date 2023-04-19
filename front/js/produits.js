// DECLARATION DE VARIABLES UTILES TOUT AU LONG DU CODE 
// Variables pour les url
let pageUrl = new URL(location.href); //cette variable équivaut à l'url de la page actuelle
let PageActuelleId = pageUrl.searchParams.get("id"); //cette variable récupère l'id contenu dans l'url de la page actuelle

// Variables pour les elements de la page produit
const photoArticle = document.querySelector(".item__img");
const nomArticle = document.querySelector("#title");
const prixArticle = document.querySelector("#price");// création de différentes variables pour qu'elles puissent
const textArticle = document.querySelector("#description");	// etre inséré dynamiquement dans le code
const CouleursOptions = document.querySelector("#colors");
let quantiteArticle = document.querySelector("#quantity");

fetch(`http://localhost:3000/api/products/${PageActuelleId}`) // Ici, on selectionne que la partie du json que l'on souhaite utiliser en fonction de l'id du canapé concerné à par la requete fetch
	.then((res) => res.json())
	.then((element) => {
		const imgKanap = element.imageUrl;
		const nameKanap = element.name;
		const priceKanap = element.price;
		const descriptKanap = element.description;
		const colorsKanap = element.colors;

		for (let couleur of colorsKanap) { // on crée une boucle for pour que le choix des couleurs du canapé se fait dynamiquement en fonction du modèle sélectionné
			CouleursOptions.innerHTML += `<option value="${couleur}">${couleur}</option>`;
		}
		// on ajoute des variables pour que les elements s'afichent en fonction du canapé choisi
		photoArticle.innerHTML += `<img src="${imgKanap}" alt="Photographie d'un canapé">`;
		nomArticle.innerText += `${nameKanap}`;
		prixArticle.innerText += `${priceKanap} `;
		textArticle.innerText += `${descriptKanap}`;

		// on crée une variable qui va représenter le bouton pour l'ajout au panier
		const bouton = document.getElementById("addToCart");

        //on crée une fonction déclenchée au clic sur le bouton ADDTOCART
		// liste des actions déclenchées au clic sur le bouton "ajouter"
		bouton.addEventListener("click", () => {
			let valeurPanier = { //initialisation de la variable valeurPanier
				idSelectedProduct: PageActuelleId,
				nameSelectedProduct: nameKanap,
				colorSelectedProduct: CouleursOptions.value,
				quantity: quantiteArticle.value
			};

			//on crée une fonction de récupération des éléments du panier
			function panier() {
				let valeurPanier = JSON.parse(localStorage.getItem("kanapLs"));
				if (valeurPanier === null) {
					return [];	//si le LocalStorage est vide, on crée un tableau vide
				} else {
					return valeurPanier // sinon on affiche le détail des canapés sélectionnés
				}
			}
			//on crée une fonction d'ajout au panier avec l'argument product
			function addBasket(product) {
				panier();
				let valuePanier = panier();
				console.log(valuePanier);
				let foundProducts = valuePanier.find(
					/// on définit foundProducts comme l'article à trouver
					(item) =>
						item.idSelectedProduct === product.idSelectedProduct &&
						item.colorSelectedProduct === product.colorSelectedProduct	
				); //si les produits du panier et les produits du LS n'ont pas même ID et même couleur
					// il retournera undefined 
				if (
					foundProducts == undefined &&
					CouleursOptions.value != "" &&	//si les conditions sont validées
					quantiteArticle.value > 0 &&
					quantiteArticle.value < 100
				) {
					product.quantity = quantiteArticle.value; //la quantité saisie est définie 
					valuePanier.push(product);					 //dans le Ls
				} else if (product.quantity >= 100){
					alert("la quantité maximale est limité à 100 articles !");
					alert("Les produits ne seront pas ajoutés au panier si il dépasse le nombre 100, veuillez dimunuer la quantité!")
					document.getElementById("addToCart").disabled = true;
				}
				else {
					let nvlQuantite =
						parseInt(foundProducts.quantity) +
						parseInt(quantiteArticle.value); //CUMUL Quantité si présent ID et color
					foundProducts.quantity = nvlQuantite;
				}
				sauvegardePanier(valuePanier);
				alert(
					`Le canapé ${nameKanap} ${CouleursOptions.value} a été ajouté en ${quantiteArticle.value} exemplaires à votre panier !`
				);
			}
			//on crée une fonction de sauvegarde du panier
			function sauvegardePanier(valeurPanier) {
				localStorage.setItem("kanapLs", JSON.stringify(valeurPanier));
			}

			// Si le choix de couleur est vide
			if (CouleursOptions.value === "") {
				alert("Veuillez choisir une couleur et une quantité avant de valider");
				document.getElementById("addToCart").disabled = true;
			}
			// Si la quantité choisie est nulle OU si elle dépasse 100
			else if (quantiteArticle.value <= 0 ||quantiteArticle.value > 100) {
				alert("Veuillez sélectionner une quantité correcte");
			} else {
				//Si tout est validé, on envoie le panier au LS
				addBasket(valeurPanier);
			}
		});
	})
    .catch(function (err) {
		console.log(err);
	});
    // ici on crée une variable qui détermine le nombre d'article dans le panier actuellement et qui affiche la valeur du panier en temps réel
    let valeurActuelle = quantiteArticle.value;
	if (valeurActuelle > 1 && valeurActuelle < 100) {
		alert(`vous avez déjà ${valeurActuelle} article(s) dans votre panier, 
				il est limité à 100 articles ! 
				`);
	} else if (valeurActuelle >= 100){
		alert('Le panier à atteint sa limite maximale');
		document.getElementById("addToCart").disabled = true;
	}
