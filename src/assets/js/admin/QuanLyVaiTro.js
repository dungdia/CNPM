import initTable, {
    fetchJsonData,
    getSelectedData,
    alertSelectRow,
} from "./datatables-simple.js";

let dataTable;
let item = {};

async function renderRoleInfo(data, type) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    popUpBody.innerHTML = `
        <div class="form-floating mb-3">
            <input 
            type="text" 
            class="form-control" 
            id="roleName" 
            value="${(type === "add") ? `` : data.ten_vaitro}"
            placeholder="">
            <label for="roleName">Tên vai trò</label>
        </div>
    `
}

function showAdd() {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpCloseBtn = document.getElementById("Footer-Close-PopUp-Button")
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");

    popUpSaveBtn.classList.remove("d-none");

    popUpLabel.textContent = "Thêm vai trò";

    renderRoleInfo({}, "add")

    popUpSaveBtn.onclick = async () => {
        console.log("Save")

        const roleName = document.getElementById("roleName")
        const projection = {
            ten_vaitro: roleName.value,
            type: "insert"
        }
        console.log(JSON.stringify(projection, null, 2));
        const res = await fetchJsonData("VaiTro", "POST", projection)
        if (!res.success) {
            return alert(res.message)
        }
        alert(res.message)
    }
}

function showEdit(data) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    const popUpCloseBtn = document.getElementById("Footer-Close-PopUp-Button")
    popUpSaveBtn.classList.remove("d-none");

    popUpLabel.textContent = `Chinh sửa vai trò: ${data.ten_vaitro}`;
    renderRoleInfo(data, "edit");

    popUpSaveBtn.onclick = async () => {
        console.log("edit")
        const roleName = document.getElementById("roleName")
        const projection = {
            id_vaitro: data.id_vaitro,
            ten_vaitro: roleName.value,
            type: "update"
        }
        console.log(JSON.stringify(projection, null, 2));
        // const res = await fetchJsonData("VaiTro", "POST", projection)
        // if (!res.success) {
        //     return alert(res.message)
        // }
        // alert(res.message)
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    const jsonData = await fetchJsonData("getAllRole")
    dataTable = initTable(jsonData);

    // xoa remove button
    const removeBtn = document.getElementById("btn-popup-remove");
    removeBtn.remove()

    // const popupBtnGroup = document.getElementById("popup-button-group");
    // popupBtnGroup.innerHTML += `<button class="btn btn-danger w-auto" id="btn-popup-ban" data-bs-toggle="modal" data-bs-target="#popupContent">Ban/Unban</button>`

    const btnPopUp = document.getElementById("btn-popup-detail");
    const banBtn = document.getElementById("btn-popup-ban")
    const editBtn = document.getElementById("btn-popup-update");
    editBtn.remove()
    const addbtn = document.getElementById("btn-popup-add");
    addbtn.remove()

    btnPopUp.addEventListener("click", () => {
        const selectRow = document.querySelector(".selectedRow");
        if (!selectRow) {
            alertSelectRow();
            return;
        }
        const rowIdx = selectRow.getAttribute("data-index");
        const selectedData = getSelectedData(dataTable, rowIdx);
        showDetail(selectedData);
    })

    // // // them tai khoan
    // addbtn.addEventListener("click", () => {
    //     const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    //     popUpSaveBtn.onclick = {};

    //     showAdd();
    // })

    // editBtn.addEventListener("click", () => {
    //     const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    //     popUpSaveBtn.onclick = {};
    //     const selectRow = document.querySelector(".selectedRow");
    //     if (!selectRow) {
    //         alertSelectRow();
    //         return;
    //     }
    //     const rowIdx = selectRow.getAttribute("data-index");
    //     const selectedData = getSelectedData(dataTable, rowIdx);

    //     showEdit(selectedData)
    // })

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