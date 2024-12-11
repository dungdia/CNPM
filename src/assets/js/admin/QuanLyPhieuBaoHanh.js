import initTable, {
  fetchJsonData,
  getSelectedData,
  alertSelectRow,
  postImageData,
} from "./datatables-simple.js";

import CookieManager from "https://cdn.jsdelivr.net/npm/js-cookie-manager@1.0.2/index.min.js";

let dataTable;
let item = {};

async function reloadDataTable() {
  dataTable.destroy();
  const jsonData = await fetchJsonData("getAllPhieuBaoHanh");
  dataTable = initTable(jsonData);
}

async function renderProductInfo(data, type) {
  const popUpLabel = document.getElementById("popup-label");
  const popUpBody = document.getElementById("Popup-Body");

  popUpBody.innerHTML = `
  ${
    type === "detail"
      ? `
  <div class="form-floating mb-3">
      <input 
      type="number" 
      class="form-control" 
      id="productId" 
      placeholder="" 
      value="${data.id_phieubaohanh}" 
      readonly
      style="appearance: none; -moz-appearance: textfield; margin: 0;">
      <label for="productId">ID</label> 
  </div>     
`
      : ` 
`
  }
 
  <div class="form-floating mb-3">
      <input 
      type="number" 
      class="form-control" 
      id="productIdHd" 
      placeholder="" 
      value="${type === "add" ? `` : data.id_hoadon}" 
      readonly
      style="appearance: none; -moz-appearance: textfield; margin: 0;">
      <label for="productIdHd">ID Hoá Đơn</label> 
  </div>     
  <div class="form-floating mb-3">
  <input 
    type="text" 
    class="form-control" 
    id="productImei" 
    placeholder="" 
    value="${type === "add" ? `` : data.imei}" 
    readonly
    style="appearance: none; -moz-appearance: textfield; margin: 0;">
    <label for="productImei">Imei</label> 
  </div>

  ${
    type == "detail"
      ? ""
      : `
      <button class="btn btn-primary w-auto" id="btn-choose-imei">
      Chọn Sản Phẩm Bảo Hành</button><br/>
      <label for="sanphambaohanh">Phiên bản sản phẩm</label> 
      </div>
      <div id="sanphambaohanh"></div>
  `
  }

  <div class="form-floating mb-3">
  <input 
  type="text" 
  class="form-control" 
  id="productIssue" 
  placeholder="" 
  value="${type === "add" ? `` : data.Tinh_trang_may}" 
  ${type !== "detail" ? `` : `readonly`}
  style="appearance: none; -moz-appearance: textfield; margin: 0;">
  <label for="productIssue">Tình trạng máy</label> 
  </div>
  ${
    type === "add"
      ? ""
      : `
      <div class="form-floating mb-3">
      <input 
      type="datetime-local" 
      class="form-control" 
      id="reciveDay" 
      placeholder="" 
      value="${new Date(data.ngay_BaoHanh).toISOString().slice(0, 19)}"
      disabled
      style="appearance: none; -moz-appearance: textfield; margin: 0;">
      <label for="reciveDay">Ngày Bảo Hành</label> 
      </div>
  `
  }
  
    <div class="form-floating mb-3">
    <input 
    type="datetime-local" 
    class="form-control" 
    id="sendBackDay" 
    placeholder="" 
    value="${
      type === "add" ? `` : new Date(data.ngay_tra).toISOString().slice(0, 19)
    }" 
    ${type !== "detail" ? `` : `readonly`}
    style="appearance: none; -moz-appearance: textfield; margin: 0;">
    <label for="sendBackDay">Ngày trả</label> 
    </div>
  `;

  if (type === "detail") return;

  const hoadonList = await fetchJsonData("getAllCtHoaDonConBaoHanh");
  const hoadonTable = initTable(hoadonList, "sanphambaohanh");

  const selectImeiBtn = document.getElementById("btn-choose-imei");
  const productOrderId = document.getElementById("productIdHd");
  const productImei = document.getElementById("productImei");

  const modal = document.getElementById("popupContent");
  modal.addEventListener("hide.bs.modal", () => {
    hoadonTable.destroy();
  });

  selectImeiBtn.onclick = () => {
    const selectRow = document.querySelector("#sanphambaohanh .selectedRow");
    if (!selectRow) {
      alert("Chưa có chọn sản phẩm nào để bảo hành");
      return;
    }
    const rowIdx = selectRow.getAttribute("data-index");
    const selectedData = getSelectedData(hoadonTable, rowIdx);
    productImei.value = selectedData.imei;
    productOrderId.value = selectedData.id_hoadon;
  };
}

window.addEventListener("DOMContentLoaded", async () => {
  const jsonData = await fetchJsonData("getAllPhieuBaoHanh");
  dataTable = initTable(jsonData);

  const removeBtn = document.getElementById("btn-popup-remove");
  removeBtn.remove();

  const btnPopUp = document.getElementById("btn-popup-detail");
  const editBtn = document.getElementById("btn-popup-update");
  const addbtn = document.getElementById("btn-popup-add");

  // xem chi tiet
  btnPopUp.addEventListener("click", () => {
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    const popUpLabel = document.getElementById("popup-label");
    popUpSaveBtn.onclick = {};
    const selectRow = document.querySelector(".selectedRow");
    if (!selectRow) {
      alertSelectRow();
      return;
    }
    const rowIdx = selectRow.getAttribute("data-index");
    const selectedData = getSelectedData(dataTable, rowIdx);
    popUpSaveBtn.classList.add("d-none");

    popUpLabel.textContent = `Chi tiết Phiểu Bảo Hành`;
    renderProductInfo(selectedData, "detail");
  });

  addbtn.addEventListener("click", () => {
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    const popUpLabel = document.getElementById("popup-label");

    popUpSaveBtn.classList.remove("d-none");

    popUpLabel.textContent = `Thêm Phiếu Bảo Hành`;
    renderProductInfo({}, "add");
    popUpSaveBtn.onclick = async () => {
      const productOrderId = document.getElementById("productIdHd");
      const productImei = document.getElementById("productImei");
      const productIssue = document.getElementById("productIssue");
      const sendBackDay = document.getElementById("sendBackDay");
      const popUpBody = document.getElementById("Popup-Body");

      if (!productOrderId.value || !productImei.value) {
        alert("Phải chọn một sản phẩm để bảo hành");
        return;
      }

      const productIssueRegex =
        /^[a-zA-ZÀ-ỹà-ỹ0-9][a-zA-ZÀ-ỹà-ỹ0-9,_.+\s]{0,150}[^\s]$/;
      if (!productIssueRegex.test(productIssue.value)) {
        alert(
          "Tình trạng máy chỉ được từ 1 - 150 kí tự, không bắt đầu bằng khoảng trắng, không kết thúc bằng khoảng trắng và không chứa kí tự đặc biệt"
        );
        return;
      }

      if (!sendBackDay.value) {
        alert("Phải chọn một ngày để trả máy");
        return;
      }

      const sendBackDate = new Date(Date.parse(sendBackDay.value));
      const currentDate = new Date();

      if (sendBackDate <= currentDate) {
        alert("Ngày trả không được thấp hơn ngày hiện tại");
        return;
      }

      const projection = {
        order_id: productOrderId.value,
        imei: productImei.value,
        issue: productIssue.value,
        sendBackDate: Date.parse(sendBackDate.toISOString()),
        type: "add",
      };

      const res = await fetchJsonData("PhieuBaoHanh", "POST", projection);

      if (!res.success) {
        alert(res.message);
        return;
      }
      reloadDataTable();

      popUpBody.innerHTML = "Tạo Phiếu Bảo thành công";
      popUpSaveBtn.classList.add("d-none");
    };
  });

  editBtn.addEventListener("click", () => {
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    const popUpLabel = document.getElementById("popup-label");
    popUpSaveBtn.onclick = {};
    const selectRow = document.querySelector(".selectedRow");
    if (!selectRow) {
      alertSelectRow();
      return;
    }
    const rowIdx = selectRow.getAttribute("data-index");
    const selectedData = getSelectedData(dataTable, rowIdx);
    popUpSaveBtn.classList.remove("d-none");

    popUpLabel.textContent = `Sửa phiếu bảo hành`;
    renderProductInfo(selectedData, "edit");
    popUpSaveBtn.onclick = async () => {
      const productOrderId = document.getElementById("productIdHd");
      const productImei = document.getElementById("productImei");
      const productIssue = document.getElementById("productIssue");
      const sendBackDay = document.getElementById("sendBackDay");
      const popUpBody = document.getElementById("Popup-Body");
      const reciveDay = document.getElementById("reciveDay");

      if (!productOrderId.value || !productImei.value) {
        alert("Phải chọn một sản phẩm để bảo hành");
        return;
      }

      if (!productIssue.value) {
        alert("Không được bỏ trống tình trạng máy");
        return;
      }

      if (!sendBackDay.value) {
        alert("Phải chọn một ngày để trả máy");
        return;
      }

      const sendBackDate = new Date(Date.parse(sendBackDay.value));
      const reciveDate = new Date(Date.parse(reciveDay.value));

      if (sendBackDate <= reciveDate) {
        alert("Ngày trả không được thấp hơn ngày bảo hành");
        return;
      }

      const projection = {
        baohanh_id: selectedData.id_phieubaohanh,
        order_id: productOrderId.value,
        imei: productImei.value,
        issue: productIssue.value,
        sendBackDate: Date.parse(sendBackDate.toISOString()),
        type: "edit",
      };

      const res = await fetchJsonData("PhieuBaoHanh", "POST", projection);

      if (!res.success) {
        alert(res.message);
        return;
      }
      reloadDataTable();

      popUpBody.innerHTML = "Sửa Phiếu Bảo thành công";
      popUpSaveBtn.classList.add("d-none");
    };
  });

  const cookieManager = new CookieManager();

  const user_vaitro = cookieManager.get("vaitro_id");

  const userRoleProject = { id_vaitro: user_vaitro };

  const userPermissionList = await fetchJsonData(
    "getPermissionList",
    "GET",
    userRoleProject
  );
  if (!userPermissionList.includes(15)) addbtn.remove();
  if (!userPermissionList.includes(16)) editBtn.remove();
});
