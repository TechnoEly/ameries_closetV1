import sys
import os
import hashlib
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import services.services as services
import uvicorn
import fastapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi import Depends, File, Header, HTTPException, UploadFile
from pydantic import BaseModel
import uuid

class AuthRequest(BaseModel):
    username: str
    password: str

class ShareRequest(BaseModel):
    top_id: int
    bottom_id: int
    to_username: str

def _hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    connection, cursor = services.database_setup()
    user_id = services.get_session_user_id(cursor, authorization)
    services.close_db_connection(connection)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    return user_id

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = fastapi.FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

BUILD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "frontend", "build")

def _html_no_cache(path: str):
    with open(path, "r") as f:
        content = f.read()
    return HTMLResponse(content, headers={"Cache-Control": "no-store, no-cache, must-revalidate"})

@app.post("/auth/register")
def register(req: AuthRequest):
    connection, cursor = services.database_setup()
    if services.get_user_by_username(cursor, req.username):
        services.close_db_connection(connection)
        raise HTTPException(status_code=400, detail="Username already taken")
    services.create_user(cursor, connection, req.username, _hash(req.password))
    user = services.get_user_by_username(cursor, req.username)
    token = str(uuid.uuid4())
    services.create_session(cursor, connection, token, user["id"])
    services.close_db_connection(connection)
    return {"token": token, "username": req.username}

@app.post("/auth/login")
def login(req: AuthRequest):
    connection, cursor = services.database_setup()
    user = services.get_user_by_username(cursor, req.username)
    if not user or user["password_hash"] != _hash(req.password):
        services.close_db_connection(connection)
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = str(uuid.uuid4())
    services.create_session(cursor, connection, token, user["id"])
    services.close_db_connection(connection)
    return {"token": token, "username": req.username}

@app.post("/auth/logout")
def logout(authorization: str = Header(None)):
    if authorization:
        connection, cursor = services.database_setup()
        services.delete_session(cursor, connection, authorization)
        services.close_db_connection(connection)
    return {"message": "Logged out"}

@app.get("/clothing")
def get_clothing(user_id: int = Depends(get_current_user)):
    connection, cursor = services.database_setup()
    items = services.get_all_clothing_items(cursor, user_id)
    services.close_db_connection(connection)
    return items

@app.post("/clothing")
def add_clothing(category: str, item_type: str, color: str, image_path: str, user_id: int = Depends(get_current_user)):
    category = category.lower()
    item_type = item_type.lower()
    color = color.lower()
    connection, cursor = services.database_setup()
    services.add_clothing_item(category, item_type, color, image_path, cursor, connection, user_id)
    services.close_db_connection(connection)
    return {"message": "Clothing item added successfully!"}

@app.post("/upload")
async def upload_image(file: UploadFile, _user: int = Depends(get_current_user)):
    contents = await file.read()
    extension = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{extension}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(contents)
    return {"image_path": f"uploads/{filename}"}

@app.delete("/clothing/{item_id}")
def delete_clothing(item_id: int, user_id: int = Depends(get_current_user)):
    connection, cursor = services.database_setup()
    result = services.delete_clothing_item(item_id, cursor, connection, user_id)
    services.close_db_connection(connection)
    return {"message": result}

@app.post("/outfit")
def create_outfit(top_id: int, bottom_id: int, user_id: int = Depends(get_current_user)):
    connection, cursor = services.database_setup()
    services.create_outfit(top_id, bottom_id, cursor, connection, user_id)
    services.close_db_connection(connection)
    return {"message": "Outfit created successfully!"}

@app.get("/outfit")
def get_outfits(user_id: int = Depends(get_current_user)):
    connection, cursor = services.database_setup()
    outfits = services.get_outfits(cursor, user_id)
    services.close_db_connection(connection)
    return outfits

@app.get("/clothing/tops")
def get_tops(user_id: int = Depends(get_current_user)):
    connection, cursor = services.database_setup()
    tops = services.get_top_items(cursor, user_id)
    services.close_db_connection(connection)
    return tops

@app.get("/clothing/bottoms")
def get_bottoms(user_id: int = Depends(get_current_user)):
    connection, cursor = services.database_setup()
    bottoms = services.get_bottom_items(cursor, user_id)
    services.close_db_connection(connection)
    return bottoms

@app.get("/clothing/{item_id}")
def get_clothing_item(item_id: int, _user: int = Depends(get_current_user)):
    connection, cursor = services.database_setup()
    item = services.get_clothing_item_by_id(item_id, cursor)
    services.close_db_connection(connection)
    if item:
        return item
    return {"message": "Clothing item not found."}

@app.get("/outfit/{outfit_id}")
def get_outfit(outfit_id: int, _user: int = Depends(get_current_user)):
    connection, cursor = services.database_setup()
    outfit = services.get_outfit_by_id(outfit_id, cursor)
    services.close_db_connection(connection)
    if outfit:
        return outfit
    return {"message": "Outfit not found."}

@app.delete("/outfit/{outfit_id}")
def delete_outfit(outfit_id: int, user_id: int = Depends(get_current_user)):
    connection, cursor = services.database_setup()
    result = services.delete_outfit(outfit_id, cursor, connection, user_id)
    services.close_db_connection(connection)
    return {"message": result}

@app.post("/share")
def share_outfit(req: ShareRequest, from_user_id: int = Depends(get_current_user)):
    connection, cursor = services.database_setup()
    to_user = services.get_user_by_username(cursor, req.to_username)
    if not to_user:
        services.close_db_connection(connection)
        raise HTTPException(status_code=404, detail=f"User '{req.to_username}' not found")
    if to_user["id"] == from_user_id:
        services.close_db_connection(connection)
        raise HTTPException(status_code=400, detail="You can't share an outfit with yourself")
    services.share_outfit(cursor, connection, req.top_id, req.bottom_id, from_user_id, to_user["id"])
    services.close_db_connection(connection)
    return {"message": f"Outfit shared with {req.to_username}!"}

@app.get("/shared")
def get_shared(user_id: int = Depends(get_current_user)):
    connection, cursor = services.database_setup()
    shared = services.get_shared_outfits(cursor, user_id)
    services.close_db_connection(connection)
    return shared

@app.delete("/shared/{share_id}")
def dismiss_shared(share_id: int, user_id: int = Depends(get_current_user)):
    connection, cursor = services.database_setup()
    services.dismiss_shared_outfit(cursor, connection, share_id, user_id)
    services.close_db_connection(connection)
    return {"message": "Dismissed"}


@app.get("/")
def serve_root():
    return _html_no_cache(os.path.join(BUILD_DIR, "index.html"))

@app.get("/{full_path:path}")
def serve_frontend(full_path: str):
    file_path = os.path.join(BUILD_DIR, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return _html_no_cache(os.path.join(BUILD_DIR, "index.html"))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
