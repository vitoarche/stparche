import play from 'play-dl';

(async () => {
    const link = "https://www.youtube.com/watch?v=XSsRrlM3tNg";
    console.log(`Testing link: ${link}`);

    try {
        const validation = await play.validate(link);
        console.log(`Validation result: ${validation}`);

        if (validation === 'yt_video') {
            console.log("Fetching video info...");
            const info = await play.video_info(link);
            console.log(`Success! Title: ${info.video_details.title}`);
        } else {
            console.log("Not a video link.");
        }
    } catch (e) {
        console.error("Error occurred:", e);
    }
})();
