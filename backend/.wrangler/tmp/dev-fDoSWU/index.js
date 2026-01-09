var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// .wrangler/tmp/bundle-w0JdTD/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
var init_strip_cf_connecting_ip_header = __esm({
  ".wrangler/tmp/bundle-w0JdTD/strip-cf-connecting-ip-header.js"() {
    "use strict";
    __name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        return Reflect.apply(target, thisArg, [
          stripCfConnectingIPHeader.apply(null, argArray)
        ]);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// ../node_modules/hono/dist/compose.js
var compose;
var init_compose = __esm({
  "../node_modules/hono/dist/compose.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
      return (context, next) => {
        let index = -1;
        return dispatch(0);
        async function dispatch(i) {
          if (i <= index) {
            throw new Error("next() called multiple times");
          }
          index = i;
          let res;
          let isError = false;
          let handler;
          if (middleware[i]) {
            handler = middleware[i][0][0];
            context.req.routeIndex = i;
          } else {
            handler = i === middleware.length && next || void 0;
          }
          if (handler) {
            try {
              res = await handler(context, () => dispatch(i + 1));
            } catch (err) {
              if (err instanceof Error && onError) {
                context.error = err;
                res = await onError(err, context);
                isError = true;
              } else {
                throw err;
              }
            }
          } else {
            if (context.finalized === false && onNotFound) {
              res = await onNotFound(context);
            }
          }
          if (res && (context.finalized === false || isError)) {
            context.res = res;
          }
          return context;
        }
        __name(dispatch, "dispatch");
      };
    }, "compose");
  }
});

// ../node_modules/hono/dist/http-exception.js
var init_http_exception = __esm({
  "../node_modules/hono/dist/http-exception.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
  }
});

// ../node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT;
var init_constants = __esm({
  "../node_modules/hono/dist/request/constants.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    GET_MATCH_RESULT = /* @__PURE__ */ Symbol();
  }
});

// ../node_modules/hono/dist/utils/body.js
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var parseBody, handleParsingAllValues, handleParsingNestedValues;
var init_body = __esm({
  "../node_modules/hono/dist/utils/body.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_request();
    parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
      const { all = false, dot = false } = options;
      const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
      const contentType = headers.get("Content-Type");
      if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
        return parseFormData(request, { all, dot });
      }
      return {};
    }, "parseBody");
    __name(parseFormData, "parseFormData");
    __name(convertFormDataToBodyData, "convertFormDataToBodyData");
    handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
      if (form[key] !== void 0) {
        if (Array.isArray(form[key])) {
          ;
          form[key].push(value);
        } else {
          form[key] = [form[key], value];
        }
      } else {
        if (!key.endsWith("[]")) {
          form[key] = value;
        } else {
          form[key] = [value];
        }
      }
    }, "handleParsingAllValues");
    handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
      let nestedForm = form;
      const keys = key.split(".");
      keys.forEach((key2, index) => {
        if (index === keys.length - 1) {
          nestedForm[key2] = value;
        } else {
          if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
            nestedForm[key2] = /* @__PURE__ */ Object.create(null);
          }
          nestedForm = nestedForm[key2];
        }
      });
    }, "handleParsingNestedValues");
  }
});

// ../node_modules/hono/dist/utils/url.js
var splitPath, splitRoutingPath, extractGroupsFromPath, replaceGroupMarks, patternCache, getPattern, tryDecode, tryDecodeURI, getPath, getPathNoStrict, mergePath, checkOptionalParameter, _decodeURI, _getQueryParam, getQueryParam, getQueryParams, decodeURIComponent_;
var init_url = __esm({
  "../node_modules/hono/dist/utils/url.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    splitPath = /* @__PURE__ */ __name((path) => {
      const paths = path.split("/");
      if (paths[0] === "") {
        paths.shift();
      }
      return paths;
    }, "splitPath");
    splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
      const { groups, path } = extractGroupsFromPath(routePath);
      const paths = splitPath(path);
      return replaceGroupMarks(paths, groups);
    }, "splitRoutingPath");
    extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
      const groups = [];
      path = path.replace(/\{[^}]+\}/g, (match2, index) => {
        const mark = `@${index}`;
        groups.push([mark, match2]);
        return mark;
      });
      return { groups, path };
    }, "extractGroupsFromPath");
    replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
      for (let i = groups.length - 1; i >= 0; i--) {
        const [mark] = groups[i];
        for (let j = paths.length - 1; j >= 0; j--) {
          if (paths[j].includes(mark)) {
            paths[j] = paths[j].replace(mark, groups[i][1]);
            break;
          }
        }
      }
      return paths;
    }, "replaceGroupMarks");
    patternCache = {};
    getPattern = /* @__PURE__ */ __name((label, next) => {
      if (label === "*") {
        return "*";
      }
      const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      if (match2) {
        const cacheKey = `${label}#${next}`;
        if (!patternCache[cacheKey]) {
          if (match2[2]) {
            patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
          } else {
            patternCache[cacheKey] = [label, match2[1], true];
          }
        }
        return patternCache[cacheKey];
      }
      return null;
    }, "getPattern");
    tryDecode = /* @__PURE__ */ __name((str, decoder) => {
      try {
        return decoder(str);
      } catch {
        return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
          try {
            return decoder(match2);
          } catch {
            return match2;
          }
        });
      }
    }, "tryDecode");
    tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
    getPath = /* @__PURE__ */ __name((request) => {
      const url = request.url;
      const start = url.indexOf("/", url.indexOf(":") + 4);
      let i = start;
      for (; i < url.length; i++) {
        const charCode = url.charCodeAt(i);
        if (charCode === 37) {
          const queryIndex = url.indexOf("?", i);
          const path = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
          return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
        } else if (charCode === 63) {
          break;
        }
      }
      return url.slice(start, i);
    }, "getPath");
    getPathNoStrict = /* @__PURE__ */ __name((request) => {
      const result = getPath(request);
      return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
    }, "getPathNoStrict");
    mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
      if (rest.length) {
        sub = mergePath(sub, ...rest);
      }
      return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
    }, "mergePath");
    checkOptionalParameter = /* @__PURE__ */ __name((path) => {
      if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
        return null;
      }
      const segments = path.split("/");
      const results = [];
      let basePath = "";
      segments.forEach((segment) => {
        if (segment !== "" && !/\:/.test(segment)) {
          basePath += "/" + segment;
        } else if (/\:/.test(segment)) {
          if (/\?/.test(segment)) {
            if (results.length === 0 && basePath === "") {
              results.push("/");
            } else {
              results.push(basePath);
            }
            const optionalSegment = segment.replace("?", "");
            basePath += "/" + optionalSegment;
            results.push(basePath);
          } else {
            basePath += "/" + segment;
          }
        }
      });
      return results.filter((v, i, a) => a.indexOf(v) === i);
    }, "checkOptionalParameter");
    _decodeURI = /* @__PURE__ */ __name((value) => {
      if (!/[%+]/.test(value)) {
        return value;
      }
      if (value.indexOf("+") !== -1) {
        value = value.replace(/\+/g, " ");
      }
      return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
    }, "_decodeURI");
    _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
      let encoded;
      if (!multiple && key && !/[%+]/.test(key)) {
        let keyIndex2 = url.indexOf("?", 8);
        if (keyIndex2 === -1) {
          return void 0;
        }
        if (!url.startsWith(key, keyIndex2 + 1)) {
          keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
        }
        while (keyIndex2 !== -1) {
          const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
          if (trailingKeyCode === 61) {
            const valueIndex = keyIndex2 + key.length + 2;
            const endIndex = url.indexOf("&", valueIndex);
            return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
          } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
            return "";
          }
          keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
        }
        encoded = /[%+]/.test(url);
        if (!encoded) {
          return void 0;
        }
      }
      const results = {};
      encoded ??= /[%+]/.test(url);
      let keyIndex = url.indexOf("?", 8);
      while (keyIndex !== -1) {
        const nextKeyIndex = url.indexOf("&", keyIndex + 1);
        let valueIndex = url.indexOf("=", keyIndex);
        if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
          valueIndex = -1;
        }
        let name = url.slice(
          keyIndex + 1,
          valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
        );
        if (encoded) {
          name = _decodeURI(name);
        }
        keyIndex = nextKeyIndex;
        if (name === "") {
          continue;
        }
        let value;
        if (valueIndex === -1) {
          value = "";
        } else {
          value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
          if (encoded) {
            value = _decodeURI(value);
          }
        }
        if (multiple) {
          if (!(results[name] && Array.isArray(results[name]))) {
            results[name] = [];
          }
          ;
          results[name].push(value);
        } else {
          results[name] ??= value;
        }
      }
      return key ? results[key] : results;
    }, "_getQueryParam");
    getQueryParam = _getQueryParam;
    getQueryParams = /* @__PURE__ */ __name((url, key) => {
      return _getQueryParam(url, key, true);
    }, "getQueryParams");
    decodeURIComponent_ = decodeURIComponent;
  }
});

// ../node_modules/hono/dist/request.js
var tryDecodeURIComponent, HonoRequest;
var init_request = __esm({
  "../node_modules/hono/dist/request.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_http_exception();
    init_constants();
    init_body();
    init_url();
    tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
    HonoRequest = /* @__PURE__ */ __name(class {
      /**
       * `.raw` can get the raw Request object.
       *
       * @see {@link https://hono.dev/docs/api/request#raw}
       *
       * @example
       * ```ts
       * // For Cloudflare Workers
       * app.post('/', async (c) => {
       *   const metadata = c.req.raw.cf?.hostMetadata?
       *   ...
       * })
       * ```
       */
      raw;
      #validatedData;
      // Short name of validatedData
      #matchResult;
      routeIndex = 0;
      /**
       * `.path` can get the pathname of the request.
       *
       * @see {@link https://hono.dev/docs/api/request#path}
       *
       * @example
       * ```ts
       * app.get('/about/me', (c) => {
       *   const pathname = c.req.path // `/about/me`
       * })
       * ```
       */
      path;
      bodyCache = {};
      constructor(request, path = "/", matchResult = [[]]) {
        this.raw = request;
        this.path = path;
        this.#matchResult = matchResult;
        this.#validatedData = {};
      }
      param(key) {
        return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
      }
      #getDecodedParam(key) {
        const paramKey = this.#matchResult[0][this.routeIndex][1][key];
        const param = this.#getParamValue(paramKey);
        return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
      }
      #getAllDecodedParams() {
        const decoded = {};
        const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
        for (const key of keys) {
          const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
          if (value !== void 0) {
            decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
          }
        }
        return decoded;
      }
      #getParamValue(paramKey) {
        return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
      }
      query(key) {
        return getQueryParam(this.url, key);
      }
      queries(key) {
        return getQueryParams(this.url, key);
      }
      header(name) {
        if (name) {
          return this.raw.headers.get(name) ?? void 0;
        }
        const headerData = {};
        this.raw.headers.forEach((value, key) => {
          headerData[key] = value;
        });
        return headerData;
      }
      async parseBody(options) {
        return this.bodyCache.parsedBody ??= await parseBody(this, options);
      }
      #cachedBody = (key) => {
        const { bodyCache, raw: raw2 } = this;
        const cachedBody = bodyCache[key];
        if (cachedBody) {
          return cachedBody;
        }
        const anyCachedKey = Object.keys(bodyCache)[0];
        if (anyCachedKey) {
          return bodyCache[anyCachedKey].then((body) => {
            if (anyCachedKey === "json") {
              body = JSON.stringify(body);
            }
            return new Response(body)[key]();
          });
        }
        return bodyCache[key] = raw2[key]();
      };
      /**
       * `.json()` can parse Request body of type `application/json`
       *
       * @see {@link https://hono.dev/docs/api/request#json}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.json()
       * })
       * ```
       */
      json() {
        return this.#cachedBody("text").then((text) => JSON.parse(text));
      }
      /**
       * `.text()` can parse Request body of type `text/plain`
       *
       * @see {@link https://hono.dev/docs/api/request#text}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.text()
       * })
       * ```
       */
      text() {
        return this.#cachedBody("text");
      }
      /**
       * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
       *
       * @see {@link https://hono.dev/docs/api/request#arraybuffer}
       *
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.arrayBuffer()
       * })
       * ```
       */
      arrayBuffer() {
        return this.#cachedBody("arrayBuffer");
      }
      /**
       * Parses the request body as a `Blob`.
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.blob();
       * });
       * ```
       * @see https://hono.dev/docs/api/request#blob
       */
      blob() {
        return this.#cachedBody("blob");
      }
      /**
       * Parses the request body as `FormData`.
       * @example
       * ```ts
       * app.post('/entry', async (c) => {
       *   const body = await c.req.formData();
       * });
       * ```
       * @see https://hono.dev/docs/api/request#formdata
       */
      formData() {
        return this.#cachedBody("formData");
      }
      /**
       * Adds validated data to the request.
       *
       * @param target - The target of the validation.
       * @param data - The validated data to add.
       */
      addValidatedData(target, data) {
        this.#validatedData[target] = data;
      }
      valid(target) {
        return this.#validatedData[target];
      }
      /**
       * `.url()` can get the request url strings.
       *
       * @see {@link https://hono.dev/docs/api/request#url}
       *
       * @example
       * ```ts
       * app.get('/about/me', (c) => {
       *   const url = c.req.url // `http://localhost:8787/about/me`
       *   ...
       * })
       * ```
       */
      get url() {
        return this.raw.url;
      }
      /**
       * `.method()` can get the method name of the request.
       *
       * @see {@link https://hono.dev/docs/api/request#method}
       *
       * @example
       * ```ts
       * app.get('/about/me', (c) => {
       *   const method = c.req.method // `GET`
       * })
       * ```
       */
      get method() {
        return this.raw.method;
      }
      get [GET_MATCH_RESULT]() {
        return this.#matchResult;
      }
      /**
       * `.matchedRoutes()` can return a matched route in the handler
       *
       * @deprecated
       *
       * Use matchedRoutes helper defined in "hono/route" instead.
       *
       * @see {@link https://hono.dev/docs/api/request#matchedroutes}
       *
       * @example
       * ```ts
       * app.use('*', async function logger(c, next) {
       *   await next()
       *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
       *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
       *     console.log(
       *       method,
       *       ' ',
       *       path,
       *       ' '.repeat(Math.max(10 - path.length, 0)),
       *       name,
       *       i === c.req.routeIndex ? '<- respond from here' : ''
       *     )
       *   })
       * })
       * ```
       */
      get matchedRoutes() {
        return this.#matchResult[0].map(([[, route]]) => route);
      }
      /**
       * `routePath()` can retrieve the path registered within the handler
       *
       * @deprecated
       *
       * Use routePath helper defined in "hono/route" instead.
       *
       * @see {@link https://hono.dev/docs/api/request#routepath}
       *
       * @example
       * ```ts
       * app.get('/posts/:id', (c) => {
       *   return c.json({ path: c.req.routePath })
       * })
       * ```
       */
      get routePath() {
        return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
      }
    }, "HonoRequest");
  }
});

// ../node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase, raw, resolveCallback;
var init_html = __esm({
  "../node_modules/hono/dist/utils/html.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    HtmlEscapedCallbackPhase = {
      Stringify: 1,
      BeforeStream: 2,
      Stream: 3
    };
    raw = /* @__PURE__ */ __name((value, callbacks) => {
      const escapedString = new String(value);
      escapedString.isEscaped = true;
      escapedString.callbacks = callbacks;
      return escapedString;
    }, "raw");
    resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
      if (typeof str === "object" && !(str instanceof String)) {
        if (!(str instanceof Promise)) {
          str = str.toString();
        }
        if (str instanceof Promise) {
          str = await str;
        }
      }
      const callbacks = str.callbacks;
      if (!callbacks?.length) {
        return Promise.resolve(str);
      }
      if (buffer) {
        buffer[0] += str;
      } else {
        buffer = [str];
      }
      const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
        (res) => Promise.all(
          res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
        ).then(() => buffer[0])
      );
      if (preserveCallbacks) {
        return raw(await resStr, callbacks);
      } else {
        return resStr;
      }
    }, "resolveCallback");
  }
});

// ../node_modules/hono/dist/context.js
var TEXT_PLAIN, setDefaultContentType, Context;
var init_context = __esm({
  "../node_modules/hono/dist/context.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_request();
    init_html();
    TEXT_PLAIN = "text/plain; charset=UTF-8";
    setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
      return {
        "Content-Type": contentType,
        ...headers
      };
    }, "setDefaultContentType");
    Context = /* @__PURE__ */ __name(class {
      #rawRequest;
      #req;
      /**
       * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
       *
       * @see {@link https://hono.dev/docs/api/context#env}
       *
       * @example
       * ```ts
       * // Environment object for Cloudflare Workers
       * app.get('*', async c => {
       *   const counter = c.env.COUNTER
       * })
       * ```
       */
      env = {};
      #var;
      finalized = false;
      /**
       * `.error` can get the error object from the middleware if the Handler throws an error.
       *
       * @see {@link https://hono.dev/docs/api/context#error}
       *
       * @example
       * ```ts
       * app.use('*', async (c, next) => {
       *   await next()
       *   if (c.error) {
       *     // do something...
       *   }
       * })
       * ```
       */
      error;
      #status;
      #executionCtx;
      #res;
      #layout;
      #renderer;
      #notFoundHandler;
      #preparedHeaders;
      #matchResult;
      #path;
      /**
       * Creates an instance of the Context class.
       *
       * @param req - The Request object.
       * @param options - Optional configuration options for the context.
       */
      constructor(req, options) {
        this.#rawRequest = req;
        if (options) {
          this.#executionCtx = options.executionCtx;
          this.env = options.env;
          this.#notFoundHandler = options.notFoundHandler;
          this.#path = options.path;
          this.#matchResult = options.matchResult;
        }
      }
      /**
       * `.req` is the instance of {@link HonoRequest}.
       */
      get req() {
        this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
        return this.#req;
      }
      /**
       * @see {@link https://hono.dev/docs/api/context#event}
       * The FetchEvent associated with the current request.
       *
       * @throws Will throw an error if the context does not have a FetchEvent.
       */
      get event() {
        if (this.#executionCtx && "respondWith" in this.#executionCtx) {
          return this.#executionCtx;
        } else {
          throw Error("This context has no FetchEvent");
        }
      }
      /**
       * @see {@link https://hono.dev/docs/api/context#executionctx}
       * The ExecutionContext associated with the current request.
       *
       * @throws Will throw an error if the context does not have an ExecutionContext.
       */
      get executionCtx() {
        if (this.#executionCtx) {
          return this.#executionCtx;
        } else {
          throw Error("This context has no ExecutionContext");
        }
      }
      /**
       * @see {@link https://hono.dev/docs/api/context#res}
       * The Response object for the current request.
       */
      get res() {
        return this.#res ||= new Response(null, {
          headers: this.#preparedHeaders ??= new Headers()
        });
      }
      /**
       * Sets the Response object for the current request.
       *
       * @param _res - The Response object to set.
       */
      set res(_res) {
        if (this.#res && _res) {
          _res = new Response(_res.body, _res);
          for (const [k, v] of this.#res.headers.entries()) {
            if (k === "content-type") {
              continue;
            }
            if (k === "set-cookie") {
              const cookies = this.#res.headers.getSetCookie();
              _res.headers.delete("set-cookie");
              for (const cookie of cookies) {
                _res.headers.append("set-cookie", cookie);
              }
            } else {
              _res.headers.set(k, v);
            }
          }
        }
        this.#res = _res;
        this.finalized = true;
      }
      /**
       * `.render()` can create a response within a layout.
       *
       * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
       *
       * @example
       * ```ts
       * app.get('/', (c) => {
       *   return c.render('Hello!')
       * })
       * ```
       */
      render = (...args) => {
        this.#renderer ??= (content) => this.html(content);
        return this.#renderer(...args);
      };
      /**
       * Sets the layout for the response.
       *
       * @param layout - The layout to set.
       * @returns The layout function.
       */
      setLayout = (layout) => this.#layout = layout;
      /**
       * Gets the current layout for the response.
       *
       * @returns The current layout function.
       */
      getLayout = () => this.#layout;
      /**
       * `.setRenderer()` can set the layout in the custom middleware.
       *
       * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
       *
       * @example
       * ```tsx
       * app.use('*', async (c, next) => {
       *   c.setRenderer((content) => {
       *     return c.html(
       *       <html>
       *         <body>
       *           <p>{content}</p>
       *         </body>
       *       </html>
       *     )
       *   })
       *   await next()
       * })
       * ```
       */
      setRenderer = (renderer) => {
        this.#renderer = renderer;
      };
      /**
       * `.header()` can set headers.
       *
       * @see {@link https://hono.dev/docs/api/context#header}
       *
       * @example
       * ```ts
       * app.get('/welcome', (c) => {
       *   // Set headers
       *   c.header('X-Message', 'Hello!')
       *   c.header('Content-Type', 'text/plain')
       *
       *   return c.body('Thank you for coming')
       * })
       * ```
       */
      header = (name, value, options) => {
        if (this.finalized) {
          this.#res = new Response(this.#res.body, this.#res);
        }
        const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
        if (value === void 0) {
          headers.delete(name);
        } else if (options?.append) {
          headers.append(name, value);
        } else {
          headers.set(name, value);
        }
      };
      status = (status) => {
        this.#status = status;
      };
      /**
       * `.set()` can set the value specified by the key.
       *
       * @see {@link https://hono.dev/docs/api/context#set-get}
       *
       * @example
       * ```ts
       * app.use('*', async (c, next) => {
       *   c.set('message', 'Hono is hot!!')
       *   await next()
       * })
       * ```
       */
      set = (key, value) => {
        this.#var ??= /* @__PURE__ */ new Map();
        this.#var.set(key, value);
      };
      /**
       * `.get()` can use the value specified by the key.
       *
       * @see {@link https://hono.dev/docs/api/context#set-get}
       *
       * @example
       * ```ts
       * app.get('/', (c) => {
       *   const message = c.get('message')
       *   return c.text(`The message is "${message}"`)
       * })
       * ```
       */
      get = (key) => {
        return this.#var ? this.#var.get(key) : void 0;
      };
      /**
       * `.var` can access the value of a variable.
       *
       * @see {@link https://hono.dev/docs/api/context#var}
       *
       * @example
       * ```ts
       * const result = c.var.client.oneMethod()
       * ```
       */
      // c.var.propName is a read-only
      get var() {
        if (!this.#var) {
          return {};
        }
        return Object.fromEntries(this.#var);
      }
      #newResponse(data, arg, headers) {
        const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
        if (typeof arg === "object" && "headers" in arg) {
          const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
          for (const [key, value] of argHeaders) {
            if (key.toLowerCase() === "set-cookie") {
              responseHeaders.append(key, value);
            } else {
              responseHeaders.set(key, value);
            }
          }
        }
        if (headers) {
          for (const [k, v] of Object.entries(headers)) {
            if (typeof v === "string") {
              responseHeaders.set(k, v);
            } else {
              responseHeaders.delete(k);
              for (const v2 of v) {
                responseHeaders.append(k, v2);
              }
            }
          }
        }
        const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
        return new Response(data, { status, headers: responseHeaders });
      }
      newResponse = (...args) => this.#newResponse(...args);
      /**
       * `.body()` can return the HTTP response.
       * You can set headers with `.header()` and set HTTP status code with `.status`.
       * This can also be set in `.text()`, `.json()` and so on.
       *
       * @see {@link https://hono.dev/docs/api/context#body}
       *
       * @example
       * ```ts
       * app.get('/welcome', (c) => {
       *   // Set headers
       *   c.header('X-Message', 'Hello!')
       *   c.header('Content-Type', 'text/plain')
       *   // Set HTTP status code
       *   c.status(201)
       *
       *   // Return the response body
       *   return c.body('Thank you for coming')
       * })
       * ```
       */
      body = (data, arg, headers) => this.#newResponse(data, arg, headers);
      /**
       * `.text()` can render text as `Content-Type:text/plain`.
       *
       * @see {@link https://hono.dev/docs/api/context#text}
       *
       * @example
       * ```ts
       * app.get('/say', (c) => {
       *   return c.text('Hello!')
       * })
       * ```
       */
      text = (text, arg, headers) => {
        return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
          text,
          arg,
          setDefaultContentType(TEXT_PLAIN, headers)
        );
      };
      /**
       * `.json()` can render JSON as `Content-Type:application/json`.
       *
       * @see {@link https://hono.dev/docs/api/context#json}
       *
       * @example
       * ```ts
       * app.get('/api', (c) => {
       *   return c.json({ message: 'Hello!' })
       * })
       * ```
       */
      json = (object, arg, headers) => {
        return this.#newResponse(
          JSON.stringify(object),
          arg,
          setDefaultContentType("application/json", headers)
        );
      };
      html = (html, arg, headers) => {
        const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
        return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
      };
      /**
       * `.redirect()` can Redirect, default status code is 302.
       *
       * @see {@link https://hono.dev/docs/api/context#redirect}
       *
       * @example
       * ```ts
       * app.get('/redirect', (c) => {
       *   return c.redirect('/')
       * })
       * app.get('/redirect-permanently', (c) => {
       *   return c.redirect('/', 301)
       * })
       * ```
       */
      redirect = (location, status) => {
        const locationString = String(location);
        this.header(
          "Location",
          // Multibyes should be encoded
          // eslint-disable-next-line no-control-regex
          !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
        );
        return this.newResponse(null, status ?? 302);
      };
      /**
       * `.notFound()` can return the Not Found Response.
       *
       * @see {@link https://hono.dev/docs/api/context#notfound}
       *
       * @example
       * ```ts
       * app.get('/notfound', (c) => {
       *   return c.notFound()
       * })
       * ```
       */
      notFound = () => {
        this.#notFoundHandler ??= () => new Response();
        return this.#notFoundHandler(this);
      };
    }, "Context");
  }
});

// ../node_modules/hono/dist/router.js
var METHOD_NAME_ALL, METHOD_NAME_ALL_LOWERCASE, METHODS, MESSAGE_MATCHER_IS_ALREADY_BUILT, UnsupportedPathError;
var init_router = __esm({
  "../node_modules/hono/dist/router.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    METHOD_NAME_ALL = "ALL";
    METHOD_NAME_ALL_LOWERCASE = "all";
    METHODS = ["get", "post", "put", "delete", "options", "patch"];
    MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
    UnsupportedPathError = /* @__PURE__ */ __name(class extends Error {
    }, "UnsupportedPathError");
  }
});

// ../node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER;
var init_constants2 = __esm({
  "../node_modules/hono/dist/utils/constants.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    COMPOSED_HANDLER = "__COMPOSED_HANDLER";
  }
});

// ../node_modules/hono/dist/hono-base.js
var notFoundHandler, errorHandler, Hono;
var init_hono_base = __esm({
  "../node_modules/hono/dist/hono-base.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_compose();
    init_context();
    init_router();
    init_constants2();
    init_url();
    notFoundHandler = /* @__PURE__ */ __name((c) => {
      return c.text("404 Not Found", 404);
    }, "notFoundHandler");
    errorHandler = /* @__PURE__ */ __name((err, c) => {
      if ("getResponse" in err) {
        const res = err.getResponse();
        return c.newResponse(res.body, res);
      }
      console.error(err);
      return c.text("Internal Server Error", 500);
    }, "errorHandler");
    Hono = /* @__PURE__ */ __name(class _Hono {
      get;
      post;
      put;
      delete;
      options;
      patch;
      all;
      on;
      use;
      /*
        This class is like an abstract class and does not have a router.
        To use it, inherit the class and implement router in the constructor.
      */
      router;
      getPath;
      // Cannot use `#` because it requires visibility at JavaScript runtime.
      _basePath = "/";
      #path = "/";
      routes = [];
      constructor(options = {}) {
        const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
        allMethods.forEach((method) => {
          this[method] = (args1, ...args) => {
            if (typeof args1 === "string") {
              this.#path = args1;
            } else {
              this.#addRoute(method, this.#path, args1);
            }
            args.forEach((handler) => {
              this.#addRoute(method, this.#path, handler);
            });
            return this;
          };
        });
        this.on = (method, path, ...handlers) => {
          for (const p of [path].flat()) {
            this.#path = p;
            for (const m of [method].flat()) {
              handlers.map((handler) => {
                this.#addRoute(m.toUpperCase(), this.#path, handler);
              });
            }
          }
          return this;
        };
        this.use = (arg1, ...handlers) => {
          if (typeof arg1 === "string") {
            this.#path = arg1;
          } else {
            this.#path = "*";
            handlers.unshift(arg1);
          }
          handlers.forEach((handler) => {
            this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
          });
          return this;
        };
        const { strict, ...optionsWithoutStrict } = options;
        Object.assign(this, optionsWithoutStrict);
        this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
      }
      #clone() {
        const clone = new _Hono({
          router: this.router,
          getPath: this.getPath
        });
        clone.errorHandler = this.errorHandler;
        clone.#notFoundHandler = this.#notFoundHandler;
        clone.routes = this.routes;
        return clone;
      }
      #notFoundHandler = notFoundHandler;
      // Cannot use `#` because it requires visibility at JavaScript runtime.
      errorHandler = errorHandler;
      /**
       * `.route()` allows grouping other Hono instance in routes.
       *
       * @see {@link https://hono.dev/docs/api/routing#grouping}
       *
       * @param {string} path - base Path
       * @param {Hono} app - other Hono instance
       * @returns {Hono} routed Hono instance
       *
       * @example
       * ```ts
       * const app = new Hono()
       * const app2 = new Hono()
       *
       * app2.get("/user", (c) => c.text("user"))
       * app.route("/api", app2) // GET /api/user
       * ```
       */
      route(path, app2) {
        const subApp = this.basePath(path);
        app2.routes.map((r) => {
          let handler;
          if (app2.errorHandler === errorHandler) {
            handler = r.handler;
          } else {
            handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
            handler[COMPOSED_HANDLER] = r.handler;
          }
          subApp.#addRoute(r.method, r.path, handler);
        });
        return this;
      }
      /**
       * `.basePath()` allows base paths to be specified.
       *
       * @see {@link https://hono.dev/docs/api/routing#base-path}
       *
       * @param {string} path - base Path
       * @returns {Hono} changed Hono instance
       *
       * @example
       * ```ts
       * const api = new Hono().basePath('/api')
       * ```
       */
      basePath(path) {
        const subApp = this.#clone();
        subApp._basePath = mergePath(this._basePath, path);
        return subApp;
      }
      /**
       * `.onError()` handles an error and returns a customized Response.
       *
       * @see {@link https://hono.dev/docs/api/hono#error-handling}
       *
       * @param {ErrorHandler} handler - request Handler for error
       * @returns {Hono} changed Hono instance
       *
       * @example
       * ```ts
       * app.onError((err, c) => {
       *   console.error(`${err}`)
       *   return c.text('Custom Error Message', 500)
       * })
       * ```
       */
      onError = (handler) => {
        this.errorHandler = handler;
        return this;
      };
      /**
       * `.notFound()` allows you to customize a Not Found Response.
       *
       * @see {@link https://hono.dev/docs/api/hono#not-found}
       *
       * @param {NotFoundHandler} handler - request handler for not-found
       * @returns {Hono} changed Hono instance
       *
       * @example
       * ```ts
       * app.notFound((c) => {
       *   return c.text('Custom 404 Message', 404)
       * })
       * ```
       */
      notFound = (handler) => {
        this.#notFoundHandler = handler;
        return this;
      };
      /**
       * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
       *
       * @see {@link https://hono.dev/docs/api/hono#mount}
       *
       * @param {string} path - base Path
       * @param {Function} applicationHandler - other Request Handler
       * @param {MountOptions} [options] - options of `.mount()`
       * @returns {Hono} mounted Hono instance
       *
       * @example
       * ```ts
       * import { Router as IttyRouter } from 'itty-router'
       * import { Hono } from 'hono'
       * // Create itty-router application
       * const ittyRouter = IttyRouter()
       * // GET /itty-router/hello
       * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
       *
       * const app = new Hono()
       * app.mount('/itty-router', ittyRouter.handle)
       * ```
       *
       * @example
       * ```ts
       * const app = new Hono()
       * // Send the request to another application without modification.
       * app.mount('/app', anotherApp, {
       *   replaceRequest: (req) => req,
       * })
       * ```
       */
      mount(path, applicationHandler, options) {
        let replaceRequest;
        let optionHandler;
        if (options) {
          if (typeof options === "function") {
            optionHandler = options;
          } else {
            optionHandler = options.optionHandler;
            if (options.replaceRequest === false) {
              replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
            } else {
              replaceRequest = options.replaceRequest;
            }
          }
        }
        const getOptions = optionHandler ? (c) => {
          const options2 = optionHandler(c);
          return Array.isArray(options2) ? options2 : [options2];
        } : (c) => {
          let executionContext = void 0;
          try {
            executionContext = c.executionCtx;
          } catch {
          }
          return [c.env, executionContext];
        };
        replaceRequest ||= (() => {
          const mergedPath = mergePath(this._basePath, path);
          const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
          return (request) => {
            const url = new URL(request.url);
            url.pathname = url.pathname.slice(pathPrefixLength) || "/";
            return new Request(url, request);
          };
        })();
        const handler = /* @__PURE__ */ __name(async (c, next) => {
          const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
          if (res) {
            return res;
          }
          await next();
        }, "handler");
        this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
        return this;
      }
      #addRoute(method, path, handler) {
        method = method.toUpperCase();
        path = mergePath(this._basePath, path);
        const r = { basePath: this._basePath, path, method, handler };
        this.router.add(method, path, [handler, r]);
        this.routes.push(r);
      }
      #handleError(err, c) {
        if (err instanceof Error) {
          return this.errorHandler(err, c);
        }
        throw err;
      }
      #dispatch(request, executionCtx, env, method) {
        if (method === "HEAD") {
          return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
        }
        const path = this.getPath(request, { env });
        const matchResult = this.router.match(method, path);
        const c = new Context(request, {
          path,
          matchResult,
          env,
          executionCtx,
          notFoundHandler: this.#notFoundHandler
        });
        if (matchResult[0].length === 1) {
          let res;
          try {
            res = matchResult[0][0][0][0](c, async () => {
              c.res = await this.#notFoundHandler(c);
            });
          } catch (err) {
            return this.#handleError(err, c);
          }
          return res instanceof Promise ? res.then(
            (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
          ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
        }
        const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
        return (async () => {
          try {
            const context = await composed(c);
            if (!context.finalized) {
              throw new Error(
                "Context is not finalized. Did you forget to return a Response object or `await next()`?"
              );
            }
            return context.res;
          } catch (err) {
            return this.#handleError(err, c);
          }
        })();
      }
      /**
       * `.fetch()` will be entry point of your app.
       *
       * @see {@link https://hono.dev/docs/api/hono#fetch}
       *
       * @param {Request} request - request Object of request
       * @param {Env} Env - env Object
       * @param {ExecutionContext} - context of execution
       * @returns {Response | Promise<Response>} response of request
       *
       */
      fetch = (request, ...rest) => {
        return this.#dispatch(request, rest[1], rest[0], request.method);
      };
      /**
       * `.request()` is a useful method for testing.
       * You can pass a URL or pathname to send a GET request.
       * app will return a Response object.
       * ```ts
       * test('GET /hello is ok', async () => {
       *   const res = await app.request('/hello')
       *   expect(res.status).toBe(200)
       * })
       * ```
       * @see https://hono.dev/docs/api/hono#request
       */
      request = (input, requestInit, Env, executionCtx) => {
        if (input instanceof Request) {
          return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
        }
        input = input.toString();
        return this.fetch(
          new Request(
            /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
            requestInit
          ),
          Env,
          executionCtx
        );
      };
      /**
       * `.fire()` automatically adds a global fetch event listener.
       * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
       * @deprecated
       * Use `fire` from `hono/service-worker` instead.
       * ```ts
       * import { Hono } from 'hono'
       * import { fire } from 'hono/service-worker'
       *
       * const app = new Hono()
       * // ...
       * fire(app)
       * ```
       * @see https://hono.dev/docs/api/hono#fire
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
       * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
       */
      fire = () => {
        addEventListener("fetch", (event) => {
          event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
        });
      };
    }, "_Hono");
  }
});

// ../node_modules/hono/dist/router/reg-exp-router/matcher.js
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }, "match2");
  this.match = match2;
  return match2(method, path);
}
var emptyParam;
var init_matcher = __esm({
  "../node_modules/hono/dist/router/reg-exp-router/matcher.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_router();
    emptyParam = [];
    __name(match, "match");
  }
});

// ../node_modules/hono/dist/router/reg-exp-router/node.js
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var LABEL_REG_EXP_STR, ONLY_WILDCARD_REG_EXP_STR, TAIL_WILDCARD_REG_EXP_STR, PATH_ERROR, regExpMetaChars, Node;
var init_node = __esm({
  "../node_modules/hono/dist/router/reg-exp-router/node.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    LABEL_REG_EXP_STR = "[^/]+";
    ONLY_WILDCARD_REG_EXP_STR = ".*";
    TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
    PATH_ERROR = /* @__PURE__ */ Symbol();
    regExpMetaChars = new Set(".\\+*[^]$()");
    __name(compareKey, "compareKey");
    Node = /* @__PURE__ */ __name(class _Node {
      #index;
      #varIndex;
      #children = /* @__PURE__ */ Object.create(null);
      insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
        if (tokens.length === 0) {
          if (this.#index !== void 0) {
            throw PATH_ERROR;
          }
          if (pathErrorCheckOnly) {
            return;
          }
          this.#index = index;
          return;
        }
        const [token, ...restTokens] = tokens;
        const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
        let node;
        if (pattern) {
          const name = pattern[1];
          let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
          if (name && pattern[2]) {
            if (regexpStr === ".*") {
              throw PATH_ERROR;
            }
            regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
            if (/\((?!\?:)/.test(regexpStr)) {
              throw PATH_ERROR;
            }
          }
          node = this.#children[regexpStr];
          if (!node) {
            if (Object.keys(this.#children).some(
              (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
            )) {
              throw PATH_ERROR;
            }
            if (pathErrorCheckOnly) {
              return;
            }
            node = this.#children[regexpStr] = new _Node();
            if (name !== "") {
              node.#varIndex = context.varIndex++;
            }
          }
          if (!pathErrorCheckOnly && name !== "") {
            paramMap.push([name, node.#varIndex]);
          }
        } else {
          node = this.#children[token];
          if (!node) {
            if (Object.keys(this.#children).some(
              (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
            )) {
              throw PATH_ERROR;
            }
            if (pathErrorCheckOnly) {
              return;
            }
            node = this.#children[token] = new _Node();
          }
        }
        node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
      }
      buildRegExpStr() {
        const childKeys = Object.keys(this.#children).sort(compareKey);
        const strList = childKeys.map((k) => {
          const c = this.#children[k];
          return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
        });
        if (typeof this.#index === "number") {
          strList.unshift(`#${this.#index}`);
        }
        if (strList.length === 0) {
          return "";
        }
        if (strList.length === 1) {
          return strList[0];
        }
        return "(?:" + strList.join("|") + ")";
      }
    }, "_Node");
  }
});

// ../node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie;
var init_trie = __esm({
  "../node_modules/hono/dist/router/reg-exp-router/trie.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_node();
    Trie = /* @__PURE__ */ __name(class {
      #context = { varIndex: 0 };
      #root = new Node();
      insert(path, index, pathErrorCheckOnly) {
        const paramAssoc = [];
        const groups = [];
        for (let i = 0; ; ) {
          let replaced = false;
          path = path.replace(/\{[^}]+\}/g, (m) => {
            const mark = `@\\${i}`;
            groups[i] = [mark, m];
            i++;
            replaced = true;
            return mark;
          });
          if (!replaced) {
            break;
          }
        }
        const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
        for (let i = groups.length - 1; i >= 0; i--) {
          const [mark] = groups[i];
          for (let j = tokens.length - 1; j >= 0; j--) {
            if (tokens[j].indexOf(mark) !== -1) {
              tokens[j] = tokens[j].replace(mark, groups[i][1]);
              break;
            }
          }
        }
        this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
        return paramAssoc;
      }
      buildRegExp() {
        let regexp = this.#root.buildRegExpStr();
        if (regexp === "") {
          return [/^$/, [], []];
        }
        let captureIndex = 0;
        const indexReplacementMap = [];
        const paramReplacementMap = [];
        regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
          if (handlerIndex !== void 0) {
            indexReplacementMap[++captureIndex] = Number(handlerIndex);
            return "$()";
          }
          if (paramIndex !== void 0) {
            paramReplacementMap[Number(paramIndex)] = ++captureIndex;
            return "";
          }
          return "";
        });
        return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
      }
    }, "Trie");
  }
});

// ../node_modules/hono/dist/router/reg-exp-router/router.js
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var nullMatcher, wildcardRegExpCache, RegExpRouter;
var init_router2 = __esm({
  "../node_modules/hono/dist/router/reg-exp-router/router.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_router();
    init_url();
    init_matcher();
    init_node();
    init_trie();
    nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
    wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
    __name(buildWildcardRegExp, "buildWildcardRegExp");
    __name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
    __name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
    __name(findMiddleware, "findMiddleware");
    RegExpRouter = /* @__PURE__ */ __name(class {
      name = "RegExpRouter";
      #middleware;
      #routes;
      constructor() {
        this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
        this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
      }
      add(method, path, handler) {
        const middleware = this.#middleware;
        const routes = this.#routes;
        if (!middleware || !routes) {
          throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
        }
        if (!middleware[method]) {
          ;
          [middleware, routes].forEach((handlerMap) => {
            handlerMap[method] = /* @__PURE__ */ Object.create(null);
            Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
              handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
            });
          });
        }
        if (path === "/*") {
          path = "*";
        }
        const paramCount = (path.match(/\/:/g) || []).length;
        if (/\*$/.test(path)) {
          const re = buildWildcardRegExp(path);
          if (method === METHOD_NAME_ALL) {
            Object.keys(middleware).forEach((m) => {
              middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
            });
          } else {
            middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
          }
          Object.keys(middleware).forEach((m) => {
            if (method === METHOD_NAME_ALL || method === m) {
              Object.keys(middleware[m]).forEach((p) => {
                re.test(p) && middleware[m][p].push([handler, paramCount]);
              });
            }
          });
          Object.keys(routes).forEach((m) => {
            if (method === METHOD_NAME_ALL || method === m) {
              Object.keys(routes[m]).forEach(
                (p) => re.test(p) && routes[m][p].push([handler, paramCount])
              );
            }
          });
          return;
        }
        const paths = checkOptionalParameter(path) || [path];
        for (let i = 0, len = paths.length; i < len; i++) {
          const path2 = paths[i];
          Object.keys(routes).forEach((m) => {
            if (method === METHOD_NAME_ALL || method === m) {
              routes[m][path2] ||= [
                ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
              ];
              routes[m][path2].push([handler, paramCount - len + i + 1]);
            }
          });
        }
      }
      match = match;
      buildAllMatchers() {
        const matchers = /* @__PURE__ */ Object.create(null);
        Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
          matchers[method] ||= this.#buildMatcher(method);
        });
        this.#middleware = this.#routes = void 0;
        clearWildcardRegExpCache();
        return matchers;
      }
      #buildMatcher(method) {
        const routes = [];
        let hasOwnRoute = method === METHOD_NAME_ALL;
        [this.#middleware, this.#routes].forEach((r) => {
          const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
          if (ownRoute.length !== 0) {
            hasOwnRoute ||= true;
            routes.push(...ownRoute);
          } else if (method !== METHOD_NAME_ALL) {
            routes.push(
              ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
            );
          }
        });
        if (!hasOwnRoute) {
          return null;
        } else {
          return buildMatcherFromPreprocessedRoutes(routes);
        }
      }
    }, "RegExpRouter");
  }
});

// ../node_modules/hono/dist/router/reg-exp-router/prepared-router.js
var init_prepared_router = __esm({
  "../node_modules/hono/dist/router/reg-exp-router/prepared-router.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_router();
    init_matcher();
    init_router2();
  }
});

// ../node_modules/hono/dist/router/reg-exp-router/index.js
var init_reg_exp_router = __esm({
  "../node_modules/hono/dist/router/reg-exp-router/index.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_router2();
    init_prepared_router();
  }
});

// ../node_modules/hono/dist/router/smart-router/router.js
var SmartRouter;
var init_router3 = __esm({
  "../node_modules/hono/dist/router/smart-router/router.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_router();
    SmartRouter = /* @__PURE__ */ __name(class {
      name = "SmartRouter";
      #routers = [];
      #routes = [];
      constructor(init) {
        this.#routers = init.routers;
      }
      add(method, path, handler) {
        if (!this.#routes) {
          throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
        }
        this.#routes.push([method, path, handler]);
      }
      match(method, path) {
        if (!this.#routes) {
          throw new Error("Fatal error");
        }
        const routers = this.#routers;
        const routes = this.#routes;
        const len = routers.length;
        let i = 0;
        let res;
        for (; i < len; i++) {
          const router = routers[i];
          try {
            for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
              router.add(...routes[i2]);
            }
            res = router.match(method, path);
          } catch (e) {
            if (e instanceof UnsupportedPathError) {
              continue;
            }
            throw e;
          }
          this.match = router.match.bind(router);
          this.#routers = [router];
          this.#routes = void 0;
          break;
        }
        if (i === len) {
          throw new Error("Fatal error");
        }
        this.name = `SmartRouter + ${this.activeRouter.name}`;
        return res;
      }
      get activeRouter() {
        if (this.#routes || this.#routers.length !== 1) {
          throw new Error("No active router has been determined yet.");
        }
        return this.#routers[0];
      }
    }, "SmartRouter");
  }
});

// ../node_modules/hono/dist/router/smart-router/index.js
var init_smart_router = __esm({
  "../node_modules/hono/dist/router/smart-router/index.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_router3();
  }
});

// ../node_modules/hono/dist/router/trie-router/node.js
var emptyParams, Node2;
var init_node2 = __esm({
  "../node_modules/hono/dist/router/trie-router/node.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_router();
    init_url();
    emptyParams = /* @__PURE__ */ Object.create(null);
    Node2 = /* @__PURE__ */ __name(class _Node2 {
      #methods;
      #children;
      #patterns;
      #order = 0;
      #params = emptyParams;
      constructor(method, handler, children) {
        this.#children = children || /* @__PURE__ */ Object.create(null);
        this.#methods = [];
        if (method && handler) {
          const m = /* @__PURE__ */ Object.create(null);
          m[method] = { handler, possibleKeys: [], score: 0 };
          this.#methods = [m];
        }
        this.#patterns = [];
      }
      insert(method, path, handler) {
        this.#order = ++this.#order;
        let curNode = this;
        const parts = splitRoutingPath(path);
        const possibleKeys = [];
        for (let i = 0, len = parts.length; i < len; i++) {
          const p = parts[i];
          const nextP = parts[i + 1];
          const pattern = getPattern(p, nextP);
          const key = Array.isArray(pattern) ? pattern[0] : p;
          if (key in curNode.#children) {
            curNode = curNode.#children[key];
            if (pattern) {
              possibleKeys.push(pattern[1]);
            }
            continue;
          }
          curNode.#children[key] = new _Node2();
          if (pattern) {
            curNode.#patterns.push(pattern);
            possibleKeys.push(pattern[1]);
          }
          curNode = curNode.#children[key];
        }
        curNode.#methods.push({
          [method]: {
            handler,
            possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
            score: this.#order
          }
        });
        return curNode;
      }
      #getHandlerSets(node, method, nodeParams, params) {
        const handlerSets = [];
        for (let i = 0, len = node.#methods.length; i < len; i++) {
          const m = node.#methods[i];
          const handlerSet = m[method] || m[METHOD_NAME_ALL];
          const processedSet = {};
          if (handlerSet !== void 0) {
            handlerSet.params = /* @__PURE__ */ Object.create(null);
            handlerSets.push(handlerSet);
            if (nodeParams !== emptyParams || params && params !== emptyParams) {
              for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
                const key = handlerSet.possibleKeys[i2];
                const processed = processedSet[handlerSet.score];
                handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
                processedSet[handlerSet.score] = true;
              }
            }
          }
        }
        return handlerSets;
      }
      search(method, path) {
        const handlerSets = [];
        this.#params = emptyParams;
        const curNode = this;
        let curNodes = [curNode];
        const parts = splitPath(path);
        const curNodesQueue = [];
        for (let i = 0, len = parts.length; i < len; i++) {
          const part = parts[i];
          const isLast = i === len - 1;
          const tempNodes = [];
          for (let j = 0, len2 = curNodes.length; j < len2; j++) {
            const node = curNodes[j];
            const nextNode = node.#children[part];
            if (nextNode) {
              nextNode.#params = node.#params;
              if (isLast) {
                if (nextNode.#children["*"]) {
                  handlerSets.push(
                    ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
                  );
                }
                handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
              } else {
                tempNodes.push(nextNode);
              }
            }
            for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
              const pattern = node.#patterns[k];
              const params = node.#params === emptyParams ? {} : { ...node.#params };
              if (pattern === "*") {
                const astNode = node.#children["*"];
                if (astNode) {
                  handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
                  astNode.#params = params;
                  tempNodes.push(astNode);
                }
                continue;
              }
              const [key, name, matcher] = pattern;
              if (!part && !(matcher instanceof RegExp)) {
                continue;
              }
              const child = node.#children[key];
              const restPathString = parts.slice(i).join("/");
              if (matcher instanceof RegExp) {
                const m = matcher.exec(restPathString);
                if (m) {
                  params[name] = m[0];
                  handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
                  if (Object.keys(child.#children).length) {
                    child.#params = params;
                    const componentCount = m[0].match(/\//)?.length ?? 0;
                    const targetCurNodes = curNodesQueue[componentCount] ||= [];
                    targetCurNodes.push(child);
                  }
                  continue;
                }
              }
              if (matcher === true || matcher.test(part)) {
                params[name] = part;
                if (isLast) {
                  handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
                  if (child.#children["*"]) {
                    handlerSets.push(
                      ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                    );
                  }
                } else {
                  child.#params = params;
                  tempNodes.push(child);
                }
              }
            }
          }
          curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
        }
        if (handlerSets.length > 1) {
          handlerSets.sort((a, b) => {
            return a.score - b.score;
          });
        }
        return [handlerSets.map(({ handler, params }) => [handler, params])];
      }
    }, "_Node");
  }
});

// ../node_modules/hono/dist/router/trie-router/router.js
var TrieRouter;
var init_router4 = __esm({
  "../node_modules/hono/dist/router/trie-router/router.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_url();
    init_node2();
    TrieRouter = /* @__PURE__ */ __name(class {
      name = "TrieRouter";
      #node;
      constructor() {
        this.#node = new Node2();
      }
      add(method, path, handler) {
        const results = checkOptionalParameter(path);
        if (results) {
          for (let i = 0, len = results.length; i < len; i++) {
            this.#node.insert(method, results[i], handler);
          }
          return;
        }
        this.#node.insert(method, path, handler);
      }
      match(method, path) {
        return this.#node.search(method, path);
      }
    }, "TrieRouter");
  }
});

// ../node_modules/hono/dist/router/trie-router/index.js
var init_trie_router = __esm({
  "../node_modules/hono/dist/router/trie-router/index.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_router4();
  }
});

// ../node_modules/hono/dist/hono.js
var Hono2;
var init_hono = __esm({
  "../node_modules/hono/dist/hono.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_hono_base();
    init_reg_exp_router();
    init_smart_router();
    init_trie_router();
    Hono2 = /* @__PURE__ */ __name(class extends Hono {
      /**
       * Creates an instance of the Hono class.
       *
       * @param options - Optional configuration options for the Hono instance.
       */
      constructor(options = {}) {
        super(options);
        this.router = options.router ?? new SmartRouter({
          routers: [new RegExpRouter(), new TrieRouter()]
        });
      }
    }, "Hono");
  }
});

// ../node_modules/hono/dist/index.js
var init_dist = __esm({
  "../node_modules/hono/dist/index.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_hono();
  }
});

// ../packages/core-registry/src/types.ts
var ADMIN_ROUTES;
var init_types = __esm({
  "../packages/core-registry/src/types.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    ADMIN_ROUTES = {
      BASE: "/hpanel",
      DASHBOARD: "/hpanel",
      USERS: "/hpanel/users",
      TENANTS: "/hpanel/tenants",
      SETTINGS: "/hpanel/settings",
      SECURITY: "/hpanel/security"
    };
  }
});

// ../packages/core-registry/src/SettingsRegistry.ts
var SettingsRegistryClass, settingsRegistry;
var init_SettingsRegistry = __esm({
  "../packages/core-registry/src/SettingsRegistry.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    SettingsRegistryClass = class {
      sections = /* @__PURE__ */ new Map();
      /**
       * Register a settings section
       */
      register(section) {
        if (this.sections.has(section.id)) {
          console.warn(`Settings section "${section.id}" already registered, merging fields.`);
          const existing = this.sections.get(section.id);
          existing.fields = [...existing.fields, ...section.fields];
          return;
        }
        this.sections.set(section.id, section);
        console.log(`\u2713 Settings section registered: ${section.label} (${section.id})`);
      }
      /**
       * Get all registered sections
       */
      getAll() {
        return Array.from(this.sections.values()).sort((a, b) => a.order - b.order);
      }
      /**
       * Get section by ID
       */
      get(id) {
        return this.sections.get(id);
      }
      /**
       * Get sections available for current context
       */
      getAvailableSections(context) {
        return this.getAll().filter((section) => {
          if (!section.availableForTenants && !context.isSuperAdmin) {
            return false;
          }
          if (section.requiredRoles && section.requiredRoles.length > 0) {
          }
          return true;
        });
      }
      /**
       * Get all fields grouped by key prefix
       */
      getAllFields() {
        const fields = [];
        for (const section of this.getAll()) {
          fields.push(...section.fields);
        }
        return fields;
      }
      /**
       * Get field definition by key
       */
      getField(key) {
        for (const section of this.getAll()) {
          const field = section.fields.find((f) => f.key === key);
          if (field)
            return field;
        }
        return void 0;
      }
      /**
       * Get default value for a setting key
       */
      getDefaultValue(key) {
        const field = this.getField(key);
        return field?.defaultValue;
      }
      /**
       * Get all keys for a section
       */
      getKeysForSection(sectionId) {
        const section = this.sections.get(sectionId);
        if (!section)
          return [];
        return section.fields.map((f) => f.key);
      }
    };
    __name(SettingsRegistryClass, "SettingsRegistryClass");
    settingsRegistry = new SettingsRegistryClass();
  }
});

// ../packages/core-registry/src/ModuleRegistry.ts
var ModuleRegistryClass, moduleRegistry;
var init_ModuleRegistry = __esm({
  "../packages/core-registry/src/ModuleRegistry.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_SettingsRegistry();
    ModuleRegistryClass = class {
      modules = /* @__PURE__ */ new Map();
      loadOrder = [];
      /**
       * Register a module with the registry
       * @throws Error if module already registered or dependencies missing
       */
      register(config) {
        if (this.modules.has(config.id)) {
          console.warn(`Module ${config.id} is already registered, skipping.`);
          return;
        }
        if (config.dependencies) {
          for (const dep of config.dependencies) {
            if (!this.modules.has(dep)) {
              throw new Error(
                `Module "${config.id}" depends on "${dep}" which is not registered. Ensure ${dep} is imported before ${config.id}.`
              );
            }
          }
        }
        this.modules.set(config.id, config);
        this.loadOrder.push(config.id);
        if (config.settings) {
          settingsRegistry.register(config.settings);
        }
        console.log(`\u2713 Module registered: ${config.name} (${config.id}) v${config.version}`);
      }
      /**
       * Get all registered modules
       */
      getAll() {
        return Array.from(this.modules.values());
      }
      /**
       * Get module by ID
       */
      get(id) {
        return this.modules.get(id);
      }
      /**
       * Get modules in dependency-safe load order
       */
      getInLoadOrder() {
        return this.loadOrder.map((id) => this.modules.get(id));
      }
      /**
       * Get available modules for a specific context
       */
      getAvailableModules(context) {
        return this.getAll().filter((module) => this.isModuleAvailable(module, context)).sort((a, b) => a.menu.order - b.menu.order);
      }
      /**
       * Get sidebar menu items for current context
       */
      async getSidebarMenu(context) {
        const availableModules = this.getAvailableModules(context);
        const menuItems = [];
        for (const module of availableModules) {
          const menuItem = { ...module.menu };
          if (menuItem.badge?.getValue) {
            try {
              const value = await menuItem.badge.getValue();
              if (value !== void 0) {
                menuItem.badge.value = value;
              }
            } catch (err) {
              console.warn(`Failed to get badge for ${module.id}:`, err);
            }
          }
          menuItems.push(menuItem);
        }
        return menuItems;
      }
      /**
       * Check if module is available for given context
       */
      isModuleAvailable(module, context) {
        const { availability } = module;
        if (availability.requiresPlatformAdmin && !context.isSuperAdmin) {
          return false;
        }
        if (availability.enterpriseOnly && context.tenantPlan !== "enterprise") {
          return false;
        }
        if (module.isCore || availability.defaultEnabled) {
          return true;
        }
        if (context.enabledModules && context.enabledModules.includes(module.id)) {
          return true;
        }
        return false;
      }
      /**
       * Get module IDs that should be loaded for a tenant
       */
      getModulesToLoad(enabledModules) {
        const toLoad = [];
        const visited = /* @__PURE__ */ new Set();
        const addWithDeps = /* @__PURE__ */ __name((id) => {
          if (visited.has(id))
            return;
          visited.add(id);
          const module = this.modules.get(id);
          if (!module)
            return;
          if (module.dependencies) {
            for (const dep of module.dependencies) {
              addWithDeps(dep);
            }
          }
          toLoad.push(module);
        }, "addWithDeps");
        for (const module of this.getAll()) {
          if (module.availability.defaultEnabled) {
            addWithDeps(module.id);
          }
        }
        for (const id of enabledModules) {
          addWithDeps(id);
        }
        return toLoad;
      }
    };
    __name(ModuleRegistryClass, "ModuleRegistryClass");
    moduleRegistry = new ModuleRegistryClass();
  }
});

// ../packages/core-registry/src/EventBus.ts
var EventBusClass, eventBus;
var init_EventBus = __esm({
  "../packages/core-registry/src/EventBus.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    EventBusClass = class {
      handlers = /* @__PURE__ */ new Map();
      /**
       * Subscribe to an event
       * @returns Unsubscribe function
       */
      subscribe(event, handler) {
        if (!this.handlers.has(event)) {
          this.handlers.set(event, /* @__PURE__ */ new Set());
        }
        this.handlers.get(event).add(handler);
        return () => {
          this.handlers.get(event)?.delete(handler);
        };
      }
      /**
       * Publish an event to all subscribers
       */
      async publish(event, payload) {
        const handlers = this.handlers.get(event);
        if (!handlers || handlers.size === 0) {
          return;
        }
        const moduleEvent = {
          moduleId: payload.moduleId || "unknown",
          tenantId: payload.tenantId,
          timestamp: /* @__PURE__ */ new Date(),
          payload: payload.payload
        };
        const promises = [];
        for (const handler of handlers) {
          try {
            const result = handler(moduleEvent);
            if (result instanceof Promise) {
              promises.push(result.catch((err) => {
                console.error(`Event handler error for "${event}":`, err);
              }));
            }
          } catch (err) {
            console.error(`Event handler error for "${event}":`, err);
          }
        }
        if (promises.length > 0) {
          await Promise.all(promises);
        }
      }
      /**
       * Publish event without waiting for handlers
       */
      emit(event, payload) {
        this.publish(event, payload).catch((err) => {
          console.error(`Event emit error for "${event}":`, err);
        });
      }
      /**
       * Remove all handlers for an event
       */
      clear(event) {
        this.handlers.delete(event);
      }
      /**
       * Remove all handlers
       */
      clearAll() {
        this.handlers.clear();
      }
    };
    __name(EventBusClass, "EventBusClass");
    eventBus = new EventBusClass();
  }
});

// ../packages/core-registry/src/index.ts
var init_src = __esm({
  "../packages/core-registry/src/index.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_types();
    init_ModuleRegistry();
    init_SettingsRegistry();
    init_EventBus();
  }
});

// ../packages/modules-core/src/index.ts
var src_exports = {};
__export(src_exports, {
  coreModuleConfig: () => coreModuleConfig,
  registerCoreModules: () => registerCoreModules
});
function registerCoreModules() {
  moduleRegistry.register({
    id: "dashboard",
    name: "Dashboard",
    version: "1.0.0",
    routes: () => {
    },
    menu: { label: "Dashboard", icon: "LayoutDashboard", href: "/hpanel", order: 0 },
    isCore: true,
    isInfrastructure: true,
    // Don't show in modules marketplace
    category: "core",
    features: ["Usage overview", "Quick stats"],
    tags: ["dashboard", "stats"],
    availability: { defaultEnabled: true, availableForTenants: true },
    permissions: []
  });
  moduleRegistry.register({
    id: "module-manager",
    name: "Modules",
    version: "1.0.0",
    routes: () => {
    },
    menu: { label: "Modules", icon: "Package", href: "/hpanel/modules", order: 5 },
    isCore: true,
    isInfrastructure: true,
    // Don't show in modules marketplace
    category: "core",
    features: ["Module installation", "Tenant module toggles"],
    tags: ["modules", "plugins"],
    availability: { requiresPlatformAdmin: true, defaultEnabled: true },
    permissions: ["modules.manage"]
  });
  moduleRegistry.register({
    id: "settings",
    name: "Settings",
    version: "1.0.0",
    routes: () => {
    },
    menu: { label: "Settings", icon: "Settings", href: "/hpanel/settings", order: 100 },
    isCore: true,
    isInfrastructure: true,
    // Don't show in modules marketplace
    category: "core",
    features: ["Global configuration", "Branding"],
    tags: ["settings", "config"],
    availability: { defaultEnabled: true, availableForTenants: true },
    permissions: ["settings.view"]
  });
}
var coreModuleConfig;
var init_src2 = __esm({
  "../packages/modules-core/src/index.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_src();
    coreModuleConfig = {
      id: "core",
      name: "Platform Core",
      version: "1.0.0",
      description: "Essential platform infrastructure and dashboard",
      category: "core",
      isCore: true,
      features: ["Infrastructure", "System Health", "Service Mesh"],
      dependencies: [],
      tags: ["core", "platform", "system"],
      routes: () => {
      },
      // Handled by main app routing
      menu: {
        label: "Dashboard",
        icon: "LayoutDashboard",
        href: `${ADMIN_ROUTES.DASHBOARD}`,
        order: 0
      },
      availability: {
        requiresPlatformAdmin: false,
        availableForTenants: true,
        defaultEnabled: true
      },
      permissions: ["platform.view"]
    };
    __name(registerCoreModules, "registerCoreModules");
  }
});

// ../packages/modules-auth/src/routes/authRoutes.ts
function registerAuthRoutes(app2) {
  const auth = new Hono2();
  auth.post("/login", async (c) => {
    const db = c.env.DB;
    const body = await c.req.json();
    const { username, password } = body;
    if (!username || !password) {
      return c.json({ error: "Username and password are required" }, 400);
    }
    try {
      const user = await db.prepare(
        "SELECT id, username, password, role, tenant_id, status, email_verified FROM users WHERE username = ?"
      ).bind(username).first();
      if (!user) {
        await trackLoginAttempt(db, username, null, false, "User not found", c);
        return c.json({ error: "Invalid credentials" }, 401);
      }
      if (user.password !== password) {
        await trackLoginAttempt(db, username, user.tenant_id, false, "Invalid password", c);
        return c.json({ error: "Invalid credentials" }, 401);
      }
      if (user.status !== "active") {
        await trackLoginAttempt(db, username, user.tenant_id, false, "Account not active", c);
        return c.json({ error: "Account is not active" }, 403);
      }
      const sessionId = crypto.randomUUID();
      const accessToken = crypto.randomUUID();
      const expiresAt = Math.floor(Date.now() / 1e3) + 60 * 60 * 24;
      await db.prepare(`
        INSERT INTO sessions (id, user_id, tenant_id, access_token, expires_at, user_agent, ip_address, created_at, last_activity_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        sessionId,
        user.id,
        user.tenant_id,
        accessToken,
        expiresAt,
        c.req.header("user-agent") || "unknown",
        c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown",
        Math.floor(Date.now() / 1e3),
        Math.floor(Date.now() / 1e3)
      ).run();
      await trackLoginAttempt(db, username, user.tenant_id, true, null, c);
      await db.prepare("UPDATE users SET last_login_at = ? WHERE id = ?").bind(Math.floor(Date.now() / 1e3), user.id).run();
      return c.json({
        success: true,
        token: accessToken,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          tenantId: user.tenant_id
        },
        expiresAt
      });
    } catch (error) {
      console.error("Login error:", error);
      return c.json({ error: "Login failed", message: error.message }, 500);
    }
  });
  auth.post("/logout", async (c) => {
    const db = c.env.DB;
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return c.json({ error: "No token provided" }, 400);
    }
    try {
      await db.prepare("UPDATE sessions SET revoked_at = ? WHERE access_token = ?").bind(Math.floor(Date.now() / 1e3), token).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Logout failed" }, 500);
    }
  });
  auth.post("/logout-all", async (c) => {
    const db = c.env.DB;
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return c.json({ error: "No token provided" }, 400);
    }
    try {
      const session = await db.prepare("SELECT user_id FROM sessions WHERE access_token = ? AND revoked_at IS NULL").bind(token).first();
      if (!session) {
        return c.json({ error: "Invalid session" }, 401);
      }
      await db.prepare("UPDATE sessions SET revoked_at = ? WHERE user_id = ?").bind(Math.floor(Date.now() / 1e3), session.user_id).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Logout all failed" }, 500);
    }
  });
  auth.get("/me", async (c) => {
    const db = c.env.DB;
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }
    try {
      const session = await db.prepare(`
        SELECT s.user_id, s.tenant_id, s.expires_at, u.username, u.role, u.email, u.first_name, u.last_name, u.avatar_url
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.access_token = ? AND s.revoked_at IS NULL AND s.expires_at > ?
      `).bind(token, Math.floor(Date.now() / 1e3)).first();
      if (!session) {
        return c.json({ error: "Invalid or expired session" }, 401);
      }
      return c.json({
        id: session.user_id,
        username: session.username,
        email: session.email,
        role: session.role,
        tenantId: session.tenant_id,
        firstName: session.first_name,
        lastName: session.last_name,
        avatarUrl: session.avatar_url
      });
    } catch (error) {
      return c.json({ error: "Failed to get user info" }, 500);
    }
  });
  auth.get("/sessions", async (c) => {
    const db = c.env.DB;
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }
    try {
      const currentSession = await db.prepare("SELECT user_id FROM sessions WHERE access_token = ? AND revoked_at IS NULL").bind(token).first();
      if (!currentSession) {
        return c.json({ error: "Invalid session" }, 401);
      }
      const sessions = await db.prepare(`
        SELECT id, user_agent, ip_address, last_activity_at, created_at,
               CASE WHEN access_token = ? THEN 1 ELSE 0 END as is_current
        FROM sessions
        WHERE user_id = ? AND revoked_at IS NULL AND expires_at > ?
        ORDER BY last_activity_at DESC
      `).bind(token, currentSession.user_id, Math.floor(Date.now() / 1e3)).all();
      return c.json(sessions.results);
    } catch (error) {
      return c.json({ error: "Failed to get sessions" }, 500);
    }
  });
  auth.delete("/sessions/:id", async (c) => {
    const db = c.env.DB;
    const sessionId = c.req.param("id");
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }
    try {
      const currentSession = await db.prepare("SELECT user_id FROM sessions WHERE access_token = ? AND revoked_at IS NULL").bind(token).first();
      if (!currentSession) {
        return c.json({ error: "Invalid session" }, 401);
      }
      await db.prepare("UPDATE sessions SET revoked_at = ? WHERE id = ? AND user_id = ?").bind(Math.floor(Date.now() / 1e3), sessionId, currentSession.user_id).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to revoke session" }, 500);
    }
  });
  auth.get("/login-history", async (c) => {
    const db = c.env.DB;
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }
    try {
      const session = await db.prepare("SELECT user_id FROM sessions WHERE access_token = ? AND revoked_at IS NULL").bind(token).first();
      if (!session) {
        return c.json({ error: "Invalid session" }, 401);
      }
      const user = await db.prepare("SELECT username FROM users WHERE id = ?").bind(session.user_id).first();
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }
      const history = await db.prepare(`
        SELECT id, success, failure_reason, ip_address, user_agent, location, created_at
        FROM login_attempts
        WHERE email = ?
        ORDER BY created_at DESC
        LIMIT 50
      `).bind(user.username).all();
      return c.json(history.results);
    } catch (error) {
      return c.json({ error: "Failed to get login history" }, 500);
    }
  });
  auth.post("/change-password", async (c) => {
    const db = c.env.DB;
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    const { currentPassword, newPassword } = await c.req.json();
    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }
    if (!currentPassword || !newPassword) {
      return c.json({ error: "Current and new password are required" }, 400);
    }
    if (newPassword.length < 8) {
      return c.json({ error: "New password must be at least 8 characters" }, 400);
    }
    try {
      const session = await db.prepare("SELECT user_id FROM sessions WHERE access_token = ? AND revoked_at IS NULL").bind(token).first();
      if (!session) {
        return c.json({ error: "Invalid session" }, 401);
      }
      const user = await db.prepare("SELECT password FROM users WHERE id = ?").bind(session.user_id).first();
      if (user?.password !== currentPassword) {
        return c.json({ error: "Current password is incorrect" }, 400);
      }
      await db.prepare("UPDATE users SET password = ?, updated_at = ? WHERE id = ?").bind(newPassword, Math.floor(Date.now() / 1e3), session.user_id).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to change password" }, 500);
    }
  });
  app2.route("/api/v1/auth", auth);
}
async function trackLoginAttempt(db, email, tenantId, success, failureReason, c) {
  try {
    await db.prepare(`
      INSERT INTO login_attempts (id, email, tenant_id, success, failure_reason, ip_address, user_agent, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      email,
      tenantId,
      success ? 1 : 0,
      failureReason,
      c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown",
      c.req.header("user-agent") || "unknown",
      Math.floor(Date.now() / 1e3)
    ).run();
  } catch (err) {
    console.error("Failed to track login attempt:", err);
  }
}
var init_authRoutes = __esm({
  "../packages/modules-auth/src/routes/authRoutes.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_dist();
    __name(registerAuthRoutes, "registerAuthRoutes");
    __name(trackLoginAttempt, "trackLoginAttempt");
  }
});

// ../packages/modules-auth/src/settings/authSettings.ts
var authSettingsSection;
var init_authSettings = __esm({
  "../packages/modules-auth/src/settings/authSettings.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    authSettingsSection = {
      id: "auth",
      label: "Authentication & Security",
      icon: "Shield",
      order: 20,
      availableForTenants: true,
      requiredPermission: "settings.auth.manage",
      fields: [
        // ============================================================
        // PASSWORD POLICY
        // ============================================================
        {
          key: "auth.passwordMinLength",
          label: "Minimum Password Length",
          type: "number",
          description: "Minimum characters required for passwords",
          defaultValue: 8,
          scope: "tenant",
          group: "Password Policy"
        },
        {
          key: "auth.passwordRequireUppercase",
          label: "Require Uppercase Letters",
          type: "boolean",
          description: "Passwords must contain at least one uppercase letter",
          defaultValue: true,
          scope: "tenant",
          group: "Password Policy"
        },
        {
          key: "auth.passwordRequireNumbers",
          label: "Require Numbers",
          type: "boolean",
          description: "Passwords must contain at least one number",
          defaultValue: true,
          scope: "tenant",
          group: "Password Policy"
        },
        {
          key: "auth.passwordRequireSpecialChars",
          label: "Require Special Characters",
          type: "boolean",
          description: "Passwords must contain at least one special character",
          defaultValue: false,
          scope: "tenant",
          group: "Password Policy"
        },
        {
          key: "auth.passwordExpiryDays",
          label: "Password Expiry (Days)",
          type: "number",
          description: "Force password reset after this many days (0 = never)",
          defaultValue: 0,
          scope: "tenant",
          group: "Password Policy"
        },
        // ============================================================
        // LOCKOUT POLICY
        // ============================================================
        {
          key: "auth.maxLoginAttempts",
          label: "Max Login Attempts",
          type: "number",
          description: "Lock account after this many failed attempts",
          defaultValue: 5,
          scope: "tenant",
          group: "Lockout Policy"
        },
        {
          key: "auth.lockoutDurationMinutes",
          label: "Lockout Duration (Minutes)",
          type: "number",
          description: "How long accounts stay locked",
          defaultValue: 30,
          scope: "tenant",
          group: "Lockout Policy"
        },
        // ============================================================
        // SESSION POLICY
        // ============================================================
        {
          key: "auth.sessionTimeoutMinutes",
          label: "Session Timeout (Minutes)",
          type: "number",
          description: "Auto-logout after inactivity",
          defaultValue: 60,
          scope: "tenant",
          group: "Session Policy"
        },
        {
          key: "auth.maxConcurrentSessions",
          label: "Max Concurrent Sessions",
          type: "number",
          description: "Maximum devices logged in simultaneously (0 = unlimited)",
          defaultValue: 0,
          scope: "tenant",
          group: "Session Policy"
        },
        // ============================================================
        // REGISTRATION
        // ============================================================
        {
          key: "auth.requireEmailVerification",
          label: "Require Email Verification",
          type: "boolean",
          description: "Users must verify email before accessing the app",
          defaultValue: true,
          scope: "tenant",
          group: "Registration"
        },
        {
          key: "auth.allowSelfRegistration",
          label: "Allow Self Registration",
          type: "boolean",
          description: "Users can register without an invitation",
          defaultValue: false,
          scope: "tenant",
          group: "Registration"
        },
        {
          key: "auth.allowMagicLink",
          label: "Enable Magic Link Login",
          type: "boolean",
          description: "Allow passwordless login via email link",
          defaultValue: false,
          scope: "tenant",
          group: "Registration"
        }
      ]
    };
  }
});

// ../packages/modules-auth/src/module.config.ts
var moduleConfig;
var init_module_config = __esm({
  "../packages/modules-auth/src/module.config.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    moduleConfig = {
      id: "auth",
      name: "Authentication",
      description: "Login, sessions, password management, and security policies",
      longDescription: "Comprehensive authentication system with multi-factor support, session management, password policies, and security event logging.",
      icon: "Shield",
      version: "1.0.0",
      category: "core",
      isCore: true,
      features: [
        "Login/Logout",
        "Session Management",
        "Password Policies",
        "Security Events",
        "Multi-Factor Authentication"
      ],
      dependencies: [],
      tags: ["security", "auth", "login"]
    };
  }
});

// ../packages/modules-auth/src/index.ts
var src_exports2 = {};
__export(src_exports2, {
  authModuleConfig: () => authModuleConfig,
  authSettingsSection: () => authSettingsSection,
  moduleConfig: () => moduleConfig,
  registerAuthRoutes: () => registerAuthRoutes
});
var authModuleConfig;
var init_src3 = __esm({
  "../packages/modules-auth/src/index.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_src();
    init_authRoutes();
    init_authSettings();
    init_authRoutes();
    init_authSettings();
    init_module_config();
    authModuleConfig = {
      id: "auth",
      name: "Authentication",
      version: "1.0.0",
      description: "Authentication, sessions, and security management",
      category: "core",
      isCore: true,
      features: ["Login", "Logout", "Session Management", "Password Reset"],
      dependencies: [],
      tags: ["security", "identity", "auth"],
      routes: registerAuthRoutes,
      menu: {
        label: "Security",
        icon: "Shield",
        href: `${ADMIN_ROUTES.SECURITY}`,
        order: 30
      },
      availability: {
        requiresPlatformAdmin: false,
        availableForTenants: true,
        defaultEnabled: true
        // Foundation module - always enabled
      },
      permissions: [
        "auth.settings.manage",
        "sessions.view",
        "sessions.revoke",
        "login-history.view"
      ],
      requiredPermission: "sessions.view",
      settings: authSettingsSection,
      // Breeze lifecycle hooks
      onProvision: async (tenantId, db) => {
        console.log(`[Auth] Provisioning for tenant: ${tenantId}`);
      },
      onEnable: async (tenantId, db) => {
        console.log(`[Auth] Enabled for tenant: ${tenantId}`);
      },
      onDisable: async (tenantId, db) => {
        console.warn(`[Auth] Cannot disable auth module`);
      }
    };
    moduleRegistry.register(authModuleConfig);
  }
});

// ../packages/modules-users/src/routes/usersRoutes.ts
function registerUsersRoutes(app2) {
  const users = new Hono2();
  const roles = new Hono2();
  const invitations = new Hono2();
  users.get("/", async (c) => {
    const db = c.env.DB;
    const tenantId = c.req.query("tenantId");
    try {
      let query = `SELECT id, username, role, tenant_id, created_at FROM users`;
      const params = [];
      if (tenantId && tenantId !== "default") {
        query += " WHERE tenant_id = ?";
        params.push(tenantId);
      }
      query += " ORDER BY created_at DESC";
      const results = await db.prepare(query).bind(...params).all();
      return c.json(results.results || []);
    } catch (error) {
      console.error("Users fetch error:", error);
      return c.json({ error: "Failed to fetch users", message: error.message }, 500);
    }
  });
  users.get("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      const user = await db.prepare(`
        SELECT id, username, email, first_name, last_name, phone, avatar_url, timezone,
               role, status, email_verified, email_verified_at, account_expires_at,
               last_login_at, created_at, updated_at, tenant_id
        FROM users WHERE id = ? AND deleted_at IS NULL
      `).bind(id).first();
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }
      return c.json(user);
    } catch (error) {
      return c.json({ error: "Failed to fetch user", message: error.message }, 500);
    }
  });
  users.post("/", async (c) => {
    const db = c.env.DB;
    const body = await c.req.json();
    const { username, email, password, role = "viewer", tenantId, firstName, lastName } = body;
    if (!username || !password) {
      return c.json({ error: "Username and password are required" }, 400);
    }
    const id = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1e3);
    try {
      await db.prepare(`
        INSERT INTO users (id, tenant_id, username, email, password, first_name, last_name, role, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
      `).bind(id, tenantId || "default", username, email, password, firstName, lastName, role, now).run();
      return c.json({ id, username, email, role, status: "active", created_at: now }, 201);
    } catch (error) {
      if (error.message?.includes("UNIQUE constraint failed")) {
        return c.json({ error: "Username or email already exists" }, 409);
      }
      return c.json({ error: "Failed to create user", message: error.message }, 500);
    }
  });
  users.patch("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    const body = await c.req.json();
    const { username, email, role, status, firstName, lastName, phone, timezone } = body;
    const updates = [];
    const params = [];
    if (username) {
      updates.push("username = ?");
      params.push(username);
    }
    if (email) {
      updates.push("email = ?");
      params.push(email);
    }
    if (role) {
      updates.push("role = ?");
      params.push(role);
    }
    if (status) {
      updates.push("status = ?");
      params.push(status);
    }
    if (firstName !== void 0) {
      updates.push("first_name = ?");
      params.push(firstName);
    }
    if (lastName !== void 0) {
      updates.push("last_name = ?");
      params.push(lastName);
    }
    if (phone !== void 0) {
      updates.push("phone = ?");
      params.push(phone);
    }
    if (timezone) {
      updates.push("timezone = ?");
      params.push(timezone);
    }
    if (updates.length === 0) {
      return c.json({ error: "No fields to update" }, 400);
    }
    updates.push("updated_at = ?");
    params.push(Math.floor(Date.now() / 1e3));
    params.push(id);
    try {
      await db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to update user", message: error.message }, 500);
    }
  });
  users.delete("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      await db.prepare("UPDATE users SET deleted_at = ?, status = ? WHERE id = ?").bind(Math.floor(Date.now() / 1e3), "inactive", id).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to delete user", message: error.message }, 500);
    }
  });
  users.post("/bulk-delete", async (c) => {
    const db = c.env.DB;
    const { ids } = await c.req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return c.json({ error: "IDs array is required" }, 400);
    }
    try {
      const placeholders = ids.map(() => "?").join(", ");
      await db.prepare(`UPDATE users SET deleted_at = ?, status = ? WHERE id IN (${placeholders})`).bind(Math.floor(Date.now() / 1e3), "inactive", ...ids).run();
      return c.json({ success: true, deleted: ids.length });
    } catch (error) {
      return c.json({ error: "Failed to delete users", message: error.message }, 500);
    }
  });
  roles.get("/", async (c) => {
    const db = c.env.DB;
    const tenantId = c.req.query("tenantId");
    try {
      let query = "SELECT id, name, slug, description, is_system, created_at, tenant_id FROM roles";
      const params = [];
      if (tenantId) {
        query += " WHERE tenant_id = ? OR is_system = 1";
        params.push(tenantId);
      }
      query += " ORDER BY is_system DESC, name ASC";
      const results = await db.prepare(query).bind(...params).all();
      return c.json(results.results || []);
    } catch (error) {
      console.error("Roles fetch error:", error);
      return c.json([
        { id: "super_admin", name: "Super Admin", slug: "super_admin", is_system: 1 },
        { id: "admin", name: "Administrator", slug: "admin", is_system: 1 },
        { id: "editor", name: "Editor", slug: "editor", is_system: 1 },
        { id: "viewer", name: "Viewer", slug: "viewer", is_system: 1 }
      ]);
    }
  });
  roles.post("/", async (c) => {
    const db = c.env.DB;
    const body = await c.req.json();
    const { name, slug, description, tenantId } = body;
    if (!name || !slug) {
      return c.json({ error: "Name and slug are required" }, 400);
    }
    const id = crypto.randomUUID();
    try {
      await db.prepare(`
        INSERT INTO roles (id, tenant_id, name, slug, description, is_system, created_at)
        VALUES (?, ?, ?, ?, ?, 0, ?)
      `).bind(id, tenantId || "default", name, slug, description, Math.floor(Date.now() / 1e3)).run();
      return c.json({ id, name, slug, description }, 201);
    } catch (error) {
      if (error.message?.includes("UNIQUE constraint failed")) {
        return c.json({ error: "Role slug already exists for this tenant" }, 409);
      }
      return c.json({ error: "Failed to create role", message: error.message }, 500);
    }
  });
  roles.delete("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      const role = await db.prepare("SELECT is_system FROM roles WHERE id = ?").bind(id).first();
      if (!role) {
        return c.json({ error: "Role not found" }, 404);
      }
      if (role.is_system) {
        return c.json({ error: "Cannot delete system role" }, 403);
      }
      await db.prepare("DELETE FROM roles WHERE id = ?").bind(id).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to delete role", message: error.message }, 500);
    }
  });
  invitations.get("/", async (c) => {
    const db = c.env.DB;
    const tenantId = c.req.query("tenantId");
    const status = c.req.query("status");
    try {
      let query = "SELECT id, email, role_id, token, status, invited_by, expires_at, accepted_at, created_at, tenant_id FROM invitations WHERE 1=1";
      const params = [];
      if (tenantId) {
        query += " AND tenant_id = ?";
        params.push(tenantId);
      }
      if (status) {
        query += " AND status = ?";
        params.push(status);
      }
      query += " ORDER BY created_at DESC";
      const results = await db.prepare(query).bind(...params).all();
      return c.json(results.results);
    } catch (error) {
      return c.json({ error: "Failed to fetch invitations", message: error.message }, 500);
    }
  });
  invitations.post("/", async (c) => {
    const db = c.env.DB;
    const body = await c.req.json();
    const { email, roleId, tenantId, invitedBy } = body;
    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }
    const id = crypto.randomUUID();
    const token = crypto.randomUUID();
    const expiresAt = Math.floor(Date.now() / 1e3) + 7 * 24 * 60 * 60;
    try {
      await db.prepare(`
        INSERT INTO invitations (id, tenant_id, email, role_id, token, status, invited_by, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)
      `).bind(id, tenantId || "default", email, roleId, token, invitedBy, expiresAt, Math.floor(Date.now() / 1e3)).run();
      return c.json({ id, email, token, expiresAt, status: "pending" }, 201);
    } catch (error) {
      return c.json({ error: "Failed to send invitation", message: error.message }, 500);
    }
  });
  invitations.post("/:id/resend", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      const newToken = crypto.randomUUID();
      const expiresAt = Math.floor(Date.now() / 1e3) + 7 * 24 * 60 * 60;
      await db.prepare("UPDATE invitations SET token = ?, expires_at = ?, status = ? WHERE id = ?").bind(newToken, expiresAt, "pending", id).run();
      return c.json({ success: true, token: newToken, expiresAt });
    } catch (error) {
      return c.json({ error: "Failed to resend invitation", message: error.message }, 500);
    }
  });
  invitations.delete("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      await db.prepare("UPDATE invitations SET status = ? WHERE id = ?").bind("cancelled", id).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to cancel invitation", message: error.message }, 500);
    }
  });
  app2.route("/api/v1/users", users);
  app2.route("/api/v1/roles", roles);
  app2.route("/api/v1/invitations", invitations);
}
var init_usersRoutes = __esm({
  "../packages/modules-users/src/routes/usersRoutes.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_dist();
    __name(registerUsersRoutes, "registerUsersRoutes");
  }
});

// ../packages/modules-users/src/settings/usersSettings.ts
var usersSettingsSection;
var init_usersSettings = __esm({
  "../packages/modules-users/src/settings/usersSettings.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    usersSettingsSection = {
      id: "users",
      label: "Users & Permissions",
      icon: "Users",
      order: 25,
      availableForTenants: true,
      requiredPermission: "settings.users.manage",
      fields: [
        // User Management
        {
          key: "users.defaultRole",
          label: "Default Role for New Users",
          type: "select",
          description: "Role assigned to new users by default",
          defaultValue: "viewer",
          options: [
            { label: "Viewer", value: "viewer" },
            { label: "Editor", value: "editor" },
            { label: "Admin", value: "admin" }
          ],
          scope: "tenant"
        },
        {
          key: "users.maxUsersPerTenant",
          label: "Max Users",
          type: "number",
          description: "Maximum users allowed for this tenant (0 = unlimited)",
          defaultValue: 0,
          scope: "tenant"
        },
        // Invitation Settings
        {
          key: "users.invitationExpiryDays",
          label: "Invitation Expiry (Days)",
          type: "number",
          description: "How long invitation links remain valid",
          defaultValue: 7,
          scope: "tenant"
        },
        {
          key: "users.allowInviteByNonAdmin",
          label: "Allow Non-Admins to Invite",
          type: "boolean",
          description: "Editors can invite new users",
          defaultValue: false,
          scope: "tenant"
        },
        // Profile Settings
        {
          key: "users.requirePhoneNumber",
          label: "Require Phone Number",
          type: "boolean",
          description: "Make phone number a required field",
          defaultValue: false,
          scope: "tenant"
        },
        {
          key: "users.allowAvatarUpload",
          label: "Allow Avatar Upload",
          type: "boolean",
          description: "Users can upload profile pictures",
          defaultValue: true,
          scope: "tenant"
        },
        // GDPR / Compliance
        {
          key: "users.allowDataExport",
          label: "Allow Data Export",
          type: "boolean",
          description: "Users can export their personal data (GDPR)",
          defaultValue: true,
          scope: "tenant"
        },
        {
          key: "users.allowAccountDeletion",
          label: "Allow Account Deletion",
          type: "boolean",
          description: "Users can request account deletion (GDPR)",
          defaultValue: true,
          scope: "tenant"
        },
        // ============================================================
        // ADMIN UI SETTINGS
        // Controls what features are visible in the Users management page
        // ============================================================
        {
          key: "users.ui.showStatsCards",
          label: "Show Stats Cards",
          type: "boolean",
          description: "Display summary stats (Total, Active, Pending, Roles) above the table",
          defaultValue: true,
          scope: "tenant",
          group: "Users Admin UI"
        },
        {
          key: "users.ui.showSearch",
          label: "Enable Search",
          type: "boolean",
          description: "Show search input for filtering users",
          defaultValue: true,
          scope: "tenant",
          group: "Users Admin UI"
        },
        {
          key: "users.ui.showStatusFilter",
          label: "Show Status Filter",
          type: "boolean",
          description: "Show dropdown to filter by user status",
          defaultValue: true,
          scope: "tenant",
          group: "Users Admin UI"
        },
        {
          key: "users.ui.showRoleFilter",
          label: "Show Role Filter",
          type: "boolean",
          description: "Show dropdown to filter by user role",
          defaultValue: true,
          scope: "tenant",
          group: "Users Admin UI"
        },
        {
          key: "users.ui.showExport",
          label: "Enable Export",
          type: "boolean",
          description: "Allow exporting user data",
          defaultValue: true,
          scope: "tenant",
          group: "Users Admin UI"
        },
        {
          key: "users.ui.showImport",
          label: "Enable Import",
          type: "boolean",
          description: "Allow bulk user import",
          defaultValue: true,
          scope: "tenant",
          group: "Users Admin UI"
        },
        {
          key: "users.ui.showBulkActions",
          label: "Enable Bulk Actions",
          type: "boolean",
          description: "Allow bulk role change, suspend, delete",
          defaultValue: true,
          scope: "tenant",
          group: "Users Admin UI"
        },
        {
          key: "users.ui.allowInvite",
          label: "Allow User Invites",
          type: "boolean",
          description: "Enable invite user workflow",
          defaultValue: true,
          scope: "tenant",
          group: "Users Admin UI"
        },
        {
          key: "users.ui.showPagination",
          label: "Show Pagination",
          type: "boolean",
          description: "Show pagination controls with page size selector",
          defaultValue: true,
          scope: "tenant",
          group: "Users Admin UI"
        },
        {
          key: "users.ui.defaultPageSize",
          label: "Default Page Size",
          type: "select",
          description: "Number of users per page",
          defaultValue: "10",
          options: [
            { label: "10", value: "10" },
            { label: "25", value: "25" },
            { label: "50", value: "50" },
            { label: "100", value: "100" }
          ],
          scope: "tenant",
          group: "Users Admin UI"
        },
        // ============================================================
        // VISIBLE COLUMNS
        // =================================== =========================
        { key: "users.ui.columns.showId", label: "ID", type: "boolean", defaultValue: false, scope: "tenant", group: "Users Table Columns" },
        { key: "users.ui.columns.showUsername", label: "Username", type: "boolean", defaultValue: true, scope: "tenant", group: "Users Table Columns" },
        { key: "users.ui.columns.showEmail", label: "Email", type: "boolean", defaultValue: true, scope: "tenant", group: "Users Table Columns" },
        { key: "users.ui.columns.showFullName", label: "Full Name", type: "boolean", defaultValue: true, scope: "tenant", group: "Users Table Columns" },
        { key: "users.ui.columns.showRole", label: "Role", type: "boolean", defaultValue: true, scope: "tenant", group: "Users Table Columns" },
        { key: "users.ui.columns.showStatus", label: "Status", type: "boolean", defaultValue: true, scope: "tenant", group: "Users Table Columns" },
        { key: "users.ui.columns.showLastLogin", label: "Last Login", type: "boolean", defaultValue: true, scope: "tenant", group: "Users Table Columns" },
        { key: "users.ui.columns.showCreatedAt", label: "Created", type: "boolean", defaultValue: true, scope: "tenant", group: "Users Table Columns" },
        { key: "users.ui.columns.showUpdatedAt", label: "Updated", type: "boolean", defaultValue: false, scope: "tenant", group: "Users Table Columns" },
        { key: "users.ui.columns.showCreatedBy", label: "Created By", type: "boolean", defaultValue: false, scope: "tenant", group: "Users Table Columns" }
      ]
    };
  }
});

// ../packages/modules-users/src/module.config.ts
var moduleConfig2;
var init_module_config2 = __esm({
  "../packages/modules-users/src/module.config.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    moduleConfig2 = {
      id: "users",
      name: "Users",
      description: "User management, roles, permissions, and invitations",
      longDescription: "Full user lifecycle management including RBAC, team invitations, and GDPR compliance features.",
      icon: "Users",
      version: "1.0.0",
      category: "core",
      isCore: true,
      features: [
        "User CRUD",
        "Role Management",
        "Invitations",
        "GDPR Export",
        "User Profiles"
      ],
      dependencies: ["auth"],
      tags: ["users", "rbac", "permissions"]
    };
  }
});

// ../packages/modules-users/src/index.ts
var src_exports3 = {};
__export(src_exports3, {
  moduleConfig: () => moduleConfig2,
  registerUsersRoutes: () => registerUsersRoutes,
  usersModuleConfig: () => usersModuleConfig,
  usersSettingsSection: () => usersSettingsSection
});
var usersModuleConfig;
var init_src4 = __esm({
  "../packages/modules-users/src/index.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_src();
    init_usersRoutes();
    init_usersSettings();
    init_usersRoutes();
    init_usersSettings();
    init_module_config2();
    usersModuleConfig = {
      id: "users",
      name: "Users",
      version: "1.0.0",
      description: "User management, roles, and permissions",
      category: "core",
      isCore: true,
      features: ["User CRUD", "Role Management", "Permissions", "Invitations"],
      dependencies: ["auth"],
      tags: ["users", "roles", "permissions", "access"],
      routes: registerUsersRoutes,
      menu: {
        label: "Users",
        icon: "Users",
        href: `${ADMIN_ROUTES.USERS}`,
        order: 20,
        badge: {
          type: "count",
          getValue: async () => {
            return void 0;
          }
        }
      },
      availability: {
        requiresPlatformAdmin: false,
        availableForTenants: true,
        defaultEnabled: true
        // Foundation module
      },
      permissions: [
        "users.view",
        "users.create",
        "users.update",
        "users.delete",
        "users.invite",
        "roles.view",
        "roles.manage",
        "permissions.manage",
        "settings.users.manage"
      ],
      requiredPermission: "users.view",
      settings: usersSettingsSection,
      // Breeze lifecycle hooks
      onProvision: async (tenantId, db) => {
        console.log(`[Users] Provisioning for tenant: ${tenantId}`);
        const defaultRoles = [
          { slug: "admin", name: "Administrator", description: "Full access to all features" },
          { slug: "editor", name: "Editor", description: "Can create and edit content" },
          { slug: "viewer", name: "Viewer", description: "Read-only access" }
        ];
        for (const role of defaultRoles) {
          try {
            await db.prepare(`
          INSERT INTO roles (id, tenant_id, name, slug, description, is_system, created_at)
          VALUES (?, ?, ?, ?, ?, 1, ?)
        `).bind(
              crypto.randomUUID(),
              tenantId,
              role.name,
              role.slug,
              role.description,
              Math.floor(Date.now() / 1e3)
            ).run();
          } catch (err) {
            console.log(`Role ${role.slug} may already exist for tenant ${tenantId}`);
          }
        }
      },
      onEnable: async (tenantId, db) => {
        console.log(`[Users] Enabled for tenant: ${tenantId}`);
      }
    };
    moduleRegistry.register(usersModuleConfig);
  }
});

// ../packages/modules-tenants/src/routes/tenantsRoutes.ts
function registerTenantsRoutes(app2) {
  const tenants = new Hono2();
  tenants.get("/", async (c) => {
    const db = c.env.DB;
    try {
      const results = await db.prepare(`
                SELECT t.id, t.name, t.slug, t.status, td.domain
                FROM tenants t
                LEFT JOIN tenant_domains td ON t.id = td.tenant_id AND td.is_primary = 1
                ORDER BY t.name ASC
            `).all();
      return c.json(results.results || []);
    } catch (error) {
      console.error("Tenants fetch error:", error);
      return c.json({ error: "Failed to fetch tenants", message: error.message }, 500);
    }
  });
  tenants.get("/stats", async (c) => {
    const db = c.env.DB;
    try {
      const stats = await db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN status = 'trial' THEN 1 ELSE 0 END) as trial,
          SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended,
          SUM(mrr) as total_mrr,
          SUM(current_users) as total_users
        FROM tenants
        WHERE deleted_at IS NULL
      `).first();
      return c.json(stats);
    } catch (error) {
      return c.json({ error: "Failed to fetch stats", message: error.message }, 500);
    }
  });
  tenants.get("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      const tenant = await db.prepare(`
        SELECT * FROM tenants WHERE id = ? AND deleted_at IS NULL
      `).bind(id).first();
      if (!tenant) {
        return c.json({ error: "Tenant not found" }, 404);
      }
      return c.json(tenant);
    } catch (error) {
      return c.json({ error: "Failed to fetch tenant", message: error.message }, 500);
    }
  });
  tenants.post("/", async (c) => {
    const db = c.env.DB;
    const kv = c.env.KV;
    const body = await c.req.json();
    const {
      name,
      slug,
      domain,
      ownerEmail,
      planName = "free",
      maxUsers = 5,
      maxStorage = 1,
      status = "trial"
    } = body;
    if (!name || !slug) {
      return c.json({ error: "Name and slug are required" }, 400);
    }
    const id = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1e3);
    const trialEndsAt = status === "trial" ? now + 14 * 24 * 60 * 60 : null;
    try {
      await db.prepare(`
        INSERT INTO tenants (
          id, name, slug, domain, status, owner_email,
          plan_name, max_users, max_storage, max_api_calls,
          trial_ends_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        id,
        name,
        slug,
        domain,
        status,
        ownerEmail,
        planName,
        maxUsers,
        maxStorage,
        1e3,
        trialEndsAt,
        now
      ).run();
      if (domain) {
        await db.prepare(`
          INSERT INTO tenant_domains (id, tenant_id, domain, is_primary, created_at)
          VALUES (?, ?, ?, 1, ?)
        `).bind(crypto.randomUUID(), id, domain, now).run();
        if (kv) {
          const manifest = await kv.get("tenant_manifest", "json") || {};
          manifest[domain] = { id, slug, name };
          await kv.put("tenant_manifest", JSON.stringify(manifest));
        }
      }
      return c.json({
        id,
        name,
        slug,
        domain,
        status,
        planName,
        trialEndsAt
      }, 201);
    } catch (error) {
      if (error.message?.includes("UNIQUE constraint failed")) {
        return c.json({ error: "Slug or domain already exists" }, 409);
      }
      return c.json({ error: "Failed to create tenant", message: error.message }, 500);
    }
  });
  tenants.patch("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    const body = await c.req.json();
    const allowedFields = [
      "name",
      "slug",
      "domain",
      "status",
      "owner_email",
      "billing_email",
      "plan_name",
      "plan_id",
      "max_users",
      "max_storage",
      "max_api_calls",
      "industry",
      "company_size",
      "notes",
      "data_region",
      "encryption_enabled",
      "api_access_enabled"
    ];
    const updates = [];
    const params = [];
    for (const field of allowedFields) {
      const camelCase = field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      if (body[camelCase] !== void 0) {
        updates.push(`${field} = ?`);
        params.push(body[camelCase]);
      } else if (body[field] !== void 0) {
        updates.push(`${field} = ?`);
        params.push(body[field]);
      }
    }
    if (updates.length === 0) {
      return c.json({ error: "No fields to update" }, 400);
    }
    updates.push("updated_at = ?");
    params.push(Math.floor(Date.now() / 1e3));
    params.push(id);
    try {
      await db.prepare(`UPDATE tenants SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to update tenant", message: error.message }, 500);
    }
  });
  tenants.post("/:id/suspend", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    const { reason } = await c.req.json();
    try {
      await db.prepare(`
        UPDATE tenants SET status = 'suspended', suspended_at = ?, suspended_reason = ?, updated_at = ?
        WHERE id = ?
      `).bind(
        Math.floor(Date.now() / 1e3),
        reason || "Suspended by administrator",
        Math.floor(Date.now() / 1e3),
        id
      ).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to suspend tenant", message: error.message }, 500);
    }
  });
  tenants.post("/:id/reactivate", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      await db.prepare(`
        UPDATE tenants SET status = 'active', suspended_at = NULL, suspended_reason = NULL, updated_at = ?
        WHERE id = ?
      `).bind(Math.floor(Date.now() / 1e3), id).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to reactivate tenant", message: error.message }, 500);
    }
  });
  tenants.delete("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      await db.prepare(`
        UPDATE tenants SET status = 'archived', deleted_at = ?, updated_at = ?
        WHERE id = ?
      `).bind(Math.floor(Date.now() / 1e3), Math.floor(Date.now() / 1e3), id).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to delete tenant", message: error.message }, 500);
    }
  });
  tenants.get("/:id/usage", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      const usage = await db.prepare(`
        SELECT 
          current_users, max_users,
          storage_used, max_storage,
          api_calls_this_month, max_api_calls
        FROM tenants WHERE id = ?
      `).bind(id).first();
      if (!usage) {
        return c.json({ error: "Tenant not found" }, 404);
      }
      return c.json({
        users: {
          current: usage.current_users,
          max: usage.max_users,
          percentage: usage.max_users > 0 ? Math.round(usage.current_users / usage.max_users * 100) : 0
        },
        storage: {
          current: usage.storage_used,
          max: usage.max_storage,
          unit: "GB",
          percentage: usage.max_storage > 0 ? Math.round(usage.storage_used / usage.max_storage * 100) : 0
        },
        apiCalls: {
          current: usage.api_calls_this_month,
          max: usage.max_api_calls,
          percentage: usage.max_api_calls > 0 ? Math.round(usage.api_calls_this_month / usage.max_api_calls * 100) : 0
        }
      });
    } catch (error) {
      return c.json({ error: "Failed to fetch usage", message: error.message }, 500);
    }
  });
  tenants.get("/:id/modules", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      const modules = await db.prepare(`
        SELECT module_id, enabled, enabled_at, enabled_by, settings
        FROM module_status
        WHERE tenant_id = ?
      `).bind(id).all();
      return c.json(modules.results);
    } catch (error) {
      return c.json({ error: "Failed to fetch modules", message: error.message }, 500);
    }
  });
  tenants.post("/:id/modules/:moduleId/enable", async (c) => {
    const db = c.env.DB;
    const tenantId = c.req.param("id");
    const moduleId = c.req.param("moduleId");
    const { enabledBy } = await c.req.json();
    try {
      await db.prepare(`
        INSERT INTO module_status (id, module_id, tenant_id, enabled, enabled_at, enabled_by, created_at)
        VALUES (?, ?, ?, 1, ?, ?, ?)
        ON CONFLICT(module_id, tenant_id) DO UPDATE SET enabled = 1, enabled_at = ?, enabled_by = ?, updated_at = ?
      `).bind(
        crypto.randomUUID(),
        moduleId,
        tenantId,
        Math.floor(Date.now() / 1e3),
        enabledBy,
        Math.floor(Date.now() / 1e3),
        Math.floor(Date.now() / 1e3),
        enabledBy,
        Math.floor(Date.now() / 1e3)
      ).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to enable module", message: error.message }, 500);
    }
  });
  tenants.post("/:id/modules/:moduleId/disable", async (c) => {
    const db = c.env.DB;
    const tenantId = c.req.param("id");
    const moduleId = c.req.param("moduleId");
    try {
      await db.prepare(`
        UPDATE module_status SET enabled = 0, updated_at = ?
        WHERE module_id = ? AND tenant_id = ?
      `).bind(Math.floor(Date.now() / 1e3), moduleId, tenantId).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to disable module", message: error.message }, 500);
    }
  });
  app2.route("/api/v1/tenants", tenants);
}
var init_tenantsRoutes = __esm({
  "../packages/modules-tenants/src/routes/tenantsRoutes.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_dist();
    __name(registerTenantsRoutes, "registerTenantsRoutes");
  }
});

// ../packages/modules-tenants/src/settings/tenantsSettings.ts
var tenantsSettingsSection;
var init_tenantsSettings = __esm({
  "../packages/modules-tenants/src/settings/tenantsSettings.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    tenantsSettingsSection = {
      id: "tenants",
      label: "Multi-Tenancy",
      icon: "Building2",
      order: 10,
      availableForTenants: false,
      // Platform admin only
      requiredPermission: "tenants.manage",
      fields: [
        // ============================================================
        // ADMIN UI SETTINGS
        // Controls what features are visible in the Tenants management page
        // ============================================================
        {
          key: "tenants.ui.showStatsCards",
          label: "Show Stats Cards",
          type: "boolean",
          description: "Display summary stats (Total, Active, Trial, Plans) above the table",
          defaultValue: true,
          scope: "platform",
          group: "Admin UI"
        },
        {
          key: "tenants.ui.showSearch",
          label: "Enable Search",
          type: "boolean",
          description: "Show search input for filtering tenants",
          defaultValue: true,
          scope: "platform",
          group: "Admin UI"
        },
        {
          key: "tenants.ui.showStatusFilter",
          label: "Show Status Filter",
          type: "boolean",
          description: "Show dropdown to filter by tenant status",
          defaultValue: true,
          scope: "platform",
          group: "Admin UI"
        },
        {
          key: "tenants.ui.showPlanFilter",
          label: "Show Plan Filter",
          type: "boolean",
          description: "Show dropdown to filter by plan type",
          defaultValue: true,
          scope: "platform",
          group: "Admin UI"
        },
        {
          key: "tenants.ui.showExportCSV",
          label: "Enable CSV Export",
          type: "boolean",
          description: "Allow exporting tenant data to CSV",
          defaultValue: true,
          scope: "platform",
          group: "Admin UI"
        },
        {
          key: "tenants.ui.showBulkImport",
          label: "Enable Bulk Import",
          type: "boolean",
          description: "Allow bulk tenant creation via import",
          defaultValue: true,
          scope: "platform",
          group: "Admin UI"
        },
        {
          key: "tenants.ui.showQuickActions",
          label: "Enable Quick Actions",
          type: "boolean",
          description: "Show quick actions dropdown (Edit, Clone, Suspend, etc.)",
          defaultValue: true,
          scope: "platform",
          group: "Admin UI"
        },
        {
          key: "tenants.ui.allowClone",
          label: "Allow Tenant Cloning",
          type: "boolean",
          description: "Allow cloning tenants from the list view",
          defaultValue: true,
          scope: "platform",
          group: "Admin UI"
        },
        {
          key: "tenants.ui.allowStatusChange",
          label: "Allow Status Changes",
          type: "boolean",
          description: "Allow changing tenant status (Suspend, Activate, Archive)",
          defaultValue: true,
          scope: "platform",
          group: "Admin UI"
        },
        {
          key: "tenants.ui.showPagination",
          label: "Show Pagination",
          type: "boolean",
          description: "Show pagination controls with page size selector",
          defaultValue: true,
          scope: "platform",
          group: "Admin UI"
        },
        {
          key: "tenants.ui.defaultPageSize",
          label: "Default Page Size",
          type: "select",
          description: "Number of tenants per page",
          defaultValue: "10",
          options: [
            { label: "10", value: "10" },
            { label: "25", value: "25" },
            { label: "50", value: "50" },
            { label: "100", value: "100" }
          ],
          scope: "platform",
          group: "Admin UI"
        },
        // ============================================================
        // VISIBLE COLUMNS - ALL columns from tenants schema
        // ============================================================
        // Basic Info
        { key: "tenants.ui.columns.showId", label: "ID", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showName", label: "Name", type: "boolean", defaultValue: true, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showSlug", label: "Slug", type: "boolean", defaultValue: true, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showDomain", label: "Domain", type: "boolean", defaultValue: true, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showStatus", label: "Status", type: "boolean", defaultValue: true, scope: "platform", group: "Table Columns" },
        // Lifecycle
        { key: "tenants.ui.columns.showTrialEndsAt", label: "Trial Ends", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showSuspendedAt", label: "Suspended At", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showSuspendedReason", label: "Suspended Reason", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        // Ownership
        { key: "tenants.ui.columns.showOwnerId", label: "Owner ID", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showOwnerEmail", label: "Owner Email", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showBillingEmail", label: "Billing Email", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        // Subscription
        { key: "tenants.ui.columns.showPlanId", label: "Plan ID", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showPlanName", label: "Plan", type: "boolean", defaultValue: true, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showBillingStatus", label: "Billing Status", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showNextBillingDate", label: "Next Billing", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showMrr", label: "MRR", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        // Resource Limits
        { key: "tenants.ui.columns.showMaxUsers", label: "Max Users", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showMaxStorage", label: "Max Storage", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showMaxApiCalls", label: "Max API Calls", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        // Real-time Usage
        { key: "tenants.ui.columns.showCurrentUsers", label: "Current Users", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showStorageUsed", label: "Storage Used", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showApiCallsThisMonth", label: "API Calls (Month)", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        // Metadata
        { key: "tenants.ui.columns.showIndustry", label: "Industry", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showCompanySize", label: "Company Size", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showNotes", label: "Notes", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showTags", label: "Tags", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        // Audit
        { key: "tenants.ui.columns.showLastActivityAt", label: "Last Activity", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showCreatedAt", label: "Created", type: "boolean", defaultValue: true, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showUpdatedAt", label: "Updated", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        { key: "tenants.ui.columns.showCreatedBy", label: "Created By", type: "boolean", defaultValue: false, scope: "platform", group: "Table Columns" },
        // ============================================================
        // DEFAULT TENANT SETTINGS
        // ============================================================
        {
          key: "tenants.defaultPlan",
          label: "Default Plan",
          type: "select",
          description: "Plan assigned to new tenants",
          defaultValue: "free",
          options: [
            { label: "Free", value: "free" },
            { label: "Starter", value: "starter" },
            { label: "Professional", value: "professional" },
            { label: "Enterprise", value: "enterprise" }
          ],
          scope: "platform",
          group: "Defaults"
        },
        {
          key: "tenants.trialDays",
          label: "Trial Period (Days)",
          type: "number",
          description: "Number of days for trial period",
          defaultValue: 14,
          scope: "platform",
          group: "Defaults"
        },
        // ============================================================
        // LIMITS
        // ============================================================
        {
          key: "tenants.defaultMaxUsers",
          label: "Default Max Users",
          type: "number",
          description: "Default user limit for new tenants",
          defaultValue: 5,
          scope: "platform",
          group: "Limits"
        },
        {
          key: "tenants.defaultMaxStorage",
          label: "Default Max Storage (GB)",
          type: "number",
          description: "Default storage limit for new tenants",
          defaultValue: 1,
          scope: "platform",
          group: "Limits"
        },
        {
          key: "tenants.defaultMaxApiCalls",
          label: "Default API Call Limit",
          type: "number",
          description: "Default monthly API call limit",
          defaultValue: 1e3,
          scope: "platform",
          group: "Limits"
        },
        // ============================================================
        // DOMAIN SETTINGS
        // ============================================================
        {
          key: "tenants.allowCustomDomains",
          label: "Allow Custom Domains",
          type: "boolean",
          description: "Tenants can use their own domains",
          defaultValue: true,
          scope: "platform",
          group: "Domains"
        },
        {
          key: "tenants.requireDomainVerification",
          label: "Require Domain Verification",
          type: "boolean",
          description: "Custom domains must be verified via DNS",
          defaultValue: true,
          scope: "platform",
          group: "Domains"
        },
        // ============================================================
        // PROVISIONING
        // ============================================================
        {
          key: "tenants.autoProvisionModules",
          label: "Auto-Provision Modules",
          type: "text",
          description: "Comma-separated list of modules to enable for new tenants",
          defaultValue: "cms,seo",
          scope: "platform",
          group: "Provisioning"
        }
      ]
    };
  }
});

// ../packages/modules-tenants/src/module.config.ts
var moduleConfig3;
var init_module_config3 = __esm({
  "../packages/modules-tenants/src/module.config.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    moduleConfig3 = {
      id: "tenants",
      name: "Tenants",
      description: "Multi-tenant management and provisioning (Platform Admin)",
      longDescription: "Complete multi-tenancy infrastructure with provisioning, billing integration, and usage tracking.",
      icon: "Building2",
      version: "1.0.0",
      category: "core",
      isCore: true,
      features: [
        "Tenant CRUD",
        "Module Assignment",
        "Usage Tracking",
        "Billing Integration",
        "Domain Management"
      ],
      dependencies: ["auth", "users"],
      tags: ["platform", "multitenancy", "tenants"]
    };
  }
});

// ../packages/modules-tenants/src/index.ts
var src_exports4 = {};
__export(src_exports4, {
  moduleConfig: () => moduleConfig3,
  registerTenantsRoutes: () => registerTenantsRoutes,
  tenantsModuleConfig: () => tenantsModuleConfig,
  tenantsSettingsSection: () => tenantsSettingsSection
});
var tenantsModuleConfig;
var init_src5 = __esm({
  "../packages/modules-tenants/src/index.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_src();
    init_tenantsRoutes();
    init_tenantsSettings();
    init_tenantsRoutes();
    init_tenantsSettings();
    init_module_config3();
    tenantsModuleConfig = {
      id: "tenants",
      name: "Tenants",
      version: "1.0.0",
      description: "Multi-tenant management and provisioning",
      category: "core",
      isCore: true,
      features: ["Tenant Provisioning", "Domain Mapping", "Resource Limits", "Status Management"],
      dependencies: ["auth", "users"],
      tags: ["multi-tenancy", "platform", "infrastructure"],
      routes: registerTenantsRoutes,
      menu: {
        label: "Tenants",
        icon: "Building2",
        href: `${ADMIN_ROUTES.TENANTS}`,
        order: 10
      },
      availability: {
        requiresPlatformAdmin: true,
        // Only super admin
        availableForTenants: false,
        defaultEnabled: false
        // Not a tenant-level module
      },
      permissions: [
        "tenants.view",
        "tenants.create",
        "tenants.update",
        "tenants.delete",
        "tenants.suspend",
        "tenants.manage",
        "tenants.modules.manage"
      ],
      requiredPermission: "tenants.view",
      settings: tenantsSettingsSection,
      // Breeze lifecycle hooks
      onProvision: async (tenantId, db) => {
        console.log(`[Tenants] Platform provisioned`);
      }
    };
    moduleRegistry.register(tenantsModuleConfig);
  }
});

// ../packages/modules-cms/src/index.ts
var src_exports5 = {};
__export(src_exports5, {
  cmsModuleConfig: () => cmsModuleConfig
});
var cmsModuleConfig;
var init_src6 = __esm({
  "../packages/modules-cms/src/index.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_src();
    cmsModuleConfig = {
      id: "cms",
      name: "Content Management",
      version: "1.0.0",
      description: "Create and manage pages, blog posts, and media library",
      category: "features",
      isCore: false,
      features: ["Page Builder", "Blog", "Media Library", "Navigation Menus"],
      dependencies: [],
      tags: ["content", "cms", "publishing"],
      routes: (app2) => {
      },
      menu: {
        label: "CMS",
        icon: "FileText",
        href: "/hpanel/cms",
        order: 40
      },
      availability: {
        requiresPlatformAdmin: false,
        availableForTenants: true,
        defaultEnabled: false
      },
      permissions: [
        "cms.view",
        "cms.create",
        "cms.edit",
        "cms.publish",
        "cms.delete",
        "media.manage"
      ],
      requiredPermission: "cms.view"
    };
    moduleRegistry.register(cmsModuleConfig);
  }
});

// ../packages/modules-crm/src/index.ts
var src_exports6 = {};
__export(src_exports6, {
  crmModuleConfig: () => crmModuleConfig
});
var crmModuleConfig;
var init_src7 = __esm({
  "../packages/modules-crm/src/index.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_src();
    crmModuleConfig = {
      id: "crm",
      name: "Customer Relations",
      version: "1.0.0",
      description: "Manage contacts, leads, and form submissions",
      category: "features",
      isCore: false,
      features: ["Contact Directory", "Lead Tracking", "Form Builder", "Submission Exports"],
      dependencies: [],
      tags: ["marketing", "crm", "contacts"],
      routes: (app2) => {
      },
      menu: {
        label: "CRM",
        icon: "Contact",
        href: "/hpanel/crm",
        order: 50
      },
      availability: {
        requiresPlatformAdmin: false,
        availableForTenants: true,
        defaultEnabled: false
      },
      permissions: [
        "crm.view",
        "crm.contacts.manage",
        "crm.leads.manage",
        "crm.forms.view",
        "crm.forms.manage"
      ],
      requiredPermission: "crm.view"
    };
    moduleRegistry.register(crmModuleConfig);
  }
});

// ../packages/modules-seo/src/index.ts
var src_exports7 = {};
__export(src_exports7, {
  seoModuleConfig: () => seoModuleConfig
});
var seoModuleConfig;
var init_src8 = __esm({
  "../packages/modules-seo/src/index.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_src();
    seoModuleConfig = {
      id: "seo",
      name: "SEO Optimizer",
      version: "1.0.0",
      description: "Optimize content for search engines, manage sitemaps and robots.txt",
      category: "features",
      isCore: false,
      features: ["Sitemap Generation", "Robots.txt Editor", "SEO Audit", "Meta Tag Management"],
      dependencies: ["cms"],
      tags: ["seo", "marketing", "search"],
      routes: (app2) => {
      },
      menu: {
        label: "SEO",
        icon: "Search",
        href: "/hpanel/seo",
        order: 60
      },
      availability: {
        requiresPlatformAdmin: false,
        availableForTenants: true,
        defaultEnabled: false
      },
      permissions: [
        "seo.view",
        "seo.settings.manage",
        "seo.audit",
        "seo.redirects.manage"
      ],
      requiredPermission: "seo.view"
    };
    moduleRegistry.register(seoModuleConfig);
  }
});

// .wrangler/tmp/bundle-w0JdTD/middleware-loader.entry.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// .wrangler/tmp/bundle-w0JdTD/middleware-insertion-facade.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// src/index.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_dist();

// ../node_modules/hono/dist/middleware/cors/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var cors = /* @__PURE__ */ __name((options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// src/middleware/tenant-resolver.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
async function tenantResolverMiddleware(c, next) {
  const host = c.req.header("host") || "";
  const domain = host.split(":")[0];
  const queryId = c.req.query("tenant") || c.req.query("tenantId");
  let tenant = null;
  let explicitlyRequested = false;
  if (queryId) {
    explicitlyRequested = true;
    const db = c.env.DB;
    const result = await db.prepare(`
            SELECT t.* FROM tenants t
            LEFT JOIN tenant_domains td ON t.id = td.tenant_id
            WHERE t.id = ? OR t.slug = ? OR td.domain = ?
            LIMIT 1
        `).bind(queryId, queryId, queryId).first();
    if (result) {
      tenant = {
        ...result,
        config: typeof result.config === "string" ? JSON.parse(result.config) : result.config
      };
    }
  } else {
    const kv = c.env.TENANT_MANIFESTS;
    tenant = await kv.get(`tenant:${domain}`, { type: "json" });
    if (!tenant) {
      const db = c.env.DB;
      const result = await db.prepare(`
                SELECT t.* FROM tenants t
                JOIN tenant_domains td ON t.id = td.tenant_id
                WHERE td.domain = ?
            `).bind(domain).first();
      if (result) {
        tenant = {
          ...result,
          config: typeof result.config === "string" ? JSON.parse(result.config) : result.config
        };
        await kv.put(`tenant:${domain}`, JSON.stringify(tenant));
      }
    }
  }
  if (tenant) {
    c.set("tenant", tenant);
    c.set("tenantId", tenant.id);
  } else if (explicitlyRequested) {
    c.set("tenantId", "invalid");
  } else {
    const db = c.env.DB;
    const result = await db.prepare("SELECT * FROM tenants WHERE id = 'default'").first();
    if (result) {
      const defaultTenant = {
        ...result,
        config: typeof result.config === "string" ? JSON.parse(result.config) : result.config
      };
      c.set("tenant", defaultTenant);
      c.set("tenantId", "default");
    } else {
      c.set("tenantId", "default");
    }
  }
  await next();
}
__name(tenantResolverMiddleware, "tenantResolverMiddleware");

// src/middleware/admin-auth.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
async function adminAuthMiddleware(c, next) {
  const adminKey = c.req.header("x-admin-key");
  const masterKey = c.env.ADMIN_KEY;
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (adminKey && adminKey === masterKey) {
    c.set("isAdmin", true);
    c.set("user", { role: "super-admin", isPlatformAdmin: true });
    return await next();
  }
  if (token) {
    const db = c.env.DB;
    try {
      const session = await db.prepare(`
                SELECT s.user_id, s.tenant_id, u.role, u.username
                FROM sessions s
                JOIN users u ON s.user_id = u.id
                WHERE s.access_token = ? AND s.revoked_at IS NULL AND s.expires_at > ?
            `).bind(token, Math.floor(Date.now() / 1e3)).first();
      if (session) {
        c.set("isAdmin", true);
        c.set("user", {
          id: session.user_id,
          username: session.username,
          role: session.role,
          tenantId: session.tenant_id,
          isPlatformAdmin: session.role === "super-admin"
        });
        return await next();
      }
    } catch (err) {
      console.error("Auth middleware DB error:", err);
    }
  }
  c.set("isAdmin", false);
  c.set("user", null);
  await next();
}
__name(adminAuthMiddleware, "adminAuthMiddleware");

// src/routes/v1/resolver.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_dist();
var resolver = new Hono2();
resolver.get("/resolve-tenant", (c) => {
  const tenantId = c.get("tenantId");
  const tenant = c.get("tenant");
  if (tenantId === "invalid") {
    return c.json({ valid: false, error: "Tenant not found" }, 404);
  }
  if (tenant) {
    return c.json({
      valid: true,
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      domain: tenant.domain
    });
  }
  if (tenantId === "default") {
    return c.json({
      valid: true,
      id: "default",
      slug: "default",
      name: "Default Tenant",
      domain: "default"
    });
  }
  return c.json({ valid: false }, 404);
});
var resolver_default = resolver;

// src/routes/v1/settings.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_dist();
init_src();
var settings = new Hono2();
settings.get("/sections/:moduleId", async (c) => {
  const db = c.env.DB;
  const moduleId = c.req.param("moduleId");
  const tenantId = c.req.query("tenantId") || "default";
  const section = settingsRegistry.get(moduleId);
  if (!section) {
    return c.json({ error: "Settings section not found" }, 404);
  }
  try {
    const results = await db.prepare(`
            SELECT key, value FROM settings 
            WHERE tenant_id = ? AND module_id = ?
        `).bind(tenantId, moduleId).all();
    const values = {};
    for (const row of results.results || []) {
      try {
        const val = row.value;
        values[row.key] = val && (val.startsWith("{") || val.startsWith("[") || val === "true" || val === "false") ? JSON.parse(val) : val;
      } catch (e) {
        values[row.key] = row.value;
      }
    }
    const mergedValues = {};
    section.fields.forEach((field) => {
      mergedValues[field.key] = values[field.key] !== void 0 ? values[field.key] : field.defaultValue;
    });
    return c.json({
      ...section,
      values: mergedValues
    });
  } catch (error) {
    console.error("Failed to get settings:", error);
    return c.json(section);
  }
});
settings.put("/", async (c) => {
  const db = c.env.DB;
  const payload = await c.req.json();
  const { tenantId, moduleId, settings: newSettings } = payload;
  if (!moduleId || !newSettings) {
    return c.json({ error: "moduleId and settings are required" }, 400);
  }
  const tId = tenantId || "default";
  const now = Math.floor(Date.now() / 1e3);
  try {
    const statements = [];
    for (const [key, value] of Object.entries(newSettings)) {
      const jsonValue = typeof value === "string" ? value : JSON.stringify(value);
      statements.push(
        db.prepare(`
                    INSERT INTO settings (id, tenant_id, module_id, key, value, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON CONFLICT(tenant_id, module_id, key) DO UPDATE SET
                    value = EXCLUDED.value, updated_at = EXCLUDED.updated_at
                `).bind(
          crypto.randomUUID(),
          tId,
          moduleId,
          key,
          jsonValue,
          now
        )
      );
    }
    if (statements.length > 0) {
      await db.batch(statements);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error("Failed to save settings:", error);
    return c.json({ error: "Failed to save settings", message: error.message }, 500);
  }
});
var settings_default = settings;

// src/routes/v1/modules.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_dist();
init_src();
function registerModulesRoutes(app2) {
  const modules = new Hono2();
  const getModules = /* @__PURE__ */ __name(() => moduleRegistry.getAll().filter((m) => !m.isInfrastructure), "getModules");
  modules.get("/", async (c) => {
    const db = c.env.DB;
    try {
      const stats = await db.prepare(`
        SELECT module_id, COUNT(*) as tenant_count 
        FROM module_status 
        WHERE enabled = 1 
        GROUP BY module_id
      `).all();
      const statsByModule = {};
      for (const row of stats.results || []) {
        statsByModule[row.module_id] = row.tenant_count;
      }
      const tenantCount = await db.prepare("SELECT COUNT(*) as count FROM tenants").first();
      const modulesWithStats = getModules().map((mod) => ({
        ...mod,
        tenantsEnabled: statsByModule[mod.id] || 0,
        totalTenants: tenantCount?.count || 0,
        platformEnabled: mod.isCore || (statsByModule[mod.id] || 0) > 0,
        status: mod.isCore ? "enabled" : statsByModule[mod.id] > 0 ? "enabled" : "available"
      }));
      return c.json(modulesWithStats);
    } catch (error) {
      console.error("Failed to get modules:", error);
      return c.json(getModules().map((m) => ({ ...m, tenantsEnabled: 0, platformEnabled: m.isCore })));
    }
  });
  modules.get("/stats", async (c) => {
    const db = c.env.DB;
    try {
      const enabledCount = await db.prepare(`
        SELECT COUNT(DISTINCT module_id) as count 
        FROM module_status 
        WHERE enabled = 1
      `).first();
      return c.json({
        total: getModules().length,
        core: getModules().filter((m) => m.isCore).length,
        enabled: enabledCount?.count || 0,
        available: getModules().filter((m) => !m.isCore).length
      });
    } catch (error) {
      return c.json({ total: getModules().length, core: 3, enabled: 0, available: 4 });
    }
  });
  modules.get("/menu", async (c) => {
    const db = c.env.DB;
    const tenantId = c.req.query("tenantId");
    const user = c.get("user");
    const isAdmin = c.get("isAdmin");
    const isSuperAdmin = isAdmin === true;
    const tenantPlan = "pro";
    console.log("[Menu] isAdmin:", isAdmin, "user:", user?.role, "isSuperAdmin:", isSuperAdmin);
    try {
      let enabledModules = [];
      if (tenantId && tenantId !== "default") {
        const results = await db.prepare(`
                    SELECT module_id FROM module_status 
                    WHERE tenant_id = ? AND enabled = 1
                `).bind(tenantId).all();
        enabledModules = (results.results || []).map((r) => r.module_id);
      }
      const menuItems = await moduleRegistry.getSidebarMenu({
        isSuperAdmin,
        tenantPlan,
        enabledModules
      });
      return c.json(menuItems);
    } catch (error) {
      console.error("Failed to get module menu:", error);
      return c.json([
        { label: "Dashboard", icon: "LayoutDashboard", href: "/hpanel", order: 0 },
        { label: "Modules", icon: "Package", href: "/hpanel/modules", order: 5 }
      ]);
    }
  });
  modules.get("/status", async (c) => {
    const db = c.env.DB;
    const tenantId = c.req.query("tenantId");
    const moduleId = c.req.query("moduleId");
    try {
      let query = "SELECT module_id, tenant_id, enabled, enabled_at, enabled_by FROM module_status";
      const params = [];
      if (tenantId) {
        query += " WHERE tenant_id = ?";
        params.push(tenantId);
      } else if (moduleId) {
        query += " WHERE module_id = ?";
        params.push(moduleId);
      }
      const statuses = await db.prepare(query).bind(...params).all();
      return c.json(statuses.results);
    } catch (error) {
      return c.json([]);
    }
  });
  modules.get("/:id", async (c) => {
    const db = c.env.DB;
    const moduleId = c.req.param("id");
    const module = getModules().find((m) => m.id === moduleId);
    if (!module) {
      return c.json({ error: "Module not found" }, 404);
    }
    try {
      const stats = await db.prepare(`
        SELECT COUNT(*) as enabled_count 
        FROM module_status 
        WHERE module_id = ? AND enabled = 1
      `).bind(moduleId).first();
      const tenantStatuses = await db.prepare(`
        SELECT t.id, t.name, t.slug, ms.enabled, ms.enabled_at, ms.enabled_by
        FROM tenants t
        LEFT JOIN module_status ms ON t.id = ms.tenant_id AND ms.module_id = ?
      `).bind(moduleId).all();
      return c.json({
        ...module,
        tenantsEnabled: stats?.enabled_count || 0,
        tenants: tenantStatuses.results
      });
    } catch (error) {
      return c.json({ ...module, tenantsEnabled: 0, tenants: [] });
    }
  });
  modules.post("/:id/enable", async (c) => {
    const db = c.env.DB;
    const moduleId = c.req.param("id");
    const { enabledBy } = await c.req.json();
    try {
      const tenants = await db.prepare("SELECT id FROM tenants").all();
      for (const tenant of tenants.results || []) {
        await db.prepare(`
          INSERT INTO module_status (id, module_id, tenant_id, enabled, enabled_at, enabled_by, created_at)
          VALUES (?, ?, ?, 1, ?, ?, ?)
          ON CONFLICT(module_id, tenant_id) DO UPDATE SET enabled = 1, enabled_at = ?, enabled_by = ?
        `).bind(
          crypto.randomUUID(),
          moduleId,
          tenant.id,
          Math.floor(Date.now() / 1e3),
          enabledBy || "admin",
          Math.floor(Date.now() / 1e3),
          Math.floor(Date.now() / 1e3),
          enabledBy || "admin"
        ).run();
      }
      return c.json({ success: true, tenantsEnabled: tenants.results?.length || 0 });
    } catch (error) {
      return c.json({ error: "Failed to enable module", message: error.message }, 500);
    }
  });
  modules.post("/:id/disable", async (c) => {
    const db = c.env.DB;
    const moduleId = c.req.param("id");
    try {
      await db.prepare(`
        UPDATE module_status SET enabled = 0, updated_at = ?
        WHERE module_id = ?
      `).bind(Math.floor(Date.now() / 1e3), moduleId).run();
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: "Failed to disable module", message: error.message }, 500);
    }
  });
  modules.get("/:id/tenants", async (c) => {
    const db = c.env.DB;
    const moduleId = c.req.param("id");
    try {
      const tenants = await db.prepare(`
        SELECT t.id, t.name, t.slug, t.status,
               ms.enabled, ms.enabled_at, ms.enabled_by
        FROM tenants t
        LEFT JOIN module_status ms ON t.id = ms.tenant_id AND ms.module_id = ?
        ORDER BY t.name
      `).bind(moduleId).all();
      return c.json(tenants.results);
    } catch (error) {
      return c.json([]);
    }
  });
  app2.route("/api/v1/modules", modules);
}
__name(registerModulesRoutes, "registerModulesRoutes");

// src/lib/bootstrap.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_src();
async function bootstrapBackend() {
  console.log("\n\u{1F680} Bootstrapping Modular Platform...");
  const { registerCoreModules: registerCoreModules2 } = await Promise.resolve().then(() => (init_src2(), src_exports));
  registerCoreModules2();
  await Promise.resolve().then(() => (init_src3(), src_exports2));
  await Promise.resolve().then(() => (init_src4(), src_exports3));
  await Promise.resolve().then(() => (init_src5(), src_exports4));
  await Promise.resolve().then(() => (init_src6(), src_exports5));
  await Promise.resolve().then(() => (init_src7(), src_exports6));
  await Promise.resolve().then(() => (init_src8(), src_exports7));
  const modules = moduleRegistry.getAll();
  console.log(`\u{1F4E6} Registered ${modules.length} foundation modules:`);
  modules.forEach((m) => console.log(`  - ${m.name} (${m.id}) v${m.version}`));
  const modulesInOrder = moduleRegistry.getInLoadOrder();
  console.log(`\u2705 System ready. Load order: ${modulesInOrder.map((m) => m.id).join(" -> ")}
`);
  return true;
}
__name(bootstrapBackend, "bootstrapBackend");

// src/lib/ModuleLoader.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_src();
init_src3();
init_src4();
init_src5();
function loadModuleRoutes(app2) {
  const modules = moduleRegistry.getInLoadOrder();
  console.log(`
\u{1F4E6} Loading ${modules.length} modules...`);
  for (const module of modules) {
    try {
      module.routes(app2);
      console.log(`  \u2713 ${module.name} routes mounted`);
    } catch (error) {
      console.error(`  \u2717 Failed to load ${module.name}:`, error);
    }
  }
  console.log(`
\u2705 All modules loaded
`);
}
__name(loadModuleRoutes, "loadModuleRoutes");

// src/index.ts
var app = new Hono2();
app.use("*", cors());
app.use("*", tenantResolverMiddleware);
app.use("*", adminAuthMiddleware);
app.route("/api/v1/resolver", resolver_default);
app.route("/api/v1/settings", settings_default);
registerModulesRoutes(app);
bootstrapBackend().then(() => {
  loadModuleRoutes(app);
}).catch((err) => {
  console.error("Failed to bootstrap backend:", err);
});
app.get("/health", (c) => c.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() }));
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
});
var src_default = app;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-w0JdTD/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-w0JdTD/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
