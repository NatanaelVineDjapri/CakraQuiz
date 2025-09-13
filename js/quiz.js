const urlParams = new URLSearchParams(window.location.search);
const kategori = urlParams.get("quiz");

const pertanyaanAll = document.getElementById("pertanyaan");
const buttonJawaban = document.getElementById("answer-buttons");
const nextButton =document.getElementById("next");
const tombol = document.querySelectorAll("#answer-buttons .btn");
const gambarSoal = document.getElementById("gambarSoal")
const background = document.querySelectorAll('.quiz-bott-1')
const displaySkor = document.getElementById('skor')
const feedbackText = document.getElementById("feedback")
const feedbacksalahText = document.getElementById("feedback-salah")
const exitQuiz = document.getElementById("exitbot")
const nextQuiz = document.getElementById("nextquizbot")
let currentQuestionIndex = 0;
let skor = 0;
let currentQuiz = []
let benar = 0;
let salah = 0;

if (kategori && pertanyaan[kategori]) {
    chooseQuiz(kategori);   
} else {
    alert("Kategori quiz tidak ditemukan!");
}

function chooseQuiz(kategori) {
    if (pertanyaan[kategori]) {
        currentQuiz = pertanyaan[kategori];
        startQuiz();
    } else {
        pertanyaanAll.innerText = "Kategori quiz tidak ditemukan!";
    }
}

function startQuiz(){
    currentQuestionIndex = 0;
    skor=0;
    nextButton.innerHTML="Next"
    showQuestion();
}

function showQuestion(){
    let currentQuestion = currentQuiz[currentQuestionIndex];
    let questionNo = currentQuestionIndex +1;
    pertanyaanAll.innerHTML = `
                <div class="nomor"><p>${questionNo}</p></div>
                <p class="soal">${currentQuestion.pertanyaan}</p>
                `

    document.querySelectorAll(".quiz-bott-1").forEach(function(kotak){
        kotak.style.background = ""; 
    });

  
    if(currentQuestion.gambar){
        gambarSoal.src = currentQuestion.gambar;
        gambarSoal.style.display = "block";
    } else {
        gambarSoal.style.display = "none";
    }

    currentQuestion.jawaban.forEach(function(jawab, index) {
        var btn = tombol[index];            
        btn.innerText = jawab.text;          
        btn.dataset.correct = jawab.correct;  
        btn.disabled = false;
        btn.style.background=""
        btn.onclick = function() {           
            chooseAnswer(btn);                
        };
    });

    nextButton.style.display = "none"

    if(currentQuestionIndex === currentQuiz.length-1){
        nextButton.innerHTML = "Finish";
    }

}


function chooseAnswer(btn){
    var bener = btn.dataset.correct === "true";
    let kotak = btn.parentElement;
    
    if(bener){
        kotak.style.background ="green";
        skor +=100;
        benar++;
    } else {
        kotak.style.background = "red";
        salah++;  
        if(skor>0){
          skor -=10;
        } else {
            skor = 0;
        }
    }

    tombol.forEach(function(b){
        if(b.dataset.correct === "true"){
            b.parentElement.style.background = "green"; 
        }
        b.disabled = true; 
    });

    nextButton.style.display = "block";

    progressBar(benar);
}


function progressBar(jawabanBenar){
    const totalSoal = currentQuiz.length;
    let persen = (jawabanBenar/totalSoal)*100;
    const progressFill = document.getElementById("bar")
    const accuracyText = document.getElementById("accuracy")
    if(progressFill){
        
        progressFill.style.width = persen*6+"px";
        accuracyText.textContent = Math.round(persen) + "%";
    }

}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuiz.length) {
        showQuestion();
    } else {
        let curUser = JSON.parse(localStorage.getItem("userIn"));
        if (curUser) {
    
            let skorLama = curUser.skor;
            let skorBaru = skorLama + skor;
            curUser.skor = skorBaru;
            curUser.tingkat = userRank(skorBaru);

        
            localStorage.setItem("userIn", JSON.stringify(curUser));

            let users = JSON.parse(localStorage.getItem("users")) || [];
            for (var i = 0; i < users.length; i++) {
                if (users[i].username === curUser.username) {
                    users[i].skor = skorBaru;
                    users[i].tingkat = curUser.tingkat;
                    break;
                }
            }

            localStorage.setItem("users", JSON.stringify(users));
        }

        if (displaySkor) {
            displaySkor.textContent = skor; 
        }

        nextButton.style.display = "none";

        const quizContainer = document.getElementById('quizwrapper');
        const scoreContainer = document.getElementById('result');

        if(quizContainer){
            quizContainer.style.display = "none";
        }
        if(scoreContainer){
            scoreContainer.style.display = "block"
        }

        if(feedbackText && feedbacksalahText){
            const saranText = feedBack ();
            feedbacksalahText.textContent = `Kamu salah ${salah} dari 10 total soal`
            feedbackText.textContent = saranText;
        }

        if (kategori === "quiz4") {
            nextQuiz.style.display = "none";   
        }
        
    }
}

function feedBack(){
    if(salah === 0){
        return "Mantap! Semua jawaban benar ";
    } else if(salah <= 2){
        return "Bagus, tapi coba perhatikan beberapa soal yang salah.";
    } else if(salah <= 4){
        return "Perlu latihan lagi, beberapa konsep masih kurang jelas.";
    } else if(salah <= 6){
        return "Mending ulangi materi, banyak yang belum dikuasai.";
    } else if(salah <= 8){
        return "Harus serius belajar, sebagian besar jawaban salah!";
    } else {
        return "Wah, banyak yang belum dipahami, mending pelajari dari awal.";
    }
}

exitQuiz.addEventListener("click",function(){
    window.location.href = "index.html";
});

nextQuiz.addEventListener("click",function(){
    let nextKategori;
    if (kategori === "quiz1") {
        nextKategori = "quiz2";
    } else if (kategori === "quiz2") {
        nextKategori = "quiz3";
    } else if (kategori === "quiz3") {
        nextKategori = "quiz4";
    } else {
        nextQuiz.style.display = "none";
    }

     window.location.href = `quiz.html?quiz=${nextKategori}`;
})

nextButton.addEventListener("click", function() {
   handleNextButton();
});




