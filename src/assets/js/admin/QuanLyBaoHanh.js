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
  const jsonData = await fetchJsonData("getAllBaoHanh", "GET", {
    action: "QuanLyBaoHanh",
  });
  dataTable = initTable(jsonData);
}

async function renderWarranty(data, type) {
  const popUpLabel = document.getElementById("popup-label");
  const popUpBody = document.getElementById("Popup-Body");
  popUpBody.innerHTML = `
        <div class="form-floating mb-3">
            <input 
            type="number" 
            class="form-control" 
            id="warrantyPeriod" 
            placeholder="" 
            value=${type === "add" ? `` : data.sothang}
            style="appearance: none; -moz-appearance: textfield; margin: 0;">
            <label for="warrantyPeriod">Bảo hành (tháng)</label> 
        </div>
    `;
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

  popUpLabel.textContent = "Thêm bảo hành";

  renderWarranty({}, "add");

  popUpSaveBtn.onclick = async () => {
    console.log("Save");

    const warrantyPeriod = document.getElementById("warrantyPeriod");
    const projection = {
      sothang: parseInt(warrantyPeriod.value),
      query: "insert",
    };

    const response = await fetchJsonData("BaoHanh", "POST", projection);
    if (!response.success) {
      alert(response.message);
    } else {
      alert(response.message);
    }
    reloadDataTable();
  };
}

async function showEdit(data) {
  const popUpLabel = document.getElementById("popup-label");
  const popUpBody = document.getElementById("Popup-Body");
  const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
  const popUpCloseBtn = document.getElementById("Footer-Close-PopUp-Button");
  popUpSaveBtn.classList.remove("d-none");

  popUpLabel.textContent = `Sửa bảo hành: ${data.id_baohanh}`;
  renderWarranty(data, "edit");

  popUpSaveBtn.onclick = async () => {
    console.log("Save");

    const warrantyPeriod = document.getElementById("warrantyPeriod");
    const projection = {
      id_baohanh: parseInt(data.id_baohanh),
      sothang: parseInt(warrantyPeriod.value),
      query: "update",
    };

    const response = await fetchJsonData("BaoHanh", "POST", projection);
    if (!response.success) {
      alert(response.message);
    } else {
      alert(response.message);
      console.log("Hi");
      window.location.reload();
      reloadDataTable();
    }
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
      query: "delete",
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
  const jsonData = await fetchJsonData("getAllBaoHanh", "GET", {
    action: "QuanLyBaoHanh",
  });
  dataTable = initTable(jsonData);

  const btnPopUp = document.getElementById("btn-popup-detail");
  const removeBtn = document.getElementById("btn-popup-remove");
  removeBtn.remove();
  btnPopUp.remove();

  const editBtn = document.getElementById("btn-popup-update");
  const addbtn = document.getElementById("btn-popup-add");

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

  const cookieManager = new CookieManager();

  const user_vaitro = cookieManager.get("vaitro_id");

  const userRoleProject = { id_vaitro: user_vaitro };

  const userPermissionList = await fetchJsonData(
    "getPermissionList",
    "GET",
    userRoleProject
  );
  if (!userPermissionList.includes(9)) addbtn.remove();
  if (!userPermissionList.includes(10)) editBtn.remove();
});
