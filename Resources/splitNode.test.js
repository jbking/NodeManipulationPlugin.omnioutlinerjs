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

require("./splitNode.js");
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

  test("return false when selected items can not be splited", () => {
    setSelectedItems([new Item(global.rootItem), new Item(global.rootItem)]);
    expect(action.validate()).toBeFalsy();
  });

  test("return true when selected items can be splited", () => {
    const item1 = new Item(global.rootItem);
    item1.topic = "item1_line1\nitem1_line2";
    const item2 = new Item(global.rootItem);
    item2.topic = "item2_line1\nitem2_line2";

    setSelectedItems([item1, item2]);
    expect(action.validate()).toBeTruthy();
  });
});

describe("action", () => {
  test("split items", () => {
    const item1 = new Item(global.rootItem);
    const item1_1 = new Item(item1);
    item1_1.topic = "item1_line1\nitem1_line2";
    const item2 = new Item(global.rootItem);
    const item2_1 = new Item(item2);
    item2_1.topic = "item2_line1\nitem2_line2";

    setSelectedItems([item1_1, item2_1]);
    action.f();
    expect(Object.keys(item1.children).length).toEqual(2);
    expect(item1.children[0].topic).toEqual("item1_line1");
    expect(item1.children[1].topic).toEqual("item1_line2");
    expect(item1_1.removed).toBeTruthy();
    expect(Object.keys(item2.children).length).toEqual(2);
    expect(item2.children[0].topic).toEqual("item2_line1");
    expect(item2.children[1].topic).toEqual("item2_line2");
    expect(item2_1.removed).toBeTruthy();
  });
});
