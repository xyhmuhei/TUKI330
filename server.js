const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

const PORT = 7000;
const USERS_FILE = path.join(__dirname, 'users.json');
const PATH_TO_330 = '../site330'; 
const PATH_TO_TUK = '../sitetuk';

// ★★★ 关键修复：扩大数据限制到 50MB ★★★
// 之前的默认限制只有 100kb，存几句聊天记录就爆了
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, '/')));
app.use('/site330', express.static(path.join(__dirname, PATH_TO_330)));
app.use('/sitetuk', express.static(path.join(__dirname, PATH_TO_TUK)));

// 读写数据
function getUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, '[]'); 
        return [];
    }
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch (e) { return []; }
}
function saveUsersToFile(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// 注册
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    if (users.find(u => u.username === username)) return res.json({ success: false, message: "已存在" });
    users.push({ username, password, userData: {} });
    saveUsersToFile(users);
    console.log(`[注册] 新用户: ${username}`);
    res.json({ success: true });
});

// 登录
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        console.log(`[登录] 用户: ${username}, 数据大小: ${JSON.stringify(user.userData).length} 字节`);
        res.json({ success: true, userData: user.userData || {} });
    } else {
        res.json({ success: false, message: "失败" });
    }
});

// 保存数据
app.post('/api/save_data', (req, res) => {
    const { username, password, data } = req.body;
    console.log(`[保存请求] 用户: ${username} 正在上传数据...`);
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === username && u.password === password);
    
    if (userIndex !== -1) {
        users[userIndex].userData = data;
        saveUsersToFile(users); // 写入硬盘
        console.log(`[保存成功] 用户: ${username} 数据已更新。`);
        res.json({ success: true });
    } else {
        console.log(`[保存失败] 用户: ${username} 验证失败。`);
        res.json({ success: false, message: "验证失败" });
    }
});

app.listen(PORT, () => {
    console.log(`EPhone 服务启动: http://localhost:${PORT}`);
    console.log(`数据大小限制已提升至 50MB`);
});
