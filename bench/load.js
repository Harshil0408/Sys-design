import http from "k6/http";
import { check } from "k6";

export const options = {
  thresholds: {
    http_req_failed: ["rate<0.01"], // Error rate must be less than 1%
    http_req_duration: ["p(95)<250"], // 95% of requests should be below 250ms
  },
};

const BASE_URL = __ENV.TARGET_URL || "http://localhost:3000";
const ENDPOINT = __ENV.ENDPOINT || "all";

export default function () {
  let res;

  if (ENDPOINT === "health") {
    res = http.get(`${BASE_URL}/health`);
    check(res, { "status is 200": (r) => r.status === 200 });
  } else if (ENDPOINT === "cities") {
    res = http.get(`${BASE_URL}/api/v1/cities`);
    check(res, { "status is 200": (r) => r.status === 200 });
  } else if (ENDPOINT === "cinemas") {
    res = http.get(`${BASE_URL}/api/v1/cinemas`);
    check(res, { "status is 200": (r) => r.status === 200 });
  } else if (ENDPOINT === "shows") {
    res = http.get(`${BASE_URL}/api/v1/shows`);
    check(res, { "status is 200": (r) => r.status === 200 });
  } else {
    // All endpoints distribution
    const rand = Math.random();
    if (rand < 0.2) {
      res = http.get(`${BASE_URL}/health`);
    } else if (rand < 0.5) {
      res = http.get(`${BASE_URL}/api/v1/cities`);
    } else if (rand < 0.8) {
      res = http.get(`${BASE_URL}/api/v1/cinemas`);
    } else {
      res = http.get(`${BASE_URL}/api/v1/shows`);
    }
    check(res, {
      "status is 200": (r) => r.status === 200,
    });
  }
}
