require("ejs")
const express = require("express")
const path = require('path');
const getAllFile = require("./utils/getAllFile");
const setUpREST = require("./utils/setUpREST")

const app = express()

app.use("/assets",express.static(path.join(__dirname,"assets")))

// setting view engine to ejs
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

async function apiHandler(){
  //setup api với mỗi file trong app/api
  const folders = await getAllFile(path.join(__dirname,"app","api"))

  for(const folder of folders){
    const parent = folder.split("\\").pop()
    await setUpREST(app,path.join(__dirname,"app","api"),parent)
  }
}

async function viewsHandler(){
  const viewFolder = await getAllFile(path.join(__dirname,"views","pages"))

  for(const page of viewFolder){
    //lấy tên trang để setup đường dẫn
    const pageName = page.split('\\').pop().replace(".ejs","")

    app.get(`/${pageName}`,(req,res)=>{
      res.render(page)
    })
  }
}

apiHandler()

app.get('/', function(req, res) {
    res.render('index');
});

viewsHandler()

app.listen(process.env.PORT || 3000,()=>{
    console.log(`running on: http://localhost:${process.env.PORT}`)
})