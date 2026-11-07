from sqlalchemy import Column,Integer,String,Float,Text
from database import Base

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer,primary_key=True,index=True)
    title=Column(String(100),nullable=False)
    company=Column(String(100),nullable=False)
    location=Column(String(100))
    description=Column(Text)
    salary = Column(Float)
    job_type=Column(String(50))