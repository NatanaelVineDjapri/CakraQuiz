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
    pilihQuiz(kategori);   // ambil soal sesuai kategori
} else {
    alert("Kategori quiz tidak ditemukan!");
}

function pilihQuiz(kategori) {
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
    // startTimer();
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
    // Isi jawaban
    if(currentQuestion.gambar){
        gambarSoal.src = currentQuestion.gambar;
        gambarSoal.style.display = "block";
    } else {
        gambarSoal.style.display = "none";
    }

    currentQuestion.jawaban.forEach(function(jawab, index) {
    var btn = tombol[index];              // ambil tombol sesuai index
    btn.innerText = jawab.text;           // isi teks tombol
    btn.dataset.correct = jawab.correct;  // tandai benar/salah
    btn.disabled = false;
    btn.style.background=""
    btn.onclick = function() {            // event klik
        pilihJawaban(btn);                // panggil fungsi cek
    };
    });

    nextButton.style.display = "none"

    if(currentQuestionIndex === currentQuiz.length-1){
        nextButton.innerHTML = "Finish";
    }

}


function pilihJawaban(btn){
    var bener = btn.dataset.correct === "true";
    let kotak = btn.parentElement;
    
    if(bener){
        kotak.style.background ="green";
        skor +=100;
        benar++;
    } else {
        kotak.style.background = "red";
        skor +=10;
        salah++;
    }

    tombol.forEach(function(b){
        if(b.dataset.correct === "true"){
            b.parentElement.style.background = "green"; // highlight jawaban benar
        }
        b.disabled = true; // matiin semua tombol biar ga bisa diklik lagi
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
        // Quiz selesai
        var curUser = JSON.parse(localStorage.getItem("userIn"));
       
        if (curUser) {
            // Ambil skor lama
            var skorLama = curUser.skor;

            var skorBaru = skorLama + skor;
            curUser.skor = skorBaru;

            // Simpan kembali ke localStorage
            localStorage.setItem("userIn", JSON.stringify(curUser));

            // Update juga di array users
            var users = JSON.parse(localStorage.getItem("users")) || [];
            for (var i = 0; i < users.length; i++) {
                if (users[i].username === curUser.username) {
                    users[i].skor = skorBaru;
                    break;
                }
            }

            // Simpan array users kembali ke localStorage
            localStorage.setItem("users", JSON.stringify(users));
        }

        if (displaySkor) {
            displaySkor.textContent = skor; // atau curUser.skor jika mau total
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




