const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// ===========================
// ★★★ 在这里修改你的密码 ★★★
// ===========================
const MY_SECRET_PASSWORD = "admin";  // 把 admin 改成你想设的密码
const PORT = 7000;                   // 程序运行的端口
// ===========================

app.use(bodyParser.json());
// 托管当前目录下的所有静态文件 (index.html, css, 图片等)
app.use(express.static(path.join(__dirname, '/')));

// 登录接口：接收前端发来的密码并比对
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    console.log("收到登录尝试，密码:", password); // 在VPS后台打印日志

    if (password === MY_SECRET_PASSWORD) {
        res.json({ success: true, message: "Login successful" });
    } else {
        res.json({ success: false, message: "Invalid password" });
    }
});

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`EPhone 服务已启动!`);
    console.log(`访问地址: http://你的VPS_IP:${PORT}`);
    console.log(`当前设置的密码是: ${MY_SECRET_PASSWORD}`);
    console.log(`=========================================`);
});
