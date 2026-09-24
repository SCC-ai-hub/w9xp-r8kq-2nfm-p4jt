/**
 * Films page: lock description top (fixed meta slot) + per-film desc width
 * so short copy fills the desc band; long copy stays as wide as needed to fit.
 */
(function () {
    var META_SLOT = '--film-meta-slot-h';
    var MIN_THUMB_REF = 660;
    var REF_W = 1920;
    var BOTTOM_PAD = 10;

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

    function setDescWidth(desc, px) {
        desc.style.width = px + 'px';
        desc.style.maxWidth = '100%';
    }

    function heightAt(desc, w) {
        setDescWidth(desc, w);
        return desc.getBoundingClientRect().height;
    }

    /**
     * Narrowest width whose height still fits in availH.
     * Short texts → narrow (taller block fills the band).
     * Long texts → stay wide enough not to overflow.
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
                hi = mid - 1; /* try narrower → taller */
            } else {
                lo = mid + 1; /* too tall → widen */
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

        var swTop = sw.getBoundingClientRect().top;
        var minW = Math.max(200, Math.round(pageW * (MIN_THUMB_REF / REF_W)));
        var maxW = Math.round(pageW);

        list.forEach(function (item) {
            var desc = item.querySelector('.film-desc');
            if (!desc) return;
            setDescWidth(desc, maxW);
            void desc.offsetHeight;
            var availH = swTop - BOTTOM_PAD - desc.getBoundingClientRect().top;
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
