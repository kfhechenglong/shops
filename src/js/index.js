// import './city.js'
import pdata from '../../static/cityData.min.json'
"use strict"

// 生成字符串模板
const htmlTemplate = () =>{
    
}
// 获取公司信息
$(document).ready(()=>{
    // 页面加载完毕，获取公司信息
    ajax(Api('getCompanyInfo')).then((res)=>{
        console.log(res)
    })
    
    // 定于vue
    const vueOptions = {
        el:"#app",
        data:{
            btn_inner:'edit',
            companyData:{
                mp:{
                }
            },
            inputArray:0,
            getAddress:{
                province:[],
                city:[],
                area:[],
                input_province:"",
                input_city:"",
                input_area:""
            },
            editCompanyData:{}
        },
        created(){
            // 获取公司信息
            ajax(Api('getCompanyInfo')).then((res)=>{
                this.companyData = res.data;
            });
            pdata.forEach((item, index) => {
                if (item.label) {
                    this.getAddress.province.push(item.label);
                }
            })
        },
        computed:{
            // 日期格式转换
        },
        methods :{
            change_province(){
                pdata.forEach((item, index) => {
                    if (item.label === this.getAddress.input_province && item.children) {
                        (item.children).forEach((city) => {
                            this.getAddress.city.push(city.label);
                        })
                    }
                })
            },
            change_city(){
                for (let i = 0; i < pdata.length; i++) {
                    const item = pdata[i];
                    if (item.label === this.getAddress.input_province) {
                        const temp = item.children;
                        for (let j = 0; j < temp.length; j++) {
                            const city = temp[j];
                            if (city.label === this.getAddress.input_city && city.children) {
                                (city.children).forEach((eare) => {
                                    this.getAddress.area.push(eare.label);
                                })
                                break
                            }
                        }
                        break
                    }
                }
            },
            change_area(){
                    console.log(3)
            },
            // 提交公司修改信息
            submit_company(){
                const params = {name:'laohe',contact:'18911650671'};
                ajax(Api('updateCompanyInfo', params))
                .then((res) => {
                    console.log(res)
                });
            },
            edit(){
                // 点击编辑按钮
                if (this.btn_inner === 'cancal') {
                    $('#edit').text('编辑');
                    this.btn_inner = "edit";
                    // 发送ajax请求
                    // 模板渲染
                    $('.list-company').removeClass('on');
                    $('.form-company').addClass('on');
                    return false;
                }
                this.editCompanyData = JSON.parse(JSON.stringify(this.companyData));
                $('#edit').text('取消');
                this.btn_inner = "cancal";
                $('.list-company').addClass('on');
                $('.form-company').removeClass('on');
            },
            add_wxid(){
                this.inputArray ++;
            },
            delet_wxid(){
                this.inputArray--;
            }
        }
    }
    var myVue = new Vue(vueOptions);
})
