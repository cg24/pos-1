function printInventory(inputs) {
    var display_receipt="";
    var temp_items = get_items_from_barcodes(inputs);
    var counted_items = count_items(temp_items);
    var promoted_items = get_promoted_items(counted_items);
    display_receipt +=build_shopping_list(promoted_items);
    display_receipt +=build_free_items(promoted_items);
   display_receipt +=build_total_payed_and_saved(promoted_items);
    console.log(display_receipt);
}

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
function get_free_count(item){
    if(item.number_after_promot!=undefined && item.number-item.number_after_promot >0){
        return item.number-item.number_after_promot;
    }
    return 0;
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
function get_item_total_price(item){
    var total_price = item.price* item.number;
    if(item.number_after_promot !=undefined){
        total_price = item.price * item.number_after_promot;
    }
    return total_price;

}
function  get_item_saved_money(item){
    return get_free_count(item) * item.price;
}
function get_promoted_items(items){
   return _.each(items,function(item){
        item_do_promoted(item);
    })
}
function item_do_promoted(item){
    var promotions = loadPromotions();
    _.each(promotions,function(promotion){
        if(check_can_promoted(promotion,item)){
           do_buy_two_get_one_free(promotion,item);
        }
    })
}
function check_can_promoted(promotion,item){
    var item_barcode = item.barcode.split('-')[0];
    var can_promot_barcode = _.find(promotion.barcodes,function(promot_barcode){
           return promot_barcode ==item_barcode;
    });
    if(can_promot_barcode !=undefined){
        item.promotion_type = promotion.type;
        return true;
    }
    return false;
}
function do_buy_two_get_one_free(promotion,item){
    if(promotion.type === 'BUY_TWO_GET_ONE_FREE'){
        var count_after_promot ,count;
        count = item.number;
        count_after_promot = Math.floor(count/3)*2+count%3;
        item.number_after_promot = count_after_promot;
    }
}
function count_items(items){
    var counted_items_list = [];
    _.each(items,function(item){
          add_item_to_count_list(counted_items_list,item);
    })
   return counted_items_list;
}
function add_item_to_count_list(count_list,item){
    var is_count_list_contain_item = false;
    var pure_barcode= item.barcode.split("-")[0];
    _.each(count_list,function(counted_list_item,index){
        if(counted_list_item.barcode === pure_barcode){
              count_list[index].number += get_count_from_barcode(item.barcode);
            is_count_list_contain_item = true;
        }
    });
    if(is_count_list_contain_item === false ){
        item.number = get_count_from_barcode(item.barcode);
        item.barcode = pure_barcode;
         count_list[count_list.length] = item;
    }
}
function get_count_from_barcode(barcode) {
    var barcode_split_array = barcode.split('-');
    if(barcode_split_array.length ===1){
        return 1;
    }
    return parseInt(barcode_split_array[1]);
}
function get_barcode_from_input_barcode(input) {
    return input.split("-")[0];
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