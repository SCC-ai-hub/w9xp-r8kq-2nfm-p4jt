/**
 * BIO documents gallery registry — single source for all gallery data.
 *
 * To add a document image:
 *   1. Place the image file in BIO/documents/ (zero-padded name, e.g. 06.jpg)
 *   2. Append one object to BIO_DOCUMENTS below, in display order
 *
 * Fields per entry:
 *   file      — filename inside BIO/documents/
 *   aspect    — width/height (premeasured; used for equal thumb visual gaps)
 *   captionIt — Italian description (multiline template literal)
 *   captionEn — English description (multiline template literal)
 */
window.BIO_DOCUMENTS = [
    {
        file: '01.jpg',
        aspect: 1.28,
        captionIt: `
            Mostra “L’artista e la contemporaneità”. Mosca, 1987.
            Da sinistra a destra:
            Jurij El’perin, Friedrich Dürrenmatt, la signora Dürrenmatt, Dmitrij Prigov, Grisha Bruskin.
        `.trim(),
        captionEn: `
            Exhibition “The Artist and His Contemporaneity”. Moscow, 1987.
            From left to right:
            Yury Elperin, Friedrich Dürrenmatt, Mrs. Dürrenmatt, Dmitry Prigov, Grisha Bruskin.
        `.trim()
    },
    {
        file: '02.jpg',
        aspect: 1.3624,
        captionIt: `
            Il Presidente e il Consiglio di Amministrazione di Sotheby’s
            hanno il piacere di invitarLa
            alla mostra organizzata in occasione della prima Asta Internazionale d’Arte che si terrà a Mosca.

            La mostra sarà allestita presso il Sovincentr e sarà aperta al pubblico
            da sabato 2 luglio a mercoledì 6 luglio,
            dalle ore 10.00 alle ore 18.00 di ogni giorno.

            Sono inoltre previste aperture serali straordinarie
            sabato, lunedì e martedì 2, 4 e 5 luglio,
            dalle ore 21.00 alle ore 22.30.

            12 Krasnopresnenskaja Embankment.

            Si prega di portare con sé il presente invito.
        `.trim(),
        captionEn: `
            The President and the Board of Directors of Sotheby’s
            have the pleasure of inviting you
            to the exhibition organized on the occasion of the first International Art Auction to be held in Moscow.

            The exhibition will be held at Sovincentr and will be open to the public
            from Saturday, July 2, through Wednesday, July 6,
            from 10:00 a.m. to 6:00 p.m. each day.

            Special evening openings will also be held
            on Saturday, Monday, and Tuesday, July 2, 4, and 5,
            from 9:00 p.m. to 10:30 p.m.

            12 Krasnopresnenskaya Embankment.

            Please bring this invitation with you.
        `.trim(),
        /* EN absent from _SOURCE/.../Documenti/2/dida2.docx (IT only) — likely auto-translated */
        aiTranslatedEn: true,
        aiIdEn: 'docs-sotheby-invite-en'
    },
    {
        file: '03.jpg',
        aspect: 1.3665,
        captionIt: `
            Il Presidente e il Consiglio di Amministrazione di Sotheby’s
            hanno il piacere di invitarLa
            alla mostra organizzata in occasione della prima Asta Internazionale d’Arte che si terrà a Mosca.

            La mostra sarà allestita presso il Sovincentr e sarà aperta al pubblico
            da sabato 2 luglio a mercoledì 6 luglio,
            dalle ore 10.00 alle ore 18.00 di ogni giorno.

            Sono inoltre previste aperture serali straordinarie
            sabato, lunedì e martedì 2, 4 e 5 luglio,
            dalle ore 21.00 alle ore 22.30.

            12 Krasnopresnenskaja Embankment.

            Si prega di portare con sé il presente invito.
        `.trim(),
        captionEn: `
            The President and the Board of Directors of Sotheby’s
            have the pleasure of inviting you
            to the exhibition organized on the occasion of the first International Art Auction to be held in Moscow.

            The exhibition will be held at Sovincentr and will be open to the public
            from Saturday, July 2, through Wednesday, July 6,
            from 10:00 a.m. to 6:00 p.m. each day.

            Special evening openings will also be held
            on Saturday, Monday, and Tuesday, July 2, 4, and 5,
            from 9:00 p.m. to 10:30 p.m.

            12 Krasnopresnenskaya Embankment.

            Please bring this invitation with you.
        `.trim(),
        aiTranslatedEn: true,
        aiIdEn: 'docs-sotheby-invite-en'
    },
    {
        file: '04.jpg',
        aspect: 0.7089,
        captionIt: ``.trim(),
        captionEn: ``.trim()
    },
    {
        file: '05.jpg',
        aspect: 0.7536,
        captionIt: `
            La mostra “L’artista e la contemporaneità” alla sala espositiva “Na Kaširke”, febbraio 1987.
            Da sinistra a destra: Grisha Bruskin, Evgenij Barabanov e Friedrich Dürrenmatt davanti al dipinto di Grisha Bruskin “Lessico Fondamentale” – prima parte.
        `.trim(),
        captionEn: `
            The exhibition “The Artist and His Contemporaneity” at the “Na Kashirke” Exhibition Hall, February 1987.
            From left to right: Grisha Bruskin, Evgeny Barabanov, and Friedrich Dürrenmatt in front of Grisha Bruskin’s painting “Fundamental Lexicon” – Part I.
        `.trim()
    }
];
