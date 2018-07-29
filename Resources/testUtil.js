function Item(parent) {
  this.parent = parent;

  if (typeof parent == "undefined") {
    this.ancestors = [];
  } else {
    const ancestors = Object.create(parent.ancestors);
    ancestors.unshift(parent);
    this.ancestors = ancestors;
  }

  this.remove = () => {
    this.removed = true;
  };

  this.children = [];
  this.addChild = (position, callback) => {
    const item = new Item(this);
    if (!position) {
      position = this.children.length;
    }
    this.children[position] = item;

    if (typeof callback != "undefined") {
      callback(item);
    }
    return item;
  };

  this.topic = "";

  this.index = 0;
}

function Node(item) {
  this.object = item;
}

function setSelectedItems(selectedItems) {
  const editor = {};
  editor.selectedNodes = selectedItems.map(item => new Node(item));
  global.document.editors.push(editor);
}

module.exports = {
  Item: Item,
  setSelectedItems: setSelectedItems
};
