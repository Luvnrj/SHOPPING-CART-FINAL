async function init() {
  const response = await fetch("https://dummyjson.com/products");
  const result = await response.json();
  updateProductsNumber();
  render(result);
}

async function loadMore() {
  const itemNumber = document.querySelectorAll("li");

  const response = await fetch(
    `https://dummyjson.com/products/?limit=10&skip=${itemNumber.length}`
  );
  const result = await response.json();
  render(result);
}

function render(result) {
  const itemsContainer = document.querySelector(".items-container");
  result.products.forEach((product) => {
    const title = document.createElement("h3");
    const titleContent = document.createTextNode(product.title);
    title.appendChild(titleContent);

    const description = document.createElement("span");
    const descriptionContent = document.createTextNode(product.description);
    description.appendChild(descriptionContent);

    const price = document.createElement("p");
    const priceContent = document.createTextNode(`${product.price} RON`);
    price.appendChild(priceContent);

    const productImg = document.createElement("img");
    productImg.src = product.thumbnail;

    const addBtn = document.createElement("button");
    addBtn.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"/>
</svg>
`;
    addBtn.addEventListener("click", () => {
      saveToLocalStorage(
        product.id,
        product.thumbnail,
        product.title,
        product.price
      );
      updateProductsNumber();
    });

    const itemCard = document.createElement("li");
    itemCard.append(productImg, title, description, price, addBtn);

    itemsContainer.appendChild(itemCard);
  });
}

function saveToLocalStorage(id, thumbnail, title, price) {
  const existingProducts = localStorage.getItem("produse");
  if (existingProducts) {
    const parsedProducts = JSON.parse(existingProducts);
    const duplicate = parsedProducts.some((product) => product.id === id);

    let updatedProducts = [];
    if (duplicate) {
      updatedProducts = parsedProducts.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        } else {
          return product;
        }
      });
      console.log(updatedProducts);
    } else {
      updatedProducts = [
        ...parsedProducts,
        { id, thumbnail, title, price, quantity: 1 },
      ];
    }
    localStorage.setItem("produse", JSON.stringify(updatedProducts));
  } else {
    localStorage.setItem(
      "produse",
      JSON.stringify([{ id, thumbnail, title, price, quantity: 1 }])
    );
  }
}

function updateProductsNumber() {
  const productCount = document.querySelector(".product-count");
  const existingProducts = localStorage.getItem("produse");
  if (!existingProducts) {
    productCount.innerHTML = 0;
  } else {
    const parsedProducts = JSON.parse(existingProducts);
    const totalProducts = parsedProducts.reduce((sum, product) => sum + product.quantity, 0);
    productCount.innerHTML = totalProducts;
  }
}

const btnTop = document.querySelector(".btn-top");
btnTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const btnLoad = document.querySelector(".btn-load-more");

btnLoad.addEventListener("click", loadMore);
