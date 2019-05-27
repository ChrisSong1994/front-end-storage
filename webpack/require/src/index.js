import ReactDOM from 'react-dom';
import './assets/style/index.scss'; // 引入css
import 'antd/dist/antd.css';
import getRouter from './router';
const router = getRouter();
/* 初始化 */
renderWithHotReload(router);

function renderWithHotReload(RootElement) {
  ReactDOM.render(
    RootElement,
    document.getElementById('app')
  );
}

var cache = {};
function importAll(r) {
  const requireObj = require('./router/index' + ".js")
  console.log(requireObj)
  console.log(r)
  r.keys().forEach(key => cache[key] = r(key));
  console.log(cache)
}

importAll(require.context('./pages/', true, /\.js$/));


if (module.hot) {
  // 实现热更新
  module.hot.accept();
}
