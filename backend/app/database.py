import sqlite3

def connect_cursor():
    connection = sqlite3.connect("clothes.db")
    cursor = connection.cursor()
    return connection, cursor

def db_start(connection, cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS clothing_item (
            id INTEGER PRIMARY KEY,
            category TEXT NOT NULL CHECK(category IN ('top', 'bottom')),
            item_type TEXT NOT NULL,
            color TEXT NOT NULL,
            image_path TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS outfit (
            id INTEGER PRIMARY KEY,
            top_id INTEGER NOT NULL,
            bottom_id INTEGER NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(top_id) REFERENCES clothing_item(id),
            FOREIGN KEY(bottom_id) REFERENCES clothing_item(id)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)
    # Migrate existing tables to add user_id (safe to run repeatedly)
    for tbl in ("clothing_item", "outfit"):
        try:
            cursor.execute(f"ALTER TABLE {tbl} ADD COLUMN user_id INTEGER DEFAULT 1")
            connection.commit()
        except Exception:
            pass
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS shared_outfits (
            id INTEGER PRIMARY KEY,
            top_id INTEGER NOT NULL,
            bottom_id INTEGER NOT NULL,
            from_user_id INTEGER NOT NULL,
            to_user_id INTEGER NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(top_id) REFERENCES clothing_item(id),
            FOREIGN KEY(bottom_id) REFERENCES clothing_item(id),
            FOREIGN KEY(from_user_id) REFERENCES users(id),
            FOREIGN KEY(to_user_id) REFERENCES users(id)
        )
    """)

def get_item_id(cursor):
    cursor.execute("SELECT * FROM clothing_item")
    return cursor.fetchall()

def insert_item(cursor, category, item_type, color, image_path, user_id):
    cursor.execute(
        "INSERT INTO clothing_item (category, item_type, color, image_path, user_id) VALUES (?, ?, ?, ?, ?)",
        (category, item_type, color, image_path, user_id)
    )

def get_all_items(cursor, user_id):
    cursor.execute("SELECT * FROM clothing_item WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()
    cols = [d[0] for d in cursor.description]
    return [dict(zip(cols, row)) for row in rows]

def delete_item(cursor, item_id, connection, user_id):
    cursor.execute("DELETE FROM clothing_item WHERE id = ? AND user_id = ?", (item_id, user_id))
    connection.commit()
    return f"Item with ID {item_id} deleted successfully."

def get_clothing_item_by_id(item_id, cursor):
    cursor.execute("SELECT * FROM clothing_item WHERE id = ?", (item_id,))
    row = cursor.fetchone()
    if row is None:
        return None
    cols = [d[0] for d in cursor.description]
    return dict(zip(cols, row))

def get_top_items(cursor, user_id):
    cursor.execute("SELECT id FROM clothing_item WHERE category = 'top' AND user_id = ?", (user_id,))
    return cursor.fetchall()

def get_bottom_items(cursor, user_id):
    cursor.execute("SELECT id FROM clothing_item WHERE category = 'bottom' AND user_id = ?", (user_id,))
    return cursor.fetchall()

def create_outfit(top_id, bottom_id, cursor, connection, user_id):
    cursor.execute("INSERT INTO outfit (top_id, bottom_id, user_id) VALUES (?, ?, ?)", (top_id, bottom_id, user_id))
    connection.commit()

def delete_outfit(outfit_id, cursor, connection, user_id):
    cursor.execute("DELETE FROM outfit WHERE id = ? AND user_id = ?", (outfit_id, user_id))
    connection.commit()
    return f"Outfit with ID {outfit_id} deleted successfully."

def get_outfits(cursor, user_id):
    cursor.execute("SELECT id, top_id, bottom_id FROM outfit WHERE user_id = ?", (user_id,))
    rows = cursor.fetchall()
    cols = [d[0] for d in cursor.description]
    return [dict(zip(cols, row)) for row in rows]

def get_outfit_by_id(outfit_id, cursor):
    cursor.execute("SELECT id, top_id, bottom_id FROM outfit WHERE id = ?", (outfit_id,))
    row = cursor.fetchone()
    if row is None:
        return None
    cols = [d[0] for d in cursor.description]
    return dict(zip(cols, row))

def close_connection(connection):
    connection.close()

def create_user(cursor, connection, username, password_hash):
    cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, password_hash))
    connection.commit()

def get_user_by_username(cursor, username):
    cursor.execute("SELECT id, username, password_hash FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    if row is None:
        return None
    return {"id": row[0], "username": row[1], "password_hash": row[2]}

def create_session(cursor, connection, token, user_id):
    cursor.execute("INSERT INTO sessions (token, user_id) VALUES (?, ?)", (token, user_id))
    connection.commit()

def get_session_user_id(cursor, token):
    cursor.execute("SELECT user_id FROM sessions WHERE token = ?", (token,))
    row = cursor.fetchone()
    return row[0] if row else None

def delete_session(cursor, connection, token):
    cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
    connection.commit()

def share_outfit(cursor, connection, top_id, bottom_id, from_user_id, to_user_id):
    cursor.execute(
        "INSERT INTO shared_outfits (top_id, bottom_id, from_user_id, to_user_id) VALUES (?, ?, ?, ?)",
        (top_id, bottom_id, from_user_id, to_user_id)
    )
    connection.commit()

def get_shared_outfits(cursor, to_user_id):
    cursor.execute("""
        SELECT so.id, u.username AS from_username,
               ci_top.image_path AS top_image_path, ci_top.item_type AS top_item_type, ci_top.color AS top_color,
               ci_bot.image_path AS bottom_image_path, ci_bot.item_type AS bottom_item_type, ci_bot.color AS bottom_color,
               so.created_at
        FROM shared_outfits so
        JOIN users u ON so.from_user_id = u.id
        JOIN clothing_item ci_top ON so.top_id = ci_top.id
        JOIN clothing_item ci_bot ON so.bottom_id = ci_bot.id
        WHERE so.to_user_id = ?
        ORDER BY so.created_at DESC
    """, (to_user_id,))
    rows = cursor.fetchall()
    cols = [d[0] for d in cursor.description]
    return [dict(zip(cols, row)) for row in rows]

def dismiss_shared_outfit(cursor, connection, share_id, to_user_id):
    cursor.execute("DELETE FROM shared_outfits WHERE id = ? AND to_user_id = ?", (share_id, to_user_id))
    connection.commit()
