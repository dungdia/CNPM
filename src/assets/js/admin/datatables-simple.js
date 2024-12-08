/**
 * Khởi tạo init table
 * @param {Object[]} jsonData dữ liệu từ api
 * @param {string} [tableId="datatablesSimple"] id của bảng
 * @returns {simpleDatatables.DataTable} 
 */
export default function initTable(jsonData, tableId = "datatablesSimple") {
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
/**
 * Fetch data from server given key
 * @param {string} key API endpoint (without '../api/data/')
 * @returns {Promise<object>} JSON data
 */
let url = ""
export let fetchJsonData = async (key, meth, projection) => {
    if (meth === "POST" || meth === "PUT") {
        try {
            const res = await fetch(`../api/data/${key}`, {
                method: meth,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(projection)
            });

            return res.json();
        } catch (error) {
            return error
        }
    } else {
        url = ""
        for (const key in projection) {
            url += `${key}=${projection[key]}&`
        }
        try {
            console.log(url)
            const res = await fetch(`../api/data/${key}?${url}`, {
                method: meth,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return res.json();
        } catch (error) {
            return error
        }
    }
}

export let postImageData = async (key, projection) => {
    try {
        const res = await fetch(`/api/data/${key}`, {
            method: "POST",
            body: projection
        });

        return res.json();
    } catch (error) {
        return error
    }
}

/**
 * Alert if no row is selected in the table
 * @function alertSelectRow
 * @description Hide the save button, set the popup label and body to a suitable message
 */
export function alertSelectRow() {
    const popUpLabel = document.getElementById("popup-label");
    const popUpBody = document.getElementById("Popup-Body");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
    popUpSaveBtn.classList.add("d-none");
    popUpLabel.textContent = "No Row Selected";
    popUpBody.textContent = "Bạn chưa chọn dòng nào trong bảng";
}

export function mergeArrayToJson(heading, data) {
    let obj = {};
    for (let i = 0; i < data.cells.length; i++) {
        obj[heading[i].data] = data.cells[i].text;
    }
    return obj;
}

export function getSelectedData(dataTable, rowIdx) {
    const heading = dataTable.data.headings;
    const rowData = dataTable.data.data[rowIdx];
    const selectedData = mergeArrayToJson(heading, rowData);
    return selectedData;
}
