import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import database 

# Database setup function to be used in API endpoints and CLI
def database_setup():
    connection, cursor = database.connect_cursor()
    database.db_start(connection, cursor,)
    return connection, cursor

# clothing item functions
def add_clothing_item(category, item_type, color, image_path, cursor, connection):
    database.insert_item(cursor, category, item_type, color, image_path)
    connection.commit()

def get_all_clothing_items(cursor):
    return database.get_all_items(cursor)

def get_clothing_item_by_id(item_id, cursor):
    return database.get_clothing_item_by_id(item_id, cursor)

# CLI function to get all items for display
def all_rows(cursor):
    return database.all_rows(cursor)

# CLI function to get item IDs for outfit creation
def get_item_id(cursor):
    return database.get_item_id(cursor)

# delete clothing item function for API
def delete_clothing_item(item_id, cursor, connection):
    return database.delete_item(cursor, item_id, connection)

# Get tops and bottoms for outfit creation
def get_top_items(cursor):
    return database.get_top_items(cursor)

def get_bottom_items(cursor):
    return database.get_bottom_items(cursor)  

# Outfit functions
def create_outfit(top_id, bottom_id, cursor, connection):
    database.create_outfit(top_id, bottom_id, cursor, connection)

def get_outfits(cursor):
    return database.get_outfits(cursor)

def get_outfit_by_id(outfit_id, cursor):
    return database.get_outfit_by_id(outfit_id, cursor)

def delete_outfit(outfit_id, cursor, connection):
    return database.delete_outfit(outfit_id, cursor, connection)

# Commit and close functions for API
def commit_changes(connection):
    connection.commit()

def close_db_connection(connection):
    database.close_connection(connection)