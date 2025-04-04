document.addEventListener('DOMContentLoaded', () => {
    const buttons = {
        speed: document.getElementById('speedTestButton'),
        system: document.getElementById('systemTestButton'),
        network: document.getElementById('networkTestButton'),
        disk: document.getElementById('diskTestButton')
    };

    const values = {
        download: document.getElementById('download'),
        upload: document.getElementById('upload'),
        ping: document.getElementById('ping'),
        cpuUsage: document.getElementById('cpuUsage'),
        memoryUsage: document.getElementById('memoryUsage'),
        hostname: document.getElementById('hostname'),
        localIp: document.getElementById('localIp'),
        diskInfo: document.getElementById('diskInfo'),
        lastUpdate: document.getElementById('lastUpdate')
    };

    async function performTest(endpoint, button) {
        try {
            button.disabled = true;
            button.classList.add('loading');

            const response = await fetch(`http://localhost:8000/api/v1/${endpoint}`);
            if (!response.ok) throw new Error('فشل الاختبار');
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            alert('حدث خطأ أثناء الاختبار');
        } finally {
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    function animateValue(element, start, end, duration) {
        if (element.timer) clearInterval(element.timer);
        
        const steps = 20;
        const stepDuration = duration / steps;
        let currentStep = 0;

        element.timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const currentValue = start + (end - start) * easeOutQuad(progress);
            element.textContent = currentValue.toFixed(2);

            if (currentStep >= steps) {
                clearInterval(element.timer);
                element.textContent = end.toFixed(2);
            }
        }, stepDuration);
    }

    function easeOutQuad(t) {
        return t * (2 - t);
    }

    // اختبار السرعة
    buttons.speed.addEventListener('click', async () => {
        const data = await performTest('speed-test', buttons.speed);
        if (data) {
            animateValue(values.download, 0, data.download, 1000);
            animateValue(values.upload, 0, data.upload, 1000);
            animateValue(values.ping, 0, data.ping, 1000);
        }
    });

    // فحص النظام
    buttons.system.addEventListener('click', async () => {
        const data = await performTest('system-info', buttons.system);
        if (data) {
            updateSystemInfo(data);
        }
    });

    // فحص الشبكة
    buttons.network.addEventListener('click', async () => {
        const data = await performTest('network-info', buttons.network);
        if (data) {
            values.hostname.textContent = data.hostname;
            values.localIp.textContent = data.local_ip;
        }
    });

    // فحص الأقراص
    buttons.disk.addEventListener('click', async () => {
        const data = await performTest('disk-info', buttons.disk);
        if (data) {
            values.diskInfo.innerHTML = Object.entries(data)
                .map(([device, info]) => `
                    <div class="disk-card">
                        <h3>${device}</h3>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${info.percent}%"></div>
                        </div>
                        <p>المساحة المستخدمة: ${info.used}GB من ${info.total}GB</p>
                    </div>
                `).join('');
        }
    });

    // تحديث الوقت
    function updateTimestamp() {
        values.lastUpdate.textContent = new Date().toLocaleString('ar-SA');
    }

    // تحديث تلقائي كل دقيقة
    setInterval(updateTimestamp, 60000);
    updateTimestamp();
    
    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on user preference
    if (localStorage.getItem('theme') === 'light' || (!localStorage.getItem('theme') && !prefersDark)) {
        document.body.classList.add('light-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        // Update icon
        if (document.body.classList.contains('light-theme')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }

        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        themeToggle.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
    });

    const cards = document.querySelectorAll('.result-card, .info-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Call after initial setup
    startAutoRefresh();
});

async function updateSystemInfo(data) {
    // تحديث معلومات المعالج
    document.getElementById('cpuModel').textContent = data.cpu_info.model;
    document.getElementById('cpuCores').textContent = data.cpu_info.cores;
    document.getElementById('cpuSpeed').textContent = data.cpu_info.speed + ' GHz';
    document.getElementById('cpuProgress').style.width = `${data.cpu_usage}%`;
    document.getElementById('cpuUsage').textContent = `${data.cpu_usage}%`;

    // تحديث معلومات الذاكرة
    const totalMemory = (data.memory_info.total / (1024 * 1024 * 1024)).toFixed(2);
    const usedMemory = (data.memory_info.used / (1024 * 1024 * 1024)).toFixed(2);
    const availableMemory = (data.memory_info.available / (1024 * 1024 * 1024)).toFixed(2);

    document.getElementById('totalMemory').textContent = `${totalMemory} GB`;
    document.getElementById('usedMemory').textContent = `${usedMemory} GB`;
    document.getElementById('availableMemory').textContent = `${availableMemory} GB`;
    document.getElementById('memoryProgress').style.width = `${data.memory_usage}%`;
    document.getElementById('memoryUsage').textContent = `${data.memory_usage}%`;

    // تحديث معلومات نظام التشغيل
    document.getElementById('osName').textContent = data.os_info.system;
    document.getElementById('osVersion').textContent = data.os_info.version;
    document.getElementById('osArch').textContent = data.os_info.architecture;
    document.getElementById('uptime').textContent = formatUptime(data.os_info.uptime);

    // تحديث معلومات التطبيق
    document.getElementById('pythonVersion').textContent = data.python_version;
    document.getElementById('timezone').textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
}

// Add after DOMContentLoaded event
function startAutoRefresh() {
    const refreshIntervals = {
        system: 5000,    // تحديث معلومات النظام كل 5 ثواني
        network: 10000,  // تحديث معلومات الشبكة كل 10 ثواني
        disk: 30000     // تحديث معلومات الأقراص كل 30 ثانية
    };

    setInterval(async () => {
        const data = await performTest('system-info', buttons.system);
        if (data) updateSystemInfo(data);
    }, refreshIntervals.system);

    setInterval(async () => {
        const data = await performTest('network-info', buttons.network);
        if (data) updateNetworkInfo(data);
    }, refreshIntervals.network);

    setInterval(async () => {
        const data = await performTest('disk-info', buttons.disk);
        if (data) updateDiskInfo(data);
    }, refreshIntervals.disk);
}

function exportData() {
    const data = {
        timestamp: new Date().toISOString(),
        system: {
            cpu: document.getElementById('cpuUsage').textContent,
            memory: document.getElementById('memoryUsage').textContent,
            os: document.getElementById('osName').textContent
        },
        network: {
            download: document.getElementById('download').textContent,
            upload: document.getElementById('upload').textContent,
            ping: document.getElementById('ping').textContent
        }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speedspector-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}