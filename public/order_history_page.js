console.log("hello user order page");

const accordion = document.querySelector("#accordion");
const overlay = document.querySelector("#overlay");
const closeID = document.querySelector("#close");
const sendToNode = document.querySelector("#sendToNode");
const oredeListID = document.querySelector("#oredeListID");
const order_page = document.querySelector('#order_page')
const logout = document.querySelector("#logout");

const queryString = window.location.search;
var user_email = new URLSearchParams(queryString).get("e_mail");


( async() => {
    try {
      //method to retrive current user orders
        const  {data}  = await axios.get('http://localhost:5000/orderhistory',{
          params:{e_mail:user_email}
        });
        order_page.setAttribute("href","http://localhost:5000/orderpage"+queryString)
        var idNum ='';  
        //method to render orders
        accordion.innerHTML = createAcardion(data);
        //method to delete order
        const deleteBtns = document.querySelectorAll(".deleteBTN");
        deleteBtns.forEach((btn)=>{
          btn.addEventListener('click',(e)=>{
            const id = e.currentTarget.dataset.id
            deleteOrder(id)
            location.reload();
          })
        })
        //method to change order
        const editBtns = document.querySelectorAll(".editBTN");
        editBtns.forEach((btn)=>{
          btn.addEventListener('click',(e)=>{
            var products = createUpdateList(data);
            idNum = e.currentTarget.dataset.id
            const index = e.currentTarget.dataset.index
            oredeListID.innerHTML = products[index].join(" ")
            overlay.style.display = "block";     
          })
        })
        //method to save chnaged order
        sendToNode.addEventListener("click", (e)=>{
          var list = [];
          const items = e.currentTarget.parentNode.parentNode.querySelectorAll("input");
          console.log(items);
          items.forEach((item)=>{
            let name = item.dataset.name;
            let quantity = item.value;
            list.push({name, quantity})
          })
          console.log(list)
          updateOrder(idNum, list)
          overlay.style.display = "none";
          location.reload();  
        })

    } catch (error) {
    console.log(error)
    }
  })();

  logout.addEventListener("click", ()=>{
    location.replace("http://localhost:5000");
  })
  //method to render order body order
  const createAcardion = (data)=>{
    var orderlist = [];
    var products = createProductsList(data);
    for (var i = 0; i < data.length; i++) {
      var item = `
            <div class="card" data-id=${data[i]._id}>
              <div class="card-header" id="heading${i+1}">
                <h5 class="mb-0">
                  <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i+1}" aria-expanded="true" aria-controls="collapse${i+1}">
                    order #${i+1}
                  </button>
                </h5>
              </div>
              <div id="collapse${i+1}" class="collapse show" aria-labelledby="heading${i+1}" data-parent="#accordion">
                <div class="card-body" data-id=${data[i]._id}>
                  ${products[i].join("")}
                  <button class="deleteBTN" data-id=${data[i]._id}>DELETE</button>
                  <button class="editBTN" data-id=${data[i]._id} data-index=${i}>EDIT</button>
                </div>
              </div>
            </div>`
      orderlist.push(item);
    }
    return orderlist.join(""); 
  }
  //method to render products in  order body 
  const createProductsList = (data)=>{
    var productList = [];
        for (var i = 0; i < data.length; i++) {
          var product = data[i].products.map((item)=>{
            return ` <div>
              <p>${item.name} : ${item.quantity}</p>
            </div>`
          })
          productList.push(product);
        }
   return productList;    
  }

  const createUpdateList = (data)=>{
    var productList = [];
        for (var i = 0; i < data.length; i++) {
          var product = data[i].products.map((item)=>{
            return ` <div class="container" d-flex justify-content-center">
              <div class="row">
                 <span class="col-4 my-2"> ${item.name} </span><input class="col-4 my-2" data-name="${item.name}" type="number" value="${item.quantity}" min="0">
              </div>
            </div>`
          })
          productList.push(product);
        }
   return productList;    
  }
  closeID.addEventListener("click", ()=>{
    overlay.style.display = "none";
  })

  //method to delete order
  const deleteOrder = (ordernum)=>{
    fetch('http://localhost:5000/deleteorder',{
                method:'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: ordernum,    
                })
    })
  }
  //method to update order
  const updateOrder = (id, data)=>{
    fetch('http://localhost:5000/updateorder',{
                method:'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id,data})
    })
  }