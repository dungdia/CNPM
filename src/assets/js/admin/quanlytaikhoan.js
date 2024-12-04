import initTable, {
    fetchJsonData,
    getSelectedData,
    alertSelectRow,
} from "./datatables-simple.js";

let dataTable;

/** 
 * 
 * 
 * 
 * 
 * 
*/
async function reloadDataTable() {
    dataTable.destroy();
    const jsonData = await fetchJsonData("getTaiKhoanNVList");
    dataTable = initTable(jsonData)
}

/** 
 * 
 * 
 * 
 * 
 * 
*/
async function renderUserInfo(data, type) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");

    console.log(type)

    const vaiTroList = await fetchJsonData("getRoleList")
    const vaitro = [...vaiTroList]
    console.log(vaitro)

    popUpBody.innerHTML = `
        ${type !== "detail" ? `` : `
            <div class="form-floating mb-3">
                <input 
                type="number" 
                class="form-control" 
                id="userId" 
                placeholder="" 
                value="${data.id_taikhoan}" 
                readonly
                style="appearance: none; -moz-appearance: textfield; margin: 0;">
                <label for="userId">ID</label> 
            </div>
        `}

        <div class="form-floating mb-3">
            <input type="text"
            class="form-control"
            id="userName"
            placeholder="" 
            value="${(type === "add") ? `` : data.user_name}"
            ${type !== "detail" ? `` : `readonly`}>
            <label for="userName">Username</label>
        </div> 
        
        ${(type === "add" || type === "edit") ? `
            <div class="form-floating mb-3">
                <div class="form-check form-check-inline">
                    <input 
                        class="form-check-input" 
                        type="radio" 
                        value="0" 
                        name="flexRadioDefault" 
                        id="genderFemale">
                    <label class="form-check-label" for="genderFemale">
                        Nữ
                    </label>
                </div>
                <div class="form-check form-check-inline">
                    <input 
                        class="form-check-input" 
                        type="radio" 
                        value="1" 
                        name="flexRadioDefault" 
                        id="genderMale" 
                        checked>
                    <label class="form-check-label" for="genderMale">
                        Nam
                    </label>
                </div>
            </div>
        ` : ``}

        <div class="form-floating mb-3">
            <input type="text" 
            class="form-control" 
            id="userPhone" 
            placeholder="" value="${type === "add" ? `` : data.sodienthoai}" 
            ${(type === "add" || type === "edit") ? `` : `readonly`}>
            <label for="userPhone">Phone Number</label>
        </div>

        <div class="form-floating mb-3">
            <input type="text" 
            class="form-control" 
            id="userEmail" 
            placeholder="" 
            value="${type === "add" ? `` : data.email}"
            ${(type === "add" || type === "edit") ? `` : `readonly`}>
            <label for="userEmail">Email</label>
        </div>

        ${(type === "add") ? `
            <div class="form-floating mb-3">
                <input 
                type="password" 
                class="form-control" 
                id="userPassword" 
                placeholder="">
                <label for="userPassword">Password</label>
            </div>

            <div class="form-floating mb-3">
                <input 
                type="password" 
                class="form-control" 
                id="userConfirmPassword" 
                placeholder="">
                <label for="userConfirmPassword">Confirm Password</label>
            </div>
        ` : ``}
    
        <div class="form-floating mb-3">
            <select 
                class="form-select" 
                id="userRoleSelect"
                ${(type === "add" || type === "edit") ? `` : `disabled`}
                >
                ${(type === "add" || type === "edit")
            ? ``
            : `<option value="${data.vaitro_id}">${data.ten_vaitro}</option>`}
            </select>
            <label for="userRoleSelect">Role</label>
        </div>
        
        
        ${(type === "add") ? `
            <div class="form-floating mb-3">
                <input type="datetime-local" 
                class="form-control" 
                id="userCreatedAt" placeholder="" 
                value="${data.ngaythamgia}" 
                readonly>
                <label for="userCreatedAt">Created Date</label>
            </div>  
            ` : ``}
    `

    const roleSelect = document.getElementById("userRoleSelect");
    roleSelect.innerHTML = vaitro.map(item => `<option value="${item.id_vaitro}">${item.ten_vaitro}</option>`).join("");
}
/** 
 * 
 * 
 * 
 * 
 * 
*/
async function showDetail(data) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    popUpSaveBtn.classList.add("d-none");

    popUpLabel.textContent = `Chi tiết tài khoản`;
    renderUserInfo(data, "detail");
}
/** 
 * 
 * 
 * 
 * 
 * 
*/
function showAdd() {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");

    popUpSaveBtn.classList.remove("d-none");

    popUpLabel.textContent = "Thêm tài khoản";

    renderUserInfo({}, "add")

    popUpSaveBtn.onclick = async () => {
        console.log("Save")
        const username = document.getElementById("userName").value;
        const phone = document.getElementById("userPhone").value;
        const email = document.getElementById("userEmail").value;
        const password = document.getElementById("userPassword").value;
        const confirmPassword = document.getElementById("userConfirmPassword").value;
        const role = document.getElementById("userRoleSelect").value;
        const gender = document.querySelector('input[name="flexRadioDefault"]:checked').value;

        let data = {
            username: username,
            gender: gender,
            phoneNumber: phone,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            roleId: role
        }

        const response = await fetchJsonData("AddTaiKhoan", "POST", data)

        if (!response.success) {
            alert(response.message)
        } else {
            alert(response.message)
        }
        reloadDataTable()
    }
}

/** 
 * 
 * 
 * 
 * 
 * 
*/
async function showEdit(data) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    const popUpCloseBtn = document.getElementById("Footer-Close-PopUp-Button")
    popUpSaveBtn.classList.remove("d-none");

    popUpLabel.textContent = `Chinh sửa tài khoản: ${data.user_name}`;
    renderUserInfo(data, "edit");

    popUpSaveBtn.onclick = async () => {
        console.log("edit")
        const username = document.getElementById("userName").value;
        const sodienthoai = document.getElementById("userPhone").value;
        const email = document.getElementById("userEmail").value;
        const role = document.getElementById("userRoleSelect").value;
        let reqBody = {
            id_taikhoan: data.id_taikhoan,
            username: username,
            phone: sodienthoai,
            email: email,
            roleId: role,
        }

        const response = await fetchJsonData("editTaiKhoan", "POST", reqBody)
        if (!response.success) {
            alert(response.message)
        } else {
            alert(response.message)
        }
        reloadDataTable()
    }
}
/** 
 * 
 * 
 * 
 * 
 * 
*/
function showBan(data) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    const popUpCloseBtn = document.getElementById("Footer-Close-PopUp-Button")
    popUpSaveBtn.classList.remove("d-none");

    popUpSaveBtn.textContent = "YES";
    popUpCloseBtn.textContent = "NO";

    popUpLabel.textContent = `Ban tài khoản`;
    popUpBody.textContent = `Bạn có muốn ${(data.trangthai === "1" ? "ban" : "unban")} tài khoản ${data.user_name}?`;

    popUpSaveBtn.onclick = async () => {
        console.log("ban")
        let reqBody = {
            id_taikhoan: data.id_taikhoan,
            trangthai: data.trangthai === "1" ? "0" : "1"
        }
        
        const response = await fetchJsonData("banTaiKhoan", "POST", reqBody)
    }
}

/** 
 * 
 * 
 * 
 * 
 * 
*/
window.addEventListener("DOMContentLoaded", async () => {
    console.log("hi")

    const jsonData = await fetchJsonData("getTaiKhoanNVList")
    dataTable = initTable(jsonData);

    // xoa remove button
    const removeBtn = document.getElementById("btn-popup-remove");
    removeBtn.remove()

    const popupBtnGroup = document.getElementById("popup-button-group");
    popupBtnGroup.innerHTML += `<button class="btn btn-danger w-auto" id="btn-popup-ban" data-bs-toggle="modal" data-bs-target="#popupContent">Ban/Unban</button>`

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
        showDetail(selectedData);
    });
    // them tai khoan
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
        showBan(selectedData);
    });
})