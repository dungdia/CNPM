import initTable, {
    fetchJsonData,
    getSelectedData,
    alertSelectRow,
} from "./datatables-simple.js";

let dataTable;
let item

async function reloadDataTable() {
    dataTable.destroy();
    const jsonData = await fetchJsonData("getAllHoaDon");
    dataTable = initTable(jsonData)
}

const VND = new Intl.NumberFormat("Vi-VN", {
    style: "currency",
    currency: "VND",
});

async function renderOrderInfo(data) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    // popUpSaveBtn.classList.add("d-none");

    popUpLabel.textContent = `Chi tiết hóa đơn`;

    const [orderDetail] = await fetchJsonData("getOneHoaDon", "GET", { id_hoadon: data["ID Hóa Đơn"] });
    const orderStatus = await fetchJsonData("getAllHoaDonTT", "GET");
    console.log(orderDetail, orderStatus)
    popUpBody.innerHTML = `
        <div class="container mt-1">
            <!-- Order Summary -->
            <div class="card">
                <div class="card-body">
                    <h5>Hóa đơn: <span class="text-muted">${orderDetail["id_hoa_don"]}</span></h5>
                    <h6>Khách hàng: <span class="text-muted">${orderDetail["ho_ten"]}</span></h6>
                    <h6>Địa chỉ: <span class="text-muted">${orderDetail["dia_chi"]}</span></h6>
                    <h6>Số điện thoại: <span class="text-muted">${orderDetail["so_dien_thoai"]}</span></h6>
                    <h6>Ghi chú: <span class="text-muted">${orderDetail["ghi_chu"]}</span></h6>
                </div>
            </div>

            <!-- Order Items -->
            <div class="mt-1">
                <h5>Items</h5>
                <table class="table table-bordered">
                    <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Imei</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderDetail["chi_tiet_sp"].map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item["imei"]}</td>
                                <td>${item["ten_san_pham"]}</td>
                                <td>${VND.format(item["gia_ban"])}</td>
                            </tr>
                        `).join("")}
                    </tbody >
        <tfoot>
            <tr>
                <th colspan="4" style="font-weight: bold; padding-right: 130px; text-align: end">
                    Tổng tiền: 
                </th>
            </tr>
            <tr>
                <th colspan="4" style="font-weight: bold; padding-right: 110px; text-align: end">
                    ${VND.format(orderDetail["chi_tiet_sp"].reduce((total, item) => total + item["gia_ban"], 0))}
                </th>
            </tr>
            <tr>
                <th colspan="4">
                    <select class="form-select" id="orderStatusSelect" ${orderDetail["trang_thai_hoadon"] === 4 || orderDetail["trang_thai_hoadon"] === 5 ? "disabled" : ""}>

                    </select>
                </th>
            </tr>
        </tfoot>
                </table >
            </div >
        </div >
        `
    const orderStatusSelect = document.getElementById("orderStatusSelect");
    if (orderDetail["trang_thai_hoadon"] === 1) {
        orderStatusSelect.innerHTML = `${orderStatus.map((item) => `
                <option value="${item["id_trangthaiHD"]}">${item["ten_trangthai"]}</option>
            `).join("")
            }`
    }
    if (orderDetail["trang_thai_hoadon"] === 2) {
        orderStatusSelect.innerHTML = `
            <option value="2">Đã duyệt</option>
            <option value="3">Đang giao</option>`
    }
    if (orderDetail["trang_thai_hoadon"] === 3) {
        orderStatusSelect.innerHTML = `
            <option value="3">Đang giao</option>
            <option value="4">Nhận hàng</option>`
    }
    if (orderDetail["trang_thai_hoadon"] === 4) {
        orderStatusSelect.innerHTML = `
            <option value="4">Nhận hàng</option>`
    }
    if (orderDetail["trang_thai_hoadon"] === 5) {
        orderStatusSelect.innerHTML = `
            <option value="5">Đã hủy</option>`
    }
}

function showDetail(data) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");

    popUpLabel.textContent = `Chi tiết hóa đon`;
    renderOrderInfo(data, "detail");

    popUpSaveBtn.onclick = async () => {
        const orderStatus = document.getElementById("orderStatusSelect");
        const selectedOption = orderStatus.options[orderStatus.selectedIndex];
        console.log(selectedOption.text)
        const projection = {
            id_hoadon: data["ID Hóa Đơn"],
            id_trangthaiHD: orderStatus.value,

        }
        const res = await fetchJsonData("HoaDon", "POST", projection);
        if (!res.success) {
            return alert(res.message)
        }
        alert(res.message);
        window.location.reload();
        reloadDataTable
    }
}

document, addEventListener("DOMContentLoaded", async () => {
    const jsonData = await fetchJsonData("getAllHoaDon");
    dataTable = initTable(jsonData)

    const btnPopUp = document.getElementById("btn-popup-detail");
    const removeBtn = document.getElementById("btn-popup-remove");
    const editBtn = document.getElementById("btn-popup-update");
    const addbtn = document.getElementById("btn-popup-add");

    removeBtn.remove()
    editBtn.remove()
    addbtn.remove()

    btnPopUp.addEventListener("click", () => {
        console.log("Xem chi tiet hóa đơn");
        const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
        popUpSaveBtn.onclick = {};
        const selectRow = document.querySelector(".selectedRow");
        if (!selectRow) {
            alertSelectRow();
            return;
        }
        const rowIdx = selectRow.getAttribute("data-index");
        const selectedData = getSelectedData(dataTable, rowIdx);
        showDetail(selectedData);
    })
})

