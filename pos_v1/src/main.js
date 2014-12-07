function printInventory(inputs) {
    var display_infomation="";
    var temp_items = get_items_from_barcodes(inputs);
    var counted_items = count_items(temp_items);
    display_infomation +=display_shoping_list(counted_items);
    display_infomation +=display_free_items(counted_items);
   display_infomation +=display_total_payed_and_saved(counted_items);
    console.log(display_infomation);
}

function display_shoping_list(items){
    var shoping_list = "***<没钱赚商店>购物清单***\n";
    for(var i =0;i < items.length;i++){
       shoping_list +=print_item(items[i]);
    }
    shoping_list += '----------------------\n';
    return shoping_list;
}

function print_item(item){
   // var temp_item = item;
    var item_after_promot = get_promoted_item(item);
    var name = item.name;
    var count = get_count(item);
    var count_after_promot = get_count(item_after_promot);
    var price = item.price;
    var unit = item.unit;
    var total_price = price * count_after_promot;
    return '名称：'+name+'，'+'数量：'+count+unit+'，'+'单价：'+parseFloat(price).toFixed(2)+'(元)，'+
        '小计：'+parseFloat(total_price).toFixed(2)+'(元)\n';
}

function display_free_items(items){
    var free_items_string = "挥泪赠送商品：\n";
    for(var i = 0;i<items.length;i++){
        free_items_string += print_free_item(items[i]);
    }
    free_items_string += '----------------------\n';
    return free_items_string;
}
function  print_free_item(item){
    var item_after_promot = get_promoted_item(item);
    var name = item.name;
    var count = get_count(item);
    var count_after_promot = get_count(item_after_promot);
    var unit = item.unit;
    if(count - count_after_promot >0){
        return '名称：'+name+'，'+'数量：'+(count-count_after_promot)+unit+'\n';
    }
    return '';
}
function display_total_payed_and_saved(items){
    var total_payed = 0,saved_money = 0;
    var total_money_and_saved_string = "";
    for(var i=0;i <items.length;i++){
        total_payed += get_item_total_price(items[i]);
        saved_money +=  get_item_saved_money(items[i]);
    }
    total_money_and_saved_string  = "总计："+parseFloat(total_payed).toFixed(2)+"(元)\n"+
                         "节省："+parseFloat(saved_money).toFixed(2)+"(元)\n"+
                         "**********************";
    return total_money_and_saved_string;
}
function get_item_total_price(item){
    var item_after_promot = get_promoted_item(item);
    var count = get_count(item_after_promot);
    var price = item.price;
    return count*price;

}
function  get_item_saved_money(item){
    var item_after_promot = get_promoted_item(item);
    var count = get_count(item);
    var count_after_promot = get_count(item_after_promot);
    return (count-count_after_promot)*item.price;
}
function get_promoted_item(item){
    var promotions = loadPromotions();
    for(var i =0;i < promotions.length;i++){
        if(check_can_promoted(promotions[i].barcodes,item)){
            var promoted_item = do_promot(promotions[i],item);
            return promoted_item;
        }
        return item;
    }
}
function check_can_promoted(barcodes,item){
    var item_barcodes = item.barcode.split('-')[0];
       for(var i =0 ; i< barcodes.length;i++){
           if(barcodes[i] === item_barcodes){
               return true;
           }
       }
    return false;
}
function do_promot(promotion,item){
    var temp_item = copy_item(item);
    if(promotion.type === 'BUY_TWO_GET_ONE_FREE'){
        var count_after_promot ,count;
        count = get_count(temp_item);
        count_after_promot = Math.floor(count/3)*2+count%3;
        temp_item.barcode = temp_item.barcode.split('-')[0]+'-'+count_after_promot;
        return temp_item;
    }
}
function count_items(items){

    var items_list = [];
    for(var i =0 ; i < items.length;i++){
        items_list = add_goods_to_list(items_list,items[i]);
    }
   return items_list;
}
function add_goods_to_list(list,item){
    var temp_item = copy_item(item);
    if(list.length == 0){
        list[0] = temp_item;
        return list;
    }
    var list_barcode,item_barcode,is_contained = false;
    for(var i = 0;i < list.length;i++){
        list_barcode = list[i].barcode.split('-')[0];
        item_barcode = temp_item.barcode.split('-')[0];
        if(list_barcode === item_barcode){
            var count =get_count(list[i])+get_count(temp_item);
            list[i].barcode = list_barcode+'-'+count;
            is_contained = true;
            break;
        }
    }
    if(!is_contained){
        var length = list.length;
        list[length] = temp_item;
    }
    return list;
}
function get_count(item) {
    var barcode = item.barcode;
    var barcode_split_array = barcode.split('-');
    if(barcode_split_array.length ===1){
        return 1;
    }
    return parseInt(barcode_split_array[1]);
}
function get_items_from_barcodes(inputs){
     return _.map(inputs,function(input){
         return get_item_by_barcode(input);
     });
}
function get_item_by_barcode(barcode){
    var all_items = loadAllItems();
    var pure_barcode = barcode.split('-')[0];
    var result_item = _.find(all_items,function(item){
            if(item.barcode === pure_barcode){
                return item;
            }
    });
    result_item.barcode = barcode;
    return result_item;
}
function copy_item(item){
    var new_item ={};
    new_item.barcode = item.barcode;
    new_item.name= item.name;
    new_item.unit = item.unit;
    new_item.price = item.price;
    return new_item;
}