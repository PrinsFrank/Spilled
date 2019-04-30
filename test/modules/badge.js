import test from "ava";
import {
  getColor,
  getText,
  getCountFromMessages
} from "../../js/background/Modules/badge";

test("Get correct color for number of messages", t => {
  t.is("#20FDC3", getColor(-1));
  t.is("#20FDC3", getColor(0));
  t.is("#EBE13D", getColor(1));
  t.is("#EBE13D", getColor(5));
  t.is("#E03C37", getColor(6));
});

test("Get text from number", t => {
  t.is("-1", getText(-1));
  t.is("0", getText(0));
  t.is("1", getText(1));
});

test("Get no count when there are no cookies", t => {
  t.is(0, getCountFromMessages({}));
});

test("Get correct count with a warning for the domain", t => {
  t.is(
    1,
    getCountFromMessages({
      "test.tld": {
        "Cookie Name": {
          warnings: { warning_key_1: "Warning text" },
          value: "Cookie value"
        }
      }
    })
  );
});

test("Get correct count with no warnings for the domain", t => {
  t.is(
    0,
    getCountFromMessages({
      "test.tld": {
        "Cookie Name": {
          warnings: {},
          value: "Cookie value"
        }
      }
    })
  );
});
