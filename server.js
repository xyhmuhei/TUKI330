const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

const PORT = 7000;
// 这是一个公共数据文件，所有人共享
const GLOBAL_DATA_FILE = path.join(__dirname, 'global_data.json');

const PATH_TO_330 = '../site330'; 
const PATH_TO_TUK = '../sitetuk';

// 开启 50MB 大容量限制
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, '/')));
app.use('/site330', express.static(path.join(__dirname, PATH_TO_330)));
app.use('/sitetuk', express.static(path.join(__dirname, PATH_TO_TUK)));

// --- 核心逻辑：读取和保存公共数据 ---

// 1. 获取全局数据
app.get('/api/global_data', (req, res) => {
    if (!fs.existsSync(GLOBAL_DATA_FILE)) {
        fs.writeFileSync(GLOBAL_DATA_FILE, '{}'); // 初始化为空
        return res.json({});
    }
    try {
        const data = fs.readFileSync(GLOBAL_DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (e) {
        res.json({});
    }
});

// 2. 保存全局数据 (谁都可以存)
app.post('/api/save_global', (req, res) => {
    const { appId, data } = req.body;
    
    // 读取旧数据
    let allData = {};
    if (fs.existsSync(GLOBAL_DATA_FILE)) {
        try {
            allData = JSON.parse(fs.readFileSync(GLOBAL_DATA_FILE, 'utf8'));
        } catch(e) {}
    }

    // 更新对应的 App 数据
    allData[appId] = data;

    // 写入硬盘
    fs.writeFileSync(GLOBAL_DATA_FILE, JSON.stringify(allData, null, 2));
    console.log(`[全局同步] ${appId} 数据已更新`);
    
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`EPhone 全局同步服务启动: http://localhost:${PORT}`);
});
