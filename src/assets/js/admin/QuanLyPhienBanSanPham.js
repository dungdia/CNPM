import initTable, {
  fetchJsonData,
  getSelectedData,
  alertSelectRow,
} from "./datatables-simple.js";

import CookieManager from "https://cdn.jsdelivr.net/npm/js-cookie-manager@1.0.2/index.min.js";

let dataTable;
let item;

async function reloadDataTable() {
  dataTable.destroy();
  const jsonData = await fetchJsonData("getAllChiTietSP");
  dataTable = initTable(jsonData);
}

async function renderProductInfo(data, type) {
  const popUpLabel = document.getElementById("popup-label");
  const popUpBody = document.getElementById("Popup-Body");
  if (data) {
    [item] = await fetchJsonData("getOneChiTietSP", "GET", {
      id_phienban: data.id_phienban,
    });
  }
  const productList = await fetchJsonData("getAllSanPham");
  const warrantyList = await fetchJsonData("getAllBaoHanh");
  console.log(productList);
  popUpBody.innerHTML = `
        ${
          type === "detail"
            ? `
            <div class="form-floating mb-3">
                <input 
                type="number" 
                class="form-control" 
                id="versionId" 
                placeholder="" 
                value="${item.id_phienban}" 
                readonly
                style="appearance: none; -moz-appearance: textfield; margin: 0;">
                <label for="versionId">ID phiên bản</label> 
            </div>
            
            <div class="form-floating mb-3">
                <input 
                type="number" 
                class="form-control" 
                id="productId" 
                placeholder="" 
                value="${item.id_sanpham}" 
                readonly
                style="appearance: none; -moz-appearance: textfield; margin: 0;">
                <label for="productId">ID phiên bản</label> 
            </div>  
        `
            : ``
        }

        <div class="form-floating mb-3">
            <select 
                class="form-select" 
                id="productSelect"
                ${type === "add" || type === "edit" ? `` : `disabled`}
                >
                ${
                  type === "add"
                    ? ``
                    : `<option value="${item.ten_sanpham}">${item.ten_sanpham}</option>`
                }
            </select>
            <label for="productSelect">Tên sản phẩm</label>
        </div>

        <div class="form-floating mb-3">
            <input 
            type="number" 
            class="form-control" 
            id="productRam" 
            placeholder="" 
            value="${type === "add" ? `` : item.ram}" 
            ${type !== "detail" ? `` : `readonly`}
            style="appearance: none; -moz-appearance: textfield; margin: 0;">
            <label for="productRam">Ram</label> 
        </div>

        <div class="form-floating mb-3">
            <input 
            type="number" 
            class="form-control" 
            id="productMemCap" 
            placeholder="" 
            value="${type === "add" ? `` : item.dung_luong}" 
            ${type !== "detail" ? `` : `readonly`}
            style="appearance: none; -moz-appearance: textfield; margin: 0;">
            <label for="productMemCap">Dung lượng</label> 
        </div>
        
        <div class="form-floating mb-3">
            <select 
                class="form-select" 
                id="warrantySelect"
                ${type === "add" || type === "edit" ? `` : `disabled`}
                >
                ${
                  type === "add"
                    ? ``
                    : `<option value="${item.id_BaoHanh}">${item.sothang}</option>`
                }
            </select>
            <label for="warrantySelect">Bảo hành</label>
        </div>
    `;
  const productSelect = document.getElementById("productSelect");
  const warrantySelect = document.getElementById("warrantySelect");
  productSelect.innerHTML = productList
    .map(
      (item) =>
        `<option value="${item.id_sanpham}">${item.ten_sanpham}</option>`
    )
    .join("");
  warrantySelect.innerHTML = warrantyList
    .map(
      (item) =>
        `<option value="${item.id_baohanh}">${item.sothang} tháng</option>`
    )
    .join("");
  if (type === "edit") {
    productSelect.value = item.id_sanpham;
    warrantySelect.value = item.id_BaoHanh;
    console.log(item);
  }
}

async function showDetail(data) {
  const popUpLabel = document.getElementById("popup-label");
  const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
  popUpSaveBtn.classList.add("d-none");

  popUpLabel.textContent = `Chi tiết phiên bản sản phẩm`;
  renderProductInfo(data, "detail");
}

function showAdd() {
  const popUpLabel = document.getElementById("popup-label");
  const popUpBody = document.getElementById("Popup-Body");
  const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");

  popUpSaveBtn.classList.remove("d-none");

  popUpLabel.textContent = "Thêm phiên bản sản phẩm";

  renderProductInfo({}, "add");

  popUpSaveBtn.onclick = async () => {
    console.log("Save");

    const prodcutRam = document.getElementById("productRam");
    const productMemCap = document.getElementById("productMemCap");
    const warrantySelect = document.getElementById("warrantySelect");
    const productSelect = document.getElementById("productSelect");
    const projection = {
      id_sanpham: productSelect.value,
      ram: prodcutRam.value,
      dung_luong: productMemCap.value,
      id_baoHanh: warrantySelect.value,
      type: "insert",
    };

    const res = await fetchJsonData("PhienBanSp", "POST", projection);
    if (!res.success) {
      alert(res.message);
    } else {
      alert(res.message);
    }
  };
}

async function showEdit(data) {
  const popUpLabel = document.getElementById("popup-label");
  const popUpBody = document.getElementById("Popup-Body");
  const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
  const popUpCloseBtn = document.getElementById("Footer-Close-PopUp-Button");
  popUpSaveBtn.classList.remove("d-none");

  popUpLabel.textContent = `Sửa phiên bản sản phẩm: ${data.id_phienban}`;
  renderProductInfo(data, "edit");

  popUpSaveBtn.onclick = async () => {
    const prodcutRam = document.getElementById("productRam");
    const productMemCap = document.getElementById("productMemCap");
    const warrantySelect = document.getElementById("warrantySelect");
    const productSelect = document.getElementById("productSelect");
    const projection = {
      id_phienban: data.id_phienban,
      id_sanpham: productSelect.value,
      ram: prodcutRam.value,
      dung_luong: productMemCap.value,
      id_baoHanh: warrantySelect.value,
      type: "update",
    };

    const res = await fetchJsonData("PhienBanSp", "POST", projection);
    if (!res.success) {
      return alert(res.message);
    }

    alert(res.message);
    window.location.reload();
    reloadDataTable();
  };
}

async function showLock(data) {
  const popUpLabel = document.getElementById("popup-label");
  const popUpBody = document.getElementById("Popup-Body");
  const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
  const popUpCloseBtn = document.getElementById("Footer-Close-PopUp-Button");
  popUpSaveBtn.classList.remove("d-none");

  popUpSaveBtn.textContent = "YES";
  popUpCloseBtn.textContent = "NO";

  popUpLabel.textContent = `Khóa sản phẩm`;
  popUpBody.textContent = `Bạn có muốn ${
    data.trangthai === "0" ? "khóa" : "mở khóa"
  } phiên bản ${data.ten_sanpham}?`;

  popUpSaveBtn.onclick = async () => {
    const projection = {
      id_phienban: data.id_phienban,
      trangthai: data.trangthai === "1" ? "0" : "1",
      type: "delete",
    };

    const res = await fetchJsonData("ChiTietSp", "POST", projection);
    if (!res.success) {
      alert(res.message);
    }
    popUpBody.textContent = `${data.trangthai === 0 ? "khóa" : "mở khóa"} ${
      data.ten_sanpham
    } thành công`;
    popUpCloseBtn.textContent = "Close";
    popUpSaveBtn.classList.add("d-none");
    reloadDataTable();
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  const jsonData = await fetchJsonData("getAllChiTietSP");
  // const productList = await fetchJsonData("getProductList.php");
  dataTable = initTable(jsonData);

  const removeBtn = document.getElementById("btn-popup-remove");
  removeBtn.remove();

  const popupBtnGroup = document.getElementById("popup-button-group");
  popupBtnGroup.innerHTML += `<button class="btn btn-danger w-auto" id="btn-popup-ban" data-bs-toggle="modal" data-bs-target="#popupContent">Lock/Unlock</button>`;

  const lockBtn = document.getElementById("btn-popup-ban");
  const btnPopUp = document.getElementById("btn-popup-detail");
  const editBtn = document.getElementById("btn-popup-update");
  const addbtn = document.getElementById("btn-popup-add");

  btnPopUp.addEventListener("click", () => {
    console.log("Xem chi tiet tk");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    popUpSaveBtn.onclick = {};
    const selectRow = document.querySelector(".selectedRow");
    if (!selectRow) {
      alertSelectRow();
      return;
    }
    const rowIdx = selectRow.getAttribute("data-index");
    const selectedData = getSelectedData(dataTable, rowIdx);
    console.log(selectedData);
    showDetail(selectedData);
  });

  addbtn.addEventListener("click", () => {
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    popUpSaveBtn.onclick = {};

    showAdd();
  });

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

    showEdit(selectedData);
  });

  lockBtn.addEventListener("click", () => {
    const selectRow = document.querySelector(".selectedRow");
    if (!selectRow) {
      alertSelectRow();
      return;
    }
    const rowIdx = selectRow.getAttribute("data-index");
    const selectedData = getSelectedData(dataTable, rowIdx);
    console.log(selectedData);
    showLock(selectedData);
  });

  const cookieManager = new CookieManager();

  const user_vaitro = cookieManager.get("vaitro_id");

  const userRoleProject = { id_vaitro: user_vaitro };

  const userPermissionList = await fetchJsonData(
    "getPermissionList",
    "GET",
    userRoleProject
  );
  if (!userPermissionList.includes(4)) addbtn.remove();
  if (!userPermissionList.includes(5)) editBtn.remove();
  if (!userPermissionList.includes(6)) lockBtn.remove();
});
