var _ = (() => {
  function _selectedItems(selection) {
    // if called externally (from script) then generate selection array
    if (typeof selection == "undefined") {
      // convert nodes into items
      return document.editors[0].selectedNodes.map(node => node.object);
    } else {
      return selection.items;
    }
  }

  var action = new PlugIn.Action(selection => {
    var selectedItems = _selectedItems(selection);

    // this array is shuffled often. so, sort it.
    const recur = item => {
      if (!item) return 0;
      if (! item.parent) return 0;
      return recur(item.parent) * 10 + item.index + 1;
    };
    /* should be sorted as
     * [ { topic: 'topic1', level: 2, index: 0, score: 1 },
     *   { topic: 'topic1_1', level: 3, index: 0, score: 11 },
     *   { topic: 'topic1_1_1', level: 4, index: 0, score: 111 },
     *   { topic: 'topic1_1_2', level: 4, index: 1, score: 112 },
     *   { topic: 'topic1_2', level: 3, index: 1, score: 12 } ]
     */
    selectedItems.sort((a, b) => ("" + recur(a) < "" + recur(b) ? -1 : 1));
    // console.log(selectedItems.map(item => {return {topic: item.topic, level: item.level, index: item.index, score: recur(item)}}));
    firstItem = selectedItems[0];
    var topic = selectedItems.map(item => item.topic).join("\n");
    firstItem.topic = topic;
    selectedItems.slice(1).forEach(item => { try {
      item.remove()
    } catch (e) {
      // Simply ignore error during removing.
      // This happens when removing an item which is removed already by removing the item's parent.
    }});
  });

  action.validate = selection => {
    var selectedItems = _selectedItems(selection);
    if (selectedItems.length < 2) {
      return false;
    }

    const minLevel = selectedItems.map(item => item.level)[0];
    const minLevelItems = selectedItems.filter(item => item.level == minLevel);
    const minLevelItemParent = minLevelItems[0].parent;
    if (!minLevelItems.every(item => item.parent == minLevelItemParent)) {
      return false;
    }
    const checkRecur = item =>
      item.children.every(
        child => selectedItems.find(v => v == child) && checkRecur(child)
      );
    // to avoid accident, valid only if selected all nodes are in their tree.
    return minLevelItems.every(item => checkRecur(item));
  };

  return action;
})();
_;
