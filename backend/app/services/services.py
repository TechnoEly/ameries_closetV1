import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import database

def database_setup():
    connection, cursor = database.connect_cursor()
    database.db_start(connection, cursor)
    return connection, cursor

def add_clothing_item(category, item_type, color, image_path, cursor, connection, user_id):
    database.insert_item(cursor, category, item_type, color, image_path, user_id)
    connection.commit()

def get_all_clothing_items(cursor, user_id):
    return database.get_all_items(cursor, user_id)

def get_clothing_item_by_id(item_id, cursor):
    return database.get_clothing_item_by_id(item_id, cursor)

def get_item_id(cursor):
    return database.get_item_id(cursor)

def delete_clothing_item(item_id, cursor, connection, user_id):
    return database.delete_item(cursor, item_id, connection, user_id)

def get_top_items(cursor, user_id):
    return database.get_top_items(cursor, user_id)

def get_bottom_items(cursor, user_id):
    return database.get_bottom_items(cursor, user_id)

def create_outfit(top_id, bottom_id, cursor, connection, user_id):
    database.create_outfit(top_id, bottom_id, cursor, connection, user_id)

def get_outfits(cursor, user_id):
    return database.get_outfits(cursor, user_id)

def get_outfit_by_id(outfit_id, cursor):
    return database.get_outfit_by_id(outfit_id, cursor)

def delete_outfit(outfit_id, cursor, connection, user_id):
    return database.delete_outfit(outfit_id, cursor, connection, user_id)

def commit_changes(connection):
    connection.commit()

def close_db_connection(connection):
    database.close_connection(connection)

def create_user(cursor, connection, username, password_hash):
    database.create_user(cursor, connection, username, password_hash)

def get_user_by_username(cursor, username):
    return database.get_user_by_username(cursor, username)

def create_session(cursor, connection, token, user_id):
    database.create_session(cursor, connection, token, user_id)

def get_session_user_id(cursor, token):
    return database.get_session_user_id(cursor, token)

def delete_session(cursor, connection, token):
    database.delete_session(cursor, connection, token)

def share_outfit(cursor, connection, top_id, bottom_id, from_user_id, to_user_id):
    database.share_outfit(cursor, connection, top_id, bottom_id, from_user_id, to_user_id)

def get_shared_outfits(cursor, to_user_id):
    return database.get_shared_outfits(cursor, to_user_id)

def dismiss_shared_outfit(cursor, connection, share_id, to_user_id):
    database.dismiss_shared_outfit(cursor, connection, share_id, to_user_id)
