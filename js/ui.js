const slider = document.querySelector('.statistik-indonesia');
const semuaSubItem = document.querySelectorAll('.statistik-sub');
const tombolNext = document.getElementById('next-bott');
const tombolPrev = document.getElementById('prev-bott');


let posisi = 0
const gap = 16;
const lebar = semuaSubItem[0].offsetWidth;

function geserSlider(){
    const totalGeser = posisi*(lebar+gap);
    slider.style.transform=  `translateX(-${totalGeser}px)`;
}

tombolNext.addEventListener('click',()=>{
    if (posisi + 5 < semuaSubItem.length){
        posisi+=5;
        geserSlider();
    }
});

tombolPrev.addEventListener('click' ,() => {
    if (posisi-5 >=0 ){
        posisi -= 5;
        geserSlider();

    }
})

