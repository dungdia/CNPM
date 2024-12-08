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
    const jsonData = await fetchJsonData("getAllTaiKhoan");
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

    const roleList = await fetchJsonData("getAllRole");
    console.log(roleList);

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
    const roleSelect = document.getElementById("userRoleSelect");
    roleSelect.innerHTML = roleList.map(item => `<option value="${item.id_vaitro}">${item.ten_vaitro}</option>`).join("");
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
        const username = document.getElementById("userName").value
        const password = document.getElementById("userPassword").value;
        const confirmPassword = document.getElementById("userConfirmPassword").value;
        const role = document.getElementById("userRoleSelect").value;

        let data = {
            username: username,
            password: password,
            confirmPassword: confirmPassword,
            roleId: role
        }

        const res = await fetchJsonData("TaiKhoan", "POST", data)
        if (!res.success) {
            console.log(res)
            return alert(res.message)
        }

        alert(res.message)
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
        const username = document.getElementById("userName")
        let projection = {
            id_taikhoan: data.id_taikhoan,
            username: username.value,
            type: "edit"
        }
        console.log(projection)
        const response = await fetchJsonData("TaiKhoan", "POST", projection)
        if (!response.success) {
            return alert(response.message)
        }

        alert(response.message)
        window.location.reload()
        reloadDataTable()
    }
}
/** 
 * 
 * 
 * 
 * 
 * 
// */
// function showBan(data) {
//     const popUpLabel = document.getElementById("popup-label");
//     const popUpBody = document.getElementById("Popup-Body");
//     const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
//     const popUpCloseBtn = document.getElementById("Footer-Close-PopUp-Button")
//     popUpSaveBtn.classList.remove("d-none");

//     popUpSaveBtn.textContent = "YES";
//     popUpCloseBtn.textContent = "NO";

//     popUpLabel.textContent = `Ban tài khoản`;
//     popUpBody.textContent = `Bạn có muốn ${(data.trangthai === "1" ? "ban" : "unban")} tài khoản ${data.user_name}?`;

//     popUpSaveBtn.onclick = async () => {
//         let req = {
//             id_taikhoan: data.id_taikhoan,
//             trangthai: data.trangthai === "1" ? "0" : "1"
//         }
//         console.log(req)
//         const response = await fetchJsonData("banTaiKhoan", "POST", req)
//         if (!response.success) {
//             alert(response.message)
//         } else {
//             alert(response.message)
//         }
//     }
// }

/** 
 * 
 * 
 * 
 * 
 * 
*/
window.addEventListener("DOMContentLoaded", async () => {
    console.log("hi")

    const jsonData = await fetchJsonData("getAllTaiKhoan")
    dataTable = initTable(jsonData);

    // xoa remove button
    const removeBtn = document.getElementById("btn-popup-remove");
    removeBtn.remove()

    // const popupBtnGroup = document.getElementById("popup-button-group");
    // popupBtnGroup.innerHTML += `<button class="btn btn-danger w-auto" id="btn-popup-ban" data-bs-toggle="modal" data-bs-target="#popupContent">Ban/Unban</button>`

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
        console.log("add")
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