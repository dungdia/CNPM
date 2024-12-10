import initTable, {
  fetchJsonData,
  getSelectedData,
  alertSelectRow,
  postImageData,
} from "./datatables-simple.js";

let dataTable;
let receiptDetail = [];

async function renderReceiptDetail(data, type) {
  const popUpLabel = document.getElementById("popup-label");
  const popUpBody = document.getElementById("Popup-Body");
  const footer_modal = document.querySelector(".modal-footer");

  footer_modal.innerHTML = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
    id="Footer-Close-PopUp-Button">Close</button>
    <button type="button" class="btn btn-danger" id="Footer-Cancel-PopUp-Button">Cancel</button>
    <button type="button" class="btn btn-primary" id="Footer-Save-PopUp-Button">Save changes</button>
    `;
  const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
  const popUpCancelBtn = document.getElementById("Footer-Cancel-PopUp-Button");

  popUpLabel.textContent = "Chi tiết phiếu nhập";

  const sanpham = await fetchJsonData(`getAllSanPham`);

  let chiTietSanPham = await (data
    ? fetchJsonData(`getAllChiTietSP`, "GET", { id_sanpham: data.id_sanpham })
    : []);

  let choosedPhienBanSanPham;
  let choosedSanPham;

  if (data) {
    [choosedSanPham] = sanpham.filter(
      (item) => item.id_sanpham == data.id_sanpham
    );
    const [phienban] = chiTietSanPham.filter(
      (item) => item.id_phienban == data.id_phienban
    );
    choosedPhienBanSanPham = phienban;
  }

  popUpBody.innerHTML = `
    <div class="btn-group w-100 my-2">
    <button class="btn btn-primary w-auto" id="btn-choose-product"
    >Chọn sản phẩm</button>
    </div>
    <div class="form-floating mb-3">
    <input 
    type="text" 
    class="form-control" 
    id="productName" 
    placeholder="" 
    value="${type === "add" ? `` : data.ten_sanpham}" 
    readonly
    style="appearance: none; -moz-appearance: textfield; margin: 0;">
    <label for="productName">Sản phẩm</label> 
    </div>
    <div id="sanpham"></div>

    <div class="btn-group w-100 my-2">
    <button class="btn btn-primary w-auto" id="btn-choose-product-detail"
    >Chọn Phiên Bản Sản Phẩm</button>
    </div>
    <div class="form-floating mb-3">
    <input 
    type="text" 
    class="form-control" 
    id="productDetail" 
    placeholder="" 
    value="${
      type === "add"
        ? ``
        : `${data.ten_sanpham} ${data.ram} GB ${data.dung_luong} GB`
    }" 
    readonly
    style="appearance: none; -moz-appearance: textfield; margin: 0;">
    <label for="productName">Phiên bản sản phẩm</label> 
    </div>
    <div id="phienbansanpham"></div>

    <div class="form-floating mb-3">
    <input 
    type="number" 
    class="form-control" 
    id="productAmount" 
    placeholder="" 
    value="${type === "add" ? `0` : data.so_luong}" 
    style="appearance: none; -moz-appearance: textfield; margin: 0;">
    <label for="productSZ">Số lượng</label> 
    </div>

    <div class="form-floating mb-3">
    <input 
    type="number" 
    class="form-control" 
    id="productPrice" 
    placeholder="" 
    value="${type === "add" ? `0` : data.gia}" 
    style="appearance: none; -moz-appearance: textfield; margin: 0;">
    <label for="productSZ">Giá một món</label> 
    </div>
    `;

  let productTable = initTable(sanpham, "sanpham");
  let productDetailTable = initTable(chiTietSanPham, "phienbansanpham");

  async function reloadDetailTable(id_sanpham) {
    productDetailTable.destroy();
    const jsonData = await fetchJsonData(`getAllChiTietSP`, "GET", {
      id_sanpham: id_sanpham,
    });
    productDetailTable = initTable(jsonData, "phienbansanpham");
  }

  const chooseProduct = document.getElementById("btn-choose-product");
  const productName = document.getElementById("productName");
  const productDetail = document.getElementById("productDetail");
  const productAmount = document.getElementById("productAmount");
  const productPrice = document.getElementById("productPrice");
  const chooseProductDetail = document.getElementById(
    "btn-choose-product-detail"
  );

  chooseProduct.onclick = async () => {
    const selectRow = document.querySelector("#sanpham .selectedRow");
    if (!selectRow) {
      alert("Chưa chọn dòng nào trong bảng");
      return;
    }
    const rowIdx = selectRow.getAttribute("data-index");
    const selectedData = getSelectedData(productTable, rowIdx);
    choosedSanPham = selectedData;
    productName.value = selectedData.ten_sanpham;
    choosedPhienBanSanPham = null;
    reloadDetailTable(selectedData.id_sanpham);
  };

  chooseProductDetail.onclick = () => {
    const selectRow = document.querySelector("#phienbansanpham .selectedRow");
    if (!selectRow) {
      alert("Chưa chọn dòng nào trong bảng");
      return;
    }
    const rowIdx = selectRow.getAttribute("data-index");
    const selectedData = getSelectedData(productDetailTable, rowIdx);
    choosedPhienBanSanPham = selectedData;
    productDetail.value = `${selectedData.ten_sanpham} ${selectedData.ram} GB ${selectedData.dung_luong} GB`;
  };

  popUpCancelBtn.onclick = () => {
    renderReceiptInfo(null, "add");
  };

  popUpSaveBtn.onclick = () => {
    if (!choosedSanPham || !choosedPhienBanSanPham) {
      alert("Phải ít nhất chọn một phiên bản để thêm vào");
      return;
    }

    if (productAmount.value <= 0) {
      alert("Số lượng phải lớn hơn 0");
      return;
    }
    if (productPrice.value <= 0) {
      alert("Giá phải lớn hơn 0");
      return;
    }
    const VND = new Intl.NumberFormat("Vi-VN", {
      style: "currency",
      currency: "VND",
    });

    const newSanPham = {
      id_sanpham: choosedSanPham.id_sanpham,
      id_phienban: choosedPhienBanSanPham.id_phienban,
      ten_sanpham: choosedSanPham.ten_sanpham,
      ram: choosedPhienBanSanPham.ram,
      dung_luong: choosedPhienBanSanPham.dung_luong,
      so_luong: Number.parseInt(productAmount.value),
      gia: productPrice.value,
    };
    switch (type) {
      case "add":
        const currentsanpham = receiptDetail.filter(
          (item) => item.id_phienban === newSanPham.id_phienban
        );
        if (currentsanpham.length > 0) {
          for (const item of receiptDetail) {
            if (item.id_phienban === newSanPham.id_phienban)
              item.so_luong += Number.parseInt(productAmount.value);
          }
        }

        if (currentsanpham.length <= 0) receiptDetail.push(newSanPham);
        break;
      case "edit":
        receiptDetail = receiptDetail.map((item) => {
          if (item.id_phienban == data.id_phienban) {
            return newSanPham;
          }
          return item;
        });

      default:
        break;
    }

    renderReceiptInfo(null, "add");
  };
}

async function renderReceiptInfo(data, type) {
  const popUpLabel = document.getElementById("popup-label");
  const popUpBody = document.getElementById("Popup-Body");

  const footer_modal = document.querySelector(".modal-footer");

  footer_modal.innerHTML = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
    id="Footer-Close-PopUp-Button">Close</button>
    <button type="button" class="btn btn-primary ${
      type == "detail" ? "d-none" : ""
    }" id="Footer-Save-PopUp-Button">Save changes</button>
    `;

  if (type == "add") {
    popUpLabel.textContent = "Thêm phiếu nhập";
  }

  const nhacungcap = await fetchJsonData(`getAllNhaCungCap`);
  if (data) {
    receiptDetail = await fetchJsonData(`getAllReceiptDetail`, "GET", {
      id_phieunhap: data.id_phieunhap,
    });
  }

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
                value="${data.id_phieunhap}" 
                readonly
                style="appearance: none; -moz-appearance: textfield; margin: 0;">
                <label for="productId">ID</label> 
            </div>     
        `
            : ` 
        `
        }
        ${
          type !== "add"
            ? `
        <div class="form-floating mb-3">
        <input 
        type="text" 
        class="form-control" 
        id="productName" 
        placeholder="" 
        value="${type === "add" ? `` : data.ngaynhap}" 
        ${type !== "detail" || type !== "edit" ? `` : `readonly`}
        style="appearance: none; -moz-appearance: textfield; margin: 0;">
        <label for="productName">Ngày Nhập</label> 
    </div>
        `
            : ""
        }


        ${
          type !== "add"
            ? `
        <div class="form-floating mb-3">
        <input 
        type="text" 
        class="form-control" 
        id="productName" 
        placeholder="" 
        value="${data.nhanviennhap}" 
        readonly
        style="appearance: none; -moz-appearance: textfield; margin: 0;">
        <label for="productName">Nhân viên nhập</label> 
    </div>`
            : ``
        }
        <div class="form-floating mb-3">
            <select 
                class="form-select" 
                id="providerSelect"
                ${type === "add" || type === "edit" ? `` : `disabled`}
                >
                ${nhacungcap
                  .map(
                    (item) =>
                      `<option ${
                        type !== "add"
                          ? item.ten_nhacungcap === data.ten_nhacungcap
                            ? "selected"
                            : ""
                          : ""
                      } value="${item.id_nhacungcap}">${
                        item.ten_nhacungcap
                      }</option>`
                  )
                  .join("")}
            </select>
            <label for="providerSelect">Nhà Cung Cấp</label>
        </div>
        <label for="chitietphieunhap">Sản phẩm thuộc phiếu nhập: </label>
        ${
          type === "add"
            ? `
        <div class="btn-group w-100 my-2">
        <button class="btn btn-primary w-auto" id="btn-receiptDetail-add"
        >Thêm</button>
        <button class="btn btn-warning w-auto" id="btn-receiptDetail-update"
        >Sửa</button>
        <button class="btn btn-danger w-auto" id="btn-receiptDetail-remove"
        >Xóa</button>
        </div>
        `
            : ""
        }
        <div id="chitietphieunhap"></div>
    `;

  let receiptDetailTable = initTable(receiptDetail, "chitietphieunhap");

  if (type !== "add") {
    popUpSaveBtn.onclick = () => {};
    return;
  }

  const removeBtn = document.getElementById("btn-receiptDetail-remove");
  const editBtn = document.getElementById("btn-receiptDetail-update");
  const addbtn = document.getElementById("btn-receiptDetail-add");
  const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");
  const providerSelect = document.getElementById("providerSelect");

  addbtn.onclick = () => {
    renderReceiptDetail(null, "add");
  };

  editBtn.onclick = () => {
    const selectRow = document.querySelector("#chitietphieunhap .selectedRow");
    if (!selectRow) {
      alert("Chưa chọn dòng nào trong bảng");
      return;
    }
    const rowIdx = selectRow.getAttribute("data-index");
    const selectedData = getSelectedData(receiptDetailTable, rowIdx);
    // console.log(selectedData)
    renderReceiptDetail(selectedData, "edit");
  };

  removeBtn.onclick = () => {
    const selectRow = document.querySelector("#chitietphieunhap .selectedRow");
    if (!selectRow) {
      alert("Chưa chọn dòng nào trong bảng");
      return;
    }
    const rowIdx = selectRow.getAttribute("data-index");
    const selectedData = getSelectedData(receiptDetailTable, rowIdx);
    receiptDetail = receiptDetail.filter(
      (item) => item.id_phienban != selectedData.id_phienban
    );
    receiptDetailTable.destroy();
    receiptDetailTable = initTable(receiptDetail, "chitietphieunhap");
  };

  popUpSaveBtn.onclick = async () => {
    if (receiptDetail.length <= 0) {
      alert("Phải ít nhất có một sản phẩm trong phiếu nhập");
      return;
    }

    const body = {
      id_nhacungcap: providerSelect.value,
      ctPhieuNhap: receiptDetail,
    };
    try {
      const res = await fetch(`/api/data/addNewReceipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      console.log(result);
      if (!result.success) {
        alert(result.message);
        return;
      }
      popUpBody.innerHTML = "Thêm phiếu nhập thành công";
      popUpSaveBtn.classList.add("d-none");
      reloadDataTable();
    } catch (error) {
      console.log(error);
    }
  };
}

async function showDetail(data) {
  const popUpLabel = document.getElementById("popup-label");
  popUpLabel.textContent = `Xem Phiếu Nhập`;
  renderReceiptInfo(data, "detail");
}

async function reloadDataTable() {
  dataTable.destroy();
  const jsonData = await fetchJsonData("getAllReceipt");
  dataTable = initTable(jsonData);
}

document.addEventListener("DOMContentLoaded", async () => {
  const jsonData = await fetchJsonData("getAllReceipt");
  dataTable = initTable(jsonData);

  const removeBtn = document.getElementById("btn-popup-remove");
  const editBtn = document.getElementById("btn-popup-update");
  removeBtn.remove();
  editBtn.remove();

  const btnPopUp = document.getElementById("btn-popup-detail");
  const addbtn = document.getElementById("btn-popup-add");

  const modal = document.getElementById("popupContent");
  modal.addEventListener("hide.bs.modal", () => {
    receiptDetail = [];
  });

  btnPopUp.addEventListener("click", () => {
    console.log("Xem chi tiet pn");
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

  addbtn.addEventListener("click", () => {
    const popUpLabel = document.getElementById("popup-label");
    const popUpSaveBtn = document.getElementById("Footer-Save-PopUp-Button");

    popUpSaveBtn.classList.remove("d-none");

    popUpLabel.textContent = "Thêm phiếu nhập";

    renderReceiptInfo(null, "add");
  });
});
