var express = require('express')
var app = express()
const async = require('hbs/lib/async')
var url = 'mongodb+srv://nodejs_Huy_Phuoc:123456789a@nodejs.smboiab.mongodb.net/ATNToys';

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended:true }))
app.use(express.static('public'))

const {ObjectId} = require('mongodb')
var MongoClient = require('mongodb').MongoClient

    // Connect Database
    // let client = await MongoClient.connect(url);
    // let dbo = client.db("Tên_Database")
    // let something = await dbo.collection("Tên_Bảng").find().toArray()

app.get('/',async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys")
    let category = await dbo.collection("category").find().toArray()
    let products = await dbo.collection("products").find().toArray()
    res.render('home',{'category':category, 'products':products});
})

app.get('/create',async (req, res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys")
    let category = await dbo.collection("category").find().toArray()
    res.render('create', {'category': category})
})
app.post('/create',async (req, res)=>{
    let name = req.body.txtName
    let price = req.body.txtPrice
    let category = req.body.txtCategory
    let picture = req.body.txtPicture
    let car = {
        'name' : name,
        'category' : category,
        'price' : price,
        'picture' : picture
    }
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys")
    await dbo.collection("products").insertOne(car)
    res.redirect('/')
})

app.get('/delete',async (req, res)=>{
    let id = req.query.id
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys")
    await dbo.collection("products").deleteOne({_id : ObjectId(id)})
    res.redirect('/')
})

app.get('/category',async (req, res)=>{
    let category = req.query.category
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys")
    let categorys = await dbo.collection("category").find().toArray()
    let products = await dbo.collection("products").find({'category' : category}).toArray()
    res.render('home', {'products' : products, 'category' : categorys})
})
app.get('/search', async (req, res)=>{
    let search = req.query.txtSearch;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys")
    let categorys = await dbo.collection("category").find().toArray()
    let products = await dbo.collection("products").find({'name' : new RegExp(search, 'i')}).toArray()
    // console.log(search)
    res.render('home', {'products' : products, 'category' : categorys})
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
