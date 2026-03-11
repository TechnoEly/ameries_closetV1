import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import services.services as services
import uvicorn
import fastapi


app = fastapi.FastAPI()

@app.get("/clothing")
def get_clothing():
    connection, cursor = services.database_setup()
    items = services.get_all_clothing_items(cursor)
    services.close_db_connection(connection)
    return items

@app.post("/clothing")
def add_clothing(category: str, item_type: str, color: str):
    category = category.lower()
    item_type = item_type.lower()
    color = color.lower()
    connection, cursor = services.database_setup()
    services.add_clothing_item(category, item_type, color, cursor, connection)
    services.close_db_connection(connection)
    return {"message": "Clothing item added successfully!"}

@app.delete("/clothing/{item_id}")
def delete_clothing(item_id: int):
    connection, cursor = services.database_setup()
    result = services.delete_clothing_item(item_id, cursor, connection)
    services.close_db_connection(connection)
    return {"message": result}

@app.post("/outfit")
def create_outfit(top_id: int, bottom_id: int):
    connection, cursor = services.database_setup()
    services.create_outfit(top_id, bottom_id, cursor, connection)
    services.close_db_connection(connection)
    return {"message": "Outfit created successfully!"}

@app.get("/outfit")
def get_outfits():
    connection, cursor = services.database_setup()
    outfits = services.get_outfits(cursor)
    services.close_db_connection(connection)
    return outfits

@app.get("/clothing/tops")
def get_tops():
    connection, cursor = services.database_setup()
    tops = services.get_top_items(cursor)
    services.close_db_connection(connection)
    return tops

@app.get("/clothing/bottoms")
def get_bottoms():
    connection, cursor = services.database_setup()
    bottoms = services.get_bottom_items(cursor)
    services.close_db_connection(connection)
    return bottoms

@app.get("/clothing/{item_id}")
def get_clothing_item(item_id: int):
    connection, cursor = services.database_setup()
    item = services.get_clothing_item_by_id(item_id, cursor)
    services.close_db_connection(connection)
    if item:
        return item
    else:
        return {"message": "Clothing item not found."}
    
@app.get("/outfit/{outfit_id}")
def get_outfit(outfit_id: int):
    connection, cursor = services.database_setup()
    outfit = services.get_outfit_by_id(outfit_id, cursor)
    services.close_db_connection(connection)
    if outfit:
        return outfit
    else:
        return {"message": "Outfit not found."}

@app.delete("/outfit/{outfit_id}")
def delete_outfit(outfit_id: int):  
    connection, cursor = services.database_setup()
    result = services.delete_outfit(outfit_id, cursor, connection)
    services.close_db_connection(connection)
    return {"message": result}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)