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
                width: 'min(52.8vw, calc(49.2vh * 16 / 9))',
                height: 'min(calc((83.025vh + 100vh) / 2 + 100px), calc((52.8vw * 243 / 320 + 100vh) / 2 + 100px))'
            }
        },
        animated: true,
        showClass: 'f-zoomInUp',
        hideClass: 'f-zoomOutDown',
        closeButton: false,
        dragToClose: true,
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

/* In-memory only — resets when leaving bio_index (navigation / reload). */
var bioGalleryResumeIndex = {};

function rememberBioGalleryIndex(config, fancybox) {
    if (!config || !fancybox || typeof fancybox.getSlide !== 'function') {
        return;
    }
    var slide = fancybox.getSlide();
    if (!slide) {
        return;
    }
    var index = typeof slide.index === 'number' ? slide.index : -1;
    if (index < 0 && typeof slide.bioIndex === 'number') {
        index = slide.bioIndex;
    }
    if (index < 0) {
        return;
    }
    bioGalleryResumeIndex[config.fancyboxGroup] = index;
}

function escapeBioCaptionHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function getBioGalleryCaptionMeta(slide, items) {
    var empty = { text: '', ai: false, aiId: '' };
    if (!slide) {
        return empty;
    }

    var lang = getCurrentLanguage();
    var itemIndex = typeof slide.bioIndex === 'number' ? slide.bioIndex : slide.index;
    var item = items && items[itemIndex] != null ? items[itemIndex] : null;

    var text = '';
    if (slide.captionEn != null || slide.captionIt != null) {
        text = lang === 'en' ? (slide.captionEn || '') : (slide.captionIt || '');
    } else {
        var el = slide.triggerEl || slide.el;
        if (el && el.dataset) {
            text = lang === 'en'
                ? (el.dataset.captionEn || '')
                : (el.dataset.captionIt || '');
        }
        if (!text && item) {
            text = lang === 'en' ? (item.captionEn || '') : (item.captionIt || '');
        }
    }

    var ai = false;
    var aiId = '';
    if (item) {
        if (lang === 'en' && item.aiTranslatedEn) {
            ai = true;
            aiId = item.aiIdEn || '';
        } else if (lang === 'it' && item.aiTranslatedIt) {
            ai = true;
            aiId = item.aiIdIt || '';
        }
    } else if (slide) {
        if (lang === 'en' && slide.aiTranslatedEn) {
            ai = true;
            aiId = slide.aiIdEn || '';
        } else if (lang === 'it' && slide.aiTranslatedIt) {
            ai = true;
            aiId = slide.aiIdIt || '';
        }
    }

    return { text: text || '', ai: ai, aiId: aiId };
}

function getBioGalleryCaption(slide, items) {
    return getBioGalleryCaptionMeta(slide, items).text;
}

function applyBioGalleryItemData(anchor, item, folder, index, group) {
    var itemPath = folder + item.file;
    var anchorId = group + '-' + index;
    anchor.href = itemPath;
    anchor.id = anchorId;
    anchor.setAttribute('data-bio-index', String(index));
    anchor.setAttribute('data-bio-anchor', anchorId);
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

    /* Card is a manual opener — strip Fancybox auto-bind attrs */
    trigger.removeAttribute('data-fancybox');
    applyBioGalleryItemData(trigger, items[0], config.folder, 0, config.fancyboxGroup);

    container.innerHTML = '';

    for (var i = 0; i < items.length; i++) {
        var link = document.createElement('a');
        link.hidden = true;
        applyBioGalleryItemData(link, items[i], config.folder, i, config.fancyboxGroup);
        container.appendChild(link);
    }
}

function buildBioGallerySlides(config) {
    var items = config.getItems() || [];
    var slides = [];

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var src = config.folder + item.file;
        slides.push({
            src: src,
            type: 'image',
            thumbSrc: src,
            captionIt: item.captionIt,
            captionEn: item.captionEn,
            aiTranslatedIt: !!item.aiTranslatedIt,
            aiTranslatedEn: !!item.aiTranslatedEn,
            aiIdIt: item.aiIdIt || '',
            aiIdEn: item.aiIdEn || '',
            bioIndex: i,
            bioAnchor: config.fancyboxGroup + '-' + i
        });
    }

    return slides;
}

function openBioImageGallery(config, startIndex) {
    if (typeof Fancybox === 'undefined' || !config) {
        return;
    }

    var slides = buildBioGallerySlides(config);
    if (!slides.length) {
        return;
    }

    var index = typeof startIndex === 'number' ? startIndex : 0;
    if (index < 0 || index >= slides.length) {
        index = 0;
    }

    var active = Fancybox.getInstance();
    if (active) {
        active.close();
    }

    var items = config.getItems();

    Fancybox.show(slides, {
        mainClass: config.mainClass,
        startIndex: index,
        animated: true,
        showClass: 'f-zoomInUp',
        hideClass: 'f-zoomOutDown',
        closeButton: false,
        dragToClose: false,
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
            showOnStart: true
        },
        caption: function (fancybox, slide) {
            return getBioGalleryCaption(slide, items);
        },
        on: {
            'Carousel.change': function (fancybox) {
                rememberBioGalleryIndex(config, fancybox);
                refreshBioImageGalleryCaption();
                layoutBioImageGalleryChrome(fancybox);
            },
            done: function (fancybox) {
                rememberBioGalleryIndex(config, fancybox);
                refreshBioImageGalleryCaption();
                layoutBioImageGalleryChrome(fancybox);
            },
            reveal: function (fancybox) {
                layoutBioImageGalleryChrome(fancybox);
            },
            closing: function (fancybox) {
                rememberBioGalleryIndex(config, fancybox);
            },
            destroy: function (fancybox) {
                rememberBioGalleryIndex(config, fancybox);
            }
        }
    });
}

function bindBioGalleryResumeTrigger(config) {
    var trigger = document.querySelector(config.triggerSelector);
    if (!trigger || trigger.getAttribute('data-bio-resume-bound') === '1') {
        return;
    }
    trigger.setAttribute('data-bio-resume-bound', '1');

    trigger.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var last = bioGalleryResumeIndex[config.fancyboxGroup];
        if (typeof last !== 'number' || last < 0) {
            last = 0;
        }

        openBioImageGallery(config, last);
    });
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
        var meta = getBioGalleryCaptionMeta(slide, items);
        var text = meta.text || '';
        if (text && meta.ai) {
            var idAttr = meta.aiId
                ? ' data-ai-id="' + escapeBioCaptionHtml(meta.aiId) + '"'
                : '';
            captionEl.innerHTML = '<span class="ai-translated"' + idAttr + '>'
                + escapeBioCaptionHtml(text).replace(/\r\n|\n|\r/g, '<br>')
                + '</span>';
        } else {
            captionEl.textContent = text;
        }
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
    unlockBioGalleryNav(fancybox);
}

function unlockBioGalleryNav(fancybox) {
    if (!fancybox || !fancybox.container) {
        return;
    }
    var buttons = fancybox.container.querySelectorAll('.fancybox__nav .f-button');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
        buttons[i].removeAttribute('disabled');
        buttons[i].classList.remove('is-disabled', 'disabled');
    }
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

        if (!document.querySelector(config.triggerSelector)) {
            continue;
        }

        if (!config.getItems() || !config.getItems().length) {
            continue;
        }

        bindBioGalleryResumeTrigger(config);
        config.initialized = true;
    }

    if (!bioImageGalleriesLangSyncBound) {
        bindBioImageGalleriesLangSync();
        bioImageGalleriesLangSyncBound = true;
    }
}

var questionsVideoFancyboxBound = false;

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
            activateQuestionsVideoSlide(fancybox);
        },
        'Carousel.change': function (fancybox) {
            activateQuestionsVideoSlide(fancybox);
        },
        closing: function (fancybox, slide) {
            teardownQuestionsVideo(slide);
        },
        destroy: function (fancybox) {
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
    initBooksFancybox();
    initArtworksFancybox();
}

document.addEventListener('DOMContentLoaded', initFancybox);

if (typeof Fancybox !== 'undefined') {
    initFancybox();
}

