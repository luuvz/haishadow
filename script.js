// ====== COMPTES ======
const users = {
  admin: { pass:"admin123", role:"admin" },
  user: { pass:"user123", role:"user" }
};

// ====== LOGIN ======
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.onsubmit = e => {
    e.preventDefault();
    const u = document.getElementById("username").value;
    const p = document.getElementById("password").value;
    const msg = document.getElementById("msg");
    if(users[u] && users[u].pass === p){
      localStorage.setItem("role", users[u].role);
      location.href = users[u].role === "admin" ? "admin.html" : "index.html";
    } else { msg.textContent="Identifiants incorrects"; }
  }
}

// ====== PRODUITS ======
let products = JSON.parse(localStorage.getItem("products")) || [];
const productForm = document.getElementById("productForm");
if(productForm){
  productForm.onsubmit = e=>{
    e.preventDefault();
    const name = document.getElementById("name").value;
    const price = Number(document.getElementById("price").value);
    const img = document.getElementById("img").value;
    products.push({name, price, img});
    localStorage.setItem("products", JSON.stringify(products));
    alert("Produit ajouté !");
    productForm.reset();
  }
}

// ====== AFFICHAGE PRODUITS ======
const productsDiv = document.getElementById("products");
if(productsDiv){
  productsDiv.innerHTML="";
  products.forEach((p,i)=>{
    productsDiv.innerHTML+=`
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>${p.price} €</p>
        <button onclick="addCart(${i})">Ajouter au panier</button>
      </div>
    `;
  });
}

// ====== PANIER ======
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function addCart(i){
  cart.push(products[i]);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Ajouté au panier");
}

// AFFICHAGE PANIER
const cartDiv = document.getElementById("cart");
let total = 0;
if(cartDiv){
  cartDiv.innerHTML="";
  cart.forEach(p=>{
    cartDiv.innerHTML+=`<p style="text-align:center">${p.name} - ${p.price} €</p>`;
    total+=p.price;
  });
  document.getElementById("total").textContent = total.toFixed(2);
}

// ====== PAYPAL ======
if(document.getElementById("paypal-button-container")){
  paypal.Buttons({
    createOrder:(data,actions)=>{
      return actions.order.create({purchase_units:[{amount:{value:total.toFixed(2)}}]});
    },
    onApprove:(data,actions)=>{
      return actions.order.capture().then(details=>{
        alert("Paiement réussi ! Merci "+details.payer.name.given_name);
        localStorage.removeItem("cart");
        location.href="index.html";
      });
    }
  }).render('#paypal-button-container');
}
