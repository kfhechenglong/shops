"use strict"
// import './../common/city.js'
import './../common/index-main.js'
import util from './../common/util.js'


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
    const formCompany = $('.form-company'),
        listCompany = $('.list-company');
    let companyData = {};
    // 生成字符串模板
    function pageReady() {
        // const load_index = layer.load(2);
        ajax(Api('getCompanyInfo')).then((res) => {
            let html = "";
            $('#header-info img').attr('src', res.data.headimg);
            $('#header-info .suerName').text(res.data.nickname);
            if (res) {
                companyData = res.data;
                html = '<li class="list-group-item"><span>公司简称：</span><em>' + companyData.name + '</em></li><li class="list-group-item"><span>公司主体：</span><em>' + companyData.ownerid + '</em></li>';
                let inner = '';
                for (let i = 0; i < companyData.mp.minipro.length; i++) {
                    const ele = companyData.mp.minipro[i];
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
                for (let i = 0; i < companyData.mp.fwh.length; i++) {
                    const element = companyData.mp.fwh[i];
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
                    <span>联系方式：</span>
                    <em>${companyData.contact}</em>
                </li>
            `;
            } else {
                html = '<p>暂无数据！</p>'
            }
            util.addHtml($('.list-company'),html);
            
        })
    }
    // 先检查是否登录
    util.checkLogin().then(() =>{
        // 登录，获取公司信息
        pageReady();
    })
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
                regexp: {
                    regexp: /^[0-9]+$/,
                    message: '只能是数字！'
                }
            }
        }
    }, {})
    const options = Object.assign(Object.assign({},util.validatorOptions),{
            fields: valid_obj
    })
    // 点击编辑按钮
    let btn_inner = "edit";
    $('#edit').on('click', () => {
        if (btn_inner === 'cancal') {
            // 点击取消时，清空表单内容
            console.log('取消')
            util.clearFormContent(formCompany)
            // 清除表单验证
            formCompany.data('bootstrapValidator').destroy();
            formCompany.data('bootstrapValidator', null);
            $('#edit').text('编辑');
            btn_inner = "edit";
            // 模板渲染
            listCompany.show();
            formCompany.hide();
        } else {
            // 初始化表单验证
            formCompany.bootstrapValidator(options);
            $('#inputName').val(companyData.name);
            $('#wxs').val(companyData.contact);
            $('#edit').text('取消');
            btn_inner = "cancal";
            listCompany.hide();
            formCompany.show();
        }

    });
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
                listCompany.show();
                formCompany.hide();
            })
        } 
    });

})


