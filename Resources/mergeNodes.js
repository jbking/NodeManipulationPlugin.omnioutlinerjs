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

    // this array is shuffled often. so, sort it.
    selectedItems.sort(function(a, b) {
      return a.index - b.index;
    });
    firstItem = selectedItems[0];
    var topic = selectedItems
      .map(function(item) {
        return item.topic;
      })
      .join("\n");
    firstItem.parent.addChild(firstItem.before, function(item) {
      item.topic = topic;
    });
    selectedItems.forEach(function(item) {
      item.remove();
    });
  });

  action.validate = function(selection) {
    var selectedItems = _selectedItems(selection);
    if (selectedItems.length < 2) {
      return false;
    }

    var firstItemParent = selectedItems[0].parent;
    // to avoid accident, valid only if selected some nodes and they are children of same parent.
    return (
      selectedItems.every(function(item) {
        return item.parent == firstItemParent;
      })
    );
  };

  return action;
})();
_;
