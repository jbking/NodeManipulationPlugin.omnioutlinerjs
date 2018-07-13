var _ = function(){
	var action = new PlugIn.Action(function(selection){
		// if called externally (from script) then generate selection array
		if (typeof selection == 'undefined'){
			// convert nodes into items
			nodes = document.editors[0].selectedNodes
			selectedItems = nodes.map(function(node){return node.object})
		} else {
			selectedItems = selection.items
		}
		// show the checkbox column
		statusCol = document.outline.statusColumn
		document.editors[0].setVisibilityOfColumn(statusCol,true)
		// check the selected items
		selectedItems.forEach(function(item){item.state = State.Checked})
	});

	action.validate = function(selection){
		// validation check. For example, are items selected?
		// if called externally (from script) then generate selection array
		if (typeof selection == 'undefined'){
			selNodesCount = document.editors[0].selectedNodes.length
			if(selNodesCount > 0){return true} else {return false}
		} else {
			if(selection.items.length > 0){return true} else {return false}
		}
	};

	return action;
}();
_;