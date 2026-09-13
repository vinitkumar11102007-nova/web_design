/* BCS353 - Web Designing Workshop
   Simple shopping-cart logic shared by catalogue.html and cart.html
   Cart is stored in the browser's localStorage as a JSON array:
   [{ name, price, qty }, ...]
*/

function getCart() {
  const data = localStorage.getItem("bookstoreCart");
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem("bookstoreCart", JSON.stringify(cart));
}

function addToCart(name, price) {
  const cart = getCart();
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: name, price: price, qty: 1 });
  }
  saveCart(cart);
  alert(name + " added to cart!");
}

function removeFromCart(name) {
  let cart = getCart();
  cart = cart.filter(item => item.name !== name);
  saveCart(cart);
  renderCart();
}

function changeQty(name, delta) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      return removeFromCart(name);
    }
  }
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const tbody = document.getElementById("cartBody");
  const totalCell = document.getElementById("cartTotal");
  if (!tbody) return;

  const cart = getCart();
  tbody.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">Your cart is empty. Visit the ' +
      '<a href="catalogue.html">Catalogue</a> to add books.</td></tr>';
  } else {
    cart.forEach(item => {
      const amount = item.price * item.qty;
      total += amount;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <button class="qty-btn" onclick="changeQty('${item.name}', -1)">-</button>
          ${item.qty}
          <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
        </td>
        <td>
          $${amount.toFixed(2)}
          &nbsp; <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
        </td>`;
      tbody.appendChild(row);
    });
  }

  if (totalCell) {
    totalCell.textContent = "$" + total.toFixed(2);
  }
}

// Highlight catalogue rows based on ?dept= query string from the left frame
function filterCatalogueByDept() {
  const params = new URLSearchParams(window.location.search);
  const dept = params.get("dept");
  const heading = document.getElementById("catalogueHeading");
  if (dept && heading) {
    heading.textContent = "Book Catalogue \u2013 " + dept + " Recommended Reading";
  }
}
