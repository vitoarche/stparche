import { BaseExtractor, Track, ExtractorInfo, ExtractorSearchContext, SearchQueryType, ExtractorStreamable } from 'discord-player';
import { Readable } from 'stream';
import { execFile, spawn } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execFileAsync = promisify(execFile);

// yt-dlp binary yolu: Linux'ta PATH'te olur, Windows'ta env ile ayarlanabilir
const YT_DLP_PATH = process.env.YT_DLP_PATH || 'yt-dlp';

// Cookie dosyası yolu
const COOKIES_PATH = path.join(process.cwd(), 'cookies.txt');

interface YtDlpVideoInfo {
    title: string;
    webpage_url: string;
    url?: string;
    thumbnail?: string;
    duration?: number;
    view_count?: number;
    uploader?: string;
    description?: string;
}

export class YtDlpExtractor extends BaseExtractor {
    static identifier = 'com.custom.ytdlp-extractor' as const;

    private getCookieArgs(): string[] {
        if (fs.existsSync(COOKIES_PATH)) {
            return ['--cookies', COOKIES_PATH];
        }
        return [];
    }

    private isYouTubeUrl(query: string): boolean {
        return /(?:youtube\.com|youtu\.be|music\.youtube\.com)/.test(query);
    }

    private isUrl(query: string): boolean {
        return /^https?:\/\//.test(query);
    }

    async validate(query: string, type?: SearchQueryType | null | undefined): Promise<boolean> {
        // YouTube URL'leri ve arama sorgularını kabul et
        if (this.isYouTubeUrl(query)) return true;
        // URL değilse arama sorgusu olarak kabul et
        if (!this.isUrl(query)) return true;
        return false;
    }

    async handle(query: string, context: ExtractorSearchContext): Promise<ExtractorInfo> {
        try {
            let searchQuery = query;

            // URL değilse YouTube'da ara
            if (!this.isUrl(query)) {
                searchQuery = `ytsearch:${query}`;
            }

            const { stdout } = await execFileAsync(YT_DLP_PATH, [
                '--dump-json',
                '--no-playlist',
                '--no-warnings',
                '--flat-playlist',
                ...this.getCookieArgs(),
                searchQuery
            ], { timeout: 15000 });

            const info: YtDlpVideoInfo = JSON.parse(stdout.trim());

            const track = new Track(this.context.player, {
                title: info.title || "Bilinmeyen Şarkı",
                description: info.description || "",
                author: info.uploader || "Unknown",
                url: info.webpage_url || query,
                thumbnail: info.thumbnail || "",
                duration: info.duration ? info.duration.toString() : "0",
                views: info.view_count || 0,
                requestedBy: context.requestedBy,
                source: "youtube"
            });

            return { playlist: null, tracks: [track] };
        } catch (e) {
            console.error(`[YtDlpExtractor] Handle error:`, e);
            return { playlist: null, tracks: [] };
        }
    }

    async stream(track: Track): Promise<string | Readable> {
        console.log(`[YtDlpExtractor] Streaming: ${track.title} (${track.url})`);

        const process = spawn(YT_DLP_PATH, [
            '-o', '-',           // stdout'a yaz
            '-f', 'bestaudio',   // en iyi ses kalitesi
            '--no-playlist',
            '--no-warnings',
            '--quiet',
            ...this.getCookieArgs(),
            track.url
        ]);

        process.stderr.on('data', (data) => {
            console.error(`[YtDlpExtractor] stderr: ${data}`);
        });

        process.on('error', (err) => {
            console.error(`[YtDlpExtractor] Process error:`, err);
        });

        return process.stdout as Readable;
    }
}
