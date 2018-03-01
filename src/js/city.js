import pdata from '../../static/cityData.min.json'

"use strict"
$(document).ready(()=>{
    // 省市级三级联动
    let html = "";
    $("#input_city").append(html); $("#input_area").append(html);
    let province = "";
    pdata.forEach((item,index)=>{
        if(item.label){
            html += `<option value= ${item.label} id= ${item.label}> ${item.label} </option>`;
        }
    })
    $("#input_province").append(html);
    $("#input_province").change(function () {
        if ($(this).val() == "") return;
        $("#input_city option").remove(); $("#input_area option").remove();
        province = $(this).find("option:selected").attr("id");
        let html = "<option value=''>--请选择--</option>";
        $("#input_area").append(html);
        pdata.forEach((item, index) => {
            if (item.label === province && item.children) {
                (item.children).forEach((city)=>{
                    html += `<option value= ${city.label} id= ${city.label}> ${city.label} </option>`;
                })
            }
        })
        $("#input_city").append(html);
    });
    $("#input_city").change(function () {
        if ($(this).val() == "") return;
        $("#input_area option").remove();
        let code = $(this).find("option:selected").attr("id");
        let html = "<option value=''>--请选择--</option>";
        for (let i = 0; i < pdata.length; i++) {
            const item = pdata[i];
            if (item.label === province) {
                const temp = item.children;
                for (let j = 0; j < temp.length; j++) {
                    const city = temp[j];
                    if (city.label === code && city.children){
                        (city.children).forEach((eare) => {
                            html += `<option value= ${eare.label} id= ${eare.label}> ${eare.label} </option>`;
                        })
                        break
                    }
                }
                break
            }
        }
        $("#input_area").append(html);
    });
})