(function () {
    function syncQuestionSlideWidths(area) {
        var grid = area.querySelector('[data-scroll-grid]');
        var track = area.querySelector('.questions-track');
        var itemSelector = area.getAttribute('data-scroll-item') || '.question-slide';
        if (!grid || !track) return;

        var items = grid.querySelectorAll(itemSelector);
        var w = grid.clientWidth;
        if (!w || !items.length) return;

        for (var i = 0; i < items.length; i++) {
            items[i].style.flex = '0 0 ' + w + 'px';
            items[i].style.width = w + 'px';
            items[i].style.minWidth = w + 'px';
            items[i].style.maxWidth = w + 'px';
        }
        track.style.width = (w * items.length) + 'px';
    }

    function initQuestionsCounter(area) {
        var grid = area.querySelector('[data-scroll-grid]');
        var currentEl = area.querySelector('[data-q-current]');
        var totalEl = area.querySelector('[data-q-total]');
        var itemSelector = area.getAttribute('data-scroll-item') || '.question-slide';

        if (!grid || !currentEl) return;

        function getItems() {
            return grid.querySelectorAll(itemSelector);
        }

        function update() {
            var items = getItems();
            var total = items.length;
            if (totalEl) totalEl.textContent = String(total);
            if (!total) {
                currentEl.textContent = '0';
                return;
            }

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
            currentEl.textContent = String(best + 1);
        }

        syncQuestionSlideWidths(area);
        grid.dispatchEvent(new Event('scroll'));
        grid.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', function () {
            syncQuestionSlideWidths(area);
            grid.dispatchEvent(new Event('scroll'));
            update();
        });
        update();
    }

    document.querySelectorAll('.questions-scroll[data-scroll-area]').forEach(initQuestionsCounter);
})();
