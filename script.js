// ============================================================
// CHAOS TREND – AUTOMATICKÉ NAČÍTÁNÍ VIDEÍ Z YOUTUBE
// ============================================================

// SEM VLOŽ NOVÝ API KLÍČ Z GOOGLE CLOUD
const YOUTUBE_API_KEY = "SEM_VLOZ_NOVY_API_KLIC";

// YouTube kanál CHAOS TREND
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
// 2. NAČTENÍ NEJNOVĚJŠÍCH VIDEÍ
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
// 3. PŘÍPRAVA DAT
// ============================================================

function prepareYouTubeVideos(items) {

    return items
        .map(item => {

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
                thumbnails.default?.url;

            return {
                id: videoId,
                title: item.snippet?.title || "Video CHAOS TREND",
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
        .filter(video => video !== null);
}


// ============================================================
// 4. BEZPEČNÉ VLOŽENÍ TEXTU DO HTML
// ============================================================

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// 5. FORMÁT DATA
// ============================================================

function formatYouTubeDate(date) {

    if (!date) {
        return "";
    }

    return new Date(date).toLocaleDateString("cs-CZ", {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    });
}


// ============================================================
// 6. ZOBRAZENÍ HLAVNÍHO NEJNOVĚJŠÍHO VIDEA
// ============================================================

function displayMainYouTubeVideo(video) {

    if (!video) {
        return;
    }

    const mainVideo =
        document.getElementById("chaos-opinion-main-video");

    const placeholder =
        document.getElementById("chaos-opinion-placeholder");

    if (!mainVideo) {
        return;
    }

    mainVideo.src =
        "https://www.youtube.com/embed/" +
        video.id +
        "?autoplay=0&mute=1&playsinline=1&rel=0";

    mainVideo.style.display = "block";

    if (placeholder) {
        placeholder.style.display = "none";
    }
}


// ============================================================
// 7. ZOBRAZENÍ HISTORIE VIDEÍ – THUMBNAILY
// ============================================================

function displayYouTubeHistory(videos) {

    const historyContainer =
        document.getElementById("chaos-opinion-history");

    if (!historyContainer) {
        return;
    }

    historyContainer.innerHTML = "";

    videos.forEach(video => {

        const item =
            document.createElement("a");

        item.href = video.url;
        item.target = "_blank";
        item.rel = "noopener noreferrer";

        item.className =
            "chaos-opinion-item";

        item.style.textDecoration = "none";
        item.style.color = "inherit";
        item.style.display = "block";
        item.style.overflow = "hidden";

        item.innerHTML = `
            <img
                src="${escapeHTML(video.thumbnail)}"
                alt="${escapeHTML(video.title)}"
                loading="lazy"
                style="
                    width:100%;
                    aspect-ratio:16/9;
                    object-fit:cover;
                    display:block;
                "
            >

            <div
                style="
                    padding:10px 12px 4px;
                    font-weight:bold;
                    line-height:1.35;
                "
            >
                ${escapeHTML(video.title)}
            </div>

            <div
                style="
                    padding:0 12px 12px;
                    font-size:0.85rem;
                    opacity:0.7;
                "
            >
                ${formatYouTubeDate(video.date)}
            </div>
        `;

        historyContainer.appendChild(item);
    });
}


// ============================================================
// 8. HLAVNÍ FUNKCE
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

        // Uložíme data pro případné další použití.
        window.chaosTrendYouTubeVideos =
            videos;

        // První video = nejnovější video.
        if (videos.length > 0) {

            displayMainYouTubeVideo(
                videos[0]
            );
        }

        // Zobrazíme všech 10 videí
        // jako obrázky + názvy + datum.
        displayYouTubeHistory(
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
