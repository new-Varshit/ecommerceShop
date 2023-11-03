const addToCartButtonElement = document.querySelector('#product-details button');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');
async function addToCart(){
    const productId = addToCartButtonElement.dataset.productid;
    const csrfToken = addToCartButtonElement.dataset.csrf;
let response;
    try{
       response = await fetch('/cart/items',{
        method: 'POST',
        body: JSON.stringify({
            productId: productId,
            _csrf: csrfToken
        }),
        headers: {
            'Content-Type':'application/json'
        }
    });
}catch(error){
   alert('something went wrong!')
}
    if(!response.ok){
        alert('something went wrong!');
        return;
    }

    const responseData = await response.json();

    const newTotalQuantity = responseData.newTotalItems;

    for(const cartBadgeElement of cartBadgeElements){
        cartBadgeElement.textContent = newTotalQuantity;
    }
}


addToCartButtonElement.addEventListener('click',addToCart);