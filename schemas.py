from pydantic import BaseModel,ConfigDict,Field
from typing import Optional

class JobCreate(BaseModel):
    title:str
    company:str
    location:Optional[str] = None
    description:Optional[str] = None
    salary:Optional[float] = Field(default=None,ge=0)
    job_type:Optional[str] = None



class JobResponse(BaseModel):
    id: int
    title: str
    company: str
    location: Optional[str] = None
    description: Optional[str] = None
    salary: Optional[float] = None
    job_type: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    salary: Optional[float] = Field(default=None, ge=0)
    job_type: Optional[str] = None