console.log("hello register page")
const btn = document.querySelector("button");
const fname = document.querySelector("#inputFname");
const lname = document.querySelector("#inputLname");
const email = document.querySelector("#inputEmail");
const password = document.querySelector("#inputPassword");
const msg_error = document.querySelector("#msg_error"); 
const msg_success = document.querySelector("#msg_success"); 

    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const  {data}  = await axios.post('http://localhost:5000/register', 
            {firstName: fname.value,
            lastName: lname.value,
            e_mail: email.value,
            password: Number(password.value) })
            
            if(data.boolean){
                msg_success.innerText = data.msg;
                setTimeout(() => {
                    location.replace("http://localhost:5000")
                }, 2000)
            }else{
                msg_error.innerText = data.msg;
                setTimeout(()=>{
                msg_error.innerText = "";
            }, 2000)
            }
                
        } catch (error) {
                console.log(error)
                }
    })