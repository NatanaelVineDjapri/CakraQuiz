const registerForm = document.getElementById("registerForm");
const registerMsgs = document.getElementById("registerMsg");
const pahlawan = document.querySelector('input[name="pahlawan"]:checked');
const loginForm = document.getElementById('loginForm');
const loginMsgs = document.getElementById("loginMsg");
const logoutBott = document.getElementById('logoutBott');
const loginBott = document.getElementById('loginBott');
const identitasContainer = document.getElementById('identitas');
const leaderboard = document.getElementById('leaderboard')


class User{
    constructor(username,password,id){
        this.username = username;
        this.password = password;
        this.id = id;
        this.skor = 20020;
        this.tingkat = "C"
    }
}

let users = JSON.parse(localStorage.getItem("users")) || [];
let curUsername = JSON.parse(localStorage.getItem('userIn'));
let kartuUsername = "Uknown";
let kartuId = "Uknown";
let kartuSkor = 0;
let kartuTingkat = "D";

function simpenUserLogin(){
    localStorage.setItem("users", JSON.stringify(users));
}

function register(username,password, id){
    const cekUser = users.find(function(user) {
        return user.username === username;
    });

    if (cekUser){
        return{
            success: false,
            message:"Username sudah dimiliki!"
        }
    } 

    const userBaru = new User(username, password, id);
    users.push(userBaru);
    simpenUserLogin();

    return {
        success: true,
        message: "Registrasi berhasil!"
    };    
}

function login(username, password,id,skor){
    const cekUser = users.find(function(user){
        return user.username === username && user.password === password;
    })

    if (cekUser){
        localStorage.setItem('userIn', JSON.stringify(cekUser));

        return {
            success: true,
            message: "Login sukses! Selamat datang, " + username
        };
    }

    return {
        success: false,
        message: "Username atau password salah!"
    };


}

function logout(){
    localStorage.removeItem('userIn');
    alert('Halo Sahabat Cakra! Kamu logout');
    updateShortCut();
    window.location.href = "index.html";
}

function cekLogin(){
    return localStorage.getItem('userIn') !== null //true
}


function goQuiz(kategori){
    if(!cekLogin()){
        alert('Sahabat Cakra, kamu harus login terlebih dahulu!')
    } else {
        window.location.href = "quiz.html?quiz=" + kategori
    }
}

//on off shortcut login/logout
function updateShortCut(){
    if (!loginBott || !logoutBott) {
        return;
    }
    if(cekLogin()){
        loginBott.style.display = "none";
        logoutBott.style.display = "inline-block";
    } else {
        logoutBott.style.display = "none";
        loginBott.style.display = "inline-block";
    }
}

function randomId(){
    let id;

    while(users.some(function(u){
        return u.id === id;
    })){
        id = Math.floor(Math.random()*1000)  + 1000; 
    }

    return id;

}

function showLeaderboard(x){
    if(!x) {
        return;
    }
    users.sort(function(a,b){
        return b.skor-a.skor;
    });

    let output =""
    for(let i =0;i<3;i++){
        output += `<div class="leaderboard-sub">
                            <img src="images/astronot.png" alt="">
                            <div class="leaderboard-sub-title">
                                <p>${users[i].username} |</p>
                                <p> ${users[i].skor}</p>
                            </div>
                        </div>`
    }

    x.innerHTML = output


}

if(registerForm){
    registerForm.addEventListener("submit", function(r){
    r.preventDefault(); //biar ga reload

    const username = document.getElementById("reqUsername").value;
    const password = document.getElementById("reqPassword").value;

    let newId = randomId();
    const hasilRegister = register(username,password, newId);

    if(hasilRegister.success){
        registerMsgs.textContent = hasilRegister.message;
        registerMsgs.style.color="green";
        registerForm.reset();
    } else {
        registerMsgs.textContent = hasilRegister.message;
    }
    })
}

if(loginForm){
    loginForm.addEventListener("submit",function(l){
    l.preventDefault();

    const username = document.getElementById("logUsername").value;
    const password = document.getElementById("logPassword").value;
        
    
    const hasilLogin = login (username,password);
    if(hasilLogin.success){
        window.location.href ="index.html"
        updateShortCut();
    } else {
        loginMsgs.textContent = hasilLogin.message
    }

})
}

if(curUsername) {
   kartuUsername = curUsername.username;
   kartuId = curUsername.id;
   kartuSkor = curUsername.skor;
   kartuTingkat= curUsername.tingkat;
}

if (curUsername) {
    const usernameEl = document.getElementById("displayUsername");
    const idEl = document.getElementById("displayId");
    const skorEl = document.getElementById("displaySkor"); // mungkin ga ada di halaman ini
    const nasionalismeEl = document.getElementById("displayNasionalisme");

    if (usernameEl) {
        usernameEl.textContent = " " + kartuUsername;
    }
    if (idEl) {
        idEl.textContent = " " + kartuId;
    }
    if (skorEl) {
        skorEl.textContent = " " + kartuSkor; 
    }
    if (nasionalismeEl) {
        nasionalismeEl.textContent = " " + kartuTingkat;
    }
}

showLeaderboard(leaderboard);

document.addEventListener("DOMContentLoaded", updateShortCut);
// localStorage.clear();




