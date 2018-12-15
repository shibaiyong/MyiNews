

//  type:   轮播图的类型

//  options:轮播图的配置项
$.fn.creatCarousel = function(type,options,data){
    var galleryThumbs = null;
    var thumbs = null;
    var str = '';
    for(var i = 0; i < data.length; i++){
        str += '<div class="swiper-slide"><img src="'+ data[i] + '"/></div>'
    }
    $('.swiper-wrapper').html(str);
    if(type){
        galleryThumbs = new Swiper('.gallery-thumbs', {
            spaceBetween: 10,
            slidesPerView: options.slidesPerView,
            // loop: true,
            freeMode: true,
            //loopedSlides: 5, //looped slides should be the same
            watchSlidesVisibility: true
            // watchSlidesProgress: true,
        });
        thumbs = {
            swiper: galleryThumbs
        }
    }
    var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 10,
        // loop:true,
        // loopedSlides: 5, //looped slides should be the same
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs:thumbs
    });
}