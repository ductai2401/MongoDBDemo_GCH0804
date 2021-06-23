const express = require('express')
const hbs = require('hbs')

var app = express();
app.set('view engine','hbs')

var MongoClient = require('mongodb').MongoClient;
var url =  "mongodb+srv://tommy:123456abc@cluster0.lkrga.mongodb.net/test";

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
    const newValues ={$set : {name: nameInput,price:priceInput}};
    const ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectID(id)};
    
    const client= await MongoClient.connect(url);
    const dbo = client.db("DoQuocBinhDB");
    await dbo.collection("SanPham").updateOne(condition,newValues);
    res.redirect('/view');
})
app.get('/delete',async (req,res)=>{
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectID(id)};

    const client= await MongoClient.connect(url);
    const dbo = client.db("DoQuocBinhDB");
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
    const dbo = client.db("DoQuocBinhDB");
    const productToEdit = await dbo.collection("SanPham").findOne(condition);
    res.render('edit',{product:productToEdit})
})

app.get('/view',async (req,res)=>{
    const results =  await dbHandler.searchSanPham('',"SanPham");
    res.render('allProduct',{model:results})
})

app.post('/doInsert', async (req,res)=>{
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice;
    var newProduct = {name:nameInput, price:priceInput, size : {dai:20, rong:40}}
    await dbHandler.insertOneIntoCollection(newProduct,"SanPham");
    res.render('index')
})
app.get('/insert',(req,res)=>{
    res.render('insert')
})

app.get('/',(req,res)=>{
    res.render('index')
})

var PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('Server is running at: '+ PORT);