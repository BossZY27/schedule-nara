const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Default data
function getDefaultData() {
    return {
        title: 'ตารางเวรงาน',
        people: [
            {
                id: 'p_1', name: 'โบ', color: '#4CAF50',
                tasks: [{
                    id: 't_1', name: 'ไลฟ์สด', timeLabel: 'เวลา 17:00–20:00 น.',
                    days: {
                        mon: { active: true, time: '' }, tue: { active: false, time: '' },
                        wed: { active: false, time: '' }, thu: { active: true, time: '' },
                        fri: { active: true, time: '' }, sat: { active: true, time: '' },
                        sun: { active: true, time: '' }
                    }
                }]
            },
            {
                id: 'p_2', name: 'พี่เนย', color: '#9C27B0',
                tasks: [{
                    id: 't_2', name: 'ไลฟ์สด', timeLabel: 'เวลา 17:00–20:00 น.',
                    days: {
                        mon: { active: false, time: '' }, tue: { active: true, time: '' },
                        wed: { active: true, time: '' }, thu: { active: true, time: '' },
                        fri: { active: false, time: '' }, sat: { active: false, time: '' },
                        sun: { active: false, time: '' }
                    }
                }]
            },
            {
                id: 'p_3', name: 'บอส', color: '#FF9800',
                tasks: [{
                    id: 't_3', name: 'ผลิตวิดีโอ AI', timeLabel: '',
                    days: {
                        mon: { active: true, time: '18:00–22:00' }, tue: { active: true, time: '18:00–22:00' },
                        wed: { active: true, time: '20:00–23:00' }, thu: { active: false, time: '' },
                        fri: { active: true, time: '19:00–22:00' }, sat: { active: false, time: '' },
                        sun: { active: true, time: '17:00–23:00' }
                    }
                }]
            }
        ]
    };
}

// Load data from file
function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (e) { /* ignore */ }
    const defaultData = getDefaultData();
    saveData(defaultData);
    return defaultData;
}

// Save data to file
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// API: Get schedule data
app.get('/api/schedule', (req, res) => {
    res.json(loadData());
});

// API: Save schedule data
app.post('/api/schedule', (req, res) => {
    const data = req.body;
    if (!data || !data.people) {
        return res.status(400).json({ error: 'Invalid data' });
    }
    saveData(data);
    res.json({ success: true });
});

// API: Reset to default
app.post('/api/reset', (req, res) => {
    const defaultData = getDefaultData();
    saveData(defaultData);
    res.json(defaultData);
});

app.listen(PORT, () => {
    console.log(`🟢 ตารางเวรงาน server running at http://localhost:${PORT}`);
});
