from fastapi import FastAPI, Depends,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine,Base , get_db
from models import Job
from sqlalchemy.orm import Session
from schemas import JobCreate,JobResponse,JobUpdate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/")
def greet():
    return {"message": "Job Portal API"}

@app.post("/jobs", response_model= JobResponse)
def create_job(job: JobCreate , db: Session = Depends(get_db)):
    new_job = Job(**job.model_dump())
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job


@app.get("/jobs", response_model=list[JobResponse])
def get_all_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    return jobs

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):

    job = db.query(Job).filter(Job.id == job_id).first()

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    db.delete(job)
    db.commit()

    return {"message": "Job deleted successfully"}


@app.put("/jobs/{job_id}", response_model= JobResponse)
def update_job(job_id: int, updated_job: JobCreate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )
    job.title = updated_job.title
    job.company = updated_job.company
    job.location = updated_job.location
    job.description = updated_job.description
    job.salary = updated_job.salary
    job.job_type = updated_job.job_type

    db.commit()
    db.refresh(job)

    return job


@app.patch("/jobs/{job_id}", response_model=JobResponse)
def update_job_partial(job_id: int, updated_data: JobUpdate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )
    updated_data = updated_data.model_dump(exclude_unset=True)
    for key,value in updated_data.items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)

    return job

@app.get("/jobs/search", response_model=list[JobResponse])
def search_jobs(
    title: str | None,
    location: str | None,
    job_type: str | None,
    min_salary: float | None,
    max_salary: float | None,
    db: Session = Depends(get_db)
):
    query = db.query(Job)

    if title:
        query = query.filter(Job.title.ilike(f"%{title}%"))
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if job_type:
        query = query.filter(Job.job_type == job_type)
    if min_salary is not None:
        query = query.filter(Job.salary >= min_salary)
    if max_salary is not None:
        query = query.filter(Job.salary <= max_salary)

    jobs = query.all()

    return jobs


@app.get("/jobs/pagination", response_model=list[JobResponse])
def get_pagination_jobs(
    page: int = 1,
    page_size: int = 10,
     db: Session = Depends(get_db)
):
    offset = (page - 1) * page_size

    jobs = (
        db.query(Job).order_by(Job.id).offset(offset).limit(page_size).all()
    )

    return jobs

@app.get("/jobs/sort", response_model=list[JobResponse])
def sort_jobs(
    order: str = "asc",
    db: Session = Depends(get_db)
):
    query =db.query(Job)

    if order == "asc":
        query = query.order_by(Job.salary.asc())
    elif order == "desc":
        query = query.order_by(Job.salary.desc())
    else :
         raise HTTPException(
            status_code=400,
            detail="Order must be asc or desc"
        )

    return query.all()





@app.get("/jobs/{job_id}", response_model=JobResponse)
def get_job_by_id(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id== job_id).first()

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    return job