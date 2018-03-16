"use strict"
import './common/city.js'
import './common/main.js'
import util from './common/util.js'
import Cookie from './common/checkCookie.js'
import '../css/index.less'

// document.cookie = "PHPSESSID=" + 'lcto08vongb772jcorhugg3vb5';
// Cookie.getCookie();
// 检查是否登录
ajax('checksession','https://nx.smsc.net.cn/wxopen/app/shop/checksession.php/').then((res)=>{
    console.log('登录成功状态！');
})


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
    const employee = $('.employee'),
        company = $('.company'),
        store = $('.store'),
        customer = $('.customer'),
        flag = {
        };

    // 生成字符串模板
    function pageReady() {
        ajax(Api('getCompanyInfo')).then((res) => {
            let html = "";
            // 添加头像信息
            $('#header-info img').attr('src', res.data.headimg);
            $('#header-info .suerName').text(res.data.nickname);
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
    
    // 员工列表信息
    let employeeList = [];
    // 点击公司获取公司信息
    $('.nav-company').on('click',function () {
        pageReady();
        company.show();
        employee.hide();
        store.hide();
        customer.hide();
        $('.order').hide();
    })
    $('.nav-company').trigger('click');
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





    let rolesList = [];
    let emStoreList = [];
    let checkStoreId = new Set();
    // 获取员工列表
    function getEmpList(){
        // 获取员工管理信息
        const index1 = layer.load(2);
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
    $('.nav-employee').on('click',function(){
        flag.edit = false;
        company.hide();
        employee.show();
        store.hide();
        customer.hide();
        $('.order').hide();
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
        
    }); 
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


    /* 
    门店管理逻辑
    
    */
    /* 门店地址 */
    
    let storeLists = [];//门店列表
    let isEdit = false;//是否是编辑状态
    let currentStoreId = '';//当前门店id
    let emlistId = new Set();//当前门店id
    let selectEmId = new Set();//当前门店id
    const getStoreList_fn = () =>{
        ajax(Api('getStoreList')).then((res) => {
            if (res) {
                const data = res.data;
                storeLists = data;
                const length = data.length;
                let html = '';
                if (length > 0) {
                    html += '<thead>< tr > <th>序号</th> <th>店名</th><th>操作员</th> <th>联系方式</th><th>地址</th><th>二维码</th><th>休店</th><th>操作</th> </tr > </thead ><tbody>';
                    for (let i = 0; i < length; i++) {
                        const tr = data[i];
                        html += `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${tr.name}</td>
                            <td>
                        `;
                        if (tr.operator_ids){
                            const a = tr.operator_ids;
                            for (let j = 0; j < a.length; j++) {
                                const el = a[j];
                                html += '<p>' + el.name +'</p>'
                            }
                        }
                        html += `</td>
                            <td>${tr.contact} </td>
                            <td>${tr.input_province}${tr.input_city}${tr.input_area}${tr.addr_detail}</td>
                            <td> 
                                <button data-id="${tr.qrcode}" class="btn btn-primary" id="store-code-btn">获取</button>
                            </td>
                            <td> 
                                <button data-id="${tr.id}" class="btn btn-primary" id="store-rest-btn">设置</button>
                            </td>
                            <td> 
                                <input type="hidden" value="${tr.id}">
                                <button class="btn btn-warning" id="store-edit-btn">编辑</button>
                                <button class="btn btn-danger" id="store-delet-btn">删除</button>
                            </td>
                        </tr>
                        `;
                    }
                    html += `</tbody>`;
                } else {
                    html = `<p>暂无数据！</p>`
                }
                const eleList = $('.store-table');
                eleList.empty();
                eleList.append(html);
            }
        });
    }
    const showStore = () =>{
        // 显示当前模块
        store.show();
        company.hide();
        employee.hide();
        customer.hide();
        $('.order').hide();
        // 获取门店列表
        getStoreList_fn()
    };

    // 实例化地图
    function creatMap(address) {
        const map = new BMap.Map("store-map");
            map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
            map.enableContinuousZoom();
        if (address){
            const a = address.input_province + address.input_city + address.input_area;
            console.log(a);
            map.setCenter(a)
            // 初始化地图,设置城市和地图级别。
            map.centerAndZoom(a, 12);
            
        }else{
            // 获取经纬度
            const geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    console.log(r.address.city);
                    // var mk = new BMap.Marker(r.point);
                    map.setCenter(r.address.city)
                    // 初始化地图,设置城市和地图级别。
                    map.centerAndZoom(r.address.city, 12);
                }
                else {
                    alert('failed' + '获取定位失败！');
                }
            });
        }
        // 获取选择的地区地址
        let input_province = "";
        let input_city = "";
        let input_area = "";
        $("#input_province").change(function (e) {
            input_province = e.target.value;
            map.centerAndZoom(input_province, 12);
            map.clearOverlays();
        });
        $("#input_city").change(function (e) {
            input_city = e.target.value;
            map.centerAndZoom(input_province + input_city, 12);
            map.clearOverlays();
        });
        $("#input_area").change(function (e) {
            input_area = e.target.value;
            map.centerAndZoom(input_province + input_city + input_area, 13);
            map.clearOverlays();
        })
        // 获取点击地图地址
        function getClickAddress(e) {
            const geoc = new BMap.Geocoder();
            let pt = e.point
            geoc.getLocation(pt, function (res) {
                const addComp = res.addressComponents;
                console.log(addComp)
                let site = '';
                // 判断是否有门牌及街道号
                if (!addComp.streetNumber && res.surroundingPois.length > 0) {
                    if (addComp.street) {
                        site = addComp.street + res.surroundingPois[0].title;
                    } else {
                        site = res.surroundingPois[0].title;
                    }
                } else if (!addComp.streetNumber && res.surroundingPois.length === 0) {
                    site = '';
                } else {
                    site = addComp.street + addComp.streetNumber;
                }
                const myValue = addComp.province + addComp.city + addComp.district + site;
                //将对应的HTML元素设置值
                $('#addr_detail').val(site);
                if (addComp.province === addComp.city) {
                    $("#input_province").val(addComp.province);
                    $("#input_province").trigger('change')
                    $("#input_city").val(addComp.district);
                    $("#input_city").trigger('change')
                } else {
                    $("#input_province").val(addComp.province);
                    $("#input_province").trigger('change')
                    $("#input_city").val(addComp.city);
                    $("#input_city").trigger('change')
                    $("#input_area").val(addComp.district);
                }
                map.clearOverlays();    //清除地图上所有覆盖物
                map.centerAndZoom(pt, 20);
                const marker = new BMap.Marker(pt);
                map.addOverlay(marker);    //添加标注

                var removeMarker = function (e, ee, marker) {
                    map.removeOverlay(marker);
                    $('#addr_detail').val('');
                }
                //创建右键菜单
                var markerMenu = new BMap.ContextMenu();
                markerMenu.addItem(
                    new BMap.MenuItem('删除', removeMarker.bind(marker))
                );
                marker.addContextMenu(markerMenu);
            });
        }
        map.addEventListener("click", getClickAddress);

    };
    const callFn = {
        validators: {
            callback: {message: '当前项不能为空！',
                callback: function (value, validator) {
                    if (value == 0) {
                        return false
                    } else {
                        return true;
                    }
                }
            }
        }
    };
    const store_validator_options = Object.assign(Object.assign({},util.validatorOptions),{
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: '店名不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 30,
                        message: '店名长度不能小于2位或超过30位'
                    },
                    regexp: {
                        regexp: /^[0-9A-Za-z\u4e00-\u9fa5]+$/,
                        message: '店名只能由字母、数字、汉字组成。'
                    },
                }
            },
            // 'select-store-all': {
            //     validators: {
            //         notEmpty: {
            //             message: '当前项不能为空！'
            //         },
            //         callback: {
            //             callback: function (value, validator) {
            //                 if (value == 0) {
            //                     return false
            //                 } else {
            //                     return true;
            //                 }
            //             }
            //         }
            //     }
            // },
            'input_province': callFn,
            'input_city': callFn,
            addr_detail: callFn,
            contact: {
                validators: {
                    notEmpty: {
                        message: '联系方式不能为空！'
                    },
                    regexp: {
                        regexp: /^[0-9]+$/,
                        message: '只能是数字！'
                    }
                }
            }
        }
    })
    // 添加门店
    const addStore = (address, seleted) =>{
        $('.store-table').hide();
        $('.store-form').show();
        $('.add-store').hide();
        $('.off-store').show();
        // 获取列表
        const html = `
            <div id="store-map" style="width:100%;height:300px;"></div>`;
        $('#map-warp').empty();
        $('#map-warp').append(html);270002
        // 创建表单验证
        $('.store-form').bootstrapValidator(store_validator_options)
        // if (seleted) {
        //     creatMap(address);
        // } else{
        //     creatMap();
        // }

        const obj_options_select = {
            url1:'getRoles',
            url2:'getEmpList',
            store:'#select-store-id',
            roles:'#select-store-roles',
            add_list:'#add-store-soles-2',
            dele_list:'delet-store-soles-list',
            warpul:'#bind-em-roles ul',
            warp:'#bind-em-roles',
            text:'员工'
        }
        util.getSelectList(obj_options_select, selectEmId);
        
    };
    // 关闭添加
    const closeAddModel = () =>{
        isEdit = false;
        //清除表单内容
        util.clearFormContent($('.store-form'));
        $('.store-form').data('bootstrapValidator').destroy();
        $('.store-form').data('bootstrapValidator', null); 
        $('.store-table').show();
        $('.store-form').hide();
        $('.add-store').show();
        $('.off-store').hide();
    };
    $('.nav-store').on('click',showStore);
    $('.add-store').on('click',addStore);
    $('.off-store').on('click',closeAddModel);
    //点击休店设置按钮 
    store.on('click','#store-rest-btn',function(){
        $('#myModal-company').modal('show');
        const html = `
            <div class="modal-body">
                <div class="clearfix">
                    <div class="fl wx-code tc">
                        选择时间
                        <div class="input-group date">
                            <input id="datetimepicker" type="text" class="form-control" >
                        </div>
                    </div>
                    <div class="em-list fl">
                    </div>
                </div>
                <p class="tc">
                    <span style="color:red">提示：</span>
                    <em style="color: darkblue;">请现在该店休店时间！</em>
                </p>
            </div>
        `;
        $('#myModal-company-inner').empty();
        $('#myModal-company-inner').append(html);
        
        $('#datetimepicker').datetimepicker({
            language: "zh-CN",    //语言选择中文
            format: "yyyy-mm-dd", 
            timepicker: true,
            autoclose: false,
            startView: 2,
            minView: 2, 
            todayBtn:true,
        });
        // $('#datetimepicker').datepicker('destroy');
    });
    // 获取二维码
    store.on('click', '#store-code-btn', function () {
        // 先清空员工列表id
        emlistId.clear();
        $('#myModal-company').modal('show');
        // 获取当前店的二维码
        const qrcode = $(this).attr('data-id');
        const html = `
            <div class="modal-body">
                <div class="clearfix">
                    <div class="fl wx-code tc">
                        <p class="tc">二维码<p>
                        <img class="" src="${qrcode}" title="二维码">
                        <a href="${qrcode}" download="下载二维码" class="btn btn-info active" role="button">下载保存</a>
                    </div>
                    <div class="em-list fl">
                    </div>
                </div>
                <p class="tc">
                    <span style="color:red">提示：</span>
                    <em style="color: darkblue;">可以选择员工发送二维码，也可下载到本地！</em>
                </p>
            </div>
        `;
        $('#myModal-company-inner').empty();
        $('#myModal-company-inner').append(html);

        // 获取二维码
        ajax(Api('getEmpList')).then((res) => {
            const data_list = res.data;
            if (data_list) {
                let html = `<p class="tc">员工列表<p><ul>`;
                for (let i = 0; i < data_list.length; i++) {
                    const lis = data_list[i];
                    html += `<li  class="list-group-item em-lis fz16" data-id="${lis.id}">${lis.name}</li>`
                }
                html += `</ul>
                <button type="button" class="fr btn btn-info send-em-code on">确定发送</button>
                `;
                $('#myModal-company .modal-body .em-list').empty();
                $('#myModal-company .modal-body .em-list').append(html);
                // 绑定事件
                $('#myModal-company-inner').on('click','.em-lis',function(){
                    $(this).toggleClass('active');
                    const id = $(this).attr('data-id')
                    emlistId.has(id) ? emlistId.delete(id) : emlistId.add(id)
                    console.log(emlistId)
                })
            }else{
                util.myLayer('获取员工列表出错！',5)
            }
        });

    });
    // 删除门店
    store.on('click', '#store-delet-btn', function () {
        deletList('deletStore', getStoreList_fn);
    });
    // 编辑门店
    store.on('click', '#store-edit-btn', function () {
        isEdit = true;
        currentStoreId = $(this).parent().children("input").val();
        // 获取点击元素的信息
        let getData = {};
        for (let i = 0; i < storeLists.length; i++) {
            const item = storeLists[i];
            if (currentStoreId == item.id) {
                getData = Object.assign({}, item);
                break
            }
        }
        const select = (getData.operator_ids).map((item) =>{
            return item.id;
        })
        // 获取单个门店信息
        ajax(Api('getStore', { storeid: currentStoreId})).then((res) =>{
            
        })
        // 将员工信息赋值给input
        const form = $('.store-form');
        form.find('input[name="name"]').val(getData.name);
        form.find('input[name="contact"]').val(getData.contact);
        // $('#select-store-id').selectpicker('val', select);
        form.find('input[name="input_province"]').val(getData.input_province);
        form.find('input[name="input_city"]').val(getData.input_city);
        form.find('input[name="input_area"]').val(getData.input_area);
        form.find('input[name="addr_detail"]').val(getData.addr_detail);
        addStore(getData, select);
        
    });
    const submit_store_add = () => {
        $('.store-form').bootstrapValidator('validate');//提交验证  
        if ($('.store-form').data('bootstrapValidator').isValid()){
            const getData = $('.store-form').serializeArray(),
                arr = [];
            let  obj = {},
                api = 'addStore';
            for (let i = 0; i < getData.length; i++) {
                const item = getData[i];
                if (item.name === "select-store-all"){
                    arr.push(item.value)
                }else{
                    obj[item.name] = item.value
                }
            }
            obj.operator_ids = arr;
            if (isEdit){
                // 更新门店
                obj.storeid = currentStoreId;
                api = 'gudateStore';
            }
            // 获取绑定员工的id值
            const a = util.getSelectedValue('#bind-em-roles ul li');
            obj = Object.assign(obj, { typeRoles: a });
            ajax(Api(api,obj)).then((res) =>{
                if(res){
                    util.myLayer('添加成功！',1);
                    closeAddModel();
                    getStoreList_fn();
                }
            })
        }
    };
    // 提交新增门店地址
    $('.store-btn-add').click(submit_store_add)


    /* 
        客户管理
    */
    class Customer{
        constructor(a,b,c,d){
            this.form = a;
            this.table = b;
            this.off = c;
            this.add = d;
            this.customerIsEdit = false ;
        }
        showOrder() {
            customer.show();
            store.hide();
            company.hide();
            employee.hide();
            $('.order').hide();
            $('.off-customer').trigger('click');
        }
    }
    // 获取客户列表
    Customer.prototype.getCustomerList_fn = function (){
        const index = layer.load(2);
        const that = this;
        // 绑定添加
        this.add.on('click', function () {
            that.addNewCustomer();
        });
        $('.customer-btn-add').on('click',function(){
            that.addNewCustomerBtn();
        });
        this.off.on('click',function(){
            that.offNewCustomer();
        } );
        ajax(Api('getCustomerList')).then((res) => {
            if (res.data) {// 请求成功，渲染列表
                const data = res.data,
                    length = data.length;
                this.customerList = data;
                let html = '';
                if (length > 0) {
                    html += '<thead>< tr > <th>客户姓名</th> <th>微信</th> <th>微信电话</th><th>联系方式</th><th>绑定电话</th><th>更新时间</th> <th>加入时间</th>  <th>二维码</th>  <th>操作</th> </tr > </thead ><tbody>';
                    for (let i = 0; i < length; i++) {
                        const tr = data[i];
                        html += `
                        <tr>
                            <td>${tr.name}</td>
                            <td>${tr.wxuid}</td>
                            <td>${tr.wxphone}</td>
                            <td>${tr.contact}</td>
                            <td>${tr.bind_phone}</td>
                            <td>${tr.uptime}</td>
                            <td>${tr.intime}</td>
                            <td> 
                                <button data-qrcode="${tr.qrcode}" class="btn btn-info" id="customer-show-code-btn">二维码</button>
                                <button data-id="${tr.id}" class="btn btn-danger" id="customer-show-clear-btn">清除</button>
                            </td>
                            <td> 
                                <input type="hidden" value="${tr.id}">
                                <button class="btn btn-warning" id="customer-edit-btn">编辑</button>
                            </td>
                        </tr>
                        `;
                    }
                    html += `</tbody>`;
                } else {
                    html = `<p>暂无数据！</p>`
                }
                this.table.empty();
                this.table.append(html);
                customer.on('click', '#customer-delet-btn', function () {
                    deletList('deletStore', that.getCustomerList_fn);
                });
                customer.on('click', '#customer-edit-btn',function(){
                    that.editCustomer(this);
                } );
                customer.on('click', '#customer-show-code-btn',function(){
                    that.showCode(this);
                } );
                customer.on('click', '#customer-show-clear-btn',function(){
                    that.clearCode(this);
                } );
            }
        })
    };
    // 清除客户微信二维码
    Customer.prototype.clearCode = function(self){
        ajax(Api('clearCode', { 'customerid': $(self).attr('data-id')})).then((res) =>{
            util.myLayer('清除成功！', 1);
        })
    };
    // 显示客户微信绑定二维码
    Customer.prototype.showCode = function (self) {
        const url = $(self).attr('data-qrcode');
        $('#myModal-company').modal('show')
        const html = `
                <div class="modal-body">
                    <div style="width:450px; height:450px;margin:0 auto;">
                        <iframe id="wxcode" src="${url}" frameborder="0" scrolling="no"  width="100%" height="100%;"></iframe>
                    </div>
                    
                </div>
            `;
        $('#myModal-company-inner').empty();
        $('#myModal-company-inner').append(html);
    };
    Customer.prototype.addNewCustomer = function () {
        this.add.hide();
        this.off.show();
        this.table.hide();
        this.form.show();
    };
    Customer.prototype.editCustomer = function (self){
        this.customerIsEdit = true;
        this.add.trigger('click');
        const currentId = $(self).parent().children("input").val();
        // 获取点击元素的信息
        let getData = {};
        for (let i = 0; i < this.customerList.length; i++) {
            const item = this.customerList[i];
            if (currentId == item.id) {
                getData = Object.assign({}, item);
                break
            }
        }
        // 将员工信息赋值给input
        const form = this.form;
        form.find('input[name="id"]').val(currentId);
        form.find('input[name="name"]').val(getData.name);
        form.find('input[name="contact"]').val(getData.contact);
        form.find('input[name="bind_phone"]').val(getData.bind_phone);
    }
    Customer.prototype.addNewCustomerBtn = function (){
        // 获取表单内容
        const form = this.form.serializeArray(),
            obj = {};
        let api = 'addCustomer',
            msg = '添加成功！';
        if (this.customerIsEdit) {//编辑客户
            api = 'updateCustomer';
            msg = '更新成功！'
            obj.customerid = form.id
        }
        for (let i = 0; i < form.length; i++) {
            const item = form[i];
            obj[item.name] = item.value;
        }
        ajax(Api(api, obj)).then((res) => {
            if (res) {
                util.myLayer(msg, 1);
                this.off.trigger('click');
                // 重新获取列表
                this.getCustomerList_fn();
            } else {
                util.myLayer('操作失败！', 5);
            }
        })
    };
    Customer.prototype.offNewCustomer = function () {
        this.customerIsEdit = false;
        this.off.hide();
        this.add.show();
        this.table.show();
        this.form.hide();
        // 清空表格内容
        $(':input', this.form).val('');
        // util.clearFormContent(this.form);
    };
    // let customerList = [];
    // let customerIsEdit = false;
    $('.nav-customer').on('click',function () {
        const new_customer = new Customer($('.customer-form'), $('.customer-table'), $('.off-customer'), $('.add-customer'));
        new_customer.showOrder();
        new_customer.getCustomerList_fn();
        return false
    })

    /* 
        排班管理
    */
    class Order {
        constructor (a,b){
            this.tableList = a;
            this.tableWeek = b;
        }
        
        // 获取列表
        getOrder(){
            this.showOrder()
        }
        showOrder(){
            $('.order').show();
            customer.hide();
            store.hide();
            company.hide();
            employee.hide();
            this.cancel();
        }
        
    }
    // 获取列表
    Order.prototype.getDoctorList = function(){
        const that = this;
        ajax(Api('getEmpList')).then((res) => {
            let html = '';
            const data = res.data,
                length = data.length;
            this.doctorList = data;
            if (length > 0) {
                html += '<thead><tr> <th>序号</th><th>员工姓名</th><th>角色</th><th>排班</th> </tr > </thead><tbody>';
                for (let i = 0; i < length; i++) {
                    const tr = data[i];
                    html += `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${tr.name}</td>
                            <td>${tr.usertype}</td>
                            <td> 
                                <input type="hidden" value="${tr.id}">
                                <button class="btn btn-warning" id="order-week-btn">按周</button>
                                <button class="btn btn-danger" id="order-month-btn">按天</button>
                            </td>
                        </tr>
                        `;
                }
                html += `</tbody>`;
            } else {
                html = `<p>暂无数据！</p>`
            }
            const eleList = this.tableList;
            eleList.empty();
            eleList.append(html);
            const _show_week = function(){
                that.currentId = $(this).parent().children("input").val();
                that.selectList('week')
            };
            const _show_month = function(){
                that.currentId = $(this).parent().children("input").val();
                that.selectList('month')
            };
            this.tableList.unbind("click");
            this.tableList.on('click', '#order-week-btn', _show_week)
            this.tableList.on('click', '#order-month-btn', _show_month)
        })
    };
    Order.prototype.getStoreList = function(){
        return new Promise((resolve,reject) => {
            ajax(Api('getStoreList')).then((res) => {
                let html = `
                    <label class="checkbox-inline">
                        <input name="checkStore" type="radio" value="-1">不出诊
                    </label>
                `;
                const data = res.data,
                    length = data.length;
                this.storeList = data;
                if (length > 0) {
                    for (let i = 0; i < length; i++) {
                        const tr = data[i];
                        html += `
                        <label class="checkbox-inline">
                                <input name="checkStore" type="radio" value="${tr.id}">${tr.name}
                            </label>
                            `;
                    }
                } else {
                    html = `<p>暂无数据！</p>`
                }
                const eleList = $('.order-week-inner-form');
                eleList.empty();
                eleList.append(html);
                resolve(data)
            })
        })
        
    }
    Order.prototype.cancel = function (){
        this.tableList.show();
        this.tableWeek.hide();
        // 解绑事件
        $('.save-order-time').unbind("click");
        $('.cancel-order-time').unbind("click");
        $('.order-week-modal-on').unbind("click");
        $('#order-week').unbind("click");
    }
    // 按周按月排班
    Order.prototype.selectList = function (time) {
        const that = this;
        this.tableList.hide();
        this.tableWeek.show();
        // 获取当前的人医生姓名
        for (let i = 0; i < this.doctorList.length; i++) {
            const person = this.doctorList[i];
            if(person.id === this.currentId){
                this.name = person.name;
                break
            }
        }
        this.tableWeek.children('p').html(`<p>当前医生：${this.name}</p>`);
        // 创建内容
        if(time === 'week'){
            this.creatWeek();
        } else{
            this.creatMonth();
        }
        // 绑定取消事件
        $('.cancel-order-time').on('click', _cancel);
        // 取消排班
        function _cancel (){
            that.cancel();
        }
        // 获取排班数据
        $('.save-order-time').on('click',save);
        function save(){
            // 获取排班的值
            const td = $('.order-week-table td'),
                order_res_arr = [];
            for (let i = 0; i < td.length; i++) {
                const element = td[i];
                const time = $(element).children('.day');
                const am_content = $(element).children('.am').children('.content').attr('id');
                const pm_content = $(element).children('.pm').children('.content').attr('id');
                if (am_content || pm_content){
                    let obj = {
                        am: am_content ? am_content : '',
                        pm: pm_content ? pm_content : ''
                    };
                    obj[time.attr('name')] = time.text();
                    order_res_arr.push(obj)
                }
            }
            that.toSaveOrder(order_res_arr,time)
        }
        let ele = '';
        // 获取店面列表
        this.getStoreList().then((res) => {
            this.tableWeek.on('click', '.order-week-table td .content', _showModal)
        });
        function _showModal (e){
            ele = e.target;
            that.showModal(e)
        }
        $('.order-week-modal-on').on('click',function(){
            // console.log(that.storeList)
            let content = '';
            const id = $('.order-week-inner-form').serializeArray()[0].value;
            for (let i = 0; i < that.storeList.length; i++) {
                const ele = that.storeList[i];
                if(id == ele.id){
                    content = ele.name;
                    break
                }
            }
            $(ele).empty();
            $(ele).attr('id', '');
            $(ele).attr('id', id);
            if (id == '-1') {
                $(ele).parent().addClass('not');
                $(ele).text('不出诊');
            } else {
                $(ele).parent().addClass('out');
                $(ele).text(content)
            }
        });
    };
    // 保存排班
    Order.prototype.toSaveOrder = function(order,time){
        // console.log(arguments);
        if (order.length === 0){
            util.myLayer('请选择内容', 2);
            return false;
        }
        let data = { empid: this.currentId };
        let url = '';
        if(time === 'week'){
            data.weektime = order;
            url = 'saveWeekTime';
        }else{// 保存月
            data.date = order;
            url = 'saveDayTime';
        }
        ajax(Api(url, data)).then((res) => {
            if (res.data) {
                util.myLayer('保存成功！', 1);
                // 关闭
                this.cancel();
            }
        })
    }
    Order.prototype.showModal = function (e){
        let ele = e.target;
        $(ele).parent().removeClass('out not');
        // 如果有则删除，没有则显示选择项
        if($(ele).html()){
            $(ele).empty();
            $(ele).attr('id', '');
            return false;  
        } 
        // 显示模态框
        $('#myModal-order').modal('show')
    }
    // 添加按周的元素
    Order.prototype.creatWeek = function(){
        // 获取排班
        $('.order-week-table').empty();
        ajax(Api('getWeekTime', { empid: this.currentId})).then((res) =>{
            return Promise.resolve(res);
        }).then((res) =>{
            let innerHtml = `
            <tr>
                <th>周一</th>
                <th>周二</th>
                <th>周三</th>
                <th>周四</th>
                <th>周五</th>
                <th>周六</th>
                <th>周日</th>
            </tr>
            <tr>`;
            const arr = [1,2,3,4,5,6,0],
                data = res.data;
            for (let i = 0; i < arr.length; i++) {
                let amInner = '',
                    pmInner = '',
                    amClass = '',
                    amId = '',
                    pmId = '',
                    pmClass = '';
                if (Array.isArray(data) ){
                    
                    for (let j = 0; j < data.length; j++) {
                        const item = data[j];
                        // 获取当前天
                        if (item.week == arr[i]){
                            if (item.am.id){
                                amId = item.am.id;
                                if(item.am.id == '-1'){
                                    amInner = '不出诊';
                                    amClass = 'not';
                                }else{
                                    amInner = item.am.name;
                                    amClass = 'out';
                                }
                            } 
                            if (item.pm.id){
                                pmId = item.pm.id;
                                if (item.pm.id == '-1') {
                                    pmInner = '不出诊';
                                    pmClass = 'not';
                                } else{
                                    pmClass = 'out';
                                    pmInner = item.pm.name;
                                }
                            } 
                            break;
                        }
                    }
                }
                innerHtml += `
                <td>
                    <em style="display:none;" name="week" class="day">${arr[i]}</em>
                    <span class="am ${amClass}">
                        <span class="time">上午</span>
                        <p class="content" id="${amId}">${amInner}</p>
                    </span>
                    <span class="pm ${pmClass}">
                        <span class="time">下午</span>
                        <p class="content" id="${pmId}">${pmInner}</p>
                    </span>
                </td>
                `
            }
            innerHtml += `
                </tr>
                `;
        const a =  document.getElementsByClassName('order-week-table');
            a[0].innerHTML = innerHtml;
        });

        
    };
    // 生成按月模板
    Order.prototype.creatMonth = function(){
        let html = ` `;
        // 获取当前的日历
        const myDate = new Date();
        // 获取星期
        let getWeek = new Date(myDate.getTime()).getDay();
        const showWeek = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        const newWeek1 = [];
        const newWeek2 = [];
        showWeek.forEach((item,index)=>{
            if (index >= getWeek){
                newWeek1.push(item)
            }else{
                newWeek2.push(item)
            }
        })
        // 循环th
        html += `<tr>`;
        for (let i = 0; i < newWeek1.length; i++) {
            html += `<th>${newWeek1[i]}</th>`
        }
        for (let i = 0; i < newWeek2.length; i++) {
            html += `<th>${newWeek2[i]}</th>`
        }
        html += `</tr>`;
        // 获取按天的排班
        ajax(Api('getDayTime', { empid: this.currentId })).then((res) => {
            return Promise.resolve(res);
        }).then((res) => {

        })
        // 循环td
        for (let i = 0; i < 30; i++) {
            const lastDate = new Date(myDate.getTime() + 24 * 60 * 60 * 1000 * i).toLocaleDateString();
            if( i % 7 === 0 ){
                // console.log(i)
                html += `</tr><tr>`
            }
            html += `
                <td>
                    <em name="day" class="day">${lastDate}</em>
                    <span class="am">
                        <span class="time">上午</span>
                        <p class="content"></p>
                    </span>
                    <span class="pm">
                        <span class="time">下午</span>
                        <p class="content"></p>
                    </span>
                </td>
            `;
            if (i === 29 ) {
                html += `</tr>`
            }
        }
        $('.order-week-table').empty();
        const a = document.getElementsByClassName('order-week-table');
        a[0].innerHTML = html;
    }
    let order = "";
    $('.nav-order').on('click',function(){
        if (!util.checkType(order,'Object')){
            order = new Order($('#order-table'), $('#order-week'));
        }
        
        order.getOrder()
        order.getDoctorList();
    });
    
})

// 退出登录
$(document).ready(() => {
    $('#loginout').on('click',loginout);
    function loginout(){

        const isLogout = () => {
            ajax('loginout', 'https://nx.smsc.net.cn/wxopen/app/shop/logout.php/').then((res) => {
                console.log('退出登录成功！',res);
            })
        }
        return util.myLayerTips('是否退出？', isLogout,'取消','确定');
    }
})
