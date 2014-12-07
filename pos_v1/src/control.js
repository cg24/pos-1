/**
 * Created by John on 2014/12/7.
 */
function get_free_count(item){
    if(item.number_after_promot!=undefined && item.number-item.number_after_promot >0){
        return item.number-item.number_after_promot;
    }
    return 0;
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