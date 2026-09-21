(function () {
    function easeOutQuint(t) {
        return 1 - Math.pow(1 - t, 5);
    }

    function animateScroll(el, axis, target, duration) {
        var isX = axis === 'x';
        var start = isX ? el.scrollLeft : el.scrollTop;
        var delta = target - start;
        if (!delta) return;
        var t0 = performance.now();
        var ms = duration || 780;

        function frame(now) {
            var t = Math.min(1, (now - t0) / ms);
            var v = start + delta * easeOutQuint(t);
            if (isX) el.scrollLeft = v;
            else el.scrollTop = v;
            if (t < 1) {
                requestAnimationFrame(frame);
            } else if (isX) {
                el.scrollLeft = target;
            } else {
                el.scrollTop = target;
            }
        }
        requestAnimationFrame(frame);
    }

    document.querySelectorAll('[data-scroll-area]').forEach(function (area) {
        var grid = area.querySelector('[data-scroll-grid]');
        if (!grid) return;

        var axis = area.getAttribute('data-scroll-axis') || 'y';
        var mode = area.getAttribute('data-scroll-mode') || 'item';
        var itemSelector = area.getAttribute('data-scroll-item') || '.card-item, .book-item';

        /* Controls may sit outside the scroll area (e.g. .page-arrow on .card-page). */
        var scope = area.closest('.card-page') || area;
        var btnUp = scope.querySelector('[data-scroll-up]');
        var btnDown = scope.querySelector('[data-scroll-down]');
        var btnPrev = scope.querySelector('[data-scroll-prev]');
        var btnNext = scope.querySelector('[data-scroll-next]');

        function getItems() {
            return grid.querySelectorAll(itemSelector);
        }

        function getColumnCount() {
            var style = getComputedStyle(grid);
            var cols = style.gridTemplateColumns;
            if (!cols || cols === 'none') return 1;
            return cols.split(' ').filter(function (part) { return part.trim(); }).length || 1;
        }

        function getScrollStepY() {
            var items = getItems();
            if (!items.length) return 0;

            var style = getComputedStyle(grid);
            var gap = parseFloat(style.rowGap) || 0;

            if (mode === 'row-max') {
                var cols = getColumnCount();
                var maxH = 0;
                for (var i = 0; i < Math.min(cols, items.length); i++) {
                    maxH = Math.max(maxH, items[i].offsetHeight);
                }
                return maxH + gap;
            }

            return items[0].offsetHeight + gap;
        }

        function getScrollStepX() {
            if (mode === 'page') {
                return grid.clientWidth;
            }
            var items = getItems();
            if (!items.length) return 0;
            var track = grid.querySelector('.books-track') || grid.querySelector('.artworks-track') || grid;
            var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
            return items[0].offsetWidth + gap;
        }

        /** Full-viewport pages — every item left edge (clamped). Never drop the last page. */
        function getViewportPageStarts() {
            var pages = getItems();
            var max = Math.max(0, grid.scrollWidth - grid.clientWidth);
            if (!pages.length) return [0];

            var starts = [];
            var i;
            for (i = 0; i < pages.length; i++) {
                starts.push(Math.min(pages[i].offsetLeft, max));
            }
            return starts;
        }

        /** Scroll positions where a book’s left edge matches the viewport’s left (home) edge. */
        function getBookPageStarts() {
            var items = getItems();
            if (!items.length) return [0];

            var cols = parseInt(area.getAttribute('data-scroll-cols') || '4', 10) || 4;
            var max = Math.max(0, grid.scrollWidth - grid.clientWidth);
            var starts = [];
            var i;

            for (i = 0; i < items.length; i += cols) {
                var left = items[i].offsetLeft;
                if (left > max + 0.5) break;
                starts.push(left);
            }

            var lastIdx = 0;
            for (i = 0; i < items.length; i++) {
                if (items[i].offsetLeft <= max + 0.5) lastIdx = i;
            }
            var lastLeft = items[lastIdx].offsetLeft;
            if (!starts.length || Math.abs(starts[starts.length - 1] - lastLeft) > 0.5) {
                starts.push(lastLeft);
            }
            if (Math.abs(starts[starts.length - 1] - max) > 0.5 && lastLeft < max) {
                /* keep book-aligned last; max alone can bisect a cover */
            }

            return starts;
        }

        function getPageStarts() {
            return mode === 'page' ? getViewportPageStarts() : getBookPageStarts();
        }

        function getNearestPageIndex() {
            var items = getItems();
            if (!items.length) return 0;
            var scroll = grid.scrollLeft;
            var best = 0;
            var bestDist = Infinity;
            for (var i = 0; i < items.length; i++) {
                var dist = Math.abs(items[i].offsetLeft - scroll);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = i;
                }
            }
            return best;
        }

        function nearestStartIndexAt(scroll) {
            var starts = getPageStarts();
            var best = 0;
            var bestDist = Infinity;
            for (var i = 0; i < starts.length; i++) {
                var dist = Math.abs(starts[i] - scroll);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = i;
                }
            }
            return best;
        }

        function nextBookPageTarget() {
            if (mode === 'page') {
                var items = getItems();
                if (!items.length) return 0;
                var idx = Math.min(getNearestPageIndex() + 1, items.length - 1);
                return items[idx].offsetLeft;
            }
            var starts = getPageStarts();
            var scroll = grid.scrollLeft;
            for (var i = 0; i < starts.length; i++) {
                if (starts[i] > scroll + 1) return starts[i];
            }
            return starts[starts.length - 1];
        }

        function prevBookPageTarget() {
            if (mode === 'page') {
                var items = getItems();
                if (!items.length) return 0;
                var idx = Math.max(getNearestPageIndex() - 1, 0);
                return items[idx].offsetLeft;
            }
            var starts = getPageStarts();
            var scroll = grid.scrollLeft;
            for (var i = starts.length - 1; i >= 0; i--) {
                if (starts[i] < scroll - 1) return starts[i];
            }
            return 0;
        }

        function updateScrollArrows() {
            if (axis === 'x') {
                if (mode === 'page') {
                    var items = getItems();
                    var idx = getNearestPageIndex();
                    if (btnPrev) btnPrev.classList.toggle('scroll-btn--inactive', idx <= 0);
                    if (btnNext) btnNext.classList.toggle('scroll-btn--inactive', idx >= items.length - 1);
                    return;
                }

                var atStart = grid.scrollLeft <= 1;
                var atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1;
                if (btnPrev) btnPrev.classList.toggle('scroll-btn--inactive', atStart);
                if (btnNext) btnNext.classList.toggle('scroll-btn--inactive', atEnd);
                return;
            }

            if (!btnUp || !btnDown) return;
            var atTop = grid.scrollTop <= 1;
            var atBottom = grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 1;
            btnUp.classList.toggle('scroll-btn--inactive', atTop);
            btnDown.classList.toggle('scroll-btn--inactive', atBottom);
        }

        if (axis === 'x') {
            var scrollMs = 1640;
            var scrolling = false;
            var drag = null;
            var DRAG_THRESHOLD = 10;
            var SWIPE_RATIO = 0.12;
            var SWIPE_MIN_PX = 48;

            function runX(to) {
                if (scrolling) return;
                var maxScroll = Math.max(0, grid.scrollWidth - grid.clientWidth);
                var target = Math.max(0, Math.min(maxScroll, Math.round(to)));
                if (Math.abs(grid.scrollLeft - target) < 1) {
                    updateScrollArrows();
                    return;
                }
                scrolling = true;
                animateScroll(grid, 'x', target, scrollMs);
                window.setTimeout(function () {
                    grid.scrollLeft = target;
                    scrolling = false;
                    updateScrollArrows();
                }, scrollMs + 40);
            }

            function targetFromStartIndex(startIdx, dx) {
                var starts = getPageStarts();
                if (!starts.length) return 0;
                var threshold = Math.max(SWIPE_MIN_PX, grid.clientWidth * SWIPE_RATIO);
                var idx = startIdx;
                if (dx < -threshold) {
                    idx = Math.min(startIdx + 1, starts.length - 1);
                } else if (dx > threshold) {
                    idx = Math.max(startIdx - 1, 0);
                }
                return starts[idx];
            }

            function suppressClickOnce(e) {
                e.preventDefault();
                e.stopPropagation();
                grid.removeEventListener('click', suppressClickOnce, true);
            }

            function endDrag(e) {
                if (!drag || e.pointerId !== drag.pointerId) return;
                var wasActive = drag.active;
                var dx = e.clientX - drag.startX;
                var startIdx = drag.startIdx;
                try {
                    if (grid.hasPointerCapture && grid.hasPointerCapture(e.pointerId)) {
                        grid.releasePointerCapture(e.pointerId);
                    }
                } catch (err) { /* ignore */ }
                grid.classList.remove('is-dragging');
                drag = null;
                if (!wasActive) return;

                grid.addEventListener('click', suppressClickOnce, true);
                window.setTimeout(function () {
                    grid.removeEventListener('click', suppressClickOnce, true);
                }, 450);

                runX(targetFromStartIndex(startIdx, dx));
            }

            grid.addEventListener('pointerdown', function (e) {
                if (scrolling) return;
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                if (e.target.closest('button, input, textarea, select, .page-arrow, .lang-switcher, .nav-switcher')) return;

                drag = {
                    pointerId: e.pointerId,
                    startX: e.clientX,
                    startY: e.clientY,
                    startScroll: grid.scrollLeft,
                    startIdx: nearestStartIndexAt(grid.scrollLeft),
                    active: false
                };
            });

            grid.addEventListener('pointermove', function (e) {
                if (!drag || e.pointerId !== drag.pointerId) return;
                var dx = e.clientX - drag.startX;
                var dy = e.clientY - drag.startY;

                if (!drag.active) {
                    if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
                    if (Math.abs(dy) > Math.abs(dx)) {
                        drag = null;
                        return;
                    }
                    drag.active = true;
                    grid.classList.add('is-dragging');
                    try {
                        grid.setPointerCapture(e.pointerId);
                    } catch (err) { /* ignore */ }
                }

                e.preventDefault();
                var maxScroll = Math.max(0, grid.scrollWidth - grid.clientWidth);
                grid.scrollLeft = Math.max(0, Math.min(maxScroll, drag.startScroll - dx));
                updateScrollArrows();
            }, { passive: false });

            grid.addEventListener('pointerup', endDrag);
            grid.addEventListener('pointercancel', endDrag);

            grid.addEventListener('dragstart', function (e) {
                e.preventDefault();
            });

            if (btnPrev) {
                btnPrev.addEventListener('click', function () {
                    if (btnPrev.classList.contains('scroll-btn--inactive')) return;
                    runX(prevBookPageTarget());
                });
            }
            if (btnNext) {
                btnNext.addEventListener('click', function () {
                    if (btnNext.classList.contains('scroll-btn--inactive')) return;
                    runX(nextBookPageTarget());
                });
            }
        } else if (btnUp && btnDown) {
            btnUp.addEventListener('click', function () {
                if (btnUp.classList.contains('scroll-btn--inactive')) return;
                grid.scrollBy({ top: -getScrollStepY(), behavior: 'smooth' });
            });

            btnDown.addEventListener('click', function () {
                if (btnDown.classList.contains('scroll-btn--inactive')) return;
                grid.scrollBy({ top: getScrollStepY(), behavior: 'smooth' });
            });
        }

        grid.addEventListener('scroll', updateScrollArrows, { passive: true });
        window.addEventListener('resize', updateScrollArrows);
        updateScrollArrows();
    });
})();
