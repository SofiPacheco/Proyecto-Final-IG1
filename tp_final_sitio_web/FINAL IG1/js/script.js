function scrollCarousel(direction) {
    const carousel = document.getElementById('carousel');
    const scrollAmount = 300;
    carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function toggleText(card) {
    const content = card.querySelector('.art-card-content');
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}