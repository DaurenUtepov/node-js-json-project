const express = require('express');
const path = require('path')
const bodyParser = require('body-parser')
const app = express();
const port = 5000;

//methods from mongo module to work with DB
const {getCollectionData,
  insertUser, 
  insertOrder,
  getUserOrdersData,
  updateOrdersData,
  deleteOrder} = require('./mongo_module');

// setup static folder
app.use(express.static('./public'))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//authentication and default page 
app.get('/', (req, res)=>{
    res.sendFile(path.resolve(__dirname, './pages/auth_page.html')) 
})
//registration page 
app.get('/registration', (req, res)=>{
  res.sendFile(path.resolve(__dirname, './pages/register_page.html')) 
})
//user orders history page 
app.get('/usersorders', (req, res)=>{
  res.sendFile(path.resolve(__dirname, './pages/order_history_page.html')) 
})

//route to order page if user email match 
app.get('/orderpage', (req, res)=>{
  const {e_mail, password} = req.query;
  ( async ()=> {
    try { 
        const users = await getCollectionData("userList");
        const user = users.find(item => {
          return item.e_mail === e_mail
      });
      if (user) {      
        res.sendFile(path.resolve(__dirname, './pages/order_page.html'))
      }
       else{
         res.sen({msg: "user not found", boolean: false})
       }  
    } catch (error) {
        console.error(error);
      }   
    })(); 
})
//route to get products information
app.get('/getproductsdata', (req, res)=>{
  ( async ()=> {
   try {
       const category = await getCollectionData("categoryList");
       const products = await getCollectionData("productList");
       var data ={category, products} 
       res.json(data);
     } catch (error) {
       console.error(error);
     }       
   })(); 
})

//route to get user orders
app.get('/orderhistory', (req, res)=>{
  const {e_mail} = req.query;
  ( async ()=> {
    try { 
        var data = await getUserOrdersData(e_mail);
        res.json(data);
      } catch (error) {
        console.error(error);
      }       
    })();
})

// route to register new user
app.post('/register', (req, res)=>{
  const user = req.body;
  ( async ()=> {
    try { 
        const users = await getCollectionData("userList");;
        users.forEach((item)=>{
          if(user.e_mail === item.e_mail){
            res.json({msg: "e-mail adress already exits", boolean: false})
          }
        })
        res.json({msg: "user created", boolean: true})
        insertUser(user)
    } catch (error) {
        console.error(error);
      }   
    })(); 
})
// route to save users order in db
app.post('/user_order_post', (req, res)=>{
  const order = req.body;
  ( async ()=> {
    try { 
        insertOrder(order)     
    } catch (error) {
        console.error(error);
      }   
    })(); 
});
// route to update user order
app.put('/updateorder', (req, res)=>{
  const {id, data} = req.body;
  console.log(data)
  updateOrdersData(id, data)
})
// route to delete user order
app.delete('/deleteorder', (req, res)=>{
  const {id}= req.body
  deleteOrder(id)
})
// route if page no exist
app.get('*',(req, res)=>{
  res.status(404).send('page not found')
})
app.listen(port, ()=>console.log('server run'));