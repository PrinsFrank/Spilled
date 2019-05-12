import test from "ava";
import {
  getScoreNonHTTPSAdjacentNetwork,
  getScoreNonHTTPOnlyXSS,
  getScoreNonExploitable
} from "../../js/background/Modules/cvss/v3";

test("Returns correct score for multiple conditions", t => {
  t.deepEqual({ mitm_adjacent: 5.4 }, getScoreNonHTTPSAdjacentNetwork());
  t.deepEqual({ mitm_adjacent: 8.1 }, getScoreNonHTTPSAdjacentNetwork(true));
  t.deepEqual({ xss_non_httponly: 6.5 }, getScoreNonHTTPOnlyXSS());
  t.deepEqual({ xss_non_httponly: 9.1 }, getScoreNonHTTPOnlyXSS(true));
  t.deepEqual({ none: 0 }, getScoreNonExploitable());
});
