/**
 * Created by John on 2014/12/7.
 */
function build_shopping_list(items){
    var shoping_list = "***<没钱赚商店>购物清单***\n";
    _.each(items,function(item){
        shoping_list += build_shopping_list_details(item);
    });
    shoping_list += '----------------------\n';
    return shoping_list;
}

function build_shopping_list_details(item){
    return '名称：'+item.name+'，'+'数量：'+item.number+item.unit+'，'+'单价：'+parseFloat(item.price).toFixed(2)+'(元)，'+
        '小计：'+parseFloat(get_item_total_price(item)).toFixed(2)+'(元)\n';
}

function build_free_items(items){
    var free_items_string = "挥泪赠送商品：\n";
    _.each(items,function(item){
        free_items_string +=build_free_item(item);
    })
    free_items_string += '----------------------\n';
    return free_items_string;
}
function  build_free_item(item){
    if(get_free_count(item)>0){
        return '名称：'+item.name+'，'+'数量：'+(item.number-item.number_after_promot)+item.unit+'\n';
    }
    return '';
}
function build_total_payed_and_saved(items){
    var total_payed = 0,saved_money = 0;
    var total_payed_and_saved_string = "";
    _.each(items,function(item){
        total_payed +=get_item_total_price(item);
        saved_money += get_item_saved_money(item);
    })
    total_payed_and_saved_string  = "总计："+parseFloat(total_payed).toFixed(2)+"(元)\n"+
        "节省："+parseFloat(saved_money).toFixed(2)+"(元)\n"+
        "**********************";
    return total_payed_and_saved_string;
}