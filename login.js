const handleLogin = () => {

    const userName = document.getElementById("username").value
    const password = document.getElementById("password").value

    if (userName === "admin" && password==="admin123"){
        window.location.assign("./home.html")
    }
    else{
        document.getElementById('error').innerText = "Please enter correct username & password"
    }






}