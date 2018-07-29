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

require("./mergeNodes.js");
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

  test("return false when only one selected items", () => {
    setSelectedItems([global.rootItem.addChild()]);
    expect(action.validate()).toBeFalsy();
  });

  test("return false when two or more selected items but not related", () => {
    const item1 = global.rootItem.addChild();
    const item1_1 = item1.addChild();
    const item2 = global.rootItem.addChild();
    const item2_1 = item2.addChild();

    setSelectedItems([item1_1, item2_1]);
    expect(action.validate()).toBeFalsy();
  });

  test("return true when two or more selected items have same parent", () => {
    const item1 = global.rootItem.addChild();
    const item2 = global.rootItem.addChild();

    setSelectedItems([item1, item2]);
    expect(action.validate()).toBeTruthy();
  });

  test("return true when two or more selected items are family", () => {
    const item1 = global.rootItem.addChild();
    const item1_1 = item1.addChild();
    const item1_1_1 = item1_1.addChild();
    const item1_1_2 = item1_1.addChild();
    const item1_2 = item1.addChild();

    setSelectedItems([item1, item1_1, item1_1_1, item1_1_2, item1_2]);
    expect(action.validate()).toBeTruthy();
  });
});

describe("action", () => {
  test("merge three items which have same parent, in order", () => {
    const item1 = global.rootItem.addChild();
    const item2 = global.rootItem.addChild();
    const item3 = global.rootItem.addChild();

    item1.topic = "topic1";
    item1.index = 0;
    item2.topic = "topic2";
    item2.index = 1;
    item3.topic = "topic3";
    item3.index = 2;

    setSelectedItems([item3, item1, item2 /* shuffled */]);
    action.f();
    expect(item1.topic).toEqual("topic1\ntopic2\ntopic3");
    expect(item1.removed).toBeFalsy();
    expect(item2.removed).toBeTruthy();
    expect(item3.removed).toBeTruthy();
  });

  test("merge three items which are family", () => {
    const item1 = global.rootItem.addChild();
    const item1_1 = item1.addChild();
    const item1_1_1 = item1_1.addChild();
    const item1_1_2 = item1_1.addChild();
    const item1_2 = item1.addChild();

    item1.topic = "topic1";
    item1.before = "item1Before";
    item1_1.topic = "topic1_1";
    item1_1.index = 1;
    item1_1_1.topic = "topic1_1_1";
    item1_1_1.index = 1;
    item1_1_2.topic = "topic1_1_2";
    item1_1_2.index = 2;
    item1_2.topic = "topic1_2";
    item1_2.index = 2;

    // XXX
    console.log(item1_1_1);

    setSelectedItems([item1_2, item1_1_2, item1_1_1, item1_1, item1 /* shuffled */]);
    action.f();
    expect(Object.keys(global.rootItem.children).length).toEqual(1);
    expect(global.rootItem.children["item1Before"].topic).toEqual(
      "topic1\ntopic1_1\ntopic1_1_1\ntopic1_1_2\ntopic1_2"
    );
    expect(item1.removed).toBeTruthy();
    expect(item1_1.removed).toBeTruthy();
    expect(item1_1_1.removed).toBeTruthy();
    expect(item1_1_2.removed).toBeTruthy();
    expect(item1_2.removed).toBeTruthy();
  });
});
