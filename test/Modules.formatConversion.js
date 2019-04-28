import test from "ava";
import {
  extractRecursively,
  getMeaningfulData,
  isValidJSON
} from "../js/background/Modules/formatConversion";

test("Get meaningful values from booleans", t => {
  t.is("true", getMeaningfulData("1"));
  t.is("false", getMeaningfulData("0"));
  t.is("true", getMeaningfulData("true"));
  t.is("false", getMeaningfulData("false"));
});

test("Get meaningful dates when not 10 years from now", t => {
  t.is(
    "Tue Jan 01 2019 01:00:00 GMT+0100 (GMT+01:00)",
    getMeaningfulData("2019-01-01")
  );
  t.is(
    "Tue Jan 01 2019 01:00:00 GMT+0100 (GMT+01:00)",
    getMeaningfulData("2019-01-01 01:00")
  );
  t.is(
    "Tue Jan 01 2019 01:00:00 GMT+0100 (GMT+01:00)",
    getMeaningfulData("1546300800")
  );
  t.is(
    "Tue Jan 01 2019 01:00:00 GMT+0100 (GMT+01:00)",
    getMeaningfulData("1546300800000")
  );
  t.is(false, getMeaningfulData("2009-01-01"));
  t.is(false, getMeaningfulData("2039-01-01"));
  t.is(false, getMeaningfulData("2039-01-01 00:00"));
  t.is(false, getMeaningfulData("2039-01-01 00:00"));
});

test("Test valid JSON", t => {
  t.is(true, isValidJSON('{"json": "true"}'));
  t.is(false, isValidJSON("{json:false}"));
});

test("Get meaningful data from JSON", t => {
  t.is('{"json":"true"}', getMeaningfulData('{"json":"true"}'));
  t.is(false, getMeaningfulData("{json:false}"));
});

test("Get meaningful data if readable string", t => {
  t.is(false, getMeaningfulData(";sdfj]gaang]"));
  t.is(
    "This is a readable string",
    getMeaningfulData("This is a readable string")
  );
});

test("Extract data from base64 encoded string", t => {
  t.is(
    "This is a readable string",
    extractRecursively("VGhpcyBpcyBhIHJlYWRhYmxlIHN0cmluZw==")
  );
  t.is('{"json":"true"}', extractRecursively("eyJqc29uIjoidHJ1ZSJ9"));
});
