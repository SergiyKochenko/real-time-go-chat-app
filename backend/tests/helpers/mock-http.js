export function createMockReq(overrides = {}) {
  return {
    body: {},
    params: {},
    cookies: {},
    user: null,
    ...overrides,
  };
}

export function createMockRes() {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  res.cookie = (...args) => {
    res.cookieArgs = args;
    return res;
  };
  return res;
}
