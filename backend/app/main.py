from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import places, lookups, route, auth, favorites, recommendations

app = FastAPI(
    title="Smart Travel AI - Backend",
    description="بک‌اند اپلیکیشن دستیار سفر هوشمند - نسخه شمال",
    version="0.3.0",
)

# CORS: در حالت توسعه همه دامنه‌ها مجازن، بعداً محدودش کن به دامنه واقعی فرانت‌اند
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(places.router)
app.include_router(lookups.router)
app.include_router(route.router)
app.include_router(auth.router)
app.include_router(favorites.router)
app.include_router(recommendations.router)


@app.get("/")
async def root():
    return {"status": "ok", "message": "Smart Travel AI backend is running"}
