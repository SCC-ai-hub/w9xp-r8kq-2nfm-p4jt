// fancybox-override.js - настройки Fancybox для iframe

// Переменные для отступов (меняй здесь)
// Все значения в относительных единицах (vw, vh, %)
const FANCYBOX_MARGIN = {
    top: '10vh',      // отступ сверху
    bottom: '10vh',   // отступ снизу
    left: '10vw',    // отступ слева
    right: '10vw'    // отступ справа
};

Fancybox.defaults.hideScrollbar = false;

// Функция для применения кастомных настроек
function initFancyboxIframe() {
    if (typeof Fancybox !== 'undefined') {
					Fancybox.defaults.idle = false;
        // Применяем CSS-переменные для отступов
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --fancybox-margin-top: ${FANCYBOX_MARGIN.top};
                --fancybox-margin-bottom: ${FANCYBOX_MARGIN.bottom};
                --fancybox-margin-left: ${FANCYBOX_MARGIN.left};
                --fancybox-margin-right: ${FANCYBOX_MARGIN.right};
            }
        `;
        document.head.appendChild(style);
        
        // Основные настройки
        Fancybox.defaults.iframeAttr = {
            allow: 'autoplay; fullscreen',
            scrolling: 'auto',
            frameborder: '0'

        };
        
        Fancybox.defaults.Html = {
            defaultDisplay: 'block'
        };
    }
}

function getCurrentLanguage() {
    var radioEn = document.getElementById('lang-en');
    var radioIt = document.getElementById('lang-it');

    if (radioEn && radioEn.checked) {
        return 'en';
    }

    if (radioIt && radioIt.checked) {
        return 'it';
    }

    return localStorage.getItem('selectedLanguage') || 'it';
}

function initBioFancybox() {
    if (typeof Fancybox === 'undefined') {
        return;
    }

    Fancybox.bind('[data-fancybox="bio"]', {
        type: 'iframe',
        iframe: {
            preload: false,
            css: {
                width: 'min(66vw, calc(61.5vh * 16 / 9))',
                height: 'min(83.025vh, calc(66vw * 243 / 320))'
            }
        },
        animated: true,
        showClass: 'f-zoomInUp',
        hideClass: 'f-zoomOutDown',
        closeButton: false,
        dragToClose: true,
        Toolbar: {
            display: {
                left: [],
                middle: [],
                right: []
            }
        },
        beforeShow: function (fancybox, slide) {
            if (!slide || !slide.src) {
                return;
            }

            var currentLang = getCurrentLanguage();
            var url = new URL(slide.src, window.location.href);
            url.searchParams.set('lang', currentLang);
            slide.src = url.toString();
        },
        on: {
            done: function (fancybox) {
                ensureBioIframeCloseButton(fancybox);
            },
            reveal: function (fancybox) {
                ensureBioIframeCloseButton(fancybox);
            }
        }
    });
}

function ensureBioIframeCloseButton(fancybox) {
    if (!fancybox) {
        fancybox = Fancybox.getInstance();
    }

    if (!fancybox) {
        return;
    }

    var slide = fancybox.getSlide();
    var content = slide && slide.el ? slide.el.querySelector('.fancybox__content') : null;

    if (!content || content.querySelector('.bio-iframe-close')) {
        return;
    }

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'bio-iframe-close';
    button.setAttribute('aria-label', 'Close');
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7 L17 17 M17 7 L7 17" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';

    button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        fancybox.close();
    });

    content.appendChild(button);
}

var bioImageGalleries = [
    {
        fancyboxGroup: 'bio-photos',
        mainClass: 'bio-photos-gallery',
        getItems: function () { return window.BIO_PHOTOS; },
        folder: 'BIO/photos/',
        triggerSelector: '.bio-item--photos',
        containerId: 'bio-photos-gallery',
        initialized: false
    },
    {
        fancyboxGroup: 'bio-documents',
        mainClass: 'bio-documents-gallery',
        getItems: function () { return window.BIO_DOCUMENTS; },
        folder: 'BIO/documents/',
        triggerSelector: '.bio-item--documents',
        containerId: 'bio-documents-gallery',
        initialized: false
    },
    {
        fancyboxGroup: 'bio-press',
        mainClass: 'bio-press-gallery',
        getItems: function () { return window.BIO_PRESS; },
        folder: 'BIO/press/',
        triggerSelector: '.bio-item--press',
        containerId: 'bio-press-gallery',
        initialized: false
    }
];

function getBioGalleryCaption(slide, items) {
    if (!slide) {
        return '';
    }

    var lang = getCurrentLanguage();
    var el = slide.triggerEl || slide.el;

    if (el && el.dataset) {
        var fromDataset = lang === 'en'
            ? (el.dataset.captionEn || '')
            : (el.dataset.captionIt || '');

        if (fromDataset) {
            return fromDataset;
        }
    }

    if (items && items[slide.index] != null) {
        return lang === 'en'
            ? items[slide.index].captionEn
            : items[slide.index].captionIt;
    }

    return '';
}

function applyBioGalleryItemData(anchor, item, folder) {
    var itemPath = folder + item.file;
    anchor.href = itemPath;
    anchor.setAttribute('data-thumb-src', itemPath);
    anchor.dataset.captionIt = item.captionIt;
    anchor.dataset.captionEn = item.captionEn;
    anchor.setAttribute('data-caption', item.captionIt);
}

function buildBioImageGallery(config) {
    var items = config.getItems();
    var trigger = document.querySelector(config.triggerSelector);
    var container = document.getElementById(config.containerId);

    if (!items || !items.length || !trigger || !container) {
        return;
    }

    applyBioGalleryItemData(trigger, items[0], config.folder);

    container.innerHTML = '';

    for (var i = 1; i < items.length; i++) {
        var link = document.createElement('a');
        link.setAttribute('data-fancybox', config.fancyboxGroup);
        applyBioGalleryItemData(link, items[i], config.folder);
        container.appendChild(link);
    }
}

function getActiveBioImageGalleryConfig() {
    var fancybox = Fancybox.getInstance();
    if (!fancybox || !fancybox.container) {
        return null;
    }

    for (var i = 0; i < bioImageGalleries.length; i++) {
        if (fancybox.container.classList.contains(bioImageGalleries[i].mainClass)) {
            return bioImageGalleries[i];
        }
    }

    return null;
}

function ensureBioImageCloseButton(content, fancybox) {
    if (!content || content.querySelector('.bio-image-close')) {
        return;
    }

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'bio-image-close';
    button.setAttribute('aria-label', 'Close');
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7 L17 17 M17 7 L7 17" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';

    button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        fancybox.close();
    });

    content.appendChild(button);
}

function ensureBioGalleryCaptionHost(fancybox) {
    if (!fancybox || !fancybox.container) {
        return null;
    }

    var host = fancybox.container.querySelector('.bio-gallery-caption');
    if (host) {
        return host;
    }

    host = document.createElement('div');
    host.className = 'bio-gallery-caption';
    host.setAttribute('aria-live', 'polite');
    fancybox.container.appendChild(host);
    return host;
}

function positionBioImageGalleryCaption(fancybox) {
    /* Caption host lives on the container; CSS anchors it above thumbs. */
    ensureBioGalleryCaptionHost(fancybox);
}

function getActiveBioCaptionEl(fancybox) {
    return ensureBioGalleryCaptionHost(fancybox);
}

function refreshBioImageGalleryCaption() {
    var config = getActiveBioImageGalleryConfig();
    if (!config) {
        return;
    }

    var fancybox = Fancybox.getInstance();
    var slide = fancybox.getSlide();
    var captionEl = getActiveBioCaptionEl(fancybox);
    var items = config.getItems();

    if (captionEl && slide) {
        var text = getBioGalleryCaption(slide, items) || '';
        captionEl.textContent = text;
        captionEl.style.display = text ? '' : 'none';

        var triggerEl = slide.triggerEl || slide.el;
        if (triggerEl) {
            triggerEl.setAttribute('data-caption', text);
        }
    }

    layoutBioImageGalleryChrome(fancybox);
}

function layoutBioImageGalleryChrome(fancybox) {
    if (!fancybox || !fancybox.container) {
        fancybox = Fancybox.getInstance();
    }

    if (!fancybox || !fancybox.container) {
        return;
    }

    var slide = fancybox.getSlide();
    if (!slide || !slide.el) {
        return;
    }

    var content = slide.el.querySelector('.fancybox__content');
    ensureBioImageCloseButton(content, fancybox);
    positionBioImageGalleryCaption(fancybox);
}

function scheduleBioImageGalleryChrome(fancybox) {
    layoutBioImageGalleryChrome(fancybox);
    requestAnimationFrame(function () {
        layoutBioImageGalleryChrome(fancybox);
        requestAnimationFrame(function () {
            layoutBioImageGalleryChrome(fancybox);
        });
    });
}

function initBioImageGalleryFancybox(config) {
    if (typeof Fancybox === 'undefined') {
        return;
    }

    if (!document.querySelector('[data-fancybox="' + config.fancyboxGroup + '"]')) {
        return;
    }

    var items = config.getItems();

    Fancybox.bind('[data-fancybox="' + config.fancyboxGroup + '"]', {
        mainClass: config.mainClass,
        animated: true,
        showClass: 'f-zoomInUp',
        hideClass: 'f-zoomOutDown',
        closeButton: false,
        dragToClose: true,
        Toolbar: {
            display: {
                left: [],
                middle: [],
                right: []
            }
        },
        Images: {
            zoom: false,
            Panzoom: {
                click: false,
                dblClick: false,
                wheel: false,
                zoom: false,
                pinchToZoom: false,
                maxScale: 1
            }
        },
        Carousel: {
            infinite: false,
            formatCaption: function (carousel, slide) {
                return getBioGalleryCaption(slide, items);
            }
        },
        Thumbs: {
            showOnStart: true,
            type: 'modern'
        },
        caption: function (fancybox, slide) {
            return getBioGalleryCaption(slide, items);
        },
        on: {
            'Carousel.change': function (fancybox) {
                refreshBioImageGalleryCaption();
                scheduleBioImageGalleryChrome(fancybox);
            },
            done: function (fancybox) {
                refreshBioImageGalleryCaption();
                scheduleBioImageGalleryChrome(fancybox);
            },
            reveal: function (fancybox) {
                scheduleBioImageGalleryChrome(fancybox);
            }
        }
    });
}

function bindBioImageGalleriesLangSync() {
    var radioIt = document.getElementById('lang-it');
    var radioEn = document.getElementById('lang-en');

    if (!radioIt || !radioEn) {
        return;
    }

    radioIt.addEventListener('change', refreshBioImageGalleryCaption);
    radioEn.addEventListener('change', refreshBioImageGalleryCaption);
}

var bioImageGalleriesLangSyncBound = false;

function initBioImageGalleries() {
    for (var i = 0; i < bioImageGalleries.length; i++) {
        var config = bioImageGalleries[i];

        if (config.initialized) {
            continue;
        }

        buildBioImageGallery(config);

        if (!document.querySelector('[data-fancybox="' + config.fancyboxGroup + '"]')) {
            continue;
        }

        initBioImageGalleryFancybox(config);
        config.initialized = true;
    }

    if (!bioImageGalleriesLangSyncBound) {
        bindBioImageGalleriesLangSync();
        bioImageGalleriesLangSyncBound = true;
    }
}

var questionsVideoFancyboxBound = false;

function setMediaOverlayChrome(active) {
    document.body.classList.toggle('is-media-overlay', !!active);
}

var questionsVideoFancyboxOptions = {
    mainClass: 'questions-video-gallery',
    closeButton: false,
    dragToClose: false,
    animated: true,
    Html: {
        videoAutoplay: false
    },
    Carousel: {
        infinite: false,
        preload: 0
    },
    on: {
        done: function (fancybox) {
            setMediaOverlayChrome(true);
            activateQuestionsVideoSlide(fancybox);
        },
        'Carousel.change': function (fancybox) {
            activateQuestionsVideoSlide(fancybox);
        },
        closing: function (fancybox, slide) {
            setMediaOverlayChrome(false);
            teardownQuestionsVideo(slide);
        },
        destroy: function (fancybox) {
            setMediaOverlayChrome(false);
            if (!fancybox || !fancybox.container) {
                return;
            }

            fancybox.container.querySelectorAll('video').forEach(function (video) {
                video.pause();
                video.removeAttribute('src');
                video.load();
            });
        }
    }
};

function pauseAllQuestionsVideos(fancybox) {
    if (!fancybox || !fancybox.container) {
        return;
    }

    fancybox.container.querySelectorAll('video').forEach(function (video) {
        video.pause();

        if (video._questionsEndedHandler) {
            video.removeEventListener('ended', video._questionsEndedHandler);
            video._questionsEndedHandler = null;
        }

        video._questionsStarted = false;
    });
}

function ensureQuestionsVideoCloseButton(content, fancybox) {
    if (!content) {
        return;
    }

    var video = content.querySelector('video');

    if (!video) {
        return;
    }

    var frame = content.querySelector('.questions-video-frame');

    if (!frame) {
        frame = document.createElement('div');
        frame.className = 'questions-video-frame';
        video.parentNode.insertBefore(frame, video);
        frame.appendChild(video);
    }

    if (frame.querySelector('.questions-video-close')) {
        return;
    }

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'questions-video-close';
    button.setAttribute('aria-label', 'Close video');

    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7 L17 17 M17 7 L7 17" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';

    button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        fancybox.close();
    });

    frame.appendChild(button);
}

function activateQuestionsVideoSlide(fancybox) {
    if (!fancybox || !fancybox.container) {
        return;
    }

    pauseAllQuestionsVideos(fancybox);

    var slide = fancybox.getSlide();

    if (!slide || !slide.el) {
        return;
    }

    var content = slide.el.querySelector('.fancybox__content');

    if (content) {
        ensureQuestionsVideoCloseButton(content, fancybox);
    }

    var videos = slide.el.querySelectorAll('video');

    if (!videos.length) {
        return;
    }

    for (var i = 1; i < videos.length; i++) {
        videos[i].pause();
        videos[i].removeAttribute('src');
        videos[i].load();
        videos[i].remove();
    }

    var video = videos[0];

    video.pause();
    video.currentTime = 0;
    video.muted = false;
    video.defaultMuted = false;
    video.controls = false;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.removeAttribute('autoplay');
    video._questionsStarted = true;

    video._questionsEndedHandler = function () {
        fancybox.close();
    };

    video.addEventListener('ended', video._questionsEndedHandler, { once: true });
    video.play().catch(function () {});
}

function teardownQuestionsVideo(slide) {
    if (!slide || !slide.el) {
        return;
    }

    var video = slide.el.querySelector('video');

    if (!video) {
        return;
    }

    video.pause();
    video._questionsStarted = false;

    if (video._questionsEndedHandler) {
        video.removeEventListener('ended', video._questionsEndedHandler);
        video._questionsEndedHandler = null;
    }
}

function getQuestionsVideoSlides() {
    var links = document.querySelectorAll('[data-questions-video]');
    var slides = [];

    links.forEach(function (link) {
        slides.push({
            src: link.getAttribute('href'),
            type: 'html5video'
        });
    });

    return slides;
}

function openQuestionsVideo(clickedLink) {
    if (typeof Fancybox === 'undefined' || !clickedLink) {
        return;
    }

    var links = Array.prototype.slice.call(document.querySelectorAll('[data-questions-video]'));
    var slides = getQuestionsVideoSlides();
    var startIndex = links.indexOf(clickedLink);

    if (!slides.length) {
        return;
    }

    var activeInstance = Fancybox.getInstance();

    if (activeInstance) {
        activeInstance.close();
    }

    Fancybox.show(slides, Object.assign({}, questionsVideoFancyboxOptions, {
        startIndex: startIndex >= 0 ? startIndex : 0
    }));
}

function initQuestionsVideoFancybox() {
    if (typeof Fancybox === 'undefined') {
        return;
    }

    if (questionsVideoFancyboxBound) {
        return;
    }

    var links = document.querySelectorAll('[data-questions-video]');

    if (!links.length) {
        return;
    }

    questionsVideoFancyboxBound = true;

    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            openQuestionsVideo(link);
        });
    });
}

var filmsVideoFancyboxBound = false;

var filmsVideoFancyboxOptions = {
    mainClass: 'films-video-gallery',
    closeButton: false,
    dragToClose: false,
    animated: true,
    Html: {
        videoAutoplay: false
    },
    Carousel: {
        infinite: false,
        preload: 0
    },
    on: {
        done: function (fancybox) {
            setMediaOverlayChrome(true);
            activateFilmsVideoSlide(fancybox);
        },
        'Carousel.change': function (fancybox) {
            activateFilmsVideoSlide(fancybox);
        },
        closing: function (fancybox, slide) {
            setMediaOverlayChrome(false);
            teardownFilmsVideo(slide);
        },
        destroy: function (fancybox) {
            setMediaOverlayChrome(false);
            if (!fancybox || !fancybox.container) {
                return;
            }

            fancybox.container.querySelectorAll('video').forEach(function (video) {
                video.pause();
                video.removeAttribute('src');
                video.load();
            });
        }
    }
};

function pauseAllFilmsVideos(fancybox) {
    if (!fancybox || !fancybox.container) {
        return;
    }

    fancybox.container.querySelectorAll('video').forEach(function (video) {
        video.pause();
        video._filmsStarted = false;
    });
}

function ensureFilmsVideoCloseButton(content, fancybox) {
    if (!content) {
        return;
    }

    var video = content.querySelector('video');

    if (!video) {
        return;
    }

    var frame = content.querySelector('.films-video-frame');

    if (!frame) {
        frame = document.createElement('div');
        frame.className = 'films-video-frame';
        video.parentNode.insertBefore(frame, video);
        frame.appendChild(video);
    }

    if (frame.querySelector('.films-video-close')) {
        return;
    }

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'films-video-close';
    button.setAttribute('aria-label', 'Close video');
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7 L17 17 M17 7 L7 17" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';

    button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        fancybox.close();
    });

    frame.appendChild(button);
}

function activateFilmsVideoSlide(fancybox) {
    if (!fancybox || !fancybox.container) {
        return;
    }

    pauseAllFilmsVideos(fancybox);

    var slide = fancybox.getSlide();

    if (!slide || !slide.el) {
        return;
    }

    var content = slide.el.querySelector('.fancybox__content');

    if (content) {
        ensureFilmsVideoCloseButton(content, fancybox);
    }

    var videos = slide.el.querySelectorAll('video');

    if (!videos.length) {
        return;
    }

    for (var i = 1; i < videos.length; i++) {
        videos[i].pause();
        videos[i].removeAttribute('src');
        videos[i].load();
        videos[i].remove();
    }

    var video = videos[0];

    video.pause();
    video.currentTime = 0;
    video.muted = false;
    video.defaultMuted = false;
    video.controls = false;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.removeAttribute('autoplay');
    video._filmsStarted = true;
    video.play().catch(function () {});
}

function teardownFilmsVideo(slide) {
    if (!slide || !slide.el) {
        return;
    }

    var video = slide.el.querySelector('video');

    if (!video) {
        return;
    }

    video.pause();
    video._filmsStarted = false;
}

function getFilmsVideoSlides() {
    var links = document.querySelectorAll('[data-films-video]');
    var slides = [];

    links.forEach(function (link) {
        slides.push({
            src: link.getAttribute('href'),
            type: 'html5video'
        });
    });

    return slides;
}

function openFilmsVideo(clickedLink) {
    if (typeof Fancybox === 'undefined' || !clickedLink) {
        return;
    }

    var links = Array.prototype.slice.call(document.querySelectorAll('[data-films-video]'));
    var slides = getFilmsVideoSlides();
    var startIndex = links.indexOf(clickedLink);

    if (!slides.length) {
        return;
    }

    var activeInstance = Fancybox.getInstance();

    if (activeInstance) {
        activeInstance.close();
    }

    Fancybox.show(slides, Object.assign({}, filmsVideoFancyboxOptions, {
        startIndex: startIndex >= 0 ? startIndex : 0
    }));
}

function initFilmsVideoFancybox() {
    if (typeof Fancybox === 'undefined') {
        return;
    }

    if (filmsVideoFancyboxBound) {
        return;
    }

    var links = document.querySelectorAll('[data-films-video]');

    if (!links.length) {
        return;
    }

    filmsVideoFancyboxBound = true;

    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            openFilmsVideo(link);
        });
    });
}

function initBooksFancybox() {
    if (typeof Fancybox === 'undefined') {
        return;
    }

    if (!document.querySelector('[data-fancybox="books"]')) {
        return;
    }

    Fancybox.bind('[data-fancybox="books"]', {
        mainClass: 'books-gallery',
        closeButton: true,
        dragToClose: true,
        animated: true
    });
}

function initArtworksFancybox() {
    if (typeof Fancybox === 'undefined') {
        return;
    }

    if (!document.querySelector('[data-fancybox^="artwork-"]')) {
        return;
    }

    /* Unique data-fancybox values → one image, no carousel / next-prev */
    Fancybox.bind('[data-fancybox^="artwork-"]', {
        mainClass: 'artworks-lightbox',
        groupAll: false,
        closeButton: true,
        dragToClose: true,
        animated: true,
        Carousel: {
            Navigation: false
        },
        Toolbar: {
            display: {
                left: [],
                middle: [],
                right: ['close']
            }
        },
        keyboard: {
            Escape: 'close',
            Delete: 'close',
            Backspace: 'close',
            PageUp: false,
            PageDown: false,
            ArrowUp: false,
            ArrowDown: false,
            ArrowRight: false,
            ArrowLeft: false
        }
    });
}

function initFancybox() {
    initFancyboxIframe();
    initBioFancybox();
    initBioImageGalleries();
    initQuestionsVideoFancybox();
    initFilmsVideoFancybox();
    initBooksFancybox();
    initArtworksFancybox();
}

document.addEventListener('DOMContentLoaded', initFancybox);

if (typeof Fancybox !== 'undefined') {
    initFancybox();
}

