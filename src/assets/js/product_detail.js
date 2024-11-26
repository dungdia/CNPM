const routeProductDetail = new URL(document.location.href)
const fullRoute = (document.location.href).split('/').pop().split('?')
const route = (fullRoute.length > 1 ? fullRoute[0] : fullRoute.pop())
const productId = parseInt(routeProductDetail.searchParams.get('id'))

const urls = ['getSpById']
const fetchProductData = urls.map(async (url) => {
    if (route != "productDetail")
        return
    const res = await fetch(`./api/data/${url}?id=${productId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
    const json = await res.json()
    return json
})

function formatVND(amount) {
    return amount.toLocaleString('vi-VN')
}

console.log(await Promise.all(fetchProductData))

async function renderProductDetail() {
    const [productDetailData] = await Promise.all(fetchProductData)
    const productDetailMainImage = document.querySelector(`.product-detail-main-image`)
    const productDetail = document.querySelector('.product-detail')
    const productDetailMoreDetail = document.querySelector('.product-detail-more-detail')
    productDetail.innerHTML = `
        <div class="product-name">${productDetailData[0].ten_sanpham}</div>
        <div class="product-quantity">Số lượng tồn kho: 34</div>
        <div class="product-price">${formatVND(productDetailData[0].gia)}đ</div>
        <div class="product-version-container">
            <p class="product-version-label" style="font-size:1.2rem">Chọn phiên bản RAM và Dung lượng lưu trữ: </p>
            <div class="product-version-list">
                ${productDetailData.map((element, index) =>
                    `<div class="product-version ${index === 0 ? 'on-active' : ''}">${element.ram} GB - ${element.dung_luong} GB</div>`
                ).join('')}
            </div>
        </div>
        <div class="product-add-to-cart-button-container">
            <button class="add-to-cart-btn btn btn-primary" id="add-to-cart-btn">Add to cart</button>
        </div>
    `
    productDetailMoreDetail.innerHTML = `
        <pre style="font-size: 20px">
            Màn hình: ${productDetailData[0].kichThuocMan} inch

            Hệ điều hành: ${productDetailData[0].heDieuHanh}
            
            Camera sau: ${productDetailData[0].cameraSau}
            
            Camera trước: ${productDetailData[0].cameraTruoc}
            
            Chip: ${productDetailData[0].chipXuLy}
            
            RAM: ${productDetailData[0].ram} GB
            
            Dung lượng lưu trữ: ${productDetailData[0].dung_luong} GB
            
            SIM: 1 Nano SIM &amp; 1 eSIM Hỗ trợ 5G
            
            Pin, Sạc: ${productDetailData[0].dungLuongPin} mAh 20 W
            
            Hãng: ${productDetailData[0].ten_thuonghieu}</pre>
    `
    const productName = document.querySelector('.product-name')
    const productPrice = document.querySelector('.product-price')
    const productVersion = document.querySelectorAll('.product-version')
    for (let i = 0; i < productVersion.length; i++) {
        productVersion[i].addEventListener('click', () => {
            productName.textContent = productDetailData[i].ten_sanpham
            productPrice.textContent = `${formatVND(productDetailData[i].gia)}đ`
            productVersion.forEach(element => {
                element.classList.remove('on-active')
            })
            productVersion[i].classList.add('on-active')
        })
    }
}
renderProductDetail()


