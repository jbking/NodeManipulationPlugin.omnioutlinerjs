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

  global.rootItem = createRootItem();
});

require("./splitNode.js");
const { createRootItem, setSelectedItems } = require("./testUtil.js");

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
    setSelectedItems([global.rootItem.addChild(), global.rootItem.addChild()]);
    expect(action.validate()).toBeFalsy();
  });

  test("return true when selected items can be splited", () => {
    const item1 = global.rootItem.addChild();
    item1.topic = "item1_line1\nitem1_line2";
    const item2 = global.rootItem.addChild();
    item2.topic = "item2_line1\nitem2_line2";

    setSelectedItems([item1, item2]);
    expect(action.validate()).toBeTruthy();
  });
});

describe("action", () => {
  test("split items", () => {
    const item1 = global.rootItem.addChild();
    const item1_1 = item1.addChild();
    item1_1.topic = "item1_line1\nitem1_line2";
    const item2 = global.rootItem.addChild();
    const item2_1 = item2.addChild();
    item2_1.topic = "item2_line1\nitem2_line2";

    setSelectedItems([item1_1, item2_1]);
    action.f();

    expect(Object.keys(item1.children).length).toEqual(2);
    expect(item1.children[0].topic).toEqual("item1_line1");
    expect(item1.children[1].topic).toEqual("item1_line2");
    expect(item1_1.removed).toBeFalsy();
    expect(Object.keys(item2.children).length).toEqual(2);
    expect(item2.children[0].topic).toEqual("item2_line1");
    expect(item2.children[1].topic).toEqual("item2_line2");
    expect(item2_1.removed).toBeFalsy();
  });

  test("split item on situation with siblings", () => {
    const item1 = global.rootItem.addChild();
    const item1_1 = item1.addChild();
    const item1_2 = item1.addChild();
    item1_1.topic = "item1_line1\nitem1_line2";

    setSelectedItems([item1_1]);
    action.f();

    expect(Object.keys(item1.children).length).toEqual(3);
    expect(item1.children[0].topic).toEqual("item1_line1");
    expect(item1.children[1].topic).toEqual("item1_line2");
    expect(item1.children[2]).toEqual(item1_2);
    expect(item1_1.removed).toBeFalsy();
  });
});
