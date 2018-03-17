"use strict"
// import './../common/city.js'
import './../common/index-main.js'
import util from './../common/util.js'
import '../../css/index.less'


// 获取公司信息
$(document).ready(()=>{
    const employee = $('.employee'),
        flag = {
        };

    
    // 员工列表信息
    let employeeList = [];

    let rolesList = [];
    let emStoreList = [];
    let checkStoreId = new Set();
    // 获取员工列表
    function getEmpList(){
        // 获取员工管理信息
        let html = "";
        ajax(Api('getEmpList')).then((res) => {
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
            util.addHtml($('.employee-table'), html);
        })
        // 渲染员工信息表
    }
    // 员工管理
    // $('.nav-employee').on('click',function(){
        flag.edit = false;
        getEmpList();
        //获取门店和类型列表
        const obj_options_select = {
            url1: 'getRoles',
            url2: 'getStoreList',
            store: '#checkedStore',
            roles: '#checkedRoles',
            add_list: '#add-store-soles',
            dele_list: 'delet-store-soles',
            warpul: '#bind-store ul',
            warp: '#bind-store',
            text: '店铺'
        }
        util.getSelectList(obj_options_select, checkStoreId);
        
    // }); 
    //编辑员工信息
    employee.on('click', '#employee-edit-btn',function () {
        const id = $(this).parent().children("input").val();
        $('.edit-employee').trigger("click");
        // 获取点击元素的信息
        ajax(Api('getEmp', { empid: id })).then((res) => {
            const data = res.data;
             // 将员工信息赋值给input
            const form = $('.employee-form');
            form.find('input[name="name"]').val(data.name);
            form.find('input[name="contact"]').val( data.contact);
            form.find('input[name="usertype"]').val( data.usertype);
            flag.edit = true;

        })
        
    });
    // 删除员工
    function deletList(url,callback) {
        const id = $(this).parent().children("input").val();
        const delet = () => {
            ajax(Api(url, { empid:id})).
            then((res) => {
                if(res.code === 200){
                    // 删除成功
                    util.myLayer('删除成功！',1);
                    // 更新界面信息
                    callback();
                }else {
                    util.myLayer('删除失败！', 5);
                }
            })
        }
        return util.myLayerTips('是否删除所选！', delet);
    }
    employee.on('click', '#employee-delet-btn',function () {
        deletList('deletEmp', getEmpList);
    });

    const employee_options = Object.assign(
        Object.assign({}, util.validatorOptions),
        {fields: {
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
                        regexp: /^1\d{10}$/,
                        message: '手机号码格式不正确。'
                    } 
                }
            }
        }});
    // 添加员工
    util.toggle($('.edit-employee'), $('.employee-table'), $('.employee-form'), employee_options, flag,'添加');
    $('.edit-employee').on('click',function(){
        checkStoreId.clear();
        $('#bind-store').unbind('click');
        $('#bind-store ul').empty();
        $('#checkedRoles').selectpicker('refresh');
    })
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
            // 获取绑定门店的id值
            const a = util.getSelectedValue();
            
            postdata = Object.assign(postdata, { typeRoles: a });
            ajax(Api(url,postdata)).then((res) => {
                if(res){
                    employeeForm[0].reset();
                    getEmpList()
                    // 添加成功，
                    $(".edit-employee").trigger("click")
                }else{
                    util.myLayer('请求失败！', 5);
                }
                
            })
        }
    });
  
})

