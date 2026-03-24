from app.main import app

# This acts as a bridge so the existing `uvicorn main:app` command
# automatically loads the new modular backend structure contained in `app/`.
