javascript
// ============================================================
// 5. ZOBRAZENÍ HISTORIE VIDEÍ
// ============================================================

function displayHistoryVideos(videos) {

    const container =
        document.getElementById(
            "chaos-opinion-history"
        );

    if (!container) {

        console.error(
            "CHAOS TREND: kontejner historie nebyl nalezen."
        );

        return;
    }

    container.innerHTML = "";

    /*
        VIDEO 0
        = nejnovější video
        = velké hlavní okno

        VIDEO 1+
        = historická malá okna
    */

    if (!Array.isArray(videos) || videos.length < 2) {

        console.log(
            "CHAOS TREND: Zatím není dost historických videí."
        );

        return;
    }

    for (
        let i = 1;
        i < videos.length;
        i++
    ) {

        const video = videos[i];

        if (!video || !video.id) {
            continue;
        }

        // ----------------------------------------------------
        // KARTA VIDEA
        // ----------------------------------------------------

        const item =
            document.createElement("div");

        item.className =
            "chaos-opinion-item";


        // ----------------------------------------------------
        // NÁHLED VIDEA
        // ----------------------------------------------------

        const preview =
            document.createElement("div");

        preview.className =
            "chaos-opinion-preview";

        preview.setAttribute(
            "role",
            "button"
        );

        preview.setAttribute(
            "tabindex",
            "0"
        );

        preview.setAttribute(
            "aria-label",
            "Přehrát video: " + video.title
        );


        // ----------------------------------------------------
        // OBRÁZEK Z YOUTUBE
        // ----------------------------------------------------

        const image =
            document.createElement("img");

        image.src =
            video.thumbnail ||
            "https://i.ytimg.com/vi/" +
            video.id +
            "/hqdefault.jpg";

        image.alt =
            video.title ||
            "Video CHAOS TREND";

        image.loading =
            "lazy";


        // ----------------------------------------------------
        // PLAY
        // ----------------------------------------------------

        const play =
            document.createElement("div");

        play.className =
            "chaos-opinion-play";

        play.innerHTML =
            "▶";

        play.setAttribute(
            "aria-hidden",
            "true"
        );


        preview.appendChild(
            image
        );

        preview.appendChild(
            play
        );


        // ----------------------------------------------------
        // OTEVŘENÍ VIDEA KLIKNUTÍM
        // ----------------------------------------------------

        function openVideo() {

            openChaosOpinionVideo(
                video
            );

        }

        preview.addEventListener(
            "click",
            openVideo
        );


        // ----------------------------------------------------
        // OTEVŘENÍ KLÁVESOU ENTER / MEZERNÍK
        // ----------------------------------------------------

        preview.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    openVideo();

                }

            }
        );


        item.appendChild(
            preview
        );


        // ----------------------------------------------------
        // NÁZEV VIDEA
        // ----------------------------------------------------

        const title =
            document.createElement("div");

        title.className =
            "chaos-opinion-title";

        title.textContent =
            video.title ||
            "Video CHAOS TREND";

        item.appendChild(
            title
        );


        // ----------------------------------------------------
        // DATUM
        // ----------------------------------------------------

        const date =
            document.createElement("div");

        date.className =
            "chaos-opinion-date";

        date.textContent =
            formatDate(
                video.date
            );

        item.appendChild(
            date
        );


        // ----------------------------------------------------
        // ODKAZ NA YOUTUBE
        // ----------------------------------------------------

        const youtubeLink =
            document.createElement("a");

        youtubeLink.className =
            "chaos-opinion-youtube";

        youtubeLink.href =
            video.url ||
            "https://www.youtube.com/watch?v=" +
            video.id;

        youtubeLink.target =
            "_blank";

        youtubeLink.rel =
            "noopener noreferrer";

        youtubeLink.textContent =
            "YouTube ↗";

        item.appendChild(
            youtubeLink
        );


        // ----------------------------------------------------
        // PŘIDÁNÍ KARTY DO HISTORIE
        // ----------------------------------------------------

        container.appendChild(
            item
        );


        console.log(
            "CHAOS TREND: HISTORICKÉ VIDEO:",
            video.title,
            video.id,
            video.date
        );
    }
}


// ============================================================
// 5A. OTEVŘENÍ HISTORICKÉHO VIDEA VE VELKÉM OKNĚ
// ============================================================

function openChaosOpinionVideo(video) {

    if (!video || !video.id) {

        console.error(
            "CHAOS TREND: Nelze otevřít video – chybí ID."
        );

        return;
    }


    let modal =
        document.getElementById(
            "chaos-opinion-modal"
        );


    // --------------------------------------------------------
    // VYTVOŘENÍ MODÁLNÍHO OKNA
    // --------------------------------------------------------

    if (!modal) {

        modal =
            document.createElement("div");

        modal.id =
            "chaos-opinion-modal";

        modal.className =
            "chaos-opinion-modal";

        modal.innerHTML = `

            <div class="chaos-opinion-modal-box">

                <button
                    class="chaos-opinion-modal-close"
                    type="button"
                    aria-label="Zavřít video">
                    ✕
                </button>

                <div class="chaos-opinion-modal-frame">

                    <iframe
                        id="chaos-opinion-modal-video"
                        title="Video CHAOS TREND"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen>
                    </iframe>

                </div>

                <div
                    id="chaos-opinion-modal-title"
                    class="chaos-opinion-modal-title">
                </div>

                <a
                    id="chaos-opinion-modal-youtube"
                    class="chaos-opinion-modal-youtube"
                    target="_blank"
                    rel="noopener noreferrer">
                    ▶ Otevřít video na YouTube
                </a>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        // ----------------------------------------------------
        // ZAVŘENÍ TLAČÍTKEM
        // ----------------------------------------------------

        const closeButton =
            modal.querySelector(
                ".chaos-opinion-modal-close"
            );

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeChaosOpinionVideo
            );

        }


        // ----------------------------------------------------
        // ZAVŘENÍ KLIKNUTÍM MIMO VIDEO
        // ----------------------------------------------------

        modal.addEventListener(
            "click",
            function(event) {

                if (
                    event.target === modal
                ) {

                    closeChaosOpinionVideo();

                }

            }
        );

    }


    // --------------------------------------------------------
    // PRVKY MODÁLNÍHO OKNA
    // --------------------------------------------------------

    const iframe =
        document.getElementById(
            "chaos-opinion-modal-video"
        );

    const title =
        document.getElementById(
            "chaos-opinion-modal-title"
        );

    const youtubeLink =
        document.getElementById(
            "chaos-opinion-modal-youtube"
        );


    if (!iframe) {

        console.error(
            "CHAOS TREND: přehrávač modálního okna nebyl nalezen."
        );

        return;
    }


    // --------------------------------------------------------
    // NAČTENÍ VIDEA
    // --------------------------------------------------------

    iframe.src =
        "https://www.youtube.com/embed/" +
        encodeURIComponent(video.id) +
        "?autoplay=1&playsinline=1&rel=0";

    iframe.title =
        video.title ||
        "Video CHAOS TREND";


    if (title) {

        title.textContent =
            video.title ||
            "Video CHAOS TREND";

    }


    if (youtubeLink) {

        youtubeLink.href =
            video.url ||
            "https://www.youtube.com/watch?v=" +
            video.id;

    }


    // --------------------------------------------------------
    // OTEVŘENÍ
    // --------------------------------------------------------

    modal.classList.add(
        "is-open"
    );

    document.body.style.overflow =
        "hidden";


    console.log(
        "CHAOS TREND: otevřeno historické video:",
        video.title,
        video.id
    );
}


// ============================================================
// 5B. ZAVŘENÍ VELKÉHO OKNA
// ============================================================

function closeChaosOpinionVideo() {

    const modal =
        document.getElementById(
            "chaos-opinion-modal"
        );

    if (!modal) {
        return;
    }


    const iframe =
        document.getElementById(
            "chaos-opinion-modal-video"
        );


    // Zastavení videa odstraněním zdroje iframe
    if (iframe) {

        iframe.src =
            "";

    }


    modal.classList.remove(
        "is-open"
    );


    document.body.style.overflow =
        "";


    console.log(
        "CHAOS TREND: historické video zavřeno."
    );
}


// ============================================================
// 5C. ZAVŘENÍ KLÁVESOU ESC
// ============================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeChaosOpinionVideo();

        }

    }
);
```
