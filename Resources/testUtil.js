function ItemPosition(item, position) {
  this.item = item;
  this.position = position;
}

function Item(parent) {
  this.parent = parent;

  if (typeof parent == "undefined") {
    this.ancestors = [];
    this.level = 1;
  } else {
    const ancestors = Object.create(parent.ancestors);
    ancestors.unshift(parent);
    this.ancestors = ancestors;
    this.level = parent.level + 1;
  }

  this.remove = () => {
    this.removed = true;
  };

  this.children = [];
  this.addChild = (position, callback) => {
    const item = new Item(this);
    if (position) {
      var left, right;
      if (position.position == "before") {
        left = this.children.slice(0, position.item.index);
        right = this.children.slice(position.item.index);
      } else {
        left = this.children.slice(0, position.item.index + 1);
        right = this.children.slice(position.item.index + 1);
      }
      this.children = left.concat(Array.of(item)).concat(right);
    } else {
      position = this.children.length;
      this.children[position] = item;
    }

    if (typeof callback != "undefined") {
      callback(item);
    }
    return item;
  };

  this.topic = "";

  this.before = new ItemPosition(this, "before");
  this.after = new ItemPosition(this, "after");
}

Object.defineProperty(Item.prototype, "index", {
  get: function() {
    return this.parent.children.findIndex(v => v == this);
  },
  set: function(v) {
    throw new Error("Read only property: index");
  }
});

function Node(item) {
  this.object = item;
}

function setSelectedItems(selectedItems) {
  const editor = {};
  editor.selectedNodes = selectedItems.map(item => new Node(item));
  global.document.editors.push(editor);
}

function createRootItem() {
  return new Item();
}

module.exports = {
  createRootItem: createRootItem,
  setSelectedItems: setSelectedItems
};
