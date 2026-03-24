import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_URI)
db = client.hiresense

async def verify_db_connection():
    try:
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        print("MongoDB connection verified.")
    except Exception as e:
        print(f"CRITICAL: Could not connect to MongoDB: {e}")
        # Note: We don't exit(1) here to allow the app to start (and possibly show health check errors)
        # but in a strict prod env you might want to exit.
