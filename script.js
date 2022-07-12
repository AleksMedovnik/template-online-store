"use strict"

const NAME_CART = "1479d--9472h123hfjklabisck;aa4587e887289";

const cartOpen = document.getElementById('cart-open')
const cartBody = document.getElementById('modal-body')
const addProduct = document.getElementById('product-add')
const cartClearBtn = document.getElementById('cart-clear-btn')
const cartCount = document.getElementById('cart-count')

if (addProduct) {
    addProduct.addEventListener('click', (e) => addToCart(e, '.page-product__title', '.page-product__price'))
    showItemCart(addProduct)
}
cartClearBtn.addEventListener('click', () => clearCart(cartBody))
cartOpen.addEventListener('click', () => renderCart(cartBody))
cartItemCount(cartCount)


//Записываем данные в localStorage
function setCartData(obj) {
    localStorage.setItem(NAME_CART, JSON.stringify(obj))
    return false;
}

//Получаем данные из localStorage
function getCartData() {
    return JSON.parse(localStorage.getItem(NAME_CART))
}

//Очищаем localStorage с корзиной
function clearCart(cart) {
    localStorage.removeItem(NAME_CART);
    renderCart(cart)
    showItemCart(addProduct)
    cartItemCount(cartCount)
}

//Добавляем товар в localStorage
function addToCart(e, title, price) {
    let target = e.target;
    target.disabled = true;
    const cartData = getCartData() || {};
    let itemId = target.dataset.id;
    let parentBox = target.parentElement;
    let itemTitle = parentBox.querySelector(title).textContent;
    let itemPrice = parentBox.querySelector(price).textContent;
    let itemImage = parentBox.parentElement.querySelector("img").src;
    if (!cartData.hasOwnProperty(itemId)) {
        cartData[itemId] = [itemTitle, itemPrice, itemImage];
    };
    target.disabled = setCartData(cartData)
    showItemCart(addProduct)
    cartItemCount(cartCount)
}

//Отрисовка корзины
function renderCart(cart) {
    const cartData = getCartData();
    let totalItems;
    let totalAmount = 0;
    if (!cartData) {
        totalItems = `<p>Корзина пуста!</p>`;
    } else {
        totalItems = `<table class='table table-info cart__table'>
            <thead>
                <tr>
                    <th scope="col">Название</th>
                    <th scope="col">Цена в ₿</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
            </thead>
        <tbody>
        `;
        for (const item in cartData) {
            totalAmount += +cartData[item][1];
            totalItems += "<tr>";
            for (let i = 0; i < cartData[item].length; i++) {
                if (i === 2) {
                    totalItems += `
                    <td style="background-image: url(${cartData[item][i]})" class="cart__image"></td>
                    `
                } else {
                    totalItems += `<td>${cartData[item][i]}</td>`;
                }
            };
            totalItems += `
                <td>
                    <button type="button" class="btn btn-danger cart__delete" data-id=${item}>Delete</button>
                </td>
            </tr>
            `};
        totalItems += `</tbody></table>`
        totalItems += `<p>Количество товаров: ${totalAmount}</p>`
    }
    cart.innerHTML = totalItems;
    addEventDeleteItemCart(cart);
}

//удаляем товар из корзины(по одному)
function deleteItemCart(e, cart) {
    let cartData = getCartData();
    let itemID = e.target.dataset.id;
    delete cartData[itemID];
    setCartData(cartData);
    if (Object.keys(cartData).length === 0) {
        console.log(Object.keys(cartData).length)
        clearCart(cart)
    }

    renderCart(cart);
    cartItemCount(cartCount)
    showItemCart(addProduct)
}

// Добавляем событие для удаление одного товара
function addEventDeleteItemCart(cart) {
    document.querySelectorAll(".cart__delete")
        .forEach((btn) => {
            btn.addEventListener("click", (e) => deleteItemCart(e, cart))
        });
}

//Добавлен ли товар в корзину
function showItemCart(addProduct) {
    const cartData = getCartData();
    if (cartData && cartData.hasOwnProperty(addProduct.dataset.id)) {
        addProduct.textContent = "Товар добавлен в корзину";
        addProduct.className = 'btn btn-success'
    } else {
        addProduct.textContent = "Добавить в корзину";
        addProduct.className = 'btn btn-info'
    }
}

//Количество элементов в корзине
function cartItemCount(elem) {
    const cartData = getCartData();
    elem.textContent = cartData ? Object.keys(cartData).length : 0;
}