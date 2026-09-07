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

                thumbnail: thumbnail,

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


        clickOverlay.addEventListener(
            "click",
            function() {

                playJingleThenVideo(video);

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
