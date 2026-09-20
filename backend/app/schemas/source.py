import uuid

from pydantic import BaseModel, ConfigDict


class SourceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    website_url: str
    credibility_tier: str
    county_scope: str | None
    is_active: bool
    verify_ssl: bool