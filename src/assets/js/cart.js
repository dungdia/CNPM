import { Validation } from "./validation.js";

const payBtn = document.getElementById("cart-pay-btn");
const paymentPopup = document.getElementById("user-payment-info-popup-container");
const cancelBtn = document.getElementById("user-payment-info-cancel-button");
const confirmBtn = document.getElementById("user-payment-info-confirm-button");
const fullName = document.getElementById("user-fullName");
const phoneNumber = document.getElementById("user-phoneNumber");
const address = document.getElementById("user-address");
const note = document.getElementById("user-note");
const [body] = document.getElementsByTagName("body");

let total_amount = 0
let total_price = 0

const getUserInfo = async ()=>{
    const res = await fetch(`./api/auth/getCustomerInfo`);
    const json = await res.json();
    return json;
}

const getCartItems = async () =>{
    const res = await fetch(`/api/auth/getCartItem`)
    const json = await res.json()
    return json
}

const removeCartItem = async (id_phienban,cartItem)=>{
    try {
        console.log(`Remove ${id_phienban}`)
        const data = {id_phienban:id_phienban}
        const res = await fetch(`/api/auth/removeFromCart`,{
            method: 'DELETE',
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
        cartItem.remove()

    } catch (error) {
        console.log(error)
    }

}

const decreaseItemAmount = async (id_phienban)=>{
    try {
        const data = {id_phienban:id_phienban}
        const res = await fetch(`/api/auth/decreaseItemFromCart`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const json = await res.json()
        console.log(json)

    } catch (error) {
        console.log(error)
    }
}

const renderCartItems = async () =>{
    const container = document.getElementById("cart-content-container")
    container.innerHTML = "Loading..."
    if(!container){
        console.log("Không tìm thấy khung để render")
        return
    }
    
    const data = await getCartItems()
    
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
        
        quantity.append(decreaseBtn)
        
        
        
        // quantity.innerHTML += `<p class="item-quantity-amount">${item.so_luong}</p>`
        const quantityNumberElement = document.createElement('p')
        quantityNumberElement.classList.add("item-quantity-amount")
        quantityNumberElement.textContent = item.so_luong
        
        quantity.append(quantityNumberElement)
        
                decreaseBtn.onclick = async ()=>{
                    if(item.so_luong <=1){
                        removeCartItem(item.id_phienban,cartItem)
                        return
                    }
                    decreaseItemAmount(item.id_phienban)
                    item.so_luong--
                    total_amount--
                    total_price=total_amount*item.gia
                    total_amount_element.textContent = total_amount
                    total_price_element.textContent=`Total ${VND.format(total_price)}`
                    quantityNumberElement.textContent = item.so_luong
                }

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
                total_amount++
                total_price=total_amount*item.gia
                quantityNumberElement.textContent = item.so_luong
                total_amount_element.textContent = total_amount
                total_price_element.textContent = `Total ${VND.format(total_price)}`
                console.log(total_amount*item.gia)
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
            // let currentAmount = item.so_luong
            // let currentTotalPrice = item.gia
            removeCartItem(item.id_phienban,cartItem)
            total_amount -= item.so_luong
            total_price -= item.gia*item.so_luong 
            total_amount_element.textContent = total_amount
            total_price_element.textContent = VND.format(total_price)
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

const addNewOrder = async () =>{
    const phoneNumberRegex = /^0\d{9,10}$/;
    const fullnameRegex = /^[a-zA-ZÀ-ỹà-ỹ][a-zA-ZÀ-ỹà-ỹ\s]{1,99}$/;
    const addressRegex = /^[a-zA-ZÀ-Ỹà-ỹ0-9][a-zA-ZÀ-Ỹà-ỹ0-9,_+.\s]{8,99}[^\s]$/;
    console.log(fullnameRegex.test(fullName.value))
    if(!fullnameRegex.test(fullName.value)){
        alert("Họ tên phải từ 3 - 100 kí tự, không bắt đầu bằng khoảng trắng và không chứa kí tự đặc biệt");
        return;
    }
    if(!phoneNumberRegex.test(phoneNumber.value)){
        alert("Số điện thoại bao gồm từ 10 - 11 số và bắt đầu bằng số 0");
        return;
    }
    if(!addressRegex.test(address.value)){
        alert("Địa chỉ phải từ 10 - 100 kí tự, không bắt đầu bằng khoảng trắng và không chứa kí tự đặc biệt");
        return;
    }     
    try {
        const body = {fullName:fullName.value,phoneNumber:phoneNumber.value,address:address.value,note:note.ariaValueMin}
        const res = await fetch(`/api/auth/addNewOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const result = await res.json()
        alert(result.message)
        if(!result.success)
            return
        location.reload()
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    document.onkeydown = (event) => {
        if(event.key == "Escapse") {
            event.preventDefault();
            paymentPopup.style.top = "-150%";
            body.style.overflowY = "scroll";
        }

    }
    payBtn.onclick = async () => {
        if(document.getElementById("cart-content-container").value == ""){
            alert("Không có sản phẩm trong giỏ hàng");
        } else {
            paymentPopup.style.top = "0%";
            body.style.overflow = "hidden";
            const userInfo = await getUserInfo()
            fullName.value = userInfo[0].ho_ten
            phoneNumber.value = userInfo[0].sodienthoai
            address.value = userInfo[0].diachi
        }
    }

    confirmBtn.onclick = (e) => {
        e.preventDefault()   
        addNewOrder()
    }

    cancelBtn.onclick = () => {
        event.preventDefault();
        paymentPopup.style.top = "-150%";
        body.style.overflowY = "scroll";
    }

    renderCartItems()
});