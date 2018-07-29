var _ = (function() {
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

    selectedItems.forEach(item => {
      const lines = item.topic.split("\n");
      item.topic = lines[0];
      lines.slice(1).forEach(text => {
        item.parent.addChild(null, item => {
          item.topic = text;
        });
      });
    });
  });

  action.validate = selection => {
    var selectedItems = _selectedItems(selection);
    if (selectedItems.length == 0) {
      return false;
    }

    return selectedItems.every(item => item.topic.split("\n").length >= 2);
  };

  return action;
})();
_;
