/*
Item GUI control
*/

//=========================
// cursor control methods
//=========================


// move item and open buttons

function clicked_cursor (item) {
	if(item.initialized) {
		if(item.selected()) {
			if(item.buttons_opened()) {
				close_buttons(item);
			} else {
				open_buttons(item);
			}
		}
		move_cursor(item);
		var scroll_top;
		fix_scrolling(item, true);
	}
}


// change scrolling

function fix_scrolling (item, opt) {
	var not_centering;
	if(!(!(opt))) {
		not_centering = true;
	} else {
		not_centering = false;
	}
	var scroll_top;
	if(item.elm.offset().top < $body.scrollTop() || (item.elm.offset().top + item.elm.height()) > ($body.scrollTop() + window.innerHeight)) {
		if(not_centering) {
			scroll_top = item.elm.offset().top + 1;
		} else {
			scroll_top = item.elm.offset().top - ((window.innerHeight - container_margin) / 2);
		}
		if(scroll_top < 0) {
			scroll_top = 0;
		}
		$body.stop().animate({ scrollTop: scroll_top }, 400, 'easeOutExpo', function(){ auto_scrolling = false; console.log($body.scrollTop()); });
	} else if(item.elm.offset().top < $body.scrollTop() || (item.elm.offset().top + item.elm.height()) > ($body.scrollTop() + window.innerHeight - container_margin)) {
		if(not_centering) {
			scroll_top = (item.elm.offset().top + item.elm.height()) - window.innerHeight + container_margin;
		} else {
			scroll_top = item.elm.offset().top + item.elm.height() - ((window.innerHeight - container_margin) / 2);
		}
		if(scroll_top > ($container.height() + container_margin - window.innerHeight)) {
			scroll_top = ($container.height() + container_margin - window.innerHeight);
		}
		$body.stop().animate({ scrollTop: scroll_top }, 400, 'easeOutExpo', function(){ auto_scrolling = false; });
	}
}


// move cursor

function move_cursor(item) {
	var before_items = new Items();
	if(item.initialized) {
		if(before_items.all_initialized()) {
			deselect_cursor(before_items);
			before_items.item.forEach(function(item_each) {
				if(item_each.buttons_opened() && item.id != item_each.id) {
					close_buttons(item_each);
				}
			});
		}
		select_cursor(item);
	} else {
		console.log(item);
		throw new Error("item not found: " + JSON.stringify(item));
	}
}


// open buttons

function open_buttons(item) {
	item.buttons_open();
	item.elm.find(".buttons_container").addClass("buttons_opened").stop().animate({
		"width" : "200"
	}, 150, function() {
		$(this).addClass("buttons_complete_opened");
	});
}


// hide buttons

function close_buttons(item) {
	item.buttons_close();
	item.elm.find(".buttons_container").removeClass("buttons_complete_opened").stop().animate({
		"width" : "0"
	}, 150, function() {
		$(this).removeClass("buttons_opened");
	});
}


// add cursor

function add_cursor(items) {
	if(items instanceof Item) { items = new Items(items); }
	if(items.all_initialized()) {
		select_cursor(items);
	} else {
		throw new Error("item not found: " + JSON.stringify(items));
	}
}


// remove cursor

function remove_cursor(items) {
	if(items instanceof Item) { items = new Items(items); }
	if(items.all_initialized()) {
		deselect_cursor(items);
	} else {
		throw new Error("item not found: " + JSON.stringify(items));
	}
}


// expand cursor

function expand_cursor(items) {
	var selected_items = new Items();
	var expand_to_items;
	if(items instanceof Item) { expand_to_items = new Items(items); }
	var selected_first_coord = selected_items.first().coord;
	var selected_last_coord = selected_items.last().coord;
	var expand_to_item_coord = expand_to_items.first().coord;
	var expand_items_arr = [];
	if(abs(selected_first_coord - expand_to_item_coord) < abs(selected_last_coord - expand_to_item_coord)) {
		for(i = Math.min(selected_first_coord, expand_to_item_coord); i <= Math.max(selected_first_coord, expand_to_item_coord); i++) {
			expand_items_arr.push({"coord" : i});
		}
	} else {
		for(i = Math.min(selected_last_coord, expand_to_item_coord); i <= Math.max(selected_last_coord, expand_to_item_coord); i++) {
			expand_items_arr.push({"coord" : i});
		}
	}
	expand_items = new Items(expand_items_arr);
	select_cursor(expand_items);
}


// select item

function select_cursor(items) {
	if(items instanceof Item) { items = new Items(items); }
	items.select();
	$.each(items.item, function(i, item) {
		item.elm.addClass("selected");
		var selected_items = new Items();
		if(mini_view && selected_items.all_initialized() && selected_items.item.length < 2) {
			item.elm.removeClass("mini");
		}
	});
}


// deselect item

function deselect_cursor(items) {
	if(items instanceof Item) { items = new Items(items); }
	items.deselect();
	$.each(items.item, function(i, item) {
		item.elm.removeClass("selected");
		if(mini_view) {
			item.elm.addClass("mini");
		}
	});
}


//=========================
// status control
//=========================

// add status class_name to item id

function add_status(id, class_name) {
	$(".item[id_src=" + id + "]").addClass(class_name);
}

// remove status class_name to item id

function rm_status(id, class_name) {
	$(".item[id_src=" + id + "]").removeClass(class_name);
}


//=========================
// show favorite on item
//=========================

function favorite_item (item) {
	if(item.initialized) {
		if(!(item.favorite())) {
			add_status(item.id_src, "favorite");
			item.favorite(true);
		}
	}
}


//=========================
// hide favorite on item
//=========================

function unfavorite_item (item) {
	if(item.initialized) {
		if(item.favorite()) {
			rm_status(item.id_src, "favorite");
			item.favorite(false);
		}
	}
}
