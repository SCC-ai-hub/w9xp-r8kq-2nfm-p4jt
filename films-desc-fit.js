/**
 * Films page: lock description top (fixed meta slot) + per-film desc width.
 * Narrowest width that still fits the desc band (bottom = 2 body-lines above switchers).
 */
(function () {
    var META_SLOT = '--film-meta-slot-h';
    var REF_W = 1920;
    var MIN_W_FLOOR = 280;

    function panel() {
        return document.querySelector('.films-panel:not(.films-panel--two)');
    }

    function switchersEl() {
        return document.querySelector('.films-panel:not(.films-panel--two) .switchers-row');
    }

    function items() {
        return Array.prototype.slice.call(
            document.querySelectorAll('.films-panel:not(.films-panel--two) .film-item')
        );
    }

    function pageWidth() {
        var page = document.querySelector('.films-panel:not(.films-panel--two) .films-page');
        return page ? page.getBoundingClientRect().width : 0;
    }

    function measureMetaSlot(list) {
        var maxH = 0;
        list.forEach(function (item) {
            var meta = item.querySelector('.film-meta');
            if (!meta) return;
            maxH = Math.max(maxH, meta.offsetHeight);
            Array.prototype.forEach.call(
                meta.querySelectorAll('.lang-it, .lang-en'),
                function (lang) {
                    maxH = Math.max(maxH, lang.scrollHeight);
                }
            );
        });
        return Math.ceil(maxH);
    }

    /** Raise bottom of band by N body lines (from CSS --film-desc-bottom-lines). */
    function bottomPadPx(p) {
        var body = document.querySelector('.films-panel:not(.films-panel--two) .film-desc-body');
        var lines = parseFloat(getComputedStyle(p).getPropertyValue('--film-desc-bottom-lines')) || 2;
        var linePx = 22;
        if (body) {
            var cs = getComputedStyle(body);
            var lh = cs.lineHeight;
            if (lh && lh !== 'normal') linePx = parseFloat(lh);
            else linePx = parseFloat(cs.fontSize) * 1.4;
        }
        return Math.ceil(linePx * lines);
    }

    function setDescWidth(desc, px) {
        desc.style.width = px + 'px';
        desc.style.maxWidth = '100%';
    }

    function heightAt(desc, w) {
        setDescWidth(desc, w);
        return desc.getBoundingClientRect().height;
    }

    /**
     * Narrowest width whose height still fits in availH (max density at fixed font).
     */
    function fitItem(item, maxW, minW, availH) {
        var desc = item.querySelector('.film-desc');
        if (!desc || availH < 24) {
            if (desc) setDescWidth(desc, maxW);
            return;
        }

        if (heightAt(desc, maxW) > availH) {
            setDescWidth(desc, maxW);
            return;
        }

        var lo = minW;
        var hi = maxW;
        var best = maxW;

        while (lo <= hi) {
            var mid = (lo + hi) >> 1;
            if (heightAt(desc, mid) <= availH) {
                best = mid;
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }

        setDescWidth(desc, best);
    }

    function fitAll() {
        var p = panel();
        var sw = switchersEl();
        var list = items();
        if (!p || !sw || !list.length) return;

        var pageW = pageWidth();
        if (pageW < 80) return;

        list.forEach(function (item) {
            var desc = item.querySelector('.film-desc');
            if (desc) {
                desc.style.width = '';
                desc.style.maxWidth = '';
            }
        });
        p.style.removeProperty(META_SLOT);
        void p.offsetHeight;

        p.style.setProperty(META_SLOT, measureMetaSlot(list) + 'px');
        void p.offsetHeight;

        var pad = bottomPadPx(p);
        var swTop = sw.getBoundingClientRect().top;
        var minW = Math.max(MIN_W_FLOOR, Math.round(pageW * 0.32));
        var maxW = Math.round(pageW);

        list.forEach(function (item) {
            var desc = item.querySelector('.film-desc');
            if (!desc) return;
            setDescWidth(desc, maxW);
            void desc.offsetHeight;
            var availH = swTop - pad - desc.getBoundingClientRect().top;
            fitItem(item, maxW, minW, availH);
        });
    }

    var scheduled = null;
    function schedule() {
        if (scheduled) cancelAnimationFrame(scheduled);
        scheduled = requestAnimationFrame(function () {
            scheduled = null;
            fitAll();
        });
    }

    function bind() {
        if (!panel()) return;
        fitAll();
        window.addEventListener('resize', schedule);
        document.querySelectorAll('input[name="lang"]').forEach(function (el) {
            el.addEventListener('change', schedule);
        });
        if (typeof ResizeObserver !== 'undefined') {
            var p = panel();
            if (p) new ResizeObserver(schedule).observe(p);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
})();
