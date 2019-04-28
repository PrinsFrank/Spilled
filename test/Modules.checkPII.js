import test from "ava";
import {
  PIIpresent,
  verifyValueFingerPrint
} from "../js/background/Modules/checkPII";

test("Returns info when linked PII is present", t => {
  t.deepEqual(
    { name: { context: "name", type: "linked", value: "Test" } },
    PIIpresent("name", "Test")
  );
});

test("Returns info when linkable PII is present", t => {
  t.deepEqual(
    { dateofbirth: { context: "name", type: "linkable", value: "2000-01-01" } },
    PIIpresent("date_of_birth", "2000-01-01")
  );
});

test("Returns nothing when no PII is present", t => {
  t.deepEqual({}, PIIpresent("foo", "bar"));
});

test("Returns linkable PII when it is present in value in JSON context", t => {
  t.deepEqual(
    {
      dateofbirth: {
        context: "json-value",
        type: "linkable",
        value: "2000-01-01"
      }
    },
    PIIpresent("foo", '{"date_of_birth":"2000-01-01"}')
  );
});

test("Returns linked PII when it is present in value in JSON context", t => {
  t.deepEqual(
    { name: { context: "json-value", type: "linked", value: "Test" } },
    PIIpresent("foo", '{"name":"Test"}')
  );
});

test("Returns nothing when value is empty", t => {
  t.deepEqual({}, PIIpresent("foo", "{}"));
});

test("Returns nothing when value is null", t => {
  t.deepEqual({}, PIIpresent("foo", "null"));
});

test("Check if there is a fingerprint verification present", t => {
  t.is(false, verifyValueFingerPrint("test", "bool"));
  t.is(true, verifyValueFingerPrint("test", "string"));
});
