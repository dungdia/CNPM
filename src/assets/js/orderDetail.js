const getOrderDetail = async () =>{
    const URLParams = new URLSearchParams(window.location.search);
    const orderId = URLParams.get('id')
    if(!orderId){
        alert("mã đơn hàng")
        return
    }
    const res = await fetch(`/api/auth/getOrderList?orderId=${orderId}`)
    const json = await res.json()
    return json
}

const getUserInfo = async ()=>{
    const res = await fetch(`./api/auth/getCustomerInfo`);
    const json = await res.json();
    return json;
}




const renderOrderDetail = async () =>{
    const orderItem = await getOrderDetail()
    console.log(orderItem)
    const container = document.getElementById("order_item_container")
    if(!container){
        alert("Không tìm thấy khung chứa")
        return
    }

    container.innerHTML = ``

//<div id="order_item" class="order_item">
//     <div class="item_img" class="item_img">
//         <img src="https://cdn.hoanghamobile.com/i/preview/Uploads/2023/09/13/iphone-15-pro-max-natural-titanium-pure-back-iphone-15-pro-max-natural-titanium-pure-front-2up-screen-usen.png"
//             alt="" />
//     </div>
//     <div class="item_name">
//         Iphone 15 Pro Max Edtion 256 GB 16 GB RAM
//     </div>
//     <div class="item_quantity">3</div>
//     <div class="item_guarantee">8 months</div>
//     <div class="item_price">15000000</div>
// </div>
    const VND = new Intl.NumberFormat("Vi-VN", {
    style: "currency",
    currency: "VND",
    });

    let total_price = 0

    for(const item of orderItem.data){
        const orderItem = document.createElement('div')
        orderItem.classList.add("order_item")
        orderItem.id = "order_item"

        orderItem.innerHTML=`
                <div class="item_img" class="item_img">
                    <img src="/img/${item.ten_sanpham}" alt="img ${item.ten_sanpham}" />
                </div>
                <div class="item_name">
                    ${item.ten_sanpham} ${item.ram} GB ${item.dung_luong} GB 
                </div>
                <div class="item_quantity">${item.imei}</div>
                <div class="item_guarantee">${item.ngaykethuc_baohanh}</div>
                <div class="item_price">${VND.format(item.gia_ban)}</div>`
        
        total_price += item.gia_ban
        container.append(orderItem)
    }

    const userInfoElement = document.getElementById("order_user_info")
    if(!userInfoElement){
        alert("Không tìm thấy chỗ chứa thông tin khách hàng")
        return
    }

    userInfoElement.innerHTML=`
    <p id="order_user_fullname">Họ và tên khách hàng: ${orderItem.data[0].ho_ten}</p>
    <p id="order_user_phone_number">Số điện thoại: ${orderItem.data[0].sodienthoai}</p>
    <p id="order_user_address">Địa chỉ: ${orderItem.data[0].diachi}</p>
    <p id="order_user_total_price">Tổng tiền: ${VND.format(total_price)}</p>
    <p id="order_user_note">Note: ${orderItem.data[0].note?? ""}</p>`

    const orderStatus = document.getElementById('order_status')
    if(!orderStatus){
        alert("Không tìm thấy chỗ chứa Thông tin tình trạng đơn hàng")
        return
    }

    console.log(orderItem.data[0].id_trangthaiHD )

    orderStatus.innerHTML =` <div class="order_place" id="order_place">
    <div class="order_place_check_symbol" id="order_place_check_symbol" style="${orderItem.data[0].id_trangthaiHD == 1 ? "background-color: #2dc258; border: 5px solid #2dc258" : orderItem.data[0].id_trangthaiHD > 1 ? "background-color: #FFFFFF;border: 5px solid #2dc258": ""}">
        ✔
    </div>
    <div class="order_place_text" id="order_place_text">
        Order Placed
    </div>
</div>
<div class="order_connector1" style="${orderItem.data[0].id_trangthaiHD >= 2 ? "background-color: #2dc258" : ""}" id="order_connector1"></div>
<div class="order_pay" id="orde_pay">
    <div class="order_pay_check_symbol"style="${orderItem.data[0].id_trangthaiHD == 2 ? "background-color: #2dc258; border: 5px solid #2dc258" : orderItem.data[0].id_trangthaiHD > 2 ? "background-color: #FFFFFF;border: 5px solid #2dc258": ""}" id="order_pay_check_symbol">
        ✔
    </div>
    <div class="order_pay_text" id="order_pay_text">
        Order Apporve
    </div>
</div>
<div class="order_connector2" id="order_connector2" style="${orderItem.data[0].id_trangthaiHD >= 3 ? "background-color: #2dc258" : ""}"></div>
<div class="order_ship_out" id="order_ship_out">
    <div class="order_ship_out_check_symbol" style="${orderItem.data[0].id_trangthaiHD == 3 ? "background-color: #2dc258; border: 5px solid #2dc258" : orderItem.data[0].id_trangthaiHD > 3 ? "background-color: #FFFFFF;border: 5px solid #2dc258": ""}" id="order_ship_out_check_symbol">
        ✔
    </div>
    <div class="order_ship_out_text" id="order_ship_out_text">
        Order Shipped Out
    </div>
</div>
<div class="order_connector3" style="${orderItem.data[0].id_trangthaiHD >= 4 ? "background-color: #2dc258" : ""}" id="order_ship_out_text"></div>
<div class="order_receive" id="order_receive">
    <div class="order_receive_check_symbol" style="${orderItem.data[0].id_trangthaiHD == 4 ? "background-color: #2dc258; border: 5px solid #2dc258" : orderItem.data[0].id_trangthaiHD > 4 ? "background-color: #FFFFFF;border: 5px solid #2dc258": ""}" id="order_receive_check_symbol">
        ✔
    </div>
    <div class="order_receive_text" id="order_receive_text">
        Order Received
    </div>
</div>
<div class="order_connector4" style="${orderItem.data[0].id_trangthaiHD >= 5 ? "background-color: #2dc258" : ""}"></div>
<div class="order_rate" id="order_rate">
    <div class="order_rate_check_symbol" style="${orderItem.data[0].id_trangthaiHD == 5 ? "background-color: #2dc258; border: 5px solid #2dc258" : orderItem.data[0].id_trangthaiHD > 5 ? "background-color: #FFFFFF;border: 5px solid #2dc258": ""}" id="order_rate_check_symbol">
        ✔
    </div>
    <div class="order_rate_text" id="order_rate_text">
        Order Canceled
    </div>
</div>`


}


const main = async () =>{
    renderOrderDetail()
}

main()