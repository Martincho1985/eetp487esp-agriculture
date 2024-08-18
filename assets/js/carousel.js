const carouselSlide = document.querySelector('.carousel-slide');
const carouselItems = document.querySelectorAll('.carousel-item');
const totalItems = carouselItems.length;
let currentIndex = 0;

function moveSlide(direction) {
    currentIndex = (currentIndex + direction + totalItems) % totalItems;
    carouselSlide.style.transform = `translateX(-${currentIndex * 100}%)`;
}
