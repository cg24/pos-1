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



