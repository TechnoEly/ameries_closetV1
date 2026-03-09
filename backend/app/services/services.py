import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import database 

def database_setup():
    connection, cursor = database.connect_cursor()
    database.db_start(connection, cursor,)
    return connection, cursor

def add_clothing_item(category, item_type, color, cursor, connection):
    database.insert_item(cursor, category, item_type, color)
    connection.commit()

def get_all_clothing_items(cursor):
    return database.get_all_items(cursor)

def all_rows(cursor):
    return database.all_rows(cursor)

def get_item_id(cursor):
    return database.get_item_id(cursor)

def delete_clothing_item(item_id, cursor, connection):
    return database.delete_item(cursor, item_id, connection)


def get_top_items(cursor):
    return database.get_top_items(cursor)

def get_bottom_items(cursor):
    return database.get_bottom_items(cursor)  

def create_outfit(top_id, bottom_id, cursor, connection):
    database.create_outfit(top_id, bottom_id, cursor, connection)

def get_outfits(cursor):
    return database.get_outfits(cursor)

def commit_changes(connection):
    connection.commit()

def close_db_connection(connection):
    database.close_connection(connection)