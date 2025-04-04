# SpeedSpector

نظام مراقبة أداء الإنترنت والنظام باستخدام FastAPI و JavaScript.

## المميزات
- قياس سرعة الإنترنت (تحميل، رفع، زمن الاستجابة)
- مراقبة أداء النظام (CPU, RAM)
- معلومات الشبكة
- واجهة مستخدم تفاعلية

## المتطلبات
```bash
fastapi
uvicorn
speedtest-cli
psutil
```

## التشغيل
1. تثبيت المتطلبات:
   ```bash
   pip install -r requirements.txt
   ```
2. تشغيل السيرفر:
   ```bash
   python -m uvicorn app:app --reload
   ```
3. فتح الموقع في المتصفح:
   http://localhost:8000