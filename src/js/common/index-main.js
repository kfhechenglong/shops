
import './main.js'
import util from './util.js'
import { resolve } from 'url';
import './../../css/index.less'
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

// import './header.js'