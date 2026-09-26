/**
 * High-quality cover downscale for Artworks page thumbnails.
 * Uses canvas imageSmoothingQuality = "high" (+ stepwise ½ shrink).
 * Only .artworks-page .card-image — not Fancybox gallery.
 */
(function () {
    'use strict';

    var DPR_CAP = 2;
    var sources = new WeakMap();

    function dpr() {
        return Math.min(window.devicePixelRatio || 1, DPR_CAP);
    }

    function coverCrop(nw, nh, cw, ch) {
        var ir = nw / nh;
        var cr = cw / ch;
        if (ir > cr) {
            var sw = nh * cr;
            return { sx: (nw - sw) / 2, sy: 0, sw: sw, sh: nh };
        }
        var sh = nw / cr;
        return { sx: 0, sy: (nh - sh) / 2, sw: nw, sh: sh };
    }

    function drawStep(src, sw, sh, dw, dh) {
        var c = document.createElement('canvas');
        c.width = dw;
        c.height = dh;
        var ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(src, 0, 0, sw, sh, 0, 0, dw, dh);
        return c;
    }

    function downscaleHigh(source, sx, sy, sw, sh, dw, dh) {
        var crop = document.createElement('canvas');
        crop.width = Math.max(1, Math.round(sw));
        crop.height = Math.max(1, Math.round(sh));
        var cctx = crop.getContext('2d');
        cctx.drawImage(source, sx, sy, sw, sh, 0, 0, crop.width, crop.height);

        var cur = crop;
        var cw = crop.width;
        var ch = crop.height;
        var tw = Math.max(1, Math.round(dw));
        var th = Math.max(1, Math.round(dh));

        while (cw * 0.5 > tw && ch * 0.5 > th) {
            var nw = Math.max(tw, Math.floor(cw * 0.5));
            var nh = Math.max(th, Math.floor(ch * 0.5));
            cur = drawStep(cur, cw, ch, nw, nh);
            cw = nw;
            ch = nh;
        }

        if (cw === tw && ch === th) return cur;
        return drawStep(cur, cw, ch, tw, th);
    }

    function paint(canvas) {
        var img = sources.get(canvas);
        if (!img || !img.complete || !img.naturalWidth) return;

        var cssW = canvas.clientWidth;
        var cssH = canvas.clientHeight;
        if (cssW < 2 || cssH < 2) return;

        var scale = dpr();
        var tw = Math.max(1, Math.round(cssW * scale));
        var th = Math.max(1, Math.round(cssH * scale));
        var key = tw + 'x' + th;

        /* Skip if already painted at this CSS×DPR size (avoids RO loop on canvas.width). */
        if (canvas.dataset.hqKey === key) return;

        var crop = coverCrop(img.naturalWidth, img.naturalHeight, tw, th);
        var result = downscaleHigh(
            img,
            crop.sx, crop.sy, crop.sw, crop.sh,
            tw, th
        );

        canvas.width = tw;
        canvas.height = th;
        var ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, tw, th);
        ctx.drawImage(result, 0, 0);
        canvas.dataset.hqKey = key;
    }

    function upgrade(img) {
        if (!(img instanceof HTMLImageElement)) return;
        if (img.dataset.hqCover === '1') return;
        img.dataset.hqCover = '1';

        var src = img.currentSrc || img.src;
        if (!src) return;

        var canvas = document.createElement('canvas');
        canvas.className = img.className;
        canvas.setAttribute('role', 'img');
        if (img.alt) canvas.setAttribute('aria-label', img.alt);

        var loader = new Image();
        loader.decoding = 'async';
        loader.onload = function () {
            sources.set(canvas, loader);
            paint(canvas);
        };
        loader.onerror = function () {
            if (canvas.parentNode) canvas.replaceWith(img);
        };

        img.replaceWith(canvas);
        loader.src = src;

        var ro = new ResizeObserver(function () {
            paint(canvas);
        });
        ro.observe(canvas);
    }

    function init() {
        var list = document.querySelectorAll('.artworks-page .card-image');
        for (var i = 0; i < list.length; i++) upgrade(list[i]);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
