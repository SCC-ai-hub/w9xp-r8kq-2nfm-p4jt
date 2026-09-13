(function () {
    function whenLoaded(img) {
        if (img.complete && img.naturalWidth > 0) {
            return Promise.resolve();
        }
        return new Promise(function (resolve) {
            var done = function () {
                img.removeEventListener('load', done);
                img.removeEventListener('error', done);
                resolve();
            };
            img.addEventListener('load', done);
            img.addEventListener('error', done);
        });
    }

    function armDeferred(img) {
        /* HTML already uses data-src (no src) so the parser does not fetch early. */
        if (!img.getAttribute('data-src')) {
            return;
        }
        img.classList.add('is-pending');
        img.setAttribute('decoding', 'async');
    }

    function reveal(img, url) {
        return new Promise(function (resolve) {
            var done = function () {
                img.removeEventListener('load', done);
                img.removeEventListener('error', done);
                img.classList.remove('is-pending');
                img.classList.add('is-ready');
                resolve();
            };
            img.addEventListener('load', done);
            img.addEventListener('error', done);
            img.src = url;
            img.removeAttribute('data-src');
            /* Keep decoded bitmap: <img> stays in DOM for the page lifetime. */
            if (img.complete && img.naturalWidth > 0) {
                done();
            }
        });
    }

    function initBookCovers() {
        var covers = Array.prototype.slice.call(
            document.querySelectorAll('img.book-cover')
        );
        if (!covers.length) {
            return;
        }

        var first = covers.filter(function (img) {
            return img.hasAttribute('data-book-first');
        });
        var rest = covers.filter(function (img) {
            return img.hasAttribute('data-src');
        });

        rest.forEach(armDeferred);

        var gate = first.length
            ? Promise.all(first.map(whenLoaded))
            : Promise.resolve();

        gate.then(function () {
            return Promise.all(
                rest.map(function (img) {
                    var url = img.getAttribute('data-src');
                    return url ? reveal(img, url) : Promise.resolve();
                })
            );
        });
    }

    function setFlipped(book, open) {
        book.classList.toggle('is-flipped', open);
        book.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function initBookFlips() {
        var books = Array.prototype.slice.call(
            document.querySelectorAll('.book-item[data-book-flip]')
        );
        if (!books.length) {
            return;
        }

        books.forEach(function (book) {
            book.addEventListener('click', function () {
                var willOpen = !book.classList.contains('is-flipped');
                books.forEach(function (other) {
                    if (other !== book) {
                        setFlipped(other, false);
                    }
                });
                setFlipped(book, willOpen);
            });
        });
    }

    function init() {
        initBookCovers();
        initBookFlips();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
