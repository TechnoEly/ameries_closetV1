from pydantic import BaseModel
from typing import Literal

class ClothingCreate(BaseModel):
    category: Literal["top", "bottom"]
    item_type: str
    color: str
    image_path: str

class OutfitCreate(BaseModel):
    top_id: int
    bottom_id: int
