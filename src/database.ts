import Database from 'better-sqlite3';
import path from 'path';

// process.cwd() ile proje kök dizininden database.sqlite yolunu çözümle
// Bu sayede hem ts-node (dev) hem de node dist/ (prod) modunda aynı dosyaya erişilir
const db = new Database(path.join(process.cwd(), 'database.sqlite'));

// Initialize tables
db.prepare(`
    CREATE TABLE IF NOT EXISTS levels (
        user_id TEXT,
        guild_id TEXT,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        PRIMARY KEY (user_id, guild_id)
    )
`).run();

export default db;
