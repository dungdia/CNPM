import initTable, {
    fetchJsonData,
    getSelectedData,
    alertSelectRow,
    postImageData,
} from "./datatables-simple.js";

let dataTable;
let item = {};

// async function reloadDataTable() {
//     dataTable.destroy();
//     const jsonData = await fetchJsonData("getTaiKhoanNVList");
//     dataTable = initTable(jsonData)
// }

async function renderProductInfo(data, type) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    if (data) {
        [item] = await fetchJsonData("getOneSanPham", "GET", { id_sanpham: data.id_sanpham });
    }
    const brand = await fetchJsonData("getAllThuongHieu");
    popUpBody.innerHTML = `
        ${type === "detail" ? `
            <div class="form-floating mb-3">
                <input 
                type="number" 
                class="form-control" 
                id="productId" 
                placeholder="" 
                value="${item.id_sanpham}" 
                readonly
                style="appearance: none; -moz-appearance: textfield; margin: 0;">
                <label for="productId">ID</label> 
            </div>     
        ` : ` 
        `}

        <div class="form-floating mb-3">
            <input 
            type="text" 
            class="form-control" 
            id="productName" 
            placeholder="" 
            value="${type === "add" ? `` : item.ten_sanpham}" 
            ${type !== "detail" ? `` : `readonly`}
            style="appearance: none; -moz-appearance: textfield; margin: 0;">
            <label for="productName">Tên sản phẩm</label> 
        </div>

        <div class="form-floating mb-3">
            <input 
            type="number" 
            class="form-control" 
            id="productSZ" 
            placeholder="" 
            value="${type === "add" ? `` : item.kichThuocMan}" 
            ${type !== "detail" ? `` : `readonly`}
            style="appearance: none; -moz-appearance: textfield; margin: 0;">
            <label for="productSZ">Kích thước màn</label> 
        </div>

        <div class="form-floating mb-3">
            <input 
            type="text" 
            class="form-control" 
            id="productRC" 
            placeholder="" 
            value="${type === "add" ? `` : item.cameraSau}" 
            ${type !== "detail" ? `` : `readonly`}
            style="appearance: none; -moz-appearance: textfield; margin: 0;">
            <label for="productRC">Camera sau</label> 
        </div>

        <div class="form-floating mb-3">
            <input 
            type="text" 
            class="form-control" 
            id="productFC" 
            placeholder="" 
            value="${type === "add" ? `` : item.cameraTruoc}" 
            ${type !== "detail" ? `` : `readonly`}
            style="appearance: none; -moz-appearance: textfield; margin: 0;">
            <label for="productFC">Camera trước</label> 
        </div>
        
        <div class="form-floating mb-3">
            <input 
            type="text" 
            class="form-control" 
            id="productCPU" 
            placeholder="" 
            value="${type === "add" ? `` : item.chipXuLy}" 
            ${type !== "detail" ? `` : `readonly`}
            style="appearance: none; -moz-appearance: textfield; margin: 0;">
            <label for="productCPU">Chip Xu Ly</label> 
        </div>
        <!-- HE DIEU HANH -->
        <div class="form-floating mb-3">
            <input 
            type="text" 
            class="form-control" 
            id="productOS" 
            placeholder="" 
            value="${type === "add" ? `` : item.heDieuHanh}" 
            ${type !== "detail" ? `` : `readonly`}
            style="appearance: none; -moz-appearance: textfield; margin: 0;">
            <label for="productOS">Hệ điều hành</label> 
        </div>
        <!-- DUNG LUONG PIN -->
        <div class="form-floating mb-3">
            <input 
            type="number" 
            class="form-control" 
            id="productBC" 
            placeholder="" 
            value="${type === "add" ? `` : item.dungLuongPin}" 
            ${type !== "detail" ? `` : `readonly`}
            style="appearance: none; -moz-appearance: textfield; margin: 0;">
            <label for="productBC">Dung Lượng Pin</label> 
        </div>
        <!-- THUONG HIEU -->
        <div class="form-floating mb-3">
            <select 
                class="form-select" 
                id="brandSelect"
                ${(type === "add" || type === "edit") ? `` : `disabled`}
                >
                ${(type === "add" || type === "edit")
            ? ``
            : `<option value="${brand.id_thuonghieu}">${brand.ten_thuonghieu}</option>`}
            </select>
            <label for="brandSelect">Thương hiệu</label>
        </div>
        </div>
        
        ${type === "add" || type === "edit" ? `
            <div class="form-floating mb-3">
                <form id="imageForm" enctype="multipart/form-data">
                    <div class="form-floating mb-3">
                    <input 
                    type="file" 
                    class="form-control" 
                    id="productImg" 
                    placeholder=""
                    accept="image/*"
                    name="image"
                    style="appearance: none; -moz-appearance: textfield; margin: 0;">
                <label for="productImg">Ảnh sản phẩm</label> 
                </form>
            </div> 
        ` : `
            <div class="form-floating mb-3">
                <label style="top: -10px" for="productImg">Ảnh</label> 
                <img
                class="img-thumbnail"
                id="productImg" 
                src="/img/${item.ten_sanpham}" 
                alt="Image"
                style="width: 150px; height: auto; padding: 30px 0 30px 0;">
            </div>      
        `}
    `
    const brandSelect = document.getElementById("brandSelect");
    brandSelect.innerHTML = brand.map(item => `<option value="${item.id_thuonghieu}">${item.ten_thuonghieu}</option>`).join("");
}

async function showDetail(data) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    popUpSaveBtn.classList.add("d-none");

    popUpLabel.textContent = `Chi tiết sản phẩm`;
    renderProductInfo(data, "detail");
}

function showAdd() {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");

    popUpSaveBtn.classList.remove("d-none");

    popUpLabel.textContent = "Thêm sản phẩm";

    renderProductInfo({}, "add")

    popUpSaveBtn.onclick = async () => {
        console.log("Save")

        const productImg = document.getElementById("productImg").files[0];
        const productName = document.getElementById("productName").value;
        const productSZ = document.getElementById("productSZ").value;
        const productRC = document.getElementById("productRC").value;
        const productFC = document.getElementById("productFC").value;
        const productCPU = document.getElementById("productCPU").value;
        const productOS = document.getElementById("productOS").value;
        const productBC = document.getElementById("productBC").value;
        const productBrand = document.getElementById("brandSelect").value;

        const projection = {
            "ten_sanpham": productName,
            "kichThuocMan": productSZ,
            "cameraSau": productRC,
            "cameraTruoc": productFC,
            "chipXuLy": productCPU,
            "heDieuHanh": productOS,
            "dungLuongPin": productBC,
            "id_thuonghieu": productBrand,
            "hinh_anh": productImg
        }
        const formData = new FormData();
        for (const [key, value] of Object.entries(projection)) {
            formData.append(key, value);
        }
        console.log(formData)
        const res = await postImageData("addSanPham", formData);
        if (!res.success) {
            alert(res.message)
        } else {
            alert(res.message)
        }
    }
}

async function showEdit(data) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    const popUpCloseBtn = document.getElementById("Footer-Close-PopUp-Button")
    popUpSaveBtn.classList.remove("d-none");

    popUpLabel.textContent = `Sửa sản phẩm: ${data.id_sanpham}`;
    renderProductInfo(data, "edit");

    popUpSaveBtn.onclick = async () => {
        const productImg = document.getElementById("productImg").files[0];
        const productName = document.getElementById("productName").value;
        const productSZ = document.getElementById("productSZ").value;
        const productRC = document.getElementById("productRC").value;
        const productFC = document.getElementById("productFC").value;
        const productCPU = document.getElementById("productCPU").value;
        const productOS = document.getElementById("productOS").value;
        const productBC = document.getElementById("productBC").value;
        const productBrand = document.getElementById("brandSelect").value;

        const projection = {
            "id_sanpham": data.id_sanpham,
            "ten_sanpham": productName,
            "kichThuocMan": productSZ,
            "cameraSau": productRC,
            "cameraTruoc": productFC,
            "chipXuLy": productCPU,
            "heDieuHanh": productOS,
            "dungLuongPin": productBC,
            "id_thuonghieu": productBrand,
            "hinh_anh": productImg
        }
        const formData = new FormData();
        for (const [key, value] of Object.entries(projection)) {
            formData.append(key, value);
        }
        console.log(formData)
        const res = await postImageData("updateSanPham", formData);
        if (!res.success) {
            alert(res.message)
        } else {
            alert(res.message)
        }
    }
}

async function showLock(data) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    const popUpCloseBtn = document.getElementById("Footer-Close-PopUp-Button")
    popUpSaveBtn.classList.remove("d-none");

    popUpSaveBtn.textContent = "YES";
    popUpCloseBtn.textContent = "NO";

    popUpLabel.textContent = `Khóa sản phẩm`;
    popUpBody.textContent = `Bạn có muốn ${(data.trangThai === "1" ? "lock" : "unclock")} tài khoản ${data.ten_sanpham}?`;

    popUpSaveBtn.onclick = async () => {
        const projection = {
            "id_sanpham": data.id_sanpham,
            "trangThai": data.trangThai === "1" ? "0" : "1",
        }
        const formData = new FormData();
        for (const [key, value] of Object.entries(projection)) {
            formData.append(key, value);
        }
        console.log(formData)
        const res = await postImageData("updateSanPham", formData);
        if (!res.success) {
            alert(res.message)
        } else {
            alert(res.message)
        }
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    console.log("hi")
    const jsonData = await fetchJsonData("getAllSanPham")
    dataTable = initTable(jsonData);

    // xoa remove button
    const removeBtn = document.getElementById("btn-popup-remove");
    removeBtn.remove()

    const popupBtnGroup = document.getElementById("popup-button-group");
    popupBtnGroup.innerHTML += `<button class="btn btn-danger w-auto" id="btn-popup-ban" data-bs-toggle="modal" data-bs-target="#popupContent">Lock/Unlock</button>`

    const banBtn = document.getElementById("btn-popup-ban")
    const btnPopUp = document.getElementById("btn-popup-detail");
    const editBtn = document.getElementById("btn-popup-update");
    const addbtn = document.getElementById("btn-popup-add");

    // xem chi tiet
    btnPopUp.addEventListener("click", () => {
        console.log("Xem chi tiet tk")
        const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
        popUpSaveBtn.onclick = {};
        const selectRow = document.querySelector(".selectedRow");
        if (!selectRow) {
            alertSelectRow();
            return;
        }
        const rowIdx = selectRow.getAttribute("data-index");
        const selectedData = getSelectedData(dataTable, rowIdx);
        console.log(selectedData)
        showDetail(selectedData);
    });

    addbtn.addEventListener("click", () => {
        const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
        popUpSaveBtn.onclick = {};

        showAdd();
    })

    editBtn.addEventListener("click", () => {
        const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
        popUpSaveBtn.onclick = {};
        const selectRow = document.querySelector(".selectedRow");
        if (!selectRow) {
            alertSelectRow();
            return;
        }
        const rowIdx = selectRow.getAttribute("data-index");
        const selectedData = getSelectedData(dataTable, rowIdx);

        showEdit(selectedData)
    })

    banBtn.addEventListener("click", () => {
        const selectRow = document.querySelector(".selectedRow");
        if (!selectRow) {
            alertSelectRow();
            return;
        }
        const rowIdx = selectRow.getAttribute("data-index");
        const selectedData = getSelectedData(dataTable, rowIdx);
        console.log(selectedData)
        showLock(selectedData);
    })
})