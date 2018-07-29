var _ = (() => {
  function _selectedItems(selection) {
    // if called externally (from script) then generate selection array
    if (typeof selection == "undefined") {
      // convert nodes into items
      return document.editors[0].selectedNodes.map(function(node) {
        return node.object;
      });
    } else {
      return selection.items;
    }
  }

  var action = new PlugIn.Action(selection => {
    var selectedItems = _selectedItems(selection);

    // this array is shuffled often. so, sort it.
    selectedItems.sort((a, b) => a.index - b.index);
    firstItem = selectedItems[0];
    var topic = selectedItems.map(item => item.topic).join("\n");
    firstItem.topic = topic;
    selectedItems.slice(1).forEach(item => item.remove());
  });

  action.validate = selection => {
    var selectedItems = _selectedItems(selection);
    if (selectedItems.length < 2) {
      return false;
    }

    // to avoid accident, valid only if selected some nodes and they are children of same parent.
    return selectedItems.every(item => selectedItems.find(v => v == item.parent));
  };

  return action;
})();
_;
