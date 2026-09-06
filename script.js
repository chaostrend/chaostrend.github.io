// ============================================================
// CHAOS TREND – AUTOMATICKÁ YOUTUBE VIDEA
// ============================================================


// ============================================================
// API KLÍČ
// ============================================================

const YOUTUBE_API_KEY = "SEM_VLOZ_SVŮJ_API_KLÍČ";


// ============================================================
// YOUTUBE KANÁL
// ============================================================

const YOUTUBE_HANDLE = "@josefcap153";


// ============================================================
// 1. ZÍSKÁNÍ UPLOADS PLAYLISTU
// ============================================================

async function getYouTubeUploadsPlaylist() {

    const url =
        "https://www.googleapis.com/youtube/v3/channels" +
        "?part=contentDetails" +
        "&forHandle=" +
        encodeURIComponent(YOUTUBE_HANDLE) +
        "&key=" +
        encodeURIComponent(YOUTUBE_API_KEY);

    const response = await fetch(url);

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            "YouTube kanál se nepodařilo načíst. " +
            response.status +
            " " +
            errorText
        );

    }

    const data = await response.json();

    if (
        !data.items ||
        data.items.length === 0
    ) {

        throw new Error(
            "YouTube kanál nebyl nalezen."
        );

    }

    return data.items[0]
        .contentDetails
        .relatedPlaylists
        .uploads;

}


// ============================================================
// 2. NAČTENÍ VIDEÍ
// ============================================================

async function getLatestYouTubeVideos(
    uploadsPlaylistId
) {

    const url =
        "https://www.googleapis.com/youtube/v3/playlistItems" +
        "?part=snippet,contentDetails" +
        "&playlistId=" +
        encodeURIComponent(uploadsPlaylistId) +
        "&maxResults=10" +
        "&key=" +
        encodeURIComponent(YOUTUBE_API_KEY);


    const response = await fetch(url);


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            "Videa z YouTube se nepodařilo načíst. " +
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
// 3. PŘÍPRAVA VIDEÍ
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
        "CHAOS TREND: hlavní video:",
        video.title,
        video.id
    );

}


// ============================================================
// 5. ZOBRAZENÍ MALÝCH VIDEÍ
// ============================================================

function displayHistoryVideos(videos) {

    const container =
        document.getElementById(
            "chaos-opinion-history"
        );


    if (!container) {

        console.error(
            "CHAOS TREND: kontejner malých videí nebyl nalezen."
        );

        return;

    }


    container.innerHTML = "";


    /*
        VIDEO 0
        = nejnovější video
        = velké hlavní okno


        VIDEO 1
        = první malé okno


        VIDEO 2
        = druhé malé okno


        VIDEO 3
        = třetí malé okno


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
        // KARTA MALÉHO VIDEA
        // ----------------------------------------------------

        const item =
            document.createElement("div");


        item.className =
            "chaos-opinion-item";


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
            "CHAOS TREND: malé video:",
            video.title,
            video.id
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
            "CHAOS TREND: načítám YouTube videa..."
        );


        // ----------------------------------------------------
        // ZÍSKÁNÍ UPLOADS PLAYLISTU
        // ----------------------------------------------------

        const uploadsPlaylist =
            await getYouTubeUploadsPlaylist();


        console.log(
            "CHAOS TREND: uploads playlist:",
            uploadsPlaylist
        );


        // ----------------------------------------------------
        // NAČTENÍ VIDEÍ
        // ----------------------------------------------------

        const items =
            await getLatestYouTubeVideos(
                uploadsPlaylist
            );


        console.log(
            "CHAOS TREND: počet položek z YouTube:",
            items.length
        );


        // ----------------------------------------------------
        // PŘÍPRAVA DAT
        // ----------------------------------------------------

        const videos =
            prepareYouTubeVideos(items);


        console.log(
            "CHAOS TREND: načtená videa:",
            videos
        );


        // ----------------------------------------------------
        // ULOŽENÍ DO WINDOW
        // ----------------------------------------------------

        window.chaosTrendYouTubeVideos =
            videos;


        // ----------------------------------------------------
        // HLAVNÍ VIDEO
        // ----------------------------------------------------

        if (videos.length > 0) {

            displayMainVideo(
                videos[0]
            );

        }


        // ----------------------------------------------------
        // MALÁ VIDEA
        // ----------------------------------------------------

        displayHistoryVideos(
            videos
        );


        // ----------------------------------------------------
        // ÚSPĚŠNÉ NAČTENÍ
        // ----------------------------------------------------

        console.log(
            "CHAOS TREND: YouTube API funguje."
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
