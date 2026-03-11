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
        color TEXT NOT NULL
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
    return 

def get_item_id(cursor):
       cursor.execute("SELECT * FROM clothing_item")
       return cursor.fetchall()

def insert_item(cursor, category, item_type, color):
    cursor.execute("INSERT INTO clothing_item (category, item_type, color) VALUES (?, ?, ?)", (category, item_type, color))

def get_all_items(cursor):
        cursor.execute("SELECT * FROM clothing_item")

        return cursor.fetchall()

def delete_item(cursor, item_id, connection):
        cursor.execute("DELETE FROM clothing_item WHERE id = ?", (item_id,))
        connection.commit()
        return f"Item with ID {item_id} deleted successfully."

def get_clothing_item_by_id(item_id, cursor):
        cursor.execute("SELECT * FROM clothing_item WHERE id = ?", (item_id,))
        return cursor.fetchone()


def get_top_items(cursor):
        cursor.execute("SELECT id FROM clothing_item WHERE category = 'top'")
        return cursor.fetchall()

def get_bottom_items(cursor):
        cursor.execute("SELECT id FROM clothing_item WHERE category = 'bottom'")
        return cursor.fetchall()

def create_outfit(top_id, bottom_id, cursor, connection):
        cursor.execute("INSERT INTO outfit (top_id, bottom_id) VALUES (?, ?)", (top_id, bottom_id))
        connection.commit()

def delete_outfit(outfit_id, cursor, connection):
        cursor.execute("DELETE FROM outfit WHERE id = ?", (outfit_id,))
        connection.commit()
        return f"Outfit with ID {outfit_id} deleted successfully."

def get_outfits(cursor):
        cursor.execute("SELECT id, top_id, bottom_id FROM outfit")
        return cursor.fetchall()

def get_outfit_by_id(outfit_id, cursor):
        cursor.execute("SELECT id, top_id, bottom_id FROM outfit WHERE id = ?", (outfit_id,))
        return cursor.fetchone()

def close_connection(connection):
        connection.close()