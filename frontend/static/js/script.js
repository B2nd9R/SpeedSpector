document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.getElementById('testButton');
    const downloadSpeed = document.getElementById('download');
    const uploadSpeed = document.getElementById('upload');
    const pingValue = document.getElementById('ping');

    testButton.addEventListener('click', async () => {
        try {
            testButton.disabled = true;
            testButton.classList.add('loading');
            testButton.textContent = 'جاري الاختبار...';

            const response = await fetch('http://localhost:8000/api/v1/speed-test');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'حدث خطأ في اختبار السرعة');
            }
            
            const data = await response.json();
            console.log('Speed test results:', data);  // إضافة سجل للنتائج

            // تحديث النتائج مع تأثير العد
            animateValue(downloadSpeed, 0, data.download, 1000);
            animateValue(uploadSpeed, 0, data.upload, 1000);
            animateValue(pingValue, 0, data.ping, 1000);

        } catch (error) {
            console.error('Error details:', error);
            alert(error.message || 'حدث خطأ أثناء اختبار السرعة');
            
            // إعادة تعيين القيم عند حدوث خطأ
            downloadSpeed.textContent = '0.00';
            uploadSpeed.textContent = '0.00';
            pingValue.textContent = '0.00';
        } finally {
            testButton.disabled = false;
            testButton.classList.remove('loading');
            testButton.textContent = 'ابدأ اختبار السرعة';
        }
    });

    function animateValue(element, start, end, duration) {
        // تنظيف أي تايمر سابق
        if (element.timer) {
            clearInterval(element.timer);
        }

        const steps = 20; // عدد الخطوات للوصول للقيمة النهائية
        const stepDuration = duration / steps;
        let currentStep = 0;

        element.timer = setInterval(() => {
            currentStep++;
            
            // حساب القيمة الحالية باستخدام معادلة تسارع
            const progress = currentStep / steps;
            const currentValue = start + (end - start) * easeOutQuad(progress);
            
            // تحديث العنصر بالقيمة الحالية
            element.textContent = currentValue.toFixed(2);

            // إيقاف التايمر عند الوصول للخطوة الأخيرة
            if (currentStep >= steps) {
                clearInterval(element.timer);
                element.textContent = end.toFixed(2); // تأكيد القيمة النهائية
            }
        }, stepDuration);
    }

    // دالة للحصول على حركة سلسة
    function easeOutQuad(t) {
        return t * (2 - t);
    }
});