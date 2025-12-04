const express = require('express');
const path = require('path');
const app = express();

const PORT = 7000;

// 配置子应用路径 (你的VPS文件夹名)
const PATH_TO_330 = '../site330'; 
const PATH_TO_TUK = '../sitetuk';

// 托管主程序文件
app.use(express.static(path.join(__dirname, '/')));

// 托管子应用 (挂载)
app.use('/site330', express.static(path.join(__dirname, PATH_TO_330)));
app.use('/sitetuk', express.static(path.join(__dirname, PATH_TO_TUK)));

app.listen(PORT, () => {
    console.log(`EPhone 服务已启动: http://localhost:${PORT}`);
});
