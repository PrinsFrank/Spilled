import test from "ava";
import { getHTMLListFromMessages } from "../js/background/Modules/generateHTML";

test("Get HTML from messages", t => {
  t.is(
    '<h2>Cookies for domain: test.com</h2><h3>Cookie: This is the cookie name</h3><li class="warning warning_key_1">This is the warning text</li><br><samp>this is the cookie value</samp>',
    getHTMLListFromMessages({
      "test.com": {
        "This is the cookie name": {
          warnings: { warning_key_1: "This is the warning text" },
          value: "this is the cookie value"
        }
      }
    })
  );
});

test("No output when no messages", t => {
  t.is("", getHTMLListFromMessages(false));
});
