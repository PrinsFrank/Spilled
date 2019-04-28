import test from "ava";
import {
  parseCookies,
  isOverviewTab,
  domainShouldBeChecked,
  getCleanDomainFromTab
} from "../js/background/Modules/filters/cookie.js";

test("Check overview tab", t => {
  t.is(true, isOverviewTab({ url: "moz-extension://foobar" }));
  t.is(true, isOverviewTab({ url: "chrome-extension://foobar" }));
  t.is(false, isOverviewTab({ url: "www.example.com" }));
});

test("Check if domain should be checked", t => {
  t.is(true, domainShouldBeChecked("www.example.com"));
  t.is(false, domainShouldBeChecked(""));
});

test("Verify clean domain from tab", t => {
  t.is("", getCleanDomainFromTab({ url: "moz-extension://foobar" }));
  t.is("example.com", getCleanDomainFromTab({ url: "http://www.example.com" }));
  t.is(
    "example.co.uk",
    getCleanDomainFromTab({ url: "http://www.example.co.uk" })
  );
});

test("Return if no cookies are set", t => {
  t.deepEqual({}, parseCookies({}));
});

test("Parse cookies when there is readable data present", t => {
  t.deepEqual(
    {
      "example.com": {
        foo: {
          value: "bar",
          warnings: { data_readable: "There is readable data present" }
        },
        foo2: {
          value: "bar",
          warnings: { data_readable: "There is readable data present" }
        }
      }
    },
    parseCookies([
      { name: "foo", domain: "example.com", value: "bar" },
      { name: "foo2", domain: "example.com", value: "bar" }
    ])
  );
});

test("Parse cookies when there is extractable data present", t => {
  t.deepEqual(
    {
      "example.com": {
        foo: {
          value: '{"test":"test"}',
          warnings: { data_extractable: "There is extractable data present" }
        }
      }
    },
    parseCookies([
      { name: "foo", domain: "example.com", value: "eyJ0ZXN0IjoidGVzdCJ9" }
    ])
  );
});

test("Parse cookies when there is PII data present", t => {
  t.deepEqual(
    {
      "example.com": {
        foo: {
          value: '{"name":"test", "date_of_birth": "2000-01-01"}',
          warnings: {
            data_extractable: "There is extractable data present",
            pii_present_dateofbirth:
              'linkable PII found in json-value with key "dateofbirth" : <b>2000-01-01</b>',
            pii_present_name:
              'linked PII found in json-value with key "name" : <b>test</b>'
          }
        }
      }
    },
    parseCookies([
      {
        name: "foo",
        domain: "example.com",
        value:
          "eyJuYW1lIjoidGVzdCIsICJkYXRlX29mX2JpcnRoIjogIjIwMDAtMDEtMDEifQ=="
      }
    ])
  );
});
