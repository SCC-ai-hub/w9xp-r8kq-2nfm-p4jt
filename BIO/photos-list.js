/**
 * BIO photo gallery registry — single source for all gallery data.
 *
 * To add a photo:
 *   1. Place the image file in BIO/photos/ (zero-padded name, e.g. 11.jpg)
 *   2. Append one object to BIO_PHOTOS below, in display order
 *
 * Fields per entry:
 *   file      — filename inside BIO/photos/
 *   aspect    — width/height (premeasured; used for equal thumb visual gaps)
 *   captionIt — Italian description (multiline template literal)
 *   captionEn — English description (multiline template literal)
 */
window.BIO_PHOTOS = [
    {
        file: '01.jpg',
        aspect: 0.7951,
        captionIt: `
            Il trisavolo Boruch.
        `.trim(),
        captionEn: `
            The great-great-grandfather Boruch.
        `.trim()
    },
    {
        file: '02.jpg',
        aspect: 1.3847,
        captionIt: `
            La nonna Rebecca al centro. Crimea, 1923.
        `.trim(),
        captionEn: `
            Grandmother Rebecca in the center. Crimea, 1923.
        `.trim()
    },
    {
        file: '03.jpg',
        aspect: 1.5595,
        captionIt: `
            Il nonno tra i bambini.
        `.trim(),
        captionEn: `
            Grandfather among the children.
        `.trim()
    },
    {
        file: '04.jpg',
        aspect: 0.6166,
        captionIt: `
            Il nonno Menachem-Man. Železnovodsk, 1927.
        `.trim(),
        captionEn: `
            Grandfather Menachem-Man. Zheleznovodsk, 1927.
        `.trim()
    },
    {
        file: '05.jpg',
        aspect: 1.3014,
        captionIt: `
            Grisha Briskin con le sue sorelle, 1947.
        `.trim(),
        captionEn: `
            Grisha Briskin with his sisters, 1947.
        `.trim()
    },
    {
        file: '06.jpg',
        aspect: 0.699,
        captionIt: `
            Grisha Bruskin in seconda classe della scuola n. 325, Mosca, 1954.
        `.trim(),
        captionEn: `
            Grisha Bruskin in the second grade at School No. 325, Moscow, 1954.
        `.trim()
    },
    {
        file: '07.jpg',
        aspect: 0.723,
        captionIt: `
            Grisha Bruskin in quarta classe della scuola n. 325.
        `.trim(),
        captionEn: `
            Grisha Bruskin in the fourth grade at School No. 325.
        `.trim()
    },
    {
        file: '08.jpg',
        aspect: 0.75,
        captionIt: `
            Manifesti per la mostra di arazzi Alefbet al Museo d'arte ebraica e di storia ebraica di Parigi, 2010.
        `.trim(),
        captionEn: `
            Posters for the Alefbet tapestry exhibition at the Museum of Jewish Art and Jewish History in Paris, 2010.
        `.trim()
    },
    {
        file: '09.jpg',
        aspect: 1.3014,
        captionIt: `
            Con Milos Forman. Mosca, 1987.
        `.trim(),
        captionEn: `
            With Miloš Forman. Moscow, 1987.
        `.trim()
    },
    {
        file: '10.jpg',
        aspect: 1.4321,
        captionIt: `
            Boris Groys, Mikhail Iampolski, Grisha Bruskin, Katya Korsunskaya, Lev Rubinstein, Alla Rosenfeld, Natalia Nikitina, Solomon Volkov, Leonid Sokov. New York, 2013.
        `.trim(),
        captionEn: `
            Boris Groys, Mikhail Iampolski, Grisha Bruskin, Katya Korsunskaya, Lev Rubinstein, Alla Rosenfeld, Natalia Nikitina, Solomon Volkov, Leonid Sokov. New York, 2013.
        `.trim()
    }
];
