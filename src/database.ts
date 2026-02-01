import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../../database.sqlite'));

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
