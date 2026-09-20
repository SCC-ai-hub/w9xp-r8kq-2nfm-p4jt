/**
 * BIO press gallery registry — single source for all gallery data.
 *
 * To add a press image:
 *   1. Place the image file in BIO/press/ (zero-padded name, e.g. 04.jpg)
 *   2. Append one object to BIO_PRESS below, in display order
 *
 * Fields per entry:
 *   file      — filename inside BIO/press/
 *   aspect    — width/height (premeasured; used for equal thumb visual gaps)
 *   captionIt — Italian description (multiline template literal)
 *   captionEn — English description (multiline template literal)
 */
window.BIO_PRESS = [
    {
        file: '01.jpg',
        aspect: 0.8316,
        captionIt: `
            Los Angeles Times. July 31, 1988
        `.trim(),
        captionEn: `
            Los Angeles Times. July 31, 1988
        `.trim()
    },
    {
        file: '02.jpg',
        aspect: 0.6762,
        captionIt: `
            The Art Newspaper Russia. May, 2017
        `.trim(),
        captionEn: `
            The Art Newspaper Russia. May, 2017
        `.trim()
    },
    {
        file: '03.jpg',
        aspect: 0.6215,
        captionIt: `
            The New York Times. July 8, 1988
        `.trim(),
        captionEn: `
            The New York Times. July 8, 1988
        `.trim()
    }
];
