
import './main.js'
import util from './util.js'
// 检查是否登录
ajax('checksession', 'https://nx.smsc.net.cn/wxopen/app/shop/checksession.php/').then((res) => {
    console.log('登录成功状态！');
});

// 退出登录
$(document).ready(() => {
    $('#loginout').on('click', loginout);
    function loginout() {
        console.log('退出');
        const isLogout = () => {
            ajax('loginout', 'https://nx.smsc.net.cn/wxopen/app/shop/logout.php/').then((res) => {
                console.log('退出登录成功！', res);
            })
        }
        return util.myLayerTips('是否退出？', isLogout, '取消', '确定');
    }
});