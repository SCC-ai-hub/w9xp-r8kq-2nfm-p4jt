/**
 * BIO documents gallery registry — single source for all gallery data.
 *
 * To add a document image:
 *   1. Place the image under BIO/documents/<N>/…
 *   2. Append one object to BIO_DOCUMENTS below, in display order
 *
 * Fields per entry:
 *   file      — path relative to BIO/documents/
 *   aspect    — width/height (premeasured; used for equal thumb visual gaps)
 *   captionIt — Italian description (same text on every image in a folder)
 *   captionEn — English description (same text on every image in a folder)
 *
 * Captions from dida*.docx. Folder 2: IT only in dida — EN is prior translation.
 * Folders 3 & 12: no dida.
 */
window.BIO_DOCUMENTS = [
    /* --- 1 — dida1.docx --- */
    {
        file: '1/00000001.jpg',
        aspect: 1.28,
        captionIt: `
            Mostra “L’artista e la contemporaneità”. Mosca, 1987
            Da sinistra a destra:
            Jurij El’perin, Friedrich Dürrenmatt, la signora Dürrenmatt, Dmitrij Prigov, Grisha Bruskin
        `.trim(),
        captionEn: `
            Exhibition “The Artist and His Contemporaneity”. Moscow, 1987
            From left to right:
            Yury Elperin, Friedrich Dürrenmatt, Dürrenmatt’s spouse, Dmitry Prigov, Grisha Bruskin
        `.trim()
    },
    {
        file: '1/00000002.jpg',
        aspect: 1.2861,
        captionIt: `
            Mostra “L’artista e la contemporaneità”. Mosca, 1987
            Da sinistra a destra:
            Jurij El’perin, Friedrich Dürrenmatt, la signora Dürrenmatt, Dmitrij Prigov, Grisha Bruskin
        `.trim(),
        captionEn: `
            Exhibition “The Artist and His Contemporaneity”. Moscow, 1987
            From left to right:
            Yury Elperin, Friedrich Dürrenmatt, Dürrenmatt’s spouse, Dmitry Prigov, Grisha Bruskin
        `.trim()
    },
    /* --- 2 — dida2.docx (IT only; EN prior translation) --- */
    {
        file: '2/00000001.jpg',
        aspect: 1.3624,
        captionIt: `
            Il Presidente e il Consiglio di Amministrazione di Sotheby's
            hanno il piacere di invitarLa
            alla mostra organizzata in occasione della prima Asta Internazionale d'Arte che si terrà a Mosca.
            La mostra sarà allestita presso il Sovincentr e sarà aperta al pubblico
            da sabato 2 luglio a mercoledì 6 luglio,
            dalle ore 10.00 alle ore 18.00 di ogni giorno.
            Sono inoltre previste aperture serali straordinarie
            sabato, lunedì e martedì 2, 4 e 5 luglio,
            dalle ore 21.00 alle ore 22.30.
            12 Krasnopresnenskaja Embankment
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
        file: '2/00000002.jpg',
        aspect: 1.3665,
        captionIt: `
            Il Presidente e il Consiglio di Amministrazione di Sotheby's
            hanno il piacere di invitarLa
            alla mostra organizzata in occasione della prima Asta Internazionale d'Arte che si terrà a Mosca.
            La mostra sarà allestita presso il Sovincentr e sarà aperta al pubblico
            da sabato 2 luglio a mercoledì 6 luglio,
            dalle ore 10.00 alle ore 18.00 di ogni giorno.
            Sono inoltre previste aperture serali straordinarie
            sabato, lunedì e martedì 2, 4 e 5 luglio,
            dalle ore 21.00 alle ore 22.30.
            12 Krasnopresnenskaja Embankment
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
    /* --- 3 — no dida --- */
    {
        file: '3/00000001.jpg',
        aspect: 0.7089,
        captionIt: ``.trim(),
        captionEn: ``.trim()
    },
    /* --- 4 — dida4.docx --- */
    {
        file: '4/00000001.jpg',
        aspect: 0.7536,
        captionIt: `
            La mostra “L’artista e la contemporaneità” alla sala espositiva “Na Kaširke”, febbraio 1987
            Da sinistra a destra: Grisha Bruskin, Evgenij Barabanov e Friedrich Dürrenmatt davanti al dipinto di Grisha Bruskin “Lessico Fondamentale” - prima parte
        `.trim(),
        captionEn: `
            The exhibition “The Artist and His Contemporaneity” at the “Na Kashirke” Exhibition Hall, February 1987.
            From left to right: Grisha Bruskin, Evgeny Barabanov, and Friedrich Dürrenmatt in front of Grisha Bruskin's painting
            “Fundamental Lexicon” – Part I
        `.trim()
    },
    {
        file: '4/00000002.jpg',
        aspect: 0.7528,
        captionIt: `
            La mostra “L’artista e la contemporaneità” alla sala espositiva “Na Kaširke”, febbraio 1987
            Da sinistra a destra: Grisha Bruskin, Evgenij Barabanov e Friedrich Dürrenmatt davanti al dipinto di Grisha Bruskin “Lessico Fondamentale” - prima parte
        `.trim(),
        captionEn: `
            The exhibition “The Artist and His Contemporaneity” at the “Na Kashirke” Exhibition Hall, February 1987.
            From left to right: Grisha Bruskin, Evgeny Barabanov, and Friedrich Dürrenmatt in front of Grisha Bruskin's painting
            “Fundamental Lexicon” – Part I
        `.trim()
    },
    /* --- 5 — dida5.docx --- */
    {
        file: '5/00000001.jpg',
        aspect: 1.4433,
        captionIt: `
            Il collezionista Peter Ludwig nello studio. Mosca, 1988
        `.trim(),
        captionEn: `
            The collector Peter Ludwg in the studio. Moscow, 1988
        `.trim()
    },
    {
        file: '5/00000002.jpg',
        aspect: 1.4452,
        captionIt: `
            Il collezionista Peter Ludwig nello studio. Mosca, 1988
        `.trim(),
        captionEn: `
            The collector Peter Ludwg in the studio. Moscow, 1988
        `.trim()
    },
    /* --- 6 — dida6.docx --- */
    {
        file: '6/00000001.jpg',
        aspect: 1.636,
        captionIt: `
            A Grisha, in ricordo delle mostre realizzate insieme alla “Na Kaširke” con l’augurio di altri successi creativi!
            Natal’ja, 29.06.01
        `.trim(),
        captionEn: `
            To Grisha, in remembrance of the exhibitions we held together at "Na Kashirke." Wishing you continued creative success!
            Natalya, 29 June 2001
        `.trim()
    },
    {
        file: '6/00000002.jpg',
        aspect: 1.636,
        captionIt: `
            A Grisha, in ricordo delle mostre realizzate insieme alla “Na Kaširke” con l’augurio di altri successi creativi!
            Natal’ja, 29.06.01
        `.trim(),
        captionEn: `
            To Grisha, in remembrance of the exhibitions we held together at "Na Kashirke." Wishing you continued creative success!
            Natalya, 29 June 2001
        `.trim()
    },
    /* --- 7 — dida7.docx (IT only; EN auto-translated) --- */
    {
        file: '7/00000001.jpg',
        aspect: 1.3125,
        captionIt: `
            Grisha Bruskin. Performance “Nascita di un eroe”. Giugno 1987
            Al centro D. Prigov
        `.trim(),
        captionEn: `
            Grisha Bruskin. Performance “Birth of a Hero”. June 1987
            In the center: D. Prigov
        `.trim(),
        aiTranslatedEn: true,
        aiIdEn: 'docs-nascita-eroe-en'
    },
    {
        file: '7/00000002.jpg',
        aspect: 1.314,
        captionIt: `
            Grisha Bruskin. Performance “Nascita di un eroe”. Giugno 1987
            Al centro D. Prigov
        `.trim(),
        captionEn: `
            Grisha Bruskin. Performance “Birth of a Hero”. June 1987
            In the center: D. Prigov
        `.trim(),
        aiTranslatedEn: true,
        aiIdEn: 'docs-nascita-eroe-en'
    },
    /* --- 8 — dida8.docx --- */
    {
        file: '8/00000001.jpg',
        aspect: 0.6465,
        captionIt: `
            Con Il’ja Kabakov
            Na Kašrike, Mosca, 1987
        `.trim(),
        captionEn: `
            With Ilya Kabakov
            Na Kashirke, Moscow, 1987
        `.trim()
    },
    {
        file: '8/00000002.jpg',
        aspect: 0.6465,
        captionIt: `
            Con Il’ja Kabakov
            Na Kašrike, Mosca, 1987
        `.trim(),
        captionEn: `
            With Ilya Kabakov
            Na Kashirke, Moscow, 1987
        `.trim()
    },
    /* --- 9 — dida9.docx --- */
    {
        file: '9/00000001.jpg',
        aspect: 0.643,
        captionIt: `
            Friedrich Dürrenmatt alla mostra “L’artista e la contemporaneità”
            Sala espositiva “Na Kaširke”, 1987
        `.trim(),
        captionEn: `
            Friedrich Dürrenmatt at the exhibition “The Artist and His Contemporaneity”
            “Na Kashirke” Exhibition hall, 1987
        `.trim()
    },
    {
        file: '9/00000002.jpg',
        aspect: 0.643,
        captionIt: `
            Friedrich Dürrenmatt alla mostra “L’artista e la contemporaneità”
            Sala espositiva “Na Kaširke”, 1987
        `.trim(),
        captionEn: `
            Friedrich Dürrenmatt at the exhibition “The Artist and His Contemporaneity”
            “Na Kashirke” Exhibition hall, 1987
        `.trim()
    },
    /* --- 10 — dida10.docx --- */
    {
        file: '10/00000001.jpg',
        aspect: 1.3693,
        captionIt: `
            Grisha Bruskin e Miloš Forman. Sala espositiva “Na Kaširke”, 1987
        `.trim(),
        captionEn: `
            Grisha Bruskin and Miloš Forman. “Na Kashirke” Exhibition Hall, 1987
        `.trim()
    },
    {
        file: '10/00000002.jpg',
        aspect: 1.3664,
        captionIt: `
            Grisha Bruskin e Miloš Forman. Sala espositiva “Na Kaširke”, 1987
        `.trim(),
        captionEn: `
            Grisha Bruskin and Miloš Forman. “Na Kashirke” Exhibition Hall, 1987
        `.trim()
    },
    /* --- 11 — dida11.docx --- */
    {
        file: '11/00000001.jpg',
        aspect: 1.267,
        captionIt: `
            1987-1988
            Mosca, studio
        `.trim(),
        captionEn: `
            1987-1988
            Moscow, studio
        `.trim()
    },
    {
        file: '11/00000002.jpg',
        aspect: 1.2779,
        captionIt: `
            1987-1988
            Mosca, studio
        `.trim(),
        captionEn: `
            1987-1988
            Moscow, studio
        `.trim()
    },
    /* --- 12 — no dida --- */
    {
        file: '12/00000001.jpg',
        aspect: 1.4985,
        captionIt: ``.trim(),
        captionEn: ``.trim()
    }
];
