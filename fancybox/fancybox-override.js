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
                width: 'min(42.24vw, calc(39.36vh * 16 / 9))',
                height: 'min(calc((83.025vh + 100vh) / 2 + 100px), calc((42.24vw * 243 / 320 + 100vh) / 2 + 100px))'
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

function galleryItemSrc(folder, file) {
    var full = String(folder || '') + String(file || '');
    return full.split('/').map(function (segment) {
        return segment === '' ? '' : encodeURIComponent(segment);
    }).join('/');
}

var bioImageGalleries = [
    {
        fancyboxGroup: 'artwork-alefbet',
        mainClass: 'artworks-gallery',
        getItems: function () {
            return (window.ALEFBET_IMAGES || []).filter(function (item) { return !item.hidden; });
        },
        folder: 'artworks/alefbet/',
        triggerSelector: '.artwork-item--alefbet',
        containerId: 'artwork-alefbet-gallery',
        initialized: false
    },
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
    },
    {
        fancyboxGroup: 'films-gallery',
        mainClass: 'artworks-gallery',
        getItems: function () { return window.FILMS_IMAGES; },
        folder: 'films/',
        triggerSelector: '.film-item--trigger',
        containerId: 'films-gallery',
        initialized: false
    },
    {
        fancyboxGroup: 'books-gallery',
        mainClass: 'artworks-gallery',
        getItems: function () { return window.BOOKS_IMAGES; },
        folder: 'books/',
        triggerSelector: '.book-item--trigger',
        containerId: 'books-gallery',
        openAtTriggerIndex: true,
        initialized: false
    }
];

/* Per-series galleries from artworks subfolders (not root cover JPGs). */
(function registerArtworkSeriesGalleries() {
    var seriesList = window.ARTWORKS_SERIES;
    if (!seriesList || !seriesList.length) {
        return;
    }
    for (var i = 0; i < seriesList.length; i++) {
        (function (series) {
            if (!series || !series.id || !series.folder || !series.images || !series.images.length) {
                return;
            }
            bioImageGalleries.push({
                fancyboxGroup: 'artwork-' + series.id,
                mainClass: series.fixedThumbs
                    ? 'artworks-gallery artworks-gallery--fixed-thumbs'
                    : 'artworks-gallery',
                getItems: function () { return series.images; },
                folder: series.folder,
                triggerSelector: '.artwork-item--' + series.id,
                containerId: 'artwork-' + series.id + '-gallery',
                fixedThumbs: !!series.fixedThumbs,
                initialized: false
            });
        })(seriesList[i]);
    }
})();

/* Soft resume: remember last index for next open (startIndex / one-shot jumpTo).
   Do NOT intercept Carousel.change — that raced reverse nav and stuck on one slide. */
var BIO_GALLERY_RESUME_KEY = 'bioGalleryResumeIndex';

function loadBioGalleryResumeIndex() {
    try {
        var raw = sessionStorage.getItem(BIO_GALLERY_RESUME_KEY);
        if (!raw) {
            return {};
        }
        var parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
        return {};
    }
}

var bioGalleryResumeIndex = loadBioGalleryResumeIndex();

function persistBioGalleryResumeIndex() {
    try {
        sessionStorage.setItem(BIO_GALLERY_RESUME_KEY, JSON.stringify(bioGalleryResumeIndex));
    } catch (e) {
        /* private mode / quota — keep in-memory only */
    }
}

function syncBioGalleryTriggerToIndex(config, index) {
    if (!config || index < 0) {
        return;
    }
    var items = config.getItems();
    if (!items || !items[index]) {
        return;
    }
    var triggers = document.querySelectorAll(config.triggerSelector);
    for (var i = 0; i < triggers.length; i++) {
        applyBioGalleryItemData(
            triggers[i],
            items[index],
            config.folder,
            index,
            config.fancyboxGroup,
            { skipId: true }
        );
    }
}

function rememberBioGalleryIndex(config, fancybox) {
    if (!config || !fancybox || typeof fancybox.getSlide !== 'function') {
        return;
    }
    var slide = fancybox.getSlide();
    if (!slide) {
        return;
    }
    var index = typeof slide.bioIndex === 'number' ? slide.bioIndex : -1;
    if (index < 0 && typeof slide.index === 'number') {
        index = slide.index;
    }
    if (index < 0) {
        return;
    }
    bioGalleryResumeIndex[config.fancyboxGroup] = index;
    persistBioGalleryResumeIndex();
    syncBioGalleryTriggerToIndex(config, index);
}

function clearBioCarouselTransitions(fancybox) {
    var carousel = fancybox && fancybox.carousel;
    if (!carousel) {
        return;
    }
    if (carousel.inTransition && carousel.inTransition.size && typeof carousel.clearTransitions === 'function') {
        carousel.clearTransitions();
    }
}

function forceBioGallerySlide(fancybox, index) {
    if (!fancybox || typeof index !== 'number' || index < 0) {
        return;
    }
    clearBioCarouselTransitions(fancybox);
    try {
        if (typeof fancybox.jumpTo === 'function') {
            fancybox.jumpTo(index);
            return;
        }
    } catch (e) { /* fall through */ }
    var carousel = fancybox.carousel;
    if (carousel && typeof carousel.slideTo === 'function') {
        carousel.slideTo(index, { friction: 0 });
    }
}

function getSavedBioGalleryIndex(config) {
    if (!config) {
        return 0;
    }
    var last = bioGalleryResumeIndex[config.fancyboxGroup];
    if (typeof last === 'number' && last >= 0) {
        return last;
    }
    if (typeof last === 'string' && last !== '' && !isNaN(Number(last))) {
        return Number(last);
    }
    var trigger = document.querySelector(config.triggerSelector);
    if (trigger) {
        var fromAttr = parseInt(trigger.getAttribute('data-bio-index'), 10);
        if (!isNaN(fromAttr) && fromAttr >= 0) {
            return fromAttr;
        }
    }
    return 0;
}

function escapeBioCaptionHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function getNoTranslationCaptionPlaceholder(lang) {
    var cfg = window.NO_TRANSLATION_CAPTIONS;
    if (!cfg || !cfg.SHOW) {
        return '';
    }
    return (lang === 'en' ? cfg.en : cfg.it) || '';
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

    text = String(text || '').trim();
    var placeholder = false;
    if (!text) {
        text = getNoTranslationCaptionPlaceholder(lang);
        placeholder = !!text;
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

    return { text: text || '', ai: ai, aiId: aiId, placeholder: placeholder };
}

function getBioGalleryCaption(slide, items) {
    return getBioGalleryCaptionMeta(slide, items).text;
}

function isGalleryVideoItem(item) {
    if (!item) {
        return false;
    }
    if (item.type === 'html5video') {
        return true;
    }
    return /\.(mp4|m4v|webm|mov)(\?|$)/i.test(item.file || '');
}

function applyBioGalleryItemData(anchor, item, folder, index, group, opts) {
    var itemPath = galleryItemSrc(folder, item.file);
    var thumbPath = item.poster
        ? galleryItemSrc(folder, item.poster)
        : itemPath;
    var anchorId = group + '-' + index;
    anchor.href = itemPath;
    if (!opts || !opts.skipId) {
        anchor.id = anchorId;
    } else {
        anchor.removeAttribute('id');
    }
    anchor.setAttribute('data-bio-index', String(index));
    anchor.setAttribute('data-bio-anchor', anchorId);
    anchor.setAttribute('data-thumb-src', thumbPath);
    anchor.dataset.captionIt = item.captionIt;
    anchor.dataset.captionEn = item.captionEn;
    anchor.setAttribute('data-caption', item.captionIt);
    if (isGalleryVideoItem(item)) {
        anchor.setAttribute('data-type', 'html5video');
        if (item.poster) {
            anchor.setAttribute('data-poster', thumbPath);
        }
    } else {
        anchor.removeAttribute('data-type');
        anchor.removeAttribute('data-poster');
    }
}

function buildBioImageGallery(config) {
    var items = config.getItems();
    var triggers = document.querySelectorAll(config.triggerSelector);
    var container = document.getElementById(config.containerId);

    if (!items || !items.length || !triggers.length || !container) {
        return;
    }

    /* Cards are manual openers — strip Fancybox auto-bind attrs */
    for (var t = 0; t < triggers.length; t++) {
        var trigger = triggers[t];
        trigger.removeAttribute('data-fancybox');

        var triggerIndex = parseInt(trigger.getAttribute('data-artwork-index'), 10);
        if (isNaN(triggerIndex) || triggerIndex < 0) {
            triggerIndex = config.openAtTriggerIndex ? t : 0;
        }
        if (triggerIndex >= items.length) {
            triggerIndex = 0;
        }

        applyBioGalleryItemData(
            trigger,
            items[triggerIndex],
            config.folder,
            triggerIndex,
            config.fancyboxGroup,
            { skipId: true }
        );
    }

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
        var src = galleryItemSrc(config.folder, item.file);
        var posterSrc = item.poster
            ? galleryItemSrc(config.folder, item.poster)
            : '';

        if (isGalleryVideoItem(item)) {
            slides.push({
                src: src,
                type: 'html5video',
                thumbSrc: posterSrc || src,
                poster: posterSrc,
                videoFormat: item.videoFormat || 'video/mp4',
                captionIt: item.captionIt,
                captionEn: item.captionEn,
                aiTranslatedIt: !!item.aiTranslatedIt,
                aiTranslatedEn: !!item.aiTranslatedEn,
                aiIdIt: item.aiIdIt || '',
                aiIdEn: item.aiIdEn || '',
                bioIndex: i,
                bioAnchor: config.fancyboxGroup + '-' + i
            });
            continue;
        }

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

function gallerySlidesIncludeVideo(slides) {
    for (var i = 0; i < slides.length; i++) {
        if (slides[i] && slides[i].type === 'html5video') {
            return true;
        }
    }
    return false;
}

function ensureArtworksFixedThumbs(fancybox, config) {
    if (!fancybox || !fancybox.container || !config || !config.fixedThumbs) {
        return;
    }

    var items = config.getItems() || [];
    var strip = fancybox.container.querySelector('.artworks-fixed-thumbs');

    if (!strip) {
        strip = document.createElement('div');
        strip.className = 'artworks-fixed-thumbs';
        strip.setAttribute('role', 'tablist');

        for (var i = 0; i < items.length; i++) {
            (function (index) {
                var item = items[index];
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'artworks-fixed-thumbs__btn';
                btn.setAttribute('role', 'tab');
                btn.setAttribute('aria-label', 'Slide ' + (index + 1));

                var thumbFile = item.poster || item.file;
                var img = document.createElement('img');
                img.src = galleryItemSrc(config.folder, thumbFile);
                img.alt = '';
                img.draggable = false;
                btn.appendChild(img);

                if (isGalleryVideoItem(item)) {
                    btn.classList.add('artworks-fixed-thumbs__btn--video');
                    var play = document.createElement('span');
                    play.className = 'artworks-fixed-thumbs__play';
                    play.setAttribute('aria-hidden', 'true');
                    play.innerHTML = artworkVideoPlaySvg();
                    btn.appendChild(play);
                }

                btn.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    forceBioGallerySlide(fancybox, index);
                });

                strip.appendChild(btn);
            })(i);
        }

        fancybox.container.appendChild(strip);
    }

    var slide = fancybox.getSlide();
    var active = slide && typeof slide.index === 'number' ? slide.index : 0;
    var buttons = strip.querySelectorAll('.artworks-fixed-thumbs__btn');
    for (var j = 0; j < buttons.length; j++) {
        var isActive = j === active;
        buttons[j].classList.toggle('is-active', isActive);
        buttons[j].setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
}

function updateVideoProgressBar(video) {
    if (!video || !video._progressFill) {
        return;
    }
    var duration = video.duration;
    var pct = (duration && isFinite(duration) && duration > 0)
        ? Math.min(100, Math.max(0, (video.currentTime / duration) * 100))
        : 0;
    video._progressFill.style.width = pct + '%';
}

/* Visible timeline only — no seek UI, no native controls / pause. */
function attachVideoProgressBar(video, frame) {
    if (!video || !frame) {
        return;
    }

    var bar = frame.querySelector('.video-progress');
    if (!bar) {
        bar = document.createElement('div');
        bar.className = 'video-progress';
        bar.setAttribute('aria-hidden', 'true');
        var fill = document.createElement('div');
        fill.className = 'video-progress__fill';
        bar.appendChild(fill);
        frame.appendChild(bar);
    }

    video._progressBar = bar;
    video._progressFill = bar.querySelector('.video-progress__fill');
    video.controls = false;

    if (!video._progressBound) {
        video._progressBound = true;

        var sync = function () {
            updateVideoProgressBar(video);
        };

        video.addEventListener('timeupdate', sync);
        video.addEventListener('loadedmetadata', sync);
        video.addEventListener('durationchange', sync);
        video.addEventListener('seeked', sync);
        video.addEventListener('ended', sync);

        /* Block accidental click-to-pause; keep controls off. */
        video.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
        });
    }

    updateVideoProgressBar(video);
}

function resetArtworkVideoFrame(frame) {
    if (!frame) {
        return;
    }
    var video = frame.querySelector('video');
    var playBtn = frame.querySelector('.artwork-video-play');
    var poster = frame.querySelector('.artwork-video-poster');
    var intro = frame.querySelector('.film-video-intro');
    frame.classList.remove('is-playing');
    if (playBtn) {
        playBtn.hidden = false;
    }
    if (intro) {
        intro.hidden = false;
        if (poster) {
            poster.hidden = true;
        }
    } else if (poster) {
        poster.hidden = false;
    }
    if (video) {
        video.pause();
        video.classList.add('is-poster-hidden');
        video.removeAttribute('hidden');
        try {
            video.currentTime = 0;
        } catch (e) { /* ignore */ }
        updateVideoProgressBar(video);
    }
}

function pauseInactiveArtworksGalleryVideos(fancybox) {
    if (!fancybox || !fancybox.container) {
        return;
    }
    var active = fancybox.getSlide();
    var activeEl = active && active.el ? active.el : null;
    var frames = fancybox.container.querySelectorAll('.artwork-video-frame');
    for (var i = 0; i < frames.length; i++) {
        var frame = frames[i];
        var slideEl = frame.closest('.fancybox__slide');
        if (slideEl && activeEl && slideEl === activeEl) {
            continue;
        }
        resetArtworkVideoFrame(frame);
    }
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
    var hasVideo = gallerySlidesIncludeVideo(slides);
    /* One-shot only — Fancybox 5.0.36 may ignore startIndex; never re-jump on change. */
    var resumeJumpPending = index > 0;

    function applyResumeJumpOnce(fancybox) {
        if (!resumeJumpPending) {
            return;
        }
        resumeJumpPending = false;
        forceBioGallerySlide(fancybox, index);
    }

    var fancyOptions = {
        mainClass: config.mainClass,
        startIndex: index,
        slug: config.fancyboxGroup,
        animated: true,
        showClass: 'f-zoomInUp',
        hideClass: 'f-zoomOutDown',
        closeButton: false,
        dragToClose: false,
        /* Thumbs/nav sit above the slide (z-index); backdrop close is safe again. */
        backdropClick: 'close',
        contentClick: false,
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
            initialPage: index,
            formatCaption: function (carousel, slide) {
                return getBioGalleryCaption(slide, items);
            }
        },
        Thumbs: config.fixedThumbs ? false : { showOnStart: true },
        caption: function (fancybox, slide) {
            return getBioGalleryCaption(slide, items);
        },
        on: {
            'Carousel.ready': function (fancybox) {
                applyResumeJumpOnce(fancybox);
            },
            'Carousel.change': function (fancybox) {
                pauseInactiveArtworksGalleryVideos(fancybox);
                rememberBioGalleryIndex(config, fancybox);
                refreshBioImageGalleryCaption();
                layoutBioImageGalleryChrome(fancybox);
                ensureArtworksFixedThumbs(fancybox, config);
            },
            done: function (fancybox) {
                applyResumeJumpOnce(fancybox);
                rememberBioGalleryIndex(config, fancybox);
                refreshBioImageGalleryCaption();
                layoutBioImageGalleryChrome(fancybox);
                ensureArtworksFixedThumbs(fancybox, config);
            },
            reveal: function (fancybox) {
                layoutBioImageGalleryChrome(fancybox);
                ensureArtworksFixedThumbs(fancybox, config);
            },
            shouldClose: function (fancybox) {
                resumeJumpPending = false;
                rememberBioGalleryIndex(config, fancybox);
            },
            close: function (fancybox) {
                resumeJumpPending = false;
                rememberBioGalleryIndex(config, fancybox);
                pauseInactiveArtworksGalleryVideos(fancybox);
            },
            destroy: function (fancybox) {
                resumeJumpPending = false;
                rememberBioGalleryIndex(config, fancybox);
            }
        }
    };

    if (hasVideo) {
        fancyOptions.Html = { videoAutoplay: false };
    }

    Fancybox.show(slides, fancyOptions);
}

function bindBioGalleryResumeTrigger(config) {
    var triggers = document.querySelectorAll(config.triggerSelector);
    if (!triggers.length) {
        return;
    }

    for (var i = 0; i < triggers.length; i++) {
        var trigger = triggers[i];
        if (trigger.getAttribute('data-bio-resume-bound') === '1') {
            continue;
        }
        trigger.setAttribute('data-bio-resume-bound', '1');

        (function (el) {
            el.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                var startIndex = 0;

                if (config.openAtTriggerIndex) {
                    var idx = parseInt(
                        el.getAttribute('data-artwork-index') || el.getAttribute('data-bio-index'),
                        10
                    );
                    if (!isNaN(idx) && idx >= 0) {
                        startIndex = idx;
                    }
                } else {
                    startIndex = getSavedBioGalleryIndex(config);
                }

                openBioImageGallery(config, startIndex);
            });
        })(trigger);
    }
}

function getActiveBioImageGalleryConfig() {
    var fancybox = Fancybox.getInstance();
    if (!fancybox || !fancybox.container) {
        return null;
    }

    /* Prefer matching by slide group — several galleries share mainClass CSS */
    var slide = typeof fancybox.getSlide === 'function' ? fancybox.getSlide() : null;
    var anchor = slide && slide.bioAnchor != null ? String(slide.bioAnchor) : '';
    if (anchor) {
        for (var i = 0; i < bioImageGalleries.length; i++) {
            var group = bioImageGalleries[i].fancyboxGroup;
            if (anchor === group || anchor.indexOf(group + '-') === 0) {
                return bioImageGalleries[i];
            }
        }
    }

    for (var j = 0; j < bioImageGalleries.length; j++) {
        if (fancybox.container.classList.contains(bioImageGalleries[j].mainClass)) {
            return bioImageGalleries[j];
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
    host.innerHTML =
        '<div class="bio-caption-body"></div>' +
        '<div class="bio-caption-scroll-btns" hidden>' +
        '<button type="button" class="bio-caption-scroll-btn bio-caption-scroll-up" aria-label="Scroll up">' +
        '<svg viewBox="0 0 24 14" aria-hidden="true"><path d="M3 10.5L12 3.5l9 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
        '<button type="button" class="bio-caption-scroll-btn bio-caption-scroll-down" aria-label="Scroll down">' +
        '<svg viewBox="0 0 24 14" aria-hidden="true"><path d="M3 3.5l9 7 9-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
        '</div>';

    var body = host.querySelector('.bio-caption-body');
    var btnUp = host.querySelector('.bio-caption-scroll-up');
    var btnDown = host.querySelector('.bio-caption-scroll-down');
    var step = function () {
        return Math.max(48, (body && body.clientHeight ? body.clientHeight : 120) * 0.55);
    };

    if (btnUp) {
        btnUp.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (!body) {
                return;
            }
            body.scrollBy({ top: -step(), behavior: 'smooth' });
            window.setTimeout(function () {
                updateBioCaptionScrollButtons(host);
            }, 220);
        });
    }
    if (btnDown) {
        btnDown.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (!body) {
                return;
            }
            body.scrollBy({ top: step(), behavior: 'smooth' });
            window.setTimeout(function () {
                updateBioCaptionScrollButtons(host);
            }, 220);
        });
    }
    if (body) {
        body.addEventListener('scroll', function () {
            updateBioCaptionScrollButtons(host);
        }, { passive: true });
    }

    fancybox.container.appendChild(host);
    return host;
}

function getBioCaptionBody(host) {
    if (!host) {
        return null;
    }
    return host.querySelector('.bio-caption-body') || host;
}

function updateBioCaptionScrollButtons(host) {
    if (!host) {
        return;
    }
    var body = getBioCaptionBody(host);
    var btns = host.querySelector('.bio-caption-scroll-btns');
    var btnUp = host.querySelector('.bio-caption-scroll-up');
    var btnDown = host.querySelector('.bio-caption-scroll-down');
    if (!body || !btns) {
        return;
    }

    /* Documents invite slides only — never show on fit/last/other galleries */
    if (!host.classList.contains('bio-docs-caption--invite')) {
        btns.hidden = true;
        return;
    }

    var canScroll = body.scrollHeight > body.clientHeight + 2;
    btns.hidden = !canScroll;
    if (!canScroll) {
        return;
    }
    var atTop = body.scrollTop <= 1;
    var atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 1;
    if (btnUp) {
        btnUp.classList.toggle('is-inactive', atTop);
        btnUp.disabled = atTop;
    }
    if (btnDown) {
        btnDown.classList.toggle('is-inactive', atBottom);
        btnDown.disabled = atBottom;
    }
}

function clearDocumentsCaptionMode(captionEl) {
    if (!captionEl) {
        return;
    }
    captionEl.classList.remove(
        'bio-docs-caption--fit',
        'bio-docs-caption--invite',
        'bio-docs-caption--last'
    );
}

function syncDocumentsCaptionReserve(container, mode) {
    if (!container) {
        return;
    }
    /* Keep photo↔caption gap equal to caption↔thumbs (CSS --bio-docs-chrome-gap) */
    if (mode === 'fit') {
        container.style.setProperty('--bio-docs-caption-h', 'var(--bio-docs-caption-h-fit)');
        container.style.setProperty('--bio-docs-photo-caption-gap', 'var(--bio-docs-chrome-gap)');
        return;
    }
    if (mode === 'invite') {
        container.style.setProperty('--bio-docs-caption-h', 'var(--bio-docs-caption-h-invite)');
        container.style.setProperty('--bio-docs-photo-caption-gap', 'var(--bio-docs-chrome-gap)');
        return;
    }
    if (mode === 'last') {
        container.style.setProperty('--bio-docs-caption-h', 'var(--bio-docs-caption-h-last)');
        container.style.setProperty('--bio-docs-photo-caption-gap', 'var(--bio-docs-chrome-gap)');
        return;
    }
    container.style.setProperty('--bio-docs-caption-h', '0px');
    container.style.setProperty('--bio-docs-photo-caption-gap', '0px');
}

/**
 * Documents caption modes by text length (not slide index):
 * short → fit (auto height); long multiline → invite (fixed box + ↑↓ scroll).
 * Photo size tokens set synchronously to avoid size jump on slide change.
 */
function documentsCaptionNeedsScroll(text) {
    if (!text) {
        return false;
    }
    /* Only true multi-paragraph captions (Sotheby invite, etc.) */
    return String(text).split(/\r\n|\n|\r/).length > 3;
}

function applyDocumentsCaptionMode(fancybox, captionEl, slideIndex, text) {
    var container = fancybox && fancybox.container;
    var btns = captionEl ? captionEl.querySelector('.bio-caption-scroll-btns') : null;

    clearDocumentsCaptionMode(captionEl);

    if (!text) {
        if (captionEl) {
            captionEl.style.display = 'none';
        }
        if (btns) {
            btns.hidden = true;
        }
        syncDocumentsCaptionReserve(container, 'none');
        return '';
    }

    captionEl.style.display = '';

    if (documentsCaptionNeedsScroll(text)) {
        captionEl.classList.add('bio-docs-caption--invite');
        syncDocumentsCaptionReserve(container, 'invite');
        window.requestAnimationFrame(function () {
            updateBioCaptionScrollButtons(captionEl);
        });
        return text;
    }

    captionEl.classList.add('bio-docs-caption--fit');
    if (btns) {
        btns.hidden = true;
    }
    syncDocumentsCaptionReserve(container, 'fit');
    return text;
}

/** After fit caption text is painted, shrink reserve to real height so photo reaches it. */
function syncDocumentsFitCaptionHeight(fancybox, captionEl) {
    var container = fancybox && fancybox.container;
    if (!container || !captionEl || !captionEl.classList.contains('bio-docs-caption--fit')) {
        return;
    }
    if (captionEl.style.display === 'none') {
        return;
    }
    var h = Math.ceil(captionEl.getBoundingClientRect().height);
    if (h > 0) {
        container.style.setProperty('--bio-docs-caption-h', h + 'px');
        container.style.setProperty('--bio-docs-photo-caption-gap', 'var(--bio-docs-chrome-gap)');
    }
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
    var body = getBioCaptionBody(captionEl);
    var items = config.getItems();
    var isDocuments = config.mainClass === 'bio-documents-gallery';

    if (captionEl && body && slide) {
        var meta = getBioGalleryCaptionMeta(slide, items);
        var text = meta.text || '';
        var slideIndex = typeof slide.bioIndex === 'number' ? slide.bioIndex : slide.index;

        if (isDocuments) {
            text = applyDocumentsCaptionMode(fancybox, captionEl, slideIndex, text);
        } else {
            clearDocumentsCaptionMode(captionEl);
        }

        if (text && meta.ai) {
            var idAttr = meta.aiId
                ? ' data-ai-id="' + escapeBioCaptionHtml(meta.aiId) + '"'
                : '';
            body.innerHTML = '<span class="ai-translated"' + idAttr + '>'
                + escapeBioCaptionHtml(text).replace(/\r\n|\n|\r/g, '<br>')
                + '</span>';
        } else if (text && meta.placeholder) {
            body.innerHTML = '<span class="no-translation-caption">'
                + escapeBioCaptionHtml(text).replace(/\r\n|\n|\r/g, '<br>')
                + '</span>';
        } else if (text) {
            body.textContent = text;
        } else {
            body.textContent = '';
        }

        if (!isDocuments) {
            captionEl.style.display = text ? '' : 'none';
            var otherBtns = captionEl.querySelector('.bio-caption-scroll-btns');
            if (otherBtns) {
                otherBtns.hidden = true;
            }
        } else if (text && captionEl.classList.contains('bio-docs-caption--invite')) {
            window.requestAnimationFrame(function () {
                updateBioCaptionScrollButtons(captionEl);
            });
        } else if (text && captionEl.classList.contains('bio-docs-caption--fit')) {
            window.requestAnimationFrame(function () {
                syncDocumentsFitCaptionHeight(fancybox, captionEl);
            });
        }

        body.scrollTop = 0;

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
    var isVideo = slide.type === 'html5video'
        || (slide.el && slide.el.classList.contains('has-html5video'));

    if (isVideo) {
        var posterSrc = slide.poster || slide.thumbSrc || '';
        ensureArtworkVideoChrome(content, fancybox, posterSrc, {
            closeButton: false,
            closeOnEnded: false
        });
    }

    ensureBioImageCloseButton(content, fancybox);
    positionBioImageGalleryCaption(fancybox);
    unlockBioGalleryNav(fancybox);

    var config = getActiveBioImageGalleryConfig();
    if (config && config.fixedThumbs) {
        ensureArtworksFixedThumbs(fancybox, config);
    }
}

function bindBioGalleryNavUnstick(fancybox) {
    if (!fancybox || !fancybox.container || fancybox.container._bioNavUnstick) {
        return;
    }
    fancybox.container._bioNavUnstick = true;
    fancybox.container.addEventListener('click', function (event) {
        var btn = event.target && event.target.closest
            ? event.target.closest('.fancybox__nav .f-button')
            : null;
        if (!btn) {
            return;
        }
        if (btn.disabled || btn.hasAttribute('disabled') || btn.classList.contains('is-disabled')) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        clearBioCarouselTransitions(fancybox);
    }, true);
}

function unlockBioGalleryNav(fancybox) {
    if (!fancybox || !fancybox.container) {
        return;
    }

    bindBioGalleryNavUnstick(fancybox);

    var slide = fancybox.getSlide ? fancybox.getSlide() : null;
    var index = slide && typeof slide.index === 'number' ? slide.index : 0;
    var total = 0;
    if (fancybox.carousel && fancybox.carousel.pages) {
        total = fancybox.carousel.pages.length;
    }

    var prev = fancybox.container.querySelector('.fancybox__nav .f-button.is-prev');
    var next = fancybox.container.querySelector('.fancybox__nav .f-button.is-next');

    if (prev) {
        if (index <= 0) {
            prev.disabled = true;
            prev.setAttribute('disabled', '');
            prev.classList.add('is-disabled');
        } else {
            prev.disabled = false;
            prev.removeAttribute('disabled');
            prev.classList.remove('is-disabled', 'disabled');
        }
    }

    if (next) {
        if (!total || index >= total - 1) {
            next.disabled = true;
            next.setAttribute('disabled', '');
            next.classList.add('is-disabled');
        } else {
            next.disabled = false;
            next.removeAttribute('disabled');
            next.classList.remove('is-disabled', 'disabled');
        }
    }
}

function syncFilmsGalleryNav(fancybox) {
    if (!fancybox || !fancybox.container) {
        return;
    }

    bindBioGalleryNavUnstick(fancybox);

    var slide = fancybox.getSlide ? fancybox.getSlide() : null;
    var index = slide && typeof slide.index === 'number' ? slide.index : 0;
    var total = 0;
    if (fancybox.carousel && fancybox.carousel.pages) {
        total = fancybox.carousel.pages.length;
    }

    var prev = fancybox.container.querySelector('.fancybox__nav .f-button.is-prev');
    var next = fancybox.container.querySelector('.fancybox__nav .f-button.is-next');

    if (prev) {
        if (index <= 0) {
            prev.disabled = true;
            prev.setAttribute('disabled', '');
            prev.classList.add('is-disabled');
        } else {
            prev.disabled = false;
            prev.removeAttribute('disabled');
            prev.classList.remove('is-disabled', 'disabled');
        }
    }

    if (next) {
        if (!total || index >= total - 1) {
            next.disabled = true;
            next.setAttribute('disabled', '');
            next.classList.add('is-disabled');
        } else {
            next.disabled = false;
            next.removeAttribute('disabled');
            next.classList.remove('is-disabled', 'disabled');
        }
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
    radioIt.addEventListener('change', refreshFilmsVideoIntroLang);
    radioEn.addEventListener('change', refreshFilmsVideoIntroLang);
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

function setVideoChromeHidden(hidden) {
    document.body.classList.toggle('video-chrome-hidden', !!hidden);
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
        init: function () {
            setVideoChromeHidden(true);
        },
        done: function (fancybox) {
            setVideoChromeHidden(true);
            activateQuestionsVideoSlide(fancybox);
        },
        'Carousel.change': function (fancybox) {
            activateQuestionsVideoSlide(fancybox);
        },
        /* Fancybox 5 has no "closing" emit — use shouldClose/close so chrome
           fades in from the first frame of backdrop fade-out. */
        shouldClose: function () {
            setVideoChromeHidden(false);
        },
        close: function (fancybox) {
            setVideoChromeHidden(false);
            teardownQuestionsVideo(fancybox && fancybox.getSlide ? fancybox.getSlide() : null);
        },
        destroy: function (fancybox) {
            setVideoChromeHidden(false);

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
        setVideoChromeHidden(false);
        fancybox.close();
    });

    frame.appendChild(button);
    attachVideoProgressBar(video, frame);
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
    var frame = slide.el.querySelector('.questions-video-frame');

    video.pause();
    video.currentTime = 0;
    video.muted = false;
    video.defaultMuted = false;
    video.controls = false;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.removeAttribute('autoplay');
    video._questionsStarted = true;

    if (frame) {
        attachVideoProgressBar(video, frame);
    }

    video._questionsEndedHandler = function () {
        setVideoChromeHidden(false);
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

/* Il grande domani — poster + gray play, then html5 video */
var artworkVideoFancyboxBound = false;

var artworkVideoFancyboxOptions = {
    mainClass: 'artwork-video-gallery',
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
            setupArtworkVideoSlide(fancybox);
        },
        close: function (fancybox) {
            teardownArtworkVideo(fancybox && fancybox.getSlide ? fancybox.getSlide() : null);
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

function artworkVideoPlaySvg() {
    return (
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="12" fill="currentColor" fill-opacity="0.42"/>' +
        '<path d="M9.1 7v10L18 12z" fill="#fff"/>' +
        '</svg>'
    );
}

function ensureArtworkVideoChrome(content, fancybox, posterSrc, opts) {
    if (!content) {
        return;
    }

    opts = opts || {};
    var showClose = opts.closeButton !== false;
    var closeOnEnded = opts.closeOnEnded !== false;

    var video = content.querySelector('video');
    if (!video) {
        return;
    }

    var framedNow = false;
    var frame = content.querySelector('.artwork-video-frame');
    if (!frame) {
        frame = document.createElement('div');
        frame.className = 'artwork-video-frame';
        video.parentNode.insertBefore(frame, video);
        frame.appendChild(video);
        framedNow = true;
    }

    video.controls = false;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.removeAttribute('autoplay');
    video.preload = 'auto';
    if (posterSrc) {
        video.setAttribute('poster', posterSrc);
    }

    /* Moving <video> in the DOM aborts media load — restart once after wrap. */
    if (framedNow && !video._artworkReloadAfterFrame) {
        video._artworkReloadAfterFrame = true;
        try {
            video.load();
        } catch (e) { /* ignore */ }
    }

    var poster = frame.querySelector('.artwork-video-poster');
    if (!poster && posterSrc) {
        poster = document.createElement('img');
        poster.className = 'artwork-video-poster';
        poster.src = posterSrc;
        poster.alt = '';
        poster.draggable = false;
        frame.insertBefore(poster, video);
    }

    if (!frame.classList.contains('is-playing')) {
        video.classList.add('is-poster-hidden');
    } else {
        video.classList.remove('is-poster-hidden');
    }

    attachVideoProgressBar(video, frame);

    var playBtn = frame.querySelector('.artwork-video-play');
    if (!playBtn) {
        playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.className = 'artwork-video-play';
        playBtn.setAttribute('aria-label', 'Play video');
        playBtn.innerHTML = artworkVideoPlaySvg();
        playBtn.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            var livePoster = frame.querySelector('.artwork-video-poster');
            var liveIntro = frame.querySelector('.film-video-intro');
            frame.classList.add('is-playing');
            playBtn.hidden = true;
            if (livePoster) {
                livePoster.hidden = true;
            }
            if (liveIntro) {
                liveIntro.hidden = true;
            }
            video.classList.remove('is-poster-hidden');
            video.removeAttribute('hidden');
            video.muted = false;
            video.defaultMuted = false;
            video.controls = false;
            updateVideoProgressBar(video);

            var start = function () {
                var p = video.play();
                if (p && typeof p.catch === 'function') {
                    p.catch(function () {
                        try {
                            video.load();
                        } catch (e2) { /* ignore */ }
                        video.play().catch(function () {});
                    });
                }
            };

            if (video.readyState < 2) {
                var onReady = function () {
                    video.removeEventListener('loadeddata', onReady);
                    video.removeEventListener('canplay', onReady);
                    start();
                };
                video.addEventListener('loadeddata', onReady);
                video.addEventListener('canplay', onReady);
                try {
                    video.load();
                } catch (e3) { /* ignore */ }
                start();
            } else {
                start();
            }
        });
        frame.appendChild(playBtn);
    }

    var closeBtn = frame.querySelector('.artwork-video-close');
    if (showClose) {
        if (!closeBtn) {
            closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'artwork-video-close';
            closeBtn.setAttribute('aria-label', 'Close video');
            closeBtn.innerHTML =
                '<svg viewBox="0 0 24 24" aria-hidden="true">' +
                '<path d="M7 7 L17 17 M17 7 L7 17" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
                '</svg>';
            closeBtn.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                fancybox.close();
            });
            frame.appendChild(closeBtn);
        }
    } else if (closeBtn) {
        closeBtn.remove();
    }

    if (video._artworkEndedHandler) {
        video.removeEventListener('ended', video._artworkEndedHandler);
        video._artworkEndedHandler = null;
    }

    video._artworkEndedHandler = function () {
        if (closeOnEnded) {
            fancybox.close();
            return;
        }
        resetArtworkVideoFrame(frame);
    };
    video.addEventListener('ended', video._artworkEndedHandler);
}

function fitFilmsVideoStage(video, frame, slide) {
    if (!frame) {
        return;
    }

    var content = frame.closest('.fancybox__content');
    if (content) {
        content.style.setProperty('aspect-ratio', 'auto', 'important');
        content.style.setProperty('width', 'auto', 'important');
        content.style.setProperty('height', 'auto', 'important');
    }

    var vw = slide && slide.videoW ? slide.videoW : (video && video.videoWidth);
    var vh = slide && slide.videoH ? slide.videoH : (video && video.videoHeight);
    if (!vw || !vh) {
        /* Readable stage for description intro before metadata loads */
        vw = 1280;
        vh = 720;
    }

    var arrowGap = 50;
    var maxW = Math.min(1280, Math.floor(window.innerWidth * 0.89));
    var maxH = Math.min(720, Math.floor(window.innerHeight * 0.9));

    var gallery = frame.closest('.films-video-gallery');
    var prevBtn = gallery ? gallery.querySelector('.fancybox__nav .f-button.is-prev') : null;
    var nextBtn = gallery ? gallery.querySelector('.fancybox__nav .f-button.is-next') : null;
    if (prevBtn && nextBtn) {
        var prevR = prevBtn.getBoundingClientRect();
        var nextR = nextBtn.getBoundingClientRect();
        var between = Math.floor(nextR.left - prevR.right - 2 * arrowGap);
        if (between > 160) {
            maxW = Math.min(maxW, between);
        }
    } else if (gallery) {
        var cs = window.getComputedStyle(gallery);
        var navSize = parseFloat(cs.getPropertyValue('--bio-nav-size')) || 0;
        var navInset = parseFloat(cs.getPropertyValue('--bio-nav-inset')) || 0;
        var byTokens = Math.floor(window.innerWidth - 2 * (navInset + navSize + arrowGap));
        if (byTokens > 160) {
            maxW = Math.min(maxW, byTokens);
        }
    }

    var scale = Math.min(maxW / vw, maxH / vh);
    var w = Math.max(1, Math.round(vw * scale));
    var h = Math.max(1, Math.round(vh * scale));

    frame.style.setProperty('width', w + 'px', 'important');
    frame.style.setProperty('height', h + 'px', 'important');
    return !!(video && (video.videoWidth || (slide && slide.videoW)));
}

function getFilmMetaBySrc(src) {
    var list = window.FILMS_IMAGES;
    if (!list || !list.length || !src) {
        return null;
    }
    var decoded = '';
    try {
        decoded = decodeURIComponent(String(src));
    } catch (e) {
        decoded = String(src);
    }
    var fileName = decoded.split('/').pop() || '';
    for (var i = 0; i < list.length; i++) {
        if (list[i] && list[i].file === fileName) {
            return list[i];
        }
    }
    for (var j = 0; j < list.length; j++) {
        if (list[j] && list[j].file && decoded.indexOf(list[j].file) !== -1) {
            return list[j];
        }
    }
    return null;
}

function fillFilmsVideoIntro(intro, slide) {
    if (!intro) {
        return;
    }
    var lang = getCurrentLanguage();
    var headline = lang === 'en'
        ? (slide.headlineEn || slide.headlineIt || '')
        : (slide.headlineIt || slide.headlineEn || '');
    var body = lang === 'en'
        ? (slide.bodyEn || slide.bodyIt || '')
        : (slide.bodyIt || slide.bodyEn || '');

    var titleEl = intro.querySelector('.film-video-intro__title');
    var bodyEl = intro.querySelector('.film-video-intro__body');
    if (titleEl) {
        titleEl.textContent = headline;
    }
    if (bodyEl) {
        bodyEl.textContent = body;
    }
    intro.hidden = !(headline || body);
}

/** Play top = viewport mid + 1×D + 0.5×D; text docks above. Screen-stable across films. */
function syncFilmsIntroPlayAnchor(frame) {
    if (!frame) {
        return;
    }
    var intro = frame.querySelector('.film-video-intro');
    if (!intro || intro.hidden) {
        return;
    }

    var playD = Math.min(112, Math.max(72, window.innerHeight * 0.082));
    var gap = Math.min(14, Math.max(8, window.innerHeight * 0.011));
    intro.style.setProperty('--av-play-d', playD + 'px');
    intro.style.setProperty('--film-intro-play-gap', gap + 'px');

    /* Mid-screen, then down by full circle (was +1.5D; raised by 0.5D) → top of circle */
    var playTopVp = window.innerHeight * 0.5 + 1.0 * playD;
    var fr = frame.getBoundingClientRect();
    if (!fr.height) {
        return;
    }

    var topInFrame = playTopVp - fr.top;
    var minTop = 8;
    var maxTop = Math.max(minTop, fr.height - playD - 8);
    if (topInFrame < minTop) {
        topInFrame = minTop;
    } else if (topInFrame > maxTop) {
        topInFrame = maxTop;
    }

    /* bottom offset for text box: from frame bottom up to (play top − gap) */
    var textBottom = fr.height - topInFrame + gap;

    intro.style.setProperty('--film-intro-play-top', topInFrame + 'px');
    intro.style.setProperty('--film-intro-text-bottom', textBottom + 'px');
}

function ensureFilmsVideoIntro(frame, slide) {
    if (!frame || !slide) {
        return;
    }

    /* Descriptions are on films_index; Fancybox shows poster + play only. */
    var intro = frame.querySelector('.film-video-intro');
    if (intro) {
        var playBtn = intro.querySelector('.artwork-video-play');
        if (playBtn) {
            frame.appendChild(playBtn);
            if (!frame.classList.contains('is-playing')) {
                playBtn.hidden = false;
            }
        }
        intro.remove();
    }
    var poster = frame.querySelector('.artwork-video-poster');
    if (poster && !frame.classList.contains('is-playing')) {
        poster.hidden = false;
    }
}

function refreshFilmsVideoIntroLang() {
    var fancybox = typeof Fancybox !== 'undefined' ? Fancybox.getInstance() : null;
    if (!fancybox || !fancybox.container || !fancybox.container.classList.contains('films-video-gallery')) {
        return;
    }
    var slide = fancybox.getSlide();
    if (!slide || !slide.el) {
        return;
    }
    var intro = slide.el.querySelector('.film-video-intro');
    fillFilmsVideoIntro(intro, slide);
    var frame = slide.el.querySelector('.artwork-video-frame');
    syncFilmsIntroPlayAnchor(frame);
}

function setupFilmsVideoSlide(fancybox) {
    if (!fancybox || !fancybox.container) {
        return;
    }

    var slide = fancybox.getSlide();
    if (!slide || !slide.el) {
        return;
    }

    var content = slide.el.querySelector('.fancybox__content');
    var posterSrc = slide.poster || slide.thumbSrc || '';
    ensureArtworkVideoChrome(content, fancybox, posterSrc, {
        closeButton: true,
        closeOnEnded: false
    });

    var video = slide.el.querySelector('video');
    var frame = slide.el.querySelector('.artwork-video-frame');
    if (video) {
        video.pause();
        try {
            video.currentTime = 0;
        } catch (e) { /* ignore */ }
        if (!fitFilmsVideoStage(video, frame, slide) && !video._filmsSizeBound) {
            video._filmsSizeBound = true;
            video.addEventListener('loadedmetadata', function () {
                fitFilmsVideoStage(video, frame, slide);
                if (frame) {
                    ensureFilmsVideoIntro(frame, slide);
                    syncFilmsIntroPlayAnchor(frame);
                }
            });
        }
    }
    if (frame) {
        ensureFilmsVideoIntro(frame, slide);
        syncFilmsIntroPlayAnchor(frame);
        window.requestAnimationFrame(function () {
            syncFilmsIntroPlayAnchor(frame);
        });
    }

    syncFilmsGalleryNav(fancybox);
}

function setupArtworkVideoSlide(fancybox) {
    if (!fancybox || !fancybox.container) {
        return;
    }

    var slide = fancybox.getSlide();
    if (!slide || !slide.el) {
        return;
    }

    var content = slide.el.querySelector('.fancybox__content');
    var posterSrc = slide.poster || slide.thumbSrc || '';
    ensureArtworkVideoChrome(content, fancybox, posterSrc);

    var video = slide.el.querySelector('video');
    if (video) {
        video.pause();
        try {
            video.currentTime = 0;
        } catch (e) { /* ignore */ }
    }
}

function teardownArtworkVideo(slide) {
    if (!slide || !slide.el) {
        return;
    }

    var video = slide.el.querySelector('video');
    if (!video) {
        return;
    }

    video.pause();
    if (video._artworkEndedHandler) {
        video.removeEventListener('ended', video._artworkEndedHandler);
        video._artworkEndedHandler = null;
    }
}

function encodeMediaPath(path) {
    if (!path) {
        return '';
    }
    return String(path).split('/').map(function (segment) {
        return encodeURIComponent(segment);
    }).join('/');
}

function openArtworkVideo(link) {
    if (typeof Fancybox === 'undefined' || !link) {
        return;
    }

    var src = encodeMediaPath(link.getAttribute('href'));
    var poster = encodeMediaPath(link.getAttribute('data-poster') || '');
    var format = link.getAttribute('data-html5video-format') || 'video/mp4';

    if (!src) {
        return;
    }

    var slide = {
        src: src,
        type: 'html5video',
        thumb: poster,
        videoFormat: format
    };

    var activeInstance = Fancybox.getInstance();
    if (activeInstance) {
        activeInstance.close();
    }

    Fancybox.show([slide], artworkVideoFancyboxOptions);
}

function initArtworkVideoFancybox() {
    if (typeof Fancybox === 'undefined') {
        return;
    }

    if (artworkVideoFancyboxBound) {
        return;
    }

    var links = document.querySelectorAll('[data-artwork-video]');
    if (!links.length) {
        return;
    }

    artworkVideoFancyboxBound = true;

    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            openArtworkVideo(link);
        });
    });
}

/* Films index — same poster/play chrome, photo-style prev/next, 1280×720 stage */
var filmsVideoFancyboxBound = false;

var filmsVideoFancyboxOptions = {
    mainClass: 'films-video-gallery',
    closeButton: false,
    dragToClose: false,
    animated: true,
    /* Disabled nav keeps pointer-events so clicks don’t fall through to backdrop. */
    backdropClick: 'close',
    contentClick: false,
    Html: {
        videoAutoplay: false
    },
    Toolbar: {
        display: {
            left: [],
            middle: [],
            right: []
        }
    },
    Thumbs: false,
    Carousel: {
        infinite: false,
        preload: 0
    },
    on: {
        init: function () {
            setVideoChromeHidden(true);
        },
        done: function (fancybox) {
            setVideoChromeHidden(true);
            setupFilmsVideoSlide(fancybox);
            syncFilmsGalleryNav(fancybox);
        },
        'Carousel.change': function (fancybox) {
            pauseInactiveArtworksGalleryVideos(fancybox);
            setupFilmsVideoSlide(fancybox);
            syncFilmsGalleryNav(fancybox);
        },
        shouldClose: function () {
            setVideoChromeHidden(false);
        },
        close: function (fancybox) {
            setVideoChromeHidden(false);
            teardownArtworkVideo(fancybox && fancybox.getSlide ? fancybox.getSlide() : null);
        },
        destroy: function (fancybox) {
            setVideoChromeHidden(false);
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

function openFilmsVideo(clickedLink) {
    if (typeof Fancybox === 'undefined' || !clickedLink) {
        return;
    }

    var links = Array.prototype.slice.call(document.querySelectorAll('[data-film-video]'));
    var slides = [];

    links.forEach(function (link) {
        var src = encodeMediaPath(link.getAttribute('href'));
        var poster = encodeMediaPath(link.getAttribute('data-poster') || '');
        if (!src) {
            return;
        }
        var meta = getFilmMetaBySrc(link.getAttribute('href') || src);
        slides.push({
            src: src,
            type: 'html5video',
            thumb: poster,
            poster: poster,
            videoW: parseInt(link.getAttribute('data-vw'), 10) || 0,
            videoH: parseInt(link.getAttribute('data-vh'), 10) || 0,
            videoFormat: link.getAttribute('data-html5video-format') || 'video/mp4',
            headlineIt: meta && meta.headlineIt ? meta.headlineIt : '',
            headlineEn: meta && meta.headlineEn ? meta.headlineEn : '',
            bodyIt: meta && meta.bodyIt ? meta.bodyIt : '',
            bodyEn: meta && meta.bodyEn ? meta.bodyEn : ''
        });
    });

    if (!slides.length) {
        return;
    }

    var startIndex = links.indexOf(clickedLink);
    if (startIndex < 0) {
        startIndex = 0;
    }

    var activeInstance = Fancybox.getInstance();
    if (activeInstance) {
        activeInstance.close();
    }

    Fancybox.show(slides, Object.assign({}, filmsVideoFancyboxOptions, {
        startIndex: startIndex,
        Carousel: Object.assign({}, filmsVideoFancyboxOptions.Carousel, {
            initialPage: startIndex
        })
    }));
}

function initFilmsVideoFancybox() {
    if (typeof Fancybox === 'undefined' || filmsVideoFancyboxBound) {
        return;
    }

    var links = document.querySelectorAll('[data-film-video]');
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

    var radioIt = document.getElementById('lang-it');
    var radioEn = document.getElementById('lang-en');
    if (radioIt) {
        radioIt.addEventListener('change', refreshFilmsVideoIntroLang);
    }
    if (radioEn) {
        radioEn.addEventListener('change', refreshFilmsVideoIntroLang);
    }

    window.addEventListener('resize', function () {
        var fancybox = typeof Fancybox !== 'undefined' ? Fancybox.getInstance() : null;
        if (!fancybox || !fancybox.container || !fancybox.container.classList.contains('films-video-gallery')) {
            return;
        }
        var slide = fancybox.getSlide();
        var frame = slide && slide.el ? slide.el.querySelector('.artwork-video-frame') : null;
        var video = frame ? frame.querySelector('video') : null;
        if (video && frame) {
            fitFilmsVideoStage(video, frame, slide);
        }
        syncFilmsIntroPlayAnchor(frame);
    });
}

function initFancybox() {
    initFancyboxIframe();
    initBioFancybox();
    initBioImageGalleries();
    initQuestionsVideoFancybox();
    initArtworkVideoFancybox();
    initFilmsVideoFancybox();
    initBooksFancybox();
}

document.addEventListener('DOMContentLoaded', initFancybox);

if (typeof Fancybox !== 'undefined') {
    initFancybox();
}

