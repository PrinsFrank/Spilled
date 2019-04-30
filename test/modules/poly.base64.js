import test from "ava";
import { btoaPoly, atobPoly } from "../../js/background/Modules/poly/base64.js";

test("Test BTOA poly output", t => {
  t.is("", btoaPoly());
  t.is("dGVzdA==", btoaPoly("test"));
});

test("Test ATOB poly output", t => {
  t.is("", atobPoly());
  t.is("test", atobPoly("dGVzdA=="));
});

test("Throws error for characters outside of latin1", t => {
  let error = t.throws(() => {
    btoaPoly("𝛍");
  });

  t.is(
    error.message,
    "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
  );
});
