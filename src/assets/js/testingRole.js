// import CookieManager from 'https://cdn.jsdelivr.net/npm/js-cookie-manager@1.0.2/index.min.js';



// async function getPermissionByUserId() {
//     const cookieManager = new CookieManager();
//     const access_token = cookieManager.get("access_token");
//     try {
//         const res = await fetch(`/api/data/getRoleByUser?access_token=${access_token}`, {
//             method: "GET",
//         });

//         const resData = await res.json();
//         if (!resData.success) {
//             alert(resData.message)
//             return
//         }

//         return resData;
//     } catch (error) {
//         console.log(error);
//     }
// }

// SIMPLE DATATABLES

function initTable(jsonData, tableId = "datatablesSimple") {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki
    const data = [];

    for (const item of jsonData) {
        data.push(item);
    }

    const dataJson = JSON.stringify(data);

    const datatablesSimple = document.getElementById(tableId);
    if (datatablesSimple) {
        const convertData = new simpleDatatables.convertJSON({
            data: dataJson,
        });
        const option = {
            classes: {
                sorter: "datatable-sorter btn btn-secondary btn-sm",
                pagination: "datatable-pagination",
                paginationList: "datatable-pagination-list pagination",
            },
        };
        const dataTable = new simpleDatatables.DataTable(datatablesSimple, option);
        dataTable.insert(convertData);

        dataTable.on("datatable.selectrow", (rowIndex, event) => {
            event.preventDefault();

            const tableRowList = document.querySelectorAll(`#${tableId} tr`);
            let selectedRow;
            for (const item of tableRowList) {
                if (item.getAttribute("data-index") == rowIndex) selectedRow = item;
                else item.classList.remove("selectedRow");
            }
            selectedRow.classList.toggle("selectedRow");
        });

        return dataTable;
    }
}

async function fetchJsonData(key) {
    const res = await fetch(`../api/data/${key}`);
    const json = await res.json();
    return json;
}

function alertSelectRow() {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    popUpSaveBtn.classList.add("d-none");
    popUpLabel.textContent = "No Row Selected";
    popUpBody.textContent = "Bạn chưa chọn dòng nào trong bảng";
}

function mergeArrayToJson(heading, data) {
    let obj = {};
    for (let i = 0; i < data.cells.length; i++) {
        obj[heading[i].data] = data.cells[i].text;
    }
    return obj;
}

function getSelectedData(dataTable, rowIdx) {
    const heading = dataTable.data.headings;
    const rowData = dataTable.data.data[rowIdx];
    const selectedData = mergeArrayToJson(heading, rowData);
    return selectedData;
}

// ROLE

let accountPermission;
let dataTable;

async function getPermission(id) {
    const res = await fetch(`/api/data/getPermissionList?taikhoan_id=0&vaitro_id=${id}`);
    const data = await res.json();
    return data;
}

async function renderPermissionList(data, type) {
    console.log(data)
    const permssionTypeList = await fetchJsonData("getPermission")
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");

    const permssionName = [];

    const [, ...keyList] = Object.keys(accountPermission);
    const [, ...valueList] = Object.values(accountPermission);

    const permssionKeyList = [];

    for (let i = 0; i < keyList.length; i++) {
        if (typeof valueList[i] == "boolean") permssionKeyList.push(keyList[i]);
        if (typeof valueList[i] == "object") {
            const valueKeyList = Object.keys(valueList[i]);
            for (const key of valueKeyList) {
                permssionKeyList.push(`${keyList[i]}.${key}`);
            }
        }
    }

    let count = 0;

    for (const item of permssionTypeList) {
        item.headerName = permssionKeyList[count];
        permssionName.push(item);
        count++;
    }

    popUpLabel.textContent = `${type != "add" ? "Role" : ""} ${data.ten_quyen ? data.ten_quyen : data.ten_vaitro}`;
    popUpBody.innerHTML = `${type == "add"
        ?
        `<div class="form-floating mb-3">
            <input type="text" class="form-control" id="roleNameInput" placeholder="">
            <label for="roleNameInput">Tên vai trò: </label>`
        : ""
        }${permssionName.map((item) =>
            `<div class="form-check form-switch form-check-reverse text-start fs-6" id="${item.id}">
                    <input class="form-check-input me-1" type="checkbox" role="switch" id="switch${item.id}" ${type == "view" ? "disabled" : ""}>
                    <label class="form-check-label" for="switch${item.id}">${item.ten_quen}</label>
                </div>`
        ).join("")}`;

    const formCheckList = document.getElementsByClassName("form-check");
    count = 0;
    for (const item of formCheckList) {
        const headerName = permssionName[count].headerName.split(".");
        const isChecked =
            headerName.length == 2
                ? accountPermission[headerName[0]][headerName[1]]
                : accountPermission[headerName[0]];
        if (isChecked) {
            const checkBtn = document.querySelector(`#switch${item.id}`);
            checkBtn.checked = true;
        }
        count++;
    }
}

async function showDetail(data) {
    const permssionTypeList = await fetchJsonData("getPermissionList");
    console.log("showDetail", permssionTypeList)
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    popUpSaveBtn.classList.add("d-none");

    console.log("showDetail", data)
    await renderPermissionList(data, "view");
}

async function showAdd(data) {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");

    popUpLabel.textContext = `Role`;
    console.log(popUpLabel)

    await renderPermissionList(data, "add");
    popUpSaveBtn.classList.remove("d-none");

    popUpSaveBtn.onclick = async () => {
        const formCheckList = document.getElementsByClassName("form-check");
        const newPermissionList = [];
        for (const item of formCheckList) {
            console.log(item)
            const element = {};
            element.id_quyen = item.id;
            const checkBtn = document.querySelector(`#switch${item.id}`);
            element.isChecked = checkBtn.checked;
            newPermissionList.push(element);
        }

        console.log("showAdd", newPermissionList)

        const inputName = document.getElementById("roleNameInput");
        if (inputName.value == "") {
            popUpBody.textContent = "Tên vai trò không được để trống";
            return;
        }

        const roleName = inputName.value;

        // try {
        //     const addRole = await fetch(`/api/data/addRole`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({ "ten_vaitro": `${roleName}` }),
        //     })

        //     const resAddRole = await addRole.json();

        //     if (!resAddRole.success) {
        //         alert(resAddRole.message)
        //         return;
        //     }
        //     alert("Test ok")
        // } catch (error) {
        //     console.log("Error: ", error);
        // }

        for (const permission of newPermissionList) {
            try {
                const addRoleDetail = await fetch(`/api/data/insertRoleDetail`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "id_vaitro": resAddRole.message,
                        "id_quyen": permission.id_quyen,
                        "havePermission": permission.isChecked ? 1 : 0,
                    }),
                })

                const restAddRoleDetail = await addRoleDetail.json();
                console.log(restAddRoleDetail)
            } catch (error) {
                console.log("Error: ", error);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const jsonData = await fetchJsonData("getRoleList");
    dataTable = initTable(jsonData);

    const btnPopUp = document.getElementById("btn-popup-detail");
    const addbtn = document.getElementById("btn-popup-add");
    // const editBtn = document.getElementById("btn-popup-update");
    // const removeBtn = document.getElementById("btn-popup-remove");

    btnPopUp.addEventListener("click", async (e) => {
        const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
        popUpSaveBtn.onclick = {};
        const selectRow = document.querySelector(".selectedRow");
        console.log(selectRow)
        if (!selectRow) {
            alertSelectRow();
            return;
        }

        const rowIdx = selectRow.getAttribute("data-index");
        const selectedData = getSelectedData(dataTable, rowIdx);

        accountPermission = await getPermission(selectedData.id_vaitro)
        showDetail(selectedData);
    });

    addbtn.addEventListener("click", async (e) => {
        const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
        popUpSaveBtn.onclick = {}
        const selectData = { id_vaitro: 1, ten_quyen: "Thêm vai trò" }
        accountPermission = await getPermission(selectData.id_vaitro)
        console.log(accountPermission)
        showAdd(selectData);

        // const formCheckList = document.getElementsByClassName("form-check");
        // const newPermissionList = [];
        // for (const item of formCheckList) {
        //     const element = {};
        //     element.permissionId = item.id;
        //     const checkBtn = document.querySelector(`#switch${item.id}`);
        //     element.isChecked = checkBtn.checked;
        //     newPermissionList.push(element);
        // }
    })
})

