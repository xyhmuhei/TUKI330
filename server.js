const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// ===========================
// 配置区域
// ===========================
const MY_SECRET_PASSWORD = "admin"; // 记得改成你的密码
const PORT = 8080;

// ★★★ 关键修改：定义另外两个仓库在 VPS 上的文件夹名字 ★★★
// 假设你稍后会把仓库克隆到 EPhone 的隔壁，名字分别是 site330 和 sitetuk
const PATH_TO_330 = '../site330'; 
const PATH_TO_TUK = '../sitetuk';
// ===========================

app.use(bodyParser.json());

// 1. 托管 EPhone 自己的静态文件
app.use(express.static(path.join(__dirname, '/')));

// 2. ★★★ 核心魔法：把隔壁文件夹挂载成虚拟路径 ★★★
// 当浏览器访问 /site330 时，读取 ../site330 文件夹的内容
app.use('/site330', express.static(path.join(__dirname, PATH_TO_330)));

// 当浏览器访问 /sitetuk 时，读取 ../sitetuk 文件夹的内容
app.use('/sitetuk', express.static(path.join(__dirname, PATH_TO_TUK)));


// 登录接口
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === MY_SECRET_PASSWORD) {
        res.json({ success: true, message: "Login successful" });
    } else {
        res.json({ success: false, message: "Invalid password" });
    }
});

app.listen(PORT, () => {
    console.log(`EPhone 服务启动: http://localhost:${PORT}`);
    console.log(`挂载子应用 330: ${path.join(__dirname, PATH_TO_330)}`);
    console.log(`挂载子应用 Tuk: ${path.join(__dirname, PATH_TO_TUK)}`);
});
