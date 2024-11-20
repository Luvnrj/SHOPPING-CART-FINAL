const items = localStorage.getItem("produse");
console.log(JSON.parse(items));

const products = JSON.parse(items);
const productsContainer = document.querySelector(".products");

products.forEach((product) => {
  //titlu
  const title = document.createElement("h3");
  const titleContent = document.createTextNode(product.title);
  title.appendChild(titleContent);

  //descriere
  const price = document.createElement("p");
  const priceContent = document.createTextNode(`${product.price} RON`);
  price.appendChild(priceContent);

  //imagine
  const image = document.createElement("img");
  image.src = product.thumbnail;

  const plusButton = document.createElement("button");
  const plusButtonContent = document.createTextNode("➕");
  plusButton.appendChild(plusButtonContent);

  const minusButton = document.createElement("button");
  const minusButtonContent = document.createTextNode("➖");
  minusButton.appendChild(minusButtonContent);
  if (product.quantity === 1) {
    minusButton.disabled = true;
  }

  const deleteButton = document.createElement("button");
  const deleteButtonContent = document.createTextNode("🗑️");
  deleteButton.appendChild(deleteButtonContent);

  const quantity = document.createElement("span");
  const quantityContent = document.createTextNode(product.quantity);
  quantity.appendChild(quantityContent);

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("btn-container");
  btnContainer.append(plusButton, quantity, minusButton, deleteButton);

  const productCard = document.createElement("div");
  productCard.append(title, price, image, btnContainer);
  productCard.classList.add("product-card");

  productsContainer.append(productCard);

  // Adaugam event listener pentru butonul plus
  plusButton.addEventListener("click", () => {
    // Incrementăm cantitatea produsului
    product.quantity++;
    
    // Actualizam textul cantitatii afiaate
    quantity.textContent = product.quantity;
    
    // Activam butonul de minus daca cantitatea este mai mare ca 1
    if (product.quantity > 1) {
      minusButton.disabled = false;
    }
    
    // Actualizam localStorage cu noua cantitate
    localStorage.setItem("produse", JSON.stringify(products));
    updateProductsNumber();
  });

  // Adaugam event listener pentru butonul minus
  minusButton.addEventListener("click", () => {
    // Decrementam cantitatea produsului
    product.quantity--;
    
    // Actualizam textul cantitatii afisate
    quantity.textContent = product.quantity;
    
    // Dezactivam butonul de minus daca cantitatea ajunge la 1
    if (product.quantity === 1) {
      minusButton.disabled = true;
    }
    
    // Actualizam localStorage cu noua cantitate
    localStorage.setItem("produse", JSON.stringify(products));
    updateProductsNumber();
  });

  // Adaugam event listener pentru butonul de stergere
  deleteButton.addEventListener("click", () => {
    // Gasim indexul produsului in array
    const productIndex = products.findIndex(p => p.id === product.id);
    
    // Stergem produsul din array
    products.splice(productIndex, 1);
    
    // Stergem cardul produsului din DOM
    productCard.remove();
    
    // Actualizam localStorage cu noua lista de produse
    localStorage.setItem("produse", JSON.stringify(products));
    
    // Daca nu mai sunt produse in coș, refresh pagina si afisam un mesaj
    if (products.length === 0) {
      productsContainer.innerHTML = "<p>Coșul tău este gol</p>";
    }
    updateProductsNumber();
  });
});

const clearCartBtn = document.querySelector(".clear-cart-btn");

clearCartBtn.addEventListener("click", () => {
  // Verificam daca exista produse in cos
  if (products.length > 0) {
    // Confirmam cu utilizatorul
    const confirmClear = confirm("Ești sigur că vrei să golești coșul?");
    
    if (confirmClear) {
      // Golim array-ul de produse
      products.length = 0;
      
      // Golim localStorage
      localStorage.setItem("produse", JSON.stringify(products));
      
      // Golim containerul de produse si afiam mesajul
      productsContainer.innerHTML = "<p>Coșul tău este gol</p>";
      
      // Actualizam numarul de produse din cos
      updateProductsNumber();
    }
  }
});
