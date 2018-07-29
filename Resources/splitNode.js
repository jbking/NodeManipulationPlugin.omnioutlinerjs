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

  var action = new PlugIn.Action(function(selection) {
    var selectedItems = _selectedItems(selection);

    selectedItems.forEach(function(item) {
      item.topic.split("\n").forEach(function(text) {
        item.parent.addChild(null, function(item) {
          item.topic = text;
        });
      });
      item.remove();
    });
  });

  action.validate = function(selection) {
    var selectedItems = _selectedItems(selection);
    if (selectedItems.length == 0) {
      return false;
    }

    return selectedItems.every(function(item) {
      return item.topic.split("\n").length >= 2;
    });
  };

  return action;
})();
_;
