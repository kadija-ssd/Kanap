// PAGE D'ACCUEIL

// Récuperation des produits depuis l'API

// Déclaration d'une fonction pour ajouter les canapés à la page d'accueil
ajoutCanapes();
async function ajoutCanapes() {
    await fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                product = data[i];
                document.querySelector('.items').innerHTML += 
                    `<a href="./product.html?id=${product._id}">
                        <article>
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                            <h3 class="productName">${product.name}</h3>
                            <p class="productDescription">${product.description}</p>
                        </article>
                    </a>`;
            }
        })
        .catch((error) => {
            console.log('Erreur de connexion avec le serveur : ', error);
            window.alert('Connexion au serveur impossible !');
        });
}

