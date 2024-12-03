const payBtn = document.getElementById("cart-pay-btn");
const paymentPopup = document.getElementById("user-payment-info-popup-container");
const cancelBtn = document.getElementById("user-payment-info-cancel-button");
const confirmBtn = document.getElementById("user-payment-info-confirm-button");
const fullName = document.getElementById("user-fullName");
const phoneNumber = document.getElementById("user-phoneNumber");
const address = document.getElementById("user-address");
const email = document.getElementById("user-email");
const note = document.getElementById("user-note");
const [body] = document.getElementsByTagName("body");

const getCartItems = async () =>{
    const res = await fetch(`/api/auth/getCartItem`)
    const json = await res.json()
    return json
}

const renderCartItems = async () =>{
    const data = await getCartItems()
    

    const container = document.getElementById("cart-content-container")

    if(!container){
        console.log("Không tìm thấy khung để render")
        return
    }
    console.log(data)

    container.innerHTML = ""

//     container.innerHTML = `<div class="cart-item" id="cart-item">
//     <div class="item-img">
//       <img src="https://cdn.hoanghamobile.com/i/preview/Uploads/2023/09/13/iphone-15-pro-max-natural-titanium-pure-back-iphone-15-pro-max-natural-titanium-pure-front-2up-screen-usen.png" alt="">
//     </div>
//     <div class="item-name">
//       <p style="width: 50%">Iphone 15 Pro Max Edtion 256 GB 16 GB RAM</p>
//     </div>
//     <div class="item-quantity">
//       <button class="item-quantity-reduce">-</button>
//       <p class="item-quantity-amount">1</p>
//       <button class="item-quantity-increase">+</button>
//     </div>
//     <div class="item-price">15000000</div>
//     <div class="remove-from-cart">
//       <button id="remove-from-cart-btn" class="remove-from-cart-btn btn btn-danger">
//         Remove
//       </button>
//     </div>
//   </div>`

    let total_amount = 0
    let total_price = 0

    const total_amount_element = document.getElementById("cart-total-amount")
    const total_price_element = document.getElementById("cart-total-price")

    if(!total_amount_element ||!total_price_element){
        console.log("không tìm thấy khung để hiển thông tin tổng hợp")
        return
    }

    const VND = new Intl.NumberFormat("Vi-VN", {
        style: "currency",
        currency: "VND",
      });

    for(const item of data.data){
        const cartItem = document.createElement('div')
        cartItem.classList.add("cart-item")
        cartItem.id = "cart-item"
        cartItem.innerHTML = `<div class="item-img">
        <img src="/img/${item.ten_sanpham}" alt="${item.ten_sanpham} img">
        </div>
        <div class="item-name">
        <p>${item.ten_sanpham} ${item.ram} GB ${item.dung_luong} GB</p>
        </div>
        `

        const quantity = document.createElement('div')
        quantity.classList.add("item-quantity")

        const decreaseBtn = document.createElement('button') 
        decreaseBtn.classList.add("item-quantity-reduce")
        decreaseBtn.textContent = '-'

        decreaseBtn.onclick = async ()=>{
            //TODO
            console.log(`decrease ${item.id_phienban}`)
        }

        quantity.append(decreaseBtn)



        // quantity.innerHTML += `<p class="item-quantity-amount">${item.so_luong}</p>`
        const quantityNumberElement = document.createElement('p')
        quantityNumberElement.classList.add("item-quantity-amount")
        quantityNumberElement.textContent = item.so_luong

        quantity.append(quantityNumberElement)

        const increaseBtn = document.createElement('button')
        increaseBtn.classList.add("item-quantity-increase")
        increaseBtn.textContent = "+"

        increaseBtn.onclick = async ()=>{
            console.log(`increase ${item.id_phienban}`)
            try {
                const data = {id_phienban:item.id_phienban}
                const res = await fetch(`/api/auth/addToCart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                const result = await res.json()
                if(!result.success){
                    alert(result.message)
                    return
                }
                item.so_luong++
                quantityNumberElement.textContent = item.so_luong
                total_amount++
                total_amount_element.textContent = total_amount
                total_price += item.gia
                total_price_element = `Total ${VND.format(total_price)}`
            } catch (error) {
                console.log(error)
            }
        }


        quantity.append(increaseBtn)

        cartItem.append(quantity)


        
        // cartItem.innerHTML += `<div class="item-price">${VND.format(item.gia)}</div>`

        const priceElement = document.createElement('div')
        priceElement.classList.add("item-price")
        priceElement.textContent = VND.format(item.gia)

        cartItem.append(priceElement)




        const deleteDiv = document.createElement('div')
        deleteDiv.classList.add("remove-from-cart")

        const deleteButton = document.createElement('button')
        deleteButton.id = "remove-from-cart-btn"
        deleteButton.classList.add("remove-from-cart-btn","btn","btn-danger")
        deleteButton.textContent = "Remove"

        deleteButton.onclick = ()=>{
            //TODO
            console.log(`delete ${item.id_phienban}`)
        }

        deleteDiv.append(deleteButton)
        
        cartItem.append(deleteDiv)

        container.append(cartItem)
        total_amount += item.so_luong
        total_price += item.gia*item.so_luong
    }



    total_amount_element.textContent = total_amount
    total_price_element.textContent = `Total ${VND.format(total_price)}`

}

document.addEventListener("DOMContentLoaded", async () => {
    document.onkeydown = (event) => {
        if(event.key == "Escapse") {
            event.preventDefault();
            paymentPopup.style.top = "-150%";
            body.style.overflowY = "scroll";
        }

    }
    payBtn.onclick = () => {
        if(document.getElementById("cart-content-container").value == ""){
            alert("Không có sản phẩm trong giỏ hàng");
        } else {
            paymentPopup.style.top = "0%";
            body.style.overflow = "hidden";
        }
    }

    confirmBtn.onclick = () => {
        if(fullName.value == ""){
            alert("Họ và tên không được bỏ trống!");
            event.preventDefault();
            return;
        }
        if(phoneNumber.value == ""){
            alert("Số điện thoại không được bỏ trống");
            event.preventDefault();
            return;
        }
        if(address.value == ""){
            alert("Địa chỉ không được để trống");
            event.preventDefault();
            return;
        }        
        if(email.value == ""){
            alert("Email không được để trống");
            event.preventDefault();
            return;
        }

    }

    cancelBtn.onclick = () => {
        event.preventDefault();
        paymentPopup.style.top = "-150%";
        body.style.overflowY = "scroll";
    }

    renderCartItems()
});