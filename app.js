const express = require('express')
const hbs = require('hbs')
const session = require('express-session');

var app = express();

app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'abcc##$$0911233$%%%32222', 
    cookie: { maxAge: 60000 }}));

app.set('view engine','hbs')

var MongoClient = require('mongodb').MongoClient;
var url =  "mongodb+srv://doductai2401:ductailc123@cluster0.4xfxs.mongodb.net/test";

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

var dsNotToDelete = ['ao','quan','bep','my goi'];

const dbHandler = require('./databaseHandler')

//search chinh xac=> tim gan dung
app.post('/search', async (req,res)=>{
    const searchText = req.body.txtName;
    const results =  await dbHandler.searchSanPham(searchText,"SanPham");
    res.render('allProduct',{model:results})
})

app.post('/update',async (req,res)=>{
    const id = req.body.id;
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const imgURLInput = req.body.imgURL;
    const newValues ={$set : {name: nameInput,price:priceInput,imgUrl:imgURLInput}};
    const ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectID(id)};
    
    const client= await MongoClient.connect(url);
    const dbo = client.db("DoDucTaiDB");
    await dbo.collection("SanPham").updateOne(condition,newValues);
    res.redirect('/view');
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectID(id)};

    const client= await MongoClient.connect(url);
    const dbo = client.db("DoDucTaiDB");
    const productToDelete = await dbo.collection("SanPham").findOne(condition);
    const index = dsNotToDelete.findIndex((e)=>e==productToDelete.name);
    if (index !=-1) {
        res.end('khong the xoa vi sp dac biet: ' + dsNotToDelete[index])
    }else{
        await dbo.collection("SanPham").deleteOne(condition);
        res.redirect('/view');
    }   
})

app.get('/edit',async (req,res)=>{
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectID(id)};

    const client= await MongoClient.connect(url);
    const dbo = client.db("DoDucTaiDB");
    const productToEdit = await dbo.collection("SanPham").findOne(condition);
    res.render('edit',{product:productToEdit})
})

app.get('/view',async (req,res)=>{
    const results =  await dbHandler.searchSanPham('',"SanPham");
    var userName = 'Not logged in';
    if(req.session.userName){
        userName = req.session.userName;
    }
    res.render('allProduct',{model:results,username:userName})
})

app.post('/doInsert', async (req,res)=>{
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice;
    const imgURLInput = req.body.imgURL;
    const newProduct = {name:nameInput, price:priceInput, imgUrl:imgURLInput}
    await dbHandler.insertOneIntoCollection(newProduct,"SanPham");
    res.render('index')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/login',async (req,res)=>{
    const nameInput = req.body.txtName;
    const passInput = req.body.txtPassword;
    const found = await dbHandler.checkUser(nameInput,passInput);
    if(found){
        res.render('index',{loginName:nameInput})
        req.session.userName = nameInput
    }else{
        res.render('index',{errorMessage:"Login Failed"})
    }
})
app.post('/doRegister', async (req,res)=>{
    const nameInput = req.body.txtName;
    const passInput = req.body.txtPassword;
    const newUser = {user:nameInput,password:passInput};
    await dbHandler.insertOneIntoCollection(newUser,"users");
    res.redirect('/')
})
app.get('/insert',(req,res)=>{
    res.render('insert')
})

app.get('/',(req,res)=>{
    var userName = 'Not logged in';
    if(req.session.userName){
        userName = req.session.userName;
    }
    res.render('index',{username:userName})
})

var PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('Server is running at: '+ PORT);