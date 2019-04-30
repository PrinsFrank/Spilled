import test from "ava";
import takeFingerPrint from "../../js/background/Modules/fingerprint";

test("Taking Fingerprint results in expected output", t => {
  t.is("test1", takeFingerPrint("test_1"));
  t.is("test2", takeFingerPrint("test.2"));
  t.is("test3", takeFingerPrint("test-3"));
});
