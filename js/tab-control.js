/*
Tab GUI control
*/

//=========================
// Tab
//=========================


// tab setup

var act = 0;
var itemChunk = [];
var tab = ["timeline", "mention"];
var tab_label = ["Timeline", "Mention"];
var $containers = [];
var tab_scroll_top = [];
var tab_is_bottom = [];


// setup tab ** beta **

function tab_setup () {
	var $tab_list_box = $(".tab_list_box");
	var $list_view = $(".list_view");
	tab.forEach(function(value, i) {
		$tab_list_box.append("<div class='ls " + value + "'>" + tab_label[i] + "</div>");
		$tab_list_box.find(".ls").mousedown(function() {
			toggle_tab(tab.indexOf($(this).attr("class").replace(/ls\s*/, "")));
		});
		$list_view.append("<div class='container " + value + "'></div>");
		$containers[i] = $(".container." + tab[i]);
		itemChunk[i] = new Container();
		tab_scroll_top[i] = 10000;
		tab_is_bottom[i] = true;
	});
	$container = $(".container." + tab[act]);
	$container.addClass("active");
}


// toggle tab

function toggle_tab (num) {
	var window_height = window.innerHeight;
	tab_scroll_top[act] = $body.scrollTop();
	tab_is_bottom[act] = auto_scrolling || ($body.scrollTop() + window_height >= $container.height() + container_margin);
	$container.removeClass("active");
	$container = $(".container." + tab[num]);
	$container.addClass("active");
	if(tab_is_bottom[num]) {
		$body.scrollTop($container.height() + container_margin - window_height);
	} else {
		$body.scrollTop(tab_scroll_top[num]);
	}
	act = num;
}