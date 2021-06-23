const MongoClient = require('mongodb').MongoClient;
const url =  "mongodb+srv://tommy:123456abc@cluster0.lkrga.mongodb.net/test";
const dbName = "DoQuocBinhDB";


async function  searchSanPham(condition,collectionName){  
    const dbo = await getDbo();
    const searchCondition = new RegExp(condition,'i')
    var results = await dbo.collection(collectionName).
                            find({name:searchCondition}).toArray();
    return results;
}

async function insertOneIntoCollection(documentToInsert,collectionName){
    const dbo = await getDbo();
    await dbo.collection(collectionName).insertOne(documentToInsert);
}

async function getDbo() {
    const client = await MongoClient.connect(url);
    const dbo = client.db(dbName);
    return dbo;
}

module.exports = {searchSanPham,insertOneIntoCollection}
