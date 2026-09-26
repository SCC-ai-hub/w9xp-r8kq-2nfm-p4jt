/**
 * Kiosk idle → home (index.html) after 5 minutes without interaction.
 * Video playback suspends the timer; countdown starts when the video ends
 * (or is paused / removed with nothing else playing). Touches on video UI
 * do not reset the idle clock.
 */
(function () {
    'use strict';

    var IDLE_MS = 5 * 60 * 1000;
    var THROTTLE_MS = 400;
    var ACTIVITY_MSG = 'bruskin-idle-activity';

    var scriptEl = document.currentScript;
    var homeHref = scriptEl && scriptEl.src
        ? new URL('index.html', scriptEl.src).href
        : new URL('index.html', window.location.href).href;

    var isTop = false;
    try {
        isTop = window.self === window.top;
    } catch (e) {
        isTop = false;
    }

    var lastPing = 0;
    var timerId = null;
    var playingVideos = [];

    var ACTIVITY_EVENTS = [
        'pointerdown',
        'pointermove',
        'pointerup',
        'touchstart',
        'touchmove',
        'touchend',
        'mousedown',
        'mousemove',
        'mouseup',
        'click',
        'wheel',
        'keydown',
        'keyup',
        'scroll',
        'change',
        'input'
    ];

    function isHomeLocation(win) {
        try {
            var path = String(win.location.pathname || '').replace(/\\/g, '/').toLowerCase();
            var file = path.split('/').pop() || '';
            return file === '' || file === 'index.html' || file === 'index.htm';
        } catch (err) {
            return false;
        }
    }

    function isVideoUiTarget(target) {
        var el = target;
        if (!el) {
            return false;
        }
        if (el.nodeType === 3) {
            el = el.parentElement;
        }
        if (!el || !el.closest) {
            return el && el.tagName === 'VIDEO';
        }
        return !!(
            el.closest('video') ||
            el.closest('.video-progress') ||
            el.closest('.artwork-video-frame') ||
            el.closest('.artwork-video-play') ||
            el.closest('.artwork-video-poster') ||
            el.closest('.film-video-intro') ||
            el.closest('.fancybox__html5video') ||
            el.closest('.f-html5video') ||
            el.closest('[class*="html5video"]')
        );
    }

    function prunePlaying() {
        var next = [];
        for (var i = 0; i < playingVideos.length; i++) {
            var v = playingVideos[i];
            if (v && v.isConnected && !v.paused && !v.ended) {
                next.push(v);
            }
        }
        playingVideos = next;
        return playingVideos.length > 0;
    }

    function markPlaying(video) {
        if (!video || video.tagName !== 'VIDEO') {
            return;
        }
        for (var i = 0; i < playingVideos.length; i++) {
            if (playingVideos[i] === video) {
                return;
            }
        }
        playingVideos.push(video);
    }

    function clearIdleTimer() {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
    }

    function armTimer() {
        clearIdleTimer();
        if (!isTop || isHomeLocation(window)) {
            return;
        }
        if (prunePlaying()) {
            return;
        }
        timerId = setTimeout(goHome, IDLE_MS);
    }

    function pingActivity(event) {
        if (event && isVideoUiTarget(event.target)) {
            return;
        }

        var now = Date.now();
        if (now - lastPing < THROTTLE_MS) {
            return;
        }
        lastPing = now;

        if (!isTop) {
            try {
                window.parent.postMessage({ type: ACTIVITY_MSG }, '*');
            } catch (err) { /* ignore */ }
            return;
        }

        armTimer();
    }

    function goHome() {
        if (!isTop || isHomeLocation(window)) {
            return;
        }
        if (prunePlaying()) {
            return;
        }
        try {
            if (typeof Fancybox !== 'undefined') {
                var inst = Fancybox.getInstance();
                if (inst) {
                    inst.destroy();
                }
            }
        } catch (err) { /* ignore */ }
        window.location.href = homeHref;
    }

    function onVideoPlay(event) {
        var video = event.target;
        if (!video || video.tagName !== 'VIDEO') {
            return;
        }
        markPlaying(video);
        clearIdleTimer();
    }

    function onVideoStopped(event) {
        var video = event.target;
        if (!video || video.tagName !== 'VIDEO') {
            return;
        }
        var next = [];
        for (var i = 0; i < playingVideos.length; i++) {
            if (playingVideos[i] !== video) {
                next.push(playingVideos[i]);
            }
        }
        playingVideos = next;
        /* ended / pause / emptied: start (or keep) the 5‑minute idle clock */
        armTimer();
    }

    function bindVideoLifecycle(target) {
        if (!target || target.__bruskinIdleVideoBound) {
            return;
        }
        target.__bruskinIdleVideoBound = true;
        target.addEventListener('play', onVideoPlay, true);
        target.addEventListener('playing', onVideoPlay, true);
        target.addEventListener('pause', onVideoStopped, true);
        target.addEventListener('ended', onVideoStopped, true);
        target.addEventListener('emptied', onVideoStopped, true);
    }

    function bindTarget(target) {
        if (!target || target.__bruskinIdleBound) {
            return;
        }
        target.__bruskinIdleBound = true;
        for (var i = 0; i < ACTIVITY_EVENTS.length; i++) {
            target.addEventListener(ACTIVITY_EVENTS[i], pingActivity, {
                capture: true,
                passive: true
            });
        }
        bindVideoLifecycle(target);
    }

    function bindIframe(iframe) {
        if (!iframe || iframe.__bruskinIdleIframe) {
            return;
        }
        function tryBind() {
            try {
                var doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
                if (!doc) {
                    return;
                }
                iframe.__bruskinIdleIframe = true;
                bindTarget(doc);
                if (iframe.contentWindow) {
                    iframe.contentWindow.addEventListener('scroll', pingActivity, { passive: true });
                }
            } catch (err) { /* cross-origin */ }
        }
        tryBind();
        iframe.addEventListener('load', tryBind);
    }

    function scanIframes() {
        var list = document.getElementsByTagName('iframe');
        for (var i = 0; i < list.length; i++) {
            bindIframe(list[i]);
        }
    }

    function hookFancybox() {
        if (typeof Fancybox === 'undefined' || !Fancybox.on) {
            return;
        }
        var events = [
            'init',
            'ready',
            'done',
            'reveal',
            'change',
            'Carousel.change',
            'Carousel.ready',
            'closing',
            'close',
            'destroy'
        ];
        for (var i = 0; i < events.length; i++) {
            try {
                Fancybox.on(events[i], function () {
                    pingActivity(null);
                    /* Fancybox may inject <video> after reveal */
                    setTimeout(function () {
                        if (prunePlaying()) {
                            clearIdleTimer();
                        }
                    }, 0);
                });
            } catch (err) { /* ignore */ }
        }
    }

    bindTarget(document);
    window.addEventListener('scroll', pingActivity, { passive: true });

    if (isTop) {
        window.addEventListener('message', function (event) {
            var data = event.data;
            if (data && data.type === ACTIVITY_MSG) {
                pingActivity(null);
            }
        });

        document.addEventListener('load', function (event) {
            if (event.target && event.target.tagName === 'IFRAME') {
                bindIframe(event.target);
            }
        }, true);

        if (typeof MutationObserver !== 'undefined') {
            var mo = new MutationObserver(function () {
                scanIframes();
                if (prunePlaying()) {
                    clearIdleTimer();
                } else if (!timerId && !isHomeLocation(window)) {
                    /* video node removed while idle clock was suspended */
                    armTimer();
                }
            });
            mo.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    function start() {
        hookFancybox();
        scanIframes();
        armTimer();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
