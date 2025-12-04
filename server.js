const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

const PORT = 7000;

// 定义子应用路径 (保持你之前的设置)
const PATH_TO_330 = '../site330'; 
const PATH_TO_TUK = '../sitetuk';

// 用户数据文件路径
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

// 挂载子应用
app.use('/site330', express.static(path.join(__dirname, PATH_TO_330)));
app.use('/sitetuk', express.static(path.join(__dirname, PATH_TO_TUK)));

// --- 辅助函数：读写用户数据 ---
function getUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        // 如果文件不存在，初始化为空数组
        fs.writeFileSync(USERS_FILE, '[]'); 
        return [];
    }
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function saveUser(userObj) {
    const users = getUsers();
    // 检查用户名是否已存在
    const exists = users.find(u => u.username === userObj.username);
    if (exists) return false;

    users.push(userObj);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
}

// --- API 接口 ---

// 1. 注册接口
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ success: false, message: "账号密码不能为空" });
    }

    const success = saveUser({ username, password });
    if (success) {
        console.log(`新用户注册: ${username}`);
        res.json({ success: true, message: "注册成功，请登录" });
    } else {
        res.json({ success: false, message: "用户名已存在" });
    }
});

// 2. 登录接口
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    
    // 查找匹配的用户
    const validUser = users.find(u => u.username === username && u.password === password);

    if (validUser) {
        console.log(`用户登录成功: ${username}`);
        res.json({ success: true, message: "Login successful" });
    } else {
        res.json({ success: false, message: "账号或密码错误" });
    }
});

app.listen(PORT, () => {
    console.log(`EPhone 服务启动: http://localhost:${PORT}`);
});
