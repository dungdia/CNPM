const getOrderList = async () => {
  const res = await fetch(`/api/auth/getOrderList`);
  const json = await res.json();
  return json;
};

const main = async () => {
  const order_list_element = document.getElementById("order_list");
  if (!order_list_element) {
    alert("Không tìm thấy container");
    return;
  }
  const orderList = await getOrderList();
  order_list_element.innerHTML = "";

  //     <article class="order_item">
  //     <figure class="order_item_image_container">
  //         <img src="./assets/image/default.jpg" class="order_item_img" alt="">
  //     </figure>
  //     <div class="order_content">
  //         <div class="order_content_row1">
  //             <div class="order_content_name">
  //                 Hóa đơn 1
  //             </div>

  //             <div class="order_content_id_container">
  //                 Mã đơn hàng :
  //                 <span class="order_content_id">
  //                     200
  //                 </span>
  //             </div>
  //         </div>
  //         <div class="order_content_row2">
  //             <div class="order_content_price">
  //                 10.123.456đ
  //             </div>
  //             <a href="" class="order_content_detail_btn">
  //                 View Order Details
  //             </a>
  //         </div>
  //         <div class="order_content_row3">
  //             Ngày đặt hàng:
  //             <span class="order_content_date">
  //                 25/05/2024
  //             </span>
  //         </div>
  //         <div class="order_content_row4">
  //             Tình trạng:
  //             <span class="order_content_status">Order Placed</span>
  //         </div>
  //         <div class="order_content_cancel_btn">Cancel</div>
  //     </div>
  // </article>
  let count = 1;
  console.log(orderList);
  const VND = new Intl.NumberFormat("Vi-VN", {
    style: "currency",
    currency: "VND",
  });

  for (const order of orderList.data) {
    const orderItem = document.createElement("article");
    orderItem.classList.add("order_item");

    orderItem.innerHTML = `
        <figure class="order_item_image_container">
            <img src="./img/${order.ten_sanpham}" class="order_item_img" alt="">
        </figure>
        <div class="order_content">
            <div class="order_content_row1">
                <div class="order_content_name">
                    Hóa đơn ${count}
                </div>

                <div class="order_content_id_container">
                    Mã đơn hàng :
                    <span class="order_content_id">
                        ${order.id_hoadon}
                    </span>
                </div>
            </div>
            <div class="order_content_row2">
                <div class="order_content_price">
                    ${VND.format(order.gia_ban)}
                </div>
                <a href="/orderDetail?id=${
                  order.id_hoadon
                }" class="order_content_detail_btn">
                    View Order Details
                </a>
            </div>
            <div class="order_content_row3">
                Ngày đặt hàng:
                <span class="order_content_date">
                    ${order.ngayban}
                </span>
            </div>
            <div class="order_content_row4">
                Tình trạng:
                <span class="order_content_status">${order.tinh_trang}</span>
            </div>${
              order.id_trangthaiHD != 1 && order.id_trangthaiHD != 2
                ? ""
                : `<div class="order_content_cancel_btn" id="${order.id_hoadon}">Cancel</div>`
            }
            
        </div>`;

    order_list_element.append(orderItem);
    count++;
  }

  const orderCancelBtn = document.getElementsByClassName(
    "order_content_cancel_btn"
  );
  for (const btn of orderCancelBtn) {
    btn.onclick = async () => {
      const orderId = btn.id;
      const data = { order_id: orderId };
      try {
        const res = await fetch(`/api/auth/cancelOrder`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!result.success) {
          alert(result.message);
          return;
        }
        main();
      } catch (error) {
        console.log(error);
      }
    };
  }
  const orderAmount = document.getElementById("order_amount");
  orderAmount.textContent = `(${orderList.data.length} orders)`;
};

main();
