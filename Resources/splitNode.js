var _ = function () {
	var action = new PlugIn.Action(function (selection) {
		// if called externally (from script) then generate selection array
		if (typeof selection == 'undefined') {
			// convert nodes into items
			selectedItems = document.editors[0].selectedNodes.map(function (node) { return node.object });
		} else {
			selectedItems = selection.items;
		}
		selectedItems.forEach(function(item) {
			item.topic.split("\n").forEach(function (text) {
				item.parent.addChild(null, function (item) { item.topic = text; });
			});
			item.remove();
		});
	});

	action.validate = function (selection) {
		var selectedItems;
		if (typeof selection == 'undefined') {
			selectedItems = document.editors[0].selectedNodes.map(function (node) { return node.object });
		} else {
			selectedItems = selection.items;
		}
		return selectedItems.every(function (item) { return item.topic.split("\n").length > 2 });
	};

	return action;
}();
_;
