import initTable, {
    fetchJsonData,
    getSelectedData,
    alertSelectRow,
} from "./datatables-simple.js";

let dataTable;
let item = {};

async function reloadDataTable() {
    dataTable.destroy();
    const jsonData = await fetchJsonData("getAllKhachHang");
    dataTable = initTable(jsonData)
}

async function renderClientInfo(data, type) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    if (data) {
        [item] = await fetchJsonData("getOneKhachHang", "GET", { id_khachhang: data.id_khachhang });
    }
    console.log(item)
    popUpBody.innerHTML = `
        ${type !== "detail" ? `` : `
            <div class="form-floating mb-3">
                <input 
                type="number" 
                class="form-control" 
                id="userId" 
                placeholder="" 
                value="${item.id_taikhoan}" 
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
            value="${(type === "add") ? `` : item.user_name}"
            ${type !== "detail" ? `` : `readonly`}>
            <label for="userName">Username</label>
        </div> 

        <div class="form-floating mb-3">
            <input type="text" 
            class="form-control" 
            id="userFullName" 
            placeholder="" 
            value="${type === "add" ? `` : item.ho_ten}"
            ${(type === "add" || type === "edit") ? `` : `readonly`}>
            <label for="userFullName">Họ tên</label>
        </div>

        ${(type === "edit") ? `
            <div class="form-floating mb-3">
                <input type="text"
                class="form-control"
                id="userGender"
                placeholder="" 
                value="${(type === "add") ? `` : item.user_name}"
                ${type !== "detail" ? `` : `readonly`}>
                <label for="userGender">Giới tính</label>
            </div> 
        ` : `
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
        `}

        <div class="form-floating mb-3">
            <input type="text" 
            class="form-control" 
            id="userPhone" 
            placeholder="" value="${type === "add" ? `` : item.sodienthoai}" 
            ${(type === "add" || type === "edit") ? `` : `readonly`}>
            <label for="userPhone">Phone Number</label>
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

        ${(type === "detail") ? `
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
    // const roleSelect = document.getElementById("userRoleSelect");
    // roleSelect.innerHTML = vaitro.map(item => `<option value="${item.id_vaitro}">${item.ten_vaitro}</option>`).join("");
    // if (type === "edit") {
    //     roleSelect.value = item.vaitro_id;
    // }
}

async function showDetail(data) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    popUpSaveBtn.classList.add("d-none");

    popUpLabel.textContent = `Chi tiết tài khoản`;
    renderClientInfo(data, "detail");
}

function showAdd() {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpCloseBtn = document.getElementById("Footer-Close-PopUp-Button")
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");

    popUpSaveBtn.classList.remove("d-none");

    popUpLabel.textContent = "Thêm tài khoản nhân viên";

    renderUserInfo({}, "add")

    popUpSaveBtn.onclick = async () => {
        console.log("Save")
        const username = document.getElementById("userName");
        const userFullName = document.getElementById("userFullName");
        const gender = document.querySelector('input[name="flexRadioDefault"]:checked')
        const phone = document.getElementById("userPhone")
        const email = document.getElementById("userEmail")
        const password = document.getElementById("userPassword")
        const confirmPassword = document.getElementById("userConfirmPassword")
        const role = document.getElementById("userRoleSelect")
        const projection = {
            username: username.value,
            fullName: userFullName.value,
            gender: gender.value,
            phoneNumber: phone.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
            roleId: role.value,
            query: "insert"
        }

        const res = await fetchJsonData("TaiKhoanNV", "POST", projection)
        if (!res.success) {
            alert(res.message)
        } else {
            alert(res.message)
            window.location.reload()
            reloadDataTable()
        }
    }
}

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
        const projection = {
            id_khachhang: data.id_khachhang,
            id_taikhoan: data.id_taikhoan,
            trangthai: data.trangthai === "1" ? "0" : "1",
            query: "delete"
        }
        console.log(JSON.stringify(projection, null, 2))

        const res = await fetchJsonData("TaiKhoanKH", "POST", projection)
        if (!res.success) {
            alert(res.message)
        } else {
            alert(res.message)
            window.location.reload();
            reloadDataTable()
        }
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    const jsonData = await fetchJsonData("getAllKhachHang")
    dataTable = initTable(jsonData);

    // xoa remove button
    const editBtn = document.getElementById("btn-popup-update");
    const addbtn = document.getElementById("btn-popup-add");
    const removeBtn = document.getElementById("btn-popup-remove");
    removeBtn.remove()
    editBtn.remove()
    addbtn.remove()

    const popupBtnGroup = document.getElementById("popup-button-group");
    popupBtnGroup.innerHTML += `<button class="btn btn-danger w-auto" id="btn-popup-ban" data-bs-toggle="modal" data-bs-target="#popupContent">Ban/Unban</button>`

    const banBtn = document.getElementById("btn-popup-ban")
    const btnPopUp = document.getElementById("btn-popup-detail");
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