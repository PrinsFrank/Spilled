import test from "ava";
import {
  getHTMLListFromMessages,
  getHTMLNoContent
} from "../../js/background/Modules/generateHTML";

test("Get HTML for domain with warnings", t => {
  t.is(
    "<h2>Cookies for domain: test.tld</h2><ul><h3>Cookie: Cookie Name</h3><li>Warning text</li></ul>",
    getHTMLListFromMessages({
      "test.tld": {
        "Cookie Name": {
          score: { none: 0 },
          warnings: { warning_key_1: "Warning text" },
          value: "Cookie value"
        }
      }
    }).innerHTML
  );
});

test("Get HTML for domain without warnings", t => {
  t.is(
    "",
    getHTMLListFromMessages({
      "test.tld": {
        "Cookie Name": {
          score: { none: 0 },
          warnings: {},
          value: "Cookie value"
        }
      }
    }).innerHTML
  );
});

test("Get no output when no messages", t => {
  t.is("", getHTMLListFromMessages(false).innerHTML);
});

test("Get HTML no content", t => {
  t.is(
    "<li>No Information available for this domain</li>",
    getHTMLNoContent().innerHTML
  );
});
