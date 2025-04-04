from fastapi import APIRouter, HTTPException
import speedtest
import psutil
import platform
from typing import Dict
import time
from datetime import datetime
import socket
import uuid

router = APIRouter(
    prefix="/api/v1",
    tags=["speed"]
)

@router.get("/speed-test")
async def get_internet_speed() -> Dict:
    try:
        st = speedtest.Speedtest(secure=True)
        print("Testing download speed...")
        download_speed = st.download() / 1_000_000  # Convert to Mbps
        
        print("Testing upload speed...")
        upload_speed = st.upload() / 1_000_000  # Convert to Mbps
        
        print("Testing ping...")
        st.get_best_server()
        ping = st.results.ping

        return {
            "download": round(download_speed, 2),
            "upload": round(upload_speed, 2),
            "ping": round(ping, 2),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Error in speed test: {str(e)}")  # إضافة طباعة الخطأ للتشخيص
        raise HTTPException(
            status_code=500,
            detail=f"Failed to perform speed test: {str(e)}"
        )

@router.get("/system-info")
async def get_system_info() -> Dict:
    try:
        return {
            "cpu_usage": psutil.cpu_percent(),
            "memory_usage": psutil.virtual_memory().percent,
            "system": platform.system(),
            "processor": platform.processor(),
            "python_version": platform.python_version()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/network-info")
async def get_network_info() -> Dict:
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        mac_address = ':'.join(['{:02x}'.format((uuid.getnode() >> elements) & 0xff) 
                              for elements in range(0,8*6,8)][::-1])
        
        network_stats = psutil.net_io_counters()
        return {
            "hostname": hostname,
            "local_ip": local_ip,
            "mac_address": mac_address,
            "bytes_sent": network_stats.bytes_sent,
            "bytes_received": network_stats.bytes_recv,
            "packets_sent": network_stats.packets_sent,
            "packets_received": network_stats.packets_recv
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/disk-info")
async def get_disk_info() -> Dict:
    try:
        disk_info = {}
        for partition in psutil.disk_partitions():
            try:
                usage = psutil.disk_usage(partition.mountpoint)
                disk_info[partition.device] = {
                    "total": usage.total // (1024**3),  # GB
                    "used": usage.used // (1024**3),    # GB
                    "free": usage.free // (1024**3),    # GB
                    "percent": usage.percent,
                    "fs_type": partition.fstype,
                    "mountpoint": partition.mountpoint
                }
            except Exception:
                continue
        return disk_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/memory-detailed")
async def get_memory_detailed() -> Dict:
    try:
        memory = psutil.virtual_memory()
        swap = psutil.swap_memory()
        return {
            "ram": {
                "total": memory.total // (1024**3),     # GB
                "available": memory.available // (1024**3),
                "percent": memory.percent,
                "used": memory.used // (1024**3),
                "free": memory.free // (1024**3)
            },
            "swap": {
                "total": swap.total // (1024**3),
                "used": swap.used // (1024**3),
                "free": swap.free // (1024**3),
                "percent": swap.percent
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))