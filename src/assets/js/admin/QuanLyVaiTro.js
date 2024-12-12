import initTable, {
  fetchJsonData,
  getSelectedData,
  alertSelectRow,
} from "./datatables-simple.js";

import CookieManager from "https://cdn.jsdelivr.net/npm/js-cookie-manager@1.0.2/index.min.js";

let dataTable;
let item = {};

async function reloadDataTable() {
  dataTable.destroy();
  const jsonData = await fetchJsonData("getAllRole");
  dataTable = initTable(jsonData);
}

async function renderRoleInfo(data, type) {
  const popUpLabel = document.getElementById("popup-label");
  const popUpBody = document.getElementById("Popup-Body");

  const permissionList = await fetchJsonData("getPermissionList");
  const vaitroProject = { id_vaitro: data.id_vaitro };

  const rolePermissionList = await fetchJsonData(
    "getPermissionList",
    "GET",
    vaitroProject
  );

  //   permission list
  //     <div class="form-check form-switch form-check-reverse text-start fs-6" id="test">
  //     <input class="form-check-input me-1 permission" type="checkbox" role="switch" id="${
  //       data.id_vaitro
  //     }" ${type == "view" ? "disabled" : ""}>
  //     <label class="form-check-label" for="${data.id_vaitro}">${
  //         data.ten_vaitro
  //     }</label>
  //     </div>

  popUpBody.innerHTML = `
  ${
    type !== "add"
      ? `
  <div class="form-floating mb-3">
      <input 
      type="number" 
      class="form-control" 
      id="roleId" 
      placeholder="" 
      value="${data.id_vaitro}" 
      readonly
      style="appearance: none; -moz-appearance: textfield; margin: 0;">
      <label for="roleId">ID</label> 
  </div>     
`
      : ` 
`
  }

        <div class="form-floating mb-3">
            <input 
            type="text" 
            class="form-control" 
            id="roleName" 
            value="${type === "add" ? `` : data.ten_vaitro}"
            placeholder=""
            ${type === "detail" ? `readonly` : ``}
            >
            <label for="roleName">Tên vai trò</label>
        </div>
        <p class="fs-5">Danh sách quyền:</p><br/>
        ${permissionList
          .map(
            (
              item
            ) => `<div class="form-check form-switch form-check-reverse text-start fs-6" id="test">
            <input class="form-check-input me-1 permission-list" type="checkbox" role="switch" id="${
              item.id_quyen
            }" ${type == "detail" ? "disabled" : ""} ${
              rolePermissionList.includes(item.id_quyen) ? "checked" : ""
            }>
            <label class="form-check-label" for="${item.id_quyen}">${
              item.ten_quyen
            }</label>
            </div>`
          )
          .join("")}
        

    `;
}

window.addEventListener("DOMContentLoaded", async () => {
  const jsonData = await fetchJsonData("getAllRole");
  dataTable = initTable(jsonData);

  // xoa remove button
  const removeBtn = document.getElementById("btn-popup-remove");
  removeBtn.remove();

  const popupBtnGroup = document.getElementById("popup-button-group");
  popupBtnGroup.innerHTML += `<button class="btn btn-danger w-auto" id="btn-popup-ban" data-bs-toggle="modal" data-bs-target="#popupContent">Ban/Unban</button>`;

  const btnPopUp = document.getElementById("btn-popup-detail");
  const banBtn = document.getElementById("btn-popup-ban");
  const editBtn = document.getElementById("btn-popup-update");
  const addbtn = document.getElementById("btn-popup-add");

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

    popUpLabel.textContent = `Chi tiết Vai Trò`;
    renderRoleInfo(selectedData, "detail");
  });

  addbtn.addEventListener("click", () => {
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    const popUpLabel = document.getElementById("popup-label");
    popUpSaveBtn.classList.remove("d-none");

    popUpLabel.textContent = `Thêm vai trò`;

    renderRoleInfo({}, "add");
    popUpSaveBtn.onclick = async () => {
      const permissionListSwitch =
        document.getElementsByClassName("permission-list");
      const roleName = document.getElementById("roleName");
      const popUpBody = document.getElementById("Popup-Body");
      if (!roleName) {
        alert("Không tìm thấy tên vai trò");
        return;
      }
      if (roleName.value == "") {
        alert("Không được bỏ trống tên vai trò");
        return;
      }

      const data = [];
      for (const item of permissionListSwitch) {
        if (item.checked) data.push(Number.parseInt(item.id));
      }

      const insertProjection = {
        ten_vaitro: roleName.value,
        data: data,
        type: "insert",
      };
      const result = await fetchJsonData("VaiTro", "POST", insertProjection);

      if (!result.success) {
        alert(result.message);
        return;
      }

      reloadDataTable();
      popUpBody.textContent = "Thêm vai trò thành công";
      popUpSaveBtn.classList.add("d-none");
    };
  });

  editBtn.addEventListener("click", () => {
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    const popUpLabel = document.getElementById("popup-label");
    const selectRow = document.querySelector(".selectedRow");
    if (!selectRow) {
      alertSelectRow();
      return;
    }
    const rowIdx = selectRow.getAttribute("data-index");
    const selectedData = getSelectedData(dataTable, rowIdx);
    popUpSaveBtn.classList.remove("d-none");

    popUpLabel.textContent = `Chi tiết Vai Trò`;
    renderRoleInfo(selectedData, "edit");
    popUpSaveBtn.onclick = async () => {
      const permissionListSwitch =
        document.getElementsByClassName("permission-list");
      const roleName = document.getElementById("roleName");
      const roleId = document.getElementById("roleId");
      const popUpBody = document.getElementById("Popup-Body");
      if (!roleName) {
        alert("Không tìm thấy tên vai trò");
        return;
      }
      if (roleName.value == "") {
        alert("Không được bỏ trống tên vai trò");
        return;
      }
      const data = [];
      for (const item of permissionListSwitch) {
        if (item.checked) data.push(Number.parseInt(item.id));
      }

      const editProjection = {
        id_vaitro: roleId.value,
        ten_vaitro: roleName.value,
        data: data,
        type: "edit",
      };

      const result = await fetchJsonData("VaiTro", "POST", editProjection);

      if (!result.success) {
        alert(result.message);
        return;
      }

      reloadDataTable();
      popUpBody.textContent = "Sửa vai trò thành công";
      popUpSaveBtn.classList.add("d-none");
    };
  });

  banBtn.addEventListener("click", () => {
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    const popUpCloseBtn = document.getElementById("Footer-Close-PopUp-Button");
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");

    popUpLabel.textContent = "Khoá vai trò";

    const selectRow = document.querySelector(".selectedRow");
    if (!selectRow) {
      alertSelectRow();
      return;
    }
    const rowIdx = selectRow.getAttribute("data-index");
    const selectedData = getSelectedData(dataTable, rowIdx);

    if (selectedData.id_vaitro == 2 || selectedData.id_vaitro == 1) {
      popUpBody.textContent = "Không thể khoá quyền này";
    }

    popUpBody.textContent = `Bạn có muốn ${
      selectedData.trangthai == 1 ? "khoá" : "mở khoá"
    } ${selectedData.ten_vaitro}`;

    popUpSaveBtn.classList.remove("d-none");

    popUpSaveBtn.textContent = "YES";
    popUpCloseBtn.textContent = "NO";

    const modal = document.getElementById("popupContent");
    modal.addEventListener("hide.bs.modal", () => {
      popUpSaveBtn.classList.add("d-none");
      popUpSaveBtn.textContent = "Save changes";
      popUpCloseBtn.textContent = "Close";
    });

    popUpSaveBtn.onclick = async () => {
      const lockProjection = {
        id_vaitro: selectedData.id_vaitro,
        newtrangthai: selectedData.trangthai == 1 ? 0 : 1,
        type: "lock",
      };
      console.log(lockProjection);
      const result = await fetchJsonData(
        "VaiTro",
        "POST",
        lockProjection
      ).catch((e) => {
        alert(e);
      });

      if (!result.success) {
        popUpBody.textContent = result.message;
        popUpSaveBtn.classList.add("d-none");
        popUpSaveBtn.textContent = "Save changes";
        popUpCloseBtn.textContent = "Close";
        return;
      }

      popUpBody.textContent = `${
        selectedData.trangthai == 1 ? "khoá" : "Mở khoá"
      } vai trò ${selectedData.ten_vaitro} thành công`;
      popUpSaveBtn.classList.add("d-none");
      popUpSaveBtn.textContent = "Save changes";
      popUpCloseBtn.textContent = "Close";
      reloadDataTable();
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
  if (!userPermissionList.includes(18)) addbtn.remove();
  if (!userPermissionList.includes(19)) editBtn.remove();
  if (!userPermissionList.includes(20)) banBtn.remove();
});
