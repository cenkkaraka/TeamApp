from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, users, projects, applications, messages, saved_projects,my_projects, chat_menu

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Prod için domain ile sınırla!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(applications.router)
app.include_router(messages.router)
app.include_router(saved_projects.router)
app.include_router(my_projects.router)
app.include_router(chat_menu.router)
@app.get("/")
def root():
    return {"message": "Takım Arkadaşı Bulma Platformu API"}