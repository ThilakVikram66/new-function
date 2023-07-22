/*

*/

// sub function importer
const category_asin_rank_collector = require('./child_functions/Process1');
const Variation_asin_collector = require('./child_functions/Process2');

iniator('https://www.amazon.com/gp/bestsellers/home-garden/10749171/ref=pd_zg_hrsr_home-garden');

async function iniator(category_url){
    let asin_rank_obj = await category_asin_rank_collector(category_url);
    let P_asins_arr = Object.keys(asin_rank_obj);
    console.log(P_asins_arr);
    let variation_asins_obj_arr = async(V_check_limit)=>{
        let limit = V_check_limit;
        let arr_length = P_asins_arr.length;
        let trunc = Math.trunc(arr_length/limit);
        let actual = arr_length/limit;
        let loop = actual%trunc !== 0?trunc+1:trunc;
        let Promise_handler = [];
        let R_data = [];
        for(let i = 0;i<loop;i++)
        {
            let j=i*limit;
            let j_l = j+limit;
            for(j;j<j_l&&j<arr_length;j++)
            {
                console.log("asin");
                console.log(P_asins_arr[j]);
                Promise_handler.push(Variation_asin_collector(P_asins_arr[j]).then(
                    data=>{
                        console.log("Data");
                        console.log(data);
                        data['V_asin'].forEach(C_asin => {
                            R_data.push({
                                "Parent_Asin":data['P_asin'],
                                "Current_asin":C_asin,
                                "Category_Url":category_url,
                                "Category_Rank":asin_rank_obj[data['P_asin']]["Rank"]
                            });
                        });
                        console.log(R_data.length);
                    }
                ))
            }
            await Promise.all(Promise_handler);
        }
        console.log(R_data);
        return R_data;
    }
    variation_asins_obj_arr(3);
    console.log(P_asins_arr);
}