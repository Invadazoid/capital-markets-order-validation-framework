import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 20,
  duration: '30s'
};

export default function () {
  const url = 'http://localhost:8080/placeOrder';
  const payload = JSON.stringify({ symbol: "ABC", qty: 10 });
  const params = { headers: { 'Content-Type': 'application/json' } };

  let res = http.post(url, payload, params);
  check(res, { 'status is 201': (r) => r.status === 201 });
  sleep(1);
}
