const MongoClient = require('mongodb').MongoClient;
const url =  "mongodb+srv://tommy:123456abc@cluster0.lkrga.mongodb.net/test";

async function  searchSanPham(condition,collectionName){  
    const client= await MongoClient.connect(url); 
    const dbo = client.db("DoQuocBinhDB");
    const searchCondition = new RegExp(condition,'i')
    var results = await dbo.collection(collectionName).
                                        find({name:searchCondition}).toArray();
    return results;
}

module.exports = {searchSanPham}