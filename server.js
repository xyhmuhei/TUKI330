const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

const PORT = 7000;

// 子应用路径
const PATH_TO_330 = '../site330'; 
const PATH_TO_TUK = '../sitetuk';
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

// 挂载子应用
app.use('/site330', express.static(path.join(__dirname, PATH_TO_330)));
app.use('/sitetuk', express.static(path.join(__dirname, PATH_TO_TUK)));

// --- 数据读写函数 ---
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

// --- API 接口 ---

// 1. 注册
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    if (users.find(u => u.username === username)) {
        return res.json({ success: false, message: "用户名已存在" });
    }
    // 新用户初始化一个空的 userData 对象
    users.push({ username, password, userData: {} });
    saveUsersToFile(users);
    res.json({ success: true, message: "注册成功" });
});

// 2. 登录 (返回用户数据)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // 登录成功，把保存的数据(userData)发给前端
        res.json({ success: true, userData: user.userData || {} });
    } else {
        res.json({ success: false, message: "账号或密码错误" });
    }
});

// 3. ★★★ 新增：保存用户数据接口 ★★★
app.post('/api/save_data', (req, res) => {
    const { username, password, data } = req.body; // 每次保存都需要验证身份
    const users = getUsers();
    
    // 找到用户并更新数据
    const userIndex = users.findIndex(u => u.username === username && u.password === password);
    
    if (userIndex !== -1) {
        users[userIndex].userData = data; // 更新数据
        saveUsersToFile(users);
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "身份验证失败" });
    }
});

app.listen(PORT, () => {
    console.log(`EPhone 服务启动: http://localhost:${PORT}`);
});
