import sqlite3

DB_PATH = "storage.db"

def get_connection():
    con = sqlite3.connect(DB_PATH)
    con.execute("PRAGMA foreign_keys = ON")
    return con

def cursor(con):
    cur = con.cursor()
    return cur


def init_db(con, cur):
#Table for Clothing separately made it so it could store both tops and bottoms
#Useable for DATA
    cur.execute("""
        CREATE TABLE IF NOT EXISTS clothing_item (
            id INTEGER PRIMARY KEY,
            category TEXT NOT NULL CHECK(category IN ('top', 'bottom')),
            color TEXT NOT NULL,
            image_path TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
# Table for outfit to exist should pull user input and make a total outfit
# FOR DATA
    cur.execute("""
        CREATE TABLE IF NOT EXISTS outfit (
            id INTEGER PRIMARY KEY,
            top_id INTEGER NOT NULL,
            bottom_id INTEGER NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(top_id) REFERENCES clothing_item(id),
            FOREIGN KEY(bottom_id) REFERENCES clothing_item(id)
        )
    """)

    con.commit()
    con.close()

def add_outfit(top_id, bottom_id):
    new_con = sqlite3.connect(DB_PATH)
    new_cur = new_con.cursor()
    new_cur.execute("INSERT INTO outfit(top_id, bottom_id) VALUES(?, ?)", (top_id, bottom_id))
    new_con.commit()
    new_con.close()


def get_all_outfits():
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("SELECT id, top_id, bottom_id FROM outfit ORDER BY id ASC")
    rows = cur.fetchall()
    con.close()
    return rows
rows = get_all_outfits()
for row in rows:
    id_, top_id, bottom_id = row
    print(f'PRINTING {id_}, {top_id}, {bottom_id} PRINT SUCCESS')

if __name__ == "__main__":
    con = get_connection()
    cur = con.cursor()
    init_db(con, cur)