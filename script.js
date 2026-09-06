script.js
// ============================================================
// CHAOS TREND – AUTOMATICKÉ NAČÍTÁNÍ VIDEÍ Z YOUTUBE
// ============================================================

// SEM VLOŽ SVŮJ API KLÍČ Z GOOGLE CLOUD
const YOUTUBE_API_KEY = "AIzaSyCbO-FprtNOl_3tKRsr3c7nJIK0hl7n5Mw";

// YouTube kanál CHAOS TREND
const YOUTUBE_HANDLE = "@josefcap153";


// ------------------------------------------------------------
// 1. Získání ID kanálu a jeho uploads playlistu
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// 2. Načtení nejnovějších videí
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// 3. Převod YouTube dat do jednoduchého formátu
// ------------------------------------------------------------

function prepareYouTubeVideos(items) {

    return items.map(item => {

        const videoId =
            item.contentDetails.videoId ||
            item.snippet.resourceId.videoId;

        const thumbnail =
            item.snippet.thumbnails.maxres?.url ||
            item.snippet.thumbnails.standard?.url ||
            item.snippet.thumbnails.high?.url ||
            item.snippet.thumbnails.medium?.url ||
            item.snippet.thumbnails.default?.url;

        return {
            id: videoId,
            title: item.snippet.title,
            date: item.contentDetails.videoPublishedAt ||
                  item.snippet.publishedAt,
            thumbnail: thumbnail,
            url: "https://www.youtube.com/watch?v=" + videoId
        };
    });
}


// ------------------------------------------------------------
// 4. Spuštění celého načítání
// ------------------------------------------------------------

async function loadChaosTrendYouTube() {

    try {

        console.log("CHAOS TREND: načítám YouTube videa...");

        const uploadsPlaylist =
            await getYouTubeUploadsPlaylist();

        console.log(
            "CHAOS TREND: uploads playlist:",
            uploadsPlaylist
        );

        const items =
            await getLatestYouTubeVideos(uploadsPlaylist);

        const videos =
            prepareYouTubeVideos(items);

        console.log(
            "CHAOS TREND: načtená videa:",
            videos
        );

        // Dočasně pouze zobrazíme výsledek
        // v konzoli pro kontrolu funkčnosti.
        window.chaosTrendYouTubeVideos = videos;

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


// ------------------------------------------------------------
// START
// ------------------------------------------------------------

loadChaosTrendYouTube(); 