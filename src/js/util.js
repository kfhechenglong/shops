import { resolve } from "url";
const Layer = require('../../static/plugins/layer/layer.min.js')

"use strict"
/* 
切换按钮
 */
const toggle = (target, ele1, ele2,options,flag ,text = "编辑") => {
    let btn_inner = "edit";
    target.on('click', () => {
        if (btn_inner === 'cancal') {
            // ele2[0].reset();
            flag ? (flag.edit = true) :'';
            // 点击取消时，清空表单内容
            console.log('取消')
            $(':input', ele2)
                .not(':button, :submit, :reset, :hidden')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
            // console.log(ele2.data('bootstrapValidator'))
            // 清除表单验证
            ele2.data('bootstrapValidator').destroy();
            ele2.data('bootstrapValidator', null); 
            target.text(text);
            btn_inner = "edit";
            // 模板渲染
            ele1.show();
            ele2.hide();
        } else{
            // 初始化表单验证
            ele2.bootstrapValidator(options)
            target.text('取消');
            btn_inner = "cancal";
            ele1.hide();
            ele2.show();
        }
        
    });
    
};


// 弹框提示
const layer = (msgs, icon = 5) => {
    Layer.msg(msgs, { icon: icon, time: 2000 });
};
const layer_confirm = (msg,callback,btn1 = '取消' ,btn2 = '删除') => {
    Layer.confirm(msg, {
        title :'提示',
        btn: [btn1, btn2] //按钮
    }, function () {
        // 取消按钮
        layer(btn1);
    }, function () {
        // 确定按钮
        typeof callback === 'function' ?  callback() : '';
    });
};
module.exports = {
    toggle,
    myLayer:layer,
    myLayerTips: layer_confirm
}