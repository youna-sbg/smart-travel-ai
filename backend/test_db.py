import asyncio
from app.database import engine

async def test():
    async with engine.begin() as conn:
        print("✅ Connected!")

asyncio.run(test())