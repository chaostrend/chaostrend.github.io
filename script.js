// ===========================================================
// CHAOS TREND – AUTOMATICKÁ YOUTUBE VIDEA
// JAK TO VIDÍ ČÁP?
// ===========================================================


// ============================================================
// API KLÍČ
// ============================================================

const YOUTUBE_API_KEY = "AIzaSyCbO-FprtNOl_3tKRsr3c7nJIK0hl7n5Mw";


// ============================================================
// PLAYLIST PRO „JAK TO VIDÍ ČÁP?“
// ============================================================

const YOUTUBE_PLAYLIST_ID = "PLYU2NhaIDiV8";


// ============================================================
// INFORMAČNÍ BUBLINKA
// ============================================================

const CHAOS_INFO_ACCEPTED_KEY =
    "chaosTrendInfoAccepted";


// ============================================================
// 1. NAČTENÍ VIDEÍ Z KONKRÉTNÍHO PLAYLISTU
// ============================================================

async function getChaosOpinionPlaylistVideos() {

    const url =
        "https://www.googleapis.com/youtube/v3/playlistItems" +
        "?part=snippet,contentDetails" +
        "&playlistId=" +
        encodeURIComponent(YOUTUBE_PLAYLIST_ID) +
        "&maxResults=50" +
        "&key=" +
        encodeURIComponent(YOUTUBE_API_KEY);


    const response =
        await fetch(url);


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            "Playlist YouTube se nepodařilo načíst. " +
            response.status +
            " " +
            errorText
        );

    }


    const data =
        await response.json();


    return data.items || [];

}


// ============================================================
// 2. PŘÍPRAVA VIDEÍ
// ============================================================

function prepareYouTubeVideos(items) {

    return items

        .map(function(item) {

            const videoId =
                item.contentDetails?.videoId ||
                item.snippet?.resourceId?.videoId;


            if (!videoId) {

                return null;

            }


            const thumbnails =
                item.snippet?.thumbnails || {};


            const thumbnail =
                thumbnails.maxres?.url ||
                thumbnails.standard?.url ||
                thumbnails.high?.url ||
                thumbnails.medium?.url ||
                thumbnails.default?.url ||
                "";


            return {

                id: videoId,

                title:
                    item.snippet?.title ||
                    "Video CHAOS TREND",

                date:
                    item.contentDetails?.videoPublishedAt ||
                    item.snippet?.publishedAt ||
                    "",

                thumbnail:
                    thumbnail,

                url:
                    "https://www.youtube.com/watch?v=" +
                    videoId

            };

        })

        .filter(function(video) {

            return video !== null;

        });

}


// ============================================================
// 3. SEŘAZENÍ PODLE DATA
// ============================================================

function sortVideosByDate(videos) {

    return videos.sort(function(a, b) {

        return new Date(b.date) -
               new Date(a.date);

    });

}


// ============================================================
// 4. ZOBRAZENÍ HLAVNÍHO VIDEA
// ============================================================

function displayMainVideo(video) {

    const iframe =
        document.getElementById(
            "chaos-opinion-main-video"
        );


    const placeholder =
        document.getElementById(
            "chaos-opinion-placeholder"
        );


    if (!iframe || !video) {

        console.error(
            "CHAOS TREND: hlavní video nebo jeho kontejner nebyl nalezen."
        );

        return;

    }


    iframe.src =
        "https://www.youtube.com/embed/" +
        video.id +
        "?autoplay=0&mute=1&playsinline=1&rel=0";


    iframe.title =
        video.title;


    iframe.style.display =
        "block";


    if (placeholder) {

        placeholder.style.display =
            "none";

    }


    console.log(
        "CHAOS TREND: HLAVNÍ VIDEO:",
        video.title,
        video.id,
        video.date
    );

}


// ============================================================
// 4.5 ZNĚLKA PŘED PŘEPNUTÍM VIDEA
// ============================================================

const chaosTrendJingle =
    new Audio("znelka.m4a");


chaosTrendJingle.preload =
    "auto";


function playJingleThenVideo(video) {

    if (!video) {

        return;

    }


    console.log(
        "CHAOS TREND: spouštím znělku:",
        video.title
    );


    chaosTrendJingle.pause();


    chaosTrendJingle.currentTime =
        0;


    chaosTrendJingle.onended =
        function() {

            displayMainVideo(video);

        };


    const playPromise =
        chaosTrendJingle.play();


    if (playPromise !== undefined) {

        playPromise.catch(
            function(error) {

                console.error(
                    "CHAOS TREND: znělku se nepodařilo spustit:",
                    error
                );


                displayMainVideo(video);

            }
        );

    }

}


// ============================================================
// 4.6 INFORMAČNÍ BUBLINKA
//
// DŮLEŽITÉ:
// Bublina se NEVKLÁDÁ do karty videa.
// Vkládá se přímo do BODY stránky.
// Tím ji nemůže překrýt YouTube iframe ani clickOverlay.
// ============================================================

function showChaosInfoBubble(
    video
) {

    // --------------------------------------------------------
    // Pokud už nějaká bublina existuje, odstraníme ji
    // --------------------------------------------------------

    const oldBubble =
        document.getElementById(
            "chaos-info-overlay"
        );


    if (oldBubble) {

        oldBubble.remove();

    }


    // --------------------------------------------------------
    // CELOPLOŠNÝ OBAL
    // --------------------------------------------------------

    const overlay =
        document.createElement("div");


    overlay.id =
        "chaos-info-overlay";


    overlay.style.position =
        "fixed";


    overlay.style.left =
        "0";


    overlay.style.top =
        "0";


    overlay.style.right =
        "0";


    overlay.style.bottom =
        "0";


    overlay.style.width =
        "100vw";


    overlay.style.height =
        "100vh";


    overlay.style.background =
        "rgba(0, 0, 0, 0.55)";


    overlay.style.display =
        "flex";


    overlay.style.alignItems =
        "center";


    overlay.style.justifyContent =
        "center";


    overlay.style.zIndex =
        "2147483647";


    overlay.style.pointerEvents =
        "auto";


    overlay.style.boxSizing =
        "border-box";


    overlay.style.padding =
        "20px";


    // --------------------------------------------------------
    // VLASTNÍ BUBLINKA
    // --------------------------------------------------------

    const bubble =
        document.createElement("div");


    bubble.className =
        "chaos-info-bubble";


    bubble.style.position =
        "relative";


    bubble.style.width =
        "min(90vw, 420px)";


    bubble.style.maxWidth =
        "420px";


    bubble.style.boxSizing =
        "border-box";


    bubble.style.padding =
        "25px";


    bubble.style.background =
        "rgba(0, 0, 0, 0.97)";


    bubble.style.color =
        "white";


    bubble.style.border =
        "2px solid white";


    bubble.style.borderRadius =
        "16px";


    bubble.style.textAlign =
        "center";


    bubble.style.boxShadow =
        "0 10px 40px rgba(0,0,0,0.7)";


    bubble.style.pointerEvents =
        "auto";


    // --------------------------------------------------------
    // TEXT
    // --------------------------------------------------------

    const text =
        document.createElement("div");


    text.className =
        "chaos-info-text";


    text.innerHTML =
        "<strong style=\"font-size:20px;\">" +
        "ℹ️ Jak to funguje?" +
        "</strong>" +

        "<br><br>" +

        "<span style=\"font-size:16px; line-height:1.6;\">" +

        "Po kliknutí na toto video se nejprve přehraje " +
        "znělka. Potom se video otevře ve velkém okně nahoře." +

        "<br><br>" +

        "Pro poslech nahrávky je potřeba potvrdit " +
        "symbol 🔊 reproduktoru." +

        "</span>";


    bubble.appendChild(
        text
    );


    // --------------------------------------------------------
    // TLAČÍTKO
    // --------------------------------------------------------

    const button =
        document.createElement("button");


    button.type =
        "button";


    button.textContent =
        "Rozumím";


    button.className =
        "chaos-info-button";


    button.style.display =
        "inline-block";


    button.style.marginTop =
        "20px";


    button.style.padding =
        "11px 30px";


    button.style.border =
        "none";


    button.style.borderRadius =
        "8px";


    button.style.background =
        "white";


    button.style.color =
        "black";


    button.style.fontSize =
        "16px";


    button.style.fontWeight =
        "bold";


    button.style.cursor =
        "pointer";


    button.style.pointerEvents =
        "auto";


    button.style.position =
        "relative";


    button.style.zIndex =
        "2147483647";


    // --------------------------------------------------------
    // KLIKNUTÍ NA „ROZUMÍM“
    // --------------------------------------------------------

    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            console.log(
                "CHAOS TREND: uživatel klikl na ROZUMÍM."
            );


            // ------------------------------------------------
            // ULOŽENÍ POTVRZENÍ
            // ------------------------------------------------

            try {

                localStorage.setItem(
                    CHAOS_INFO_ACCEPTED_KEY,
                    "true"
                );


            } catch (error) {

                console.warn(
                    "CHAOS TREND: localStorage není dostupné.",
                    error
                );

            }


            // ------------------------------------------------
            // ODSTRANĚNÍ BUBLINY
            // ------------------------------------------------

            overlay.remove();


            // ------------------------------------------------
            // SPUŠTĚNÍ ZNĚLKY
            // ------------------------------------------------

            playJingleThenVideo(
                video
            );

        }
    );


    bubble.appendChild(
        button
    );


    // --------------------------------------------------------
    // BUBLINU VLOŽÍME DO CELOPLOŠNÉHO OVERLAYE
    // --------------------------------------------------------

    overlay.appendChild(
        bubble
    );


    // --------------------------------------------------------
    // OVERLAY VLOŽÍME PŘÍMO DO BODY
    // --------------------------------------------------------

    document.body.appendChild(
        overlay
    );


    console.log(
        "CHAOS TREND: informační bublina zobrazena nad celou stránkou."
    );

}


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


    container.innerHTML =
        "";


    /*
        VIDEO 0
        = nejnovější video
        = velké hlavní okno


        VIDEO 1
        = první historické okno


        VIDEO 2
        = druhé historické okno


        VIDEO 3
        = třetí historické okno


        atd.
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


        item.style.cursor =
            "pointer";


        item.style.position =
            "relative";


        // ----------------------------------------------------
        // ZAMEZENÍ TEXTOVÉMU KURZORU
        // ----------------------------------------------------

        item.style.userSelect =
            "none";


        item.style.webkitUserSelect =
            "none";


        item.style.mozUserSelect =
            "none";


        item.style.msUserSelect =
            "none";


        item.style.caretColor =
            "transparent";


        item.setAttribute(
            "unselectable",
            "on"
        );


        // ----------------------------------------------------
        // KLIKACÍ VRSTVA
        // ----------------------------------------------------

        const clickOverlay =
            document.createElement("div");


        clickOverlay.style.position =
            "absolute";


        clickOverlay.style.inset =
            "0";


        clickOverlay.style.cursor =
            "pointer";


        clickOverlay.style.zIndex =
            "10";


        clickOverlay.style.pointerEvents =
            "auto";


        clickOverlay.style.userSelect =
            "none";


        clickOverlay.style.webkitUserSelect =
            "none";


        clickOverlay.style.mozUserSelect =
            "none";


        clickOverlay.style.msUserSelect =
            "none";


        clickOverlay.style.caretColor =
            "transparent";


        clickOverlay.tabIndex =
            -1;


        // ----------------------------------------------------
        // MOUSEDOWN
        // ----------------------------------------------------

        clickOverlay.addEventListener(
            "mousedown",
            function(event) {

                event.preventDefault();

            }
        );


        // ----------------------------------------------------
        // KLIKNUTÍ NA HISTORICKÉ VIDEO
        // ----------------------------------------------------

        clickOverlay.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                let infoAccepted =
                    false;


                try {

                    infoAccepted =
                        localStorage.getItem(
                            CHAOS_INFO_ACCEPTED_KEY
                        ) === "true";


                } catch (error) {

                    console.warn(
                        "CHAOS TREND: localStorage není dostupné.",
                        error
                    );

                }


                // ------------------------------------------------
                // PRVNÍ KLIKNUTÍ
                // ------------------------------------------------

                if (!infoAccepted) {

                    showChaosInfoBubble(
                        video
                    );


                    return;

                }


                // ------------------------------------------------
                // DALŠÍ KLIKNUTÍ
                // ------------------------------------------------

                playJingleThenVideo(
                    video
                );

            }
        );


        item.appendChild(
            clickOverlay
        );


        // ----------------------------------------------------
        // YOUTUBE IFRAME
        // ----------------------------------------------------

        const iframe =
            document.createElement("iframe");


        iframe.src =
            "https://www.youtube.com/embed/" +
            video.id +
            "?autoplay=0&mute=1&playsinline=1&rel=0";


        iframe.title =
            video.title;


        iframe.loading =
            "lazy";


        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";


        iframe.allowFullscreen =
            true;


        iframe.tabIndex =
            -1;


        item.appendChild(
            iframe
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


        title.style.userSelect =
            "none";


        title.style.webkitUserSelect =
            "none";


        title.style.caretColor =
            "transparent";


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
            formatDate(video.date);


        date.style.userSelect =
            "none";


        date.style.webkitUserSelect =
            "none";


        date.style.caretColor =
            "transparent";


        item.appendChild(
            date
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
// 6. FORMÁT DATA
// ============================================================

function formatDate(date) {

    if (!date) {

        return "";

    }


    return new Date(date)
        .toLocaleDateString(
            "cs-CZ",
            {
                day: "numeric",
                month: "numeric",
                year: "numeric"
            }
        );

}


// ============================================================
// 7. HLAVNÍ FUNKCE
// ============================================================

async function loadChaosTrendYouTube() {

    try {

        console.log(
            "CHAOS TREND: načítám playlist „Jak to vidí Čáp?“..."
        );


        const items =
            await getChaosOpinionPlaylistVideos();


        console.log(
            "CHAOS TREND: počet položek v playlistu:",
            items.length
        );


        let videos =
            prepareYouTubeVideos(items);


        videos =
            sortVideosByDate(videos);


        console.log(
            "CHAOS TREND: videa seřazená podle data:",
            videos
        );


        window.chaosTrendYouTubeVideos =
            videos;


        if (videos.length > 0) {

            displayMainVideo(
                videos[0]
            );

        }


        displayHistoryVideos(
            videos
        );


        console.log(
            "CHAOS TREND: playlist „Jak to vidí Čáp?“ byl úspěšně načten."
        );


    } catch (error) {

        console.error(
            "CHAOS TREND – chyba YouTube API:",
            error
        );

    }

}


// ============================================================
// START
// ============================================================

loadChaosTrendYouTube();


// ============================================================
// CHAOS TREND – HODINY A DATUM
// ============================================================

function updateChaosClock() {

    const now =
        new Date();


    const hours =
        now.getHours();


    const minutes =
        now.getMinutes();


    const seconds =
        now.getSeconds();


    const hourAngle =
        ((hours % 12) * 30) +
        (minutes * 0.5);


    const minuteAngle =
        (minutes * 6) +
        (seconds * 0.1);


    const secondAngle =
        seconds * 6;


    const hourHand =
        document.getElementById(
            "clock-hour-hand"
        );


    const minuteHand =
        document.getElementById(
            "clock-minute-hand"
        );


    const secondHand =
        document.getElementById(
            "clock-second-hand"
        );


    if (hourHand) {

        hourHand.style.transform =
            "rotate(" +
            hourAngle +
            "deg)";

    }


    if (minuteHand) {

        minuteHand.style.transform =
            "rotate(" +
            minuteAngle +
            "deg)";

    }


    if (secondHand) {

        secondHand.style.transform =
            "rotate(" +
            secondAngle +
            "deg)";

    }


    const pad =
        function(number) {

            return String(number)
                .padStart(2, "0");

        };


    const digitalClock =
        document.getElementById(
            "chaos-digital-clock"
        );


    if (digitalClock) {

        digitalClock.textContent =
            pad(hours) +
            ":" +
            pad(minutes) +
            ":" +
            pad(seconds);

    }


    const dateElement =
        document.getElementById(
            "chaos-date"
        );


    if (dateElement) {

        dateElement.textContent =
            now.toLocaleDateString(
                "cs-CZ",
                {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric"
                }
            );

    }

}


updateChaosClock();


setInterval(
    updateChaosClock,
    1000
);
