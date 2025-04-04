from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import speedtest
import asyncio

app = FastAPI()

# ربط المجلدات الثابتة والقوالب
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")
templates = Jinja2Templates(directory="frontend/templates")

async def run_speed_test():
    st = speedtest.Speedtest()
    st.download()
    st.upload()
    ping = st.results.ping
    download_speed = st.results.download / 1_000_000  # تحويل إلى Mbps
    upload_speed = st.results.upload / 1_000_000
    return {
        'download': round(download_speed, 2),
        'upload': round(upload_speed, 2),
        'ping': round(ping, 2)
    }

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/speedtest")
async def speed_test():
    return await run_speed_test()