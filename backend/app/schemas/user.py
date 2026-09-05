import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    is_active: bool
    is_verified: bool
    created_at: datetime


class PreferencesRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    country: str
    county: str | None
    topics: list[str]
    accent_color: str
    theme_mode: str
    notification_level: str


class PreferencesUpdate(BaseModel):
    county: str | None = None
    topics: list[str] | None = None
    accent_color: str | None = None
    theme_mode: str | None = None
    notification_level: str | None = None