// load the action
var action;
global.PlugIn = {};
global.PlugIn.Action = function(f) {
  this.f = f;
  action = this;
};

beforeEach(() => {
  // mimic omni outliner api
  global.document = {};
  global.document.editors = [];

  global.rootItem = new Item();
});

require("./mergeNodes.js");
const {Item, setSelectedItems } = require("./testUtil.js");

test("action exists", () => {
  expect(action).toBeDefined();
  expect(action.validate).toBeDefined();
});

describe("validate function", () => {
  test("return false when no selected items", () => {
    setSelectedItems([]);
    expect(action.validate()).toBeFalsy();
  });

  test("return false when only one selected items", () => {
    setSelectedItems([new Item(global.rootItem)]);
    expect(action.validate()).toBeFalsy();
  });

  test("return false when two or more selected items but not related", () => {
    const item1 = new Item(global.rootItem);
    const item1_1 = new Item(item1);
    const item2 = new Item(global.rootItem);
    const item2_1 = new Item(item2);

    setSelectedItems([item1_1, item2_1]);
    expect(action.validate()).toBeFalsy();
  });

  test("return true when two or more selected items have same parent", () => {
    const item1 = new Item(global.rootItem);
    const item2 = new Item(global.rootItem);

    setSelectedItems([item1, item2]);
    expect(action.validate()).toBeTruthy();
  });
});

describe("action", () => {
  test("merge three items which have same parent, in order", () => {
    const item1 = new Item(global.rootItem);
    const item2 = new Item(global.rootItem);
    const item3 = new Item(global.rootItem);

    item1.topic = "topic1";
    item1.index = 1;
    item1.before = "item1Before";
    item2.topic = "topic2";
    item2.index = 2;
    item3.topic = "topic3";
    item3.index = 3;

    setSelectedItems([item3, item1, item2 /* shuffled */]);
    action.f();
    expect(Object.keys(global.rootItem.children).length).toEqual(1);
    expect(global.rootItem.children["item1Before"].topic).toEqual(
      "topic1\ntopic2\ntopic3"
    );
    expect(item1.removed).toBeTruthy();
    expect(item2.removed).toBeTruthy();
    expect(item3.removed).toBeTruthy();
  });
});
