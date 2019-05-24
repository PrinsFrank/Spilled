import test from "ava";
import {
  isExampleOverview,
  isOverviewTab
} from "../../js/background/Modules/tab";

test("Check is overview tab", t => {
  t.is(true, isOverviewTab({ url: "moz-extension://foobar" }));
  t.is(true, isOverviewTab({ url: "chrome-extension://foobar" }));
  t.is(false, isOverviewTab({ url: "www.example.com" }));
});

test("Check is example overview", t => {
  t.is(
    true,
    isExampleOverview({
      url: "moz-extension://foobar/views/overview.html?example_content=true"
    })
  );
  t.is(
    false,
    isExampleOverview({ url: "moz-extension://foobar/views/overview.html" })
  );
  t.is(
    true,
    isExampleOverview({
      url: "moz-extension://foobar/views/overview.html?example_content=true"
    })
  );
  t.is(
    false,
    isExampleOverview({ url: "moz-extension://foobar/views/overview.html" })
  );
  t.is(
    false,
    isExampleOverview({ url: "www.example.com?example_content=true" })
  );
  t.is(false, isExampleOverview({ url: "www.example.com" }));
});
