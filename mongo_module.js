const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const DB_URL = "mongodb://localhost:27017/";
const DB_Name = "projectDatabase";

const getCollectionData = async (name)=>{  
        const db = await MongoClient.connect(DB_URL);
        const dbo = db.db(DB_Name);
        if(name == "categoryList"){
            const category = await dbo.collection('categoryList').find({}).toArray();
            console.log("category list received")
            return category    
        }
        if(name == 'productList'){
            const products = await dbo.collection('productList').find({}).toArray();
            console.log("products list received")
            return products
        }
        if(name == 'userList'){
            const users = await dbo.collection('userList').find({}).toArray();
            console.log("user list received")
            return users;
        }
        if(name == 'orderList'){
                const orders = await dbo.collection('orderList').find({}).toArray();
                console.log("order list received")
                return orders;       
        }
}

const insertUser = async (user)=>{   
        const db = await MongoClient.connect(DB_URL);
        const dbo = db.db(DB_Name);
        await dbo.collection("userList").insertOne(user);
        console.log("user inserted to collection");
}

const insertOrder = async (orders)=>{   
        const db = await MongoClient.connect(DB_URL);
        const dbo = db.db(DB_Name);
        await dbo.collection("orderList").insertOne(orders);
        console.log("order inserted");
}

const getUserOrdersData = async (email)=>{   
        const db = await MongoClient.connect(DB_URL);
        const dbo = db.db(DB_Name);
        const orders = await dbo.collection('orderList').find({name:email}).toArray();
        console.log("user order received")
        return orders;
}

const updateOrdersData = async (id, data)=>{  
        var myid = { _id:ObjectID(id) };
        var newvalues = { $set: {products: data} }; 
        const db = await MongoClient.connect(DB_URL);
        const dbo = db.db(DB_Name);
        dbo.collection('orderList').updateOne(myid, newvalues, (err, res)=>{
                if (err) throw err;
                console.log("order updated");
                db.close();
              });
}

const deleteOrder = async (id)=>{  
        var myid = { _id:ObjectID(id) }; 
        const db = await MongoClient.connect(DB_URL);
        const dbo = db.db(DB_Name);
        dbo.collection('orderList').deleteOne(myid, function(err, obj) {
                if (err) throw err;
                console.log("order deleted");
                db.close();
              });
}

module.exports = {getCollectionData,
        insertUser,
        insertOrder,
        getUserOrdersData,
        updateOrdersData,
        deleteOrder};