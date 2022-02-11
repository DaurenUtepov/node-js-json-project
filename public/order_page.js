console.log("hello order page")
const categoryID = document.querySelector('#categoryID')
const productID = document.querySelector('#productID')
const orderHistory = document.querySelector('#orderHistory')

const btnOrder = document.querySelector("#overlayClick");
const overlay = document.querySelector("#overlay");
const oredeListID = document.querySelector("#oredeListID");
const closeID = document.querySelector("#close");
const sendToNode = document.querySelector("#sendToNode");

const logout = document.querySelector("#logout");


const queryString = window.location.search;
var user_email = new URLSearchParams(queryString).get("e_mail");
console.log(user_email)

var userOrderList = [];
var userNodeList= [];
var counter = 0;

//methods to get products information 
const request = async () => {
  const response = await fetch('http://localhost:5000/getproductsdata');
  const json = await response.json();
  console.log(json)
  return json;
}

request().then(({category, products})=>{
  //link to order history page 
    orderHistory.setAttribute("href","http://localhost:5000/usersorders"+queryString)
    categoryID.innerHTML= categoryBtns(category);
    productID.innerHTML = productsMenu(products);
    filterMenu(products);
    createOrder()
})
 // render category menu  
const filterMenu = (products)=>{
  const filterBtns = categoryID.querySelectorAll(".filter-btn");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      const categoryName = e.currentTarget.dataset.name;
      const menuCategory = products.filter(menuItem=>menuItem.category === categoryName)       
       productID.innerHTML=productsMenu(menuCategory);
       createOrder()
    });
  });
}
  // method to create order 
const createOrder = ()=>{
  const oderQuantity = document.querySelector("#oderQuantity");
  const addBtns = productID.querySelectorAll(".add-btn");
  addBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      const name = e.currentTarget.dataset.name
      let quantity = Number (e.currentTarget.parentNode.querySelector('input').value);
      userOrderList.push({name, quantity})
      console.log(userOrderList);
      quantity = e.currentTarget.parentNode.querySelector('input').value=0;
      counter++;
      oderQuantity.textContent = counter;
    })
  })
}
  // invoke method to show current order 
btnOrder.addEventListener("click", ()=>{
  overlay.style.display = "block";
  var check = true;
  if(userOrderList.length ==0){
    check =false;
    oredeListID.innerText = "Please add products"
  }
  if(check){
    userOrderList.forEach(function (a) {
      if (!this[a.name]) {
          this[a.name] = { name: a.name, quantity: 0 };
          userNodeList.push(this[a.name]);
      }
      this[a.name].quantity += a.quantity;
    }, Object.create(null));

    var items = userNodeList.map((item)=>{
      return `<h5>${item.name}: ${item.quantity}<h5>`
    }).join("");
    oredeListID.innerHTML = items;
  }

  })

// invoke method to save order in DB
sendToNode.addEventListener("click", ()=>{
  
  saveInDB(userNodeList);
  location.reload();

  overlay.style.display = "none";  
})

closeID.addEventListener("click", ()=>{
  overlay.style.display = "none";
})
logout.addEventListener("click", ()=>{
  location.replace("http://localhost:5000");
})
// method to create category button
const categoryBtns = (data)=>{
  const category = data
    .map(function (item) {
      return `<button type="button" class="btn btn-lg btn-info mr-3 mt-5 filter-btn" data-name="${item.name}">
          ${item.name}
        </button>`;
    })
    .join("");
  return category;  
}
// method to create products menu
const productsMenu = (data)=>{
  const products = data
    .map(function (item) {
      return `<div class="card m-2" style="width: 18rem;" data-type=${item.category}>
                <div class="card-body">
                  <h5 class="card-title text-center">${item.name}</h5>
                  <p class="text-center">price: ${item.price} CAD </p>
                  <div class="d-flex">
                    <div class="input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">quantity</span>
                        </div>
                        <input type="number" class="form-control mr-3" min="0">
                    </div>
                    <button type="button" class="btn  btn-warning  add-btn" data-name="${item.name}">ADD</button>              
                  </div>              
                </div>
              </div>`;
    }).join("");
  return products;  
}
// method to save order in db
const saveInDB = (data)=>{
  fetch('http://localhost:5000/user_order_post',{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                  {name:user_email,
                  products: userNodeList}
                  )
            })
}

