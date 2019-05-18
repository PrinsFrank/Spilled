import test from "ava";
import {
  parseCookies,
  isOverviewTab,
  domainShouldBeChecked,
  getCleanDomainFromTab
} from "../../js/background/Modules/filters/cookie.js";

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

test("Return nothing if nothing interesting is store in cookies", t => {
  t.deepEqual(
    {
      "example.com": {
        foo: {
          score: {
            none: 0
          },
          value: "test",
          warnings: {}
        },
        foo2: {
          score: {
            none: 0
          },
          value: "test2",
          warnings: {}
        }
      }
    },
    parseCookies([
      {
        name: "foo",
        domain: "example.com",
        value: "test"
      },
      {
        name: "foo2",
        domain: "example.com",
        value: "test2"
      }
    ])
  );
});

test("Parse cookies when there is PII data present", t => {
  t.deepEqual(
    {
      "example.com": {
        foo: {
          score: {
            xss_non_httponly: 6.5
          },
          value: '{"name":"test", "date_of_birth": "2000-01-01"}',
          warnings: {
            pii_present_dateofbirth:
              'linkable PII found in json-value with key "dateofbirth" : "2000-01-01"',
            pii_present_name:
              'linked PII found in json-value with key "name" : "test"'
          }
        }
      }
    },
    parseCookies([
      {
        name: "foo",
        httpOnly: false,
        secure: true,
        domain: "example.com",
        value:
          "eyJuYW1lIjoidGVzdCIsICJkYXRlX29mX2JpcnRoIjogIjIwMDAtMDEtMDEifQ=="
      }
    ])
  );
  t.deepEqual(
    {
      "example.com": {
        foo: {
          score: {
            mitm_adjacent: 5.4
          },
          value: '{"name":"test", "date_of_birth": "2000-01-01"}',
          warnings: {
            pii_present_dateofbirth:
              'linkable PII found in json-value with key "dateofbirth" : "2000-01-01"',
            pii_present_name:
              'linked PII found in json-value with key "name" : "test"'
          }
        }
      }
    },
    parseCookies([
      {
        name: "foo",
        httpOnly: true,
        secure: false,
        domain: "example.com",
        value:
          "eyJuYW1lIjoidGVzdCIsICJkYXRlX29mX2JpcnRoIjogIjIwMDAtMDEtMDEifQ=="
      }
    ])
  );
  t.deepEqual(
    {
      "example.com": {
        foo: {
          score: {
            none: 0
          },
          value: '{"name":"test", "date_of_birth": "2000-01-01"}',
          warnings: {
            pii_present_dateofbirth:
              'linkable PII found in json-value with key "dateofbirth" : "2000-01-01"',
            pii_present_name:
              'linked PII found in json-value with key "name" : "test"'
          }
        }
      }
    },
    parseCookies([
      {
        name: "foo",
        httpOnly: true,
        secure: true,
        domain: "example.com",
        value:
          "eyJuYW1lIjoidGVzdCIsICJkYXRlX29mX2JpcnRoIjogIjIwMDAtMDEtMDEifQ=="
      }
    ])
  );
});
