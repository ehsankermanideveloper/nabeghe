function _initSwiper() {
    if (document.querySelector('.single-swiper-slider')) {
        new Swiper('.single-swiper-slider', {
            spaceBetween: 20, slidesPerView: 1, loop: true,
            effect: 'creative',
            creativeEffect: { prev: { shadow: true, translate: [0, 0, -400] }, next: { translate: ['100%', 0, 0] } },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            pagination: { el: '.swiper-pagination' },
            autoplay: { delay: 3500, disableOnInteraction: false },
        });
    }

    if (document.querySelector('.col3-swiper-slider')) {
        new Swiper('.col3-swiper-slider', {
            spaceBetween: 20,
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: { 992: { slidesPerView: 3 }, 576: { slidesPerView: 2 }, 0: { slidesPerView: 1 } },
        });
    }

    if (document.querySelector('.col4-swiper-slider')) {
        new Swiper('.col4-swiper-slider', {
            spaceBetween: 20,
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: { 992: { slidesPerView: 4 }, 768: { slidesPerView: 3 }, 480: { slidesPerView: 2 }, 0: { slidesPerView: 1 } },
        });
    }

    if (document.querySelector('.auto-swiper-slider')) {
        new Swiper('.auto-swiper-slider', {
            slidesPerView: 'auto', spaceBetween: 30,
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        });
    }

    if (document.querySelector('.card-swiper-slider')) {
        new Swiper('.card-swiper-slider', {
            effect: 'cards', grabCursor: true,
            autoplay: { delay: 3000 },
            cardsEffect: { rotate: 50, slideShadows: false },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _initSwiper);
} else {
    _initSwiper();
}
