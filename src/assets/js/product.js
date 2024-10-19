const route = (document.location.href).split('/').pop()

let page = 1
const itemPerPage = 8
let totalPage

const urls = ['getBrandList','getRamList','getDungLuongList']
const fetchFilterList = urls.map( async (url) => {
  const res = await fetch(`./api/data/${url}`)
  const json = await res.json()
  return json
})



export async function fetchProductData(itemPerPage = 16,page = 1) {
  const res = await fetch(`./api/data/getSpList?itemPerPage=${itemPerPage}&page=${page}`);
  const json = await res.json();
  return json;
}
async function getTotalPage(itemPerPage=16){
  const res = await fetch(`./api/data/getTotalProductPage?itemPerPage=${itemPerPage}`)
  const json = await res.json();
  totalPage = json
}

async function renderAllFilterList(){
  const [brandList,ramList,memoryList] = await Promise.all(fetchFilterList)
  
  const brandListElement = document.getElementById('brand-list')
  if(!brandListElement)
    return
  // brandListElement.innerHTML = brandList.map((brand)=>`<div class="brand-list-item border border-black rounded">${brand}</div>`).join("")  
  for(const brand of brandList){
    const brandItem = document.createElement('div')
    brandItem.classList.add('brand-list-item','border','border-black','rounded')
    brandItem.textContent = brand
    brandItem.onclick = ()=>{
      if(brandItem.classList.contains("selected")){
        brandItem.classList.remove("selected")
        return
      }
      const brandListButton = document.getElementsByClassName("brand-list-item")
      for(const button of brandListButton)
        button.classList.remove("selected")
      brandItem.classList.add("selected")
    }

    brandListElement.append(brandItem)
  }
  

  const ramListElement = document.getElementById('ram-list')
  if(!ramListElement)
    return
  // ramListElement.innerHTML = ramList.map((ram) => `<div class="ram-list-item border border-black rounded">${ram} GB</div>`).join("")
  for(const ram of ramList){
    const ramItem = document.createElement('div')
    ramItem.classList.add("ram-list-item","border","border-black","rounded")
    ramItem.textContent = `${ram} GB`
    ramItem.onclick = () =>{
      if(ramItem.classList.contains("selected")){
        ramItem.classList.remove("selected")
        return
      }
      const ramListButton = document.getElementsByClassName("ram-list-item")
      for(const button of ramListButton)
        button.classList.remove("selected")
      ramItem.classList.add("selected")
    }
    ramListElement.append(ramItem)
  }
  const memoryListElement = document.getElementById('memory-storage-list')
  if(!memoryListElement)
    return

  // memoryListElement.innerHTML = memoryList.map((memory)=> `<div class="memory-storage-list-item border border-black rounded">${memory} GB</div>`).join("")
  for(const memory of memoryList){
    const memoryElement = document.createElement('div')
    memoryElement.classList.add("memory-storage-list-item","border","border-black","round")
    memoryElement.textContent = `${memory} GB`
    memoryElement.onclick = () =>{
      if(memoryElement.classList.contains("selected")){
        memoryElement.classList.remove("selected")
        return
      }
      const memoryListButton = document.getElementsByClassName('memory-storage-list-item')
      for(const button of memoryListButton)
        button.classList.remove("selected")
      memoryElement.classList.add("selected")
    }

    memoryListElement.append(memoryElement)
  }

}




export async function renderProductList(itemPerPage = 16,page = 1) {
  let productList
  if(route == 'allProduct'){
    [productList] = document.getElementsByClassName("product-list-all");
  }
  else{
    [productList] = document.getElementsByClassName("product-list");

  }
  if (!productList) {
    return;
  }
  const {success,data} = await fetchProductData(itemPerPage,page);
  if(!success){
    console.log(data)
    return
  }

  const products = [];
  for (const product of data) {
    products.push(product);
  }
  const VND = new Intl.NumberFormat("Vi-VN", {
    style: "currency",
    currency: "VND",
  });

  productList.innerHTML = products
    .map(
      (product) => `
  <a href="/productDetail?id=${
    product.id_sanpham
  }" class="product mx-1 my-1 border border-secondary rounded-4 link-underline link-underline-opacity-0">
  <img src="/img/${product.ten_sanpham}" class="card-img-top p-2" alt="...">

  <div class="card-body m-2">
    <h5 class="card-title text-center fs-4 text-dark fw-bold">${
      product.ten_sanpham
    }</h5>
    <p class="card-text my-4 fs-4 fw-bold text-danger">${
      product.gia == 0
        ? "Comming Soon!"
        : VND.format(product.gia)
    }</p>
  </div>
</a>
  `
    )
    .join("");

}

async function changeToPage(Page) {
  page = Number.parseInt(Page)
  // console.log(`change to ${page}`) 
  await renderProductList(itemPerPage,Page)
  renderPaginationList(Page)
 }

async function renderPaginationList(){
  if(!totalPage)
    return
  const {success,data} = totalPage
  if(!success){
    console.log(data)
    return
  }
  if(data <= 1)
    return

  const pageList = document.getElementById("page-list")
  if(!pageList)
    return

  pageList.innerHTML=""

  if(page != 1){
    const firstButton = document.createElement('li')
    firstButton.classList.add('page-item')
    firstButton.innerHTML = `<li class="page-link" style="cursor: pointer;" aria-label="Previous">
    <span aria-hidden="true">&laquo;</span>
    </li>`
    firstButton.onclick = () =>{
      changeToPage(page-1)
    }
    pageList.append(firstButton)
  }

  //[1,2,3,4,5,...,100]
  // ^
  //[1,...,3,4,5,6,7,...,100]
  //           ^
  //[1,...,4,5,6,7,8,...,100]
  //           ^
  //[1,...,40,41,42,43,44,...,100]
  //             ^
  //[1,...,85,86,87,88,89,...,91]
  //             ^

  const pageToShow = []
  function caculateThePageToShow(){
    const minPage = 4;
    const numOfPageToLeft = page - 1 
    const numOfPagetToRight = data - page
    if(numOfPageToLeft < minPage){
      for(let i=1;i<=page;i++)
        pageToShow.push(i)
    }
    if(numOfPageToLeft >= minPage){
      pageToShow.push(1)
      pageToShow.push(0)
      for(let i=page-2;i<=page;i++)
        pageToShow.push(i)
    }
    if(numOfPagetToRight < minPage){
      for(let i=page+1;i<=data;i++)
        pageToShow.push(i)
    }
    if(numOfPagetToRight >=minPage){
      for(let i=page+1;i<=page+2;i++)
        pageToShow.push(i)
      pageToShow.push(0)
      pageToShow.push(data)
    }
    
    // for(let i=page+1;i<=page+2;i++)
    //   pageToShow.push(i)

    // if(numOfPageToLeft >= 4){
    //   pageToShow.push(1)
    //   for(let i=page-2;i<=page+2;i++)
    //     pageToShow.push(i)
    // }


  }
  caculateThePageToShow()
  // console.log(pageToShow)

  //<li class="page-item active"><button class="page-link" href="#">1</button></li>
  // const buttonList = []
  for(let i=0;i<pageToShow.length;i++){
    const pageButton = document.createElement(`li`)
    pageButton.classList.add("page-item")
    if(page == pageToShow[i])
      pageButton.classList.add("active")
    if(pageToShow[i] != 0)
      pageButton.innerHTML = `<button class="page-link" href="#">${pageToShow[i]}</button>`
    if(pageToShow[i] == 0)
      pageButton.innerHTML = `<button class="page-link" href="#">...</button>`

    const handlePageClick = () => {
      if(page == pageToShow[i])
        return
      if(pageToShow[i] == 0){
        // console.log("input a page")
        pageButton.innerHTML = `<input type="number" class="page-link-input">`
        const input= pageButton.children[0]
        input.focus()

        
        function inputHandler(){
          const pageNum = input.value
          if(pageNum != ""){
            if(pageNum < 1){
              changeToPage(1)
              return
            }
            if(pageNum > data){
              changeToPage(data)
              return
            }
            changeToPage(pageNum)
            return
          }
  
          pageButton.innerHTML = `<li class="page-item"><button class="page-link" href="#">...</button></li>`
          pageButton.onclick = handlePageClick

        }
        
          pageButton.onclick = null

          input.onblur = inputHandler

          input.onkeydown = (e) =>{
            if(["e", "E", "+", "-"].includes(e.key))
              e.preventDefault();
            if(e.key == 'Enter')
              input.blur()

          }
          
        return
      }
  
  
      changeToPage(pageToShow[i])
    }

    pageButton.onclick = handlePageClick

    pageList.append(pageButton)
  }

  if(page != data){
    const lastButton = document.createElement(`li`)
    lastButton.classList.add('page-item')
    lastButton.innerHTML = ` <li class="page-item">
    <li class="page-link" href="#" style="cursor: pointer;" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </li>
  </li>`
    lastButton.onclick = () =>{
      changeToPage(page+1)
    }
    pageList.append(lastButton)
  }
  
}

if(route == "allProduct"){
  renderProductList(itemPerPage,1)
  await getTotalPage(itemPerPage)
  renderPaginationList()
  renderAllFilterList()
}else{
  renderProductList(8,1)
}