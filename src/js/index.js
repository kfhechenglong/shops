"use strict"
import './city.js'
import util from './util.js'


// window.a = function (){
//     console.log('from iframe....')
// }
window.addEventListener('message', function (e) {
    console.log('from iframe....')
}, false);
// 生成字符串模板
function pageReady (){
    
    ajax(Api('getCompanyInfo')).then((res)=>{
        console.info(res);
        let html = "";
        if (res){
            const data = res.data;
            html = '<li class="list-group-item"><span>公司名称：</span><em>' + data.name + '</em></li><li class="list-group-item"><span>公司地址：</span><em>' + data.addr + '</em></li><li class="list-group-item"><span>公司主体：</span><em>' + data.ownerid+'</em></li>';
            let inner = '';
            for (let i = 0; i < data.mp.minipro.length; i++) {
                const ele = data.mp.minipro[i];
                inner += `
                    <li class="list-group-item clearfix">
                        <span class="fl"> ${ele.vname}：</span>
                        <div class="fl minipro-list">
                            <i class="iconfont icon-xiaochengxu i-selected"></i> 
                            ${ele.path} 
                        </div>
                        <div class="fr">
                            <button id="bind-minipro" type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">绑定小程序</button>
                        </div>
                </li>
                    `;
            }
            html += inner;
            let inner2 = "";
            for (let i = 0; i < data.mp.fwh.length; i++) {
                const element = data.mp.fwh[i];
                // inner2 += ' <li class="list-group-item"><span> 公众号：</span ><em>' + element.vname +'</em></li >';
                inner2 += `
                    <li class="list-group-item clearfix">
                        <span class="fl"> ${element.vname}：</span>
                        <div class="fl minipro-list">
                            <i class="iconfont icon-wechat i-selected"></i> 
                            ${element.path} 
                        </div>
                        <div class="fr">
                            <button id="bind-minipro" type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">绑定服务号</button>
                        </div>
                </li>
                    `;
            }
            html += inner2;
            html += `
                <li class="list-group-item">
                    <span>是否冻结：</span>
                    <em>${data.is_frozen}</em>
                </li>
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
            
        }else{
            html = '<p>暂无数据！</p>'
        }
        const eleList = $('.list-company');
        eleList.empty();
        eleList.append(html);
    })
}
// 获取公司信息
$(document).ready(()=>{

    
    const employee = $('.employee'),
        company = $('.company'),
        flag = {
        };
    // 员工列表信息
    let employeeList = [];
    // 页面加载完毕，获取公司信息
    pageReady();
    // 点击公司获取公司信息
    $('.nav-company').on('click',function () {
        pageReady();
        company.show();
        employee.hide();
    })
    
    /* // 小程序输入框的验证
    let validvalue = {
            validators: {
                notEmpty: {
                    message: '不能为空'
                },
                stringLength: {
                    min: 2,
                    max: 30,
                    message: '长度不能小于2位或超过30位'
                },
                regexp: {
                    regexp: /^[A-Za-z\u4e00-\u9fa5]+$/,
                    message: '只能由字母、数字、点和下划线组成。'
                }
            }
        };
    let validwxid = {
        'wxid0': validvalue
    };
    // 增加小程序id框
    $('#add-wxid').on('click',(e) => {
        // 获取当前类型的input框个数
        const num = $('#wxid-input input').length;
        const ele = `
            <div class="col-sm-8 col-sm-offset-2">
                <input name="wxid${num}" style="margin-top:10px;" class="form-control" placeholder="小程序ID">
                <em class="iconfont icon-shanchu delet-wxid"></em>
            </div>
            `;
        // validwxid[`wxid${num}`] = validvalue;
        $('#wxid-input').append(ele);
        console.log('添加成功');
    });
    // 删除小程序输入框
    $('#wxid-input').on('click','.delet-wxid',function(){
        // const name = $(this).prev().attr('name');
        // delete validwxid[name]
        $(this).parent().remove();
        console.log('删除成功');
    }); */
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
                    regexp: /^1[35678]\d{9}$/,
                    message: '手机号码格式不正确。'
                }
            }
        }
    }, {})
    const options = Object.assign({
        message: 'This value is not valid',
        excluded: ':disabled',
        feedbackIcons: {
            valid: 'iconfont icon-zhengque',
            invalid: 'iconfont icon-cuowu',
            validating: 'iconfont icon-cuowu'
        }},{
            fields: valid_obj
    })
    // 点击编辑按钮
    util.toggle($('#edit'), $('.list-company'), $('.form-company'), options);
    function name() {
        $('.form-company').bootstrapValidator(options);
    }
    
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

    // 获取员工列表
    function getEmpList(){
        // 获取员工管理信息
        let html = "";
        ajax(Api('getEmpList')).then((res) => {
            console.log(res)
            const data = res.data,
                length = data.length;
                employeeList = data;
            if (length > 0){
                html += '<thead>< tr > <th>员工姓名</th> <th>员工类型</th> <th>联系方式</th> <th>更新时间</th> <th>加入时间</th>  <th>操作</th> </tr > </thead ><tbody>';
                for (let i = 0; i < length; i++) {
                    const tr = data[i];
                    html +=  `
                        <tr>
                            <td>${tr.name}</td>
                            <td>${tr.usertype}</td>
                            <td>${tr.uptime}</td>
                            <td>${tr.intime}</td>
                            <td>${tr.contact} </td>
                            <td> 
                                <input type="hidden" value="${tr.id}">
                                <button class="btn btn-warning" id="employee-edit-btn">编辑</button>
                                <button class="btn btn-danger" id="employee-delet-btn">删除</button>
                            </td>
                        </tr>
                        `;
                }
                html += `</tbody>`;
            } else {
                html = `<p>暂无数据！</p>`
            }
            const eleList = $('.employee-table');
            eleList.empty();
            eleList.append(html);
        })
        // 渲染员工信息表
    }
    // 员工管理
    $('.nav-employee').on('click',function(){
        flag.edit = false;
        company.hide();
        employee.show();
        getEmpList()

    }); 
    //编辑员工信息
    employee.on('click', '#employee-edit-btn',function () {
        const id = $(this).parent().children("input").val();
        $('.edit-employee').trigger("click");
        // 获取点击元素的信息
        let getData = {};
        for (let i = 0; i < employeeList.length; i++) {
            const item = employeeList[i];
            if (id == item.id){
                getData = Object.assign({},item);
                break
            }
        }
        // 将员工信息赋值给input
        const form = $('.employee-form');
        form.find('input[name="name"]').attr('value',getData.name);
        form.find('input[name="contact"]').attr('value', getData.contact);
        form.find('input[name="usertype"]').attr('value', getData.usertype);
        flag.edit = true;
    });
    // 删除员工
    employee.on('click', '#employee-delet-btn',function () {
        const id = $(this).parent().children("input").val();
        console.log('delet')
    });
    const employee_options = {
        live: 'disabled', 
        excluded: [':disabled', ':hidden', ':not(:visible)'],  
        feedbackIcons: {//根据验证结果显示的各种图标  
            valid: 'iconfont icon-zhengque',
            invalid: 'iconfont icon-cuowu',
            validating: 'iconfont icon-cuowu'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: '姓名不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 30,
                        message: '姓名长度不能小于2位或超过30位'
                    },
                    regexp: {
                        regexp: /^[A-Za-z\u4e00-\u9fa5]+$/,
                        message: '姓名只能由字母和汉字组成。'
                    },
                }
            },
            pass:{
                validators: {
                    notEmpty: {
                        message: '密码不能为空！'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: '密码长度不能小于6位或超过30位'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码只能由字母、数字和下划线。'
                    },
                }
            },
            employeePasswordTwo:{
                validators: {
                    notEmpty: {
                        message: '密码不能为空！'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: '密码长度不能小于6位或超过30位'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码只能由字母、数字和下划线。'
                    },
                    identical: {//与指定文本框比较内容相同  
                        field: 'pass',
                        message: '两次输入密码不匹配'
                    },  
                }
            },
            contact:{
                validators: {
                    notEmpty: {
                        message: '手机号码不能为空！'
                    },
                    regexp: {
                        regexp: /^1[35678]\d{9}$/,
                        message: '手机号码格式不正确。'
                    } 
                }
            }
        }
    };
    // 添加员工
    util.toggle($('.edit-employee'), $('.employee-table'), $('.employee-form'), employee_options, flag,'添加');
    // 添加员工表单验证
    const employeeForm = $('.employee-form');
    $(".employee-btn-add").click(function () {
        console.log(flag)
        employeeForm.bootstrapValidator('validate');//提交验证  
        if (employeeForm.data('bootstrapValidator').isValid()) {
            // 获取表单数据
            const data = employeeForm.serializeArray();
            let postdata = {};
            data.forEach((item)=>{
                if(item.name !== 'employeePasswordTwo'){
                    postdata[item.name] = item.value;
                }
            });
            let url = 'addEmp';
            if (flag.edit){
                url = 'updateEmp';
                postdata = Object.assign(postdata, { empid:2});
            }
            ajax(Api(url,postdata)).then((res) => {
                if(res){
                    employeeForm[0].reset();
                    getEmpList()
                    // 添加成功，
                    $('.employee-table').show();
                    employeeForm.hide();
                }else{
                    alert('请求失败')
                }
                
            })
        }
    });
})
