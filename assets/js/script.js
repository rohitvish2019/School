console.log("Script loaded");
function logout(){
    window.location.href='/logout';
    console.log("Please logout")
}

document.getElementById('logout').addEventListener('click',logout);