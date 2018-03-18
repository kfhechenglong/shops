"use strict"
// import './../common/city.js'
import './../common/index-main.js'
import util from './../common/util.js'
import '../../css/index.less'


// 获取公司信息
$(document).ready(()=>{
    window.addEventListener('message', function (e) {
        console.log('from iframe....',e)
        if(e.data){
            try {
                const msg = JSON.parse(e.data);
                console.log(msg);
                if (msg.code === 200) {//绑定成功
                    // 关闭弹窗
                    util.myLayer('绑定成功！', 1);
                    $('#myModal-company').modal('hide');
                    pageReady();
                } else {
                    util.myLayer('绑定失败,请重试！', 2,3000);
                }
            } catch (error) {
                util.myLayer('未知错误！', 2);
            }
        }
    }, false);
    const company = $('.company');

    // 生成字符串模板
    function pageReady() {
        // const load_index = layer.load(2);
        ajax(Api('getCompanyInfo')).then((res) => {
            let html = "";
            if (res) {
                const data = res.data;
                html = '<li class="list-group-item"><span>公司简称：</span><em>' + data.name + '</em></li><li class="list-group-item"><span>公司主体：</span><em>' + data.ownerid + '</em></li>';
                let inner = '';
                for (let i = 0; i < data.mp.minipro.length; i++) {
                    const ele = data.mp.minipro[i];
                    const classNames = ele.name ? 'i-selected' : '';
                    inner += `
                    <li class="list-group-item clearfix">
                        <span class="fl"> ${ele.vname}：</span>
                        <div class="fl minipro-list tc">
                            <i class="iconfont icon-xiaochengxu ${classNames}"></i> 
                            ${ele.name} 
                        </div>
                    `;
                    if (classNames !== 'i-selected'){
                        inner += `<div class="fr">
                                <button id="bind-minipro" data-order="${ele.url}" type="button" class="btn btn-primary" >绑定小程序</button>
                            </div>`;
                    }
                    inner += `</li>`;
                }
                html += inner;
                let inner2 = "";
                for (let i = 0; i < data.mp.fwh.length; i++) {
                    const element = data.mp.fwh[i];
                    const classNames = element.name ? 'i-selected' : '';
                    inner2 += `
                    <li class="list-group-item clearfix">
                        <span class="fl"> ${element.vname}：</span>
                        <div class="fl minipro-list tc">
                            <i class="iconfont icon-wechat ${classNames}"></i> 
                            ${element.name} 
                        </div>`;
                    if (classNames !== 'i-selected') {
                        inner2 += `<div class="fr">
                                 <button id="bind-minipro" data-order="${element.url}" type="button" class="btn btn-primary" data-toggle="modal">绑定服务号</button>
                            </div>`;
                    }
                    inner2 += `</li>`;
                }
                html += inner2;
                html += `
                <li class="list-group-item">
                    <span>加入时间：</span>
                    <em>${data.intime}</em>
                </li>
                <li class="list-group-item">
                    <span>更新时间：</span>
                    <em>${data.uptime}</em>
                </li>
                <li class="list-group-item">
                    <span>联系方式：</span>
                    <em>${data.contact}</em>
                </li>
            `;
            } else {
                html = '<p>暂无数据！</p>'
            }
            util.addHtml($('.list-company'),html);
            
        })
    }
    
    // 点击公司获取公司信息
    pageReady();
    // 表单验证
    const valid_obj = Object.assign({
        name: {
            message: '公司名称不能为空',//默认提示信息
            validators: {
                notEmpty: {
                    message: '公司名称不能为空'
                },
                stringLength: {
                    min: 2,
                    max: 30,
                    message: '公司名称长度不能小于2位或超过30位'
                },
                regexp: {
                    regexp: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
                    message: '公司名称只能由字母、数字、点和下划线组成。'
                },
            }
        },
        contact: {
            validators: {
                notEmpty: {
                    message: '手机号码不能为空！'
                },
                regexp: {
                    regexp: /^1\d{10}$/,
                    message: '手机号码格式不正确。'
                }
            }
        }
    }, {})
    const options = Object.assign(Object.assign({},util.validatorOptions),{
            fields: valid_obj
    })
    // 点击编辑按钮
    util.toggle($('#edit'), $('.list-company'), $('.form-company'), options);

    // 绑定微信及公众号
    company.on('click','#bind-minipro',function(e){
        const url = $(e.target).attr('data-order')
        ajax(null,url).then((res) => {
            if(res.data){
                $('#myModal-company').modal('show')
                const html = `
                    <div class="modal-body">
                        <div style="width:700px; height:549px;margin:0 auto;position:relative">
                            <div class="shade-top"></div>
                            <iframe id="wxcode" src="${res.data}" frameborder="0" scrolling="no"  width="100%" height="100%;"></iframe>
                            <div class="shade-bottom"></div>
                        </div>
                        
                    </div>
                `;
                $('#myModal-company-inner').empty();
                $('#myModal-company-inner').append(html);
            }
        });
    });
    // 关闭模态框的回调函数
    $('#myModal-company').on('hidden.bs.modal', function (e) {
        $('#myModal-company-inner').empty();
        $('#myModal-company-inner').unbind('click');
    })
    // 验证成功提交修改公司信息
    $('#company-submit').click(function(){
        const formCompany = $('.form-company');
        formCompany.bootstrapValidator('validate');//提交验证  
        if (formCompany.data('bootstrapValidator').isValid()) {
            // 获取表单数据
            const data = formCompany.serializeArray();
            const postdata = {};
            data.forEach((item) => {
                postdata[item.name] = item.value;
            });
            // 提交更改信息
            ajax(Api('updateCompanyInfo', postdata)).then((res) => {
                // 清空表内容
                formCompany[0].reset();
                pageReady()
                $("#edit").trigger("click")
                // 添加成功，
                $('.list-company').show();
                formCompany.hide();
            })
        } 
    });

})


