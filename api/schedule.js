const { kv } = require('@vercel/kv');

const DEFAULT_DATA = {
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

module.exports = async function handler(req, res) {
    if (req.method === 'GET') {
        let data = await kv.get('schedule');
        if (!data) {
            await kv.set('schedule', DEFAULT_DATA);
            data = DEFAULT_DATA;
        }
        return res.json(data);
    }

    if (req.method === 'POST') {
        const data = req.body;
        if (!data || !data.people) {
            return res.status(400).json({ error: 'Invalid data' });
        }
        await kv.set('schedule', data);
        return res.json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
};
