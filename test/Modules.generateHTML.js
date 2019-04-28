import test from "ava";
import { getHTMLListFromMessages } from "../js/background/Modules/generateHTML";

test("Get HTML for domain with warnings", t => {
  t.is(
    '<h2>Cookies for domain: test.tld</h2><h3>Cookie: Cookie Name</h3><li class="warning warning_key_1">Warning text</li><br><samp>Cookie value</samp>',
    getHTMLListFromMessages({
      "test.tld": {
        "Cookie Name": {
          warnings: { warning_key_1: "Warning text" },
          value: "Cookie value"
        }
      }
    })
  );
});

test("Get HTML for domain without warnings", t => {
  t.is(
    "",
    getHTMLListFromMessages({
      "test.tld": {
        "Cookie Name": {
          warnings: {},
          value: "Cookie value"
        }
      }
    })
  );
});

test("Get no output when no messages", t => {
  t.is("", getHTMLListFromMessages(false));
});
