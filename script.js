javascript
// ============================================================
// CHAOS TREND – AUTOMATICKÁ YOUTUBE VIDEA
// ============================================================

const YOUTUBE_API_KEY = "AIzaSyCbO-FprtNOl_3tKRsr3c7nJIK0hl7n5Mw";

const YOUTUBE_HANDLE = "@josefcap153";


// ============================================================
// 1. ZÍSKÁNÍ UPLOADS PLAYLISTU
// ============================================================

async function getYouTubeUploadsPlaylist() {

    const url =
        "https://www.googleapis.com/youtube/v3/channels" +
        "?part=contentDetails" +
        "&forHandle=" + encodeURIComponent(YOUTUBE_HANDLE) +
        "&key=" + encodeURIComponent(YOUTUBE_API_KEY);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Nepodařilo se načíst YouTube kanál.");
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        throw new Error("YouTube kanál nebyl nalezen.");
    }

    return data.items[0].contentDetails.relatedPlaylists.uploads;
}


// ============================================================
// 2. NAČTENÍ 10 NEJNOVĚJŠÍCH VIDEÍ
// ============================================================

async function getLatestYouTubeVideos(uploadsPlaylistId) {

    const url =
        "https://www.googleapis.com/youtube/v3/playlistItems" +
        "?part=snippet,contentDetails" +
        "&playlistId=" + encodeURIComponent(uploadsPlaylistId) +
        "&maxResults=10" +
        "&key=" + encodeURIComponent(YOUTUBE_API_KEY);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Nepodařilo se načíst videa z YouTube.");
    }

    const data = await response.json();

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

            return {

                id: videoId,

                title:
                    item.snippet?.title ||
                    "Video CHAOS TREND",

                date:
                    item.contentDetails?.videoPublishedAt ||
                    item.snippet?.publishedAt ||
                    ""

            };

        })
        .filter(function(video) {
            return video !== null;
        });
}


// ============================================================
// 4. HLAVNÍ VIDEO
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

}


// ============================================================
// 5. MALÁ VIDEA
// ============================================================

function displayHistoryVideos(videos) {

    const container =
        document.getElementById(
            "chaos-opinion-history"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    /*
       VIDEO 0 = velké hlavní video

       VIDEO 1 = první malé okno
       VIDEO 2 = druhé malé okno
       VIDEO 3 = třetí malé okno
       ...
    */


    for (
        let i = 1;
        i < videos.length;
        i++
    ) {

        const video =
            videos[i];


        const windowElement =
            document.createElement("div");

        windowElement.className =
            "chaos-opinion-item";


        // ----------------------------------------------------
        // YOUTUBE VIDEO
        // ----------------------------------------------------

        const iframe =
            document.createElement("iframe");

        iframe.src =
            "https://www.youtube.com/embed/" +
            video.id +
            "?autoplay=0&mute=1&playsinline=1&rel=0";

        iframe.title =
            video.title;

        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

        iframe.allowFullscreen =
            true;


        windowElement.appendChild(
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


        windowElement.appendChild(
            date
        );


        container.appendChild(
            windowElement
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

    return new Date(date).toLocaleDateString(
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


        const uploadsPlaylist =
            await getYouTubeUploadsPlaylist();


        console.log(
            "CHAOS TREND: uploads playlist:",
            uploadsPlaylist
        );


        const items =
            await getLatestYouTubeVideos(
                uploadsPlaylist
            );


        const videos =
            prepareYouTubeVideos(items);


        console.log(
            "CHAOS TREND: načtená videa:",
            videos
        );


        window.chaosTrendYouTubeVideos =
            videos;


        // ----------------------------------------------------
        // VIDEO 1 → VELKÉ OKNO
        // ----------------------------------------------------

        if (videos.length > 0) {

            displayMainVideo(
                videos[0]
            );

        }


        // ----------------------------------------------------
        // VIDEO 2–10 → MALÁ OKNA
        // ----------------------------------------------------

        displayHistoryVideos(
            videos
        );


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
```
