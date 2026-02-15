import { BaseExtractor, Track, ExtractorInfo, ExtractorSearchContext, SearchQueryType, ExtractorStreamable } from 'discord-player';
import play from 'play-dl';
import { Readable } from 'stream';

export class PlayDLExtractor extends BaseExtractor {
    static identifier = 'com.discord-player.playdlextractor' as const;

    async validate(query: string, type?: SearchQueryType | null | undefined): Promise<boolean> {
        // Always try to validate, log everything
        console.log(`[PlayDLExtractor] Validating: ${query}`);
        try {
            const validation = await play.validate(query);
            console.log(`[PlayDLExtractor] play-dl validation result: ${validation}`);
            // Accept youtube video, playlist, search, OR if it looks like a youtube url
            if (validation === 'yt_video' || validation === 'yt_playlist' || validation === 'search') return true;
            if (query.includes('youtube.com') || query.includes('youtu.be') || query.includes('music.youtube.com')) return true; // Force accept youtube links
            return false;
        } catch (e) {
            console.log(`[PlayDLExtractor] Validation error:`, e);
            // Fallback for youtube links
            return query.includes('youtube.com') || query.includes('youtu.be') || query.includes('music.youtube.com');
        }
    }

    async handle(query: string, context: ExtractorSearchContext): Promise<ExtractorInfo> {
        console.log(`[PlayDLExtractor] Handling: ${query}`);
        try {
            let validation = await play.validate(query);
            // if validation failed but we forced it, assume yt_video for links
            if ((!validation || (validation as any) === false) && (query.includes('youtube.com') || query.includes('youtu.be') || query.includes('music.youtube.com'))) {
                validation = 'yt_video';
            }

            if (validation === 'yt_video') {
                const info = await play.video_info(query);
                const track = new Track(this.context.player, {
                    title: info.video_details.title || "Bilinmeyen Şarkı",
                    description: info.video_details.description || "",
                    author: info.video_details.channel?.name || "Unknown",
                    url: info.video_details.url,
                    thumbnail: info.video_details.thumbnails?.[0]?.url || "",
                    duration: info.video_details.durationInSec.toString(),
                    views: info.video_details.views,
                    requestedBy: context.requestedBy,
                    source: "youtube"
                });
                return { playlist: null, tracks: [track] };
            }

            if (validation === 'yt_playlist') {
                const playlistInfo = await play.playlist_info(query);
                const videos = await playlistInfo.all_videos();
                const tracks = videos.map((v) => {
                    return new Track(this.context.player, {
                        title: v.title || "Bilinmeyen Şarkı",
                        description: v.description || "",
                        author: v.channel?.name || "Unknown",
                        url: v.url,
                        thumbnail: v.thumbnails?.[0]?.url || "",
                        duration: v.durationInSec.toString(),
                        views: v.views,
                        requestedBy: context.requestedBy,
                        source: "youtube"
                    });
                });
                return { playlist: null, tracks: tracks };
            }

            if (validation === 'search') {
                const results = await play.search(query, { limit: 1, source: { youtube: 'video' } });
                if (!results.length) return { playlist: null, tracks: [] };

                const v = results[0];
                const track = new Track(this.context.player, {
                    title: v.title || "Bilinmeyen Şarkı",
                    description: v.description || "",
                    author: v.channel?.name || "Unknown",
                    url: v.url,
                    thumbnail: v.thumbnails?.[0]?.url || "",
                    duration: v.durationInSec.toString(),
                    views: v.views,
                    requestedBy: context.requestedBy,
                    source: "youtube"
                });
                return { playlist: null, tracks: [track] };
            }

            return { playlist: null, tracks: [] };
        } catch (e) {
            console.error(`[PlayDLExtractor] Handle error:`, e);
            return { playlist: null, tracks: [] };
        }
    }

    async stream(info: Track): Promise<string | Readable> {
        console.log(`[PlayDLExtractor] Streaming: ${info.title} (${info.url})`);
        try {
            const stream = await play.stream(info.url, { discordPlayerCompatibility: true });
            return stream.stream;
        } catch (e) {
            console.error(`[PlayDLExtractor] Stream error:`, e);
            throw e;
        }
    }

    async bridge(track: Track, sourceExtractor: BaseExtractor | null): Promise<ExtractorStreamable | null> {
        if (track.source === "youtube") {
            console.log(`[PlayDLExtractor] Bridging: ${track.title}`);
            const stream = await play.stream(track.url, { discordPlayerCompatibility: true });
            return stream.stream;
        }
        return null;
    }
}
