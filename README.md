# SpeedSpector 🚀

نظام مراقبة أداء الإنترنت والنظام باستخدام FastAPI و JavaScript.

## الوثائق 📚
- [سجل التغييرات](docs/CHANGELOG.md)
- [الواجهات البرمجية](http://localhost:8000/docs)
- [دليل المستخدم](docs/USER_GUIDE.md)

## التثبيت والتشغيل 📥

### 1. نسخ المشروع
```bash
git clone https://github.com/YOUR_USERNAME/SpeedSpector.git
cd SpeedSpector
```

### 2. إنشاء بيئة افتراضية
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. تثبيت المتطلبات
```bash
pip install -r requirements.txt
```

### 4. تشغيل السيرفر
```bash
python -m uvicorn app:app --reload
```

### 5. فتح التطبيق
افتح المتصفح على الرابط:
http://localhost:8000

## المميزات ⭐
- قياس سرعة الإنترنت (تحميل، رفع، ping)
- مراقبة أداء النظام (CPU, RAM)
- معلومات الشبكة
- واجهة مستخدم تفاعلية

## المتطلبات التقنية 💻
- Python 3.8+
- FastAPI
- Uvicorn
- Speedtest-cli
- Psutil

## الواجهات البرمجية API 🔌
- `GET /api/v1/speed-test`: اختبار سرعة الإنترنت
- `GET /api/v1/system-info`: معلومات النظام
- `GET /api/v1/network-info`: معلومات الشبكة
- `GET /api/v1/disk-info`: معلومات الأقراص

## الوثائق 📚
يمكن الوصول إلى وثائق API على:
http://localhost:8000/docs

## المساهمة 🤝
نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:
1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. تقديم Pull Request

## الرخصة 📝
MIT License