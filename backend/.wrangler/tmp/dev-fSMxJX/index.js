var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-lHjXsd/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
var init_strip_cf_connecting_ip_header = __esm({
  ".wrangler/tmp/bundle-lHjXsd/strip-cf-connecting-ip-header.js"() {
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

// ../node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
function notImplementedAsync(name) {
  const fn = notImplemented(name);
  fn.__promisify__ = () => notImplemented(name + ".__promisify__");
  fn.native = fn;
  return fn;
}
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedAsync, "notImplementedAsync");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    __name(PerformanceEntry, "PerformanceEntry");
    PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    }, "PerformanceMark");
    PerformanceMeasure = class extends PerformanceEntry {
      entryType = "measure";
    };
    __name(PerformanceMeasure, "PerformanceMeasure");
    PerformanceResourceTiming = class extends PerformanceEntry {
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    __name(PerformanceResourceTiming, "PerformanceResourceTiming");
    PerformanceObserverEntryList = class {
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    __name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
    Performance = class {
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    __name(Performance, "Performance");
    PerformanceObserver = class {
      __unenv__ = true;
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    __name(PerformanceObserver, "PerformanceObserver");
    __publicField(PerformanceObserver, "supportedEntryTypes", []);
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// ../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream;
var init_read_stream = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class extends Socket {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      isRaw = false;
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
      isTTY = false;
    };
    __name(ReadStream, "ReadStream");
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream;
var init_write_stream = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class extends Socket2 {
      fd;
      constructor(fd) {
        super();
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      columns = 80;
      rows = 24;
      isTTY = false;
    };
    __name(WriteStream, "WriteStream");
  }
});

// ../node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    Process = class extends EventEmitter {
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return "";
      }
      get versions() {
        return {};
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: () => 0 });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
    __name(Process, "Process");
  }
});

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, exit, platform, nextTick, unenvProcess, abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, finalization, features, getActiveResourcesInfo, getMaxListeners, hrtime3, kill, listeners, listenerCount, memoryUsage, on, off, once, pid, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, throwDeprecation, traceDeprecation, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert2, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding, _process, process_default;
var init_process2 = __esm({
  "../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    ({ exit, platform, nextTick } = getBuiltinModule(
      "node:process"
    ));
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      nextTick
    });
    ({
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      finalization,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      on,
      off,
      once,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
      return (context2, next) => {
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
            context2.req.routeIndex = i;
          } else {
            handler = i === middleware.length && next || void 0;
          }
          if (handler) {
            try {
              res = await handler(context2, () => dispatch(i + 1));
            } catch (err) {
              if (err instanceof Error && onError) {
                context2.error = err;
                res = await onError(err, context2);
                isError = true;
              } else {
                throw err;
              }
            }
          } else {
            if (context2.finalized === false && onNotFound) {
              res = await onNotFound(context2);
            }
          }
          if (res && (context2.finalized === false || isError)) {
            context2.res = res;
          }
          return context2;
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
  }
});

// ../node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT;
var init_constants = __esm({
  "../node_modules/hono/dist/request/constants.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
        return this.#cachedBody("text").then((text2) => JSON.parse(text2));
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context2, buffer) => {
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
      const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
        (res) => Promise.all(
          res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
      text = (text2, arg, headers) => {
        return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text2) : this.#newResponse(
          text2,
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    COMPOSED_HANDLER = "__COMPOSED_HANDLER";
  }
});

// ../node_modules/hono/dist/hono-base.js
var notFoundHandler, errorHandler, Hono;
var init_hono_base = __esm({
  "../node_modules/hono/dist/hono-base.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
      #dispatch(request, executionCtx, env2, method) {
        if (method === "HEAD") {
          return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
        }
        const path = this.getPath(request, { env: env2 });
        const matchResult = this.router.match(method, path);
        const c = new Context(request, {
          path,
          matchResult,
          env: env2,
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
            const context2 = await composed(c);
            if (!context2.finalized) {
              throw new Error(
                "Context is not finalized. Did you forget to return a Response object or `await next()`?"
              );
            }
            return context2.res;
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
      insert(tokens, index, paramMap, context2, pathErrorCheckOnly) {
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
              node.#varIndex = context2.varIndex++;
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
        node.insert(restTokens, index, paramMap, context2, pathErrorCheckOnly);
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_router3();
  }
});

// ../node_modules/hono/dist/router/trie-router/node.js
var emptyParams, Node2;
var init_node2 = __esm({
  "../node_modules/hono/dist/router/trie-router/node.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_router4();
  }
});

// ../node_modules/hono/dist/hono.js
var Hono2;
var init_hono = __esm({
  "../node_modules/hono/dist/hono.js"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
      getAvailableSections(context2) {
        return this.getAll().filter((section) => {
          if (!section.availableForTenants && !context2.isSuperAdmin) {
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_SettingsRegistry();
    ModuleRegistryClass = class {
      modules = /* @__PURE__ */ new Map();
      loadOrder = [];
      /**
       * Register a module with the registry
       * @throws Error if module already registered or dependencies missing
       */
      register(config2) {
        if (this.modules.has(config2.id)) {
          console.warn(`Module ${config2.id} is already registered, skipping.`);
          return;
        }
        if (config2.dependencies) {
          for (const dep of config2.dependencies) {
            if (!this.modules.has(dep)) {
              throw new Error(
                `Module "${config2.id}" depends on "${dep}" which is not registered. Ensure ${dep} is imported before ${config2.id}.`
              );
            }
          }
        }
        this.modules.set(config2.id, config2);
        this.loadOrder.push(config2.id);
        if (config2.settings) {
          settingsRegistry.register(config2.settings);
        }
        console.log(`\u2713 Module registered: ${config2.name} (${config2.id}) v${config2.version}`);
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
      getAvailableModules(context2) {
        return this.getAll().filter((module) => this.isModuleAvailable(module, context2)).sort((a, b) => a.menu.order - b.menu.order);
      }
      /**
       * Get sidebar menu items for current context
       */
      async getSidebarMenu(context2) {
        const availableModules = this.getAvailableModules(context2);
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
      isModuleAvailable(module, context2) {
        const { availability } = module;
        if (availability.requiresPlatformAdmin && !context2.isSuperAdmin) {
          return false;
        }
        if (availability.enterpriseOnly && context2.tenantPlan !== "enterprise") {
          return false;
        }
        if (module.isCore || availability.defaultEnabled) {
          return true;
        }
        if (context2.enabledModules && context2.enabledModules.includes(module.id)) {
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_types();
    init_ModuleRegistry();
    init_SettingsRegistry();
    init_EventBus();
  }
});

// src/lib/migrations-manifest.json
var require_migrations_manifest = __commonJS({
  "src/lib/migrations-manifest.json"(exports, module) {
    module.exports = {
      migrations: [
        "0005_modular_architecture.sql",
        "0006_schema_sync.sql",
        "0007_user_enhancements.sql",
        "001_initial.sql",
        "002_auth.sql",
        "003_add_deleted_at.sql",
        "004_user_schema_updates.sql"
      ],
      generated: "2026-01-10T10:06:04.402Z"
    };
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/fs/promises.mjs
var access, copyFile, cp, open, opendir, rename, truncate, rm, rmdir, mkdir, readdir, readlink, symlink, lstat, stat, link, unlink, chmod, lchmod, lchown, chown, utimes, lutimes, realpath, mkdtemp, writeFile, appendFile, readFile, watch, statfs, glob;
var init_promises = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/fs/promises.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    access = /* @__PURE__ */ notImplemented("fs.access");
    copyFile = /* @__PURE__ */ notImplemented("fs.copyFile");
    cp = /* @__PURE__ */ notImplemented("fs.cp");
    open = /* @__PURE__ */ notImplemented("fs.open");
    opendir = /* @__PURE__ */ notImplemented("fs.opendir");
    rename = /* @__PURE__ */ notImplemented("fs.rename");
    truncate = /* @__PURE__ */ notImplemented("fs.truncate");
    rm = /* @__PURE__ */ notImplemented("fs.rm");
    rmdir = /* @__PURE__ */ notImplemented("fs.rmdir");
    mkdir = /* @__PURE__ */ notImplemented("fs.mkdir");
    readdir = /* @__PURE__ */ notImplemented("fs.readdir");
    readlink = /* @__PURE__ */ notImplemented("fs.readlink");
    symlink = /* @__PURE__ */ notImplemented("fs.symlink");
    lstat = /* @__PURE__ */ notImplemented("fs.lstat");
    stat = /* @__PURE__ */ notImplemented("fs.stat");
    link = /* @__PURE__ */ notImplemented("fs.link");
    unlink = /* @__PURE__ */ notImplemented("fs.unlink");
    chmod = /* @__PURE__ */ notImplemented("fs.chmod");
    lchmod = /* @__PURE__ */ notImplemented("fs.lchmod");
    lchown = /* @__PURE__ */ notImplemented("fs.lchown");
    chown = /* @__PURE__ */ notImplemented("fs.chown");
    utimes = /* @__PURE__ */ notImplemented("fs.utimes");
    lutimes = /* @__PURE__ */ notImplemented("fs.lutimes");
    realpath = /* @__PURE__ */ notImplemented("fs.realpath");
    mkdtemp = /* @__PURE__ */ notImplemented("fs.mkdtemp");
    writeFile = /* @__PURE__ */ notImplemented("fs.writeFile");
    appendFile = /* @__PURE__ */ notImplemented("fs.appendFile");
    readFile = /* @__PURE__ */ notImplemented("fs.readFile");
    watch = /* @__PURE__ */ notImplemented("fs.watch");
    statfs = /* @__PURE__ */ notImplemented("fs.statfs");
    glob = /* @__PURE__ */ notImplemented("fs.glob");
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/fs/constants.mjs
var constants_exports = {};
__export(constants_exports, {
  COPYFILE_EXCL: () => COPYFILE_EXCL,
  COPYFILE_FICLONE: () => COPYFILE_FICLONE,
  COPYFILE_FICLONE_FORCE: () => COPYFILE_FICLONE_FORCE,
  EXTENSIONLESS_FORMAT_JAVASCRIPT: () => EXTENSIONLESS_FORMAT_JAVASCRIPT,
  EXTENSIONLESS_FORMAT_WASM: () => EXTENSIONLESS_FORMAT_WASM,
  F_OK: () => F_OK,
  O_APPEND: () => O_APPEND,
  O_CREAT: () => O_CREAT,
  O_DIRECT: () => O_DIRECT,
  O_DIRECTORY: () => O_DIRECTORY,
  O_DSYNC: () => O_DSYNC,
  O_EXCL: () => O_EXCL,
  O_NOATIME: () => O_NOATIME,
  O_NOCTTY: () => O_NOCTTY,
  O_NOFOLLOW: () => O_NOFOLLOW,
  O_NONBLOCK: () => O_NONBLOCK,
  O_RDONLY: () => O_RDONLY,
  O_RDWR: () => O_RDWR,
  O_SYNC: () => O_SYNC,
  O_TRUNC: () => O_TRUNC,
  O_WRONLY: () => O_WRONLY,
  R_OK: () => R_OK,
  S_IFBLK: () => S_IFBLK,
  S_IFCHR: () => S_IFCHR,
  S_IFDIR: () => S_IFDIR,
  S_IFIFO: () => S_IFIFO,
  S_IFLNK: () => S_IFLNK,
  S_IFMT: () => S_IFMT,
  S_IFREG: () => S_IFREG,
  S_IFSOCK: () => S_IFSOCK,
  S_IRGRP: () => S_IRGRP,
  S_IROTH: () => S_IROTH,
  S_IRUSR: () => S_IRUSR,
  S_IRWXG: () => S_IRWXG,
  S_IRWXO: () => S_IRWXO,
  S_IRWXU: () => S_IRWXU,
  S_IWGRP: () => S_IWGRP,
  S_IWOTH: () => S_IWOTH,
  S_IWUSR: () => S_IWUSR,
  S_IXGRP: () => S_IXGRP,
  S_IXOTH: () => S_IXOTH,
  S_IXUSR: () => S_IXUSR,
  UV_DIRENT_BLOCK: () => UV_DIRENT_BLOCK,
  UV_DIRENT_CHAR: () => UV_DIRENT_CHAR,
  UV_DIRENT_DIR: () => UV_DIRENT_DIR,
  UV_DIRENT_FIFO: () => UV_DIRENT_FIFO,
  UV_DIRENT_FILE: () => UV_DIRENT_FILE,
  UV_DIRENT_LINK: () => UV_DIRENT_LINK,
  UV_DIRENT_SOCKET: () => UV_DIRENT_SOCKET,
  UV_DIRENT_UNKNOWN: () => UV_DIRENT_UNKNOWN,
  UV_FS_COPYFILE_EXCL: () => UV_FS_COPYFILE_EXCL,
  UV_FS_COPYFILE_FICLONE: () => UV_FS_COPYFILE_FICLONE,
  UV_FS_COPYFILE_FICLONE_FORCE: () => UV_FS_COPYFILE_FICLONE_FORCE,
  UV_FS_O_FILEMAP: () => UV_FS_O_FILEMAP,
  UV_FS_SYMLINK_DIR: () => UV_FS_SYMLINK_DIR,
  UV_FS_SYMLINK_JUNCTION: () => UV_FS_SYMLINK_JUNCTION,
  W_OK: () => W_OK,
  X_OK: () => X_OK
});
var UV_FS_SYMLINK_DIR, UV_FS_SYMLINK_JUNCTION, O_RDONLY, O_WRONLY, O_RDWR, UV_DIRENT_UNKNOWN, UV_DIRENT_FILE, UV_DIRENT_DIR, UV_DIRENT_LINK, UV_DIRENT_FIFO, UV_DIRENT_SOCKET, UV_DIRENT_CHAR, UV_DIRENT_BLOCK, EXTENSIONLESS_FORMAT_JAVASCRIPT, EXTENSIONLESS_FORMAT_WASM, S_IFMT, S_IFREG, S_IFDIR, S_IFCHR, S_IFBLK, S_IFIFO, S_IFLNK, S_IFSOCK, O_CREAT, O_EXCL, UV_FS_O_FILEMAP, O_NOCTTY, O_TRUNC, O_APPEND, O_DIRECTORY, O_NOATIME, O_NOFOLLOW, O_SYNC, O_DSYNC, O_DIRECT, O_NONBLOCK, S_IRWXU, S_IRUSR, S_IWUSR, S_IXUSR, S_IRWXG, S_IRGRP, S_IWGRP, S_IXGRP, S_IRWXO, S_IROTH, S_IWOTH, S_IXOTH, F_OK, R_OK, W_OK, X_OK, UV_FS_COPYFILE_EXCL, COPYFILE_EXCL, UV_FS_COPYFILE_FICLONE, COPYFILE_FICLONE, UV_FS_COPYFILE_FICLONE_FORCE, COPYFILE_FICLONE_FORCE;
var init_constants3 = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/fs/constants.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    UV_FS_SYMLINK_DIR = 1;
    UV_FS_SYMLINK_JUNCTION = 2;
    O_RDONLY = 0;
    O_WRONLY = 1;
    O_RDWR = 2;
    UV_DIRENT_UNKNOWN = 0;
    UV_DIRENT_FILE = 1;
    UV_DIRENT_DIR = 2;
    UV_DIRENT_LINK = 3;
    UV_DIRENT_FIFO = 4;
    UV_DIRENT_SOCKET = 5;
    UV_DIRENT_CHAR = 6;
    UV_DIRENT_BLOCK = 7;
    EXTENSIONLESS_FORMAT_JAVASCRIPT = 0;
    EXTENSIONLESS_FORMAT_WASM = 1;
    S_IFMT = 61440;
    S_IFREG = 32768;
    S_IFDIR = 16384;
    S_IFCHR = 8192;
    S_IFBLK = 24576;
    S_IFIFO = 4096;
    S_IFLNK = 40960;
    S_IFSOCK = 49152;
    O_CREAT = 64;
    O_EXCL = 128;
    UV_FS_O_FILEMAP = 0;
    O_NOCTTY = 256;
    O_TRUNC = 512;
    O_APPEND = 1024;
    O_DIRECTORY = 65536;
    O_NOATIME = 262144;
    O_NOFOLLOW = 131072;
    O_SYNC = 1052672;
    O_DSYNC = 4096;
    O_DIRECT = 16384;
    O_NONBLOCK = 2048;
    S_IRWXU = 448;
    S_IRUSR = 256;
    S_IWUSR = 128;
    S_IXUSR = 64;
    S_IRWXG = 56;
    S_IRGRP = 32;
    S_IWGRP = 16;
    S_IXGRP = 8;
    S_IRWXO = 7;
    S_IROTH = 4;
    S_IWOTH = 2;
    S_IXOTH = 1;
    F_OK = 0;
    R_OK = 4;
    W_OK = 2;
    X_OK = 1;
    UV_FS_COPYFILE_EXCL = 1;
    COPYFILE_EXCL = 1;
    UV_FS_COPYFILE_FICLONE = 2;
    COPYFILE_FICLONE = 2;
    UV_FS_COPYFILE_FICLONE_FORCE = 4;
    COPYFILE_FICLONE_FORCE = 4;
  }
});

// ../node_modules/unenv/dist/runtime/node/fs/promises.mjs
var promises_default;
var init_promises2 = __esm({
  "../node_modules/unenv/dist/runtime/node/fs/promises.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_promises();
    init_constants3();
    init_promises();
    promises_default = {
      constants: constants_exports,
      access,
      appendFile,
      chmod,
      chown,
      copyFile,
      cp,
      glob,
      lchmod,
      lchown,
      link,
      lstat,
      lutimes,
      mkdir,
      mkdtemp,
      open,
      opendir,
      readFile,
      readdir,
      readlink,
      realpath,
      rename,
      rm,
      rmdir,
      stat,
      statfs,
      symlink,
      truncate,
      unlink,
      utimes,
      watch,
      writeFile
    };
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/fs/classes.mjs
var Dir, Dirent, Stats, ReadStream2, WriteStream2, FileReadStream, FileWriteStream;
var init_classes = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/fs/classes.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    Dir = /* @__PURE__ */ notImplementedClass("fs.Dir");
    Dirent = /* @__PURE__ */ notImplementedClass("fs.Dirent");
    Stats = /* @__PURE__ */ notImplementedClass("fs.Stats");
    ReadStream2 = /* @__PURE__ */ notImplementedClass("fs.ReadStream");
    WriteStream2 = /* @__PURE__ */ notImplementedClass("fs.WriteStream");
    FileReadStream = ReadStream2;
    FileWriteStream = WriteStream2;
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/fs/fs.mjs
function callbackify(fn) {
  const fnc = /* @__PURE__ */ __name(function(...args) {
    const cb = args.pop();
    fn().catch((error3) => cb(error3)).then((val) => cb(void 0, val));
  }, "fnc");
  fnc.__promisify__ = fn;
  fnc.native = fnc;
  return fnc;
}
var access2, appendFile2, chown2, chmod2, copyFile2, cp2, lchown2, lchmod2, link2, lstat2, lutimes2, mkdir2, mkdtemp2, realpath2, open2, opendir2, readdir2, readFile2, readlink2, rename2, rm2, rmdir2, stat2, symlink2, truncate2, unlink2, utimes2, writeFile2, statfs2, close, createReadStream, createWriteStream, exists, fchown, fchmod, fdatasync, fstat, fsync, ftruncate, futimes, lstatSync, read, readv, realpathSync, statSync, unwatchFile, watch2, watchFile, write, writev, _toUnixTimestamp, openAsBlob, glob2, appendFileSync, accessSync, chownSync, chmodSync, closeSync, copyFileSync, cpSync, existsSync, fchownSync, fchmodSync, fdatasyncSync, fstatSync, fsyncSync, ftruncateSync, futimesSync, lchownSync, lchmodSync, linkSync, lutimesSync, mkdirSync, mkdtempSync, openSync, opendirSync, readdirSync, readSync, readvSync, readFileSync, readlinkSync, renameSync, rmSync, rmdirSync, symlinkSync, truncateSync, unlinkSync, utimesSync, writeFileSync, writeSync, writevSync, statfsSync, globSync;
var init_fs = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/fs/fs.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    init_promises();
    __name(callbackify, "callbackify");
    access2 = callbackify(access);
    appendFile2 = callbackify(appendFile);
    chown2 = callbackify(chown);
    chmod2 = callbackify(chmod);
    copyFile2 = callbackify(copyFile);
    cp2 = callbackify(cp);
    lchown2 = callbackify(lchown);
    lchmod2 = callbackify(lchmod);
    link2 = callbackify(link);
    lstat2 = callbackify(lstat);
    lutimes2 = callbackify(lutimes);
    mkdir2 = callbackify(mkdir);
    mkdtemp2 = callbackify(mkdtemp);
    realpath2 = callbackify(realpath);
    open2 = callbackify(open);
    opendir2 = callbackify(opendir);
    readdir2 = callbackify(readdir);
    readFile2 = callbackify(readFile);
    readlink2 = callbackify(readlink);
    rename2 = callbackify(rename);
    rm2 = callbackify(rm);
    rmdir2 = callbackify(rmdir);
    stat2 = callbackify(stat);
    symlink2 = callbackify(symlink);
    truncate2 = callbackify(truncate);
    unlink2 = callbackify(unlink);
    utimes2 = callbackify(utimes);
    writeFile2 = callbackify(writeFile);
    statfs2 = callbackify(statfs);
    close = /* @__PURE__ */ notImplementedAsync("fs.close");
    createReadStream = /* @__PURE__ */ notImplementedAsync("fs.createReadStream");
    createWriteStream = /* @__PURE__ */ notImplementedAsync("fs.createWriteStream");
    exists = /* @__PURE__ */ notImplementedAsync("fs.exists");
    fchown = /* @__PURE__ */ notImplementedAsync("fs.fchown");
    fchmod = /* @__PURE__ */ notImplementedAsync("fs.fchmod");
    fdatasync = /* @__PURE__ */ notImplementedAsync("fs.fdatasync");
    fstat = /* @__PURE__ */ notImplementedAsync("fs.fstat");
    fsync = /* @__PURE__ */ notImplementedAsync("fs.fsync");
    ftruncate = /* @__PURE__ */ notImplementedAsync("fs.ftruncate");
    futimes = /* @__PURE__ */ notImplementedAsync("fs.futimes");
    lstatSync = /* @__PURE__ */ notImplementedAsync("fs.lstatSync");
    read = /* @__PURE__ */ notImplementedAsync("fs.read");
    readv = /* @__PURE__ */ notImplementedAsync("fs.readv");
    realpathSync = /* @__PURE__ */ notImplementedAsync("fs.realpathSync");
    statSync = /* @__PURE__ */ notImplementedAsync("fs.statSync");
    unwatchFile = /* @__PURE__ */ notImplementedAsync("fs.unwatchFile");
    watch2 = /* @__PURE__ */ notImplementedAsync("fs.watch");
    watchFile = /* @__PURE__ */ notImplementedAsync("fs.watchFile");
    write = /* @__PURE__ */ notImplementedAsync("fs.write");
    writev = /* @__PURE__ */ notImplementedAsync("fs.writev");
    _toUnixTimestamp = /* @__PURE__ */ notImplementedAsync("fs._toUnixTimestamp");
    openAsBlob = /* @__PURE__ */ notImplementedAsync("fs.openAsBlob");
    glob2 = /* @__PURE__ */ notImplementedAsync("fs.glob");
    appendFileSync = /* @__PURE__ */ notImplemented("fs.appendFileSync");
    accessSync = /* @__PURE__ */ notImplemented("fs.accessSync");
    chownSync = /* @__PURE__ */ notImplemented("fs.chownSync");
    chmodSync = /* @__PURE__ */ notImplemented("fs.chmodSync");
    closeSync = /* @__PURE__ */ notImplemented("fs.closeSync");
    copyFileSync = /* @__PURE__ */ notImplemented("fs.copyFileSync");
    cpSync = /* @__PURE__ */ notImplemented("fs.cpSync");
    existsSync = /* @__PURE__ */ __name(() => false, "existsSync");
    fchownSync = /* @__PURE__ */ notImplemented("fs.fchownSync");
    fchmodSync = /* @__PURE__ */ notImplemented("fs.fchmodSync");
    fdatasyncSync = /* @__PURE__ */ notImplemented("fs.fdatasyncSync");
    fstatSync = /* @__PURE__ */ notImplemented("fs.fstatSync");
    fsyncSync = /* @__PURE__ */ notImplemented("fs.fsyncSync");
    ftruncateSync = /* @__PURE__ */ notImplemented("fs.ftruncateSync");
    futimesSync = /* @__PURE__ */ notImplemented("fs.futimesSync");
    lchownSync = /* @__PURE__ */ notImplemented("fs.lchownSync");
    lchmodSync = /* @__PURE__ */ notImplemented("fs.lchmodSync");
    linkSync = /* @__PURE__ */ notImplemented("fs.linkSync");
    lutimesSync = /* @__PURE__ */ notImplemented("fs.lutimesSync");
    mkdirSync = /* @__PURE__ */ notImplemented("fs.mkdirSync");
    mkdtempSync = /* @__PURE__ */ notImplemented("fs.mkdtempSync");
    openSync = /* @__PURE__ */ notImplemented("fs.openSync");
    opendirSync = /* @__PURE__ */ notImplemented("fs.opendirSync");
    readdirSync = /* @__PURE__ */ notImplemented("fs.readdirSync");
    readSync = /* @__PURE__ */ notImplemented("fs.readSync");
    readvSync = /* @__PURE__ */ notImplemented("fs.readvSync");
    readFileSync = /* @__PURE__ */ notImplemented("fs.readFileSync");
    readlinkSync = /* @__PURE__ */ notImplemented("fs.readlinkSync");
    renameSync = /* @__PURE__ */ notImplemented("fs.renameSync");
    rmSync = /* @__PURE__ */ notImplemented("fs.rmSync");
    rmdirSync = /* @__PURE__ */ notImplemented("fs.rmdirSync");
    symlinkSync = /* @__PURE__ */ notImplemented("fs.symlinkSync");
    truncateSync = /* @__PURE__ */ notImplemented("fs.truncateSync");
    unlinkSync = /* @__PURE__ */ notImplemented("fs.unlinkSync");
    utimesSync = /* @__PURE__ */ notImplemented("fs.utimesSync");
    writeFileSync = /* @__PURE__ */ notImplemented("fs.writeFileSync");
    writeSync = /* @__PURE__ */ notImplemented("fs.writeSync");
    writevSync = /* @__PURE__ */ notImplemented("fs.writevSync");
    statfsSync = /* @__PURE__ */ notImplemented("fs.statfsSync");
    globSync = /* @__PURE__ */ notImplemented("fs.globSync");
  }
});

// ../node_modules/unenv/dist/runtime/node/fs.mjs
var fs_exports = {};
__export(fs_exports, {
  Dir: () => Dir,
  Dirent: () => Dirent,
  F_OK: () => F_OK,
  FileReadStream: () => FileReadStream,
  FileWriteStream: () => FileWriteStream,
  R_OK: () => R_OK,
  ReadStream: () => ReadStream2,
  Stats: () => Stats,
  W_OK: () => W_OK,
  WriteStream: () => WriteStream2,
  X_OK: () => X_OK,
  _toUnixTimestamp: () => _toUnixTimestamp,
  access: () => access2,
  accessSync: () => accessSync,
  appendFile: () => appendFile2,
  appendFileSync: () => appendFileSync,
  chmod: () => chmod2,
  chmodSync: () => chmodSync,
  chown: () => chown2,
  chownSync: () => chownSync,
  close: () => close,
  closeSync: () => closeSync,
  constants: () => constants_exports,
  copyFile: () => copyFile2,
  copyFileSync: () => copyFileSync,
  cp: () => cp2,
  cpSync: () => cpSync,
  createReadStream: () => createReadStream,
  createWriteStream: () => createWriteStream,
  default: () => fs_default,
  exists: () => exists,
  existsSync: () => existsSync,
  fchmod: () => fchmod,
  fchmodSync: () => fchmodSync,
  fchown: () => fchown,
  fchownSync: () => fchownSync,
  fdatasync: () => fdatasync,
  fdatasyncSync: () => fdatasyncSync,
  fstat: () => fstat,
  fstatSync: () => fstatSync,
  fsync: () => fsync,
  fsyncSync: () => fsyncSync,
  ftruncate: () => ftruncate,
  ftruncateSync: () => ftruncateSync,
  futimes: () => futimes,
  futimesSync: () => futimesSync,
  glob: () => glob2,
  globSync: () => globSync,
  lchmod: () => lchmod2,
  lchmodSync: () => lchmodSync,
  lchown: () => lchown2,
  lchownSync: () => lchownSync,
  link: () => link2,
  linkSync: () => linkSync,
  lstat: () => lstat2,
  lstatSync: () => lstatSync,
  lutimes: () => lutimes2,
  lutimesSync: () => lutimesSync,
  mkdir: () => mkdir2,
  mkdirSync: () => mkdirSync,
  mkdtemp: () => mkdtemp2,
  mkdtempSync: () => mkdtempSync,
  open: () => open2,
  openAsBlob: () => openAsBlob,
  openSync: () => openSync,
  opendir: () => opendir2,
  opendirSync: () => opendirSync,
  promises: () => promises_default,
  read: () => read,
  readFile: () => readFile2,
  readFileSync: () => readFileSync,
  readSync: () => readSync,
  readdir: () => readdir2,
  readdirSync: () => readdirSync,
  readlink: () => readlink2,
  readlinkSync: () => readlinkSync,
  readv: () => readv,
  readvSync: () => readvSync,
  realpath: () => realpath2,
  realpathSync: () => realpathSync,
  rename: () => rename2,
  renameSync: () => renameSync,
  rm: () => rm2,
  rmSync: () => rmSync,
  rmdir: () => rmdir2,
  rmdirSync: () => rmdirSync,
  stat: () => stat2,
  statSync: () => statSync,
  statfs: () => statfs2,
  statfsSync: () => statfsSync,
  symlink: () => symlink2,
  symlinkSync: () => symlinkSync,
  truncate: () => truncate2,
  truncateSync: () => truncateSync,
  unlink: () => unlink2,
  unlinkSync: () => unlinkSync,
  unwatchFile: () => unwatchFile,
  utimes: () => utimes2,
  utimesSync: () => utimesSync,
  watch: () => watch2,
  watchFile: () => watchFile,
  write: () => write,
  writeFile: () => writeFile2,
  writeFileSync: () => writeFileSync,
  writeSync: () => writeSync,
  writev: () => writev,
  writevSync: () => writevSync
});
var fs_default;
var init_fs2 = __esm({
  "../node_modules/unenv/dist/runtime/node/fs.mjs"() {
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_promises2();
    init_classes();
    init_fs();
    init_constants3();
    init_constants3();
    init_constants3();
    init_fs();
    init_classes();
    fs_default = {
      F_OK,
      R_OK,
      W_OK,
      X_OK,
      constants: constants_exports,
      promises: promises_default,
      Dir,
      Dirent,
      FileReadStream,
      FileWriteStream,
      ReadStream: ReadStream2,
      Stats,
      WriteStream: WriteStream2,
      _toUnixTimestamp,
      access: access2,
      accessSync,
      appendFile: appendFile2,
      appendFileSync,
      chmod: chmod2,
      chmodSync,
      chown: chown2,
      chownSync,
      close,
      closeSync,
      copyFile: copyFile2,
      copyFileSync,
      cp: cp2,
      cpSync,
      createReadStream,
      createWriteStream,
      exists,
      existsSync,
      fchmod,
      fchmodSync,
      fchown,
      fchownSync,
      fdatasync,
      fdatasyncSync,
      fstat,
      fstatSync,
      fsync,
      fsyncSync,
      ftruncate,
      ftruncateSync,
      futimes,
      futimesSync,
      glob: glob2,
      lchmod: lchmod2,
      globSync,
      lchmodSync,
      lchown: lchown2,
      lchownSync,
      link: link2,
      linkSync,
      lstat: lstat2,
      lstatSync,
      lutimes: lutimes2,
      lutimesSync,
      mkdir: mkdir2,
      mkdirSync,
      mkdtemp: mkdtemp2,
      mkdtempSync,
      open: open2,
      openAsBlob,
      openSync,
      opendir: opendir2,
      opendirSync,
      read,
      readFile: readFile2,
      readFileSync,
      readSync,
      readdir: readdir2,
      readdirSync,
      readlink: readlink2,
      readlinkSync,
      readv,
      readvSync,
      realpath: realpath2,
      realpathSync,
      rename: rename2,
      renameSync,
      rm: rm2,
      rmSync,
      rmdir: rmdir2,
      rmdirSync,
      stat: stat2,
      statSync,
      statfs: statfs2,
      statfsSync,
      symlink: symlink2,
      symlinkSync,
      truncate: truncate2,
      truncateSync,
      unlink: unlink2,
      unlinkSync,
      unwatchFile,
      utimes: utimes2,
      utimesSync,
      watch: watch2,
      watchFile,
      write,
      writeFile: writeFile2,
      writeFileSync,
      writeSync,
      writev,
      writevSync
    };
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    } catch (error3) {
      console.error("Login error:", error3);
      return c.json({ error: "Login failed", message: error3.message }, 500);
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
    } catch (error3) {
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
    } catch (error3) {
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
    } catch (error3) {
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
    } catch (error3) {
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
    } catch (error3) {
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
    } catch (error3) {
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
    } catch (error3) {
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    authSettingsSection = {
      id: "auth",
      label: "Authentication & Security",
      icon: "Shield",
      order: 20,
      availableForTenants: true,
      requiredPermission: "settings.auth.manage",
      fields: [
        // ============================================================
        // GENERAL SETTINGS
        // ============================================================
        {
          key: "auth.allowGuestAccess",
          label: "Allow Guest Access",
          type: "boolean",
          description: "Allow access to public pages without login",
          defaultValue: false,
          scope: "tenant",
          group: "General"
        },
        {
          key: "auth.enableSocialLogin",
          label: "Enable Social Login",
          type: "boolean",
          description: "Allow users to login with Google, GitHub, etc.",
          defaultValue: false,
          scope: "tenant",
          group: "General"
        },
        // ============================================================
        // ADMIN UI (Placeholder - hidden or empty)
        // ============================================================
        // No specific admin UI settings for auth yet
        // ============================================================
        // FRONTEND UI (Login, Registration, etc.)
        // ============================================================
        {
          key: "auth.requireEmailVerification",
          label: "Require Email Verification",
          type: "boolean",
          description: "Users must verify email before accessing the app",
          defaultValue: true,
          scope: "tenant",
          group: "Frontend UI"
        },
        {
          key: "auth.allowSelfRegistration",
          label: "Allow Self Registration",
          type: "boolean",
          description: "Users can register without an invitation",
          defaultValue: false,
          scope: "tenant",
          group: "Frontend UI"
        },
        {
          key: "auth.allowMagicLink",
          label: "Enable Magic Link Login",
          type: "boolean",
          description: "Allow passwordless login via email link",
          defaultValue: false,
          scope: "tenant",
          group: "Frontend UI"
        },
        {
          key: "auth.loginPageTitle",
          label: "Login Page Title",
          type: "text",
          description: "Title shown on the login page",
          defaultValue: "Sign In",
          scope: "tenant",
          group: "Frontend UI"
        },
        // ============================================================
        // SECURITY POLICIES (Moved from root groups if needed, 
        // or keep as General if we want to merge)
        // User requested: "General settings for auth can be under General"
        // Let's keep specific policies as sub-types or just put them in General?
        // Let's put them in "General" as requested to consolidate.
        // ============================================================
        {
          key: "auth.passwordMinLength",
          label: "Minimum Password Length",
          type: "number",
          description: "Minimum characters required for passwords",
          defaultValue: 8,
          scope: "tenant",
          group: "General"
        },
        {
          key: "auth.passwordRequireUppercase",
          label: "Require Uppercase Letters",
          type: "boolean",
          description: "Passwords must contain at least one uppercase letter",
          defaultValue: true,
          scope: "tenant",
          group: "General"
        },
        {
          key: "auth.passwordRequireNumbers",
          label: "Require Numbers",
          type: "boolean",
          description: "Passwords must contain at least one number",
          defaultValue: true,
          scope: "tenant",
          group: "General"
        },
        {
          key: "auth.passwordRequireSpecialChars",
          label: "Require Special Characters",
          type: "boolean",
          description: "Passwords must contain at least one special character",
          defaultValue: false,
          scope: "tenant",
          group: "General"
        },
        {
          key: "auth.passwordExpiryDays",
          label: "Password Expiry (Days)",
          type: "number",
          description: "Force password reset after this many days (0 = never)",
          defaultValue: 0,
          scope: "tenant",
          group: "General"
        },
        {
          key: "auth.maxLoginAttempts",
          label: "Max Login Attempts",
          type: "number",
          description: "Lock account after this many failed attempts",
          defaultValue: 5,
          scope: "tenant",
          group: "General"
        },
        {
          key: "auth.lockoutDurationMinutes",
          label: "Lockout Duration (Minutes)",
          type: "number",
          description: "How long accounts stay locked",
          defaultValue: 30,
          scope: "tenant",
          group: "General"
        },
        {
          key: "auth.sessionTimeoutMinutes",
          label: "Session Timeout (Minutes)",
          type: "number",
          description: "Auto-logout after inactivity",
          defaultValue: 60,
          scope: "tenant",
          group: "General"
        },
        {
          key: "auth.maxConcurrentSessions",
          label: "Max Concurrent Sessions",
          type: "number",
          description: "Maximum devices logged in simultaneously (0 = unlimited)",
          defaultValue: 0,
          scope: "tenant",
          group: "General"
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
      tags: ["security", "auth", "login"],
      tables: ["sessions", "login_attempts", "password_resets", "security_events"],
      permissions: [
        "auth.sessions.view",
        "auth.sessions.manage",
        "auth.policies.manage",
        "auth.security.view"
      ]
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
      tables: ["sessions", "login_attempts", "password_resets", "security_events"],
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
      },
      apiRoutes: [
        { method: "POST", path: "/api/v1/auth/login", description: "Authenticate user and issue tokens" },
        { method: "POST", path: "/api/v1/auth/logout", description: "Invalidate current session" },
        { method: "POST", path: "/api/v1/auth/logout-all", description: "Invalidate all sessions for user" },
        { method: "POST", path: "/api/v1/auth/refresh", description: "Refresh access token" },
        { method: "GET", path: "/api/v1/auth/me", description: "Get current user profile" },
        { method: "GET", path: "/api/v1/auth/sessions", description: "List active sessions", requiredPermission: "sessions.view" },
        { method: "POST", path: "/api/v1/auth/forgot-password", description: "Request password reset" },
        { method: "POST", path: "/api/v1/auth/reset-password", description: "Reset password with token" }
      ],
      adminRoutes: [
        { path: "/hpanel/security", component: "SecurityPage", requiredPermission: "sessions.view" }
      ],
      frontendRoutes: [
        { path: "/login", component: "LoginPage" },
        { path: "/register", component: "RegisterPage" },
        { path: "/forgot-password", component: "ForgotPasswordPage" },
        { path: "/reset-password", component: "ResetPasswordPage" }
      ]
    };
    moduleRegistry.register(authModuleConfig);
  }
});

// ../packages/modules-users/src/routes/usersRoutes.ts
function registerUsersRoutes(app2) {
  const users = new Hono2();
  const roles = new Hono2();
  const invitations = new Hono2();
  const checkUserLimit = /* @__PURE__ */ __name(async (db, tenantId) => {
    const tenant = await db.prepare("SELECT max_users FROM tenants WHERE id = ?").bind(tenantId).first();
    if (!tenant)
      return { allowed: true };
    const maxUsers = tenant.max_users || 0;
    if (maxUsers <= 0)
      return { allowed: true };
    const usersCount = await db.prepare("SELECT COUNT(*) as count FROM users WHERE tenant_id = ? AND status != ?").bind(tenantId, "archived").first();
    const activeUsersCount = usersCount.count || 0;
    const invitesCount = await db.prepare("SELECT COUNT(*) as count FROM invitations WHERE tenant_id = ? AND status = ?").bind(tenantId, "pending").first();
    const pendingInvitesCount = invitesCount.count || 0;
    if (activeUsersCount + pendingInvitesCount >= maxUsers) {
      return {
        allowed: false,
        current: activeUsersCount + pendingInvitesCount,
        max: maxUsers,
        error: "User limit reached. Please upgrade your plan."
      };
    }
    return { allowed: true };
  }, "checkUserLimit");
  users.get("/", async (c) => {
    const db = c.env.DB;
    const tenantId = c.req.query("tenantId");
    const status = c.req.query("status");
    const search = c.req.query("search");
    try {
      let query = `SELECT id, username, email, first_name, last_name, role, status, tenant_id, created_at FROM users WHERE 1=1`;
      const params = [];
      if (tenantId && tenantId !== "default") {
        query += " AND tenant_id = ?";
        params.push(tenantId);
      }
      if (status && status !== "all") {
        query += " AND status = ?";
        params.push(status);
      } else {
      }
      if (search) {
        query += " AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)";
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }
      query += " ORDER BY created_at DESC";
      const results = await db.prepare(query).bind(...params).all();
      return c.json(results.results || []);
    } catch (error3) {
      console.error("Users fetch error:", error3);
      return c.json({ error: "Failed to fetch users", message: error3.message }, 500);
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
    } catch (error3) {
      return c.json({ error: "Failed to fetch user", message: error3.message }, 500);
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
      const limitCheck = await checkUserLimit(db, tenantId || "default");
      if (!limitCheck.allowed) {
        return c.json({ error: limitCheck.error }, 403);
      }
      await db.prepare(`
        INSERT INTO users (id, tenant_id, username, email, password, first_name, last_name, role, status, joined_via, created_at, last_activity_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
      `).bind(id, tenantId || "default", username, email, password, firstName, lastName, role, "manual", now, now).run();
      return c.json({ id, username, email, role, status: "active", joined_via: "manual", created_at: now }, 201);
    } catch (error3) {
      if (error3.message?.includes("UNIQUE constraint failed")) {
        return c.json({ error: "Username or email already exists" }, 409);
      }
      return c.json({ error: "Failed to create user", message: error3.message }, 500);
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
      if (status === "suspended") {
        const user = await db.prepare("SELECT role FROM users WHERE id = ?").bind(id).first();
        if (user?.role === "super_admin" || user?.role === "super-admin") {
          return c.json({ error: "Super Admin accounts cannot be suspended" }, 403);
        }
      }
      await db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
      return c.json({ success: true });
    } catch (error3) {
      return c.json({ error: "Failed to update user", message: error3.message }, 500);
    }
  });
  users.delete("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    const permanent = c.req.query("permanent") === "true";
    try {
      const user = await db.prepare("SELECT role FROM users WHERE id = ?").bind(id).first();
      if (user?.role === "super_admin" || user?.role === "super-admin") {
        return c.json({ error: "Super Admin accounts cannot be deleted" }, 403);
      }
      if (permanent) {
        await db.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
      } else {
        await db.prepare("UPDATE users SET deleted_at = ?, status = ?, updated_at = ? WHERE id = ?").bind(Math.floor(Date.now() / 1e3), "archived", Math.floor(Date.now() / 1e3), id).run();
      }
      return c.json({ success: true, permanent });
    } catch (error3) {
      return c.json({ error: "Failed to delete user", message: error3.message }, 500);
    }
  });
  users.post("/bulk-delete", async (c) => {
    const db = c.env.DB;
    const { ids, permanent = false } = await c.req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return c.json({ error: "IDs array is required" }, 400);
    }
    try {
      const placeholders = ids.map(() => "?").join(", ");
      if (permanent) {
        await db.prepare(`DELETE FROM users WHERE id IN (${placeholders})`).bind(...ids).run();
      } else {
        await db.prepare(`UPDATE users SET deleted_at = ?, status = ?, updated_at = ? WHERE id IN (${placeholders})`).bind(Math.floor(Date.now() / 1e3), "archived", Math.floor(Date.now() / 1e3), ...ids).run();
      }
      return c.json({ success: true, deleted: ids.length, permanent });
    } catch (error3) {
      return c.json({ error: "Failed to delete users", message: error3.message }, 500);
    }
  });
  users.get("/seed/info", async (c) => {
    return c.json({
      users: [
        { role: "admin", username: "{tenant}_admin", password: "admin123", email: "admin@{tenant}" },
        { role: "manager", username: "{tenant}_manager", password: "admin123", email: "manager@{tenant}" },
        { role: "editor", username: "{tenant}_editor", password: "admin123", email: "editor@{tenant}" },
        { role: "viewer", username: "{tenant}_viewer", password: "admin123", email: "viewer@{tenant}" },
        { role: "user", username: "{tenant}_user", password: "admin123", email: "user@{tenant}" }
      ]
    });
  });
  users.get("/seed/status", async (c) => {
    const db = c.env.DB;
    try {
      const tenantsRes = await db.prepare("SELECT id, slug FROM tenants").all();
      const tenants2 = tenantsRes.results || [];
      const status = [];
      for (const tenant of tenants2) {
        const seedUsers = await db.prepare(`
                    SELECT COUNT(*) as count FROM users 
                    WHERE tenant_id = ? AND username IN (?, ?, ?, ?, ?)
                `).bind(
          tenant.id,
          `${tenant.slug}_admin`,
          `${tenant.slug}_manager`,
          `${tenant.slug}_editor`,
          `${tenant.slug}_viewer`,
          `${tenant.slug}_user`
        ).first();
        status.push({
          tenantId: tenant.id,
          slug: tenant.slug,
          count: seedUsers?.count || 0,
          isComplete: seedUsers?.count >= 5
        });
      }
      return c.json({
        totalTenants: tenants2.length,
        completeTenants: status.filter((s) => s.isComplete).length,
        details: status
      });
    } catch (error3) {
      return c.json({ error: "Failed to check seed status" }, 500);
    }
  });
  users.post("/seed", async (c) => {
    const db = c.env.DB;
    try {
      const tenantsRes = await db.prepare("SELECT id, slug FROM tenants").all();
      const tenants2 = tenantsRes.results || [];
      const defaultUsers = [
        { role: "admin", suffix: "admin" },
        { role: "manager", suffix: "manager" },
        { role: "editor", suffix: "editor" },
        { role: "viewer", suffix: "viewer" },
        { role: "user", suffix: "user" }
      ];
      const now = Math.floor(Date.now() / 1e3);
      let count3 = 0;
      for (const tenant of tenants2) {
        for (const def of defaultUsers) {
          const username = `${tenant.slug}_${def.suffix}`;
          const email = `${def.suffix}@${tenant.slug}`;
          const id = `u_${tenant.slug}_${def.suffix}`;
          const res = await db.prepare(`
                        INSERT OR IGNORE INTO users (id, tenant_id, username, password, email, first_name, last_name, role, status, created_at, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `).bind(
            id,
            tenant.id,
            username,
            "admin123",
            email,
            def.role.charAt(0).toUpperCase() + def.role.slice(1),
            "User",
            def.role,
            "active",
            now,
            now
          ).run();
          if (res.meta.changes > 0)
            count3++;
        }
      }
      return c.json({ success: true, seeded: count3 });
    } catch (error3) {
      return c.json({ error: "Failed to seed users", message: error3.message }, 500);
    }
  });
  const permissions = new Hono2();
  permissions.get("/", async (c) => {
    const db = c.env.DB;
    const modules = moduleRegistry.getAll();
    const modulePermsMap = {};
    modules.forEach((m) => {
      if (m.permissions && m.permissions.length > 0) {
        modulePermsMap[m.id] = {
          moduleId: m.id,
          moduleName: m.name,
          permissions: [...m.permissions]
        };
      }
    });
    try {
      const results = await db.prepare("SELECT id, module_id, slug FROM permissions").all();
      const dbPermissions = results.results || [];
      dbPermissions.forEach((p) => {
        const mod = modulePermsMap[p.module_id];
        if (mod) {
          if (!mod.permissions.includes(p.slug)) {
            mod.permissions.push(p.slug);
          }
        } else {
          modulePermsMap[p.module_id] = {
            moduleId: p.module_id,
            moduleName: p.module_id.charAt(0).toUpperCase() + p.module_id.slice(1),
            permissions: [p.slug]
          };
        }
      });
    } catch (error3) {
      console.error("Error fetching DB permissions:", error3);
    }
    return c.json(Object.values(modulePermsMap));
  });
  permissions.post("/", async (c) => {
    const db = c.env.DB;
    const { moduleId, slug, name, description } = await c.req.json();
    if (!moduleId || !slug) {
      return c.json({ error: "Module ID and slug are required" }, 400);
    }
    const id = `${moduleId}.${slug}`;
    const finalName = name || slug.charAt(0).toUpperCase() + slug.slice(1);
    try {
      await db.prepare("INSERT INTO permissions (id, module_id, name, slug, description) VALUES (?, ?, ?, ?, ?)").bind(id, moduleId, finalName, slug, description || "").run();
      return c.json({ success: true, id });
    } catch (error3) {
      if (error3.message?.includes("UNIQUE constraint failed")) {
        return c.json({ error: "Permission already exists" }, 409);
      }
      return c.json({ error: "Failed to add permission", message: error3.message }, 500);
    }
  });
  permissions.delete("/:moduleId/:slug", async (c) => {
    const db = c.env.DB;
    const moduleId = c.req.param("moduleId");
    const slug = c.req.param("slug");
    try {
      await db.prepare("DELETE FROM permissions WHERE module_id = ? AND slug = ?").bind(moduleId, slug).run();
      return c.json({ success: true });
    } catch (error3) {
      return c.json({ error: "Failed to delete permission", message: error3.message }, 500);
    }
  });
  roles.get("/", async (c) => {
    const db = c.env.DB;
    const tenantId = c.req.query("tenantId");
    try {
      let query = `
                SELECT 
                    r.id, r.name, r.slug, r.description, r.is_system, r.created_at, r.tenant_id,
                    (SELECT COUNT(*) FROM users u WHERE u.role = r.slug) as user_count
                FROM roles r
            `;
      const params = [];
      if (tenantId) {
        query += " WHERE r.tenant_id = ? OR r.is_system = 1";
        params.push(tenantId);
      }
      query += " ORDER BY r.is_system DESC, r.name ASC";
      const results = await db.prepare(query).bind(...params).all();
      return c.json(results.results || []);
    } catch (error3) {
      console.error("Roles fetch error:", error3);
      return c.json([
        { id: "super_admin", name: "Super Admin", slug: "super_admin", is_system: 1 },
        { id: "admin", name: "Administrator", slug: "admin", is_system: 1 },
        { id: "editor", name: "Editor", slug: "editor", is_system: 1 },
        { id: "viewer", name: "Viewer", slug: "viewer", is_system: 1 }
      ]);
    }
  });
  roles.get("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      const role = await db.prepare("SELECT * FROM roles WHERE id = ?").bind(id).first();
      if (!role) {
        return c.json({ error: "Role not found" }, 404);
      }
      const permissionsRes = await db.prepare(`
                SELECT permission_id FROM role_permissions WHERE role_id = ?
            `).bind(id).all();
      const permissions2 = (permissionsRes.results || []).map((p) => p.permission_id);
      return c.json({ ...role, permissions: permissions2 });
    } catch (error3) {
      return c.json({ error: "Failed to fetch role", message: error3.message }, 500);
    }
  });
  roles.post("/", async (c) => {
    const db = c.env.DB;
    const body = await c.req.json();
    const { name, slug, description, tenantId, permissions: permissions2 = [] } = body;
    if (!name || !slug) {
      return c.json({ error: "Name and slug are required" }, 400);
    }
    const id = crypto.randomUUID();
    try {
      await db.prepare(`
        INSERT INTO roles (id, tenant_id, name, slug, description, is_system, created_at)
        VALUES (?, ?, ?, ?, ?, 0, ?)
      `).bind(id, tenantId || "default", name, slug, description, Math.floor(Date.now() / 1e3)).run();
      if (Array.isArray(permissions2) && permissions2.length > 0) {
        const stmt = db.prepare("INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)");
        const batch = permissions2.map((permId) => stmt.bind(id, permId));
        await db.batch(batch);
      }
      return c.json({ id, name, slug, description, permissions: permissions2 }, 201);
    } catch (error3) {
      if (error3.message?.includes("UNIQUE constraint failed")) {
        return c.json({ error: "Role slug already exists for this tenant" }, 409);
      }
      return c.json({ error: "Failed to create role", message: error3.message }, 500);
    }
  });
  roles.patch("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    const body = await c.req.json();
    const { name, description, permissions: permissions2 } = body;
    try {
      const role = await db.prepare("SELECT is_system FROM roles WHERE id = ?").bind(id).first();
      if (!role)
        return c.json({ error: "Role not found" }, 404);
      if (role.is_system && (name || description)) {
      }
      const updates = [];
      const params = [];
      if (name) {
        updates.push("name = ?");
        params.push(name);
      }
      if (description !== void 0) {
        updates.push("description = ?");
        params.push(description);
      }
      if (updates.length > 0) {
        await db.prepare(`UPDATE roles SET ${updates.join(", ")} WHERE id = ?`).bind(...params, id).run();
      }
      if (permissions2 !== void 0 && Array.isArray(permissions2)) {
        const deleteStmt = db.prepare("DELETE FROM role_permissions WHERE role_id = ?").bind(id);
        const insertStmt = db.prepare("INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)");
        const batch = [deleteStmt, ...permissions2.map((permId) => insertStmt.bind(id, permId))];
        await db.batch(batch);
      }
      return c.json({ success: true });
    } catch (error3) {
      return c.json({ error: "Failed to update role", message: error3.message }, 500);
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
      await db.prepare("DELETE FROM role_permissions WHERE role_id = ?").bind(id).run();
      await db.prepare("DELETE FROM roles WHERE id = ?").bind(id).run();
      return c.json({ success: true });
    } catch (error3) {
      return c.json({ error: "Failed to delete role", message: error3.message }, 500);
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
    } catch (error3) {
      return c.json({ error: "Failed to fetch invitations", message: error3.message }, 500);
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
      const limitCheck = await checkUserLimit(db, tenantId || "default");
      if (!limitCheck.allowed) {
        return c.json({ error: limitCheck.error }, 403);
      }
      await db.prepare(`
        INSERT INTO invitations (id, tenant_id, email, role_id, token, status, invited_by, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)
      `).bind(id, tenantId || "default", email, roleId, token, invitedBy, expiresAt, Math.floor(Date.now() / 1e3)).run();
      return c.json({ id, email, token, expiresAt, status: "pending" }, 201);
    } catch (error3) {
      return c.json({ error: "Failed to send invitation", message: error3.message }, 500);
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
    } catch (error3) {
      return c.json({ error: "Failed to resend invitation", message: error3.message }, 500);
    }
  });
  invitations.delete("/:id", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      await db.prepare("UPDATE invitations SET status = ? WHERE id = ?").bind("cancelled", id).run();
      return c.json({ success: true });
    } catch (error3) {
      return c.json({ error: "Failed to cancel invitation", message: error3.message }, 500);
    }
  });
  app2.route("/api/v1/users", users);
  app2.route("/api/v1/roles", roles);
  app2.route("/api/v1/invitations", invitations);
  app2.route("/api/v1/permissions", permissions);
}
var init_usersRoutes = __esm({
  "../packages/modules-users/src/routes/usersRoutes.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_dist();
    init_src();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    usersSettingsSection = {
      id: "users",
      label: "Users & Permissions",
      icon: "Users",
      order: 25,
      availableForTenants: true,
      requiredPermission: "settings.users.manage",
      fields: [
        // ============================================================
        // ADMIN UI
        // ============================================================
        {
          key: "users.seedData.generate",
          label: "Generate Default Users",
          type: "button",
          description: "Automatically creates a standard set of users (Admin, Manager, Editor, Viewer, User) for every existing tenant. This is useful for initial setup or restoring standard access levels.",
          defaultValue: null,
          scope: "platform",
          group: "Admin UI",
          actionUrl: "/api/v1/users/seed",
          actionMethod: "POST",
          actionLabel: "Generate Now"
        },
        // ============================================================
        // GENERAL SETTINGS
        // ============================================================
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
          scope: "tenant",
          group: "General"
        },
        {
          key: "users.maxUsersPerTenant",
          label: "Max Users",
          type: "number",
          description: "Maximum users allowed for this tenant (0 = unlimited)",
          defaultValue: 0,
          scope: "tenant",
          group: "General"
        },
        {
          key: "users.invitationExpiryDays",
          label: "Invitation Expiry (Days)",
          type: "number",
          description: "How long invitation links remain valid",
          defaultValue: 7,
          scope: "tenant",
          group: "General"
        },
        {
          key: "users.allowInviteByNonAdmin",
          label: "Allow Non-Admins to Invite",
          type: "boolean",
          description: "Editors can invite new users",
          defaultValue: false,
          scope: "tenant",
          group: "General"
        },
        {
          key: "users.requirePhoneNumber",
          label: "Require Phone Number",
          type: "boolean",
          description: "Make phone number a required field",
          defaultValue: false,
          scope: "tenant",
          group: "General"
        },
        {
          key: "users.allowAvatarUpload",
          label: "Allow Avatar Upload",
          type: "boolean",
          description: "Users can upload profile pictures",
          defaultValue: true,
          scope: "tenant",
          group: "General"
        },
        {
          key: "users.allowDataExport",
          label: "Allow Data Export",
          type: "boolean",
          description: "Users can export their personal data (GDPR)",
          defaultValue: true,
          scope: "tenant",
          group: "General"
        },
        {
          key: "users.allowAccountDeletion",
          label: "Allow Account Deletion",
          type: "boolean",
          description: "Users can request account deletion (GDPR)",
          defaultValue: true,
          scope: "tenant",
          group: "General"
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
          group: "Admin UI"
        },
        {
          key: "users.ui.showSearch",
          label: "Enable Search",
          type: "boolean",
          description: "Show search input for filtering users",
          defaultValue: true,
          scope: "tenant",
          group: "Admin UI"
        },
        {
          key: "users.ui.showExport",
          label: "Enable Export",
          type: "boolean",
          description: "Allow exporting user data",
          defaultValue: true,
          scope: "tenant",
          group: "Admin UI"
        },
        {
          key: "users.ui.showImport",
          label: "Enable Import",
          type: "boolean",
          description: "Allow bulk user import",
          defaultValue: true,
          scope: "tenant",
          group: "Admin UI"
        },
        {
          key: "users.ui.showBulkActions",
          label: "Enable Bulk Actions",
          type: "boolean",
          description: "Allow bulk role change, suspend, delete",
          defaultValue: true,
          scope: "tenant",
          group: "Admin UI"
        },
        {
          key: "users.ui.allowInvite",
          label: "Allow User Invites",
          type: "boolean",
          description: "Enable invite user workflow",
          defaultValue: true,
          scope: "tenant",
          group: "Admin UI"
        },
        {
          key: "users.ui.showPagination",
          label: "Show Pagination",
          type: "boolean",
          description: "Show pagination controls with page size selector",
          defaultValue: true,
          scope: "tenant",
          group: "Admin UI"
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
          group: "Admin UI"
        },
        // ============================================================
        // VISIBLE COLUMNS
        // =================================== =========================
        { key: "users.ui.columns.showId", label: "ID", type: "boolean", defaultValue: false, scope: "tenant", group: "Display Columns" },
        { key: "users.ui.columns.showUsername", label: "Username", type: "boolean", defaultValue: true, scope: "tenant", group: "Display Columns" },
        { key: "users.ui.columns.showEmail", label: "Email", type: "boolean", defaultValue: true, scope: "tenant", group: "Display Columns" },
        { key: "users.ui.columns.showFullName", label: "Full Name", type: "boolean", defaultValue: true, scope: "tenant", group: "Display Columns" },
        { key: "users.ui.columns.showRole", label: "Role", type: "boolean", defaultValue: true, scope: "tenant", group: "Display Columns" },
        { key: "users.ui.columns.showStatus", label: "Status", type: "boolean", defaultValue: true, scope: "tenant", group: "Display Columns" },
        { key: "users.ui.columns.showLastLogin", label: "Last Login", type: "boolean", defaultValue: true, scope: "tenant", group: "Display Columns" },
        { key: "users.ui.columns.showCreatedAt", label: "Created", type: "boolean", defaultValue: true, scope: "tenant", group: "Display Columns" },
        { key: "users.ui.columns.showUpdatedAt", label: "Updated", type: "boolean", defaultValue: false, scope: "tenant", group: "Display Columns" },
        { key: "users.ui.columns.showCreatedBy", label: "Created By", type: "boolean", defaultValue: false, scope: "tenant", group: "Display Columns" },
        // ============================================================
        // FILTER CONFIGURATION
        // JSON structure for dynamic filter settings per column
        // ============================================================
        {
          key: "users.ui.filterConfig",
          label: "Filter Configuration",
          type: "filterConfig",
          description: "Configure which columns appear as filters and how they behave",
          scope: "tenant",
          group: "Users Filters",
          defaultValue: {
            username: {
              enabled: false,
              type: "text",
              label: "Username",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            email: {
              enabled: false,
              type: "text",
              label: "Email",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            fullName: {
              enabled: false,
              type: "text",
              label: "Full Name",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            role: {
              enabled: true,
              type: "select",
              label: "Role",
              options: "auto",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            status: {
              enabled: true,
              type: "select",
              label: "Status",
              options: "auto",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            createdAt: {
              enabled: false,
              type: "date-range",
              label: "Created Date",
              sortOptions: ["newest", "oldest"],
              defaultSort: "newest"
            },
            lastLogin: {
              enabled: false,
              type: "date-range",
              label: "Last Login",
              sortOptions: ["newest", "oldest"],
              defaultSort: "newest"
            },
            createdBy: {
              enabled: false,
              type: "text",
              label: "Created By",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            }
          }
        }
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
      tags: ["users", "rbac", "permissions"],
      tables: ["users", "roles", "permissions", "user_roles", "role_permissions", "invitations"],
      permissions: [
        "users.view",
        "users.create",
        "users.edit",
        "users.delete",
        "users.invite",
        "roles.view",
        "roles.manage"
      ]
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
      tables: ["users", "roles", "permissions", "user_roles", "role_permissions", "invitations"],
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
      },
      apiRoutes: [
        { method: "GET", path: "/api/v1/users", description: "List users", requiredPermission: "users.view" },
        { method: "POST", path: "/api/v1/users", description: "Create user", requiredPermission: "users.create" },
        { method: "GET", path: "/api/v1/users/:id", description: "Get user details", requiredPermission: "users.view" },
        { method: "PUT", path: "/api/v1/users/:id", description: "Update user", requiredPermission: "users.edit" },
        { method: "DELETE", path: "/api/v1/users/:id", description: "Delete user", requiredPermission: "users.delete" },
        { method: "POST", path: "/api/v1/users/invite", description: "Invite new user", requiredPermission: "users.invite" },
        { method: "GET", path: "/api/v1/roles", description: "List roles", requiredPermission: "roles.view" },
        { method: "POST", path: "/api/v1/roles", description: "Create role", requiredPermission: "roles.create" },
        { method: "GET", path: "/api/v1/permissions", description: "List permissions", requiredPermission: "roles.view" }
      ],
      adminRoutes: [
        { path: "/hpanel/users", component: "UsersPage", requiredPermission: "users.view" },
        { path: "/hpanel/users/roles", component: "RolesPage", requiredPermission: "roles.view" }
      ],
      frontendRoutes: []
    };
    moduleRegistry.register(usersModuleConfig);
  }
});

// ../packages/modules-tenants/src/routes/tenantsRoutes.ts
function registerTenantsRoutes(app2) {
  const tenants2 = new Hono2();
  tenants2.get("/", async (c) => {
    const db = c.env.DB;
    const status = c.req.query("status");
    const search = c.req.query("search");
    try {
      let query = `
                SELECT t.id, t.name, t.slug, t.status, td.domain, t.plan_name, t.created_at
                FROM tenants t
                LEFT JOIN tenant_domains td ON t.id = td.tenant_id AND td.is_primary = 1
                WHERE 1=1
            `;
      const params = [];
      if (status && status !== "all") {
        query += " AND t.status = ?";
        params.push(status);
      }
      if (search) {
        query += " AND (t.name LIKE ? OR t.slug LIKE ? OR td.domain LIKE ?)";
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      query += " ORDER BY t.name ASC";
      const results = await db.prepare(query).bind(...params).all();
      return c.json(results.results || []);
    } catch (error3) {
      console.error("Tenants fetch error:", error3);
      return c.json({ error: "Failed to fetch tenants", message: error3.message }, 500);
    }
  });
  tenants2.get("/stats", async (c) => {
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
    } catch (error3) {
      return c.json({ error: "Failed to fetch stats", message: error3.message }, 500);
    }
  });
  tenants2.get("/:id", async (c) => {
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
    } catch (error3) {
      return c.json({ error: "Failed to fetch tenant", message: error3.message }, 500);
    }
  });
  tenants2.post("/", async (c) => {
    const db = c.env.DB;
    const kv = c.env.TENANT_MANIFESTS;
    const body = await c.req.json();
    const {
      name,
      slug,
      domain: domain2,
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
                    plan_name, max_users, max_storage, trial_ends_at,
                    created_at, updated_at, config
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
        id,
        name,
        slug,
        domain2 || null,
        status,
        ownerEmail || null,
        planName,
        maxUsers,
        maxStorage,
        trialEndsAt,
        now,
        now,
        JSON.stringify({})
      ).run();
      if (domain2) {
        await db.prepare(`
                    INSERT INTO tenant_domains (id, tenant_id, domain, is_primary, created_at)
                    VALUES (?, ?, ?, 1, ?)
                `).bind(crypto.randomUUID(), id, domain2, now).run();
        if (kv) {
          const manifest = await kv.get("tenant_manifest", "json") || {};
          manifest[domain2] = { id, slug, name };
          await kv.put("tenant_manifest", JSON.stringify(manifest));
        }
      }
      return c.json({
        id,
        name,
        slug,
        domain: domain2,
        status,
        planName,
        trialEndsAt
      }, 201);
    } catch (error3) {
      if (error3.message?.includes("UNIQUE constraint failed")) {
        return c.json({ error: "Slug or domain already exists" }, 409);
      }
      return c.json({ error: "Failed to create tenant", message: error3.message }, 500);
    }
  });
  tenants2.patch("/:id", async (c) => {
    const db = c.env.DB;
    const kv = c.env.TENANT_MANIFESTS;
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
    try {
      updates.push("updated_at = ?");
      params.push(Math.floor(Date.now() / 1e3));
      params.push(id);
      await db.prepare(`UPDATE tenants SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
      const newDomain = body.domain;
      if (newDomain !== void 0) {
        const currentDomain = await db.prepare(
          "SELECT domain FROM tenant_domains WHERE tenant_id = ? AND is_primary = 1"
        ).bind(id).first();
        if (currentDomain?.domain && currentDomain.domain !== newDomain) {
          if (kv) {
            const manifest = await kv.get("tenant_manifest", "json") || {};
            delete manifest[currentDomain.domain];
            await kv.put("tenant_manifest", JSON.stringify(manifest));
          }
        }
        await db.prepare(
          "DELETE FROM tenant_domains WHERE tenant_id = ? AND is_primary = 1"
        ).bind(id).run();
        if (newDomain) {
          await db.prepare(`
                        INSERT INTO tenant_domains (id, tenant_id, domain, is_primary, created_at)
                        VALUES (?, ?, ?, 1, ?)
                    `).bind(crypto.randomUUID(), id, newDomain, Math.floor(Date.now() / 1e3)).run();
          if (kv) {
            const tenant = await db.prepare("SELECT name, slug FROM tenants WHERE id = ?").bind(id).first();
            if (tenant) {
              const manifest = await kv.get("tenant_manifest", "json") || {};
              manifest[newDomain] = { id, slug: tenant.slug, name: tenant.name };
              await kv.put("tenant_manifest", JSON.stringify(manifest));
            }
          }
        }
      }
      return c.json({ success: true });
    } catch (error3) {
      return c.json({ error: "Failed to update tenant", message: error3.message }, 500);
    }
  });
  tenants2.post("/:id/suspend", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    const { reason } = await c.req.json();
    const now = Math.floor(Date.now() / 1e3);
    try {
      await db.prepare(`
                UPDATE tenants 
                SET status = 'suspended', suspended_at = ?, suspended_reason = ?, updated_at = ?
                WHERE id = ?
            `).bind(now, reason || "Suspended by administrator", now, id).run();
      return c.json({ success: true });
    } catch (error3) {
      return c.json({ error: "Failed to suspend tenant", message: error3.message }, 500);
    }
  });
  tenants2.post("/:id/reactivate", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    const now = Math.floor(Date.now() / 1e3);
    try {
      await db.prepare(`
                UPDATE tenants 
                SET status = 'active', suspended_at = NULL, suspended_reason = NULL, updated_at = ?
                WHERE id = ?
            `).bind(now, id).run();
      return c.json({ success: true });
    } catch (error3) {
      return c.json({ error: "Failed to reactivate tenant", message: error3.message }, 500);
    }
  });
  tenants2.delete("/:id", async (c) => {
    const db = c.env.DB;
    const kv = c.env.TENANT_MANIFESTS;
    const id = c.req.param("id");
    const permanent = c.req.query("permanent") === "true";
    const now = Math.floor(Date.now() / 1e3);
    try {
      const domains = await db.prepare(
        "SELECT domain FROM tenant_domains WHERE tenant_id = ?"
      ).bind(id).all();
      if (permanent) {
        await db.prepare("DELETE FROM tenant_domains WHERE tenant_id = ?").bind(id).run();
        await db.prepare("DELETE FROM tenants WHERE id = ?").bind(id).run();
      } else {
        await db.prepare(`
                    UPDATE tenants 
                    SET status = 'archived', deleted_at = ?, updated_at = ?
                    WHERE id = ?
                `).bind(now, now, id).run();
      }
      if (kv && domains.results) {
        for (const row of domains.results) {
          if (row.domain) {
            await kv.delete(`tenant:${row.domain}`);
          }
        }
      }
      return c.json({ success: true, permanent });
    } catch (error3) {
      return c.json({ error: "Failed to delete tenant", message: error3.message }, 500);
    }
  });
  tenants2.get("/:id/usage", async (c) => {
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
    } catch (error3) {
      return c.json({ error: "Failed to fetch usage", message: error3.message }, 500);
    }
  });
  tenants2.get("/:id/modules", async (c) => {
    const db = c.env.DB;
    const id = c.req.param("id");
    try {
      const modules = await db.prepare(`
        SELECT module_id, enabled, enabled_at, enabled_by, settings
        FROM module_status
        WHERE tenant_id = ?
      `).bind(id).all();
      return c.json(modules.results);
    } catch (error3) {
      return c.json({ error: "Failed to fetch modules", message: error3.message }, 500);
    }
  });
  tenants2.post("/:id/modules/:moduleId/enable", async (c) => {
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
    } catch (error3) {
      return c.json({ error: "Failed to enable module", message: error3.message }, 500);
    }
  });
  tenants2.post("/:id/modules/:moduleId/disable", async (c) => {
    const db = c.env.DB;
    const tenantId = c.req.param("id");
    const moduleId = c.req.param("moduleId");
    try {
      await db.prepare(`
        UPDATE module_status SET enabled = 0, updated_at = ?
        WHERE module_id = ? AND tenant_id = ?
      `).bind(Math.floor(Date.now() / 1e3), moduleId, tenantId).run();
      return c.json({ success: true });
    } catch (error3) {
      return c.json({ error: "Failed to disable module", message: error3.message }, 500);
    }
  });
  app2.route("/api/v1/tenants", tenants2);
}
var init_tenantsRoutes = __esm({
  "../packages/modules-tenants/src/routes/tenantsRoutes.ts"() {
    "use strict";
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
        // GENERAL SETTINGS
        // ============================================================
        {
          key: "tenants.registrationEnabled",
          label: "Enable Tenant Registration",
          type: "boolean",
          description: "Allow new tenants to register",
          defaultValue: true,
          scope: "platform",
          group: "General"
        },
        {
          key: "tenants.requireBusinessEmail",
          label: "Require Business Email",
          type: "boolean",
          description: "Block registration from free email providers (gmail, yahoo, etc.)",
          defaultValue: false,
          scope: "platform",
          group: "General"
        },
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
        { key: "tenants.ui.columns.showId", label: "ID", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showName", label: "Name", type: "boolean", defaultValue: true, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showSlug", label: "Slug", type: "boolean", defaultValue: true, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showDomain", label: "Domain", type: "boolean", defaultValue: true, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showStatus", label: "Status", type: "boolean", defaultValue: true, scope: "platform", group: "Display Columns" },
        // Lifecycle
        { key: "tenants.ui.columns.showTrialEndsAt", label: "Trial Ends", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showSuspendedAt", label: "Suspended At", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showSuspendedReason", label: "Suspended Reason", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        // Ownership
        { key: "tenants.ui.columns.showOwnerId", label: "Owner ID", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showOwnerEmail", label: "Owner Email", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showBillingEmail", label: "Billing Email", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        // Subscription
        { key: "tenants.ui.columns.showPlanId", label: "Plan ID", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showPlanName", label: "Plan", type: "boolean", defaultValue: true, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showBillingStatus", label: "Billing Status", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showNextBillingDate", label: "Next Billing", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showMrr", label: "MRR", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        // Resource Limits
        { key: "tenants.ui.columns.showMaxUsers", label: "Max Users", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showMaxStorage", label: "Max Storage", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showMaxApiCalls", label: "Max API Calls", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        // Real-time Usage
        { key: "tenants.ui.columns.showCurrentUsers", label: "Current Users", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showStorageUsed", label: "Storage Used", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showApiCallsThisMonth", label: "API Calls (Month)", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        // Metadata
        { key: "tenants.ui.columns.showIndustry", label: "Industry", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showCompanySize", label: "Company Size", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showNotes", label: "Notes", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showTags", label: "Tags", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        // Audit
        { key: "tenants.ui.columns.showLastActivityAt", label: "Last Activity", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showCreatedAt", label: "Created", type: "boolean", defaultValue: true, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showUpdatedAt", label: "Updated", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        { key: "tenants.ui.columns.showCreatedBy", label: "Created By", type: "boolean", defaultValue: false, scope: "platform", group: "Display Columns" },
        // ============================================================
        // FILTER CONFIGURATION
        // JSON structure for dynamic filter settings per column
        // ============================================================
        {
          key: "tenants.ui.filterConfig",
          label: "Filter Configuration",
          type: "filterConfig",
          description: "Configure which columns appear as filters and how they behave",
          scope: "platform",
          group: "Filters",
          defaultValue: {
            name: {
              enabled: false,
              type: "text",
              label: "Name",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            slug: {
              enabled: false,
              type: "text",
              label: "Slug",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            domain: {
              enabled: false,
              type: "text",
              label: "Domain",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            status: {
              enabled: true,
              type: "select",
              label: "Status",
              options: "auto",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            planName: {
              enabled: true,
              type: "select",
              label: "Plan",
              options: "auto",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            ownerEmail: {
              enabled: false,
              type: "text",
              label: "Owner",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            industry: {
              enabled: false,
              type: "select",
              label: "Industry",
              options: "auto",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            companySize: {
              enabled: false,
              type: "select",
              label: "Company Size",
              options: "auto",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            billingStatus: {
              enabled: false,
              type: "select",
              label: "Billing Status",
              options: "auto",
              sortOptions: ["a-z", "z-a"],
              defaultSort: "a-z"
            },
            createdAt: {
              enabled: false,
              type: "date-range",
              label: "Created Date",
              sortOptions: ["newest", "oldest"],
              defaultSort: "newest"
            },
            trialEndsAt: {
              enabled: false,
              type: "date-range",
              label: "Trial End Date",
              sortOptions: ["newest", "oldest"],
              defaultSort: "newest"
            },
            tags: {
              enabled: false,
              type: "multi-select",
              label: "Tags",
              options: "auto"
            }
          }
        },
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
      tags: ["platform", "multitenancy", "tenants"],
      tables: ["tenants", "domains"],
      permissions: [
        "tenants.view",
        "tenants.manage",
        "tenants.modules.manage",
        "tenants.usage.view"
      ]
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
      tables: ["tenants", "tenant_domains"],
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
      },
      apiRoutes: [
        { method: "GET", path: "/api/v1/tenants", description: "List tenants", requiredPermission: "tenants.view" },
        { method: "POST", path: "/api/v1/tenants", description: "Create tenant", requiredPermission: "tenants.create" },
        { method: "GET", path: "/api/v1/tenants/:id", description: "Get tenant details", requiredPermission: "tenants.view" },
        { method: "PUT", path: "/api/v1/tenants/:id", description: "Update tenant", requiredPermission: "tenants.edit" },
        { method: "DELETE", path: "/api/v1/tenants/:id", description: "Delete tenant", requiredPermission: "tenants.delete" },
        { method: "GET", path: "/api/v1/tenants/domains", description: "List tenant domains", requiredPermission: "tenants.view" },
        { method: "POST", path: "/api/v1/tenants/:id/restore", description: "Restore archived tenant", requiredPermission: "tenants.restore" }
      ],
      adminRoutes: [
        { path: "/hpanel/tenants", component: "TenantsPage", requiredPermission: "tenants.view" },
        { path: "/hpanel/tenants/:id", component: "TenantDetailPage", requiredPermission: "tenants.view" }
      ],
      frontendRoutes: []
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
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

// .wrangler/tmp/bundle-lHjXsd/middleware-loader.entry.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// .wrangler/tmp/bundle-lHjXsd/middleware-insertion-facade.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/index.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_dist();

// ../node_modules/hono/dist/middleware/cors/index.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
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
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
async function tenantResolverMiddleware(c, next) {
  const host = c.req.header("host") || "";
  const domain2 = host.split(":")[0];
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
    tenant = await kv.get(`tenant:${domain2}`, { type: "json" });
    if (!tenant) {
      const db = c.env.DB;
      const result = await db.prepare(`
                SELECT t.* FROM tenants t
                JOIN tenant_domains td ON t.id = td.tenant_id
                WHERE td.domain = ?
            `).bind(domain2).first();
      if (result) {
        tenant = {
          ...result,
          config: typeof result.config === "string" ? JSON.parse(result.config) : result.config
        };
        await kv.put(`tenant:${domain2}`, JSON.stringify(tenant));
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
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
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
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
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
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_dist();
init_src();
var settings = new Hono2();
settings.get("/sections/:moduleId", async (c) => {
  const db = c.env.DB;
  const moduleId = c.req.param("moduleId");
  const tenantId = c.req.query("tenantId") || "default";
  const section = settingsRegistry.get(moduleId);
  console.log(`[Settings] Fetching section: ${moduleId} - Found: ${!!section} - Fields: ${section?.fields.length}`);
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
    const mergedValues = { ...values };
    section.fields.forEach((field) => {
      if (mergedValues[field.key] === void 0) {
        mergedValues[field.key] = field.defaultValue;
      }
    });
    return c.json({
      ...section,
      values: mergedValues
    });
  } catch (error3) {
    console.error("Failed to get settings:", error3);
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
  } catch (error3) {
    console.error("Failed to save settings:", error3);
    return c.json({ error: "Failed to save settings", message: error3.message }, 500);
  }
});
var settings_default = settings;

// src/routes/v1/schema.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_dist();
var schema = new Hono2();
schema.get("/:table", async (c) => {
  const db = c.env.DB;
  const table3 = c.req.param("table");
  const allowedTables = [
    "users",
    "tenants",
    "invitations",
    "roles",
    "permissions",
    "user_roles",
    "role_permissions",
    "sessions",
    "login_attempts",
    "password_resets",
    "security_events",
    "settings",
    "audit_logs",
    "tenant_domains",
    "module_status"
  ];
  if (!allowedTables.includes(table3)) {
    return c.json({ error: "Invalid table name" }, 400);
  }
  try {
    const results = await db.prepare(`PRAGMA table_info(${table3})`).all();
    const columns = results.results.map((col) => ({
      name: col.name,
      type: col.type,
      notnull: col.notnull === 1,
      pk: col.pk === 1,
      defaultValue: col.dflt_value
    }));
    return c.json({
      table: table3,
      columns
    });
  } catch (error3) {
    console.error(`Schema fetch error for ${table3}:`, error3);
    return c.json({ error: `Failed to fetch schema for ${table3}`, message: error3.message }, 500);
  }
});
var schema_default = schema;

// src/routes/v1/database.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_dist();

// src/db/schema/index.ts
var schema_exports = {};
__export(schema_exports, {
  auditLogs: () => auditLogs,
  settings: () => settings2,
  tenantDomains: () => tenantDomains,
  tenants: () => tenants
});
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// src/db/schema/tenants.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/drizzle-orm/column.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/drizzle-orm/entity.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var entityKind = Symbol.for("drizzle:entityKind");
var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  }
  let cls = Object.getPrototypeOf(value).constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}
__name(is, "is");

// ../node_modules/drizzle-orm/column.js
var _a;
var Column = class {
  constructor(table3, config2) {
    this.table = table3;
    this.config = config2;
    this.name = config2.name;
    this.keyAsName = config2.keyAsName;
    this.notNull = config2.notNull;
    this.default = config2.default;
    this.defaultFn = config2.defaultFn;
    this.onUpdateFn = config2.onUpdateFn;
    this.hasDefault = config2.hasDefault;
    this.primary = config2.primaryKey;
    this.isUnique = config2.isUnique;
    this.uniqueName = config2.uniqueName;
    this.uniqueType = config2.uniqueType;
    this.dataType = config2.dataType;
    this.columnType = config2.columnType;
    this.generated = config2.generated;
    this.generatedIdentity = config2.generatedIdentity;
  }
  name;
  keyAsName;
  primary;
  notNull;
  default;
  defaultFn;
  onUpdateFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = void 0;
  generated = void 0;
  generatedIdentity = void 0;
  config;
  mapFromDriverValue(value) {
    return value;
  }
  mapToDriverValue(value) {
    return value;
  }
  // ** @internal */
  shouldDisableInsert() {
    return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
  }
};
__name(Column, "Column");
_a = entityKind;
__publicField(Column, _a, "Column");

// ../node_modules/drizzle-orm/sql/sql.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/drizzle-orm/pg-core/columns/enum.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/drizzle-orm/pg-core/columns/common.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/drizzle-orm/column-builder.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var _a2;
var ColumnBuilder = class {
  config;
  constructor(name, dataType, columnType) {
    this.config = {
      name,
      keyAsName: name === "",
      notNull: false,
      default: void 0,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType,
      columnType,
      generated: void 0
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    this.config.notNull = true;
    return this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(fn) {
    this.config.defaultFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $defaultFn}.
   */
  $default = this.$defaultFn;
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(fn) {
    this.config.onUpdateFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $onUpdateFn}.
   */
  $onUpdate = this.$onUpdateFn;
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
  /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
  setName(name) {
    if (this.config.name !== "")
      return;
    this.config.name = name;
  }
};
__name(ColumnBuilder, "ColumnBuilder");
_a2 = entityKind;
__publicField(ColumnBuilder, _a2, "ColumnBuilder");

// ../node_modules/drizzle-orm/pg-core/foreign-keys.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/drizzle-orm/table.utils.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var TableName = Symbol.for("drizzle:Name");

// ../node_modules/drizzle-orm/pg-core/foreign-keys.js
var _a3;
var ForeignKeyBuilder = class {
  /** @internal */
  reference;
  /** @internal */
  _onUpdate = "no action";
  /** @internal */
  _onDelete = "no action";
  constructor(config2, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config2();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action === void 0 ? "no action" : action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action === void 0 ? "no action" : action;
    return this;
  }
  /** @internal */
  build(table3) {
    return new ForeignKey(table3, this);
  }
};
__name(ForeignKeyBuilder, "ForeignKeyBuilder");
_a3 = entityKind;
__publicField(ForeignKeyBuilder, _a3, "PgForeignKeyBuilder");
var _a4;
var ForeignKey = class {
  constructor(table3, builder) {
    this.table = table3;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[TableName],
      ...columnNames,
      foreignColumns[0].table[TableName],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
};
__name(ForeignKey, "ForeignKey");
_a4 = entityKind;
__publicField(ForeignKey, _a4, "PgForeignKey");

// ../node_modules/drizzle-orm/tracing-utils.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function iife(fn, ...args) {
  return fn(...args);
}
__name(iife, "iife");

// ../node_modules/drizzle-orm/pg-core/unique-constraint.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function uniqueKeyName(table3, columns) {
  return `${table3[TableName]}_${columns.join("_")}_unique`;
}
__name(uniqueKeyName, "uniqueKeyName");
var _a5;
var UniqueConstraintBuilder = class {
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  /** @internal */
  columns;
  /** @internal */
  nullsNotDistinctConfig = false;
  nullsNotDistinct() {
    this.nullsNotDistinctConfig = true;
    return this;
  }
  /** @internal */
  build(table3) {
    return new UniqueConstraint(table3, this.columns, this.nullsNotDistinctConfig, this.name);
  }
};
__name(UniqueConstraintBuilder, "UniqueConstraintBuilder");
_a5 = entityKind;
__publicField(UniqueConstraintBuilder, _a5, "PgUniqueConstraintBuilder");
var _a6;
var UniqueOnConstraintBuilder = class {
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder(columns, this.name);
  }
};
__name(UniqueOnConstraintBuilder, "UniqueOnConstraintBuilder");
_a6 = entityKind;
__publicField(UniqueOnConstraintBuilder, _a6, "PgUniqueOnConstraintBuilder");
var _a7;
var UniqueConstraint = class {
  constructor(table3, columns, nullsNotDistinct, name) {
    this.table = table3;
    this.columns = columns;
    this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
    this.nullsNotDistinct = nullsNotDistinct;
  }
  columns;
  name;
  nullsNotDistinct = false;
  getName() {
    return this.name;
  }
};
__name(UniqueConstraint, "UniqueConstraint");
_a7 = entityKind;
__publicField(UniqueConstraint, _a7, "PgUniqueConstraint");

// ../node_modules/drizzle-orm/pg-core/utils/array.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
  for (let i = startFrom; i < arrayString.length; i++) {
    const char = arrayString[i];
    if (char === "\\") {
      i++;
      continue;
    }
    if (char === '"') {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
    }
    if (inQuotes) {
      continue;
    }
    if (char === "," || char === "}") {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
    }
  }
  return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
__name(parsePgArrayValue, "parsePgArrayValue");
function parsePgNestedArray(arrayString, startFrom = 0) {
  const result = [];
  let i = startFrom;
  let lastCharIsComma = false;
  while (i < arrayString.length) {
    const char = arrayString[i];
    if (char === ",") {
      if (lastCharIsComma || i === startFrom) {
        result.push("");
      }
      lastCharIsComma = true;
      i++;
      continue;
    }
    lastCharIsComma = false;
    if (char === "\\") {
      i += 2;
      continue;
    }
    if (char === '"') {
      const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    if (char === "}") {
      return [result, i + 1];
    }
    if (char === "{") {
      const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
    result.push(value);
    i = newStartFrom;
  }
  return [result, i];
}
__name(parsePgNestedArray, "parsePgNestedArray");
function parsePgArray(arrayString) {
  const [result] = parsePgNestedArray(arrayString, 1);
  return result;
}
__name(parsePgArray, "parsePgArray");
function makePgArray(array) {
  return `{${array.map((item) => {
    if (Array.isArray(item)) {
      return makePgArray(item);
    }
    if (typeof item === "string") {
      return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `${item}`;
  }).join(",")}}`;
}
__name(makePgArray, "makePgArray");

// ../node_modules/drizzle-orm/pg-core/columns/common.js
var _a8;
var PgColumnBuilder = class extends ColumnBuilder {
  foreignKeyConfigs = [];
  array(size) {
    return new PgArrayBuilder(this.config.name, this, size);
  }
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name, config2) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    this.config.uniqueType = config2?.nulls;
    return this;
  }
  generatedAlwaysAs(as) {
    this.config.generated = {
      as,
      type: "always",
      mode: "stored"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table3) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return iife(
        (ref2, actions2) => {
          const builder = new ForeignKeyBuilder(() => {
            const foreignColumn = ref2();
            return { columns: [column], foreignColumns: [foreignColumn] };
          });
          if (actions2.onUpdate) {
            builder.onUpdate(actions2.onUpdate);
          }
          if (actions2.onDelete) {
            builder.onDelete(actions2.onDelete);
          }
          return builder.build(table3);
        },
        ref,
        actions
      );
    });
  }
  /** @internal */
  buildExtraConfigColumn(table3) {
    return new ExtraConfigColumn(table3, this.config);
  }
};
__name(PgColumnBuilder, "PgColumnBuilder");
_a8 = entityKind;
__publicField(PgColumnBuilder, _a8, "PgColumnBuilder");
var _a9;
var PgColumn = class extends Column {
  constructor(table3, config2) {
    if (!config2.uniqueName) {
      config2.uniqueName = uniqueKeyName(table3, [config2.name]);
    }
    super(table3, config2);
    this.table = table3;
  }
};
__name(PgColumn, "PgColumn");
_a9 = entityKind;
__publicField(PgColumn, _a9, "PgColumn");
var _a10;
var ExtraConfigColumn = class extends PgColumn {
  getSQLType() {
    return this.getSQLType();
  }
  indexConfig = {
    order: this.config.order ?? "asc",
    nulls: this.config.nulls ?? "last",
    opClass: this.config.opClass
  };
  defaultConfig = {
    order: "asc",
    nulls: "last",
    opClass: void 0
  };
  asc() {
    this.indexConfig.order = "asc";
    return this;
  }
  desc() {
    this.indexConfig.order = "desc";
    return this;
  }
  nullsFirst() {
    this.indexConfig.nulls = "first";
    return this;
  }
  nullsLast() {
    this.indexConfig.nulls = "last";
    return this;
  }
  /**
   * ### PostgreSQL documentation quote
   *
   * > An operator class with optional parameters can be specified for each column of an index.
   * The operator class identifies the operators to be used by the index for that column.
   * For example, a B-tree index on four-byte integers would use the int4_ops class;
   * this operator class includes comparison functions for four-byte integers.
   * In practice the default operator class for the column's data type is usually sufficient.
   * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
   * For example, we might want to sort a complex-number data type either by absolute value or by real part.
   * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
   * More information about operator classes check:
   *
   * ### Useful links
   * https://www.postgresql.org/docs/current/sql-createindex.html
   *
   * https://www.postgresql.org/docs/current/indexes-opclass.html
   *
   * https://www.postgresql.org/docs/current/xindex.html
   *
   * ### Additional types
   * If you have the `pg_vector` extension installed in your database, you can use the
   * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
   *
   * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
   *
   * @param opClass
   * @returns
   */
  op(opClass) {
    this.indexConfig.opClass = opClass;
    return this;
  }
};
__name(ExtraConfigColumn, "ExtraConfigColumn");
_a10 = entityKind;
__publicField(ExtraConfigColumn, _a10, "ExtraConfigColumn");
var _a11;
var IndexedColumn = class {
  constructor(name, keyAsName, type, indexConfig) {
    this.name = name;
    this.keyAsName = keyAsName;
    this.type = type;
    this.indexConfig = indexConfig;
  }
  name;
  keyAsName;
  type;
  indexConfig;
};
__name(IndexedColumn, "IndexedColumn");
_a11 = entityKind;
__publicField(IndexedColumn, _a11, "IndexedColumn");
var _a12;
var PgArrayBuilder = class extends PgColumnBuilder {
  constructor(name, baseBuilder, size) {
    super(name, "array", "PgArray");
    this.config.baseBuilder = baseBuilder;
    this.config.size = size;
  }
  /** @internal */
  build(table3) {
    const baseColumn = this.config.baseBuilder.build(table3);
    return new PgArray(
      table3,
      this.config,
      baseColumn
    );
  }
};
__name(PgArrayBuilder, "PgArrayBuilder");
_a12 = entityKind;
__publicField(PgArrayBuilder, _a12, "PgArrayBuilder");
var _a13;
var _PgArray = class extends PgColumn {
  constructor(table3, config2, baseColumn, range) {
    super(table3, config2);
    this.baseColumn = baseColumn;
    this.range = range;
    this.size = config2.size;
  }
  size;
  getSQLType() {
    return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      value = parsePgArray(value);
    }
    return value.map((v) => this.baseColumn.mapFromDriverValue(v));
  }
  mapToDriverValue(value, isNestedArray = false) {
    const a = value.map(
      (v) => v === null ? null : is(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v)
    );
    if (isNestedArray)
      return a;
    return makePgArray(a);
  }
};
var PgArray = _PgArray;
__name(PgArray, "PgArray");
_a13 = entityKind;
__publicField(PgArray, _a13, "PgArray");

// ../node_modules/drizzle-orm/pg-core/columns/enum.js
var _a14;
var PgEnumObjectColumnBuilder = class extends PgColumnBuilder {
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumObjectColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table3) {
    return new PgEnumObjectColumn(
      table3,
      this.config
    );
  }
};
__name(PgEnumObjectColumnBuilder, "PgEnumObjectColumnBuilder");
_a14 = entityKind;
__publicField(PgEnumObjectColumnBuilder, _a14, "PgEnumObjectColumnBuilder");
var _a15;
var PgEnumObjectColumn = class extends PgColumn {
  enum;
  enumValues = this.config.enum.enumValues;
  constructor(table3, config2) {
    super(table3, config2);
    this.enum = config2.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};
__name(PgEnumObjectColumn, "PgEnumObjectColumn");
_a15 = entityKind;
__publicField(PgEnumObjectColumn, _a15, "PgEnumObjectColumn");
var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
__name(isPgEnum, "isPgEnum");
var _a16;
var PgEnumColumnBuilder = class extends PgColumnBuilder {
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table3) {
    return new PgEnumColumn(
      table3,
      this.config
    );
  }
};
__name(PgEnumColumnBuilder, "PgEnumColumnBuilder");
_a16 = entityKind;
__publicField(PgEnumColumnBuilder, _a16, "PgEnumColumnBuilder");
var _a17;
var PgEnumColumn = class extends PgColumn {
  enum = this.config.enum;
  enumValues = this.config.enum.enumValues;
  constructor(table3, config2) {
    super(table3, config2);
    this.enum = config2.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};
__name(PgEnumColumn, "PgEnumColumn");
_a17 = entityKind;
__publicField(PgEnumColumn, _a17, "PgEnumColumn");

// ../node_modules/drizzle-orm/subquery.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var _a18;
var Subquery = class {
  constructor(sql2, fields, alias, isWith = false, usedTables = []) {
    this._ = {
      brand: "Subquery",
      sql: sql2,
      selectedFields: fields,
      alias,
      isWith,
      usedTables
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
};
__name(Subquery, "Subquery");
_a18 = entityKind;
__publicField(Subquery, _a18, "Subquery");
var _a19;
var WithSubquery = class extends Subquery {
};
__name(WithSubquery, "WithSubquery");
_a19 = entityKind;
__publicField(WithSubquery, _a19, "WithSubquery");

// ../node_modules/drizzle-orm/tracing.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/drizzle-orm/version.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var version2 = "0.45.1";

// ../node_modules/drizzle-orm/tracing.js
var otel;
var rawTracer;
var tracer = {
  startActiveSpan(name, fn) {
    if (!otel) {
      return fn();
    }
    if (!rawTracer) {
      rawTracer = otel.trace.getTracer("drizzle-orm", version2);
    }
    return iife(
      (otel2, rawTracer2) => rawTracer2.startActiveSpan(
        name,
        (span) => {
          try {
            return fn(span);
          } catch (e) {
            span.setStatus({
              code: otel2.SpanStatusCode.ERROR,
              message: e instanceof Error ? e.message : "Unknown error"
              // eslint-disable-line no-instanceof/no-instanceof
            });
            throw e;
          } finally {
            span.end();
          }
        }
      ),
      otel,
      rawTracer
    );
  }
};

// ../node_modules/drizzle-orm/view-common.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");

// ../node_modules/drizzle-orm/table.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var _a20;
var Table = class {
  /**
   * @internal
   * Can be changed if the table is aliased.
   */
  [(_a20 = entityKind, TableName)];
  /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */
  [OriginalName];
  /** @internal */
  [Schema];
  /** @internal */
  [Columns];
  /** @internal */
  [ExtraConfigColumns];
  /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */
  [BaseName];
  /** @internal */
  [IsAlias] = false;
  /** @internal */
  [IsDrizzleTable] = true;
  /** @internal */
  [ExtraConfigBuilder] = void 0;
  constructor(name, schema2, baseName) {
    this[TableName] = this[OriginalName] = name;
    this[Schema] = schema2;
    this[BaseName] = baseName;
  }
};
__name(Table, "Table");
__publicField(Table, _a20, "Table");
/** @internal */
__publicField(Table, "Symbol", {
  Name: TableName,
  Schema,
  OriginalName,
  Columns,
  ExtraConfigColumns,
  BaseName,
  IsAlias,
  ExtraConfigBuilder
});
function getTableName(table3) {
  return table3[TableName];
}
__name(getTableName, "getTableName");

// ../node_modules/drizzle-orm/sql/sql.js
var _a21;
var FakePrimitiveParam = class {
};
__name(FakePrimitiveParam, "FakePrimitiveParam");
_a21 = entityKind;
__publicField(FakePrimitiveParam, _a21, "FakePrimitiveParam");
function isSQLWrapper(value) {
  return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
__name(isSQLWrapper, "isSQLWrapper");
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}
__name(mergeQueries, "mergeQueries");
var _a22;
var StringChunk = class {
  value;
  constructor(value) {
    this.value = Array.isArray(value) ? value : [value];
  }
  getSQL() {
    return new SQL([this]);
  }
};
__name(StringChunk, "StringChunk");
_a22 = entityKind;
__publicField(StringChunk, _a22, "StringChunk");
var _a23;
var _SQL = class {
  constructor(queryChunks) {
    this.queryChunks = queryChunks;
    for (const chunk of queryChunks) {
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        this.usedTables.push(
          schemaName === void 0 ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]
        );
      }
    }
  }
  /** @internal */
  decoder = noopDecoder;
  shouldInlineParams = false;
  /** @internal */
  usedTables = [];
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config2) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config2);
      span?.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config2 = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const {
      casing,
      escapeName,
      escapeParam,
      prepareTyping,
      inlineParams,
      paramStartIndex
    } = config2;
    return mergeQueries(chunks.map((chunk) => {
      if (is(chunk, StringChunk)) {
        return { sql: chunk.value.join(""), params: [] };
      }
      if (is(chunk, Name)) {
        return { sql: escapeName(chunk.value), params: [] };
      }
      if (chunk === void 0) {
        return { sql: "", params: [] };
      }
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i, p] of chunk.entries()) {
          result.push(p);
          if (i < chunk.length - 1) {
            result.push(new StringChunk(", "));
          }
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config2);
      }
      if (is(chunk, _SQL)) {
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config2,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      }
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName = chunk[Table.Symbol.Name];
        return {
          sql: schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
          params: []
        };
      }
      if (is(chunk, Column)) {
        const columnName = casing.getColumnCasing(chunk);
        if (_config.invokeSource === "indexes") {
          return { sql: escapeName(columnName), params: [] };
        }
        const schemaName = chunk.table[Table.Symbol.Schema];
        return {
          sql: chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
          params: []
        };
      }
      if (is(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is(chunk, Param)) {
        if (is(chunk.value, Placeholder)) {
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }
        const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
        if (is(mappedValue, _SQL)) {
          return this.buildQueryFromSourceParams([mappedValue], config2);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(mappedValue, config2), params: [] };
        }
        let typings = ["none"];
        if (prepareTyping) {
          typings = [prepareTyping(chunk.encoder)];
        }
        return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
      }
      if (is(chunk, Placeholder)) {
        return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
      }
      if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
        return { sql: escapeName(chunk.fieldAlias), params: [] };
      }
      if (is(chunk, Subquery)) {
        if (chunk._.isWith) {
          return { sql: escapeName(chunk._.alias), params: [] };
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk._.sql,
          new StringChunk(") "),
          new Name(chunk._.alias)
        ], config2);
      }
      if (isPgEnum(chunk)) {
        if (chunk.schema) {
          return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
        }
        return { sql: escapeName(chunk.enumName), params: [] };
      }
      if (isSQLWrapper(chunk)) {
        if (chunk.shouldOmitSQLParens?.()) {
          return this.buildQueryFromSourceParams([chunk.getSQL()], config2);
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config2);
      }
      if (inlineParams) {
        return { sql: this.mapInlineParam(chunk, config2), params: [] };
      }
      return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
    }));
  }
  mapInlineParam(chunk, { escapeString }) {
    if (chunk === null) {
      return "null";
    }
    if (typeof chunk === "number" || typeof chunk === "boolean") {
      return chunk.toString();
    }
    if (typeof chunk === "string") {
      return escapeString(chunk);
    }
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]") {
        return escapeString(JSON.stringify(chunk));
      }
      return escapeString(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === void 0) {
      return this;
    }
    return new _SQL.Aliased(this, alias);
  }
  mapWith(decoder) {
    this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(condition) {
    return condition ? this : void 0;
  }
};
var SQL = _SQL;
__name(SQL, "SQL");
_a23 = entityKind;
__publicField(SQL, _a23, "SQL");
var _a24;
var Name = class {
  constructor(value) {
    this.value = value;
  }
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
__name(Name, "Name");
_a24 = entityKind;
__publicField(Name, _a24, "Name");
var noopDecoder = {
  mapFromDriverValue: (value) => value
};
var noopEncoder = {
  mapToDriverValue: (value) => value
};
var noopMapper = {
  ...noopDecoder,
  ...noopEncoder
};
var _a25;
var Param = class {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(value, encoder = noopEncoder) {
    this.value = value;
    this.encoder = encoder;
  }
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
__name(Param, "Param");
_a25 = entityKind;
__publicField(Param, _a25, "Param");
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
__name(sql, "sql");
((sql2) => {
  function empty() {
    return new SQL([]);
  }
  __name(empty, "empty");
  sql2.empty = empty;
  function fromList(list) {
    return new SQL(list);
  }
  __name(fromList, "fromList");
  sql2.fromList = fromList;
  function raw2(str) {
    return new SQL([new StringChunk(str)]);
  }
  __name(raw2, "raw");
  sql2.raw = raw2;
  function join(chunks, separator) {
    const result = [];
    for (const [i, chunk] of chunks.entries()) {
      if (i > 0 && separator !== void 0) {
        result.push(separator);
      }
      result.push(chunk);
    }
    return new SQL(result);
  }
  __name(join, "join");
  sql2.join = join;
  function identifier(value) {
    return new Name(value);
  }
  __name(identifier, "identifier");
  sql2.identifier = identifier;
  function placeholder2(name2) {
    return new Placeholder(name2);
  }
  __name(placeholder2, "placeholder2");
  sql2.placeholder = placeholder2;
  function param2(value, encoder) {
    return new Param(value, encoder);
  }
  __name(param2, "param2");
  sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {
  class Aliased {
    constructor(sql2, fieldAlias) {
      this.sql = sql2;
      this.fieldAlias = fieldAlias;
    }
    static [entityKind] = "SQL.Aliased";
    /** @internal */
    isSelectionField = false;
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new Aliased(this.sql, this.fieldAlias);
    }
  }
  __name(Aliased, "Aliased");
  SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
var _a26;
var Placeholder = class {
  constructor(name2) {
    this.name = name2;
  }
  getSQL() {
    return new SQL([this]);
  }
};
__name(Placeholder, "Placeholder");
_a26 = entityKind;
__publicField(Placeholder, _a26, "Placeholder");
var IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
var _a27;
var View = class {
  /** @internal */
  [(_a27 = entityKind, ViewBaseConfig)];
  /** @internal */
  [IsDrizzleView] = true;
  constructor({ name: name2, schema: schema2, selectedFields, query }) {
    this[ViewBaseConfig] = {
      name: name2,
      originalName: name2,
      schema: schema2,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
  getSQL() {
    return new SQL([this]);
  }
};
__name(View, "View");
__publicField(View, _a27, "View");
Column.prototype.getSQL = function() {
  return new SQL([this]);
};
Table.prototype.getSQL = function() {
  return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
  return new SQL([this]);
};

// ../node_modules/drizzle-orm/sqlite-core/columns/blob.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/drizzle-orm/utils.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function getTableColumns(table3) {
  return table3[Table.Symbol.Columns];
}
__name(getTableColumns, "getTableColumns");
function getColumnNameAndConfig(a, b) {
  return {
    name: typeof a === "string" && a.length > 0 ? a : "",
    config: typeof a === "object" ? a : b
  };
}
__name(getColumnNameAndConfig, "getColumnNameAndConfig");
var textDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder();

// ../node_modules/drizzle-orm/sqlite-core/columns/common.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/drizzle-orm/sqlite-core/foreign-keys.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var _a28;
var ForeignKeyBuilder2 = class {
  /** @internal */
  reference;
  /** @internal */
  _onUpdate;
  /** @internal */
  _onDelete;
  constructor(config2, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config2();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action;
    return this;
  }
  /** @internal */
  build(table3) {
    return new ForeignKey2(table3, this);
  }
};
__name(ForeignKeyBuilder2, "ForeignKeyBuilder");
_a28 = entityKind;
__publicField(ForeignKeyBuilder2, _a28, "SQLiteForeignKeyBuilder");
var _a29;
var ForeignKey2 = class {
  constructor(table3, builder) {
    this.table = table3;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[TableName],
      ...columnNames,
      foreignColumns[0].table[TableName],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
};
__name(ForeignKey2, "ForeignKey");
_a29 = entityKind;
__publicField(ForeignKey2, _a29, "SQLiteForeignKey");

// ../node_modules/drizzle-orm/sqlite-core/unique-constraint.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function uniqueKeyName2(table3, columns) {
  return `${table3[TableName]}_${columns.join("_")}_unique`;
}
__name(uniqueKeyName2, "uniqueKeyName");
var _a30;
var UniqueConstraintBuilder2 = class {
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  /** @internal */
  columns;
  /** @internal */
  build(table3) {
    return new UniqueConstraint2(table3, this.columns, this.name);
  }
};
__name(UniqueConstraintBuilder2, "UniqueConstraintBuilder");
_a30 = entityKind;
__publicField(UniqueConstraintBuilder2, _a30, "SQLiteUniqueConstraintBuilder");
var _a31;
var UniqueOnConstraintBuilder2 = class {
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder2(columns, this.name);
  }
};
__name(UniqueOnConstraintBuilder2, "UniqueOnConstraintBuilder");
_a31 = entityKind;
__publicField(UniqueOnConstraintBuilder2, _a31, "SQLiteUniqueOnConstraintBuilder");
var _a32;
var UniqueConstraint2 = class {
  constructor(table3, columns, name) {
    this.table = table3;
    this.columns = columns;
    this.name = name ?? uniqueKeyName2(this.table, this.columns.map((column) => column.name));
  }
  columns;
  name;
  getName() {
    return this.name;
  }
};
__name(UniqueConstraint2, "UniqueConstraint");
_a32 = entityKind;
__publicField(UniqueConstraint2, _a32, "SQLiteUniqueConstraint");

// ../node_modules/drizzle-orm/sqlite-core/columns/common.js
var _a33;
var SQLiteColumnBuilder = class extends ColumnBuilder {
  foreignKeyConfigs = [];
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    return this;
  }
  generatedAlwaysAs(as, config2) {
    this.config.generated = {
      as,
      type: "always",
      mode: config2?.mode ?? "virtual"
    };
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table3) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return ((ref2, actions2) => {
        const builder = new ForeignKeyBuilder2(() => {
          const foreignColumn = ref2();
          return { columns: [column], foreignColumns: [foreignColumn] };
        });
        if (actions2.onUpdate) {
          builder.onUpdate(actions2.onUpdate);
        }
        if (actions2.onDelete) {
          builder.onDelete(actions2.onDelete);
        }
        return builder.build(table3);
      })(ref, actions);
    });
  }
};
__name(SQLiteColumnBuilder, "SQLiteColumnBuilder");
_a33 = entityKind;
__publicField(SQLiteColumnBuilder, _a33, "SQLiteColumnBuilder");
var _a34;
var SQLiteColumn = class extends Column {
  constructor(table3, config2) {
    if (!config2.uniqueName) {
      config2.uniqueName = uniqueKeyName2(table3, [config2.name]);
    }
    super(table3, config2);
    this.table = table3;
  }
};
__name(SQLiteColumn, "SQLiteColumn");
_a34 = entityKind;
__publicField(SQLiteColumn, _a34, "SQLiteColumn");

// ../node_modules/drizzle-orm/sqlite-core/columns/blob.js
var _a35;
var SQLiteBigIntBuilder = class extends SQLiteColumnBuilder {
  constructor(name) {
    super(name, "bigint", "SQLiteBigInt");
  }
  /** @internal */
  build(table3) {
    return new SQLiteBigInt(table3, this.config);
  }
};
__name(SQLiteBigIntBuilder, "SQLiteBigIntBuilder");
_a35 = entityKind;
__publicField(SQLiteBigIntBuilder, _a35, "SQLiteBigIntBuilder");
var _a36;
var SQLiteBigInt = class extends SQLiteColumn {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(value) {
    if (typeof Buffer !== "undefined" && Buffer.from) {
      const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
      return BigInt(buf.toString("utf8"));
    }
    return BigInt(textDecoder.decode(value));
  }
  mapToDriverValue(value) {
    return Buffer.from(value.toString());
  }
};
__name(SQLiteBigInt, "SQLiteBigInt");
_a36 = entityKind;
__publicField(SQLiteBigInt, _a36, "SQLiteBigInt");
var _a37;
var SQLiteBlobJsonBuilder = class extends SQLiteColumnBuilder {
  constructor(name) {
    super(name, "json", "SQLiteBlobJson");
  }
  /** @internal */
  build(table3) {
    return new SQLiteBlobJson(
      table3,
      this.config
    );
  }
};
__name(SQLiteBlobJsonBuilder, "SQLiteBlobJsonBuilder");
_a37 = entityKind;
__publicField(SQLiteBlobJsonBuilder, _a37, "SQLiteBlobJsonBuilder");
var _a38;
var SQLiteBlobJson = class extends SQLiteColumn {
  getSQLType() {
    return "blob";
  }
  mapFromDriverValue(value) {
    if (typeof Buffer !== "undefined" && Buffer.from) {
      const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
      return JSON.parse(buf.toString("utf8"));
    }
    return JSON.parse(textDecoder.decode(value));
  }
  mapToDriverValue(value) {
    return Buffer.from(JSON.stringify(value));
  }
};
__name(SQLiteBlobJson, "SQLiteBlobJson");
_a38 = entityKind;
__publicField(SQLiteBlobJson, _a38, "SQLiteBlobJson");
var _a39;
var SQLiteBlobBufferBuilder = class extends SQLiteColumnBuilder {
  constructor(name) {
    super(name, "buffer", "SQLiteBlobBuffer");
  }
  /** @internal */
  build(table3) {
    return new SQLiteBlobBuffer(table3, this.config);
  }
};
__name(SQLiteBlobBufferBuilder, "SQLiteBlobBufferBuilder");
_a39 = entityKind;
__publicField(SQLiteBlobBufferBuilder, _a39, "SQLiteBlobBufferBuilder");
var _a40;
var SQLiteBlobBuffer = class extends SQLiteColumn {
  mapFromDriverValue(value) {
    if (Buffer.isBuffer(value)) {
      return value;
    }
    return Buffer.from(value);
  }
  getSQLType() {
    return "blob";
  }
};
__name(SQLiteBlobBuffer, "SQLiteBlobBuffer");
_a40 = entityKind;
__publicField(SQLiteBlobBuffer, _a40, "SQLiteBlobBuffer");
function blob(a, b) {
  const { name, config: config2 } = getColumnNameAndConfig(a, b);
  if (config2?.mode === "json") {
    return new SQLiteBlobJsonBuilder(name);
  }
  if (config2?.mode === "bigint") {
    return new SQLiteBigIntBuilder(name);
  }
  return new SQLiteBlobBufferBuilder(name);
}
__name(blob, "blob");

// ../node_modules/drizzle-orm/sqlite-core/columns/custom.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var _a41;
var SQLiteCustomColumnBuilder = class extends SQLiteColumnBuilder {
  constructor(name, fieldConfig, customTypeParams) {
    super(name, "custom", "SQLiteCustomColumn");
    this.config.fieldConfig = fieldConfig;
    this.config.customTypeParams = customTypeParams;
  }
  /** @internal */
  build(table3) {
    return new SQLiteCustomColumn(
      table3,
      this.config
    );
  }
};
__name(SQLiteCustomColumnBuilder, "SQLiteCustomColumnBuilder");
_a41 = entityKind;
__publicField(SQLiteCustomColumnBuilder, _a41, "SQLiteCustomColumnBuilder");
var _a42;
var SQLiteCustomColumn = class extends SQLiteColumn {
  sqlName;
  mapTo;
  mapFrom;
  constructor(table3, config2) {
    super(table3, config2);
    this.sqlName = config2.customTypeParams.dataType(config2.fieldConfig);
    this.mapTo = config2.customTypeParams.toDriver;
    this.mapFrom = config2.customTypeParams.fromDriver;
  }
  getSQLType() {
    return this.sqlName;
  }
  mapFromDriverValue(value) {
    return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
  }
  mapToDriverValue(value) {
    return typeof this.mapTo === "function" ? this.mapTo(value) : value;
  }
};
__name(SQLiteCustomColumn, "SQLiteCustomColumn");
_a42 = entityKind;
__publicField(SQLiteCustomColumn, _a42, "SQLiteCustomColumn");
function customType(customTypeParams) {
  return (a, b) => {
    const { name, config: config2 } = getColumnNameAndConfig(a, b);
    return new SQLiteCustomColumnBuilder(
      name,
      config2,
      customTypeParams
    );
  };
}
__name(customType, "customType");

// ../node_modules/drizzle-orm/sqlite-core/columns/integer.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var _a43;
var SQLiteBaseIntegerBuilder = class extends SQLiteColumnBuilder {
  constructor(name, dataType, columnType) {
    super(name, dataType, columnType);
    this.config.autoIncrement = false;
  }
  primaryKey(config2) {
    if (config2?.autoIncrement) {
      this.config.autoIncrement = true;
    }
    this.config.hasDefault = true;
    return super.primaryKey();
  }
};
__name(SQLiteBaseIntegerBuilder, "SQLiteBaseIntegerBuilder");
_a43 = entityKind;
__publicField(SQLiteBaseIntegerBuilder, _a43, "SQLiteBaseIntegerBuilder");
var _a44;
var SQLiteBaseInteger = class extends SQLiteColumn {
  autoIncrement = this.config.autoIncrement;
  getSQLType() {
    return "integer";
  }
};
__name(SQLiteBaseInteger, "SQLiteBaseInteger");
_a44 = entityKind;
__publicField(SQLiteBaseInteger, _a44, "SQLiteBaseInteger");
var _a45;
var SQLiteIntegerBuilder = class extends SQLiteBaseIntegerBuilder {
  constructor(name) {
    super(name, "number", "SQLiteInteger");
  }
  build(table3) {
    return new SQLiteInteger(
      table3,
      this.config
    );
  }
};
__name(SQLiteIntegerBuilder, "SQLiteIntegerBuilder");
_a45 = entityKind;
__publicField(SQLiteIntegerBuilder, _a45, "SQLiteIntegerBuilder");
var _a46;
var SQLiteInteger = class extends SQLiteBaseInteger {
};
__name(SQLiteInteger, "SQLiteInteger");
_a46 = entityKind;
__publicField(SQLiteInteger, _a46, "SQLiteInteger");
var _a47;
var SQLiteTimestampBuilder = class extends SQLiteBaseIntegerBuilder {
  constructor(name, mode) {
    super(name, "date", "SQLiteTimestamp");
    this.config.mode = mode;
  }
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow() {
    return this.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(table3) {
    return new SQLiteTimestamp(
      table3,
      this.config
    );
  }
};
__name(SQLiteTimestampBuilder, "SQLiteTimestampBuilder");
_a47 = entityKind;
__publicField(SQLiteTimestampBuilder, _a47, "SQLiteTimestampBuilder");
var _a48;
var SQLiteTimestamp = class extends SQLiteBaseInteger {
  mode = this.config.mode;
  mapFromDriverValue(value) {
    if (this.config.mode === "timestamp") {
      return new Date(value * 1e3);
    }
    return new Date(value);
  }
  mapToDriverValue(value) {
    const unix = value.getTime();
    if (this.config.mode === "timestamp") {
      return Math.floor(unix / 1e3);
    }
    return unix;
  }
};
__name(SQLiteTimestamp, "SQLiteTimestamp");
_a48 = entityKind;
__publicField(SQLiteTimestamp, _a48, "SQLiteTimestamp");
var _a49;
var SQLiteBooleanBuilder = class extends SQLiteBaseIntegerBuilder {
  constructor(name, mode) {
    super(name, "boolean", "SQLiteBoolean");
    this.config.mode = mode;
  }
  build(table3) {
    return new SQLiteBoolean(
      table3,
      this.config
    );
  }
};
__name(SQLiteBooleanBuilder, "SQLiteBooleanBuilder");
_a49 = entityKind;
__publicField(SQLiteBooleanBuilder, _a49, "SQLiteBooleanBuilder");
var _a50;
var SQLiteBoolean = class extends SQLiteBaseInteger {
  mode = this.config.mode;
  mapFromDriverValue(value) {
    return Number(value) === 1;
  }
  mapToDriverValue(value) {
    return value ? 1 : 0;
  }
};
__name(SQLiteBoolean, "SQLiteBoolean");
_a50 = entityKind;
__publicField(SQLiteBoolean, _a50, "SQLiteBoolean");
function integer(a, b) {
  const { name, config: config2 } = getColumnNameAndConfig(a, b);
  if (config2?.mode === "timestamp" || config2?.mode === "timestamp_ms") {
    return new SQLiteTimestampBuilder(name, config2.mode);
  }
  if (config2?.mode === "boolean") {
    return new SQLiteBooleanBuilder(name, config2.mode);
  }
  return new SQLiteIntegerBuilder(name);
}
__name(integer, "integer");

// ../node_modules/drizzle-orm/sqlite-core/columns/numeric.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var _a51;
var SQLiteNumericBuilder = class extends SQLiteColumnBuilder {
  constructor(name) {
    super(name, "string", "SQLiteNumeric");
  }
  /** @internal */
  build(table3) {
    return new SQLiteNumeric(
      table3,
      this.config
    );
  }
};
__name(SQLiteNumericBuilder, "SQLiteNumericBuilder");
_a51 = entityKind;
__publicField(SQLiteNumericBuilder, _a51, "SQLiteNumericBuilder");
var _a52;
var SQLiteNumeric = class extends SQLiteColumn {
  mapFromDriverValue(value) {
    if (typeof value === "string")
      return value;
    return String(value);
  }
  getSQLType() {
    return "numeric";
  }
};
__name(SQLiteNumeric, "SQLiteNumeric");
_a52 = entityKind;
__publicField(SQLiteNumeric, _a52, "SQLiteNumeric");
var _a53;
var SQLiteNumericNumberBuilder = class extends SQLiteColumnBuilder {
  constructor(name) {
    super(name, "number", "SQLiteNumericNumber");
  }
  /** @internal */
  build(table3) {
    return new SQLiteNumericNumber(
      table3,
      this.config
    );
  }
};
__name(SQLiteNumericNumberBuilder, "SQLiteNumericNumberBuilder");
_a53 = entityKind;
__publicField(SQLiteNumericNumberBuilder, _a53, "SQLiteNumericNumberBuilder");
var _a54;
var SQLiteNumericNumber = class extends SQLiteColumn {
  mapFromDriverValue(value) {
    if (typeof value === "number")
      return value;
    return Number(value);
  }
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
};
__name(SQLiteNumericNumber, "SQLiteNumericNumber");
_a54 = entityKind;
__publicField(SQLiteNumericNumber, _a54, "SQLiteNumericNumber");
var _a55;
var SQLiteNumericBigIntBuilder = class extends SQLiteColumnBuilder {
  constructor(name) {
    super(name, "bigint", "SQLiteNumericBigInt");
  }
  /** @internal */
  build(table3) {
    return new SQLiteNumericBigInt(
      table3,
      this.config
    );
  }
};
__name(SQLiteNumericBigIntBuilder, "SQLiteNumericBigIntBuilder");
_a55 = entityKind;
__publicField(SQLiteNumericBigIntBuilder, _a55, "SQLiteNumericBigIntBuilder");
var _a56;
var SQLiteNumericBigInt = class extends SQLiteColumn {
  mapFromDriverValue = BigInt;
  mapToDriverValue = String;
  getSQLType() {
    return "numeric";
  }
};
__name(SQLiteNumericBigInt, "SQLiteNumericBigInt");
_a56 = entityKind;
__publicField(SQLiteNumericBigInt, _a56, "SQLiteNumericBigInt");
function numeric(a, b) {
  const { name, config: config2 } = getColumnNameAndConfig(a, b);
  const mode = config2?.mode;
  return mode === "number" ? new SQLiteNumericNumberBuilder(name) : mode === "bigint" ? new SQLiteNumericBigIntBuilder(name) : new SQLiteNumericBuilder(name);
}
__name(numeric, "numeric");

// ../node_modules/drizzle-orm/sqlite-core/columns/real.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var _a57;
var SQLiteRealBuilder = class extends SQLiteColumnBuilder {
  constructor(name) {
    super(name, "number", "SQLiteReal");
  }
  /** @internal */
  build(table3) {
    return new SQLiteReal(table3, this.config);
  }
};
__name(SQLiteRealBuilder, "SQLiteRealBuilder");
_a57 = entityKind;
__publicField(SQLiteRealBuilder, _a57, "SQLiteRealBuilder");
var _a58;
var SQLiteReal = class extends SQLiteColumn {
  getSQLType() {
    return "real";
  }
};
__name(SQLiteReal, "SQLiteReal");
_a58 = entityKind;
__publicField(SQLiteReal, _a58, "SQLiteReal");
function real(name) {
  return new SQLiteRealBuilder(name ?? "");
}
__name(real, "real");

// ../node_modules/drizzle-orm/sqlite-core/columns/text.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var _a59;
var SQLiteTextBuilder = class extends SQLiteColumnBuilder {
  constructor(name, config2) {
    super(name, "string", "SQLiteText");
    this.config.enumValues = config2.enum;
    this.config.length = config2.length;
  }
  /** @internal */
  build(table3) {
    return new SQLiteText(
      table3,
      this.config
    );
  }
};
__name(SQLiteTextBuilder, "SQLiteTextBuilder");
_a59 = entityKind;
__publicField(SQLiteTextBuilder, _a59, "SQLiteTextBuilder");
var _a60;
var SQLiteText = class extends SQLiteColumn {
  enumValues = this.config.enumValues;
  length = this.config.length;
  constructor(table3, config2) {
    super(table3, config2);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
};
__name(SQLiteText, "SQLiteText");
_a60 = entityKind;
__publicField(SQLiteText, _a60, "SQLiteText");
var _a61;
var SQLiteTextJsonBuilder = class extends SQLiteColumnBuilder {
  constructor(name) {
    super(name, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(table3) {
    return new SQLiteTextJson(
      table3,
      this.config
    );
  }
};
__name(SQLiteTextJsonBuilder, "SQLiteTextJsonBuilder");
_a61 = entityKind;
__publicField(SQLiteTextJsonBuilder, _a61, "SQLiteTextJsonBuilder");
var _a62;
var SQLiteTextJson = class extends SQLiteColumn {
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(value) {
    return JSON.parse(value);
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
};
__name(SQLiteTextJson, "SQLiteTextJson");
_a62 = entityKind;
__publicField(SQLiteTextJson, _a62, "SQLiteTextJson");
function text(a, b = {}) {
  const { name, config: config2 } = getColumnNameAndConfig(a, b);
  if (config2.mode === "json") {
    return new SQLiteTextJsonBuilder(name);
  }
  return new SQLiteTextBuilder(name, config2);
}
__name(text, "text");

// ../node_modules/drizzle-orm/sqlite-core/table.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/drizzle-orm/sqlite-core/columns/all.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function getSQLiteColumnBuilders() {
  return {
    blob,
    customType,
    integer,
    numeric,
    real,
    text
  };
}
__name(getSQLiteColumnBuilders, "getSQLiteColumnBuilders");

// ../node_modules/drizzle-orm/sqlite-core/table.js
var InlineForeignKeys = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var _a63;
var SQLiteTable = class extends Table {
  /** @internal */
  [(_a63 = entityKind, Table.Symbol.Columns)];
  /** @internal */
  [InlineForeignKeys] = [];
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
};
__name(SQLiteTable, "SQLiteTable");
__publicField(SQLiteTable, _a63, "SQLiteTable");
/** @internal */
__publicField(SQLiteTable, "Symbol", Object.assign({}, Table.Symbol, {
  InlineForeignKeys
}));
function sqliteTableBase(name, columns, extraConfig, schema2, baseName = name) {
  const rawTable = new SQLiteTable(name, schema2, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getSQLiteColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const table3 = Object.assign(rawTable, builtColumns);
  table3[Table.Symbol.Columns] = builtColumns;
  table3[Table.Symbol.ExtraConfigColumns] = builtColumns;
  if (extraConfig) {
    table3[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table3;
}
__name(sqliteTableBase, "sqliteTableBase");
var sqliteTable = /* @__PURE__ */ __name((name, columns, extraConfig) => {
  return sqliteTableBase(name, columns, extraConfig);
}, "sqliteTable");

// ../node_modules/drizzle-orm/sqlite-core/indexes.js
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var _a64;
var IndexBuilderOn = class {
  constructor(name, unique) {
    this.name = name;
    this.unique = unique;
  }
  on(...columns) {
    return new IndexBuilder(this.name, columns, this.unique);
  }
};
__name(IndexBuilderOn, "IndexBuilderOn");
_a64 = entityKind;
__publicField(IndexBuilderOn, _a64, "SQLiteIndexBuilderOn");
var _a65;
var IndexBuilder = class {
  /** @internal */
  config;
  constructor(name, columns, unique) {
    this.config = {
      name,
      columns,
      unique,
      where: void 0
    };
  }
  /**
   * Condition for partial index.
   */
  where(condition) {
    this.config.where = condition;
    return this;
  }
  /** @internal */
  build(table3) {
    return new Index(this.config, table3);
  }
};
__name(IndexBuilder, "IndexBuilder");
_a65 = entityKind;
__publicField(IndexBuilder, _a65, "SQLiteIndexBuilder");
var _a66;
var Index = class {
  config;
  constructor(config2, table3) {
    this.config = { ...config2, table: table3 };
  }
};
__name(Index, "Index");
_a66 = entityKind;
__publicField(Index, _a66, "SQLiteIndex");
function uniqueIndex(name) {
  return new IndexBuilderOn(name, true);
}
__name(uniqueIndex, "uniqueIndex");

// src/db/schema/tenants.ts
var tenants = sqliteTable("tenants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  domain: text("domain"),
  // Optional primary domain cache
  config: text("config").notNull(),
  // JSON manifest
  status: text("status").notNull().default("active"),
  // Lifecycle/Suspension
  trialEndsAt: integer("trial_ends_at"),
  suspendedAt: integer("suspended_at"),
  suspendedReason: text("suspended_reason"),
  // Ownership
  ownerId: text("owner_id"),
  ownerEmail: text("owner_email"),
  billingEmail: text("billing_email"),
  // Subscription
  planId: text("plan_id"),
  planName: text("plan_name").default("free"),
  billingStatus: text("billing_status").default("current"),
  nextBillingDate: integer("next_billing_date"),
  mrr: integer("mrr").default(0),
  // Resource Limits
  maxUsers: integer("max_users").default(5),
  maxStorage: integer("max_storage").default(1),
  maxApiCalls: integer("max_api_calls").default(1e3),
  // Real-time Usage
  currentUsers: integer("current_users").default(0),
  storageUsed: integer("storage_used").default(0),
  apiCallsThisMonth: integer("api_calls_this_month").default(0),
  // Metadata
  industry: text("industry"),
  companySize: text("company_size"),
  notes: text("notes"),
  tags: text("tags"),
  // Audit
  lastActivityAt: integer("last_activity_at"),
  createdAt: integer("created_at").notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer("updated_at").notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text("created_by"),
  deletedAt: integer("deleted_at")
});

// src/db/schema/domains.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var tenantDomains = sqliteTable("tenant_domains", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  domain: text("domain").notNull().unique(),
  isPrimary: integer("is_primary").notNull().default(0),
  createdAt: integer("created_at").notNull().default(sql`(strftime('%s', 'now'))`)
});

// src/db/schema/audit.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id"),
  event: text("event").notNull(),
  payload: text("payload"),
  // JSON
  createdAt: integer("created_at").notNull().default(sql`(strftime('%s', 'now'))`)
});

// src/db/schema/settings.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var settings2 = sqliteTable("settings", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  moduleId: text("module_id").notNull(),
  key: text("key").notNull(),
  value: text("value"),
  // Will store JSON stringified value
  updatedAt: integer("updated_at").notNull().default(sql`(strftime('%s', 'now'))`)
}, (table3) => ({
  tenantModuleKeyIdx: uniqueIndex("tenant_module_key_idx").on(table3.tenantId, table3.moduleId, table3.key)
}));

// src/lib/migrationLoader.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var MigrationLoader = class {
  isProduction;
  manifest = null;
  constructor() {
    try {
      this.manifest = require_migrations_manifest();
      console.log(`[MigrationLoader] Loaded manifest with ${this.manifest?.migrations.length} files`);
    } catch (e) {
      console.warn('[MigrationLoader] Internal manifest NOT found. Did you run "npm run db:manifest"?');
      this.manifest = { migrations: [] };
    }
    this.isProduction = typeof process === "undefined" || !process.cwd;
  }
  /**
   * Get list of migration files
   */
  async listMigrations() {
    if (this.manifest && this.manifest.migrations.length > 0) {
      return this.manifest.migrations.map((name) => ({
        id: this.extractId(name),
        name
      }));
    }
    if (!this.isProduction) {
      return await this.listFromFilesystem();
    }
    return [];
  }
  /**
   * Read migration SQL content (local only)
   */
  async readMigration(filename) {
    if (this.isProduction) {
      return null;
    }
    try {
      const fs = await Promise.resolve().then(() => (init_fs2(), fs_exports));
      const path = await import("node:path");
      const possiblePaths = [
        path.join(process.cwd(), "db", "migrations", filename),
        path.join(process.cwd(), "..", "db", "migrations", filename),
        path.join(process.cwd(), "backend", "db", "migrations", filename)
      ];
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          return fs.readFileSync(p, "utf-8");
        }
      }
      console.error(`Migration file not found: ${filename}`);
      return null;
    } catch (e) {
      console.error(`Failed to read migration ${filename}:`, e);
      return null;
    }
  }
  /**
   * List migrations from filesystem (local development)
   */
  async listFromFilesystem() {
    try {
      const fs = await Promise.resolve().then(() => (init_fs2(), fs_exports));
      const path = await import("node:path");
      const possiblePaths = [
        path.join(process.cwd(), "db", "migrations"),
        path.join(process.cwd(), "..", "db", "migrations"),
        path.join(process.cwd(), "backend", "db", "migrations")
      ];
      for (const migrationsPath of possiblePaths) {
        if (fs.existsSync(migrationsPath)) {
          console.log(`[MigrationLoader] Found migrations at: ${migrationsPath}`);
          const files = fs.readdirSync(migrationsPath).filter((f) => f.endsWith(".sql")).sort();
          return files.map((name) => ({
            id: this.extractId(name),
            name
          }));
        }
      }
      console.warn(`[MigrationLoader] No migrations directory found. Checked: ${possiblePaths.join(", ")}`);
      return [];
    } catch (e) {
      console.error("Failed to list migrations from filesystem:", e);
      return [];
    }
  }
  /**
   * Extract migration ID from filename
   * Examples:
   * - "0001_initial_schema.sql" -> "0001"
   * - "20240115_add_users.sql" -> "20240115"
   */
  extractId(filename) {
    const nameWithoutExt = filename.replace(".sql", "");
    const match2 = nameWithoutExt.match(/^(\d+)/);
    if (match2) {
      return match2[1];
    }
    return nameWithoutExt;
  }
  /**
   * Generate manifest file (for build scripts)
   */
  static async generateManifest(outputPath) {
    const fs = await Promise.resolve().then(() => (init_fs2(), fs_exports));
    const path = await import("node:path");
    const migrationsDir = path.join(process.cwd(), "db", "migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.error(`Migrations directory not found: ${migrationsDir}`);
      process.exit(1);
    }
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
    const manifest = {
      migrations: files,
      generated: (/* @__PURE__ */ new Date()).toISOString()
    };
    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
    console.log(`\u2705 Generated manifest with ${files.length} migrations`);
    console.log(files);
  }
};
__name(MigrationLoader, "MigrationLoader");

// src/routes/v1/database.ts
var generateId = /* @__PURE__ */ __name(() => {
  try {
    return globalThis.crypto?.randomUUID() || `id_${Math.random().toString(36).slice(2)}`;
  } catch (e) {
    return `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}, "generateId");
var database = new Hono2();
async function logAudit(db, event, payload, tenantId = "system") {
  try {
    await db.prepare(`
            INSERT INTO audit_logs (id, event, payload, tenant_id, created_at)
            VALUES (?, ?, ?, ?, ?)
        `).bind(
      generateId(),
      event,
      typeof payload === "string" ? payload : JSON.stringify(payload),
      tenantId,
      Math.floor(Date.now() / 1e3)
    ).run();
  } catch (e) {
    console.warn("[Audit Log Failed]:", e);
  }
}
__name(logAudit, "logAudit");
database.onError((err, c) => {
  console.error("[Database API Error]:", err);
  return c.json({
    success: false,
    error: err.name || "Internal Error",
    message: err.message || "An unexpected error occurred",
    stack: false ? err.stack : void 0
  }, 500);
});
database.get("/status", async (c) => {
  const db = c.env.DB;
  try {
    const tablesResult = await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle_%'").all();
    const tables = tablesResult.results || [];
    const tableCount = tables.length;
    let totalRecords = 0;
    for (const table3 of tables) {
      try {
        const countRes = await db.prepare(`SELECT count(*) as count FROM ${table3.name}`).first();
        totalRecords += countRes?.count || 0;
      } catch (e) {
        console.warn(`Could not count records for table ${table3.name}:`, e);
      }
    }
    const estimatedSizeBytes = totalRecords * 1024;
    const sizeFormatted = estimatedSizeBytes > 0 ? formatBytes(estimatedSizeBytes) + " (estimated)" : "Managed by D1";
    return c.json({
      status: "healthy",
      sizeBytes: estimatedSizeBytes,
      sizeFormatted,
      tableCount,
      recordCount: totalRecords,
      databaseId: c.env.DB_ID || "worker-db",
      note: "Size is estimated. Use Cloudflare Dashboard for exact metrics."
    });
  } catch (error3) {
    console.error("Database status error:", error3);
    return c.json({ error: "Failed to fetch database status", message: error3.message }, 500);
  }
});
database.get("/tables", async (c) => {
  const db = c.env.DB;
  try {
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const offset = (page - 1) * limit;
    const tablesResult = await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle_%' LIMIT ? OFFSET ?").bind(limit, offset).all();
    const countResult = await db.prepare("SELECT count(*) as total FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle_%'").first();
    const total = countResult?.total || 0;
    const tableNames = (tablesResult.results || []).map((r) => r.name);
    const tables = await Promise.all(tableNames.map(async (name) => {
      let records = 0;
      let colInfo = [];
      try {
        const rowCountResult = await db.prepare(`SELECT count(*) as count FROM ${name}`).first();
        records = rowCountResult?.count || 0;
      } catch (e) {
        console.warn(`Failed to get row count for ${name}:`, e);
      }
      try {
        const colInfoResult = await db.prepare(`PRAGMA table_info(${name})`).all();
        colInfo = colInfoResult.results || [];
      } catch (e) {
        console.warn(`Failed to get PRAGMA table_info for ${name}:`, e);
      }
      return {
        name,
        records,
        columnCount: colInfo.length,
        columns: colInfo
      };
    }));
    return c.json({
      data: tables,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error3) {
    console.error("Database tables error:", error3);
    return c.json({ error: "Failed to fetch tables", message: error3.message }, 500);
  }
});
async function queryD1(accountId, databaseId, token, sql2) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ sql: sql2 })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudflare API Error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  const json = await response.json();
  if (!json.success || !json.result || json.result.length === 0) {
    if (json.errors && json.errors.length > 0) {
      throw new Error(`D1 Query Error: ${JSON.stringify(json.errors)}`);
    }
    return [];
  }
  return json.result[0].results || [];
}
__name(queryD1, "queryD1");
database.get("/tables/remote", async (c) => {
  const accountId = c.env.CLOUDFLARE_ACCOUNT_ID;
  const token = c.env.CLOUDFLARE_API_TOKEN;
  const databaseId = c.env.CLOUDFLARE_DATABASE_ID || "39a4d54d-a335-4e15-bb6b-b02362fa16ea";
  if (!accountId || !token) {
    return c.json({
      success: false,
      message: "Remote stats require CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID environment variables."
    });
  }
  try {
    const tables = await queryD1(accountId, databaseId, token, "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle_%'");
    const tableNames = tables.map((t) => t.name);
    if (tableNames.length === 0) {
      return c.json({ success: true, data: {} });
    }
    const countQueries = tableNames.map((name) => {
      const escapedName = name.replace(/'/g, "''");
      const identifier = `"${name.replace(/"/g, '""')}"`;
      return `SELECT '${escapedName}' as name, count(*) as count, (SELECT count(*) FROM pragma_table_info('${escapedName}')) as columns FROM ${identifier}`;
    });
    const fullQuery = countQueries.join(" UNION ALL ");
    const stats = await queryD1(accountId, databaseId, token, fullQuery);
    const result = {};
    stats.forEach((s) => {
      result[s.name] = { records: s.count, columns: s.columns };
    });
    return c.json({ success: true, data: result });
  } catch (e) {
    console.error("Remote stats error:", e);
    return c.json({ success: false, message: e.message }, 500);
  }
});
database.get("/schema/compare", async (c) => {
  const db = c.env.DB;
  try {
    const diffs = [];
    for (const [key, value] of Object.entries(schema_exports)) {
      if (isDrizzleTable(value)) {
        const tableName = getTableName(value);
        const schemaColumns = getTableColumns(value);
        let remoteColumns = [];
        try {
          const remoteColumnsResult = await db.prepare(`PRAGMA table_info(${tableName})`).all();
          remoteColumns = (remoteColumnsResult.results || []).map((col) => ({
            name: col.name,
            type: col.type,
            notnull: col.notnull === 1,
            pk: col.pk === 1,
            default: col.dflt_value
          }));
        } catch (e) {
          console.warn(`Failed to compare schema for table ${tableName}:`, e);
        }
        const localColumns = Object.values(schemaColumns).map((col) => ({
          name: col.name,
          type: col.getSQLType(),
          notnull: col.notNull,
          default: col.default !== void 0 ? String(col.default) : null
        }));
        const columns = [];
        const allColNames = Array.from(/* @__PURE__ */ new Set([
          ...localColumns.map((c2) => c2.name),
          ...remoteColumns.map((c2) => c2.name)
        ]));
        let mismatch = false;
        for (const name of allColNames) {
          const local = localColumns.find((c2) => c2.name === name);
          const remote = remoteColumns.find((c2) => c2.name === name);
          const isMatch = local && remote && local.type.toUpperCase() === remote.type.toUpperCase() && local.notnull === remote.notnull;
          if (!isMatch)
            mismatch = true;
          columns.push({
            name,
            type: local?.type || remote?.type,
            local: !!local,
            remote: !!remote,
            match: isMatch
          });
        }
        diffs.push({
          table: tableName,
          status: mismatch ? remoteColumns.length === 0 ? "missing" : "mismatch" : "match",
          columns
        });
      }
    }
    return c.json(diffs);
  } catch (error3) {
    console.error("Schema compare error:", error3);
    return c.json({ error: "Failed to compare schema", message: error3.message }, 500);
  }
});
database.get("/export", async (c) => {
  const db = c.env.DB;
  try {
    let sqlDump = "-- D1 Database Export\n";
    sqlDump += `-- Generated: ${(/* @__PURE__ */ new Date()).toISOString()}

`;
    const tablesResult = await db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ).all();
    const tables = tablesResult.results || [];
    for (const table3 of tables) {
      const tableName = table3.name;
      const schemaResult = await db.prepare(
        `SELECT sql FROM sqlite_master WHERE type='table' AND name=?`
      ).bind(tableName).first();
      if (schemaResult) {
        sqlDump += `-- Table: ${tableName}
`;
        sqlDump += `${schemaResult.sql};

`;
      }
      const dataResult = await db.prepare(`SELECT * FROM ${tableName}`).all();
      const rows = dataResult.results || [];
      if (rows.length > 0) {
        sqlDump += `-- Data for ${tableName}
`;
        for (const row of rows) {
          const columns = Object.keys(row);
          const values = Object.values(row).map((v) => {
            if (v === null)
              return "NULL";
            if (typeof v === "string")
              return `'${v.replace(/'/g, "''")}'`;
            return v;
          });
          sqlDump += `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${values.join(", ")});
`;
        }
        sqlDump += "\n";
      }
    }
    return new Response(sqlDump, {
      headers: {
        "Content-Type": "application/sql",
        "Content-Disposition": `attachment; filename="d1-backup-${Date.now()}.sql"`
      }
    });
  } catch (error3) {
    console.error("Database export error:", error3);
    return c.json({ error: "Failed to export database", message: error3.message }, 500);
  }
});
database.get("/migrations", async (c) => {
  const db = c.env.DB;
  try {
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "10");
    const offset = (page - 1) * limit;
    const loader = new MigrationLoader();
    const migrationFiles = await loader.listMigrations();
    let appliedMap = /* @__PURE__ */ new Map();
    const tablesToCheck = ["d1_migrations", "__drizzle_migrations"];
    for (const tableName of tablesToCheck) {
      try {
        const result = await db.prepare(`SELECT * FROM ${tableName}`).all();
        (result.results || []).forEach((m) => {
          const id = String(m.id || "");
          const name = String(m.name || "");
          const appliedAt = m.applied_at || m.created_at;
          const hash = m.hash || null;
          const data = { id, name, hash, appliedAt, status: "applied" };
          if (id)
            appliedMap.set(id, data);
          if (name)
            appliedMap.set(name, data);
          if (name.endsWith(".sql"))
            appliedMap.set(name.replace(".sql", ""), data);
        });
      } catch (e) {
      }
    }
    const allMigrations = migrationFiles.map(({ id: fileId, name }) => {
      const nameWithoutExt = name.replace(".sql", "");
      const applied = appliedMap.get(name) || appliedMap.get(nameWithoutExt) || appliedMap.get(fileId);
      return {
        id: name,
        name,
        status: applied ? "applied" : "pending",
        appliedAt: applied?.appliedAt || null,
        hash: applied?.hash || null
      };
    });
    allMigrations.sort((a, b) => {
      const getNum = /* @__PURE__ */ __name((s) => parseInt(s.match(/^\d+/)?.[0] || "0"), "getNum");
      const numA = getNum(a.name);
      const numB = getNum(b.name);
      if (numA !== numB)
        return numB - numA;
      return b.name.localeCompare(a.name);
    });
    const total = allMigrations.length;
    const sliced = allMigrations.slice(offset, offset + limit);
    return c.json({
      data: sliced,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error3) {
    console.error("Migration fetch error:", error3);
    return c.json({
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
        error: error3.message,
        hint: 'Run "npm run db:manifest" to generate migration manifest'
      }
    });
  }
});
database.post("/migrations/run", async (c) => {
  const db = c.env.DB;
  const { migration } = await c.req.json();
  try {
    if (!migration) {
      return c.json({ success: false, message: "Migration name is required" }, 400);
    }
    const migrationId = migration.replace(".sql", "").match(/^(\d+)/)?.[1] || migration.replace(".sql", "");
    const timestamp = Date.now();
    const existing = await db.prepare("SELECT id FROM __drizzle_migrations WHERE id = ?").bind(migrationId).first();
    if (existing) {
      return c.json({
        success: false,
        message: `Migration ${migration} is already applied`
      }, 400);
    }
    await db.prepare("INSERT INTO __drizzle_migrations (id, hash, created_at) VALUES (?, ?, ?)").bind(migrationId, "manual_apply_" + timestamp, timestamp).run();
    await logAudit(db, "MIGRATION_APPLY", { migration, migrationId });
    return c.json({
      message: `Migration ${migration} marked as applied successfully.`,
      success: true,
      note: "Remember to execute the SQL manually via Wrangler or Cloudflare Dashboard"
    });
  } catch (e) {
    return c.json({ success: false, message: e.message }, 500);
  }
});
database.post("/migrations/rollback", async (c) => {
  const db = c.env.DB;
  try {
    const latest = await db.prepare(
      "SELECT * FROM __drizzle_migrations ORDER BY created_at DESC LIMIT 1"
    ).first();
    if (!latest) {
      return c.json({
        success: false,
        message: "No applied migrations to rollback."
      }, 400);
    }
    const migrationId = latest.id;
    await db.prepare("DELETE FROM __drizzle_migrations WHERE id = ?").bind(migrationId).run();
    await logAudit(db, "MIGRATION_ROLLBACK", { migrationId });
    return c.json({
      success: true,
      message: `Rolled back migration ${migrationId}. It is now marked as pending.`,
      note: "This only unmarked the migration. You may need to manually revert schema changes."
    });
  } catch (e) {
    return c.json({
      success: false,
      message: "Rollback failed: " + e.message
    }, 500);
  }
});
database.post("/schema/sync", async (c) => {
  const db = c.env.DB;
  const { table: table3, action, dryRun } = await c.req.json();
  let drizzleTable = null;
  for (const [key, value] of Object.entries(schema_exports)) {
    if (isDrizzleTable(value) && getTableName(value) === table3) {
      drizzleTable = value;
      break;
    }
  }
  if (!drizzleTable) {
    return c.json({ success: false, message: `Table ${table3} definition not found in schema.` }, 404);
  }
  try {
    const schemaColumns = getTableColumns(drizzleTable);
    const remoteResult = await db.prepare(`PRAGMA table_info(${table3})`).all();
    const remoteColumnNames = new Set((remoteResult.results || []).map((r) => r.name));
    const statements = [];
    for (const [colName, colDef] of Object.entries(schemaColumns)) {
      if (!remoteColumnNames.has(colName)) {
        const col = colDef;
        const type = col.getSQLType();
        const notNull = col.notNull ? "NOT NULL" : "";
        let defaultVal = "";
        if (col.default !== void 0) {
          defaultVal = `DEFAULT ${typeof col.default === "string" ? `'${col.default}'` : col.default}`;
        }
        statements.push(`ALTER TABLE ${table3} ADD COLUMN ${colName} ${type} ${notNull} ${defaultVal};`);
      }
    }
    if (statements.length === 0) {
      return c.json({ success: true, message: "No syncable changes found.", sql: [] });
    }
    if (dryRun) {
      return c.json({ success: true, message: "Dry run generated SQL.", sql: statements });
    }
    for (const sql2 of statements) {
      await db.prepare(sql2.replace(/;$/, "")).run();
    }
    await logAudit(db, "SCHEMA_SYNC", { table: table3, statements: statements.length });
    return c.json({
      message: `Successfully synchronized ${table3}. Applied ${statements.length} changes.`,
      success: true,
      statements
    });
  } catch (e) {
    return c.json({ success: false, message: "Sync failed: " + e.message }, 500);
  }
});
database.get("/audit-logs", async (c) => {
  const db = c.env.DB;
  try {
    const result = await db.prepare("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10").all();
    const logs = (result.results || []).map((log3) => ({
      id: log3.id,
      action: log3.event,
      details: log3.payload,
      createdAt: typeof log3.created_at === "number" ? log3.created_at * 1e3 : log3.created_at,
      type: log3.event.includes("FAIL") ? "error" : "success"
    }));
    return c.json(logs);
  } catch (e) {
    console.error("[Audit logs error]:", e);
    return c.json([]);
  }
});
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0)
    return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
__name(formatBytes, "formatBytes");
function isDrizzleTable(val) {
  return val && typeof val === "object" && Symbol.for("drizzle:IsAlias") in val === false && Symbol.for("drizzle:Name") in val;
}
__name(isDrizzleTable, "isDrizzleTable");
var database_default = database;

// src/routes/v1/modules.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
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
    } catch (error3) {
      console.error("Failed to get modules:", error3);
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
    } catch (error3) {
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
    } catch (error3) {
      console.error("Failed to get module menu:", error3);
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
    } catch (error3) {
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
    } catch (error3) {
      return c.json({ ...module, tenantsEnabled: 0, tenants: [] });
    }
  });
  modules.post("/:id/enable", async (c) => {
    const db = c.env.DB;
    const moduleId = c.req.param("id");
    const { enabledBy } = await c.req.json();
    try {
      const tenants2 = await db.prepare("SELECT id FROM tenants").all();
      for (const tenant of tenants2.results || []) {
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
      return c.json({ success: true, tenantsEnabled: tenants2.results?.length || 0 });
    } catch (error3) {
      return c.json({ error: "Failed to enable module", message: error3.message }, 500);
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
    } catch (error3) {
      return c.json({ error: "Failed to disable module", message: error3.message }, 500);
    }
  });
  modules.get("/:id/tenants", async (c) => {
    const db = c.env.DB;
    const moduleId = c.req.param("id");
    try {
      const tenants2 = await db.prepare(`
        SELECT t.id, t.name, t.slug, t.status,
               ms.enabled, ms.enabled_at, ms.enabled_by
        FROM tenants t
        LEFT JOIN module_status ms ON t.id = ms.tenant_id AND ms.module_id = ?
        ORDER BY t.name
      `).bind(moduleId).all();
      return c.json(tenants2.results);
    } catch (error3) {
      return c.json([]);
    }
  });
  app2.route("/api/v1/modules", modules);
}
__name(registerModulesRoutes, "registerModulesRoutes");

// src/lib/bootstrap.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
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
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
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
    } catch (error3) {
      console.error(`  \u2717 Failed to load ${module.name}:`, error3);
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
app.route("/api/v1/schema", schema_default);
app.route("/api/v1/database", database_default);
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
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
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
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-lHjXsd/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-lHjXsd/middleware-loader.entry.ts
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
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
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
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
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
