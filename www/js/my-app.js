window.App = new Framework7({
    pushState: 'true',
    swipeBackPage:	'true',
    swipePanel: 'both',
});

//swiper
var mySwiper = App.swiper('.swiper-container', {
    speed: 400,
    spaceBetween: 100,
    slidesPerView: 3
});