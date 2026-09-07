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


    for (
        let i = 1;
        i < videos.length;
        i++
    ) {

        const video =
            videos[i];


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


        // Obrázek z YouTube
        const image =
            document.createElement("img");


        image.src =
            video.thumbnail;


        image.alt =
            video.title;


        image.loading =
            "lazy";


        // ----------------------------------------------------
        // TLAČÍTKO PLAY
        // ----------------------------------------------------

        const play =
            document.createElement("div");


        play.className =
            "chaos-opinion-play";


        play.innerHTML =
            "▶";


        preview.appendChild(
            image
        );


        preview.appendChild(
            play
        );


        // ----------------------------------------------------
        // KLIKNUTÍ NA NÁHLED
        // ----------------------------------------------------

        preview.addEventListener(
            "click",
            function() {

                openChaosOpinionVideo(
                    video
                );

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
            video.title;


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
            video.url;


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
        // PŘIDÁNÍ DO HISTORIE
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
// 5A. OTEVŘENÍ VIDEA VE VELKÉM OKNĚ
// ============================================================

function openChaosOpinionVideo(video) {

    let modal =
        document.getElementById(
            "chaos-opinion-modal"
        );


    // Pokud modal ještě neexistuje, vytvoříme ho
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


        closeButton.addEventListener(
            "click",
            closeChaosOpinionVideo
        );


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


    const iframe =
        document.getElementById(
            "chaos-opinion-modal-video"
        );


    const title =
        document.getElementById(
            "chaos-opinion-modal-title"
        );


    iframe.src =
        "https://www.youtube.com/embed/" +
        video.id +
        "?autoplay=1&playsinline=1&rel=0";


    iframe.title =
        video.title;


    title.textContent =
        video.title;


    modal.classList.add(
        "is-open"
    );


    document.body.style.overflow =
        "hidden";

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


    if (iframe) {

        iframe.src =
            "";

    }


    modal.classList.remove(
        "is-open"
    );


    document.body.style.overflow =
        "";

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
