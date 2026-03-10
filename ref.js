var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function (b) {
  return (b.raw = b);
};
$jscomp.createTemplateTagFirstArgWithRaw = function (b, N) {
  b.raw = N;
  return b;
};
$jscomp.arrayIteratorImpl = function (b) {
  var N = 0;
  return function () {
    return N < b.length ? { done: !1, value: b[N++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (b) {
  return { next: $jscomp.arrayIteratorImpl(b) };
};
$jscomp.makeIterator = function (b) {
  var N = "undefined" != typeof Symbol && Symbol.iterator && b[Symbol.iterator];
  if (N) return N.call(b);
  if ("number" == typeof b.length) return $jscomp.arrayIterator(b);
  throw Error(String(b) + " is not an iterable or ArrayLike");
};
$jscomp.arrayFromIterator = function (b) {
  for (var N, t = []; !(N = b.next()).done; ) t.push(N.value);
  return t;
};
$jscomp.arrayFromIterable = function (b) {
  return b instanceof Array
    ? b
    : $jscomp.arrayFromIterator($jscomp.makeIterator(b));
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.getGlobal = function (b) {
  b = [
    "object" == typeof globalThis && globalThis,
    b,
    "object" == typeof window && window,
    "object" == typeof self && self,
    "object" == typeof global && global,
  ];
  for (var N = 0; N < b.length; ++N) {
    var t = b[N];
    if (t && t.Math == Math) return t;
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (b, N, t) {
        if (b == Array.prototype || b == Object.prototype) return b;
        b[N] = t.value;
        return b;
      };
$jscomp.IS_SYMBOL_NATIVE =
  "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS =
  !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function (b, N, t) {
  if (!t || null != b) {
    t = $jscomp.propertyToPolyfillSymbol[N];
    if (null == t) return b[N];
    t = b[t];
    return void 0 !== t ? t : b[N];
  }
};
$jscomp.polyfill = function (b, N, t, E) {
  N &&
    ($jscomp.ISOLATE_POLYFILLS
      ? $jscomp.polyfillIsolated(b, N, t, E)
      : $jscomp.polyfillUnisolated(b, N, t, E));
};
$jscomp.polyfillUnisolated = function (b, N, t, E) {
  t = $jscomp.global;
  b = b.split(".");
  for (E = 0; E < b.length - 1; E++) {
    var n = b[E];
    if (!(n in t)) return;
    t = t[n];
  }
  b = b[b.length - 1];
  E = t[b];
  N = N(E);
  N != E &&
    null != N &&
    $jscomp.defineProperty(t, b, { configurable: !0, writable: !0, value: N });
};
$jscomp.polyfillIsolated = function (b, N, t, E) {
  var n = b.split(".");
  b = 1 === n.length;
  E = n[0];
  E = !b && E in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var C = 0; C < n.length - 1; C++) {
    var c = n[C];
    if (!(c in E)) return;
    E = E[c];
  }
  n = n[n.length - 1];
  t = $jscomp.IS_SYMBOL_NATIVE && "es6" === t ? E[n] : null;
  N = N(t);
  null != N &&
    (b
      ? $jscomp.defineProperty($jscomp.polyfills, n, {
          configurable: !0,
          writable: !0,
          value: N,
        })
      : N !== t &&
        (void 0 === $jscomp.propertyToPolyfillSymbol[n] &&
          ((t = (1e9 * Math.random()) >>> 0),
          ($jscomp.propertyToPolyfillSymbol[n] = $jscomp.IS_SYMBOL_NATIVE
            ? $jscomp.global.Symbol(n)
            : $jscomp.POLYFILL_PREFIX + t + "$" + n)),
        $jscomp.defineProperty(E, $jscomp.propertyToPolyfillSymbol[n], {
          configurable: !0,
          writable: !0,
          value: N,
        })));
};
$jscomp.polyfill(
  "Promise",
  function (b) {
    function N() {
      this.batch_ = null;
    }
    function t(c) {
      return c instanceof n
        ? c
        : new n(function (k, g) {
            k(c);
          });
    }
    if (
      b &&
      (!(
        $jscomp.FORCE_POLYFILL_PROMISE ||
        ($jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION &&
          "undefined" === typeof $jscomp.global.PromiseRejectionEvent)
      ) ||
        !$jscomp.global.Promise ||
        -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))
    )
      return b;
    N.prototype.asyncExecute = function (c) {
      if (null == this.batch_) {
        this.batch_ = [];
        var k = this;
        this.asyncExecuteFunction(function () {
          k.executeBatch_();
        });
      }
      this.batch_.push(c);
    };
    var E = $jscomp.global.setTimeout;
    N.prototype.asyncExecuteFunction = function (c) {
      E(c, 0);
    };
    N.prototype.executeBatch_ = function () {
      for (; this.batch_ && this.batch_.length; ) {
        var c = this.batch_;
        this.batch_ = [];
        for (var k = 0; k < c.length; ++k) {
          var g = c[k];
          c[k] = null;
          try {
            g();
          } catch (f) {
            this.asyncThrow_(f);
          }
        }
      }
      this.batch_ = null;
    };
    N.prototype.asyncThrow_ = function (c) {
      this.asyncExecuteFunction(function () {
        throw c;
      });
    };
    var n = function (c) {
      this.state_ = 0;
      this.result_ = void 0;
      this.onSettledCallbacks_ = [];
      this.isRejectionHandled_ = !1;
      var k = this.createResolveAndReject_();
      try {
        c(k.resolve, k.reject);
      } catch (g) {
        k.reject(g);
      }
    };
    n.prototype.createResolveAndReject_ = function () {
      function c(f) {
        return function (a) {
          g || ((g = !0), f.call(k, a));
        };
      }
      var k = this,
        g = !1;
      return { resolve: c(this.resolveTo_), reject: c(this.reject_) };
    };
    n.prototype.resolveTo_ = function (c) {
      if (c === this)
        this.reject_(new TypeError("A Promise cannot resolve to itself"));
      else if (c instanceof n) this.settleSameAsPromise_(c);
      else {
        a: switch (typeof c) {
          case "object":
            var k = null != c;
            break a;
          case "function":
            k = !0;
            break a;
          default:
            k = !1;
        }
        k ? this.resolveToNonPromiseObj_(c) : this.fulfill_(c);
      }
    };
    n.prototype.resolveToNonPromiseObj_ = function (c) {
      var k = void 0;
      try {
        k = c.then;
      } catch (g) {
        this.reject_(g);
        return;
      }
      "function" == typeof k
        ? this.settleSameAsThenable_(k, c)
        : this.fulfill_(c);
    };
    n.prototype.reject_ = function (c) {
      this.settle_(2, c);
    };
    n.prototype.fulfill_ = function (c) {
      this.settle_(1, c);
    };
    n.prototype.settle_ = function (c, k) {
      if (0 != this.state_)
        throw Error(
          "Cannot settle(" +
            c +
            ", " +
            k +
            "): Promise already settled in state" +
            this.state_
        );
      this.state_ = c;
      this.result_ = k;
      2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
      this.executeOnSettledCallbacks_();
    };
    n.prototype.scheduleUnhandledRejectionCheck_ = function () {
      var c = this;
      E(function () {
        if (c.notifyUnhandledRejection_()) {
          var k = $jscomp.global.console;
          "undefined" !== typeof k && k.error(c.result_);
        }
      }, 1);
    };
    n.prototype.notifyUnhandledRejection_ = function () {
      if (this.isRejectionHandled_) return !1;
      var c = $jscomp.global.CustomEvent,
        k = $jscomp.global.Event,
        g = $jscomp.global.dispatchEvent;
      if ("undefined" === typeof g) return !0;
      "function" === typeof c
        ? (c = new c("unhandledrejection", { cancelable: !0 }))
        : "function" === typeof k
        ? (c = new k("unhandledrejection", { cancelable: !0 }))
        : ((c = $jscomp.global.document.createEvent("CustomEvent")),
          c.initCustomEvent("unhandledrejection", !1, !0, c));
      c.promise = this;
      c.reason = this.result_;
      return g(c);
    };
    n.prototype.executeOnSettledCallbacks_ = function () {
      if (null != this.onSettledCallbacks_) {
        for (var c = 0; c < this.onSettledCallbacks_.length; ++c)
          C.asyncExecute(this.onSettledCallbacks_[c]);
        this.onSettledCallbacks_ = null;
      }
    };
    var C = new N();
    n.prototype.settleSameAsPromise_ = function (c) {
      var k = this.createResolveAndReject_();
      c.callWhenSettled_(k.resolve, k.reject);
    };
    n.prototype.settleSameAsThenable_ = function (c, k) {
      var g = this.createResolveAndReject_();
      try {
        c.call(k, g.resolve, g.reject);
      } catch (f) {
        g.reject(f);
      }
    };
    n.prototype.then = function (c, k) {
      function g(h, p) {
        return "function" == typeof h
          ? function (q) {
              try {
                f(h(q));
              } catch (m) {
                a(m);
              }
            }
          : p;
      }
      var f,
        a,
        e = new n(function (h, p) {
          f = h;
          a = p;
        });
      this.callWhenSettled_(g(c, f), g(k, a));
      return e;
    };
    n.prototype.catch = function (c) {
      return this.then(void 0, c);
    };
    n.prototype.callWhenSettled_ = function (c, k) {
      function g() {
        switch (f.state_) {
          case 1:
            c(f.result_);
            break;
          case 2:
            k(f.result_);
            break;
          default:
            throw Error("Unexpected state: " + f.state_);
        }
      }
      var f = this;
      null == this.onSettledCallbacks_
        ? C.asyncExecute(g)
        : this.onSettledCallbacks_.push(g);
      this.isRejectionHandled_ = !0;
    };
    n.resolve = t;
    n.reject = function (c) {
      return new n(function (k, g) {
        g(c);
      });
    };
    n.race = function (c) {
      return new n(function (k, g) {
        for (
          var f = $jscomp.makeIterator(c), a = f.next();
          !a.done;
          a = f.next()
        )
          t(a.value).callWhenSettled_(k, g);
      });
    };
    n.all = function (c) {
      var k = $jscomp.makeIterator(c),
        g = k.next();
      return g.done
        ? t([])
        : new n(function (f, a) {
            function e(q) {
              return function (m) {
                h[q] = m;
                p--;
                0 == p && f(h);
              };
            }
            var h = [],
              p = 0;
            do
              h.push(void 0),
                p++,
                t(g.value).callWhenSettled_(e(h.length - 1), a),
                (g = k.next());
            while (!g.done);
          });
    };
    return n;
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Array.prototype.fill",
  function (b) {
    return b
      ? b
      : function (N, t, E) {
          var n = this.length || 0;
          0 > t && (t = Math.max(0, n + t));
          if (null == E || E > n) E = n;
          E = Number(E);
          0 > E && (E = Math.max(0, n + E));
          for (t = Number(t || 0); t < E; t++) this[t] = N;
          return this;
        };
  },
  "es6",
  "es3"
);
$jscomp.typedArrayFill = function (b) {
  return b ? b : Array.prototype.fill;
};
$jscomp.polyfill(
  "Int8Array.prototype.fill",
  $jscomp.typedArrayFill,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Uint8Array.prototype.fill",
  $jscomp.typedArrayFill,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Uint8ClampedArray.prototype.fill",
  $jscomp.typedArrayFill,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Int16Array.prototype.fill",
  $jscomp.typedArrayFill,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Uint16Array.prototype.fill",
  $jscomp.typedArrayFill,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Int32Array.prototype.fill",
  $jscomp.typedArrayFill,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Uint32Array.prototype.fill",
  $jscomp.typedArrayFill,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Float32Array.prototype.fill",
  $jscomp.typedArrayFill,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Float64Array.prototype.fill",
  $jscomp.typedArrayFill,
  "es6",
  "es5"
);
$jscomp.polyfill(
  "Math.trunc",
  function (b) {
    return b
      ? b
      : function (N) {
          N = Number(N);
          if (isNaN(N) || Infinity === N || -Infinity === N || 0 === N)
            return N;
          var t = Math.floor(Math.abs(N));
          return 0 > N ? -t : t;
        };
  },
  "es6",
  "es3"
);
$jscomp.atMethod = function (b) {
  b = Math.trunc(b) || 0;
  0 > b && (b += this.length);
  if (!(0 > b || b >= this.length)) return this[b];
};
$jscomp.polyfill(
  "Array.prototype.at",
  function (b) {
    return b ? b : $jscomp.atMethod;
  },
  "es_next",
  "es5"
);
$jscomp.typedArrayAt = function (b) {
  return b ? b : $jscomp.atMethod;
};
$jscomp.polyfill(
  "Int8Array.prototype.at",
  $jscomp.typedArrayAt,
  "es_next",
  "es5"
);
$jscomp.polyfill(
  "Uint8Array.prototype.at",
  $jscomp.typedArrayAt,
  "es_next",
  "es5"
);
$jscomp.polyfill(
  "Uint8ClampedArray.prototype.at",
  $jscomp.typedArrayAt,
  "es_next",
  "es5"
);
$jscomp.polyfill(
  "Int16Array.prototype.at",
  $jscomp.typedArrayAt,
  "es_next",
  "es5"
);
$jscomp.polyfill(
  "Uint16Array.prototype.at",
  $jscomp.typedArrayAt,
  "es_next",
  "es5"
);
$jscomp.polyfill(
  "Int32Array.prototype.at",
  $jscomp.typedArrayAt,
  "es_next",
  "es5"
);
$jscomp.polyfill(
  "Uint32Array.prototype.at",
  $jscomp.typedArrayAt,
  "es_next",
  "es5"
);
$jscomp.polyfill(
  "Float32Array.prototype.at",
  $jscomp.typedArrayAt,
  "es_next",
  "es5"
);
$jscomp.polyfill(
  "Float64Array.prototype.at",
  $jscomp.typedArrayAt,
  "es_next",
  "es5"
);
$jscomp.polyfill(
  "String.prototype.at",
  function (b) {
    return b ? b : $jscomp.atMethod;
  },
  "es_next",
  "es5"
);
$jscomp.checkEs6ConformanceViaProxy = function () {
  try {
    var b = {},
      N = Object.create(
        new $jscomp.global.Proxy(b, {
          get: function (t, E, n) {
            return t == b && "q" == E && n == N;
          },
        })
      );
    return !0 === N.q;
  } catch (t) {
    return !1;
  }
};
$jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
$jscomp.ES6_CONFORMANCE =
  $jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS &&
  $jscomp.checkEs6ConformanceViaProxy();
$jscomp.initSymbol = function () {};
$jscomp.polyfill(
  "Symbol",
  function (b) {
    if (b) return b;
    var N = function (C, c) {
      this.$jscomp$symbol$id_ = C;
      $jscomp.defineProperty(this, "description", {
        configurable: !0,
        writable: !0,
        value: c,
      });
    };
    N.prototype.toString = function () {
      return this.$jscomp$symbol$id_;
    };
    var t = "jscomp_symbol_" + ((1e9 * Math.random()) >>> 0) + "_",
      E = 0,
      n = function (C) {
        if (this instanceof n)
          throw new TypeError("Symbol is not a constructor");
        return new N(t + (C || "") + "_" + E++, C);
      };
    return n;
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Symbol.iterator",
  function (b) {
    if (b) return b;
    b = Symbol("Symbol.iterator");
    for (
      var N =
          "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(
            " "
          ),
        t = 0;
      t < N.length;
      t++
    ) {
      var E = $jscomp.global[N[t]];
      "function" === typeof E &&
        "function" != typeof E.prototype[b] &&
        $jscomp.defineProperty(E.prototype, b, {
          configurable: !0,
          writable: !0,
          value: function () {
            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
          },
        });
    }
    return b;
  },
  "es6",
  "es3"
);
$jscomp.iteratorPrototype = function (b) {
  b = { next: b };
  b[Symbol.iterator] = function () {
    return this;
  };
  return b;
};
$jscomp.owns = function (b, N) {
  return Object.prototype.hasOwnProperty.call(b, N);
};
$jscomp.polyfill(
  "WeakMap",
  function (b) {
    function N() {
      if (!b || !Object.seal) return !1;
      try {
        var f = Object.seal({}),
          a = Object.seal({}),
          e = new b([
            [f, 2],
            [a, 3],
          ]);
        if (2 != e.get(f) || 3 != e.get(a)) return !1;
        e.delete(f);
        e.set(a, 4);
        return !e.has(f) && 4 == e.get(a);
      } catch (h) {
        return !1;
      }
    }
    function t() {}
    function E(f) {
      var a = typeof f;
      return ("object" === a && null !== f) || "function" === a;
    }
    function n(f) {
      if (!$jscomp.owns(f, c)) {
        var a = new t();
        $jscomp.defineProperty(f, c, { value: a });
      }
    }
    function C(f) {
      if (!$jscomp.ISOLATE_POLYFILLS) {
        var a = Object[f];
        a &&
          (Object[f] = function (e) {
            if (e instanceof t) return e;
            Object.isExtensible(e) && n(e);
            return a(e);
          });
      }
    }
    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
      if (b && $jscomp.ES6_CONFORMANCE) return b;
    } else if (N()) return b;
    var c = "$jscomp_hidden_" + Math.random();
    C("freeze");
    C("preventExtensions");
    C("seal");
    var k = 0,
      g = function (f) {
        this.id_ = (k += Math.random() + 1).toString();
        if (f) {
          f = $jscomp.makeIterator(f);
          for (var a; !(a = f.next()).done; )
            (a = a.value), this.set(a[0], a[1]);
        }
      };
    g.prototype.set = function (f, a) {
      if (!E(f)) throw Error("Invalid WeakMap key");
      n(f);
      if (!$jscomp.owns(f, c)) throw Error("WeakMap key fail: " + f);
      f[c][this.id_] = a;
      return this;
    };
    g.prototype.get = function (f) {
      return E(f) && $jscomp.owns(f, c) ? f[c][this.id_] : void 0;
    };
    g.prototype.has = function (f) {
      return E(f) && $jscomp.owns(f, c) && $jscomp.owns(f[c], this.id_);
    };
    g.prototype.delete = function (f) {
      return E(f) && $jscomp.owns(f, c) && $jscomp.owns(f[c], this.id_)
        ? delete f[c][this.id_]
        : !1;
    };
    return g;
  },
  "es6",
  "es3"
);
$jscomp.MapEntry = function () {};
$jscomp.polyfill(
  "Map",
  function (b) {
    function N() {
      if (
        $jscomp.ASSUME_NO_NATIVE_MAP ||
        !b ||
        "function" != typeof b ||
        !b.prototype.entries ||
        "function" != typeof Object.seal
      )
        return !1;
      try {
        var g = Object.seal({ x: 4 }),
          f = new b($jscomp.makeIterator([[g, "s"]]));
        if (
          "s" != f.get(g) ||
          1 != f.size ||
          f.get({ x: 4 }) ||
          f.set({ x: 4 }, "t") != f ||
          2 != f.size
        )
          return !1;
        var a = f.entries(),
          e = a.next();
        if (e.done || e.value[0] != g || "s" != e.value[1]) return !1;
        e = a.next();
        return e.done ||
          4 != e.value[0].x ||
          "t" != e.value[1] ||
          !a.next().done
          ? !1
          : !0;
      } catch (h) {
        return !1;
      }
    }
    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
      if (b && $jscomp.ES6_CONFORMANCE) return b;
    } else if (N()) return b;
    var t = new WeakMap(),
      E = function (g) {
        this[0] = {};
        this[1] = c();
        this.size = 0;
        if (g) {
          g = $jscomp.makeIterator(g);
          for (var f; !(f = g.next()).done; )
            (f = f.value), this.set(f[0], f[1]);
        }
      };
    E.prototype.set = function (g, f) {
      g = 0 === g ? 0 : g;
      var a = n(this, g);
      a.list || (a.list = this[0][a.id] = []);
      a.entry
        ? (a.entry.value = f)
        : ((a.entry = {
            next: this[1],
            previous: this[1].previous,
            head: this[1],
            key: g,
            value: f,
          }),
          a.list.push(a.entry),
          (this[1].previous.next = a.entry),
          (this[1].previous = a.entry),
          this.size++);
      return this;
    };
    E.prototype.delete = function (g) {
      g = n(this, g);
      return g.entry && g.list
        ? (g.list.splice(g.index, 1),
          g.list.length || delete this[0][g.id],
          (g.entry.previous.next = g.entry.next),
          (g.entry.next.previous = g.entry.previous),
          (g.entry.head = null),
          this.size--,
          !0)
        : !1;
    };
    E.prototype.clear = function () {
      this[0] = {};
      this[1] = this[1].previous = c();
      this.size = 0;
    };
    E.prototype.has = function (g) {
      return !!n(this, g).entry;
    };
    E.prototype.get = function (g) {
      return (g = n(this, g).entry) && g.value;
    };
    E.prototype.entries = function () {
      return C(this, function (g) {
        return [g.key, g.value];
      });
    };
    E.prototype.keys = function () {
      return C(this, function (g) {
        return g.key;
      });
    };
    E.prototype.values = function () {
      return C(this, function (g) {
        return g.value;
      });
    };
    E.prototype.forEach = function (g, f) {
      for (var a = this.entries(), e; !(e = a.next()).done; )
        (e = e.value), g.call(f, e[1], e[0], this);
    };
    E.prototype[Symbol.iterator] = E.prototype.entries;
    var n = function (g, f) {
        var a = f && typeof f;
        "object" == a || "function" == a
          ? t.has(f)
            ? (a = t.get(f))
            : ((a = "" + ++k), t.set(f, a))
          : (a = "p_" + f);
        var e = g[0][a];
        if (e && $jscomp.owns(g[0], a))
          for (g = 0; g < e.length; g++) {
            var h = e[g];
            if ((f !== f && h.key !== h.key) || f === h.key)
              return { id: a, list: e, index: g, entry: h };
          }
        return { id: a, list: e, index: -1, entry: void 0 };
      },
      C = function (g, f) {
        var a = g[1];
        return $jscomp.iteratorPrototype(function () {
          if (a) {
            for (; a.head != g[1]; ) a = a.previous;
            for (; a.next != a.head; )
              return (a = a.next), { done: !1, value: f(a) };
            a = null;
          }
          return { done: !0, value: void 0 };
        });
      },
      c = function () {
        var g = {};
        return (g.previous = g.next = g.head = g);
      },
      k = 0;
    return E;
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Math.clz32",
  function (b) {
    return b
      ? b
      : function (N) {
          N = Number(N) >>> 0;
          if (0 === N) return 32;
          var t = 0;
          0 === (N & 4294901760) && ((N <<= 16), (t += 16));
          0 === (N & 4278190080) && ((N <<= 8), (t += 8));
          0 === (N & 4026531840) && ((N <<= 4), (t += 4));
          0 === (N & 3221225472) && ((N <<= 2), (t += 2));
          0 === (N & 2147483648) && t++;
          return t;
        };
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Set",
  function (b) {
    function N() {
      if (
        $jscomp.ASSUME_NO_NATIVE_SET ||
        !b ||
        "function" != typeof b ||
        !b.prototype.entries ||
        "function" != typeof Object.seal
      )
        return !1;
      try {
        var E = Object.seal({ x: 4 }),
          n = new b($jscomp.makeIterator([E]));
        if (
          !n.has(E) ||
          1 != n.size ||
          n.add(E) != n ||
          1 != n.size ||
          n.add({ x: 4 }) != n ||
          2 != n.size
        )
          return !1;
        var C = n.entries(),
          c = C.next();
        if (c.done || c.value[0] != E || c.value[1] != E) return !1;
        c = C.next();
        return c.done ||
          c.value[0] == E ||
          4 != c.value[0].x ||
          c.value[1] != c.value[0]
          ? !1
          : C.next().done;
      } catch (k) {
        return !1;
      }
    }
    if ($jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
      if (b && $jscomp.ES6_CONFORMANCE) return b;
    } else if (N()) return b;
    var t = function (E) {
      this.map_ = new Map();
      if (E) {
        E = $jscomp.makeIterator(E);
        for (var n; !(n = E.next()).done; ) this.add(n.value);
      }
      this.size = this.map_.size;
    };
    t.prototype.add = function (E) {
      E = 0 === E ? 0 : E;
      this.map_.set(E, E);
      this.size = this.map_.size;
      return this;
    };
    t.prototype.delete = function (E) {
      E = this.map_.delete(E);
      this.size = this.map_.size;
      return E;
    };
    t.prototype.clear = function () {
      this.map_.clear();
      this.size = 0;
    };
    t.prototype.has = function (E) {
      return this.map_.has(E);
    };
    t.prototype.entries = function () {
      return this.map_.entries();
    };
    t.prototype.values = function () {
      return this.map_.values();
    };
    t.prototype.keys = t.prototype.values;
    t.prototype[Symbol.iterator] = t.prototype.values;
    t.prototype.forEach = function (E, n) {
      var C = this;
      this.map_.forEach(function (c) {
        return E.call(n, c, c, C);
      });
    };
    return t;
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Math.hypot",
  function (b) {
    return b
      ? b
      : function (N) {
          if (2 > arguments.length)
            return arguments.length ? Math.abs(arguments[0]) : 0;
          var t, E, n;
          for (t = n = 0; t < arguments.length; t++)
            n = Math.max(n, Math.abs(arguments[t]));
          if (1e100 < n || 1e-100 > n) {
            if (!n) return n;
            for (t = E = 0; t < arguments.length; t++) {
              var C = Number(arguments[t]) / n;
              E += C * C;
            }
            return Math.sqrt(E) * n;
          }
          for (t = E = 0; t < arguments.length; t++)
            (C = Number(arguments[t])), (E += C * C);
          return Math.sqrt(E);
        };
  },
  "es6",
  "es3"
);
$jscomp.checkStringArgs = function (b, N, t) {
  if (null == b)
    throw new TypeError(
      "The 'this' value for String.prototype." +
        t +
        " must not be null or undefined"
    );
  if (N instanceof RegExp)
    throw new TypeError(
      "First argument to String.prototype." +
        t +
        " must not be a regular expression"
    );
  return b + "";
};
$jscomp.polyfill(
  "String.prototype.startsWith",
  function (b) {
    return b
      ? b
      : function (N, t) {
          var E = $jscomp.checkStringArgs(this, N, "startsWith");
          N += "";
          var n = E.length,
            C = N.length;
          t = Math.max(0, Math.min(t | 0, E.length));
          for (var c = 0; c < C && t < n; ) if (E[t++] != N[c++]) return !1;
          return c >= C;
        };
  },
  "es6",
  "es3"
);
$jscomp.findInternal = function (b, N, t) {
  b instanceof String && (b = String(b));
  for (var E = b.length, n = 0; n < E; n++) {
    var C = b[n];
    if (N.call(t, C, n, b)) return { i: n, v: C };
  }
  return { i: -1, v: void 0 };
};
$jscomp.polyfill(
  "Array.prototype.find",
  function (b) {
    return b
      ? b
      : function (N, t) {
          return $jscomp.findInternal(this, N, t).v;
        };
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Array.prototype.flat",
  function (b) {
    return b
      ? b
      : function (N) {
          N = void 0 === N ? 1 : N;
          var t = [];
          Array.prototype.forEach.call(this, function (E) {
            Array.isArray(E) && 0 < N
              ? ((E = Array.prototype.flat.call(E, N - 1)), t.push.apply(t, E))
              : t.push(E);
          });
          return t;
        };
  },
  "es9",
  "es5"
);
$jscomp.polyfill(
  "Array.from",
  function (b) {
    return b
      ? b
      : function (N, t, E) {
          t =
            null != t
              ? t
              : function (k) {
                  return k;
                };
          var n = [],
            C =
              "undefined" != typeof Symbol &&
              Symbol.iterator &&
              N[Symbol.iterator];
          if ("function" == typeof C) {
            N = C.call(N);
            for (var c = 0; !(C = N.next()).done; )
              n.push(t.call(E, C.value, c++));
          } else
            for (C = N.length, c = 0; c < C; c++) n.push(t.call(E, N[c], c));
          return n;
        };
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "String.prototype.repeat",
  function (b) {
    return b
      ? b
      : function (N) {
          var t = $jscomp.checkStringArgs(this, null, "repeat");
          if (0 > N || 1342177279 < N)
            throw new RangeError("Invalid count value");
          N |= 0;
          for (var E = ""; N; ) if ((N & 1 && (E += t), (N >>>= 1))) t += t;
          return E;
        };
  },
  "es6",
  "es3"
);
$jscomp.stringPadding = function (b, N) {
  b = void 0 !== b ? String(b) : " ";
  return 0 < N && b ? b.repeat(Math.ceil(N / b.length)).substring(0, N) : "";
};
$jscomp.polyfill(
  "String.prototype.padStart",
  function (b) {
    return b
      ? b
      : function (N, t) {
          var E = $jscomp.checkStringArgs(this, null, "padStart");
          return $jscomp.stringPadding(t, N - E.length) + E;
        };
  },
  "es8",
  "es3"
);
$jscomp.polyfill(
  "String.prototype.endsWith",
  function (b) {
    return b
      ? b
      : function (N, t) {
          var E = $jscomp.checkStringArgs(this, N, "endsWith");
          N += "";
          void 0 === t && (t = E.length);
          t = Math.max(0, Math.min(t | 0, E.length));
          for (var n = N.length; 0 < n && 0 < t; )
            if (E[--t] != N[--n]) return !1;
          return 0 >= n;
        };
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "String.prototype.padEnd",
  function (b) {
    return b
      ? b
      : function (N, t) {
          var E = $jscomp.checkStringArgs(this, null, "padStart");
          return E + $jscomp.stringPadding(t, N - E.length);
        };
  },
  "es8",
  "es3"
);
$jscomp.iteratorFromArray = function (b, N) {
  b instanceof String && (b += "");
  var t = 0,
    E = !1,
    n = {
      next: function () {
        if (!E && t < b.length) {
          var C = t++;
          return { value: N(C, b[C]), done: !1 };
        }
        E = !0;
        return { done: !0, value: void 0 };
      },
    };
  n[Symbol.iterator] = function () {
    return n;
  };
  return n;
};
$jscomp.polyfill(
  "Array.prototype.keys",
  function (b) {
    return b
      ? b
      : function () {
          return $jscomp.iteratorFromArray(this, function (N) {
            return N;
          });
        };
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "String.prototype.replaceAll",
  function (b) {
    return b
      ? b
      : function (N, t) {
          if (N instanceof RegExp && !N.global)
            throw new TypeError(
              "String.prototype.replaceAll called with a non-global RegExp argument."
            );
          return N instanceof RegExp
            ? this.replace(N, t)
            : this.replace(
                new RegExp(
                  String(N)
                    .replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1")
                    .replace(/\x08/g, "\\x08"),
                  "g"
                ),
                t
              );
        };
  },
  "es_2021",
  "es3"
);
$jscomp.polyfill(
  "Math.log10",
  function (b) {
    return b
      ? b
      : function (N) {
          return Math.log(N) / Math.LN10;
        };
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Object.values",
  function (b) {
    return b
      ? b
      : function (N) {
          var t = [],
            E;
          for (E in N) $jscomp.owns(N, E) && t.push(N[E]);
          return t;
        };
  },
  "es8",
  "es3"
);
$jscomp.polyfill(
  "Promise.prototype.finally",
  function (b) {
    return b
      ? b
      : function (N) {
          return this.then(
            function (t) {
              return Promise.resolve(N()).then(function () {
                return t;
              });
            },
            function (t) {
              return Promise.resolve(N()).then(function () {
                throw t;
              });
            }
          );
        };
  },
  "es9",
  "es3"
);
var isInNode =
    "object" === typeof process &&
    "function" === typeof require &&
    "object" === typeof global,
  isInWorker =
    ("undefined" !== typeof WorkerGlobalScope &&
      self instanceof WorkerGlobalScope) ||
    isInNode,
  ISCSTIMER = !0;
function execBoth(b, N, t) {
  return !isInWorker && b
    ? b.apply(this, t || [])
    : isInWorker && N
    ? N.apply(this, t || [])
    : {};
}
function execWorker(b, N) {
  return execBoth(void 0, b, N);
}
function execMain(b, N) {
  return execBoth(b, void 0, N);
}
execWorker(function () {
  isInNode && (global.self = global);
  self.$ = {
    isArray: Array.isArray,
    noop: function () {},
    now: function () {
      return +new Date();
    },
  };
});
ISCSTIMER &&
  execMain(function () {
    $.beacon = function (t, E) {
      E = E || "stat.php";
      t = "string" == typeof t ? t : JSON.stringify(t);
      navigator.sendBeacon ? navigator.sendBeacon(E, t) : $.post(E, t);
    };
    window.onerror = function (t, E, n, C, c) {
      if ((n || C) && !/extension|adsbygoogle/i.exec(E) && /\.js/i.exec(E)) {
        void 0 == c && (c = {});
        var k = "";
        try {
          k = $.fingerprint();
        } catch (g) {}
        $.beacon(
          {
            version: CSTIMER_VERSION,
            fp: k,
            msg: t,
            url: E,
            line: n,
            col: C,
            stack: c.stack,
          },
          "bug.php"
        );
        DEBUG && console.log(CSTIMER_VERSION, k, t, E, n, C, c);
      }
    };
    for (
      var b =
          "CSTIMER_VERSION LANG_SET LANG_STR LANG_CUR OK_LANG CANCEL_LANG RESET_LANG ABOUT_LANG ZOOM_LANG COPY_LANG BUTTON_TIME_LIST BUTTON_OPTIONS BUTTON_EXPORT BUTTON_DONATE PROPERTY_SR PROPERTY_USEINS PROPERTY_USEINS_STR PROPERTY_SHOWINS PROPERTY_VOICEINS PROPERTY_VOICEINS_STR PROPERTY_VOICEVOL PROPERTY_PHASES PROPERTY_TIMERSIZE PROPERTY_USEMILLI PROPERTY_SMALLADP PROPERTY_SCRSIZE PROPERTY_SCRMONO PROPERTY_SCRLIM PROPERTY_SCRALIGN PROPERTY_SCRALIGN_STR PROPERTY_SCRWRAP PROPERTY_SCRWRAP_STR PROPERTY_SCRNEUT PROPERTY_SCRNEUT_STR PROPERTY_SCREQPR PROPERTY_SCREQPR_STR PROPERTY_SCRFAST PROPERTY_SCRKEYM PROPERTY_SCRCLK PROPERTY_SCRCLK_STR PROPERTY_WNDSCR PROPERTY_WNDSTAT PROPERTY_WNDTOOL PROPERTY_WND_STR EXPORT_DATAEXPORT EXPORT_TOFILE EXPORT_FROMFILE EXPORT_TOSERV EXPORT_FROMSERV EXPORT_FROMOTHER EXPORT_USERID EXPORT_INVID EXPORT_ERROR EXPORT_NODATA EXPORT_UPLOADED EXPORT_CODEPROMPT EXPORT_ONLYOPT EXPORT_ACCOUNT EXPORT_LOGINGGL EXPORT_LOGINWCA EXPORT_LOGOUTCFM EXPORT_LOGINAUTHED EXPORT_AEXPALERT EXPORT_WHICH EXPORT_WHICH_ITEM IMPORT_FINAL_CONFIRM BUTTON_SCRAMBLE BUTTON_TOOLS IMAGE_UNAVAILABLE TOOLS_SELECTFUNC TOOLS_CROSS TOOLS_EOLINE TOOLS_ROUX1 TOOLS_222FACE TOOLS_GIIKER TOOLS_IMAGE TOOLS_STATS TOOLS_HUGESTATS TOOLS_DISTRIBUTION TOOLS_TREND TOOLS_METRONOME TOOLS_RECONS TOOLS_RECONS_NODATA TOOLS_RECONS_TITLE TOOLS_TRAINSTAT TOOLS_BLDHELPER TOOLS_CFMTIME TOOLS_SOLVERS TOOLS_DLYSTAT TOOLS_DLYSTAT1 TOOLS_DLYSTAT_OPT1 TOOLS_DLYSTAT_OPT2 TOOLS_SYNCSEED TOOLS_SYNCSEED_SEED TOOLS_SYNCSEED_INPUT TOOLS_SYNCSEED_30S TOOLS_SYNCSEED_HELP TOOLS_SYNCSEED_DISABLE TOOLS_SYNCSEED_INPUTA TOOLS_BATTLE TOOLS_BATTLE_HEAD TOOLS_BATTLE_TITLE TOOLS_BATTLE_STATUS TOOLS_BATTLE_INFO TOOLS_BATTLE_JOINALERT TOOLS_BATTLE_LEAVEALERT OLCOMP_UPDATELIST OLCOMP_VIEWRESULT OLCOMP_VIEWMYRESULT OLCOMP_START OLCOMP_SUBMIT OLCOMP_SUBMITAS OLCOMP_WCANOTICE OLCOMP_OLCOMP OLCOMP_ANONYM OLCOMP_ME OLCOMP_WCAACCOUNT OLCOMP_ABORT OLCOMP_WITHANONYM PROPERTY_IMGSIZE PROPERTY_IMGREP TIMER_INSPECT TIMER_SOLVE PROPERTY_USEMOUSE PROPERTY_TIMEU PROPERTY_TIMEU_STR PROPERTY_PRETIME PROPERTY_ENTERING PROPERTY_ENTERING_STR PROPERTY_INTUNIT PROPERTY_INTUNIT_STR PROPERTY_COLOR PROPERTY_COLORS PROPERTY_VIEW PROPERTY_VIEW_STR PROPERTY_UIDESIGN PROPERTY_UIDESIGN_STR COLOR_EXPORT COLOR_IMPORT COLOR_FAIL PROPERTY_FONTCOLOR_STR PROPERTY_COLOR_STR PROPERTY_FONT PROPERTY_FONT_STR PROPERTY_FORMAT PROPERTY_USEKSC PROPERTY_USEGES PROPERTY_NTOOLS PROPERTY_AHIDE SCRAMBLE_LAST SCRAMBLE_NEXT SCRAMBLE_SCRAMBLE SCRAMBLE_SCRAMBLING SCRAMBLE_LENGTH SCRAMBLE_INPUT SCRAMBLE_INPUTTYPE PROPERTY_VRCSPEED PROPERTY_VRCORI PROPERTY_VRCMP PROPERTY_VRCMPS PROPERTY_GIIKERVRC PROPERTY_GIISOK_DELAY PROPERTY_GIISOK_DELAYS PROPERTY_GIISOK_KEY PROPERTY_GIISOK_MOVE PROPERTY_GIISOK_MOVES PROPERTY_GIISBEEP PROPERTY_GIIRST PROPERTY_GIIRSTS PROPERTY_GIIMODE PROPERTY_GIIMODES PROPERTY_VRCAH PROPERTY_VRCAHS CONFIRM_GIIRST PROPERTY_GIIAED scrdata SCRAMBLE_NOOBST SCRAMBLE_NOOBSS SCROPT_TITLE SCROPT_BTNALL SCROPT_BTNNONE SCROPT_EMPTYALT STATS_CFM_RESET STATS_CFM_DELSS STATS_CFM_DELMUL STATS_CFM_DELETE STATS_COMMENT STATS_REVIEW STATS_DATE STATS_SSSTAT STATS_SSRETRY STATS_CURROUND STATS_CURSESSION STATS_CURSPLIT STATS_EXPORTCSV STATS_SSMGR_TITLE STATS_SSMGR_NAME STATS_SSMGR_DETAIL STATS_SSMGR_OPS STATS_SSMGR_ORDER STATS_SSMGR_ODCFM STATS_SSMGR_SORTCFM STATS_ALERTMG STATS_PROMPTSPL STATS_ALERTSPL STATS_AVG STATS_SUM STATS_SOLVE STATS_TIME STATS_SESSION STATS_SESSION_NAME STATS_SESSION_NAMEC STATS_STRING STATS_PREC STATS_PREC_STR STATS_TYPELEN STATS_STATCLR STATS_ABSIDX STATS_XSESSION_DATE STATS_XSESSION_NAME STATS_XSESSION_SCR STATS_XSESSION_CALC STATS_RSFORSS PROPERTY_PRINTSCR PROPERTY_PRINTCOMM PROPERTY_PRINTDATE PROPERTY_SUMMARY PROPERTY_IMRENAME PROPERTY_SCR2SS PROPERTY_SS2SCR PROPERTY_SS2PHASES PROPERTY_STATINV PROPERTY_STATSSUM PROPERTY_STATTHRES PROPERTY_STATBPA PROPERTY_STATWPA PROPERTY_STATAL PROPERTY_STATALU PROPERTY_HLPBS PROPERTY_HLPBS_STR PROPERTY_DELMUL PROPERTY_TOOLSFUNC PROPERTY_TRIM PROPERTY_TRIMR PROPERTY_TRIM_MED PROPERTY_STKHEAD PROPERTY_TOOLPOS PROPERTY_TOOLPOS_STR PROPERTY_HIDEFULLSOL PROPERTY_IMPPREV PROPERTY_AUTOEXP PROPERTY_AUTOEXP_OPT PROPERTY_SCRASIZE MODULE_NAMES BGIMAGE_URL BGIMAGE_INVALID BGIMAGE_OPACITY BGIMAGE_IMAGE BGIMAGE_IMAGE_STR SHOW_AVG_LABEL SHOW_DIFF_LABEL SHOW_DIFF_LABEL_STR USE_LOGOHINT TOOLS_SCRGEN SCRGEN_NSCR SCRGEN_PRE SCRGEN_GEN VRCREPLAY_TITLE VRCREPLAY_ORI VRCREPLAY_SHARE GIIKER_CONNECT GIIKER_RESET GIIKER_REQMACMSG GIIKER_NOBLEMSG PROPERTY_SHOWAD PROPERTY_GIIORI LGHINT_INVALID LGHINT_NETERR LGHINT_SERVERR LGHINT_SUBMITED LGHINT_SSBEST LGHINT_SCRCOPY LGHINT_LINKCOPY LGHINT_SOLVCOPY LGHINT_SORT0 LGHINT_IMPORTED LGHINT_IMPORT0 LGHINT_BTCONSUC LGHINT_BTDISCON LGHINT_BTNOTSUP LGHINT_BTINVMAC LGHINT_AEXPABT LGHINT_AEXPSUC LGHINT_AEXPFAL EASY_SCRAMBLE_HINT".split(
            " "
          ),
        N = 0;
      N < b.length;
      N++
    )
      window[b[N]] = window[b[N]] || "|||||||||||||||";
    window.requestAnimFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (t, E) {
          return window.setTimeout(t, 1e3 / 60);
        }
      );
    })();
    window.localStorage || (window.localStorage = {});
    "properties" in localStorage ||
      "https:" == location.protocol ||
      "localhost" == location.hostname ||
      (location.href =
        "https:" + location.href.substring(location.protocol.length));
    window.performance &&
      window.performance.now &&
      ($.now = function () {
        return Math.floor(window.performance.now());
      });
    $.urlParam = function (t) {
      t = new RegExp("[?&]" + t + "=([^&#]*)").exec(window.location.href);
      return null == t ? null : t[1] || 0;
    };
    $.hashParam = function (t) {
      t = new RegExp("[#&]" + t + "=([^&#]*)").exec(window.location.hash);
      return null == t ? null : t[1] || 0;
    };
    $.clearUrl = function (t) {
      var E = new RegExp("[?&](" + t + "=[^&#]*&?)").exec(window.location.href);
      t = t
        ? location.href.replace(E[1], "").replace(/\?$/, "")
        : location.pathname;
      history && history.replaceState
        ? history.replaceState(void 0, void 0, t)
        : (location.href = t);
    };
    $.clearHash = function (t) {
      var E = new RegExp("[#&](" + t + "=[^&#]*&?)").exec(window.location.href);
      t = t
        ? location.href.replace(E[1], "").replace(/#$/, "")
        : location.pathname + location.search;
      history && history.replaceState
        ? history.replaceState(void 0, void 0, t)
        : (location.href = t);
    };
    $.clipboardCopy = function (t) {
      if (navigator.clipboard && navigator.clipboard.writeText)
        return navigator.clipboard.writeText(t);
      DEBUG && console.log("[utillib] clipboard copy fallback");
      t = $("<textarea>" + t + "</textarea>").appendTo(document.body);
      t.focus().select();
      var E = !1;
      try {
        E = document.execCommand("copy");
      } catch (n) {}
      t.remove();
      return E ? Promise.resolve() : Promise.reject();
    };
    $.fingerprint = function () {
      var t =
          window.screen &&
          [
            Math.max(screen.height, screen.width),
            Math.min(screen.height, screen.width),
            screen.colorDepth,
          ].join("x"),
        E = new Date().getTimezoneOffset(),
        n = $.map(navigator.plugins, function (C) {
          return [
            C.name,
            C.description,
            $.map(C, function (c) {
              return [c.type, c.suffixes].join("~");
            })
              .sort()
              .join(","),
          ].join("::");
        })
          .sort()
          .join(";");
      t = [
        navigator.userAgent,
        navigator.language,
        !!window.sessionStorage,
        !!window.localStorage,
        !!window.indexedDB,
        navigator.doNotTrack,
        t,
        E,
        n,
      ].join("###");
      return $.sha256(t);
    };
    $.delayExec = (function () {
      var t = {};
      return function (E, n, C) {
        t[E] && (clearTimeout(t[E][0]), delete t[E]);
        C = setTimeout(n, C);
        t[E] = [C, n];
      };
    })();
    $.waitUser = (function () {
      var t = [];
      return {
        reg: function (E) {
          t.push(E);
        },
        call: function () {
          for (var E = 0; E < t.length; E++) t[E]();
          t = [];
        },
      };
    })();
    $.ppost = function (t, E, n) {
      return new Promise(function (C, c) {
        $.post(t, E, C, n).error(c);
      });
    };
    (function () {
      var t = null;
      $.alert = function (E) {
        var n = $.now();
        alert(E);
        20 > $.now() - n && logohint.push(E);
      };
      $.confirm = function (E) {
        var n = $.now(),
          C = confirm(E);
        if (!C && 20 > $.now() - n) {
          if (E == t) return (t = null), !0;
          logohint.push(E);
          t = E;
        }
        return C;
      };
      $.prompt = function (E, n) {
        var C = $.now(),
          c = prompt(E, n);
        if (!c && 20 > $.now() - C) {
          if (E == t)
            return (
              (t = null),
              logohint.push($.format("Use default value [{0}]", [n || ""])),
              n || null
            );
          logohint.push("Popup dialog blocked, reclick to use default");
          t = E;
        }
        return c;
      };
    })();
    $.fn.reclk = function (t) {
      return this.unbind("click").click(t);
    };
    "serviceWorker" in navigator
      ? $(function () {
          navigator.serviceWorker.register("sw.js");
        })
      : window.applicationCache &&
        $(function () {
          applicationCache.addEventListener(
            "updateready",
            function (t) {
              applicationCache.status == applicationCache.UPDATEREADY &&
                (applicationCache.swapCache(), location.reload());
            },
            !1
          );
        });
    navigator.storage &&
      navigator.storage.persisted &&
      navigator.storage
        .persisted()
        .then(function (t) {
          if (t) return Promise.resolve(t);
          if (navigator.storage.persist) return navigator.storage.persist();
        })
        .then(function (t) {
          $.persistent = t;
        });
  });
var DEBUGM = !1,
  DEBUGWK = !1,
  DEBUG = ISCSTIMER && (isInWorker ? DEBUGWK : DEBUGM && !!$.urlParam("debug")),
  DEBUGBL = !1;
(function () {
  $.svg = (function () {
    function b(t, E) {
      this.elems = [];
      this.width = t;
      this.height = E;
    }
    function N(t) {
      return parseFloat(t.toFixed(3)).toString();
    }
    b.prototype.addElem = function (t) {
      this.elems.push(t);
    };
    b.prototype.addPoly = function (t, E, n) {
      for (var C = [], c = 0; c < t[0].length; c++)
        C.push(N(t[0][c]) + "," + N(t[1][c]));
      this.elems.push(
        '<polygon points="' +
          C.join(" ") +
          '" style="fill:' +
          E +
          ";stroke:" +
          (n || "#000") +
          ';" />'
      );
    };
    b.prototype.addText = function (t, E, n, C) {
      var c = "paint-order:stroke;",
        k;
      for (k in n) c += k + ":" + n[k] + ";";
      n = 'dominant-baseline="middle" text-anchor="middle"';
      1 == C && (n = 'dominant-baseline="hanging" text-anchor="start"');
      this.elems.push(
        '<text x="' +
          N(E[0]) +
          '" y="' +
          N(E[1]) +
          '" style="' +
          c +
          '" ' +
          n +
          ">" +
          encodeURIComponent(t) +
          "</text>"
      );
    };
    b.prototype.render = function () {
      return (
        '<svg width="' +
        N(this.width) +
        '" height="' +
        N(this.height) +
        '" xmlns="http://www.w3.org/2000/svg">' +
        this.elems.join("") +
        "</svg>"
      );
    };
    b.prototype.renderGroup = function (t, E, n, C) {
      var c = Math.min(n / this.width, C / this.height);
      return (
        '<g transform="translate(' +
        N(t + (n - this.width * c) / 2) +
        "," +
        N(E + (C - this.height * c) / 2) +
        ") scale(" +
        N(c) +
        ')">' +
        this.elems.join("") +
        "</g>"
      );
    };
    return b;
  })();
  $.ctxDrawPolygon = function (b, N, t, E) {
    if (b) {
      E = E || [1, 0, 0, 0, 1, 0];
      t = $.ctxTransform(t, E);
      if (b instanceof $.svg) return b.addPoly(t, N);
      b.beginPath();
      b.fillStyle = N;
      b.moveTo(t[0][0], t[1][0]);
      for (N = 1; N < t[0].length; N++) b.lineTo(t[0][N], t[1][N]);
      b.closePath();
      b.fill();
      b.stroke();
    }
  };
  $.ctxRotate = function (b, N) {
    return $.ctxTransform(b, [
      Math.cos(N),
      -Math.sin(N),
      0,
      Math.sin(N),
      Math.cos(N),
      0,
    ]);
  };
  $.ctxTransform = function (b) {
    for (var N, t = 1; t < arguments.length; t++) {
      var E = arguments[t];
      3 == E.length && (E = [E[0], 0, E[1] * E[0], 0, E[0], E[2] * E[0]]);
      N = [[], []];
      for (t = 0; t < b[0].length; t++)
        (N[0][t] = b[0][t] * E[0] + b[1][t] * E[1] + E[2]),
          (N[1][t] = b[0][t] * E[3] + b[1][t] * E[4] + E[5]);
    }
    return N;
  };
  $.nearColor = function (b, N, t) {
    var E, n;
    (n = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.exec(b)) &&
      (E = [n[1] + n[1], n[2] + n[2], n[3] + n[3]]);
    (n = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(b)) &&
      (E = [n[1], n[2], n[3]]);
    for (b = 0; 3 > b; b++)
      (E[b] = parseInt(E[b], 16) + (N || 0)),
        (E[b] = Math.min(Math.max(E[b], 0), 255)),
        (E[b] = Math.round(E[b] / 17).toString(16));
    return (
      "#" + (t ? E[0] + E[0] + E[1] + E[1] + E[2] + E[2] : E[0] + E[1] + E[2])
    );
  };
  $.col2std = function (b, N) {
    var t = [];
    b = (b || "").match(/#[0-9a-fA-F]{3}/g) || [];
    for (var E = 0; E < b.length; E++)
      t.push(~~$.nearColor(b[N[E]], 0, !0).replace("#", "0x"));
    return t;
  };
  $.format = function (b, N) {
    return b.replace(/{(\d+)}/g, function (t, E) {
      return N[~~E] || "";
    });
  };
  $.UDPOLY_RE =
    "skb|m?pyr|prc|heli(?:2x2|cv)?|crz3a|giga|mgm|klm|redi|fto|ctico";
  $.TWISTY_RE = "sq1|clk|udpoly|" + $.UDPOLY_RE;
})();
(function () {
  var b = function (t, E) {
      var n = (t & 65535) + (E & 65535);
      return (((t >> 16) + (E >> 16) + (n >> 16)) << 16) | (n & 65535);
    },
    N = function (t, E) {
      return (t >>> E) | (t << (32 - E));
    };
  $.sha256 = function (t) {
    /[\x80-\xFF]/.test(t) && (t = unescape(encodeURI(t)));
    for (var E = t, n = [], C = 0; C < 8 * E.length; C += 8)
      n[C >> 5] |= (E.charCodeAt(C / 8) & 255) << (24 - (C % 32));
    var c = 8 * t.length;
    E = [
      1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993,
      2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987,
      1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774,
      264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
      2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
      113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
      1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
      3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
      430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
      1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
      2428436474, 2756734187, 3204031479, 3329325298,
    ];
    t = [
      1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924,
      528734635, 1541459225,
    ];
    C = [64];
    n[c >> 5] |= 128 << (24 - (c % 32));
    n[(((c + 64) >> 9) << 4) + 15] = c;
    for (c = 0; c < n.length; c += 16) {
      for (
        var k = t[0],
          g = t[1],
          f = t[2],
          a = t[3],
          e = t[4],
          h = t[5],
          p = t[6],
          q = t[7],
          m = 0;
        64 > m;
        m++
      ) {
        var r = m;
        if (16 > m) var H = n[c + m];
        else {
          H = C[m - 2];
          H = N(H, 17) ^ N(H, 19) ^ (H >>> 10);
          H = b(H, C[m - 7]);
          var y = C[m - 15];
          y = N(y, 7) ^ N(y, 18) ^ (y >>> 3);
          H = b(b(H, y), C[m - 16]);
        }
        C[r] = H;
        r = e;
        r = N(r, 6) ^ N(r, 11) ^ N(r, 25);
        r = b(b(b(b(q, r), (e & h) ^ (~e & p)), E[m]), C[m]);
        q = k;
        q = N(q, 2) ^ N(q, 13) ^ N(q, 22);
        H = b(q, (k & g) ^ (k & f) ^ (g & f));
        q = p;
        p = h;
        h = e;
        e = b(a, r);
        a = f;
        f = g;
        g = k;
        k = b(r, H);
      }
      t[0] = b(k, t[0]);
      t[1] = b(g, t[1]);
      t[2] = b(f, t[2]);
      t[3] = b(a, t[3]);
      t[4] = b(e, t[4]);
      t[5] = b(h, t[5]);
      t[6] = b(p, t[6]);
      t[7] = b(q, t[7]);
    }
    n = "";
    for (E = 0; E < 4 * t.length; E++)
      n +=
        "0123456789abcdef".charAt((t[E >> 2] >> (8 * (3 - (E % 4)) + 4)) & 15) +
        "0123456789abcdef".charAt((t[E >> 2] >> (8 * (3 - (E % 4)))) & 15);
    return n;
  };
})();
(function () {
  function b(k, g) {
    for (var f = k.slice(), a = 0; 16 > a; a++) k[a] = n[f[C[a]]] ^ g[a];
  }
  function N(k, g) {
    for (var f = k.slice(), a = 0; 16 > a; a++) k[C[a]] = E[f[a] ^ g[a]];
  }
  function t(k) {
    if (0 == c.length) {
      for (var g = 0; 256 > g; g++) n[E[g]] = g;
      for (g = 0; 128 > g; g++) (c[g] = g << 1), (c[128 + g] = (g << 1) ^ 27);
    }
    k = k.slice();
    g = 1;
    for (var f = 16; 176 > f; f += 4) {
      var a = k.slice(f - 4, f);
      0 == f % 16 &&
        ((a = [E[a[1]] ^ g, E[a[2]], E[a[3]], E[a[0]]]), (g = c[g]));
      for (var e = 0; 4 > e; e++) k[f + e] = k[f + e - 16] ^ a[e];
    }
    this.key = k;
  }
  var E = [
      99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118,
      202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114,
      192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49,
      21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117,
      9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83,
      209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208,
      239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81,
      163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210,
      205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115,
      96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219,
      224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121,
      231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8,
      186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138,
      112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158,
      225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40,
      223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187,
      22,
    ],
    n = [],
    C = [0, 13, 10, 7, 4, 1, 14, 11, 8, 5, 2, 15, 12, 9, 6, 3],
    c = [];
  t.prototype.decrypt = function (k) {
    for (var g = this.key.slice(160, 176), f = 0; 16 > f; f++) k[f] ^= g[f];
    for (g = 144; 16 <= g; g -= 16) {
      b(k, this.key.slice(g, g + 16));
      f = k;
      for (var a = 0; 16 > a; a += 4) {
        var e = f[a + 0],
          h = f[a + 1],
          p = f[a + 2],
          q = f[a + 3],
          m = e ^ h ^ p ^ q,
          r = c[m],
          H = c[c[r ^ e ^ p]] ^ m;
        m ^= c[c[r ^ h ^ q]];
        f[a + 0] = f[a + 0] ^ H ^ c[e ^ h];
        f[a + 1] = f[a + 1] ^ m ^ c[h ^ p];
        f[a + 2] = f[a + 2] ^ H ^ c[p ^ q];
        f[a + 3] = f[a + 3] ^ m ^ c[q ^ e];
      }
    }
    b(k, this.key.slice(0, 16));
    return k;
  };
  t.prototype.encrypt = function (k) {
    N(k, this.key.slice(0, 16));
    for (var g = 16; 160 > g; g += 16) {
      for (var f = k, a = 12; 0 <= a; a -= 4) {
        var e = f[a + 0],
          h = f[a + 1],
          p = f[a + 2],
          q = f[a + 3],
          m = e ^ h ^ p ^ q;
        f[a + 0] = f[a + 0] ^ m ^ c[e ^ h];
        f[a + 1] = f[a + 1] ^ m ^ c[h ^ p];
        f[a + 2] = f[a + 2] ^ m ^ c[p ^ q];
        f[a + 3] = f[a + 3] ^ m ^ c[q ^ e];
      }
      N(k, this.key.slice(g, g + 16));
    }
    g = this.key.slice(160, 176);
    for (f = 0; 16 > f; f++) k[f] ^= g[f];
    return k;
  };
  $.aes128 = function (k) {
    return new t(k);
  };
})();
var isaac = (function () {
  function b(e, h) {
    var p = (e & 65535) + (h & 65535);
    return (((e >>> 16) + (h >>> 16) + (p >>> 16)) << 16) | (p & 65535);
  }
  function N() {
    for (var e = (c = k = g = 0); 256 > e; ++e) C[e] = f[e] = 0;
    a = 0;
  }
  function t(e) {
    function h() {
      v ^= p << 11;
      m = b(m, v);
      p = b(p, q);
      p ^= q >>> 2;
      r = b(r, p);
      q = b(q, m);
      q ^= m << 8;
      H = b(H, q);
      m = b(m, r);
      m ^= r >>> 16;
      y = b(y, m);
      r = b(r, H);
      r ^= H << 10;
      A = b(A, r);
      H = b(H, y);
      H ^= y >>> 4;
      v = b(v, H);
      y = b(y, A);
      y ^= A << 8;
      p = b(p, y);
      A = b(A, v);
      A ^= v >>> 9;
      q = b(q, A);
      v = b(v, p);
    }
    var p, q, m, r, H, y, A, w;
    var v = (p = q = m = r = H = y = A = 2654435769);
    e && "number" === typeof e && (e = [e]);
    if (e instanceof Array)
      for (N(), w = 0; w < e.length; w++)
        f[w & 255] += "number" === typeof e[w] ? e[w] : 0;
    for (w = 0; 4 > w; w++) h();
    for (w = 0; 256 > w; w += 8)
      e &&
        ((v = b(v, f[w + 0])),
        (p = b(p, f[w + 1])),
        (q = b(q, f[w + 2])),
        (m = b(m, f[w + 3])),
        (r = b(r, f[w + 4])),
        (H = b(H, f[w + 5])),
        (y = b(y, f[w + 6])),
        (A = b(A, f[w + 7]))),
        h(),
        (C[w + 0] = v),
        (C[w + 1] = p),
        (C[w + 2] = q),
        (C[w + 3] = m),
        (C[w + 4] = r),
        (C[w + 5] = H),
        (C[w + 6] = y),
        (C[w + 7] = A);
    if (e)
      for (w = 0; 256 > w; w += 8)
        (v = b(v, C[w + 0])),
          (p = b(p, C[w + 1])),
          (q = b(q, C[w + 2])),
          (m = b(m, C[w + 3])),
          (r = b(r, C[w + 4])),
          (H = b(H, C[w + 5])),
          (y = b(y, C[w + 6])),
          (A = b(A, C[w + 7])),
          h(),
          (C[w + 0] = v),
          (C[w + 1] = p),
          (C[w + 2] = q),
          (C[w + 3] = m),
          (C[w + 4] = r),
          (C[w + 5] = H),
          (C[w + 6] = y),
          (C[w + 7] = A);
    E();
    a = 256;
  }
  function E(e) {
    var h, p;
    for (e = e && "number" === typeof e ? Math.abs(Math.floor(e)) : 1; e--; )
      for (g = b(g, 1), k = b(k, g), h = 0; 256 > h; h++) {
        switch (h & 3) {
          case 0:
            c ^= c << 13;
            break;
          case 1:
            c ^= c >>> 6;
            break;
          case 2:
            c ^= c << 2;
            break;
          case 3:
            c ^= c >>> 16;
        }
        c = b(C[(h + 128) & 255], c);
        var q = C[h];
        C[h] = p = b(C[(q >>> 2) & 255], b(c, k));
        f[h] = k = b(C[(p >>> 10) & 255], q);
      }
  }
  function n() {
    a-- || (E(), (a = 255));
    return f[a];
  }
  var C = Array(256),
    c = 0,
    k = 0,
    g = 0,
    f = Array(256),
    a = 0;
  t(4294967295 * Math.random());
  return {
    reset: N,
    seed: t,
    prng: E,
    rand: n,
    random: function () {
      return (67108864 * (n() >>> 5) + (n() >>> 6)) / 9007199254740992;
    },
    internals: function (e) {
      var h = { a: c, b: k, c: g, m: C.slice(), r: f.slice(), g: a };
      e &&
        ((c = e.a),
        (k = e.b),
        (g = e.c),
        (C = e.m.slice()),
        (f = e.r.slice()),
        (a = e.g));
      return h;
    },
  };
})();
var mathlib = (function () {
  function b(d, l, D, x, R, G) {
    var L = d[l];
    d[l] = d[R] ^ G;
    d[R] = d[x] ^ G;
    d[x] = d[D] ^ G;
    d[D] = L ^ G;
  }
  function N(d) {
    for (var l = arguments.length - 1, D = d[arguments[l]]; 1 < l; l--)
      d[arguments[l]] = d[arguments[l - 1]];
    d[arguments[1]] = D;
    return N;
  }
  function t(d, l, D, x) {
    D = D || 1;
    for (var R = l.length, G = [], L = 0; L < R; L++) G[L] = d[l[L]];
    for (L = 0; L < R; L++) {
      var F = (L + D) % R;
      d[l[F]] = G[L];
      x && (d[l[F]] += x[F] - x[L] + x.at(-1));
    }
    return t;
  }
  function E(d, l) {
    return (d[l >> 3] >> ((l & 7) << 2)) & 15;
  }
  function n(d, l, D, x) {
    var R = 0;
    0 > x && (l <<= 1);
    if (16 <= D) {
      d[D - 1] = 0;
      for (var G = D - 2; 0 <= G; G--) {
        d[G] = l % (D - G);
        R ^= d[G];
        l = ~~(l / (D - G));
        for (var L = G + 1; L < D; L--) d[L] >= d[G] && d[L]++;
      }
      0 > x &&
        0 != (R & 1) &&
        ((l = d[D - 1]), (d[D - 1] = d[D - 2]), (d[D - 2] = l));
      return d;
    }
    L = 1985229328;
    var F = 4275878552;
    for (G = 0; G < D - 1; G++) {
      var K = w[D - 1 - G],
        M = l / K;
      l %= K;
      R ^= M;
      M <<= 2;
      32 <= M
        ? ((M -= 32),
          (d[G] = (F >> M) & 15),
          (K = (1 << M) - 1),
          (F = (F & K) + ((F >> 4) & ~K)))
        : ((d[G] = (L >> M) & 15),
          (K = (1 << M) - 1),
          (L = (L & K) + ((L >>> 4) & ~K) + (F << 28)),
          (F >>= 4));
    }
    0 > x && 0 != (R & 1)
      ? ((d[D - 1] = d[D - 2]), (d[D - 2] = L & 15))
      : (d[D - 1] = L & 15);
    return d;
  }
  function C(d, l, D) {
    l = l || d.length;
    var x = 0;
    if (16 <= l) {
      for (var R = 0; R < l - 1; R++) {
        x *= l - R;
        for (var G = R + 1; G < l; G++) d[G] < d[R] && x++;
      }
      return 0 > D ? x >> 1 : x;
    }
    G = 1985229328;
    var L = 4275878552;
    for (R = 0; R < l - 1; R++) {
      var F = d[R] << 2;
      x *= l - R;
      32 <= F
        ? ((x += (L >> (F - 32)) & 15), (L -= 286331152 << (F - 32)))
        : ((x += (G >> F) & 15), (L -= 286331153), (G -= 286331152 << F));
    }
    return 0 > D ? x >> 1 : x;
  }
  function c(d, l) {
    var D;
    var x = 0;
    for (D = l - 2; 0 <= D; --D) (x ^= d % (l - D)), (d = ~~(d / (l - D)));
    return x & 1;
  }
  function k(d, l, D) {
    var x = Math.abs(D);
    D = 0 > D ? 0 : d[0] % x;
    for (--l; 0 < l; l--) D = D * x + (d[l] % x);
    return D;
  }
  function g(d, l, D, x) {
    for (var R = Math.abs(x), G = R * D, L = 1; L < D; L++)
      (d[L] = l % R), (G -= d[L]), (l = ~~(l / R));
    d[0] = (0 > x ? G : l) % R;
    return d;
  }
  function f(d) {
    d -= (d >> 1) & 1431655765;
    d = (d & 858993459) + ((d >> 2) & 858993459);
    return (16843009 * ((d + (d >> 4)) & 252645135)) >> 24;
  }
  function a(d, l, D) {
    this.length = l;
    this.evenbase = D;
    if ("p" == d)
      (this.get = function (G) {
        return C(G, this.length, this.evenbase);
      }),
        (this.set = function (G, L) {
          return n(G, L, this.length, this.evenbase);
        });
    else if ("o" == d)
      (this.get = function (G) {
        return k(G, this.length, this.evenbase);
      }),
        (this.set = function (G, L) {
          return g(G, L, this.length, this.evenbase);
        });
    else if ("c" == d) {
      this.cnts = D.slice();
      this.cntn = this.cnts.length;
      this.cums = [0];
      for (d = 1; d <= this.cntn; d++)
        this.cums[d] = this.cums[d - 1] + D[d - 1];
      l = this.n = this.cums[this.cntn];
      var x = 1;
      for (d = 0; d < this.cntn; d++)
        for (var R = 1; R <= D[d]; R++, l--) x *= l / R;
      this.x = Math.round(x);
      this.get = function (G) {
        for (
          var L = this.n,
            F = this.cnts.slice(),
            K = this.cums,
            M = -1,
            S = 0,
            Z = 1,
            fa = 0;
          fa < L;
          fa++
        ) {
          var ea = G[fa];
          S = S * (L - fa) + f(M & ((1 << K[ea]) - 1)) * Z;
          Z *= F[ea]--;
          M &= ~(1 << (K[ea] + F[ea]));
        }
        return Math.round(S / Z);
      };
      this.set = function (G, L) {
        for (
          var F = this.n, K = this.cnts.slice(), M = this.x, S = 0;
          S < F;
          S++
        )
          for (var Z = 0; Z < K.length; Z++)
            if (0 != K[Z]) {
              var fa = ~~((M * K[Z]) / (F - S));
              if (L < fa) {
                K[Z]--;
                G[S] = Z;
                M = fa;
                break;
              }
              L -= fa;
            }
        return G;
      };
    } else debugger;
  }
  function e(d, l, D, x) {
    x = x || 6;
    if ($.isArray(D)) {
      var R = new a(D[1], D[2], D[3]);
      D = D[0];
      for (var G = 0; G < x; G++) {
        d[G] = [];
        for (var L = 0; L < l; L++) {
          var F = R.set([], L);
          D(F, G);
          d[G][L] = R.get(F);
        }
      }
    } else
      for (G = 0; G < x; G++)
        for (d[G] = [], L = 0; L < l; L++) d[G][L] = D(L, G);
  }
  function h() {
    this.ca = [0, 1, 2, 3, 4, 5, 6, 7];
    this.ea = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
    this.ori = 0;
  }
  function p(d, l, D, x, R, G, L, F) {
    var K = $.isArray(R);
    G = G || 6;
    L = L || 3;
    F = F || 256;
    x = x || 256;
    for (var M = 0, S = (D + 7) >>> 3; M < S; M++) d[M] = -1;
    $.isArray(l) || (l = [l]);
    for (M = 0; M < l.length; M++) d[l[M] >> 3] ^= 15 << ((l[M] & 7) << 2);
    for (M = l = 0; M <= x; M++) {
      S = 0;
      var Z = M >= F,
        fa = (M + 1) ^ 15,
        ea = Z ? 15 : M,
        va = Z ? M : 15,
        ra = 0;
      a: for (; ra < D; ra++, l >>= 4) {
        if (0 == (ra & 7) && ((l = d[ra >> 3]), !Z && -1 == l)) {
          ra += 7;
          continue;
        }
        if ((l & 15) == ea)
          for (var ya = 0; ya < G; ya++)
            for (var Ba = ra, sa = 0; sa < L; sa++) {
              Ba = K ? R[ya][Ba] : R(Ba, ya);
              if (0 > Ba) break;
              if (E(d, Ba) == va) {
                ++S;
                if (Z) {
                  d[ra >> 3] ^= fa << ((ra & 7) << 2);
                  continue a;
                }
                d[Ba >> 3] ^= fa << ((Ba & 7) << 2);
              }
            }
      }
      if (0 == S) break;
      DEBUG && console.log("[prun]", S);
    }
  }
  function q(d, l, D) {
    this.N_STATES = D.length;
    this.N_MOVES = d;
    this.N_POWER = l;
    this.stateParams = D;
    this.coords = [];
    for (d = 0; d < this.N_STATES; d++)
      (l = D[d][1]), $.isArray(l) && (this.coords[d] = new a(l[1], l[2], l[3]));
    this.inited = !1;
  }
  function m(d, l, D, x, R, G) {
    this.isSolved =
      d ||
      function () {
        return !0;
      };
    this.getPrun = l;
    this.doMove = D;
    this.N_AXIS = x;
    this.N_POWER = R;
    this.ckmv =
      G ||
      y(x, function (L) {
        return 1 << L;
      });
  }
  function r(d, l, D) {
    this.solvedStates = d;
    this.doMove = l;
    this.movesList = [];
    for (var x in D) this.movesList.push([x, D[x]]);
    this.prunTable = {};
    this.toUpdateArr = null;
    this.prunTableSize = 0;
    this.prunDepth = -1;
    this.cost = 0;
    this.MAX_PRUN_SIZE = 1e5;
  }
  function H(d) {
    return ~~(V.random() * d);
  }
  function y(d, l) {
    for (var D = [], x = "function" == typeof l, R = 0; R < d; R++)
      D[R] = x ? l(R) : l;
    return D;
  }
  for (var A = [], w = [1], v = 0; 32 > v; ++v) {
    A[v] = [];
    for (var u = 0; 32 > u; ++u) A[v][u] = 0;
  }
  for (v = 0; 32 > v; ++v)
    for (A[v][0] = A[v][v] = 1, w[v + 1] = w[v] * (v + 1), u = 1; u < v; ++u)
      A[v][u] = A[v - 1][u - 1] + A[v - 1][u];
  var I = [];
  for (v = 0; 24 > v; v++) {
    var z = [],
      O = [],
      J = [];
    I[v] = [];
    n(z, v, 4);
    for (u = 0; 24 > u; u++) {
      n(O, u, 4);
      for (var P = 0; 4 > P; P++) J[P] = z[O[P]];
      I[v][u] = C(J, 4);
    }
  }
  h.SOLVED = new h();
  h.EdgeMult = function (d, l, D) {
    for (var x = 0; 12 > x; x++) D.ea[x] = d.ea[l.ea[x] >> 1] ^ (l.ea[x] & 1);
  };
  h.CornMult = function (d, l, D) {
    for (var x = 0; 8 > x; x++)
      D.ca[x] =
        (d.ca[l.ca[x] & 7] & 7) |
        (((d.ca[l.ca[x] & 7] >> 3) + (l.ca[x] >> 3)) % 3 << 3);
  };
  h.CubeMult = function (d, l, D) {
    h.CornMult(d, l, D);
    h.EdgeMult(d, l, D);
  };
  h.CentMult = function (d, l, D) {
    D.ct = [];
    for (var x = 0; 6 > x; x++) D.ct[x] = d.ct[l.ct[x]];
  };
  h.prototype.init = function (d, l) {
    this.ca = d.slice();
    this.ea = l.slice();
    return this;
  };
  h.prototype.hashCode = function () {
    for (var d = 0, l = 0; 20 > l; l++)
      d = 0 | (31 * d + (12 > l ? this.ea[l] : this.ca[l - 12]));
    return d;
  };
  h.prototype.isEqual = function (d) {
    d = d || h.SOLVED;
    for (var l = 0; 8 > l; l++) if (this.ca[l] != d.ca[l]) return !1;
    for (l = 0; 12 > l; l++) if (this.ea[l] != d.ea[l]) return !1;
    return !0;
  };
  h.cFacelet = [
    [8, 9, 20],
    [6, 18, 38],
    [0, 36, 47],
    [2, 45, 11],
    [29, 26, 15],
    [27, 44, 24],
    [33, 53, 42],
    [35, 17, 51],
  ];
  h.eFacelet = [
    [5, 10],
    [7, 19],
    [3, 37],
    [1, 46],
    [32, 16],
    [28, 25],
    [30, 43],
    [34, 52],
    [23, 12],
    [21, 41],
    [50, 39],
    [48, 14],
  ];
  h.ctFacelet = [4, 13, 22, 31, 40, 49];
  h.faceMap = (function () {
    for (var d = [], l = 0; 8 > l; l++)
      for (var D = 0; 3 > D; D++) d[h.cFacelet[l][D]] = [0, l, D];
    for (l = 0; 12 > l; l++)
      for (D = 0; 2 > D; D++) d[h.eFacelet[l][D]] = [1, l, D];
    return d;
  })();
  h.prototype.toPerm = function (d, l, D, x) {
    d = d || h.cFacelet;
    l = l || h.eFacelet;
    D = D || h.ctFacelet;
    for (var R = [], G = 0; 54 > G; G++) R[G] = G;
    var L = this;
    if (x && L.ori)
      for (
        L = new h(),
          x = h.rotCube[h.rotMulI[0][this.ori]],
          h.CubeMult(this, x, L),
          G = 0;
        6 > G;
        G++
      )
        R[D[G]] = D[x.ct[G]];
    for (var F = 0; 8 > F; F++)
      for (D = L.ca[F] & 7, G = L.ca[F] >> 3, x = 0; 3 > x; x++)
        R[d[F][(x + G) % 3]] = d[D][x];
    for (d = 0; 12 > d; d++)
      for (D = L.ea[d] >> 1, G = L.ea[d] & 1, x = 0; 2 > x; x++)
        R[l[d][(x + G) % 2]] = l[D][x];
    return R;
  };
  h.prototype.toFaceCube = function (d, l, D, x) {
    d = this.toPerm(d, l, D, x);
    l = [];
    for (D = 0; 54 > D; D++) l[D] = "URFDLB"[~~(d[D] / 9)];
    return l.join("");
  };
  h.prototype.prettyString = function (d) {
    var l = this.toFaceCube(null, null, null, d);
    return "        U0U1U2\n        U3U4U5\n        U6U7U8\nL0L1L2  F0F1F2  R0R1R2  B0B1B2\nL3L4L5  F3F4F5  R3R4R5  B3B4B5\nL6L7L8  F6F7F8  R6R7R8  B6B7B8\n        D0D1D2\n        D3D4D5\n        D6D7D8\n".replace(
      /[URFDLB][0-8]/g,
      function (D) {
        var x = "URFDLB".indexOf(D[0]);
        return l[9 * x + ~~D[1]] + " ";
      }
    );
  };
  h.prototype.invFrom = function (d) {
    for (var l = 0; 12 > l; l++)
      this.ea[d.ea[l] >> 1] = (l << 1) | (d.ea[l] & 1);
    for (l = 0; 8 > l; l++)
      this.ca[d.ca[l] & 7] = l | ((32 >> (d.ca[l] >> 3)) & 24);
    return this;
  };
  h.prototype.fromFacelet = function (d, l, D) {
    l = l || h.cFacelet;
    D = D || h.eFacelet;
    for (
      var x = 0,
        R = [],
        G = d[4] + d[13] + d[22] + d[31] + d[40] + d[49],
        L = 0;
      54 > L;
      ++L
    ) {
      R[L] = G.indexOf(d[L]);
      if (-1 == R[L]) return -1;
      x += 1 << (R[L] << 2);
    }
    if (10066329 != x) return -1;
    var F;
    for (L = 0; 8 > L; ++L) {
      for (F = 0; 3 > F && 0 != R[l[L][F]] && 3 != R[l[L][F]]; ++F);
      d = R[l[L][(F + 1) % 3]];
      x = R[l[L][(F + 2) % 3]];
      for (G = 0; 8 > G; ++G)
        if (d == ~~(l[G][1] / 9) && x == ~~(l[G][2] / 9)) {
          this.ca[L] = G | (F % 3 << 3);
          break;
        }
    }
    for (L = 0; 12 > L; ++L)
      for (G = 0; 12 > G; ++G) {
        if (R[D[L][0]] == ~~(D[G][0] / 9) && R[D[L][1]] == ~~(D[G][1] / 9)) {
          this.ea[L] = G << 1;
          break;
        }
        if (R[D[L][0]] == ~~(D[G][1] / 9) && R[D[L][1]] == ~~(D[G][0] / 9)) {
          this.ea[L] = (G << 1) | 1;
          break;
        }
      }
    return this;
  };
  h.prototype.verify = function () {
    for (var d = 0, l = 0, D = [], x = 0; 12 > x; x++)
      (d |= 256 << (this.ea[x] >> 1)),
        (l ^= this.ea[x] & 1),
        D.push(this.ea[x] >> 1);
    x = [];
    for (var R = 0; 8 > R; R++)
      (d |= 1 << (this.ca[R] & 7)),
        (l += (this.ca[R] >> 3) << 1),
        x.push(this.ca[R] & 7);
    return 1048575 != d || 0 != l % 6 || c(C(D, 12), 12) != c(C(x, 8), 8)
      ? -1
      : 0;
  };
  h.moveCube = (function () {
    for (var d = [], l = 0; 18 > l; l++) d[l] = new h();
    d[0].init(
      [3, 0, 1, 2, 4, 5, 6, 7],
      [6, 0, 2, 4, 8, 10, 12, 14, 16, 18, 20, 22]
    );
    d[3].init(
      [20, 1, 2, 8, 15, 5, 6, 19],
      [16, 2, 4, 6, 22, 10, 12, 14, 8, 18, 20, 0]
    );
    d[6].init(
      [9, 21, 2, 3, 16, 12, 6, 7],
      [0, 19, 4, 6, 8, 17, 12, 14, 3, 11, 20, 22]
    );
    d[9].init(
      [0, 1, 2, 3, 5, 6, 7, 4],
      [0, 2, 4, 6, 10, 12, 14, 8, 16, 18, 20, 22]
    );
    d[12].init(
      [0, 10, 22, 3, 4, 17, 13, 7],
      [0, 2, 20, 6, 8, 10, 18, 14, 16, 4, 12, 22]
    );
    d[15].init(
      [0, 1, 11, 23, 4, 5, 18, 14],
      [0, 2, 4, 23, 8, 10, 12, 21, 16, 18, 7, 15]
    );
    for (l = 0; 18 > l; l += 3)
      for (var D = 0; 2 > D; D++) h.CubeMult(d[l + D], d[l], d[l + D + 1]);
    return d;
  })();
  h.rotCube = (function () {
    var d = new h().init(
      [3, 0, 1, 2, 7, 4, 5, 6],
      [6, 0, 2, 4, 14, 8, 10, 12, 23, 17, 19, 21]
    );
    d.ct = [0, 5, 1, 3, 2, 4];
    var l = new h().init(
      [5, 4, 7, 6, 1, 0, 3, 2],
      [12, 10, 8, 14, 4, 2, 0, 6, 18, 16, 22, 20]
    );
    l.ct = [3, 4, 2, 0, 1, 5];
    var D = new h().init(
      [8, 20, 13, 17, 19, 15, 22, 10],
      [3, 16, 11, 18, 7, 22, 15, 20, 1, 9, 13, 5]
    );
    D.ct = [2, 0, 1, 5, 3, 4];
    var x = new h();
    x.ct = [0, 1, 2, 3, 4, 5];
    for (var R = new h(), G = [], L = 0; 24 > L; L++)
      (G[L] = new h().init(x.ca, x.ea)),
        (G[L].ct = x.ct.slice()),
        h.CubeMult(x, d, R),
        h.CentMult(x, d, R),
        x.init(R.ca, R.ea),
        (x.ct = R.ct.slice()),
        3 == L % 4 &&
          (h.CubeMult(x, l, R),
          h.CentMult(x, l, R),
          x.init(R.ca, R.ea),
          (x.ct = R.ct.slice())),
        7 == L % 8 &&
          (h.CubeMult(x, D, R),
          h.CentMult(x, D, R),
          x.init(R.ca, R.ea),
          (x.ct = R.ct.slice()));
    d = [];
    l = [];
    D = [];
    var F = [],
      K = [];
    for (L = 0; 24 > L; L++)
      (l[L] = G[L].hashCode()), (D[L] = []), (F[L] = []), (K[L] = []);
    for (L = 0; 18 > L; L++) d[L] = h.moveCube[L].hashCode();
    for (L = 0; 24 > L; L++)
      for (var M = 0; 24 > M; M++) {
        h.CubeMult(G[L], G[M], x);
        var S = l.indexOf(x.hashCode());
        D[L][M] = S;
        F[S][M] = L;
      }
    for (L = 0; 24 > L; L++)
      for (M = 0; 18 > M; M++)
        h.CubeMult(G[F[0][L]], h.moveCube[M], x),
          h.CubeMult(x, G[L], R),
          (S = d.indexOf(R.hashCode())),
          (K[L][M] = S);
    h.rotMult = D;
    h.rotMulI = F;
    h.rotMulM = K;
    h.rot2str =
      ";y';y2;y;z2;y' z2;y2 z2;y z2;y' x';y2 x';y x';x';y' x;y2 x;y x;x;y z;z;y' z;y2 z;y' z';y2 z';y z';z'".split(
        ";"
      );
    return G;
  })();
  h.prototype.edgeCycles = function () {
    for (var d = [], l = [0, 0, 0], D = 0, x = !1, R = 0; 12 > R; ++R)
      if (!d[R]) {
        var G = -1,
          L = !1,
          F = R;
        do (d[F] = !0), ++G, (L ^= this.ea[F] & 1), (F = this.ea[F] >> 1);
        while (F != R);
        D += G >> 1;
        G & 1 && ((x = !x), ++D);
        L && (0 == G ? ++l[0] : G & 1 ? (l[2] ^= 1) : ++l[1]);
      }
    l[1] += l[2];
    D =
      l[0] < l[1]
        ? D + ((l[0] + l[1]) >> 1)
        : D + (l[1] + [0, 2, 3, 5, 6, 8, 9][(l[0] - l[1]) >> 1]);
    return D - x;
  };
  var W = /^\s*([URFDLB]w?|[EMSyxz]|2-2[URFDLB]w)(['2]?)(@\d+)?\s*$/,
    X = new h();
  h.prototype.selfMoveStr = function (d, l) {
    var D = W.exec(d);
    if (D) {
      var x = D[1];
      d = "2'".indexOf(D[2] || "-") + 2;
      l && (d = 4 - d);
      D[3] && (this.tstamp = ~~D[3].slice(1));
      this.ori = this.ori || 0;
      l = "URFDLB".indexOf(x);
      if (-1 != l)
        return (
          (D = h.rotMulM[this.ori][3 * l + (d % 4) - 1]),
          h.CubeMult(this, h.moveCube[D], X),
          this.init(X.ca, X.ea),
          D
        );
      l = "UwRwFwDwLwBw".indexOf(x);
      if (-1 != l) {
        l >>= 1;
        D = h.rotMulM[this.ori][((l + 3) % 6) * 3 + (d % 4) - 1];
        h.CubeMult(this, h.moveCube[D], X);
        this.init(X.ca, X.ea);
        l = [3, 15, 17, 1, 11, 23][l];
        for (x = 0; x < d; x++) this.ori = h.rotMult[l][this.ori];
        return D;
      }
      l = "2-2Uw 2-2Rw 2-2Fw 2-2Dw 2-2Lw 2-2Bw".split(" ").indexOf(x);
      -1 == l && (l = [null, null, "S", "E", "M", null].indexOf(x));
      if (-1 != l) {
        x = ((l + 3) % 6) * 3 + (d % 4) - 1;
        D = h.rotMulM[this.ori][3 * l + ((4 - d) % 4) - 1];
        h.CubeMult(this, h.moveCube[D], X);
        this.init(X.ca, X.ea);
        x = h.rotMulM[this.ori][x];
        h.CubeMult(this, h.moveCube[x], X);
        this.init(X.ca, X.ea);
        l = [3, 15, 17, 1, 11, 23][l];
        for (x = 0; x < d; x++) this.ori = h.rotMult[l][this.ori];
        return D + 18;
      }
      l = "yxz".indexOf(x);
      if (-1 != l)
        for (l = [3, 15, 17][l], x = 0; x < d; x++)
          this.ori = h.rotMult[l][this.ori];
    }
  };
  h.prototype.selfConj = function (d) {
    void 0 === d && (d = this.ori);
    0 != d &&
      (h.CubeMult(h.rotCube[d], this, X),
      h.CubeMult(X, h.rotCube[h.rotMulI[0][d]], this),
      (this.ori = h.rotMulI[this.ori][d] || 0));
  };
  v = (function () {
    var d = [11, 8, 9, 10, 6, 7, 4, 5, 1, 2, 3, 0],
      l = [
        [5, 1, 2, 3, 4],
        [10, 6, 2, 0, 5],
        [6, 7, 3, 0, 1],
        [7, 8, 4, 0, 2],
        [8, 9, 5, 0, 3],
        [9, 10, 1, 0, 4],
        [11, 7, 2, 1, 10],
        [11, 8, 3, 2, 6],
        [11, 9, 4, 3, 7],
        [11, 10, 5, 4, 8],
        [11, 6, 1, 5, 9],
        [6, 10, 9, 8, 7],
      ];
    return {
      doMove: function (D, x, R, G) {
        R = ((R % 5) + 5) % 5;
        if (0 != R) {
          for (var L = 11 * x, F = [[], [], [], [], []], K = 0; 5 > K; K++) {
            var M = l[x][K],
              S = l[M].indexOf(x);
            (0 != G && 1 != G) ||
              F[K].push(
                L + K,
                L + K + 5,
                11 * M + (S % 5) + 5,
                11 * M + (S % 5),
                11 * M + ((S + 1) % 5)
              );
            if (1 == G || 2 == G) {
              F[K].push(11 * M + 10);
              for (var Z = 1; 5 > Z; Z++) F[K].push(11 * M + ((S + Z) % 5) + 5);
              for (Z = 2; 5 > Z; Z++) F[K].push(11 * M + ((S + Z) % 5));
              Z = 4 - K;
              var fa = d[x];
              M = l[fa][Z];
              S = l[M].indexOf(fa);
              F[K].push(11 * fa + Z, 11 * fa + Z + 5, 11 * M + 10);
              for (Z = 0; 5 > Z; Z++)
                F[K].push(11 * M + ((S + Z) % 5) + 5, 11 * M + ((S + Z) % 5));
            }
          }
          for (K = 0; K < F[0].length; K++)
            mathlib.acycle(D, [F[0][K], F[1][K], F[2][K], F[3][K], F[4][K]], R);
        }
      },
      oppFace: d,
      adjFaces: l,
    };
  })();
  u = q.prototype;
  u.init = function () {
    var d = this;
    if (!this.inited) {
      this.move = [];
      this.prun = [];
      for (var l = 0; l < this.N_STATES; l++) {
        var D = this.stateParams[l],
          x = D[0],
          R = D[1],
          G = D[2],
          L = D[3];
        D = D[4];
        this.move[l] = [];
        this.prun[l] = [];
        e(this.move[l], G, R, this.N_MOVES);
        p(this.prun[l], x, G, L, this.move[l], this.N_MOVES, this.N_POWER, D);
      }
      this.solv = new m(
        null,
        function (F) {
          for (var K = 0, M = 0; M < d.N_STATES; M++)
            K = Math.max(K, E(d.prun[M], F[M]));
          return K;
        },
        function (F, K) {
          for (var M = 0; M < d.N_STATES; M++) F[M] = d.move[M][K][F[M]];
          return F;
        },
        this.N_MOVES,
        this.N_POWER
      );
      this.inited = !0;
    }
  };
  u.search = function (d, l, D) {
    D = (D || 99) + 1;
    this.inited || this.init();
    return (this.sol = this.solv.solve(d, l, D));
  };
  u.toStr = function (d, l, D) {
    return d
      .map(function (x) {
        return l[x[0]] + D[x[1]];
      })
      .join(" ")
      .replace(/ +/g, " ");
  };
  u = m.prototype;
  u.solve = function (d, l, D, x, R) {
    d = this.solveMulti([d], l, D, x, R);
    return null == d ? null : d[0];
  };
  u.solveMulti = function (d, l, D, x, R) {
    this.sidx = 0;
    this.sol = [];
    this.length = l;
    this.idxs = d;
    return this.nextMulti(D, x, R);
  };
  u.next = function (d, l, D) {
    d = this.nextMulti(d, l, D);
    return null == d ? null : d[0];
  };
  u.nextMulti = function (d, l, D) {
    this.cost = (D || 1e9) + 1;
    for (
      this.callback =
        l ||
        function () {
          return !0;
        };
      this.length <= d;
      this.length++
    ) {
      for (; this.sidx < this.idxs.length; this.sidx++)
        if (
          0 ==
          this.idaSearch(this.idxs[this.sidx], this.length, 0, -1, this.sol)
        )
          return 0 >= this.cost ? null : [this.sol, this.sidx];
      this.sidx = 0;
    }
    return null;
  };
  u.idaSearch = function (d, l, D, x, R) {
    if (0 >= --this.cost) return 0;
    var G = this.getPrun(d);
    if (G > l) return G > l + 1 ? 2 : 1;
    if (0 == l) return this.isSolved(d) && this.callback(R, this.sidx) ? 0 : 1;
    if (0 == G && 1 == l && this.isSolved(d)) return 1;
    for (G = R.length > D ? R[D][0] : 0; G < this.N_AXIS; G++)
      if (!((this.ckmv[x] >> G) & 1))
        for (
          var L = $.isArray(d) ? d.slice() : d, F = R.length > D ? R[D][1] : 0;
          F < this.N_POWER;
          F++
        ) {
          L = this.doMove(L, G, F);
          if (null == L) break;
          R[D] = [G, F];
          var K = this.idaSearch(L, l - 1, D + 1, G, R);
          if (0 == K) return 0;
          R.pop();
          if (2 == K) break;
        }
    return 1;
  };
  u = r.prototype;
  u.updatePrun = function (d) {
    d = void 0 === d ? this.prunDepth + 1 : d;
    for (var l = this.prunDepth + 1; l <= d; l++) {
      if (this.prevSize >= this.MAX_PRUN_SIZE) {
        DEBUG && console.log("[gSolver] skipPrun", l, this.prunTableSize);
        break;
      }
      var D = +new Date();
      if (1 > l)
        for (var x = (this.prevSize = 0); x < this.solvedStates.length; x++) {
          var R = this.solvedStates[x];
          R in this.prunTable ||
            ((this.prunTable[R] = l), this.prunTableSize++);
        }
      else this.updatePrunBFS(l - 1);
      if (0 == this.cost) break;
      this.prunDepth = l;
      DEBUG &&
        console.log(
          "[gSolver] updatePrun",
          l,
          this.prunTableSize - this.prevSize,
          +new Date() - D
        );
      this.prevSize = this.prunTableSize;
    }
  };
  u.updatePrunBFS = function (d) {
    if (null == this.toUpdateArr) {
      this.toUpdateArr = [];
      for (var l in this.prunTable)
        this.prunTable[l] == d && this.toUpdateArr.push(l);
    }
    for (; 0 != this.toUpdateArr.length; ) {
      l = this.toUpdateArr.pop();
      for (var D = 0; D < this.movesList.length; D++) {
        var x = this.doMove(l, this.movesList[D][0]);
        !x ||
          x in this.prunTable ||
          ((this.prunTable[x] = d + 1), this.prunTableSize++);
      }
      if (0 <= this.cost) {
        if (0 == this.cost) return;
        this.cost--;
      }
    }
    this.toUpdateArr = null;
  };
  u.search = function (d, l, D) {
    this.sol = [];
    this.subOpt = !1;
    this.state = d;
    this.visited = {};
    this.maxl = l || 0;
    return this.searchNext(D);
  };
  u.searchNext = function (d, l) {
    d = d + 1 || 99;
    this.prevSolStr = this.solArr ? this.solArr.join(",") : null;
    this.solArr = null;
    for (this.cost = l || -1; this.maxl < d; this.maxl++) {
      this.updatePrun(Math.ceil(this.maxl / 2));
      if (0 == this.cost) return null;
      if (this.idaSearch(this.state, this.maxl, null, 0)) break;
    }
    return this.solArr;
  };
  u.getPruning = function (d) {
    d = this.prunTable[d];
    return void 0 === d ? this.prunDepth + 1 : d;
  };
  u.idaSearch = function (d, l, D, x) {
    var R = this;
    if (this.getPruning(d) > l) return !1;
    if (0 == l) {
      if (-1 == this.solvedStates.indexOf(d)) return !1;
      d = this.sol.map(function (M) {
        return R.movesList[M][0];
      });
      this.subOpt = !0;
      if (d.join(",") == this.prevSolStr) return !1;
      this.solArr = d;
      return !0;
    }
    if (!this.subOpt) {
      if (d in this.visited && this.visited[d] < x) return !1;
      this.visited[d] = x;
    }
    if (0 <= this.cost) {
      if (0 == this.cost) return !0;
      this.cost--;
    }
    var G = null == D ? "" : this.movesList[D][0];
    D = null == D ? -1 : this.movesList[D][1];
    for (var L = this.sol[x] || 0; L < this.movesList.length; L++) {
      var F = this.movesList[L],
        K = F[1] ^ D;
      F = F[0];
      if (
        !(0 == K || (0 == (K & 15) && F <= G)) &&
        (K = this.doMove(d, F)) &&
        K != d
      ) {
        this.sol[x] = L;
        if (this.idaSearch(K, l - 1, L, x + 1)) return !0;
        this.sol.pop();
      }
    }
    return !1;
  };
  var V = (function () {
      function d(G, L) {
        if (L && (L != x || D > G)) {
          for (var F = [], K = 0; K < L.length; K++) F[K] = L.charCodeAt(K);
          isaac.seed(F);
          l = isaac.random;
          D = 0;
          x = L;
        }
        for (; D < G; ) l(), D++;
      }
      var l,
        D,
        x,
        R = "" + new Date().getTime();
      "undefined" != typeof crypto && crypto.getRandomValues
        ? ((R = String.fromCharCode.apply(
            null,
            crypto.getRandomValues(new Uint16Array(256))
          )),
          DEBUG && console.log("[mathlib] use crypto seed", R))
        : DEBUG && console.log("[mathlib] use datetime seed", R);
      d(256, R);
      return {
        random: function () {
          D++;
          return l();
        },
        getSeed: function () {
          return [D, x];
        },
        setSeed: d,
      };
    })(),
    Q = /^\s*(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)\s*$/;
  Math.TAU = 2 * Math.PI;
  return {
    Cnk: A,
    fact: w,
    bitCount: f,
    getPruning: E,
    setNOri: g,
    getNOri: k,
    setNPerm: n,
    getNPerm: C,
    getNParity: c,
    permMul4: I,
    Coord: a,
    createMove: e,
    createMoveHash: function (d, l, D, x) {
      var R = [d],
        G = {},
        L = [];
      G[D(d)] = 0;
      L[0] = 1;
      d = [];
      for (var F = 0; F < l.length; F++) d[F] = [];
      for (var K = +new Date(), M = 0; M < R.length; M++) {
        M == L.at(-1) && L.push(R.length);
        9999 == M % 1e4 &&
          DEBUG &&
          console.log(M, "states scanned, tt=", +new Date() - K);
        var S = R[M];
        for (F = 0; F < l.length; F++) {
          var Z = x(S, l[F]);
          if (Z) {
            var fa = D(Z);
            fa in G || ((G[fa] = R.length), R.push(Z));
            d[F][M] = G[fa];
          } else d[F][M] = -1;
        }
      }
      DEBUG &&
        console.log(
          "[move hash] " + R.length + " states generated, tt=",
          +new Date() - K,
          JSON.stringify(L)
        );
      return [d, G];
    },
    edgeMove: function (d, l) {
      0 == l
        ? b(d, 0, 7, 8, 4, 1)
        : 1 == l
        ? b(d, 3, 6, 11, 7, 0)
        : 2 == l
        ? b(d, 0, 1, 2, 3, 0)
        : 3 == l
        ? b(d, 2, 5, 10, 6, 1)
        : 4 == l
        ? b(d, 1, 4, 9, 5, 0)
        : 5 == l && b(d, 11, 10, 9, 8, 0);
    },
    circle: N,
    circleOri: b,
    acycle: t,
    createPrun: p,
    CubieCube: h,
    minx: v,
    SOLVED_FACELET: "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB",
    fillFacelet: function (d, l, D, x, R) {
      for (var G = 0; G < d.length; G++) {
        var L = d[G],
          F = void 0 === D[G] ? G : D[G];
        if ("number" == typeof L) l[L] = ~~(d[F] / R);
        else
          for (var K = x[G] || 0, M = 0; M < L.length; M++)
            l[L[(M + K) % L.length]] = ~~(d[F][M] / R);
      }
    },
    detectFacelet: function (d, l, D, x, R) {
      for (var G = 0; G < d.length; G++) {
        var L = d[G].length,
          F = 0;
        a: for (; F < d.length + 1; F++) {
          if (F == d.length) return -1;
          if (d[F].length == L)
            for (var K = 0; K < L; K++) {
              for (var M = !0, S = 0; S < L; S++)
                if (~~(d[F][S] / R) != l[d[G][(S + K) % L]]) {
                  M = !1;
                  break;
                }
              if (M) {
                D[G] = F;
                x[G] = K;
                break a;
              }
            }
        }
      }
      return 0;
    },
    rn: H,
    rndEl: function (d) {
      return d[~~(V.random() * d.length)];
    },
    rndProb: function (d) {
      for (var l = 0, D = 0, x = 0; x < d.length; x++)
        0 != d[x] && (V.random() < d[x] / (l + d[x]) && (D = x), (l += d[x]));
      return D;
    },
    rndHit: function (d) {
      return V.random() < d;
    },
    time2str: function (d, l) {
      if (!d) return "N/A";
      d = new Date(1e3 * d);
      return (l || "%Y-%M-%D %h:%m:%s")
        .replace("%Y", d.getFullYear())
        .replace("%M", ("0" + (d.getMonth() + 1)).slice(-2))
        .replace("%D", ("0" + d.getDate()).slice(-2))
        .replace("%h", ("0" + d.getHours()).slice(-2))
        .replace("%m", ("0" + d.getMinutes()).slice(-2))
        .replace("%s", ("0" + d.getSeconds()).slice(-2))
        .replace("%S", ("00" + d.getMilliseconds()).slice(-3));
    },
    str2time: function (d) {
      d = Q.exec(d);
      if (!d) return null;
      var l = new Date(0);
      l.setFullYear(~~d[1]);
      l.setMonth(~~d[2] - 1);
      l.setDate(~~d[3]);
      l.setHours(~~d[4]);
      l.setMinutes(~~d[5]);
      l.setSeconds(~~d[6]);
      return ~~(l.getTime() / 1e3);
    },
    obj2str: function (d) {
      return "string" == typeof d ? d : JSON.stringify(d);
    },
    str2obj: function (d) {
      return "string" != typeof d ? d : JSON.parse(d);
    },
    valuedArray: y,
    idxArray: function (d, l) {
      return d.map(function (D) {
        return D[l];
      });
    },
    Solver: q,
    Searcher: m,
    rndPerm: function (d, l) {
      for (var D = 0, x = [], R = 0; R < d; R++) x[R] = R;
      for (R = 0; R < d - 1; R++) {
        var G = H(d - R);
        N(x, R, R + G);
        D ^= 0 != G;
      }
      l && D && N(x, 0, 1);
      return x;
    },
    permOriMult: function (d, l, D, x, R, G, L) {
      for (var F = 0; F < l.length; F++)
        L && (G[F] = (x[l[F]] + R[F]) % L), (D[F] = d[l[F]]);
    },
    gSolver: r,
    getSeed: V.getSeed,
    setSeed: V.setSeed,
  };
})();
var grouplib = (function (b) {
  function N(c, k) {
    for (var g = [], f = 0; f < c.length; f++) g[f] = k[c[f]];
    return g;
  }
  function t(c) {
    for (var k = [], g = 0; g < c.length; g++) k[c[g]] = g;
    return k;
  }
  function E(c, k) {
    if (c.sgs) this.copy(c);
    else {
      this.sgs = [];
      this.sgsi = [];
      this.t2i = [];
      this.i2t = [];
      this.keyIdx = [];
      this.Tk = [];
      this.e = [];
      for (var g = c[0].length, f = 0; f < g; f++) this.e[f] = f;
      for (f = 0; f < g; f++)
        this.sgs.push([]),
          this.sgsi.push([]),
          this.t2i.push([]),
          this.i2t.push([f]),
          this.Tk.push([]),
          (this.sgs[f][f] = this.e),
          (this.sgsi[f][f] = this.e),
          (this.t2i[f][f] = 0);
      this.extend(c, k);
    }
  }
  function n(c) {
    this.gens = c;
    this.glen = c.length;
    this.trieNodes = [null];
    this.trieNodes.push([]);
    this.skipSeqs = [];
  }
  function C(c, k, g) {
    this.genG = c;
    this.genH = k;
    this.genM = g;
    if (!k) {
      k = [];
      for (g = 0; g < c[0].length; g++) k[g] = g;
      this.genH = [k];
    }
  }
  E.prototype.extend = function (c, k) {
    for (var g = 0; g < c.length; g++) {
      var f = c[g];
      k && (f = N(N(t(k), f), k));
      0 > this.isMember(f) && this.knutha(this.e.length - 1, f);
    }
  };
  E.prototype.copy = function (c) {
    this.sgs = [];
    this.sgsi = [];
    this.t2i = [];
    this.i2t = [];
    this.keyIdx = c.keyIdx.slice();
    this.Tk = [];
    this.e = c.e;
    for (var k = this.e.length, g = 0; g < k; g++)
      (this.sgs[g] = c.sgs[g].slice()),
        (this.sgsi[g] = c.sgsi[g].slice()),
        (this.t2i[g] = c.t2i[g].slice()),
        (this.i2t[g] = c.i2t[g].slice()),
        (this.Tk[g] = c.Tk[g].slice());
  };
  E.prototype.toKeyIdx = function (c) {
    var k = [];
    c = c || this.e;
    for (var g = 0; g < this.keyIdx.length; g++) k[g] = c[this.keyIdx[g]];
    return k;
  };
  E.prototype.isMember = function (c, k) {
    k = k || 0;
    for (var g = 0, f = [], a = c.length - 1; a >= k; a--) {
      for (var e = c[a], h = 0; h < f.length; h++) e = f[h][e];
      if (e !== a) {
        if (!this.sgs[a][e]) return -1;
        f.push(this.sgsi[a][e]);
      }
      g = g * this.i2t[a].length + this.t2i[a][e];
    }
    return g;
  };
  E.prototype.isSubgroupMemberByKey = function (c, k) {
    for (var g = 0, f = [], a = 0; a < this.keyIdx.length; a++) {
      for (var e = this.keyIdx[a], h = c[a], p = 0; p < f.length; p++)
        h = f[p][h];
      if (h !== e) {
        if (!k.sgs[e][h]) return -1;
        f.push(k.sgsi[e][h]);
      }
      g = g * k.i2t[e].length + k.t2i[e][h];
    }
    return g;
  };
  E.prototype.knutha = function (c, k) {
    this.Tk[c].push(k);
    for (var g = 0; g < this.sgs[c].length; g++)
      this.sgs[c][g] && this.knuthb(c, N(this.sgs[c][g], k));
  };
  E.prototype.knuthb = function (c, k) {
    var g = k[c];
    if (this.sgs[c][g])
      (k = N(k, this.sgsi[c][g])),
        0 > this.isMember(k) && this.knutha(c - 1, k);
    else
      for (
        this.sgs[c][g] = k,
          this.sgsi[c][g] = t(k),
          this.t2i[c][g] = this.i2t[c].length,
          this.i2t[c].push(g),
          2 == this.i2t[c].length &&
            (this.keyIdx.push(c),
            this.keyIdx.sort(function (f, a) {
              return a - f;
            })),
          g = 0;
        g < this.Tk[c].length;
        g++
      )
        this.knuthb(c, N(k, this.Tk[c][g]));
  };
  E.prototype.size = function (c) {
    for (var k = this.sgs.length, g = c ? BigInt(1) : 1, f = 0; f < k; f++)
      g *= c ? BigInt(this.i2t[f].length) : this.i2t[f].length;
    return g;
  };
  E.prototype.minElem = function (c, k) {
    c = t(c);
    for (k = 0; k < this.keyIdx.length; k++) {
      for (
        var g = this.keyIdx[k], f = c[g], a = g, e = 1;
        e < this.i2t[g].length;
        e++
      ) {
        var h = this.i2t[g][e];
        c[h] > f && ((f = c[h]), (a = h));
      }
      a !== g && (c = N(this.sgs[g][a], c));
    }
    return t(c);
  };
  E.prototype.listCoset = function (c) {
    var k = [this.e.slice()],
      g = 1,
      f = this.keyIdx.length - 1;
    a: for (; 0 <= f; f--) {
      var a = this.keyIdx[f];
      if (this.i2t[a].length != c.i2t[a].length) {
        g *= this.i2t[a].length;
        g /= c.i2t[a].length;
        for (var e = 0, h = k.length; e < h; e++) {
          var p = k[e],
            q = 1;
          b: for (; q < this.i2t[a].length; q++) {
            for (
              var m = this.i2t[a][q], r = N(p, this.sgs[a][m]), H = 1;
              H < c.i2t[a].length;
              H++
            )
              if (r[c.i2t[a][H]] > m) continue b;
            k.push(r);
            if (k.length >= g) continue a;
          }
        }
        console.log(
          "[grouplib] listCoset ERROR, Not enough coset representatives"
        );
      }
    }
    return k;
  };
  E.prototype.rndElem = function () {
    for (var c = this.e.slice(), k = this.e.length - 1; 0 <= k; k--) {
      for (var g = 0, f = 0, a = 0; a <= k; a++)
        this.sgs[k][a] && 1 > b(++g) && (f = a);
      f !== k && (c = N(c, this.sgsi[k][f]));
    }
    return c;
  };
  n.prototype.addSkipSeq = function (c) {
    this.skipSeqs.push(c.slice());
    for (var k = 1, g = 0; g < c.length; g++) {
      var f = ~~this.trieNodes[k][c[g]];
      if (-1 == f) break;
      if (g == c.length - 1) {
        this.trieNodes[k][c[g]] = -1;
        break;
      }
      if (0 >= f)
        for (
          f = this.trieNodes.length,
            this.trieNodes.push([]),
            this.trieNodes[k][c[g]] = f,
            k = 0;
          k < this.glen;
          k++
        )
          this.updateNext(c.slice(0, g + 1).concat(k));
      k = f;
    }
  };
  n.prototype.traversalTrie = function (c, k, g) {
    if (!(0 >= c)) {
      for (var f = 0; f < this.glen; f++)
        k.push(f), this.traversalTrie(~~this.trieNodes[c][f], k, g), k.pop();
      g(c, k);
    }
  };
  n.prototype.updateNext = function (c) {
    for (var k = 1, g = 0; g < c.length; g++) {
      var f = ~~this.trieNodes[k][c[g]];
      0 == f &&
        ((f = this.updateNext(c.slice(1, g + 1))),
        (f = 0 < f ? ~f : f),
        (this.trieNodes[k][c[g]] = f));
      if (-1 == f) return -1;
      0 > f && (f = ~f);
      k = f;
    }
    return k;
  };
  n.prototype.refillNext = function () {
    var c = this;
    this.traversalTrie(1, [], function (k, g) {
      for (g = 0; g < c.glen; g++) {
        var f = ~~c.trieNodes[k][g];
        -1 != f && f <= k && (c.trieNodes[k][g] = 0);
      }
    });
    this.traversalTrie(1, [], function (k, g) {
      for (var f = 0; f < c.glen; f++) {
        0 == (f & 31) && (c.trieNodes[k][c.glen + (f >> 5)] = 0);
        var a = ~~c.trieNodes[k][f];
        -1 != a && a <= k && c.updateNext(g.concat(f));
        -1 == ~~c.trieNodes[k][f] &&
          (c.trieNodes[k][c.glen + (f >> 5)] |= 1 << (f & 31));
      }
    });
  };
  n.prototype.countSeq = function (c, k) {
    var g = k ? BigInt(0) : 0,
      f = k ? [BigInt(0), BigInt(1)] : [0, 1];
    k = k ? [BigInt(0), BigInt(1)] : [1];
    for (var a = 0; a < c; a++) {
      for (var e = [], h = g, p = 1; p < this.trieNodes.length; p++) {
        var q = f[p] || g;
        if (0 != q)
          for (var m = 0; m < this.glen; m++) {
            var r = ~~this.trieNodes[p][m];
            -1 != r &&
              ((r = 0 > r ? ~r : r), (e[r] = (e[r] || g) + q), (h += q));
          }
      }
      f = e;
      k.push(h);
    }
    return k;
  };
  n.prototype.countSeqMove = function (c, k, g) {
    var f = [];
    f[g * this.trieNodes.length + 1 - 1] = 1;
    g = [];
    for (var a = 0; a < c; a++) {
      for (var e = [], h = [], p = 0, q = 0; q < k[0].length; q++)
        for (var m = 1; m < this.trieNodes.length; m++) {
          var r = f[q * this.trieNodes.length + m - 1] || 0;
          if (0 != r)
            for (var H = 0; H < this.glen; H++) {
              var y = ~~this.trieNodes[m][H];
              if (-1 != y) {
                y = 0 > y ? ~y : y;
                var A = k[H][q];
                y = A * this.trieNodes.length + y - 1;
                e[y] = (e[y] || 0) + r;
                h[A] = (h[A] || 0) + r;
                p += r;
              }
            }
        }
      f = e;
      g.push(h, p);
    }
    return g;
  };
  n.prototype.initTrie = function (c) {
    this.trieNodes = [null];
    this.trieNodes.push([]);
    this.refillNext();
    for (var k = [], g = 0; g < this.gens[0].length; g++) k[g] = g;
    g = new Map();
    for (var f = 0; f <= c; f++)
      this.searchSkip(k, f, [], 1, g), this.refillNext();
  };
  n.prototype.searchSkip = function (c, k, g, f, a) {
    if (0 == k)
      (c = String.fromCharCode.apply(null, c)),
        a.has(c) ? this.addSkipSeq(g) : a.set(c, g.slice());
    else
      for (var e = 0; e < this.glen; e++) {
        var h = this.trieNodes[f][e];
        if (-1 != h) {
          0 > h && (h = ~h);
          var p = N(this.gens[e], c);
          g.push(e);
          this.searchSkip(p, k - 1, g, h, a);
          g.pop();
        }
      }
  };
  C.prototype.permHash = function (c) {
    return String.fromCharCode.apply(null, c);
  };
  C.prototype.midCosetHash = function (c) {
    return null == this.sgsM
      ? this.sgsG.isMember(t(c), this.sgsMdepth)
      : this.permHash(this.sgsM.minElem(c));
  };
  C.prototype.initTables = function (c) {
    if (!this.coset2idx) {
      c = c || 1e5;
      this.sgsH = new E(this.genH);
      this.sgsG = new E(this.sgsH);
      this.sgsG.extend(this.genG);
      var k = this.sgsG.size() / this.sgsH.size();
      this.isCosetSearch = 1 < this.sgsH.size();
      var g = 1;
      if (this.genM)
        (this.sgsM = new E(this.genM)),
          (g = this.sgsG.size() / this.sgsM.size());
      else if (1 == this.sgsH.size()) {
        this.sgsM = null;
        this.sgsMdepth = 0;
        for (
          var f = this.sgsG.e.length - 1;
          0 <= f && !(g * this.sgsG.i2t[f].length > c);
          f--
        )
          (this.sgsMdepth = f), (g *= this.sgsG.i2t[f].length);
      } else
        k <= c
          ? ((this.sgsM = new E(this.genH)), (g = k))
          : ((this.sgsM = null), (this.sgsMdepth = this.sgsG.e.length));
      this.clen = g;
      DEBUG &&
        console.log("[Subgroup Solver] coset space:", k, "mid coset size:", g);
      this.genEx = [];
      this.genExi = [];
      this.genExMap = [];
      var a = new Map();
      a.set(this.permHash(this.sgsG.e), -1);
      for (f = 0; f < this.genG.length; f++) {
        c = this.genG[f];
        for (var e = 1; ; ) {
          k = this.permHash(c);
          if (a.has(k)) break;
          a.set(k, this.genEx.length);
          this.genEx.push(c);
          this.genExi.push(t(c));
          this.genExMap.push([f, e]);
          c = N(this.genG[f], c);
          e++;
        }
      }
      this.glen = this.genEx.length;
      for (f = 0; f < this.glen; f++)
        (c = t(this.genEx[f])), (this.genExMap[f][2] = a.get(this.permHash(c)));
      this.canon = new n(this.genEx);
      this.canon.initTrie(2);
      this.canoni = new n(this.genEx);
      for (f = 0; f < this.canon.skipSeqs.length; f++) {
        c = this.canon.skipSeqs[f].slice();
        c.reverse();
        for (a = 0; a < c.length; a++) c[a] = this.genExMap[c[a]][2];
        this.canoni.addSkipSeq(c);
      }
      this.canoni.refillNext();
      this.moveTable = [];
      this.idx2coset = [this.sgsG.e];
      this.coset2idx = {};
      for (
        f = this.coset2idx[this.midCosetHash(this.sgsG.e)] = 0;
        f < this.idx2coset.length;
        f++
      ) {
        if (f >= g) {
          console.log("ERROR!");
          break;
        }
        c = this.idx2coset[f];
        for (a = 0; a < this.glen; a++)
          1 == this.genExMap[a][1] &&
            ((e = N(this.genEx[a], c)),
            (k = this.midCosetHash(e)),
            k in this.coset2idx ||
              ((this.coset2idx[k] = this.idx2coset.length),
              this.idx2coset.push(e)),
            (this.moveTable[f * this.glen + a] = this.coset2idx[k]));
      }
      g = null;
      for (a = 0; a < this.glen; a++)
        if (1 == this.genExMap[a][1]) g = a;
        else
          for (f = 0; f < this.clen; f++)
            this.moveTable[f * this.glen + a] =
              this.moveTable[
                this.moveTable[f * this.glen + a - 1] * this.glen + g
              ];
      this.prunTable = this.initPrunTable(this.sgsG.e);
      DEBUG &&
        console.log(
          "[Subgroup Solver] prun table size:",
          this.prunTable[0].length
        );
    }
  };
  C.prototype.idaMidSearch = function (c, k, g, f, a, e, h, p, q) {
    var m = p[0][c];
    if (m > k) return !1;
    if (0 == k) {
      if (c >= this.clen) {
        a.push(-1);
        var r = N(e, h),
          H = q(a, r);
        a.pop();
        return H;
      }
      return q(a, e);
    }
    if (
      c >= this.clen &&
      0 != g &&
      ((H = p[3][c - this.clen]),
      a.push(-1),
      (r = N(e, h)),
      (H = this.idaMidSearch(H, k, 1, f, a, r, h, p, q)),
      a.pop(),
      H)
    )
      return H;
    g = f[g || 1];
    for (var y = c * ((this.glen + 31) >> 5), A = 0; A < this.glen; A += 32) {
      var w = g[this.glen + (A >> 5)];
      w |= m >= k - 1 ? p[m - k + 2][y + (A >> 5)] : 0;
      for (
        w = ~w & (32 <= this.glen - A ? -1 : (1 << (this.glen - A)) - 1);
        0 != w;

      ) {
        r = 31 - Math.clz32(w);
        w -= 1 << r;
        r += A;
        H = c % this.clen;
        H = this.moveTable[H * this.glen + r] + c - H;
        if (DEBUG && p[0][H] >= k) debugger;
        var v = g[r];
        a.push(r);
        r = N(e, this.genExi[r]);
        H = this.idaMidSearch(H, k - 1, v ^ (v >> 31), f, a, r, h, p, q);
        a.pop();
        if (H) return H;
      }
    }
    return !1;
  };
  C.prototype.initPrunTable = function (c, k) {
    for (
      var g = this.coset2idx[this.midCosetHash(c)],
        f = [],
        a = [],
        e = [],
        h = (this.glen + 31) >> 5,
        p = 0;
      p < this.clen;
      p++
    )
      f[p] = -1;
    var q = [];
    if (k) {
      for (p = 0; p < this.clen; p++)
        f.push(-1, -1),
          (q[p] = this.coset2idx[this.midCosetHash(N(c, this.idx2coset[p]))]),
          (q[q[p] + this.clen] = p);
      f[0] = 0;
    } else f[g] = 0;
    c = 1;
    for (p = g = 0; c != g; ) {
      g = c;
      for (var m = 0; m < f.length; m++)
        if (f[m] == p) {
          for (var r = m % this.clen, H = m - r, y = 0; y < this.glen; y++) {
            var A = this.moveTable[r * this.glen + y] + H,
              w = f[A];
            -1 == f[A] && ((f[A] = p + 1), (w = p + 1), c++);
            w > p && (a[m * h + (y >> 5)] |= 1 << (y & 31));
            w >= p && (e[m * h + (y >> 5)] |= 1 << (y & 31));
          }
          if (k && 0 == H)
            for (y = 0; 2 > y; y++)
              (A = q[r + (1 - y) * this.clen] + (y + 1) * this.clen),
                -1 == f[A] && ((f[A] = p), c++);
        }
      p++;
    }
    return [f, a, e, q, p];
  };
  C.prototype.checkPerm = function (c) {
    this.initTables();
    return 0 <= this.sgsH.isMember(c) ? 1 : 0 > this.sgsG.isMember(c) ? 2 : 0;
  };
  C.ONLY_IDA = 1;
  C.ALLOW_PRE = 2;
  C.prototype.DissectionSolve = function (c, k, g, f, a) {
    var e = this;
    f = f || {};
    var h = $.now();
    this.initTables();
    DEBUG &&
      console.log("[Subgroup Solver] finished init tables, tt=", $.now() - h);
    if (0 > this.sgsG.isMember(c))
      console.log("[Subgroup Solver] NOT A MEMBER OF G");
    else {
      var p = this.coset2idx[this.midCosetHash(c)];
      if (p || 0 === p) {
        var q = 0 != (f.mask & C.ONLY_IDA),
          m = 0 != (f.mask & C.ALLOW_PRE) && this.isCosetSearch,
          r = null,
          H = this.prunTable,
          y = null;
        m &&
          ((f.prunTable = f.prunTable || this.initPrunTable(c, m)),
          (H = y = f.prunTable),
          (p = this.clen));
        DEBUG &&
          console.log(
            "[Subgroup Solver] finish init searching, prun value:",
            H[0][p],
            "tt=",
            $.now() - h
          );
        for (k = Math.max(k, H[0][p]); k <= g; k++) {
          var A = 0;
          f = 0;
          var w = t(c);
          if (q || k <= this.prunTable[4])
            (r = this.idaMidSearch(
              m ? this.clen : p,
              k,
              1,
              this.canon.trieNodes,
              [],
              this.sgsG.toKeyIdx(m ? null : w),
              w,
              H,
              function (Q, d) {
                A++;
                if (!(0 > e.sgsG.isSubgroupMemberByKey(d, e.sgsH))) {
                  d = [];
                  for (var l = 0; l < Q.length; l++)
                    d.push(-1 == Q[l] ? -1 : e.genExMap[Q[l]].slice(0, 2));
                  return a ? a(d) : d;
                }
              }
            )),
              DEBUG &&
                console.log(
                  "[Subgroup Solver] ida ",
                  A + f,
                  "node(s) checked at",
                  k,
                  "tt=",
                  $.now() - h
                );
          else {
            var v = ~~(k / 2);
            y || (y = this.initPrunTable(c, m));
            for (
              var u = m ? 2 : 1, I = 0, z = [], O = 0;
              O < this.clen * u;
              O++
            ) {
              var J = O,
                P = O + (m ? (O >= this.clen ? -this.clen : 2 * this.clen) : 0);
              if (!(H[0][J] > v || y[0][P] > k - v)) {
                I++;
                var W = new Map(),
                  X = 0,
                  V = 0;
                r = this.isCosetSearch ? this.sgsG.e : this.sgsG.toKeyIdx();
                this.idaMidSearch(
                  J,
                  v,
                  0,
                  this.canon.trieNodes,
                  [],
                  r,
                  w,
                  H,
                  function (Q, d) {
                    e.isCosetSearch
                      ? ((d = e.sgsH.minElem(d)), (d = e.permHash(d)))
                      : (d = e.permHash(d));
                    X++;
                    var l = W.get(d) || [];
                    l.push(Q.slice());
                    W.set(d, l);
                  }
                );
                r = this.idaMidSearch(
                  P,
                  k - v,
                  1,
                  this.canoni.trieNodes,
                  [],
                  r,
                  c,
                  y,
                  function (Q, d) {
                    d = m ? d : N(d, c);
                    if (e.isCosetSearch) {
                      d = e.sgsH.minElem(d);
                      var l = e.permHash(d);
                    } else l = e.permHash(d);
                    V++;
                    if (W.has(l)) {
                      d = [];
                      for (var D = 1, x = 0; x < Q.length; x++) {
                        var R = Q[Q.length - 1 - x];
                        R = -1 == R ? -1 : e.genExMap[R][2];
                        D = -1 == R ? 1 : e.canon.trieNodes[D][R];
                        if (DEBUG && -1 == D) debugger;
                        D ^= D >> 31;
                        d.push(-1 == R ? -1 : e.genExMap[R].slice(0, 2));
                      }
                      Q = W.get(l);
                      for (x = 0; x < Q.length; x++) {
                        l = d.slice();
                        for (var G = D, L = 0; L < Q[x].length; L++) {
                          R = Q[x][L];
                          G = -1 == R ? 1 : e.canon.trieNodes[G][R];
                          if (-1 == G) break;
                          G ^= G >> 31;
                          l.push(-1 == R ? -1 : e.genExMap[R].slice(0, 2));
                        }
                        if (-1 != G && (R = a ? a(l) : l)) return R;
                      }
                    }
                  }
                );
                z.push([O, X, V]);
                A += X;
                f += V;
                if (r) break;
              }
            }
            DEBUG &&
              console.log(
                "[Subgroup Solver] dis ",
                A + f,
                "node(s) checked at",
                k,
                "tt=",
                $.now() - h
              );
          }
          if (r) break;
        }
        return r;
      }
      console.log("[Subgroup Solver] ERROR!");
    }
  };
  C.prototype.godsAlgo = function (c) {
    var k = this;
    this.initTables();
    for (var g = 0, f = 0; f < this.clen; f++)
      for (var a = new Set(), e = 0; e <= c; e++) {
        var h = this.isCosetSearch ? this.sgsG.e : this.sgsG.toKeyIdx();
        this.idaMidSearch(
          f,
          e,
          1,
          this.canon.trieNodes,
          [],
          h,
          null,
          this.prunTable,
          function (p, q) {
            k.isCosetSearch
              ? ((p = k.sgsH.minElem(q)), (p = k.permHash(p)))
              : (p = k.permHash(q));
            a.has(p) || (g++, a.add(p));
          }
        );
      }
    return g;
  };
  return {
    permMult: N,
    permInv: t,
    permCmp: function (c, k) {
      if (c.length != k.length) return c.length - k.length;
      for (var g = c.length - 1; 0 <= g; g--)
        if (c[g] != k[g]) return c[g] - k[g];
      return 0;
    },
    CanonSeqGen: n,
    SchreierSims: E,
    SubgroupSolver: C,
  };
})(mathlib.rn);
var poly3d = (function () {
  function b(a, e, h) {
    this.x = a;
    this.y = e;
    this.z = h;
  }
  function N(a, e) {
    var h = Math.cos(e);
    e = Math.sin(e);
    var p = 1 - h,
      q = a.x,
      m = a.y;
    a = a.z;
    var r = p * q,
      H = p * m;
    this.mat = [
      r * q + h,
      r * m - e * a,
      r * a + e * m,
      r * m + e * a,
      H * m + h,
      H * a - e * q,
      r * a - e * m,
      H * a + e * q,
      p * a * a + h,
    ];
  }
  function t(a, e) {
    this.norm = a;
    this.dis = "number" == typeof e ? e : 1;
  }
  function E(a, e, h) {
    this.ct = a;
    this.radius = e;
    h && (this.norm = h);
  }
  function n(a, e) {
    this.p1 = a;
    this.p2 = e;
  }
  function C(a, e, h, p) {
    this.p1 = a;
    this.p2 = e;
    this.ct = h;
    this.norm = p;
    this._fu = this.p1.add(this.ct, -1).normalized();
    this._fv = this.norm.outprod(this._fu);
    this._radius = this.ct.abs(a);
    a = this.p2.add(this.ct, -1);
    this._ang =
      ((Math.atan2(this._fv.inprod(a), this._fu.inprod(a)) +
        2 * Math.PI +
        1e-6) %
        (2 * Math.PI)) -
      1e-6;
  }
  function c(a) {
    this.paths = a.slice();
    for (var e, h = 0; h < a.length; h++) {
      if (a[h].ct) {
        e = a[h].norm;
        break;
      }
      var p = a[0].p2.add(a[0].p1, -1).outprod(a[1].p2.add(a[1].p1, -1));
      if (p.abs() > 1e-6 * 10) {
        e = p.normalized();
        break;
      }
    }
    this.area = 0;
    if (e) {
      p = new b(0, 0, 0);
      for (h = 1; h < a.length - 1; h++) {
        var q =
          a[h].p1.add(a[0].p1, -1).outprod(a[h].p2.add(a[h].p1, -1)).inprod(e) /
          2;
        p = p.add(a[0].p1, q / 3);
        p = p.add(a[h].p1, q / 3);
        p = p.add(a[h].p2, q / 3);
        this.area += q;
      }
      for (h = 0; h < a.length; h++)
        if (a[h].ct) {
          var m = a[h],
            r =
              (4 * m._radius * Math.pow(Math.sin(m._ang / 2), 3)) /
              3 /
              (m._ang - Math.sin(m._ang));
          q =
            ((Math.pow(m._radius, 2) * (m._ang - Math.sin(m._ang))) / 2) *
            m.norm.inprod(e);
          m = m.ct.add(m.norm.outprod(m.p2.add(m.p1, -1)).normalized(), -r);
          p = p.add(m, q);
          this.area += q;
        }
      this.center = p.scalar(1 / this.area);
      this.norm = 0 < this.area ? e : e.scalar(-1);
      this.area = Math.abs(this.area);
      this.dis = this.norm.inprod(a[0].p1);
    }
  }
  function k(a, e, h) {
    this.facePlanes = a.slice();
    this.faceNames = h.slice();
    this.faceUVs = [];
    for (h = 0; h < a.length; h++) {
      var p = a[h].norm,
        q = e[h];
      q = q.add(p, -q.inprod(p)).normalized();
      p = q.outprod(p);
      this.faceUVs[h] = [p, q];
    }
    this.makeFacePolygons();
  }
  function g(a, e, h, p) {
    return {
      parseScramble: function (q, m, r, H) {
        if (!H || /^\s*$/.exec(H)) return [];
        r && (H = r(H));
        var y = [];
        H.replace(q, function () {
          var A = m.apply(null, arguments);
          A && y.push(["" + A[0] + A[1], A[2]]);
        });
        return y;
      }.bind(null, a, e, p),
      move2str: function (q, m) {
        var r = /^(\d+)([a-zA-Z]+)$/.exec(m[0]);
        if (!r) {
          debugger;
          return "";
        }
        return q(~~r[1], r[2], m[1]);
      }.bind(null, h),
    };
  }
  var f = b.prototype;
  f.abs = function (a) {
    return a
      ? Math.hypot(this.x - a.x, this.y - a.y, this.z - a.z)
      : Math.hypot(this.x, this.y, this.z);
  };
  f.add = function (a, e) {
    void 0 === e && (e = 1);
    return new b(this.x + a.x * e, this.y + a.y * e, this.z + a.z * e);
  };
  f.scalar = function (a) {
    return new b(this.x * a, this.y * a, this.z * a);
  };
  f.normalized = function () {
    var a = Math.hypot(this.x, this.y, this.z);
    return 1e-6 > a
      ? new b(1, 0, 0)
      : new b(this.x / a, this.y / a, this.z / a);
  };
  f.inprod = function (a) {
    return this.x * a.x + this.y * a.y + this.z * a.z;
  };
  f.outprod = function (a) {
    return new b(
      this.y * a.z - this.z * a.y,
      this.z * a.x - this.x * a.z,
      this.x * a.y - this.y * a.x
    );
  };
  f.triangleArea = function (a, e) {
    var h = a.x - this.x,
      p = a.y - this.y;
    a = a.z - this.z;
    var q = e.x - this.x,
      m = e.y - this.y;
    e = e.z - this.z;
    return Math.hypot(p * e - a * m, a * q - h * e, h * m - p * q) / 2;
  };
  f = N.prototype;
  f.perform = function (a) {
    var e = this.mat;
    return new b(
      e[0] * a.x + e[1] * a.y + e[2] * a.z,
      e[3] * a.x + e[4] * a.y + e[5] * a.z,
      e[6] * a.x + e[7] * a.y + e[8] * a.z
    );
  };
  t.prototype.side = function (a) {
    return this.norm.inprod(a) - this.dis;
  };
  E.prototype.side = function (a) {
    return (
      (this.ct.abs(a) - Math.abs(this.radius)) * (0 < this.radius ? 1 : -1)
    );
  };
  f = n.prototype;
  f.getMid = function () {
    return this.p1.add(this.p2).scalar(0.5);
  };
  f.genMids = function () {
    return [];
  };
  f.slice = function (a, e) {
    return new n(a, e);
  };
  f.revert = function () {
    return new n(this.p2, this.p1);
  };
  f.rankKey = function (a) {
    return this.p2.add(this.p1, -1).inprod(a);
  };
  f.intersect = function (a) {
    var e = [];
    if (a instanceof t) {
      var h = this.p1.inprod(a.norm) - a.dis,
        p = this.p2.inprod(a.norm) - a.dis;
      if (1e-6 > Math.abs(h - p)) return [];
      a = -h / (p - h);
      1e-6 > Math.abs(a) || 1e-6 > Math.abs(a - 1)
        ? e.push(1e-6 > Math.abs(a) ? this.p1 : this.p2)
        : 0 < a && 1 > a && e.push(this.p1.scalar(1 - a).add(this.p2, a));
    } else if (a instanceof E) {
      h = Math.pow(this.p1.abs(this.p2), 2);
      p = 2 * this.p2.add(this.p1, -1).inprod(this.p1.add(a.ct, -1));
      a = Math.pow(this.p1.abs(a.ct), 2) - Math.pow(a.radius, 2);
      var q = p * p - 4 * h * a;
      if (0 >= q) return [];
      for (var m = -1; 2 > m; m += 2)
        (a = (-p + m * Math.sqrt(q)) / (2 * h)),
          1e-6 > Math.abs(a) || 1e-6 > Math.abs(a - 1)
            ? e.push(1e-6 > Math.abs(a) ? this.p1 : this.p2)
            : 0 < a && 1 > a && e.push(this.p1.scalar(1 - a).add(this.p2, a));
    }
    return e;
  };
  f = C.prototype;
  f.getMid = function () {
    return this.ct
      .add(this._fu, Math.cos(this._ang / 2) * this._radius)
      .add(this._fv, Math.sin(this._ang / 2) * this._radius);
  };
  f.genMids = function () {
    for (
      var a = Math.ceil(((this._ang / Math.PI) * 180) / 10), e = [], h = 0;
      h < a - 1;
      h++
    ) {
      var p = (this._ang / a) * (h + 1);
      e.push(
        this.ct
          .add(this._fu, Math.cos(p) * this._radius)
          .add(this._fv, Math.sin(p) * this._radius)
      );
    }
    return e;
  };
  f.slice = function (a, e) {
    return new C(a, e, this.ct, this.norm);
  };
  f.revert = function () {
    return new C(this.p2, this.p1, this.ct, this.norm.scalar(-1));
  };
  f.rankKey = function (a) {
    a = a.add(this.ct, -1);
    return Math.atan2(this._fv.inprod(a), this._fu.inprod(a));
  };
  f.intersect = function (a) {
    if (a instanceof t) {
      var e = this._radius * a.norm.inprod(this._fv);
      var h = this._radius * a.norm.inprod(this._fu);
      var p = a.dis - a.norm.inprod(this.ct);
    } else if (a instanceof E) {
      var q = this.ct.add(a.ct, -1);
      e = this._radius * q.inprod(this._fv);
      h = this._radius * q.inprod(this._fu);
      p =
        ((a.radius + this._radius) * (a.radius - this._radius) -
          Math.pow(this.ct.abs(a.ct), 2)) /
        2;
    }
    q = Math.atan2(-e, h);
    h = p / Math.hypot(e, h);
    if (1 <= Math.abs(h)) return [];
    e = [];
    h = Math.acos(h);
    for (p = -1; 2 > p; p += 2) {
      var m = ((p * h - q + 4 * Math.PI + 1e-6) % (2 * Math.PI)) - 1e-6;
      -1e-6 < m && m < this._ang + 1e-6 && e.push(m);
    }
    e.sort(function (r, H) {
      return r - H;
    });
    for (q = 0; q < e.length; q++)
      e[q] =
        1e-6 > Math.abs(e[q]) || 1e-6 > Math.abs(e[q] - this._ang)
          ? 1e-6 > Math.abs(e[q])
            ? this.p1
            : this.p2
          : this.ct
              .add(this._fu, Math.cos(e[q]) * this._radius)
              .add(this._fv, Math.sin(e[q]) * this._radius);
    for (q = 0; q < e.length; q++) {
      if (1e-6 < Math.abs(a.side(e[q]))) debugger;
      if (1e-6 < Math.abs(this.ct.abs(e[q]) - this._radius)) debugger;
      if (1e-6 < Math.abs(this.norm.inprod(this.ct) - this.norm.inprod(e[q])))
        debugger;
    }
    return e;
  };
  f = c.prototype;
  c.fromVertices = function (a) {
    for (var e = [], h = 0; h < a.length; h++)
      e.push(new n(a[h], a[(h + 1) % a.length]));
    return new c(e);
  };
  f.projection = function (a) {
    for (var e = [], h = 0; h < this.paths.length; h++)
      for (
        var p = [this.paths[h].p1].concat(this.paths[h].genMids()), q = 0;
        q < p.length;
        q++
      ) {
        for (var m = [], r = 0; r < a.length; r++) m.push(p[q].inprod(a[r]));
        e.push(m);
      }
    return e;
  };
  f.split = function (a) {
    for (
      var e = [[], []], h = 0, p = 0 > a.side(this.center) ? 1 : 0, q = 0;
      q < this.paths.length;
      q++
    ) {
      var m = this.paths[q],
        r = m.intersect(a);
      h += r.length;
      for (var H = m.p1, y = 0; y < r.length; y++)
        1e-6 < H.abs(r[y]) &&
          ((H = m.slice(H, r[y])),
          e[0 > a.side(H.getMid()) ? 1 : 0].push(H),
          (H = r[y]));
      1e-6 < H.abs(m.p2) &&
        ((m = H == m.p1 ? m : m.slice(H, m.p2)),
        (r = a.side(m.getMid())),
        e[1e-6 > Math.abs(r) ? p : 0 > r ? 1 : 0].push(m));
    }
    if (a instanceof t) {
      if (0 == h) return 0 == e[0].length ? [[], [this]] : [[this], []];
      var A = new n(new b(0, 0, 0), a.norm.outprod(this.norm));
    } else if (a instanceof E) {
      A = a.ct.add(this.norm, -this.norm.inprod(a.ct) + this.dis);
      q =
        Math.pow(a.radius, 2) - Math.pow(this.dis - this.norm.inprod(a.ct), 2);
      if (0 >= q) return 0 == e[0].length ? [[], [this]] : [[this], []];
      q = Math.sqrt(q);
      q = this.paths[1].p1
        .add(this.paths[0].p1, -1)
        .normalized()
        .scalar(q)
        .add(A);
      A = new C(q, q, A, this.norm.scalar(0 < a.radius ? -1 : 1));
    }
    a = [[], []];
    for (h = 0; 2 > h; h++) {
      p = [];
      r = e[h];
      q = 0;
      for (y = r.length; q < y; q++)
        (m = (q + 1) % y),
          1e-6 < r[q].p2.abs(r[m].p1) &&
            p.push([m, A.rankKey(r[m].p1), r[m].p1]);
      p.sort(function (z, O) {
        return z[1] - O[1];
      });
      H = 0;
      for (var w = []; H < r.length; ) {
        var v = [];
        for (q = 0; w[q]; ) q++;
        for (;;) {
          m = r[q];
          v.push(m);
          w[q] = 1;
          H++;
          if (1e-6 > m.p2.abs(v[0].p1)) break;
          q = (q + 1) % y;
          if (!(1e-6 > m.p2.abs(r[q].p1))) {
            var u = A.rankKey(m.p2),
              I = 0;
            for (q = 0; q < p.length; q++)
              if (p[q][1] > u) {
                I = q;
                break;
              }
            q = p[I][0];
            p.splice(I, 1);
            v.push(A.slice(m.p2, r[q].p1));
            if (1e-6 > r[q].p1.abs(v[0].p1)) break;
          }
        }
        q = new c(v);
        1e-6 < q.area ? a[h].push(q) : console.log("invalid path length", v, q);
      }
      A = A.revert();
    }
    return a;
  };
  f.trim = function (a) {
    this.paths.at(-1);
    for (var e = this, h = 0; h < this.paths.length; h++) {
      var p = this.paths[h];
      if (p instanceof C) {
        var q = (0 < this.norm.inprod(p.norm) ? 1 : -1) * p._radius;
        e = e.split(new E(p.ct, q - a / 2))[1][0];
      } else
        (q = p.p2.add(p.p1, -1).outprod(this.norm).normalized()),
          (p = q.inprod(p.p2)),
          (e = e.split(new t(q, p - a / 2))[1][0]);
      if (!e) return null;
    }
    return e;
  };
  f = k.prototype;
  f.setTwisty = function (a, e) {
    this.twistyPlanes = a.slice();
    this.twistyDetails = e.slice();
    this._twistyCache = {};
    for (a = 0; a < e.length; a++)
      2 == this.twistyDetails[a].length && this.twistyDetails[a].push(a);
    this.cutFacePolygons();
    this.makeMoveTable();
  };
  f.getTwistyIdx = function (a) {
    if (a in this._twistyCache) return this._twistyCache[a];
    var e = /^(\d*)([A-Z][A-Za-z]*)$/.exec(a);
    if (!e) return -1;
    for (
      var h = new RegExp(e[1] + "(?=[A-Z])"),
        p = e[2].split(/(?=[A-Z])/g),
        q = {},
        m = 0,
        r = 0;
      r < p.length;
      r++
    )
      void 0 == q[p[r]] && ((q[p[r]] = new RegExp(p[r] + "(?=[A-Z]|$)")), m++);
    p = [99, -1];
    for (r = 0; r < this.twistyDetails.length; r++) {
      var H = this.twistyDetails[r][0];
      if (h.exec(H)) {
        var y = H.length - e[1].length,
          A;
        for (A in q)
          if (q[A].exec(H)) y -= A.length;
          else {
            y = 99;
            break;
          }
        y < p[0] && (p = [y, r]);
      }
    }
    this._twistyCache[a] = 1 == m && 0 != p[0] ? -1 : p[1];
    return this._twistyCache[a];
  };
  f.makeFacePolygons = function () {
    this.facesPolys = [];
    for (var a = 0; a < this.facePlanes.length; a++) {
      var e = this.facePlanes[a].norm.scalar(this.facePlanes[a].dis),
        h = this.faceUVs[a];
      e = c.fromVertices([
        e.add(h[0], 100),
        e.add(h[1], 100),
        e.add(h[0], -100),
        e.add(h[1], -100),
      ]);
      for (h = 0; h < this.facePlanes.length; h++)
        if (h != a && ((e = e.split(this.facePlanes[h])[1][0]), !e)) {
          debugger;
          break;
        }
      this.facesPolys[a] = [e];
    }
  };
  f.cutFacePolygons = function () {
    var a = this,
      e = this.twistyPlanes.slice();
    e.sort(function (q, m) {
      return (q.ct ? 1 : 0) - (m.ct ? 1 : 0);
    });
    for (var h = 0; h < e.length; h++) {
      var p = e[h];
      this.enumFacesPolys(function (q, m, r) {
        r = r.split(p);
        r = Array.prototype.concat.apply([], r);
        a.facesPolys[q][m] = r[0];
        for (m = 1; m < r.length; m++) a.facesPolys[q].push(r[m]);
      });
    }
  };
  f.enumFacesPolys = function (a) {
    for (var e = 0, h = 0; h < this.facesPolys.length; h++)
      for (var p = this.facesPolys[h], q = p.length, m = 0; m < q; m++) {
        if (a(h, m, p[m], e)) return;
        e++;
      }
  };
  f.makeMoveTable = function () {
    this.moveTable = [];
    var a = [],
      e = new b(1, 2, 3).normalized();
    this.enumFacesPolys(function (H, y, A, w) {
      a[w] = [w, e.inprod(A.center), A.center];
    });
    a.sort(function (H, y) {
      return H[1] - y[1];
    });
    for (var h = 0; h < this.twistyDetails.length; h++) {
      for (var p = [], q = [], m = 2; m < this.twistyDetails[h].length; m++)
        q.push(this.twistyPlanes[this.twistyDetails[h][m]]);
      var r = new N(q[0].norm, (2 * Math.PI) / this.twistyDetails[h][1]);
      this.enumFacesPolys(function (H, y, A, w) {
        for (y = 0; y < q.length; y++)
          if (0 > q[y].side(A.center)) {
            p[w] = -1;
            return;
          }
        A = r.perform(A.center);
        H = e.inprod(A);
        y = 0;
        for (var v = a.length - 1; v > y; ) {
          var u = (v + y) >> 1;
          a[u][1] < H - 1e-6 ? (y = u + 1) : (v = u);
        }
        for (; y < a.length; y++) {
          if (a[y][1] > H + 1e-6) debugger;
          if (1e-6 > A.abs(a[y][2])) {
            p[w] = a[y][0];
            break;
          }
        }
      });
      this.moveTable.push(p);
    }
  };
  return {
    Point: b,
    RotTrans: N,
    Plane: t,
    Sphere: E,
    Segment: n,
    Arc: C,
    Polygon: c,
    makePuzzle: function (a, e, h, p, q, m, r) {
      function H(Q, d, l, D, x) {
        if (D && 0 != D.length) {
          if (!x) {
            x = [];
            for (var R = 0; R < D.length; R++) x[R] = R;
          }
          for (R = 0; R < Q.length; R++) {
            for (var G = O.length, L = 0; L < D.length; L++)
              "number" == typeof D[L]
                ? O.push(new t(Q[R], D[L]))
                : O.push(new E(Q[R].scalar(D[L][0]), D[L][1], Q[R]));
            for (L = 0; L < x.length; L++) {
              for (
                var F = [L + "" + d[R], l],
                  K = "number" == typeof x[L] ? [x[L]] : x[L],
                  M = 0;
                M < K.length;
                M++
              )
                F.push(K[M] + G);
              J.push(F);
            }
          }
        }
      }
      var y = [],
        A = [],
        w = [],
        v = 3,
        u = 3;
      if (4 == a)
        (y = [
          new b(0, -1, 0),
          new b(-Math.sqrt(6) / 3, 1 / 3, -Math.sqrt(2) / 3),
          new b(Math.sqrt(6) / 3, 1 / 3, -Math.sqrt(2) / 3),
          new b(0, 1 / 3, Math.sqrt(8) / 3),
        ]),
          (A = [3, 2, 1, new b(0, 1, 0)]),
          (w = ["D", "L", "R", "F"]);
      else if (6 == a)
        (y = [new b(0, 1, 0), new b(1, 0, 0), new b(0, 0, 1)]),
          (A = [5, 0, 0, 2, 0, 0]),
          (w = "URFDLB".split("")),
          (v = 4);
      else if (8 == a)
        (y = [
          new b(0, 1, 0),
          new b(Math.sqrt(6) / 3, 1 / 3, Math.sqrt(2) / 3),
          new b(-Math.sqrt(6) / 3, 1 / 3, Math.sqrt(2) / 3),
          new b(0, -1 / 3, Math.sqrt(8) / 3),
        ]),
          (A = y[0].add(y[3], -1)),
          (A = [7, A, A, 0, 7, A, A, 0]),
          (w = "U R L F D Bl Br B".split(" ")),
          (u = 4);
      else if (12 == a) {
        y = [new b(0, Math.sqrt(5), 0)];
        for (var I = 0; 5 > I; I++)
          y.push(
            new b(
              2 * Math.sin(0.4 * I * Math.PI),
              1,
              2 * Math.cos(0.4 * I * Math.PI)
            )
          );
        A = [7, 0, 3, 7, 7, 4, 7, 0, 3, 7, 7, 4];
        w = "U F R Br Bl L D B Dbl Dl Dr Dbr".split(" ");
        v = 5;
      } else if (20 == a) {
        for (I = 0; 5 > I; I++) {
          u = Math.sqrt(5) + 1;
          var z = Math.sqrt(5) + 3;
          y.push(
            new b(
              u * Math.sin(0.4 * I * Math.PI),
              Math.sqrt(5) + 2,
              u * Math.cos(0.4 * I * Math.PI)
            )
          );
          y.push(
            new b(
              z * Math.sin(0.4 * I * Math.PI),
              1,
              z * Math.cos(0.4 * I * Math.PI)
            )
          );
          A[2 * I] = 2 * I + 11;
          A[2 * I + 1] = 2 * I;
          A[2 * I + 10] = 2 * I + 11;
          A[2 * I + 11] = 2 * I;
        }
        w = "U F Ur R Ubr Br Ubl Bl Ul L D B Dl Lb Dfl Fl Dfr Fr Dr Rb".split(
          " "
        );
        u = 5;
      } else debugger;
      if (4 != a)
        for (I = 0, a = y.length; I < a; I++)
          (y[I] = y[I].normalized()), y.push(y[I].scalar(-1));
      a = [];
      for (I = 0; I < y.length; I++)
        a.push(new t(y[I])), "number" == typeof A[I] && (A[I] = y[A[I]]);
      A = new k(a, A, w);
      var O = [],
        J = [];
      H(y, w, v, e, q);
      if (h && 0 < h.length) {
        var P = [],
          W = [];
        A.enumFacesPolys(function (Q, d, l) {
          var D = l.paths.at(-1).p1;
          for (d = 0; d < l.paths.length; d++) {
            var x = l.paths[d].p1;
            D = x.add(D).normalized();
            for (var R = 0; R < P.length; R++)
              if (1e-6 > D.abs(P[R])) {
                W[R] += w[Q];
                D = null;
                break;
              }
            D && (P.push(D), W.push(w[Q]));
            D = x;
          }
        });
        H(P, W, 2, h, m);
      }
      if (p && 0 < p.length) {
        var X = [],
          V = [];
        A.enumFacesPolys(function (Q, d, l) {
          for (d = 0; d < l.paths.length; d++) {
            for (var D = l.paths[d].p1.normalized(), x = 0; x < X.length; x++)
              if (1e-6 > D.abs(X[x])) {
                V[x] += w[Q];
                D = null;
                break;
              }
            D && (X.push(D), V.push(w[Q]));
          }
        });
        H(X, V, u, p, r);
      }
      A.setTwisty(O, J);
      DEBUG && console.log("[poly3dlib] create puzzle: ", A);
      return A;
    },
    renderNet: function (a, e, h) {
      var p = [],
        q = a.facePlanes.length;
      e = e || 0;
      var m = [0, 0];
      if (4 == q)
        (e = Math.sqrt(6) * (1 + e)),
          (q = e / Math.sqrt(3)),
          (p = [
            [2 * e, 4 * q],
            [1 * e, 1 * q],
            [3 * e, 1 * q],
            [2 * e, 2 * q],
          ]),
          (m = [4 * e, 6 * q]);
      else if (6 == q)
        (e = 1 + e),
          (p = [
            [3 * e, e],
            [5 * e, 3 * e],
            [3 * e, 3 * e],
            [3 * e, 5 * e],
            [e, 3 * e],
            [7 * e, 3 * e],
          ]),
          (m = [8 * e, 6 * e]);
      else if (8 == q)
        (q = (Math.sqrt(6) * (1 + e)) / 2 / Math.sqrt(3)),
          (e = Math.sqrt(3)),
          (p = [
            [3 * q, 1 * q, e, 1],
            [5 * q, 3 * q, 1, e],
            [1 * q, 3 * q, 1, e],
            [3 * q, 5 * q, e, 1],
            [9 * q, 5 * q, e, 1],
            [11 * q, 3 * q, 1, e],
            [7 * q, 3 * q, 1, e],
            [9 * q, 1 * q, e, 1],
          ]),
          (m = [12 * q, 6 * q]);
      else if (12 == q) {
        var r = (Math.sqrt(5) + 1) / 2;
        e = (Math.sqrt(3 - r) / Math.pow(r, 2)) * (1 + e);
        q = e * Math.tan(0.3 * Math.PI) * 2;
        m = e * (1 + 2 * r);
        var H = e * (1 / Math.sin(0.2 * Math.PI) + 2 * Math.cos(0.1 * Math.PI));
        r = e * (4 + 5 * r);
        e = q + e / Math.cos(0.3 * Math.PI);
        p[0] = [m, H];
        p[6] = [r, e];
        for (var y = 0; 5 > y; y++)
          (p[1 + y] = [
            m + Math.cos(Math.PI * (0.5 - 0.4 * y)) * q,
            H + Math.sin(Math.PI * (0.5 - 0.4 * y)) * q,
          ]),
            (p[7 + y] = [
              r + Math.cos(Math.PI * (1.5 + 0.4 * y)) * q,
              e + Math.sin(Math.PI * (1.5 + 0.4 * y)) * q,
            ]);
        m = [m + r, H + e];
      } else if (20 == q) {
        r = (Math.sqrt(5) + 1) / 2;
        e = (Math.sqrt(3) / Math.pow(r, 2)) * (1 + e);
        for (y = 0; 5 > y; y++)
          (p[2 * y] = [(((5 + 2 * y) % 10) + 1) * e, (2 * e) / Math.sqrt(3)]),
            (p[2 * y + 1] = [
              (((5 + 2 * y) % 10) + 1) * e,
              (4 * e) / Math.sqrt(3),
            ]),
            (p[2 * y + 10] = [((1 + 2 * y) % 10) * e, (7 * e) / Math.sqrt(3)]),
            (p[2 * y + 11] = [((1 + 2 * y) % 10) * e, (5 * e) / Math.sqrt(3)]);
        m = [11 * e, (9 * e) / Math.sqrt(3)];
      } else debugger;
      var A = [],
        w = [];
      a.enumFacesPolys(function (v, u, I, z) {
        if (!(I.area < h)) {
          u = I.projection(a.faceUVs[v]);
          I = p[v];
          for (var O = [[], []], J = 0; J < u.length; J++)
            (O[0][J] = I[0] + u[J][0] * (I[2] || 1)),
              (O[1][J] = I[1] - u[J][1] * (I[3] || 1));
          O[2] = v;
          A[z] = O;
          w[v] = w[v] || [I[0], I[1], a.faceNames[v]];
        }
      });
      return [m, A, w];
    },
    makeParser: g,
    makePuzzleParser: function (a) {
      return g(
        /(?:^|\s*)(?:\[([a-zA-Z]+)(\d*)(')?\]|(\d*)([A-Z][a-zA-Z]*)(\d*)(')?)(?:$|\s*)/g,
        function (e, h, p, q, m, r, H, y, A) {
          h = p ? "0" : "" == r ? "1" : r;
          H = p || H;
          p = (p ? ("" == q ? 1 : ~~q) : "" == y ? 1 : ~~y) * (m || A ? -1 : 1);
          H.match(/[A-Z][a-z]*/g);
          if (-1 != e.getTwistyIdx(h + H)) return [h, H, p];
        }.bind(null, a),
        function (e, h, p) {
          h = h + (1 == Math.abs(p) ? "" : Math.abs(p)) + (0 > p ? "'" : "");
          return 0 == e ? "[" + h + "]" : h;
        }
      );
    },
    getFamousPuzzle: function (a, e) {
      var h = 1,
        p = 0.075,
        q = [];
      if (/^(\d)\1\1$/.exec(a)) {
        var m = /^(\d)\1\1$/.exec(a);
        m = ~~m[1];
        a = [6, [-5]];
        for (var r = 0; r < m >> 1; r++) a[1].push(1 - (2 * (r + 1)) / m);
      } else if ("pyr" == a || "mpyr" == a) {
        a = [4, [], [], { pyr: [-5, 5 / 3, 1 / 3], mpyr: [-5, 2, 1, 0] }[a]];
        h = 0.51;
        p = 0.14;
        var H = g(
          /(?:^|\s*)(?:([URLBurlb])(w?)(')?|\[([urlb])(')?\])(?:$|\s*)/g,
          function (w, v, u, I, z, O) {
            w = ["LRF", "DRF", "DLF", "DLR"][
              "URLB".indexOf((v || z).toUpperCase())
            ];
            return [
              z ? 0 : u ? 3 : v == v.toUpperCase() ? 2 : 1,
              w,
              I || O ? -1 : 1,
            ];
          },
          function (w, v, u) {
            v = "urlb".charAt(["LRF", "DRF", "DLF", "DLR"].indexOf(v));
            u = 0 > u ? "'" : "";
            return [
              "[" + v + u + "]",
              v + u,
              v.toUpperCase() + u,
              v.toUpperCase() + "w" + u,
            ][w];
          }
        );
      } else if ("fto" == a)
        (a = [8, [-5, 1 / 3, -1 / 3], [], [-5]]),
          (H = g(
            /(?:^|\s*)\[?([URFDLT]|(?:B[RL]?))(w)?(')?(\])?(?:$|\s*)/g,
            function (w, v, u, I, z) {
              return [
                z || "T" == v ? 0 : u ? 2 : 1,
                "T" == v ? "URLF" : v[0] + v.slice(1).toLowerCase(),
                I ? -1 : 1,
              ];
            },
            function (w, v, u) {
              v =
                (3 < v.length ? "T" : v.toUpperCase()) +
                (2 == w ? "w" : "") +
                (0 < u ? "" : "'");
              return 0 == w ? "[" + v + "]" : v;
            }
          ));
      else if ("klm" == a || "mgm" == a || "prc" == a || "giga" == a)
        (a = [
          12,
          {
            klm: [-5, 0.57, -0.57],
            mgm: [-5, 0.72, -0.72],
            giga: [-5, 0.83, -0.83, 0.66, -0.66],
            prc: [-5, 0.4472136, -0.4472136],
          }[a],
        ]),
          (h = 1.18),
          (p = 0.05),
          (H = g(
            /(?:^|\s*)(?:([DLRdlr])(\+\+?|--?)|([UuFfy]|D?B?[RL]|d?b?[rl]|[DdBb])(\d?)('?)|\[([ufrl])(\d?)('?)\])(?:$|\s*)/g,
            function (w, v, u, I, z, O, J, P, W) {
              return v
                ? ((I = "DLRdlr".indexOf(v)),
                  [
                    2 < I ? 4 : 2,
                    ["D", "Dbl", "Dbr"][I % 3],
                    ("-" == u[0] ? -1 : 1) * u.length,
                  ])
                : I
                ? ((u = (O ? -1 : 1) * (~~z || 1)),
                  "y" == I[0]
                    ? [0, "U", u]
                    : [
                        "a" <= I[0] ? 3 : 1,
                        I[0].toUpperCase() + I.slice(1).toLowerCase(),
                        u,
                      ])
                : [0, J.toUpperCase(), (W ? -1 : 1) * (~~P || 1)];
            },
            function (w, v, u) {
              u = ((u + 7) % 5) - 2;
              var I =
                (1 == Math.abs(u) ? "" : Math.abs(u)) + (0 <= u ? "" : "'");
              if (0 == w) return "[" + v.toLowerCase() + I + "]";
              if (2 == w || 4 == w)
                return (
                  (I = 0 < u ? "+" : "-"),
                  (v = "DLR".charAt(["D", "Dbl", "Dbr"].indexOf(v))),
                  (4 == w ? v.toLowerCase() : v) +
                    I +
                    (2 == Math.abs(u) ? I : "")
                );
              if (1 == w) return v.toUpperCase() + I;
              if (3 == w) return v.toLowerCase() + I;
            },
            function (w) {
              /^(\s*([+-]{2}\s*)+U'?\s*\n?)*$/.exec(w) &&
                (w = tools.carrot2poch(w));
              return w;
            }
          ));
      else if ("heli" == a || "helicv" == a || "heli2x2" == a)
        (a = {
          heli: [6, [-5], [-5, Math.sqrt(0.5)], [-5]],
          helicv: [6, [-5], [-5, [2 * Math.sqrt(2), -Math.sqrt(5)]], [-5]],
          heli2x2: [
            6,
            [-5, 0],
            [-5, [Math.sqrt(2), -0.6]],
            [-5, [Math.sqrt(3), -0.7]],
          ],
        }[a]),
          (p = 0.05);
      else if (/^crz3a$/.exec(a))
        (a = [6, [-5, 0.3333, [1, 0.75]], [], [], [0, [1, 2]]]),
          (H = g(
            /(?:^|\s*)([URFDLBxyz])(\d*)(')?(?:$|\s*)/g,
            function (w, v, u, I) {
              w = ("" == u ? 1 : ~~u) * (I ? -1 : 1);
              return -1 != "xyz".indexOf(v)
                ? [0, "RUF".charAt("xyz".indexOf(v)), w]
                : [1, v, w];
            },
            function (w, v, u) {
              u = (1 == Math.abs(u) ? "" : Math.abs(u)) + (0 <= u ? "" : "'");
              return (0 == w ? "xyz".charAt("RUF".indexOf(v)) : v) + u;
            }
          ));
      else if (/^redi$/.exec(a)) {
        a = [6, [-5], [], [-5, 0.85]];
        var y = "URF UFL ULB URB RFD FDL DLB RDB R U F".split(" ");
        H = g(
          /(?:^|\s*)([FLBRflbrxyz])(')?(?:$|\s*)/g,
          function (w, v, u, I) {
            w = "FLBRflbrxyz".indexOf(v);
            return [8 <= w ? 0 : 1, y[w], u ? -1 : 1];
          },
          function (w, v, u) {
            return "FLBRflbrxyz".charAt(y.indexOf(v)) + (0 <= u ? "" : "'");
          },
          function (w) {
            return /^(([LR]'? ){3,}x ){3,}/.exec(w) ? w.replace(/L/g, "B") : w;
          }
        );
      } else if (/^skb$/.exec(a)) {
        a = [6, [-5], [], [-5, 0]];
        var A = "URF UFL ULB URB RFD FDL DLB RDB R U F".split(" ");
        H = g(
          /(?:^|\s*)([FlUrDLBRxyz])(')?(?:$|\s*)/g,
          function (w, v, u, I) {
            w = "FlUrDLBRxyz".indexOf(v);
            return [8 <= w ? 0 : 1, A[w], u ? -1 : 1];
          },
          function (w, v, u) {
            return "FlUrDLBRxyz".charAt(A.indexOf(v)) + (0 <= u ? "" : "'");
          }
        );
      } else if ("ctico" == a) a = [20, [], [], [-5, 0]];
      else return null;
      m = a[0];
      4 == m
        ? (q = $.col2std(kernel.getProp("colpyr"), [3, 1, 2, 0]))
        : 6 == m
        ? (q = $.col2std(kernel.getProp("colcube"), [3, 4, 5, 0, 1, 2]))
        : 8 == m
        ? (q = $.col2std(kernel.getProp("colfto"), [0, 3, 1, 2, 6, 7, 5, 4]))
        : 12 == m
        ? (q = $.col2std(
            kernel.getProp("colmgm"),
            [0, 2, 1, 5, 4, 3, 11, 9, 8, 7, 6, 10]
          ))
        : 20 == m &&
          (q = $.col2std(
            kernel.getProp("colico"),
            [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19,
            ]
          ));
      e = e || {};
      e.parser = H;
      e.polyParam = a;
      e.scale = (e.scale || 1) * h;
      e.pieceGap = p;
      e.colors = q;
      return e;
    },
    udpolyre: new RegExp("^(" + $.UDPOLY_RE + ")$"),
    parsePolyParam: function (a) {
      a = a.split(/\s+/g);
      for (
        var e = [[4, 6, 8, 12, 20]["tcodi".indexOf(a[0])], [-5], [-5], [-5]],
          h = 1,
          p = 1;
        p < a.length;
        p++
      )
        if (/^[fev]$/.exec(a[p])) h = " fev".indexOf(a[p]);
        else if (/^[+-]?\d+(?:\.\d+)?$/.exec(a[p])) e[h].push(parseFloat(a[p]));
        else if (/^\d+(?:\.\d+)?r[+-]?\d+(?:\.\d+)?$/.exec(a[p])) {
          var q = a[p].split("r");
          e[h].push([parseFloat(q[0]), -parseFloat(q[1])]);
        }
      return e;
    },
  };
})();
var pat3x3 = (function () {
  function b(n, C, c, k, g, f, a, e) {
    var h = 2 * (C * a + c) + k;
    if (!e && h in g) return g[h];
    if (n == f.length) return (g[h] = 0 == c && 0 == k ? 1 : 0), g[h];
    for (var p = 0, q = [], m = 0; m < f[n].length; m++) {
      q[m] = 0;
      var r = f[n][m][0];
      (C >> r) & 1 ||
        ((q[m] = b(
          n + 1,
          C | (1 << r),
          (c + f[n][m][1]) % a,
          k ^ (E(C >> r) & 1),
          g,
          f,
          a
        )),
        (p += q[m]));
    }
    if (e)
      return (
        (h = f[n][mathlib.rndProb(q)]),
        (e[n] = h),
        b(
          n + 1,
          C | (1 << h[0]),
          (c + h[1]) % a,
          k ^ (E(C >> h[0]) & 1),
          g,
          f,
          a,
          e
        )
      );
    g[h] = p;
    return g[h];
  }
  function N(n, C, c) {
    for (var k = c.length, g = c[0].length, f = [], a = 0; a < k; a++) {
      f[a] = [];
      for (var e = 0; e < k; e++)
        for (var h = 0; h < g; h++) {
          for (var p = !0, q = 0; q < g; q++) {
            var m = n[c[a][q]];
            if (-1 != m && m != C[c[e][(g - h + q) % g]]) {
              p = !1;
              break;
            }
          }
          p && f[a].push([e, h]);
        }
    }
    return f;
  }
  function t(n, C) {
    n = n.split("");
    C = (C || mathlib.SOLVED_FACELET).split("");
    for (var c = 0; c < n.length; c++)
      (n[c] = "URFDLB-XYZ".indexOf(n[c])), (C[c] = "URFDLB-XYZ".indexOf(C[c]));
    c = N(n, C, mathlib.CubieCube.cFacelet);
    n = N(n, C, mathlib.CubieCube.eFacelet);
    C = [];
    for (var k = [], g = {}, f = {}, a = 0; 2 > a; a++)
      (C[a] = b(0, 0, 0, a, g, c, 3)), (k[a] = b(0, 0, 0, a, f, n, 2));
    return [C, k, g, f, c, n];
  }
  var E = mathlib.bitCount;
  return {
    calcPattern: t,
    genPattern: function (n, C, c, k, g, f) {
      var a = ~~mathlib.rndHit((n[1] * C[1]) / (n[0] * C[0] + n[1] * C[1]));
      n = [];
      C = [];
      b(0, 0, 0, a, c, g, 3, n);
      b(0, 0, 0, a, k, f, 2, C);
      c = new mathlib.CubieCube();
      for (k = 0; 8 > k; k++) c.ca[k] = 8 * n[k][1] + n[k][0];
      for (k = 0; 12 > k; k++) c.ea[k] = 2 * C[k][0] + C[k][1];
      return c.toFaceCube();
    },
    genPatternGroup: function (n) {
      var C = t(n, n);
      n = C[0];
      var c = C[1],
        k = C[2],
        g = C[3],
        f = C[4];
      C = C[5];
      var a = n[0] * c[0] + n[1] * c[1],
        e = null;
      do {
        var h =
            Math.random() < (n[1] * c[1]) / (n[0] * c[0] + n[1] * c[1]) ? 1 : 0,
          p = [],
          q = [];
        b(0, 0, 0, h, k, f, 3, p);
        b(0, 0, 0, h, g, C, 2, q);
        h = new mathlib.CubieCube();
        for (var m = 0; 8 > m; m++) h.ca[m] = 8 * p[m][1] + p[m][0];
        for (m = 0; 12 > m; m++) h.ea[m] = 2 * q[m][0] + q[m][1];
        p = h.toPerm();
        e ? e.extend([p]) : (e = new grouplib.SchreierSims([p]));
        DEBUG && console.log("[pat3x3] gen group ", e.size(), a);
      } while (e.size() < a);
      return e;
    },
  };
})();
var sbtree = (function () {
  function b(C, c, k, g) {
    this.k = C;
    this.v = c;
    this.left = k || n;
    this.right = g || n;
    this.size = 1;
    this.sum = C;
    this.sk2 = Math.pow(C, 2);
  }
  function N(C) {
    this.root = n;
    this.cmp = C;
  }
  function t(C, c, k) {
    return C == n || (t(C.get(k), c, k) && c(C) && t(C.get(!k), c, k));
  }
  function E(C, c) {
    var k = C.get(!c);
    C.set(!c, k.get(c));
    k.set(c, C);
    k.size = C.size;
    C.size = C.left.size + C.right.size + 1;
    k.sum = C.sum;
    C.sum = C.left.sum + C.right.sum + C.k;
    k.sk2 = C.sk2;
    C.sk2 = C.left.sk2 + C.right.sk2 + Math.pow(C.k, 2);
    return k;
  }
  var n = null;
  n = new b(0, 0);
  n.left = n;
  n.right = n;
  n.size = 0;
  b.prototype.get = function (C) {
    return C ? this.right : this.left;
  };
  b.prototype.set = function (C, c) {
    C ? (this.right = c) : (this.left = c);
  };
  N.prototype.find = function (C) {
    for (var c = this.root; c != n; ) {
      if (C == c.k) return c.v;
      c = c.get(0 > this.cmp(c.k, C));
    }
  };
  N.prototype._cumPow = function (C, c) {
    if (c >= this.root.size || 0 == this.root.size)
      return 2 == C ? this.root.sk2 : this.root.sum;
    for (var k = this.root, g = 0; 0 < c; ) {
      var f = k.left.size;
      if (c < f) k = k.left;
      else {
        g += 2 == C ? k.left.sk2 : k.left.sum;
        if (c == f) break;
        g += Math.pow(k.k, C);
        c -= f + 1;
        k = k.right;
      }
    }
    return g;
  };
  N.prototype.sum = function (C, c) {
    return this._cumPow(1, c) - this._cumPow(1, C);
  };
  N.prototype.avgstd = function (C, c) {
    var k = c - C,
      g = this._cumPow(1, c) - this._cumPow(1, C);
    C = this._cumPow(2, c) - this._cumPow(2, C);
    return [g / k, Math.sqrt((C - Math.pow(g, 2) / k) / (k - 1))];
  };
  N.prototype.rank = function (C) {
    for (var c = this.root; c != n; ) {
      var k = c.left.size;
      if (C < k) c = c.left;
      else {
        if (C == k) return c.k;
        C -= k + 1;
        c = c.right;
      }
    }
    return 0 > C ? -1e300 : 1e300;
  };
  N.prototype.rankOf = function (C) {
    for (var c = this.root, k = 0; c != n; )
      0 > this.cmp(c.k, C)
        ? ((k += c.left.size + 1), (c = c.right))
        : (c = c.left);
    return k;
  };
  N.prototype.traverse = function (C, c) {
    return t(this.root, C, c);
  };
  N.prototype.insertR = function (C, c, k) {
    if (C == n) return new b(c, k);
    C.size += 1;
    C.sum += c;
    C.sk2 += Math.pow(c, 2);
    var g = 0 > this.cmp(C.k, c);
    C.set(g, this.insertR(C.get(g), c, k));
    C.get(g).get(g).size > C.get(!g).size
      ? (C = E(C, !g))
      : C.get(g).get(!g).size > C.get(!g).size &&
        ((g = !g), C.set(!g, E(C.get(!g), !g)), (C = E(C, g)));
    return C;
  };
  N.prototype.insert = function (C, c) {
    this.root = this.insertR(this.root, C, c);
    return this;
  };
  N.prototype.remove = function (C) {
    this.root = this.removeR(this.root, C);
    return this;
  };
  N.prototype.removeR = function (C, c) {
    if (C == n) return n;
    --C.size;
    C.sum -= c;
    C.sk2 -= Math.pow(c, 2);
    if (C.k == c) {
      if (C.left == n || C.right == n) return C.get(C.left == n);
      for (c = C.left; c.right != n; ) c = c.right;
      C.k = c.k;
      C.v = c.v;
      c = c.k;
    }
    var k = 0 > this.cmp(C.k, c);
    C.set(k, this.removeR(C.get(k), c));
    return C;
  };
  return {
    tree: function (C) {
      return new N(C);
    },
  };
})();
var SQLFile = execMain(function () {
  function b(t, E, n) {
    var C = 0;
    if (n) for (var c = 0; c < n; c++) C = (C << 8) | t[E[0]++];
    else {
      do C = (C << 7) | (t[E[0]] & 127);
      while (128 <= t[E[0]++]);
    }
    return C;
  }
  function N(t, E, n) {
    E = 1 == E ? 100 : (E - 1) * b(t, [16], 2);
    var C = t[E],
      c = (t[E + 3] << 8) | t[E + 4],
      k = [E + 8],
      g = -1;
    C & 8 || (g = b(t, k, 4));
    for (var f = 0; f < c; f++) {
      var a = [(100 == E ? 0 : E) + b(t, [k[0] + 2 * f], 2)];
      if (2 != C && 10 != C)
        if (5 == C) (a = b(t, a, 4)), N(t, a, n);
        else if (13 == C) {
          var e = b(t, a),
            h = t,
            p = a[0],
            q = n,
            m = [p],
            r = b(h, m),
            H = p + r;
          p = m;
          m = [];
          for (r = []; p[0] < H; ) m.push(b(h, p));
          for (H = 0; H < m.length; H++) {
            var y = m[H];
            0 == y
              ? (r[H] = null)
              : 1 <= y && 4 >= y
              ? (r[H] = b(h, p, y))
              : 5 == y
              ? ((r[H] = void 0), b(h, p, 6))
              : 6 == y
              ? ((r[H] = void 0), b(h, p, 8))
              : 7 == y
              ? ((r[H] = void 0), b(h, p, 8))
              : 8 == y
              ? (r[H] = 0)
              : 9 == y
              ? (r[H] = 1)
              : 10 != y &&
                11 != y &&
                (0 == m[H] % 2
                  ? ((r[H] = h.slice(p[0], p[0] + (y - 12) / 2)),
                    (p[0] += (y - 12) / 2))
                  : ((r[H] = String.fromCharCode.apply(
                      null,
                      h.slice(p[0], p[0] + (y - 13) / 2)
                    )),
                    (p[0] += (y - 13) / 2)));
          }
          q(r);
          a[0] += e;
        }
    }
    -1 != g && N(t, g, n);
  }
  return {
    loadTableList: function (t) {
      var E = {};
      N(t, 1, function (n) {
        E[n[2]] = [n[3], n[4]];
      });
      return E;
    },
    loadPage: N,
  };
});
var TimerDataConverter = execMain(function () {
  function b(n) {
    try {
      return decodeURIComponent(escape(n));
    } catch (C) {}
    return n;
  }
  function N(n, C) {
    n = b(n).split(/\r?\n/g);
    for (var c = [], k = [], g = [], f = 0, a = 0; a < n.length; a++) {
      for (var e = n[a].split(C), h = 0; h < e.length; h++)
        g.push(e[h]),
          (f += (e[h].match(/"/g) || []).length),
          0 == f % 2 &&
            ((g = g.join(",")),
            '"' == g[0] && (g = g.replace(/""/g, '"').slice(1, -1)),
            k.push(g),
            (g = []));
      0 == f % 2 && (c.push(k), (k = []), (g = []), (f = 0));
    }
    return c;
  }
  var t = /^(DNF)?\(?(\d*?):?(\d*?):?(\d*\.?\d*?)(\+)?\)?$/,
    E = {
      csTimer: [
        /^{"session1"/i,
        function (n) {
          n = JSON.parse(b(n));
          var C = {};
          try {
            C = mathlib.str2obj(mathlib.str2obj(n.properties).sessionData);
          } catch (q) {}
          var c = [],
            k;
          for (k in n) {
            var g = /^session(\d+)$/.exec(k);
            if (g) {
              var f = {},
                a = [];
              try {
                a = mathlib.str2obj(n[k]);
              } catch (q) {}
              if ($.isArray(a) && 0 != a.length) {
                for (var e = [], h = 0; h < a.length; h++) {
                  var p = a[h];
                  $.isArray(p) &&
                    $.isArray(p[0]) &&
                    ((p[0] = $.map(p[0], Number)), e.push(p));
                }
                f.times = e;
                ~~g[1] in C
                  ? ((a = C[~~g[1]]),
                    (f.name = a.name || g[1]),
                    (f.opt = a.opt || {
                      scrType: a.scr || "333",
                      phases: a.phases || 1,
                    }),
                    (f.rank = a.rank))
                  : ((f.name = g[1]), (f.opt = {}), (f.rank = c.length + 1));
                c.push(f);
              }
            }
          }
          c.sort(function (q, m) {
            return q.rank - m.rank;
          });
          return c;
        },
      ],
      csTimerCSV: [
        /^No\.;Time;Comment;Scramble;Date;P\.1/i,
        function (n) {
          n = N(n, ";");
          for (var C = [], c = n[0].length - 5, k = 1; k < n.length; k++) {
            var g = n[k],
              f = [],
              a = t.exec(g[1]);
            if (a) {
              for (f[0] = a[1] ? -1 : a[5] ? 2e3 : 0; "" == g.at(-1); ) g.pop();
              for (var e = 5; e < g.length; e++)
                (a = t.exec(g[e])),
                  (a = Math.round(
                    36e5 * ~~a[2] + 6e4 * ~~a[3] + 1e3 * parseFloat(a[4])
                  )),
                  (f[g.length - e] = (f[g.length - e + 1] || 0) + a);
              f = [f, g[3], g[2], mathlib.str2time(g[4])];
              C.push(f);
            } else console.log("Invalid data detected");
          }
          return [{ name: "import", opt: { phases: c }, times: C }];
        },
      ],
      ZYXTimer: [/^Session: /i, function (n) {}],
      TwistyTimer: [
        /^Puzzle,Category,Time\(millis\),Date\(millis\),Scramble,Penalty,Comment/i,
        function (n) {
          n = N(n, ";");
          for (
            var C = {
                333: "333",
                222: "222so",
                444: "444wca",
                555: "555wca",
                pyra: "pyrso",
                skewb: "skbso",
                mega: "mgmp",
                sq1: "sqrs",
                clock: "clkwca",
                666: "666wca",
                777: "777wca",
                "333oh": "333oh",
                "333bld": "333ni",
                "444bld": "444bld",
                "555bld": "555bld",
                "333mbld": "r3ni",
                "333fmc": "333fm",
              },
              c = {},
              k = [],
              g = 1;
            g < n.length;
            g++
          ) {
            var f = n[g];
            if (7 == f.length) {
              var a = f[0] + "-" + f[1],
                e = f[6],
                h = parseInt(f[2]),
                p = { 0: 0, 1: 2e3, 2: -1 }[f[5]] || 0;
              if ("333mbld" == f[0]) {
                h = (Math.trunc(f[2] / 1e3) % 1e6) * 1e3;
                var q = 1e3 - Math.trunc(f[2] / 1e9) + (f[2] % 1e3),
                  m = q + (f[2] % 1e3);
                p = 0;
                e = "[" + q + "/" + m + "]" + (e ? ", " + e : "");
              }
              h = [p, h];
              a in c ||
                ((c[a] = k.length),
                k.push({
                  name: a,
                  opt: { scrType: C[f[0]] || "333" },
                  times: [],
                }));
              k[c[a]].times.push([h, f[4], e, Math.round(f[3] / 1e3)]);
            }
          }
          return k;
        },
      ],
    };
  E.CubicTimer = [
    /^"Puzzle";"Category";"Time\(millis\)";"Date\(millis\)";"Scramble";"Penalty";"Comment"/i,
    E.TwistyTimer[1],
  ];
  E.BlockKeeper = [
    /^{"puzzles":\[{"name":/i,
    function (n) {
      n = JSON.parse(b(n)).puzzles;
      var C = {
          "3x3x3": "333",
          "2x2x2": "222so",
          "4x4x4": "444wca",
          "5x5x5": "555wca",
          Pyraminx: "pyrso",
          Skewb: "skbso",
          Megaminx: "mgmp",
          "Square-1": "sqrs",
          Clock: "clkwca",
          "6x6x6": "666wca",
          "7x7x7": "777wca",
          "3x3x3 BLD": "333ni",
          "4x4x4 BLD": "444bld",
          "5x5x5 BLD": "555bld",
        },
        c = [];
      $.each(n, function (k, g) {
        var f = g.name,
          a = g.scrambler,
          e = g.splits;
        $.each(g.sessions, function (h, p) {
          h = p.name;
          var q = [];
          $.each(p.records, function (m, r) {
            m = [
              { OK: 0, "+2": 2e3, DNF: -1 }[r.result],
              Math.round(1e3 * r.time),
            ];
            Array.prototype.push.apply(
              m,
              $.map(r.split.reverse(), function (H) {
                return Math.round(1e3 * H);
              })
            );
            q.push([m, r.scramble, r.comment || "", Math.round(r.date / 1e3)]);
          });
          0 != q.length &&
            c.push({
              name: f + "-" + h,
              opt: { phases: e, scrType: C[a] || "333" },
              times: q,
            });
        });
      });
      return c;
    },
  ];
  E.PrismaTimer = [/^[^\t\n]*(\t[^\t\n]*){4}\n/i, function (n) {}];
  E["DCTimer.raw"] = [
    /^\d+[\r\n]+[^\t\n]*(\t[^\t\n]*){11}[\r\n]+/i,
    function (n) {
      n = b(n).split(/[\r\n]+/);
      for (var C = {}, c = 0, k = [], g = 0; g < n.length; g++)
        if (/^\d+$/.exec(n[g]))
          (c = ~~n[g]),
            (C[c] = k.length),
            k.push({ name: c, opt: {}, times: [] });
        else {
          var f = n[g].split("\t");
          6 > f.length ||
            k[C[c]].times.push([
              ["1" == f[2] ? ("1" == f[1] ? 2e3 : 0) : -1, ~~f[0]],
              f[3],
              f[5],
              mathlib.str2time(f[4]),
            ]);
        }
      return k;
    },
  ];
  E["DCTimer.sqlite"] = [
    /^SQLite format 3\0/i,
    function (n) {
      for (var C = new Uint8Array(n.length), c = 0; c < n.length; c++)
        C[c] = n.charCodeAt(c);
      n = SQLFile.loadTableList(C);
      var k = {},
        g = [],
        f = function (h, p) {
          h in k ||
            ((k[h] = g.length),
            g.push({ name: p || h + 1, opt: {}, times: [] }));
        };
      SQLFile.loadPage(C, n.sessiontb[0], function (h) {
        f(h[0], b(h[1]));
      });
      for (var a in n)
        if ((c = /^result(\d+|tb)$/.exec(a))) {
          var e = ("tb" == c[1] ? 1 : ~~c[1]) - 1;
          SQLFile.loadPage(C, n[a][0], function (h) {
            f(e);
            g[k[e]].times.push([
              ["1" == h[3] ? ("1" == h[2] ? 2e3 : 0) : -1, ~~h[1]],
              b(h[4] || ""),
              b(h[6] || ""),
              mathlib.str2time(h[5]),
            ]);
          });
        }
      SQLFile.loadPage(C, n.resultstb[0], function (h) {
        var p = h[1];
        f(p);
        g[k[p]].times.push([
          ["1" == h[4] ? ("1" == h[3] ? 2e3 : 0) : -1, ~~h[2]],
          b(h[5] || ""),
          b(h[7] || ""),
          mathlib.str2time(h[6]),
        ]);
      });
      return g;
    },
  ];
  E["mateus.cubetimer"] = [
    /^"Category";"Time \(MM:SS\.SSS\)";"Scrambler";"Date";"Penalty \+2 \(yes or no\)";"DNF \(yes or no\)";"Section"\n/i,
    function (n) {
      n = N(n, ";");
      for (
        var C = {
            "3x3x3": "333",
            "2x2x2": "222so",
            "4x4x4": "444wca",
            "5x5x5": "555wca",
            Pyraminx: "pyrso",
            Skewb: "skbso",
            Megaminx: "mgmp",
            "Square-1": "sqrs",
            "Rubik's Clock": "clkwca",
            "6x6x6": "666wca",
            "7x7x7": "777wca",
            "3x3x3 Blindfolded": "333ni",
            "4x4x4 Blindfolded": "444bld",
            "5x5x5 Blindfolded": "555bld",
            "3x3x3 One-Handed": "333oh",
            "3x3x3 Multi-Blindfolded": "r3ni",
            "3x3x3 With Feet": "333ft",
            "3x3x3 Fewest Moves": "333fm",
          },
          c = {},
          k = [],
          g = 1;
        g < n.length;
        g++
      ) {
        var f = n[g];
        if (!(7 > f.length)) {
          var a = f[0] + "-" + f[6],
            e = t.exec(f[1]);
          if (e) {
            e = Math.round(
              36e5 * ~~e[2] + 6e4 * ~~e[3] + 1e3 * parseFloat(e[4])
            );
            var h = f[2],
              p = 0;
            "yes" == f[5] ? (p = -1) : "yes" == f[4] && (p = 2e3);
            a in c ||
              ((c[a] = k.length),
              k.push({
                name: a,
                opt: { scrType: C[f[0]] || "333" },
                times: [],
              }));
            k[c[a]].times.push([[p, e], h, "", mathlib.str2time(f[3] + ":00")]);
          } else console.log("Invalid data detected");
        }
      }
      return k;
    },
  ];
  E["CubeDesk.new"] = [
    /^{"sessions":\[/i,
    function (n) {
      n = JSON.parse(b(n));
      var C = {},
        c = {};
      $.each(n.sessions, function (a, e) {
        C[e.id] = e.name;
        c[e.id] = e.order;
      });
      var k = {
          222: "222so",
          333: "333",
          444: "444wca",
          555: "555wca",
          pyram: "pyrso",
          skewb: "skbso",
          minx: "mgmp",
          sq1: "sqrs",
          clock: "clkwca",
          666: "666wca",
          777: "777wca",
          "333mirror": "333",
          "222oh": "222so",
          "333oh": "333oh",
          "333bl": "333ni",
        },
        g = [],
        f = {};
      $.each(n.solves, function (a, e) {
        a = e.session_id + "-" + e.cube_type;
        a in f ||
          ((f[a] = g.length),
          g.push({
            name: (C[e.session_id] || e.session_id) + "-" + e.cube_type,
            opt: { scrType: k[e.cube_type] || "333" },
            rank: c[e.session_id],
            times: [],
          }));
        a = g[f[a]];
        var h = 0;
        e.dnf ? (h = -1) : e.plus_two && (h = 2e3);
        a.times.push([
          [h, 1e3 * e.raw_time],
          e.scramble,
          e.notes || "",
          Math.round(e.started_at / 1e3),
        ]);
        (e = k[e.cube_type]) && (a.opt.scrType = e);
      });
      $.each(g, function (a, e) {
        e.times.sort(function (h, p) {
          return h[3] - p[3];
        });
      });
      g.sort(function (a, e) {
        return a.rank - e.rank;
      });
      return g;
    },
  ];
  return function (n) {
    var C = void 0,
      c;
    for (c in E)
      if (E[c][0].exec(n)) {
        console.log("try read by " + c);
        try {
          C = E[c][1](n);
          break;
        } catch (k) {
          console.log(k);
        }
      }
    return C;
  };
});
var LZString = (function () {
  function b(g) {
    g = ((g << 1) & 43690) | ((g >> 1) & 21845);
    g = ((g << 2) & 52428) | ((g >> 2) & 13107);
    g = ((g << 4) & 61680) | ((g >> 4) & 3855);
    return ((g << 8) & 65280) | ((g >> 8) & 255);
  }
  function N(g) {
    for (var f = [], a = 0; 64 > a; a++) f[a] = g.charAt(b(a) >> 10);
    return f.join("");
  }
  function t(g) {
    if (!c[g]) {
      c[g] = {};
      for (var f = 0; f < g.length; f++) c[g][g.charAt(f)] = f;
    }
    return c[g];
  }
  var E = String.fromCharCode,
    n = N("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="),
    C = N("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$"),
    c = {},
    k = {
      compressToBase64: function (g) {
        if (null == g) return "";
        g = k._compress(g, 6, function (f) {
          return n.charAt(f);
        });
        switch (g.length % 4) {
          default:
          case 0:
            return g;
          case 1:
            return g + "===";
          case 2:
            return g + "==";
          case 3:
            return g + "=";
        }
      },
      decompressFromBase64: function (g) {
        if (null == g) return "";
        if ("" == g) return null;
        var f = t(n);
        return k._decompress(g.length, 6, function (a) {
          return f[g.charAt(a)];
        });
      },
      compressToUTF16: function (g) {
        return null == g
          ? ""
          : k._compress(g, 15, function (f) {
              return E((b(f) >> 1) + 32);
            }) + " ";
      },
      decompressFromUTF16: function (g) {
        return null == g
          ? ""
          : "" == g
          ? null
          : k._decompress(g.length, 15, function (f) {
              return b(g.charCodeAt(f) - 32) >> 1;
            });
      },
      compressToUint8Array: function (g) {
        g = k.compress(g);
        for (
          var f = new Uint8Array(2 * g.length), a = 0, e = g.length;
          a < e;
          a++
        ) {
          var h = g.charCodeAt(a);
          f[2 * a] = h >>> 8;
          f[2 * a + 1] = h % 256;
        }
        return f;
      },
      decompressFromUint8Array: function (g) {
        if (null === g || void 0 === g) return k.decompress(g);
        for (var f = Array(g.length / 2), a = 0, e = f.length; a < e; a++)
          f[a] = 256 * g[2 * a] + g[2 * a + 1];
        var h = [];
        f.forEach(function (p) {
          h.push(E(p));
        });
        return k.decompress(h.join(""));
      },
      compressToEncodedURIComponent: function (g) {
        return null == g
          ? ""
          : k._compress(g, 6, function (f) {
              return C.charAt(f);
            });
      },
      decompressFromEncodedURIComponent: function (g) {
        if (null == g) return "";
        if ("" == g) return null;
        g = g.replace(/ /g, "+");
        var f = t(C);
        return k._decompress(g.length, 6, function (a) {
          return f[g.charAt(a)];
        });
      },
      compress: function (g) {
        return k._compress(g, 16, function (f) {
          return E(b(f));
        });
      },
      _compress: function (g, f, a) {
        if (null == g) return "";
        var e,
          h = Object.create(null),
          p = null,
          q = "",
          m = 2,
          r = 3,
          H = 2,
          y = [],
          A = 0,
          w = f,
          v = function (I, z) {
            for (; 0 < I; ) {
              var O = Math.min(I, w);
              A |= (z & ((1 << O) - 1)) << (f - w);
              w -= O;
              I -= O;
              z >>= O;
              0 == w && (y.push(a(A)), (A = 0), (w = f));
            }
          },
          u = function (I) {
            void 0 !== I.code
              ? (256 > I.code
                  ? (v(H, 0), v(8, I.code))
                  : (v(H, 1), v(16, I.code)),
                m--,
                0 == m && ((m = 1 << H), H++),
                delete I.code)
              : v(H, I.id);
            m--;
            0 == m && ((m = 1 << H), H++);
          };
        p = h;
        for (e = 0; e < g.length; e += 1)
          (q = g.charAt(e)),
            h[q] ||
              ((h[q] = Object.create(null)),
              (h[q].id = r++),
              (h[q].code = q.charCodeAt(0))),
            p[q]
              ? (p = p[q])
              : (u(p),
                (p[q] = Object.create(null)),
                (p[q].id = r++),
                (p = h[q]));
        p.id && u(p);
        v(H, 2);
        v(w, 0);
        return y.join("");
      },
      decompress: function (g) {
        return null == g
          ? ""
          : "" == g
          ? null
          : k._decompress(g.length, 16, function (f) {
              return b(g.charCodeAt(f));
            });
      },
      _decompress: function (g, f, a) {
        var e = [],
          h = 4,
          p = 4,
          q = 3,
          m = "",
          r = [],
          H = 0,
          y = 0,
          A = 0,
          w = function (I) {
            for (var z = 0, O = 0; I > O; ) {
              var J = Math.min(I - O, y);
              z |= (H & ((1 << J) - 1)) << O;
              O += J;
              y -= J;
              H >>= J;
              0 == y && ((y = f), (H = a(A++)));
            }
            return z;
          };
        for (m = 0; 3 > m; m++) e[m] = m;
        switch (w(2)) {
          case 0:
            var v = E(w(8));
            break;
          case 1:
            v = E(w(16));
            break;
          case 2:
            return "";
        }
        var u = (e[3] = v);
        for (r.push(v); ; ) {
          if (A > g) return "";
          switch ((v = w(q))) {
            case 0:
              e[p++] = E(w(8));
              v = p - 1;
              h--;
              break;
            case 1:
              e[p++] = E(w(16));
              v = p - 1;
              h--;
              break;
            case 2:
              return r.join("");
          }
          0 == h && ((h = 1 << q), q++);
          if (v < p) m = e[v];
          else if (v === p) m = u + u.charAt(0);
          else return null;
          r.push(m);
          e[p++] = u + m.charAt(0);
          h--;
          u = m;
          0 == h && ((h = 1 << q), q++);
        }
      },
    };
  return k;
})();
var min2phase = (function () {
  function b() {
    this.move = [];
    this.moveSol = [];
    this.nodeUD = [];
    this.valid1 = 0;
    this.allowShorter = !1;
    this.cc = new n();
    this.urfCubieCube = [];
    this.urfCoordCube = [];
    this.phase1Cubie = [];
    this.preMoveCubes = [];
    this.preMoves = [];
    this.maxPreMoves = this.preMoveLen = 0;
    this.isRec = !1;
    for (var T = 0; 21 > T; T++)
      (this.nodeUD[T] = new h()), (this.phase1Cubie[T] = new n());
    for (T = 0; 6 > T; T++)
      (this.urfCubieCube[T] = new n()), (this.urfCoordCube[T] = new h());
    for (T = 0; 20 > T; T++) this.preMoveCubes[T + 1] = new n();
  }
  function N(T, aa, ja) {
    T[aa >> 3] ^= ja << (aa << 2);
  }
  function t(T, aa, ja) {
    return Math.min(T, (aa[ja >> 3] >> (ja << 2)) & 15);
  }
  function E(T, aa, ja) {
    T = Ba[T];
    ja && (T ^= (14540032 >> ((T & 15) << 1)) & 3);
    return (T & 65520) | l[T & 15][aa];
  }
  function n() {
    this.ca = [0, 1, 2, 3, 4, 5, 6, 7];
    this.ea = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }
  function C(T, aa, ja) {
    ja--;
    for (var pa = 1985229328, qa = 0; qa < ja; ++qa) {
      var ua = A[ja - qa],
        Ja = ~~(aa / ua);
      aa %= ua;
      Ja <<= 2;
      T[qa] = (T[qa] & 240) | ((pa >> Ja) & 15);
      ua = (1 << Ja) - 1;
      pa = (pa & ua) + ((pa >> 4) & ~ua);
    }
    T[ja] = (T[ja] & 240) | (pa & 15);
  }
  function c(T, aa) {
    for (var ja = 0, pa = 1985229328, qa = 0; qa < aa - 1; ++qa) {
      var ua = (T[qa] & 15) << 2;
      ja = (aa - qa) * ja + ((pa >> ua) & 15);
      pa -= 286331152 << ua;
    }
    return ja;
  }
  function k(T, aa, ja) {
    T[ja - 1] &= 240;
    for (var pa = ja - 2; 0 <= pa; --pa) {
      T[pa] = (T[pa] & 240) | aa % (ja - pa);
      aa = ~~(aa / (ja - pa));
      for (var qa = pa + 1; qa < ja; ++qa)
        (T[qa] & 15) >= (T[pa] & 15) && (T[qa] += 1);
    }
  }
  function g(T, aa) {
    for (var ja = 0, pa = 0; pa < aa; ++pa) {
      ja *= aa - pa;
      for (var qa = pa + 1; qa < aa; ++qa) (T[qa] & 15) < (T[pa] & 15) && ++ja;
    }
    return ja;
  }
  function f(T, aa) {
    for (var ja = 0, pa = 4, qa = T.length - 1; 0 <= qa; qa--)
      (T[qa] & 12) == aa && (ja += y[qa][pa--]);
    return ja;
  }
  function a(T, aa, ja) {
    for (var pa = T.length - 1, qa = 4, ua = pa; 0 <= pa; pa--)
      aa >= y[pa][qa]
        ? ((aa -= y[pa][qa--]), (T[pa] = (T[pa] & 240) | qa | ja))
        : ((ua & 12) == ja && (ua -= 4), (T[pa] = (T[pa] & 240) | ua--));
  }
  function e(T, aa) {
    for (var ja = 0, pa = aa - 2; 0 <= pa; pa--)
      (ja ^= T % (aa - pa)), (T = ~~(T / (aa - pa)));
    return ja & 1;
  }
  function h() {
    this.flipc =
      this.twstc =
      this.prun =
      this.slice =
      this.flip =
      this.twst =
        0;
  }
  function p() {
    function T(ab, Ta, gb, Na, Ra, Ua, Za) {
      for (
        var Xa = new n(),
          db = new n(),
          bb = 0,
          hb = 2 <= Ra ? 1 : 2,
          $a = 1 != Ra ? n.EdgeConjugate : n.CornConjugate,
          rb = 0;
        rb < ab;
        rb++
      )
        if (void 0 === gb[rb]) {
          Ua.call(Xa, rb);
          for (var nb = 0; 16 > nb; nb += hb) {
            $a(Xa, nb, db);
            var sb = Za.call(db);
            0 == Ra && (M[(bb << 3) | (nb >> 1)] = sb);
            sb == rb && (Na[bb] |= 1 << (nb / hb));
            gb[sb] = ((bb << 4) | nb) / hb;
          }
          Ta[bb++] = rb;
        }
      return bb;
    }
    function aa(ab, Ta, gb, Na, Ra, Ua, Za, Xa) {
      for (var db = 0; db < gb; db++) {
        Ra.call(ja, Ta[db]);
        for (var bb = 0; bb < Na; bb++)
          Za(ja, Q[Xa ? Xa[bb] : bb], pa), (ab[db * Na + bb] = Ua.call(pa));
      }
    }
    for (
      var ja = new n(),
        pa = new n(),
        qa = new n().initCoord(28783, 0, 259268407, 0),
        ua = new n().initCoord(15138, 0, 119765538, 7),
        Ja = new n().initCoord(5167, 0, 83473207, 0),
        La = 0;
      8 > La;
      La++
    )
      Ja.ca[La] |= 48;
    for (La = 0; 16 > La; La++)
      (d[La] = new n().init(ja.ca, ja.ea)),
        n.CornMultFull(ja, ua, pa),
        n.EdgeMult(ja, ua, pa),
        ja.init(pa.ca, pa.ea),
        3 == La % 4 &&
          (n.CornMultFull(ja, Ja, pa),
          n.EdgeMult(ja, Ja, pa),
          ja.init(pa.ca, pa.ea)),
        7 == La % 8 &&
          (n.CornMultFull(ja, qa, pa),
          n.EdgeMult(ja, qa, pa),
          ja.init(pa.ca, pa.ea));
    for (La = 0; 16 > La; La++)
      (l[La] = []), (D[La] = []), (x[La] = []), (G[La] = []), (R[La] = []);
    for (La = 0; 16 > La; La++)
      for (qa = 0; 16 > qa; qa++)
        (l[La][qa] = La ^ qa ^ ((84660 >> qa) & (La << 1) & 2)),
          (D[l[La][qa]][qa] = La);
    ja = new n();
    for (La = 0; 16 > La; La++)
      for (qa = 0; 18 > qa; qa++) {
        n.CornConjugate(Q[qa], D[0][La], ja);
        ua = 0;
        a: for (; 18 > ua; ua++) {
          for (Ja = 0; 8 > Ja; Ja++) if (Q[ua].ca[Ja] != ja.ca[Ja]) continue a;
          x[La][qa] = ua;
          R[La][u[qa]] = u[ua];
          break;
        }
        0 == La % 2 && (G[(qa << 3) | (La >> 1)] = x[La][qa]);
      }
    T(2048, L, F, K, 0, n.prototype.setFlip, n.prototype.getFlip);
    T(2187, S, Z, fa, 1, n.prototype.setTwst, n.prototype.getTwst);
    T(40320, ea, va, ra, 2, n.prototype.setEPerm, n.prototype.getEPerm);
    qa = new n();
    for (La = 0; 2768 > La; La++)
      C(qa.ea, ea[La], 8),
        (ya[La] = f(qa.ea, 0) + 70 * e(ea[La], 8)),
        ja.invFrom(qa),
        (Ba[La] = va[ja.getEPerm()]);
    ja = new n();
    pa = new n();
    aa(ta, L, 336, 18, n.prototype.setFlip, n.prototype.getFlipSym, n.EdgeMult);
    aa(sa, S, 324, 18, n.prototype.setTwst, n.prototype.getTwstSym, n.CornMult);
    aa(
      Da,
      ea,
      2768,
      10,
      n.prototype.setEPerm,
      n.prototype.getEPermSym,
      n.EdgeMult,
      v
    );
    aa(
      Aa,
      ea,
      2768,
      10,
      n.prototype.setCPerm,
      n.prototype.getCPermSym,
      n.CornMult,
      v
    );
    for (La = 0; 495 > La; La++) {
      ja.setSlice(La);
      for (qa = 0; 18 > qa; qa++)
        n.EdgeMult(ja, Q[qa], pa), (na[18 * La + qa] = pa.getSlice());
      for (qa = 0; 16 > qa; qa += 2)
        n.EdgeConjugate(ja, D[0][qa], pa),
          (U[(La << 3) | (qa >> 1)] = pa.getSlice());
    }
    for (La = 0; 24 > La; La++) {
      ja.setMPerm(La);
      for (qa = 0; 10 > qa; qa++)
        n.EdgeMult(ja, Q[v[qa]], pa), (Ha[10 * La + qa] = pa.getMPerm());
      for (qa = 0; 16 > qa; qa++)
        n.EdgeConjugate(ja, D[0][qa], pa), (Ma[(La << 4) | qa] = pa.getMPerm());
    }
    for (La = 0; 140 > La; La++) {
      ja.setCComb(La % 70);
      for (qa = 0; 10 > qa; qa++)
        n.CornMult(ja, Q[v[qa]], pa),
          (da[10 * La + qa] =
            pa.getCComb() + 70 * (((165 >> qa) & 1) ^ ~~(La / 70)));
      for (qa = 0; 16 > qa; qa++)
        n.CornConjugate(ja, D[0][qa], pa),
          (wa[(La << 4) | qa] = pa.getCComb() + 70 * ~~(La / 70));
    }
  }
  function q(T, aa, ja, pa, qa, ua, Ja, La) {
    var ab = La & 15,
      Ta = 1 == ((La >> 4) & 1) ? 14540032 : 0,
      gb = (La >> 8) & 15,
      Na = (La >> 12) & 15,
      Ra = (La >> 16) & 15,
      Ua = (1 << ab) - 1,
      Za = null == pa;
    ja *= aa;
    La = 1 == ((La >> 5) & 1) ? 10 : 18;
    var Xa = 10 == La ? 66 : 599186,
      db = ((T[ja >> 3] >> (ja << 2)) & 15) - 1;
    if (-1 == db) {
      for (var bb = 0; bb < (ja >> 3) + 1; bb++) T[bb] = -1;
      N(T, 0, 15);
      db = 0;
    } else N(T, ja, 15 ^ (db + 1));
    for (Na = 0 < H ? Math.min(Math.max(db + 1, Ra), Na) : Na; db < Na; ) {
      var hb = (Ra = db > gb) ? 15 : db,
        $a = 286331153 * hb,
        rb = Ra ? db : 15;
      db++;
      za++;
      var nb = db ^ 15,
        sb = 0,
        Sa = 0;
      for (bb = 0; bb < ja; bb++, Sa >>= 4) {
        if (0 == (bb & 7)) {
          Sa = T[bb >> 3];
          var ib = Sa ^ $a;
          if (0 == ((ib - 286331153) & ~ib & 2290649224)) {
            bb += 7;
            continue;
          }
        }
        if ((Sa & 15) == hb) {
          ib = bb % aa;
          var Mb = ~~(bb / aa),
            mb = 0,
            tb = 0;
          Za && ((mb = F[ib]), (tb = mb & 7), (mb >>= 3));
          for (var ob = 0; ob < La; ob++) {
            var Ia = ua[Mb * La + ob];
            var Oa = Za
              ? M[ta[mb * La + G[(ob << 3) | tb]] ^ tb ^ (Ia & Ua)]
              : qa[(pa[ib * La + ob] << ab) | (Ia & Ua)];
            Ia >>= ab;
            var Va = Ia * aa + Oa,
              eb = (T[Va >> 3] >> (Va << 2)) & 15;
            if (eb != rb) eb < db - 1 && (ob += (Xa >> ob) & 3);
            else {
              sb++;
              if (Ra) {
                N(T, bb, nb);
                break;
              }
              N(T, Va, nb);
              Va = 1;
              for (eb = Ja[Ia]; 0 != (eb >>= 1); Va++)
                if (1 == (eb & 1)) {
                  var fb = Ia * aa;
                  fb = Za
                    ? fb + M[F[Oa] ^ Va]
                    : fb + qa[(Oa << ab) | (Va ^ ((Ta >> (Va << 1)) & 3))];
                  ((T[fb >> 3] >> (fb << 2)) & 15) == rb &&
                    (N(T, fb, nb), sb++);
                }
            }
          }
        }
      }
    }
    N(T, ja, (db + 1) ^ 15);
    return db + 1;
  }
  function m(T) {
    Ka = q(ka, 2048, 324, null, null, sa, fa, 103939);
    za > T ||
      ((Qa = q(ba, 495, 324, na, U, sa, fa, 431619)),
      za > T ||
        ((ia = q(la, 495, 336, na, U, ta, K, 431619)),
        za > T ||
          ((oa = q(ha, 24, 2768, Ha, Ma, Aa, ra, 584244)),
          za > T || (ma = q(Ea, 140, 2768, da, wa, Da, ra, 514084)))));
  }
  function r() {
    0 > za && (p(), (za = 0));
    if (0 == za) m(99);
    else if (54 > za) m(za);
    else return !0;
    return !1;
  }
  for (
    var H = 2,
      y = [],
      A = [1],
      w = "U ;U2;U';R ;R2;R';F ;F2;F';D ;D2;D';L ;L2;L';B ;B2;B'".split(";"),
      v = [0, 1, 2, 4, 7, 9, 10, 11, 13, 16, 3, 5, 6, 8, 12, 14, 15, 17],
      u = [],
      I = [],
      z = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        [6, 7, 8, 0, 1, 2, 3, 4, 5, 15, 16, 17, 9, 10, 11, 12, 13, 14],
        [3, 4, 5, 6, 7, 8, 0, 1, 2, 12, 13, 14, 15, 16, 17, 9, 10, 11],
        [2, 1, 0, 5, 4, 3, 8, 7, 6, 11, 10, 9, 14, 13, 12, 17, 16, 15],
        [8, 7, 6, 2, 1, 0, 5, 4, 3, 17, 16, 15, 11, 10, 9, 14, 13, 12],
        [5, 4, 3, 8, 7, 6, 2, 1, 0, 14, 13, 12, 17, 16, 15, 11, 10, 9],
      ],
      O = 0;
    18 > O;
    O++
  )
    u[v[O]] = O;
  for (O = 0; 10 > O; O++)
    for (var J = ~~(v[O] / 3), P = (I[O] = 0); 10 > P; P++) {
      var W = ~~(v[P] / 3);
      I[O] |= (J == W || (J % 3 == W % 3 && J >= W) ? 1 : 0) << P;
    }
  for (O = I[10] = 0; 13 > O; O++)
    for (
      y[O] = [], A[O + 1] = A[O] * (O + 1), P = y[O][0] = y[O][O] = 1;
      13 > P;
      P++
    )
      y[O][P] = P <= O ? y[O - 1][P - 1] + y[O - 1][P] : 0;
  n.EdgeMult = function (T, aa, ja) {
    for (var pa = 0; 12 > pa; pa++)
      ja.ea[pa] = T.ea[aa.ea[pa] & 15] ^ (aa.ea[pa] & 16);
  };
  n.CornMult = function (T, aa, ja) {
    for (var pa = 0; 8 > pa; pa++)
      ja.ca[pa] =
        (T.ca[aa.ca[pa] & 15] & 15) |
        (((T.ca[aa.ca[pa] & 15] >> 4) + (aa.ca[pa] >> 4)) % 3 << 4);
  };
  n.CornMultFull = function (T, aa, ja) {
    for (var pa = 0; 8 > pa; pa++) {
      var qa = T.ca[aa.ca[pa] & 15] >> 4,
        ua = aa.ca[pa] >> 4,
        Ja = qa + (3 > qa ? ua : 6 - ua);
      Ja = (Ja % 3) + (3 > qa == 3 > ua ? 0 : 3);
      ja.ca[pa] = (T.ca[aa.ca[pa] & 15] & 15) | (Ja << 4);
    }
  };
  n.CornConjugate = function (T, aa, ja) {
    var pa = d[D[0][aa]];
    aa = d[aa];
    for (var qa = 0; 8 > qa; qa++) {
      var ua = T.ca[aa.ca[qa] & 15] >> 4;
      ja.ca[qa] =
        (pa.ca[T.ca[aa.ca[qa] & 15] & 15] & 15) |
        ((3 > pa.ca[T.ca[aa.ca[qa] & 15] & 15] >> 4 ? ua : (3 - ua) % 3) << 4);
    }
  };
  n.EdgeConjugate = function (T, aa, ja) {
    var pa = d[D[0][aa]];
    aa = d[aa];
    for (var qa = 0; 12 > qa; qa++)
      ja.ea[qa] =
        pa.ea[T.ea[aa.ea[qa] & 15] & 15] ^
        (T.ea[aa.ea[qa] & 15] & 16) ^
        (aa.ea[qa] & 16);
  };
  n.prototype.init = function (T, aa) {
    this.ca = T.slice();
    this.ea = aa.slice();
    return this;
  };
  n.prototype.initCoord = function (T, aa, ja, pa) {
    C(this.ca, T, 8);
    this.setTwst(aa);
    k(this.ea, ja, 12);
    this.setFlip(pa);
    return this;
  };
  n.prototype.isEqual = function (T) {
    for (var aa = 0; 8 > aa; aa++) if (this.ca[aa] != T.ca[aa]) return !1;
    for (aa = 0; 12 > aa; aa++) if (this.ea[aa] != T.ea[aa]) return !1;
    return !0;
  };
  n.prototype.setFlip = function (T) {
    for (var aa = 0, ja = 10; 0 <= ja; ja--, T >>= 1)
      (this.ea[ja] = (this.ea[ja] & 15) | ((T & 1) << 4)), (aa ^= this.ea[ja]);
    this.ea[11] = (this.ea[11] & 15) | (aa & 16);
  };
  n.prototype.getFlip = function () {
    for (var T = 0, aa = 0; 11 > aa; aa++)
      T = (T << 1) | ((this.ea[aa] >> 4) & 1);
    return T;
  };
  n.prototype.getFlipSym = function () {
    return F[this.getFlip()];
  };
  n.prototype.setTwst = function (T) {
    for (var aa = 15, ja = 6; 0 <= ja; ja--, T = ~~(T / 3))
      (this.ca[ja] = (this.ca[ja] & 15) | (T % 3 << 4)),
        (aa -= this.ca[ja] >> 4);
    this.ca[7] = (this.ca[7] & 15) | (aa % 3 << 4);
  };
  n.prototype.getTwst = function () {
    for (var T = 0, aa = 0; 7 > aa; aa++) T += (T << 1) + (this.ca[aa] >> 4);
    return T;
  };
  n.prototype.getTwstSym = function () {
    return Z[this.getTwst()];
  };
  n.prototype.setCPerm = function (T) {
    C(this.ca, T, 8);
  };
  n.prototype.getCPerm = function () {
    return c(this.ca, 8);
  };
  n.prototype.getCPermSym = function () {
    var T = va[c(this.ca, 8)];
    return T ^ ((14540032 >> ((T & 15) << 1)) & 3);
  };
  n.prototype.setEPerm = function (T) {
    C(this.ea, T, 8);
  };
  n.prototype.getEPerm = function () {
    return c(this.ea, 8);
  };
  n.prototype.getEPermSym = function () {
    return va[c(this.ea, 8)];
  };
  n.prototype.getSlice = function () {
    return 494 - f(this.ea, 8);
  };
  n.prototype.setSlice = function (T) {
    a(this.ea, 494 - T, 8);
  };
  n.prototype.getMPerm = function () {
    return g(this.ea, 12) % 24;
  };
  n.prototype.setMPerm = function (T) {
    k(this.ea, T, 12);
  };
  n.prototype.getCComb = function () {
    return f(this.ca, 0);
  };
  n.prototype.setCComb = function (T) {
    a(this.ca, T, 0);
  };
  n.prototype.URFConjugate = function () {
    var T = new n();
    n.CornMult(n.urf2, this, T);
    n.CornMult(T, n.urf1, this);
    n.EdgeMult(n.urf2, this, T);
    n.EdgeMult(T, n.urf1, this);
  };
  var X = [
      [8, 9, 20],
      [6, 18, 38],
      [0, 36, 47],
      [2, 45, 11],
      [29, 26, 15],
      [27, 44, 24],
      [33, 53, 42],
      [35, 17, 51],
    ],
    V = [
      [5, 10],
      [7, 19],
      [3, 37],
      [1, 46],
      [32, 16],
      [28, 25],
      [30, 43],
      [34, 52],
      [23, 12],
      [21, 41],
      [50, 39],
      [48, 14],
    ];
  n.prototype.toFaceCube = function (T, aa) {
    T = T || X;
    aa = aa || V;
    for (var ja = [], pa = 0; 54 > pa; pa++) ja[pa] = "URFDLB"[~~(pa / 9)];
    for (var qa = 0; 8 > qa; qa++) {
      pa = this.ca[qa] & 15;
      for (var ua = this.ca[qa] >> 4, Ja = 0; 3 > Ja; Ja++)
        ja[T[qa][(Ja + ua) % 3]] = "URFDLB"[~~(T[pa][Ja] / 9)];
    }
    for (T = 0; 12 > T; T++)
      for (pa = this.ea[T] & 15, ua = this.ea[T] >> 4, Ja = 0; 2 > Ja; Ja++)
        ja[aa[T][(Ja + ua) % 2]] = "URFDLB"[~~(aa[pa][Ja] / 9)];
    return ja.join("");
  };
  n.prototype.invFrom = function (T) {
    for (var aa = 0; 12 > aa; aa++)
      this.ea[T.ea[aa] & 15] = (aa & 15) | (T.ea[aa] & 16);
    for (aa = 0; 8 > aa; aa++)
      this.ca[T.ca[aa] & 15] = aa | ((64 >> (T.ca[aa] >> 4)) & 48);
    return this;
  };
  n.prototype.fromFacelet = function (T, aa, ja) {
    aa = aa || X;
    ja = ja || V;
    for (
      var pa = 0,
        qa = [],
        ua = T[4] + T[13] + T[22] + T[31] + T[40] + T[49],
        Ja = 0;
      54 > Ja;
      ++Ja
    ) {
      qa[Ja] = ua.indexOf(T[Ja]);
      if (-1 == qa[Ja]) return -1;
      pa += 1 << (qa[Ja] << 2);
    }
    if (10066329 != pa) return -1;
    var La;
    for (Ja = 0; 8 > Ja; ++Ja) {
      for (La = 0; 3 > La && 0 != qa[aa[Ja][La]] && 3 != qa[aa[Ja][La]]; ++La);
      T = qa[aa[Ja][(La + 1) % 3]];
      pa = qa[aa[Ja][(La + 2) % 3]];
      for (ua = 0; 8 > ua; ++ua)
        if (T == ~~(aa[ua][1] / 9) && pa == ~~(aa[ua][2] / 9)) {
          this.ca[Ja] = ua | (La % 3 << 4);
          break;
        }
    }
    for (Ja = 0; 12 > Ja; ++Ja)
      for (ua = 0; 12 > ua; ++ua) {
        if (
          qa[ja[Ja][0]] == ~~(ja[ua][0] / 9) &&
          qa[ja[Ja][1]] == ~~(ja[ua][1] / 9)
        ) {
          this.ea[Ja] = ua;
          break;
        }
        if (
          qa[ja[Ja][0]] == ~~(ja[ua][1] / 9) &&
          qa[ja[Ja][1]] == ~~(ja[ua][0] / 9)
        ) {
          this.ea[Ja] = ua | 16;
          break;
        }
      }
  };
  h.prototype.set = function (T) {
    this.twst = T.twst;
    this.flip = T.flip;
    this.slice = T.slice;
    this.prun = T.prun;
    this.twstc = T.twstc;
    this.flipc = T.flipc;
  };
  h.prototype.calcPruning = function (T) {
    this.prun = Math.max(
      t(
        Qa,
        ba,
        495 * (this.twst >> 3) + U[(this.slice << 3) | (this.twst & 7)]
      ),
      t(
        ia,
        la,
        495 * (this.flip >> 3) + U[(this.slice << 3) | (this.flip & 7)]
      ),
      t(Ka, ka, ((this.twstc >> 3) << 11) | M[this.flipc ^ (this.twstc & 7)]),
      t(Ka, ka, ((this.twst >> 3) << 11) | M[this.flip ^ (this.twst & 7)])
    );
  };
  h.prototype.setWithPrun = function (T, aa) {
    this.twst = T.getTwstSym();
    this.flip = T.getFlipSym();
    this.prun = t(
      Ka,
      ka,
      ((this.twst >> 3) << 11) | M[this.flip ^ (this.twst & 7)]
    );
    if (this.prun > aa) return !1;
    this.slice = T.getSlice();
    this.prun = Math.max(
      this.prun,
      t(
        Qa,
        ba,
        495 * (this.twst >> 3) + U[(this.slice << 3) | (this.twst & 7)]
      ),
      t(ia, la, 495 * (this.flip >> 3) + U[(this.slice << 3) | (this.flip & 7)])
    );
    if (this.prun > aa) return !1;
    var ja = new n();
    n.CornConjugate(T, 1, ja);
    n.EdgeConjugate(T, 1, ja);
    this.twstc = ja.getTwstSym();
    this.flipc = ja.getFlipSym();
    this.prun = Math.max(
      this.prun,
      t(Ka, ka, ((this.twstc >> 3) << 11) | M[this.flipc ^ (this.twstc & 7)])
    );
    return this.prun <= aa;
  };
  h.prototype.doMovePrun = function (T, aa, ja) {
    this.slice = na[18 * T.slice + aa];
    this.flip =
      ta[18 * (T.flip >> 3) + G[(aa << 3) | (T.flip & 7)]] ^ (T.flip & 7);
    this.twst =
      sa[18 * (T.twst >> 3) + G[(aa << 3) | (T.twst & 7)]] ^ (T.twst & 7);
    return (this.prun = Math.max(
      t(
        Qa,
        ba,
        495 * (this.twst >> 3) + U[(this.slice << 3) | (this.twst & 7)]
      ),
      t(
        ia,
        la,
        495 * (this.flip >> 3) + U[(this.slice << 3) | (this.flip & 7)]
      ),
      t(Ka, ka, ((this.twst >> 3) << 11) | M[this.flip ^ (this.twst & 7)])
    ));
  };
  h.prototype.doMovePrunConj = function (T, aa) {
    aa = x[3][aa];
    this.flipc =
      ta[18 * (T.flipc >> 3) + G[(aa << 3) | (T.flipc & 7)]] ^ (T.flipc & 7);
    this.twstc =
      sa[18 * (T.twstc >> 3) + G[(aa << 3) | (T.twstc & 7)]] ^ (T.twstc & 7);
    return t(
      Ka,
      ka,
      ((this.twstc >> 3) << 11) | M[this.flipc ^ (this.twstc & 7)]
    );
  };
  b.prototype.solution = function (T, aa, ja, pa, qa, ua, Ja) {
    r();
    T = this.verify(T);
    if (0 != T) return "Error " + Math.abs(T);
    void 0 === aa && (aa = 21);
    void 0 === ja && (ja = 1e9);
    void 0 === pa && (pa = 0);
    void 0 === qa && (qa = 0);
    this.sol = aa + 1;
    this.probe = 0;
    this.probeMax = ja;
    this.probeMin = Math.min(pa, ja);
    this.verbose = qa;
    this.moveSol = null;
    this.isRec = !1;
    this.firstFilters = [0, 0, 0, 0, 0, 0];
    this.lastFilters = [0, 0, 0, 0, 0, 0];
    for (aa = 0; 3 > aa; aa++)
      void 0 !== ua &&
        ((this.firstFilters[aa] |=
          3591 << (3 * ~~(z[(3 - aa) % 3][3 * ua] / 3))),
        (this.lastFilters[aa + 3] |=
          3591 << (3 * ~~(z[(3 - aa) % 3][3 * ua] / 3)))),
        void 0 !== Ja &&
          ((this.lastFilters[aa] |=
            3591 << (3 * ~~(z[(3 - aa) % 3][3 * Ja] / 3))),
          (this.firstFilters[aa + 3] |=
            3591 << (3 * ~~(z[(3 - aa) % 3][3 * Ja] / 3))));
    this.initSearch();
    return this.search();
  };
  b.prototype.initSearch = function () {
    this.conjMask = 0;
    this.maxPreMoves = 7 < this.conjMask ? 0 : 20;
    for (var T = 0; 6 > T; T++)
      if (
        (this.urfCubieCube[T].init(this.cc.ca, this.cc.ea),
        this.urfCoordCube[T].setWithPrun(this.urfCubieCube[T], 20),
        this.cc.URFConjugate(),
        2 == T % 3)
      ) {
        var aa = new n().invFrom(this.cc);
        this.cc.init(aa.ca, aa.ea);
      }
  };
  b.prototype.next = function (T, aa, ja) {
    this.probe = 0;
    this.probeMax = T;
    this.probeMin = Math.min(aa, T);
    this.moveSol = null;
    this.isRec = !0;
    this.verbose = ja;
    return this.search();
  };
  b.prototype.verify = function (T) {
    if (-1 == this.cc.fromFacelet(T)) return -1;
    for (var aa = (T = 0), ja = 0; 12 > ja; ja++)
      (aa |= 1 << (this.cc.ea[ja] & 15)), (T ^= this.cc.ea[ja] >> 4);
    if (4095 != aa) return -2;
    if (0 != T) return -3;
    for (ja = T = aa = 0; 8 > ja; ja++)
      (aa |= 1 << (this.cc.ca[ja] & 15)), (T += this.cc.ca[ja] >> 4);
    return 255 != aa
      ? -4
      : 0 != T % 3
      ? -5
      : 0 != (e(g(this.cc.ea, 12), 12) ^ e(this.cc.getCPerm(), 8))
      ? -6
      : 0;
  };
  b.prototype.phase1PreMoves = function (T, aa, ja) {
    if (T == this.maxPreMoves - 1 && 0 != ((this.lastFilter >> aa) & 1))
      return 1;
    this.preMoveLen = this.maxPreMoves - T;
    if (
      this.isRec
        ? this.depth1 == this.length1 - this.preMoveLen
        : 0 == this.preMoveLen || 0 == ((225207 >> aa) & 1)
    )
      if (
        ((this.depth1 = this.length1 - this.preMoveLen),
        this.phase1Cubie[0].init(ja.ca, ja.ea),
        (this.allowShorter = 7 == this.depth1 && 0 != this.preMoveLen),
        this.nodeUD[this.depth1 + 1].setWithPrun(ja, this.depth1) &&
          0 == this.phase1(this.nodeUD[this.depth1 + 1], this.depth1, -1))
      )
        return 0;
    if (0 == T || this.preMoveLen + 7 >= this.length1) return 1;
    var pa = 0;
    if (1 == T || this.preMoveLen + 1 + 7 >= this.length1) pa |= 225207;
    aa = 3 * ~~(aa / 3);
    for (var qa = 0; 18 > qa; qa++)
      if (qa == aa || qa == aa - 9 || qa == aa + 9) qa += 2;
      else if (
        !(
          (this.isRec && qa != this.preMoves[this.maxPreMoves - T]) ||
          0 != (pa & (1 << qa))
        ) &&
        (n.CornMult(Q[qa], ja, this.preMoveCubes[T]),
        n.EdgeMult(Q[qa], ja, this.preMoveCubes[T]),
        (this.preMoves[this.maxPreMoves - T] = qa),
        0 == this.phase1PreMoves(T - 1, qa, this.preMoveCubes[T]))
      )
        return 0;
    return 1;
  };
  b.prototype.search = function () {
    for (
      this.length1 = this.isRec ? this.length1 : 0;
      this.length1 < this.sol;
      this.length1++
    )
      for (
        this.urfIdx = this.isRec ? this.urfIdx : 0;
        6 > this.urfIdx;
        this.urfIdx++
      )
        if (
          0 == (this.conjMask & (1 << this.urfIdx)) &&
          ((this.firstFilter = this.firstFilters[this.urfIdx]),
          (this.lastFilter = this.lastFilters[this.urfIdx]),
          0 ==
            this.phase1PreMoves(
              this.maxPreMoves,
              -30,
              this.urfCubieCube[this.urfIdx],
              0
            ))
        )
          return null == this.moveSol ? "Error 8" : this.moveSol;
    return null == this.moveSol ? "Error 7" : this.moveSol;
  };
  b.prototype.initPhase2Pre = function () {
    this.isRec = !1;
    if (this.probe >= (null == this.moveSol ? this.probeMax : this.probeMin))
      return 0;
    ++this.probe;
    for (var T = this.valid1; T < this.depth1; T++)
      n.CornMult(this.phase1Cubie[T], Q[this.move[T]], this.phase1Cubie[T + 1]),
        n.EdgeMult(
          this.phase1Cubie[T],
          Q[this.move[T]],
          this.phase1Cubie[T + 1]
        );
    this.valid1 = this.depth1;
    T = this.initPhase2(this.phase1Cubie[this.depth1]);
    if (0 == T || 0 == this.preMoveLen || 2 == T) return T;
    T = 3 * ~~(this.preMoves[this.preMoveLen - 1] / 3) + 1;
    n.CornMult(
      Q[T],
      this.phase1Cubie[this.depth1],
      this.phase1Cubie[this.depth1 + 1]
    );
    n.EdgeMult(
      Q[T],
      this.phase1Cubie[this.depth1],
      this.phase1Cubie[this.depth1 + 1]
    );
    this.preMoves[this.preMoveLen - 1] +=
      2 - (this.preMoves[this.preMoveLen - 1] % 3) * 2;
    T = this.initPhase2(this.phase1Cubie[this.depth1 + 1]);
    this.preMoves[this.preMoveLen - 1] +=
      2 - (this.preMoves[this.preMoveLen - 1] % 3) * 2;
    return T;
  };
  b.prototype.initPhase2 = function (T) {
    var aa = T.getCPermSym(),
      ja = aa & 15;
    aa >>= 4;
    var pa = T.getEPermSym(),
      qa = pa & 15;
    pa >>= 4;
    T = T.getMPerm();
    var ua = Math.max(
        t(ma, Ea, 140 * pa + wa[((ya[aa] & 255) << 4) | D[qa][ja]]),
        t(oa, ha, 24 * aa + Ma[(T << 4) | ja])
      ),
      Ja = Math.min(13, this.sol - this.length1);
    if (ua >= Ja) return ua > Ja ? 2 : 1;
    var La;
    for (La = Ja - 1; La >= ua; La--) {
      var ab = this.phase2(pa, qa, aa, ja, T, La, this.depth1, 10);
      if (0 > ab) break;
      La -= ab;
      this.moveSol = [];
      for (ab = 0; ab < this.depth1 + La; ab++)
        this.appendSolMove(this.move[ab]);
      for (ab = this.preMoveLen - 1; 0 <= ab; ab--)
        this.appendSolMove(this.preMoves[ab]);
      this.sol = this.moveSol.length;
      this.moveSol = this.solutionToString();
    }
    return La != Ja - 1 ? (this.probe >= this.probeMin ? 0 : 1) : 1;
  };
  b.prototype.phase1 = function (T, aa, ja) {
    if (aa == this.depth1 - 1 && 0 != ((this.firstFilter >> ja) & 1)) return 1;
    if (0 == T.prun && 5 > aa) {
      if (this.allowShorter || 0 == aa) {
        this.depth1 -= aa;
        var pa = this.initPhase2Pre();
        this.depth1 += aa;
        return pa;
      }
      return 1;
    }
    for (var qa = 0; 18 > qa; qa += 3)
      if (qa != ja && qa != ja - 9)
        for (var ua = 0; 3 > ua; ua++)
          if (
            ((pa = qa + ua), !this.isRec || pa == this.move[this.depth1 - aa])
          ) {
            var Ja = this.nodeUD[aa].doMovePrun(T, pa, !0);
            if (Ja > aa) break;
            else if (Ja == aa) continue;
            Ja = this.nodeUD[aa].doMovePrunConj(T, pa);
            if (Ja > aa) break;
            else if (Ja == aa) continue;
            this.move[this.depth1 - aa] = pa;
            this.valid1 = Math.min(this.valid1, this.depth1 - aa);
            pa = this.phase1(this.nodeUD[aa], aa - 1, qa);
            if (0 == pa) return 0;
            if (2 == pa) break;
          }
    return 1;
  };
  b.prototype.appendSolMove = function (T) {
    if (0 == this.moveSol.length) this.moveSol.push(T);
    else {
      var aa = ~~(T / 3),
        ja = ~~(this.moveSol.at(-1) / 3);
      aa == ja
        ? ((T = ((T % 3) + (this.moveSol.at(-1) % 3) + 1) % 4),
          3 == T ? this.moveSol.pop() : this.moveSol.splice(-1, 1, 3 * aa + T))
        : 1 < this.moveSol.length &&
          aa % 3 == ja % 3 &&
          aa == ~~(this.moveSol.at(-2) / 3)
        ? ((T = ((T % 3) + (this.moveSol.at(-2) % 3) + 1) % 4),
          3 == T
            ? (this.moveSol.splice(-2, 1, this.moveSol.at(-1)),
              this.moveSol.pop())
            : this.moveSol.splice(-2, 1, 3 * aa + T))
        : this.moveSol.push(T);
    }
  };
  b.prototype.phase2 = function (T, aa, ja, pa, qa, ua, Ja, La) {
    if (0 == this.depth1 && 1 == Ja && 0 != ((this.firstFilter >> v[La]) & 1))
      return -1;
    if (
      0 == T &&
      0 == ja &&
      0 == qa &&
      (0 < this.preMoveLen || 0 == ((this.lastFilter >> v[La]) & 1))
    )
      return ua;
    La = I[La];
    for (var ab = 0; 10 > ab; ab++)
      if (0 != ((La >> ab) & 1)) ab += (66 >> ab) & 3;
      else {
        var Ta = Ha[10 * qa + ab],
          gb = Aa[10 * ja + R[pa][ab]],
          Na = l[gb & 15][pa];
        gb >>= 4;
        if (!(t(oa, ha, 24 * gb + Ma[(Ta << 4) | Na]) >= ua)) {
          var Ra = Da[10 * T + R[aa][ab]],
            Ua = l[Ra & 15][aa];
          Ra >>= 4;
          if (
            !(t(ma, Ea, 140 * Ra + wa[((ya[gb] & 255) << 4) | D[Ua][Na]]) >= ua)
          ) {
            var Za = E(Ra, Ua, !1),
              Xa = E(gb, Na, !0);
            if (
              !(
                t(
                  ma,
                  Ea,
                  140 * (Za >> 4) +
                    wa[((ya[Xa >> 4] & 255) << 4) | D[Za & 15][Xa & 15]]
                ) >= ua
              ) &&
              ((Ta = this.phase2(Ra, Ua, gb, Na, Ta, ua - 1, Ja + 1, ab)),
              0 <= Ta)
            )
              return (this.move[Ja] = v[ab]), Ta;
          }
        }
      }
    return -1;
  };
  b.prototype.solutionToString = function () {
    var T = "",
      aa = 0 != (this.verbose & 2) ? (this.urfIdx + 3) % 6 : this.urfIdx;
    if (3 > aa)
      for (var ja = 0; ja < this.moveSol.length; ++ja)
        T += w[z[aa][this.moveSol[ja]]] + " ";
    else
      for (ja = this.moveSol.length - 1; 0 <= ja; --ja)
        T += w[z[aa][this.moveSol[ja]]] + " ";
    return T;
  };
  var Q = [],
    d = [],
    l = [],
    D = [],
    x = [],
    R = [],
    G = [],
    L = [],
    F = [],
    K = [],
    M = [],
    S = [],
    Z = [],
    fa = [],
    ea = [],
    va = [],
    ra = [],
    ya = [],
    Ba = [],
    sa = [],
    ta = [],
    na = [],
    U = [],
    ba = [],
    la = [],
    ka = [],
    Aa = [],
    Da = [],
    Ha = [],
    Ma = [],
    da = [],
    wa = [],
    ha = [],
    Ea = [],
    Ka = 15,
    Qa = 15,
    ia = 15,
    oa = 15,
    ma = 15;
  for (O = 0; 18 > O; O++) Q[O] = new n();
  Q[0].initCoord(15120, 0, 119750400, 0);
  Q[3].initCoord(21021, 1494, 323403417, 0);
  Q[6].initCoord(8064, 1236, 29441808, 550);
  Q[9].initCoord(9, 0, 5880, 0);
  Q[12].initCoord(1230, 412, 2949660, 0);
  Q[15].initCoord(224, 137, 328552, 137);
  for (O = 0; 18 > O; O += 3)
    for (J = 0; 2 > J; J++)
      n.EdgeMult(Q[O + J], Q[O], Q[O + J + 1]),
        n.CornMult(Q[O + J], Q[O], Q[O + J + 1]);
  n.urf1 = new n().initCoord(2531, 1373, 67026819, 1367);
  n.urf2 = new n().initCoord(2089, 1906, 322752913, 2040);
  var za = -1;
  return {
    Search: b,
    solve: function (T) {
      return new b().solution(T);
    },
    randomCube: function () {
      var T = ~~(2048 * Math.random()),
        aa = ~~(2187 * Math.random());
      do {
        var ja = ~~(Math.random() * A[12]);
        var pa = ~~(Math.random() * A[8]);
      } while (e(pa, 8) != e(ja, 12));
      return new n().initCoord(pa, aa, ja, T).toFaceCube();
    },
    fromScramble: function (T) {
      for (var aa = -1, ja = new n(), pa = new n(), qa = 0; qa < T.length; qa++)
        switch (T[qa]) {
          case "U":
          case "R":
          case "F":
          case "D":
          case "L":
          case "B":
            aa = 3 * "URFDLB".indexOf(T[qa]);
            break;
          case " ":
            -1 != aa &&
              (n.CornMult(ja, Q[aa], pa),
              n.EdgeMult(ja, Q[aa], pa),
              ja.init(pa.ca, pa.ea));
            aa = -1;
            break;
          case "2":
            aa++;
            break;
          case "'":
            aa += 2;
        }
      -1 != aa &&
        (n.CornMult(ja, Q[aa], pa),
        n.EdgeMult(ja, Q[aa], pa),
        ja.init(pa.ca, pa.ea));
      return pa.toFaceCube();
    },
    initFull: function () {
      H = 0;
      r();
    },
    INVERSE_SOLUTION: 2,
  };
})();
"undefined" !== typeof module &&
  "undefined" !== typeof module.exports &&
  (module.exports = min2phase);
var cubeutil = (function () {
  function b(F) {
    for (var K = {}, M = 0; M < F.length; M++) {
      var S = F[M];
      "-" != S && ((K[S] = K[S] || []), K[S].push(M));
    }
    F = [];
    for (S in K) 1 < K[S].length && F.push(K[S]);
    return F;
  }
  function N(F, K) {
    var M = function (ra) {
        var ya = mathlib.CubieCube.faceMap[ra],
          Ba = 0;
        ya
          ? 0 == ya[0]
            ? ((ra = Z.ca[ya[1]]),
              (Ba =
                mathlib.CubieCube.cFacelet[ra & 7][
                  (3 - (ra >> 3) + ya[2]) % 3
                ]))
            : 1 == ya[0] &&
              ((ra = Z.ea[ya[1]]),
              (Ba = mathlib.CubieCube.eFacelet[ra >> 1][(ra & 1) ^ ya[2]]))
          : (Ba = ra);
        return ~~(Ba / 9);
      },
      S = V[F[1]],
      Z = F[0];
    K = K || X;
    for (F = 0; F < K.length; F++)
      for (var fa = K[F], ea = M(S[fa[0]]), va = 1; va < fa.length; va++)
        if (M(S[fa[va]]) != ea) return 1;
    return 0;
  }
  function t(F, K) {
    if (F[0] instanceof mathlib.CubieCube) return N(F, K);
    var M = V[F[1]];
    F = F[0];
    K = K || X;
    for (var S = 0; S < K.length; S++)
      for (var Z = K[S], fa = F[M[Z[0]]], ea = 1; ea < Z.length; ea++)
        if (F[M[Z[ea]]] != fa) return 1;
    return 0;
  }
  function E(F) {
    return t(F, r)
      ? 9
      : t(F, v)
      ? 4 + t(F, H) + t(F, y) + t(F, A) + t(F, w)
      : t(F, I)
      ? 4
      : t(F, u)
      ? 3
      : t(F, z)
      ? 2
      : t(F)
      ? 1
      : 0;
  }
  function n(F) {
    return t(F, r)
      ? 7
      : t(F, v)
      ? 2 + t(F, H) + t(F, y) + t(F, A) + t(F, w)
      : t(F, u)
      ? 2
      : t(F)
      ? 1
      : 0;
  }
  function C(F) {
    return t(F, r) ? 4 : t(F, v) ? 3 : t(F, u) ? 2 : t(F) ? 1 : 0;
  }
  function c(F) {
    return t(F, r)
      ? 6
      : t(F, I)
      ? 1 + Math.max(1, t(F, H) + t(F, y) + t(F, A) + t(F, w))
      : t(F)
      ? 1
      : 0;
  }
  function k(F) {
    return t(F, v) ? 2 : t(F) ? 1 : 0;
  }
  function g(F) {
    return t(F, O) ? 4 : t(F, J) ? 3 : t(F, P) ? 2 : t(F) ? 1 : 0;
  }
  function f(F, K) {
    return F in Q ? t(K, Q[F][1]) : t(K);
  }
  function a(F, K, M) {
    for (var S = 99, Z = 0; Z < M; Z++) S = Math.min(S, K([F, Z]));
    return S;
  }
  function e(F) {
    var K = [0, 1, 2, 3, 4, 5];
    return $.map(F, function (M, S) {
      function Z(sa, ta) {
        0 == fa.length || ~~(fa.at(-1) / 3) != sa
          ? fa.push(3 * sa + ta)
          : ((ta = (ta + (fa.at(-1) % 3) + 1) % 4),
            3 == ta ? fa.pop() : fa.splice(-1, 1, 3 * sa + ta));
      }
      var fa = [];
      for (S = 0; S < M.length; S++) {
        var ea = K.indexOf("URFDLB".indexOf(M[S][0][0])),
          va = " 2'".indexOf(M[S][0][1]) % 3;
        if (S == M.length - 1 || 100 < M[S + 1][1] - M[S][1]) Z(ea, va);
        else {
          var ra = K.indexOf("URFDLB".indexOf(M[S + 1][0][0])),
            ya = " 2'".indexOf(M[S + 1][0][1]) % 3;
          if (ea != ra && ea % 3 == ra % 3 && 2 == va + ya) {
            ra = ea % 3;
            ea = (va - 1) * [1, 1, -1, -1, -1, 1][ea] + 1;
            Z(ra + 6, ea);
            for (va = 0; va < ea + 1; va++) {
              ya = [];
              for (var Ba = 0; 6 > Ba; Ba++) ya[Ba] = K[d[ra][Ba]];
              K = ya;
            }
            S++;
          } else Z(ea, va);
        }
      }
      return [
        [
          $.map(fa, function (sa) {
            return "URFDLBEMS".charAt(~~(sa / 3)) + " 2'".charAt(sa % 3);
          }).join(""),
          fa.length,
        ],
      ];
    });
  }
  function h(F, K, M) {
    for (var S = [], Z = 0; 24 > Z; Z++) 0 == t([F, Z], K) && S.push(Z);
    for (K = 0; K < M.length; K++)
      for (Z = 0; Z < S.length; Z++) if (0 == t([F, S[Z]], M[K])) return K;
    return -1;
  }
  function p(F) {
    switch (F) {
      case "cfop":
        return ["pll", "oll", "f2l", "cross"];
      case "fp":
        return ["op", "cf"];
      case "cf4op":
        return "pll oll f2l-4 f2l-3 f2l-2 f2l-1 cross".split(" ");
      case "roux":
        return ["l6e", "cmll", "sb", "fb"];
      case "cf4o2p2":
        return "pll cpll oll eoll f2l-4 f2l-3 f2l-2 f2l-1 cross".split(" ");
      case "cf3zb":
        return "zbll zbf2l f2l-3 f2l-2 f2l-1 cross".split(" ");
      case "n":
        return ["solve"];
    }
  }
  function q(F, K, M) {
    F = F || "";
    M &&
      (F =
        kernel.getProp(tools.isCurTrainScramble() ? "preScrT" : "preScr") +
        " " +
        F);
    M = [];
    F = F.split(" ");
    for (var S, Z, fa, ea = 0; ea < F.length; ea++)
      if (((S = L.exec(F[ea])), null != S))
        if (((fa = "FRUBLDfrubldzxySME".indexOf(S[2])), 14 < fa))
          (S = "2'".indexOf(S[5] || "X") + 2),
            (fa = [0, 4, 5][fa % 3]),
            M.push([K.indexOf("FRUBLD".charAt(fa)), 2, S]),
            M.push([K.indexOf("FRUBLD".charAt(fa)), 1, 4 - S]);
        else {
          Z = (S[1] || "").split("-");
          var va = ~~Z[1] || -1;
          Z =
            12 > fa
              ? ~~Z[0] || ~~S[4] || (("w" == S[3] || 5 < fa) && 2) || 1
              : -1;
          S = (12 > fa ? 1 : -1) * ("2'".indexOf(S[5] || "X") + 2);
          M.push([K.indexOf("FRUBLD".charAt(fa % 6)), Z, S, va]);
        }
    return M;
  }
  function m() {
    for (
      var F = kernel
          .getProp(tools.isCurTrainScramble() ? "preScrT" : "preScr", "")
          .split(" "),
        K = new mathlib.CubieCube(),
        M = 0;
      M < F.length;
      M++
    )
      K.selfMoveStr(F[M]);
    return K.ori || 0;
  }
  var r = b("----U--------R--R-----F--F--D-DDD-D-----L--L-----B--B-"),
    H = b("----U-------RR-RR-----FF-FF-DDDDD-D-----L--L-----B--B-"),
    y = b("----U--------R--R----FF-FF-DD-DDD-D-----LL-LL----B--B-"),
    A = b("----U--------RR-RR----F--F--D-DDD-DD----L--L----BB-BB-"),
    w = b("----U--------R--R-----F--F--D-DDDDD----LL-LL-----BB-BB"),
    v = b("----U-------RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB"),
    u = b("UUUUUUUUU---RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB"),
    I = b("-U-UUU-U----RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB"),
    z = b("UUUUUUUUUr-rRRRRRRf-fFFFFFFDDDDDDDDDl-lLLLLLLb-bBBBBBB"),
    O = b("---------------------F--F--D--D--D-----LLLLLL-----B--B"),
    J = b("------------RRRRRR---F-FF-FD-DD-DD-D---LLLLLL---B-BB-B"),
    P = b("U-U---U-Ur-rRRRRRRf-fF-FF-FD-DD-DD-Dl-lLLLLLLb-bB-BB-B"),
    W = b("---------------R-R------F-FD-D---D-D------L-L------B-B"),
    X = b(mathlib.SOLVED_FACELET),
    V = (function () {
      function F(va, ra) {
        for (var ya = [], Ba = 0; 54 > Ba; Ba++) ya[ra[Ba]] = va[Ba];
        return ya;
      }
      var K = mathlib.CubieCube.rotCube[3].toPerm();
      mathlib.circle(K, 13, 49, 40, 22);
      var M = mathlib.CubieCube.rotCube[15].toPerm();
      mathlib.circle(M, 4, 22, 31, 49);
      var S = mathlib.CubieCube.rotCube[17].toPerm();
      mathlib.circle(S, 4, 40, 31, 13);
      for (var Z = [], fa = [], ea = 0; 54 > ea; ea++) fa[ea] = ea;
      for (ea = 0; 24 > ea; ea++)
        (Z[ea] = fa.slice()),
          (fa = F(fa, ea & 1 ? M : S)),
          5 == ea % 6 && ((fa = F(fa, S)), (fa = F(fa, S))),
          11 == ea % 12 && ((fa = F(fa, K)), (fa = F(fa, K)));
      return Z;
    })(),
    Q = {
      cross: [6, r],
      f2l: [6, v],
      oll: [6, u],
      eoll: [6, I],
      cpll: [6, z],
      fb: [24, O],
      sb: [24, J],
      cmll: [24, P],
    },
    d = [
      [0, 2, 4, 3, 5, 1],
      [5, 1, 0, 2, 4, 3],
      [4, 0, 2, 1, 3, 5],
    ],
    l = (function () {
      var F = [];
      return function (K) {
        for (var M = F.length; 22 > M; M++) {
          var S =
            21 == M ? "UUUUUUUUUFFFRRRBBBLLL" : scramble_333.getPLLImage(M)[0];
          F.push(
            b(
              "012345678cdeRRRRRR9abFFFFFFDDDDDDDDDijkLLLLLLfghBBBBBB".replace(
                /[0-9a-z]/g,
                function (Z) {
                  return S[parseInt(Z, 36)].toLowerCase();
                }
              )
            )
          );
        }
        return h(K, u, F);
      };
    })(),
    D = (function () {
      var F = [];
      return function (K) {
        for (var M = F.length; 58 > M; M++) {
          var S = scramble_333.getOLLImage(M)[0].replace(/G/g, "-");
          F.push(
            b(
              "012345678cdeRRRRRR9abFFFFFFDDDDDDDDDijkLLLLLLfghBBBBBB".replace(
                /[0-9a-z]/g,
                function (Z) {
                  return S[parseInt(Z, 36)].toLowerCase();
                }
              )
            )
          );
        }
        return h(K, v, F);
      };
    })(),
    x = (function () {
      var F = [];
      return function (K) {
        for (var M = F.length; 43 > M; M++) {
          var S = scramble_333.getCOLLImage("D", M)[0].replace(/G/g, "-");
          F.push(
            b(
              "012345678cdeRRRRRR9abFFFFFFDDDDDDDDDijkLLLLLLfghBBBBBB".replace(
                /[0-9a-z]/g,
                function (Z) {
                  return S[parseInt(Z, 36)].toLowerCase();
                }
              )
            )
          );
        }
        return h(K, I, F);
      };
    })(),
    R = (function () {
      var F = [];
      return function (K) {
        for (var M = F.length; 493 > M; M++) {
          var S = scramble_333.getZBLLImage(M)[0].replace(/G/g, "-");
          F.push(
            b(
              "012345678cdeRRRRRR9abFFFFFFDDDDDDDDDijkLLLLLLfghBBBBBB".replace(
                /[0-9a-z]/g,
                function (Z) {
                  return S[parseInt(Z, 36)].toLowerCase();
                }
              )
            )
          );
        }
        return h(K, I, F);
      };
    })(),
    G = (function () {
      var F = [];
      return function (K) {
        for (var M = F.length; 40 > M; M++) {
          var S = scramble_222.getEGLLImage(M)[0].replace(/G/g, "-");
          F.push(
            b(
              "0-1---2-36-7---R-R4-5---F-FD-D---D-Da-b---L-L8-9---B-B".replace(
                /[0-9a-z]/g,
                function (Z) {
                  return S[parseInt(Z, 36)].toLowerCase();
                }
              )
            )
          );
        }
        return h(K, W, F);
      };
    })(),
    L =
      /^([\d]+(?:-\d+)?)?([FRUBLDfrubldzxySME])(?:([w])|&sup([\d]);)?([2'])?$/;
  return {
    getProgress: function (F, K) {
      switch (K) {
        case "cfop":
          return a(F, C, 6);
        case "fp":
          return a(F, k, 6);
        case "cf4op":
          return a(F, n, 6);
        case "roux":
          return a(F, g, 24);
        case "cf4o2p2":
          return a(F, E, 6);
        case "cf3zb":
          return a(F, c, 6);
        case "n":
          return a(F, t, 1);
      }
    },
    getStepNames: p,
    getStepCount: function (F) {
      return (F = p(F)) ? F.length : 0;
    },
    getStepProgress: function (F, K, M) {
      M || (M = F in Q ? Q[F][0] : 1);
      return a(K, f.bind(null, F), M);
    },
    getPrettyMoves: e,
    getPrettyReconstruction: function (F, K) {
      var M = "";
      F = e(F);
      K = p(K).reverse();
      for (var S = 0, Z = 0; Z < F.length; Z++)
        (S += F[Z][1]),
          (M +=
            F[Z][0].replace(/ /g, "") +
            (K[Z] ? " // " + K[Z] + " " + F[Z][1] + " move(s)" : "") +
            "\n");
      return { prettySolve: M, totalMoves: S };
    },
    moveSeq2str: function (F) {
      return $.map(F, function (K) {
        return K[0].trim() + "@" + K[1];
      }).join(" ");
    },
    getScrambledState: function (F, K) {
      var M = F[1];
      if (tools.isPuzzle("333", F)) {
        F = q(M, "URFDLB");
        M = new mathlib.CubieCube();
        for (
          var S = new mathlib.CubieCube(), Z = (M.ori = 0);
          Z < F.length;
          Z++
        ) {
          var fa = F[Z][0],
            ea = F[Z][2],
            va = 3 * fa + ea - 1;
          if (!(0 > va || 18 <= va)) {
            if (2 == F[Z][1]) {
              va = [3, 15, 17, 1, 11, 23][fa];
              for (var ra = 0; ra < ea; ra++)
                M.ori = mathlib.CubieCube.rotMult[va][M.ori];
              va =
                mathlib.CubieCube.rotMulM[M.ori][((fa + 3) % 6) * 3 + ea - 1];
            }
            mathlib.CubieCube.CubeMult(M, mathlib.CubieCube.moveCube[va], S);
            M.init(S.ca, S.ea);
          }
        }
        return K ? M.toFaceCube() : M;
      }
    },
    identStep: function (F, K) {
      switch (F) {
        case "PLL":
          return l(K);
        case "OLL":
          return D(K);
        case "COLL":
          return x(K);
        case "ZBLL":
          return R(K);
        case "C2CLL":
          return G(K);
      }
    },
    getIdentData: function (F) {
      var K = {
        PLL: [l, scramble_333.getPLLImage, 0, 21, 0],
        OLL: [D, scramble_333.getOLLImage, 1, 58, 1],
        COLL: [x, scramble_333.getCOLLImage.bind(null, "D"), 0, 40, 1],
        ZBLL: [R, scramble_333.getZBLLImage, 0, 493, 0],
        CLL: [G, scramble_222.getEGLLImage, 0, 40, 1],
      };
      return F ? K[F] : K;
    },
    parseScramble: q,
    getConjMoves: function (F, K, M) {
      if (!F) return F;
      void 0 === M && (M = m());
      K && (M = mathlib.CubieCube.rotMulI[0][M || 0]);
      return F.replace(/[URFDLB]/g, function (S) {
        return "URFDLB".charAt(
          mathlib.CubieCube.rotMulM[M][3 * "URFDLB".indexOf(S)] / 3
        );
      });
    },
    getPreConj: m,
  };
})();
var puzzleFactory = execMain(function () {
  function b(c, k) {
    this.twistyScene = c;
    this.twisty = k;
  }
  function N(c, k, g, f) {
    if (void 0 == window.twistyjs)
      (n = N.bind(null, c, k, g, f)),
        !t && document.createElement("canvas").getContext
          ? ((t = !0),
            $.getScript("js/twisty.js", function () {
              n && n();
            }))
          : f(void 0, !0);
    else {
      for (
        var a = /^q[2l]?$/.exec(c.style) ? "q" : "v", e = null, h = 0;
        h < C.length;
        h++
      )
        if (C[h][0] == g) {
          e = C[h];
          break;
        }
      if ((h = !e || e[1] != a))
        e ? (e[1] = a) : ((e = [g, a]), C.push(e)),
          (E =
            "q" == a
              ? new twistyjs.qcube.TwistyScene()
              : new twistyjs.TwistyScene()),
          (e[2] = new b(E, null)),
          g.empty().append(e[2].getDomElement()),
          e[2].addMoveListener(k);
      k = c.puzzle;
      c.type = k;
      k.startsWith("cube")
        ? ((c.type = "cube"),
          (c.faceColors = $.col2std(
            kernel.getProp("colcube"),
            [3, 4, 5, 0, 1, 2]
          )),
          (c.dimension = ~~k.slice(4) || 3),
          (c.stickerWidth = 1.7))
        : "skb" == k
        ? ((c.type = "skewb"),
          (c.faceColors = $.col2std(
            kernel.getProp("colskb"),
            [0, 5, 4, 2, 1, 3]
          )))
        : "mgm" == k || "prc" == k || "klm" == k || "giga" == k
        ? (c.faceColors = $.col2std(
            kernel.getProp("colmgm"),
            [0, 2, 1, 5, 4, 3, 11, 9, 8, 7, 6, 10]
          ))
        : "pyr" == k || "mpyr" == k
        ? (c.faceColors = $.col2std(kernel.getProp("colpyr"), [3, 1, 2, 0]))
        : "sq1" == k
        ? (c.faceColors = $.col2std(
            kernel.getProp("colsq1"),
            [0, 5, 4, 2, 1, 3]
          ))
        : "clk" == k
        ? (c.faceColors = $.col2std(kernel.getProp("colclk"), [1, 2, 0, 3, 4]))
        : "fto" == k
        ? (c.faceColors = $.col2std(
            kernel.getProp("colfto"),
            [0, 3, 1, 2, 6, 7, 5, 4]
          ))
        : /^heli(?:2x2|cv)?|crz3a|redi$/.exec(k)
        ? (c.faceColors = $.col2std(
            kernel.getProp("colcube"),
            [3, 4, 5, 0, 1, 2]
          ))
        : /^ctico$/.exec(k) &&
          (c.faceColors = $.col2std(
            kernel.getProp("colico"),
            [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19,
            ]
          ));
      c.scale = 0.9;
      e[2].twistyScene.initializeTwisty(c);
      e[2].twisty = e[2].twistyScene.getTwisty();
      e[2].resize();
      f(e[2], h);
    }
  }
  var t = !1,
    E;
  b.prototype.keydown = function (c) {
    return this.twistyScene.keydown(c);
  };
  b.prototype.resize = function () {
    return this.twistyScene.resize();
  };
  b.prototype.addMoves = function (c) {
    return this.twistyScene.addMoves(c);
  };
  b.prototype.applyMoves = function (c) {
    return this.twistyScene.applyMoves(c);
  };
  b.prototype.addMoveListener = function (c) {
    return this.twistyScene.addMoveListener(c);
  };
  b.prototype.getDomElement = function () {
    return this.twistyScene.getDomElement();
  };
  b.prototype.isRotation = function (c) {
    return this.twisty.isInspectionLegalMove(this.twisty, c);
  };
  b.prototype.move2str = function (c) {
    return this.twisty.move2str(c);
  };
  b.prototype.moveInv = function (c) {
    return this.twisty.moveInv(c);
  };
  b.prototype.toggleColorVisible = function (c) {
    return this.twisty.toggleColorVisible(this.twisty, c);
  };
  b.prototype.isSolved = function (c) {
    return this.twisty.isSolved(this.twisty, c);
  };
  b.prototype.moveCnt = function (c) {
    return this.twisty.moveCnt(c);
  };
  b.prototype.parseScramble = function (c, k) {
    return this.twisty.parseScramble(c, k);
  };
  var n = null,
    C = [];
  return { twistyre: new RegExp("^(" + $.TWISTY_RE + ")$"), init: N };
});
var kernel = execMain(function () {
  function b(m, r) {
    DEBUG && console.log("[signal]", m, r);
    if (void 0 != k[m])
      for (var H in k[m])
        if (void 0 === k[m][H][1] || k[m][H][1].exec(r[0])) k[m][H][0](m, r);
  }
  function N(m, r, H, y) {
    void 0 == k[r] && (k[r] = {});
    k[r][m] = [H, y];
  }
  function t(m, r) {
    if (0 > m) return "DNF";
    var H = f("useMilli");
    m = Math.floor(m / (H ? 1 : 10));
    var y = m % (H ? 1e3 : 100);
    m = Math.floor(m / (H ? 1e3 : 100));
    var A = f("timeFormat"),
      w = 0,
      v = 0;
    "h" == A
      ? ((A = m % 60),
        (w = Math.floor(m / 60) % 60),
        (v = Math.floor(m / 3600)))
      : "m" == A
      ? ((A = m % 60), (w = Math.floor(m / 60)))
      : (A = m);
    m = (r = r && f("smallADP")) ? ["</span>"] : [];
    m.push(y);
    10 > y && m.push("0");
    100 > y && H && m.push("0");
    m.push(A + "." + (r ? '<span style="font-size:0.75em;">' : ""));
    10 > A && 0 < w + v && m.push("0");
    0 < w + v && m.push(w + ":");
    10 > w && 0 < v && m.push("0");
    0 < v && m.push(v + ":");
    return m.reverse().join("");
  }
  function E(m) {
    if (0 >= m) return m;
    var r = f("useMilli") ? 1 : 10;
    return Math.round(m / r) * r;
  }
  function n() {
    timer.refocus();
  }
  $.ajaxSetup({ cache: !0 });
  var C = $("<div />").css("visibility", "hidden"),
    c = $('<div id="wndctn" />'),
    k = {},
    g = (function () {
      function m() {
        var F = $(this).data("module");
        r(F);
        H(F);
      }
      function r(F) {
        if (!X[F][0].hasClass("enable")) {
          for (var K in X) X[K][0].removeClass("enable");
          X[F][0].addClass("enable");
          R = F;
        }
      }
      function H(F) {
        setTimeout(function () {
          Q.scrollTop(F ? Q.scrollTop() + X[F][1].position().top - 3 : G);
        }, 0);
      }
      function y() {
        G = Q.scrollTop();
        var F = "kernel",
          K;
        for (K in X) 50 < X[K][1].position().top || (F = K);
        r(F);
      }
      function A(F) {
        F = $(this);
        var K = F.prop("name");
        if (F.is(".opthelp"))
          " [?] " == F.html()
            ? F.html(
                "<br> [?] " +
                  $('strong[data="opt_' + F.attr("data") + '"]')
                    .parent()
                    .html()
                    .split("</strong>. ")[1]
              )
            : F.html(" [?] ");
        else if (F.is("select")) I(K, F.val());
        else
          switch (F.prop("type")) {
            case "checkbox":
              I(K, F.prop("checked"));
              break;
            case "color":
              if (F.attr("data")) {
                var M = 4 * ~~F.attr("data") - 4,
                  S = u(K);
                I(
                  K,
                  [S.slice(0, M), $.nearColor(F.val()), S.slice(M + 4)].join("")
                );
              } else I(K, F.val());
              break;
            case "text":
            case "button":
              for (M in W)
                if (K in W[M]) {
                  M = W[M][K];
                  S = u(K);
                  switch (F.val()) {
                    case "+":
                      S = Math.min(S + 1, M[3][2]);
                      break;
                    case "-":
                      S = Math.max(S - 1, M[3][1]);
                      break;
                    default:
                      F.val().match(/^\d+$/) &&
                        ((S = +F.val().match(/^0*(.+)$/)[1]),
                        (S = Math.max(Math.min(S, M[3][2]), M[3][1])));
                  }
                  M[0].val(S);
                  I(K, S);
                  break;
                }
          }
      }
      function w() {
        X = {};
        D.empty();
        d.empty();
        Q.unbind("scroll").scroll(y);
        for (var F in MODULE_NAMES) {
          0 === R && (R = F);
          var K = (X[F] = [$("<div>"), $("<tr>")]);
          K[0]
            .html(
              '<span class="icon" style="font-size:1em;">' +
                L[F] +
                "</span><span>" +
                MODULE_NAMES[F] +
                "</span>"
            )
            .addClass("tab")
            .data("module", F)
            .click(m)
            .appendTo(D);
          K[1].append(
            $("<th>").html(
              '<span class="icon">' +
                L[F] +
                "</span> " +
                MODULE_NAMES[F].replace(/-?<br>-?/g, "")
            ),
            $('<th class="sr">').html(PROPERTY_SR),
            $('<th class="sr">').html('<span class="icon"></span>')
          );
          d.append(K[1]);
          for (var M in W[F]) {
            K = W[F][M];
            var S = u(M),
              Z = K[1],
              fa = u("sr_" + M),
              ea = $('<td class="sr">');
            K[4] & 1 &&
              ea.append(
                $(
                  '<input type="checkbox" name="sr_' +
                    M +
                    '"' +
                    (fa ? " checked" : "") +
                    ">"
                ).click(A)
              );
            fa = $("<td colspan=2>");
            if (0 > Z)
              if ($.urlParam("debug")) Z = ~Z;
              else continue;
            if (0 == Z)
              (K[0] = $('<input type="checkbox" name="' + M + '">')
                .prop("checked", S)
                .click(A)),
                fa.append($("<label>").append(K[0], K[2]));
            else if (1 == Z) {
              K[0] = $('<select name="' + M + '">');
              var va = K[3][1],
                ra = K[3][2];
              for (Z = 0; Z < va.length; Z++)
                K[0].append($("<option />").val(va[Z]).html(ra[Z]));
              K[0].val(S);
              K[0].change(A);
              fa.append(K[2], ": ", K[0]);
            } else if (2 == Z)
              (K[0] = $('<input type="text" maxlength="4" name="' + M + '">')
                .val(S)
                .change(A)),
                (S = $(
                  '<input type="button" style="width: 1.5em;" value="+" name="' +
                    M +
                    '">'
                ).click(A)),
                (Z = $(
                  '<input type="button" style="width: 1.5em;" value="-" name="' +
                    M +
                    '">'
                ).click(A)),
                fa.append(
                  K[2] + "(" + K[3][1] + "~" + K[3][2] + ")",
                  $("<span>").css("white-space", "nowrap").append(Z, K[0], S)
                );
            else if (3 == Z)
              (K[0] = $('<input type="color" name="' + M + '">')
                .val(S)
                .change(A)),
                fa.append(K[2], ": ", K[0]);
            else if (4 == Z) {
              va = S.match(/#[0-9a-fA-F]{3}/g) || [];
              K[0] = $(
                '<input type="text" name="' + M + '" style="display:none">'
              ).val(S);
              S = [];
              for (Z = 0; Z < va.length; Z++)
                S.push(
                  $(
                    '<input type="color" name="' +
                      M +
                      '" data="' +
                      (Z + 1) +
                      '" class="mulcolor">'
                  )
                    .val($.nearColor(va[Z], 0, !0))
                    .change(A)
                );
              fa.append(K[2], ": ", K[0], S);
            } else
              5 == Z &&
                ($.urlParam("debug")
                  ? ((K[0] = $(
                      '<input type="text" name="' + M + '" readonly>'
                    ).val(S)),
                    fa.append(K[2] + " (" + M + "): ", K[0]))
                  : ((K[0] = $(
                      '<input type="text" name="' +
                        M +
                        '" style="display:none">'
                    ).val(S)),
                    fa.append(K[2], K[0])));
            0 < $('strong[data="opt_' + M + '"]').length &&
              fa.append(
                $('<span class="click opthelp" data="' + M + '"/>')
                  .html(" [?] ")
                  .click(A)
              );
            d.append($("<tr>").append(fa, ea));
          }
        }
        d.append($('<tr style="height: 10em;">'));
        X[R][0].click();
      }
      function v() {
        V && (w(), (V = !1));
        $(".opthelp").html(" [?] ");
        H();
        h.showDialog(
          [
            l,
            $.noop,
            void 0,
            $.noop,
            [
              RESET_LANG,
              function () {
                for (var F in P) {
                  var K = P[F];
                  void 0 === K ||
                    u(F) === K ||
                    F.startsWith("session") ||
                    (delete J[F], b("property", [F, K, "reset"]));
                }
                w();
                return !1;
              },
            ],
            [
              BUTTON_EXPORT.replace(/-?<br>-?/g, ""),
              exportFunc.exportProperties,
            ],
          ],
          "option",
          BUTTON_OPTIONS.replace(/-?<br>-?/g, ""),
          function () {
            x.find('select[name="lang"]').focus().blur();
            H();
          }
        );
      }
      function u(F, K) {
        void 0 != K &&
          void 0 == P[F] &&
          ((P[F] = K), b("property", [F, u(F), "set"]));
        J[F] === P[F] && delete J[F];
        return F in J ? J[F] : P[F];
      }
      function I(F, K, M) {
        for (var S in W)
          if (F in W[S] && void 0 !== W[S][F][0] && W[S][F][0].val() != K) {
            W[S][F][0].val(K);
            break;
          }
        u(F) !== K && ((J[F] = K), b("property", [F, u(F), M || "modify"]));
      }
      function z() {
        localStorage.properties = JSON.stringify(J);
      }
      function O() {
        var F = localStorage.properties;
        void 0 != F && "" != F && (J = JSON.parse(F));
      }
      var J = {},
        P = {},
        W = {},
        X = {},
        V = !0,
        Q = $('<div class="noScrollBar">'),
        d = $('<table class="opttable">'),
        l = $('<table class="options" />'),
        D = $("<td />"),
        x = $("<td />").addClass("tabValue");
      l.append($("<tr />").append(D, x.append(Q.append(d))));
      var R = 0,
        G = 0,
        L = {
          kernel: "",
          ui: "",
          color: "",
          timer: "",
          scramble: "",
          stats: "",
          tools: "",
          vrc: "",
        };
      $(function () {
        O();
        h.addButton("property", BUTTON_OPTIONS, v, 1);
        N("property", "property", z);
      });
      return {
        get: u,
        set: I,
        reg: function (F, K, M, S, Z, fa) {
          V = !0;
          void 0 == W[F] && (W[F] = {});
          W[F][K] = [void 0, M, S, Z, fa];
          P[K] = Z[0];
          P["sr_" + K] = 2 == (fa & 2);
          b("property", [K, u(K), "set"]);
        },
        getSProps: function () {
          var F = {},
            K;
          for (K in J)
            0 != K.indexOf("sr_") && u("sr_" + K, !1) && (F[K] = u(K));
          return F;
        },
        setSProps: function (F) {
          for (var K in P)
            0 != K.indexOf("sr_") &&
              u("sr_" + K, !1) &&
              (K in F ? I(K, F[K], "session") : I(K, P[K], "session"));
        },
        load: O,
        reload: w,
      };
    })(),
    f = g.get,
    a = g.set,
    e = g.reg;
  $(function () {
    var m = LANG_CUR || "en-us";
    e("kernel", "lang", 1, "Language", [
      m,
      (LANG_SET + "|h").split("|").slice(1),
      (LANG_STR + "|help translation").split("|"),
    ]);
    a("lang", m);
    e("kernel", "showad", 0, PROPERTY_SHOWAD, [!0]);
    N(
      "kernel",
      "property",
      function (H, y) {
        y[1] != m &&
          "modify" == y[2] &&
          ("h" == y[1]
            ? $.confirm(
                "Press OK to redirect to crowdin for translating cstimer"
              ) &&
              (window.location.href = "https://crowdin.com/project/cstimer")
            : (window.location.href = "?lang=" + y[1]),
          a("lang", m));
      },
      /^lang$/
    );
    if ($.urlParam("lang")) {
      var r = "lang=" + $.urlParam("lang");
      document.cookie = r + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      $.clearUrl("lang");
    }
  });
  var h = (function () {
      function m() {
        var na = $(this),
          U = na.data("module");
        Q[U].button
          ? (na.removeClass("enable"),
            (d && Q[U].auto) ||
              Q[U].div.stop(!0, !0).fadeOut(
                200,
                (function (ba) {
                  return function () {
                    b("button", [ba, !1]);
                  };
                })(U)
              ))
          : (na.addClass("enable"),
            b("button", [U, !0]),
            Q[U].div.stop(!0, !0).fadeIn(200),
            d && Q[U].auto && Q[U].div.hide());
        Q[U].button = !Q[U].button;
        a(U, Q[U].button);
      }
      function r() {
        var na = $(this).attr("data");
        a(na, !f(na, !1));
      }
      function H() {
        if (document.fullscreenElement)
          document.exitFullscreen && document.exitFullscreen();
        else {
          var na = $("body")[0];
          na.requestFullscreen && na.requestFullscreen();
        }
      }
      function y() {
        G.stop(!0, !0).fadeOut(100, function () {
          l || (F.children().appendTo(C), G.removeClass(), n());
        });
        b("dialog", null);
        D.hide();
        l = !1;
      }
      function A() {
        if (!d) {
          d = !0;
          v();
          for (var na in Q)
            Q[na].auto && Q[na].button && Q[na].div.stop(!0, !0).fadeOut(100);
          b("ashow", !1);
        }
      }
      function w() {
        if (d) {
          d = !1;
          v();
          for (var na in Q)
            Q[na].auto && Q[na].button && Q[na].div.stop(!0, !0).fadeIn(100);
          b("ashow", !0);
        }
      }
      function v(na) {
        var U = !1,
          ba;
        for (ba in Q)
          if (Q[ba].button) {
            U = !0;
            break;
          }
        (U && !d) || na || $.fx.off
          ? x.stop(!0, !0).fadeTo(200, 1)
          : x.stop(!0, !0).fadeTo(200, 0.01);
      }
      function u(na) {
        for (var U = 0; 7 > U; U++) ya[U] = $.nearColor(na.substr(4 * U, 4));
        a("col-font", $.nearColor(ya[0], 0, !0));
        a("col-back", $.nearColor(ya[1], 0, !0));
        a("col-board", $.nearColor(ya[2], 0, !0));
        a("col-button", $.nearColor(ya[3], 0, !0));
        a("col-link", $.nearColor(ya[4], 0, !0));
        a("col-logo", $.nearColor(ya[5], 0, !0));
        a("col-logoback", $.nearColor(ya[6], 0, !0));
        I();
      }
      function I() {
        for (
          var na =
              "ns" == f("uidesign") || "mtns" == f("uidesign") ? va[1] : va[0],
            U = "#000" == $.nearColor(ya[0]) ? -1 : 1,
            ba = 0;
          ba < Ba.length;
          ba++
        ) {
          var la = $.nearColor(ya[Ba[ba] & 15], ((Ba[ba] << 20) >> 24) * U);
          11 == ba && (la += "4");
          na = na.replace("?", la);
        }
        ea[0].styleSheet
          ? (ea[0].styleSheet.cssText = na)
          : (ea[0].innerHTML = na);
      }
      function z(na) {
        return (na = /^\s*((#[0-9a-fA-F]{3}){7})\s*$/.exec(na))
          ? (u(na[1]), !0)
          : !1;
      }
      function O() {
        return ya.join("");
      }
      function J() {
        $("html").removeClass("mtds cspt");
        "mt" == f("uidesign") || "mtns" == f("uidesign")
          ? $("html").addClass("mtds")
          : "cspt" == f("uidesign") && $("html").addClass("cspt");
      }
      function P() {
        var na = $(window).width(),
          U = $(window).height(),
          ba = f("view");
        (ta = "m" == ba ? !0 : "d" == ba ? !1 : 1.2 > na / U)
          ? $("html").addClass("m")
          : $("html").removeClass("m");
      }
      function W(na, U) {
        if ("property" == na)
          switch (U[0]) {
            case "color":
              "u" != U[1] &&
                ("i" == U[1] || "e" == U[1]
                  ? ((U = O()),
                    (na = prompt(EXPORT_CODEPROMPT, U)) &&
                      na != U &&
                      !z(na) &&
                      $.alert(COLOR_FAIL),
                    g.set("color", "u"))
                  : u(
                      ra["r" == U[1] ? ~~(Math.random() * ra.length) : U[1] - 1]
                    ));
              break;
            case "font":
              "r" == U[1]
                ? $("#container, #multiphase").css(
                    "font-family",
                    ["lcd", "lcd2", "lcd3", "lcd4", "lcd5"][
                      ~~(5 * Math.random())
                    ]
                  )
                : $("#container, #multiphase").css("font-family", U[1]);
              break;
            case "col-font":
            case "col-back":
            case "col-board":
            case "col-button":
            case "col-link":
            case "col-logo":
            case "col-logoback":
              na = sa.indexOf(U[0].substring(4, U[0].length));
              U = U[1];
              U = $.nearColor(U);
              ya[na] != U && ((ya[na] = U), a("color", "u"), I());
              break;
            case "zoom":
              $("html")
                .removeClass("p70 p80 p90 p100 p110 p125 p150")
                .addClass("p" + ~~(100 * U[1])),
                $(window).trigger("resize"),
                J();
            case "view":
              P();
              break;
            case "uidesign":
              J();
              I();
              break;
            case "wndScr":
              X("scramble", "f" == U[1]);
              break;
            case "wndStat":
              X("stats", "f" == U[1]);
              break;
            case "wndTool":
              X("tools", "f" == U[1]);
          }
      }
      function X(na, U) {
        Q[na]
          ? U
            ? Q[na].div.addClass("fixed")
            : Q[na].div.removeClass("fixed")
          : $(X.bind(void 0, na, U));
      }
      function V() {
        z(window.location.hash) && (g.set("color", "u"), $.clearHash());
      }
      var Q = {},
        d = !1,
        l = !1,
        D,
        x,
        R = { scramble: "scrHide", tools: "toolHide", stats: "statHide" },
        G = $('<div class="dialog">'),
        L = $('<div class="title">'),
        F = $('<div class="value">'),
        K = $('<div class="button">'),
        M = $('<input type="button" class="buttonOK">').val(OK_LANG),
        S = $('<input type="button" class="buttonOK">').val(CANCEL_LANG);
      G.append(
        $("<table>").append(
          $('<tr style="height:0%;">').append($("<td>").append(L)),
          $('<tr style="height:100%;">').append(
            $('<td style="position:relative;">').append(F)
          ),
          $('<tr style="height:0%;">').append($("<td>").append(K))
        )
      );
      var Z = $(
          '<span style="position:absolute;left:0.5em" class="click">&nbsp;⇱&nbsp;</span>'
        ),
        fa = $('<span style="float:left;" class="click">&nbsp;↻&nbsp;</span>'),
        ea = $("<style>").appendTo("head"),
        va =
          "html,body,textarea,#leftbar{color:?;background-color:?}.smrtScrCur{color:?;background-color:?}#leftbar{border-color:?}#logo,#astouch>span{color:?;border-color:?;background-color:?}.mybutton,.tab,.cntbar{border-color:?}html:not(.m) .mybutton:hover,.mybutton:active,.tab:active,.mywindow,.popup,.dialog{background-color:?}.mybutton.enable,.tab.enable,.cntbar,.selected,table.opttable tr th:first-child,div.helptable h2,div.helptable h3,.sflt div.sgrp{background-color:?}#gray{background-color:?}html:not(.m) .times:hover,html:not(.m) .click:hover,.times:active,.click:active,textarea{background-color:?}.click,.linkb .times.pb{color:?}.mywindow,.popup,.dialog,.table,.table td,.table th,textarea,.tabValue,.opttable td.sr,.sflt .bimg{border-color:?}html:not(.m) #avgstr .click:hover,#avgstr .click:active{background-color:?}select,input[type='button'],input[type='text']{color:?;background:?;border-color:?}input:disabled,table.opttable tr:nth-child(odd) td:first-child,div.helptable li:nth-child(odd){background:?}.mywindow::before,.popup,.dialog,#leftbar::before";
      va = [va + "{box-shadow:0 0 .6em ?}", va + "{box-shadow:none}"];
      var ra =
          "#000#efc#fdd#fbb#00f#ff0#000 #000#ffe#ff9#ff0#00f#fa0#000 #fff#600#668#408#ccf#0ff#000 #fff#000#555#888#aaa#000#aaa #000#fff#ccc#ddd#555#fff#888 #fff#227#9c3#563#580#dad#000 #9aa#023#034#b80#28d#678#034 #678#ffe#eed#ffe#28d#678#eed".split(
            " "
          ),
        ya = "#000 #efc #fdd #fbb #dbb #ff0 #000".split(" "),
        Ba = [
          0, 1, 2, 0, 545, 5, 549, 6, 546, 2, 3, 0, 546, 4, 546, 545, 0, 3826,
          546, 274, 0,
        ],
        sa = "font back board button link logo logoback".split(" "),
        ta = !1;
      $(function () {
        D = $("#gray");
        N(
          "ui",
          "property",
          W,
          /^(?:color|font|col-.+|zoom|view|uidesign|wnd(?:Scr|Stat|Tool))/
        );
        e(
          "ui",
          "zoom",
          1,
          ZOOM_LANG,
          [
            "1",
            "0.7 0.8 0.9 1 1.1 1.25 1.5".split(" "),
            "70% 80% 90% 100% 110% 125% 150%".split(" "),
          ],
          1
        );
        e("ui", "font", 1, PROPERTY_FONT, [
          "lcd",
          "r Arial lcd lcd2 lcd3 lcd4 lcd5 Roboto".split(" "),
          PROPERTY_FONT_STR.split("|").concat("Roboto"),
        ]);
        e("kernel", "ahide", 0, PROPERTY_AHIDE, [!0], 1);
        e("ui", "uidesign", 1, PROPERTY_UIDESIGN, [
          "n",
          ["n", "mt", "ns", "mtns", "cspt"],
          PROPERTY_UIDESIGN_STR.split("|").concat("csTimer+"),
        ]);
        e("ui", "view", 1, PROPERTY_VIEW, [
          "a",
          ["a", "m", "d"],
          PROPERTY_VIEW_STR.split("|"),
        ]);
        e("color", "color", 1, PROPERTY_COLOR, [
          "1",
          "uer12345678".split(""),
          PROPERTY_COLOR_STR.split("|"),
        ]);
        var na = PROPERTY_COLORS.split("|");
        e("color", "col-font", 3, na[0], ["#000000"]);
        e("color", "col-back", 3, na[1], ["#eeffcc"]);
        e("color", "col-board", 3, na[2], ["#ffdddd"]);
        e("color", "col-button", 3, na[3], ["#ffbbbb"]);
        e("color", "col-link", 3, na[4], ["#0000ff"]);
        e("color", "col-logo", 3, na[5], ["#ffff00"]);
        e("color", "col-logoback", 3, na[6], ["#000000"]);
        e("color", "col-timer", 4, "Timer", ["#f00#0d0#dd0#080#f00"]);
        e("color", "colcube", 4, "Cube", ["#ff0#fa0#00f#fff#f00#0d0"]);
        e("color", "colpyr", 4, "Pyraminx", ["#0f0#f00#00f#ff0"]);
        e("color", "colskb", 4, "Skewb", ["#fff#00f#f00#ff0#0f0#f80"]);
        e("color", "colmgm", 4, "Megaminx", [
          "#fff#d00#060#81f#fc0#00b#ffb#8df#f83#7e0#f9f#999",
        ]);
        e("color", "colsq1", 4, "SQ1", ["#ff0#f80#0f0#fff#f00#00f"]);
        e("color", "colclk", 4, "Clock", ["#f00#37b#5cf#ff0#850"]);
        e("color", "col15p", 4, "15 Puzzle", ["#f99#9f9#99f#fff"]);
        e("color", "colfto", 4, "FTO", ["#fff#808#0d0#f00#00f#bbb#ff0#fa0"]);
        e("color", "colico", 4, "ICO", [
          "#fff#084#b36#a85#088#811#e71#b9b#05a#ed1#888#6a3#e8b#a52#6cb#c10#fa0#536#49c#ec9",
        ]);
        e("ui", "wndScr", 1, PROPERTY_WNDSCR, [
          "n",
          ["n", "f"],
          PROPERTY_WND_STR.split("|"),
        ]);
        e("ui", "wndStat", 1, PROPERTY_WNDSTAT, [
          "n",
          ["n", "f"],
          PROPERTY_WND_STR.split("|"),
        ]);
        e("ui", "wndTool", 1, PROPERTY_WNDTOOL, [
          "n",
          ["n", "f"],
          PROPERTY_WND_STR.split("|"),
        ]);
        x.appendTo(c)
          .mouseenter(function () {
            v(!0);
          })
          .mouseleave(function () {
            v();
          });
        setTimeout(v, 3e3);
        G.appendTo("body");
        $(window).resize(P);
        $(window).bind("hashchange", V);
        V();
        "https:" != location.protocol &&
          (document.title = "[UNSAFE] " + document.title);
        navigator.wakeLock &&
          navigator.wakeLock.request &&
          ((na = function () {
            "visible" == document.visibilityState &&
              navigator.wakeLock.request("screen").then(function (U) {
                DEBUG && console.log("[ui]", "Screen Wake Lock is active");
                U.addEventListener("release", function () {
                  DEBUG && console.log("[ui]", "Screen Wake Lock is released");
                });
              });
          }),
          na(),
          document.addEventListener("visibilitychange", na));
      });
      return {
        addWindow: function (na, U, ba, la, ka, Aa) {
          ba.appendTo(c);
          ba.addClass("mywindow");
          ba.append(
            $('<span class="chide" data="' + R[na] + '"></span>').click(r)
          );
          la = f(na, la);
          x = x || $("#leftbar");
          x.children(".c" + Aa)
            .addClass(la ? "enable" : "")
            .data("module", na)
            .click(m)
            .find("span:first")
            .html(U);
          Q[na] = { button: la, div: ba, auto: ka };
          la ? ba.show() : ba.hide();
          b("button", [na, la]);
        },
        addButton: function (na, U, ba, la) {
          x = x || $("#leftbar");
          x.children(".c" + la)
            .click(ba)
            .find("span:first")
            .html(U);
        },
        showDialog: function (na, U, ba, la) {
          l = !0;
          G.removeClass()
            .addClass("dialog")
            .addClass("dialog" + U);
          L.html(ba);
          "option" == U
            ? L.prepend(Z.unbind("click").click(H))
            : "logo" == U &&
              L.prepend(
                fa.unbind("click").click(function () {
                  location.reload(!0);
                })
              );
          F.children().appendTo(C);
          na[0].appendTo(F.empty());
          K.empty();
          void 0 != na[1] &&
            K.append(
              M.unbind("click").click(function () {
                $.waitUser.call();
                na[1] && na[1]();
                y();
              })
            );
          void 0 != na[2] &&
            K.append(
              S.unbind("click").click(function () {
                $.waitUser.call();
                na[2] && na[2]();
                y();
              })
            );
          D.unbind("click");
          void 0 != na[3] &&
            D.click(function () {
              $.waitUser.call();
              na[3] && na[3]();
              y();
            });
          for (ba = 4; ba < na.length; ba++)
            K.append(
              $('<input type="button" class="buttonOK">')
                .val(na[ba][0])
                .unbind("click")
                .click(
                  (function (ka) {
                    return function () {
                      $.waitUser.call();
                      ka() && y();
                    };
                  })(na[ba][1])
                )
            );
          G.stop(!0, !0).fadeTo(100, 0.98, function () {
            na[0].focus();
            la && la();
          });
          D.stop(!0, !0).fadeIn(
            100,
            function (ka) {
              b("dialog", ka);
            }.bind(null, U)
          );
        },
        hideDialog: y,
        isDialogShown: function (na) {
          return G.hasClass("dialog" + na);
        },
        exportColor: O,
        setAutoShow: function (na) {
          (na = na || !f("ahide")) ? w() : A();
          timer.showAvgDiv(na);
        },
        hide: A,
        show: w,
        isPop: function () {
          return l;
        },
        toggleLeftBar: v,
      };
    })(),
    p = (function () {
      function m(y, A, w, v, u) {
        this.data = y;
        this.callback = A;
        this.select1 = w;
        this.select2 = v;
        this.reset(u);
      }
      function r(y, A, w) {
        for (var v = 0; v < y.length; v++)
          if ($.isArray(y[v][1]))
            for (var u = 0; u < y[v][1].length; u++) {
              if (y[v][1][u][1] == A) {
                w(v, u);
                return;
              }
            }
          else if (y[v][1] == A) {
            w(v, null);
            break;
          }
      }
      var H = m.prototype;
      H.loadSelect2 = function (y) {
        n();
        y = y || 0;
        var A = ~~this.select1.prop("selectedIndex");
        A = (this.data[A] || [])[1];
        this.select2.empty();
        if ($.isArray(A)) {
          this.select1.addClass("twolv1");
          this.select2.show().addClass("twolv2");
          for (var w = 0; w < A.length; w++)
            this.select2.append($("<option>").html(A[w][0]).val(A[w][1]));
          this.select2.prop("selectedIndex", y);
        } else
          this.select1.removeClass("twolv1"),
            this.select2.hide().removeClass("twolv2");
        this.onSelect2Change();
      };
      H.onSelect1Change = function () {
        this.loadSelect2();
      };
      H.onSelect2Change = function () {
        this.callback && this.callback(this.getSelected());
      };
      H.getSelIdx = function () {
        var y = ~~this.select1.prop("selectedIndex");
        if (!$.isArray((this.data[y] || [])[1])) return [y];
        var A = ~~this.select2.prop("selectedIndex");
        return [y, A];
      };
      H.getSelected = function () {
        var y = this.getSelIdx(),
          A = (this.data[y[0]] || [])[1];
        return 1 == y.length ? A : ((A && A[y[1]]) || [])[1];
      };
      H.reset = function (y) {
        y = y || this.getSelected();
        this.select1.empty();
        for (var A = 0; A < this.data.length; A++)
          this.select1.append(
            $("<option>")
              .html(this.data[A][0])
              .val($.isArray(this.data[A][1]) ? A : this.data[A][1])
              .attr("disabled", /===/.exec(this.data[A][0]) ? !0 : !1)
          );
        this.select1.unbind("change").change(this.onSelect1Change.bind(this));
        this.select2.unbind("change").change(this.onSelect2Change.bind(this));
        y && this.loadVal(y);
      };
      H.loadVal = function (y) {
        var A = this,
          w = this.callback;
        this.callback = null;
        r(this.data, y, function (v, u) {
          A.select1.prop("selectedIndex", v);
          A.loadSelect2(u);
        });
        this.callback = w;
      };
      H.getValName = function (y) {
        var A = this,
          w = null;
        r(this.data, y, function (v, u) {
          w = A.data[v][0];
          null != u && (w += ">" + A.data[v][1][u][0]);
        });
        return w;
      };
      H.getValIdx = function (y) {
        var A = null;
        r(this.data, y, function (w, v) {
          A = 100 * w + (null == v ? v : 99);
        });
        return A;
      };
      return m;
    })();
  (function () {
    function m(u, I) {
      "bgImgO" == I[0]
        ? y.stop(!0, !0).fadeTo(0, I[1] / 100)
        : "bgImgS" == I[0] &&
          ("n" == I[1]
            ? (y.hide(), (A = "n"))
            : (y.show(),
              "u" == I[1]
                ? "modify" == I[2]
                  ? ((u = prompt(BGIMAGE_URL, r)),
                    w.exec(u) && 2048 > u.length
                      ? ((r = u), y.attr("src", r), a("bgImgSrc", r))
                      : ($.alert(BGIMAGE_INVALID), a("bgImgS", A), g.reload()))
                  : ((r = f("bgImgSrc", r)), y.attr("src", r))
                : "f" == I[1]
                ? (storage.getKey("bgImgFile").then(function (z) {
                    z
                      ? y.attr("src", URL.createObjectURL(z))
                      : "modify" != I[2] && (a("bgImgS", "n"), g.reload());
                  }),
                  "modify" == I[2] &&
                    (v.unbind("change").change(function () {
                      if (v[0].files.length) {
                        var z = v[0].files[0];
                        y.attr("src", URL.createObjectURL(z));
                        storage.setKey("bgImgFile", z);
                      }
                    }),
                    v.click()))
                : ((A = I[1]), y.attr("src", H[I[1]]))));
    }
    var r = "",
      H = [
        "https://i.imgur.com/X7Xi7D1.png",
        "https://i.imgur.com/K4zbMsu.png",
        "https://i.imgur.com/Fsh6MaM.png",
      ],
      y,
      A = 0,
      w =
        /^((http|https|ftp):\/\/)?(\w(:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i,
      v = $('<input type="file" id="imgfile" accept="image/*"/>');
    $(function () {
      y = $("#bgImage");
      N("bgImage", "property", m, /^bgImg[OS]$/);
      e("ui", "bgImgO", 2, BGIMAGE_OPACITY, [25, 0, 100]);
      e("ui", "bgImgS", 1, BGIMAGE_IMAGE, [
        "n",
        ["n", "u", 0, 1, 2, "f"],
        BGIMAGE_IMAGE_STR.split("|").slice(0, -1).concat(1, 2, 3, "upload"),
      ]);
    });
  })();
  var q = !0;
  $(function () {
    e("kernel", "useMilli", 0, PROPERTY_USEMILLI, [!1], 1);
    e(
      "kernel",
      "timeFormat",
      1,
      PROPERTY_FORMAT,
      ["h", ["h", "m", "s"], ["hh:mm:ss.XX(X)", "mm:ss.XX(X)", "ss.XX(X)"]],
      1
    );
    C.appendTo("body");
    c.appendTo("body");
    $(document).keydown(function (r) {
      $.waitUser.call();
      q = !0;
      b("keydown", r);
      timer.onkeydown(r);
      return q;
    });
    $(document).keyup(function (r) {
      q = !0;
      b("keyup", r);
      timer.onkeyup(r);
      return q;
    });
    $("#container").bind("touchstart", function (r) {
      $.waitUser.call();
      $(r.target).is(".click") ||
        (shortcuts.onTouchStart(r),
        n(),
        timer.onkeydown({ which: 32 }),
        r.preventDefault && r.preventDefault());
    });
    $("#container").bind("touchmove", function (r) {
      shortcuts.onTouchMove(r);
    });
    $("#container").bind("touchend", function (r) {
      shortcuts.onTouchEnd(r);
      $(r.target).is(".click") ||
        (n(),
        timer.onkeyup({ which: 32 }),
        r.preventDefault && r.preventDefault());
    });
    $("#container").bind("touch", function (r) {
      $(r.target).is(".click") || (r.preventDefault && r.preventDefault());
    });
    $("#touch").remove();
    var m = !1;
    $("#container").mousedown(function (r) {
      $.waitUser.call();
      !$(r.target).is(".click") &&
        1 == r.which &&
        f("useMouse") &&
        ((m = !0),
        shortcuts.onTouchStart(r),
        timer.onkeydown({ which: 32 }),
        r.preventDefault && r.preventDefault());
    });
    $("body").mousemove(function (r) {
      if (1 == r.which && m && f("useMouse")) shortcuts.onTouchMove(r);
    });
    $("body").mouseup(function (r) {
      1 == r.which &&
        m &&
        f("useMouse") &&
        (shortcuts.onTouchEnd(r),
        timer.onkeyup({ which: 32 }),
        r.preventDefault && r.preventDefault(),
        (m = !1));
    });
    try {
      document.cookie =
        "fp=" +
        $.fingerprint() +
        "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    } catch (r) {}
  });
  $(function () {
    for (
      var m = "properties cachedScr devData wcaData gglData locData".split(" "),
        r = 0;
      r < m.length;
      r++
    )
      try {
        JSON.parse(localStorage[m[r]] || "{}");
      } catch (A) {
        delete localStorage[m[r]];
      }
    var H = [];
    for (r = 1; r <= ~~f("sessionN", 15); r++) m.push("session" + r);
    for (r = 0; r < localStorage.length; r++) {
      var y = localStorage.key(r);
      -1 == m.indexOf(y) && H.push(y);
    }
    for (r = 0; r < H.length; r++) delete localStorage[H[r]];
  });
  return {
    pretty: t,
    getProp: f,
    setProp: a,
    regProp: e,
    getSProps: g.getSProps,
    setSProps: g.setSProps,
    regListener: N,
    addWindow: h.addWindow,
    addButton: h.addButton,
    pushSignal: b,
    showDialog: h.showDialog,
    hideDialog: h.hideDialog,
    isDialogShown: h.isDialogShown,
    exportColor: h.exportColor,
    clrKey: function () {
      q = !1;
    },
    temp: C,
    reprop: g.reload,
    loadProp: g.load,
    blur: n,
    ui: h,
    TwoLvMenu: p,
    pround: function (m, r) {
      return t(E(m), r);
    },
    round: E,
  };
});
var exportFunc = execMain(function () {
  function b() {
    return storage.exportAll().then(function (ea) {
      ea.properties = mathlib.str2obj(localStorage.properties);
      S = JSON.stringify(ea);
    });
  }
  function N() {
    var ea = null;
    try {
      ea = JSON.parse(this.result);
    } catch (va) {
      logohint.push(LGHINT_INVALID);
      return;
    }
    t(ea);
  }
  function t(ea) {
    var va = 0,
      ra = 0,
      ya = 0;
    storage
      .exportAll()
      .then(function (Ba) {
        for (var sa = 1; sa <= ~~kernel.getProp("sessionN"); sa++) {
          var ta = mathlib.str2obj(Ba["session" + sa] || []),
            na = mathlib.str2obj(ea["session" + sa] || []);
          ta.length != na.length &&
            (va++,
            (ra += Math.max(na.length - ta.length, 0)),
            (ya += Math.max(ta.length - na.length, 0)));
        }
        return $.confirm(
          IMPORT_FINAL_CONFIRM.replace("%d", va)
            .replace("%a", ra)
            .replace("%r", ya)
        )
          ? Promise.resolve()
          : Promise.reject();
      })
      .then(function () {
        if ("properties" in ea) {
          var Ba = localStorage.devData || "{}",
            sa = localStorage.wcaData || "{}",
            ta = localStorage.gglData || "{}",
            na = localStorage.locData || "{}";
          localStorage.clear();
          localStorage.devData = Ba;
          localStorage.wcaData = sa;
          localStorage.gglData = ta;
          localStorage.locData = na;
          localStorage.properties = mathlib.obj2str(ea.properties);
          kernel.loadProp();
        }
        storage.importAll(ea).then(function () {
          location.reload();
        });
      }, $.noop);
  }
  function E(ea) {
    this.files.length && ea.readAsText(this.files[0], "UTF-8");
  }
  function n(ea) {
    return ea && /^[A-Za-z0-9]+$/.exec(ea);
  }
  function C(ea, va) {
    try {
      return JSON.parse(localStorage[ea])[va] || "";
    } catch (ra) {
      return "";
    }
  }
  function c(ea) {
    if (ea.target === d[0] || ea.target === Q[0])
      ea = C("wcaData", "cstimer_token");
    else {
      ea = $.prompt(EXPORT_USERID, C("locData", "id"));
      if (null == ea) return;
      localStorage.locData = JSON.stringify({
        id: ea,
        compid: C("locData", "compid"),
      });
      kernel.pushSignal("export", ["account", "locData"]);
    }
    if (n(ea)) return ea;
    $.alert(EXPORT_INVID);
  }
  function k(ea) {
    return storage
      .exportAll()
      .then(function (va) {
        var ra = {},
          ya = {};
        ya.properties = mathlib.str2obj(localStorage.properties);
        for (var Ba in va) {
          ya[Ba] = [];
          for (var sa = va[Ba], ta = 0; ta < sa.length; ta += 1e3) {
            var na = LZString.compressToEncodedURIComponent(
                JSON.stringify(sa.slice(ta, ta + 1e3))
              ),
              U = $.sha256(na);
            ra["slice" + U] = na;
            ya[Ba].push(U);
          }
        }
        void 0 != ea &&
          (ra[ea] = LZString.compressToEncodedURIComponent(JSON.stringify(ya)));
        return ra;
      })
      .catch(console.log);
  }
  function g(ea) {
    return k(ea).then(function (va) {
      var ra = [],
        ya;
      for (ya in va) ya != ea && ra.push(ya);
      return $.ppost(
        "https://cstimer.net/userdata2.php",
        { id: ea, exists: ra.join(",") },
        "json"
      )
        .then(function (Ba) {
          0 != Ba.retcode && Promise.reject();
          Ba = Ba.datas;
          var sa = [],
            ta = [],
            na;
          for (na in va)
            if (-1 == Ba.indexOf(na) || na == ea) sa.push(na), ta.push(va[na]);
          return $.ppost(
            "https://cstimer.net/userdata2.php",
            { id: ea, ids: sa.join(","), datas: ta.join(",") },
            "json"
          );
        })
        .then(function (Ba) {
          return 0 == Ba.retcode ? Promise.resolve() : Promise.reject();
        });
    });
  }
  function f(ea) {
    var va = c(ea);
    if (va) {
      var ra = $(ea.target),
        ya = ra.html();
      ra.html("...");
      g(va)
        .then(
          function () {
            $.alert(EXPORT_UPLOADED);
          },
          function () {
            $.alert(EXPORT_ERROR);
          }
        )
        .then(function () {
          ra.html(ya);
        });
    }
  }
  function a(ea) {
    var va = EXPORT_WHICH.replace("%d", ea.length),
      ra = EXPORT_WHICH_ITEM;
    va = [va];
    for (var ya = 0; ya < ea.length; ya++) {
      var Ba = ~~ea[ya].size;
      va.push(
        ya +
          1 +
          ". " +
          ra
            .replace(
              "%s",
              Math.max(0, ~~ea[ya].nsolv) ||
                (Ba ? Math.ceil(Ba / 1024) + " KB" : "N/A")
            )
            .replace("%t", new Date(ea[ya].modifiedTime).toLocaleString())
      );
    }
    return ~~$.prompt(va.join("\n"), "1");
  }
  function e(ea) {
    var va = c(ea);
    if (va) {
      var ra = $(ea.target),
        ya = ra.html();
      ra.html("Check File List...");
      var Ba = function (sa) {
        var ta = sa.retcode;
        if (404 == ta) return Promise.reject(EXPORT_NODATA);
        if (0 != ta) return Promise.reject("");
        ta = {};
        var na = {},
          U = Promise.resolve(na);
        try {
          ta = JSON.parse(LZString.decompressFromEncodedURIComponent(sa.data));
        } catch (Ha) {
          return DEBUG && console.log("[export] error", Ha), Promise.reject("");
        }
        var ba = [],
          la = [],
          ka;
        for (ka in ta)
          if (
            !ka.startsWith("session") ||
            0 == ta[ka].length ||
            $.isArray(ta[ka][0])
          )
            na[ka] = ta[ka];
          else {
            sa = [];
            na[ka] = sa;
            for (var Aa = 0; Aa < ta[ka].length; Aa++)
              ba.push("slice" + ta[ka][Aa]), la.push(sa);
          }
        if (0 < ba.length) {
          var Da = {};
          U = U.then(function () {
            return k();
          })
            .then(function (Ha) {
              Da = Ha;
              Ha = ba.filter(function (Ma) {
                return !(Ma in Da);
              });
              return 0 == Ha.length
                ? { retcode: 0, datas: {} }
                : $.ppost(
                    "https://cstimer.net/userdata2.php",
                    { id: va, ids: Ha.join(",") },
                    "json"
                  );
            })
            .then(function (Ha) {
              if (0 != Ha.retcode)
                return Promise.reject("retcode=" + Ha.retcode);
              var Ma = [],
                da;
              for (da in Ha.datas) Ma[ba.indexOf(da)] = Ha.datas[da];
              for (Ha = 0; Ha < ba.length; Ha++) {
                Ma[Ha] = Ma[Ha] || Da[ba[Ha]];
                if (void 0 == Ma[Ha])
                  return Promise.reject("error, incorrect data");
                Array.prototype.push.apply(
                  la[Ha],
                  JSON.parse(LZString.decompressFromEncodedURIComponent(Ma[Ha]))
                );
              }
              return na;
            });
        }
        return U.then(t);
      };
      ea = Promise.resolve({ data: 1 });
      kernel.getProp("expp") &&
        (ea = $.ppost(
          "https://cstimer.net/userdata2.php",
          { id: va, cnt: 1 },
          "json"
        ));
      return ea
        .then(function (sa) {
          var ta = ~~sa.data;
          if (0 == ta) return Promise.reject("No Data Found");
          var na = 1;
          if (
            kernel.getProp("expp") &&
            ((na = a(sa.files || mathlib.valuedArray(ta, {}))),
            0 >= na || na > ta)
          )
            return Promise.reject("Invalid input");
          ra.html("Import Data...");
          return $.ppost(
            "https://cstimer.net/userdata2.php",
            { id: va, offset: na - 1 },
            "json"
          ).then(Ba);
        })
        .catch(function (sa) {
          $.alert(EXPORT_ERROR + (sa ? ": " + sa : ""));
        })
        .then(function () {
          ra.html(ya);
        });
    }
  }
  function h() {
    var ea = C("gglData", "access_token");
    ea &&
      (x.html("Check File List..."),
      $.ajax(
        "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&orderBy=modifiedTime desc&q=name%3D%27cstimer.txt%27&fields=files%28id%2Csize%2CmodifiedTime%29",
        {
          type: "GET",
          beforeSend: function (va) {
            va.setRequestHeader("Authorization", "Bearer " + ea);
          },
        }
      )
        .success(function (va, ra, ya) {
          va = va.files;
          if (0 == va.length) return $.alert("No Data Found"), A();
          ra = 1;
          if (
            kernel.getProp("expp") &&
            ((ra = a(va)), 0 >= ra || ra > va.length)
          )
            return A();
          x.html("Import Data...");
          $.ajax(
            "https://www.googleapis.com/drive/v3/files/" +
              va[ra - 1].id +
              "?alt=media",
            {
              type: "GET",
              beforeSend: function (Ba) {
                Ba.setRequestHeader("Authorization", "Bearer " + ea);
              },
            }
          )
            .success(function (Ba) {
              try {
                Ba = JSON.parse(LZString.decompressFromEncodedURIComponent(Ba));
              } catch (sa) {
                return $.alert("No Valid Data Found"), A();
              }
              A();
              t(Ba);
            })
            .error(function () {
              $.alert(EXPORT_ERROR + "\nPlease Re-login");
              v();
            });
          for (ra = 10; ra < va.length; ra++)
            $.ajax("https://www.googleapis.com/drive/v3/files/" + va[ra].id, {
              type: "DELETE",
              beforeSend: function (Ba) {
                Ba.setRequestHeader("Authorization", "Bearer " + ea);
              },
            });
        })
        .error(function () {
          $.alert(EXPORT_ERROR + "\nPlease Re-login");
          v();
        }));
  }
  function p(ea) {
    ea = ea || C("gglData", "access_token");
    if (!ea) return Promise.reject("Invalid Account");
    R.html("Create File...");
    return new Promise(function (va, ra) {
      $.ajax(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
        {
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({
            parents: ["appDataFolder"],
            name: "cstimer.txt",
          }),
          beforeSend: function (ya) {
            ya.setRequestHeader("Authorization", "Bearer " + ea);
          },
        }
      )
        .success(function (ya, Ba, sa) {
          ya = sa.getResponseHeader("location");
          R.html("Uploading Data...");
          $.ajax(ya, {
            type: "PUT",
            contentType: "text/plain",
            data: LZString.compressToEncodedURIComponent(S),
          })
            .success(function (ta, na, U) {
              A();
              va();
            })
            .error(function (ta, na, U) {
              v();
              ra(EXPORT_ERROR);
            });
        })
        .error(function (ya, Ba, sa) {
          v();
          401 == ya.status ? ra("Timeout, Please Re-login") : ra(EXPORT_ERROR);
        });
    });
  }
  function q() {
    b().then(function () {
      if (window.Blob) {
        var ea = new Blob([S], { type: "text/plain" });
        F.attr("href", URL.createObjectURL(ea));
        F.attr(
          "download",
          "cstimer_" +
            mathlib.time2str(new Date() / 1e3, "%Y%M%D_%h%m%s") +
            ".txt"
        );
      }
      kernel.showDialog(
        [P, 0, void 0, 0, [EXPORT_ONLYOPT, r], [EXPORT_ACCOUNT, H]],
        "export",
        EXPORT_DATAEXPORT
      );
    });
    fa = 0;
  }
  function m(ea) {
    ea = LZString.compressToEncodedURIComponent(JSON.stringify(ea));
    var va = $.prompt(EXPORT_CODEPROMPT, ea);
    if (va && va != ea) {
      try {
        va = JSON.parse(LZString.decompressFromEncodedURIComponent(va));
      } catch (ra) {
        return;
      }
      return va;
    }
  }
  function r() {
    var ea = JSON.parse(localStorage.properties),
      va = {},
      ra;
    for (ra in ea) ra.startsWith("session") || (va[ra] = ea[ra]);
    va = m(va);
    if (!va) return !1;
    ea = JSON.parse(localStorage.properties);
    for (ra in ea) ra.startsWith("session") && (va[ra] = ea[ra]);
    localStorage.properties = mathlib.obj2str(va);
    location.reload();
    return !1;
  }
  function H() {
    var ea = {
        wcaData: localStorage.wcaData,
        gglData: localStorage.gglData,
        locData: localStorage.locData,
      },
      va = m(ea);
    if (!va) return !1;
    for (var ra in ea)
      va[ra] &&
        ((localStorage[ra] = va[ra]),
        kernel.pushSignal("export", ["account", ra]));
    location.reload();
    return !1;
  }
  function y() {
    var ea = JSON.parse(localStorage.wcaData || "{}");
    V.unbind("click");
    Q.unbind("click").removeClass("click");
    d.unbind("click").removeClass("click");
    ea.access_token
      ? ((ea = ea.wca_me),
        X.html("WCAID: " + ea.wca_id + "<br>Name: " + ea.name),
        V.click(w.bind(void 0, !0)).addClass("click"),
        Q.addClass("click").click(e),
        d.addClass("click").click(f))
      : (X.html(EXPORT_LOGINWCA),
        V.click(function () {
          location.href = O;
        }).addClass("click"));
  }
  function A() {
    var ea = JSON.parse(localStorage.gglData || "{}");
    D.unbind("click");
    x.unbind("click")
      .removeClass("click")
      .html(EXPORT_FROMSERV + " (Google)");
    R.unbind("click")
      .removeClass("click")
      .html(EXPORT_TOSERV + " (Google)");
    ea.access_token
      ? ((ea = ea.ggl_me),
        l.html("Name: " + ea.displayName + "<br>Email: " + ea.emailAddress),
        D.click(v.bind(void 0, !0)).addClass("click"),
        x.addClass("click").click(h),
        R.addClass("click").click(function () {
          p().then(
            function () {
              $.alert(EXPORT_UPLOADED);
            },
            function (va) {
              $.alert(va);
            }
          );
        }))
      : (l.html(EXPORT_LOGINGGL),
        D.click(function () {
          location.href = J;
        }).addClass("click"));
  }
  function w(ea) {
    if (!ea || $.confirm(EXPORT_LOGOUTCFM))
      delete localStorage.wcaData,
        kernel.pushSignal("export", ["account", "wcaData"]);
  }
  function v(ea) {
    if (!ea || $.confirm(EXPORT_LOGOUTCFM))
      delete localStorage.gglData,
        kernel.pushSignal("export", ["account", "gglData"]);
  }
  function u(ea, va) {
    "atexpa" == va[0]
      ? "id" == va[1]
        ? ((ea = C("locData", "id")),
          (n(ea) && "modify" != va[2]) ||
            ((ea = $.prompt(EXPORT_USERID, ea)),
            n(ea)
              ? ((localStorage.locData = JSON.stringify({
                  id: ea,
                  compid: C("locData", "compid"),
                })),
                kernel.pushSignal("export", ["account", "locData"]))
              : (null != ea && $.alert(EXPORT_INVID),
                kernel.setProp("atexpa", "a"))))
        : "wca" == va[1]
        ? n(C("wcaData", "cstimer_token")) ||
          ($.alert("Please Login with WCA Account in Export Panel First"),
          kernel.setProp("atexpa", "a"))
        : "ggl" != va[1] ||
          C("gglData", "access_token") ||
          ($.alert("Please Login with Google Account in Export Panel First"),
          kernel.setProp("atexpa", "a"))
      : "export" == ea &&
        ("wcaData" == va[1] ? y() : "gglData" == va[1] && A());
  }
  function I() {
    var ea = kernel.getProp("atexpa", "a");
    "n" != ea &&
      "a" != ea &&
      (b().then(function () {
        if ("id" == ea || "wca" == ea) {
          var va =
            "id" == ea ? C("locData", "id") : C("wcaData", "cstimer_token");
          n(va)
            ? g(va).then(
                function () {
                  logohint.push(LGHINT_AEXPSUC);
                },
                function () {
                  logohint.push(LGHINT_AEXPFAL);
                }
              )
            : (logohint.push(LGHINT_AEXPABT), kernel.setProp("atexpa", "a"));
        } else if ("f" == ea) {
          if (window.Blob) {
            va = new Blob([S], { type: "text/plain" });
            var ra = $('<a class="click"/>');
            ra.attr("href", URL.createObjectURL(va));
            ra.attr(
              "download",
              "cstimer_" +
                mathlib.time2str(new Date() / 1e3, "%Y%M%D_%h%m%s") +
                ".txt"
            );
            ra.appendTo("body");
            ra[0].click();
            ra.remove();
          }
        } else
          "ggl" == ea &&
            ((va = C("gglData", "access_token"))
              ? p(va).then(
                  function () {
                    logohint.push(LGHINT_AEXPSUC);
                  },
                  function () {
                    logohint.push(LGHINT_AEXPFAL);
                  }
                )
              : (logohint.push(LGHINT_AEXPABT), kernel.setProp("atexpa", "a")));
      }),
      (fa = Z = 0));
  }
  function z() {
    fa += 1;
    if (fa >= kernel.getProp("atexpi", 100)) {
      var ea = kernel.getProp("atexpa", "a");
      "n" != ea &&
        ("a" == ea
          ? 0 == fa % 100 && logohint.push(EXPORT_AEXPALERT.replace("%d", fa))
          : (Z && clearTimeout(Z), (Z = setTimeout(I, 1e3))));
    }
  }
  var O =
      "https://www.worldcubeassociation.org/oauth/authorize?client_id=63a89d6694b1ea2d7b7cbbe174939a4d2adf8dd26e69acacd1280af7e7727554&response_type=code&scope=public&redirect_uri=" +
      encodeURI(location.href.split("?")[0]),
    J =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=738060786798-octf9tngnn8ibd6kau587k34au263485.apps.googleusercontent.com&response_type=token&scope=https://www.googleapis.com/auth/drive.appdata&redirect_uri=" +
      encodeURI(location.href.split("?")[0]),
    P = $("<div />"),
    W = $('<table class="expOauth expUpDown">'),
    X = $("<td></td>"),
    V = $("<tr>").append('<td class="img"/>', X),
    Q = $('<a class="click"/>')
      .html(EXPORT_FROMSERV + " (csTimer)")
      .click(e),
    d = $('<a class="click"/>')
      .html(EXPORT_TOSERV + " (csTimer)")
      .click(f),
    l = $("<td></td>"),
    D = $("<tr>").append('<td class="img"/>', l),
    x = $('<a class="click"/>'),
    R = $('<a class="click"/>'),
    G = $('<input type="file" id="file" accept="text/*"/>'),
    L = $('<input type="file" id="file" accept="text/*"/>'),
    F = $('<a class="click"/>').html(EXPORT_TOFILE),
    K = $('<a class="click"/>')
      .html(EXPORT_FROMSERV + " (csTimer)")
      .click(e),
    M = $('<a class="click"/>')
      .html(EXPORT_TOSERV + " (csTimer)")
      .click(f),
    S;
  W.append(
    $("<tr>").append(
      $("<td>").append(
        $('<a class="click"/>')
          .html(EXPORT_FROMFILE)
          .click(function () {
            G.click();
          })
      ),
      $("<td>").append(F)
    ),
    $("<tr>").append($("<td>").append(K), $("<td>").append(M)),
    $("<tr>").append(
      $("<td colspan=2>").append(
        $('<a class="click"/>')
          .html(EXPORT_FROMOTHER)
          .click(function () {
            L.click();
          })
      )
    )
  );
  var Z,
    fa = 0;
  $(function () {
    kernel.regListener("export", "time", z);
    kernel.regListener("export", "property", u, /^atexpa$/);
    kernel.regListener("export", "export", u, /^account$/);
    kernel.regProp("kernel", "atexpa", 1, PROPERTY_AUTOEXP, [
      "a",
      "n f id wca ggl a".split(" "),
      PROPERTY_AUTOEXP_OPT.split("|"),
    ]);
    kernel.regProp("kernel", "atexpi", -2, "Auto Export Interval (Solves)", [
      100,
      [50, 100, 200, 500],
      ["50", "100", "200", "500"],
    ]);
    kernel.regProp("kernel", "expp", 0, PROPERTY_IMPPREV, [!1]);
    kernel.addButton("export", BUTTON_EXPORT, q, 2);
    P.append(
      "<br>",
      $('<div class="expOauth">').append(
        $('<table id="wcaLogin">').append(V),
        $('<table class="expUpDown">').append(
          $("<tr>").append($("<td>").append(Q), $("<td>").append(d))
        )
      ),
      $('<div class="expOauth">').append(
        $('<table id="gglLogin">').append(D),
        $('<table class="expUpDown">').append(
          $("<tr>").append($("<td>").append(x), $("<td>").append(R))
        )
      ),
      W
    );
    if (window.FileReader && window.Blob) {
      var ea = new FileReader();
      ea.onload = N;
      var va = new FileReader();
      va.onload = function () {
        0 == stats.importSessions(TimerDataConverter(this.result)) &&
          logohint.push(LGHINT_IMPORT0);
      };
      G.change(E.bind(G[0], ea));
      L.change(E.bind(L[0], va));
    }
    $.urlParam("code")
      ? (X.html(EXPORT_LOGINAUTHED),
        $.post(
          "oauthwca.php",
          { code: $.urlParam("code") },
          function (ya) {
            "access_token" in ya
              ? ((localStorage.wcaData = JSON.stringify(ya)),
                kernel.pushSignal("export", ["account", "wcaData"]))
              : ($.alert(EXPORT_ERROR), w());
          },
          "json"
        )
          .error(function () {
            $.alert(EXPORT_ERROR);
            w();
          })
          .always(function () {
            y();
            $.clearUrl("code");
          }),
        q())
      : y();
    if ($.hashParam("access_token")) {
      var ra = $.hashParam("access_token");
      l.html(EXPORT_LOGINAUTHED);
      $.get(
        "https://www.googleapis.com/drive/v3/about",
        { fields: "user", access_token: ra },
        function (ya) {
          "user" in ya
            ? ((localStorage.gglData = JSON.stringify({
                access_token: ra,
                ggl_me: ya.user,
              })),
              kernel.pushSignal("export", ["account", "gglData"]))
            : ($.alert(EXPORT_ERROR), v());
        },
        "json"
      )
        .error(function (ya, Ba, sa) {
          401 == ya.status
            ? $.alert("Timeout, Please Re-login")
            : $.alert(EXPORT_ERROR);
          v();
        })
        .always(function () {
          A();
          $.clearHash();
        });
      q();
    } else A();
  });
  return {
    exportProperties: r,
    isValidId: n,
    getDataId: C,
    logoutFromWCA: w,
    wcaLoginUrl: O,
  };
});
var logohint = execMain(function () {
  function b() {
    n = void 0;
    N();
  }
  function N() {
    if (k) c.removeClass("hint"), c.html("ABOUT"), (n = void 0);
    else if (void 0 == n)
      if (((n = E.shift()), void 0 == n))
        c.removeClass("hint"), c.html("csTimer");
      else {
        var f = C.width();
        c.html(
          '<div class="pad" style="width: ' +
            f +
            'px; ">csTimer</div><span class="msg">' +
            n +
            '</span><div class="pad" style="width:' +
            f +
            "px; margin-right:" +
            -f +
            'px;">csTimer</div>'
        );
        c.removeClass("hint");
        f = 0.1 * (n.length + 15) + "s";
        c.css({
          "-webkit-animation-duration": f,
          "-moz-animation-duration": f,
          "animation-duration": f,
        });
        setTimeout(function () {
          c.addClass("hint");
        });
      }
  }
  function t() {
    var f = ["Webkit", "Moz", "O", "ms", "Khtml"],
      a = document.createElement("div");
    if (void 0 !== a.style.animationName) return !0;
    for (var e = 0; e < f.length; e++)
      if (void 0 !== a.style[f[e] + "AnimationName"]) return !0;
    return !1;
  }
  var E = [],
    n,
    C,
    c,
    k = !1,
    g = !1;
  $(function () {
    C = $("#logo");
    c = C.children().children();
    c.bind("oanimationend animationend webkitAnimationEnd", b);
    var f = $("#about"),
      a = f.children("h1").appendTo(kernel.temp).html();
    C.mouseenter(function () {
      k = !0;
      N();
    });
    C.mouseleave(function () {
      k = !1;
      N();
    });
    C.click(function () {
      "https:" != location.protocol &&
        $.confirm(
          "Your access to csTimer is unsafe. Press OK for safe access."
        ) &&
        (location.protocol = "https:");
      f.show();
      kernel.showDialog([f, 0, void 0, 0], "logo", a);
    });
    f.hide();
    kernel.regProp("kernel", "useLogo", 0, USE_LOGOHINT, [!0], 1);
    g = t();
  });
  return {
    push: function (f) {
      g && kernel.getProp("useLogo", !0) && (E.push(f), N());
    },
  };
});
var timer = execMain(
  function (b, N, t, E, n, C) {
    function c(Q) {
      if (void 0 === Q || Q == q) return q;
      q = Q;
      J.renderUtil();
      kernel.pushSignal("timerStatus", q);
    }
    function k() {
      var Q = t("useIns");
      if (!0 === Q || "a" == Q || "ap" == Q) return !0;
      if (!1 === Q || "n" == Q) return !1;
      if ("b" == Q || "bp" == Q)
        return null == /^(333ni|444bld|555bld|r3ni)$/.exec(t("scrType"));
    }
    function g(Q) {
      DEBUG && console.log("[timer] update timer offset");
      timer.virtual.setSize(t("timerSize"));
      timer.giiker.setSize(t("timerSize"));
      if ($("html").hasClass("m") && !Q) {
        Q = $("html").hasClass("toolt");
        var d = $("html").height(),
          l = $("#scrambleDiv").is(":visible")
            ? $("#scrambleDiv").outerHeight()
            : 0,
          D = $("#stats").offset().top || d;
        Q
          ? (l += $("#toolsDiv").is(":visible")
              ? $("#toolsDiv").outerHeight()
              : 0)
          : (D = Math.min(D, $("#toolsDiv").offset().top || d));
        Q = l + D - d;
        $("#timer,#rtimer").css({
          "padding-bottom": Math.max(-Q, 0),
          "padding-top": Math.max(Q, 0),
        });
      } else $("#timer,#rtimer").css({ "padding-bottom": 0, "padding-top": 0 });
    }
    function f(Q) {
      $.delayExec("timer_offset", g.bind(null, Q), 50);
    }
    function a(Q) {
      var d = Q.which;
      if (17 == d)
        if (((Q = Q.originalEvent), 1 == Q.location || 1 == Q.keyLocation))
          d = 256;
        else if (2 == Q.location || 2 == Q.keyLocation) d = 257;
      return d;
    }
    function e(Q) {
      if (!n.isPop()) {
        var d = a(Q),
          l = $(document.activeElement);
        if (l.is("input, textarea, select"))
          if ("i" == t("input") && "inputTimer" == l.prop("id"))
            13 == d && timer.input.parseInput();
          else return;
        else l.blur();
        -1 == q && 27 == d && J.renderUtil(!0);
        29 == d && (d = 27);
        switch (t("input")) {
          case "t":
          case "l":
            W.onkeydown(d, Q);
            break;
          case "s":
            timer.stackmat.onkeydown(d, Q);
            break;
          case "b":
            timer.gan.onkeydown(d, Q);
            break;
          case "i":
            timer.input.onkeydown(d, Q);
            break;
          case "v":
          case "q":
            timer.virtual.onkeydown(d, Q);
            break;
          case "g":
            timer.giiker.onkeydown(d, Q);
        }
      }
    }
    function h(Q, d) {
      "disconnect" == Q &&
        (DEBUG && console.log("Bluetooth Cube is disconnected"),
        $(document).trigger($.Event("keydown", { which: 27 })));
    }
    var p,
      q = -1,
      m = [],
      r,
      H,
      y = [],
      A = ["#f00", "#0d0", "#dd0", "#080", "#f00"],
      w = { play: $.noop },
      v = w,
      u = w,
      I = w,
      z = w;
    void 0 !== window.Audio &&
      $.waitUser.reg(function () {
        v = new Audio(
          "data:audio/mp3;base64,//M4xAATSYYMAUxAAFnLyWJYln7RIAmBMD5PP7MLFh+v9gwMDBZyIn6JW5Ydg3AXBeH59S7vomiV+iILi7veiV///6In/wgoKGI7/+CbwQDH/gg7/5QEP5QMKs/q0cGlVL/ljQ06DnN/5yXn//M4xBEYsl6gAZmQASxhYji4zI0B9iVDm+gt1kQHSPZI/sgyZbMyXMRcn6bsgzk2M2J3LBLCgP5fSQQW7ikxUiqM2RpJiFP/f+Sw5hE80QQb//qbbzpPigBWhVKI71IfgLsD/GxF3etnsPVA//M4xA0YQhbUVc9IAYJsgBw94rEX5Zn32GB9ZJjM7WRsZByUJeG5tRzP///Pf5e/fnvj/6fnaROkqmWIVzyANulyUmy0y1+SM9qVIYeNThdSTt+Mr1dybYemoxoARO2BkwVpYBgP+hht2G3h//M4xAsXug7E9VgwA7hYwgWS6ksd1YZlz3SGJu9Tf9Nnh/QES1GjUas4DDPRsz6mUfOZ3RfFmnfdROWbCX//9enmoPCRJo0UuSOVVU+V6fM7/5rt///nr+Ei8PQumSH7twFhltkx/BAAAFsm//M4xAsYCnKY95k4ABXvCvTG+ZhpjLmGBPUOxY3uVbnhYC4i/qKgAl+s8ajiCcam+fG70NEYoMjT/vwWlhsMgsAjmx1l/gwsIok2JGjyp+n9yZUajYIgaaj///UfPJqlScmqAFAtFAtFottF//M4xAkXS38GX4EoArXUKwIPwD8ku8n7kImb5JCZqG+RnJ9PnezvO6//xA8+8g+tVcRFjauathAUMIAg8OCgodAezJxwoKOn/djpbbVGFFOQUZkIuqDVK7HdP6bt///jx1VoiZeQAK3+k2aJ//M4xAoX40MLHcg4AlCJVEGgLifPIFMGlO////2X6/6SbmA9JMKweDx2qhCSf/1Pfi1TVnqpD/55tUNLr/1qk5p6O2utkSc8w0003od7sk9roq6oceebQ46drqNR5yw+xpV1WIZlWJqoxBjD//M4xAkXIOsTGs4GXjzGCDgkBTJvzm+iZZL5OW2BQRQBdEfi9JG599JMa2qxISC8DMToZwZIgjTOMAiYj/MZDgIJ2fNmfZFBebWkAANCaSsG/c0cwBRxz//sPu///i3+hZvpd//JGObwoVXH//M4xAsXCPseWMMRI8KLBT5VTQZUaR+psYbbV0pcQAUJGtAxqeZjEEUMqUIQMQiIkmrChKdhgrzxluLhsqa6EwWtCAvBcUQPulnoHANyQxiijuwFEl1g/ilr/3+2/SqCVmRApRzgVEsmKcqa//M4xA0S+KLxv0lIAhehSRNXiyJCQgBBEhJYImmHiEERSGUIpCoBh7FgaUDLuoeCsFgayolLVHg0VO6w1LAXLfrLD8l9n2Tv//iIO5R88yRoxfLP60GESF0/nDMiacux54YAujYBIUHPuRFR//M4xCAcMsawAZhQAODgtEJMKyu88L8FgVhXC4IU1e74kCDGBMhIcWIyMSDf3GotCEFUPwGBgxceEQvKHf88kHCckfod///7Hj8w8uSD99yMyQyY3+Z/2c40nLu+VQKFvTbkoA8CijpNUkRQ//M4xA4UohrVn8YoAhQVpc+iJgUeAYryHnlIYPHDplFSoYxSxEVp6loHgsMDxxIWyzGo6lMY0vyiI4xUMpfvZ9v+WVkMpBIPIZyoJCTyKYKh1QEk3DdbkAgLmdaIAcZrvsZeRo1qN88WJe2b//M4xBoU0nq1t08oAkWHSapRERYpS1ZNEOpyCp0Z++Uhjcm/mvnRL9Dv6nRT3br/9a/daqivOpyT8pTzgdIm56oH3p//+tVpyS2yWSSWyWi261igBtlcTNuVMBDryxNmQvt1gMnh+q60Ycbs//M4xCUeAybGX5g4AkzzRWNhIP6tk+xpFjEOmsZHS80mXQ8xH5r/NJFqHl6Hdf4nJElTqabU3/uYY4PRuJghEUkNweCKPgJKVRTen+aNyZDdP////zFJsJA0nEDxuhAcDEgkEYjEkkgkjUJZ//M4xAwXgx7yX4IoAgCeXYgZ9oovHihUXv7Ob1OeQaRxi+hFflYXMXqt/92vlci/8+rttZXrai+ScQFMgn+Zv+1DvnPJDjTnnTd2UUIKCjyD55GfPCQixBcxX/z//BO33bDbW2PRBjsKUcCg//M4xA0UGqL2W8gQAtSYFFPQa5Z7v//KBhBHkIrkVz/oxFc4s7//5SlKvXuV35So77I900dv1///09f/SoslqKxA4cB8FoiEsBLGq7ksGoGKm+utulrklKqGKg0DDy3oNQvNH1uL2O9JZx/n//M4xBsUYQLiWsCMqo2CtyElAU930DGtGeUSEkYJXP///9Mk4BAkwIKORLN/LB2eh3K2nip0RZW3/DX/+HSxP/+s7spJrvAhfRAKXHSVTp/qR1yZwT//SsEOql7ChW9Q/OMbWcqTwk5mHqx3//M4xCgVUiJ0VEjKfJvMY0oqpWoY8RDupfzZhIqlN///0EmUDU9LHg0HOCodwVU8AnQaBUFfrKkt5CppLbfCQZI1EFRdF8qqmnnCQw/NfiYYhS57l/GgCLKyId/5H+VALvUe/75r5Xyx5n8e//M4xDENOQJoHjBKtLM67iEbxmn4ZnCdCLoqFQ9kxWiedXM7lVzLTKYul04P0UbpIFFAR5lxub6eFzRpwGWZebNGnFXF5s0//7s7O+bm5RpxRYJhmKEv//5UKiwtrUxBTUUzLjk5LjVVVVVV//M4xFsTMXHgAHsMHFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
        );
        u = new Audio(
          "data:audio/mp3;base64,//M4xAASgV4kFUwQACCAxs7JZPjOBIJicEBEdOxLJ6/6P3mlKTvt5zn5CBCEbI2c7oc57qf/XyEZTnQOBgYGLP/5c/1ygICQEP//EYPh+XBAMQ+Xf/wfbFqFNoEQoEFQEAoFAB+AVB4IMjon//M4xBUaKkrKX48oAFfHUmf89zpuUPoIoH/EBQgAD2Doh8EcCEYrHQOfg5IqAYuEADFAFIHufiYfOwfFyFFBYcHRAO/9XIRpJyy1dxT/+MFHac/xYuZar/fl+6pO7///UgWBacsstohOUoCw//M4xAsYGUbNn8wwAAMnmZ+cDu8djuSCYwYOmCwwdXtktWsTP35ZVoIgRJ5bXk6qf1VUR/f45seXnP2/2UZaUqN4JCMUOZ/QXBZBJxhp0akGam/eSOtFNysFTrfvaRb86SJV/8UPUrp+zSj1//M4xAkWefLEAMMG6O9KX1ERIatSpfyIuESQIBoKtVAipJxzbQQL48CaGZwhwiYAxOflcSz+973gNziP9c/v5/0/PsIzp/FcDcOP1BFm4cWZOejhzT30AwOIEAKnIInmpCW45KAB9YbUZ/KO//M4xA4XWgcGXnnS9wSLgdo+4uIZd65P8BmAVW7Y7RdHPK0MI1NPaSAaisaW6PReado2a3tr53Z8shskyFmpyIk2z3asoILchTb6As0mgosPDodNkqQyWtyzkN9VAOkEPxM62BmWyoOLzh2U//M4xA8Wo0bYVmBTPhU4VyIfetOVNubJtJwyjshE7b2ZpJtlITxc1n/J8XP///PMvDxcXPIwoA2s1hyf////4epZ4XqCenBIuF2M//9QvWE0dqBj/xLGEsUPE0jEFdMCsIqJSpRLJos62sp0//M4xBMZMz68BGoN5Wl11LRQpL29v/6e3///639n///10zdl8ltVyki9kGU76S73MSKDiwVgLnoYqS8dkGQxmRWYCIdkDyemBEJt8sECJ2ygAEKBwu6AY8ogACBZO52rx//7v/////6///////M4xA0WszrIAAhS/P6/8eVUMxJ6xGbUUV4y5GK2pLIUAIUTHlEKNVUUhYRFAMCkbC4YGRWQHAYoRJsg2ygsiFIlCSHN7VkjS8W1rJ2LYOTYG2bOm0LajK9swZdtrdttoNb7LQuMMOlQ3VRo//M4xBEZGU8SWMPS0tIV9Mkfd/1pqxzFRKswhSTgwWwQgQwhCwHACoEwdQyVi3qp5kt5l4gufzHb1ftPqNOHREJQLGOQMB6sJEcosEZvF0clGJo0hQoSQm2gQNrHxOBCKpL/dt/t4P83PyNq//M4xAsWcU8uWU9gA8fiEqmxOxkCxR4akYDKVhCQ5ihISWhdx7Aacl4qxKysejiaMq0RKVKjw1EIlXx7kNyh+YhTYQTIuJ6qH1XMejdTtLLsn1CrEeL7987UtHZP8DNiNI+8XNT2ZP9/uW15//M4xBAYwl6sAZhQAFu1p+7QEoFEBV6g1nEhETM/vMKP1RNwuAaAayAeGj0oc6q/i2hhO+PSRjjjX/FwXAsFAWAaAQzeahzov+TmOYx/5pqev7f9jx4WAgbOC3//B9weLoMQSAOtHnOtlwEc//M4xAwYUX64AY94ADqMNCC4LhWjHbCcscWKI+gkIRT5wve2X0GfevrOLVi2pfW/m3v4L2Die0CG/rPiJDe/fhRLzvp9YpesOBPrWKfGcRgVO0IKLecj34HDowGogX0kfwaqGKkalAB07DTR//M4xAkVUXa4988oA96hJKmadYbXjLDpmV8xPo1k6wuL0PCxnMJGMhSyrzFKVW7Sh0OgUtEsVmKxerFKpf0Q4iHg87wUFGhQV/pgoKCjcgoKahBS/0L/v/XqRrkvl1uuAHPRw8YD6obbAZWC//M4xBIUulrVv0YYAsy5WpzC/FjkoESgR4UTt+wwhRQCEFLAKVdjpuarL+uveMFSGZM6nmZMaEOIWDlW/5/+0r5//SO+5f3a+jXFKZxDY3GQ/s1JvAR00Bwm8O7JGQqoMUFo+y7mpgYG2r2Z//M4xB4bcyaYAY+AANJE6Zpfv7lAmES+t//rfSMzhikn//v2djA6YGqX//rdb6ponW8jSfJ8ibkXHX//3y4gabqQ8Zw1DEgm8QXFPFzCAAEwcY4A9QdIpc9///iBPL////////3//6M9cxlS//M4xA8XA0bMC8A4AsjHnuerv7VVCh9rmHodKIIiiUY7mD6VLmXU0bsJZcfcyYaPisRxwBgOwHnjQeMG4TgVGQhDhUTEwinA9B6g6NmFprmIhYajYcHygjk2V4VncGh/pRDV74GwDcP0CGGr//M4xBITSQr3GHgSwgw5n97yKxUMaHpRn1/7kgiEwoT78OtpAEDCCkDp+fpVl4UQo5o98MXf/aeWXBfInf////X4SBp//7b0qgCIGi9cuqFSVYVE2qotihQ5KWrE2fOIiAMVuhpaCTI7/0Dw//M4xCMUaO6dskgKwLA0WAQe/sCeCz8RJOxE10qrOhphGAQkGn1nexseGgoPBWMWAhKWWRDTIK5UA5ZtAroFgVAmNWRLlixNLy/xbJKikZ29gwqyerczBhX/o6Kibf/0+/1bYxSlaitzCKf3//M4xDAVGx5cFEiKzEdAiCD1rIHqlm6GpKZeWj6Gh46mGkVqGKVhIPHby1Zy8pfCQqpAWOqAYgcSGJhoGRGZHsMxdJkWFmegGRWgKiMBC6xUMgJn8e2aBkUDxrjxVMCirFixoKioo3FW/4sS//M4xDoR2CIEAkiEADQVFG4q38BBIRhkyEm1TEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
        );
        I = new Audio(
          "data:audio/mp3;base64,//M4xAATEZoICUEQACAAAAAAVjGPIABjGMYxjGQhG/qc7znAAAQQhCEIBgZzn//nfIT///OACCAgCAIA+D4f1AgCDu/4Pg//BAEAQBD+D4Pg4CDogB8PlAQV/lyZtCAp/v2yc4zIHc/+UWAK//M4xBIZMvKIAZqQAQy6fRSNAxgABQc3y4i7ilB2l4t/20mIGbn//xmCKEgXDEr/+2w43WSBgVCJ/+mtTILdRIHCXMRzx3kQZD/9uympqz5UM0lui5eOEQNP/+r//N5Z/e8LkFm0AKioK/UN//M4xAwX0eawAdhAAUrHCF0Xyt8mH+FmJNO7GaWW0L6MPJXkR+2bc26/iL/uuZmIOmYGTZtbRo0aTfrOMMts4YKnqUUfYjnHGhktCIExYjMNlU6UuxpZy0mb/nM+giFCFaQQgI7LAFMBlv/y//M4xAsX4mbGXsIKnHpCwXElk/qwtoiMigBBRYYAMG6v9geFWqiha0rlTWVobWLi5m11Vmyl9ZVVaWYqKvf+yGsipuxhoULRZkKJGs9SX4wt/f67oUPCYo0ih1Et/Of4NOUpySxlRsf7ZHkf//M4xAoXSl68flmEulpKJzj4HRAjce2at13fUYlVa81Ao7xm5DvuRGYrbf1B1ZtrXZqLSczrZVqtDG85ZwpvKJarJLMnQxnUvK2//CiRQaXEHfWHyDUPGvKdAnuygnfJqiqqAaP/y5zeISIf//M4xAsWMzKwVBhTraE4JQMQ82CUXHSsAKLmIWCKLSuDZK6KLh/93cGBwg5oV5fy3/////5f/cqr14yU5IbSzejWjcl3qChaEaQIIGKuYrKMJvAILCg9DdUmbiO/5EAFgTgHV3kXGB5LzZhY//M4xBEXU0K8CkCTPLCnbWj/8LVfenb+v/9lMdhLkuZ////+h1e0////ZWuiu25JXU4gIdVOhgZI5auESAnYXYPtGLUVNkw7AZqT2UR1DRMOtEiMdJ1sojbqlksl0lij/vaaaWCAoUoOsOYj//M4xBIZWW7yWNMHKgmVLqEkBMvdl3bkthguWpAMJL5dmCBEMMvMFyiijcL0EPwsO/78WKl4Qx4ODxz9SJW37VEMH3l3Vxg5RrFjA8GI/soju6ZTz88GLg1nCLfLsQODdZMRym1ANb0zCehG//M4xAsU4SrBjgvMHF48ZpdH8XJp18bP0yXW60P4TU4WFxtISSN2WosJZ57tW1Wz5kjP9f1uU8oycSAssqs7rDT4iJCUaBn01bMlSOf1AZ5D3f4l4hWAC+VSUH1YSABA8DgzLD94INFxHhUG//M4xBYUgzq09kBFXhnywvc/I/749Tqi5YJPyMGAtWO9FRGXONgyKILofPtDMho9WsaEq/9P/9eZGWRgyPkdzI/V9NCXBB+oZTwx/5ZkohiZfFYWGUnhLK43nk8bR3byGp2OQCms4M5k3dYz//M4xCMUYUqgKsFNDAaLS6pDeQeM4oGqVgmMfV/0df0+e75mZaYIerAmcBUFUJFXNty0TEQM06bMf/jVoBMla1FwGt16zGA8NQefkpVAN0tnbzz1C06KzuUensbO9SV2RyYMOpFsarqJI2lK//M4xDAVQXalH1kYAK/2GsnDmUuZ6l+FJuXQlnlBR08KxEVjwEKmGf/rKgLDpVyG/5QgguSRiMOCQQOSyqMhGmSI0qtdpYGVsYNfgCHScsHWrAQqDrQckoEi/yCXUjSk/79aKf+tajBVaCz7//M4xDojc86+X5loAn+t02X//f7r9bplxtM2HeRmHqp0/93U2b3TlQ8xzl8e6kEFIG6mMEDI31/TTdvYvpM7oJjHGDJURsphZqqLhgSBcUZnkhwkoPw/f//5IHv//x5CJQBtaN/99owR/who//M4xAsVOd7mX8FAAsYFIH97r8ivyxIagvaf/+l6J/+44QAExgoMmpeCDHv///WmHpMo1Q7I9pQ4RgqFjCyGND0Wg0tx4RPLWFfkXvhVMOs//yhIeIwEkmhE332M1sAGU0ua+qxgESxhRLOA//M4xBUTyKKa/ghGBJqX1Y3AokRAV3UCp3w6dBqJRj/wKWbIhICjGB0iGjxLKlfqCvJMO5ICkg6GvhUSkQkBSAFIgsEgyk7VBP1OmAhQMBDCArw0eOsDoSPFSowOkiEYBe0CkAqAkUCIkggI//M4xCQSKB4U0hiCALz3UDICqAtg0sVLFSXCj0ZEJAXrLLHu3niRH8e4iSlS06dh0NJMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"
        );
        z = new Audio(
          "data:audio/mp3;base64,//M4xAASgSo1hUMQAIAgkWD33c9AN9ELeOf9d85/5CanO6HOhCNO//+hGUIQ5lw/EDogh8uH9YYLg+/UCEoCCwfLh/5Q4JDgPwQD6gQcDhwT/WDjidYYH41Hok//1+vs9vT8Aq1dS2NBQo9g//M4xBUaQmL2X4dAALQ2Nv44Xi2W/qxHUQblV/6FjBgoCtYppT/xUXgeJR7XVZl//o6MtmtX//9V+PR4UurefhUiY9P/v+HYURyEZPn2FUyg0IfGvlAQE4nuPo+d//Of6skEArDfvp+iADgm//M4xAsWqQbBZ88wAI8Z4TAwlzUxOFRqMwLkt7PBjyPCAzN57EJBCEQ7AhBUQ9J+MoqjYeqLUyR06dGBVigkZSuiSkjqVA08t/50tzOeqOg0HZglErtv+wsDIx9qsCCVRS8ugA0eMpdgLnQG//M4xA8Y+N7OVg4eHLkxaawiYEAmMzp+pVi0QgyWuSbfaLu2JCPMS48djN2OjQPo8Gm+1MTkQMvbWocLgBnJur3ebwmcLuKCc5bAgWU5jkzRmh7dVJw5hgQGKdTD4rLwfD/TApD6T3GsZ+jo//M4xAoVsMbllgvSOoaajtekUtnRNv4yigtZDycK1KCSjIEDHoXy5yCw8KkJoEIdZuEOmhM5IuAjwKlxUSmGXpCh5P7V0accB0u6n2KTHs/+J5P4YiA5EjpdEQKAAbh9B4FwOix3NYbHKio4//M4xBIWU0bg9jgfcoo1b0Gx3zTUfScea3RH////////j/////6huEM0ydj1nWzrgtgR8MM7g1AmhYF2q9N5b1G5qxk0wODIi0UWAfZJ4g3yTn+q1Q5KzlECQfkaxWsgj0I/RRb/2/v//9Vn//M4xBcaw0rBl0FoAHpf////sy1rrb///X//9kzydJBKkiipmY6O8Yom4cw0Lw+HguQW4KkIodoUAHsGwDYC1iJEUSQl5CFMcBNJIqCiC8hVRGw6AP4LeBlCxD0BcBVDFxaPvr/f9//9/t/L//M4xAsX2j8eX404AtuxjqjEzRIDwC51mFMl6MqmiWPEEbHnxoe62msPLMPPJsxnnBRvKtc+e6/LDrecjN+Y6DpnoPkzmXvmkjvb8z+hpR/FQ0fVKkELosVELRvtIqHf8qqbyaTMDIgnGhw1//M4xAoXiV7Yy494AId4yhnCcPiNF1KghyHyKgIIj2VKqcJqpPDrepyth2GrAcR63Fmhap8aeZtrEPE1J7TUjYiapaTTJjUCZuxLP8534sKLvX6+C4hRnyd0DLYhIa//DdW4SwYlwqtK1Zk1//M4xAoWEa64AZloABtJuengjtCaHvhxARYZEw5I8VtBIRvIKJJF4vLXxLjIzQLyKNFvpHx3Eqo7UmkZGX47RhB7ukbKMdnZt/cwmKNFmSQRnale8WIoQL1XARX18OEI5r/AaBcP1ehjqz4B//M4xBAXUuasAY84AAD8RB4wufax6mmJf3WY046i/zjS3OU//PQ0uPKg3dB48anHo0z5NmGhojnMTOHWGhxU1f/5U51m2tOpr+v//PtY2etxwtYLAVa3Fv/kFQpAY3wDgA//5BYdMtqpa7qi//M4xBEVET7Bt9iAAKTOTxnaPGEt9Kbeq7T3to8ZWvAPiGSMzEig4TiSjIqpKYpmyNlq9dSq+kg99n99MvhEXLFp27/U0OmrQK7fT6LGtJPVSABDsRjmAGH14mKnQlMUeVmib52Ev1vKSCGb//M4xBsU6MK5v1gYAMWnvrRa/zK6+rut4USRcWHkoCREFWw8SVVdAQdBo8HRLeCsc4JPLfaeI5aSK/4dEqVAwHyIVGvtUgAIKPKv/z/gAHxAkOJGEARIEghZOYmCTCxgEhs/SVqNzJ2S2uDz//M4xCYei86plZpoAGGcep4x54vonz6NvVVur6+YKXNqmQSPaS0UEqnQ7amo+j//Q01ejW3/6v+7et+gTDpTX//9PU03WmbvtQLhoMASZsSR0iCmE8GACQf//7f//xwgr9UCSgS2iC2oEfkI//M4xAoUC0LuX8EoAkdUf8b5/89Cd0///qqi5G///yodv50YXKLlExcABN0KYgoJoVxgmKkDpSOAwmKCwFDrGPRuzt6/00Zyr///1+jWOR0U0WKqEAls1wn0iBHCH/MIKAQktE4BU5EiRASW//M4xBgTIbrOXgmKlv/7y8scFEknl8///NZQ6KwiKiQecrf//5qVYxpQ64iCRKFDQVT88VBU7/1Q7/9raCJGRCTaAkYG01QNZFtww1LYo1EwKhNwSArlhI8Ej0OiURAIed1FQEPksJu8qIiS//M4xCoSsGIcFDBGQIqWW7wCAvkbSQiKjDp5YSDgdyxYe4986HQ0HdodEpUiSkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"
        );
      });
    var O,
      J = (function () {
        function Q(ta) {
          ta && void 0 == M
            ? (requestAnimFrame(d), (M = 1), (ya = 0))
            : ta || void 0 == M || (M = void 0);
          K = ra ? F : L;
        }
        function d(ta) {
          if (0 != q && -1 != q && -4 != q && void 0 != M) {
            ta = $.now() - r;
            if (-3 == q || (-2 == q && k())) {
              var na = TIMER_INSPECT;
              "n" != t("timeU") &&
                (na =
                  17e3 < ta
                    ? "DNF"
                    : 15e3 < ta
                    ? "+2"
                    : /^[ab]p$/.exec(t("useIns"))
                    ? Math.floor(ta / 1e3)
                    : 15 - Math.floor(ta / 1e3));
              x(K, na);
            } else
              (na = E(0 < ta ? ta : 0, !0)),
                x(
                  K,
                  {
                    u: na,
                    c: na.replace(/([.>])(\d)\d+(<|$)/, "$1$2$3"),
                    s: na.split(".")[0],
                    n: TIMER_SOLVE,
                    i: TIMER_SOLVE,
                  }[t("timeU")]
                );
            -3 == q || -2 == q
              ? (K !== F &&
                  (12e3 <= ta
                    ? x(F, '<div style="font-family: Arial;">Go!!!</div>')
                    : 8e3 <= ta &&
                      x(F, '<div style="font-family: Arial;">8s!</div>')),
                "n" != t("voiceIns") &&
                  ((na = w),
                  7900 <= ta &&
                    7900 > ya &&
                    (na = "1" == t("voiceIns") ? v : I),
                  11900 <= ta &&
                    11900 > ya &&
                    (na = "1" == t("voiceIns") ? u : z),
                  (na.volume = ~~t("voiceVol") / 100),
                  na.play()))
              : K !== F && x(F, "");
            ya = ta;
            requestAnimFrame(d);
          }
        }
        function l(ta) {
          /^[rgy]$/.exec(ta) && (ta = A["rgy".indexOf(ta)]);
          L.css("color", ta);
          F.css("color", ta);
        }
        function D(ta) {
          x(
            ra ? F : L,
            (void 0 != ta ? E(ta, !0) : "--:--") +
              '<div class="insplabel">&#59062;</div><div class="difflabel"/>'
          );
        }
        function x(ta, na) {
          var U = ta === F ? 1 : 0;
          va[U] !== na && ((va[U] = na), ta.html(na));
        }
        function R(ta, na) {
          ea = na ? ea + ta : ta;
        }
        function G(ta, na) {
          for (var U = [], ba = na; ba > ta; ba--)
            U.push(E(m[ba] - ~~m[ba + 1], !0));
          return ta == na || 1 == na || 0 == U.length
            ? ""
            : '<div style="font-size: 0.65em">=' + U.join("<br>+") + "</div>";
        }
        var L,
          F = $("<div />"),
          K,
          M,
          S = $('<div style="line-height:0.6em;" />'),
          Z = $('<div style="position:relative;font-size:0.3em;">'),
          fa = $(
            '<span class="click" style="position:relative;z-index:20;font-family:Arial;">'
          ),
          ea = "",
          va = ["", ""],
          ra = !1,
          ya = 0,
          Ba,
          sa = !1;
        $(function () {
          L = $("#lcd");
          $("#multiphase").append(F, S, Z.append(fa));
        });
        return {
          setRunning: Q,
          color: l,
          val: D,
          setEnable: function (ta) {
            ta ? L.show() : L.hide();
          },
          append: function (ta) {
            x(F, F.html() + ta);
          },
          setStaticAppend: R,
          fixDisplay: function (ta, na) {
            var U = !1;
            0 == q
              ? J.color("r")
              : -1 == q || -4 == q
              ? l(ta && na ? (k() ? "g" : "r") : "")
              : -2 == q
              ? (l(ta && na ? "g" : ""), (U = k()))
              : (-3 == q ? l(ta && na ? "y" : "r") : l(ta ? "g" : ""),
                (U = !0));
            n.setAutoShow(0 == q || -1 == q);
            Q(U);
          },
          renderUtil: function (ta) {
            k() && -1 != [-1, -4].indexOf(q) && t("showIns")
              ? (L.addClass("insp"), F.addClass("insp"))
              : (L.removeClass("insp"), F.removeClass("insp"));
            ta && -1 == q ? (sa = !0) : -1 != q && (sa = !1);
            ta =
              -2 < q && !sa ? G(Math.max(0, q), Math.max(m.length - 1, q)) : "";
            S.html(ta + ea);
            if (-1 == q || 0 == q) {
              if (-1 != "sb".indexOf(t("input"))) J.val(H);
              else if (
                (J.val(sa ? 0 : m[1] || 0),
                !sa && m[1] && y && y[1] && "n" != t("showDiff"))
              ) {
                ta = kernel.getProp("useMilli") ? 1 : 10;
                ta *= ~~(m[1] / ta) - ~~(y[1] / ta);
                var na = $(".difflabel").html(
                    "(" +
                      (0 < ta ? "+" : 0 == ta ? "" : "-") +
                      E(Math.abs(ta)) +
                      ")"
                  ),
                  U = t("showDiff");
                0 != ta &&
                  "b" != U &&
                  na.css("color", 0 < ta == ("gr" == U) ? A[3] : A[4]);
              }
              if (Ba && Ba[4] && !sa) {
                Z.show();
                var ba =
                  ("string" == typeof Ba[4][1] && Ba[4][1]) ||
                  tools.getCurPuzzle() ||
                  "333";
                ta = "333" == ba ? recons.getMoveCnt(Ba[4][0]) : Ba[4][2];
                na = STATS_REVIEW;
                0 < ta &&
                  (na =
                    ta +
                    " turns<br>" +
                    ~~((1e5 * ta) / Ba[0][1]) / 100 +
                    " tps");
                fa.html(na)
                  .unbind("click")
                  .click(function () {
                    replay.popupReplay(Ba[1], Ba[4][0], ba);
                  });
              } else Z.hide();
            } else Z.hide();
          },
          setRecons: function (ta) {
            Ba = ta;
          },
          reset: function (ta, na) {
            ra = ta;
            L.empty();
            F.empty();
            ra
              ? (L.removeClass("activetimer"), F.addClass("activetimer"))
              : (L.addClass("activetimer"), F.removeClass("activetimer"));
            va[0] = "";
            va[1] = "";
            R("", !1);
            D(0, ra);
            Q(!1);
            P.updatePos(na ? !ra : ra);
          },
        };
      })(),
      P = (function () {
        function Q(F) {
          if (F) {
            var K = $jscomp.makeIterator(F);
            F = K.next().value;
            var M = K.next().value,
              S = K.next().value,
              Z = K.next().value,
              fa = K.next().value,
              ea = K.next().value;
            K = K.next().value;
            D.html(F).unbind("click");
            void 0 != S
              ? D.addClass("click").click(function () {
                  fa(S[0], S[1], S[2], S[3]);
                })
              : D.removeClass("click");
            x.html(M).unbind("click");
            void 0 != Z
              ? x.addClass("click").click(function () {
                  fa(Z[0], Z[1], Z[2], Z[3]);
                })
              : x.removeClass("click");
            m = ea ? ea[0].slice() : [0];
            y = K ? K[0].slice() : null;
            J.setRecons(ea);
            J.renderUtil();
          }
        }
        function d(F, K) {
          L = K;
          Q(L);
        }
        var l,
          D = $('<span class="click">'),
          x = $('<span class="click">'),
          R = !0,
          G = !1,
          L;
        $(function () {
          l = $("#avgstr").append(D, "<br>", x);
          b("timer", "avg", d);
        });
        return {
          showAvgDiv: function (F) {
            F && t("showAvg")
              ? R || (l.show(), (R = !0))
              : R && (l.hide(), (R = !1));
          },
          updatePos: function (F) {
            G != !!F &&
              ((G = !!F) ? l.appendTo("#multiphase") : l.appendTo("#container"),
              Q(L));
          },
        };
      })(),
      W = (function () {
        function Q() {
          void 0 != G && (clearTimeout(G), (G = void 0));
        }
        function d() {
          if (-1 == q || -3 == q)
            -1 == q && (J.reset(K), l()),
              c(-2),
              (G = void 0),
              J.fixDisplay(!0, !0);
        }
        function l() {
          K &&
            (L.is(":hidden") &&
              (L.show().appendTo("#container"), L.empty().append(F)),
            L.css("height", (t("timerSize") * $("#logo").width()) / 12 + "px"),
            image.llImage.drawImage("GGGGGGGGGGGGGGGGGGGGG", [], F));
        }
        function D(S, Z, fa) {
          var ea = M;
          255 < S
            ? (M = Z ? M & ~(1 << S) : M | (1 << S))
            : fa.ctrlKey || (M = 0);
          return 32 == S || (3 == ea && 255 < S) || 3 == M;
        }
        var x = 0,
          R = 0,
          G = void 0,
          L = $("<div>"),
          F = $('<img style="height:100%;display:inline-block;">'),
          K = !1,
          M = 0;
        return {
          onkeydown: function (S, Z) {
            if (
              28 != S &&
              ((Z = D(S, 0, Z)), !(DEBUG && !Z && 48 <= S && 96 >= S))
            ) {
              var fa = $.now();
              if (!(200 > fa - x)) {
                if (0 < q) {
                  x = fa;
                  m[q] = x - r;
                  if (27 == S) {
                    fa = [-1];
                    for (var ea = 1; q < m.length; ) fa[ea++] = m[q++];
                    m = fa;
                    c(1);
                  }
                  c(q - 1);
                  0 == q &&
                    ((R = x),
                    32 != S && c(-1),
                    J.fixDisplay(!1, Z),
                    C("time", m));
                } else
                  Z
                    ? q == (k() ? -3 : -1) && void 0 == G
                      ? (G = setTimeout(d, t("preTime")))
                      : -1 == q && k() && (c(-4), l())
                    : 27 == S &&
                      -1 >= q &&
                      (Q(), c(-1), J.fixDisplay(!1, !1), l());
                J.fixDisplay(!0, Z);
                Z && kernel.clrKey();
              }
            }
          },
          onkeyup: function (S, Z) {
            a: {
              S = D(S, 1, Z);
              Z = $.now();
              if (S)
                if (0 == q) c(-1);
                else if (-1 == q || -3 == q) {
                  if ((Q(), 500 > Z - R)) {
                    J.fixDisplay(!1, S);
                    S = void 0;
                    break a;
                  }
                } else if (-2 == q) {
                  var fa = k() ? Z - r : 0;
                  r = Z;
                  m = [17e3 < fa ? -1 : 15e3 < fa ? 2e3 : 0];
                  c(t("phases"));
                  K &&
                    "333" == tools.getCurPuzzle() &&
                    ((Z = tools.getCurScramble()),
                    image.llImage.draw(3, Z[1], F));
                } else -4 == q && ((r = Z), c(-3));
              J.fixDisplay(!1, S);
              S && kernel.clrKey();
              S = void 0;
            }
            return S;
          },
          detectTrigger: D,
          reset: function (S) {
            void 0 != G && (clearTimeout(G), (G = void 0));
            x = R = 0;
            (K = "l" == S) ? l() : L.hide();
          },
        };
      })(),
      X =
        "input phases preScrT? isTrainScr giiOri useMilli showDiff smallADP giiVRC col-timer".split(
          " "
        );
    $(function () {
      p = $("#container");
      O = $(".instruction").appendTo(kernel.temp);
      b(
        "timer",
        "property",
        function (Q, d) {
          "timerSize" == d[0] &&
            (p.css("font-size", d[1] + "em"),
            timer.virtual.setSize(d[1]),
            timer.giiker.setSize(d[1]));
          ("timerSize" != d[0] && "phases" != d[0]) ||
            $("#multiphase").css(
              "font-size",
              t("timerSize") / Math.max(t("phases"), 4) + "em"
            );
          "input" == d[0] &&
            (timer.stackmat.setEnable(d[1]),
            timer.giiker.setEnable(d[1]),
            timer.gan.setEnable(d[1]),
            giikerutil.setEventCallback(h));
          "showAvg" == d[0] && P.showAvgDiv(d[1]);
          "giiVRC" == d[0] &&
            "set" != d[2] &&
            timer.giiker.setVRC("g" == t("input") && "n" != d[1]);
          "vrcOri" == d[0] &&
            "set" != d[2] &&
            (timer.virtual.setSize(t("timerSize")),
            timer.giiker.setSize(t("timerSize")));
          0 <= ["toolPos", "scrHide", "toolHide", "statHide"].indexOf(d[0]) &&
            f(!1);
          0 <= ["useIns", "scrType", "showIns"].indexOf(d[0]) && J.renderUtil();
          "col-timer" == d[0] &&
            (A = (d[1] || "#f00#0d0#dd0#080#f00").match(/#[0-9a-fA-F]{3}/g));
          -1 != $.inArray(d[0], X) &&
            ((Q = t("input")),
            c(-1),
            timer.virtual.setEnable("v" == Q || "q" == Q),
            timer.virtual.reset(),
            J.setEnable("i" != Q),
            J.reset(
              /^[ilvq]$/.exec(Q) || ("g" == Q && "n" != t("giiVRC")),
              "i" == Q
            ),
            W.reset(Q),
            timer.input.setEnable("i" == Q),
            J.renderUtil(),
            J.fixDisplay(!1, !0));
        },
        /^(?:input|phases|scrType|preScrT?|isTrainScr|giiOri|timerSize|showAvg|showDiff|useMilli|smallADP|giiVRC|vrcOri|toolPos|scrHide|toolHide|statHide|useIns|showIns|col-timer)$/
      );
      b("timer", "ashow", function (Q, d) {
        f(!d);
      });
      b("timer", "button", f.bind(null, !1));
      b("timer", "session", f.bind(null, !1));
      b("timer", "scrfix", f.bind(null, !1));
      $(window).bind("resize", f.bind(null, !1));
      N(
        "vrc",
        "vrcSpeed",
        1,
        PROPERTY_VRCSPEED,
        [100, [0, 50, 100, 200, 500, 1e3], "∞ 20 10 5 2 1".split(" ")],
        1
      );
      N(
        "vrc",
        "vrcOri",
        1,
        PROPERTY_VRCORI,
        ["6,12", ["6,12", "10,11"], ["UF", "URF"]],
        1
      );
      N(
        "vrc",
        "vrcMP",
        1,
        PROPERTY_VRCMP,
        [
          "n",
          "n cfop fp cf4op cf4o2p2 roux".split(" "),
          PROPERTY_VRCMPS.split("|"),
        ],
        1
      );
      N(
        "vrc",
        "vrcAH",
        -2,
        PROPERTY_VRCAH,
        ["11", ["00", "01", "10", "11"], PROPERTY_VRCAHS.split("|")],
        1
      );
      N(
        "vrc",
        "giiMode",
        1,
        PROPERTY_GIIMODE,
        ["n", ["n", "t", "at"], PROPERTY_GIIMODES.split("|")],
        1
      );
      N(
        "vrc",
        "giiVRC",
        1,
        PROPERTY_GIIKERVRC,
        [
          "v",
          ["n", "v", "q", "ql", "q2"],
          ["None", "Virtual", "qCube", "qLast", "q2Look"],
        ],
        1
      );
      N(
        "vrc",
        "giiOri",
        1,
        PROPERTY_GIIORI,
        [
          "auto",
          "auto 0 3 2 1 4 5 6 7 23 14 19 8 17 10 21 12 11 22 13 18 15 16 9 20".split(
            " "
          ),
          "auto;(UF);(UR) y;(UB) y2;(UL) y';(DF) z2;(DL) z2 y;(DB) z2 y2;(DR) z2 y';(RF) z';(RD) z' y;(RB) z' y2;(RU) z' y';(LF) z;(LU) z y;(LB) z y2;(LD) z y';(BU) x';(BR) x' y;(BD) x' y2;(BL) x' y';(FD) x;(FR) x y;(FU) x y2;(FL) x y'".split(
            ";"
          ),
        ],
        1
      );
      N(
        "vrc",
        "giiSD",
        1,
        PROPERTY_GIISOK_DELAY,
        ["s", "2345ns".split(""), PROPERTY_GIISOK_DELAYS.split("|")],
        1
      );
      N("vrc", "giiSK", 0, PROPERTY_GIISOK_KEY, [!0], 1);
      N(
        "vrc",
        "giiSM",
        1,
        PROPERTY_GIISOK_MOVE,
        ["n", ["x4", "xi2", "n"], PROPERTY_GIISOK_MOVES.split("|")],
        1
      );
      N("vrc", "giiBS", 0, PROPERTY_GIISBEEP, [!0], 1);
      N("vrc", "giiRST", 1, PROPERTY_GIIRST, [
        "p",
        ["a", "p", "n"],
        PROPERTY_GIIRSTS.split("|"),
      ]);
      N("vrc", "giiAED", 0, PROPERTY_GIIAED, [!1]);
      N("timer", "useMouse", 0, PROPERTY_USEMOUSE, [!1], 1);
      N(
        "timer",
        "useIns",
        1,
        PROPERTY_USEINS,
        ["n", ["a", "ap", "b", "bp", "n"], PROPERTY_USEINS_STR.split("|")],
        1
      );
      N("timer", "showIns", 0, PROPERTY_SHOWINS, [!0], 1);
      N(
        "timer",
        "voiceIns",
        1,
        PROPERTY_VOICEINS,
        ["1", ["n", "1", "2"], PROPERTY_VOICEINS_STR.split("|")],
        1
      );
      N("timer", "voiceVol", 2, PROPERTY_VOICEVOL, [100, 1, 100], 1);
      N(
        "timer",
        "input",
        1,
        PROPERTY_ENTERING,
        ["t", "tismvgqbl".split(""), PROPERTY_ENTERING_STR.split("|")],
        1
      );
      N(
        "timer",
        "intUN",
        1,
        PROPERTY_INTUNIT,
        [
          20100,
          [1, 100, 1e3, 10001, 10100, 11e3, 20001, 20100, 21e3],
          "X X.XX X.XXX X:XX X:XX.XX X:XX.XXX X:XX:XX X:XX:XX.XX X:XX:XX.XXX".split(
            " "
          ),
        ],
        1
      );
      N(
        "timer",
        "timeU",
        1,
        PROPERTY_TIMEU,
        ["c", ["u", "c", "s", "i", "n"], PROPERTY_TIMEU_STR.split("|")],
        1
      );
      N(
        "timer",
        "preTime",
        1,
        PROPERTY_PRETIME,
        [300, [0, 300, 550, 1e3], ["0", "0.3", "0.55", "1"]],
        1
      );
      N("timer", "phases", 2, PROPERTY_PHASES, [1, 1, 10], 3);
      N("kernel", "showAvg", 0, SHOW_AVG_LABEL, [!0], 1);
      N(
        "kernel",
        "showDiff",
        1,
        SHOW_DIFF_LABEL,
        ["rg", ["rg", "gr", "b", "n"], SHOW_DIFF_LABEL_STR.split("|")],
        1
      );
      N("ui", "timerSize", 2, PROPERTY_TIMERSIZE, [20, 1, 100], 1);
      N("ui", "smallADP", 0, PROPERTY_SMALLADP, [!0], 1);
      A = kernel
        .getProp("col-timer", "#f00#0d0#dd0#080#f00")
        .match(/#[0-9a-fA-F]{3}/g);
    });
    var V;
    return {
      onkeydown: e,
      onkeyup: function (Q) {
        if (!n.isPop()) {
          var d = a(Q),
            l = $(document.activeElement);
          if (l.is("input, textarea, select"))
            if ("i" == t("input") && "inputTimer" == l.prop("id"))
              13 == d && timer.input.clear();
            else return;
          else l.blur();
          switch (t("input")) {
            case "t":
            case "l":
              W.onkeyup(d, Q);
              break;
            case "s":
              timer.stackmat.onkeyup(d, Q);
              break;
            case "b":
              timer.gan.onkeyup(d, Q);
              break;
            case "i":
              timer.input.onkeyup(d, Q);
          }
        }
      },
      showAvgDiv: P.showAvgDiv,
      refocus: function () {
        void 0 != V
          ? V.focus()
          : document.activeElement &&
            document.activeElement.blur &&
            document.activeElement.blur();
      },
      softESC: function () {
        e({ which: 29 });
      },
      checkUseIns: k,
      status: c,
      getCurTime: function (Q) {
        return 0 < q ? (Q || $.now()) - r : 0;
      },
      getStartTime: function () {
        return r || $.now();
      },
      setFobj: function (Q) {
        V = Q;
      },
      curTime: function (Q) {
        void 0 !== Q && (m = Q);
        return m;
      },
      startTime: function (Q) {
        void 0 !== Q && (r = Q);
        return r;
      },
      hardTime: function (Q) {
        void 0 !== Q && (H = Q);
        return H;
      },
      updateMulPhase: function (Q, d, l) {
        if (d < q) for (Q = q; Q > d; Q--) m[Q] = l - r;
        c(Math.min(d, q) || 1);
      },
      getBTDiv: function () {
        return O;
      },
      keyboard: W,
      lcd: J,
    };
  },
  [
    kernel.regListener,
    kernel.regProp,
    kernel.getProp,
    kernel.pretty,
    kernel.ui,
    kernel.pushSignal,
  ]
);
execMain(
  function (b) {
    var N = $('<textarea id="inputTimer" rows="1" />'),
      t = 0;
    $(function () {
      $("#lcd").after(N);
    });
    b.input = {
      setEnable: function (E) {
        E ? N.show() : N.hide();
        E
          ? (b.setFobj(N),
            N[0].select(),
            N.unbind("click").click(function () {
              N[0].select();
            }))
          : b.setFobj();
      },
      parseInput: function () {
        var E =
            /^\s*(?:[\d]+\. )?\(?(DNF)?\(?(\d*?):?(\d*?):?(\d*\.?\d*?)(\+)?\)?(?:=([\d:.+]+?))?(?:\[([^\]]+)\])?\)?\s*(?:   ([^@].*?))?(?:   @(.*?))?\s*$/,
          n = /^(\d*?):?(\d*?):?(\d*\.?\d*?)$/,
          C = N.val(),
          c = $.now();
        if (/^[\s\n]*$/.exec(C) && c > t + 500)
          kernel.pushSignal("ctrl", ["scramble", "next"]), (t = c);
        else
          for (C = C.split(/\s*[,\n]\s*/), c = 0; c < C.length; c++) {
            var k = E.exec(C[c]);
            if (null != k && "" != k[4]) {
              var g = ~~Math.round(
                36e5 * Math.floor(k[2]) +
                  6e4 * Math.floor(k[3]) +
                  1e3 * parseFloat(k[4])
              );
              if (!(0 >= g)) {
                if ("" == k[2] && "" == k[3] && /^\d+$/.exec(k[4])) {
                  var f = kernel.getProp("intUN") || 20100;
                  g = Math.floor(g / (f % 1e4));
                  var a = Math.floor(g / 1e7);
                  var e = Math.floor(g / 1e5) % 100;
                  var h = g % 1e5;
                  2e4 < f
                    ? (g = 6e4 * (60 * a + e) + h)
                    : 1e4 < f && (g = 6e4 * (100 * a + e) + h);
                }
                "DNF" == k[1]
                  ? (f = -1)
                  : "+" == k[5] && 2e3 < g
                  ? ((f = 2e3), (g -= 2e3))
                  : (f = 0);
                a = [];
                if (k[6]) {
                  a = k[6].split("+").reverse();
                  e = g;
                  for (h = 0; h < a.length; h++) {
                    var p = n.exec(a[h]);
                    if (null == p) {
                      e = 1e8;
                      break;
                    }
                    e -= Math.round(
                      36e5 * Math.floor(p[1]) +
                        6e4 * Math.floor(p[2]) +
                        1e3 * parseFloat(p[3])
                    );
                    a[h] = Math.max(0, e);
                  }
                  Math.abs(e) > 10 * a.length ? (a = []) : a.pop();
                }
                e = k[7] || "";
                h = k[8];
                g = [e, h, [f, g].concat(a)];
                (k = mathlib.str2time(k[9])) && g.push(k);
                b.curTime(g);
                kernel.pushSignal("time", g);
                kernel.clrKey();
              }
            }
          }
        N.val("");
      },
      onkeydown: function (E, n) {
        if (28 != E) {
          n = b.keyboard.detectTrigger(E, 0, n);
          var C = $.now();
          !b.checkUseIns() ||
            200 > C - 0 ||
            (-3 == b.status() || 27 == E
              ? (b.status(n ? 0 : -1), b.lcd.fixDisplay(!1, !1))
              : n && -1 == b.status() && b.status(-4),
            b.lcd.fixDisplay(!0, n),
            n && kernel.clrKey());
        }
      },
      onkeyup: function (E, n) {
        a: {
          E = b.keyboard.detectTrigger(E, 1, n);
          n = $.now();
          if (b.checkUseIns()) {
            if (E)
              if (0 == b.status()) b.status(-1);
              else if (-1 == b.status() || -3 == b.status()) {
                if (500 > n - 0) {
                  b.lcd.fixDisplay(!1, E);
                  E = void 0;
                  break a;
                }
              } else -4 == b.status() && (b.startTime(n), b.status(-3));
            b.lcd.fixDisplay(!1, E);
            E && kernel.clrKey();
          }
          E = void 0;
        }
        return E;
      },
      clear: function () {
        N.val("");
      },
    };
  },
  [timer]
);
execMain(
  function (b) {
    function N(C) {
      if (t) {
        var c = $.now();
        if (C.on) {
          b.hardTime(C.time_milli);
          b.lcd.renderUtil();
          if (C.running) {
            if (-3 == b.status() || -4 == b.status())
              (n = c - b.startTime() - b.hardTime()), b.lcd.reset();
            b.curTime([0]);
            b.status(1);
            b.startTime(c - b.hardTime());
            b.lcd.fixDisplay(!1, !0);
          } else
            -1 != b.status() ||
            !b.checkUseIns() ||
            0 != b.hardTime() ||
            ("R" != C.signalHeader && "L" != C.signalHeader)
              ? -3 != b.status() &&
                -4 != b.status() &&
                (b.status(-1), b.lcd.fixDisplay(!1, !0))
              : (b.status(-3), b.startTime(c), b.lcd.fixDisplay(!1, !0));
          E.running &&
            !C.running &&
            0 != C.time_milli &&
            ((n = b.checkUseIns() ? (17e3 < n ? -1 : 15e3 < n ? 2e3 : 0) : 0),
            b.curTime([n, ~~b.hardTime()]),
            kernel.pushSignal("time", b.curTime()));
          C.greenLight
            ? b.lcd.color("g")
            : C.rightHand && C.leftHand
            ? b.lcd.color("r")
            : -4 == b.status()
            ? b.lcd.color("g")
            : b.lcd.color("");
          b.lcd.setRunning(
            -3 == b.status() || (C.running && 67 != C.signalHeader)
          );
        } else b.hardTime(null), b.status(-1), b.lcd.fixDisplay(!1, !0);
        E = C;
      }
    }
    var t = !1,
      E = {},
      n;
    b.stackmat = {
      setEnable: function (C) {
        (t = "s" == C || "m" == C)
          ? (stackmatutil.setCallBack(N),
            stackmatutil.init(C, !1).then($.noop, function () {
              kernel.showDialog(
                [
                  $("<div>Press OK To Connect To Stackmat</div>"),
                  function () {
                    stackmatutil.init(C, !0).then($.noop, console.log);
                  },
                  0,
                  0,
                ],
                "share",
                "Stackmat Connect"
              );
            }))
          : stackmatutil.stop();
      },
      onkeyup: function (C) {
        var c = $.now();
        32 == C &&
          -4 == b.status() &&
          (b.status(-3),
          b.lcd.reset(),
          b.startTime(c),
          b.lcd.fixDisplay(!1, 32 == C));
        32 == C && kernel.clrKey();
      },
      onkeydown: function (C) {
        var c = $.now();
        32 == C &&
        -1 == b.status() &&
        b.checkUseIns() &&
        E.on &&
        0 == E.time_milli
          ? (b.status(-4), b.startTime(c), b.lcd.fixDisplay(!0, !0))
          : 27 == C &&
            -1 >= b.status() &&
            (b.status(-1), b.lcd.fixDisplay(!0, !1));
        32 == C && kernel.clrKey();
      },
    };
  },
  [timer]
);
execMain(
  function (b) {
    function N(k) {
      if (C)
        switch (
          (DEBUG &&
            console.log(
              "[gantimer] timer event received",
              GanTimerState[k.state],
              k
            ),
          k.state)
        ) {
          case GanTimerState.HANDS_ON:
            b.lcd.color("r");
            break;
          case GanTimerState.HANDS_OFF:
            b.lcd.fixDisplay(!1, !0);
            break;
          case GanTimerState.GET_SET:
            b.lcd.color("g");
            break;
          case GanTimerState.IDLE:
            c = 0;
            0 < b.hardTime() || -1 != b.status()
              ? (b.hardTime(0),
                b.status(-1),
                b.lcd.reset(),
                b.lcd.fixDisplay(!1, !0))
              : -1 == b.status() &&
                b.checkUseIns() &&
                (b.status(-3), b.startTime($.now()), b.lcd.fixDisplay(!1, !0));
            b.lcd.renderUtil();
            break;
          case GanTimerState.RUNNING:
            -3 == b.status() &&
              ((c = $.now() - b.startTime()),
              (c = b.checkUseIns() ? (17e3 < c ? -1 : 15e3 < c ? 2e3 : 0) : 0));
            b.startTime($.now());
            b.lcd.reset();
            b.curTime([c]);
            b.status(1);
            b.lcd.fixDisplay(!1, !0);
            break;
          case GanTimerState.STOPPED:
            b.hardTime(k.recordedTime.asTimestamp);
            b.curTime()[1] = b.hardTime();
            b.status(-1);
            b.lcd.renderUtil();
            b.lcd.fixDisplay(!1, !0);
            kernel.pushSignal("time", b.curTime());
            break;
          case GanTimerState.DISCONNECT:
            b.hardTime(null),
              b.status(-1),
              b.lcd.renderUtil(),
              b.lcd.fixDisplay(!1, !0),
              t();
        }
    }
    function t() {
      $.delayExec(
        "ganTimerReconnect",
        function () {
          DEBUG &&
            console.log("[gantimer] attempting to reconnect timer device");
          E(!0);
        },
        2500
      );
    }
    function E(k) {
      GanTimerDriver.connect(k)
        .then(function () {
          DEBUG &&
            console.log("[gantimer] timer device successfully connected");
          GanTimerDriver.setStateUpdateCallback(N);
          b.hardTime(0);
          b.status(-1);
          b.lcd.reset();
          b.lcd.renderUtil();
          b.lcd.fixDisplay(!1, !0);
        })
        .catch(function (g) {
          DEBUG && console.log("[gantimer] failed to connect to timer", g);
          k || alert(g);
        });
    }
    function n() {
      var k = $("<div>")
          .addClass("click")
          .append(
            "If you have enabled WCA inspection in settings,<br>use GAN logo button right on the timer to start/cancel inspection."
          ),
        g = $("<div>")
          .append("<br><br>")
          .append("<b>Press OK to connect to GAN Smart Timer</b>")
          .append("<br><br>")
          .append(k)
          .append(b.getBTDiv());
      GanTimerDriver.disconnect().then(function () {
        kernel.showDialog(
          [
            g,
            function () {
              E();
            },
            0,
            0,
          ],
          "share",
          "GAN Smart Timer"
        );
      });
    }
    var C = !1,
      c = 0;
    b.gan = {
      setEnable: function (k) {
        (C = "b" == k) ? (b.hardTime(null), n()) : GanTimerDriver.disconnect();
      },
      onkeyup: function (k) {
        32 != k || GanTimerDriver.isConnected() || n();
      },
      onkeydown: $.noop,
    };
  },
  [timer]
);
execMain(
  function (b) {
    function N(u, I, z) {
      if (1 != I) {
        z = z || $.now();
        if (-3 == b.status() || -2 == b.status()) {
          if (k.isRotation(u) && !/^(333ni|444bld|555bld)$/.exec(m)) {
            0 == I && h[0].push([k.move2str(u), 0]);
            return;
          }
          f = b.checkUseIns() ? z - b.startTime() : 0;
          b.startTime(z);
          a = 0;
          b.curTime([17e3 < f ? -1 : 15e3 < f ? 2e3 : 0]);
          b.status(
            3 == r && "r3" != m
              ? cubeutil.getStepCount(kernel.getProp("vrcMP", "n"))
              : 1
          );
          var O = h[0];
          h = [];
          for (var J = 0; J < b.status(); J++) h[J] = [];
          h[b.status()] = O;
          e = b.status();
          b.updateMulPhase(e, k.isSolved(kernel.getProp("vrcMP", "n")), z);
          E();
          b.lcd.fixDisplay(!1, !0);
        }
        if (1 <= b.status()) {
          /^(333ni|444bld|555bld)$/.exec(m) &&
            !k.isRotation(u) &&
            k.toggleColorVisible(0 == k.isSolved(kernel.getProp("vrcMP", "n")));
          0 == I && h[b.status() - 1].push([k.move2str(u), z - b.startTime()]);
          if (2 == I) {
            var P = k.isSolved(kernel.getProp("vrcMP", "n"));
            b.updateMulPhase(e, P, z);
            E();
          }
          2 == I &&
            0 == P &&
            ((a += k.moveCnt()),
            /^r\d+$/.exec(m) && 0 != p.length
              ? ("r3" != m && r++, t(!0), n())
              : (b.lcd.setStaticAppend(""),
                b.status(-1),
                $("#lcd").css({ visibility: "unset" }),
                b.lcd.fixDisplay(!1, !0),
                h.reverse(),
                kernel.pushSignal("time", [
                  "",
                  0,
                  b.curTime(),
                  0,
                  [
                    $.map(h, cubeutil.moveSeq2str).filter($.trim).join(" "),
                    H,
                    a,
                  ],
                ])));
        }
      }
    }
    function t(u) {
      if ((!A || kernel.getProp("input") != g) && v) {
        A = !0;
        g = kernel.getProp("input");
        var I = r;
        I || (I = 3);
        I = { puzzle: "cube" + I, allowDragging: !0 };
        /^udpoly$/.exec(H)
          ? ((I.puzzle = H), (I.scramble = p))
          : puzzleFactory.twistyre.exec(H) && (I.puzzle = H);
        I.style = kernel.getProp("input");
        puzzleFactory.init(I, N, w, function (z, O) {
          k = z;
          O && !k && (w.css("height", ""), w.html("--:--"));
          if (!u || O)
            b.lcd.setStaticAppend(""),
              b.lcd.fixDisplay(!1, !0),
              b.lcd.renderUtil(),
              c(kernel.getProp("timerSize"));
        });
      }
    }
    function E() {
      /^r\d+$/.exec(m) &&
        (b.lcd.setStaticAppend(p.length + 1 + "/" + q.length),
        b.lcd.renderUtil());
    }
    function n() {
      t();
      var u = p;
      /^r\d+$/.exec(m) && ((u = p.shift().match(/\d+\) (.*)$/)[1]), E());
      u = k.parseScramble(u, !0);
      A = !1;
      k.applyMoves(u);
      k.moveCnt(!0);
      h = [[]];
    }
    function C(u, I) {
      if ("scramble" == u || "scrambleX" == u) {
        m = I[0];
        p = I[1];
        u = tools.puzzleType(m);
        var z = y.indexOf(u);
        "cubennn" == u && (z = I[2]);
        (-1 == z && !puzzleFactory.twistyre.exec(u)) ||
          (r == z && H == u) ||
          ((r = z), (H = u), (A = !1), t());
        (I = /^r(\d)\d*$/.exec(m))
          ? ((q = p.split("\n")), r != ~~I[1] && ((r = ~~I[1]), (A = !1), t()))
          : (q = null);
      }
    }
    function c(u) {
      w.css("height", (u * $("#logo").width()) / 9 + "px");
      k && k.resize();
    }
    var k,
      g = "",
      f = 0,
      a = 0,
      e = 1,
      h = [],
      p,
      q,
      m,
      r,
      H,
      y = "  222 333 444 555 666 777 888 999 101010 111111".split(" "),
      A = !1,
      w = $("<div />"),
      v = !1;
    $(function () {
      kernel.regListener("timer", "scramble", C);
      kernel.regListener("timer", "scrambleX", C);
      w.appendTo("#container");
    });
    b.virtual = {
      onkeydown: function (u) {
        if (void 0 != k) {
          var I = $.now();
          if (-1 == b.status())
            32 == u &&
              (q && (p = q.slice()),
              n(),
              b.checkUseIns()
                ? (b.startTime(I), b.status(-3))
                : (b.lcd.val(0), b.status(-2)),
              $("#lcd").css({ visibility: "hidden" }),
              b.lcd.fixDisplay(!1, !0));
          else if (-3 == b.status() || -2 == b.status() || 1 <= b.status())
            if (27 == u || 28 == u) {
              var z = 1 <= b.status();
              b.lcd.setStaticAppend("");
              b.status(-1);
              t();
              $("#lcd").css({ visibility: "unset" });
              b.lcd.fixDisplay(!1, !0);
              z &&
                (h.reverse(),
                kernel.pushSignal("time", [
                  "",
                  0,
                  [-1, I - b.startTime()],
                  0,
                  [
                    $.map(h, cubeutil.moveSeq2str).filter($.trim).join(" "),
                    H,
                    a,
                  ],
                ]));
            } else (I = { keyCode: help.getMappedCode(u) }), k.keydown(I);
          (27 != u && 32 != u) || kernel.clrKey();
        }
      },
      setEnable: function (u) {
        (v = u) ? w.show() : (w.hide(), (A = !1));
      },
      setSize: c,
      reset: t,
    };
  },
  [timer]
);
execMain(
  function (b) {
    function N() {
      g && (clearTimeout(g), (g = 0));
      f && (clearTimeout(f), (f = 0));
    }
    function t(r, H, y) {
      var A = y[1] || $.now(),
        w = p;
      p = r;
      if (c) {
        k && m.setState(r, H, !1);
        N();
        var v = kernel.getProp("vrcMP", "n");
        if (-1 == b.status()) {
          if (p != mathlib.SOLVED_FACELET || "n" != kernel.getProp("giiMode")) {
            var u = kernel.getProp("giiSD");
            "s" == u
              ? giikerutil.checkScramble() && n(A)
              : "n" != u &&
                (g = setTimeout(function () {
                  n(A);
                }, 1e3 * ~~u));
            u = kernel.getProp("giiSM");
            "n" != u &&
              {
                x4: /^([URFDLB][ '])\1\1\1/,
                xi2: /^([URFDLB])( \1'\1 \1'|'\1 \1'\1 )/,
              }[u].exec(H.join("")) &&
              (f = setTimeout(function () {
                n(A);
              }, 1e3));
          }
        } else if (-3 == b.status() || -2 == b.status()) {
          a = b.checkUseIns() ? A - b.startTime() : 0;
          b.startTime(A);
          b.curTime([17e3 < a ? -1 : 15e3 < a ? 2e3 : 0]);
          b.status(cubeutil.getStepCount(v));
          q = [];
          for (u = 0; u < b.status(); u++) q[u] = [];
          h = b.status();
          u = cubeutil.getProgress(w, v);
          b.updateMulPhase(h, u, A);
          b.lcd.reset(k);
          b.lcd.fixDisplay(!1, !0);
        }
        if (
          1 <= b.status() &&
          (0 < H.length && q[b.status() - 1].push([H[0], y[0], y[1]]),
          (r = cubeutil.getProgress(r, v)),
          b.updateMulPhase(h, r, A),
          E(p))
        )
          if (
            (q.reverse(),
            (v = cubeutil.getPrettyReconstruction(q, v)),
            giikerutil.setLastSolve(v.prettySolve),
            (b.curTime()[1] = A - b.startTime()),
            b.status(-1),
            giikerutil.reSync(),
            b.lcd.fixDisplay(!1, !0),
            0 != b.curTime()[1])
          ) {
            v = giikerutil.tsLinearFix(q.flat());
            r = 0;
            DEBUG && console.log("time fit, old=", b.curTime());
            for (u = 0; u < q.length; u++)
              (r += q[u].length),
                (b.curTime()[q.length - u] = 0 == r ? 0 : v[r - 1][1]);
            DEBUG && console.log("time fit, new=", b.curTime());
            v = cubeutil.getConjMoves(cubeutil.moveSeq2str(v), !0);
            kernel.pushSignal("time", ["", 0, b.curTime(), 0, [v, "333"]]);
          } else
            "n" != kernel.getProp("giiMode") &&
              kernel.pushSignal("ctrl", ["scramble", "next"]);
      }
    }
    function E(r) {
      if ("n" != kernel.getProp("giiMode")) {
        var H = {
          coll: "cpll",
          cmll: "cmll",
          oll: "oll",
          eols: "oll",
          wvls: "oll",
          zbls: "eoll",
        }[(tools.getCurScramble() || [])[0]];
        if (H) return 0 == cubeutil.getStepProgress(H, r);
      }
      return r == mathlib.SOLVED_FACELET;
    }
    function n(r) {
      N();
      if (-1 == b.status()) {
        if ("n" == kernel.getProp("giiMode")) {
          if (!giikerutil.checkScramble()) {
            var H = scramble_333.genFacelet(p);
            kernel.pushSignal("scramble", [
              "333",
              cubeutil.getConjMoves(H, !0),
              0,
            ]);
          }
          giikerutil.markScrambled();
        } else giikerutil.markScrambled(!0);
        b.status(-2);
        b.startTime(r);
        b.lcd.reset(k);
        b.lcd.fixDisplay(!0, !0);
        kernel.getProp("giiBS") && metronome.playTick();
      }
    }
    function C(r) {
      (k = r) ? e.show() : e.hide();
      r && m.resetVRC(!0, !0);
    }
    var c = !1,
      k = !1,
      g = 0,
      f = 0,
      a = 0,
      e = $("<div />"),
      h = 1,
      p = mathlib.SOLVED_FACELET,
      q = [],
      m = (function () {
        function r(z, O) {
          (A && !O) ||
            !k ||
            ((O = { puzzle: "cube3", style: kernel.getProp("giiVRC") }),
            puzzleFactory.init(O, $.noop, e, function (J, P) {
              u = J;
              P && !u && (e.css("height", ""), e.html("--:--"));
              if (!z || P)
                b.lcd.fixDisplay(!1, !0), H(kernel.getProp("timerSize"));
              w.fromFacelet(mathlib.SOLVED_FACELET);
              if (u) {
                J = u.parseScramble("U2 U2", !0);
                for (P = w.ori = 0; P < J.length; P++)
                  w.selfMoveStr(u.move2str(J[P]));
                u.applyMoves(J);
                J = kernel.getProp("giiOri");
                y("auto" == J ? -1 : ~~J);
              }
            }),
            (A = !0));
        }
        function H(z) {
          e.css("height", (z * $("#logo").width()) / 9 + "px");
          u && u.resize();
        }
        function y(z) {
          I = z;
          if (-1 != I && w.ori != I) {
            z =
              mathlib.CubieCube.rot2str[
                mathlib.CubieCube.rotMulI[I][w.ori]
              ].split(/\s+/);
            for (var O = 0; O < z.length; O++) w.selfMoveStr(z[O]);
            u.applyMoves(u.parseScramble(z.join(" ")));
          }
        }
        var A = !1,
          w = new mathlib.CubieCube(),
          v = new mathlib.CubieCube(),
          u,
          I = -1;
        return {
          resetVRC: r,
          setState: function (z, O, J) {
            if (void 0 != u && k) {
              v.fromFacelet(z);
              J = [];
              for (var P = !0, W = 0; W < O.length; W++)
                if ((J.push(O[W]), v.selfMoveStr(O[W], !0), v.isEqual(w))) {
                  P = !1;
                  break;
                }
              P
                ? (r(!1),
                  w.fromFacelet(mathlib.SOLVED_FACELET),
                  (J = scramble_333.genFacelet(z)))
                : (J = J.reverse().join(" "));
              O =
                J.match(/^\s*$/) || !u
                  ? []
                  : u.parseScramble(cubeutil.getConjMoves(J, !0, w.ori));
              5 > O.length ? u.addMoves(O) : u.applyMoves(O);
              A = !1;
              w.fromFacelet(z);
            }
          },
          setOri: y,
          setSize: H,
        };
      })();
    $(function () {
      e.appendTo("#container");
      kernel.regListener(
        "giikerVRC",
        "property",
        function (r, H) {
          k && (m.resetVRC(!0, !0), m.setState(p, ["U2", "U2"], !1));
        },
        /^(?:preScrT?|isTrainScr|giiOri)$/
      );
      kernel.regListener("giikerVRC", "scramble", function (r, H) {
        k &&
          -1 == b.status() &&
          "at" == kernel.getProp("giiMode") &&
          GiikerCube.isConnected() &&
          (N(),
          (g = setTimeout(function () {
            n($.now());
          }, 500)));
      });
    });
    b.giiker = {
      setEnable: function (r) {
        (c = "g" == r) && !GiikerCube.isConnected()
          ? (giikerutil.setCallback(t),
            kernel.showDialog(
              [
                $("<div>Press OK To Connect To Bluetooth Cube</div>").append(
                  b.getBTDiv()
                ),
                function () {
                  giikerutil.init().catch(function (H) {
                    DEBUG && console.log("[giiker] init failed", H);
                  });
                },
                0,
                0,
              ],
              "share",
              "Bluetooth Connect"
            ))
          : c || giikerutil.stop();
        C(c && "n" != kernel.getProp("giiVRC"));
      },
      onkeydown: function (r) {
        $.now();
        if (27 == r || 28 == r) {
          if (
            ((r = 1 <= b.status()),
            N(),
            b.status(-1),
            giikerutil.reSync(),
            b.lcd.fixDisplay(!1, !0),
            r)
          ) {
            b.curTime()[0] = -1;
            q.reverse();
            r = giikerutil.tsLinearFix(q.flat());
            var H = 0;
            DEBUG && console.log("time fit, old=", b.curTime());
            for (var y = 0; y < q.length; y++)
              (H += q[y].length),
                (b.curTime()[q.length - y] = 0 == H ? 0 : r[H - 1][1]);
            DEBUG && console.log("time fit, new=", b.curTime());
            r = cubeutil.getConjMoves(cubeutil.moveSeq2str(r), !0);
            kernel.pushSignal("time", ["", 0, b.curTime(), 0, [r, "333"]]);
          }
        } else
          32 != r ||
            -1 != b.status() ||
            !kernel.getProp("giiSK") ||
            (p == mathlib.SOLVED_FACELET && "n" == kernel.getProp("giiMode")) ||
            n($.now());
      },
      setVRC: C,
      setSize: m.setSize,
    };
  },
  [timer]
);
var ftosolver = (function () {
  function b(U, ba, la, ka, Aa) {
    this.cp = (U && U.slice()) || [0, 1, 2, 3, 4, 5];
    this.co = (ba && ba.slice()) || [0, 0, 0, 0, 0, 0];
    this.ep = (la && la.slice()) || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    this.uf = (ka && ka.slice()) || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    this.rl = (Aa && Aa.slice()) || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }
  function N(U, ba, la) {
    var ka = [];
    U = b.moveCube[la][U];
    for (la = 0; 12 > la; la++) ka[la] = ba[U[la]];
    return ka;
  }
  function t(U, ba) {
    return b.FtoMult(U, b.moveCube[ba], null);
  }
  function E(U) {
    for (var ba = 0, la = -1, ka = 0; 12 > ka; ka++)
      0 != ((56 >> U[ka]) & 1) &&
        (-1 == la && (la = U[ka]),
        (ba += (((U[ka] - la + 3) % 3) + 1) << (2 * ka)));
    return ba;
  }
  function n(U) {
    for (var ba = 0, la = 0; 12 > la; la++) 3 > U[la] && (ba |= 1 << la);
    return ba;
  }
  function C(U) {
    for (
      var ba = [0, 1, 2, 3, 3, 3, 0, 1, 1, 2, 2, 0],
        la = [
          [0, 6, 11],
          [1, 7, 8],
          [2, 9, 10],
          [3, 4, 5],
        ],
        ka = 0,
        Aa = [-1, -1, -1, -1],
        Da = 0;
      12 > Da;
      Da++
    ) {
      var Ha = ba[U[Da]],
        Ma = la[Ha].indexOf(U[Da]);
      -1 == Aa[Ha] && (Aa[Ha] = Ma);
      ka += (4 * Ha + ((Ma - Aa[Ha] + 3) % 3)) * Math.pow(16, Da);
    }
    return ka;
  }
  function c(U) {
    for (var ba = 0, la = 0; 12 > la; la++) ba |= ~~(U[la] / 3) << (2 * la);
    return ba;
  }
  function k(U) {
    return String.fromCharCode.apply(null, U);
  }
  function g(U) {
    return String.fromCharCode.apply(null, [].concat(U.cp, U.co));
  }
  function f(U) {
    for (var ba = [], la = new b(), ka = new b(), Aa = 0; Aa < U.length; Aa++) {
      ba[Aa] = 1 << Aa;
      for (var Da = 0; Da < Aa; Da++)
        b.FtoMult(b.moveCube[U[Aa]], b.moveCube[U[Da]], la),
          b.FtoMult(b.moveCube[U[Da]], b.moveCube[U[Aa]], ka),
          la.isEqual(ka) && (ba[Aa] |= 1 << Da);
    }
    return ba;
  }
  function a() {
    var U = new b();
    J = mathlib.createMoveHash(U.ep.slice(), O, E, N.bind(null, "ep"));
    P = mathlib.createMoveHash(U.rl.slice(), O, n, N.bind(null, "rl"));
    var ba = J[0][0].length;
    U = P[0][0].length;
    DEBUG && console.log("p1ep len=" + ba + " p1rl len=" + U);
    W = f(O);
    var la = [];
    mathlib.createPrun(
      la,
      0,
      ba * U,
      14,
      function (ka, Aa) {
        return P[0][Aa][~~(ka / ba)] * ba + J[0][Aa][ka % ba];
      },
      O.length,
      2
    );
    X = new mathlib.Searcher(
      null,
      function (ka) {
        return mathlib.getPruning(la, ka[1] * ba + ka[0]);
      },
      function (ka, Aa) {
        return [J[0][Aa][ka[0]], P[0][Aa][ka[1]]];
      },
      8,
      2,
      W
    );
  }
  function e(U) {
    for (
      var ba = [], la = [], ka = new b(), Aa = new b(), Da = 0;
      12 > Da;
      Da += 3
    ) {
      b.FtoMult(b.symCube[Da % 12], U, ka);
      var Ha;
      for (
        Ha = 0;
        12 > Ha && (b.FtoMult(ka, b.symCube[Ha], Aa), 4 != Aa.ep[4]);
        Ha++
      );
      ba.push([J[1][E(Aa.ep)], P[1][n(Aa.rl)]]);
      la.push([Da, Ha]);
    }
    return [ba, la];
  }
  function h(U) {
    X || a();
    var ba = $.now(),
      la = e(U),
      ka = la[1];
    la = la[0];
    var Aa = [];
    X.solveMulti(la, 0, 12, function (Da, Ha) {
      Da = Da.slice();
      Ha = ka[Ha].slice();
      for (var Ma = U, da = 0; da < Da.length; da++)
        Da[da] = O[Da[da][0]] + Da[da][1];
      da = 0;
      var wa = [];
      for (
        var ha = [4, 5, 3, 2], Ea = [1, 10, 5, 11], Ka = 0;
        Ka < Da.length;
        Ka++
      ) {
        var Qa = 0,
          ia = Da[Ka] >> 1,
          oa = Da[Ka] & 1;
        8 <= ia && ((Qa = Ea[ia - 8]), (ia = ha[ia - 8]));
        oa || (Qa = b.symMult[Qa][Qa]);
        wa.push(2 * b.symMulM[da][ia] + oa);
        da = b.symMult[Qa][da];
      }
      wa = [wa, da];
      for (da = 0; da < wa[0].length; da++)
        (ha = wa[0][da]),
          (Da[da] = 2 * b.symMulM[b.symMulI[0][Ha[1]]][ha >> 1] + (ha & 1)),
          (Ma = b.FtoMult(Ma, b.moveCube[Da[da]], null));
      Ha[1] = b.symMulI[Ha[1]][wa[1]];
      Ma = b.FtoMult(
        V[~~(Ha[0] / 12)],
        b.symCube[Ha[0] % 12],
        Ma,
        b.symCube[Ha[1]],
        null
      );
      Aa.push([Ma, Da, Ha[0], Ha[1]]);
      return 1e3 <= Aa.length;
    });
    ba = $.now() - ba;
    for (la = 0; la < Aa.length; la++) Aa[la].push(ba);
    return Aa;
  }
  function p(U) {
    var ba = String.fromCharCode.apply(null, [].concat(U.cp, U.co));
    if (!(ba in R)) {
      for (var la = [], ka = 0; 6 > ka; ka++) la[ka] = 2 * U.co[ka];
      ka = U.toFaceCube();
      mathlib.fillFacelet(Z, ka, U.cp, la, 9);
      U = new b().fromFacelet(ka);
      R[ba] = c(U.uf);
    }
    return ba;
  }
  function q(U, ba) {
    for (var la = U[0], ka = -1, Aa = 1; 12 > Aa; Aa++)
      if (U[Aa] != la) {
        ka = U[Aa];
        break;
      }
    ba = ba[4 * la + ka];
    for (Aa = 0; 12 > Aa; Aa++) U[Aa] = ~~(b.symCube[ba].uf[3 * U[Aa]] / 3);
    return ba;
  }
  function m() {
    var U = new b();
    l = mathlib.createMoveHash(U.ep.slice(), d, C, N.bind(null, "ep"));
    D = mathlib.createMoveHash(U.rl.slice(), d, c, N.bind(null, "rl"));
    x = mathlib.createMoveHash(U, d, p, t);
    var ba = [],
      la = [],
      ka = [[], [], [], [], []],
      Aa = [],
      Da = [];
    for (U = 0; 12 > U; U++) {
      var Ha = b.symCube[U].uf,
        Ma = ~~(Ha.indexOf(0) / 3);
      Ha = ~~(Ha.indexOf(3) / 3);
      F[4 * Ma + Ha] = U;
      Da[U] = [];
    }
    Ma = 0;
    a: for (; 42e3 > Ma; Ma++) {
      S.set(ba, Ma);
      for (U = 1; 12 > U; U++)
        if (1 < ba[U]) continue a;
        else if (1 == ba[U]) break;
      M[Ma] = K.length;
      K.push(Ma);
    }
    for (Ma = 0; Ma < K.length; Ma++) {
      S.set(ba, K[Ma]);
      for (U = Ha = 0; 12 > U; U++) Ha |= ba[U] << (2 * U);
      Aa[Ma] = Ha;
      for (U = 0; U < d.length; U++)
        mathlib.permOriMult(ba, b.moveCube[d[U]].uf, la),
          (Ha = q(la, F)),
          (ka[U][Ma] = (M[S.get(la)] << 4) | Ha);
    }
    var da = [],
      wa;
    for (wa in x[1])
      for (ba = x[1][wa], da[ba] = R[wa], la = [], U = 0; 12 > U; U++) {
        Ha = b.symCube[U];
        for (Ma = 0; 6 > Ma; Ma++) {
          var ha = wa.charCodeAt(Ma);
          la[Ma] = Ha.cp[ha];
          la[Ma + 6] = Ha.co[ha] ^ wa.charCodeAt(Ma + 6);
        }
        Ha = String.fromCharCode.apply(null, la);
        Da[U][ba] = x[1][Ha];
      }
    var Ea = [
        0, 99, 3, 4, 5, 6, 8, 99, 2, 3, 4, 5, 6, 8, 1, 3, 4, 5, 6, 7, 8, 1, 3,
        4, 5, 6, 7, 9, 99, 2, 3, 4, 5, 6, 8, 2, 2, 4, 4, 5, 6, 8, 3, 3, 4, 5, 6,
        7, 8, 3, 3, 4, 5, 6, 7, 9, 3, 3, 4, 5, 6, 7, 8, 4, 4, 4, 5, 6, 7, 8, 4,
        4, 5, 6, 7, 8, 9, 4, 4, 5, 6, 7, 8, 9, 4, 4, 5, 6, 7, 8, 9, 4, 4, 5, 6,
        7, 8, 9, 5, 5, 6, 7, 8, 9, 10, 5, 5, 6, 7, 8, 9, 10,
      ],
      Ka = l[0][0].length,
      Qa = [];
    mathlib.createPrun(
      Qa,
      0,
      Ka * D[0][0].length,
      9,
      function (ia, oa) {
        return D[0][oa][~~(ia / Ka)] * Ka + l[0][oa][ia % Ka];
      },
      d.length,
      2
    );
    G = f(d);
    L = new mathlib.Searcher(
      null,
      function (ia) {
        var oa = Aa[ia[3] >> 4] ^ da[Da[ia[3] & 15][ia[2]]];
        oa = (oa | (oa >> 1)) & 5592405;
        oa =
          7 *
            ((mathlib.bitCount(oa & 63) << 2) |
              mathlib.bitCount(oa & 12632256)) +
          mathlib.bitCount(oa & 4144896);
        return Math.max(
          Math.min(11, mathlib.getPruning(Qa, ia[1] * Ka + ia[0])),
          Ea[oa]
        );
      },
      function (ia, oa) {
        var ma = ka[oa][ia[3] >> 4];
        return [
          l[0][oa][ia[0]],
          D[0][oa][ia[1]],
          x[0][oa][ia[2]],
          (ma & -16) | b.symMult[ma & 15][ia[3] & 15],
        ];
      },
      d.length,
      2,
      G
    );
  }
  function r() {
    var U = new b();
    ea = mathlib.createMoveHash(U.ep.slice(), fa, k, N.bind(null, "ep"));
    va = mathlib.createMoveHash(new b(), fa, g, t);
    ra = [];
    ya = [];
    mathlib.createPrun(ra, 0, 81, 14, ea[0], 4, 2);
    mathlib.createPrun(ya, 0, 11520, 14, va[0], 4, 2);
    Ba = f(fa);
    sa = new mathlib.Searcher(
      null,
      function (ba) {
        return Math.max(
          mathlib.getPruning(ra, ba[0]),
          mathlib.getPruning(ya, ba[1])
        );
      },
      function (ba, la) {
        return [ea[0][la][ba[0]], va[0][la][ba[1]]];
      },
      4,
      2,
      Ba
    );
  }
  function H(U, ba) {
    for (var la = 0; la < ba.length; la++)
      U = b.FtoMult(U, b.moveCube[ba[la]], null);
    return U;
  }
  function y(U) {
    for (var ba = [], la = 0; la < U.length; la++) ba[la] = ta[U[la]];
    return ba.join(" ").replace(/l/g, "BL").replace(/r/g, "BR");
  }
  function A() {}
  function w(U) {
    U = U || 100;
    for (var ba = [], la = 0; la < U; la++) {
      var ka = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      var Aa = [];
      for (var Da = 0; 200 > Da; Da++)
        Aa.push(ka[~~(Math.random() * ka.length)]);
      ka = new b();
      for (Da = 0; Da < Aa.length; Da++)
        ka = b.FtoMult(ka, b.moveCube[Aa[Da]], null);
      ka = [ka, Aa];
      Aa = y(ka[1].slice());
      Da = na.solveFto(ka[0]);
      ka = ka[0];
      DEBUG && console.log("scrambled state\n", ka.toString(1));
      ka = H(ka, na.sol1);
      DEBUG &&
        console.log("after phase 1 (" + y(na.sol1) + "):\n", ka.toString(1));
      ka = H(ka, na.sol2);
      DEBUG &&
        console.log("after phase 2 (" + y(na.sol2) + "):\n", ka.toString(1));
      ka = H(ka, na.sol3);
      DEBUG &&
        console.log("after phase 3 (" + y(na.sol3) + "):\n", ka.toString(1));
      ka = ka.toFaceCube();
      var Ha = !0,
        Ma = 0;
      a: for (; 8 > Ma; Ma++)
        for (var da = 1; 9 > da; da++)
          if (ka[9 * Ma + da] != ka[9 * Ma]) {
            Ha = !1;
            break a;
          }
      Ha || console.log("error, FTO not solved!!!");
      DEBUG && console.log(Aa, Da);
      Aa = [
        na.sol1.length + na.sol2.length + na.sol3.length,
        na.sol1.length,
        na.sol2.length,
        na.sol3.length,
        na.tt1,
        na.tt2,
        na.tt3,
      ];
      for (Da = 0; Da < Aa.length; Da++) ba[Da] = (ba[Da] || 0) + Aa[Da];
      console.log("AvgL: ", ba[0] / (la + 1));
    }
    console.log("AvgL1:", ba[1] / U);
    console.log("AvgL2:", ba[2] / U);
    console.log("AvgL3:", ba[3] / U);
    console.log("AvgT1:", ba[4] / U);
    console.log("AvgT2:", ba[5] / U);
    console.log("AvgT3:", ba[6] / U);
  }
  var v = [
      [0, 54, 9, 63],
      [4, 53, 22, 62],
      [8, 67, 35, 49],
      [27, 36, 18, 45],
      [13, 44, 31, 71],
      [26, 40, 17, 58],
    ],
    u = [
      [1, 57],
      [3, 64],
      [6, 51],
      [28, 39],
      [21, 37],
      [15, 42],
      [12, 55],
      [10, 66],
      [33, 69],
      [30, 46],
      [19, 48],
      [24, 60],
    ],
    I = [2, 5, 7, 11, 14, 16, 20, 23, 25, 29, 32, 34],
    z = [38, 41, 43, 47, 50, 52, 65, 68, 70, 56, 59, 61];
  b.prototype.isEqual = function (U) {
    for (var ba = 0; 12 > ba; ba++)
      if (
        this.ep[ba] != U.ep[ba] ||
        this.uf[ba] != U.uf[ba] ||
        this.rl[ba] != U.rl[ba] ||
        (6 > ba && (this.cp[ba] != U.cp[ba] || this.co[ba] != U.co[ba]))
      )
        return !1;
    return !0;
  };
  b.prototype.toFaceCube = function (U) {
    var ba = [];
    U = U || 9;
    for (var la = [], ka = 0; 6 > ka; ka++) la[ka] = 2 * this.co[ka];
    mathlib.fillFacelet(v, ba, this.cp, la, U);
    mathlib.fillFacelet(u, ba, this.ep, [], U);
    mathlib.fillFacelet(I, ba, this.uf, null, U);
    mathlib.fillFacelet(z, ba, this.rl, null, U);
    return ba;
  };
  b.prototype.fromFacelet = function (U) {
    for (var ba = 0, la = [], ka = 0; 72 > ka; ++ka)
      (la[ka] = U[ka]), (ba += Math.pow(16, la[ka]));
    if (2576980377 != ba) return -1;
    U = [];
    if (
      -1 == mathlib.detectFacelet(v, la, this.cp, U, 9) ||
      -1 == mathlib.detectFacelet(u, la, this.ep, [], 9)
    )
      return -1;
    for (ka = ba = 0; 6 > ka; ka++)
      (this.co[ka] = U[ka] >> 1), (ba ^= this.co[ka]);
    if (
      0 != ba ||
      0 != mathlib.getNParity(mathlib.getNPerm(this.cp, 6), 6) ||
      0 != mathlib.getNParity(mathlib.getNPerm(this.ep, 12), 12)
    )
      return -1;
    U = [3, 3, 3, 3];
    for (ka = 0; 12 > ka; ka++) {
      ba = la[I[ka]];
      if (!(0 < U[ba])) return -1;
      this.uf[ka] = 3 * ba + 3 - U[ba];
      U[ba]--;
    }
    U = [3, 3, 3, 3];
    for (ka = 0; 12 > ka; ka++) {
      ba = [0, 1, 3, 2][la[z[ka]] - 4];
      if (!(0 < U[ba])) return -1;
      this.rl[ka] = 3 * ba + 3 - U[ba];
      U[ba]--;
    }
    if (0 != mathlib.getNParity(mathlib.getNPerm(this.uf, 12), 12))
      for (ka = 0; 12 > ka; ka++) this.uf[ka] ^= 2 > this.uf[ka] ? 1 : 0;
    if (0 != mathlib.getNParity(mathlib.getNPerm(this.rl, 12), 12))
      for (ka = 0; 12 > ka; ka++) this.rl[ka] ^= 2 > this.rl[ka] ? 1 : 0;
    return this;
  };
  b.prototype.toString = function (U) {
    var ba = this.toFaceCube(U);
    return "  U8 U7 U6 U5 U4      B8 B7 B6 B5 B4\nL4   U3 U2 U1   R8  r4   B3 B2 B1   l8\nL5 L1   U0   R3 R7  r5 r1   B0   l3 l7\nL6 L2 L0  R0 R2 R6  r6 r2 r0  l0 l2 l6\nL7 L3   F0   R1 R5  r7 r3   D0   l1 l5\nL8   F1 F2 F3   R4  r8   D1 D2 D3   l4\n  F4 F5 F6 F7 F8      D4 D5 D6 D7 D8".replace(
      /([UFrlDBRL])([0-8])/g,
      function (la, ka, Aa) {
        la = 9 * "UFrlDBRL".indexOf(ka) + ~~Aa;
        return "UFrlDBRL"[~~(ba[la] / 9)] + (ba[la] % 9);
      }
    );
  };
  b.FtoMult = function () {
    var U = Array.from(arguments),
      ba = U.pop() || new b();
    return U.reduceRight(function (la, ka) {
      for (var Aa = 0; 6 > Aa; Aa++)
        (ba.co[Aa] = ka.co[la.cp[Aa]] ^ la.co[Aa]),
          (ba.cp[Aa] = ka.cp[la.cp[Aa]]);
      for (Aa = 0; 12 > Aa; Aa++)
        (ba.ep[Aa] = ka.ep[la.ep[Aa]]),
          (ba.uf[Aa] = ka.uf[la.uf[Aa]]),
          (ba.rl[Aa] = ka.rl[la.rl[Aa]]);
      return ba;
    });
  };
  (function () {
    var U = new b(
        [1, 2, 0, 4, 5, 3],
        [0, 0, 0, 0, 0, 0],
        [2, 0, 1, 5, 3, 4, 10, 11, 6, 7, 8, 9],
        [1, 2, 0, 7, 8, 6, 10, 11, 9, 4, 5, 3],
        [2, 0, 1, 8, 6, 7, 11, 9, 10, 5, 3, 4]
      ),
      ba = new b(
        [5, 0, 4, 2, 3, 1],
        [1, 1, 0, 1, 1, 0],
        [6, 5, 7, 9, 2, 10, 11, 4, 3, 8, 1, 0],
        [5, 3, 4, 8, 6, 7, 2, 0, 1, 11, 9, 10],
        [4, 5, 3, 7, 8, 6, 1, 2, 0, 10, 11, 9]
      ),
      la = b.FtoMult(U, U, null),
      ka = b.FtoMult(ba, ba, null);
    la = b.FtoMult(la, ba, U, null);
    var Aa = b.FtoMult(ba, U, ka, null);
    ka = [];
    ka[0] = new b(
      [1, 2, 0, 3, 4, 5],
      [0, 0, 0, 0, 0, 0],
      [2, 0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [0, 1, 2, 3, 6, 7, 11, 9, 8, 5, 10, 4]
    );
    ka[2] = new b(
      [4, 1, 2, 3, 5, 0],
      [1, 0, 0, 0, 1, 0],
      [0, 1, 2, 3, 4, 6, 7, 5, 8, 9, 10, 11],
      [0, 1, 2, 4, 5, 3, 6, 7, 8, 9, 10, 11],
      [0, 9, 10, 3, 4, 5, 2, 7, 1, 8, 6, 11]
    );
    ka[4] = new b(
      [0, 5, 2, 1, 4, 3],
      [0, 1, 0, 0, 0, 1],
      [0, 1, 2, 3, 10, 5, 6, 7, 8, 9, 11, 4],
      [0, 1, 2, 3, 4, 5, 7, 8, 6, 9, 10, 11],
      [5, 3, 2, 11, 4, 10, 6, 7, 8, 9, 0, 1]
    );
    ka[6] = new b(
      [0, 1, 3, 4, 2, 5],
      [0, 0, 1, 1, 0, 0],
      [0, 1, 2, 8, 4, 5, 6, 7, 9, 3, 10, 11],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 9],
      [8, 1, 7, 2, 0, 5, 6, 3, 4, 9, 10, 11]
    );
    ka[8] = new b(
      [0, 1, 2, 5, 3, 4],
      [0, 0, 0, 0, 0, 0],
      [0, 1, 2, 4, 5, 3, 6, 7, 8, 9, 10, 11],
      [0, 1, 2, 3, 9, 10, 5, 7, 4, 8, 6, 11],
      [1, 2, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    );
    ka[10] = new b(
      [0, 3, 1, 2, 4, 5],
      [0, 1, 1, 0, 0, 0],
      [0, 1, 10, 3, 4, 5, 6, 7, 8, 2, 9, 11],
      [0, 6, 7, 3, 4, 5, 11, 9, 8, 2, 10, 1],
      [0, 1, 2, 4, 5, 3, 6, 7, 8, 9, 10, 11]
    );
    ka[12] = new b(
      [5, 0, 2, 3, 4, 1],
      [1, 1, 0, 0, 0, 0],
      [6, 1, 2, 3, 4, 5, 11, 7, 8, 9, 10, 0],
      [5, 3, 2, 8, 4, 7, 6, 0, 1, 9, 10, 11],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 9]
    );
    ka[14] = new b(
      [2, 1, 4, 3, 0, 5],
      [1, 0, 1, 0, 0, 0],
      [0, 8, 2, 3, 4, 5, 6, 1, 7, 9, 10, 11],
      [11, 1, 10, 2, 0, 5, 6, 7, 8, 9, 3, 4],
      [0, 1, 2, 3, 4, 5, 7, 8, 6, 9, 10, 11]
    );
    ka[16] = b.FtoMult(U, ka[8], null);
    ka[18] = b.FtoMult(Aa, ka[10], null);
    ka[20] = b.FtoMult(ba, ka[6], null);
    ka[22] = b.FtoMult(la, ka[4], null);
    for (var Da = 1; 24 > Da; Da += 2)
      (ka[Da] = new b()), b.FtoMult(ka[Da - 1], ka[Da - 1], ka[Da]);
    la = [];
    for (Da = 0; 24 > Da; Da++) la[Da] = ka[Da].ep.join(",");
    Aa = [];
    var Ha = [],
      Ma = [],
      da = [],
      wa = [],
      ha = new b();
    new b();
    for (Da = 0; 12 > Da; Da++)
      (Aa[Da] = new b(ha.cp, ha.co, ha.ep, ha.uf, ha.rl)),
        (wa[Da] = Aa[Da].ep.join(",")),
        (Ha[Da] = []),
        (Ma[Da] = []),
        (ha = b.FtoMult(ha, U, null)),
        2 == Da % 3 && (ha = b.FtoMult(ha, ba, U, null)),
        5 == Da % 6 && (ha = b.FtoMult(ha, U, ba, null));
    for (Da = 0; 12 > Da; Da++)
      for (U = 0; 12 > U; U++)
        b.FtoMult(Aa[Da], Aa[U], ha),
          (ba = wa.indexOf(ha.ep.join(","))),
          (Ha[Da][U] = ba),
          (Ma[ba][U] = Da);
    for (Da = 0; 12 > Da; Da++)
      for (da[Da] = [], U = 0; 8 > U; U++)
        b.FtoMult(Aa[Ma[0][Da]], ka[2 * U], Aa[Da], ha),
          (ba = la.indexOf(ha.ep.join(","))),
          (da[Da][U] = ba >> 1);
    b.moveCube = ka;
    b.symCube = Aa;
    b.symMult = Ha;
    b.symMulI = Ma;
    b.symMulM = da;
  })();
  for (
    var O = [0, 2, 22, 6, 16, 10, 12, 14],
      J = null,
      P = null,
      W = null,
      X = null,
      V = [],
      Q = 0;
    12 > Q;
    Q++
  )
    V.push(
      new b(b.symCube[Q].cp, b.symCube[Q].co, null, b.symCube[Q].uf, null)
    );
  var d = [0, 12, 14, 8, 10],
    l = null,
    D = null,
    x = null,
    R = {},
    G = null,
    L = null,
    F = [],
    K = [],
    M = [],
    S = new mathlib.Coord("c", 12, [3, 3, 3, 3]),
    Z = [
      [2, 56, 11, 65],
      [5, 52, 23, 61],
      [7, 68, 34, 50],
      [29, 38, 20, 47],
      [14, 43, 32, 70],
      [25, 41, 16, 59],
    ],
    fa = [8, 10, 12, 14],
    ea = null,
    va = null,
    ra = null,
    ya = null,
    Ba = null,
    sa = null,
    ta = "U U' F F' r r' l l' D D' B B' R R' L L'".split(" ");
  A.prototype.solveFto = function (U, ba) {
    if (!X) {
      var la = $.now();
      a();
      m();
      r();
      DEBUG && console.log("[ftosolver] init time:", $.now() - la);
    }
    U = h(U);
    L || m();
    la = $.now();
    for (var ka = [], Aa = 0; Aa < U.length; Aa++) {
      var Da = ka,
        Ha = Da.push,
        Ma = l[1][C(U[Aa][0].ep)],
        da = D[1][c(U[Aa][0].rl)],
        wa = x[1][p(U[Aa][0])],
        ha = U[Aa][0].uf;
      var Ea = [];
      for (var Ka = 0; 12 > Ka; Ka++) Ea[Ka] = ~~(ha[Ka] / 3);
      ha = q(Ea, F);
      Ea = (M[S.get(Ea)] << 4) | ha;
      Ha.call(Da, [Ma, da, wa, Ea]);
    }
    Aa = L.solveMulti(ka, 0, 25);
    ka = Aa[0];
    Da = Aa[1];
    Ha = U[Da];
    Ma = Ha[0];
    for (Aa = 0; Aa < ka.length; Aa++)
      (da = d[ka[Aa][0]] + ka[Aa][1]),
        (ka[Aa] = 2 * b.symMulM[b.symMulI[0][Ha[3]]][da >> 1] + (da & 1)),
        (Ma = b.FtoMult(Ma, b.moveCube[da], null));
    la = [Ma, ka, Ha[2], Ha[3], Da, $.now() - la];
    U = U[la[4]];
    this.sol1 = U[1].slice();
    this.tt1 = U[4];
    U = U[2];
    this.sol2 = la[1].slice();
    this.tt2 = la[5];
    la[0] = b.FtoMult(V[b.symMulI[0][~~(U / 12)]], la[0], null);
    U = la[0];
    ra || r();
    Aa = $.now();
    ka = ea[1][k(U.ep)];
    Da = va[1][g(U)];
    ka = sa.solve([ka, Da], 0, 25);
    for (Da = 0; Da < ka.length; Da++)
      (Ha = fa[ka[Da][0]] + ka[Da][1]),
        (ka[Da] = 2 * b.symMulM[b.symMulI[0][la[3]]][Ha >> 1] + (Ha & 1)),
        (U = b.FtoMult(U, b.moveCube[Ha], null));
    U = [U, ka, la[2], la[3], $.now() - Aa];
    this.sol3 = U[1].slice();
    this.tt3 = U[4];
    U = [].concat(this.sol1, this.sol2, this.sol3);
    if (ba) {
      for (ba = 0; ba < U.length; ba++) U[ba] ^= 1;
      U.reverse();
    }
    return y(U);
  };
  var na = new A();
  return {
    solveFacelet: function (U, ba) {
      var la = new b();
      return -1 == la.fromFacelet(U)
        ? "FTO Solver ERROR!"
        : na.solveFto(la, ba);
    },
    FtoCubie: b,
    testbench: DEBUG && w,
  };
})();
var klmsolver = (function () {
  function b() {
    this.perm = [];
    this.twst = [];
    for (var V = 0; 20 > V; V++) (this.perm[V] = V), (this.twst[V] = 0);
  }
  function N() {
    for (var V = [], Q = [], d = 0; 48 > d; d++) V[d] = new b();
    for (var l = 0; 48 > l; l += 4) {
      V[l].faceletMove(l >> 2, 1, 0);
      Q[l] = V[l].hashCode();
      for (var D = 0; 3 > D; D++)
        b.KiloMult(V[l + D], V[l], V[l + D + 1]),
          (Q[l + D + 1] = V[l + D + 1].hashCode());
    }
    b.moveCube = V;
    l = [];
    D = [];
    var x = [],
      R = [],
      G = [],
      L = new b();
    for (d = 0; 60 > d; d++)
      (l[d] = new b().init(L.perm, L.twst)),
        (G[d] = l[d].hashCode()),
        (D[d] = []),
        (x[d] = []),
        L.faceletMove(0, 1, 1),
        4 == d % 5 && L.faceletMove(4 == d % 10 ? 1 : 2, 1, 1),
        29 == d % 30 &&
          (L.faceletMove(1, 2, 1),
          L.faceletMove(2, 1, 1),
          L.faceletMove(0, 3, 1));
    for (d = 0; 60 > d; d++)
      for (var F = 0; 60 > F; F++) {
        b.KiloMult(l[d], l[F], L);
        var K = G.indexOf(L.hashCode());
        D[d][F] = K;
        x[K][F] = d;
      }
    for (d = 0; 60 > d; d++)
      for (R[d] = [], F = 0; 12 > F; F++)
        b.KiloMult3(l[x[0][d]], V[4 * F], l[d], L),
          (K = Q.indexOf(L.hashCode())),
          (R[d][F] = K >> 2);
    b.symCube = l;
    b.symMult = D;
    b.symMulI = x;
    b.symMulM = R;
  }
  function t(V) {
    this.map = new b();
    this.imap = new b();
    this.map.perm = V.slice();
    for (var Q = 0; 20 > Q; Q++) -1 == V.indexOf(Q) && this.map.perm.push(Q);
    this.imap.invFrom(this.map);
    this.tmp = new b();
  }
  function E(V, Q, d) {
    V = V[d][~~(Q / 81 / 24)];
    return (
      1944 * V[0] + 81 * p[~~(Q / 81) % 24][V[1]] + m[q[V[1]][Q % 81]][V[2]]
    );
  }
  function n(V, Q, d) {
    V = V[d][~~(Q / 27 / 6)];
    return (
      162 * V[0] +
      27 * p[~~(Q / 27) % 6][V[1]] +
      m[q[V[1]][(Q % 27) * 3] / 3][V[2]]
    );
  }
  function C() {
    function V(F, K) {
      for (var M = 0; 4 > M; M++) (F[M] = K % 3), (K = ~~(K / 3));
    }
    function Q(F) {
      for (var K = 0, M = 3; 0 <= M; M--) K = 3 * K + F[M];
      return K;
    }
    C = $.noop;
    var d = $.now();
    N();
    for (var l = [], D = [], x = [], R = 0; 24 > R; R++) {
      p[R] = [];
      mathlib.setNPerm(l, R, 4);
      for (var G = 0; 24 > G; G++) {
        mathlib.setNPerm(D, G, 4);
        for (var L = 0; 4 > L; L++) x[L] = l[D[L]];
        p[R][G] = mathlib.getNPerm(x, 4);
      }
    }
    for (G = 0; 24 > G; G++)
      for (q[G] = [], mathlib.setNPerm(D, G, 4), R = 0; 81 > R; R++) {
        V(l, R);
        for (L = 0; 4 > L; L++) x[L] = l[D[L]];
        q[G][R] = Q(x);
      }
    for (G = 0; 81 > G; G++)
      for (m[G] = [], V(D, G), R = 0; 81 > R; R++) {
        V(l, R);
        for (L = 0; 4 > L; L++) x[L] = (l[L] + D[L]) % 3;
        m[G][R] = Q(x);
      }
    l = new b();
    D = new b();
    for (x = 0; 12 > x; x++)
      for (R = 0; R < x; R++)
        b.KiloMult(b.moveCube[4 * x], b.moveCube[4 * R], l),
          b.KiloMult(b.moveCube[4 * R], b.moveCube[4 * x], D),
          l.isEqual(D);
    c();
    k();
    g();
    DEBUG && console.log("[kilo] init finished, tt=", $.now() - d);
  }
  function c() {
    z = new t([5, 6, 7, 8, 9]);
    var V = new b(),
      Q = new b();
    mathlib.createMove(
      y,
      1140,
      function (l, D) {
        z.set(V, l, 3);
        b.KiloMult(V, b.moveCube[4 * D], Q);
        return z.get(Q, 3);
      },
      12
    );
    mathlib.createPrun(v, 0, 184680, 8, n.bind(null, y), 12, 4, 5);
    var d = n.bind(null, y);
    P = new mathlib.Searcher(
      null,
      function (l) {
        return Math.max(
          mathlib.getPruning(v, l[0]),
          mathlib.getPruning(v, l[1])
        );
      },
      function (l, D) {
        D = [d(l[0], D), d(l[1], r[D])];
        return D[0] == l[0] && D[1] == l[1] ? null : D;
      },
      12,
      4,
      9
    );
  }
  function k() {
    O = new t([13, 15, 16, 0, 1, 2, 3, 4, 10, 11, 12, 14, 17, 18, 19]);
    var V = new b(),
      Q = new b();
    mathlib.createMove(
      A,
      455,
      function (l, D) {
        O.set(V, l, 3);
        b.KiloMult(V, b.moveCube[4 * D], Q);
        return O.get(Q, 3);
      },
      6
    );
    mathlib.createPrun(u, 0, 73710, 8, n.bind(null, A), 6, 4, 4);
    var d = n.bind(null, A);
    W = new mathlib.Searcher(
      null,
      function (l) {
        return Math.max(
          mathlib.getPruning(u, l[0]),
          mathlib.getPruning(u, l[1])
        );
      },
      function (l, D) {
        D = [d(l[0], D), d(l[1], H[D])];
        return D[0] == l[0] && D[1] == l[1] ? null : D;
      },
      6,
      4
    );
  }
  function g() {
    J = new t([0, 1, 2, 3, 4, 10, 11, 14, 17, 18]);
    var V = new b(),
      Q = new b();
    mathlib.createMove(
      w,
      210,
      function (l, D) {
        J.set(V, l);
        b.KiloMult(V, b.moveCube[4 * D], Q);
        return J.get(Q);
      },
      3
    );
    var d = E.bind(null, w);
    mathlib.createPrun(I, 0, 408240, 14, d, 3, 4, 6);
    X = new mathlib.Searcher(
      null,
      function (l) {
        return Math.max(
          mathlib.getPruning(I, l[0]),
          mathlib.getPruning(I, l[1]),
          mathlib.getPruning(I, l[2])
        );
      },
      function (l, D) {
        return [d(l[0], D), d(l[1], (D + 1) % 3), d(l[2], (D + 2) % 3)];
      },
      3,
      4
    );
  }
  function f(V) {
    for (var Q = [], d = 0; d < V.length; d++)
      Q.push(
        "U R F L BL BR DR DL DBL B DBR D".split(" ")[V[d][0]] +
          ["", "2", "2'", "'"][V[d][1]]
      );
    return Q.join(" ");
  }
  function a(V, Q) {
    C();
    var d = new b(),
      l = new b(),
      D = new b();
    d.init(V.perm, V.twst);
    var x = $.now();
    V = 0;
    for (var R = [], G = 0; G < (Q ? 12 : 1); G++) {
      b.KiloMult3(b.symCube[b.symMulI[0][5 * G]], d, b.symCube[5 * G], l);
      var L = z.get(l, 3);
      b.KiloMult3(b.symCube[b.symMulI[0][2]], l, b.symCube[2], D);
      var F = z.get(D, 3);
      R.push([162 * L[0] + 27 * L[1] + L[2], 162 * F[0] + 27 * F[1] + F[2]]);
    }
    R = P.solveMulti(R, 0, 9);
    L = 5 * R[1];
    R = R[0];
    b.KiloMult3(b.symCube[b.symMulI[0][L]], d, b.symCube[L], l);
    d.init(l.perm, l.twst);
    V = b.symMult[V][L];
    for (F = 0; F < R.length; F++)
      (G = R[F]),
        b.KiloMult(d, b.moveCube[4 * G[0] + G[1]], l),
        d.init(l.perm, l.twst),
        (G[0] = b.symMulM[b.symMulI[0][V]][G[0]]);
    DEBUG &&
      console.log(
        "[kilo] Phase1s in ",
        $.now() - x,
        "ms",
        R.length,
        "move(s) sym=",
        L
      );
    x = $.now();
    var K = [];
    for (G = 0; G < (Q ? 5 : 1); G++)
      b.KiloMult3(b.symCube[b.symMulI[0][G]], d, b.symCube[G], l),
        (L = O.get(l, 3)),
        b.KiloMult3(b.symCube[b.symMulI[0][1]], l, b.symCube[1], D),
        (F = O.get(D, 3)),
        K.push([162 * L[0] + 27 * L[1] + L[2], 162 * F[0] + 27 * F[1] + F[2]]);
    Q = W.solveMulti(K, 0, 14);
    L = Q[1];
    Q = Q[0];
    b.KiloMult3(b.symCube[b.symMulI[0][L]], d, b.symCube[L], l);
    d.init(l.perm, l.twst);
    V = b.symMult[V][L];
    for (F = 0; F < Q.length; F++)
      (G = Q[F]),
        b.KiloMult(d, b.moveCube[4 * G[0] + G[1]], l),
        d.init(l.perm, l.twst),
        (G[0] = b.symMulM[b.symMulI[0][V]][G[0]]);
    DEBUG &&
      console.log(
        "[kilo] Phase2s in ",
        $.now() - x,
        "ms",
        Q.length,
        "move(s) sym=",
        L
      );
    L = J.get(d);
    b.KiloMult3(b.symCube[b.symMulI[0][6]], d, b.symCube[6], l);
    F = J.get(l);
    b.KiloMult3(b.symCube[b.symMulI[0][29]], d, b.symCube[29], l);
    x = J.get(l);
    d = [
      81 * (24 * L[0] + L[1]) + L[2],
      81 * (24 * F[0] + F[1]) + F[2],
      81 * (24 * x[0] + x[1]) + x[2],
    ];
    x = $.now();
    d = X.solve(d, 0, 14);
    DEBUG &&
      console.log("[kilo] Phase3 in ", $.now() - x, "ms", d.length, "move(s)");
    for (F = 0; F < d.length; F++)
      (G = d[F]), (G[0] = b.symMulM[b.symMulI[0][V]][G[0]]);
    DEBUG &&
      console.log("[kilo] total length: ", R.length + Q.length + d.length);
    return f(Array.prototype.concat(R, Q, d));
  }
  function e() {
    C();
    for (var V = new b(), Q = new b(), d = [], l = 0; 200 > l; l++) {
      var D = mathlib.rn(12);
      d.push([D, 0]);
      b.KiloMult(V, b.moveCube[4 * D], Q);
      V.init(Q.perm, Q.twst);
    }
    return f(d) + "   " + a(V, !0);
  }
  b.SOLVED = new b();
  var h = [
    [2, 8, 14],
    [3, 13, 19],
    [4, 18, 24],
    [0, 23, 29],
    [1, 28, 9],
    [58, 45, 41],
    [57, 50, 46],
    [56, 30, 51],
    [55, 35, 31],
    [59, 40, 36],
    [10, 7, 33],
    [15, 12, 38],
    [20, 17, 43],
    [25, 22, 48],
    [5, 27, 53],
    [49, 21, 42],
    [54, 26, 47],
    [34, 6, 52],
    [39, 11, 32],
    [44, 16, 37],
  ];
  b.prototype.toFaceCube = function (V) {
    V = V || h;
    var Q = [];
    mathlib.fillFacelet(V, Q, this.perm, this.twst, 5);
    return Q;
  };
  b.prototype.fromFacelet = function (V, Q) {
    Q = Q || h;
    for (var d = 0, l = [], D = 0; 60 > D; ++D)
      (l[D] = V[D]), (d += Math.pow(16, l[D]));
    return 93824992236885 != d ||
      -1 == mathlib.detectFacelet(Q, l, this.perm, this.twst, 5)
      ? -1
      : this;
  };
  b.prototype.hashCode = function () {
    for (var V = 0, Q = 0; 20 > Q; Q++)
      V = 0 | (31 * V + 3 * this.perm[Q] + this.twst[Q]);
    return V;
  };
  b.KiloMult = function (V, Q, d) {
    for (var l = 0; 20 > l; l++)
      (d.perm[l] = V.perm[Q.perm[l]]),
        (d.twst[l] = (V.twst[Q.perm[l]] + Q.twst[l]) % 3);
  };
  b.KiloMult3 = function (V, Q, d, l) {
    for (var D = 0; 20 > D; D++)
      (l.perm[D] = V.perm[Q.perm[d.perm[D]]]),
        (l.twst[D] =
          (V.twst[Q.perm[d.perm[D]]] + Q.twst[d.perm[D]] + d.twst[D]) % 3);
  };
  b.prototype.invFrom = function (V) {
    for (var Q = 0; 20 > Q; Q++)
      (this.perm[V.perm[Q]] = Q), (this.twst[V.perm[Q]] = (3 - V.twst[Q]) % 3);
    return this;
  };
  b.prototype.init = function (V, Q) {
    this.perm = V.slice();
    this.twst = Q.slice();
    return this;
  };
  b.prototype.isEqual = function (V) {
    for (var Q = 0; 20 > Q; Q++)
      if (this.perm[Q] != V.perm[Q] || this.twst[Q] != V.twst[Q]) return !1;
    return !0;
  };
  b.prototype.setComb = function (V, Q) {
    Q = Q || 4;
    for (var d = 19, l = 19; 0 <= l; l--)
      V >= mathlib.Cnk[l][Q]
        ? ((V -= mathlib.Cnk[l][Q--]), (this.perm[l] = Q))
        : (this.perm[l] = d--),
        (this.twst[l] = 0);
  };
  b.prototype.getComb = function (V) {
    for (var Q = (V = V || 4), d = 0, l = 0, D = [], x = 19; 0 <= x; x--)
      this.perm[x] < Q &&
        ((d += mathlib.Cnk[x][V--]),
        (l = 3 * l + this.twst[x]),
        (D[V] = this.perm[x]));
    return [d, mathlib.getNPerm(D, Q), l];
  };
  b.prototype.faceletMove = function (V, Q, d) {
    for (var l = this.toFaceCube(), D = [], x = 0; 12 > x; x++) {
      for (var R = 0; 5 > R; R++)
        (D[11 * x + R] = l[5 * x + R]), (D[11 * x + R + 5] = 0);
      D[11 * x + 10] = 0;
    }
    mathlib.minx.doMove(D, V, Q, d);
    for (x = 0; 12 > x; x++)
      for (R = 0; 5 > R; R++) l[5 * x + R] = D[11 * x + R];
    this.fromFacelet(l);
  };
  t.prototype.get = function (V, Q) {
    b.KiloMult3(this.imap, V, this.map, this.tmp);
    return this.tmp.getComb(Q);
  };
  t.prototype.set = function (V, Q, d) {
    this.tmp.setComb(Q, d);
    b.KiloMult3(this.map, this.tmp, this.imap, V);
  };
  b.CombCoord = t;
  var p = [],
    q = [],
    m = [],
    r = [0, 3, 4, 5, 1, 2, 8, 9, 10, 6, 7, 11],
    H = [0, 2, 3, 4, 5, 1, 7, 8, 9, 10, 6, 11],
    y = [],
    A = [],
    w = [],
    v = [],
    u = [],
    I = [],
    z,
    O,
    J,
    P = null,
    W = null,
    X = null;
  return { KiloCubie: b, solveKiloCubie: a, checkSolver: DEBUG && e };
})();
var scrMgr = (function (b, N) {
    function t(f, a, e) {
      f = f || [[""]];
      a = a || [""];
      e = e || 0;
      for (var h = 0, p = -1, q = [], m, r, H = 0; H < e; H++) {
        do
          (m = b(f.length)), (r = b(f[m].length)), m != p && ((h = 0), (p = m));
        while (0 != ((h >> r) & 1));
        h |= 1 << r;
        f[m][r].constructor == Array
          ? q.push(N(f[m][r]) + N(a))
          : q.push(f[m][r] + N(a));
      }
      return q.join(" ");
    }
    function E(f, a, e) {
      DEBUG && console.log("[regscr]", f);
      if ($.isArray(f)) for (e = 0; e < f.length; e++) C[f[e]] = a;
      else
        (C[f] = a),
          $.isArray(e)
            ? (c[f] = function (h, p) {
                return h[p];
              }.bind(null, e))
            : e && (c[f] = e);
      "333" == f && (C["333oh"] = C["333ft"] = a);
      return E;
    }
    function n(f, a, e) {
      if (0 >= e || 0 > f || 0 > a) return 0;
      var h = a + 131 * ~~(f / e);
      a = (h % 24317) + 42;
      var p = ((137 * h) ^ a) % 32141,
        q = (a + p + 63629) % e,
        m = (~~(h / e) % e) + 1,
        r = (~~(h / e / e) % e) + 1;
      f = (f + h) % e;
      0 == f % 3 && (f = (((f / 3) * 24317 + a) % ~~((e + 2) / 3)) * 3);
      0 == f % 2 && (f = (((f / 2) * 32141 + p) % ~~((e + 1) / 2)) * 2);
      f < ~~(e / 2) && (f = (63629 * f + (a ^ p ^ q)) % ~~(e / 2));
      (f ^ m) < e && (f ^= m);
      f = (63629 * f + q) % e;
      (f ^ r) < e && (f ^= r);
      return f;
    }
    var C = {
        blank: function () {
          return "N/A";
        },
      },
      c = {},
      k = 0,
      g = -1;
    return {
      reg: E,
      scramblers: C,
      getExtra: function (f, a) {
        if (f in c) return c[f](a);
      },
      mega: t,
      formatScramble: function (f) {
        return f.replace(/[$#]\{([^\}]+)\}/g, function (a, e) {
          return "$" == a[0]
            ? ((a = [e]),
              "[" == e[0] && (a = JSON.parse(e)),
              C[a[0]].apply(this, a))
            : "#" == a[0]
            ? t.apply(this, JSON.parse("[" + e + "]"))
            : "";
        });
      },
      rndState: function (f, a) {
        if (void 0 != a) {
          var e = a.slice();
          void 0 == f && (f = e);
          if (0 == a[0]) return f.slice();
          a = [];
          for (var h = 0; h < f.length; h++)
            a.push(h), f[h] ? 1 == k && (e[h] = 1) : ((e[h] = 0), a.pop());
          return 2 == k
            ? (0 > g++ && (g = mathlib.rn(65536)),
              a[n(g % a.length, ~~(g / a.length), a.length)])
            : mathlib.rndProb(e);
        }
      },
      fixCase: function (f, a) {
        return void 0 != f
          ? f
          : 2 == k
          ? (0 > g++ && (g = mathlib.rn(65536)),
            n(g % a.length, ~~(g / a.length), a.length))
          : 1 == k
          ? mathlib.rn(a.length)
          : mathlib.rndProb(a);
      },
      setEqPr: function (f) {
        k = ~~f;
      },
      getEqPr: function () {
        return k;
      },
      toTxt: function (f) {
        return f
          .replace(/<span[^>]*>(.*?)<\/span>/gi, "$1 ")
          .replace(/~/g, "")
          .replace(/\\n/g, "\n")
          .replace(/`(.*?)`/g, "$1");
      },
    };
  })(mathlib.rn, mathlib.rndEl),
  scramble =
    ISCSTIMER &&
    execMain(
      function (b, N) {
        function t() {
          kernel.blur();
          kernel.pushSignal("scrambling", x);
          X.html(SCRAMBLE_SCRAMBLING + "...");
          S = !x || /^(remote|input$)/.exec(x) ? S : x;
          Z || ((L = x), (F = R), (K = G));
          Z = !1;
          F && fa.addClass("click").unbind("click").click(E);
          x = v.getSelected() || "333";
          G = ~~P.val();
          L != x && kernel.setProp("scrType", x);
          R = "";
          requestAnimFrame(k);
        }
        function E() {
          Z = !0;
          X.html(c(L, F, K, !0));
          fa.removeClass("click").unbind("click");
          void 0 != F && kernel.pushSignal("scrambleX", c(L, F, K));
        }
        function n() {
          Z
            ? ((Z = !1),
              X.html(c(x, R, G, !0)),
              fa.addClass("click").unbind("click").click(E),
              kernel.pushSignal("scrambleX", c(x, R, G)))
            : t();
        }
        function C() {
          if (R) {
            var U = kernel.getProp("scrClk", "n");
            "c" == U
              ? ((U = tools.getCurScramble()[1].trim()),
                $.clipboardCopy(U).then(
                  logohint.push.bind(logohint, LGHINT_SCRCOPY),
                  logohint.push.bind(logohint, "Copy Failed")
                ))
              : "+" == U && n();
          }
        }
        function c(U, ba, la, ka, Aa) {
          ba = ba || "";
          la = la || 0;
          var Da = D.exec(ba);
          Da && ((U = Da[1]), (ba = Da[3]), (la = ~~Da[2]));
          Da = scrMgr.toTxt(ba);
          return ka
            ? ((U = kernel.getProp("scrASize")
                ? Math.max(
                    0.25,
                    Math.round(
                      20 * Math.pow(50 / Math.max(Da.length, 10), 0.3)
                    ) / 20
                  )
                : 1),
              X.css("font-size", U + "em"),
              DEBUG && console.log("[scrFontSize]", U),
              ba
                .replace(/~/g, "&nbsp;")
                .replace(/\\n/g, "\n")
                .replace(
                  /`(.*?)`/g,
                  Aa || kernel.getProp("scrKeyM", !1) ? "<u>$1</u>" : "$1"
                ))
            : [U, Da, la];
        }
        function k() {
          a();
          R
            ? ((R = R.replace(/(\s*)$/, "")),
              X.html(c(x, R, G, !0)),
              kernel.pushSignal("scramble", c(x, R, G)))
            : X.html(SCRAMBLE_SCRAMBLING + "... ");
        }
        function g(U, ba, la) {
          va &&
            !U[0].startsWith("nocache_") &&
            (csTimerWorker && csTimerWorker.getScramble
              ? (ra =
                  ra ||
                  csTimerWorker.getScramble(
                    U,
                    function (ka, Aa) {
                      DEBUG &&
                        console.log(
                          "[scrcache]",
                          ka + " cached by csTimerWorker"
                        );
                      f(ka, Aa);
                    }.bind(void 0, ba)
                  ))
              : la ||
                (ra =
                  ra ||
                  setTimeout(
                    function (ka, Aa) {
                      var Da = r[Aa[0]];
                      f(ka, Da.apply(Da, Aa));
                    }.bind(void 0, ba, U),
                    500
                  )));
        }
        function f(U, ba) {
          var la = JSON.parse(localStorage.cachedScr || null) || {};
          $.isArray(la) && (la = {});
          la[U] = ba;
          localStorage.cachedScr = JSON.stringify(la);
          ra = 0;
        }
        function a() {
          if (x) {
            R = "";
            var U = Q[x] || x;
            if ("input" == U) R = Ba.next();
            else if ((Ba.clear(), U.startsWith("remote"))) R = ya.next(U);
            else if ((ya.clear(), U in r)) {
              var ba = JSON.parse(localStorage.cachedScr || null) || {},
                la = JSON.stringify([U, G, l[1], M]);
              va && la in ba && !U.startsWith("nocache_")
                ? ((R = ba[la]),
                  delete ba[la],
                  (localStorage.cachedScr = JSON.stringify(ba)))
                : (R = r[U](U, G, na(l[1], H(U, 1)), M));
              g([U, G, na(l[1], H(U, 1)), M], la);
            } else requestAnimFrame(k);
          }
        }
        function e() {
          kernel.blur();
          var U = v.getSelIdx();
          (scrdata[U[0]] && scrdata[U[0]][1] && scrdata[U[0]][1][U[1]]) ||
            (U = [0, 0]);
          U = scrdata[U[0]][1][U[1]][2];
          P.val(Math.abs(U));
          P[0].disabled = 0 >= U;
          U = v.getSelected();
          U in d ? W.text(d[U]).show() : W.hide();
          l = JSON.parse(
            kernel.getProp("scrFlt", JSON.stringify([U, H(U, 0)]))
          );
          u[0].disabled = P[0].disabled && !H(U, 0);
          l[0] != U &&
            ((l = [U, H(U, 0) && mathlib.valuedArray(H(U, 0).length, 1)]),
            kernel.setProp("scrFlt", JSON.stringify(l), "session"));
        }
        function h() {
          e();
          t();
        }
        function p() {
          function U() {
            var Qa = H(x, 0);
            if (Qa) {
              Qa = mathlib.valuedArray(Qa.length, 1);
              for (var ia = !1, oa = 0; oa < ba.length; oa++)
                ba[oa][0].checked ? (ia = !0) : (Qa[oa] = 0);
              ia
                ? ((l = [x, Qa]),
                  (Qa = JSON.stringify(l)),
                  kernel.getProp("scrFlt") != Qa &&
                    ((ka = !0), kernel.setProp("scrFlt", Qa)))
                : alert(SCROPT_EMPTYALT);
              ka && t();
            }
          }
          z.empty();
          var ba = [],
            la = [],
            ka = !1,
            Aa = H(x, 0);
          if (Aa) {
            var Da = H(x, 2),
              Ha = Aa;
            l[0] == x && (Ha = l[1] || Aa);
            z.append("<br>", O, J, "<br><br>");
            for (var Ma = {}, da = 0; da < Aa.length; da++) {
              var wa = Aa[da].indexOf("-");
              -1 == wa
                ? (Ma[Aa[da]] = [da])
                : ((wa = Aa[da].slice(0, wa)),
                  (Ma[wa] = Ma[wa] || []),
                  Ma[wa].push(da));
            }
            for (da = 0; da < Aa.length; da++) {
              wa = $('<input type="checkbox">').val(da);
              Ha[da] && (wa[0].checked = !0);
              ba.push(wa);
              wa = $("<label>").append(wa, Aa[da]);
              if (Da) {
                var ha = $('<img style="display:block;">');
                Da(da, ha);
                ha.width("5em");
                ha.height("5em");
                wa.append("<br>", ha);
                wa.addClass("bimg");
              }
              la.push(wa);
            }
            var Ea = function (Qa) {
                var ia = 0;
                $.each(Ma[Qa], function (oa, ma) {
                  ia += ba[ma][0].checked ? 1 : 0;
                });
                return ia + "/" + Ma[Qa].length;
              },
              Ka;
            for (Ka in Ma) 1 == Ma[Ka].length && z.append(la[Ma[Ka][0]]);
            for (Ka in Ma)
              1 != Ma[Ka].length &&
                z.append(
                  $("<div>")
                    .attr("data", Ka)
                    .append(
                      $('<div class="sgrp">').append(
                        $("<span>").html(Ka + " " + Ea(Ka)),
                        " | ",
                        $('<span class="click">')
                          .html(SCROPT_BTNALL)
                          .click(function () {
                            var Qa = $(this).parent().parent().attr("data");
                            $.each(Ma[Qa], function (ia, oa) {
                              ba[oa][0].checked = !0;
                            });
                            $(this)
                              .parent()
                              .children()
                              .first()
                              .html(Qa + " " + Ea(Qa));
                          }),
                        " | ",
                        $('<span class="click">')
                          .html(SCROPT_BTNNONE)
                          .click(function () {
                            var Qa = $(this).parent().parent().attr("data");
                            $.each(Ma[Qa], function (ia, oa) {
                              ba[oa][0].checked = !1;
                            });
                            $(this)
                              .parent()
                              .children()
                              .first()
                              .html(Qa + " " + Ea(Qa));
                          }),
                        " | ",
                        $('<span class="click">[+]</span>').click(function () {
                          $(this).parent().next().toggle();
                        })
                      ),
                      $("<div>").append(
                        $.map(Ma[Ka], function (Qa) {
                          ba[Qa].change(function () {
                            var ia = $(this)
                              .parent()
                              .parent()
                              .parent()
                              .attr("data");
                            $(this)
                              .parent()
                              .parent()
                              .parent()
                              .find("span:first")
                              .html(ia + " " + Ea(ia));
                          });
                          return la[Qa];
                        })
                      )
                    )
                );
            O.unbind("click").click(function () {
              for (var Qa = 0; Qa < ba.length; Qa++)
                ba[Qa][0].checked || (ba[Qa][0].checked = !0), ba[Qa].change();
            });
            J.unbind("click").click(function () {
              for (var Qa = 0; Qa < ba.length; Qa++)
                ba[Qa][0].checked && (ba[Qa][0].checked = !1), ba[Qa].change();
            });
          }
          kernel.showDialog([I, U, null, U], "scropt", SCROPT_TITLE);
        }
        function q(U, ba) {
          "time" == U
            ? sa
              ? t()
              : (X.empty(), kernel.pushSignal("scramble", ["-", "", 0]))
            : "property" == U
            ? "scrSize" == ba[0]
              ? V.css("font-size", ba[1] / 7 + "em")
              : "scrMono" == ba[0]
              ? y.css("font-family", ba[1] ? "Monospace" : "Arial")
              : "scrType" == ba[0]
              ? ba[1] != v.getSelected() && (v.loadVal(ba[1]), h())
              : "scrLim" == ba[0]
              ? ba[1]
                ? V.addClass("limit")
                : V.removeClass("limit")
              : "scrAlign" == ba[0]
              ? y.css(
                  "text-align",
                  { c: "center", l: "left", r: "right" }[ba[1]]
                )
              : "scrWrap" == ba[0]
              ? V.css("text-wrap", { n: "unset", b: "balance" }[ba[1]])
              : "scrFast" == ba[0]
              ? ((Q["444wca"] = ba[1] ? "444m" : "444wca"),
                "444wca" == x && t())
              : "scrKeyM" == ba[0]
              ? X.html(Z ? c(L, F || "", K || 0, !0) : c(x, R || "", G, !0))
              : "scrHide" == ba[0]
              ? ba[1]
                ? A.hide()
                : A.show()
              : "scrNeut" == ba[0]
              ? ((M = ~~ba[1]), "modify" == ba[2] && t())
              : "scrEqPr" == ba[0]
              ? scrMgr.setEqPr(~~ba[1])
              : "scrClk" == ba[0] &&
                (V.css(
                  "cursor",
                  { n: "default", c: "copy", "+": "pointer" }[ba[1]]
                ),
                "n" == ba[1]
                  ? V.removeClass("noselect")
                  : V.addClass("noselect"))
            : "button" == U && "scramble" == ba[0]
            ? (sa = ba[1]) && "" == X.html() && t()
            : "ctrl" == U && "scramble" == ba[0]
            ? "last" == ba[1]
              ? E()
              : "next" == ba[1] && n()
            : "scrfix" == U && ba && X.html(c(x, ba, G, !0, !0));
        }
        function m(U, ba) {
          for (var la = 0; la < scrdata.length; la++)
            for (var ka = 0; ka < scrdata[la][1].length; ka++)
              if (scrdata[la][1][ka][1] == U) {
                ba(la, ka);
                return;
              }
        }
        var r = scrMgr.scramblers,
          H = scrMgr.getExtra,
          y = $('<div id="scrambleDiv"/>'),
          A = $("<div />").addClass("title"),
          w = [$("<select />"), $("<select />")],
          v = new kernel.TwoLvMenu(scrdata, h, w[0], w[1], "333"),
          u = $('<input type="button" class="icon">').val(""),
          I = $("<div>"),
          z = $('<div class="sflt">'),
          O = $('<input type="button">').val(SCROPT_BTNALL),
          J = $('<input type="button">').val(SCROPT_BTNNONE),
          P = $('<input type="text" maxlength="3">'),
          W = $("<span>"),
          X = $("<div>"),
          V = $('<div id="scrambleTxt"/>'),
          Q = { "333oh": "333", "333ft": "333" },
          d = { easyc: EASY_SCRAMBLE_HINT, easyxc: EASY_SCRAMBLE_HINT },
          l = "",
          D = /^\$T([a-zA-Z0-9]+)(-[0-9]+)?\$\s*(.*)$/,
          x,
          R,
          G = 0,
          L,
          F,
          K = 0,
          M = 0,
          S = "333",
          Z = !1,
          fa = $("<span />").html(SCRAMBLE_LAST),
          ea = $("<span />").addClass("click").html(SCRAMBLE_NEXT).click(n),
          va = !0,
          ra = 0;
        $(function () {
          if (csTimerWorker && csTimerWorker.getScramble) {
            var U = ['["444wca",40,null]'],
              ba = JSON.parse(localStorage.cachedScr || null) || {};
            $.isArray(ba) && (ba = {});
            for (var la = 0; la < U.length; la++)
              U[la] in ba ||
                setTimeout(
                  g.bind(void 0, JSON.parse(U[la]), U[la], !0),
                  2500 + ~~(5e3 * Math.random())
                );
          }
        });
        var ya = (function () {
            function U() {
              kernel.setProp("scrType", S);
            }
            function ba(ka) {
              if (!$.isArray(ka)) return !1;
              la = ka;
              return 0 != la.length;
            }
            var la = [];
            return {
              next: function (ka) {
                for (var Aa = null; !Aa && 0 != la.length; ) Aa = la.shift();
                if (Aa) return Aa;
                "remoteComp" == ka
                  ? window.onlinecomp
                    ? onlinecomp.getScrambles().then(function (Da) {
                        ba(Da) ? requestAnimFrame(k) : U();
                      }, U)
                    : U()
                  : "remoteBattle" == ka &&
                    (window.battle
                      ? battle.getScrambles().then(function (Da) {
                          ba(Da) ? requestAnimFrame(k) : U();
                        }, U)
                      : U());
                return "";
              },
              clear: function () {
                la = [];
              },
            };
          })(),
          Ba = (function () {
            function U() {
              var Ha = Aa.val();
              if (Ha.match(/^\s*$/)) Ha = !1;
              else {
                la = [];
                Ha = Ha.split("\n");
                for (
                  var Ma = "$T" + Da.val() + "$", da = 0;
                  da < Ha.length;
                  da++
                ) {
                  var wa = Ha[da];
                  null == wa.match(/^\s*$/) &&
                    ((wa = wa.replace(/^\d+[\.\),]\s*/, "")),
                    D.exec(wa) || (wa = Ma + wa),
                    la.push(wa));
                }
                Ha = 0 != la.length;
              }
              Ha ? k() : kernel.setProp("scrType", S);
            }
            function ba() {
              kernel.setProp("scrType", S);
            }
            var la = [],
              ka,
              Aa,
              Da;
            return {
              next: function () {
                for (var Ha = null; !Ha && 0 != la.length; ) Ha = la.shift();
                if (Ha) return Ha;
                if (!Da) {
                  ka = $("<table>");
                  Aa = $('<textarea style="width:100%;height:100%;">');
                  Da = $("<select>");
                  Ha =
                    "333 222so 444wca 555wca 666wca 777wca clkwca mgmp pyrso skbso sqrs".split(
                      " "
                    );
                  for (var Ma = 0; Ma < Ha.length; Ma++)
                    Da.append(
                      $("<option>").val(Ha[Ma]).html(v.getValName(Ha[Ma]))
                    );
                  ka.append(
                    $("<tr height=0%>").append(
                      $("<td>").append(SCRAMBLE_INPUTTYPE + ":", Da)
                    ),
                    $("<tr height=100%>").append($("<td>").append(Aa))
                  );
                  Da.val("333");
                }
                Aa.val("");
                kernel.showDialog([ka, U, ba], "input", SCRAMBLE_INPUT);
                return "";
              },
              clear: function () {
                la = [];
              },
            };
          })(),
          sa = !1,
          ta = (function () {
            function U() {
              var wa = ~~Aa.val();
              da = "";
              for (var ha = R, Ea = Ha.val(), Ka = 0; Ka < wa; Ka++)
                a(), (da += Ea.replace("1", Ka + 1) + R + "\n");
              R = ha;
              Da.text(da);
              $.clipboardCopy(da).then(
                logohint.push.bind(logohint, LGHINT_SCRCOPY),
                logohint.push.bind(logohint, "Copy Failed")
              );
              Da.select();
            }
            function ba(wa) {
              if (da) {
                wa = new Blob([da], { type: "text/plain" });
                var ha = $('<a class="click"/>').appendTo("body");
                ha.attr("href", URL.createObjectURL(wa));
                ha.attr(
                  "download",
                  "Scrambles_" +
                    mathlib.time2str(new Date() / 1e3, "%Y%M%D_%h%m%s") +
                    ".txt"
                );
                ha[0].click();
                ha.remove();
              }
            }
            var la = $("<div />")
                .css("text-align", "center")
                .css("font-size", "0.7em"),
              ka = $("<span />").addClass("click").html(SCRGEN_GEN),
              Aa = $('<input type="text" maxlength="3">').val(5),
              Da = $('<textarea rows="10" style="width: 100%" readonly />'),
              Ha = $(
                '<select><option value="1. ">1. </option><option value="1) ">1) </option><option value="(1) ">(1) </option><option value=""></option></select>'
              ),
              Ma = $('<span class="click">').html("Download");
            la.append(SCRGEN_NSCR, Aa, "&nbsp;", SCRGEN_PRE).append(
              Ha,
              "<br>",
              ka,
              " | ",
              Ma,
              "<br>",
              Da
            );
            var da = "";
            return function (wa) {
              wa &&
                (wa.empty().append(la.width(y.width() / 2)),
                Ha.unbind("change").change(kernel.blur),
                ka.unbind("click").click(U),
                Ma.unbind("click").click(ba));
            };
          })(),
          na = scrMgr.rndState;
        $(function () {
          kernel.regListener("scramble", "time", q);
          kernel.regListener(
            "scramble",
            "property",
            q,
            /^scr(?:Size|Mono|Type|Lim|Align|Wrap|Fast|KeyM|Hide|Neut|EqPr|Clk)$/
          );
          kernel.regListener("scramble", "button", q, /^scramble$/);
          kernel.regListener("scramble", "ctrl", q, /^scramble$/);
          kernel.regListener("scramble", "scrfix", q);
          kernel.regProp(
            "scramble",
            "scrSize",
            2,
            PROPERTY_SCRSIZE,
            [15, 5, 50],
            1
          );
          kernel.regProp("scramble", "scrASize", 0, PROPERTY_SCRASIZE, [!0], 1);
          kernel.regProp("scramble", "scrMono", 0, PROPERTY_SCRMONO, [!0], 1);
          kernel.regProp("scramble", "scrLim", 0, PROPERTY_SCRLIM, [!1], 1);
          kernel.regProp(
            "scramble",
            "scrAlign",
            1,
            PROPERTY_SCRALIGN,
            ["c", ["c", "l", "r"], PROPERTY_SCRALIGN_STR.split("|")],
            1
          );
          kernel.regProp(
            "scramble",
            "scrWrap",
            1,
            PROPERTY_SCRWRAP,
            ["b", ["b", "n"], PROPERTY_SCRWRAP_STR.split("|")],
            1
          );
          kernel.regProp(
            "scramble",
            "preScr",
            1,
            "pre-scramble",
            [
              "",
              ";y;y2;y';z2;z2 y;z2 y2;z2 y';z';z' y;z' y2;z' y';z;z y;z y2;z y';x';x' y;x' y2;x' y';x;x y;x y2;x y'".split(
                ";"
              ),
              "(UF);(UR) y;(UB) y2;(UL) y';(DF) z2;(DL) z2 y;(DB) z2 y2;(DR) z2 y';(RF) z';(RD) z' y;(RB) z' y2;(RU) z' y';(LF) z;(LU) z y;(LB) z y2;(LD) z y';(BU) x';(BR) x' y;(BD) x' y2;(BL) x' y';(FD) x;(FR) x y;(FU) x y2;(FL) x y'".split(
                ";"
              ),
            ],
            1
          );
          kernel.regProp(
            "scramble",
            "preScrT",
            1,
            "training pre-scramble",
            [
              "z2",
              ";y;y2;y';z2;z2 y;z2 y2;z2 y';z';z' y;z' y2;z' y';z;z y;z y2;z y';x';x' y;x' y2;x' y';x;x y;x y2;x y'".split(
                ";"
              ),
              "(UF);(UR) y;(UB) y2;(UL) y';(DF) z2;(DL) z2 y;(DB) z2 y2;(DR) z2 y';(RF) z';(RD) z' y;(RB) z' y2;(RU) z' y';(LF) z;(LU) z y;(LB) z y2;(LD) z y';(BU) x';(BR) x' y;(BD) x' y2;(BL) x' y';(FD) x;(FR) x y;(FU) x y2;(FL) x y'".split(
                ";"
              ),
            ],
            1
          );
          kernel.regProp(
            "scramble",
            "scrNeut",
            1,
            PROPERTY_SCRNEUT,
            ["n", ["n", "1", "2", "6"], PROPERTY_SCRNEUT_STR.split("|")],
            1
          );
          kernel.regProp(
            "scramble",
            "scrEqPr",
            1,
            PROPERTY_SCREQPR,
            ["0", ["0", "1", "2"], PROPERTY_SCREQPR_STR.split("|")],
            1
          );
          kernel.regProp("scramble", "scrFast", 0, PROPERTY_SCRFAST, [!1]);
          kernel.regProp("scramble", "scrKeyM", 0, PROPERTY_SCRKEYM, [!1], 1);
          kernel.regProp(
            "scramble",
            "scrClk",
            1,
            PROPERTY_SCRCLK,
            ["c", ["n", "c", "+"], PROPERTY_SCRCLK_STR.split("|")],
            1
          );
          kernel.regProp(
            "scramble",
            "scrType",
            -6,
            "Scramble Type",
            ["333"],
            3
          );
          P.change(t);
          u.click(p);
          I.append($("<div>").append(SCRAMBLE_LENGTH + ": ", P), W, z);
          A.append($("<nobr>").append(w[0], " ", w[1], " ", u), " <wbr>");
          A.append($("<nobr>").append(fa, "/", ea, SCRAMBLE_SCRAMBLE));
          y.append(A, V.append(X).click(C));
          tools.regTool("scrgen", TOOLS_SCRGEN, ta);
          V.click(function () {
            A.show();
            kernel.blur();
            kernel.setProp("scrHide", !1);
          });
          kernel.regProp("ui", "scrHide", -1, "Hide Scramble Selector", [!1]);
          kernel.addWindow("scramble", BUTTON_SCRAMBLE, y, !0, !0, 3);
          e();
        });
        return {
          getTypeName: function (U) {
            var ba = "";
            m(U, function (la, ka) {
              ba = scrdata[la][0] + ">" + scrdata[la][1][ka][0];
            });
            return ba;
          },
          getTypeIdx: function (U) {
            var ba = 1e300;
            m(U, function (la, ka) {
              ba = 100 * la + ka;
            });
            return ba;
          },
          scrStd: c,
          pushScramble: function (U) {
            Z || ((L = x), (F = R), (K = G));
            Z = !1;
            R = U;
            X.html(c(x, R, G, !0));
            fa.addClass("click").unbind("click").click(E);
            kernel.pushSignal("scrambleX", c(x, R, G));
          },
          setCacheEnable: function (U) {
            va = U;
          },
        };
      },
      [mathlib.rn, mathlib.rndEl]
    );
(function (b, N, t) {
  function E(h, p) {
    h = g[h];
    switch (h.length) {
      case 1:
        return b(h[0], [""], p);
      case 2:
        return b(h[0], h[1], p);
      case 3:
        return b(h[0], h[1], h[2]);
    }
  }
  function n(h, p) {
    var q = a[h];
    h = q[1];
    var m = q[2],
      r = 0,
      H = 0,
      y = [],
      A = [
        ["R", "R'"],
        ["R'", "R"],
        ["L", "L'"],
        ["L'", "L"],
        ["F'", "F"],
        ["F", "F'"],
        ["B", "B'"],
        ["B'", "B"],
      ],
      w = ["U", "D"];
    q = q[0];
    for (var v = 0; v < m.length; v++) y[v] = 0;
    for (v = 0; v < p; v++) {
      for (var u = !1; !u; )
        for (var I = "", z = 0; z < m.length; z++) {
          var O = N(4);
          y[z] += O;
          0 != O && ((u = !0), (I += " " + m[z] + c[O - 1]));
        }
      u = N(8);
      z = N(2);
      O = N(3);
      q += I + " " + A[u][0] + " " + w[z] + c[O] + " " + A[u][1];
      0 == z && (r += O + 1);
      1 == z && (H += O + 1);
    }
    for (v = 0; v < m.length; v++)
      (O = 4 - (y[v] % 4)), 4 > O && (q += " " + m[v] + c[O - 1]);
    r = 4 - (r % 4);
    H = 4 - (H % 4);
    4 > r && (q += " U" + c[r - 1]);
    4 > H && (q += " D" + c[H - 1]);
    return (q += " " + t(h));
  }
  function C(h, p) {
    h = f[h].replace(/%l/g, p).replace(/%c/g, '["","2","\'"]');
    return scrMgr.formatScramble(h);
  }
  var c = ["", "2", "'"],
    k = ["", "2", "'", "2'"],
    g = {
      111: [[["x"], ["y"], ["z"]], c],
      2223: [[["U"], ["R"], ["F"]], c],
      2226: [[[["U", "D"]], [["R", "L"]], [["F", "B"]]], c],
      "333o": [
        [
          ["U", "D"],
          ["R", "L"],
          ["F", "B"],
        ],
        c,
      ],
      334: [
        [
          [
            ["U", "U'", "U2"],
            ["u", "u'", "u2"],
          ],
          [["R2", "L2", "M2"]],
          [["F2", "B2", "S2"]],
        ],
      ],
      336: [
        [
          [
            ["U", "U'", "U2"],
            ["u", "u'", "u2"],
            ["3u", "3u2", "3u'"],
          ],
          [["R2", "L2", "M2"]],
          [["F2", "B2", "S2"]],
        ],
      ],
      888: [
        [
          "U D u d 3u 3d 4u".split(" "),
          "R L r l 3r 3l 4r".split(" "),
          "F B f b 3f 3b 4f".split(" "),
        ],
        c,
      ],
      999: [
        [
          "U D u d 3u 3d 4u 4d".split(" "),
          "R L r l 3r 3l 4r 4l".split(" "),
          "F B f b 3f 3b 4f 4b".split(" "),
        ],
        c,
      ],
      101010: [
        [
          "U D u d 3u 3d 4u 4d 5u".split(" "),
          "R L r l 3r 3l 4r 4l 5r".split(" "),
          "F B f b 3f 3b 4f 4b 5f".split(" "),
        ],
        c,
      ],
      111111: [
        [
          "U D u d 3u 3d 4u 4d 5u 5d".split(" "),
          "R L r l 3r 3l 4r 4l 5r 5l".split(" "),
          "F B f b 3f 3b 4f 4b 5f 5b".split(" "),
        ],
        c,
      ],
      444: [
        [
          ["U", "D", "u"],
          ["R", "L", "r"],
          ["F", "B", "f"],
        ],
        c,
      ],
      "444m": [
        [
          ["U", "D", "Uw"],
          ["R", "L", "Rw"],
          ["F", "B", "Fw"],
        ],
        c,
      ],
      555: [
        [
          ["U", "D", "u", "d"],
          ["R", "L", "r", "l"],
          ["F", "B", "f", "b"],
        ],
        c,
      ],
      "555wca": [
        [
          ["U", "D", "Uw", "Dw"],
          ["R", "L", "Rw", "Lw"],
          ["F", "B", "Fw", "Bw"],
        ],
        c,
      ],
      "666p": [
        [
          ["U", "D", "2U", "2D", "3U"],
          ["R", "L", "2R", "2L", "3R"],
          ["F", "B", "2F", "2B", "3F"],
        ],
        c,
      ],
      "666wca": [
        [
          ["U", "D", "Uw", "Dw", "3Uw"],
          ["R", "L", "Rw", "Lw", "3Rw"],
          ["F", "B", "Fw", "Bw", "3Fw"],
        ],
        c,
      ],
      "666s": [
        [
          ["U", "D", "U&sup2;", "D&sup2;", "U&sup3;"],
          ["R", "L", "R&sup2;", "L&sup2;", "R&sup3;"],
          ["F", "B", "F&sup2;", "B&sup2;", "F&sup3;"],
        ],
        c,
      ],
      "666si": [
        [
          ["U", "D", "u", "d", "3u"],
          ["R", "L", "r", "l", "3r"],
          ["F", "B", "f", "b", "3f"],
        ],
        c,
      ],
      "777p": [
        [
          "U D 2U 2D 3U 3D".split(" "),
          "R L 2R 2L 3R 3L".split(" "),
          "F B 2F 2B 3F 3B".split(" "),
        ],
        c,
      ],
      "777wca": [
        [
          "U D Uw Dw 3Uw 3Dw".split(" "),
          "R L Rw Lw 3Rw 3Lw".split(" "),
          "F B Fw Bw 3Fw 3Bw".split(" "),
        ],
        c,
      ],
      "777s": [
        [
          "U D U&sup2; D&sup2; U&sup3; D&sup3;".split(" "),
          "R L R&sup2; L&sup2; R&sup3; L&sup3;".split(" "),
          "F B F&sup2; B&sup2; F&sup3; B&sup3;".split(" "),
        ],
        c,
      ],
      "777si": [
        [
          "U D u d 3u 3d".split(" "),
          "R L r l 3r 3l".split(" "),
          "F B f b 3f 3b".split(" "),
        ],
        c,
      ],
      crz3a: [
        [
          ["U", "D"],
          ["R", "L"],
          ["F", "B"],
        ],
        c,
      ],
      cm3: [
        [
          [
            ["U<", "U>", "U2"],
            ["E<", "E>", "E2"],
            ["D<", "D>", "D2"],
          ],
          [
            ["R^", "Rv", "R2"],
            ["M^", "Mv", "M2"],
            ["L^", "Lv", "L2"],
          ],
        ],
      ],
      cm2: [
        [
          [
            ["U<", "U>", "U2"],
            ["D<", "D>", "D2"],
          ],
          [
            ["R^", "Rv", "R2"],
            ["L^", "Lv", "L2"],
          ],
        ],
      ],
      233: [[[["U", "U'", "U2"]], ["R2", "L2"], ["F2", "B2"]]],
      fto: [
        [
          ["U", "D"],
          ["F", "B"],
          ["L", "BR"],
          ["R", "BL"],
        ],
        ["", "'"],
      ],
      gear: [[["U"], ["R"], ["F"]], " 2 3 4 5 6 ' 2' 3' 4' 5'".split(" ")],
      sfl: [
        [
          ["R", "L"],
          ["U", "D"],
        ],
        c,
      ],
      ufo: [[["A"], ["B"], ["C"], [["U", "U'", "U2'", "U2", "U3"]]]],
      RrUu: [
        [
          ["U", "u"],
          ["R", "r"],
        ],
        c,
      ],
      minx2g: [[["U"], ["R"]], k],
      lsll: [
        [
          [["R U R'", "R U2 R'", "R U' R'"]],
          [["F' U F", "F' U2 F", "F' U' F"]],
          [["U", "U2", "U'"]],
        ],
      ],
      prco: [
        [
          ["F", "B"],
          ["U", "D"],
          ["L", "DBR"],
          ["R", "DBL"],
          ["BL", "DR"],
          ["BR", "DL"],
        ],
        k,
      ],
      skb: [
        [["R"], ["L"], ["B"], ["U"]],
        ["", "'"],
      ],
      ivy: [
        [["R"], ["L"], ["D"], ["B"]],
        ["", "'"],
      ],
      112: [[["R"], ["R"]], c],
      eide: [
        [
          ["OMG"],
          ["WOW"],
          ["WTF"],
          ["WOO-HOO WOO-HOO MATYAS YES YES YAY YEEEEEEEEEEEES".split(" ")],
          ["HAHA"],
          ["XD"],
          [":D"],
          ["LOL"],
        ],
        ["", "", "", "!!!"],
      ],
    },
    f = {
      sia113:
        '#{[["U","u"],["R","r"]],%c,%l} z2 #{[["U","u"],["R","r"]],%c,%l}',
      sia123: '#{[["U"],["R","r"]],%c,%l} z2 #{[["U"],["R","r"]],%c,%l}',
      sia222: '#{[["U"],["R"],["F"]],%c,%l} z2 y #{[["U"],["R"],["F"]],%c,%l}',
      335: '#{[[["U","U\'","U2"],["D","D\'","D2"]],["R2","L2"],["F2","B2"]],0,%l} / ${333}',
      337: '#{[[["U","U\'","U2","u","u\'","u2","U u","U u\'","U u2","U\' u","U\' u\'","U\' u2","U2 u","U2 u\'","U2 u2"],["D","D\'","D2","d","d\'","d2","D d","D d\'","D d2","D\' d","D\' d\'","D\' d2","D2 d","D2 d\'","D2 d2"]],["R2","L2"],["F2","B2"]],0,%l} / ${333}',
      r234: "2) ${222so}\\n3) ${333}\\n4) ${[444,40]}",
      r2345: '${r234}\\n5) ${["555",60]}',
      r23456: '${r2345}\\n6) ${["666p",80]}',
      r234567: '${r23456}\\n7) ${["777p",100]}',
      r234w: '2) ${222so}\\n3) ${333}\\n4) ${["444m",40]}',
      r2345w: '${r234w}\\n5) ${["555wca",60]}',
      r23456w: '${r2345w}\\n6) ${["666wca",80]}',
      r234567w: '${r23456w}\\n7) ${["777wca",100]}',
      rmngf:
        '${r2345w}\\n3oh) ${333}\\npyr) ${["pyrso",10]}\\n skb) ${skbso}\\nsq1) ${sqrs}\\nclk) ${clkwca}\\nmgm) ${["mgmp",70]}',
      "333ni":
        '${333}#{[[""]],["","Rw ","Rw2 ","Rw\' ","Fw ","Fw\' "],1}#{[[""]],["","Uw","Uw2","Uw\'"],1}',
      "444bld":
        '${444wca}#{[[""]],[""," x"," x2"," x\'"," z"," z\'"],1}#{[[""]],[""," y"," y2"," y\'"],1}',
      "555bld":
        '${["555wca",%l]}#{[[""]],[""," 3Rw"," 3Rw2"," 3Rw\'"," 3Fw"," 3Fw\'"],1}#{[[""]],[""," 3Uw"," 3Uw2"," 3Uw\'"],1}',
    },
    a = {
      "5edge": [
        "r R b B",
        ["B' b' R' r'", "B' b' R' U2 r U2 r U2 r U2 r"],
        ["u", "d"],
      ],
      "6edge": [
        "3r r 3b b",
        [
          "3b' b' 3r' r'",
          "3b' b' 3r' U2 r U2 r U2 r U2 r",
          "3b' b' r' U2 3r U2 3r U2 3r U2 3r",
          "3b' b' r2 U2 3r U2 3r U2 3r U2 3r U2 r",
        ],
        ["u", "3u", "d"],
      ],
      "7edge": [
        "3r r 3b b",
        [
          "3b' b' 3r' r'",
          "3b' b' 3r' U2 r U2 r U2 r U2 r",
          "3b' b' r' U2 3r U2 3r U2 3r U2 3r",
          "3b' b' r2 U2 3r U2 3r U2 3r U2 3r U2 r",
        ],
        ["u", "3u", "3d", "d"],
      ],
    },
    e;
  for (e in g) scrMgr.reg(e, E);
  for (e in f) scrMgr.reg(e, C);
  for (e in a) scrMgr.reg(e, n);
  scrMgr.reg("cubennn", function (h, p) {
    if (1 >= p) return "N/A";
    h = [[], [], []];
    for (var q = 0; q < p - 1; q++)
      0 == q % 2
        ? (h[0].push((4 > q ? "" : ~~(q / 2 + 1)) + (2 > q ? "U" : "u")),
          h[1].push((4 > q ? "" : ~~(q / 2 + 1)) + (2 > q ? "R" : "r")),
          h[2].push((4 > q ? "" : ~~(q / 2 + 1)) + (2 > q ? "F" : "f")))
        : (h[0].push((4 > q ? "" : ~~(q / 2 + 1)) + (2 > q ? "D" : "d")),
          h[1].push((4 > q ? "" : ~~(q / 2 + 1)) + (2 > q ? "L" : "l")),
          h[2].push((4 > q ? "" : ~~(q / 2 + 1)) + (2 > q ? "B" : "b")));
    return b(h, c, 10 * p);
  });
})(scrMgr.mega, mathlib.rn, mathlib.rndEl);
var scramble_333 = (function (b, N, t, E, n) {
  function C() {
    return a(0xffffffffffff, 0xffffffffffff, 4294967295, 4294967295);
  }
  function c(ma) {
    for (var za = 0, T = 0; T < ma.length; T++) -1 == ma[T] && za++;
    return za;
  }
  function k(ma, za, T) {
    for (var aa = 0, ja = 0, pa = 0; pa < ma.length; pa++)
      -1 != ma[pa] && (aa += ma[pa]);
    aa %= T;
    for (pa = 0; pa < ma.length - 1; pa++)
      -1 == ma[pa] &&
        (1 == za--
          ? (ma[pa] = ((T << 4) - aa) % T)
          : ((ma[pa] = E(T)), (aa += ma[pa]))),
        (ja *= T),
        (ja += ma[pa]);
    1 == za && ma.splice(-1, 1, ((T << 4) - aa) % T);
    return ja;
  }
  function g(ma, za, T) {
    for (
      var aa = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], ja = 0;
      ja < ma.length;
      ja++
    )
      -1 != ma[ja] && (aa[ma[ja]] = -1);
    for (var pa = (ja = 0); ja < aa.length; ja++)
      -1 != aa[ja] && (aa[pa++] = aa[ja]);
    var qa;
    for (ja = 0; ja < ma.length && 0 < za; ja++)
      if (-1 == ma[ja]) {
        pa = E(za);
        for (ma[ja] = aa[pa]; 11 > pa; pa++) aa[pa] = aa[pa + 1];
        2 == za-- && (qa = ja);
      }
    t(b(ma, ma.length), ma.length) == 1 - T &&
      ((za = ma[ja - 1]), (ma[ja - 1] = ma[qa]), (ma[qa] = za));
    return b(ma, ma.length);
  }
  function f(ma, za) {
    if ("number" !== typeof ma) return ma;
    for (var T = [], aa = 0; aa < za; aa++) {
      var ja = ma & 15;
      T[aa] = 15 == ja ? -1 : ja;
      ma /= 16;
    }
    return T;
  }
  function a(ma, za, T, aa, ja, pa, qa, ua, Ja) {
    pa = pa || x;
    qa = qa || x;
    ma = f(ma, 12);
    za = f(za, 12);
    T = f(T, 8);
    aa = f(aa, 8);
    var La = "";
    do {
      var ab = za.slice(),
        Ta = ma.slice(),
        gb = aa.slice(),
        Na = T.slice(),
        Ra = k(ab, c(ab), 2),
        Ua = k(gb, c(gb), 3);
      var Za = c(Ta);
      var Xa = c(Na);
      1 == Za && (g(Ta, Za, -1), (Za = 0));
      1 == Xa && (g(Na, Xa, -1), (Xa = 0));
      0 == Za && 0 == Xa
        ? ((Za = b(Ta, 12)), (Xa = b(Na, 8)))
        : 0 != Za && 0 == Xa
        ? ((Xa = b(Na, 8)), (Za = g(Ta, Za, t(Xa, 8))))
        : ((Za = 0 == Za && 0 != Xa ? b(Ta, 12) : g(Ta, Za, -1)),
          (Xa = g(Na, Xa, t(Za, 12))));
      if (0 != Xa + Ua + Za + Ra) {
        La = n(qa);
        Ra = n(pa);
        Ua = new mathlib.CubieCube();
        Za = new mathlib.CubieCube();
        for (Xa = 0; 12 > Xa; Xa++)
          (Ua.ea[Xa] = (Ta[Xa] << 1) | ab[Xa]),
            8 > Xa && (Ua.ca[Xa] = (gb[Xa] << 3) | Na[Xa]);
        for (Xa = 0; Xa < La.length; Xa++)
          mathlib.CubieCube.CubeMult(
            mathlib.CubieCube.moveCube[La[Xa]],
            Ua,
            Za
          ),
            Ua.init(Za.ca, Za.ea);
        for (Xa = 0; Xa < Ra.length; Xa++)
          mathlib.CubieCube.CubeMult(
            Ua,
            mathlib.CubieCube.moveCube[Ra[Xa]],
            Za
          ),
            Ua.init(Za.ca, Za.ea);
        ja &&
          ((Ua.ori = mathlib.rn([1, 4, 8, 1, 1, 1, 24][ja])),
          Ua.selfConj(),
          (Ua.ori = 0));
        ab = Ua.toFaceCube();
        La = Q.solution(ab, 21, 1e9, 50, 2, Ja, ua);
      }
    } while (3 >= La.length);
    return La.replace(/ +/g, " ");
  }
  function e() {
    return a(0xffffffffffff, 0xffffffffffff, 1985229328, 0);
  }
  function h() {
    return a(0xba9876543210, 0, 4294967295, 4294967295);
  }
  function p(ma, za, T, aa) {
    return a(0xba987654ffff, 65535, 1985282047, 65535, aa);
  }
  function q(ma, za, T, aa) {
    ma = R[scrMgr.fixCase(T, G)][0];
    za = Math.pow(16, ma & 15);
    T = Math.pow(16, (ma >> 8) & 15);
    return a(
      0xba9f7654ffff - 7 * za,
      64424574975 - (15 ^ ((ma >> 4) & 1)) * za,
      1986002943 - 11 * T,
      1048575 - (15 ^ ((ma >> 12) & 3)) * T,
      aa,
      d
    );
  }
  function m(ma, za, T, aa, ja) {
    var pa = za[scrMgr.fixCase(aa, T)][0];
    za = [[5, 10], [7, 19], [3, -1], [1, -1], null, null, null, null, [23, 12]][
      pa & 15
    ];
    T = (pa >> 4) & 1;
    aa = [
      [8, 20, 9],
      [6, -1, 18],
      [0, -1, -1],
      [2, 11, -1],
      [-1, 15, 26],
    ][(pa >> 8) & 15];
    pa = (pa >> 12) & 3;
    ma = ma.split("");
    for (var qa = 0; 3 > qa; qa++)
      2 > qa && 0 <= za[qa] && (ma[za[qa]] = "BR".charAt(T ^ qa)),
        0 <= aa[qa] && (ma[aa[qa]] = "URB".charAt((pa + 3 + qa) % 3));
    image.face3Image(ma.join(""), ja);
  }
  function r(ma, za, T, aa) {
    return a(0xffff7654ffff, 0xffff0000ffff, 4294967295, 4294967295, aa);
  }
  function H(ma, za, T, aa) {
    ma = Ba[scrMgr.fixCase(T, sa)];
    return a(ma[2] + 0xba9876540000, 0, ma[0] + 1985216512, ma[1], aa, d, d);
  }
  function y(ma, za) {
    var T = Ba[ma][3];
    if (!za) return [T, null, ta[ma]];
    image.llImage.drawImage(T, null, za);
  }
  function A(ma, za, T, aa) {
    ma = na[scrMgr.fixCase(T, U)];
    return a(0xba987654ffff, 0, ma[0] + 1985216512, ma[1], aa, d, d);
  }
  function w(ma, za, T) {
    ma = na[scrMgr.fixCase(T, U)];
    za = E(4);
    T = [];
    for (var aa = 0; aa < d.length; aa++) T.push(d[aa].concat(l[za]));
    return (
      a(0xba98f6f4ffff, 4042326015, ma[0] + 1985216512, ma[1], 0, T, d) + D[za]
    );
  }
  function v(ma, za, T) {
    ma = na[za][2].replace(/e/g, ma || "U");
    if (!T) return [ma, null, ba[za]];
    image.llImage.drawImage(ma, null, T);
  }
  function u(ma, za, T, aa) {
    return a(0xba9876543f1f, 0, 1985282047, 65535, aa, d);
  }
  function I(ma, za, T, aa) {
    ma = la[scrMgr.fixCase(T, ka)];
    return a(0xba9876540000 + ma[1], 0, 1984954368 + ma[0], 0, aa, d, d);
  }
  function z() {
    var ma = E(4);
    return a(0xba98f6f4ffff, 4042326015, 1985229328, 0, 0, [l[ma]], d) + D[ma];
  }
  function O(ma, za, T, aa) {
    ma = na[scrMgr.fixCase(T, U)];
    return a(0xba987654ffff, 65535, ma[0] + 1985216512, ma[1], aa, d, d);
  }
  function J(ma, za, T, aa) {
    return a(0xba987654ffff, 65535, 1985229328, 0, aa);
  }
  function P(ma, za) {
    var T = da[ma].slice(1);
    2 == T.length &&
      (T = T.concat([
        [T[0][1], T[0][0]],
        [T[1][1], T[1][0]],
      ]));
    T = ["DDDDDDDDD" + da[ma][0], T];
    if (!za) return T.concat([Ma[ma]]);
    image.llImage.drawImage(T[0], T[1], za);
  }
  function W(ma, za) {
    for (var T = "", aa = wa[ma][4], ja = 0; 21 > ja; ja++)
      4 == ja ? (T += "D") : ((T += aa & 1 ? "D" : "G"), (aa >>= 1));
    if (!za) return [T, null, Ea[ma]];
    image.llImage.drawImage(T, null, za);
  }
  function X(ma, za) {
    var T = " x x2 x' z z'".split(" "),
      aa = ["", "y", "y2", "y'"];
    if (0 == ia.length)
      for (var ja = 0; 24 > ja; ja++) {
        var pa = new mathlib.CubieCube();
        pa.selfMoveStr(aa[ja & 3]);
        pa.selfMoveStr(T[ja >> 2]);
        ia.push(pa.toPerm(null, null, null, !0));
      }
    ja = pa = 0;
    a: for (; 24 > ja; ja++) {
      for (var qa = 0; 6 > qa; qa++)
        if (ma[ia[ja][9 * qa + 4]] != "URFDLB".charAt(qa)) continue a;
      pa = [];
      for (qa = 0; 54 > qa; qa++) pa[qa] = ma[ia[ja][qa]];
      ma = pa.join("");
      pa = ja;
      break;
    }
    T = T[pa >> 2];
    "" != T && za.push(T[0] + "'2 ".charAt("2'".indexOf(T[1]) + 1));
    aa = aa[pa & 3];
    "" != aa && za.push(aa[0] + "'2 ".charAt("2'".indexOf(aa[1]) + 1));
    return ma;
  }
  function V(ma) {
    var za = ma.join("|");
    if (!oa[za]) {
      for (var T = [], aa = 0; aa < ma.length; aa++) {
        var ja = new mathlib.CubieCube();
        ja.selfMoveStr(ma[aa]);
        T.push(ja.toPerm(null, null, null, !0));
      }
      oa[za] = new grouplib.SubgroupSolver(T);
      oa[za].initTables();
    }
    T = "";
    if (1e8 > oa[za].sgsG.size()) {
      do
        (T = oa[za].sgsG.rndElem()),
          (T = oa[za]
            .DissectionSolve(T, 12, 20)
            .map(function (pa) {
              return ma[pa[0]] + ["", "2", "'"][pa[1] - 1];
            })
            .join(" "));
      while (2 >= T.length);
      return T.replace(/ +/g, " ");
    }
    do {
      T = oa[za].sgsG.rndElem();
      for (aa = 0; aa < T.length; aa++) T[aa] = "URFDLB".charAt(~~(T[aa] / 9));
      aa = [];
      T = X(T.join(""), aa);
      T = Q.solution(T, 21, 1e9, 50, 2);
    } while (3 >= T.length);
    aa.unshift(T);
    return aa.join(" ").replace(/ +/g, " ");
  }
  var Q = new min2phase.Search(),
    d = [[], [0], [1], [2]],
    l = [[], [3, 14], [4, 13], [5, 12]],
    D = ["", "x'", "x2", "x"],
    x = [[]],
    R = [
      [8192, 4, "Easy-01"],
      [4113, 4, "Easy-02"],
      [8210, 4, "Easy-03"],
      [4099, 4, "Easy-04"],
      [8195, 4, "RE-05"],
      [4114, 4, "RE-06"],
      [8194, 4, "RE-07"],
      [4115, 4, "RE-08"],
      [8211, 4, "REFC-09"],
      [4098, 4, "REFC-10"],
      [8208, 4, "REFC-11"],
      [4097, 4, "REFC-12"],
      [8209, 4, "REFC-13"],
      [4096, 4, "REFC-14"],
      [8193, 4, "SPGO-15"],
      [4112, 4, "SPGO-16"],
      [0, 4, "SPGO-17"],
      [17, 4, "SPGO-18"],
      [3, 4, "PMS-19"],
      [18, 4, "PMS-20"],
      [2, 4, "PMS-21"],
      [19, 4, "PMS-22"],
      [1, 4, "Weird-23"],
      [16, 4, "Weird-24"],
      [1024, 4, "CPEU-25"],
      [1041, 4, "CPEU-26"],
      [5120, 4, "CPEU-27"],
      [9233, 4, "CPEU-28"],
      [5137, 4, "CPEU-29"],
      [9216, 4, "CPEU-30"],
      [24, 4, "EPCU-31"],
      [8, 4, "EPCU-32"],
      [8200, 4, "EPCU-33"],
      [4104, 4, "EPCU-34"],
      [8216, 4, "EPCU-35"],
      [4120, 4, "EPCU-36"],
      [1048, 1, "ECP-37"],
      [5128, 1, "ECP-38"],
      [9224, 1, "ECP-39"],
      [5144, 1, "ECP-40"],
      [9240, 1, "ECP-41"],
      [1032, 1, "Solved-42"],
    ],
    G = mathlib.idxArray(R, 1);
  N = mathlib.idxArray(R, 2);
  for (var L = [], F = [], K = [], M = 0; M < R.length; M++)
    R[M][0] & 240 || (L.push(R[M]), F.push(G[M]), K.push(N[M]));
  var S = [],
    Z = [];
  for (M = 0; 27 > M; M++)
    (S[M] = (~~(M / 9) << 12) | (~~(M / 3) % 3 << 8) | M % 3), (Z[M] = 1);
  var fa = [],
    ea = [],
    va = [];
  for (M = 0; 216 > M; M++) {
    var ra = M % 27,
      ya = ~~(M / 27);
    fa[M] = [
      (~~(ra / 9) % 3 << 12) | (~~(ra / 3) % 3 << 8) | ra % 3,
      (((ya >> 2) & 1) << 12) | (((ya >> 1) & 1) << 8) | (ya & 1),
    ];
    ea[M] = 1;
    va[M] =
      "WVLS;UB;UF;UF UB;UL;UB UL;UF UL;No Edge".split(";")[ya] + "-" + (ra + 1);
  }
  var Ba = (function () {
      for (
        var ma = [], za = [], T = new mathlib.CubieCube(), aa = 0;
        15552 > aa;
        aa++
      )
        if (!((ma[aa >> 5] >> (aa & 31)) & 1)) {
          var ja = aa % 24,
            pa = ~~(aa / 24) % 24,
            qa = ~~(aa / 24 / 24);
          if (mathlib.getNParity(pa, 4) == mathlib.getNParity(ja, 4)) {
            qa = mathlib.setNOri([], qa, 4, -3);
            pa = mathlib.setNPerm([], pa, 4, 0);
            var ua = mathlib.setNPerm([], ja, 4, 0);
            ja = [0, 0, 0, null, 0, null];
            for (var Ja = 0; 4 > Ja; Ja++)
              (ja[0] += pa[Ja] << (4 * Ja)),
                (ja[1] += qa[Ja] << (4 * Ja)),
                (ja[2] += ua[Ja] << (4 * Ja));
            for (var La = 0; 16 > La; La++) {
              var ab = La >> 2,
                Ta = La & 3,
                gb = [],
                Na = [],
                Ra = [];
              for (Ja = 0; 4 > Ja; Ja++)
                (gb[(Ja + ab) & 3] = qa[Ja]),
                  (Na[(Ja + ab) & 3] = (pa[Ja] + Ta) & 3),
                  (Ra[(Ja + ab) & 3] = (ua[Ja] + Ta) & 3);
              Ja = mathlib.getNOri(gb, 4, -3);
              Na = mathlib.getNPerm(Na, 4, 0);
              Ra = mathlib.getNPerm(Ra, 4, 0);
              Ja = 24 * (24 * Ja + Na) + Ra;
              (ma[Ja >> 5] >> (Ja & 31)) & 1 ||
                ((ma[Ja >> 5] |= 1 << (Ja & 31)), ja[4]++);
            }
            for (Ja = 0; 12 > Ja; Ja++)
              (T.ea[Ja] = ua[Ja] << 1),
                8 > Ja && (T.ca[Ja] = (qa[Ja] << 3) | pa[Ja]);
            qa = ja;
            pa = [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 9, 10, 11, 45, 46, 47, 36,
              37, 38,
            ];
            Ja = T.toPerm();
            ua = [];
            for (La = 0; La < pa.length; La++)
              ua[La] = "DDDDDDDDDLLLLLLLLLFFFFFFFFFUUUUUUUUURRRRRRRRRBBBBBBBBB"[
                Ja[pa[La]]
              ];
            pa = ua.join("");
            qa[3] = pa;
            0 < aa && za.push(ja);
          }
        }
      ma = {
        0: "O",
        18: "U",
        33: "T",
        258: "L",
        273: "aS",
        546: "S",
        4386: "Pi",
        4626: "H",
      };
      T = {};
      for (Ja = 0; Ja < za.length; Ja++)
        (ja = za[Ja]),
          (aa = ma[ja[1]]),
          (T[aa] = T[aa] || []),
          (qa = T[aa]),
          (pa = qa.indexOf(ja[0])),
          -1 == pa ? ((pa = qa.length), qa.push(ja[0], 1)) : qa[pa + 1]++,
          (ja[5] = aa + ((pa >> 1) + 1) + "-" + T[aa][pa + 1]);
      return za;
    })(),
    sa = mathlib.idxArray(Ba, 4),
    ta = mathlib.idxArray(Ba, 5),
    na = [
      [12816, 8481, "FeFeeeBeBLGRDGDRGLDGD", 2, "H-1"],
      [8961, 4626, "ReLeeeReLBGBDGDFGFDGD", 2, "H-2"],
      [4611, 4626, "ReBeeeLeBFGRDGDLGFDGD", 4, "H-3"],
      [8211, 4626, "LeReeeFeFRGLDGDBGBDGD", 4, "H-4"],
      [12321, 4128, "DeLeeeReDBGRFGBDGFLGD", 4, "L-1"],
      [4611, 513, "DeReeeLeDFGBRGFDGLBGD", 4, "L-2"],
      [8961, 258, "DeBeeeLeDFGRFGRDGLBGD", 4, "L-3"],
      [12816, 4128, "DeLeeeFeDRGFLGBDGBRGD", 4, "L-4"],
      [12546, 4128, "DeLeeeLeDFGBRGBDGRFGD", 4, "L-5"],
      [8211, 513, "DeReeeReDBGLBGFDGFLGD", 4, "L-6"],
      [12816, 4386, "LeFeeeReFBGDRGLDGBDGD", 4, "Pi-1"],
      [8961, 8466, "FeLeeeFeRRGDBGBDGLDGD", 4, "Pi-2"],
      [4611, 4641, "ReLeeeReLBGDFGBDGFDGD", 4, "Pi-3"],
      [12546, 4386, "BeFeeeFeBRGDLGLDGRDGD", 4, "Pi-4"],
      [8211, 4641, "BeLeeeLeFFGDRGBDGRDGD", 4, "Pi-5"],
      [12321, 4386, "BeReeeLeBFGDLGFDGRDGD", 4, "Pi-6"],
      [12816, 8736, "ReBeeeFeDRGFLGDLGDBGD", 4, "S-1"],
      [8961, 546, "BeReeeLeDFGRFGDBGDLGD", 4, "S-2"],
      [12321, 8736, "BeReeeFeDRGFLGDBGDLGD", 4, "S-3"],
      [8211, 8706, "ReBeeeLeDFGRFGDLGDBGD", 4, "S-4"],
      [12546, 8736, "FeBeeeLeDFGBRGDLGDRGD", 4, "S-5"],
      [4611, 8706, "LeReeeFeDRGLBGDBGDFGD", 4, "S-6"],
      [4611, 4098, "BeLeeeDeDBGRFGDFGRDGL", 4, "T-1"],
      [12546, 8448, "ReBeeeDeDLGBRGDLGFDGF", 4, "T-2"],
      [8961, 528, "BeFeeeDeDBGFLGDRGRDGL", 4, "T-3"],
      [12816, 8448, "FeFeeeDeDBGBRGDRGLDGL", 4, "T-4"],
      [8211, 4098, "BeBeeeDeDLGRFGDLGRDGF", 4, "T-5"],
      [12321, 8448, "FeBeeeDeDRGRFGDLGLDGB", 4, "T-6"],
      [8961, 288, "LeLeeeDeDFGBRGBDGDFGR", 4, "U-1"],
      [12816, 4608, "LeReeeDeDBGBRGFDGDFGL", 4, "U-2"],
      [12321, 4608, "FeFeeeDeDBGBRGLDGDRGL", 4, "U-3"],
      [8211, 8193, "BeFeeeDeDFGBRGLDGDLGR", 4, "U-4"],
      [4611, 8193, "ReFeeeDeDBGRFGLDGDBGL", 4, "U-5"],
      [12546, 4608, "LeBeeeDeDBGRFGRDGDFGL", 4, "U-6"],
      [12816, 4353, "LeFeeeDeRRGFDGLDGBDGB", 4, "aS-1"],
      [8961, 4368, "ReFeeeDeLRGBDGLDGFDGB", 4, "aS-2"],
      [12321, 4353, "LeBeeeDeFFGLDGRDGBDGR", 4, "aS-3"],
      [8211, 4113, "LeFeeeDeBFGRDGLDGBDGR", 4, "aS-4"],
      [4611, 4113, "FeBeeeDeLFGBDGRDGLDGR", 4, "aS-5"],
      [12546, 4353, "FeBeeeDeRBGFDGRDGLDGL", 4, "aS-6"],
      [12321, 0, "DeDeeeDeDBGRFGBRGFLGL", 4, "O-Adj"],
      [8961, 0, "DeDeeeDeDBGFLGRFGBRGL", 1, "O-Diag"],
      [12816, 0, "DeDeeeDeDBGBRGRFGFLGL", 1, "O-AUF"],
    ],
    U = mathlib.idxArray(na, 3),
    ba = mathlib.idxArray(na, 4),
    la = [
      [205840, 12816, "FBar-1"],
      [205840, 12546, "FBar-2"],
      [205840, 12321, "FBar-3"],
      [205840, 8961, "FBar-4"],
      [205840, 8496, "FBar-5"],
      [205840, 8211, "FBar-6"],
      [205840, 4896, "FBar-7"],
      [205840, 4611, "FBar-8"],
      [205840, 4146, "FBar-9"],
      [205840, 786, "FBar-10"],
      [205840, 561, "FBar-11"],
      [205840, 291, "FBar-12"],
      [205825, 12801, "2Opp-1"],
      [205825, 12576, "2Opp-2"],
      [205825, 12306, "2Opp-3"],
      [205825, 8976, "2Opp-4"],
      [205825, 8451, "2Opp-5"],
      [205825, 8241, "2Opp-6"],
      [205825, 4866, "2Opp-7"],
      [205825, 4656, "2Opp-8"],
      [205825, 4131, "2Opp-9"],
      [205825, 801, "2Opp-10"],
      [205825, 531, "2Opp-11"],
      [205825, 306, "2Opp-12"],
      [201760, 12801, "ROpp-1"],
      [201760, 12576, "ROpp-2"],
      [201760, 12306, "ROpp-3"],
      [201760, 8976, "ROpp-4"],
      [201760, 8451, "ROpp-5"],
      [201760, 8241, "ROpp-6"],
      [201760, 4866, "ROpp-7"],
      [201760, 4656, "ROpp-8"],
      [201760, 4131, "ROpp-9"],
      [201760, 801, "ROpp-10"],
      [201760, 531, "ROpp-11"],
      [201760, 306, "ROpp-12"],
      [201730, 12816, "RBar-1"],
      [201730, 12546, "RBar-2"],
      [201730, 12321, "RBar-3"],
      [201730, 8961, "RBar-4"],
      [201730, 8496, "RBar-5"],
      [201730, 8211, "RBar-6"],
      [201730, 4896, "RBar-7"],
      [201730, 4611, "RBar-8"],
      [201730, 4146, "RBar-9"],
      [201730, 786, "RBar-10"],
      [201730, 561, "RBar-11"],
      [201730, 291, "RBar-12"],
      [197665, 12816, "2Bar-1"],
      [197665, 12546, "2Bar-2"],
      [197665, 12321, "2Bar-3"],
      [197665, 8961, "2Bar-4"],
      [197665, 8496, "2Bar-5"],
      [197665, 8211, "2Bar-6"],
      [197665, 4896, "2Bar-7"],
      [197665, 4611, "2Bar-8"],
      [197665, 4146, "2Bar-9"],
      [197665, 786, "2Bar-10"],
      [197665, 561, "2Bar-11"],
      [197665, 291, "2Bar-12"],
      [197650, 12801, "FOpp-1"],
      [197650, 12576, "FOpp-2"],
      [197650, 12306, "FOpp-3"],
      [197650, 8976, "FOpp-4"],
      [197650, 8451, "FOpp-5"],
      [197650, 8241, "FOpp-6"],
      [197650, 4866, "FOpp-7"],
      [197650, 4656, "FOpp-8"],
      [197650, 4131, "FOpp-9"],
      [197650, 801, "FOpp-10"],
      [197650, 531, "FOpp-11"],
      [197650, 306, "FOpp-12"],
    ],
    ka = [],
    Aa = [];
  for (M = 0; M < la.length; M++) (ka[M] = 1), (Aa[M] = la[M][2]);
  var Da = [
      [4146, 12816, 1, "H"],
      [12546, 12816, 4, "Ua"],
      [12321, 12816, 4, "Ub"],
      [8961, 12816, 2, "Z"],
      [12816, 12321, 4, "Aa"],
      [12816, 12546, 4, "Ab"],
      [12816, 8961, 2, "E"],
      [12306, 12801, 4, "F"],
      [8496, 12321, 4, "Ga"],
      [4896, 12546, 4, "Gb"],
      [12321, 12546, 4, "Gc"],
      [12546, 12321, 4, "Gd"],
      [12801, 12801, 4, "Ja"],
      [12576, 12801, 4, "Jb"],
      [4656, 12306, 1, "Na"],
      [12306, 12306, 1, "Nb"],
      [531, 12801, 4, "Ra"],
      [8976, 12801, 4, "Rb"],
      [4656, 12801, 4, "T"],
      [12576, 12306, 4, "V"],
      [12801, 12306, 4, "Y"],
    ],
    Ha = mathlib.idxArray(Da, 2),
    Ma = mathlib.idxArray(Da, 3),
    da = [
      ["BFBRLRFBFLRL", [1, 7], [3, 5]],
      ["BRBRLRFFFLBL", [3, 7], [7, 5], [5, 3]],
      ["BLBRBRFFFLRL", [3, 5], [5, 7], [7, 3]],
      ["LFLBRBRBRFLF", [1, 5], [3, 7]],
      ["LBBRRLBFRFLF", [0, 2], [2, 6], [6, 0]],
      ["RBFLRRFFLBLB", [0, 6], [6, 8], [8, 0]],
      ["LBRFRBRFLBLF", [0, 6], [2, 8]],
      ["BFRFRBRBFLLL", [1, 7], [2, 8]],
      ["BRRFLBRBFLFL"],
      ["BFRFBBRLFLRL"],
      ["BFRFLBRRFLBL"],
      ["BLRFFBRBFLRL"],
      ["BBRFFBRRFLLL", [1, 5], [2, 8]],
      ["LBBRLLBRRFFF", [2, 8], [5, 7]],
      ["FBBRLLBFFLRR", [2, 6], [3, 5]],
      ["BBFLLRFFBRRL", [0, 8], [3, 5]],
      ["LLBRBLBFRFRF", [1, 3], [2, 8]],
      ["RBFLFRFLLBRB", [2, 8], [3, 7]],
      ["BBRFLBRFFLRL", [2, 8], [3, 5]],
      ["BBFLFRFRBRLL", [0, 8], [1, 5]],
      ["BBFLRRFLBRFL", [0, 8], [1, 3]],
    ],
    wa = [
      [0, 0, 1, "PLL", 255],
      [4369, 4626, 2, "Point-1", 965120],
      [4369, 4386, 4, "Point-2", 907776],
      [4369, 546, 4, "Point-3", 374304],
      [4369, 273, 4, "Point-4", 447360],
      [17, 8226, 4, "Square-5", 538123],
      [17, 4113, 4, "Square-6", 396054],
      [17, 8706, 4, "SLBS-7", 79402],
      [17, 273, 4, "SLBS-8", 410514],
      [17, 4368, 4, "Fish-9", 152458],
      [17, 8736, 4, "Fish-10", 627788],
      [17, 546, 4, "SLBS-11", 595470],
      [17, 4353, 4, "SLBS-12", 281363],
      [257, 8226, 4, "Knight-13", 108088],
      [257, 273, 4, "Knight-14", 181144],
      [257, 546, 4, "Knight-15", 566809],
      [257, 4113, 4, "Knight-16", 166684],
      [4369, 258, 4, "Point-17", 308097],
      [4369, 18, 4, "Point-18", 300805],
      [4369, 33, 4, "Point-19", 825861],
      [4369, 0, 1, "CO-20", 299685],
      [0, 4626, 2, "OCLL-21", 83290],
      [0, 4386, 4, "OCLL-22", 672858],
      [0, 18, 4, "OCLL-23", 82170],
      [0, 33, 4, "OCLL-24", 66014],
      [0, 258, 4, "OCLL-25", 132222],
      [0, 273, 4, "OCLL-26", 133470],
      [0, 546, 4, "OCLL-27", 74874],
      [17, 0, 4, "CO-28", 4783],
      [17, 528, 4, "Awkward-29", 70542],
      [17, 8448, 4, "Awkward-30", 144042],
      [17, 33, 4, "P-31", 328598],
      [17, 4098, 4, "P-32", 22059],
      [257, 33, 4, "T-33", 99228],
      [257, 528, 4, "C-34", 172728],
      [17, 4128, 4, "Fish-35", 303569],
      [17, 258, 4, "W-36", 803475],
      [17, 8208, 4, "Fish-37", 13195],
      [17, 513, 4, "W-38", 72238],
      [257, 4128, 4, "BLBS-39", 100924],
      [257, 258, 4, "BLBS-40", 574105],
      [17, 4608, 4, "Awkward-41", 86698],
      [17, 288, 4, "Awkward-42", 38221],
      [17, 18, 4, "P-43", 918166],
      [17, 8193, 4, "P-44", 14891],
      [257, 18, 4, "T-45", 688796],
      [257, 288, 4, "C-46", 276579],
      [17, 4641, 4, "L-47", 338706],
      [17, 4386, 4, "L-48", 677386],
      [17, 8466, 4, "L-49", 935442],
      [17, 8721, 4, "L-50", 967760],
      [257, 4641, 4, "I-51", 109336],
      [257, 4386, 4, "I-52", 342338],
      [17, 8481, 4, "L-53", 345874],
      [17, 4626, 4, "L-54", 87818],
      [257, 8481, 2, "I-55", 116504],
      [257, 4626, 2, "I-56", 698904],
      [257, 0, 2, "CO-57", 33469],
    ],
    ha = mathlib.idxArray(wa, 2),
    Ea = mathlib.idxArray(wa, 3),
    Ka = [[], [9], [10], [11]],
    Qa = ["", "y", "y2", "y'"];
  ra =
    "UR UF UL UB DR DF DL DB RF LF LB RB URF UFL ULB UBR DFR DLF DBL DRB".split(
      " "
    );
  for (M = 0; 20 > M; M++)
    (ya = ra[M]),
      (ra[M + 20] = (2 == ya.length ? "OriE-" : "OriC-") + ya),
      (ra[M] = (2 == ya.length ? "PermE-" : "PermC-") + ya);
  M = mathlib.valuedArray(40, 0);
  var ia = [],
    oa = {};
  scrMgr.reg("333", C)("333fm", function () {
    return (
      "R' U' F " +
      a(
        0xffffffffffff,
        0xffffffffffff,
        4294967295,
        4294967295,
        0,
        void 0,
        void 0,
        2,
        1
      ) +
      "R' U' F"
    );
  })("edges", e)("corners", h)(
    "333custom",
    function (ma, za, T, aa) {
      var ja = (za = ma = 0),
        pa = 0,
        qa = 4352;
      T = T || mathlib.valuedArray(40, 1);
      for (var ua = 0; 12 > ua; ua++)
        (qa += (T[ua] ? 69632 : 0) + (T[ua + 20] ? 16 : 0)),
          (ma += (T[ua] ? 15 : ua) * Math.pow(16, ua)),
          (za += (T[ua + 20] ? 15 : 0) * Math.pow(16, ua));
      for (ua = 0; 8 > ua; ua++)
        (qa += (T[ua + 12] ? 65792 : 0) + (T[ua + 32] ? 1 : 0)),
          (ja += (T[ua + 12] ? 15 : ua) * Math.pow(16, ua)),
          (pa += (T[ua + 32] ? 15 : 0) * Math.pow(16, ua));
      return 0 == (qa & 1887470) ? "U' U " : a(ma, za, ja, pa, aa);
    },
    [ra, M]
  )("ll", p)("lsll2", q, [
    N,
    G,
    m.bind(null, "GGGGDGGGGGGGGRRGRRGGGBBGBBG", R, G),
  ])("f2l", r)("zbll", H, [ta, sa, y])("zzll", u)("zbls", q, [
    N,
    G,
    m.bind(null, "GGGGDGGGGGGGGRRGRRGGGBBGBBG", R, G),
  ])("ttll", I, [
    Aa,
    ka,
    function (ma, za) {
      for (var T = [], aa = la[ma], ja = 3; 0 <= ja; ja--)
        T.push(["FR", "LF", "BL", "RB", "GG"][(aa[0] >> (4 * ja)) & 15]),
          T.push("RFLB".charAt((aa[1] >> (4 * ja)) & 15));
      T = T.join("");
      T = T.slice(7) + T.slice(0, 7);
      T = ["GDDDDDDDD" + T, null];
      if (!za) return T.concat([Aa[ma]]);
      image.llImage.drawImage(T[0], T[1], za);
    },
  ])(
    "eols",
    function (ma, za, T, aa) {
      ma = L[scrMgr.fixCase(T, F)][0];
      za = Math.pow(16, (ma >> 8) & 15);
      return a(
        0xba9f7654ffff - 7 * Math.pow(16, ma & 15),
        0,
        1986002943 - 11 * za,
        1048575 - (15 ^ ((ma >> 12) & 3)) * za,
        aa,
        d
      );
    },
    [K, F, m.bind(null, "GDGDDDGDGGGGGRRGRRGGGBBDBBG", L, F)]
  )(
    "wvls",
    function (ma, za, T, aa) {
      ma = S[scrMgr.fixCase(T, Z)];
      return a(0xba9f7654ff8f, 0, 1986002767, 983072 | ma, aa);
    },
    [
      "Oriented Rectangle-1 Rectangle-2 Tank-1 Bowtie-1 Bowtie-3 Tank-2 Bowtie-2 Bowtie-4 Snake-1 Adjacent-1 Adjacent-2 Gun-Far Sune-1 Pi-Near Gun-Back Pi-Front H-Side Snake-2 Adjacent-3 Adjacent-4 Gun-Sides H-Front Pi-Back Gun-Near Pi-Far Sune-2".split(
        " "
      ),
      Z,
      function (ma, za) {
        ma = S[scrMgr.fixCase(ma, Z)];
        var T = ["DGG", "GDG", "GGD"];
        T = T[ma & 3] + T[(ma >> 8) & 3] + T[(ma >> 12) & 3];
        image.llImage.drawImage(
          "3D6DDDBB0RR21G87G54GU".replace(/[0-9]/g, function (aa) {
            return T[~~aa];
          }),
          null,
          za
        );
      },
    ]
  )(
    "vls",
    function (ma, za, T, aa) {
      ma = fa[scrMgr.fixCase(T, ea)];
      return a(
        0xba9f7654ff8f,
        64424509440 + ma[1],
        1986002767,
        983072 + ma[0],
        aa,
        [[2]]
      );
    },
    [
      va,
      ea,
      function (ma, za) {
        ma = fa[scrMgr.fixCase(ma, ea)];
        var T = ["DGG", "GDG", "GGD"];
        T = T[ma[0] & 3] + T[(ma[0] >> 8) & 3] + T[(ma[0] >> 12) & 3];
        var aa = ["DG", "GD"];
        aa = aa[ma[1] & 3] + aa[(ma[1] >> 8) & 3] + aa[(ma[1] >> 12) & 3];
        image.llImage.drawImage(
          "6a0eDR3cR4dUFF21b87f5"
            .replace(/[0-9]/g, function (ja) {
              return T[~~ja];
            })
            .replace(/[a-z]/g, function (ja) {
              return aa[ja.charCodeAt(0) - 97];
            }),
          null,
          za
        );
      },
    ]
  )("lse", z)("cmll", w, [ba, U, v.bind(null, "G")])("cll", O, [
    ba,
    U,
    v.bind(null, "G"),
  ])("coll", A, [ba, U, v.bind(null, "D")])("ell", J)(
    "pll",
    function (ma, za, T, aa) {
      ma = Da[scrMgr.fixCase(T, Ha)];
      return a(ma[0] + 0xba9876540000, 0, ma[1] + 1985216512, 0, aa, d, d);
    },
    [Ma, Ha, P]
  )(
    "oll",
    function (ma, za, T, aa) {
      ma = wa[scrMgr.fixCase(T, ha)];
      return a(0xba987654ffff, ma[0], 1985282047, ma[1], aa, d, d);
    },
    [Ea, ha, W]
  )("2gll", function (ma, za, T, aa) {
    return a(0xba987654ffff, 0, 1985229328, 65535, aa, d);
  })("sbrx", function (ma, za, T) {
    ma = E(4);
    return (
      a(0xfa9ff6ffffff, 0xf00ff0ffffff, 4133486591, 4027580415, 0, [l[ma]]) +
      D[ma]
    );
  })("half", V.bind(null, "U2 R2 F2 D2 L2 B2".split(" ")))(
    "333drud",
    V.bind(null, "U R2 F2 D L2 B2".split(" "))
  )("3gen_F", V.bind(null, ["U", "R", "F"]))(
    "3gen_L",
    V.bind(null, ["U", "R", "L"])
  )("2gen", V.bind(null, ["U", "R"]))("2genl", V.bind(null, ["U", "L"]))(
    "RrU",
    V.bind(null, ["R", "Rw", "U"])
  )("roux", V.bind(null, ["M", "U"]))("mt3qb", function () {
    var ma = mathlib.rn(4);
    return (
      a(0xffff765fffff, 0xffff000fffff, 4133486591, 4027580415, 0, [Ka[ma]]) +
      Qa[ma]
    );
  })("mteole", function () {
    var ma = mathlib.rn(4),
      za = mathlib.rn(4);
    return (
      a(
        0xba98765fffff + 4294967296 * (17767 & (15 << (4 * ma))),
        1048575 + 4294967296 * (15 << (4 * ma)),
        4133486591,
        4027580415,
        0,
        [Ka[za]]
      ) + Qa[za]
    );
  })("mttdr", function () {
    return a(0xba98765fffff, 0, 4133486591, 4027580415);
  })("mt6cp", function () {
    return a(0xba98765fffff, 0, 4133486591, 0);
  })("mtl5ep", function () {
    return a(0xba98765fffff, 0, 1985229328, 0);
  })("mtcdrll", function () {
    return a(0xba98765fffff, 0, 1985282047, 65535);
  })("easyc", function (ma, za, T, aa) {
    ma = cross.getEasyCross(za);
    return a(ma[0], ma[1], 4294967295, 4294967295, aa);
  })("easyxc", function (ma, za, T, aa) {
    ma = cross.getEasyXCross(za);
    return a(ma[0], ma[1], ma[2], ma[3], aa);
  })("eoline", function (ma, za, T, aa) {
    return a(0xffff7f5fffff, 0, 4294967295, 4294967295, aa);
  })("eocross", function (ma, za, T, aa) {
    return a(0xffff7654ffff, 0, 4294967295, 4294967295, aa);
  });
  return {
    getRandomScramble: C,
    getEdgeScramble: e,
    getCornerScramble: h,
    getLLScramble: p,
    getLSLLScramble: q,
    getCOLLScramble: A,
    getZBLLScramble: H,
    getZZLLScramble: u,
    getTTLLScramble: I,
    getF2LScramble: r,
    getLSEScramble: z,
    getCMLLScramble: w,
    getCLLScramble: O,
    getELLScramble: J,
    getAnyScramble: a,
    getPLLImage: P,
    getOLLImage: W,
    getCOLLImage: v,
    getZBLLImage: y,
    genFacelet: function (ma) {
      return Q.solution(ma, 21, 1e9, 50, 2);
    },
    solvFacelet: function (ma) {
      return Q.solution(ma, 21, 1e9, 50, 0);
    },
  };
})(
  mathlib.getNPerm,
  mathlib.setNPerm,
  mathlib.getNParity,
  mathlib.rn,
  mathlib.rndEl
);
var scramble_444 = (function (b, N) {
  function t(B, Y) {
    var ca;
    var xa = Array(B);
    if (void 0 != Y) for (ca = 0; ca < B; ca++) xa[ca] = Array(Y);
    return xa;
  }
  function E() {
    Xa = arguments[0].prototype;
    for (var B = 1; B < arguments.length; ++B) arguments[B].prototype = Xa;
  }
  function n() {}
  function C() {
    C = n;
    bb = t(15582, 36);
    rb = t(15582);
    db = t(15582);
    ib = t(48, 48);
    Sa = t(48, 36);
    sb = t(48);
    hb = t(48);
  }
  function c(B, Y) {
    for (var ca = 0; 24 > ca; ++ca) if (B.ct[ca] != Y.ct[ca]) return !1;
    return !0;
  }
  function k(B) {
    for (var Y = 0, ca = 8, xa = 23; 0 <= xa; --xa)
      1 == B.ct[xa] && (Y += b[xa][ca--]);
    return Y;
  }
  function g(B, Y, ca) {
    for (var xa = 0, Ca = 8, Ga = 23; 0 <= Ga; --Ga)
      if ((1 == B.ct[Y[Ga]] && (xa += b[Ga][Ca--]), xa >= ca)) return -1;
    return xa;
  }
  function f(B) {
    var Y;
    if (null != $a)
      for (Y = 0; 48 > Y; Y++) {
        var ca = g(B, nb[Y], mathlib.Cnk[21][8]);
        if (-1 != ca) return (B = $a[ca]), (B & -64) | ib[Y][B & 63];
      }
    for (Y = 0; 48 > Y; ++Y) {
      ca = k(B);
      a: {
        var xa;
        var Ca = 0;
        for (xa = rb.length - 1; Ca <= xa; ) {
          var Ga = Ca + ((xa - Ca) >> 1);
          var Fa = rb[Ga];
          if (Fa < ca) Ca = Ga + 1;
          else if (Fa > ca) xa = Ga - 1;
          else {
            ca = Ga;
            break a;
          }
        }
        ca = -Ca - 1;
      }
      ca = 0 <= ca ? ca : -1;
      if (-1 != ca) return 64 * ca + Y;
      a(B, 0);
      1 == Y % 2 && a(B, 1);
      7 == Y % 8 && a(B, 2);
      15 == Y % 16 && a(B, 3);
    }
  }
  function a(B, Y) {
    switch (Y) {
      case 0:
        W(B, 19);
        W(B, 28);
        break;
      case 1:
        W(B, 21);
        W(B, 32);
        break;
      case 2:
        ua(B.ct, 0, 3, 1, 2, 1);
        ua(B.ct, 8, 11, 9, 10, 1);
        ua(B.ct, 4, 7, 5, 6, 1);
        ua(B.ct, 12, 15, 13, 14, 1);
        ua(B.ct, 16, 19, 21, 22, 1);
        ua(B.ct, 17, 18, 20, 23, 1);
        break;
      case 3:
        W(B, 18), W(B, 29), W(B, 24), W(B, 35);
    }
  }
  function e(B, Y) {
    var ca;
    for (ca = 0; ca < Y; ++ca)
      a(B, 0),
        1 == ca % 2 && a(B, 1),
        7 == ca % 8 && a(B, 2),
        15 == ca % 16 && a(B, 3);
  }
  function h(B, Y) {
    var ca;
    var xa = 8;
    for (ca = 23; 0 <= ca; --ca)
      (B.ct[ca] = 0), Y >= b[ca][xa] && ((Y -= b[ca][xa--]), (B.ct[ca] = 1));
  }
  function p(B, Y) {
    var ca;
    for (ca = 0; 24 > ca; ++ca) B.ct[ca] = Y.ct[ca];
  }
  function q(B) {
    if (B) this.ct = B.ct.slice();
    else for (this.ct = [], B = 0; 24 > B; ++B) this.ct[B] = 8 > B ? 1 : 0;
  }
  function m() {
    m = n;
    Ia = t(70, 28);
    Mb = t(6435, 28);
    Oa = t(70, 16);
    tb = t(6435, 16);
    mb = t(450450);
    ob = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0,
      0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0,
    ];
  }
  function r(B) {
    var Y;
    var ca = 0;
    var xa = 8;
    for (Y = 14; 0 <= Y; --Y) B.ct[Y] != B.ct[15] && (ca += b[Y][xa--]);
    return ca;
  }
  function H(B) {
    var Y;
    var ca = 0;
    var xa = 4;
    for (Y = 6; 0 <= Y; --Y) B.rl[Y] != B.rl[7] && (ca += b[Y][xa--]);
    return 2 * ca + B.parity;
  }
  function y(B, Y) {
    B.parity ^= ob[Y];
    var ca = Y % 3;
    switch (~~(Y / 3)) {
      case 0:
        ua(B.ct, 0, 1, 2, 3, ca);
        break;
      case 1:
        ua(B.rl, 0, 1, 2, 3, ca);
        break;
      case 2:
        ua(B.ct, 8, 9, 10, 11, ca);
        break;
      case 3:
        ua(B.ct, 4, 5, 6, 7, ca);
        break;
      case 4:
        ua(B.rl, 4, 5, 6, 7, ca);
        break;
      case 5:
        ua(B.ct, 12, 13, 14, 15, ca);
        break;
      case 6:
        ua(B.ct, 0, 1, 2, 3, ca);
        ua(B.rl, 0, 5, 4, 1, ca);
        ua(B.ct, 8, 9, 12, 13, ca);
        break;
      case 7:
        ua(B.rl, 0, 1, 2, 3, ca);
        ua(B.ct, 1, 15, 5, 9, ca);
        ua(B.ct, 2, 12, 6, 10, ca);
        break;
      case 8:
        ua(B.ct, 8, 9, 10, 11, ca);
        ua(B.rl, 0, 3, 6, 5, ca);
        ua(B.ct, 3, 2, 5, 4, ca);
        break;
      case 9:
        ua(B.ct, 4, 5, 6, 7, ca);
        ua(B.rl, 3, 2, 7, 6, ca);
        ua(B.ct, 11, 10, 15, 14, ca);
        break;
      case 10:
        ua(B.rl, 4, 5, 6, 7, ca);
        ua(B.ct, 0, 8, 4, 14, ca);
        ua(B.ct, 3, 11, 7, 13, ca);
        break;
      case 11:
        ua(B.ct, 12, 13, 14, 15, ca),
          ua(B.rl, 1, 4, 7, 2, ca),
          ua(B.ct, 1, 0, 7, 6, ca);
    }
  }
  function A(B, Y) {
    switch (Y) {
      case 0:
        y(B, 19);
        y(B, 28);
        break;
      case 1:
        y(B, 21);
        y(B, 32);
        break;
      case 2:
        ua(B.ct, 0, 3, 1, 2, 1),
          ua(B.ct, 8, 11, 9, 10, 1),
          ua(B.ct, 4, 7, 5, 6, 1),
          ua(B.ct, 12, 15, 13, 14, 1),
          ua(B.rl, 0, 3, 5, 6, 1),
          ua(B.rl, 1, 2, 4, 7, 1);
    }
  }
  function w(B, Y, ca) {
    var xa;
    for (xa = 0; 16 > xa; ++xa) B.ct[xa] = Y.ct[xa] % 3;
    for (xa = 0; 8 > xa; ++xa) B.rl[xa] = Y.ct[xa + 16];
    B.parity = ca;
  }
  function v(B, Y) {
    var ca;
    var xa = 8;
    B.ct[15] = 0;
    for (ca = 14; 0 <= ca; --ca)
      Y >= b[ca][xa] ? ((Y -= b[ca][xa--]), (B.ct[ca] = 1)) : (B.ct[ca] = 0);
  }
  function u(B, Y) {
    var ca;
    B.parity = Y & 1;
    Y >>>= 1;
    var xa = 4;
    B.rl[7] = 0;
    for (ca = 6; 0 <= ca; --ca)
      Y >= b[ca][xa] ? ((Y -= b[ca][xa--]), (B.rl[ca] = 1)) : (B.rl[ca] = 0);
  }
  function I() {
    this.rl = t(8);
    this.ct = t(16);
    this.parity = 0;
  }
  function z() {
    z = n;
    Va = t(29400, 20);
    eb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
    fb = t(29400);
    lb = [0, 9, 14, 23, 27, 28, 41, 42, 46, 55, 60, 69];
    zb = t(70);
  }
  function O(B) {
    var Y;
    var ca = 0;
    var xa = 4;
    for (Y = 6; 0 <= Y; --Y) B.ud[Y] != B.ud[7] && (ca += b[Y][xa--]);
    ca *= 35;
    xa = 4;
    for (Y = 6; 0 <= Y; --Y) B.fb[Y] != B.fb[7] && (ca += b[Y][xa--]);
    var Ca = B.fb[7] ^ B.ud[7];
    var Ga = 0;
    xa = 4;
    for (Y = 7; 0 <= Y; --Y) B.rl[Y] != Ca && (Ga += b[Y][xa--]);
    return B.parity + 2 * (12 * ca + zb[Ga]);
  }
  function J(B, Y, ca) {
    var xa;
    var Ca =
      (Y.ct[0] % 3 > Y.ct[8] % 3) ^
      (Y.ct[8] % 3 > Y.ct[16] % 3) ^
      (Y.ct[0] % 3 > Y.ct[16] % 3)
        ? 0
        : 1;
    for (xa = 0; 8 > xa; ++xa)
      (B.ud[xa] = ~~(Y.ct[xa] / 3) ^ 1),
        (B.fb[xa] = ~~(Y.ct[xa + 8] / 3) ^ 1),
        (B.rl[xa] = ~~(Y.ct[xa + 16] / 3) ^ 1 ^ Ca);
    B.parity = Ca ^ ca;
  }
  function P() {
    this.ud = t(8);
    this.rl = t(8);
    this.fb = t(8);
    this.parity = 0;
  }
  function W(B, Y) {
    var ca = Y % 3;
    switch (~~(Y / 3)) {
      case 6:
        ua(B.ct, 8, 20, 12, 16, ca), ua(B.ct, 9, 21, 13, 17, ca);
      case 0:
        ua(B.ct, 0, 1, 2, 3, ca);
        break;
      case 7:
        ua(B.ct, 1, 15, 5, 9, ca), ua(B.ct, 2, 12, 6, 10, ca);
      case 1:
        ua(B.ct, 16, 17, 18, 19, ca);
        break;
      case 8:
        ua(B.ct, 2, 19, 4, 21, ca), ua(B.ct, 3, 16, 5, 22, ca);
      case 2:
        ua(B.ct, 8, 9, 10, 11, ca);
        break;
      case 9:
        ua(B.ct, 10, 18, 14, 22, ca), ua(B.ct, 11, 19, 15, 23, ca);
      case 3:
        ua(B.ct, 4, 5, 6, 7, ca);
        break;
      case 10:
        ua(B.ct, 0, 8, 4, 14, ca), ua(B.ct, 3, 11, 7, 13, ca);
      case 4:
        ua(B.ct, 20, 21, 22, 23, ca);
        break;
      case 11:
        ua(B.ct, 1, 20, 7, 18, ca), ua(B.ct, 0, 23, 6, 17, ca);
      case 5:
        ua(B.ct, 12, 13, 14, 15, ca);
    }
  }
  function X() {
    this.ct = [];
    for (var B = 0; 24 > B; ++B) this.ct[B] = Yb[B] >> 4;
  }
  function V() {
    V = n;
    qb = t(18);
    var B, Y;
    qb[0] = new x(15120, 0);
    qb[3] = new x(21021, 1494);
    qb[6] = new x(8064, 1236);
    qb[9] = new x(9, 0);
    qb[12] = new x(1230, 412);
    qb[15] = new x(224, 137);
    for (B = 0; 18 > B; B += 3)
      for (Y = 0; 2 > Y; ++Y)
        (qb[B + Y + 1] = new D()), l(qb[B + Y], qb[B], qb[B + Y + 1]);
  }
  function Q(B) {
    B.cp = [0, 1, 2, 3, 4, 5, 6, 7];
    B.co = [0, 0, 0, 0, 0, 0, 0, 0];
  }
  function d(B, Y) {
    var ca;
    for (ca = 0; 8 > ca; ++ca) (B.cp[ca] = Y.cp[ca]), (B.co[ca] = Y.co[ca]);
  }
  function l(B, Y, ca) {
    var xa;
    for (xa = 0; 8 > xa; ++xa) {
      ca.cp[xa] = B.cp[Y.cp[xa]];
      var Ca = B.co[Y.cp[xa]];
      var Ga = Y.co[xa];
      var Fa = Ca;
      Fa += 3 > Ca ? Ga : 6 - Ga;
      Fa %= 3;
      (3 <= Ca) ^ (3 <= Ga) && (Fa += 3);
      ca.co[xa] = Fa;
    }
  }
  function D() {
    Q(this);
  }
  function x(B, Y) {
    Q(this);
    mathlib.setNPerm(this.cp, B, 8);
    B = Y;
    var ca = 0;
    for (Y = 6; 0 <= Y; --Y) (ca += this.co[Y] = B % 3), (B = ~~(B / 3));
    this.co[7] = (15 - ca) % 3;
  }
  function R() {
    R = n;
    Ab = new Int32Array(1937880);
    hc = t(1538);
    Bc = t(1538);
    qc = t(1538);
    Cc = t(11880);
    $c = [0, 1, 6, 3, 4, 5, 2, 7];
    ic = t(168, 12);
    jc = t(168, 12);
    rc = [
      1, 1, 1, 3, 12, 60, 360, 2520, 20160, 181440, 1814400, 19958400,
      239500800,
    ];
    Eb = [0, 2, 4, 6, 1, 3, 7, 5, 8, 9, 10, 11];
  }
  function G(B, Y, ca, xa, Ca) {
    var Ga = B.edgeo[Ca];
    B.edgeo[Ca] = B.edge[xa];
    B.edge[xa] = B.edgeo[ca];
    B.edgeo[ca] = B.edge[Y];
    B.edge[Y] = Ga;
  }
  function L(B, Y, ca) {
    B.isStd || va(B);
    B = B.edge;
    for (var xa = 0, Ca = 0, Ga = 0; Ga < Y; Ga++) {
      var Fa = B[Ga];
      xa = xa * (12 - Ga) + Fa - mathlib.bitCount(Ca & ((1 << Fa) - 1));
      Ca |= 1 << Fa;
    }
    return ca ? Ca : xa;
  }
  function F(B) {
    B.isStd || va(B);
    return ta(B.edge, 20) >> 3;
  }
  function K(B, Y) {
    B.isStd = !1;
    switch (Y) {
      case 0:
        N(B.edge, 0, 4, 1, 5);
        N(B.edgeo, 0, 4, 1, 5);
        break;
      case 1:
        ra(B.edge, 0, 4, 1, 5);
        ra(B.edgeo, 0, 4, 1, 5);
        break;
      case 2:
        N(B.edge, 0, 5, 1, 4);
        N(B.edgeo, 0, 5, 1, 4);
        break;
      case 3:
        ra(B.edge, 5, 10, 6, 11);
        ra(B.edgeo, 5, 10, 6, 11);
        break;
      case 4:
        N(B.edge, 0, 11, 3, 8);
        N(B.edgeo, 0, 11, 3, 8);
        break;
      case 5:
        ra(B.edge, 0, 11, 3, 8);
        ra(B.edgeo, 0, 11, 3, 8);
        break;
      case 6:
        N(B.edge, 0, 8, 3, 11);
        N(B.edgeo, 0, 8, 3, 11);
        break;
      case 7:
        N(B.edge, 2, 7, 3, 6);
        N(B.edgeo, 2, 7, 3, 6);
        break;
      case 8:
        ra(B.edge, 2, 7, 3, 6);
        ra(B.edgeo, 2, 7, 3, 6);
        break;
      case 9:
        N(B.edge, 2, 6, 3, 7);
        N(B.edgeo, 2, 6, 3, 7);
        break;
      case 10:
        ra(B.edge, 4, 8, 7, 9);
        ra(B.edgeo, 4, 8, 7, 9);
        break;
      case 11:
        N(B.edge, 1, 9, 2, 10);
        N(B.edgeo, 1, 9, 2, 10);
        break;
      case 12:
        ra(B.edge, 1, 9, 2, 10);
        ra(B.edgeo, 1, 9, 2, 10);
        break;
      case 13:
        N(B.edge, 1, 10, 2, 9);
        N(B.edgeo, 1, 10, 2, 9);
        break;
      case 14:
        ra(B.edge, 0, 4, 1, 5);
        ra(B.edgeo, 0, 4, 1, 5);
        N(B.edge, 9, 11);
        N(B.edgeo, 8, 10);
        break;
      case 15:
        ra(B.edge, 5, 10, 6, 11);
        ra(B.edgeo, 5, 10, 6, 11);
        N(B.edge, 1, 3);
        N(B.edgeo, 0, 2);
        break;
      case 16:
        ra(B.edge, 0, 11, 3, 8);
        ra(B.edgeo, 0, 11, 3, 8);
        N(B.edge, 5, 7);
        N(B.edgeo, 4, 6);
        break;
      case 17:
        ra(B.edge, 2, 7, 3, 6);
        ra(B.edgeo, 2, 7, 3, 6);
        N(B.edge, 8, 10);
        N(B.edgeo, 9, 11);
        break;
      case 18:
        ra(B.edge, 4, 8, 7, 9);
        ra(B.edgeo, 4, 8, 7, 9);
        N(B.edge, 0, 2);
        N(B.edgeo, 1, 3);
        break;
      case 19:
        ra(B.edge, 1, 9, 2, 10),
          ra(B.edgeo, 1, 9, 2, 10),
          N(B.edge, 4, 6),
          N(B.edgeo, 5, 7);
    }
  }
  function M(B, Y) {
    B.isStd = !1;
    switch (Y) {
      case 0:
        K(B, 14);
        K(B, 17);
        break;
      case 1:
        G(B, 11, 5, 10, 6);
        G(B, 5, 10, 6, 11);
        G(B, 1, 2, 3, 0);
        G(B, 4, 9, 7, 8);
        G(B, 8, 4, 9, 7);
        G(B, 0, 1, 2, 3);
        break;
      case 2:
        ya(B, 4, 5),
          ya(B, 5, 4),
          ya(B, 11, 8),
          ya(B, 8, 11),
          ya(B, 7, 6),
          ya(B, 6, 7),
          ya(B, 9, 10),
          ya(B, 10, 9),
          ya(B, 1, 1),
          ya(B, 0, 0),
          ya(B, 3, 3),
          ya(B, 2, 2);
    }
  }
  function S(B, Y) {
    for (; 2 <= Y; ) (Y -= 2), M(B, 1), M(B, 2);
    0 != Y && M(B, 0);
  }
  function Z(B, Y) {
    var ca, xa;
    var Ca = 1985229328;
    var Ga = 47768;
    for (ca = xa = 0; 11 > ca; ++ca) {
      var Fa = rc[11 - ca];
      var Pa = ~~(Y / Fa);
      Y %= Fa;
      xa ^= Pa;
      Pa <<= 2;
      32 <= Pa
        ? ((Pa -= 32),
          (B.edge[ca] = (Ga >> Pa) & 15),
          (Fa = (1 << Pa) - 1),
          (Ga = (Ga & Fa) + ((Ga >> 4) & ~Fa)))
        : ((B.edge[ca] = (Ca >> Pa) & 15),
          (Fa = (1 << Pa) - 1),
          (Ca = (Ca & Fa) + ((Ca >>> 4) & ~Fa) + (Ga << 28)),
          (Ga >>= 4));
    }
    0 == (xa & 1)
      ? (B.edge[11] = Ca)
      : ((B.edge[11] = B.edge[10]), (B.edge[10] = Ca));
    for (ca = 0; 12 > ca; ++ca) B.edgeo[ca] = ca;
    B.isStd = !0;
  }
  function fa(B, Y) {
    var ca;
    for (ca = 0; 12 > ca; ++ca)
      (B.edge[ca] = Y.edge[ca]), (B.edgeo[ca] = Y.edgeo[ca]);
    B.isStd = Y.isStd;
  }
  function ea(B, Y) {
    var ca;
    null == B.temp && (B.temp = t(12));
    for (ca = 0; 12 > ca; ++ca)
      (B.temp[ca] = ca), (B.edge[ca] = Y.ep[Eb[ca] + 12] % 12);
    var xa = 1;
    for (ca = 0; 12 > ca; ++ca)
      for (; B.edge[ca] != ca; ) {
        var Ca = B.edge[ca];
        B.edge[ca] = B.edge[Ca];
        B.edge[Ca] = Ca;
        var Ga = B.temp[ca];
        B.temp[ca] = B.temp[Ca];
        B.temp[Ca] = Ga;
        xa ^= 1;
      }
    for (ca = 0; 12 > ca; ++ca) B.edge[ca] = B.temp[Y.ep[Eb[ca]] % 12];
    return xa;
  }
  function va(B) {
    var Y;
    null == B.temp && (B.temp = t(12));
    for (Y = 0; 12 > Y; ++Y) B.temp[B.edgeo[Y]] = Y;
    for (Y = 0; 12 > Y; ++Y) (B.edge[Y] = B.temp[B.edge[Y]]), (B.edgeo[Y] = Y);
    B.isStd = !0;
  }
  function ra(B, Y, ca, xa, Ca) {
    var Ga = B[Y];
    B[Y] = B[xa];
    B[xa] = Ga;
    Ga = B[ca];
    B[ca] = B[Ca];
    B[Ca] = Ga;
  }
  function ya(B, Y, ca) {
    var xa = B.edge[Y];
    B.edge[Y] = B.edgeo[ca];
    B.edgeo[ca] = xa;
  }
  function Ba() {
    this.edge = t(12);
    this.edgeo = t(12);
    this.isStd = !0;
    this.temp = null;
  }
  function sa(B, Y) {
    return (B[Y >> 4] >> ((Y & 15) << 1)) & 3;
  }
  function ta(B, Y, ca) {
    var xa = Y << 3,
      Ca = 0,
      Ga = 0;
    if (void 0 !== ca && 1 == Tb[Y] % 3) (xa |= ca & 7), (Ca = ca >> 3);
    else {
      Y = jc[xa];
      ca = ic[xa];
      for (var Fa = 0; 4 > Fa; Fa++) {
        var Pa = Y[B[ca[Fa]]];
        Ca = Ca * (12 - Fa) + Pa - mathlib.bitCount(Ga & ((1 << Pa) - 1));
        Ga |= 1 << Pa;
      }
      Ca = Cc[Ca];
      xa |= Ca & 7;
      Ca >>= 3;
    }
    Y = jc[xa];
    ca = ic[xa];
    Ga = Bc[Ca];
    for (Fa = 4; 10 > Fa; Fa++)
      (Pa = Y[B[ca[Fa]]]),
        (Ca = Ca * (12 - Fa) + Pa - mathlib.bitCount(Ga & ((1 << Pa) - 1))),
        (Ga |= 1 << Pa);
    return (Ca << 3) | (xa & 7);
  }
  function na(B) {
    var Y = new Ba();
    var ca = 0;
    var xa = sa(Ab, B);
    if (3 == xa) return Dc;
    for (; 0 != B; ) {
      xa = (xa + 2) % 3;
      var Ca = ~~(B / 20160);
      Ca = hc[Ca];
      var Ga = B % 20160;
      Z(Y, 20160 * Ca + Ga);
      for (Ga = 0; 17 > Ga; ++Ga)
        if (((Ca = ta(Y.edge, Ga) >> 3), sa(Ab, Ca) == xa)) {
          ++ca;
          B = Ca;
          break;
        }
    }
    return ca;
  }
  function U(B, Y, ca) {
    B[Y >> 4] ^= (3 ^ ca) << ((Y & 15) << 1);
  }
  function ba(B, Y) {
    var ca = Y % 3;
    switch (~~(Y / 3)) {
      case 6:
        ua(B.ep, 9, 22, 11, 20, ca);
      case 0:
        ua(B.ep, 0, 1, 2, 3, ca);
        ua(B.ep, 12, 13, 14, 15, ca);
        break;
      case 7:
        ua(B.ep, 2, 16, 6, 12, ca);
      case 1:
        ua(B.ep, 11, 15, 10, 19, ca);
        ua(B.ep, 23, 3, 22, 7, ca);
        break;
      case 8:
        ua(B.ep, 3, 19, 5, 13, ca);
      case 2:
        ua(B.ep, 0, 11, 6, 8, ca);
        ua(B.ep, 12, 23, 18, 20, ca);
        break;
      case 9:
        ua(B.ep, 8, 23, 10, 21, ca);
      case 3:
        ua(B.ep, 4, 5, 6, 7, ca);
        ua(B.ep, 16, 17, 18, 19, ca);
        break;
      case 10:
        ua(B.ep, 14, 0, 18, 4, ca);
      case 4:
        ua(B.ep, 1, 20, 5, 21, ca);
        ua(B.ep, 13, 8, 17, 9, ca);
        break;
      case 11:
        ua(B.ep, 7, 15, 1, 17, ca);
      case 5:
        ua(B.ep, 2, 9, 4, 10, ca), ua(B.ep, 14, 21, 16, 22, ca);
    }
  }
  function la() {
    this.ep = [];
    for (var B = 0; 24 > B; ++B) this.ep[B] = B;
  }
  function ka() {
    ka = n;
    Ec = [35, 1, 34, 2, 4, 6, 22, 5, 19];
  }
  function Aa(B, Y) {
    var ca = B.edge;
    var xa = Y.edge,
      Ca;
    for (Ca = 0; 24 > Ca; ++Ca) ca.ep[Ca] = xa.ep[Ca];
    ca = B.center;
    xa = Y.center;
    for (Ca = 0; 24 > Ca; ++Ca) ca.ct[Ca] = xa.ct[Ca];
    d(B.corner, Y.corner);
    B.value = Y.value;
    B.add1 = Y.add1;
    B.length1 = Y.length1;
    B.length2 = Y.length2;
    B.length3 = Y.length3;
    B.sym = Y.sym;
    for (ca = 0; 60 > ca; ++ca) B.moveBuffer[ca] = Y.moveBuffer[ca];
    B.moveLength = Y.moveLength;
    B.edgeAvail = Y.edgeAvail;
    B.centerAvail = Y.centerAvail;
    B.cornerAvail = Y.cornerAvail;
  }
  function Da(B, Y) {
    for (var ca = 0, xa = 0, Ca = 0, Ga = 0, Fa = 0; 24 > Fa; Fa++)
      (B.center.ct[Fa] = Y[Yb[Fa]]), (ca += 1 << (4 * Y[Yb[Fa]]));
    for (Fa = 0; 24 > Fa; Fa++)
      for (var Pa = 0; 24 > Pa; Pa++)
        Y[Nb[Fa][0]] == Nb[Pa][0] >> 4 &&
          Y[Nb[Fa][1]] == Nb[Pa][1] >> 4 &&
          ((B.edge.ep[Fa] = Pa), (xa |= 1 << Pa));
    var cb;
    for (Fa = 0; 8 > Fa; Fa++) {
      for (cb = 0; 3 > cb && 0 != Y[Ob[Fa][cb]] && 3 != Y[Ob[Fa][cb]]; cb++);
      var Ya = Y[Ob[Fa][(cb + 1) % 3]];
      var Wa = Y[Ob[Fa][(cb + 2) % 3]];
      for (Pa = 0; 8 > Pa; Pa++)
        if (Ya == Ob[Pa][1] >> 4 && Wa == Ob[Pa][2] >> 4) {
          B.corner.cp[Fa] = Pa;
          B.corner.co[Fa] = cb % 3;
          Ca |= 1 << Pa;
          Ga += cb % 3;
          break;
        }
    }
    return (
      1 * (255 != Ca) +
      2 * (0 != Ga % 3) +
      4 * (4473924 != ca) +
      8 * (16777215 != xa)
    );
  }
  function Ha(B) {
    da(B);
    wa(B);
    ha(B);
    for (var Y = [], ca = 0; 24 > ca; ca++) Y[Yb[ca]] = B.center.ct[ca];
    for (ca = 0; 24 > ca; ca++)
      (Y[Nb[ca][0]] = Nb[B.edge.ep[ca]][0] >> 4),
        (Y[Nb[ca][1]] = Nb[B.edge.ep[ca]][1] >> 4);
    for (ca = 0; 8 > ca; ca++)
      for (var xa = B.corner.cp[ca], Ca = B.corner.co[ca], Ga = 0; 3 > Ga; Ga++)
        Y[Ob[ca][(Ga + Ca) % 3]] = Ob[xa][Ga] >> 4;
    return Y;
  }
  function Ma(B) {
    B = Ha(B);
    for (
      var Y = [
          [1, 2],
          [4, 8],
          [7, 11],
          [13, 14],
          [5, 6, 9, 10],
        ],
        ca = [0, 1, 3, 4, 5, 7, 12, 13, 15],
        xa = [],
        Ca = 0;
      6 > Ca;
      Ca++
    ) {
      for (var Ga = 0; Ga < Y.length; Ga++)
        for (var Fa = B[(Ca << 4) | Y[Ga][0]], Pa = 1; Pa < Y[Ga].length; Pa++)
          if (Fa != B[(Ca << 4) | Y[Ga][Pa]])
            return console.log("reduction error", Y[Ga][Pa], Y[Ga][0]), null;
      for (Ga = 0; Ga < ca.length; Ga++)
        xa[9 * Ca + Ga] = B[(Ca << 4) | ca[Ga]];
    }
    return xa;
  }
  function da(B) {
    for (; B.centerAvail < B.moveLength; )
      W(B.center, B.moveBuffer[B.centerAvail++]);
    return B.center;
  }
  function wa(B) {
    for (; B.cornerAvail < B.moveLength; ) {
      var Y = B.corner,
        ca = B.moveBuffer[B.cornerAvail++] % 18;
      !Y.temps && (Y.temps = new D());
      l(Y, qb[ca], Y.temps);
      d(Y, Y.temps);
    }
    return B.corner;
  }
  function ha(B) {
    for (; B.edgeAvail < B.moveLength; )
      ba(B.edge, B.moveBuffer[B.edgeAvail++]);
    return B.edge;
  }
  function Ea(B) {
    var Y, ca, xa;
    var Ca = Array(B.moveLength - (B.add1 ? 2 : 0));
    for (Y = ca = 0; Y < B.length1; ++Y) Ca[ca++] = B.moveBuffer[Y];
    var Ga = B.sym;
    for (Y = B.length1 + (B.add1 ? 2 : 0); Y < B.moveLength; ++Y)
      if (27 <= Sa[Ga][B.moveBuffer[Y]]) {
        Ca[ca++] = Sa[Ga][B.moveBuffer[Y]] - 9;
        var Fa = Ec[Sa[Ga][B.moveBuffer[Y]] - 27];
        Ga = ib[Ga][Fa];
      } else Ca[ca++] = Sa[Ga][B.moveBuffer[Y]];
    Y = ib[sb[Ga]];
    a: {
      B = da(B);
      B = new q(B);
      for (xa = 0; 48 > xa; ++xa) {
        Fa = !0;
        for (Ga = 0; 24 > Ga; ++Ga)
          if (B.ct[Ga] != Yb[Ga] >> 4) {
            Fa = !1;
            break;
          }
        if (Fa) {
          B = xa;
          break a;
        }
        a(B, 0);
        1 == xa % 2 && a(B, 1);
        7 == xa % 8 && a(B, 2);
        15 == xa % 16 && a(B, 3);
      }
      B = -1;
    }
    Y = Y[B];
    B = [];
    Ga = Y;
    for (Y = ca - 1; 0 <= Y; --Y)
      (Fa = Ca[Y]),
        (Fa = 3 * ~~(Fa / 3) + (2 - (Fa % 3))),
        27 <= Sa[Ga][Fa]
          ? (B.push(Sa[Ga][Fa] - 9),
            (Fa = Ec[Sa[Ga][Fa] - 27]),
            (Ga = ib[Ga][Fa]))
          : B.push(Sa[Ga][Fa]);
    Ga = -1;
    ca = 0;
    xa = [0, 0, 0];
    for (Y = 0; Y < B.length; ++Y) {
      Fa = B[Y];
      if (Ga != ~~(Fa / 3) % 3) {
        for (Ca = 0; 3 > Ca; Ca++)
          xa[Ca] % 4 &&
            ((B[ca++] = Fc[9 * Ca + 3 * Ga + xa[Ca] - 1] + " "), (xa[Ca] = 0));
        Ga = ~~(Fa / 3) % 3;
      }
      xa[~~(Fa / 9)] += (Fa % 3) + 1;
    }
    for (Ca = 0; 3 > Ca; Ca++)
      xa[Ca] % 4 &&
        ((B[ca++] = Fc[9 * Ca + 3 * Ga + xa[Ca] - 1] + " "), (xa[Ca] = 0));
    return (B = B.slice(0, ca).join(""));
  }
  function Ka(B, Y) {
    B.moveBuffer[B.moveLength++] = Y;
  }
  function Qa() {
    this.moveBuffer = t(60);
    this.edge = new la();
    this.center = new X();
    this.corner = new D();
  }
  function ia(B) {
    Qa.call(this);
    Aa(this, B);
  }
  function oa() {
    oa = n;
    var B, Y;
    Fc =
      "U  ;U2 ;U' ;R  ;R2 ;R' ;F  ;F2 ;F' ;D  ;D2 ;D' ;L  ;L2 ;L' ;B  ;B2 ;B' ;Uw ;Uw2;Uw';Rw ;Rw2;Rw';Fw ;Fw2;Fw';Dw ;Dw2;Dw';Lw ;Lw2;Lw';Bw ;Bw2;Bw'".split(
        ";"
      );
    Ub = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 22,
      23, 25, 28, 30, 31, 32, 34, 36,
    ];
    Tb = [
      0, 1, 2, 4, 6, 7, 8, 9, 10, 11, 13, 15, 16, 17, 19, 22, 25, 28, 31, 34,
      36,
    ];
    ad = t(37);
    bd = t(37);
    Zb = t(37, 36);
    sc = t(29, 28);
    tc = t(21, 20);
    Gc = t(36);
    kc = t(28);
    Vb = t(20);
    Hc = t(36, 24);
    for (B = 0; 29 > B; ++B) ad[Ub[B]] = B;
    for (B = 0; 21 > B; ++B) bd[Tb[B]] = B;
    for (B = 0; 36 > B; ++B) {
      for (Y = 0; 36 > Y; ++Y)
        Zb[B][Y] =
          ~~(B / 3) == ~~(Y / 3) || (~~(B / 3) % 3 == ~~(Y / 3) % 3 && B > Y);
      Zb[36][B] = !1;
    }
    for (B = 0; 29 > B; ++B)
      for (Y = 0; 28 > Y; ++Y) sc[B][Y] = Zb[Ub[B]][Ub[Y]];
    for (B = 0; 21 > B; ++B)
      for (Y = 0; 20 > Y; ++Y) tc[B][Y] = Zb[Tb[B]][Tb[Y]];
    for (B = 0; 36 > B; ++B)
      for (Gc[B] = 36, Y = B; 36 > Y; ++Y)
        if (!Zb[B][Y]) {
          Gc[B] = Y - 1;
          break;
        }
    for (B = 0; 28 > B; ++B)
      for (kc[B] = 28, Y = B; 28 > Y; ++Y)
        if (!sc[B][Y]) {
          kc[B] = Y - 1;
          break;
        }
    for (B = 0; 20 > B; ++B)
      for (Vb[B] = 20, Y = B; 20 > Y; ++Y)
        if (!tc[B][Y]) {
          Vb[B] = Y - 1;
          break;
        }
    for (B = 0; 36 > B; ++B) {
      var ca = new la();
      ba(ca, B);
      for (Y = 0; 24 > Y; Y++) Hc[B][ca.ep[Y]] = Y;
    }
  }
  function ma(B) {
    B.solution = "";
    var Y = $.now();
    var ca = f(new q().fromCube(da(B.c), 0));
    var xa = f(new q().fromCube(da(B.c), 1));
    var Ca = f(new q().fromCube(da(B.c), 2));
    var Ga = db[ca >> 6];
    var Fa = db[xa >> 6];
    var Pa = db[Ca >> 6];
    B.p1SolsCnt = 0;
    B.arr2idx = 0;
    Ja(B.p1sols);
    for (
      B.length1 = Math.min(Ga, Fa, Pa);
      60 > B.length1 &&
      !(
        (Pa <= B.length1 && T(B, Ca >>> 6, Ca & 63, B.length1, -1, 0)) ||
        (Ga <= B.length1 && T(B, ca >>> 6, ca & 63, B.length1, -1, 0)) ||
        (Fa <= B.length1 && T(B, xa >>> 6, xa & 63, B.length1, -1, 0))
      );
      ++B.length1
    );
    ca = B.p1sols.array.slice();
    xa = $.now() - Y;
    DEBUG && console.log("[scramble 444] Phase 1 Done in", $.now() - Y);
    ca.sort(function (wb, Pb) {
      return wb.value - Pb.value;
    });
    Ca = 9;
    do {
      Pa = ca[0].value;
      a: for (; 60 > Pa; ++Pa)
        for (Fa = 0; Fa < ca.length; ++Fa) {
          var cb = ca[Fa];
          if (cb.value > Pa) break;
          if (!(Pa - cb.length1 > Ca)) {
            Aa(B.c1, cb);
            var Ya = ha(B.c1).ep;
            w(B.ct2, da(B.c1), qa(Ya));
            Ga = r(B.ct2);
            var Wa = H(B.ct2);
            B.length1 = cb.length1;
            B.length2 = Pa - cb.length1;
            B.epInv = [];
            for (cb = 0; 24 > cb; cb++) B.epInv[Ya[cb]] = cb;
            if (aa(B, Ga, Wa, B.length2, 28, 0)) break a;
          }
        }
      ++Ca;
    } while (60 == Pa);
    B.arr2.sort(function (wb, Pb) {
      return wb.value - Pb.value;
    });
    DEBUG && console.log("[scramble 444] Phase 2 Done in", $.now() - Y);
    Ca = $.now() - Y - xa;
    Pa = 0;
    ca = 13;
    do {
      Ga = B.arr2[0].value;
      a: for (; 60 > Ga; ++Ga)
        for (
          Fa = 0;
          Fa < Math.min(B.arr2idx, 100) && !(B.arr2[Fa].value > Ga);
          ++Fa
        )
          if (
            ((B.arr2[Fa].length3 =
              Ga - B.arr2[Fa].length1 - B.arr2[Fa].length2),
            !(B.arr2[Fa].length3 > ca))
          ) {
            Wa = ea(B.e12, ha(B.arr2[Fa]));
            J(B.ct3, da(B.arr2[Fa]), Wa ^ qa(wa(B.arr2[Fa]).cp));
            Wa = O(B.ct3);
            L(B.e12, 10);
            for (Ya = 0; 12 > Ya; Ya++) B.tempep[0][Ya] = B.e12.edge[Ya];
            Ya = na(F(B.e12));
            if (
              Ya <= B.arr2[Fa].length3 &&
              ja(B, B.tempep[0], Wa, Ya, B.arr2[Fa].length3, 20, 0)
            ) {
              Pa = Fa;
              break a;
            }
          }
      ++ca;
    } while (60 == Ga);
    DEBUG && console.log("[scramble 444] Phase 3 Done in", $.now() - Y);
    ca = $.now() - Y - xa - Ca;
    Pa = new ia(B.arr2[Pa]);
    B.length1 = Pa.length1;
    B.length2 = Pa.length2;
    B.length3 = Pa.length3;
    for (Fa = 0; Fa < B.length3; ++Fa) Ka(Pa, Tb[B.move3[Fa]]);
    (Ga = Ma(Pa)) || console.log("[scramble 444] Reduction Error!", Ha(Pa));
    for (Fa = 0; 54 > Fa; Fa++) Ga[Fa] = "URFDLB"[Ga[Fa]];
    Ga = Ga.join("");
    Fa = scramble_333.solvFacelet(Ga).split(" ");
    for (Wa = Ga = 0; Wa < Fa.length; Wa++)
      /^[URFDLB][2']?$/.exec(Fa[Wa]) &&
        (Ga++,
        Ka(Pa, 3 * "URFDLB".indexOf(Fa[Wa][0]) + "2'".indexOf(Fa[Wa][1]) + 1));
    B.solution = Ea(Pa);
    DEBUG && console.log("[scramble 444] 3x3x3 Done in", $.now() - Y);
    DEBUG &&
      console.log("[scramble 444] Phase depths: ", [
        B.length1,
        B.length2,
        B.length3,
        Ga,
        xa,
        Ca,
        ca,
      ]);
    return [B.length1, B.length2, B.length3, Ga, xa, Ca, ca];
  }
  function za(B) {
    "          U0U1U2U3\n          U4U5U6U7\n          U8U9UaUb\n          UcUdUeUf\nL0L1L2L3  F0F1F2F3  R0R1R2R3  B0B1B2B3\nL4L5L6L7  F4F5F6F7  R4R5R6R7  B4B5B6B7\nL8L9LaLb  F8F9FaFb  R8R9RaRb  B8B9BaBb\nLcLdLeLf  FcFdFeFf  RcRdReRf  BcBdBeBf\n          D0D1D2D3\n          D4D5D6D7\n          D8D9DaDb\n          DcDdDeDf\n".replace(
      /[URFDLB][0-9a-f]/g,
      function (Y) {
        var ca = "URFDLB".indexOf(Y[0]);
        Y = "0123456789abcdef".indexOf(Y[1]);
        return "URFDLB"[B[16 * ca + Y]] + " ";
      }
    );
  }
  function T(B, Y, ca, xa, Ca, Ga) {
    var Fa, Pa, cb;
    if (0 == Y) {
      if ((Y = 0 == xa)) {
        Aa(B.c1, B.c);
        for (Y = 0; Y < B.length1; ++Y) Ka(B.c1, B.move1[Y]);
        switch (hb[ca]) {
          case 0:
            Ka(B.c1, 24);
            Ka(B.c1, 35);
            B.move1[B.length1] = 24;
            B.move1[B.length1 + 1] = 35;
            B.add1 = !0;
            ca = 19;
            break;
          case 12869:
            Ka(B.c1, 18);
            Ka(B.c1, 29);
            B.move1[B.length1] = 18;
            B.move1[B.length1 + 1] = 29;
            B.add1 = !0;
            ca = 34;
            break;
          case 735470:
            (B.add1 = !1), (ca = 0);
        }
        w(B.ct2, da(B.c1), qa(ha(B.c1).ep));
        Y = r(B.ct2);
        xa = H(B.ct2);
        B.c1.value = mb[70 * Y + xa] + B.length1;
        B.c1.length1 = B.length1;
        B.c1.add1 = B.add1;
        B.c1.sym = ca;
        ++B.p1SolsCnt;
        if (500 > B.p1sols.size) var Ya = new ia(B.c1);
        else {
          ca = B.p1sols;
          if (0 == ca.size) Ya = null;
          else {
            Y = ca.array[0];
            xa = ca.size - 1;
            Ca = ca.array[xa];
            ca.array.splice(xa, 1);
            --ca.size;
            if (0 < ca.size) {
              La(ca, 0, Ca);
              xa = 0;
              Ca = ca.size;
              for (cb = ca.array[xa]; 2 * xa + 1 < Ca; ) {
                Ga =
                  ((Fa = 2 * xa + 1),
                  (Ya = Fa + 1),
                  (Pa = Fa),
                  Ya < Ca &&
                    0 > ca.array[Fa].value - ca.array[Ya].value &&
                    (Pa = Ya),
                  Pa);
                if (0 > ca.array[Ga].value - cb.value) break;
                La(ca, xa, ca.array[Ga]);
                xa = Ga;
              }
              La(ca, xa, cb);
            }
            Ya = Y;
          }
          Ya.value > B.c1.value && Aa(Ya, B.c1);
        }
        Fa = B.p1sols;
        b: {
          ca = Fa.size;
          for (Fa.array[Fa.size++] = Ya; 0 < ca; ) {
            Pa = ca;
            ca = (ca - 1) >> 1;
            if (0 >= Ya.value - Fa.array[ca].value) {
              La(Fa, Pa, Ya);
              break b;
            }
            La(Fa, Pa, Fa.array[ca]);
          }
          La(Fa, ca, Ya);
        }
        Y = 1e4 == B.p1SolsCnt;
      }
      return Y;
    }
    for (Fa = 0; 27 > Fa; Fa += 3)
      if (Fa != Ca && Fa != Ca - 9 && Fa != Ca - 18)
        for (cb = 0; 3 > cb; ++cb) {
          Pa = Fa + cb;
          Ya = bb[Y][Sa[ca][Pa]];
          var Wa = db[Ya >>> 6];
          if (Wa >= xa) {
            if (Wa > xa) break;
          } else if (
            ((Wa = ib[ca][Ya & 63]),
            (Ya >>>= 6),
            (B.move1[Ga] = Pa),
            T(B, Ya, Wa, xa - 1, Fa, Ga + 1))
          )
            return !0;
        }
    return !1;
  }
  function aa(B, Y, ca, xa, Ca, Ga) {
    var Fa;
    if (0 == Y && 0 == mb[ca] && 5 > xa) {
      if ((Y = 0 == xa)) {
        b: {
          Y = B.epInv;
          for (xa = ca = 0; 12 > xa; xa++) {
            Ca = Y[xa];
            Ga = Y[xa + 12];
            for (Fa = 0; Fa < B.length2; Fa++) {
              var Pa = Hc[B.move2[Fa]];
              Ca = Pa[Ca];
              Ga = Pa[Ga];
            }
            if (12 > Ca != 12 <= Ga) {
              Y = !1;
              break b;
            }
            ca ^= 12 <= Ca ? 1 : 0;
          }
          Y = 0 == ca;
        }
        if (Y) {
          Aa(B.c2, B.c1);
          for (Y = 0; Y < B.length2; ++Y) Ka(B.c2, B.move2[Y]);
          Y = ea(B.e12, ha(B.c2));
          J(B.ct3, da(B.c2), Y ^ qa(wa(B.c2).cp));
          Y = O(B.ct3);
          L(B.e12, 10);
          ca = na(F(B.e12));
          B.arr2[B.arr2idx]
            ? Aa(B.arr2[B.arr2idx], B.c2)
            : (B.arr2[B.arr2idx] = new ia(B.c2));
          B.arr2[B.arr2idx].value = B.length1 + B.length2 + Math.max(ca, fb[Y]);
          B.arr2[B.arr2idx].length2 = B.length2;
          ++B.arr2idx;
          Y = B.arr2idx == B.arr2.length;
        } else Y = !1;
      }
      return Y;
    }
    for (Pa = 0; 23 > Pa; ++Pa)
      if (sc[Ca][Pa]) Pa = kc[Pa];
      else {
        Fa = Mb[Y][Pa];
        var cb = Ia[ca][Pa];
        var Ya = mb[70 * Fa + cb];
        if (Ya >= xa) Ya > xa && (Pa = kc[Pa]);
        else if (((B.move2[Ga] = Ub[Pa]), aa(B, Fa, cb, xa - 1, Pa, Ga + 1)))
          return !0;
      }
    return !1;
  }
  function ja(B, Y, ca, xa, Ca, Ga, Fa) {
    if (0 == Ca) return !0;
    var Pa = B.tempep[Fa];
    if (20 != Ga)
      for (var cb = jc[Ga << 3], Ya = ic[Ga << 3], Wa = 0; 12 > Wa; Wa++)
        Pa[Wa] = cb[Y[Ya[Wa]]];
    for (Y = 0; 17 > Y; Y++)
      if (tc[Ga][Y]) Y = Vb[Y];
      else if (((cb = Va[ca][Y]), (Ya = fb[cb]), Ya >= Ca))
        Ya > Ca && 14 > Y && (Y = Vb[Y]);
      else if (
        ((Wa = ta(Pa, Y) >> 3),
        (Ya = xa),
        (Wa = sa(Ab, Wa)),
        (Ya = 3 == Wa ? Dc : (((1227133513 << Wa) >> Ya) & 3) + Ya - 1),
        Ya >= Ca)
      )
        Ya > Ca && 14 > Y && (Y = Vb[Y]);
      else if (ja(B, Pa, cb, Ya, Ca - 1, Y, Fa + 1))
        return (B.move3[Fa] = Y), !0;
    return !1;
  }
  function pa() {
    var B;
    this.p1sols = new ab();
    this.move1 = t(15);
    this.move2 = t(20);
    this.move3 = t(20);
    this.c1 = new Qa();
    this.c2 = new Qa();
    this.ct2 = new I();
    this.ct3 = new P();
    this.e12 = new Ba();
    this.tempep = t(20);
    this.arr2 = t(100);
    for (B = 0; 20 > B; ++B) this.tempep[B] = [];
    this.add1 = !1;
    this.arr2idx = 0;
    this.c = null;
    this.p1SolsCnt = this.length2 = this.length1 = 0;
    this.solution = "";
  }
  function qa(B) {
    for (var Y = 0, ca = 0, xa = 0; xa < B.length; xa++) {
      var Ca = B[xa];
      Y ^= Ca - mathlib.bitCount(ca & ((1 << Ca) - 1));
      ca |= 1 << Ca;
    }
    return Y & 1;
  }
  function ua(B, Y, ca, xa, Ca, Ga) {
    switch (Ga) {
      case 0:
        Ga = B[Ca];
        B[Ca] = B[xa];
        B[xa] = B[ca];
        B[ca] = B[Y];
        B[Y] = Ga;
        break;
      case 1:
        Ga = B[Y];
        B[Y] = B[xa];
        B[xa] = Ga;
        Ga = B[ca];
        B[ca] = B[Ca];
        B[Ca] = Ga;
        break;
      case 2:
        (Ga = B[Y]),
          (B[Y] = B[ca]),
          (B[ca] = B[xa]),
          (B[xa] = B[Ca]),
          (B[Ca] = Ga);
    }
  }
  function Ja(B) {
    B.array = [];
    B.size = 0;
  }
  function La(B, Y, ca) {
    var xa = B.array[Y];
    B.array[Y] = ca;
    return xa;
  }
  function ab() {
    this.array = [];
    this.array.length = 500;
    this.size = 0;
  }
  function Ta(B) {
    for (var Y = 0; Y < B.length; Y++) B[Y] = -1;
  }
  function gb() {
    gb = n;
    var B = $.now();
    DEBUG && console.log("[scramble 444] start initialization");
    oa();
    C();
    m();
    z();
    R();
    V();
    ka();
    DEBUG && console.log("[scramble 444] alloc tables", $.now() - B);
    var Y, ca, xa;
    var Ca = new q();
    for (Y = 0; 24 > Y; ++Y) Ca.ct[Y] = Y;
    var Ga = new q(Ca);
    var Fa = new q(Ca);
    var Pa = new q(Ca);
    for (Y = 0; 48 > Y; ++Y) {
      for (ca = 0; 48 > ca; ++ca) {
        for (xa = 0; 48 > xa; ++xa)
          c(Ca, Ga) && ((ib[Y][ca] = xa), 0 == xa && (sb[Y] = ca)),
            a(Ga, 0),
            1 == xa % 2 && a(Ga, 1),
            7 == xa % 8 && a(Ga, 2),
            15 == xa % 16 && a(Ga, 3);
        a(Ca, 0);
        1 == ca % 2 && a(Ca, 1);
        7 == ca % 8 && a(Ca, 2);
        15 == ca % 16 && a(Ca, 3);
      }
      a(Ca, 0);
      1 == Y % 2 && a(Ca, 1);
      7 == Y % 8 && a(Ca, 2);
      15 == Y % 16 && a(Ca, 3);
    }
    for (Y = 0; 48 > Y; ++Y)
      for (p(Ca, Fa), e(Ca, sb[Y]), ca = 0; 36 > ca; ++ca)
        for (p(Ga, Ca), W(Ga, ca), e(Ga, Y), xa = 0; 36 > xa; ++xa)
          if ((p(Pa, Fa), W(Pa, xa), c(Pa, Ga))) {
            Sa[Y][ca] = xa;
            break;
          }
    h(Ca, 0);
    for (Y = 0; 48 > Y; ++Y)
      (hb[sb[Y]] = k(Ca)),
        a(Ca, 0),
        1 == Y % 2 && a(Ca, 1),
        7 == Y % 8 && a(Ca, 2),
        15 == Y % 16 && a(Ca, 3);
    DEBUG && console.log("[scramble 444] initSymMeta", $.now() - B);
    $a = t(735471);
    var cb,
      Ya = new q();
    new q();
    nb = [];
    for (var Wa = 0; 24 > Wa; Wa++) Ya.ct[Wa] = Wa;
    for (var wb = 0; 48 > wb; wb++)
      (nb[wb] = Ya.ct.slice()),
        a(Ya, 0),
        1 == wb % 2 && a(Ya, 1),
        7 == wb % 8 && a(Ya, 2),
        15 == wb % 16 && a(Ya, 3);
    var Pb = t(22984);
    for (Wa = 0; 22984 > Wa; Wa++) Pb[Wa] = 0;
    var cd = 0;
    for (Wa = 0; Wa < mathlib.Cnk[21][8]; ++Wa)
      if (0 == (Pb[Wa >>> 5] & (1 << (Wa & 31)))) {
        h(Ya, Wa);
        for (cb = 0; 48 > cb; ++cb) {
          var lc = g(Ya, nb[cb], mathlib.Cnk[21][8]);
          -1 != lc &&
            ((Pb[lc >>> 5] |= 1 << (lc & 31)),
            null != $a && ($a[lc] = (cd << 6) | sb[cb]));
        }
        rb[cd++] = Wa;
      }
    DEBUG && console.log("[scramble 444] initCenter1Sym2Raw", $.now() - B);
    for (var Ic = new q(), dd = new q(), Db = 0; 15582 > Db; ++Db) {
      h(dd, rb[Db]);
      for (var Bb = 0; 36 > Bb; ++Bb)
        if (1 != Bb % 3 && void 0 === bb[Db][Bb]) {
          p(Ic, dd);
          W(Ic, Bb);
          var Hb = f(Ic);
          bb[Db][Bb] = Hb;
          var ed = Sa[Hb & 63][3 * ~~(Bb / 3) + 2 - (Bb % 3)];
          void 0 === bb[Hb >> 6][ed] &&
            (bb[Hb >> 6][ed] = (Db << 6) | sb[Hb & 63]);
        }
    }
    for (Db = 0; 15582 > Db; Db++)
      for (Bb = 0; 36 > Bb; Bb += 3) {
        Hb = bb[Db][Bb];
        var fd = bb[Hb >>> 6][Sa[Hb & 63][Bb]];
        bb[Db][Bb + 1] = (fd & -64) | ib[Hb & 63][fd & 63];
      }
    DEBUG && console.log("[scramble 444] initCenter1MoveTable", $.now() - B);
    $a = null;
    var Jc, $b, Kc, uc;
    Ta(db);
    var ac = (db[0] = 0);
    for (Jc = 1; 15582 != Jc; ) {
      var qd = (Kc = 4 < ac) ? -1 : ac;
      var rd = Kc ? ac : -1;
      ++ac;
      for ($b = 0; 15582 > $b; ++$b)
        if (db[$b] == qd)
          for (uc = 0; 27 > uc; ++uc) {
            var gd = bb[$b][uc] >>> 6;
            if (db[gd] == rd)
              if ((++Jc, Kc)) {
                db[$b] = ac;
                break;
              } else db[gd] = ac;
          }
    }
    DEBUG && console.log("[scramble 444] initCenter1Prun", $.now() - B);
    var Lc,
      jb,
      Cb,
      xb,
      yb = new I(),
      Mc = new I();
    for (jb = 0; 70 > jb; ++jb)
      for (xb = 0; 28 > xb; ++xb)
        u(yb, jb), y(yb, Ub[xb]), (Ia[jb][xb] = H(yb));
    for (jb = 0; 70 > jb; ++jb)
      for (u(yb, jb), Cb = 0; 16 > Cb; ++Cb)
        (Oa[jb][Cb] = H(yb)),
          A(yb, 0),
          1 == Cb % 2 && A(yb, 1),
          7 == Cb % 8 && A(yb, 2);
    for (jb = 0; 6435 > jb; ++jb)
      for (v(yb, jb), Cb = 0; 16 > Cb; ++Cb)
        (tb[jb][Cb] = r(yb)),
          A(yb, 0),
          1 == Cb % 2 && A(yb, 1),
          7 == Cb % 8 && A(yb, 2);
    for (jb = 0; 6435 > jb; ++jb)
      for (v(yb, jb), xb = 0; 28 > xb; ++xb)
        Mc.copy(yb), y(Mc, Ub[xb]), (Mb[jb][xb] = r(Mc));
    Ta(mb);
    var bc = (mb[0] = mb[18] = mb[28] = mb[46] = mb[54] = mb[56] = 0);
    for (Lc = 6; 450450 != Lc; ) {
      var Nc = 6 < bc,
        sd = Nc ? -1 : bc,
        td = Nc ? bc : -1;
      ++bc;
      for (jb = 0; 450450 > jb; ++jb)
        if (mb[jb] == sd) {
          var ud = ~~(jb / 70);
          var vd = jb % 70;
          for (xb = 0; 23 > xb; ++xb) {
            var wd = Mb[ud][xb];
            var xd = Ia[vd][xb];
            var hd = 70 * wd + xd;
            if (mb[hd] == td)
              if ((++Lc, Nc)) {
                mb[jb] = bc;
                break;
              } else mb[hd] = bc;
          }
        }
    }
    DEBUG && console.log("[scramble 444] initCenter2", $.now() - B);
    var Oc, ub, Fb;
    for (ub = 0; 12 > ub; ++ub) zb[lb[ub]] = ub;
    var id = new P(),
      Pc = new P();
    for (ub = 0; 29400 > ub; ++ub) {
      var Ib = void 0,
        Qc = void 0,
        Rc = void 0,
        pb = void 0,
        Jb = id,
        Gb = ub;
      Jb.parity = Gb & 1;
      Gb >>>= 1;
      Qc = lb[Gb % 12];
      Gb = ~~(Gb / 12);
      Ib = 4;
      for (pb = 7; 0 <= pb; --pb)
        (Jb.rl[pb] = 0),
          Qc >= b[pb][Ib] && ((Qc -= b[pb][Ib--]), (Jb.rl[pb] = 1));
      Rc = Gb % 35;
      Gb = ~~(Gb / 35);
      Ib = 4;
      Jb.fb[7] = 0;
      for (pb = 6; 0 <= pb; --pb)
        Rc >= b[pb][Ib]
          ? ((Rc -= b[pb][Ib--]), (Jb.fb[pb] = 1))
          : (Jb.fb[pb] = 0);
      Ib = 4;
      Jb.ud[7] = 0;
      for (pb = 6; 0 <= pb; --pb)
        Gb >= b[pb][Ib]
          ? ((Gb -= b[pb][Ib--]), (Jb.ud[pb] = 1))
          : (Jb.ud[pb] = 0);
      for (Fb = 0; 20 > Fb; ++Fb) {
        Pc.copy(id);
        var kb = Pc,
          cc = Fb;
        kb.parity ^= eb[cc];
        switch (cc) {
          case 0:
          case 1:
          case 2:
            ua(kb.ud, 0, 1, 2, 3, cc % 3);
            break;
          case 3:
            ua(kb.rl, 0, 1, 2, 3, 1);
            break;
          case 4:
          case 5:
          case 6:
            ua(kb.fb, 0, 1, 2, 3, (cc - 1) % 3);
            break;
          case 7:
          case 8:
          case 9:
            ua(kb.ud, 4, 5, 6, 7, (cc - 1) % 3);
            break;
          case 10:
            ua(kb.rl, 4, 5, 6, 7, 1);
            break;
          case 11:
          case 12:
          case 13:
            ua(kb.fb, 4, 5, 6, 7, (cc + 1) % 3);
            break;
          case 14:
            ua(kb.ud, 0, 1, 2, 3, 1);
            ua(kb.rl, 0, 5, 4, 1, 1);
            ua(kb.fb, 0, 5, 4, 1, 1);
            break;
          case 15:
            ua(kb.rl, 0, 1, 2, 3, 1);
            ua(kb.fb, 1, 4, 7, 2, 1);
            ua(kb.ud, 1, 6, 5, 2, 1);
            break;
          case 16:
            ua(kb.fb, 0, 1, 2, 3, 1);
            ua(kb.ud, 3, 2, 5, 4, 1);
            ua(kb.rl, 0, 3, 6, 5, 1);
            break;
          case 17:
            ua(kb.ud, 4, 5, 6, 7, 1);
            ua(kb.rl, 3, 2, 7, 6, 1);
            ua(kb.fb, 3, 2, 7, 6, 1);
            break;
          case 18:
            ua(kb.rl, 4, 5, 6, 7, 1);
            ua(kb.fb, 0, 3, 6, 5, 1);
            ua(kb.ud, 0, 3, 4, 7, 1);
            break;
          case 19:
            ua(kb.fb, 4, 5, 6, 7, 1),
              ua(kb.ud, 0, 7, 6, 1, 1),
              ua(kb.rl, 1, 4, 7, 2, 1);
        }
        Va[ub][Fb] = O(Pc);
      }
    }
    Ta(fb);
    var Sc = (fb[0] = 0);
    for (Oc = 1; 29400 != Oc; ) {
      for (ub = 0; 29400 > ub; ++ub)
        if (fb[ub] == Sc)
          for (Fb = 0; 17 > Fb; ++Fb)
            -1 == fb[Va[ub][Fb]] && ((fb[Va[ub][Fb]] = Sc + 1), ++Oc);
      ++Sc;
    }
    DEBUG && console.log("[scramble 444] initCenter3", $.now() - B);
    for (var dc = new Ba(), mc = 0; 21 > mc; ++mc)
      for (var nc = 0; 8 > nc; ++nc) {
        Z(dc, 0);
        K(dc, mc);
        S(dc, nc);
        for (var Kb = 0; 12 > Kb; ++Kb) ic[(mc << 3) | nc][Kb] = dc.edge[Kb];
        va(dc);
        for (Kb = 0; 12 > Kb; ++Kb) jc[(mc << 3) | nc][Kb] = dc.temp[Kb];
      }
    DEBUG && console.log("[scramble 444] initEdge3MvRot", $.now() - B);
    var Wb, ec;
    var Qb = new Ba();
    var vc = t(1485);
    for (var vb = 0; 1485 > vb; vb++) vc[vb] = 0;
    for (vb = Wb = 0; 11880 > vb; ++vb)
      if (0 == (vc[vb >>> 3] & (1 << (vb & 7)))) {
        Z(Qb, vb * rc[8]);
        hc[Wb] = vb;
        Bc[Wb] = L(Qb, 4, !0);
        for (ec = 0; 8 > ec; ++ec) {
          var Rb = L(Qb, 4);
          Rb == vb && (qc[Wb] |= 1 << ec);
          vc[Rb >> 3] |= 1 << (Rb & 7);
          Cc[Rb] = (Wb << 3) | $c[ec];
          M(Qb, 0);
          1 == ec % 2 && (M(Qb, 1), M(Qb, 2));
        }
        Wb++;
      }
    for (var Lb = 0; 20 > Lb; Lb++) Tc[Lb] = [];
    for (vb = 0; 1538 > vb; vb++)
      for (Z(Qb, hc[vb] * rc[8]), Lb = 0; 20 > Lb; ++Lb)
        1 == Tb[Lb] % 3 &&
          ((Rb = ta(Qb.edge, Lb)),
          (Tc[Lb][vb] = (~~((Rb >> 3) / 20160) << 3) | (Rb & 7)));
    DEBUG && console.log("[scramble 444] initEdge3Sym2Raw", $.now() - B);
    var Uc;
    var Vc = new Ba();
    var wc = new Ba();
    var Wc = new Ba();
    Ta(Ab);
    var Xb = 0,
      xc = 1;
    U(Ab, 0, 0);
    for (
      var yd = [1, 0, 2, 3, 5, 4, 6, 8, 7, 9, 10, 12, 11, 13, 14, 15, 16],
        zd = $.now();
      31006080 != xc;

    ) {
      var oc = 9 < Xb,
        Xc = Xb % 3,
        jd = (Xb + 1) % 3,
        Ad = (Xb + 2) % 3;
      var kd = oc ? 3 : Xc;
      var ld = oc ? Xc : 3;
      var Bd = 1431655765 * kd;
      if (Xb >= Dc - 1) break;
      for (var pc = 0; 31006080 > pc; pc += 16) {
        var yc = Ab[pc >> 4];
        var md = yc ^ Bd;
        if ((oc || -1 != yc) && 0 != ((md - 1431655765) & ~md & 2863311530))
          for (var fc = pc, Cd = pc + 16; fc < Cd; ++fc, yc >>= 2)
            if ((yc & 3) == kd) {
              var nd = ~~(fc / 20160);
              var Dd = hc[nd];
              var Ed = fc % 20160;
              Z(Vc, 20160 * Dd + Ed);
              for (var zc = 0; 17 > zc; ++zc) {
                var Ac = yd[zc],
                  gc = ta(Vc.edge, Ac, Tc[Ac][nd]),
                  Fd = gc & 7;
                gc >>= 3;
                var Yc = sa(Ab, gc);
                if (Yc != ld) {
                  if (Yc == Ad || (Yc == Xc && gc < fc)) zc = Vb[Ac];
                } else {
                  U(Ab, oc ? fc : gc, jd);
                  ++xc;
                  if (oc) break;
                  var od = ~~(gc / 20160);
                  var Zc = qc[od];
                  if (1 != Zc)
                    for (
                      fa(wc, Vc), K(wc, Ac), S(wc, Fd), Uc = 1;
                      0 != (Zc >>= 1);
                      ++Uc
                    )
                      if (1 == (Zc & 1)) {
                        fa(Wc, wc);
                        S(Wc, Uc);
                        var pd = 20160 * od + (L(Wc, 10) % 20160);
                        sa(Ab, pd) == ld && (U(Ab, pd, jd), ++xc);
                      }
                }
              }
            }
      }
      ++Xb;
      DEBUG &&
        console.log("[scramble 444] edge3 pruning ", Xb, xc, $.now() - zd);
    }
    DEBUG && console.log("[scramble 444] initEdge3Prun", $.now() - B);
    Sb = new pa();
  }
  function Na(B, Y, ca, xa) {
    var Ca = [0, 1, 2, 3, 4, 5];
    xa &&
      ((xa = mathlib.rn([1, 4, 8, 1, 1, 1, 24][xa])),
      8 <= xa &&
        (mathlib.acycle(Ca, [0, 1, 2], xa >> 3),
        mathlib.acycle(Ca, [3, 4, 5], xa >> 3),
        (xa &= 7)),
      4 <= xa && (mathlib.acycle(Ca, [0, 1, 3, 4], 2), (xa &= 3)),
      1 <= xa && mathlib.acycle(Ca, [1, 2, 4, 5], xa));
    xa = !0;
    for (var Ga = 0; xa && 100 > Ga; Ga++) {
      var Fa = new Qa();
      for (var Pa = [], cb = [], Ya = [], Wa = 0; 24 > Wa; Wa++)
        (B >> Wa) & 1 && Pa.push(Wa),
          (Y >> Wa) & 1 && cb.push(Wa),
          (ca >> Wa) & 1 && Ya.push(Wa);
      var wb = mathlib.rndPerm(Pa.length);
      for (Wa = 0; Wa < Pa.length; Wa++)
        Fa.center.ct[Pa[Wa]] = Yb[Pa[wb[Wa]]] >> 4;
      Pa = mathlib.rndPerm(cb.length);
      for (Wa = 0; Wa < cb.length; Wa++) Fa.edge.ep[cb[Wa]] = cb[Pa[Wa]];
      cb = mathlib.rndPerm(Ya.length);
      Pa = 24;
      for (Wa = 0; Wa < Ya.length; Wa++)
        (wb = mathlib.rn(3)),
          (Fa.corner.co[Ya[Wa]] = wb),
          (Fa.corner.cp[Ya[Wa]] = Ya[cb[Wa]]),
          (Pa -= wb);
      0 != Pa % 3 && (Fa.corner.co[Ya[0]] = (Fa.corner.co[Ya[0]] + Pa) % 3);
      Fa = Ha(Fa);
      for (Wa = 0; 96 > Wa; Wa++)
        (Fa[Wa] = "URFDLB".charAt(Ca[Fa[Wa]])),
          Fa[Wa] != Fa[(Wa >> 4) << 4] && (xa = !1);
    }
    return Fa.join("");
  }
  function Ra(B) {
    gb();
    B = B.split("");
    for (var Y = 0; 96 > Y; Y++) B[Y] = "URFDLB".indexOf(B[Y]);
    DEBUG && console.log("[scramble 444] Scramble to state:");
    DEBUG && za(B);
    Sb.c = new Qa();
    Y = Da(Sb.c, B);
    0 != Y && console.log("[scramble 444] State Check Error!", Y, B);
    ma(Sb);
    return Sb.solution.replace(/\s+/g, " ");
  }
  function Ua(B, Y, ca, xa) {
    return Ra(Na(B, Y, ca, xa));
  }
  function Za() {
    return Ra(Na(16777215, 16777215, 255));
  }
  var Xa;
  q.prototype.fromCube = function (B, Y) {
    for (var ca = 0; 24 > ca; ++ca) this.ct[ca] = B.ct[ca] % 3 == Y ? 1 : 0;
    return this;
  };
  var db,
    bb,
    hb,
    $a = null,
    rb,
    nb,
    sb,
    Sa,
    ib;
  I.prototype.copy = function (B) {
    for (var Y = 0; 8 > Y; Y++) this.rl[Y] = B.rl[Y];
    for (Y = 0; 16 > Y; Y++) this.ct[Y] = B.ct[Y];
    this.parity = B.parity;
  };
  var Mb, mb, tb, ob, Ia, Oa;
  P.prototype.copy = function (B) {
    for (var Y = 0; 8 > Y; Y++)
      (this.ud[Y] = B.ud[Y]), (this.rl[Y] = B.rl[Y]), (this.fb[Y] = B.fb[Y]);
    this.parity = B.parity;
  };
  var Va, eb, fb, lb, zb;
  E(D, x);
  Xa.temps = null;
  var qb,
    Eb,
    Ab,
    rc,
    ic,
    jc,
    Cc,
    hc,
    Bc,
    $c,
    qc,
    Dc = 10,
    Tc = [],
    Yb = [
      5, 6, 10, 9, 53, 54, 58, 57, 37, 38, 42, 41, 85, 86, 90, 89, 21, 22, 26,
      25, 69, 70, 74, 73,
    ],
    Ob = [
      [15, 16, 35],
      [12, 32, 67],
      [0, 64, 83],
      [3, 80, 19],
      [51, 47, 28],
      [48, 79, 44],
      [60, 95, 76],
      [63, 31, 92],
    ],
    Nb = [
      [13, 33],
      [4, 65],
      [2, 81],
      [11, 17],
      [61, 94],
      [52, 78],
      [50, 46],
      [59, 30],
      [75, 40],
      [68, 87],
      [27, 88],
      [20, 39],
      [34, 14],
      [66, 8],
      [82, 1],
      [18, 7],
      [93, 62],
      [77, 56],
      [45, 49],
      [29, 55],
      [36, 71],
      [91, 72],
      [84, 23],
      [43, 24],
    ];
  E(Qa, ia);
  Xa.add1 = !1;
  Xa.center = null;
  Xa.centerAvail = 0;
  Xa.corner = null;
  Xa.cornerAvail = 0;
  Xa.edge = null;
  Xa.edgeAvail = 0;
  Xa.length1 = 0;
  Xa.length2 = 0;
  Xa.length3 = 0;
  Xa.moveLength = 0;
  Xa.sym = 0;
  Xa.value = 0;
  var Ec, Zb, sc, tc, Ub, Fc, Tb, Gc, kc, Vb, ad, bd, Hc, Sb;
  scrMgr.reg("444wca", Za)("4edge", function () {
    return Ua(0, 16777215, 255);
  })("444edo", function () {
    return Ua(0, 16777215, 0);
  })("444cto", function () {
    return Ua(16777215, 0, 0);
  })("444ll", function (B, Y, ca, xa) {
    return Ua(0, 983280, 240, xa);
  })("444ell", function (B, Y, ca, xa) {
    return Ua(0, 983280, 0, xa);
  })("444ctud", function (B, Y, ca, xa) {
    return Ua(16776960, 16777215, 255, xa);
  })("444ctrl", function (B, Y, ca, xa) {
    return Ua(65535, 16777215, 255, xa);
  })("444l8e", function (B, Y, ca, xa) {
    return Ua(0, 16715760, 255, xa);
  })("444ud3c", function (B, Y, ca, xa) {
    B = mathlib.rn(4);
    return Ua(16776960, 16715760 | (4097 << B), 255, xa);
  })("444rlda", function (B, Y, ca, xa) {
    B = 4 * mathlib.rn(2);
    return Ua(240 | (3840 << B), 16777215, 255, xa);
  })("444rlca", function (B, Y, ca, xa) {
    B = 4 * mathlib.rn(2);
    return Ua(240 | (3840 << B), 16715760, 255, xa);
  });
  return {
    getRandomScramble: Za,
    getPartialScramble: Ua,
    testbench: function (B) {
      gb();
      B = B || 100;
      for (var Y = [], ca = 0; ca < B; ca++) {
        for (
          var xa = Na(16777215, 16777215, 255).split(""), Ca = 0;
          96 > Ca;
          Ca++
        )
          xa[Ca] = "URFDLB".indexOf(xa[Ca]);
        Sb.c = new Qa();
        Ca = Da(Sb.c, xa);
        0 != Ca && console.log("[scramble 444] State Check Error!", Ca, xa);
        $.now();
        xa = ma(Sb);
        for (Ca = 0; Ca < xa.length; Ca++) Y[Ca] = (Y[Ca] || 0) + xa[Ca];
        console.log(
          Y.map(function (Ga) {
            return ~~((100 * Ga) / (ca + 1)) / 100;
          })
        );
      }
    },
  };
})(mathlib.Cnk, mathlib.circle);
var sq1 = (function (b, N, t, E) {
  function n() {
    this.ul = 70195;
    this.ur = 4544119;
    this.dl = 10062778;
    this.dr = 14536702;
    this.ml = 0;
  }
  function C(G) {
    var L;
    void 0 === G && (G = E(3678));
    var F = new n();
    var K = I[G];
    var M = 324508639;
    var S = 38177486;
    var Z = (L = 8);
    for (G = 0; 24 > G; G++)
      if (0 == ((K >> G) & 1)) {
        var fa = E(L) << 2;
        F.setPiece(23 - G, (S >> fa) & 15);
        fa = (1 << fa) - 1;
        S = (S & fa) + ((S >> 4) & ~fa);
        --L;
      } else
        (fa = E(Z) << 2),
          F.setPiece(23 - G, (M >> fa) & 15),
          F.setPiece(22 - G, (M >> fa) & 15),
          (fa = (1 << fa) - 1),
          (M = (M & fa) + ((M >> 4) & ~fa)),
          --Z,
          ++G;
    F.ml = E(2);
    return F;
  }
  function c(G, L, F, K, M, S) {
    if (0 == F && 4 > K) {
      if ((L = 0 == K))
        a: {
          G.Search_d.copy(G.Search_c);
          for (L = 0; L < G.Search_length1; ++L)
            G.Search_d.doMove(G.Search_move[L]);
          L = G.Search_d;
          K = G.Search_sq;
          F = [];
          for (M = 0; 8 > M; ++M) F[M] = L.pieceAt(3 * M + 1) >> 1;
          K.cornperm = N(F, 8);
          K.topEdgeFirst = L.pieceAt(0) == L.pieceAt(1);
          M = K.topEdgeFirst ? 2 : 0;
          for (S = 0; 4 > S; M += 3, ++S) F[S] = L.pieceAt(M) >> 1;
          K.botEdgeFirst = L.pieceAt(12) == L.pieceAt(13);
          for (M = K.botEdgeFirst ? 14 : 12; 8 > S; M += 3, ++S)
            F[S] = L.pieceAt(M) >> 1;
          K.edgeperm = N(F, 8);
          K.ml = L.ml;
          M = G.Search_sq.edgeperm;
          K = G.Search_sq.cornperm;
          S = G.Search_sq.ml;
          for (
            L = Math.max(
              X[(G.Search_sq.edgeperm << 1) | S],
              X[(G.Search_sq.cornperm << 1) | S]
            );
            L < G.Search_maxlen2;
            ++L
          )
            if (
              k(
                G,
                M,
                K,
                G.Search_sq.topEdgeFirst,
                G.Search_sq.botEdgeFirst,
                S,
                L,
                G.Search_length1,
                0
              )
            ) {
              for (K = 0; K < L; ++K)
                G.Search_d.doMove(G.Search_move[G.Search_length1 + K]);
              K = "";
              S = M = 0;
              for (L = L + G.Search_length1 - 1; 0 <= L; L--)
                (F = G.Search_move[L]),
                  0 < F
                    ? ((F = 12 - F), (M = 6 < F ? F - 12 : F))
                    : 0 > F
                    ? ((F = 12 + F), (S = 6 < F ? F - 12 : F))
                    : ((F = "/"),
                      L == G.Search_length1 - 1 && (F = "`/`"),
                      (K =
                        0 == M && 0 == S
                          ? K + F
                          : K + (" (" + M + "," + S + ")" + F)),
                      (M = S = 0));
              if (0 != M || 0 != S) K += " (" + M + "," + S + ") ";
              G.Search_sol_string = K;
              L = !0;
              break a;
            }
          L = !1;
        }
      return L;
    }
    if (0 != S) {
      var Z = J[L];
      var fa = z[Z];
      if (fa < K && ((G.Search_move[M] = 0), c(G, Z, fa, K - 1, M + 1, 0)))
        return !0;
    }
    Z = L;
    if (0 >= S)
      for (F = 0; ; ) {
        F += O[Z];
        Z = F >> 4;
        F &= 15;
        if (12 <= F) break;
        fa = z[Z];
        if (fa > K) break;
        else if (
          fa < K &&
          ((G.Search_move[M] = F), c(G, Z, fa, K - 1, M + 1, 1))
        )
          return !0;
      }
    Z = L;
    if (1 >= S)
      for (F = 0; ; ) {
        F += u[Z];
        Z = F >> 4;
        F &= 15;
        if (6 <= F) break;
        fa = z[Z];
        if (fa > K) break;
        else if (
          fa < K &&
          ((G.Search_move[M] = -F), c(G, Z, fa, K - 1, M + 1, 2))
        )
          return !0;
      }
    return !1;
  }
  function k(G, L, F, K, M, S, Z, fa, ea) {
    var va, ra;
    if (0 == Z && !K && M) return !0;
    if (0 != ea && K == M) {
      var ya = Q[L];
      var Ba = Q[F];
      if (
        X[(ya << 1) | (1 - S)] < Z &&
        X[(Ba << 1) | (1 - S)] < Z &&
        ((G.Search_move[fa] = 0), k(G, ya, Ba, K, M, 1 - S, Z - 1, fa + 1, 0))
      )
        return !0;
    }
    if (0 >= ea) {
      ya = (ra = !K) ? V[L] : L;
      Ba = ra ? F : V[F];
      var sa = ra ? 1 : 2;
      var ta = X[(ya << 1) | S];
      for (va = X[(Ba << 1) | S]; 12 > sa && ta <= Z && ta <= Z; ) {
        if (
          ta < Z &&
          va < Z &&
          ((G.Search_move[fa] = sa), k(G, ya, Ba, ra, M, S, Z - 1, fa + 1, 1))
        )
          return !0;
        (ra = !ra)
          ? ((ya = V[ya]), (ta = X[(ya << 1) | S]), (sa += 1))
          : ((Ba = V[Ba]), (va = X[(Ba << 1) | S]), (sa += 2));
      }
    }
    if (1 >= ea)
      for (
        ya = (M = !M) ? W[L] : L,
          Ba = M ? F : W[F],
          sa = M ? 1 : 2,
          ta = X[(ya << 1) | S],
          va = X[(Ba << 1) | S];
        sa < (6 < Z ? 6 : 12) && ta <= Z && ta <= Z;

      ) {
        if (
          ta < Z &&
          va < Z &&
          ((G.Search_move[fa] = -sa), k(G, ya, Ba, K, M, S, Z - 1, fa + 1, 2))
        )
          return !0;
        (M = !M)
          ? ((ya = W[ya]), (ta = X[(ya << 1) | S]), (sa += 1))
          : ((Ba = W[Ba]), (va = X[(Ba << 1) | S]), (sa += 2));
      }
    return !1;
  }
  function g(G, L) {
    G.Search_c = L;
    var F = L.ur & 1118481;
    F |= F >> 3;
    F |= F >> 6;
    F = (F & 15) | ((F >> 12) & 48);
    var K = L.ul & 1118481;
    K |= K >> 3;
    K |= K >> 6;
    K = (K & 15) | ((K >> 12) & 48);
    var M = L.dr & 1118481;
    M |= M >> 3;
    M |= M >> 6;
    M = (M & 15) | ((M >> 12) & 48);
    var S = L.dl & 1118481;
    S |= S >> 3;
    S |= S >> 6;
    S = (S & 15) | ((S >> 12) & 48);
    var Z;
    var fa = 0;
    var ea = [L.pieceAt(0)];
    for (Z = 1; 24 > Z; ++Z)
      L.pieceAt(Z) != ea[fa] && (ea[++fa] = L.pieceAt(Z));
    for (L = Z = 0; 16 > L; ++L)
      for (fa = L + 1; 16 > fa; ++fa) ea[L] > ea[fa] && (Z ^= 1);
    S = q((Z << 24) | (K << 18) | (F << 12) | (S << 6) | M);
    for (
      G.Search_length1 = z[S];
      100 > G.Search_length1 &&
      ((G.Search_maxlen2 = Math.min(32 - G.Search_length1, 17)),
      !c(G, S, z[S], G.Search_length1, 0, -1));
      ++G.Search_length1
    );
    return G.Search_sol_string;
  }
  function f() {
    this.Search_move = [];
    this.Search_d = new n();
    this.Search_sq = new r();
  }
  function a() {
    a = $.noop;
    P = [0, 3, 6, 12, 15, 24, 27, 30, 48, 51, 54, 60, 63];
    I = [];
    z = [];
    O = [];
    u = [];
    J = [];
    var G, L;
    for (L = G = 0; 28561 > L; ++L) {
      var F = P[L % 13];
      var K = P[~~(L / 13) % 13];
      var M = P[~~(~~(L / 13) / 13) % 13];
      var S = P[~~(~~(~~(L / 13) / 13) / 13)];
      K = (S << 18) | (M << 12) | (K << 6) | F;
      16 == H(K) && (I[G++] = K);
    }
    G = new p();
    for (L = 0; 7356 > L; ++L) {
      h(G, L);
      K = O;
      F = L;
      var Z = G;
      S = M = 0;
      do
        0 == (Z.top & 2048)
          ? ((M += 1), (Z.top <<= 1))
          : ((M += 2), (Z.top = (Z.top << 2) ^ 12291)),
          (S = 1 - S);
      while (0 != (H(Z.top & 63) & 1));
      0 == (H(Z.top) & 2) && (Z.Shape_parity ^= S);
      K[F] = M;
      O[L] |= e(G) << 4;
      h(G, L);
      K = u;
      F = L;
      Z = G;
      S = M = 0;
      do
        0 == (Z.bottom & 2048)
          ? ((M += 1), (Z.bottom <<= 1))
          : ((M += 2), (Z.bottom = (Z.bottom << 2) ^ 12291)),
          (S = 1 - S);
      while (0 != (H(Z.bottom & 63) & 1));
      0 == (H(Z.bottom) & 2) && (Z.Shape_parity ^= S);
      K[F] = M;
      u[L] |= e(G) << 4;
      h(G, L);
      S = G.top & 63;
      K = H(S);
      F = H(G.bottom & 4032);
      G.Shape_parity ^= 1 & ((K & F) >> 1);
      G.top = (G.top & 4032) | ((G.bottom >> 6) & 63);
      G.bottom = (G.bottom & 63) | (S << 6);
      J[L] = e(G);
    }
    for (L = 0; 7536 > L; ++L) z[L] = -1;
    z[q(14378715)] = 0;
    z[q(31157686)] = 0;
    z[q(23967451)] = 0;
    z[q(7191990)] = 0;
    K = 4;
    F = 0;
    for (G = -1; K != F; )
      for (F = K, ++G, L = 0; 7536 > L; ++L)
        if (z[L] == G) {
          M = 0;
          S = L;
          do
            (S = O[S]),
              (M += S & 15),
              (S >>= 4),
              -1 == z[S] && (++K, (z[S] = G + 1));
          while (12 != M);
          M = 0;
          S = L;
          do
            (S = u[S]),
              (M += S & 15),
              (S >>= 4),
              -1 == z[S] && (++K, (z[S] = G + 1));
          while (12 != M);
          S = J[L];
          -1 == z[S] && (++K, (z[S] = G + 1));
        }
  }
  function e(G) {
    return (y(I, (G.top << 12) | G.bottom) << 1) | G.Shape_parity;
  }
  function h(G, L) {
    G.Shape_parity = L & 1;
    G.top = I[L >> 1];
    G.bottom = G.top & 4095;
    G.top >>= 12;
  }
  function p() {}
  function q(G) {
    return (y(I, G & 16777215) << 1) | (G >> 24);
  }
  function m() {
    m = $.noop;
    X = [];
    Q = [];
    V = [];
    W = [];
    var G, L, F;
    var K = [];
    for (L = 0; 40320 > L; ++L)
      b(K, L, 8),
        t(K, 2, 4)(K, 3, 5),
        (Q[L] = N(K, 8)),
        b(K, L, 8),
        t(K, 0, 3, 2, 1),
        (V[L] = N(K, 8)),
        b(K, L, 8),
        t(K, 4, 7, 6, 5),
        (W[L] = N(K, 8));
    for (L = 0; 80640 > L; ++L) X[L] = -1;
    var M = (X[0] = 0);
    for (G = 1; 80640 > G; ) {
      var S = (F = 11 <= M) ? -1 : M;
      K = F ? M : -1;
      ++M;
      L = 0;
      a: for (; 80640 > L; ++L)
        if (X[L] == S) {
          var Z = L >> 1;
          var fa = L & 1;
          var ea = (Q[Z] << 1) | (1 - fa);
          if (X[ea] == K && (++G, (X[F ? L : ea] = M), F)) continue a;
          ea = Z;
          for (Z = 0; 4 > Z; ++Z)
            if (
              ((ea = V[ea]),
              X[(ea << 1) | fa] == K &&
                (++G, (X[F ? L : (ea << 1) | fa] = M), F))
            )
              continue a;
          for (Z = 0; 4 > Z; ++Z)
            if (
              ((ea = W[ea]),
              X[(ea << 1) | fa] == K &&
                (++G, (X[F ? L : (ea << 1) | fa] = M), F))
            )
              continue a;
        }
    }
  }
  function r() {}
  function H(G) {
    G -= (G >> 1) & 1431655765;
    G = ((G >> 2) & 858993459) + (G & 858993459);
    G = ((G >> 4) + G) & 252645135;
    G += G >> 8;
    return (G + (G >> 16)) & 63;
  }
  function y(G, L) {
    var F;
    var K = 0;
    for (F = G.length - 1; K <= F; ) {
      var M = K + ((F - K) >> 1);
      var S = G[M];
      if (S < L) K = M + 1;
      else if (S > L) F = M - 1;
      else return M;
    }
    return -K - 1;
  }
  function A() {
    A = $.noop;
    for (var G = new p(), L = 0; L < d.length; L++) {
      for (var F = [d[L]], K = 0; K < F.length; K++) {
        var M = F[K];
        do (M = O[M << 1] >> 5), -1 == F.indexOf(M) && F.push(M);
        while (M != F[K]);
        do (M = u[M << 1] >> 5), -1 == F.indexOf(M) && F.push(M);
        while (M != F[K]);
        h(G, M << 1);
        M = G.top;
        G.top = G.bottom;
        G.bottom = M;
        M = e(G) >> 1;
        -1 == F.indexOf(M) && F.push(M);
      }
      d[L] = F;
    }
  }
  function w(G, L, F) {
    a();
    m();
    return g(D, C());
  }
  var v = n.prototype;
  v.toString = function () {
    return (
      this.ul.toString(16).padStart(6, 0) +
      this.ur.toString(16).padStart(6, 0) +
      "|/".charAt(this.ml) +
      this.dl.toString(16).padStart(6, 0) +
      this.dr.toString(16).padStart(6, 0)
    );
  };
  v.pieceAt = function (G) {
    return (
      (6 > G
        ? this.ul >> ((5 - G) << 2)
        : 12 > G
        ? this.ur >> ((11 - G) << 2)
        : 18 > G
        ? this.dl >> ((17 - G) << 2)
        : this.dr >> ((23 - G) << 2)) & 15
    );
  };
  v.setPiece = function (G, L) {
    6 > G
      ? ((this.ul &= ~(15 << ((5 - G) << 2))), (this.ul |= L << ((5 - G) << 2)))
      : 12 > G
      ? ((this.ur &= ~(15 << ((11 - G) << 2))),
        (this.ur |= L << ((11 - G) << 2)))
      : 18 > G
      ? ((this.dl &= ~(15 << ((17 - G) << 2))),
        (this.dl |= L << ((17 - G) << 2)))
      : ((this.dr &= ~(15 << ((23 - G) << 2))),
        (this.dr |= L << ((23 - G) << 2)));
  };
  v.copy = function (G) {
    this.ul = G.ul;
    this.ur = G.ur;
    this.dl = G.dl;
    this.dr = G.dr;
    this.ml = G.ml;
  };
  v.doMove = function (G) {
    G <<= 2;
    if (24 < G) {
      G = 48 - G;
      var L = this.ul;
      this.ul = ((this.ul >> G) | (this.ur << (24 - G))) & 16777215;
      this.ur = ((this.ur >> G) | (L << (24 - G))) & 16777215;
    } else
      0 < G
        ? ((L = this.ul),
          (this.ul = ((this.ul << G) | (this.ur >> (24 - G))) & 16777215),
          (this.ur = ((this.ur << G) | (L >> (24 - G))) & 16777215))
        : 0 == G
        ? ((L = this.ur),
          (this.ur = this.dl),
          (this.dl = L),
          (this.ml = 1 - this.ml))
        : -24 <= G
        ? ((G = -G),
          (L = this.dl),
          (this.dl = ((this.dl << G) | (this.dr >> (24 - G))) & 16777215),
          (this.dr = ((this.dr << G) | (L >> (24 - G))) & 16777215))
        : -24 > G &&
          ((G = 48 + G),
          (L = this.dl),
          (this.dl = ((this.dl >> G) | (this.dr << (24 - G))) & 16777215),
          (this.dr = ((this.dr >> G) | (L << (24 - G))) & 16777215));
  };
  v = f.prototype = function () {}.prototype;
  v.Search_c = null;
  v.Search_length1 = 0;
  v.Search_maxlen2 = 0;
  v.Search_sol_string = null;
  v = p.prototype = function () {}.prototype;
  v.bottom = 0;
  v.Shape_parity = 0;
  v.top = 0;
  var u, I, z, O, J, P;
  v = r.prototype = function () {}.prototype;
  v.botEdgeFirst = !1;
  v.cornperm = 0;
  v.edgeperm = 0;
  v.ml = 0;
  v.topEdgeFirst = !1;
  var W,
    X,
    V,
    Q,
    d = [
      0, 1, 3, 18, 19, 1004, 1005, 1006, 1007, 1008, 1009, 1011, 1015, 1016,
      1018, 1154, 1155, 1156, 1157, 1158, 1159, 1161, 1166, 1168, 424, 425, 426,
      427, 428, 429, 431, 436, 95, 218, 341, 482, 528, 632, 1050, 342, 343, 345,
      346, 348, 353, 223, 487, 533, 535, 1055, 219, 225, 483, 489, 639, 1051,
      1057, 486, 1054, 1062, 6, 21, 34, 46, 59, 71, 144, 157, 182, 305, 7, 22,
      35, 47, 60, 72, 145, 158, 183, 306, 8, 23, 36, 48, 61, 73, 146, 159, 184,
      307,
    ],
    l = [
      16, 16, 16, 10, 16, 24, 16, 24, 16, 24, 16, 16, 4, 24, 16, 48, 32, 48, 32,
      48, 32, 32, 48, 16, 48, 32, 48, 16, 48, 32, 32, 48, 36, 48, 72, 72, 48,
      48, 72, 48, 36, 72, 48, 48, 72, 32, 48, 16, 32, 48, 16, 32, 48, 48, 16,
      48, 48, 36, 72, 36, 72, 96, 96, 72, 96, 72, 72, 72, 72, 24, 48, 64, 64,
      48, 64, 48, 48, 48, 48, 16, 24, 32, 32, 24, 32, 24, 24, 24, 24, 8,
    ],
    D = new f(),
    x = [
      [4146, 12816],
      [12546, 12816],
      [12321, 12816],
      [8961, 12816],
      [12816, 12321],
      [12816, 12546],
      [12816, 8961],
      [12306, 12801],
      [8496, 12321],
      [4896, 12546],
      [12321, 12546],
      [12546, 12321],
      [12801, 12801],
      [12576, 12801],
      [4656, 12306],
      [12306, 12306],
      [531, 12801],
      [8976, 12801],
      [4656, 12801],
      [12576, 12306],
      [12801, 12306],
    ],
    R = [1, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4];
  scrMgr.reg("sqrs", w);
  scrMgr.reg(
    "sqrcsp",
    function (G, L, F) {
      a();
      m();
      A();
      G = mathlib.rndEl(d[scrMgr.fixCase(F, l)]);
      return g(D, C(G));
    },
    [
      "Star-x8 Star-x71 Star-x62 Star-x44 Star-x53 Square-Scallop Square-rPawn Square-Shield Square-Barrel Square-rFist Square-Mushroom Square-lPawn Square-Square Square-lFist Square-Kite Kite-Scallop Kite-rPawn Kite-Shield Kite-Barrel Kite-rFist Kite-Mushroom Kite-lPawn Kite-lFist Kite-Kite Barrel-Scallop Barrel-rPawn Barrel-Shield Barrel-Barrel Barrel-rFist Barrel-Mushroom Barrel-lPawn Barrel-lFist Scallop-Scallop Scallop-rPawn Scallop-Shield Scallop-rFist Scallop-Mushroom Scallop-lPawn Scallop-lFist Shield-rPawn Shield-Shield Shield-rFist Shield-Mushroom Shield-lPawn Shield-lFist Mushroom-rPawn Mushroom-rFist Mushroom-Mushroom Mushroom-lPawn Mushroom-lFist Pawn-rPawn-rPawn Pawn-rPawn-lPawn Pawn-rPawn-rFist Pawn-lPawn-rFist Pawn-lPawn-lPawn Pawn-rPawn-lFist Pawn-lPawn-lFist Fist-rFist-rFist Fist-lFist-rFist Fist-lFist-lFist Pair-x6 Pair-r42 Pair-x411 Pair-r51 Pair-l42 Pair-l51 Pair-x33 Pair-x312 Pair-x321 Pair-x222 L-x6 L-r42 L-x411 L-r51 L-l42 L-l51 L-x33 L-x312 L-x321 L-x222 Line-x6 Line-r42 Line-x411 Line-r51 Line-l42 Line-l51 Line-x33 Line-x312 Line-x321 Line-x222".split(
        " "
      ),
      l,
    ]
  );
  scrMgr.reg(
    "sq1pll",
    function (G, L, F) {
      a();
      m();
      var K = x[scrMgr.fixCase(F, R)];
      G = new n();
      var M = 4369 * mathlib.rn(4);
      F = 4 * mathlib.rn(4);
      L = (17476 - K[0] + M) & 13107;
      K = (13107 - K[1] + M) & 13107;
      L = (L | (L << 16)) >> F;
      K = (K | (K << 16)) >> F;
      for (F = 0; 4 > F; F++)
        (M = (((K >> (12 - 4 * F)) & 15) << 1) | 1),
          G.setPiece(3 * F + 1, M),
          G.setPiece(3 * F + 2, M),
          G.setPiece((3 * F + 3) % 12, ((L >> (12 - 4 * F)) & 15) << 1);
      0 != mathlib.rn(2) && G.doMove(1);
      G.ml = mathlib.rn(2);
      return g(D, G);
    },
    [
      "H Ua Ub Z Aa Ab E F Ga Gb Gc Gd Ja Jb Na Nb Ra Rb T V Y".split(" "),
      R,
      function (G, L) {
        a();
        m();
        var F = x[scrMgr.fixCase(G, R)];
        G = new n();
        var K = (17476 - F[0]) & 13107;
        F = (13107 - F[1]) & 13107;
        for (var M = 0; 4 > M; M++) {
          var S = (((F >> (12 - 4 * M)) & 15) << 1) | 1;
          G.setPiece(3 * M + 1, S);
          G.setPiece(3 * M + 2, S);
          G.setPiece((3 * M + 3) % 12, ((K >> (12 - 4 * M)) & 15) << 1);
        }
        if (!L) return [G, !1, null];
        image.sqllImage(G, !1, L);
      },
    ]
  );
  return { initialize: $.noop, SqCubie: n, getRandomScramble: w };
})(mathlib.setNPerm, mathlib.getNPerm, mathlib.circle, mathlib.rn);
(function () {
  function b(m, r) {
    var H = k.set([], r & 31);
    r = f.set([], r >> 5);
    var y = g.set([], m);
    m = [];
    mathlib.fillFacelet(t, m, [0, 1, 2, 3], r, 6);
    mathlib.fillFacelet(E, m, y, H, 6);
    H = [4, 2, 3, 1, 5, 0];
    for (r = 0; 6 > r; r++)
      for (y = 0; 2 > y; y++) {
        var A = E[r][0 ^ y],
          w = E[r][1 ^ y],
          v = 6 * ~~(A / 6) + H[(H.indexOf(A % 6) + 5) % 6],
          u = 6 * ~~(w / 6) + H[(H.indexOf(w % 6) + 1) % 6];
        if (m[v] == m[A] && m[u] == m[w]) return !1;
      }
    return !0;
  }
  function N(m, r) {
    var H = g.set([], m[0]),
      y = k.set([], m[1] & 31);
    m = f.set([], m[1] >> 5);
    var A = g.set([], r[0]),
      w = k.set([], r[1] & 31);
    r = f.set([], r[1] >> 5);
    for (var v = [], u = [], I = [], z = 0; 6 > z; z++)
      (v[z] = H[A[z]]), (u[z] = y[A[z]] ^ w[z]);
    for (z = 0; 4 > z; z++) I[z] = m[z] + r[z];
    return [g.get(v), (f.get(I) << 5) | k.get(u)];
  }
  for (
    var t = [
        [3, 16, 11],
        [4, 23, 15],
        [5, 9, 22],
        [10, 17, 21],
      ],
      E = [
        [1, 7],
        [2, 14],
        [0, 18],
        [6, 12],
        [8, 20],
        [13, 19],
      ],
      n = new mathlib.Solver(4, 2, [
        [
          0,
          [
            function (m, r) {
              mathlib.acycle(m, C[r]);
            },
            "p",
            6,
            -1,
          ],
          360,
        ],
        [
          0,
          function (m, r) {
            var H = k.set([], m & 31);
            m = f.set([], m >> 5);
            m[r]++;
            mathlib.acycle(H, C[r], 1, c[r]);
            return (f.get(m) << 5) | k.get(H);
          },
          2592,
        ],
      ]),
      C = [
        [0, 1, 3],
        [1, 2, 5],
        [0, 4, 2],
        [3, 5, 4],
      ],
      c = [
        [0, 1, 0, 2],
        [0, 1, 0, 2],
        [0, 0, 1, 2],
        [0, 0, 1, 2],
      ],
      k = new mathlib.Coord("o", 6, -2),
      g = new mathlib.Coord("p", 6, -1),
      f = new mathlib.Coord("o", 4, 3),
      a = [
        [0, 0],
        [183, 869],
        [87, 1729],
      ],
      e = [
        [1, 3, "L3Bar-1", "LLDGFFRRG"],
        [59, 3, "L3Bar-2", "DLLGFFRRG"],
        [25, 3, "L3Bar-3", "FFGDRRLLG"],
        [35, 3, "L3Bar-4", "GRRGLLFFD"],
        [12, 3, "LL-1", "LLGFFGGGG"],
        [10, 3, "LL-2", "GLLGGGGRR"],
        [2, 1, "LL-3", "RLRLFLFRF"],
        [4, 1, "LL-4", "FLFRFRLRL"],
        [3, 3, "L4NB-1", "FGGGGDGFGGGF"],
        [57, 3, "L4NB-2", "GGRGRGDGGGGR"],
        [53, 3, "L4NB-3", "GGDGRGGGRGGR"],
        [45, 3, "L4NB-4", "DGGFGGGFGGGF"],
        [33, 3, "L4NB-5", "GGDGGGGRGGGR"],
        [27, 3, "L4NB-6", "DGGGFGGGGGGF"],
        [49, 3, "L3NB-1", "RRGGGDGFF"],
        [43, 3, "L3NB-2", "GFFRRGDGG"],
        [41, 3, "L3NB-3", "GGGDLLFFG"],
        [51, 3, "L3NB-4", "GGGGRRLLD"],
        [8, 3, "Flip-1", "RLFLFFRRL"],
        [16, 3, "Flip-2", "LFFRRRLLFGGD"],
        [56, 1, "Flip-3", "RLFLFRFRLGGD"],
        [21, 3, "L4Blk-1", "GGDGGGLLL"],
        [13, 3, "L4Blk-2", "DGGLLLGGG"],
        [29, 3, "L4Bar-1", "GGGDGGGRR"],
        [37, 3, "L4Bar-2", "GGGFFGGGD"],
        [61, 3, "L4Bar-3", "GGGDGGLLG"],
        [5, 3, "L4Bar-4", "GGGGLLGGD"],
        [17, 3, "L4Bar-5", "GGGLLDGGG"],
        [11, 3, "L4Bar-6", "GGGGGGDLL"],
        [9, 3, "L4Bar-7", "RRGDGGGGG"],
        [19, 3, "L4Bar-8", "GFFGGGGGD"],
        [20, 3, "DFlip-1", "GGGRRGGGGGGD"],
        [18, 3, "DFlip-2", "GGGGGGGFFGGD"],
        [60, 1, "DFlip-3", "FFGRRGLLGGGD"],
        [58, 1, "DFlip-4", "GRRGLLGFFGGD"],
      ],
      h = [],
      p = [],
      q = 0;
    q < e.length;
    q++
  )
    h.push(e[q][1]), p.push(e[q][2]);
  scrMgr.reg(["pyro", "pyrso", "pyrnb", "pyr4c"], function (m) {
    var r = "pyro" == m ? 0 : 8,
      H = "pyrl4e" == m ? 2 : 7;
    do {
      if ("pyro" == m || "pyrso" == m || "pyr4c" == m) {
        var y = mathlib.rn(360);
        var A = mathlib.rn(2592);
      } else if ("pyrl4e" == m)
        (y = mathlib.getNPerm(
          mathlib.setNPerm([], mathlib.rn(12), 4, -1).concat([4, 5]),
          6,
          -1
        )),
          (A = 864 * mathlib.rn(3) + mathlib.rn(8));
      else if ("pyrnb" == m) {
        do (y = mathlib.rn(360)), (A = mathlib.rn(2592));
        while (!b(y, A));
      }
      var w = n.search([y, A], 0).length;
      var v = n.toStr(n.search([y, A], r).reverse(), "ULRB", ["'", ""]) + " ";
      for (var u = 0; 4 > u; u++) {
        var I = mathlib.rn("pyr4c" == m ? 2 : 3);
        2 > I && ((v += "lrbu".charAt(u) + [" ", "' "][I]), w++);
      }
    } while (w < H);
    return v;
  })(
    "pyrl4e",
    function (m, r, H) {
      r = e[scrMgr.fixCase(H, h)][0];
      m = mathlib.getNPerm(
        mathlib.setNPerm([], r & 1, 4, -1).concat([4, 5]),
        6,
        -1
      );
      r = 864 * ((r >> 1) & 3) + (r >> 3);
      m = N(mathlib.rndEl(a), N([m, r], mathlib.rndEl(a)));
      m = n.toStr(n.search(m, 8).reverse(), "ULRB", ["'", ""]) + " ";
      for (r = 0; 4 > r; r++)
        (H = mathlib.rn(3)), 2 > H && (m += "lrbu".charAt(r) + [" ", "' "][H]);
      return m;
    },
    [
      p,
      h,
      function (m, r) {
        m = e[m];
        if (!r) return ["GGG" + m[3], null, m[2]];
        image.pyrllImage("GGG" + m[3], r);
      },
    ]
  );
})();
var mpyr = (function () {
  function b(z, O, J, P, W, X) {
    this.ep = z || [0, 1, 2, 3, 4, 5];
    this.eo = O || [0, 0, 0, 0, 0, 0];
    this.wp = J || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    this.ct = P || [0, 1, 2, 3];
    this.co = W || [0, 0, 0, 0];
    this.cp = X || [0, 1, 2, 3];
  }
  function N(z) {
    for (var O = [], J = new b(), P = new b(), W = 0; W < z.length; W++) {
      O[W] = 1 << W;
      for (var X = 0; X < W; X++)
        b.MpyrMult(b.moveCube[z[W]], b.moveCube[z[X]], J),
          b.MpyrMult(b.moveCube[z[X]], b.moveCube[z[W]], P),
          J.toString(1) == P.toString(1) && (O[W] |= 1 << X);
    }
    return O;
  }
  function t(z, O) {
    return b.MpyrMult(z, b.moveCube[O], null);
  }
  function E(z, O) {
    var J = O.ep.indexOf(z),
      P = O.eo[J];
    return (
      12 * (12 * J + O.wp.indexOf((z << 1) | P)) +
      O.wp.indexOf((z << 1) | (P ^ 1))
    );
  }
  function n() {
    var z = new b();
    H = mathlib.createMoveHash(z, r, E.bind(null, 0), t);
    for (var O = [], J = [], P = 0; 6 > P; P++) {
      O.push(H[1][E(P, z)]);
      for (var W = 0; W < P; W++)
        J.push(792 * Math.min(O[P], O[W]) + Math.max(O[P], O[W]));
    }
    var X = [];
    mathlib.createPrun(
      X,
      J,
      1881792,
      12,
      function (V, Q) {
        var d = (~~(V / 792 / 792) + 1 - ((r[Q] >> 1) % 2)) % 3;
        var l = H[0][Q][~~(V / 792) % 792];
        V = H[0][Q][V % 792];
        return 627264 * d + 792 * Math.min(l, V) + Math.max(l, V);
      },
      8,
      2
    );
    z = N(r);
    y = new mathlib.Searcher(
      null,
      function (V) {
        for (var Q = 0, d = 627264 * V[6], l = 0; 6 > l; l++)
          for (var D = 0; D < l; D++)
            Q = Math.max(
              Q,
              mathlib.getPruning(
                X,
                d + 792 * Math.min(V[l], V[D]) + Math.max(V[l], V[D])
              )
            );
        return Q;
      },
      function (V, Q) {
        for (var d = [], l = 0; 6 > l; l++) d[l] = H[0][Q][V[l]];
        d[6] = (V[6] + 1 - ((r[Q] >> 1) % 2)) % 3;
        return d;
      },
      8,
      2,
      z
    );
  }
  function C(z) {
    return 4 * mathlib.getNPerm(z.ep, 6, -1) + z.ct.indexOf(0);
  }
  function c(z) {
    return 81 * (parseInt(z.eo.join(""), 2) >> 1) + parseInt(z.co.join(""), 3);
  }
  function k() {
    w = mathlib.createMoveHash(new b(), A, C, t);
    v = mathlib.createMoveHash(new b(), A, c, t);
    var z = [],
      O = [];
    mathlib.createPrun(z, 0, 1440, 14, w[0], 4, 2);
    mathlib.createPrun(O, 0, 2592, 14, v[0], 4, 2);
    var J = N(A);
    u = new mathlib.Searcher(
      null,
      function (P) {
        return Math.max(
          mathlib.getPruning(z, P[0]),
          mathlib.getPruning(O, P[1])
        );
      },
      function (P, W) {
        return [w[0][W][P[0]], v[0][W][P[1]]];
      },
      4,
      2,
      J
    );
  }
  function g(z) {
    return z
      .map(function (O) {
        return I[O];
      })
      .join(" ");
  }
  function f(z, O) {
    return O.reduce(function (J, P) {
      return b.MpyrMult(J, b.moveCube[P], null);
    }, z);
  }
  function a(z) {
    y || (n(), k());
    for (var O = $.now(), J = [], P = 0; 6 > P; P++) J[P] = H[1][E(P, z)];
    J[6] = z.getCosetIdx();
    J = y.solve(J, 0, 14);
    O = $.now() - O;
    for (P = 0; P < J.length; P++) J[P] = r[J[P][0]] + J[P][1];
    z = f(z, J);
    P = w[1][C(z)];
    var W = v[1][c(z)];
    z = $.now();
    W = u.solve([P, W], 0, 20);
    z = $.now() - z;
    for (P = 0; P < W.length; P++) W[P] = A[W[P][0]] + W[P][1];
    return [J, W, O, z];
  }
  function e() {
    var z = b.randomCube();
    z = a(z);
    z = g([].concat(z[0], z[1]));
    for (var O = 0; 4 > O; O++) {
      var J = mathlib.rn(3);
      2 > J && (z += " " + "lrbu".charAt(O) + ["", "'"][J]);
    }
    return z;
  }
  b.prototype.toString = function () {
    var z = this.toFaceCube(1);
    return "XX L0 L1 L2 L3 L4 XX    XX R0 R1 R2 R3 R4 XX\n   L5 L6 L7 L8 L9    XX    R5 R6 R7 R8 R9\n      La Lb Lc    Fc Fb Fa    Ra Rb Rc\n         XX    F9 F8 F7 F6 F5    XX\n            XX F4 F3 F2 F1 F0 XX\n            XX D0 D1 D2 D3 D4 XX\n               D5 D6 D7 D8 D9\n                  Da Db Dc\n                     XX".replace(
      /([FRDL])([0-9a-c])/g,
      function (O, J, P) {
        O = 13 * "FRDL".indexOf(J) + parseInt(P, 16);
        return "FRDL"[~~(z[O] / 13)] + (z[O] % 13).toString(16);
      }
    );
  };
  var h = [
      [8, 47],
      [34, 21],
      [6, 19],
      [32, 45],
      [2, 28],
      [15, 41],
    ],
    p = [
      [9, 51],
      [48, 12],
      [35, 25],
      [22, 38],
      [10, 18],
      [23, 5],
      [36, 44],
      [49, 31],
      [1, 29],
      [27, 3],
      [14, 42],
      [40, 16],
    ],
    q = [
      [0, 24, 30],
      [26, 50, 4],
      [13, 11, 43],
      [39, 37, 17],
    ],
    m = [7, 33, 20, 46];
  b.prototype.toFaceCube = function (z) {
    var O = [];
    z = z || 13;
    mathlib.fillFacelet(h, O, this.ep, this.eo, z);
    mathlib.fillFacelet(p, O, this.wp, [], z);
    mathlib.fillFacelet(q, O, this.cp, this.co, z);
    mathlib.fillFacelet(m, O, this.ct, null, z);
    return O;
  };
  b.prototype.fromFacelet = function (z) {
    for (var O = 0, J = [], P = 0; 52 > P; ++P)
      (J[P] = z[P]), (O += Math.pow(16, J[P]));
    if (56797 != O) return -1;
    for (P = 0; 6 > P; P++)
      a: for (z = 0; 6 > z; z++)
        for (O = 0; 2 > O; O++)
          if (
            ~~(h[z][0] / 13) == J[h[P][O]] &&
            ~~(h[z][1] / 13) == J[h[P][O ^ 1]]
          ) {
            this.ep[P] = z;
            this.eo[P] = O;
            break a;
          }
    for (P = 0; 12 > P; P++)
      for (z = 0; 12 > z; z++)
        if (~~(p[z][0] / 13) == J[p[P][0]] && ~~(p[z][1] / 13) == J[p[P][1]]) {
          this.wp[P] = z;
          break;
        }
    for (P = 0; 4 > P; P++)
      a: for (z = 0; 4 > z; z++)
        for (O = 0; 3 > O; O++)
          if (
            ~~(q[z][0] / 13) == J[q[P][O]] &&
            ~~(q[z][1] / 13) == J[q[P][(O + 1) % 3]] &&
            ~~(q[z][2] / 13) == J[q[P][(O + 2) % 3]]
          ) {
            this.cp[P] = z;
            this.co[P] = O;
            break a;
          }
    for (P = 0; 4 > P; P++)
      for (z = 0; 4 > z; z++) ~~(m[z] / 13) == J[m[P]] && (this.ct[P] = z);
    return this;
  };
  b.randomCube = function () {
    return new b(
      mathlib.rndPerm(6, !0),
      mathlib.setNOri([], mathlib.rn(32), 6, -2),
      mathlib.rndPerm(12, !0),
      mathlib.rndPerm(4, !0),
      mathlib.setNOri([], mathlib.rn(27), 4, -3),
      null
    );
  };
  b.MpyrMult = function () {
    var z = Array.from(arguments),
      O = z.pop() || new b();
    return z.reduceRight(function (J, P) {
      for (var W = 0; 4 > W; W++)
        (O.ct[W] = P.ct[J.ct[W]]),
          (O.co[W] = (P.co[J.cp[W]] + J.co[W]) % 3),
          (O.cp[W] = P.cp[J.cp[W]]);
      for (W = 0; 6 > W; W++)
        (O.eo[W] = P.eo[J.ep[W]] ^ J.eo[W]), (O.ep[W] = P.ep[J.ep[W]]);
      for (W = 0; 12 > W; W++) O.wp[W] = P.wp[J.wp[W]];
      return O;
    });
  };
  (function () {
    if (!b.moveCube) {
      var z = [];
      z[0] = new b(
        [0, 1, 2, 3, 4, 5],
        [0, 0, 0, 0, 0, 0],
        [0, 4, 2, 3, 10, 5, 6, 7, 8, 9, 1, 11],
        [0, 1, 2, 3],
        [0, 0, 1, 0],
        null
      );
      z[2] = new b(
        [2, 1, 5, 3, 4, 0],
        [1, 0, 0, 0, 0, 1],
        [5, 4, 2, 3, 10, 11, 6, 7, 8, 9, 1, 0],
        [2, 1, 3, 0],
        [0, 0, 1, 0],
        null
      );
      z[4] = new b(
        [0, 1, 2, 3, 4, 5],
        [0, 0, 0, 0, 0, 0],
        [0, 1, 2, 6, 4, 5, 11, 7, 8, 9, 10, 3],
        [0, 1, 2, 3],
        [0, 0, 0, 1],
        null
      );
      z[6] = new b(
        [0, 3, 2, 5, 4, 1],
        [0, 1, 0, 1, 0, 0],
        [0, 1, 7, 6, 4, 5, 11, 10, 8, 9, 2, 3],
        [0, 3, 1, 2],
        [0, 0, 0, 1],
        null
      );
      z[8] = new b(
        [0, 1, 2, 3, 4, 5],
        [0, 0, 0, 0, 0, 0],
        [0, 1, 5, 3, 4, 8, 6, 7, 2, 9, 10, 11],
        [0, 1, 2, 3],
        [1, 0, 0, 0],
        null
      );
      z[10] = new b(
        [0, 2, 4, 3, 1, 5],
        [0, 1, 1, 0, 0, 0],
        [0, 1, 5, 4, 9, 8, 6, 7, 2, 3, 10, 11],
        [1, 2, 0, 3],
        [1, 0, 0, 0],
        null
      );
      z[12] = new b(
        [0, 1, 2, 3, 4, 5],
        [0, 0, 0, 0, 0, 0],
        [7, 1, 2, 3, 4, 5, 6, 9, 8, 0, 10, 11],
        [0, 1, 2, 3],
        [0, 1, 0, 0],
        null
      );
      z[14] = new b(
        [3, 1, 2, 4, 0, 5],
        [1, 0, 0, 0, 1, 0],
        [7, 6, 2, 3, 4, 5, 8, 9, 1, 0, 10, 11],
        [3, 0, 2, 1],
        [0, 1, 0, 0],
        null
      );
      for (var O = 1; 16 > O; O += 2)
        z[O] = b.MpyrMult(z[O - 1], z[O - 1], null);
      b.moveCube = z;
    }
  })();
  b.prototype.getPairPerm = function () {
    for (var z = [], O = [], J = 0; 6 > J; J++) {
      var P = this.eo[J];
      z[2 * this.ep[J]] = 2 * J + P;
      z[2 * this.ep[J] + 1] = 2 * J + (P ^ 1);
    }
    for (J = 0; 12 > J; J++) O[J] = z[this.wp[J]];
    return O;
  };
  b.prototype.getCosetIdx = function () {
    for (var z = 0, O = 0; 4 > O; O++) z += this.co[O];
    z += 3 - this.ct[3 ^ this.ct.indexOf(3)];
    return z % 3;
  };
  var r = [0, 2, 4, 6, 8, 10, 12, 14],
    H = null,
    y = null,
    A = [2, 6, 10, 14],
    w = null,
    v = null,
    u = null,
    I = "U U' Uw Uw' B B' Bw Bw' R R' Rw Rw' L L' Lw Lw'".split(" ");
  scrMgr.reg("mpyrso", e);
  return {
    getRandomScramble: e,
    solveTest: function (z) {
      var O = [0, 2, 4, 6, 8, 10, 12, 14];
      var J = [];
      for (var P = 0; P < z; P++) J.push(O[~~(Math.random() * O.length)]);
      z = new b();
      for (P = 0; P < J.length; P++) z = b.MpyrMult(z, b.moveCube[J[P]], null);
      J = [z, J];
      g(J[1].slice());
      z = J[0];
      J = a(z);
      DEBUG && console.log("[mpyr] phase1 solved in ", J[2]);
      DEBUG && console.log("[mpyr] phase2 solved in ", J[3]);
      z = f(z, J[0]);
      z = f(z, J[1]);
      P = !0;
      z = z.toFaceCube();
      for (O = 0; 52 > O; O += 13)
        for (var W = O + 1; W < O + 13; W++)
          if (z[O] != z[W]) {
            P = !1;
            break;
          }
      P || console.log("ERROR! NOT SOLVED!");
      return [J[0].length, J[1].length, J[2], J[3]];
    },
  };
})();
(function () {
  function b(q, m) {
    var r = g.set([], q % 12),
      H = k.set([], ~~(q / 12)),
      y = f.set([], m % 81);
    m = a.set([], ~~(m / 81));
    q = [];
    for (var A = 0; 6 > A; A++) q[5 * A] = H[A];
    mathlib.fillFacelet(E, q, [0, 1, 2, 3], y, 5);
    mathlib.fillFacelet(n, q, r, m, 5);
    for (A = 0; 30 > A; A += 5)
      for (m = 1; 5 > m; m++) if (q[A] == q[A + m]) return !1;
    return !0;
  }
  function N(q, m) {
    var r = g.set([], q % 12);
    q = k.set([], ~~(q / 12));
    mathlib.acycle(q, C[m]);
    mathlib.acycle(r, c[m]);
    return 12 * k.get(q) + g.get(r);
  }
  function t(q, m) {
    var r = f.set([], q % 81);
    q = a.set([], ~~(q / 81));
    r[m]++;
    mathlib.acycle(q, c[m], 1, [0, 2, 1, 3]);
    return 81 * a.get(q) + f.get(r);
  }
  var E = [
      [4, 16, 7],
      [1, 11, 22],
      [26, 14, 8],
      [29, 19, 23],
    ],
    n = [
      [3, 6, 12],
      [2, 21, 17],
      [27, 9, 18],
      [28, 24, 13],
    ],
    C = [
      [0, 3, 1],
      [0, 2, 4],
      [1, 5, 2],
      [3, 4, 5],
    ],
    c = [
      [0, 1, 2],
      [0, 3, 1],
      [0, 2, 3],
      [1, 3, 2],
    ],
    k = new mathlib.Coord("p", 6, -1),
    g = new mathlib.Coord("p", 4, -1),
    f = new mathlib.Coord("o", 4, 3),
    a = new mathlib.Coord("o", 4, -3),
    e = new mathlib.Solver(4, 2, [
      [0, N, 4320],
      [0, t, 2187],
    ]),
    h = new mathlib.Solver(4, 2, [
      [
        0,
        function (q, m) {
          return ~~(N(12 * q, m) / 12);
        },
        360,
      ],
      [
        0,
        function (q, m) {
          return t(q, m) % 81;
        },
        81,
      ],
    ]),
    p = [0, 1, 2, 0, 2, 1, 1, 2, 0, 2, 1, 0];
  scrMgr.reg(["skbo", "skbso", "skbnb"], function (q) {
    var m = "skbso" == q ? 6 : 2,
      r = "skbo" == q ? 0 : 8;
    do {
      var H = mathlib.rn(4320);
      var y = mathlib.rn(2187);
    } while ((0 == H && 0 == y) || p[H % 12] != (y + ~~(y / 3) + ~~(y / 9) + ~~(y / 27)) % 3 || null != e.search([H, y], 0, m) || ("skbnb" == q && !b(H, y)));
    q = e.search([H, y], r).reverse();
    H = [];
    y = ["L", "R", "B", "U"];
    for (m = 0; m < q.length; m++) {
      r = q[m][0];
      var A = 1 - q[m][1];
      2 == r && mathlib.acycle(y, [0, 3, 1], A + 1);
      H.push(y[r] + (1 == A ? "'" : ""));
    }
    return H.join(" ");
  })(["ivyo", "ivyso"], function (q) {
    var m = "ivyso" == q ? 6 : 0;
    do {
      q = mathlib.rn(360);
      var r = mathlib.rn(81);
    } while ((0 == q && 0 == r) || null != h.search([q, r], 0, 1));
    return h.toStr(h.search([q, r], m).reverse(), "RLDB", "' ");
  });
})();
var scramble_222 = (function (b) {
  function N(V, Q) {
    mathlib.acycle(V, g[Q]);
  }
  function t(V, Q) {
    mathlib.acycle(V, g[Q], 1, f[Q]);
  }
  function E(V, Q) {
    V = mathlib.setNPerm([], V, 7);
    Q = a.set([], Q);
    for (var d = [], l = 0; 24 > l; l++) d[l] = l >> 2;
    mathlib.fillFacelet(e, d, V, Q, 4);
    for (l = 0; 24 > l; l += 4)
      if (((1 << d[l]) | (1 << d[l + 3])) & ((1 << d[l + 1]) | (1 << d[l + 2])))
        return !1;
    return !0;
  }
  function n(V, Q, d) {
    var l = 0,
      D = 4;
    Q = [0, 1, 2, 3];
    var x = [0, 0, 0, 0, 0, 0, 0];
    if ("222tcp" == V)
      (l = r[scrMgr.fixCase(d, u)]),
        (x = [0, 0, 0, 0, 1, 0, 0]),
        (Q = Q.concat(q[0]));
    else if ("222tcn" == V)
      (l = H[scrMgr.fixCase(d, z)]),
        (x = [0, 0, 0, 0, 2, 0, 0]),
        (Q = Q.concat(q[0]));
    else if ("222tc" == V)
      for (
        x = scrMgr.fixCase(d, J),
          l = y[x].slice(),
          x = [0, 0, 0, 0, 7 > x ? 1 : 2, 0, 0],
          Q = Q.concat(q[0]),
          V = mathlib.rndPerm(4),
          d = l[0] = 0;
        4 > d;
        d++
      )
        l[0] |= V[d] << (4 * d);
    else if ("222eg0" == V) (l = m[scrMgr.fixCase(d, w)]), (Q = Q.concat(q[0]));
    else if ("222eg1" == V)
      (l = m[scrMgr.fixCase(d, w)]), (Q = Q.concat(q[2 + b(4)]));
    else if ("222eg2" == V) (l = m[scrMgr.fixCase(d, w)]), (Q = Q.concat(q[1]));
    else if ("222lsall" == V) {
      Q = Q.concat(q[0]);
      V = mathlib.rndPerm(4);
      V.push(V[3]);
      V[3] = 4;
      l = [0, A[scrMgr.fixCase(d, W)][0]];
      for (d = 0; 5 > d; d++) l[0] |= V[d] << (4 * d);
      D = 5;
    }
    for (d = b(4); 0 < d--; ) N(Q, 0);
    V = Q.slice();
    for (d = 0; d < D; d++)
      (Q[d] = V[(l[0] >> (4 * d)) & 15]), (x[d] = (l[1] >> (4 * d)) & 15);
    for (l = b(4); 0 < l--; ) t(x, 0), N(Q, 0);
    Q = mathlib.getNPerm(Q, 7);
    x = a.get(x);
    return k.toStr(k.search([Q, x], 9).reverse(), "URF", "'2 ");
  }
  function C(V, Q, d, l, D) {
    Q = Q[l];
    for (var x = [], R = 0; 4 > R; R++)
      if (!V || "all" == V || "ori" == V)
        for (
          var G = (Q[0] >> (R << 2)) & 15,
            L = (Q[1] >> (R << 2)) & 15,
            F = "all" == V ? "DLFURB" : "DGGUGG",
            K = 0;
          3 > K;
          K++
        ) {
          var M = h.indexOf(e[R][K]);
          x[M] = F.charAt(e[G][(K + 3 - L) % 3] >> 2);
        }
      else if ("ls" == V)
        for (L = (Q[0] >> (R << 2)) & 15, K = 0; 3 > K; K++)
          (M = h.indexOf(e[R][K])),
            (x[M] = "DGU".charAt(0 == (K + 3 - L) % 3 ? (3 == R ? 2 : 0) : 1));
    x = x.join("");
    if (!D) return [x, null, d[l]];
    image.llImage.drawImage(x, null, D);
  }
  function c(V, Q, d) {
    var l = "222o" == V ? 0 : 9;
    do {
      var D = 2;
      if ("222o" == V || "222so" == V) {
        var x = b(5040);
        var R = b(729);
        D = 3;
      } else if ("222eg" == V) {
        R = p[d & 7];
        x = [0, 2, 3, 4, 5, 1][d >> 3];
        x = mathlib.setNPerm([0, 0, 0, 0].concat(q[x]), b(24), 4);
        x = mathlib.getNPerm(x, 7);
        var G = b(4);
        for (R = a.set([], R); 0 < G--; ) t(R, 0);
        R = a.get(R);
      } else {
        if (/^222eg[012]$/.exec(V))
          return c("222eg", Q, [0, 8, 40][~~V[5]] + d);
        if ("222nb" == V) {
          do (x = b(5040)), (R = b(729));
          while (!E(x, R));
        }
      }
    } while ((0 == x && 0 == R) || null != k.search([x, R], 0, D));
    return k.toStr(k.search([x, R], l).reverse(), "URF", "'2 ");
  }
  var k = new mathlib.Solver(3, 3, [
      [0, [N, "p", 7], 5040],
      [0, [t, "o", 7, -3], 729],
    ]),
    g = [
      [0, 2, 3, 1],
      [0, 1, 5, 4],
      [0, 4, 6, 2],
    ],
    f = [null, [0, 1, 0, 1, 3], [1, 0, 1, 0, 3]],
    a = new mathlib.Coord("o", 7, -3),
    e = [
      [3, 4, 9],
      [1, 20, 5],
      [2, 8, 17],
      [0, 16, 21],
      [13, 11, 6],
      [15, 7, 22],
      [12, 19, 10],
    ],
    h = [0, 1, 2, 3, 8, 9, 4, 5, 20, 21, 16, 17],
    p = [0, 17, 5, 14, 8, 1, 2, 4],
    q = [
      [4, 5, 6],
      [4, 6, 5],
      [6, 5, 4],
      [5, 4, 6],
      [5, 6, 4],
      [6, 4, 5],
    ],
    m = [
      [12816, 4641, 2, "H-1"],
      [12576, 4641, 2, "H-2"],
      [8976, 4641, 4, "H-3"],
      [12306, 4641, 4, "H-4"],
      [786, 528, 4, "L-1"],
      [8976, 528, 4, "L-2"],
      [531, 528, 4, "L-3"],
      [12816, 528, 4, "L-4"],
      [8211, 528, 4, "L-5"],
      [12306, 528, 4, "L-6"],
      [12816, 4626, 4, "Pi-1"],
      [531, 4626, 4, "Pi-2"],
      [8976, 4626, 4, "Pi-3"],
      [8211, 4626, 4, "Pi-4"],
      [12306, 4626, 4, "Pi-5"],
      [786, 4626, 4, "Pi-6"],
      [12816, 8736, 4, "S-1"],
      [531, 8736, 4, "S-2"],
      [786, 8736, 4, "S-3"],
      [12306, 8736, 4, "S-4"],
      [8211, 8736, 4, "S-5"],
      [8976, 8736, 4, "S-6"],
      [8976, 4128, 4, "T-1"],
      [8211, 4128, 4, "T-2"],
      [531, 4128, 4, "T-3"],
      [12816, 4128, 4, "T-4"],
      [12306, 4128, 4, "T-5"],
      [786, 4128, 4, "T-6"],
      [531, 8208, 4, "U-1"],
      [12816, 8208, 4, "U-2"],
      [786, 8208, 4, "U-3"],
      [12306, 8208, 4, "U-4"],
      [8976, 8208, 4, "U-5"],
      [8211, 8208, 4, "U-6"],
      [12816, 4113, 4, "aS-1"],
      [531, 4113, 4, "aS-2"],
      [786, 4113, 4, "aS-3"],
      [12306, 4113, 4, "aS-4"],
      [8976, 4113, 4, "aS-5"],
      [8211, 4113, 4, "aS-6"],
    ],
    r = [
      [291, 545, 4, "Hammer-1"],
      [12321, 545, 4, "Hammer-2"],
      [306, 545, 4, "Hammer-3"],
      [561, 545, 4, "Hammer-4"],
      [801, 545, 4, "Hammer-5"],
      [8961, 545, 4, "Hammer-6"],
      [291, 4130, 4, "Spaceship-1"],
      [8961, 4130, 4, "Spaceship-2"],
      [4896, 4130, 4, "Spaceship-3"],
      [12321, 4130, 4, "Spaceship-4"],
      [12306, 4130, 4, "Spaceship-5"],
      [561, 4130, 4, "Spaceship-6"],
      [8241, 2, 4, "Stollery-1"],
      [12576, 2, 4, "Stollery-2"],
      [12801, 2, 4, "Stollery-3"],
      [8451, 2, 4, "Stollery-4"],
      [561, 2, 4, "Stollery-5"],
      [8496, 2, 4, "Stollery-6"],
      [291, 8738, 1, "Pinwheel-1"],
      [4146, 8738, 1, "Pinwheel-2"],
      [12801, 8738, 4, "Pinwheel-3"],
      [8241, 272, 2, "2Face-1"],
      [12546, 272, 4, "2Face-2"],
      [531, 272, 2, "2Face-3"],
      [12321, 272, 4, "2Face-4"],
      [4866, 290, 4, "Turtle-1"],
      [4146, 290, 4, "Turtle-2"],
      [12801, 290, 4, "Turtle-3"],
      [4656, 290, 4, "Turtle-4"],
      [8976, 290, 4, "Turtle-5"],
      [801, 290, 4, "Turtle-6"],
      [12816, 4370, 4, "Pinwheel Poser-1"],
      [12576, 4370, 4, "Pinwheel Poser-2"],
      [12801, 4370, 4, "Pinwheel Poser-3"],
      [8451, 4370, 4, "Pinwheel Poser-4"],
      [8976, 4370, 4, "Pinwheel Poser-5"],
      [8496, 4370, 4, "Pinwheel Poser-6"],
      [8241, 17, 4, "Gun-1"],
      [4146, 17, 4, "Gun-2"],
      [306, 17, 4, "Gun-3"],
      [12321, 17, 4, "Gun-4"],
      [8976, 17, 4, "Gun-5"],
      [8496, 17, 4, "Gun-6"],
    ],
    H = [
      [4866, 4609, 4, "Hammer-1"],
      [12321, 4609, 4, "Hammer-2"],
      [8976, 4609, 4, "Hammer-3"],
      [12801, 4609, 4, "Hammer-4"],
      [4611, 4609, 4, "Hammer-5"],
      [12576, 4609, 4, "Hammer-6"],
      [291, 4114, 4, "Spaceship-1"],
      [4146, 4114, 4, "Spaceship-2"],
      [786, 4114, 4, "Spaceship-3"],
      [12801, 4114, 4, "Spaceship-4"],
      [4131, 4114, 4, "Spaceship-5"],
      [8496, 4114, 4, "Spaceship-6"],
      [291, 1, 4, "Stollery-1"],
      [12576, 1, 4, "Stollery-2"],
      [306, 1, 4, "Stollery-3"],
      [8451, 1, 4, "Stollery-4"],
      [12546, 1, 4, "Stollery-5"],
      [4611, 1, 4, "Stollery-6"],
      [291, 4369, 1, "Pinwheel-1"],
      [4146, 4369, 1, "Pinwheel-2"],
      [4896, 4369, 4, "Pinwheel-3"],
      [8241, 8194, 2, "2Face-1"],
      [306, 8194, 4, "2Face-2"],
      [4146, 8194, 2, "2Face-3"],
      [12321, 8194, 4, "2Face-4"],
      [8241, 4354, 4, "Turtle-1"],
      [12576, 4354, 4, "Turtle-2"],
      [4131, 4354, 4, "Turtle-3"],
      [12321, 4354, 4, "Turtle-4"],
      [306, 4354, 4, "Turtle-5"],
      [4611, 4354, 4, "Turtle-6"],
      [4866, 8482, 4, "Pinwheel Poser-1"],
      [531, 8482, 4, "Pinwheel Poser-2"],
      [8211, 8482, 4, "Pinwheel Poser-3"],
      [786, 8482, 4, "Pinwheel Poser-4"],
      [8976, 8482, 4, "Pinwheel Poser-5"],
      [801, 8482, 4, "Pinwheel Poser-6"],
      [291, 34, 4, "Gun-1"],
      [4146, 34, 4, "Gun-2"],
      [306, 34, 4, "Gun-3"],
      [8976, 34, 4, "Gun-4"],
      [786, 34, 4, "Gun-5"],
      [8496, 34, 4, "Gun-6"],
    ],
    y = [
      [291, 545, 4, "TCLL1-Hammer"],
      [291, 4130, 4, "TCLL1-Spaceship"],
      [8241, 2, 4, "TCLL1-Stollery"],
      [291, 8738, 1, "TCLL1-Pinwheel"],
      [8241, 272, 2, "TCLL1-2Face"],
      [4866, 290, 4, "TCLL1-Turtle"],
      [12816, 4370, 4, "TCLL1-Pinwheel Poser"],
      [8241, 17, 4, "TCLL1-Gun"],
      [4866, 4609, 4, "TCLL2-Hammer"],
      [291, 4114, 4, "TCLL2-Spaceship"],
      [291, 1, 4, "TCLL2-Stollery"],
      [291, 4369, 1, "TCLL2-Pinwheel"],
      [8241, 8194, 2, "TCLL2-2Face"],
      [8241, 4354, 4, "TCLL2-Turtle"],
      [4866, 8482, 4, "TCLL2-Pinwheel Poser"],
      [291, 34, 4, "TCLL2-Gun"],
    ],
    A = [
      [0, "LS1-PBL"],
      [546, "LS1-Sune"],
      [273, "LS1-aSune"],
      [258, "LS1-Ua"],
      [33, "LS1-Ub"],
      [288, "LS1-La"],
      [528, "LS1-Lb"],
      [513, "LS1-Ta"],
      [18, "LS1-Tb"],
      [66081, "LS2-Hammer"],
      [66066, "LS2-Spaceship"],
      [66048, "LS2-StolleryA"],
      [65538, "LS2-StolleryB"],
      [65568, "LS2-StolleryC"],
      [65808, "LS2-2Face"],
      [65826, "LS2-Turtle"],
      [65553, "LS2-GunA"],
      [65793, "LS2-GunB"],
      [131346, "LS3-Hammer"],
      [131601, "LS3-Spaceship"],
      [131328, "LS3-StolleryA"],
      [131073, "LS3-StolleryB"],
      [131088, "LS3-StolleryC"],
      [131616, "LS3-2Face"],
      [131361, "LS3-Turtle"],
      [131106, "LS3-GunA"],
      [131586, "LS3-GunB"],
      [8226, "LS4-SuneA"],
      [8736, "LS4-SuneB"],
      [8706, "LS4-SuneC"],
      [8721, "LS4-PiA"],
      [8481, "LS4-PiB"],
      [8208, "LS4-U"],
      [8193, "LS4-L"],
      [8448, "LS4-T"],
      [8466, "LS4-H"],
      [73746, "LS5-HammerA"],
      [73986, "LS5-HammerB"],
      [74016, "LS5-SpaceshipA"],
      [74241, "LS5-SpaceshipB"],
      [73728, "LS5-Stollery"],
      [74274, "LS5-Pinwheel"],
      [73761, "LS5-TurtleA"],
      [74256, "LS5-TurtleB"],
      [74001, "LS5-Pinwheel Poser"],
      [139536, "LS6-Hammer"],
      [139521, "LS6-Spaceship"],
      [139266, "LS6-2Face"],
      [139281, "LS6-Turtle"],
      [139554, "LS6-Pinwheel PoserA"],
      [139809, "LS6-Pinwheel PoserB"],
      [139794, "LS6-Pinwheel PoserC"],
      [139776, "LS6-GunA"],
      [139296, "LS6-GunB"],
      [4113, "LS7-aSuneA"],
      [4368, "LS7-aSuneB"],
      [4353, "LS7-aSuneC"],
      [4626, "LS7-PiA"],
      [4386, "LS7-PiB"],
      [4608, "LS7-U"],
      [4098, "LS7-L"],
      [4128, "LS7-T"],
      [4641, "LS7-H"],
      [70176, "LS8-Hammer"],
      [69666, "LS8-Spaceship"],
      [69633, "LS8-2Face"],
      [70146, "LS8-Turtle"],
      [69921, "LS8-Pinwheel PoserA"],
      [69906, "LS8-Pinwheel PoserB"],
      [70161, "LS8-Pinwheel PoserC"],
      [69648, "LS8-GunA"],
      [69888, "LS8-GunB"],
      [135681, "LS9-HammerA"],
      [135201, "LS9-HammerB"],
      [135186, "LS9-SpaceshipA"],
      [135456, "LS9-SpaceshipB"],
      [135168, "LS9-Stollery"],
      [135441, "LS9-Pinwheel"],
      [135426, "LS9-TurtleA"],
      [135696, "LS9-TurtleB"],
      [135714, "LS9-Pinwheel Poser"],
    ],
    w = mathlib.idxArray(m, 2),
    v = mathlib.idxArray(m, 3),
    u = mathlib.idxArray(r, 2),
    I = mathlib.idxArray(r, 3),
    z = mathlib.idxArray(H, 2),
    O = mathlib.idxArray(H, 3),
    J = mathlib.idxArray(y, 2),
    P = mathlib.idxArray(y, 3),
    W = mathlib.valuedArray(A.length, 1),
    X = mathlib.idxArray(A, 1);
  scrMgr.reg(["222o", "222so", "222nb"], c)("222eg0", n, [
    v,
    w,
    C.bind(null, "all", m, v),
  ])("222eg1", n, [v, w, C.bind(null, "all", m, v)])("222eg2", n, [
    v,
    w,
    C.bind(null, "all", m, v),
  ])("222tcp", n, [I, u, C.bind(null, "all", r, I)])("222tcn", n, [
    O,
    z,
    C.bind(null, "all", H, O),
  ])("222tc", n, [P, J, C.bind(null, "ori", y, P)])("222lsall", n, [
    X,
    W,
    C.bind(null, "ls", A, X),
  ])("222eg", c, [
    "EG0-O EG0-H EG0-L EG0-Pi EG0-S EG0-T EG0-U EG0-aS EG1B-O EG1B-H EG1B-L EG1B-Pi EG1B-S EG1B-T EG1B-U EG1B-aS EG1L-O EG1L-H EG1L-L EG1L-Pi EG1L-S EG1L-T EG1L-U EG1L-aS EG1F-O EG1F-H EG1F-L EG1F-Pi EG1F-S EG1F-T EG1F-U EG1F-aS EG1R-O EG1R-H EG1R-L EG1R-Pi EG1R-S EG1R-T EG1R-U EG1R-aS EG2-O EG2-H EG2-L EG2-Pi EG2-S EG2-T EG2-U EG2-aS".split(
      " "
    ),
    [
      1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4, 1,
      2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4, 1, 2, 4, 4, 4, 4, 4, 4,
    ],
  ]);
  return { getEGLLImage: C.bind(null, !1, m, v) };
})(mathlib.rn);
(function () {
  function b(f, a) {
    mathlib.acycle(f, [0, a + 1]);
  }
  function N(f, a) {
    var e = mathlib.setNPerm([], ~~(f / 3), 4);
    mathlib.acycle(e, g[a]);
    return 3 * mathlib.getNPerm(e, 4) + (((f % 3) + (0 == a ? 1 : 0)) % 3);
  }
  function t(f, a, e) {
    return 72 * C[e][~~(a / 72)] + c[(e + f) % 3][a % 72];
  }
  function E(f, a, e, h) {
    if (0 == a) return 0 == f[0] && 0 == f[1] && 0 == f[2] && 0 == f[3];
    if (
      Math.max(
        mathlib.getPruning(k[0], 72 * f[0] + f[1]),
        mathlib.getPruning(k[1], 72 * f[0] + f[2]),
        mathlib.getPruning(k[2], 72 * f[0] + f[3])
      ) > a
    )
      return !1;
    for (var p = 0; 3 > p; p++)
      if (p != e)
        for (var q = f.slice(), m = 0; 11 > m; m++) {
          q[0] = C[p][q[0]];
          for (var r = 1; 4 > r; r++) q[r] = c[(p + r - 1) % 3][q[r]];
          if (E(q, a - 1, p, h))
            return (
              h.push(
                "URF".charAt(p) + "' 2' 3' 4' 5' 6 5 4 3 2 ".split(" ")[m]
              ),
              !0
            );
        }
  }
  function n() {
    n = $.noop;
    mathlib.createMove(c, 72, N, 3);
    mathlib.createMove(C, 24, [b, "p", 4], 3);
    for (var f = 0; 3 > f; f++)
      mathlib.createPrun(k[f], 0, 1728, 5, t.bind(null, f), 3, 12, 0);
  }
  var C = [],
    c = [],
    k = [[], [], []],
    g = [
      [0, 3, 2, 1],
      [0, 1],
      [0, 3],
    ];
  scrMgr.reg(["gearo", "gearso"], function (f) {
    n();
    do {
      var a = [mathlib.rn(24)];
      for (var e = 0; 3 > e; e++) {
        do a[e + 1] = mathlib.rn(72);
        while (15 == mathlib.getPruning(k[e], 72 * a[0] + a[e + 1]));
      }
    } while (0 == a);
    f = "gearso" == f ? 4 : 0;
    for (e = []; !E(a, f, -1, e); ) f++;
    return e.reverse().join(" ");
  });
})();
(function () {
  var b = new mathlib.Solver(4, 1, [
      [
        0,
        function (t, E) {
          var n = mathlib.setNPerm([], t >> 4, 4);
          mathlib.acycle(n, N[E]);
          return (mathlib.getNPerm(n, 4) << 4) + ((t & 15) ^ (1 << E));
        },
        384,
      ],
    ]),
    N = [
      [0, 1],
      [2, 3],
      [0, 3],
      [1, 2],
    ];
  scrMgr.reg("133", function () {
    var t = 1 + mathlib.rn(191);
    t = 2 * t + ((mathlib.getNParity(t >> 3, 4) ^ (t >> 1) ^ (t >> 2) ^ t) & 1);
    return b.toStr(b.search([t], 0), "RLFB", [""]);
  });
})();
(function (b, N) {
  function t() {
    t = $.noop;
    for (var c = [], k, g = 0; 40320 > g; g++) n[g] = [];
    for (g = 0; 40320 > g; g++)
      mathlib.setNPerm(c, g, 8),
        b(c, 0, 1, 2, 3),
        (k = n[0][g] = N(c, 8)),
        b(c, 4, 5, 6, 7),
        (k = n[1][k] = N(c, 8)),
        b(c, 2, 5)(c, 3, 6),
        (k = n[2][k] = N(c, 8)),
        b(c, 0, 5)(c, 3, 4),
        (n[3][k] = N(c, 8));
    mathlib.createPrun(C, 0, 40320, 12, n, 4, 3);
  }
  function E(c, k, g, f, a) {
    if (0 == g) return 0 == c + k;
    if (mathlib.getPruning(C, c) > g) return !1;
    var e, h;
    for (h = 0; 4 > h; h++)
      if (h != f) {
        var p = c;
        var q = k;
        for (e = 0; e < (2 > h ? 3 : 1); e++) {
          p = n[h][p];
          var m = q;
          q = h;
          2 > q
            ? (q = m)
            : ((m = mathlib.setNPerm([], m, 3)),
              2 == q ? b(m, 0, 1) : 3 == q && b(m, 0, 2),
              (q = N(m, 3)));
          if (E(p, q, g - 1, h, a))
            return (
              a.push(
                ["U", "D", "R2", "F2"][h] + (2 > h ? " 2'".charAt(e) : "")
              ),
              !0
            );
        }
      }
  }
  var n = [],
    C = [];
  scrMgr.reg("223", function () {
    t();
    do {
      var c = mathlib.rn(40320);
      var k = mathlib.rn(6);
    } while (0 == k + c);
    for (var g = [], f = 0; 99 > f && !E(c, k, f, -1, g); f++);
    return g.reverse().join(" ");
  });
})(mathlib.circle, mathlib.getNPerm);
var clock = (function (b, N) {
  function t(k, g, f, a, e) {
    for (var h = k[0].length; a < h; a++)
      k[f][a] = (k[f][a] + k[g][a] * e) % 12;
  }
  var E = [
      [0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [11, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 1, 1, 0, 1],
      [0, 0, 11, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [11, 0, 11, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
      [11, 0, 0, 0, 0, 0, 11, 0, 0, 1, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 11, 0, 11, 0, 1, 1, 1, 1],
      [0, 0, 11, 0, 0, 0, 0, 0, 11, 1, 1, 1, 0, 1],
      [11, 0, 11, 0, 0, 0, 11, 0, 11, 1, 1, 1, 1, 1],
    ],
    n = [-1, 1, -1, -1, -1, 5, -1, 7, -1, -1, -1, 11],
    C = [7695, 42588, 47187, 85158, 86697, 156568, 181700, 209201, 231778],
    c = "UR DR DL UL U R D L ALL".split(" ");
  scrMgr.reg("clko", function (k) {
    var g = [];
    for (k = 0; 14 > k; k++) g[k] = b(12);
    k = [];
    k.length = 18;
    if (14 == g.length && 18 == k.length)
      for (var f = 15, a = 0; a < N[18][14]; a++) {
        var e = a;
        var h = 14;
        for (var p = 0, q = 17; 0 <= q; q--)
          e >= N[q][h] && ((e -= N[q][h--]), (p |= 1 << q));
        h = p;
        e = !1;
        for (p = 0; p < C.length; p++)
          if ((h & C[p]) == C[p]) {
            e = !0;
            break;
          }
        if (!e) {
          e = [];
          for (p = q = 0; 18 > p; p++) 1 == ((h >> p) & 1) && (e[q++] = p);
          h = [];
          for (q = 0; 14 > q; q++) {
            h[q] = [];
            for (p = 0; 14 > p; p++) h[q][p] = E[e[p]][q];
            h[q][14] = g[q];
          }
          b: {
            p = h;
            q = p[0].length;
            for (var m = 0; m < q - 1; m++) {
              if (-1 == n[p[m][m]]) {
                for (var r = -1, H = m + 1; 14 > H; H++)
                  if (-1 != n[p[H][m]]) {
                    r = H;
                    break;
                  }
                if (-1 == r)
                  c: for (H = m; 13 > H; H++)
                    for (var y = H + 1; 14 > y; y++)
                      if (-1 != n[(p[H][m] + p[y][m]) % 12]) {
                        t(p, y, H, m, 1);
                        r = H;
                        break c;
                      }
                if (-1 == r) {
                  for (H = m + 1; 14 > H; H++)
                    if (0 != p[H][m]) {
                      p = -1;
                      break b;
                    }
                  p = m + 1;
                  break b;
                }
                H = p;
                y = m;
                var A = H[y];
                H[y] = H[r];
                H[r] = A;
              }
              r = n[p[m][m]];
              for (H = m; H < q; H++) p[m][H] = (p[m][H] * r) % 12;
              for (H = m + 1; 14 > H; H++) t(p, m, H, m, 12 - p[H][m]);
            }
            p = 0;
          }
          if (0 == p) {
            p = !0;
            for (q = 14; 14 > q; q++)
              if (0 != h[q][14]) {
                p = !1;
                break;
              }
            if (p) {
              p = h;
              for (q = p[0].length - 2; 0 < q; q--)
                for (m = q - 1; 0 <= m; m--)
                  0 != p[m][q] && t(p, q, m, q, 12 - p[m][q]);
              for (q = p = 0; 14 > q; q++) 0 != h[q][14] && p++;
              if (p < f) {
                for (q = 0; 18 > q; q++) k[q] = 0;
                for (q = 0; 14 > q; q++) k[e[q]] = h[q][14];
                f = p;
              }
            }
          }
        }
      }
    g = "";
    for (f = 0; 9 > f; f++)
      (a = k[f]),
        0 != a &&
          ((e = 6 >= a),
          6 < a && (a = 12 - a),
          (g += c[f] + a + (e ? "+" : "-") + " "));
    g += "y2 ";
    for (f = 0; 9 > f; f++)
      (a = k[f + 9]),
        0 != a &&
          ((e = 6 >= a),
          6 < a && (a = 12 - a),
          (g += c[f] + a + (e ? "+" : "-") + " "));
    k = !0;
    for (f = 0; 4 > f; f++)
      1 == b(2) && ((g += (k ? "" : " ") + c[f]), (k = !1));
    return g;
  });
  return { moveArr: E };
})(mathlib.rn, mathlib.Cnk);
(function () {
  var b = [
      [0, 1, 2, 3],
      [0, 2, 5, 4],
    ],
    N = [
      [0, 0, 0, 0, 2],
      [0, 1, 0, 1, 2],
    ],
    t = new mathlib.Solver(2, 3, [
      [
        0,
        function (E, n) {
          var C = E >> 3,
            c = E;
          E = (E << 1) | (mathlib.getNParity(C, 6) ^ ((c >> 1) & 1));
          C = mathlib.setNPerm([], C, 6);
          mathlib.acycle(C, b[n]);
          0 == n && (c += 2);
          1 == n && (E += 1);
          return (mathlib.getNPerm(C, 6) << 3) | (c & 6) | ((E >> 1) & 1);
        },
        5760,
      ],
      [
        0,
        [
          function (E, n) {
            mathlib.acycle(E, b[n], 1, N[n]);
          },
          "o",
          6,
          -2,
        ],
        32,
      ],
    ]);
  scrMgr.reg("lsemu", function () {
    do {
      var E = mathlib.rn(5760);
      var n = mathlib.rn(32);
    } while (0 == n + E);
    return t.toStr(t.search([E, n], 0), "UM", " 2'").replace(/ +/g, " ");
  });
})();
(function () {
  function b(c, k, g) {
    g = k = 0;
    do
      "mlsll" == c
        ? ((k = mathlib.rn(11520)), (g = mathlib.rn(87480)))
        : "mgmpll" == c
        ? ((k = 32 * N.get(mathlib.rndPerm(5, !0).concat([5]))),
          (g = 243 * E.get(mathlib.rndPerm(5, !0).concat([5]))))
        : "mgmll" == c &&
          ((k = t.set([], mathlib.rn(32))),
          (k[0] += k[5]),
          (k[5] = 0),
          (g = n.set([], mathlib.rn(243))),
          (g[0] += g[5]),
          (g[5] = 0),
          (k = 32 * N.get(mathlib.rndPerm(5, !0).concat([5])) + t.get(k)),
          (g = 243 * E.get(mathlib.rndPerm(5, !0).concat([5])) + n.get(g)));
    while (0 == k && 0 == g);
    c = C.search([k, g], 0);
    k = [];
    for (g = 0; g < c.length; g++) {
      var f = c[g];
      k.push(
        ["U", "R U", "F' U"][f[0]] +
          ["", "2", "2'", "'"][f[1]] +
          ["", " R'", " F"][f[0]]
      );
    }
    return k.join(" ").replace(/ +/g, " ");
  }
  var N = new mathlib.Coord("p", 6, -1),
    t = new mathlib.Coord("o", 6, -2),
    E = new mathlib.Coord("p", 6, -1),
    n = new mathlib.Coord("o", 6, -3),
    C = new mathlib.Solver(3, 4, [
      [
        0,
        function (c, k) {
          var g = N.set([], c >> 5);
          c = t.set([], c & 31);
          0 == k
            ? (mathlib.acycle(c, [0, 1, 2, 3, 4], 1),
              mathlib.acycle(g, [0, 1, 2, 3, 4], 1))
            : 1 == k
            ? (mathlib.acycle(c, [0, 1, 2, 3, 5], 1),
              mathlib.acycle(g, [0, 1, 2, 3, 5], 1))
            : 2 == k &&
              (mathlib.acycle(c, [1, 2, 3, 4, 5], 1, [0, 0, 0, 0, 1, 2]),
              mathlib.acycle(g, [1, 2, 3, 4, 5]));
          return (N.get(g) << 5) | t.get(c);
        },
        11520,
      ],
      [
        0,
        function (c, k) {
          var g = E.set([], ~~(c / 243));
          c = n.set([], c % 243);
          0 == k
            ? (mathlib.acycle(c, [0, 1, 2, 3, 4], 1),
              mathlib.acycle(g, [0, 1, 2, 3, 4], 1))
            : 1 == k
            ? (mathlib.acycle(c, [0, 5, 1, 2, 3], 1, [2, 0, 0, 0, 0, 3]),
              mathlib.acycle(g, [0, 5, 1, 2, 3]))
            : 2 == k &&
              (mathlib.acycle(c, [0, 2, 3, 4, 5], 1, [1, 0, 0, 0, 1, 3]),
              mathlib.acycle(g, [0, 2, 3, 4, 5]));
          return 243 * E.get(g) + n.get(c);
        },
        87480,
      ],
    ]);
  scrMgr.reg("mlsll", b)("mgmpll", b)("mgmll", b);
})();
(function () {
  scrMgr.reg("klmso", function () {
    var b = new klmsolver.KiloCubie();
    b.perm = mathlib.rndPerm(20, !0);
    for (var N = 60, t = 0; 19 > t; t++) {
      var E = mathlib.rn(3);
      b.twst[t] = E;
      N -= E;
    }
    b.twst[19] = N % 3;
    return klmsolver.solveKiloCubie(b, !0);
  });
})();
(function () {
  function b(t, E, n) {
    var C = new ftosolver.FtoCubie();
    t || (C.ep = mathlib.rndPerm(12, !0));
    E || ((C.uf = mathlib.rndPerm(12, !0)), (C.rl = mathlib.rndPerm(12, !0)));
    n ||
      ((C.cp = mathlib.rndPerm(6, !0)),
      mathlib.setNOri(C.co, mathlib.rn(32), 6, -2));
    return ftosolver.solveFacelet(C.toFaceCube(), !0);
  }
  function N(t) {
    var E = t.length >> 1,
      n = new ftosolver.FtoCubie();
    do {
      var C = mathlib.rndPerm(E, !0);
      var c = mathlib.setNOri([], mathlib.rn((1 << E) >> 1), E, -2);
      var k = mathlib.rndPerm(t.length, !0);
      var g = !0;
      for (var f = 0; f < t.length; f++)
        g = g && ~~(t[k[f]] / 3) == ~~(t[f] / 3);
      for (f = 0; f < E; f++) g = g && C[f] == f && 0 == c[f];
    } while (g);
    for (f = 0; f < E; f++) (n.cp[f] = C[f]), (n.co[f] = c[f]);
    for (f = 0; f < t.length; f++) n.uf[t[f]] = t[k[f]];
    return ftosolver.solveFacelet(n.toFaceCube(), !0);
  }
  scrMgr.reg("ftoso", b.bind(null, !1, !1, !1))(
    "ftol3t",
    N.bind(null, [0, 1, 2, 3, 7, 11])
  )("ftol4t", N.bind(null, [0, 1, 2, 3, 6, 7, 9, 11]))("ftotcp", function () {
    var t = new ftosolver.FtoCubie(),
      E = [1, 2, 3, 7, 11];
    do {
      var n = mathlib.rndPerm(3, !0);
      var C = [0].concat(mathlib.setNOri([], mathlib.rn(2), 2, -2));
      var c = mathlib.rndPerm(5, !0);
    } while (3 > E[c[0]] || 3 > E[c[1]]);
    for (var k = 0; 3 > k; k++) (t.cp[k] = n[k]), (t.co[k] = C[k]);
    for (k = 0; k < E.length; k++) t.uf[E[k]] = E[c[k]];
    return ftosolver.solveFacelet(t.toFaceCube(), !0);
  })("ftoedge", b.bind(null, !1, !0, !0))("ftocent", b.bind(null, !0, !1, !0))(
    "ftocorn",
    b.bind(null, !0, !0, !1)
  );
})();
var redi = (function () {
  function b(w, v) {
    mathlib.acycle(w, e[v], 1);
  }
  function N(w, v) {
    w[v] = (w[v] + 1) % 3;
  }
  function t(w) {
    for (var v = 0, u = [], I = 4, z = 11; 0 <= z; z--)
      4 == (w[z] & 12) && ((v += mathlib.Cnk[z][I--]), (u[I] = w[z] & 3));
    return [v, mathlib.getNPerm(u, 4)];
  }
  function E(w, v) {
    for (var u = [], I = 11, z = 4, O = 11; 0 <= O; O--)
      w >= mathlib.Cnk[O][z]
        ? ((w -= mathlib.Cnk[O][z--]), (u[O] = z + 4))
        : ((u[O] = I--), 4 == (I & 12) && (I -= 4));
    mathlib.acycle(u, a[v], 1);
    return t(u);
  }
  function n(w, v) {
    v = p[v][~~(w / 24)];
    return 24 * v[0] + h[w % 24][v[1]];
  }
  function C(w, v) {
    if (4 > v) return w;
    w = m.set([], w);
    w[v - 4] = (w[v - 4] + 1) % 3;
    return m.get(w);
  }
  function c(w) {
    for (var v = [], u = 0; u < w.length; u++)
      v.push("FLBRflbr"[w[u][0]] + ["", "'"][w[u][1]]);
    return v.join(" ");
  }
  function k() {
    if (!y) {
      for (var w = [], v = [], u = [], I = 0; 24 > I; I++) {
        h[I] = [];
        mathlib.setNPerm(w, I, 4);
        for (var z = 0; 24 > z; z++) {
          mathlib.setNPerm(v, z, 4);
          for (var O = 0; 4 > O; O++) u[O] = w[v[O]];
          h[I][z] = mathlib.getNPerm(u, 4);
        }
      }
      m = new mathlib.Coord("o", 4, 3);
      mathlib.createMove(q, 81, C, 8);
      mathlib.createMove(p, 495, E, 8);
      mathlib.createPrun(H, 0, 81, 4, q, 8, 2);
      mathlib.createPrun(r, 1656, 11880, 8, n, 8, 2);
      y = new mathlib.Searcher(
        null,
        function (J) {
          return Math.max(
            mathlib.getPruning(H, J[0]),
            mathlib.getPruning(r, J[1])
          );
        },
        function (J, P) {
          P = [q[P][J[0]], n(J[1], P)];
          return P[0] == J[0] && P[1] == J[1] ? null : P;
        },
        8,
        2
      );
      A = new mathlib.Solver(4, 2, [
        [0, [N, "o", 4, 3], 81],
        [0, [b, "p", 8, -1], 20160],
      ]);
    }
  }
  function g(w, v) {
    var u = t(w),
      I = m.get(v.slice(4));
    u = y.solve([I, 24 * u[0] + u[1]], 0, 15);
    for (I = 0; I < u.length; I++) {
      var z = u[I][0],
        O = u[I][1] + 1;
      mathlib.acycle(w, a[z], O);
      v[z] = (v[z] + O) % 3;
    }
    z = [];
    for (I = 0; 8 > I; I++)
      (O = 4 > I ? I : I + 4), (z[I] = 4 > w[O] ? w[O] : w[O] - 4);
    w = mathlib.getNPerm(z, 8, -1);
    v = m.get(v);
    v = A.search([v, w], 0);
    return c([].concat(u, v));
  }
  function f() {
    k();
    for (var w = mathlib.rndPerm(12, !0), v = [], u = 0; 8 > u; u++)
      v[u] = mathlib.rn(3);
    return g(w, v);
  }
  var a = [
      [1, 0, 8],
      [2, 1, 9],
      [3, 2, 10],
      [0, 3, 11],
      [4, 5, 8],
      [5, 6, 9],
      [6, 7, 10],
      [7, 4, 11],
    ],
    e = [
      [1, 0, 4],
      [2, 1, 5],
      [3, 2, 6],
      [0, 3, 7],
    ],
    h = [],
    p = [],
    q = [],
    m = null,
    r = [],
    H = [],
    y = null,
    A = null;
  scrMgr.reg("rediso", f);
  return {
    solveRedi: g,
    getRandomScramble: f,
    testbench: function () {
      k();
      for (var w = [], v = 0; 20 > v; v++)
        w.push([~~(8 * Math.random()), ~~(2 * Math.random())]);
      var u = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        I = [0, 0, 0, 0, 0, 0, 0, 0];
      for (v = 0; v < w.length; v++) {
        var z = w[v][0],
          O = w[v][1] + 1;
        mathlib.acycle(u, a[z], O);
        I[z] = (I[z] + O) % 3;
      }
      console.log(c(w) + "   " + g(u, I));
    },
  };
})();
var slideCube = (function () {
  function b(a, e) {
    var h = a.indexOf("-"),
      p = h >> 2;
    h &= 3;
    a = a.split("");
    var q = ~~e[1],
      m = [(p << 2) | h];
    if ("V" == e[0]) {
      if ("$" == a[(p << 2) | q]) return null;
      for (e = h > q ? -1 : 1; h != q; ) (h += e), m.push((p << 2) | h);
    } else {
      if ("$" == a[(q << 2) | h]) return null;
      for (e = p > q ? -1 : 1; p != q; ) (p += e), m.push((p << 2) | h);
    }
    m.reverse();
    mathlib.acycle(a, m);
    return a.join("");
  }
  function N(a) {
    var e = [];
    a = a.split("");
    for (var h = 0; h < a.length; h++)
      "?" == a[h] && ((a[h] = "-"), e.push(a.join("")), (a[h] = "?"));
    return e;
  }
  function t(a, e) {
    for (var h = [], p = 0; p < e.length; p++) h[p] = a[e[p]];
    a = h.join("");
    for (p = 0; p < C.length; p++) a = b(a, C[p]);
    return a;
  }
  function E(a) {
    do {
      var e = mathlib.rndPerm(a * a);
      var h = (a - 1 - ~~(e.indexOf(e.length - 1) / a)) * (a - 1);
      for (var p = 0; p < e.length; p++)
        for (var q = p + 1; q < e.length; q++)
          e[p] > e[q] && e[p] != e.length - 1 && h++;
    } while (0 != h % 2);
    return e;
  }
  function n(a, e) {
    var h = +new Date(),
      p = [],
      q = 0;
    if (4 == a) {
      p[0] = E(4);
      for (
        var m = p[0],
          r = [],
          H = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15],
          y = 0;
        16 > y;
        y++
      )
        r[y] = H[m[H[y]]];
      p[1] = r;
      m = 0;
      a: for (; 99 > m; m++)
        for (q = 0; 2 > q; q++)
          if (
            ((r = p[q].indexOf(p[q].length - 1)),
            (C = ["V" + (r & 3), "H" + (r >> 2)]),
            (r = k.search(t("0123???????????-", p[q]), m, m)))
          ) {
            C = C.concat(r);
            break a;
          }
      m = g.search(t("01234???8???c??-", p[q]).replace(/[0123]/g, "$"), 0);
      C = C.concat(m);
    } else if (3 == a) {
      m = E(3);
      r = [5, 6, 7, 9, 10, 11, 13, 14, 15];
      for (H = 0; 16 > H; H++) p[H] = r[m[r.indexOf(H)]] || H;
      r = p.indexOf(p.length - 1);
      C = ["V" + (r & 3), "H" + (r >> 2)];
      p = [p];
    }
    m = f.search(t("0123456789abcde-", p[q]).replace(/[012348c]/g, "$"), 0);
    C = C.concat(m);
    DEBUG &&
      console.log(
        "[15p solver]",
        q,
        t("0123456789abcde-", p[q]),
        C.join(""),
        C.length,
        +new Date() - h
      );
    h = e.slice(3 == a ? 3 : 4);
    a = [];
    m = 1 == q ? "VH" : "HV";
    q = -1 == h.indexOf("a") ? ["DR", "UL"] : ["￬￫", "￪￩"];
    e = -1 != h.indexOf("m");
    h = -1 != h.indexOf("p");
    H = [-1, -1];
    for (p = 0; p < C.length; p++) {
      y = ~~C[p][1];
      var A = m.indexOf(C[p][0]);
      -1 != H[A] &&
        H[A] != y &&
        (0 < a.length && a.at(-1)[0] == A
          ? ((r = a.at(-1)), (r[1] += y - H[A]), 0 == r[1] && a.pop())
          : a.push([A, y - H[A]]));
      H[A] = y;
    }
    for (p = 0; p < a.length; p++) {
      r = a[p];
      m = q[e != 0 < r[1] ? 0 : 1][r[0]];
      r = Math.abs(r[1]);
      a[p] = [];
      if (h) a[p].push(m + r);
      else for (; 0 < r--; ) a[p].push(m);
      a[p] = a[p].join(" ");
    }
    a.reverse();
    return a.join(" ").replace(/1/g, "");
  }
  var C,
    c = { V0: 0, V1: 0, V2: 0, V3: 0, H0: 1, H1: 1, H2: 1, H3: 1 },
    k = new mathlib.gSolver(N("0123????????????"), b, c),
    g = new mathlib.gSolver(N("$$$$4???8???c???"), b, c),
    f = new mathlib.gSolver(["$$$$$567$9ab$de-"], b, c);
  scrMgr.reg(["15prp", "15prap", "15prmp"], n.bind(null, 4))(
    ["8prp", "8prap", "8prmp"],
    n.bind(null, 3)
  );
})();
(function (b, N, t) {
  function E(w, v, u, I, z) {
    I = I || [""];
    for (var O = 0, J, P = [], W = 0; W < u; W++) {
      do J = z ? mathlib.rndProb(z) : b(w.length);
      while ((O >> J) & 1);
      P.push(w[J] + N(I));
      O &= ~v[J];
      O |= 1 << J;
    }
    return P.join(" ");
  }
  function n(w) {
    return (
      " " +
      N([
        w + "=0",
        w + "+1",
        w + "+2",
        w + "+3",
        w + "+4",
        w + "+5",
        w + "+6",
        w + "-5",
        w + "-4",
        w + "-3",
        w + "-2",
        w + "-1",
      ]) +
      " "
    );
  }
  function C() {
    return N(["U", "d"]) + N(["U", "d"]);
  }
  function c(w, v, u, I) {
    for (
      var z = [
          [0, -1],
          [1, 0],
          [-1, 0],
          [0, 1],
        ],
        O = 0,
        J = 3,
        P,
        W = 5,
        X = [],
        V = 0;
      V < v;
      V++
    ) {
      do P = b(4);
      while (
        0 > O + z[P][0] ||
        3 < O + z[P][0] ||
        0 > J + z[P][1] ||
        3 < J + z[P][1] ||
        3 == P + W
      );
      O += z[P][0];
      J += z[P][1];
      0 < X.length && X.at(-1)[0] == P ? X.at(-1)[1]++ : X.push([P, 1]);
      W = P;
    }
    v = "";
    for (V = 0; V < X.length; V++)
      if (
        ((z = w ? X[V][0] : 3 - X[V][0]),
        (z = (u ? "￪￩￫￬" : "ULRD").charAt(z)),
        I)
      )
        v += z + (1 == X[V][1] ? "" : X[V][1]) + " ";
      else for (O = 0; O < X[V][1]; O++) v += z + " ";
    return v;
  }
  function k(w, v) {
    var u = "",
      I,
      z;
    for (I = 0; I < v; I++) {
      u += "  ";
      for (z = 0; z < w; z++)
        u += (0 == z % 2 ? "R" : "D") + N(["++", "--"]) + " ";
      u += "U" + (u.endsWith("-- ") ? "'\\n" : "~\\n");
    }
    return u;
  }
  function g(w, v) {
    var u = "",
      I,
      z;
    for (I = 0; I < v; I++) {
      u += " ";
      for (z = 0; z < w / 2; z++) u += N(["+", "-"]) + N(["+", "-"]) + " ";
      u += "U" + N(["'\\n", "~\\n"]);
    }
    return u;
  }
  function f(w) {
    var v = "",
      u,
      I;
    for (u = 0; u < Math.ceil(w / 10); u++) {
      v += "  ";
      for (I = 0; 10 > I; I++)
        v +=
          (0 == I % 2 ? "Rr".charAt(b(2)) : "Dd".charAt(b(2))) +
          N(["+ ", "++", "- ", "--"]) +
          " ";
      v += "y" + N(H).padEnd(2, "~") + "\\n";
    }
    return v;
  }
  function a(w, v) {
    y = [];
    h(1, w, v);
    var u = "";
    for (w = 0; w < y[0].length; w++)
      (v = y[0][w]),
        (u = 7 == v[0] ? u + "/" : u + (" (" + v[0] + "," + v[1] + ")"));
    return u;
  }
  function e(w) {
    y = [];
    var v;
    h(2, 0, w);
    var u = y[0],
      I = y[1],
      z = "";
    7 == u[0][0] && (u = [[0, 0]].concat(u));
    7 == I[0][0] && (I = [[0, 0]].concat(I));
    for (v = 0; v < w; v++)
      z +=
        "(" +
        u[2 * v][0] +
        "," +
        I[2 * v][0] +
        "," +
        I[2 * v][1] +
        "," +
        u[2 * v][1] +
        ")/ ";
    return z;
  }
  function h(w, v, u) {
    for (var I = 0; I < w; I++) {
      A = [
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      ];
      y[I] = [];
      for (var z = 0; z < u; ) {
        var O = b(12) - 5,
          J = 2 == v ? 0 : b(12) - 5,
          P = (0 == O ? 0 : 1) + (0 == J ? 0 : 1);
        (z + P <= u || 1 != v) &&
          (0 < P || 0 == z) &&
          p(O, J) &&
          (1 == v && (z += P),
          0 < P && (y[I][y[I].length] = [O, J]),
          z < u || 1 != v) &&
          (z++, (y[I][y[I].length] = [7, 0]), p(7, 0));
      }
    }
  }
  function p(w, v) {
    var u;
    if (7 == w) {
      for (u = 0; 6 > u; u++) mathlib.circle(A, u + 6, u + 12);
      return !0;
    }
    if (
      A[(17 - w) % 12] ||
      A[(11 - w) % 12] ||
      A[12 + ((17 - v) % 12)] ||
      A[12 + ((11 - v) % 12)]
    )
      return !1;
    var I = A.slice(0, 12);
    var z = A.slice(12, 24);
    for (u = 0; 12 > u; u++)
      (A[u] = I[(12 + u - w) % 12]), (A[u + 12] = z[(12 + u - v) % 12]);
    return !0;
  }
  function q(w) {
    for (var v = [], u = 0; u < w; u++)
      v.push(t([["R"], ["L"]], ["", "'"], 3 + b(3)));
    return v.join(" x ");
  }
  function m(w, v) {
    for (var u = 0, I = [], z = 0; 4 > z; z++)
      (I[z] = b(3)),
        0 < I[z]
          ? ((I[z] = "ulrb".charAt(z) + ["! ", "' "][I[z] - 1]), u++)
          : (I[z] = "");
    return w.substr(0, w.length - v * u) + " " + I.join("");
  }
  var r = ["", "2", "'"],
    H = ["", "2", "'", "2'"],
    y = [],
    A = [];
  scrMgr.reg("444yj", function (w, v) {
    w = [
      ["U", "D"],
      ["R", "L", "r"],
      ["F", "B", "f"],
    ];
    var u = [],
      I = 0,
      z,
      O = "";
    var J = -1;
    for (z = 0; z < v; z++) {
      var P = 0;
      do {
        var W = b(w.length),
          X = b(w[W].length);
        if (W != J || 0 == u[X]) {
          if (W == J) (u[X] = 1), (P = b(r.length));
          else {
            for (J = 0; J < w[W].length; J++) u[J] = 0;
            J = W;
            u[X] = 1;
            P = b(r.length);
          }
          0 == W && 0 == X && (I = (I + 4 + P) % 4);
          O =
            1 == W && 2 == X
              ? 0 == I || 3 == I
                ? O + ("l" + r[P] + " ")
                : O + ("r" + r[P] + " ")
              : 2 == W && 2 == X
              ? 0 == I || 1 == I
                ? O + ("b" + r[P] + " ")
                : O + ("f" + r[P] + " ")
              : O + (w[W][X] + r[P] + " ");
          P = 1;
        }
      } while (0 == P);
    }
    return O;
  });
  scrMgr.reg("bic", function (w, v) {
    function u(Q) {
      var d = [],
        l,
        D,
        x,
        R = 0;
      for (l = 0; 9 > l; l++) {
        for (D = x = 0; D < d.length; D++) d[D] == O[z[Q][l]] && (x = 1);
        0 == x && ((d[d.length] = O[z[Q][l]]), 0 == O[z[Q][l]] && (R = 1));
      }
      return 5 == d.length && 1 == R;
    }
    function I(Q, d) {
      for (var l = 0; l < d; l++) {
        var D = O[z[Q][0]];
        O[z[Q][0]] = O[z[Q][6]];
        O[z[Q][6]] = O[z[Q][4]];
        O[z[Q][4]] = O[z[Q][2]];
        O[z[Q][2]] = D;
        D = O[z[Q][7]];
        O[z[Q][7]] = O[z[Q][5]];
        O[z[Q][5]] = O[z[Q][3]];
        O[z[Q][3]] = O[z[Q][1]];
        O[z[Q][1]] = D;
      }
    }
    var z = [
        [0, 1, 2, 5, 8, 7, 6, 3, 4],
        [6, 7, 8, 13, 20, 19, 18, 11, 12],
        [0, 3, 6, 11, 18, 17, 16, 9, 10],
        [8, 5, 2, 15, 22, 21, 20, 13, 14],
      ],
      O = [
        1, 1, 2, 3, 3, 2, 4, 4, 0, 5, 6, 7, 8, 9, 10, 10, 5, 6, 7, 8, 9, 11, 11,
      ];
    w = "";
    for (var J = [], P, W, X, V; J.length < v; ) {
      P = [1, 1, 1, 1];
      for (W = 0; 4 > W; W++) 1 != P[W] || u(W) || (P[W] = 0);
      for (W = 0; 0 == W; )
        (X = b(4)), 1 == P[X] && ((V = b(3) + 1), I(X, V), (W = 1));
      J[J.length] = [X, V];
      2 <= J.length &&
        J.at(-1)[0] == J.at(-2)[0] &&
        ((J.at(-2)[1] = (J.at(-2)[1] + J.at(-1)[1]) % 4),
        (J = J.slice(0, J.length - 1)));
      1 <= J.length && 0 == J.at(-1)[1] && (J = J.slice(0, J.length - 1));
    }
    for (X = 0; X < v; X++) w += "UFLR"[J[X][0]] + r[J[X][1] - 1] + " ";
    return w;
  });
  scrMgr.reg(
    "15p 15pm 15pat clkwca clkwcab clknf clk clkc clke giga mgmo mgmp mgmc klmp heli helicv heli2x2 heli2x2g redi redim pyrm prcp mpyr r3 r3ni sq1h sq1t sq2 ssq1t bsq ctico -1 333noob lol".split(
      " "
    ),
    function (w, v) {
      var u = "";
      switch (w) {
        case "15p":
          return c(!1, v);
        case "15pm":
          return c(!0, v);
        case "15pat":
          return c(!1, v, !0, !0);
        case "clkwca":
        case "clkwcab":
        case "clknf":
          v = "0+ 1+ 2+ 3+ 4+ 5+ 6+ 1- 2- 3- 4- 5-".split(" ");
          u =
            "clknf" == w
              ? "UR? DR? DL? UL? U(?,?) R(?,?) D(?,?) L(?,?) ALL? all?????"
              : "UR? DR? DL? UL? U? R? D? L? ALL? y2 U? R? D? L? ALL?????";
          for (var I = 0; 14 > I; I++) u = u.replace("?", N(v));
          "clkwca" == w && (u = u.slice(0, -4));
          return u
            .replace("?", N(["", " UR"]))
            .replace("?", N(["", " DR"]))
            .replace("?", N(["", " DL"]))
            .replace("?", N(["", " UL"]));
        case "clk":
          return (
            "UU" +
            n("u") +
            "dU" +
            n("u") +
            "dd" +
            n("u") +
            "Ud" +
            n("u") +
            "dU" +
            n("u") +
            "Ud" +
            n("u") +
            "UU" +
            n("u") +
            "UU" +
            n("u") +
            "UU" +
            n("u") +
            "dd     " +
            C() +
            "\\ndd" +
            n("d") +
            "dU" +
            n("d") +
            "UU" +
            n("d") +
            "Ud" +
            n("d") +
            "UU     UU     Ud     dU     UU     dd" +
            n("d") +
            C()
          );
        case "clkc":
          u = "";
          for (I = 0; 4 > I; I++)
            u += "(" + (b(12) - 5) + ", " + (b(12) - 5) + ") / ";
          for (I = 0; 6 > I; I++) u += "(" + (b(12) - 5) + ") / ";
          for (I = 0; 4 > I; I++) u += N(["d", "U"]);
          return u;
        case "clke":
          return (
            "UU" +
            n("u") +
            "dU" +
            n("u") +
            "dU" +
            n("u") +
            "UU" +
            n("u") +
            "UU" +
            n("u") +
            "UU" +
            n("u") +
            "Ud" +
            n("u") +
            "Ud" +
            n("u") +
            "dd" +
            n("u") +
            "dd     " +
            C() +
            "\\nUU     UU     dU" +
            n("d") +
            "dU     dd" +
            n("d") +
            "Ud     Ud" +
            n("d") +
            "UU     UU" +
            n("d") +
            "dd" +
            n("d") +
            C()
          );
        case "giga":
          return f(v);
        case "mgmo":
          return E(
            "F B U D L DBR DL BR DR BL R DBL".split(" "),
            [
              1364, 2728, 1681, 2402, 2629, 1418, 2329, 1574, 1129, 2198, 421,
              602,
            ],
            v,
            H
          );
        case "mgmp":
          return k(10, Math.ceil(v / 10));
        case "mgmc":
          return g(10, Math.ceil(v / 10));
        case "klmp":
          return k(10, Math.ceil(v / 10));
        case "heli":
        case "helicv":
          return E(
            "UF UR UB UL FR BR BL FL DF DR DB DL".split(" "),
            [154, 53, 106, 197, 771, 1542, 3084, 2313, 2704, 1328, 2656, 1472],
            v
          );
        case "heli2x2":
          u = E(
            "UR UF UL UB DR DF DL DB FR FL BL BR UFR UFL UBL UBR DFR DFL DBL DBR U R F".split(
              " "
            ),
            [
              40931328, 24129536, 55599104, 53526528, 48824320, 31653888,
              63307776, 61603840, 15798272, 30547968, 60047360, 45645824,
              7340291, 22020614, 51381260, 36702217, 14680368, 29360736,
              58721472, 44042384, 56688399, 47815099, 28521335, 57610224,
              47605486, 29150429,
            ],
            v,
            null,
            [
              1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3,
              3,
            ]
          ).split(" ");
          for (I = 0; I < u.length; I++)
            3 == u[I].length
              ? (u[I] += mathlib.rndEl(["", "'"]))
              : 1 == u[I].length && (u[I] += mathlib.rndEl(["", "'", "2"]));
          return u.join(" ");
        case "heli2x2g":
          w = -1;
          u = [];
          var z = "UFR UFL UBL UBR DFR DFL DBL DBR".split(" "),
            O = "UF UL UB UR FR FL BL BR DF DL DB DR".split(" "),
            J = 0;
          for (I = 0; I < v; I++) {
            do var P = mathlib.rndPerm(3);
            while (P[0] == w);
            w = P[2];
            for (
              var W = mathlib.rndPerm(8).slice(0, 4).sort(),
                X = mathlib
                  .rndPerm(12)
                  .slice(0, mathlib.rn(2) + 6)
                  .sort(function (d, l) {
                    return d - l;
                  }),
                V = [],
                Q = 0;
              3 > Q;
              Q++
            )
              V.push("URF".charAt(P[Q]) + mathlib.rndEl([" ", "2", "'"]));
            V.push("");
            for (Q = 0; Q < W.length; Q++)
              V.push(z[W[Q]] + mathlib.rndEl([" ", "'"]));
            V.push("");
            for (Q = 0; Q < X.length; Q++) V.push(O[X[Q]]);
            u[I] = V.join(" ");
            J = Math.max(J, u[I].length);
          }
          for (I = 0; I < u.length; I++) u[I] = u[I].padEnd(J, "~");
          return u.join("\\n");
        case "redi":
          return E(
            "LRFBlrfb".split(""),
            [28, 44, 67, 131, 193, 194, 52, 56],
            v,
            ["", "'"]
          );
        case "redim":
          return q(v);
        case "pyrm":
          return (
            (u = t([["U"], ["L"], ["R"], ["B"]], ["!", "'"], v)),
            m(u, 3).replace(/!/g, "")
          );
        case "prcp":
          return k(10, Math.ceil(v / 10));
        case "mpyr":
          return (
            (u = E(
              "U! L! R! B! Uw Lw Rw Bw".split(" "),
              [224, 208, 176, 112, 238, 221, 187, 119],
              v,
              ["!", "'"]
            )),
            m(u, 4).replace(/!/g, "")
          );
        case "r3":
          for (I = 0; I < v; I++)
            u += (0 == I ? "" : "\\n") + (I + 1) + ") ${333}";
          return scrMgr.formatScramble(u);
        case "r3ni":
          for (I = 0; I < v; I++)
            u += (0 == I ? "" : "\\n") + (I + 1) + ") ${333ni}";
          return scrMgr.formatScramble(u);
        case "sq1h":
          return a(1, v);
        case "sq1t":
          return a(0, v);
        case "sq2":
          for (I = 0; I < v; )
            if (((w = b(12) - 5), (z = b(12) - 5), 0 != w || 0 != z))
              I++, (u += "(" + w + "," + z + ")/ ");
          return u;
        case "ssq1t":
          return e(v);
        case "bsq":
          return a(2, v);
        case "ctico":
          return E(
            "UL UR UrUl FlFr LBl RBr".split(" "),
            [63, 63, 63, 63, 63, 63],
            v,
            H
          );
        case "-1":
          for (I = 0; I < v; I++) u += String.fromCharCode(32 + b(224));
          return u + "Error: subscript out of range";
        case "333noob":
          return (
            (u = t(SCRAMBLE_NOOBST, SCRAMBLE_NOOBSS.split("|"), v).replace(
              /t/,
              "T"
            )),
            u.substr(0, u.length - 2) + "."
          );
        case "lol":
          return (u = t([["L"], ["O"]], 0, v)), u.replace(/ /g, "");
      }
      console.log("Error");
    }
  );
})(mathlib.rn, mathlib.rndEl, scrMgr.mega);
var storage = execMain(function () {
  function b(g) {
    g = "" + g;
    return String.fromCharCode(47 + g.length) + g;
  }
  function N(g, f) {
    return "session_" + b(g) + (void 0 == f ? "" : "_" + b(f));
  }
  function t(g) {
    console.log("IndexedDB Error", g || "undefined");
  }
  function E(g, f, a, e) {
    (e = e || c)
      ? ((e = e.transaction(["sessions"], g)),
        (e.oncomplete = a || $.noop),
        (e.onerror = t),
        (e = e.objectStore("sessions")),
        f(e))
      : requestAnimFrame(function () {
          E(g, f, a);
        });
  }
  function n(g, f) {
    return new Promise(function (a, e) {
      if (C)
        E(
          "readwrite",
          function (h) {
            h.clear();
            for (var p = 1; p <= ~~kernel.getProp("sessionN"); p++)
              for (
                var q = mathlib.str2obj(g["session" + p] || []), m = 0;
                m < (Math.ceil(q.length / 100) || 1);
                m++
              )
                h.put(q.slice(100 * m, 100 * (m + 1)), N(p, m));
          },
          a,
          f
        );
      else {
        for (e = 1; e <= ~~kernel.getProp("sessionN"); e++)
          localStorage["session" + e] = mathlib.obj2str(g["session" + e]);
        a();
      }
    });
  }
  var C =
      window.indexedDB ||
      window.webkitIndexedDB ||
      window.mozIndexedDB ||
      window.OIndexedDB ||
      window.msIndexedDB,
    c,
    k = /^session_\d(\d+)_\d(\d+)$/;
  C &&
    $(function () {
      var g = C.open("cstimer", 1);
      g.onerror = t;
      g.onupgradeneeded = function (f) {
        DEBUG && console.log("Update Data From LocalStorage");
        var a = f.target.result;
        a.createObjectStore("sessions").transaction.oncomplete = function (e) {
          n(localStorage, a);
        };
      };
      g.onsuccess = function (f) {
        DEBUG && console.log("Success opening DB");
        c = f.target.result;
      };
    });
  return {
    set: function (g, f, a) {
      return new Promise(function (e, h) {
        C
          ? E(
              "readwrite",
              function (p) {
                var q = ~~(a / 100),
                  m = IDBKeyRange.bound(N(g, q), N(g + 1), !1, !0);
                for (p["delete"](m); q < (Math.ceil(f.length / 100) || 1); q++)
                  p.put(f.slice(100 * q, 100 * (q + 1)), N(g, q));
              },
              function () {
                e(f);
              }
            )
          : ((localStorage["session" + g] = JSON.stringify(f)), e(f));
      });
    },
    get: function (g, f, a) {
      return new Promise(function (e, h) {
        var p = [];
        if (C)
          E(
            "readonly",
            function (q) {
              var m = IDBKeyRange.bound(N(g), N(g + 1), !1, !0);
              q.openCursor(m).onsuccess = function (r) {
                if ((r = r.target.result))
                  Array.prototype.push.apply(p, r.value), r["continue"]();
              };
            },
            function () {
              f = f || 0;
              a = a || p.length;
              if (0 != f || a != p.length) p = p.slice(f, a);
              e(p);
            }
          );
        else {
          h = localStorage["session" + g];
          void 0 != h && "" != h && (p = JSON.parse(h));
          if (0 != f || a != p.length) p = p.slice(f, a);
          e(p);
        }
      });
    },
    del: function (g, f, a) {
      C
        ? E(
            "readwrite",
            function (e) {
              e["delete"](IDBKeyRange.bound(N(g), N(g + 1), !1, !0));
              var h = IDBKeyRange.bound(N(f), N(f + 1), !1, !0);
              e.openCursor(h).onsuccess = function (p) {
                if ((p = p.target.result)) {
                  var q = k.exec(p.key);
                  q && (e.put(p.value, N(g, ~~q[2])), e["delete"](p.key));
                  p["continue"]();
                }
              };
            },
            a
          )
        : ((localStorage["session" + g] = localStorage["session" + f]),
          delete localStorage["session" + f],
          a && requestAnimFrame(a));
    },
    setKey: function (g, f) {
      return new Promise(function (a, e) {
        C
          ? E(
              "readwrite",
              function (h) {
                h.put(f, g);
              },
              function () {
                a(!0);
              }
            )
          : ((localStorage[g] = f), a(!0));
      });
    },
    getKey: function (g) {
      return new Promise(function (f, a) {
        var e;
        C
          ? E(
              "readonly",
              function (h) {
                h.get(g).onsuccess = function (p) {
                  e = p.target.result;
                };
              },
              function () {
                f(e);
              }
            )
          : f(localStorage[g]);
      });
    },
    importAll: n,
    exportAll: function () {
      return new Promise(function (g, f) {
        var a = {};
        if (C)
          E(
            "readonly",
            function (e) {
              e.openCursor().onsuccess = function (h) {
                if ((h = h.target.result)) {
                  var p = k.exec(h.key);
                  p &&
                    ((p = ~~p[1]),
                    (a["session" + p] = a["session" + p] || []),
                    Array.prototype.push.apply(a["session" + p], h.value));
                  h["continue"]();
                }
              };
            },
            function () {
              g(a);
            }
          );
        else {
          for (f = 1; f <= ~~kernel.getProp("sessionN"); f++)
            void 0 != localStorage["session" + f] &&
              (a["session" + f] = mathlib.str2obj(localStorage["session" + f]));
          g(a);
        }
      });
    },
  };
});
var TimeStat = execMain(function () {
  function b(E, n, C, c) {
    this.avgSizes = E.slice();
    this.timeAt = C;
    this.timeSort = c || b.dnfsort;
    this.reset(n);
  }
  function N(E, n) {
    return "p" == n[0]
      ? Math.ceil((E / 100) * n.slice(1))
      : "m" == n
      ? Math.max(0, E >> 1)
      : ~~n;
  }
  function t(E) {
    var n = kernel.getProp("trim", "p5"),
      C = kernel.getProp("trimr", "a"),
      c = N(E, n);
    n = N(E, "a" == C ? n : C);
    return c + n == E ? [Math.max(c - 1, 0), Math.max(n - 1, 0)] : [c, n];
  }
  b.dnfsort = function (E, n) {
    return E == n ? 0 : 0 > E ? 1 : 0 > n ? -1 : E - n;
  };
  b.prototype.reset = function (E) {
    this.timesLen = E;
    this.shouldRecalc = !0;
  };
  b.prototype.getAllStats = function () {
    this.genStats();
    var E = this.timesLen - this.tree.rankOf(-1);
    return [
      E,
      E == this.timesLen ? -1 : this.tree.avgstd(0, this.timesLen - E)[0],
    ];
  };
  b.prototype.genStats = function () {
    if (this.shouldRecalc) {
      this._bestAvg = [];
      this._bestAvg[this.avgSizes.length] = [];
      this.lastAvg = [];
      this.treesAvg = [];
      this.tree = sbtree.tree(this.timeSort);
      this.bestTime = this.worstTime = -1;
      this.bestTimeIndex = this.worstTimeIndex = 0;
      var E = this.timesLen;
      this.timesLen = 0;
      this.toLength(E);
      this.shouldRecalc = !1;
    }
  };
  b.prototype.pushed = function (E) {
    this.genStats();
    this.doPushed(E);
  };
  b.prototype.bestAvg = function (E, n) {
    E = (this._bestAvg[E] || []).at(-1) || [-1, 0, -1, -1, 0];
    return void 0 !== n ? E[n] : E;
  };
  b.prototype.isBestAvg = function (E, n) {
    if (!this._bestAvg) return !1;
    E = this._bestAvg[E] || [];
    for (var C = 0, c = E.length - 1; C <= c; ) {
      var k = (C + c) >> 1,
        g = E[k][4];
      if (g > n) c = k - 1;
      else if (g < n) C = k + 1;
      else return !0;
    }
    return !1;
  };
  b.prototype.doPushed = function (E, n) {
    var C = [];
    this.timesLen++;
    var c = this.timesLen - 1,
      k = this.timeAt(c);
    this.tree.insert(k, c);
    if (!n) {
      var g = this.bestTime;
      this.bestTime = 0 == this.timesLen ? -1 : this.tree.rank(0);
      this.bestTimeIndex = this.tree.find(this.bestTime);
      this.worstTime =
        0 == this.timesLen
          ? -1
          : this.tree.rank(Math.max(0, this.tree.rankOf(-1) - 1));
      this.worstTimeIndex = this.tree.find(this.worstTime);
      0 > this.timeSort(k, g) && -1 != g && C.push("single");
    }
    0 > this.timeSort(k, this.bestAvg(this.avgSizes.length, 0)) &&
      this._bestAvg[this.avgSizes.length].push([k, 0, k, k, c]);
    for (g = 0; g < this.avgSizes.length; g++) {
      var f = Math.abs(this.avgSizes[g]);
      if (!(this.timesLen < f - 1)) {
        var a = this.treesAvg[g] || sbtree.tree(this.timeSort);
        if (this.timesLen == f - 1)
          for (var e = 0; e < f - 1; e++) a.insert(this.timeAt(e), e);
        else {
          this.timesLen == f
            ? ((this._bestAvg[g] = []), a.insert(k, c))
            : a.remove(this.timeAt(c - f)).insert(k, c);
          e = 0 > this.avgSizes[g] ? [0, 0] : t(f);
          var h = a.avgstd(e[0], f - e[1]);
          e = [
            a.rankOf(-1) < f - e[1] ? -1 : h[0],
            h[1] / 1e3,
            a.rank(e[0] - 1),
            a.rank(f - e[1]),
          ];
          0 > this.timeSort(e[0], this.bestAvg(g, 0)) &&
            (0 <= this.bestAvg(g, 0) &&
              !n &&
              C.push((0 < this.avgSizes[g] ? "ao" : "mo") + f),
            this._bestAvg[g].push(e.concat([c - f + 1])));
          this.lastAvg[g] = e;
        }
        this.treesAvg[g] = a;
      }
    }
    0 == C.length ||
      E ||
      logohint.push(LGHINT_SSBEST.replace("%s", C.join(" ")));
  };
  b.prototype.toLength = function (E) {
    for (; this.timesLen > E; ) this.toPop(this.timesLen - 1 != E);
    for (; this.timesLen < E; ) this.doPushed(!0, this.timesLen + 1 != E);
  };
  b.prototype.toPop = function (E) {
    var n = this.timesLen - 1,
      C = this.timeAt(n);
    this.tree.remove(C);
    E ||
      ((this.bestTime = 0 == this.timesLen ? -1 : this.tree.rank(0)),
      (this.bestTimeIndex = this.tree.find(this.bestTime)),
      (this.worstTime =
        0 == this.timesLen
          ? -1
          : this.tree.rank(Math.max(0, this.tree.rankOf(-1) - 1))),
      (this.worstTimeIndex = this.tree.find(this.worstTime)));
    for (var c = 0; c < this.avgSizes.length; c++) {
      var k = Math.abs(this.avgSizes[c]),
        g = this.treesAvg[c];
      if (!(this.timesLen < k - 1))
        if (this.timesLen == k - 1) this.treesAvg[c] = null;
        else if (this.timesLen == k)
          (this.lastAvg[c] = null), (this._bestAvg[c] = null), g.remove(C);
        else {
          g.remove(C).insert(this.timeAt(n - k), n - k);
          if (!E) {
            var f = 0 > this.avgSizes[c] ? [0, 0] : t(k),
              a = g.avgstd(f[0], k - f[1]);
            g = [
              g.rankOf(-1) < k - f[1] ? -1 : a[0],
              a[1] / 1e3,
              g.rank(f[0] - 1),
              g.rank(k - f[1]),
            ];
            this.lastAvg[c] = g;
          }
          this.bestAvg(c, 4) == n - k + 1 && this._bestAvg[c].pop();
        }
    }
    this.bestAvg(this.avgSizes.length, 4) == n &&
      this._bestAvg[this.avgSizes.length].pop();
    this.timesLen--;
  };
  b.prototype.getThres = function () {
    for (var E = [], n = 0; n < this.avgSizes.length; n++) {
      var C = Math.abs(this.avgSizes[n]);
      if (!(this.timesLen < C)) {
        var c = 0 > this.avgSizes[n] ? [0, 0] : t(C),
          k = C - c[0] - c[1],
          g = this.treesAvg[n] || sbtree.tree(this.timeSort),
          f = this.timeAt(this.timesLen - C),
          a = c[0];
        c = C - c[1] - 1;
        0 > this.timeSort(f, g.rank(a))
          ? ((a += 1), (f = 0))
          : 0 > this.timeSort(g.rank(c), f) && (--c, (f = 0));
        var e = this.bestAvg(n, 0);
        g.rankOf(-1) < c
          ? (E[n] = -1)
          : -1 == e
          ? (E[n] = -2)
          : ((k = e * k - (g.sum(a, c + 1) - f)),
            (a = 0 == a ? 0 : g.rank(a - 1)),
            (C = c == C - 1 ? -1 : g.rank(c + 1)),
            0 >= k || 0 > this.timeSort(k, a)
              ? (E[n] = -1)
              : 0 > this.timeSort(C, k)
              ? (E[n] = -2)
              : (E[n] = k));
      }
    }
    return E;
  };
  b.prototype.getBWPA = function () {
    for (var E = [], n = [], C, c = 0; c < this.avgSizes.length; c++) {
      var k = Math.abs(this.avgSizes[c]);
      if (!(this.timesLen < k - 1)) {
        var g = 0 > this.avgSizes[c] ? [0, 0] : t(k),
          f = this.treesAvg[c] || sbtree.tree(this.timeSort);
        this.timesLen != k - 1 &&
          ((C = this.timeAt(this.timesLen - k)), f.remove(C));
        f.insert(0, 0);
        E[c] = f.rankOf(-1) < k - g[1] ? -1 : f.avgstd(g[0], k - g[1])[0];
        f.remove(0).insert(-1, 0);
        n[c] = f.rankOf(-1) < k - g[1] ? -1 : f.avgstd(g[0], k - g[1])[0];
        f.remove(-1);
        this.timesLen != k - 1 && f.insert(C, this.timesLen - k);
      }
    }
    return [E, n];
  };
  b.prototype.getMinMaxInt = function () {
    return this.getAllStats()[0] == this.timesLen
      ? null
      : [
          this.worstTime,
          this.bestTime,
          this.getBestDiff(this.worstTime - this.bestTime),
        ];
  };
  b.prototype.getBestDiff = function (E) {
    var n = [100, 200, 500, 1e3, 2e3, 5e3, 1e4, 2e4, 5e4, 1e5];
    if ("a" == kernel.getProp("disPrec")) {
      E /= 10;
      for (var C = 0; C < n.length; C++)
        if (E < n[C]) {
          E = n[C];
          break;
        }
    } else E = n[kernel.getProp("disPrec")];
    return E;
  };
  b.prototype.runAvgMean = function (E, n, C, c) {
    C = C || n;
    if (!(0 > E || E + n > this.timesLen)) {
      c = 0 == c ? [0, 0] : t(C);
      if (0 >= C - c[0] - c[1]) return [-1, 0, -1, -1];
      for (var k = sbtree.tree(this.timeSort), g = 0; g < C; g++)
        k.insert(this.timeAt(E + g), g);
      for (
        var f = k.avgstd(c[0], C - c[1]),
          a = [
            [
              k.rankOf(-1) < C - c[1] ? -1 : f[0],
              f[1] / 1e3,
              k.rank(c[0] - 1),
              k.rank(C - c[1]),
            ],
          ],
          e = E - C,
          h = C;
        h < n;
        h++
      )
        k.remove(this.timeAt(e + h)).insert(this.timeAt(E + h), g),
          (f = k.avgstd(c[0], C - c[1])),
          a.push([
            k.rankOf(-1) < C - c[1] ? -1 : f[0],
            f[1] / 1e3,
            k.rank(c[0] - 1),
            k.rank(C - c[1]),
          ]);
      return a;
    }
  };
  b.prototype.getTrimList = function (E, n, C, c) {
    var k = [],
      g = [],
      f = t(n);
    C = -2 > C ? 0 : C;
    for (var a = 0; a < n; a++) {
      var e = this.timeAt(E + a),
        h = this.timeSort(e, C);
      e = this.timeSort(c, e);
      0 > h
        ? k.push(a)
        : 0 > e
        ? g.push(a)
        : 0 == h && k.length < f[0]
        ? k.unshift(a)
        : 0 == e && g.length < f[1] && g.unshift(a);
    }
    return k.slice(k.length - f[0]).concat(g.slice(g.length - f[1]));
  };
  return b;
});
var stats = execMain(
  function (b, N, t) {
    function E(ia) {
      if ("string" == typeof ia[0]) {
        var oa = [
          ia[2],
          ia[1] || ka,
          ia[0],
          ia[3] || Math.round((new Date().getTime() - ia[2][1]) / 1e3),
        ];
        ia[4] && oa.push(ia[4]);
        x.push(oa);
        ia = ia[2];
      } else
        x.push([ia, ka, "", Math.round((new Date().getTime() - ia[1]) / 1e3)]);
      Ea.push(null);
      U.pushed();
      ba.pushed();
      la.save(x.length - 1);
      ia.length - 1 > Ba ? ra.updateTable(!1) : ra.appendRow(x.length - 1);
      p(["push"]);
      kernel.pushSignal("timestd", x.at(-1));
    }
    function n(ia, oa) {
      ia < 0.7 * x.length
        ? (oa(), U.reset(x.length), ba.reset(x.length))
        : (U.toLength(ia),
          ba.toLength(ia),
          oa(),
          U.toLength(x.length),
          ba.toLength(x.length));
    }
    function C(ia) {
      if (kernel.getProp("delmul")) {
        var oa = $.prompt(STATS_CFM_DELMUL, 1);
        if (null == oa || !/^\d+$/.exec(oa) || 0 == ~~oa) return;
        oa = ~~oa;
      } else {
        if (!$.confirm(STATS_CFM_DELETE)) return;
        oa = 1;
      }
      n(ia, function () {
        x.splice(ia, oa);
        Ea.splice(ia, oa);
      });
      la.save(ia);
      ra.updateTable(!1);
      p(["delete", ia, oa]);
      return !0;
    }
    function c(ia, oa) {
      switch (ia[0]) {
        case 0:
          return b(ia[1]);
        case -1:
          return "DNF" + (oa ? "(" + b(ia[1]) + ")" : "");
        default:
          return b(ia[0] + ia[1]) + "+";
      }
    }
    function k(ia) {
      if (2 == ia.length) return "";
      var oa = [];
      oa.push(b(ia.at(-1)));
      for (var ma = ia.length - 2; 1 <= ma; ma--)
        oa.push(b(ia[ma] - ia[ma + 1]));
      return "=" + oa.join("+");
    }
    function g(ia) {
      ia = ~~$(ia.target).attr("data");
      var oa = U;
      0 != ia && (oa = new TimeStat(na, x.length, A.bind(void 0, ia)));
      I(oa, w, 0 == ia ? 0 : STATS_CURSPLIT.replace("%d", ia));
    }
    function f(ia, oa, ma) {
      var za = x[ia],
        T = za[0];
      ba.genStats();
      var aa = ba.isBestAvg(2, ia),
        ja = ba.isBestAvg(0, ia - Ha + 1),
        pa = ba.isBestAvg(1, ia - Ma + 1),
        qa = [];
      qa.push('<td class="times">' + (za[2] && "*") + (ia + 1) + "</td>");
      qa.push(
        (aa ? '<td class="times pb">' : '<td class="times">') +
          c(T, !1) +
          "</td>"
      );
      var ua = kernel.getProp("statsrc", "t");
      za = U.prettyFunc || [b, t];
      "t" != ua[0] &&
        (qa.pop(),
        qa.push(
          (aa ? '<td class="times pb">' : '<td class="times">') +
            '<span style="opacity:0.5">' +
            c(T, !1) +
            "</span> " +
            za[0](U.timeAt(ia)).split(" ")[0] +
            "</td>"
        ));
      aa = U.runAvgMean(ia - Ha + 1, Ha, 0, 0 < Aa ? void 0 : 0);
      ua = U.runAvgMean(ia - Ma + 1, Ma, 0, 0 < Da ? void 0 : 0);
      qa.push(
        (aa
          ? (ja ? '<td class="times pb">' : '<td class="times">') +
            za[1](aa[0][0])
          : "<td>-") +
          "</td>" +
          (ua
            ? (pa ? '<td class="times pb">' : '<td class="times">') +
              za[1](ua[0][0])
            : "<td>-") +
          "</td>"
      );
      if (1 < oa) {
        qa.push("<td>" + b(T.at(-1)) + "</td>");
        for (ja = T.length - 2; 1 <= ja; ja--)
          qa.push("<td>" + b(T[ja] - T[ja + 1]) + "</td>");
        for (ja = T.length - 1; ja < oa; ja++) qa.push("<td>-</td>");
      }
      qa = qa.join("");
      ma && ma.html(qa);
      return '<tr data="' + ia + '">' + qa + "</tr>";
    }
    function a(ia) {
      S.empty().unbind("click").click(g);
      var oa = x.length,
        ma = U.getAllStats(),
        za = U.prettyFunc || [b, t],
        T = oa == ma[0] ? 0 : (oa - ma[0]) * ma[1];
      S.append(
        '<th colspan="4" data="0" class="times">' +
          STATS_SOLVE +
          ": " +
          (oa - ma[0]) +
          "/" +
          oa +
          "<br>" +
          STATS_AVG +
          ": " +
          za[1](ma[1]) +
          (kernel.getProp("statssum")
            ? "<br>" + STATS_SUM + ": " + za[0](T)
            : "") +
          "</th>"
      ).css("font-size", "1.2em");
      if (1 < ia)
        for (oa = 1; oa <= ia; oa++) {
          ma = S;
          za = ma.append;
          T = '<th data="' + oa + '" class="times">';
          var aa = oa;
          for (var ja = 0, pa = 0, qa = 0; qa < x.length; qa++) {
            var ua = x[qa][0];
            -1 == ua[0] || ua.length <= aa ? (pa += 1) : (ja += A(aa, qa));
          }
          aa = pa == x.length ? -1 : ja / (x.length - pa);
          za.call(ma, T + t(aa) + "</th>").css("font-size", "");
        }
    }
    function e(ia) {
      ia || (ia = $('<select style="max-width:4em;">'));
      ia.unbind("change").change(function (aa) {
        kernel.setProp("statsrc", $(aa.target).val());
      });
      var oa = kernel.getProp("statsrc", "t"),
        ma = [["t", STATS_TIME]];
      if (1 != Ba)
        for (var za = 0; za < Ba; za++)
          ma.push(["p" + (za + 1), "P." + (za + 1)]);
      za = d();
      for (var T in za) ma.push(["m" + T, za[T][0]]);
      T = !1;
      for (za = 0; za < ma.length; za++)
        ia.append($("<option>").val(ma[za][0]).html(ma[za][1])),
          ma[za][0] == oa && (T = !0);
      ia.val(oa);
      T || kernel.setProp("statsrc", "t");
      return 1 == ma.length ? STATS_TIME : ia;
    }
    function h() {
      if (!va) {
        if (kernel.getProp("statsum")) {
          ea.css("display", "inline-block");
          U.getAllStats();
          var ia = e(),
            oa = U.prettyFunc || [b, t],
            ma = [];
          0 < x.length
            ? (ma.push(
                '<td class="times click" data="cs">' +
                  oa[0](U.timeAt(x.length - 1)) +
                  "</td>"
              ),
              ma.push(
                '<td class="times click" data="bs">' +
                  oa[0](U.bestTime) +
                  "</td>"
              ))
            : ma.push("<td>-</td><td>-</td>");
          for (
            var za = [],
              T = kernel.getProp("statthres", !1),
              aa = kernel.getProp("statbpa", !1),
              ja = kernel.getProp("statwpa", !1),
              pa = T ? U.getThres() : null,
              qa = aa || ja ? U.getBWPA() : null,
              ua = 0;
            ua < na.length;
            ua++
          ) {
            var Ja = Math.abs(na[ua]),
              La = "<tr><th>" + "am"[na[ua] >>> 31] + "o" + Ja + "</th>";
            if (x.length >= Ja)
              za.push(La),
                za.push(
                  '<td class="times click" data="c' +
                    "am"[na[ua] >>> 31] +
                    ua +
                    '">' +
                    oa[1](U.lastAvg[ua][0]) +
                    "</td>"
                ),
                za.push(
                  '<td class="times click" data="b' +
                    "am"[na[ua] >>> 31] +
                    ua +
                    '">' +
                    oa[1](U.bestAvg(ua, 0)) +
                    "</td>"
                ),
                T &&
                  za.push(
                    '<td class="times">' +
                      (0 > pa[ua] ? ["N/A", "∞"][-1 - pa[ua]] : oa[0](pa[ua])) +
                      "</td>"
                  );
            else if (x.length == Ja - 1 && (aa || ja))
              za.push(La),
                za.push("<td>-</td><td>-</td>"),
                T && za.push("<td>-</td>");
            else continue;
            aa && za.push('<td class="times">' + oa[1](qa[0][ua]) + "</td>");
            ja &&
              za.push(
                0 > na[ua]
                  ? "<td>-</td>"
                  : '<td class="times">' + oa[1](qa[1][ua]) + "</td>"
              );
            za.push("</tr>");
          }
          oa = $("<tr>").append(
            "<th></th><th>" + sa[1] + "</th><th>" + sa[0] + "</th>"
          );
          T && (oa.append("<th>" + sa[13] + "</th>"), ma.push("<td>-</td>"));
          aa && (oa.append("<th>BPA</th>"), ma.push("<td>-</td>"));
          ja && (oa.append("<th>WPA</th>"), ma.push("<td>-</td>"));
          fa.empty().append(
            oa,
            $("<tr>").append(
              $('<th style="padding:0">').append(ia),
              ma.join("")
            ),
            za.join("")
          );
        } else fa.empty(), ea.hide();
        X();
      }
    }
    function p(ia) {
      if (!va) {
        h();
        for (var oa in ha) ha[oa](ia);
        ia = x.length - 1;
        ba.genStats();
        oa = ba.lastAvg[0];
        var ma = ba.lastAvg[1],
          za = ba.getBWPA()[0],
          T = oa ? oa[0] : za[0];
        za = ma ? ma[0] : za[1];
        var aa = !oa && T,
          ja = !ma && za;
        ja = (ja ? "bp" : "") + (0 < Da ? "a" : "m") + (ja ? "" : "o") + Ma;
        kernel.pushSignal("avg", [
          (aa ? "bp" : "") +
            (0 < Aa ? "a" : "m") +
            (aa ? "" : "o") +
            Ha +
            ": " +
            (T ? t(T) : "-"),
          ja + ": " + (za ? t(za) : "-"),
          oa ? [ia - Ha + 1, Ha, 10 * Ha, 0 > Aa] : void 0,
          ma ? [ia - Ma + 1, Ma, 10 * Ma, 0 > Da] : void 0,
          r.bind(void 0, ba, w),
          x[ia],
          0 == ia ? null : x[ia - 1],
        ]);
      }
    }
    function q() {
      var ia = kernel.getProp("statsrc", "t");
      if ("t" != ia) {
        if ("p" == ia[0]) return A.bind(void 0, ~~ia.slice(1));
        if ("m" == ia[0]) return (ia = ia.slice(1)), Q.bind(null, ia);
      }
      return ta;
    }
    function m(ia, oa, ma) {
      if (!oa) return "N/A";
      var za =
        c(oa[0], !0) +
        k(oa[0]) +
        (kernel.getProp("printComm") && oa[2] ? "[" + oa[2] + "]" : "");
      -1 != $.inArray(ia, ma) && (za = "(" + za + ")");
      kernel.getProp("printScr") && (za += "   " + oa[1]);
      kernel.getProp("printDate") && (za += "   @" + mathlib.time2str(oa[3]));
      return kernel.getProp("printScr") || kernel.getProp("printDate")
        ? ia + 1 + ". " + za + " \n"
        : za + ", ";
    }
    function r(ia, oa, ma, za, T, aa) {
      if (0 != ia.timesLen) {
        var ja = [0, [null], [null]],
          pa = [];
        0 != ma + za &&
          (aa
            ? (ja = ia.runAvgMean(ma, za, 0, 0)[0])
            : ((ja = ia.runAvgMean(ma, za)[0]),
              (pa = ia.getTrimList(ma, za, ja[2], ja[3]))));
        var qa = "";
        if (kernel.getProp("printDate") && 2 < za) {
          qa = oa(ma);
          var ua = oa(ma + za - 1);
          qa = sa[11]
            .replace("%s", mathlib.time2str(qa && qa[3]))
            .replace("%e", mathlib.time2str(ua && ua[3]));
          qa = " (" + qa + ")";
        }
        var Ja = [mathlib.time2str(+new Date() / 1e3, sa[3]) + qa + "\n"];
        qa = ia.prettyFunc || [b, t];
        1 < T &&
          (2 == T
            ? Ja.push(sa[8])
            : 10 == T
            ? Ja.push(sa[5])
            : aa
            ? Ja.push(sa[6].replace("%mk", ~~(T / 10)))
            : Ja.push(sa[7].replace("%mk", ~~(T / 10))),
          Ja.push(": " + qa[10 == T ? 0 : 1](ja[0])));
        Ja.push("\n\n" + sa[10] + "\n");
        if (kernel.getProp("absidx"))
          for (T = 0; T < pa.length; T++) pa[T] += ma;
        for (T = 0; T < za; T++)
          Ja.push(m(kernel.getProp("absidx") ? ma + T : T, oa(ma + T), pa));
        Ja = Ja.join("").slice(0, -2);
        G.val(Ja);
        kernel.showDialog(
          [
            G,
            u,
            void 0,
            u,
            [
              STATS_EXPORTCSV,
              function () {
                H(ia, oa, ma, za);
                return !1;
              },
            ],
            [
              COPY_LANG,
              function () {
                $.clipboardCopy(Ja).then(
                  logohint.push.bind(logohint, COPY_LANG)
                );
                return !1;
              },
            ],
          ],
          "stats",
          STATS_CURROUND
        );
        G[0].select();
      }
    }
    function H(ia, oa, ma, za) {
      if (0 != ia.timesLen) {
        window.Blob || $.alert("Do not support your browser!");
        ia = ["No.;Time;Comment;Scramble;Date"];
        for (var T = 0; T < Ba; T++) ia[0] += ";P." + (T + 1);
        for (T = 0; T < za; T++) {
          var aa = oa(ma + T),
            ja = [];
          ja.push(T + 1);
          ja.push(c(aa[0], !0));
          ja.push(aa[2] ? aa[2] : "");
          ja.push(aa[1]);
          ja.push(mathlib.time2str(aa[3]));
          ja.push(b(aa[0].at(-1)));
          for (var pa = aa[0].length - 2; 1 <= pa; pa--)
            ja.push(b(aa[0][pa] - aa[0][pa + 1]));
          for (pa = aa[0].length - 1; pa < Ba; pa++) ja.push("");
          for (pa = 0; pa < ja.length; pa++) {
            aa = ja;
            var qa = pa,
              ua = ja[pa];
            ua = ua.toString();
            if (-1 != ua.indexOf(";") || -1 != ua.indexOf("\n"))
              ua = '"' + ua.replace(/"/g, '""') + '"';
            aa[qa] = ua;
          }
          ia.push(ja.join(";"));
        }
        ia = ia.join("\r\n");
        oa = new Blob([ia], { type: "text/csv" });
        ma = $('<a class="click"/>').appendTo("body");
        ma.attr("href", URL.createObjectURL(oa));
        ma.attr(
          "download",
          "csTimerExport_" +
            mathlib.time2str(new Date() / 1e3, "%Y%M%D_%h%m%s") +
            ".csv"
        );
        ma[0].click();
        ma.remove();
      }
    }
    function y(ia, oa, ma) {
      ma = $(ma.target).attr("data");
      if (void 0 != ma) {
        var za = ~~ma.substr(2);
        switch (ma.substr(0, 2)) {
          case "bs":
            r(ia, oa, ia.bestTimeIndex, 1, 10, !0);
            break;
          case "cs":
            r(ia, oa, ia.timesLen - 1, 1, 10, !0);
            break;
          case "ws":
            r(ia, oa, ia.worstTimeIndex, 1, 10, !0);
            break;
          case "bm":
            r(ia, oa, ia.bestAvg(za, 4), -na[za], 10 * -na[za], !0);
            break;
          case "cm":
            r(ia, oa, ia.timesLen + na[za], -na[za], 10 * -na[za], !0);
            break;
          case "ba":
            r(ia, oa, ia.bestAvg(za, 4), na[za], 10 * na[za], !1);
            break;
          case "ca":
            r(ia, oa, ia.timesLen - na[za], na[za], 10 * na[za], !1);
            break;
          case "tt":
            I(ia, oa);
        }
      }
    }
    function A(ia, oa) {
      oa = (x[oa] || [[-1, 1]])[0];
      return -1 == oa[0] || oa.length <= ia
        ? -1
        : wa *
            ~~(
              (0 == ia
                ? oa[0] + oa[1]
                : oa[oa.length - ia] - (oa[oa.length - ia + 1] || 0)) / wa
            );
    }
    function w(ia) {
      return x[ia];
    }
    function v(ia, oa) {
      for (var ma = [], za = [], T = 0; T < ia.length; T++) ma.push(T);
      ma.sort(function (pa, qa) {
        var ua = ia[pa][3] || 0,
          Ja = ia[qa][3] || 0;
        return ua == Ja ? pa - qa : ua - Ja;
      });
      var aa = -1;
      for (T = 0; T < ia.length; T++) {
        var ja = ia[ma[T]][3] || 0;
        (oa && aa == ja && 0 != ja) || (za.push(ia[ma[T]]), (aa = ja));
      }
      return za;
    }
    function u() {
      G.val("");
    }
    function I(ia, oa, ma) {
      var za = ia.getAllStats(),
        T = za[0],
        aa = ia.runAvgMean(0, x.length)[0];
      za = za[1];
      var ja = ia.timesLen,
        pa = "";
      if (kernel.getProp("printDate") && 2 < ja) {
        var qa = oa(0);
        pa = oa(ja - 1);
        pa = sa[11]
          .replace("%s", mathlib.time2str(qa && qa[3]))
          .replace("%e", mathlib.time2str(pa && pa[3]));
        pa = " (" + pa + ")";
      }
      qa = U.prettyFunc || [b, t];
      var ua = [mathlib.time2str(+new Date() / 1e3, sa[3]) + pa];
      ua.push(sa[4].replace("%d", ja - T + "/" + ja) + "\n");
      ua.push(sa[5]);
      ua.push("    " + sa[0] + ": " + qa[0](ia.bestTime));
      ua.push("    " + sa[2] + ": " + qa[0](ia.worstTime) + "\n");
      for (T = 0; T < na.length; T++)
        (pa = Math.abs(na[T])),
          ja >= pa &&
            (ua.push(sa[7 - (na[T] >>> 31)].replace("%mk", pa)),
            ua.push(
              "    " +
                sa[1] +
                ": " +
                qa[1](ia.lastAvg[T][0]) +
                " (σ = " +
                z(ia.lastAvg[T][1], 2) +
                ")"
            ),
            ua.push(
              "    " +
                sa[0] +
                ": " +
                qa[1](ia.bestAvg(T, 0)) +
                " (σ = " +
                z(ia.bestAvg(T, 1), 2) +
                ")\n"
            ));
      ua.push(
        sa[8]
          .replace("%v", qa[1](aa[0]))
          .replace("%sgm", z(aa[1], 2))
          .replace(/[{}]/g, "")
      );
      ua.push(sa[9].replace("%v", qa[1](za) + "\n"));
      if (0 != ja) {
        ua.push(sa[10]);
        aa = [];
        for (za = 0; za < ja; za++) aa.push(m(za, oa(za), []));
        aa = aa.join("").slice(0, -2);
        ua.push(aa);
      }
      ua = ua.join("\n");
      G.val(ua);
      kernel.showDialog(
        [
          G,
          u,
          void 0,
          u,
          [
            STATS_EXPORTCSV,
            function () {
              H(ia, oa, 0, ja);
              return !1;
            },
          ],
          [
            COPY_LANG,
            function () {
              $.clipboardCopy(ua).then(logohint.push.bind(logohint, COPY_LANG));
              return !1;
            },
          ],
        ],
        "stats",
        ma || STATS_CURSESSION
      );
      G[0].select();
    }
    function z(ia, oa) {
      (ia &&
        ia != Number.POSITIVE_INFINITY &&
        ia != Number.NEGATIVE_INFINITY) ||
        (ia = 0);
      for (ia = "" + Math.round(ia * Math.pow(10, oa)); ia.length < oa + 1; )
        ia = "0" + ia;
      var ma = ia.length;
      return ia.substr(0, ma - oa) + "." + ia.substr(ma - oa, oa);
    }
    function O(ia) {
      ia = ia.split(/[\s,;]+/);
      for (var oa = /([am])o(\d+)/, ma = [], za = 0; za < ia.length; za++) {
        var T = oa.exec(ia[za]);
        if (!T) return !1;
        ma.push(("a" == T[1] ? 1 : -1) * ~~T[2]);
      }
      ma.sort(function (aa, ja) {
        return Math.abs(aa) - Math.abs(ja);
      });
      return ma;
    }
    function J(ia) {
      var oa = kernel.getProp("statalu");
      if (ia || !/^\s*([am]o\d+[\s,;]*)+\s*$/.exec(oa))
        (ia = $.prompt("Statistics Details", oa || "mo3 ao5 ao12 ao100")),
          /^\s*([am]o\d+[\s,;]*)+\s*$/.exec(ia) && O(ia)
            ? kernel.setProp("statalu", ia)
            : (null != ia && $.alert("INVALID VALUES!"),
              kernel.setProp("statal", "mo3 ao5 ao12 ao100"),
              kernel.reprop());
    }
    function P(ia) {
      var oa = O(ia);
      oa
        ? ((na = oa),
          (U = new TimeStat(na, x.length, q())),
          (U.prettyFunc = l()),
          crossSessionStats.updateStatal(na),
          p(["statal", ia]))
        : (kernel.setProp("statal", "mo3 ao5 ao12 ao100"), kernel.reprop());
    }
    function W(ia, oa) {
      if ("time" == ia) E(oa);
      else if ("scramble" == ia || "scrambleX" == ia) ka = oa[1];
      else if ("property" == ia)
        /^(:?useMilli|timeFormat|stat[12][tl]|statinv)$/.exec(oa[0])
          ? ((wa = kernel.getProp("useMilli") ? 1 : 10),
            /^stat[12][tl]$/.exec(oa[0])
              ? ((Aa =
                  [1, -1][~~kernel.getProp("stat1t")] *
                  kernel.getProp("stat1l")),
                (Da =
                  [1, -1][~~kernel.getProp("stat2t")] *
                  kernel.getProp("stat2l")),
                (Ha = Math.abs(Aa)),
                (Ma = Math.abs(Da)),
                (ba = new TimeStat([Aa, Da], x.length, ta)))
              : "useMilli" == oa[0] && (U.reset(x.length), ba.reset(x.length)),
            ra.updateTable(!1),
            p(["property", oa[0]]))
          : /^stat(sum|thres|[bw]pa)$/.exec(oa[0])
          ? h()
          : "statssum" == oa[0]
          ? (a(Ba), X())
          : "statal" == oa[0]
          ? ((ia = oa[1]),
            "u" == ia && J("modify" == oa[2]),
            (ia = kernel.getProp("statal")),
            P("u" == ia ? kernel.getProp("statalu") : ia))
          : "statalu" == oa[0]
          ? P(oa[1])
          : "trim" == oa[0] || "trimr" == oa[0]
          ? (U.reset(x.length),
            ba.reset(x.length),
            crossSessionStats.updateStatal(na),
            ra.updateTable(!1),
            p(["property", oa[0]]))
          : "view" == oa[0]
          ? X()
          : "statHide" == oa[0]
          ? oa[1]
            ? F.hide()
            : F.show()
          : "statsrc" == oa[0]
          ? ((U = new TimeStat(na, x.length, q())),
            (U.prettyFunc = l()),
            ra.updateTable(!0))
          : "wndStat" == oa[0]
          ? X()
          : "sr_statal" == oa[0]
          ? kernel.setProp("sr_statalu", oa[1])
          : "hlpbs" == oa[0] &&
            K.removeClass("f40b linkb normb none").addClass(oa[1]);
      else if ("ctrl" == ia && "stats" == oa[0])
        "clr" == oa[1]
          ? la.getButton().click()
          : "undo" == oa[1]
          ? ya.delLast()
          : "OK" == oa[1]
          ? ya.setCfm(0)
          : "+2" == oa[1]
          ? ya.setCfm(2e3)
          : "DNF" == oa[1]
          ? ya.setCfm(-1)
          : "cfm" == oa[1]
          ? ya.proc(x.length - 1)
          : "cmt" == oa[1] && ya.proc(x.length - 1, "comment");
      else if ("ashow" == ia && !oa) ra.hideAll();
      else if ("button" == ia && "stats" == oa[0] && oa[1]) setTimeout(X, 50);
      else if ("giirecons" == ia) {
        var ma = x.length - 1;
        0 > ma ||
          x[ma][1] != oa[0] ||
          (n(ma, function () {
            x[ma][4] = oa[1];
            Ea[ma] = null;
          }),
          la.save(ma),
          p(["giirecons", ma]));
      }
    }
    function X() {
      $("html").hasClass("m")
        ? L.height(Math.max(ea.height(), S.height() + 2 * M.height()))
        : null != L[0].offsetParent &&
          L.outerHeight(
            ~~(
              R.height() -
              (F.is(":hidden") ? 0 : F.outerHeight()) -
              ea.outerHeight() -
              5
            )
          );
    }
    function V(ia, oa, ma) {
      Ka[ia] = oa;
      ma && (Qa[ia] = [oa, ma]);
    }
    function Q(ia, oa) {
      if (!(oa >= x.length) && ia in Ka)
        return (
          Ea[oa] || (Ea[oa] = {}),
          ia in Ea[oa] || (Ea[oa][ia] = Ka[ia](x[oa], oa)),
          Ea[oa][ia]
        );
    }
    function d() {
      var ia = {},
        oa;
      for (oa in Qa)
        for (var ma = Math.max(x.length - 10, 0); ma < x.length; ma++)
          if (-1 != Q(oa, ma)) {
            ia[oa] = Qa[oa][1];
            break;
          }
      return ia;
    }
    function l(ia) {
      if (!ia) {
        var oa = kernel.getProp("statsrc", "t");
        "m" == oa[0] && (ia = oa.slice(1));
      }
      return Qa[ia] ? ((ia = Qa[ia][1]), [ia[1], ia[2] || ia[1]]) : [b, t];
    }
    function D(ia, oa) {
      var ma = -1;
      (oa[2] || "").replace(/[0-9]+(\.[0-9]+)?/g, function (za) {
        0 == ia && (ma = 1e3 * parseFloat(za));
        ia--;
      });
      return ma;
    }
    var x = [],
      R = $('<div id="stats">'),
      G = $('<textarea rows="10" readonly>'),
      L = $('<div class="myscroll">'),
      F = $("<div>"),
      K = $("<table>")
        .click(function (ia) {
          var oa = $(ia.target);
          if (oa.is("td,td>span") && "-" != oa.html()) {
            oa.is("td>span") && (oa = oa.parent());
            var ma = oa.prevAll();
            ia = ma.length;
            oa = ~~(0 == ia ? oa : ma.eq(-1)).html().replace("*", "") - 1;
            if (!(4 < ia || 0 > ia))
              switch (ia) {
                case 0:
                  if (kernel.getProp("rsfor1s")) {
                    r(U, w, oa, 1, 10, !0);
                    break;
                  }
                case 1:
                  ya.proc(oa);
                  break;
                case 2:
                  r(U, w, oa - Ha + 1, Ha, 10 * Ha, 0 > Aa);
                  break;
                case 3:
                  r(U, w, oa - Ma + 1, Ma, 10 * Ma, 0 > Da);
              }
          }
        })
        .addClass("table"),
      M = $("<tr>"),
      S = $("<tr>"),
      Z = $('<tr class="click" ><th class="click" colspan="15">...</th></tr>'),
      fa = $('<table class="sumtable">')
        .click(function (ia) {
          y(U, w, ia);
        })
        .addClass("table"),
      ea = $('<div class="statc">'),
      va = !0,
      ra = (function () {
        function ia(Ra) {
          if (Na && Na.idx == Ra) Na = null;
          else {
            for (var Ua = [], Za = 0; Za < x.length; Za++) Ua[Za] = Za;
            if (0 == Ra)
              Ua.sort(function (bb, hb) {
                return TimeStat.dnfsort(U.timeAt(bb), U.timeAt(hb));
              });
            else if (1 == Ra || 2 == Ra) {
              var Xa = 1 == Ra ? Ha : Ma,
                db = ba.runAvgMean(
                  0,
                  x.length,
                  Xa,
                  0 < (1 == Ra ? Aa : Da) ? void 0 : 0
                );
              Ua.sort(function (bb, hb) {
                return Math.max(bb, hb) < Xa - 1
                  ? 0
                  : Math.min(bb, hb) < Xa - 1
                  ? bb > hb
                    ? -1
                    : 1
                  : TimeStat.dnfsort(db[bb - Xa + 1][0], db[hb - Xa + 1][0]);
              });
            }
            Na = {};
            for (Za = 0; Za < x.length - 1; Za++) Na[Ua[Za]] = Ua[Za + 1];
            Na[-2] = Ua[0];
            Na[Ua[x.length - 1]] = -1;
            Na.len = x.length;
            Na.idx = Ra;
          }
          ma(!1);
        }
        function oa(Ra) {
          return Na && Ra in Na ? Na[Ra] : -2 == Ra ? x.length - 1 : Ra - 1;
        }
        function ma(Ra) {
          Ba = 1;
          for (var Ua = 0; Ua < x.length; Ua++)
            Ba = Math.max(Ba, x[Ua][0].length - 1);
          Ua = Na ? Na.idx : -1;
          Ja.html(STATS_TIME + (0 == Ua ? "*" : ""));
          La.html((0 < Aa ? "ao" : "mo") + Ha + (1 == Ua ? "*" : ""));
          ab.html((0 < Da ? "ao" : "mo") + Ma + (2 == Ua ? "*" : ""));
          M.empty().append(ua, Ja, La, ab);
          if (1 < Ba)
            for (Ua = 0; Ua < Ba; Ua++) M.append("<th>P." + (Ua + 1) + "</th>");
          Na && Na.len != x.length && T();
          Ta = [];
          gb = oa(-2);
          kernel.getProp("statinv")
            ? K.empty().append(M, Z, S)
            : K.empty().append(S, M, Z);
          aa();
          0 > gb
            ? Z.unbind("click").hide()
            : Z.unbind("click").click(ra.showAll).show();
          ua.unbind("click").click(za);
          Ja.unbind("click").click(ia.bind(null, 0));
          La.unbind("click").click(ia.bind(null, 1));
          ab.unbind("click").click(ia.bind(null, 2));
          a(Ba);
          Ra && p(["table"]);
          L.scrollTop(kernel.getProp("statinv") ? K[0].scrollHeight : 0);
        }
        function za() {
          var Ra = $.prompt(
            "Filter Pattern: (23*, 15.1*, comments, scrambles, date)"
          );
          null != Ra &&
            Ra != qa &&
            ((qa = Ra
              ? (Ra + "")
                  .replace(/[.\\+*?\[\^\]$(){}=!<>|:\-]/g, "\\$&")
                  .replace(/\\\*/g, ".*")
                  .replace(/\\\?/g, ".")
              : ".*"),
            (pa = new RegExp(qa, "g")),
            ma(!1));
        }
        function T() {
          if (".*" == qa && null == Na) return !1;
          qa = ".*";
          pa = /.*/;
          Na = null;
          ma(!1);
          return !0;
        }
        function aa() {
          for (var Ra = Ta.length + 50, Ua = []; 0 <= gb && Ta.length < Ra; ) {
            var Za = x[gb];
            if (
              pa.exec(c(Za[0], !0) + k(Za[0])) ||
              pa.exec(Za[1]) ||
              pa.exec(Za[2]) ||
              pa.exec(mathlib.time2str(Za[3]))
            )
              Ua.push(f(gb, Ba)), Ta.push(gb);
            gb = oa(gb);
          }
          kernel.getProp("statinv")
            ? Z.after(Ua.reverse().join(""))
            : Z.before(Ua.join(""));
        }
        function ja(Ra) {
          aa();
          0 > gb && Z.unbind("click").hide();
        }
        var pa = /.*/,
          qa = ".*",
          ua = $('<th class="click">').html("&#8981;"),
          Ja = $('<th class="click">'),
          La = $('<th class="click">'),
          ab = $('<th class="click">'),
          Ta = [],
          gb = 0,
          Na = null;
        return {
          appendRow: function (Ra) {
            if (!T()) {
              var Ua = f(Ra, Ba);
              kernel.getProp("statinv")
                ? (S.before(Ua), L.scrollTop(K[0].scrollHeight))
                : (M.after(Ua), L.scrollTop(0));
              Ta.unshift(Ra);
              a(Ba);
              50 < Ta.length && ra.hideAll();
            }
          },
          showAll: ja,
          hideAll: function () {
            for (; 50 < Ta.length; )
              (kernel.getProp("statinv") ? Z.next() : Z.prev()).remove(),
                (gb = Ta.pop());
            0 <= oa(gb) && Z.unbind("click").click(ja).show();
          },
          getRowIndexOf: function (Ra) {
            var Ua = Ta.indexOf(Ra);
            if (-1 == Ua) return null;
            var Za = kernel.getProp("statinv") ? Ta.length + 1 - Ua : 2 + Ua;
            Za = S.parent().children().eq(Za);
            return Ra != ~~Za.attr("data")
              ? (console.log(
                  "[stats] table_ctrl getRowIndexOf error",
                  Ua,
                  Ra,
                  Za
                ),
                null)
              : Za;
          },
          updateTable: ma,
          updateFrom: function (Ra) {
            for (
              var Ua = Math.min(Ra + Math.max(Ha, Ma), x.length),
                Za = kernel.getProp("statinv"),
                Xa = S.parent().children(),
                db = 0;
              db < Ta.length;
              db++
            )
              if (!(Ta[db] < Ra || Ta[db] >= Ua)) {
                var bb = Za ? Ta.length + 1 - db : 2 + db;
                Ta[db] != ~~Xa.eq(bb).attr("data")
                  ? console.log("[stats] update from error", Ta[db], bb, Xa[bb])
                  : f(Ta[db], Ba, Xa.eq(bb));
              }
            a(Ba);
          },
        };
      })(),
      ya = (function () {
        function ia() {
          if (!(0 > Ta || Ta >= x.length))
            if (kernel.getProp("statsrc", "t").startsWith("mcomment"))
              n(Ta, function () {
                x[Ta][2] = qa.val();
                Ea[Ta] = null;
              }),
                la.save(Ta),
                ra.updateFrom(Ta),
                p(["comment", Ta]);
            else {
              x[Ta][2] = qa.val();
              Ea[Ta] = null;
              la.save(Ta);
              var Na = ra.getRowIndexOf(Ta);
              Na && f(Ta, Ba, Na);
              h();
            }
        }
        function oa(Na) {
          Na = $(Na.target);
          var Ra = Na.attr("data");
          Ra &&
            ("p" == Ra
              ? ((Na = { " OK ": 0, " +2 ": 2e3, " DNF ": -1 }[Na.html()]),
                T(Na, Ta))
              : "d" == Ra
              ? C(Ta) && ((Ta = void 0), ma())
              : "s" == Ra
              ? ((Na = x[Ta]),
                $.clipboardCopy(Na[1]).then(
                  logohint.push.bind(logohint, LGHINT_SCRCOPY),
                  logohint.push.bind(logohint, "Copy Failed")
                ))
              : "c" == Ra
              ? ((Na = x[Ta]),
                $.clipboardCopy(
                  c(Na[0], !0) +
                    k(Na[0]) +
                    (Na[2] ? "[" + Na[2] + "]" : "") +
                    "   " +
                    Na[1] +
                    "   @" +
                    mathlib.time2str(Na[3])
                ).then(
                  logohint.push.bind(logohint, LGHINT_SOLVCOPY),
                  logohint.push.bind(logohint, "Copy Failed")
                ))
              : "r" == Ra &&
                ((Na = x[Ta]),
                Na[4] &&
                  ((Ra =
                    ("string" == typeof Na[4][1] && Na[4][1]) ||
                    tools.getCurPuzzle() ||
                    "333"),
                  replay.popupReplay(Na[1], Na[4][0], Ra))));
        }
        function ma() {
          kernel.isDialogShown("cfm") && kernel.hideDialog();
          gb &&
            (ja.css("font-size", "0.8em"),
            gb.empty().append(ja),
            (Ta = x.length - 1),
            za());
        }
        function za() {
          if (x[Ta]) {
            var Na = x[Ta],
              Ra = "";
            Na[4] &&
              ((Ra = $(
                '<span class="click" data="r">' + STATS_REVIEW + "</span>"
              )),
              (Ra = $("<tr>").append(
                $("<td>").append(Ra),
                $("<td>").append(ab)
              )));
            ja.empty()
              .append(pa, "<br>", k(Na[0]), "<br>")
              .append(
                '<span class="click" data="c"> &#128203; </span>|<span class="click" data="p"> OK </span>|<span class="click" data="p"> +2 </span>|<span class="click" data="p"> DNF </span>| ',
                ua
              )
              .append(
                "<br>",
                $('<table style="display:inline-block;">').append(
                  $("<tr>").append(
                    "<td>" + STATS_COMMENT + "</td>",
                    $("<td>").append(qa)
                  ),
                  $("<tr>").append(
                    '<td><span class="click" data="s">' +
                      SCRAMBLE_SCRAMBLE +
                      "</span></td>",
                    $("<td>").append(Ja)
                  ),
                  $("<tr>").append(
                    "<td>" + STATS_DATE + "</td>",
                    $("<td>").append(La)
                  ),
                  Ra
                )
              )
              .unbind("click")
              .click(oa);
            pa.html(c(Na[0], !0));
            Ja.val(Na[1]);
            La.val(mathlib.time2str(Na[3]));
            qa.val(Na[2]).unbind("change").change(ia);
            ab.val(Na[4] ? JSON.stringify(Na[4]) : "");
          } else ja.empty();
        }
        function T(Na, Ra) {
          x[Ra][0][0] != Na &&
            (n(Ra, function () {
              x[Ra][0][0] = Na;
              Ea[Ra] = null;
            }),
            la.save(Ra),
            ra.updateFrom(Ra),
            p(["penalty", Ra]),
            Ra == Ta && za(),
            kernel.pushSignal("timepnt", x[Ra]));
        }
        function aa(Na, Ra) {
          gb = Na;
          void 0 != Na && ma();
        }
        var ja = $('<div style="text-align:center; font-family: initial;">'),
          pa = $('<span style="font-size:2.5em;"/>'),
          qa = $('<input type="text">').css("width", "8em"),
          ua = $('<input type="button" data="d">').val("X"),
          Ja = $('<input type="text" readonly>').css("width", "8em"),
          La = $('<input type="text" readonly>').css("width", "8em"),
          ab = $('<input type="text" readonly>').css("width", "8em"),
          Ta = 0,
          gb;
        $(function () {
          tools.regTool("cfm", TOOLS_CFMTIME, aa);
          kernel.regListener("cfm", "session", ma);
        });
        return {
          proc: function (Na, Ra) {
            0 > Na ||
              Na >= x.length ||
              ((Ta = Na),
              za(),
              ja.css("font-size", "1.2em"),
              "comment" == Ra
                ? (ma(),
                  (Na = $.prompt(
                    "Comment for solve No. " + (Ta + 1) + ":",
                    qa.val()
                  )),
                  null != Na && (qa.val(Na), ia()))
                : ((Na = [
                    ja,
                    ma,
                    void 0,
                    ma,
                    [
                      STATS_SSSTAT,
                      function (Ua) {
                        ma();
                        r(U, w, Ua, 1, 10, !0);
                      }.bind(null, Ta),
                    ],
                    [
                      STATS_SSRETRY,
                      function (Ua) {
                        ma();
                        (Ua = x[Ua]) && scramble.pushScramble(Ua[1]);
                      }.bind(null, Ta),
                    ],
                  ]),
                  (Ra = x[Ta]) &&
                    Ra[4] &&
                    Na.push([
                      TOOLS_RECONS,
                      function () {
                        ma();
                        kernel.pushSignal("reqrec", [x[Ta], Ta]);
                      },
                    ]),
                  kernel.showDialog(Na, "cfm", "Solves No." + (Ta + 1))));
          },
          delLast: function () {
            0 != x.length && C(x.length - 1) && ((Ta = void 0), ma());
          },
          setCfm: function (Na) {
            0 != x.length && T(Na, x.length - 1);
          },
        };
      })(),
      Ba = 0,
      sa = STATS_STRING.split("|");
    for (N = 0; 13 > N; N++) sa[N] = sa[N] || "";
    var ta = A.bind(void 0, 0),
      na = [-3, 5, 12, 50, 100, 1e3],
      U = new TimeStat(na, 0, ta),
      ba = new TimeStat([5, 12], 0, ta),
      la = (function () {
        function ia(Ia) {
          $a = Ia;
          kernel.setProp("session", $a);
          Sa[$a] = Sa[$a] || { name: $a, opt: {} };
          kernel.setSProps(Sa[$a].opt || {});
          oa();
          return La();
        }
        function oa() {
          for (var Ia = 1; Ia <= hb; Ia++) {
            "object" != typeof Sa[Ia] && (Sa[Ia] = {});
            var Oa = { name: Ia, opt: {} },
              Va;
            for (Va in Oa) void 0 === Sa[Ia][Va] && (Sa[Ia][Va] = Oa[Va]);
            Sa[Ia].scr &&
              ((Sa[Ia].opt.scrType = Sa[Ia].scr), delete Sa[Ia].scr);
            Sa[Ia].phases &&
              ((Sa[Ia].opt.phases = Sa[Ia].phases), delete Sa[Ia].phases);
            Sa[Ia].rank = Sa[Ia].rank || Ia;
          }
          ma();
          tb.empty();
          for (Ia = 0; Ia < ib.length; Ia++)
            tb.append($("<option>").val(ib[Ia]).html(Sa[ib[Ia]].name));
          tb.append(Mb, mb);
          tb.val($a);
        }
        function ma() {
          ib = [];
          for (var Ia = 1; Ia <= hb; Ia++) ib.push(Ia);
          ib.sort(function (Oa, Va) {
            return Sa[Oa].rank - Sa[Va].rank;
          });
          for (Ia = 0; Ia < ib.length; Ia++) Sa[ib[Ia]].rank = Ia + 1;
          kernel.setProp("sessionData", JSON.stringify(Sa));
        }
        function za(Ia) {
          return Sa[Ia].rank + "-" + Sa[Ia].name;
        }
        function T(Ia, Oa) {
          $.isNumeric(Ia) || (Ia = (Sa[$a] || {}).rank || hb);
          $a = ++hb;
          var Va = new Date();
          Va = Va.getMonth() + 1 + "." + Va.getDate() + " " + da;
          kernel.setProp("sessionN", hb);
          var eb = Sa[ib[Ia - 1]] || {};
          Sa[$a] =
            void 0 === Oa || Oa
              ? {
                  name: eb.name || Va,
                  opt: JSON.parse(JSON.stringify(eb.opt || {})),
                  rank: Ia + 0.5,
                }
              : { name: Va, opt: kernel.getSProps(), rank: Ia + 0.5 };
          oa();
        }
        function aa(Ia, Oa) {
          T(Ia, Oa);
          x = [];
          Ea = [];
          ba.reset(x.length);
          U.reset(x.length);
          ab();
          ia($a);
          kernel.blur();
          kernel.getProp("imrename") && ua($a, !0);
        }
        function ja(Ia) {
          Ia != hb && (Sa[Ia] = Sa[hb]);
          delete Sa[hb];
          storage.del(Ia, hb);
          hb--;
          kernel.setProp("sessionN", hb);
          kernel.setProp("sessionData", JSON.stringify(Sa));
          0 == hb
            ? aa()
            : $a == Ia
            ? kernel.setProp("session", 1)
            : $a == hb + 1 && ia(Ia);
        }
        function pa(Ia) {
          if (
            0 != ("stat" in Sa[Ia] ? Sa[Ia].stat[0] : 1) &&
            !$.confirm(STATS_CFM_DELSS.replace("%s", za(Ia)))
          )
            return !1;
          ja(Ia);
          return !0;
        }
        function qa() {
          $.confirm(STATS_CFM_RESET) &&
            ((x = []),
            (Ea = []),
            U.reset(),
            ba.reset(),
            ab(),
            ra.updateTable(!0),
            kernel.blur());
        }
        function ua(Ia, Oa) {
          void 0 === Ia && (Ia = $a);
          Oa = $.prompt(
            Oa ? STATS_SESSION_NAMEC : STATS_SESSION_NAME,
            Sa[Ia].name
          );
          null != Oa &&
            ((Oa = $("<div/>").text(Oa).html()),
            (Sa[Ia].name = Oa),
            kernel.setProp("sessionData", JSON.stringify(Sa)));
        }
        function Ja(Ia, Oa) {
          va = !1;
          x = Oa;
          Ea = [];
          U.reset(x.length);
          ba.reset(x.length);
          ra.updateTable(!0);
          Sa[Ia] = Sa[Ia] || { name: Ia, opt: {} };
          Sa[Ia].stat = [x.length].concat(ba.getAllStats());
          Sa[Ia].date = [(x[0] || [])[3], (x.at(-1) || [])[3]];
          kernel.setProp("sessionData", JSON.stringify(Sa));
          kernel.isDialogShown("ssmgr") && Xa();
          kernel.pushSignal("session", "load");
        }
        function La() {
          return storage.get($a).then(Ja.bind(void 0, $a));
        }
        function ab(Ia) {
          Sa[$a].stat = [x.length].concat(ba.getAllStats());
          Sa[$a].date = [(x[0] || [])[3], (x.at(-1) || [])[3]];
          kernel.setProp("sessionData", JSON.stringify(Sa));
          return storage.set($a, x, Ia);
        }
        function Ta(Ia) {
          Ia = $(Ia.target);
          if (
            Ia.is("td, th, select") &&
            (Ia.hasClass("click") || Ia.is("select"))
          ) {
            for (var Oa = Ia.parent(); !Oa.is("tr"); ) Oa = Oa.parent();
            var Va = Oa.children();
            5 > Va.length && (Va = Oa.prev().children());
            Oa = ~~Va.first().html().replace(/-.*$/, "");
            Va = ib[Oa - 1];
            switch (Ia.attr("data") || Ia.val()) {
              case "r":
                ua(Va);
                break;
              case "u":
                1 != Oa &&
                  (Sa[Va].rank--,
                  Sa[ib[Oa - 2]].rank++,
                  kernel.setProp("sessionData", JSON.stringify(Sa)));
                break;
              case "d":
                Oa != ib.length &&
                  (Sa[Va].rank++,
                  Sa[ib[Oa]].rank--,
                  kernel.setProp("sessionData", JSON.stringify(Sa)));
                break;
              case "s":
                ia(Va);
                break;
              case "+":
                aa(Oa);
                break;
              case "x":
                pa(Va);
                break;
              case "m":
                Na(Va, !1);
                break;
              case "md":
                Na(Va, !0);
                break;
              case "o":
                Ra();
                break;
              case "p":
                gb();
                break;
              case "e":
                Za(Ia.parent());
                return;
              case "g":
                ob = !1;
                break;
              case "gn":
                ob = "name";
                break;
              case "gs":
                ob = "scr";
                break;
              case "v":
                storage.get(Va).then(function (eb) {
                  H(
                    new TimeStat(
                      [],
                      eb.length,
                      function (fb, lb) {
                        return -1 == fb[lb][0][0]
                          ? -1
                          : ~~((fb[lb][0][0] + fb[lb][0][1]) / wa) * wa;
                      }.bind(void 0, eb)
                    ),
                    function (fb, lb) {
                      return fb[lb];
                    }.bind(void 0, eb),
                    0,
                    eb.length
                  );
                });
                break;
              default:
                return;
            }
            kernel.blur();
            oa();
            Xa();
          }
        }
        function gb() {
          var Ia = $.prompt(
            STATS_PROMPTSPL.replace("%s", za($a)),
            ~~(x.length / 2)
          );
          if (null != Ia)
            if (((Ia = ~~Ia), 1 > Ia || Ia > x.length - 1))
              $.alert(STATS_ALERTSPL);
            else {
              var Oa = $a,
                Va = x.slice(-Ia);
              T();
              storage.set($a, Va).then(function () {
                $a = Oa;
                x = x.slice(0, -Ia);
                Ea = [];
                U.reset();
                ba.reset();
                ab();
                Ja($a, x);
              });
            }
        }
        function Na(Ia, Oa) {
          if (
            $a != Ia &&
            $.confirm(STATS_ALERTMG.replace("%f", za($a)).replace("%t", za(Ia)))
          ) {
            var Va = $a;
            storage
              .get(Ia)
              .then(function (eb) {
                Array.prototype.push.apply(eb, x);
                Oa && (eb = v(eb, !0));
                return storage.set(Ia, eb);
              })
              .then(function (eb) {
                delete Sa[Ia].stat;
                Sa[$a].date = [(eb[0] || [])[3], (eb.at(-1) || [])[3]];
                kernel.setProp("sessionData", JSON.stringify(Sa));
                ia(Ia);
                ja(Va);
              });
          }
        }
        function Ra() {
          for (var Ia = v(x), Oa = 0, Va = 0; Va < x.length; Va++)
            Ia[Va] != x[Va] && Oa++;
          0 == Oa
            ? logohint.push(LGHINT_SORT0)
            : $.confirm(STATS_SSMGR_SORTCFM.replace("%d", Oa)) &&
              ((x = Ia), (Ea = []), U.reset(), ba.reset(), ab(), Ja($a, x));
        }
        function Ua(Ia) {
          var Oa = ib[Ia - 1],
            Va = Sa[Oa],
            eb = ["?/?", "?"];
          if ("stat" in Va) {
            var fb = Va.stat;
            eb[0] = fb[0] - fb[1] + "/" + fb[0];
            eb[1] = t(fb[2]);
          }
          fb = STATS_SSMGR_OPS.split("|");
          fb =
            '<select><option value="">...</option><option value="r">' +
            fb[0] +
            '</option><option value="+">' +
            fb[1] +
            '</option><option value="' +
            (Oa == $a ? 'p">' + fb[2] : 'm">' + fb[3]) +
            '</option><option value="' +
            (Oa == $a ? 'o">' + fb[5] : 'md">' + fb[6]) +
            '</option><option value="x">' +
            fb[4] +
            '</option><option value="v">' +
            STATS_EXPORTCSV +
            "</option></select>";
          var lb =
              1 == Ia ? "<td></td>" : '<td class="click" data="u">&#8593;</td>',
            zb =
              Ia == ib.length
                ? "<td></td>"
                : '<td class="click" data="d">&#8595;</td>',
            qb =
              "<td>" + scramble.getTypeName(Va.opt.scrType || "333") + "</td>",
            Eb = "<td>" + eb[0] + "</td>";
          eb = "<td>" + eb[1] + "</td>";
          var Ab = mathlib.time2str((Sa[Oa].date || [])[1], "%Y-%M-%D");
          return (
            '<tr class="' +
            (Oa == $a ? "selected mhide" : "mhide") +
            '"><td class="click" data="s">' +
            Ia +
            "-" +
            Va.name +
            (Oa == $a ? "*" : "") +
            "</td>" +
            Eb +
            eb +
            "<td>" +
            Ab +
            "</td>" +
            qb +
            "<td>" +
            (Va.opt.phases || 1) +
            "</td>" +
            lb +
            zb +
            '<td class="seltd">' +
            fb +
            '</td></tr><tr class="' +
            (Oa == $a ? "selected " : "") +
            'mshow t"><td class="click" data="s" rowspan=2>' +
            Ia +
            "-" +
            Va.name +
            (Oa == $a ? "*" : "") +
            "</td>" +
            Eb +
            qb +
            lb +
            zb +
            '</tr><tr class="' +
            (Oa == $a ? "selected " : "") +
            'mshow b">' +
            eb +
            "<td>" +
            Ab +
            "&nbsp;" +
            (Va.opt.phases || 1) +
            'P.</td><td class="seltd" colspan=2>' +
            fb +
            "</td></tr>"
          );
        }
        function Za(Ia) {
          for (var Oa = Ia.next(); Oa.is(":hidden"); Oa = Oa.next())
            Oa.css("display", "");
          Ia.remove();
        }
        function Xa() {
          ma();
          nb.empty().append(
            '<tr class="mhide"><th class="click" data=' +
              ("name" == ob ? '"g">[+]' : '"gn">[-]') +
              " " +
              STATS_SSMGR_NAME +
              "</th><th>" +
              STATS_SOLVE +
              "</th><th>" +
              STATS_AVG +
              "</th><th>" +
              STATS_DATE +
              '</th><th class="click" data=' +
              ("scr" == ob ? '"g">[+]' : '"gs">[-]') +
              " " +
              SCRAMBLE_SCRAMBLE +
              '</th><th>P.</th><th colspan=3>OP</th></tr><tr class="mshow t"><th rowspan=2 class="click" data=' +
              ("name" == ob ? '"g">[+]' : '"gn">[-]') +
              " " +
              STATS_SSMGR_NAME +
              "</th><th>" +
              STATS_SOLVE +
              '</th><th class="click" data=' +
              ("scr" == ob ? '"g">[+]' : '"gs">[-]') +
              " " +
              SCRAMBLE_SCRAMBLE +
              '</th><th colspan=2 rowspan=2>OP</th></tr><tr class="mshow b"><th>' +
              STATS_AVG +
              "</th><th>" +
              STATS_DATE +
              " & P.</th></tr>"
          );
          for (var Ia = [], Oa = NaN, Va = 0; Va < ib.length; Va++) {
            var eb = Sa[ib[Va]];
            eb = "scr" == ob ? (eb.opt || {}).scrType : eb[ob];
            ob && eb == Oa ? Ia.at(-1).push(Va) : (Ia.push([Va]), (Oa = eb));
          }
          for (Va = 0; Va < Ia.length; Va++)
            if (1 == Ia[Va].length) nb.append(Ua(Ia[Va][0] + 1));
            else {
              Oa = nb;
              eb = Oa.append;
              for (
                var fb = Ia[Va], lb = !1, zb = [], qb = 0;
                qb < fb.length;
                qb++
              ) {
                var Eb = ib[fb[qb]];
                lb = lb || $a == Eb;
                zb.push(
                  Sa[Eb].name +
                    "(" +
                    scramble.getTypeName(Sa[Eb].opt.scrType || "333") +
                    ")"
                );
              }
              zb = zb.join(", ");
              45 < zb.length && (zb = zb.slice(0, 42) + "...");
              eb.call(
                Oa,
                "<tr" +
                  (lb ? ' class="selected"' : "") +
                  '><td class="click" data="e" colspan=9 style="text-align:left;">' +
                  (lb ? "*" : "") +
                  "[+] " +
                  fb.length +
                  " session(s): " +
                  zb +
                  "</td></tr>"
              );
              for (Oa = 0; Oa < Ia[Va].length; Oa++)
                nb.append($(Ua(Ia[Va][Oa] + 1)).hide());
            }
          nb.unbind("click").click(Ta).unbind("change").change(Ta);
        }
        function db() {
          Xa();
          kernel.showDialog(
            [
              rb,
              0,
              void 0,
              0,
              [
                STATS_SSMGR_ORDER,
                function () {
                  if (!$.confirm(STATS_SSMGR_ODCFM)) return !1;
                  for (var Ia = [], Oa = 1; Oa <= hb; Oa++) Ia.push(Oa);
                  Ia.sort(function (Va, eb) {
                    var fb = scramble.getTypeIdx(Sa[Va].opt.scrType || "333"),
                      lb = scramble.getTypeIdx(Sa[eb].opt.scrType || "333");
                    return fb == lb ? Sa[Va].rank - Sa[eb].rank : fb - lb;
                  });
                  for (Oa = 0; Oa < Ia.length; Oa++) Sa[Ia[Oa]].rank = Oa + 1;
                  ma();
                  oa();
                  Xa();
                  return !1;
                },
              ],
            ],
            "ssmgr",
            STATS_SSMGR_TITLE
          );
        }
        function bb(Ia, Oa) {
          "property" == Ia
            ? ("set" == Oa[2] ||
                "session" == Oa[2] ||
                Oa[0].startsWith("session") ||
                ((Sa[$a].opt = kernel.getSProps()),
                kernel.setProp("sessionData", JSON.stringify(Sa))),
              "session" == Oa[0] && ~~Oa[1] != $a
                ? ia(Oa[1])
                : "sessionData" == Oa[0]
                ? ((Sa = JSON.parse(Oa[1])), "set" != Oa[2] && oa())
                : "sessionN" == Oa[0]
                ? (hb = Oa[1])
                : "scrType" == Oa[0]
                ? ((da = Oa[1]),
                  "modify" == Oa[2] &&
                    kernel.getProp("scr2ss") &&
                    aa(void 0, !1))
                : "statclr" == Oa[0] &&
                  (Oa[1]
                    ? sb.val("X").unbind("click").click(qa)
                    : sb.val("+").unbind("click").click(aa)))
            : "ctrl" == Ia &&
              "stats" == Oa[0] &&
              ((Ia = Sa[$a].rank),
              "+" == Oa[1] && Ia < hb
                ? kernel.setProp("session", ib[Ia])
                : "-" == Oa[1] &&
                  1 < Ia &&
                  kernel.setProp("session", ib[Ia - 2]));
        }
        var hb = 15,
          $a = -1,
          rb = $("<div>"),
          nb = $("<table>").appendTo(rb).addClass("table ssmgr"),
          sb = $('<input type="button">').val("+"),
          Sa,
          ib,
          Mb = $("<option>").val("new").html("New.."),
          mb = $("<option>").val("del").html("Delete.."),
          tb = $("<select>").change(function () {
            kernel.blur();
            "new" == tb.val()
              ? aa(hb, !1)
              : "del" == tb.val()
              ? pa($a) || tb.val($a)
              : ia(~~tb.val());
          }),
          ob = !1;
        $(function () {
          kernel.regListener("ssmgr", "property", bb);
          kernel.regListener("ssmgr", "ctrl", bb, /^stats$/);
          kernel.regProp("stats", "sessionN", -6, "Number of Sessions", [15]);
          kernel.regProp("stats", "sessionData", -6, "Session Data", ["{}"]);
          hb = kernel.getProp("sessionN");
          Sa = JSON.parse(kernel.getProp("sessionData"));
          oa();
          kernel.setProp("sessionData", JSON.stringify(Sa));
          kernel.regProp("stats", "session", -6, "Current Session Index", [1]);
        });
        return {
          getSelect: function () {
            return tb;
          },
          showMgrTable: db,
          importSessions: function (Ia) {
            if (Ia && 0 != Ia.length) {
              for (var Oa = $a, Va = 0; Va < Ia.length; Va++) {
                var eb = Ia[Va],
                  fb = kernel.getSProps(),
                  lb;
                for (lb in eb.opt) fb[lb] = eb.opt[lb];
                $a = ++hb;
                Sa[$a] = { name: eb.name || $a, opt: fb, rank: hb };
                kernel.setProp("sessionN", hb);
                x = eb.times;
                Ea = [];
                U.reset(x.length);
                ba.reset(x.length);
                ab();
              }
              oa();
              ia(Oa);
              db();
              logohint.push(LGHINT_IMPORTED.replace("%d", Ia.length));
              return Ia.length;
            }
          },
          getButton: function () {
            return sb;
          },
          rank2idx: function (Ia) {
            return ib[Ia - 1];
          },
          load: La,
          save: ab,
        };
      })(),
      ka = "",
      Aa = 5,
      Da = 12,
      Ha = 5,
      Ma = 12,
      da = "333",
      wa = 1;
    $(function () {
      kernel.regListener("stats", "time", W);
      kernel.regListener("stats", "scramble", W);
      kernel.regListener("stats", "scrambleX", W);
      kernel.regListener(
        "stats",
        "property",
        W,
        /^(:?useMilli|timeFormat|stat(:?sum|thres|[bw]pa|[12][tl]|alu?|inv|Hide|src|ssum)|session(:?Data)?|scrType|phases|trimr?|view|wndStat|hlpbs|sr_.*)$/
      );
      kernel.regListener("stats", "ctrl", W, /^stats$/);
      kernel.regListener("stats", "ashow", W);
      kernel.regListener("stats", "button", W);
      kernel.regListener("stats", "giirecons", W);
      kernel.regProp(
        "stats",
        "trim",
        1,
        PROPERTY_TRIM,
        [
          "p5",
          "0 1 p1 p5 p10 p20 m".split(" "),
          ["0", "1", "1%", "5%", "10%", "20%", "50%/" + PROPERTY_TRIM_MED],
        ],
        1
      );
      kernel.regProp(
        "stats",
        "trimr",
        1,
        PROPERTY_TRIMR,
        [
          "a",
          "a 0 1 p1 p5 p10 p20 m".split(" "),
          [
            "auto",
            "0",
            "1",
            "1%",
            "5%",
            "10%",
            "20%",
            "50%/" + PROPERTY_TRIM_MED,
          ],
        ],
        1
      );
      kernel.regProp("stats", "statsum", 0, PROPERTY_SUMMARY, [!0], 1);
      kernel.regProp("stats", "statthres", 0, PROPERTY_STATTHRES, [!1], 1);
      kernel.regProp("stats", "statbpa", 0, PROPERTY_STATBPA, [!1], 1);
      kernel.regProp("stats", "statwpa", 0, PROPERTY_STATWPA, [!1], 1);
      kernel.regProp("stats", "printScr", 0, PROPERTY_PRINTSCR, [!0], 1);
      kernel.regProp("stats", "printComm", 0, PROPERTY_PRINTCOMM, [!0], 1);
      kernel.regProp("stats", "printDate", 0, PROPERTY_PRINTDATE, [!1], 1);
      kernel.regProp("stats", "imrename", 0, PROPERTY_IMRENAME, [!1], 1);
      kernel.regProp("stats", "scr2ss", 0, PROPERTY_SCR2SS, [!1]);
      kernel.regProp("stats", "statssum", 0, PROPERTY_STATSSUM, [!1], 1);
      kernel.regProp("stats", "statinv", 0, PROPERTY_STATINV, [!1], 1);
      kernel.regProp("stats", "statclr", 0, STATS_STATCLR, [!0], 1);
      kernel.regProp("stats", "absidx", 0, STATS_ABSIDX, [!1], 1);
      kernel.regProp(
        "stats",
        "hlpbs",
        1,
        PROPERTY_HLPBS,
        [
          "f40b",
          ["f40b", "linkb", "normb", "none"],
          PROPERTY_HLPBS_STR.split("|"),
        ],
        1
      );
      R.append(
        F.append(
          $('<span class="click">').html(STATS_SESSION).click(la.showMgrTable),
          la.getSelect(),
          la.getButton()
        ),
        ea.append(fa),
        $('<div class="stattl">').append(L.append(K))
      ).click(function (oa) {
        $(oa.target).is("input,textarea,select,.click,.chide,.times") ||
          kernel.setProp("statHide", !1);
      });
      $(window).bind("resize", X);
      K.append(M, S);
      kernel.addWindow("stats", BUTTON_TIME_LIST, R, !0, !0, 4);
      L.bind("scroll", function () {
        var oa = L[0];
        oa.scrollHeight - oa.scrollTop < oa.clientHeight + 5 &&
          !kernel.getProp("statinv") &&
          Z.click();
      });
      var ia = STATS_TYPELEN.split("|");
      kernel.regProp(
        "stats",
        "stat1t",
        1,
        ia[0].replace("%d", 1),
        [0, [0, 1], ia.slice(2)],
        1
      );
      kernel.regProp(
        "stats",
        "stat1l",
        2,
        ia[1].replace("%d", 1),
        [5, 3, 1e3],
        1
      );
      kernel.regProp(
        "stats",
        "stat2t",
        1,
        ia[0].replace("%d", 2),
        [0, [0, 1], ia.slice(2)],
        1
      );
      kernel.regProp(
        "stats",
        "stat2l",
        2,
        ia[1].replace("%d", 2),
        [12, 3, 1e3],
        1
      );
      kernel.regProp("stats", "rsfor1s", 0, STATS_RSFORSS, [!1]);
      kernel.regProp(
        "stats",
        "statalu",
        5,
        PROPERTY_STATALU,
        ["mo3 ao5 ao12 ao100"],
        1
      );
      kernel.regProp(
        "stats",
        "statal",
        1,
        PROPERTY_STATAL,
        [
          "mo3 ao5 ao12 ao100",
          [
            "mo3 ao5 ao12 ao100",
            "mo3 ao5 ao12 ao25 ao50 ao100",
            "mo3 ao5 ao12 ao25 ao50 ao100 ao200 ao500 ao1000 ao2000 ao5000 ao10000",
            "u",
          ],
          [
            "mo3 ao5 ao12 ao100",
            "mo3 ao5 ao12 ao25 ao50 ao100",
            "mo3 ao5 ao12 ao25 ao50 ao100 ao200 ao500 ao1000 ao2000 ao5000 ao10000",
            "Custom",
          ],
        ],
        1
      );
      kernel.regProp("stats", "delmul", 0, PROPERTY_DELMUL, [!0]);
      kernel.regProp("ui", "statHide", -1, "Hide Session Title", [!1]);
      kernel.setProp("sr_statalu", kernel.getProp("sr_statal"));
    });
    var ha = {},
      Ea = [],
      Ka = {},
      Qa = {};
    for (N = 0; 5 > N; N++)
      V("comment" + N, D.bind(null, N), [
        STATS_COMMENT + (N + 1),
        function (ia) {
          return (
            "" +
            (0 <= ia
              ? (0.001 * ia)
                  .toFixed(kernel.getProp("useMilli") ? 3 : 2)
                  .replace(/\.?0+$/, "")
              : "N/A")
          );
        },
        function (ia) {
          return (
            "" +
            (0 <= ia
              ? (0.001 * ia).toFixed(kernel.getProp("useMilli") ? 3 : 2)
              : "DNF")
          );
        },
      ]);
    V(
      "commentmbld",
      function (ia) {
        if (0 > ia[0][0]) return -1;
        var oa = [];
        (ia[2] || "").replace(/[0-9]+/g, function (ma) {
          oa.push(parseInt(ma));
        });
        return 2 > oa.length ||
          2 > oa[0] ||
          oa[0] > oa[1] ||
          2 * oa[0] < oa[1] ||
          255 <= oa[1]
          ? -1
          : 1024 * (255 - (2 * oa[0] - oa[1])) +
              ~~(ia[0][0] + ia[0][1]) / Math.pow(2, 26) +
              oa[0] / Math.pow(2, 34);
      },
      [
        "MBLD",
        function (ia) {
          if (0 > ia) return "DNF";
          if (261121 < ia) return "N/A";
          var oa = (ia * Math.pow(2, 34)) & 255;
          return (
            "" +
            oa +
            "/" +
            (2 * oa - (255 - Math.floor(ia) / 1024)) +
            " " +
            kernel.pretty(~~((ia % 1) * Math.pow(2, 26))).split(".")[0]
          );
        },
        function (ia) {
          if (0 > ia) return "DNF";
          var oa = 255 - Math.floor(ia) / 1024;
          return (
            "" +
            (0 <= ia ? oa.toFixed(kernel.getProp("useMilli") ? 3 : 2) : "DNF")
          );
        },
      ]
    );
    return {
      importSessions: la.importSessions,
      getReviewUrl: function (ia) {
        return (
          "https://alg.cubing.net/?alg=" +
          encodeURIComponent(
            (ia[4][0] || "").replace(/@(\d+)/g, "/*$1*/").replace(/-/g, "&#45;")
          ) +
          "&setup=" +
          encodeURIComponent(ia[1] || "")
        );
      },
      pretty: c,
      getStat12: function () {
        return [Aa, Da, Ha, Ma];
      },
      getTimesStatsList: function () {
        return ba;
      },
      getTimesStatsTable: function () {
        return U;
      },
      getSessionManager: function () {
        return la;
      },
      getSortedTimesByDate: v,
      trim: z,
      timesAt: w,
      timeAt: ta,
      infoClick: y,
      regUtil: function (ia, oa) {
        ha[ia] = oa;
      },
      regExtraInfo: V,
      getExtraInfo: Q,
    };
  },
  [kernel.pretty, kernel.round, kernel.pround]
);
var stattool = execMain(
  function (b, N, t) {
    function E() {
      if (k) {
        var g = stats.getTimesStatsTable(),
          f = g.avgSizes,
          a = g.getAllStats(),
          e = a[0],
          h = a[1],
          p = 0;
        for (a = 0; a < g.timesLen; a++) p += stats.timesAt(a)[0][1];
        a = g.prettyFunc || [b, t];
        var q = [];
        q.push(
          '<span class="click" data="tt">' +
            c[4].replace("%d", g.timesLen - e + "/" + g.timesLen) +
            ", " +
            c[9].replace("%v", a[1](h)) +
            "</span>\n"
        );
        q.push("<span>" + c[12].replace("%d", b(p)) + "</span>\n");
        q.push(
          c[0] +
            ': <span class="click" data="bs">' +
            a[0](g.bestTime) +
            "</span>"
        );
        q.push(
          " | " +
            c[2] +
            ': <span class="click" data="ws">' +
            a[0](g.worstTime) +
            "</span>\n"
        );
        e = !1;
        h =
          '<table class="table"><tr><td></td><td>' +
          c[1] +
          "</td><td>" +
          c[0] +
          "</td></tr>";
        for (p = 0; p < f.length; p++) {
          var m = Math.abs(f[p]);
          g.timesLen >= m &&
            (e || ((e = !0), q.push(h)),
            q.push("<tr><td>" + c[7 - (f[p] >>> 31)].replace("%mk", m)),
            q.push(
              '<td><span class="click" data="c' +
                "am"[f[p] >>> 31] +
                p +
                '">' +
                a[1](g.lastAvg[p][0]) +
                " (σ=" +
                stats.trim(g.lastAvg[p][1], 2) +
                ")</span></td>"
            ),
            q.push(
              '<td><span class="click" data="b' +
                "am"[f[p] >>> 31] +
                p +
                '">' +
                a[1](g.bestAvg(p, 0)) +
                " (σ=" +
                stats.trim(g.bestAvg(p, 1), 2) +
                ")</span></td></tr>"
            ));
        }
        e && q.push("</table>");
        q = q.join("");
        C.html(q.replace(/\n/g, "<br>"));
      }
    }
    function n(g, f) {
      (k = void 0 != g) &&
        !/^scr/.exec(f) &&
        (g.empty().append(
          C.unbind("click").click(function (a) {
            stats.infoClick(stats.getTimesStatsTable(), stats.timesAt, a);
          })
        ),
        E());
    }
    var C = $("<div />").css("text-align", "center").css("font-size", "0.7em"),
      c = STATS_STRING.split("|");
    for (N = 0; 13 > N; N++) c[N] = c[N] || "";
    var k = !1;
    $(function () {
      "undefined" != typeof tools && tools.regTool("stats", TOOLS_STATS, n);
      stats.regUtil("stattool", E);
    });
    return { update: E };
  },
  [kernel.pretty, kernel.round, kernel.pround]
);
var trend = execMain(
  function (b) {
    function N() {
      if (g && C[0].getContext) {
        var r = stats.getStat12(),
          H = r[0],
          y = r[1],
          A = r[2],
          w = r[3];
        c = C[0].getContext("2d");
        r = kernel.getProp("imgSize") / 10;
        f = 50;
        C.width(9.6 * r + "em");
        C.height(6 * r + "em");
        C.attr("width", 8 * f + 1);
        C.attr("height", 5 * f + 5);
        a = 5 * f;
        f *= 8;
        var v = stats.getTimesStatsTable(),
          u = v.getMinMaxInt();
        if (u) {
          var I = v.timesLen;
          r = v.getBestDiff((u[0] - u[1]) * q);
          var z = Math.ceil(u[0] / r) * r;
          u = ~~(u[1] / r) * r;
          var O = z - u,
            J = [0, 1, 1, 0, 0],
            P = [0, 0, 1, 1, 0];
          c.fillStyle = "#fff";
          c.beginPath();
          c.moveTo(J[0] * (f - 35) + 35, (1 - P[0]) * (a - 25) + 25);
          for (var W = 1; W < J.length; W++)
            c.lineTo(J[W] * (f - 35) + 35, (1 - P[W]) * (a - 25) + 25);
          c.fill();
          c.closePath();
          c.lineWidth = 2;
          if (1 < I) {
            P = [];
            W = [];
            for (J = 0; J < I; J++) {
              var X = v.timeAt(J);
              -1 != X &&
                (P.push(J / (I - 1)),
                W.push(Math.max(0, Math.min(1, (X - u) / O))));
            }
            t(P, W, "#888");
          }
          if (I > A) {
            P = [];
            W = [];
            X = v.runAvgMean(0, I, A, 0 < H ? void 0 : 0);
            for (J = 0; J < X.length; J++)
              -1 != X[J][0] &&
                (P.push((J + A - 1) / (I - 1)),
                W.push(Math.max(0, Math.min(1, (X[J][0] - u) / O))));
            t(P, W, "#f00");
          }
          if (I > w) {
            P = [];
            W = [];
            v = v.runAvgMean(0, I, w, 0 < y ? void 0 : 0);
            for (J = 0; J < v.length; J++)
              -1 != v[J][0] &&
                (P.push((J + w - 1) / (I - 1)),
                W.push(Math.max(0, Math.min(1, (v[J][0] - u) / O))));
            t(P, W, "#00f");
          }
          c.clearRect(0, 0, f, 25);
          c.clearRect(0, 0, 35, a);
          c.clearRect(0, a, f + 1, a + 5);
          c.lineWidth = 2;
          c.font = "12pt Arial";
          c.fillStyle = kernel.getProp("col-font");
          c.fillText("time", 50, 13);
          c.strokeStyle = "#888";
          c.beginPath();
          c.moveTo(90, 7);
          c.lineTo(130, 7);
          c.stroke();
          c.fillText((0 < H ? "ao" : "mo") + A, 160, 13);
          c.strokeStyle = "#f00";
          c.beginPath();
          c.moveTo(200, 7);
          c.lineTo(240, 7);
          c.stroke();
          c.fillText((0 < y ? "ao" : "mo") + w, 270, 13);
          c.strokeStyle = "#00f";
          c.beginPath();
          c.moveTo(310, 7);
          c.lineTo(350, 7);
          c.stroke();
          c.fillStyle = kernel.getProp("col-font");
          c.strokeStyle = "#ccc";
          c.lineWidth = 1;
          c.textAlign = "right";
          H = 1e3 <= r ? /[^\.]+(?=\.)/ : /[^\.]+\.[\d]/;
          for (J = u; J <= z; J += r)
            (y = b(J).match(H)[0]),
              (A = (z - J) / O),
              (A = 1 - (1 - A - p) / q),
              0 > A ||
                1 < A ||
                (c.fillText(y, 30, A * (a - 25) + 30),
                t([e, e + h], [(J - u) / O, (J - u) / O], "#ccc"));
          t([e, e + h, e + h, e, e], [p, p, p + q, p + q, p], "#000");
        }
      }
    }
    function t(r, H, y) {
      c.strokeStyle = y;
      c.beginPath();
      for (y = 0; y < r.length; y++)
        (r[y] = (r[y] - e) / h), (H[y] = (H[y] - p) / q);
      c.moveTo(r[0] * (f - 35) + 35, (1 - H[0]) * (a - 25) + 25);
      for (y = 1; y < r.length; y++)
        c.lineTo(r[y] * (f - 35) + 35, (1 - H[y]) * (a - 25) + 25);
      c.stroke();
      c.closePath();
    }
    function E(r) {
      var H = $(r.target);
      H.hasClass("click") &&
        ((r = H.attr("data")),
        "x" == r
          ? ((m = "y"), H.attr("data", "y"), H.html(""))
          : "y" == r
          ? ((m = "x"), H.attr("data", "x"), H.html(""))
          : ((H = { p: 1, m: -1 }[r] || 0),
            (r = { l: Math.sqrt(0.5), s: Math.sqrt(2) }[r] || 1),
            "x" == m
              ? ((e += H * h * 0.25 + h * (1 - r)),
                (h *= r),
                (h = Math.min(Math.max(h, 0.1), 1)),
                (e = Math.min(Math.max(e, 0), 1 - h)))
              : ((p += H * q * 0.25 + (q * (1 - r)) / 2),
                (q *= r),
                (q = Math.min(Math.max(q, 0.1), 1)),
                (p = Math.min(Math.max(p, 0), 1 - q))),
            N()));
    }
    function n(r, H) {
      (g = void 0 != r) &&
        !/^scr/.exec(H) &&
        ((H = $.format.bind(
          null,
          '<span class="click" data="{0}" style="font-family:iconfont,Arial;display:inline-block;width:2em;">{1}</span>'
        )),
        r.empty().append(
          k
            .empty()
            .append(
              C,
              "<br>",
              [
                H(["x", ""]),
                H(["p", "&lt;"]),
                H(["m", "&gt;"]),
                H(["l", ""]),
                H(["s", ""]),
              ].join("")
            )
            .unbind("click")
            .click(E)
        ),
        N());
    }
    var C = $('<canvas style="margin-bottom:-0.4em"/>'),
      c,
      k = $('<div style="text-align:center">'),
      g = !1,
      f,
      a,
      e = 0,
      h = 1,
      p = 0,
      q = 1,
      m = "x";
    $(function () {
      "undefined" != typeof tools &&
        (kernel.regListener(
          "trend",
          "property",
          function (r, H) {
            "disPrec" == H[0] && N();
          },
          /^disPrec|col-font$/
        ),
        C[0].getContext && tools.regTool("trend", TOOLS_TREND, n));
      stats.regUtil("trend", N);
    });
    return { update: N };
  },
  [kernel.pretty]
);
var distribution = execMain(
  function (b) {
    function N() {
      if (n) {
        E.empty();
        var C = stats.getTimesStatsTable(),
          c = C.getMinMaxInt();
        if (c) {
          var k = C.timesLen,
            g = c[0],
            f = c[1];
          c = c[2];
          g = ~~(g / c);
          f = ~~(f / c);
          for (var a = {}, e = {}, h = 0, p = (e[g + 1] = 0); p < k; p++) {
            var q = C.timeAt(p);
            -1 != q
              ? ((q = ~~(q / c)),
                (a[q] = (a[q] || 0) + 1),
                (h = Math.max(a[q], h)),
                (e[q] = p + 1))
              : (e[g + 1] = p + 1);
          }
          for (p = g; p > f; p--) e[p] = Math.max(e[p + 1], e[p] || 0);
          C = [];
          q = 0;
          var m = 1e3 <= c ? /[^\.]+(?=\.)/ : /[^\.]+\.[\d]/,
            r = b(g * c).match(m)[0].length;
          for (p = f; p <= g; p++) {
            f = b(p * c).match(m)[0];
            var H = b((p + 1) * c).match(m)[0];
            a[p] = a[p] || 0;
            q += a[p];
            f = mathlib.valuedArray(r - f.length, "&nbsp;").join("") + f;
            H = mathlib.valuedArray(r - H.length, "&nbsp;").join("") + H;
            C.push(
              "<tr><td>" +
                f +
                '+</td><td><span class="cntbar" style="width: ' +
                (a[p] / h) * 5 +
                'em;">' +
                a[p] +
                "</span></td><td>&nbsp;&lt;" +
                H +
                '</td><td><span class="cntbar" style="width: ' +
                (q / k) * 5 +
                'em; white-space: nowrap;">' +
                (k - e[p + 1]) +
                "/" +
                q +
                "</span></td></tr>"
            );
          }
          E.html('<table style="border:none;">' + C.join("") + "</table>");
        }
      }
    }
    function t(C, c) {
      (n = void 0 != C) && !/^scr/.exec(c) && (C.empty().append(E), N());
    }
    var E = $("<div />"),
      n = !1;
    $(function () {
      "undefined" != typeof tools &&
        (kernel.regListener(
          "distribution",
          "property",
          function (C, c) {
            "disPrec" == c[0] && N();
          },
          /^disPrec$/
        ),
        kernel.regProp(
          "tools",
          "disPrec",
          1,
          STATS_PREC,
          ["a", ["a", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], STATS_PREC_STR.split("|")],
          1
        ),
        tools.regTool("distribution", TOOLS_DISTRIBUTION, t));
      stats.regUtil("distribution", N);
    });
    return { update: N };
  },
  [kernel.pretty]
);
var crossSessionStats = execMain(
  function (b, N, t) {
    function E(v) {
      return -1 == r[v][0][0] ? -1 : ~~((r[v][0][0] + r[v][0][1]) / H) * H;
    }
    function n(v) {
      return r[v];
    }
    function C() {
      r = [];
      H = kernel.getProp("useMilli") ? 1 : 10;
      for (
        var v = Promise.resolve(),
          u = ~~kernel.getProp("sessionN"),
          I = JSON.parse(kernel.getProp("sessionData")),
          z = e.val(),
          O = p.val(),
          J = -1 == h.val() ? -1 : ~~(+new Date() / 1e3) - 86400 * h.val(),
          P = 0;
        P < u;
        P++
      ) {
        var W = stats.getSessionManager().rank2idx(P + 1);
        if ("*" == z || I[W].name == z)
          if ("*" == O || (I[W].opt.scrType || "333") == O)
            v = v.then(
              function (X) {
                return new Promise(function (V) {
                  storage.get(X).then(function (Q) {
                    for (var d = 0; d < Q.length; d++)
                      (Q[d][3] || 0) < J || r.push(Q[d]);
                    V();
                  });
                });
              }.bind(void 0, W)
            );
      }
      v.then(function () {
        r = stats.getSortedTimesByDate(r);
        m.reset(r.length);
        var X = m.getAllStats(),
          V = X[0],
          Q = X[1],
          d = 0;
        for (X = 0; X < r.length; X++) d += r[X][0][1];
        X = [];
        X.push(
          '<span class="click" data="tt">' +
            y[4].replace("%d", m.timesLen - V + "/" + m.timesLen) +
            ", " +
            y[9].replace("%v", t(Q)) +
            "</span>\n"
        );
        X.push("<span>" + y[12].replace("%d", b(d)) + "</span>\n");
        X.push(
          y[0] + ': <span class="click" data="bs">' + b(m.bestTime) + "</span>"
        );
        X.push(
          " | " +
            y[2] +
            ': <span class="click" data="ws">' +
            b(m.worstTime) +
            "</span>\n"
        );
        V = !1;
        Q =
          '<table class="table"><tr><td></td><td>' +
          y[1] +
          "</td><td>" +
          y[0] +
          "</td></tr>";
        d = m.avgSizes;
        for (var l = 0; l < d.length; l++) {
          var D = Math.abs(d[l]);
          m.timesLen >= D &&
            (V || ((V = !0), X.push(Q)),
            X.push("<tr><td>" + y[7 - (d[l] >>> 31)].replace("%mk", D)),
            X.push(
              '<td><span class="click" data="c' +
                "am"[d[l] >>> 31] +
                l +
                '">' +
                t(m.lastAvg[l][0]) +
                " (σ=" +
                stats.trim(m.lastAvg[l][1], 2) +
                ")</span></td>"
            ),
            X.push(
              '<td><span class="click" data="b' +
                "am"[d[l] >>> 31] +
                l +
                '">' +
                t(m.bestAvg(l, 0)) +
                " (σ=" +
                stats.trim(m.bestAvg(l, 1), 2) +
                ")</span></td></tr>"
            ));
        }
        V && X.push("</table>");
        X = X.join("");
        a.html(X.replace(/\n/g, "<br>"));
      });
    }
    function c() {
      var v = !1,
        u = JSON.parse(kernel.getProp("sessionData"));
      $.each(u, function (O, J) {
        (w[O] &&
          J.name == w[O].name &&
          (J.opt || {}).scrType == (w[O].opt || {}).scrType) ||
          (v = !0);
      });
      w = u;
      if (v) {
        var I = [],
          z = [];
        e.empty().append($("<option />").val("*").html(STATS_XSESSION_NAME));
        p.empty().append($("<option />").val("*").html(STATS_XSESSION_SCR));
        $.each(u, function (O, J) {
          O = J.name;
          -1 == $.inArray(O, I) &&
            (I.push(O), e.append($("<option />").val(O).html(O)));
          J = (J.opt || {}).scrType || "333";
          -1 == $.inArray(J, z) &&
            (z.push(J),
            p.append($("<option />").val(J).html(scramble.getTypeName(J))));
        });
      }
    }
    function k(v, u) {
      (A = v) &&
        !/^scr/.exec(u) &&
        (c(),
        v.empty().append(f),
        q.unbind("click").click(C),
        a.unbind("click").click(function (I) {
          stats.infoClick(m, n, I);
        }));
    }
    function g(v, u) {
      "sessionData" == u[0] && A && c();
    }
    N = STATS_XSESSION_DATE.split("|");
    var f = $("<div />").css("text-align", "center").css("font-size", "0.7em"),
      a = $("<div />"),
      e = $("<select>"),
      h = $("<select>")
        .append(
          $("<option>").val(-1).html(N[0]),
          $("<option>").val(1).html(N[1]),
          $("<option>").val(7).html(N[2]),
          $("<option>").val(30).html(N[3]),
          $("<option>").val(365).html(N[4])
        )
        .val(-1),
      p = $("<select>"),
      q = $('<span class="click">' + STATS_XSESSION_CALC + "</span>"),
      m = new TimeStat([], 0, E),
      r = [],
      H = 1,
      y = STATS_STRING.split("|");
    for (N = 0; 13 > N; N++) y[N] = y[N] || "";
    var A = null,
      w = {};
    $(function () {
      f.append(e, h, p, " ", q, "<br>", a);
      "undefined" != typeof tools &&
        tools.regTool("hugestats", TOOLS_HUGESTATS, k);
      kernel.regListener("labelstat", "property", g, /^sessionData$/);
    });
    return {
      update: $.noop,
      updateStatal: function (v) {
        m = new TimeStat(v, 0, E);
      },
    };
  },
  [kernel.pretty, kernel.round, kernel.pround]
);
var periodStats = execMain(function () {
  function b(z) {
    z -= p;
    var O = new Date(1e3 * z);
    switch (q) {
      case "d":
        return ~~(z / 86400);
      case "w":
        return ~~((z / 86400 - e.val()) / 7);
      case "m":
        return 12 * O.getFullYear() + O.getMonth();
      case "y":
        return O.getFullYear();
    }
  }
  function N(z) {
    switch (q) {
      case "d":
        return mathlib.time2str(86400 * z + p, "%Y-%M-%D");
      case "w":
        return mathlib.time2str(
          86400 * (7 * z + ~~e.val()) + p,
          "Start@ %Y-%M-%D"
        );
      case "m":
        return ~~(z / 12) + "-" + ("0" + ((z % 12) + 1)).slice(-2);
      case "y":
        return "" + z;
    }
  }
  function t() {
    for (
      var z = Promise.resolve(), O = ~~kernel.getProp("sessionN"), J = 0;
      J < O;
      J++
    ) {
      var P = stats.getSessionManager().rank2idx(J + 1);
      z = z.then(
        function (W) {
          return new Promise(function (X) {
            storage.get(W).then(function (V) {
              stats[W] = {};
              for (var Q = 0; Q < V.length; Q++)
                if (V[Q][3]) {
                  var d = b(V[Q][3]);
                  stats[W][d] = stats[W][d] || [0, 0];
                  stats[W][d][0] += 1;
                  stats[W][d][1] += -1 != V[Q][0][0];
                }
              X();
            });
          });
        }.bind(void 0, P)
      );
    }
    return z.then(function () {
      h = stats;
    });
  }
  function E(z) {
    z = $(z.target).html();
    "&gt;" == z
      ? r--
      : "&lt;" == z
      ? (r = Math.min(r + 1, 0))
      : "+" == z
      ? H++
      : "-" == z && (H = Math.max(1, H - 1));
    n();
  }
  function n() {
    if (u) {
      var z = $('<table class="table">'),
        O = TOOLS_DLYSTAT1.split("|");
      I.empty().append(
        O[0],
        g.unbind("change").change(c),
        " " + O[1],
        f.unbind("change").change(c),
        " " + O[2],
        e.unbind("change").change(c),
        "<br>",
        z
      );
      O = JSON.parse(kernel.getProp("sessionData"));
      for (
        var J = ~~kernel.getProp("sessionN"),
          P = $("<tr>").append(
            A.unbind("click").click(E),
            y.unbind("click").click(E)
          ),
          W = $("<tr>").append(
            w.unbind("click").click(E),
            v.unbind("click").click(E)
          ),
          X = 0;
        X < H;
        X++
      )
        P.append($("<td rowspan=2>").html(N(m - X + r).replace(" ", "<br>")));
      z.append(P, W);
      for (X = 0; X < J; X++)
        if (
          ((P = stats.getSessionManager().rank2idx(X + 1)),
          0 != Object.keys(h[P] || {}).length)
        ) {
          W = $("<tr>").append($("<td colspan=2>").html(O[P].name));
          for (var V = 0; V < H; V++) {
            var Q = h[P][m - V + r];
            W.append($("<td>").html(Q ? Q[1] + "/" + Q[0] : "-"));
          }
          z.append(W);
        }
    }
  }
  function C(z, O) {
    u = !!z;
    z && !/^scr/.exec(O) && (z.empty().append(I), c());
  }
  function c() {
    u &&
      ((q = g.val()),
      (p = 3600 * f.val() + 60 * new Date().getTimezoneOffset()),
      (m = b(+new Date() / 1e3)),
      t().then(n));
  }
  var k = TOOLS_DLYSTAT_OPT1.split("|"),
    g = $("<select>")
      .append(
        $("<option>").val("d").html(k[0]),
        $("<option>").val("w").html(k[1]),
        $("<option>").val("m").html(k[2]),
        $("<option>").val("y").html(k[3])
      )
      .val("d"),
    f = $("<select>");
  for (k = 0; 24 > k; k++) {
    var a = ("0" + k).slice(-2) + ":00";
    f.append($("<option>").val(k).html(a));
  }
  k = TOOLS_DLYSTAT_OPT2.split("|");
  var e = $("<select>")
      .append(
        $("<option>").val(3).html(k[0]),
        $("<option>").val(4).html(k[1]),
        $("<option>").val(5).html(k[2]),
        $("<option>").val(6).html(k[3]),
        $("<option>").val(0).html(k[4]),
        $("<option>").val(1).html(k[5]),
        $("<option>").val(2).html(k[6])
      )
      .val(3),
    h = [],
    p,
    q,
    m,
    r = 0,
    H = 3,
    y = $('<td class="click">').html("&gt;"),
    A = $('<td class="click">').html("&lt;"),
    w = $('<td class="click">').html("+"),
    v = $('<td class="click">').html("-");
  $("<td colspan=1>");
  var u = !1,
    I = $("<div />")
      .css("text-align", "center")
      .css({
        "font-size": "0.7em",
        "max-height": "20em",
        "overflow-y": "auto",
      });
  $(function () {
    "undefined" != typeof tools && tools.regTool("dlystat", TOOLS_DLYSTAT, C);
    kernel.regListener("dlystat", "property", n, /^sessionData$/);
    stats.regUtil("dlystat", c);
  });
  return { update: c };
});
var recons = execMain(function () {
    function b() {
      this.clear();
    }
    function N() {
      this.clear();
    }
    function t(J, P) {
      J = J.split(/ +/);
      var W = new mathlib.CubieCube();
      W.ori = 0;
      P = "lfmc" == P ? new N() : new b();
      for (var X = 0; X < J.length; X++) {
        var V = W.selfMoveStr(J[X], !1);
        void 0 != V && P.push(V);
      }
      return P.moveCnt;
    }
    function E(J, P) {
      if (J && J[4] && !(0 > J[0][0])) {
        var W = J[4],
          X = new mathlib.CubieCube();
        new mathlib.CubieCube();
        X.ori = 0;
        W = W[0].split(/ +/);
        for (J = W.length - 1; 0 <= J; J--) X.selfMoveStr(W[J], !0);
        X.selfConj();
        var V = [],
          Q = new b(),
          d = new mathlib.CubieCube();
        d.invFrom(X);
        var l = 0,
          D = 0,
          x = [],
          R = cubeutil.getProgress(X, P);
        for (J = 0; J < W.length; J++) {
          var G = X.selfMoveStr(W[J], !1);
          if (void 0 != G) {
            D = Math.min(D, X.tstamp);
            Q.push(G);
            var L = ~~(G / 3);
            x.push(["URFDLB".charAt(L % 6) + " 2'".charAt(G % 3), X.tstamp]);
            6 <= L &&
              x.push(["DLBURF".charAt(L % 6) + "'2 ".charAt(G % 3), X.tstamp]);
          }
          G = cubeutil.getProgress(X, P);
          if (G < R) {
            L = new mathlib.CubieCube();
            mathlib.CubieCube.CubeMult(d, X, L);
            for (
              V[--R] = [l, D, X.tstamp, Q.moveCnt, L, x, Q.moves.slice()];
              R > G;

            )
              V[--R] = [
                X.tstamp,
                X.tstamp,
                X.tstamp,
                0,
                new mathlib.CubieCube(),
                [],
                [],
              ];
            d.invFrom(X);
            l = X.tstamp;
            Q.clear();
            x = [];
            D = 1e9;
          }
        }
        for (J = 0; J < V.length; J++)
          if (1 == V[J][3]) {
            for (W = J + 1; W < V.length && 0 == V[W][3]; ) W++;
            if (W == V.length) break;
            Q.clear();
            X = V[J][2];
            Array.prototype.push.apply(V[W][5], V[J][5]);
            Array.prototype.push.apply(V[W][6], V[J][6]);
            for (d = 0; d < V[W][6].length; d++) Q.push(V[W][6][d]);
            for (d = 0; d < V[J][5].length; d++)
              V[W][4].selfMoveStr(V[J][5][d][0], !1);
            V[W][2] = X;
            V[W][3] = Q.moveCnt;
            V[J] = [X, X, X, 0, new mathlib.CubieCube(), [], []];
          }
        P = cubeutil.getStepCount(P);
        Q = [];
        for (J = 0; J < P; J++) Q[J] = (V[J] || [])[5] || [];
        return { data: V, rawMoves: Q.reverse() };
      }
    }
    function n(J, P, W, X, V) {
      for (var Q = 0, d = 0, l = [], D = [], x = 0; x < J.length; x++) {
        d += J[x][1] + J[x][2];
        var R = J[x][0].split("-");
        (0 != l.length && l.at(-1)[0] == R[0]) || l.push([R[0], 0, 0, 0]);
        D[x] = l.length - 1;
        R = l.at(-1);
        for (var G = 1; 4 > G; G++) R[G] += J[x][G];
        Q = Math.max(R[1] + R[2], Q);
      }
      R = [];
      var L = 0,
        F = 0;
      G = 0;
      var K = -1;
      for (x = 0; x < J.length; x++) {
        var M = J[x];
        L += M[1];
        F += M[2];
        G += M[3];
        if (D[x] == D[x + 1] && D[x] != D[x - 1]) {
          K = D[x];
          var S = l[K];
          R.push(
            $.format(
              '<tr style="{0}" data="{1}"><td rowspan=2 class="{8}" style="padding-bottom:0;padding-top:0;">{1}</td><td colspan=4 style="padding:0;"><span class="cntbar sty2" style="height:0.2em;float:left;border:none;width:{2}%;">&nbsp;</span><span class="cntbar" style="height:0.2em;float:left;border:none;width:{3}%;">&nbsp;</span></td></tr><tr style="{0}" data="{1}"><td style="padding-bottom:0;padding-top:0;">{4}</td><td style="padding-bottom:0;padding-top:0;">{5}</td><td style="padding-bottom:0;padding-top:0;">{6}</td><td style="padding-bottom:0;padding-top:0;">{7}</td></tr>',
              [
                "",
                S[0],
                (S[1] / Q) * 100,
                (S[2] / Q) * 100,
                W
                  ? Math.round((S[1] / d) * 1e3) / 10 + "%"
                  : kernel.pretty(S[1]),
                W
                  ? Math.round((S[2] / d) * 1e3) / 10 + "%"
                  : kernel.pretty(S[2]),
                Math.round(10 * S[3]) / 10,
                0 < S[3] && 0 < S[1] + S[2]
                  ? Math.round((S[3] / (S[1] + S[2])) * 1e4) / 10
                  : "N/A",
                "click sstep",
              ]
            )
          );
        }
        R.push(
          $.format(
            '<tr style="{0}" data="{1}"><td rowspan=2 class="{8}" style="padding-bottom:0;padding-top:0;">{1}</td><td colspan=4 style="padding:0;"><span class="cntbar sty2" style="height:0.2em;float:left;border:none;width:{2}%;">&nbsp;</span><span class="cntbar" style="height:0.2em;float:left;border:none;width:{3}%;">&nbsp;</span></td></tr><tr style="{0}" data="{1}"><td style="padding-bottom:0;padding-top:0;">{4}</td><td style="padding-bottom:0;padding-top:0;">{5}</td><td style="padding-bottom:0;padding-top:0;">{6}</td><td style="padding-bottom:0;padding-top:0;">{7}</td></tr>',
            [
              D[x] == K ? "display:none;" : "",
              M[0],
              (M[1] / Q) * 100,
              (M[2] / Q) * 100,
              W ? Math.round((M[1] / d) * 1e3) / 10 + "%" : kernel.pretty(M[1]),
              W ? Math.round((M[2] / d) * 1e3) / 10 + "%" : kernel.pretty(M[2]),
              Math.round(10 * M[3]) / 10,
              0 < M[3] && 0 < M[1] + M[2]
                ? Math.round((M[3] / (M[1] + M[2])) * 1e4) / 10
                : "N/A",
              -1 != ["oll", "pll", "zbll"].indexOf(M[0]) ? "click" : "",
            ]
          )
        );
      }
      J = $("<tr>").append(
        P ? $("<td>").append(v) : $('<td style="padding:0;">').append(A),
        "<td>" +
          (W ? Math.round((L / d) * 1e3) / 10 + "%" : kernel.pretty(L)) +
          "</td><td>" +
          (W ? Math.round((F / d) * 1e3) / 10 + "%" : kernel.pretty(F)) +
          "</td>",
        $("<td>").append(X || V ? H : Math.round(10 * G) / 10),
        "<td>" +
          (0 < G && 0 < L + F ? Math.round((G / (L + F)) * 1e4) / 10 : "N/A") +
          "</td>"
      );
      y.empty().append(u);
      u.after(R.join(""), J);
      A.unbind("change").change(e);
      w.unbind("change").change(e);
      y.unbind("click").click(e);
      v.text("No." + P);
      (X || V) &&
        H.children("a")
          .attr(
            "href",
            "https://alg.cubing.net/?alg=" +
              encodeURIComponent(V) +
              "&setup=" +
              encodeURIComponent(X)
          )
          .text(Math.round(10 * G) / 10);
    }
    function C(J) {
      y.empty().append(u);
      u.after(
        $("<tr>").append(
          J ? $("<td>").append(v) : $('<td style="padding:0;">').append(A),
          "<td colspan=4>" + TOOLS_RECONS_NODATA + "</td>"
        )
      );
      A.unbind("change").change(e);
      w.unbind("change").change(e);
      y.unbind("click").click(e);
      v.text("---");
    }
    function c(J, P) {
      (q = void 0 != J) &&
        !/^scr/.exec(P) &&
        (J.empty().append(r.append(y)), g());
    }
    function k(J, P) {
      if (q) {
        var W = w.val() || "cf4op";
        J = W.endsWith("%");
        W = W.replace("%", "");
        var X = P[0],
          V = E(X, W);
        if (V) {
          for (
            var Q = V.data,
              d = cubeutil.getStepNames(W),
              l = [],
              D = d.length - 1;
            0 <= D;
            D--
          ) {
            var x = Q[D] || [0, 0, 0, 0];
            l.push([d[D], x[1] - x[0], x[2] - x[1], x[3]]);
          }
          W = cubeutil.getPrettyReconstruction(V.rawMoves, W).prettySolve;
          n(l, P[1] + 1, J, X[1], W);
        } else C(!0);
      }
    }
    function g() {
      if (q) {
        var J = stats.getTimesStatsTable().timesLen,
          P = A.val();
        if (
          (P =
            "single" == P
              ? Math.min(1, J)
              : "mo5" == P
              ? Math.min(5, J)
              : "mo12" == P
              ? Math.min(12, J)
              : "mo100" == P
              ? Math.min(100, J)
              : J)
        ) {
          var W = w.val() || "cf4op",
            X = W.endsWith("%");
          W = W.replace("%", "");
          for (
            var V = cubeutil.getStepNames(W), Q = 0, d = [], l = J - 1;
            l >= J - P;
            l--
          ) {
            var D = stats.getExtraInfo("recons_" + W, l);
            if (D) {
              var x = D.data;
              Q++;
              for (var R = V.length - 1; 0 <= R; R--) {
                var G = x[R] || [0, 0, 0, 0],
                  L = V.length - R - 1;
                d[L] = d[L] || [V[R], 0, 0, 0];
                d[L][1] += G[1] - G[0];
                d[L][2] += G[2] - G[1];
                d[L][3] += G[3];
              }
            }
          }
          if (0 == Q) C(!1);
          else {
            for (R = 0; R < V.length; R++)
              (d[R][1] /= Q), (d[R][2] /= Q), (d[R][3] /= Q);
            1 == P
              ? ((P = cubeutil.getPrettyReconstruction(
                  D.rawMoves,
                  W
                ).prettySolve),
                n(d, null, X, stats.timesAt(J - 1)[1], P))
              : n(d, null, X);
          }
        } else C(!1);
      }
    }
    function f() {
      var J = $jscomp.makeIterator(caseStat.update()),
        P = J.next().value;
      J = J.next().value;
      J = J.map(function (X) {
        return {
          caseId: X[0],
          caseName: X[1],
          count: X[2],
          inspPct: Number(X[3]),
          execPct: Number(X[4]),
          insp: Number(X[5]),
          exec: Number(X[6]),
          turns: Number(X[7]),
          tps: Number(X[8]),
          caseImage: X[9],
        };
      });
      var W = new Blob([JSON.stringify(J)], { type: "application/json" });
      J = URL.createObjectURL(W);
      z.attr({ href: J, download: P + "_cases_stats.json" })
        .get(0)
        .click();
      setTimeout(function () {
        URL.revokeObjectURL(W);
      }, 5e3);
      return !1;
    }
    function a(J) {
      kernel.setProp("rcCaseMthd", ("ZBLL" == J ? "cf3zb_" : "cf4op_") + J);
      caseStat.execFunc(I);
      J = function () {
        caseStat.execFunc();
      };
      kernel.showDialog(
        [O, J, void 0, J, [EXPORT_TOFILE, f]],
        "casestats",
        "Cases Stats"
      );
    }
    function e(J) {
      if ("change" == J.type) kernel.setProp("rcMthd", w.val()), g();
      else {
        J = $(J.target);
        if (-1 != ["oll", "pll", "zbll"].indexOf(J.text()))
          return a(J.text().toUpperCase());
        if (J.is(".click") && !J.is(".exturl"))
          if (J.is(".sstep")) {
            J = J.parent();
            var P = J.attr("data") + "-";
            for (J = J.next().next(); J && J.attr("data").startsWith(P); )
              J.toggle(), (J = J.next());
          } else g();
      }
    }
    function h(J, P, W, X, V) {
      return (J = stats.getExtraInfo("recons_" + J, V))
        ? (J.data[W[0]] || [0, 0, 0, 0])[W[1]] -
            (J.data[P[0]] || [0, 0, 0, 0])[P[1]]
        : -1;
    }
    function p(J, P, W, X) {
      J = stats.getExtraInfo("recons_" + J, X);
      if (!J) return -1;
      for (X = W = 0; X < J.data.length; X++) {
        var V = J.data[X] || [0, 0, 0, 0];
        W += P ? V[1] - V[0] : V[2] - V[1];
      }
      return W;
    }
    var q,
      m = TOOLS_RECONS_TITLE.split("|"),
      r = $('<div style="font-size:0.9em;">'),
      H = $("<div>").append('<a target="_blank" class="exturl click"></a>'),
      y = $('<table class="table">'),
      A = $("<select>"),
      w = $("<select>"),
      v = $('<span class="click">'),
      u = $("<tr>").append(
        $('<th style="padding:0;">').append(w),
        "<th>" +
          m[0] +
          "</th><th>" +
          m[1] +
          "</th><th>" +
          m[2] +
          "</th><th>" +
          m[3] +
          "</th>"
      );
    b.prototype.push = function (J) {
      var P = ~~(J / 3),
        W = 1 << P;
      P % 3 != this.lastMove % 3 && ((this.lastMove = P), (this.lastPow = 0));
      this.moveCnt += (this.lastPow & W) == W ? 0 : 1;
      this.lastPow |= W;
      this.moves.push(J);
    };
    b.prototype.clear = function () {
      this.lastPow = 0;
      this.lastMove = -3;
      this.moveCnt = 0;
      this.moves = [];
    };
    N.prototype.push = function (J) {
      var P = ~~(J / 3);
      P != this.lastAxis && ((this.lastAxis = P), (this.lastPow = 0));
      J = (this.lastPow + ((J % 3) + 1)) % 4;
      P = 6 <= P ? 2 : 1;
      this.moveCnt += (0 == J ? 0 : P) - (0 == this.lastPow ? 0 : P);
      this.lastPow = J;
    };
    N.prototype.clear = function () {
      this.lastPow = 0;
      this.lastAxis = -3;
      this.moveCnt = 0;
    };
    var I = $("<div>").css("padding", "1em"),
      z = $("<a>").css("display", "none"),
      O = $("<div>").append(I, z);
    $(function () {
      "undefined" != typeof tools &&
        tools.regTool("recons", TOOLS_RECONS + ">step", c);
      kernel.regListener("recons", "reqrec", k);
      for (
        var J = ["single", "mo5", "mo12", "mo100", "all"], P = 0;
        P < J.length;
        P++
      )
        A.append('<option value="' + J[P] + '">' + J[P] + "</option>");
      J = [
        ["cf4op", "cfop"],
        ["roux", "roux"],
        ["cf3zb", "cfzb"],
      ];
      for (P = 0; P < J.length; P++)
        w.append('<option value="' + J[P][0] + '">' + J[P][1] + "</option>"),
          w.append(
            '<option value="' + J[P][0] + '%">' + J[P][1] + "%</option>"
          );
      w.val(kernel.getProp("rcMthd", "cf4op"));
    });
    (function () {
      stats.regUtil("recons", g);
      stats.regExtraInfo("recons_n", function (J) {
        return E(J, "n");
      });
      stats.regExtraInfo("recons_cf4op", function (J) {
        return E(J, "cf4op");
      });
      stats.regExtraInfo("recons_roux", function (J) {
        return E(J, "roux");
      });
      stats.regExtraInfo("recons_cf3zb", function (J) {
        return E(J, "cf3zb");
      });
      stats.regExtraInfo(
        "recons_cfop_ct",
        h.bind(null, "cf4op", [6, 0], [6, 2]),
        ["cross " + STATS_TIME, kernel.pretty]
      );
      stats.regExtraInfo(
        "recons_cfop_ft",
        h.bind(null, "cf4op", [5, 0], [2, 2]),
        ["F2L " + STATS_TIME, kernel.pretty]
      );
      stats.regExtraInfo(
        "recons_cfop_ot",
        h.bind(null, "cf4op", [1, 0], [1, 2]),
        ["OLL " + STATS_TIME, kernel.pretty]
      );
      stats.regExtraInfo(
        "recons_cfop_pt",
        h.bind(null, "cf4op", [0, 0], [0, 2]),
        ["PLL " + STATS_TIME, kernel.pretty]
      );
      stats.regExtraInfo("recons_cfop_it", p.bind(null, "cf4op", !0), [
        "CFOP " + m[0],
        kernel.pretty,
      ]);
      stats.regExtraInfo("recons_cfop_et", p.bind(null, "cf4op", !1), [
        "CFOP " + m[1],
        kernel.pretty,
      ]);
      stats.regExtraInfo(
        "mvcnt_htm",
        function (J, P) {
          return J && J[4] ? t(J[4][0]) : -1;
        },
        [
          "HTM",
          function (J) {
            return (
              "" +
              (0 <= J
                ? J.toFixed(kernel.getProp("useMilli") ? 3 : 2).replace(
                    /\.?0+$/,
                    ""
                  )
                : "N/A")
            );
          },
          function (J) {
            return (
              "" +
              (0 <= J ? J.toFixed(kernel.getProp("useMilli") ? 3 : 2) : "N/A")
            );
          },
        ]
      );
      stats.regExtraInfo(
        "recons_n_fps",
        function (J, P) {
          P = stats.getExtraInfo("mvcnt_htm", P);
          return !P || -1 == P || 0 > J[0][0]
            ? -1
            : 1e9 - (P / Math.max(1, J[0][1])) * 1e3;
        },
        [
          "FPS",
          function (J) {
            return (
              "" +
              (0 < J
                ? (1e9 - J).toFixed(kernel.getProp("useMilli") ? 3 : 2)
                : "N/A")
            );
          },
        ]
      );
      stats.regExtraInfo(
        "mvcnt_lfmc",
        function (J, P) {
          return J && J[4] ? t(J[4][0], "lfmc") : -1;
        },
        [
          "Linear FMC",
          function (J) {
            return (
              "" +
              (0 <= J
                ? J.toFixed(kernel.getProp("useMilli") ? 3 : 2).replace(
                    /\.?0+$/,
                    ""
                  )
                : "N/A")
            );
          },
          function (J) {
            return (
              "" +
              (0 <= J ? J.toFixed(kernel.getProp("useMilli") ? 3 : 2) : "N/A")
            );
          },
        ]
      );
    })();
    return { calcRecons: E, getMoveCnt: t };
  }),
  caseStat = execMain(function () {
    function b() {
      if (C) {
        for (
          var h = stats.getTimesStatsTable().timesLen,
            p = f.val() || "cf4op_PLL",
            q = p.split("_")[1],
            m = cubeutil.getIdentData(q),
            r = 0,
            H = [],
            y = h - 1;
          y >= h - h;
          y--
        ) {
          var A = stats.getExtraInfo("recons_" + p, y);
          if (A) {
            r++;
            var w = A[0];
            H[w] = H[w] || [0, 0, 0, 0];
            var v = [1].concat(A.slice(1));
            for (A = 0; 4 > A; A++) H[w][A] += v[A];
          }
        }
        g.empty().append(a.unbind("click").click(t));
        p = 0;
        for (A = m[2]; A < m[3]; A++)
          H[A] && (p = Math.max(p, (H[A][1] + H[A][2]) / H[A][0]));
        h = [];
        for (A = m[2]; A < m[3]; A++)
          H[A] &&
            ((y = H[A]),
            (w = m[1](A)),
            h.push([
              A,
              w[2],
              y[0],
              (y[1] / y[0] / p) * 100,
              (y[2] / y[0] / p) * 100,
              kernel.pretty(y[1] / y[0]),
              kernel.pretty(y[2] / y[0]),
              Math.round((y[3] / y[0]) * 10) / 10,
              Math.round((y[3] / (y[1] + y[2])) * 1e4) / 10,
            ]));
        var u = kernel.getProp("rcCaseSortCol", 2),
          I = kernel.getProp("rcCaseSortDir", "desc");
        h.sort(function (z, O) {
          "desc" == I &&
            ((O = $jscomp.makeIterator([O, z])),
            (z = O.next().value),
            (O = O.next().value));
          return z[u] - O[u];
        });
        H = $jscomp.makeIterator(h);
        for (A = H.next(); !A.done; A = H.next())
          (A = A.value),
            (p = $(
              $.format(
                '<tr><td rowspan=2 style="padding-bottom:0;padding-top:0;">{1}</td><td rowspan=2 style="padding:0;width:2em;"><img/></td><td rowspan=2 style="padding-bottom:0;padding-top:0;">{2}</td><td colspan=4 style="padding:0;"><span class="cntbar sty2" style="height:0.25em;float:left;border:none;width:{3}%;">&nbsp;</span><span class="cntbar" style="height:0.25em;float:left;border:none;width:{4}%;">&nbsp;</span></td></tr><tr><td style="padding-bottom:0;padding-top:0;">{5}</td><td style="padding-bottom:0;padding-top:0;">{6}</td><td style="padding-bottom:0;padding-top:0;">{7}</td><td style="padding-bottom:0;padding-top:0;">{8}</td></tr>',
                A
              )
            )),
            (y = p.find("img")),
            y.css({ width: "2em", height: "2em", display: "block" }),
            m[1](A[0], y),
            A.push(y.attr("src")),
            g.append(p);
        f.unbind("change").change(N);
        return 0 == r
          ? (a.after("<tr><td colspan=7>" + TOOLS_RECONS_NODATA + "</td></tr>"),
            [q, []])
          : [q, h];
      }
    }
    function N(h) {
      kernel.setProp("rcCaseMthd", f.val());
      b();
    }
    function t(h) {
      if ((h = $(h.target).data("sort-column"))) {
        var p = kernel.getProp("rcCaseSortCol");
        kernel.setProp("rcCaseSortCol", h);
        p == h &&
          kernel.setProp(
            "rcCaseSortDir",
            "desc" == kernel.getProp("rcCaseSortDir") ? "asc" : "desc"
          );
        b();
      }
    }
    function E(h, p) {
      (C = void 0 != h) &&
        !/^scr/.exec(p) &&
        (h.empty().append(k.append(g)),
        f.val(kernel.getProp("rcCaseMthd", "cf4op_PLL")),
        b());
    }
    function n(h, p, q, m) {
      if ((h = stats.getExtraInfo("recons_" + h, m)))
        if (((p = cubeutil.getIdentData(p)), (h = h.data[p[4]])))
          return (
            (e = e || new mathlib.CubieCube()),
            e.invFrom(h[4]),
            [p[0](e.toFaceCube()), h[1] - h[0], h[2] - h[1], h[3]]
          );
    }
    var C,
      c = TOOLS_RECONS_TITLE.split("|"),
      k = $('<div style="font-size:0.9em;">'),
      g = $('<table class="table">'),
      f = $("<select>"),
      a = $("<tr>").append(
        $("<th>").attr("colspan", 2).css("padding", "0").append(f),
        $("<th>").addClass("click").attr("data-sort-column", 2).append("N"),
        $("<th>").addClass("click").attr("data-sort-column", 5).append(c[0]),
        $("<th>").addClass("click").attr("data-sort-column", 6).append(c[1]),
        $("<th>").addClass("click").attr("data-sort-column", 7).append(c[2]),
        $("<th>").addClass("click").attr("data-sort-column", 8).append(c[3])
      ),
      e;
    $(function () {
      "undefined" != typeof tools &&
        tools.regTool("casestat", TOOLS_RECONS + ">cases", E);
      stats.regUtil("casestat", b);
      [
        ["cf4op", "PLL"],
        ["cf4op", "OLL"],
        ["cf3zb", "ZBLL"],
      ].forEach(function (h) {
        f.append(
          '<option value="' + h[0] + "_" + h[1] + '">' + h[1] + "</option>"
        );
        stats.regExtraInfo(
          "recons_" + h[0] + "_" + h[1],
          n.bind(null, h[0], h[1])
        );
      });
    });
    return { execFunc: E, update: b };
  }),
  scatter = execMain(function () {
    function b() {
      a.html(TOOLS_RECONS_NODATA);
      f.unbind("change").change(n);
      g.hide();
    }
    function N(A, w) {
      if (!A || !A[4]) return b();
      A = recons.calcRecons(A, w);
      if (!A) return b();
      g.show();
      k = c[0].getContext("2d");
      w = kernel.getProp("imgSize") / 10;
      h = 50;
      c.width(9.6 * w + "em");
      c.height(4.8 * w + "em");
      c.attr("width", 8 * h + 1);
      c.attr("height", 4 * h + 5);
      p = 4 * h;
      h *= 8;
      w = A.data[0][2];
      for (var v = 0, u = 0; u < A.data.length; u++) v += A.data[u][5].length;
      u = [0, 1, 1, 0, 0];
      var I = [0, 0, 1, 1, 0];
      k.fillStyle = "#fff";
      k.beginPath();
      k.moveTo(u[0] * (h - 0), (1 - I[0]) * (p - 0));
      for (var z = 1; z < u.length; z++)
        k.lineTo(u[z] * (h - 0), (1 - I[z]) * (p - 0));
      k.fill();
      k.closePath();
      I = 0;
      z = [];
      var O = [],
        J = [],
        P = 0,
        W = 0;
      for (u = A.data.length - 1; 0 <= u; u--) {
        for (var X = A.data[u], V = 0; V < X[5].length; V++)
          if (
            (O.push(I / (v - 1)), z.push(X[5][V][1] / w), I++, 1 < z.length)
          ) {
            k.lineWidth = 3;
            var Q = "#888";
            z[1] - z[0] > 3 / (v - 1)
              ? ((Q = "#f00"), (P += z[1] - z[0]))
              : z[1] - z[0] > 2 / (v - 1) && ((Q = "#00f"), (W += z[1] - z[0]));
            var d = z,
              l = O;
            k.strokeStyle = Q;
            k.beginPath();
            for (Q = 0; Q < d.length; Q++)
              (d[Q] = (d[Q] - q) / m), (l[Q] = (l[Q] - r) / H);
            k.moveTo(d[0] * (h - 0), (1 - l[0]) * (p - 0));
            for (Q = 1; Q < d.length; Q++)
              k.lineTo(d[Q] * (h - 0), (1 - l[Q]) * (p - 0));
            k.stroke();
            k.closePath();
            z = z.slice(z.length - 1);
            O = O.slice(O.length - 1);
          }
        0 != u && J.push([z[0] * (h - 0), (1 - O[0]) * (p - 0)]);
      }
      for (u = 0; u < J.length; u++)
        (k.strokeStyle = "#000"),
          (k.lineWidth = 1),
          k.beginPath(),
          k.arc(J[u][0], J[u][1], 4, 0, 2 * Math.PI),
          k.stroke(),
          k.closePath();
      a.html(
        " " +
          '<span style="color:#f00">$</span>'.replace(
            "$",
            kernel.pretty(P * w)
          ) +
          " " +
          '<span style="color:#00f">$</span>'.replace(
            "$",
            kernel.pretty(W * w)
          ) +
          " " +
          '<span style="color:#888">$</span>'.replace(
            "$",
            kernel.pretty((1 - P - W) * w)
          )
      );
    }
    function t() {
      if (e && c[0].getContext) {
        var A = stats.getTimesStatsTable().timesLen;
        N(stats.timesAt(A - 1), f.val() || "cf4op");
      }
    }
    function E(A, w) {
      e && c[0].getContext && N(w[0], f.val() || "cf4op");
    }
    function n(A) {
      if ("change" == A.type) return t();
      var w = $(A.target);
      w.hasClass("click") &&
        ((A = w.attr("data")),
        "x" == A
          ? ((y = "y"), w.attr("data", "y"), w.html(""))
          : "y" == A
          ? ((y = "x"), w.attr("data", "x"), w.html(""))
          : ((w = { p: 1, m: -1 }[A] || 0),
            (A = { l: Math.sqrt(0.5), s: Math.sqrt(2) }[A] || 1),
            "x" == y
              ? ((q += w * m * 0.25 + (m * (1 - A)) / 2),
                (m *= A),
                (m = Math.min(Math.max(m, 0.1), 1)),
                (q = Math.min(Math.max(q, 0), 1 - m)))
              : ((r += w * H * 0.25 + (H * (1 - A)) / 2),
                (H *= A),
                (H = Math.min(Math.max(H, 0.1), 1)),
                (r = Math.min(Math.max(r, 0), 1 - H))),
            t()));
    }
    function C(A, w) {
      (e = void 0 != A) &&
        !/^scr/.exec(w) &&
        (A.empty().append(f, a, g.empty().append(c).unbind("click").click(n)),
        f.unbind("change").change(n),
        t());
    }
    var c = $("<canvas>"),
      k,
      g = $('<div style="text-align:center">'),
      f = $("<select>"),
      a = $('<span style="font-size:0.8em;">'),
      e = !1,
      h,
      p,
      q = 0,
      m = 1,
      r = 0,
      H = 1,
      y = "x";
    $(function () {
      "undefined" != typeof tools &&
        c[0].getContext &&
        tools.regTool("scatter", TOOLS_RECONS + ">scatter", C);
      stats.regUtil("scatter", t);
      kernel.regListener("scatter", "reqrec", E);
      for (
        var A = [
            ["cf4op", "cfop"],
            ["roux", "roux"],
            ["cf3zb", "cfzb"],
          ],
          w = 0;
        w < A.length;
        w++
      )
        f.append('<option value="' + A[w][0] + '">' + A[w][1] + "</option>");
    });
    return { update: t };
  });
var trainStat = execMain(function () {
  function b(a, e) {
    return stats.timeAt(a[e]);
  }
  function N() {
    if (C) {
      for (
        var a = stats.getTimesStatsTable().timesLen,
          e = g.val() || "PLL",
          h = cubeutil.getIdentData(e),
          p = 0,
          q = [],
          m = a - 1;
        m >= a - a;
        m--
      ) {
        var r = stats.getExtraInfo("scramcase_" + e, m);
        r && ((r = r[0]), (q[r] = q[r] || []), q[r].push(m));
      }
      k.empty().append(f);
      a = 0;
      for (e = h[2]; e < h[3]; e++)
        if (q[e]) {
          m = new TimeStat([], q[e].length, b.bind(null, q[e]));
          var H = m.getAllStats();
          r = q[e].length - H[0];
          0 == r
            ? (q[e] = null)
            : ((H = H[1]),
              (q[e] = [m.bestTime, H, r, q[e].length]),
              (a = Math.max(a, H)));
        }
      for (e = h[2]; e < h[3]; e++)
        if (q[e]) {
          m = q[e];
          $("<tr>");
          r = [
            h[1](e)[2],
            m[2] + "/" + m[3],
            (m[0] / a) * 100,
            ((m[1] - m[0]) / a) * 100,
            kernel.pretty(m[0]),
            kernel.pround(m[1]),
          ];
          m =
            '<tr><td rowspan=2 style="padding-bottom:0;padding-top:0;">$0</td><td rowspan=2 style="padding:0"><img/></td><td rowspan=2 style="padding-bottom:0;padding-top:0;">$1</td><td colspan=4 style="padding:0;"><span class="cntbar" style="height:0.25em;float:left;border:none;width:$2%;">&nbsp;</span><span class="cntbar sty2" style="height:0.25em;float:left;border:none;width:$3%;">&nbsp;</span></td></tr><tr><td style="padding-bottom:0;padding-top:0;">$4</td><td style="padding-bottom:0;padding-top:0;">$5</td></tr>';
          for (H = 0; 6 > H; H++)
            m = m.replace(new RegExp("\\$" + H, "g"), r[H]);
          m = $(m);
          r = m.find("img");
          r.css({ width: "2em", height: "2em", display: "block" });
          h[1](e, r);
          k.append(m);
          p++;
        }
      g.unbind("change").change(t);
      0 == p &&
        f.after("<tr><td colspan=5>" + TOOLS_RECONS_NODATA + "</td></tr>");
    }
  }
  function t(a) {
    "change" == a.type && N();
  }
  function E(a, e) {
    (C = void 0 != a) &&
      !/^scr/.exec(e) &&
      (a.empty().append(c.append(k)), N());
  }
  function n(a, e, h) {
    if ((e = cubeutil.getScrambledState([null, e[1]])))
      return [cubeutil.getIdentData(a)[0](e.toFaceCube())];
  }
  var C,
    c = $('<div style="font-size:0.9em;" />'),
    k = $('<table class="table">'),
    g = $("<select>"),
    f = $("<tr>").append(
      $('<th colspan=2 style="padding:0;">').append(g),
      "<th>N</th><th>best</th><th>mean</th>"
    );
  $(function () {
    "undefined" != typeof tools &&
      tools.regTool("trainstat", TOOLS_TRAINSTAT, E);
    stats.regUtil("trainstat", N);
    for (
      var a = ["PLL", "OLL", "COLL", "ZBLL", "CLL"], e = 0;
      e < a.length;
      e++
    )
      g.append('<option value="' + a[e] + '">' + a[e] + "</option>"),
        stats.regExtraInfo("scramcase_" + a[e], n.bind(null, a[e]));
  });
});
var tools = (function () {
  function b(c) {
    return /^222(so|[236o]|eg[012]?|tc[np]?|lsall|nb)$/.exec(c)
      ? "222"
      : /^(333(oh?|ni|f[mt]|drud|custom)?|(z[zb]|[coep]|c[om]|2g|ls|tt)?ll|lse(mu)?|2genl?|3gen_[LF]|edges|corners|f2l|lsll2|(zb|w?v|eo)ls|roux|RrU|half|easyx?c|eoline|eocross|sbrx|mt(3qb|eole|tdr|6cp|l5ep|cdrll)|nocache_333(bld|pat)spec)$/.exec(
          c
        )
      ? "333"
      : /^(444([mo]|wca|yj|bld|ctud|ctrl|ud3c|l8e|rlda|rlca|edo|cto|e?ll)?|4edge|RrUu)$/.exec(
          c
        )
      ? "444"
      : /^(555(wca|bld)?|5edge)$/.exec(c)
      ? "555"
      : /^(666(si|[sp]|wca)?|6edge)$/.exec(c)
      ? "666"
      : /^(777(si|[sp]|wca)?|7edge)$/.exec(c)
      ? "777"
      : /^pyr(s?[om]|l4e|nb|4c)$/.exec(c)
      ? "pyr"
      : /^skb(s?o|nb)?$/.exec(c)
      ? "skb"
      : /^sq(rs|1pll|1[ht]|rcsp)$/.exec(c)
      ? "sq1"
      : /^clk(wcab?|o|nf)$/.exec(c)
      ? "clk"
      : /^(mgmp|mgmo|mgmc|minx2g|mlsll|mgmpll|mgmll)$/.exec(c)
      ? "mgm"
      : /^(klmso|klmp)$/.exec(c)
      ? "klm"
      : /^(fto|fto(so|l[34]t|tcp|edge|cent|corn))$/.exec(c)
      ? "fto"
      : /^(mpyr|mpyrso)$/.exec(c)
      ? "mpyr"
      : /^15p(at|ra?p?)?$/.exec(c)
      ? "15p"
      : /^15p(rmp|m)$/.exec(c)
      ? "15b"
      : /^8p(at|ra?p?)?$/.exec(c)
      ? "8p"
      : /^8p(rmp|m)$/.exec(c)
      ? "8b"
      : /^heli2x2g?$/.exec(c)
      ? "heli2x2"
      : /^prc[po]$/.exec(c)
      ? "prc"
      : /^redi(m|so)?$/.exec(c)
      ? "redi"
      : c;
  }
  var N = ["-", "", 0],
    t = ISCSTIMER
      ? execMain(function () {
          function c(v, u) {
            if (-1 == v) for (v = 0; v < kernel.getProp("NTools"); v++) c(v, u);
            else if (!p) {
              for (var I in w) w[I]();
              q[v].empty();
            } else for (I in w) if (I == m[v]) w[I](q[v], u);
          }
          function k(v, u) {
            for (var I in w) if (I == m[v]) w[I](void 0, u);
          }
          function g(v, u) {
            DEBUG && console.log("[func select]", v, u);
            kernel.blur();
            u = void 0 === v ? 4 : v + 1;
            for (v = void 0 === v ? 0 : v; v < u; v++) {
              var I = H[v].getSelected();
              m[v] != I &&
                (k(v, "property"),
                (m[v] = I),
                kernel.setProp("toolsfunc", JSON.stringify(m)),
                c(v, "property"));
            }
          }
          function f(v, u) {
            if ("property" == v)
              if (/^(img|col).*/.exec(u[0]))
                for (var I = 0; I < kernel.getProp("NTools"); I++)
                  "image" == m[I] && c(I, v);
              else if ("NTools" == u[0])
                for (I = 0; 4 > I; I++)
                  I < u[1]
                    ? (h[I].show(), "" == q[I].html() && c(I, v))
                    : (h[I].hide(), k(I, v));
              else if ("toolHide" == u[0])
                for (I = !u[1], v = 0; 4 > v; v++)
                  I ? r[v].show() : r[v].hide();
              else if ("toolsfunc" == u[0] && "session" == u[2]) {
                v = JSON.parse(u[1]);
                for (I = 0; 4 > I; I++) H[I].loadVal(v[I]);
                g();
              } else
                "toolPos" == u[0] &&
                  ($("html").removeClass("toolf toolt"),
                  -1 != "ft".indexOf(u[1]) &&
                    $("html").addClass("tool" + u[1]));
            else if ("scramble" == v || "scrambleX" == v)
              (N = u),
                kernel.setProp("isTrainScr", !!E.exec((N || [])[0])),
                c(-1, v);
            else if ("button" == v && "tools" == u[0])
              if ((p = u[1]))
                for (I = 0; I < kernel.getProp("NTools"); I++)
                  p && "" == q[I].html() && c(I, v);
              else c(-1, v);
          }
          function a(v) {
            $(v.target).is("input,textarea,select,.click") ||
              kernel.setProp("toolHide", !1);
          }
          function e(v) {
            v = $(this);
            if ("a" == v.attr("data"))
              v.prevAll().show(), v.prev().hide(), v.hide();
            else if ("n" == v.attr("data")) {
              var u = v.prevAll(":hidden");
              u.last().show();
              1 == u.length && (v.next().hide(), v.hide());
            }
          }
          for (
            var h = [],
              p = !1,
              q = [],
              m = ["image", "stats", "cross"],
              r = [],
              H = [],
              y = [],
              A = 0;
            4 > A;
            A++
          )
            (q[A] = $("<div />")),
              (r[A] = $("<span />")),
              (H[A] = new kernel.TwoLvMenu(
                y,
                g.bind(null, A),
                $("<select />"),
                $("<select />")
              )),
              (h[A] = $("<div />").css("display", "inline-block"));
          $(function () {
            kernel.regListener(
              "tools",
              "property",
              f,
              /^(?:img(Size|Rep)|image|toolsfunc|NTools|col(?:cube|pyr|skb|sq1|mgm|fto|clk|15p|ico)|toolHide|toolPos)$/
            );
            kernel.regListener("tools", "scramble", f);
            kernel.regListener("tools", "scrambleX", f);
            kernel.regListener("tools", "button", f, /^tools$/);
            for (var v = $('<div id="toolsDiv"/>'), u = 0; 4 > u; u++)
              q[u].click(a),
                r[u].append(
                  "<br>",
                  TOOLS_SELECTFUNC,
                  H[u].select1,
                  H[u].select2
                ),
                h[u].append(q[u], r[u]).appendTo(v),
                1 == u && v.append("<br>");
            kernel.regProp(
              "tools",
              "toolPos",
              1,
              PROPERTY_TOOLPOS,
              ["b", ["b", "f", "t"], PROPERTY_TOOLPOS_STR.split("|")],
              1
            );
            kernel.regProp("tools", "solSpl", 0, PROPERTY_HIDEFULLSOL, [!1]);
            kernel.regProp(
              "tools",
              "imgSize",
              2,
              PROPERTY_IMGSIZE,
              [15, 5, 50],
              1
            );
            kernel.regProp("tools", "imgRep", 0, PROPERTY_IMGREP, [!0], 1);
            kernel.regProp("tools", "NTools", 2, PROPERTY_NTOOLS, [1, 1, 4], 1);
            u = JSON.stringify(["image", "stats", "cross", "distribution"]);
            kernel.regProp("tools", "toolsfunc", 5, PROPERTY_TOOLSFUNC, [u], 1);
            kernel.regProp(
              "tools",
              "isTrainScr",
              -6,
              "Is Train Scramble",
              [!1],
              0
            );
            var I = kernel.getProp("toolsfunc", u);
            -1 == I.indexOf("[") &&
              ((I = u.replace("image", I)), kernel.setProp("toolsfunc", I));
            m = JSON.parse(I);
            kernel.addWindow("tools", BUTTON_TOOLS, v, !1, !0, 6);
            kernel.regProp("ui", "toolHide", -1, "Hide Tools Selector", [!1]);
          });
          var w = {};
          return {
            regTool: function (v, u, I) {
              DEBUG && console.log("[regtool]", v, u);
              w[v] = I;
              u = u.split(">");
              if (2 == u.length) {
                I = -1;
                for (var z = 0; z < y.length; z++)
                  if (y[z][0] == u[0] && $.isArray(y[z][1])) {
                    I = z;
                    break;
                  }
                -1 != I ? y[I][1].push([u[1], v]) : y.push([u[0], [[u[1], v]]]);
              } else y.push([u[0], v]);
              $.delayExec(
                "toolreset",
                function () {
                  for (var O = 0; 4 > O; O++) H[O].reset(m[O]);
                },
                0
              );
            },
            getSolutionSpan: function (v) {
              for (var u = $("<span />"), I = 0; I < v.length; I++)
                u.append(
                  '<span style="display:none;">&nbsp;' + v[I] + "</span>"
                );
              kernel.getProp("solSpl")
                ? (u.append(
                    $('<span class="click" data="n">[+1]</span>').click(e)
                  ),
                  u.append(
                    $(
                      '<span class="click" data="a">[' + v.length + "f]</span>"
                    ).click(e)
                  ))
                : u.children().show();
              return u;
            },
          };
        })
      : {},
    E =
      /^((z[zb]|[coep]|c[om]|2g|ls|tt)?ll|lse(mu)?|2genl?|3gen_[LF]|333drud|f2l|lsll2|(zb|w?v|eo)ls|roux|eoline|eocross|sbrx|mt(3qb|eole|tdr|6cp|l5ep|cdrll)|222(eg[012]?|tc[np]|lsall))$/,
    n = {
      getCurScramble: function () {
        return N;
      },
      getCurPuzzle: function () {
        return b(N[0]);
      },
      scrambleType: function (c) {
        return null ==
          c.match(/^([\d]?[xyzFRUBLDfrubldSME]([w]|&sup[\d];)?[2']?\s*)+$/)
          ? "-"
          : c.match(/^([xyzFRU][2']?\s*)+$/)
          ? "222o"
          : c.match(/^([xyzFRUBLDSME][2']?\s*)+$/)
          ? "333"
          : c.match(/^(([xyzFRUBLDfru]|[FRU]w)[2']?\s*)+$/)
          ? "444"
          : c.match(/^(([xyzFRUBLDfrubld])[w]?[2']?\s*)+$/)
          ? "555"
          : "-";
      },
      puzzleType: b,
      carrot2poch: function (c) {
        return c.replace(/([+-])([+-]) /g, function (k, g, f) {
          return "R" + g + g + " D" + f + f + " ";
        });
      },
      isCurTrainScramble: function (c) {
        return !!E.exec((c || N || [])[0]);
      },
      isPuzzle: function (c, k) {
        k = k || N;
        var g = b(k[0]);
        k = k[1];
        return g
          ? g == c
          : "222" == c
          ? k.match(/^([xyzFRU][2']?\s*)+$/)
          : "333" == c
          ? k.match(/^([xyzFRUBLDSME][2']?\s*)+$/)
          : "444" == c
          ? k.match(/^(([xyzFRUBLDfru]|[FRU]w)[2']?\s*)+$/)
          : "555" == c
          ? k.match(/^(([xyzFRUBLDfrubld])[w]?[2']?\s*)+$/)
          : "skb" == c
          ? k.match(/^([RLUB]'?\s*)+$/)
          : "pyr" == c
          ? k.match(/^([RLUBrlub]'?\s*)+$/)
          : "sq1" == c
          ? k.match(/^$/)
          : "fto" == c
          ? k.match(/^(([FRUBLD]|(?:BL)|(?:BR))[']?\s*)+$/)
          : !1;
      },
    },
    C;
  for (C in n) t[C] = n[C];
  return t;
})();
var image = (function () {
  function b(y, A) {
    var w = A[0];
    "input" == w && (w = tools.scrambleType(A[1]));
    w = tools.puzzleType(w);
    var v = r.indexOf(w),
      u = 0;
    if (0 <= v) u = a.draw(y, v + 2, A[1]);
    else if ("cubennn" == w) a.draw(y, A[2], A[1]);
    else if (poly3d.udpolyre.exec(w))
      (u = 0),
        /^prc|giga|mgm|klm$/.exec(w)
          ? (u = 3)
          : "fto" == w
          ? (u = 255)
          : "ctico" == w && (u = 1048575),
        (u = q(y, w, A[1], u, "klm" == w ? 0.1 : 0));
    else if ("sq1" == w || "sq2" == w) u = f.scrImage(y, A[1], "sq2" == w);
    else if ("clk" == w) g(y, A[1]);
    else if ("15b" == w || "15p" == w) m(y, w[2], 4, A[1]);
    else if ("8b" == w || "8p" == w) m(y, w[1], 3, A[1]);
    else if (/^r(3(ni)?|23\d+w?|mngf)$/.exec(w)) {
      var I = [];
      A[1].replaceAll(
        /(?:^|\n)\s*(\d+|3oh|pyr|skb|sq1|clk|mgm)\)\s*([^\0]*?)\s*(?=\n.*\)|$)/g,
        function (P, W, X) {
          P = w.startsWith("r3")
            ? "333"
            : "rmngf" == w
            ? W.replace("3oh", "333").padEnd(3, W)
            : r[I.length];
          I.push([P, X, 0]);
        }
      );
      v = Math.ceil(Math.sqrt(I.length));
      A = Math.ceil(I.length / v);
      y.width = 240 * A;
      y.height = 150 * v;
      for (v = 0; v < I.length; v++) {
        var z = (v % A) * 240,
          O = 150 * ~~(v / A),
          J = new $.svg();
        b(J, I[v]);
        y.addElem(J.renderGroup(z, O, 240, 150));
        y.addText(
          (v + 1).toString(),
          [z, O],
          { font: "40px Arial", fill: kernel.getProp("col-font") },
          1
        );
      }
    } else return -1;
    return u;
  }
  function N(y, A) {
    var w = new $.svg();
    y = b(w, y);
    if (-1 == y) return !1;
    if (!A) return w;
    A = Math.min(1.6 / w.width, 1 / w.height) * kernel.getProp("imgSize") * 0.6;
    t.attr("src", "data:image/svg+xml;base64," + btoa(w.render()));
    t.width(w.width * A + "em");
    t.height(w.height * A + "em");
    if (y && kernel.getProp("imgRep")) {
      for (w = 0; w < y[1].length; w++) y[1][w] = y[1][w] + "@" + 1e3 * (w + 1);
      y[1] = y[1].join(" ");
      t.click(
        function (v) {
          replay.popupReplay.apply(null, v);
        }.bind(null, y)
      );
    } else
      t.click(
        function (v, u) {
          u = $('<img style="display:block;">');
          u.attr("src", "data:image/svg+xml;base64," + btoa(v.render()));
          u.css("object-fit", "contain");
          kernel.showDialog([u, $.noop, void 0, $.noop], "share", TOOLS_IMAGE);
        }.bind(null, w, A)
      );
    return !0;
  }
  var t,
    E = Math.sqrt(3) / 2,
    n = Math.PI,
    C = $.ctxRotate,
    c = $.ctxTransform,
    k = $.ctxDrawPolygon,
    g = (function () {
      var y =
          /([UD][RL]|ALL|[UDRLy]|all)(?:(\d[+-]?)|\((\d[+-]?),(\d[+-]?)\))?/,
        A = "UR DR DL UL U R D L ALL".split(" "),
        w = ["#f00", "#37b", "#5cf", "#ff0", "#850"];
      return function (v, u) {
        w = kernel.getProp("colclk").match(H);
        var I = u.split(/\s+/),
          z = clock.moveArr,
          O = 9;
        u = [0, 0, 0, 0];
        for (
          var J = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], P = 0;
          P < I.length;
          P++
        ) {
          var W = y.exec(I[P]);
          if (W)
            if ("y2" == W[0]) O = 9 - O;
            else {
              var X = A.indexOf(W[1]) + O;
              if (void 0 == W[2] && void 0 == W[3]) u[X % 9] = 1;
              else {
                var V = [];
                if ("all" == W[1]) {
                  var Q = ~~W[2][0] * ("+" == W[2][1] ? -1 : 1) + 12;
                  V.push(17 - O, Q);
                } else
                  W[2]
                    ? (Q = ~~W[2][0] * ("+" == W[2][1] ? 1 : -1) + 12)
                    : ((Q = ~~W[3][0] * ("+" == W[3][1] ? 1 : -1) + 12),
                      V.push(X, Q),
                      (Q = ~~W[4][0] * ("+" == W[4][1] ? -1 : 1) + 12),
                      (X = ((10 - (X % 9)) % 4) + 13 - O)),
                    V.push(X, Q);
                for (W = 0; W < V.length; W += 2)
                  for (X = 0; 14 > X; X++)
                    J[X] = (J[X] + z[V[W]][X] * V[W + 1]) % 12;
              }
            }
        }
        J = [
          J[0],
          J[3],
          J[6],
          J[1],
          J[4],
          J[7],
          J[2],
          J[5],
          J[8],
          12 - J[2],
          J[10],
          12 - J[8],
          J[9],
          J[11],
          J[13],
          12 - J[0],
          J[12],
          12 - J[6],
        ];
        u = [u[3], u[2], u[0], u[1], 1 - u[0], 1 - u[1], 1 - u[3], 1 - u[2]];
        v.width = 375;
        v.height = 180;
        I = [10, 30, 50];
        z = [10, 30, 50, 75, 95, 115];
        for (V = 0; 18 > V; V++) {
          P = (V + O) % 18;
          W = v;
          X = [w[1], w[2]][~~(V / 9)];
          Q = [3, z[~~(P / 3)], I[P % 3]];
          var d = c(
            C(
              [
                [1, 1, 0, -1, -1, -1, 1, 0],
                [0, -1, -8, -1, 0, 1, 1, 0],
              ],
              (J[V] / 6) * n
            ),
            Q
          );
          P = d[0];
          d = d[1];
          W.addElem(
            '<circle cx="' +
              P[7] +
              '" cy="' +
              d[7] +
              '" r="' +
              9 * Q[0] +
              '" style="fill:' +
              X +
              '" />'
          );
          X = [];
          X.push("M" + P[0] + " " + d[0]);
          X.push("Q" + P[1] + " " + d[1] + "," + P[2] + " " + d[2]);
          X.push("Q" + P[3] + " " + d[3] + "," + P[4] + " " + d[4]);
          X.push(
            "C" +
              P[5] +
              " " +
              d[5] +
              "," +
              P[6] +
              " " +
              d[6] +
              "," +
              P[0] +
              " " +
              d[0]
          );
          W.addElem(
            '<path d="' +
              X.join(" ") +
              '" style="fill:' +
              w[3] +
              ";stroke:" +
              w[0] +
              '" />'
          );
        }
        I = [20, 40];
        z = [20, 40, 85, 105];
        for (P = 0; 8 > P; P++)
          (O = v),
            (J = [w[4], w[3]][u[P]]),
            (V = [3, z[~~(P / 2)], I[P % 2]]),
            (W = c([[0], [0]], V)),
            O.addElem(
              '<circle cx="' +
                W[0][0] +
                '" cy="' +
                W[1][0] +
                '" r="' +
                3 * V[0] +
                '" style="fill:' +
                J +
                ';stroke:#000;" />'
            );
      };
    })(),
    f = (function () {
      function y(d, l) {
        0 != d[0] && l.doMove(d[0]);
        0 != d[1] && l.doMove(-d[1]);
        0 != d[2] && l.doMove(0);
      }
      function A(d, l, D, x, R) {
        for (var G = 0; G < (R ? 12 : 24); G++) {
          var L = 12 > G ? [45, v, v] : [45, 3 * v, v],
            F = l.pieceAt(G),
            K = D["UD"[8 <= F ? 1 : 0]],
            M = (-(12 > G ? G - 1 : G - 6) * n) / 6,
            S = (-(12 > G ? G : G - 5) * n) / 6;
          1 == F % 2
            ? x
              ? ((S = x.pieceAt(G) & 1),
                (M += S ? 0 : n / 6),
                k(d, D["RBBLLFFRRFFLLBBR"[F - S]], C(S ? z : O, M), L),
                k(d, K, C(S ? W : X, M), L))
              : (k(d, D["RBBLLFFRRFFLLBBR"[F - 1]], C(z, M), L),
                k(d, D["RBBLLFFRRFFLLBBR"[F]], C(O, M), L),
                k(d, K, C(P, M), L),
                G++)
            : (k(d, D["R-B-L-F-F-L-B-R-"[F]], C(u, S), L), k(d, K, C(J, S), L));
        }
      }
      var w = E + 1,
        v = w * Math.sqrt(2),
        u = [
          [0, -0.5, 0.5],
          [0, -w, -w],
        ],
        I = [
          [0, -0.5, -w, -w],
          [0, -w, -w, -0.5],
        ],
        z = [
          [0, -0.5, -w],
          [0, -w, -w],
        ],
        O = [
          [0, -w, -w],
          [0, -w, -0.5],
        ],
        J = c(u, [0.66, 0, 0]),
        P = c(I, [0.66, 0, 0]),
        W = c(z, [0.66, 0, 0]),
        X = c(O, [0.66, 0, 0]),
        V = {
          U: "#ff0",
          R: "#f80",
          F: "#0f0",
          D: "#fff",
          L: "#f00",
          B: "#00f",
        },
        Q = /^\s*\(\s*(-?\d+),\s*(-?\d+)\s*\)\s*$/;
      return {
        scrImage: function (d, l, D) {
          var x = kernel.getProp("colsq1").match(H);
          V = { U: x[0], R: x[1], F: x[2], D: x[3], L: x[4], B: x[5] };
          x = new sq1.SqCubie();
          var R = null;
          D &&
            ((R = new sq1.SqCubie()),
            (R.ul = R.ur = 65552),
            (R.dl = R.dr = 1048832));
          l = l.split("/");
          var G = [];
          for (D = 0; D < l.length; D++)
            if (/^\s*$/.exec(l[D])) G.push([0, 0, 1]);
            else {
              var L = Q.exec(l[D]);
              G.push([(~~L[1] + 12) % 12, (~~L[2] + 12) % 12, 1]);
            }
          G.push([0, 0, 1]);
          for (D = 0; D < G.length; D++) y(G[D], x), R && y(G[D], R);
          d.width = 180 * v;
          d.height = 90 * v;
          for (D = 0; 2 > D; D++)
            (L = 0 == D ? [45, v, v + w] : [45, 3 * v, v - w - 0.7]),
              k(
                d,
                V.L,
                [
                  [-w, -w, -0.5, -0.5],
                  [0, 0.7, 0.7, 0],
                ],
                L
              ),
              0 == x.ml
                ? k(
                    d,
                    V.L,
                    [
                      [w, w, -0.5, -0.5],
                      [0, 0.7, 0.7, 0],
                    ],
                    L
                  )
                : k(
                    d,
                    V.R,
                    [
                      [E, E, -0.5, -0.5],
                      [0, 0.7, 0.7, 0],
                    ],
                    L
                  );
          A(d, x, V, R);
          d = [];
          for (D = 0; D < l.length; D++)
            /^\s*$/.exec(l[D]) ||
              ((L = Q.exec(l[D])),
              ~~L[1] && d.push("(" + L[1] + ",0)"),
              ~~L[2] && d.push("(0," + L[2] + ")")),
              d.push("/");
          "/" == d.at(-1) ? d.pop() : d.push("/");
          return ["~", d, "sq1"];
        },
        llImage: function (d, l, D) {
          var x = new $.svg(),
            R = kernel.getProp("colsq1").match(H);
          V = { U: R[0], R: R[1], F: R[2], D: R[3], L: R[4], B: R[5] };
          x.width = 90 * v;
          x.height = 90 * v;
          A(x, d, V, l, !0);
          D && D.attr("src", "data:image/svg+xml;base64," + btoa(x.render()));
          return x;
        },
      };
    })(),
    a = (function () {
      function y(u, I, z, O) {
        var J = O * O,
          P,
          W,
          X;
        5 < u && (u -= 6);
        for (X = 0; X < z; X++) {
          for (P = 0; P < O; P++) {
            if (0 == u) {
              var V = 6 * J - O * I - O + P;
              var Q = 2 * J - O * I - 1 - P;
              var d = 3 * J - O * I - 1 - P;
              var l = 5 * J - O * I - O + P;
            } else
              1 == u
                ? ((V = 3 * J + I + O * P),
                  (Q = 3 * J + I - O * (P + 1)),
                  (d = J + I - O * (P + 1)),
                  (l = 5 * J + I + O * P))
                : 2 == u
                ? ((V = 3 * J + I * O + P),
                  (Q = 4 * J + O - 1 - I + O * P),
                  (d = I * O + O - 1 - P),
                  (l = 2 * J - 1 - I - O * P))
                : 3 == u
                ? ((V = 4 * J + I * O + O - 1 - P),
                  (Q = 2 * J + I * O + P),
                  (d = J + I * O + P),
                  (l = 5 * J + I * O + O - 1 - P))
                : 4 == u
                ? ((V = 6 * J - 1 - I - O * P),
                  (Q = O - 1 - I + O * P),
                  (d = 2 * J + O - 1 - I + O * P),
                  (l = 4 * J - 1 - I - O * P))
                : 5 == u &&
                  ((V = 4 * J - O - I * O + P),
                  (Q = 2 * J - O + I - O * P),
                  (d = J - 1 - I * O - P),
                  (l = 4 * J + I + O * P));
            var D = w[V];
            w[V] = w[Q];
            w[Q] = w[d];
            w[d] = w[l];
            w[l] = D;
          }
          if (0 == I)
            for (P = 0; P + P < O; P++)
              for (W = 0; W + W < O - 1; W++)
                (V = u * J + P + W * O),
                  (d = u * J + (O - 1 - P) + (O - 1 - W) * O),
                  3 > u
                    ? ((Q = u * J + (O - 1 - W) + P * O),
                      (l = u * J + W + (O - 1 - P) * O))
                    : ((l = u * J + (O - 1 - W) + P * O),
                      (Q = u * J + W + (O - 1 - P) * O)),
                  (D = w[V]),
                  (w[V] = w[Q]),
                  (w[Q] = w[d]),
                  (w[d] = w[l]),
                  (w[l] = D);
        }
      }
      function A(u, I) {
        var z = 0;
        w = [];
        for (var O = 0; 6 > O; O++) for (var J = 0; J < u * u; J++) w[z++] = O;
        I = cubeutil.parseScramble(I, "DLBURF", !0);
        for (z = 0; z < I.length; z++) {
          for (O = 0; O < I[z][1]; O++) y(I[z][0], O, I[z][2], u);
          if (-1 == I[z][1]) {
            for (O = 0; O < u - 1; O++) y(I[z][0], O, -I[z][2], u);
            y((I[z][0] + 3) % 6, 0, I[z][2] + 4, u);
          }
        }
        return w;
      }
      var w = [],
        v = "#ff0 #fa0 #00f #fff #f00 #0d0".split(" ");
      return {
        draw: function (u, I, z) {
          A(I, z);
          u.width = 30 * ((39 * I) / 9 + 0.2);
          u.height = 30 * ((29 * I) / 9 + 0.2);
          v = kernel.getProp("colcube").match(H);
          for (var O = 0; 6 > O; O++) {
            var J = u,
              P = O,
              W = I,
              X = 10 / 9,
              V = 10 / 9;
            0 == P
              ? ((X *= W), (V *= 2 * W))
              : 1 == P
              ? ((X *= 0), (V *= W))
              : 2 == P
              ? ((X *= 3 * W), (V *= W))
              : 3 == P
              ? ((X *= W), (V *= 0))
              : 4 == P
              ? ((X *= 2 * W), (V *= W))
              : 5 == P && ((X *= W), (V *= W));
            for (var Q = 0; Q < W; Q++)
              for (var d = 1 == P || 2 == P ? W - 1 - Q : Q, l = 0; l < W; l++)
                k(
                  J,
                  v[w[(P * W + (0 == P ? W - 1 - l : l)) * W + d]],
                  [
                    [Q, Q, Q + 1, Q + 1],
                    [l, l + 1, l + 1, l],
                  ],
                  [30, X + 0.1, V + 0.1]
                );
          }
          u = z.split(/\s+/);
          z = [];
          for (O = 0; O < u.length; O++) u[O] && z.push(u[O]);
          return ["~", z, [I, I, I].join("")];
        },
        genPosit: A,
      };
    })(),
    e = (function () {
      function y(A, w, v) {
        var u = new $.svg(),
          I = kernel.getProp("colcube").match(H),
          z = 3;
        12 == A.length && (z = 2);
        u.width = 50 * (z + 1.2);
        u.height = 50 * (z + 1.2);
        for (var O = 0; O < z * z; O++) {
          var J = (O % z) + 0.5,
            P = ~~(O / z) + 0.5;
          k(
            u,
            I["DLBURF".indexOf(A[O])] || "#888",
            [
              [J, J + 1, J + 1, J],
              [P, P, P + 1, P + 1],
            ],
            [50, 0.1, 0.1]
          );
        }
        for (O = 0; O < 4 * z; O++)
          (J = O % z),
            (P = ~~(O / z)),
            k(
              u,
              I["DLBURF".indexOf(A[O + z * z])] || "#888",
              C(
                [
                  [
                    J - z / 2,
                    J - z / 2 + 1,
                    0.9 * (J - z / 2 + 1),
                    0.9 * (J - z / 2),
                  ],
                  [z / 2 + 0.05, z / 2 + 0.05, z / 2 + 0.5, z / 2 + 0.5],
                ],
                (-P * n) / 2
              ),
              [50, 0.6 + z / 2, 0.6 + z / 2]
            );
        w = w || [];
        for (O = 0; O < w.length; O++) {
          P = w[O];
          A = (P[0] % z) + 1.1;
          I = ~~(P[0] / z) + 1.1;
          J = (P[1] % z) + 1.1;
          P = ~~(P[1] / z) + 1.1;
          var W = Math.sqrt((A - J) * (A - J) + (I - P) * (I - P));
          k(
            u,
            "#000",
            C(
              [
                [0.2, W - 0.4, W - 0.4, W - 0.1, W - 0.4, W - 0.4, 0.2],
                [0.05, 0.05, 0.15, 0, -0.15, -0.05, -0.05],
              ],
              Math.atan2(P - I, J - A)
            ),
            [50, A, I]
          );
        }
        v && v.attr("src", "data:image/svg+xml;base64," + btoa(u.render()));
        return u;
      }
      return {
        drawImage: y,
        draw: function (A, w, v) {
          w = a.genPosit(A, w);
          for (var u = [], I = 0; I < A * A; I++)
            u.push("DLBURF"[w[3 * A * A + I]]);
          for (var z = 0; 4 > z; z++) {
            var O = [5, 4, 2, 1][z] * A * A;
            for (I = 0; I < A; I++)
              u.push("DLBURF"[w[O + [I, I, A - 1 - I, A - 1 - I][z]]]);
          }
          return y(u.join(""), [], v);
        },
      };
    })(),
    h = (function () {
      var y = [
        [20 * E, -20 * E, 61 * E, 10, 10, 0],
        [20 * E, 0, 62 * E, -10, 20, 61.5],
        [20 * E, 0, 0, 10, 20, 31.5],
      ];
      return function (A, w) {
        var v = new $.svg(),
          u = kernel.getProp("colcube").match(H);
        v.width = 122 * E;
        v.height = 121.5;
        for (var I = 0; 27 > I; I++) {
          var z = I % 3,
            O = ~~(I / 3) % 3;
          k(
            v,
            u["DLBURF".indexOf(A[I])] || "#888",
            [
              [z, z + 1, z + 1, z],
              [O, O, O + 1, O + 1],
            ],
            y[~~(I / 9)]
          );
        }
        w && w.attr("src", "data:image/svg+xml;base64," + btoa(v.render()));
        return v;
      };
    })(),
    p = (function () {
      return function (y, A) {
        var w = new $.svg();
        w.width = 120 * E;
        w.height = 120 * E;
        for (
          var v = kernel.getProp("colpyr").match(H), u = 0, I = 0;
          3 > I;
          I++
        )
          for (var z = 0; 3 > z; z++)
            for (var O = 0; O < 2 * I + 1; O++) {
              var J = -E * I + E * O;
              var P = I / 2;
              J =
                0 == O % 2
                  ? [
                      [J, J - E, J + E],
                      [P, P + 0.5, P + 0.5],
                    ]
                  : [
                      [J - E, J, J + E],
                      [P, P + 0.5, P],
                    ];
              k(w, v["FLRD".indexOf(y[u])] || "#888", C(J, (n / 3) * 4 * z), [
                20,
                3 * E,
                3 + (6 * E - 4.5) / 2,
              ]);
              u++;
            }
        A && A.attr("src", "data:image/svg+xml;base64," + btoa(w.render()));
        return w;
      };
    })(),
    q = (function () {
      var y = {};
      return function (A, w, v, u, I) {
        var z = [],
          O = [];
        I = I || 0;
        var J = 0.05,
          P = y[w],
          W = poly3d.getFamousPuzzle(w);
        if (null != W)
          (P = P || poly3d.makePuzzle.apply(poly3d, W.polyParam)),
            (W.parser = W.parser || poly3d.makePuzzleParser(P)),
            (O = W.parser.parseScramble(v)),
            (J = W.pieceGap),
            (z = W.colors);
        else debugger;
        DEBUG && console.log("[polyhedron image] puzzle=", P, "moves=", O);
        y[w] = P;
        I = poly3d.renderNet(P, J, I);
        J = I[0];
        v = I[1];
        I = I[2];
        for (var X = [], V = 0; V < v.length; V++) X[V] = v[V] && v[V][2];
        for (var Q = 0; Q < O.length; Q++) {
          V = O[Q];
          var d = P.getTwistyIdx(V[0]);
          if (-1 == d) debugger;
          var l = P.moveTable[d];
          d = P.twistyDetails[d][1];
          var D = ((V[1] % d) + d) % d,
            x = [];
          for (V = 0; V < X.length; V++) {
            var R = V;
            for (d = 0; d < D; d++) R = 0 > l[R] ? R : l[R];
            x[V] = X[R];
          }
          X = x;
        }
        if ("skb" == w) {
          z = $.col2std(kernel.getProp("colskb"), [0, 2, 4, 3, 5, 1]);
          P = [
            [E, -E, 2 * E, 0.5, 0.5, -1],
            [E, 0, 0, -0.5, 1, 2],
            [E, 0, 0, 0.5, 1, -2],
            [E, 0, 0, 0.5, 1, -2],
            [E, 0, 0, 0.5, 1, -2],
            [E, 0, 0, -0.5, 1, 2],
          ];
          for (V = 0; 6 > V; V++)
            for (d = 0; 6 > d; d++) 2 != d % 3 && (P[V][d] *= 8 / J[0]);
          for (V = 0; V < v.length; V++)
            v[V] &&
              ((J = c(v[V], P[v[V][2]])), (v[V][0] = J[0]), (v[V][1] = J[1]));
          J = [8 * E, 6];
        }
        P = 300 * Math.min(1.6 / J[0], 1 / J[1]);
        A.width = J[0] * P;
        A.height = J[1] * P;
        for (V = 0; V < z.length; V++)
          z[V] = "#" + z[V].toString(16).padStart(6, "0");
        for (V = 0; V < X.length; V++)
          v[V] && k(A, z[X[V]], v[V], [P, 0, 0, 0, P, 0]);
        for (V = 0; V < I.length; V++)
          0 != ((u >> V) & 1) &&
            ((z = I[V]),
            A.addText(z[2].toUpperCase(), [z[0] * P, z[1] * P], {
              font: "20px Arial",
              fill: kernel.getProp("col-font"),
              stroke: kernel.getProp("col-board"),
              "stroke-width": "3px",
            }));
        A = [];
        for (Q = 0; Q < O.length; Q++) A.push(W.parser.move2str(O[Q]));
        return ["~", A, w];
      };
    })(),
    m = (function () {
      return function (y, A, w, v) {
        for (
          var u = [],
            I = [
              [1, 0],
              [0, 1],
              [0, -1],
              [-1, 0],
            ],
            z = 0;
          z < w * w;
          z++
        )
          u[z] = z;
        z = w - 1;
        var O = w - 1,
          J = /([ULRD\uFFEA\uFFE9\uFFEB\uFFEC])([\d]?)/;
        v = v.split(" ");
        for (var P = 0; P < v.length; P++) {
          var W = J.exec(v[P]);
          if (W) {
            var X = "ULRD￪￩￫￬".indexOf(W[1]) % 4;
            W = ~~W[2] || 1;
            X = I["b" == A ? 3 - X : X];
            for (var V = 0; V < W; V++)
              mathlib.circle(u, z * w + O, (z + X[0]) * w + O + X[1]),
                (z += X[0]),
                (O += X[1]);
          }
        }
        y.width = 50 * (w + 0.2);
        y.height = 50 * (w + 0.2);
        A = kernel.getProp("col15p").match(H);
        A[w - 1] = A.at(-1);
        for (z = 0; z < w; z++)
          for (v = 0; v < w; v++)
            (I = u[v * w + z]),
              (O = Math.min(~~(I / w), I % w)),
              I++,
              k(
                y,
                A[O],
                [
                  [z + 0.05, z + 0.05, z + 1 - 0.05, z + 1 - 0.05],
                  [v + 0.05, v + 1 - 0.05, v + 1 - 0.05, v + 0.05],
                ],
                [50, 0.1, 0.1]
              ),
              I != w * w &&
                y.addText(I, [50 * (z + 0.5 + 0.1), 50 * (v + 0.5 + 0.1)], {
                  font: "30px Arial",
                  fill: "#000",
                });
      };
    })(),
    r = "222 333 444 555 666 777 888 999 101010 111111".split(" ");
  ISCSTIMER &&
    execMain(function () {
      function y(A) {
        A &&
          ((t = t || $('<img style="display:block;">')),
          A.empty().append(t),
          N(tools.getCurScramble(), !0) || A.html(IMAGE_UNAVAILABLE));
      }
      $(function () {
        tools.regTool("image", TOOLS_IMAGE, y);
      });
    });
  var H = /#[0-9a-fA-F]{3}/g;
  return {
    draw: N,
    llImage: e,
    pyrllImage: p,
    face3Image: h,
    sqllImage: f.llImage,
  };
})();
var cross = (function (b, N, t, E, n, C, c) {
  function k(K, M) {
    M = z[M][~~(K / 24)];
    return 24 * ~~(M / 384) + O[K % 24][(M >> 4) % 24];
  }
  function g(K, M) {
    M = z[M][K >> 4];
    return (~~(M / 384) << 4) | (J[K & 15][(M >> 4) % 24] ^ (M & 15));
  }
  function f(K, M) {
    for (var S = 3; 0 <= S; S--) (M[S] = K & 1), (K >>= 1);
  }
  function a(K) {
    for (var M = 0, S = 0; 4 > S; S++) (M <<= 1), (M |= K[S]);
    return M;
  }
  function e(K, M) {
    M = z[M][~~(K / 384)];
    return (
      384 * ~~(M / 384) +
      16 * O[(K >> 4) % 24][(M >> 4) % 24] +
      (J[K & 15][(M >> 4) % 24] ^ (M & 15))
    );
  }
  function h() {
    h = $.noop;
    for (var K = 0; 24 > K; K++) O[K] = [];
    for (K = 0; 16 > K; K++) J[K] = [];
    var M = [],
      S = [],
      Z = [];
    for (K = 0; 24 > K; K++)
      for (var fa = 0; 24 > fa; fa++) {
        E(M, K, 4);
        E(S, fa, 4);
        for (var ea = 0; 4 > ea; ea++) Z[ea] = M[S[ea]];
        O[K][fa] = n(Z, 4);
        if (16 > K) {
          f(K, M);
          for (ea = 0; 4 > ea; ea++) Z[ea] = M[S[ea]];
          J[K][fa] = a(Z);
        }
      }
    b(z, 495, function (va, ra) {
      for (
        var ya = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], Ba = 4, sa = 0;
        12 > sa;
        sa++
      )
        va >= C[11 - sa][Ba]
          ? ((va -= C[11 - sa][Ba--]), (ya[sa] = Ba << 1))
          : (ya[sa] = -1);
      N(ya, ra);
      va = 0;
      Ba = 4;
      ra = 0;
      var ta = [];
      for (sa = 0; 12 > sa; sa++)
        0 <= ya[sa] &&
          ((va += C[11 - sa][Ba--]),
          (ta[Ba] = ya[sa] >> 1),
          (ra |= (ya[sa] & 1) << (3 - Ba)));
      return ((24 * va + n(ta, 4)) << 4) | ra;
    });
    w = [];
    v = [];
    t(w, 0, 11880, 5, k);
    t(v, 0, 7920, 6, g);
  }
  function p() {
    p = $.noop;
    q();
    var K = 5;
    t(X, 296 + 576 * (72 * K + 2 * K), 331776, 7, function (M, S) {
      var Z = M % 576;
      M = ~~(M / 576);
      return (
        24 * W[~~(Z / 24)][S] +
        P[Z % 24][S] +
        576 * (24 * W[~~(M / 24)][S] + P[M % 24][S])
      );
    });
    K = 6;
    t(V, 296 + 576 * (72 * K + 2 * K), 331776, 7, function (M, S) {
      var Z = M % 576;
      M = ~~(M / 576);
      return (
        24 * W[~~(Z / 24)][S] +
        P[Z % 24][S] +
        576 * (24 * W[~~(M / 24)][S] + P[M % 24][S])
      );
    });
  }
  function q() {
    function K(ea, va) {
      var ra = ~~(ea / 3);
      return (
        3 *
          [
            [3, 1, 2, 7, 0, 5, 6, 4],
            [0, 1, 6, 2, 4, 5, 7, 3],
            [1, 2, 3, 0, 4, 5, 6, 7],
            [0, 5, 1, 3, 4, 6, 2, 7],
            [4, 0, 2, 3, 5, 1, 6, 7],
            [0, 1, 2, 3, 7, 4, 5, 6],
          ][va][ra] +
        (((ea % 3) +
          [
            [2, 0, 0, 1, 1, 0, 0, 2],
            [0, 0, 1, 2, 0, 0, 2, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 2, 0, 0, 2, 1, 0],
            [1, 2, 0, 0, 2, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
          ][va][ra]) %
          3)
      );
    }
    q = $.noop;
    h();
    for (var M = 0; 24 > M; M++) {
      W[M] = [];
      P[M] = [];
      for (var S = 0; 6 > S; S++) {
        W[M][S] = K(M, S);
        var Z = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
        Z[M >> 1] = M & 1;
        N(Z, S);
        for (var fa = 0; 12 > fa; fa++)
          if (0 <= Z[fa]) {
            P[M][S] = (fa << 1) | Z[fa];
            break;
          }
      }
    }
    u = [];
    for (M = 0; 4 > M; M++)
      (S = []),
        t(S, 72 * (M + 4) + 2 * (M + 4), 576, 5, function (ea, va) {
          return 24 * W[~~(ea / 24)][va] + P[ea % 24][va];
        }),
        (u[M] = S);
  }
  function m(K) {
    h();
    for (var M = [], S = 0; 6 > S; S++) {
      for (var Z = 0, fa = 0, ea = 0; ea < K.length; ea++)
        for (
          var va = R[S].indexOf("FRUBLD".charAt(K[ea][0])),
            ra = K[ea][2],
            ya = 0;
          ya < ra;
          ya++
        )
          (Z = g(Z, va)), (fa = k(fa, va));
      Z = Q.solve([fa, Z], 0, 50);
      for (ea = 0; ea < Z.length; ea++)
        Z[ea] = "FRUBLD".charAt(Z[ea][0]) + " 2'".charAt(Z[ea][1]);
      M.push(Z);
    }
    return M;
  }
  function r(K, M) {
    q();
    for (
      var S = 0, Z = 0, fa = [8, 10, 12, 14], ea = [12, 15, 18, 21], va = 0;
      va < K.length;
      va++
    )
      for (
        var ra = R[M].indexOf("FRUBLD".charAt(K[va][0])), ya = K[va][2], Ba = 0;
        Ba < ya;
        Ba++
      ) {
        S = g(S, ra);
        Z = k(Z, ra);
        for (var sa = 0; 4 > sa; sa++)
          (fa[sa] = P[fa[sa]][ra]), (ea[sa] = W[ea[sa]][ra]);
      }
    K = [];
    for (va = 0; 4 > va; va++) K.push([Z, S, fa[va], ea[va], va]);
    S = d.solveMulti(K, 0, 20)[0];
    for (va = 0; va < S.length; va++)
      S[va] = "FRUBLD".charAt(S[va][0]) + " 2'".charAt(S[va][1]);
    return S;
  }
  function H(K, M, S) {
    p();
    var Z = [],
      fa = [],
      ea = 0;
    for (ea = 0; 4 > ea; ea++) {
      for (
        var va = 0, ra = 0, ya = [8, 10, 12], Ba = [12, 15, 18], sa = 0;
        sa < K.length;
        sa++
      )
        for (
          var ta = L[ea].indexOf(
              "FRUBLD".charAt(R[M].indexOf("FRUBLD".charAt(K[sa][0])))
            ),
            na = K[sa][2],
            U = 0;
          U < na;
          U++
        )
          (va = g(va, ta)),
            (ra = k(ra, ta)),
            (ya = [P[ya[0]][ta], P[ya[1]][ta], P[ya[2]][ta]]),
            (Ba = [W[Ba[0]][ta], W[Ba[1]][ta], W[Ba[2]][ta]]);
      Z.push([ra, va, ya[0], Ba[0], ya[1], Ba[1], X]);
      Z.push([ra, va, ya[0], Ba[0], ya[2], Ba[2], V]);
      fa.push([ra, va, ya[0], Ba[0], ya[1], Ba[1], ya[2], Ba[2]]);
    }
    K = S ? D.solveMulti(fa, 0, 20) : l.solveMulti(Z, 0, 20);
    ea = S ? K[1] : K[1] >> 1;
    return K[0].map(function (ba) {
      return L[ea][ba[0]] + " 2'"[ba[1]];
    });
  }
  function y() {
    y = $.noop;
    h();
    I = [];
    t(I, 0, 190080, 7, e, 6, 3, 6);
  }
  function A(K) {
    var M = ~~(K / 384),
      S = (K >> 4) % 24,
      Z = [],
      fa = [],
      ea = [],
      va = [];
    f(K & 15, va);
    E(ea, S, 4);
    K = 4;
    S = [7, 6, 5, 4, 10, 9, 8, 11, 3, 2, 1, 0];
    for (var ra = 0; 12 > ra; ra++)
      M >= C[11 - ra][K]
        ? ((M -= C[11 - ra][K--]), (Z[S[ra]] = ea[K]), (fa[S[ra]] = va[K]))
        : (Z[S[ra]] = fa[S[ra]] = -1);
    return [Z, fa];
  }
  var w,
    v,
    u,
    I,
    z = [],
    O = [],
    J = [],
    P = [],
    W = [],
    X = [],
    V = [],
    Q = new mathlib.Searcher(
      function (K) {
        return 0 == K[0] + K[1];
      },
      function (K) {
        return Math.max(c(w, K[0]), c(v, K[1]));
      },
      function (K, M) {
        return [k(K[0], M), g(K[1], M)];
      },
      6,
      3,
      [1, 2, 4, 9, 18, 36]
    ),
    d = new mathlib.Searcher(
      function (K) {
        return (
          0 == K[0] + K[1] && K[2] == 2 * (K[4] + 4) && K[3] == 3 * (K[4] + 4)
        );
      },
      function (K) {
        return Math.max(c(w, K[0]), c(v, K[1]), c(u[K[4]], 24 * K[3] + K[2]));
      },
      function (K, M) {
        return [k(K[0], M), g(K[1], M), P[K[2]][M], W[K[3]][M], K[4]];
      },
      6,
      3,
      [1, 2, 4, 9, 18, 36]
    ),
    l = new mathlib.Searcher(
      function (K) {
        return (
          0 == K[0] + K[1] &&
          8 == K[2] &&
          12 == K[3] &&
          ((10 == K[4] && 15 == K[5]) || (12 == K[4] && 18 == K[5]))
        );
      },
      function (K) {
        return Math.max(
          c(w, K[0]),
          c(v, K[1]),
          c(K[6], 24 * K[3] + K[2] + 576 * (24 * K[5] + K[4]))
        );
      },
      function (K, M) {
        return [
          k(K[0], M),
          g(K[1], M),
          P[K[2]][M],
          W[K[3]][M],
          P[K[4]][M],
          W[K[5]][M],
          K[6],
        ];
      },
      6,
      3,
      [1, 2, 4, 9, 18, 36]
    ),
    D = new mathlib.Searcher(
      function (K) {
        return (
          0 == K[0] + K[1] &&
          8 == K[2] &&
          12 == K[3] &&
          10 == K[4] &&
          15 == K[5] &&
          12 == K[6] &&
          18 == K[7]
        );
      },
      function (K) {
        return Math.max(
          c(w, K[0]),
          c(v, K[1]),
          c(X, 24 * K[3] + K[2] + 576 * (24 * K[5] + K[4])),
          c(V, 24 * K[3] + K[2] + 576 * (24 * K[7] + K[6]))
        );
      },
      function (K, M) {
        return [
          k(K[0], M),
          g(K[1], M),
          P[K[2]][M],
          W[K[3]][M],
          P[K[4]][M],
          W[K[5]][M],
          P[K[6]][M],
          W[K[7]][M],
        ];
      },
      6,
      3,
      [1, 2, 4, 9, 18, 36]
    ),
    x = "DULRFB".split(""),
    R = "FRUBLD FLDBRU FDRBUL FULBDR URBDLF DRFULB".split(" "),
    G = "&nbsp;&nbsp; z2 z' z&nbsp; x' x&nbsp;".split(" "),
    L = ["FRUBLD", "RBULFD", "BLUFRD", "LFURBD"],
    F;
  ISCSTIMER &&
    execMain(function () {
      function K() {
        var S = $(this).parent(),
          Z = "DULRFB".indexOf(S.html()[0]);
        r(F, Z);
        var fa = $(this).html();
        if ("ec" == fa) {
          var ea = r(F, Z);
          fa = "xx";
        } else "xx" == fa ? ((ea = H(F, Z)), (fa = "3x")) : "3x" == fa ? ((ea = H(F, Z, !0)), (fa = "<<")) : ((ea = m(F)[Z]), (fa = "ec"));
        fa = $("<span />").html(fa).addClass("click").click(K);
        S.empty().append(
          x[Z] + "(",
          fa,
          "): " + G[Z],
          tools.getSolutionSpan(ea),
          "<br>"
        );
      }
      function M(S) {
        if (S)
          if (tools.isPuzzle("333")) {
            var Z = tools.getCurScramble()[1];
            S.empty();
            F = cubeutil.parseScramble(Z, "FRUBLD");
            Z = m(F);
            for (var fa = 0; 6 > fa; fa++) {
              var ea = $('<span class="sol"/>'),
                va = $("<span />").html("ec").addClass("click").click(K);
              ea.append(
                x[fa] + "(",
                va,
                "): " + G[fa],
                tools.getSolutionSpan(Z[fa]),
                "<br>"
              );
              S.append(ea);
            }
          } else S.html(IMAGE_UNAVAILABLE);
      }
      $(function () {
        tools.regTool("cross", TOOLS_SOLVERS + ">" + TOOLS_CROSS, M);
      });
    });
  return {
    solve: m,
    getEasyCross: function (K) {
      y();
      var M = Math.min(K % 10, 8),
        S = Math.min(~~(K / 10), 8);
      K = Math.min(M, S);
      M = Math.max(M, S);
      S = [0, 1, 16, 174, 1568, 11377, 57758, 155012, 189978, 190080];
      S = mathlib.rn(S[M + 1] - S[K]) + 1;
      var Z;
      for (Z = 0; 190080 > Z; Z++) {
        var fa = c(I, Z);
        if (fa <= M && fa >= K && 0 == --S) break;
      }
      return A(Z);
    },
    getEasyXCross: function (K) {
      y();
      q();
      var M = K % 10,
        S = ~~(K / 10),
        Z = Math.min(M, S, 8),
        fa = Math.max(M, S);
      K = Math.max(0, Math.min(fa, 8));
      for (
        var ea = [1, 16, 174, 1568, 11377, 57758, 155012, 189978, 190080][K],
          va = !1;
        !va;

      ) {
        var ra = [];
        for (M = 0; 500 > M; M++) ra.push(mathlib.rn(ea));
        ra.sort(function (Aa, Da) {
          return Da - Aa;
        });
        var ya = [];
        for (M = S = 0; 190080 > M; M++)
          if (!(c(I, M) > K)) {
            for (; ra.at(-1) == S; ) ya.push(M), ra.pop();
            if (0 == ra.length) break;
            S++;
          }
        ra = mathlib.rndPerm(500);
        for (M = 0; 500 > M; M++) {
          var Ba = ya[ra[M]],
            sa = ~~(Ba / 384),
            ta = 24 * sa + ((Ba >> 4) % 24),
            na = (sa << 4) | (Ba & 15),
            U = [];
          S = mathlib.rndPerm(8).slice(4);
          var ba = mathlib.rndPerm(8),
            la = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          U = 4;
          for (var ka = 0; 12 > ka; ka++)
            sa >= C[11 - ka][U]
              ? ((sa -= C[11 - ka][U--]), (la[ka] = -1))
              : (la[ka] = ba.pop());
          for (ka = 0; 4 > ka; ka++)
            if (
              ((S[ka] = 3 * S[ka] + mathlib.rn(3)),
              (ba[ka] = 2 * la.indexOf(ka) + mathlib.rn(2)),
              (U = d.solve([ta, na, ba[ka], S[ka], ka], 0, va ? Z - 1 : fa)),
              null != U)
            )
              if (U.length < Z) {
                va = !1;
                break;
              } else U.length <= fa && (va = !0);
          if (va) {
            Z = A(Ba);
            Z[2] = mathlib.valuedArray(8, -1);
            Z[3] = mathlib.valuedArray(8, -1);
            K = [7, 6, 5, 4, 10, 9, 8, 11, 3, 2, 1, 0];
            fa = [6, 5, 4, 7, 2, 1, 0, 3];
            for (M = 0; 4 > M; M++)
              (Z[0][K[ba[M] >> 1]] = K[M + 4]),
                (Z[1][K[ba[M] >> 1]] = ba[M] % 2),
                (Z[2][fa[~~(S[M] / 3)]] = fa[M + 4]),
                (Z[3][fa[~~(S[M] / 3)]] = (30 - S[M]) % 3);
            return Z;
          }
        }
      }
    },
  };
})(
  mathlib.createMove,
  mathlib.edgeMove,
  mathlib.createPrun,
  mathlib.setNPerm,
  mathlib.getNPerm,
  mathlib.Cnk,
  mathlib.getPruning
);
execMain(
  function (b, N, t, E) {
    function n(m, r) {
      var H = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        y = m % 12;
      m = ~~(m / 12);
      m >= y && m++;
      H[y] = 2;
      H[m] = 4;
      N(H, r);
      for (r = 0; 12 > r; r++)
        1 == H[r] >> 1 ? (y = r) : 2 == H[r] >> 1 && (m = r);
      m > y && m--;
      return 12 * m + y;
    }
    function C() {
      C = $.noop;
      b(g, 2048, [N, "o", 12, -2]);
      b(f, 132, n);
    }
    function c(m, r, H) {
      C();
      m = cubeutil.parseScramble(m, "FRUBLD");
      H.empty();
      for (var y = 0; 12 > y; y++) {
        for (var A = 0, w = 116, v = 129, u = 0; u < m.length; u++)
          for (
            var I = p[y].indexOf("FRUBLD".charAt(m[u][0])), z = m[u][2], O = 0;
            O < z;
            O++
          )
            (A = g[I][A]), (w = f[I][w]), (v = f[I][v]);
        A = r ? e.search([A, w, v], 0) : a.search([A, w], 0);
        A = A.map(function (J) {
          return "FRUBLD".charAt(J[0]) + " 2'".charAt(J[1]);
        });
        H.append(
          $('<span class="sol">').append(
            h[y] + ": " + q[y],
            tools.getSolutionSpan(A)
          ),
          "<br>"
        );
      }
    }
    function k(m, r) {
      if (r)
        if (tools.isPuzzle("333")) {
          var H = tools.getCurScramble();
          c(H[1], "eocross" == m, r);
        } else r.html(IMAGE_UNAVAILABLE);
    }
    var g = [],
      f = [],
      a = new mathlib.Solver(6, 3, [
        [0, [N, "o", 12, -2], 2048],
        [116, n, 132],
      ]),
      e = new mathlib.Solver(6, 3, [
        [0, [N, "o", 12, -2], 2048],
        [116, n, 132],
        [129, n, 132],
      ]),
      h =
        "D(LR) D(FB) U(LR) U(FB) L(UD) L(FB) R(UD) R(FB) F(LR) F(UD) B(LR) B(UD)".split(
          " "
        ),
      p =
        "FRUBLD RBULFD FLDBRU LBDRFU FDRBUL DBRUFL FULBDR UBLDFR URBDLF RDBLUF DRFULB RUFLDB".split(
          " "
        ),
      q =
        "&nbsp;&nbsp;&nbsp; &nbsp;y&nbsp; z2&nbsp; z2y z'&nbsp; z'y &nbsp;z&nbsp; z&nbsp;y x'&nbsp; x'y &nbsp;x&nbsp; x&nbsp;y".split(
          " "
        );
    $(function () {
      tools.regTool(
        "eoline",
        TOOLS_SOLVERS + ">" + TOOLS_EOLINE,
        k.bind(null, "eoline")
      );
      tools.regTool(
        "eocross",
        TOOLS_SOLVERS + ">EOCross",
        k.bind(null, "eocross")
      );
    });
  },
  [mathlib.createMove, mathlib.edgeMove, mathlib.createPrun, mathlib.getPruning]
);
execMain(
  function (b) {
    function N(e, h) {
      C.ca = [0, 0, 0, 0, 0, 0, 0, 0];
      for (var p = 1; 3 > p; p++) {
        var q = e % 24;
        e = ~~(e / 24);
        C.ca[q & 7] = p | (q & 24);
      }
      b.CornMult(C, b.moveCube[3 * h], c);
      h = [];
      for (p = 0; 8 > p; p++) h[c.ca[p] & 7] = p | (c.ca[p] & 24);
      e = 0;
      for (p = 2; 0 < p; p--) e = 24 * e + h[p];
      return e;
    }
    function t(e, h) {
      C.ea = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (var p = 1; 4 > p; p++) {
        var q = e % 24;
        e = ~~(e / 24);
        C.ea[q >> 1] = (p << 1) | (q & 1);
      }
      b.EdgeMult(C, b.moveCube[3 * h], c);
      h = [];
      for (p = 0; 12 > p; p++) h[c.ea[p] >> 1] = (p << 1) | (c.ea[p] & 1);
      e = 0;
      for (p = 3; 0 < p; p--) e = 24 * e + h[p];
      return e;
    }
    function E(e, h) {
      h.empty();
      for (var p = 0; 4 > p; p++) {
        a: {
          var q = e,
            m = f[p];
          var r = [126];
          for (var H = [11964], y = 1; 4 > y; y++)
            (r[y] = N(r[y - 1], 4)), (H[y] = t(H[y - 1], 4));
          var A = [];
          m = m.split("");
          for (var w = 0; 4 > w; w++) {
            A[w] = m.join("");
            var v = cubeutil.parseScramble(q, A[w]);
            for (y = 0; y < v.length; y++)
              for (var u = v[y][0], I = 0; I < v[y][2]; I++)
                (r[w] = N(r[w], u)), (H[w] = t(H[w], u));
            mathlib.circle(m, 0, 2, 3, 5);
          }
          for (m = 1; 12 > m; m++)
            for (w = 0; 4 > w; w++)
              if ((q = k.search([r[w], H[w]], 1 == m ? 0 : m, m))) {
                q.push(w);
                r = q;
                break a;
              }
          r = void 0;
        }
        H = r.pop();
        0 == p % 2 && (H = (H + 2) % 4);
        for (w = 0; w < r.length; w++)
          r[w] = "URFDLB".charAt(r[w][0]) + " 2'".charAt(r[w][1]);
        h.append(
          $('<span class="sol">').append(
            g[p] +
              ": " +
              a[p] +
              ["&nbsp;&nbsp;&nbsp;", "x'&nbsp;", "x2&nbsp;", "x&nbsp;&nbsp;"][
                H
              ],
            tools.getSolutionSpan(r)
          ),
          "<br>"
        );
      }
    }
    function n(e) {
      if (e)
        if (tools.isPuzzle("333")) {
          var h = tools.getCurScramble();
          E(h[1], e);
        } else e.html(IMAGE_UNAVAILABLE);
    }
    var C = new b(),
      c = new b(),
      k = new mathlib.Solver(6, 3, [
        [126, N, 576],
        [11964, t, 13824],
      ]),
      g = ["LU", "LD", "FU", "FD"],
      f = ["DRBULF", "URFDLB", "DBLUFR", "UBRDFL"],
      a = ["&nbsp;&nbsp;", "&nbsp;&nbsp;", "y&nbsp;", "y&nbsp;"];
    $(function () {
      tools.regTool("roux1", TOOLS_SOLVERS + ">" + TOOLS_ROUX1, n);
    });
    return { solve: E };
  },
  [mathlib.CubieCube]
);
(function () {
  function b(e, h) {
    for (var p = 0; p < t.length; p++) h = e(h, t[p]);
    for (p = 0; p < n.length; p++) h = e(h, n[p]);
    return h;
  }
  function N(e, h) {
    var p = {};
    h = h || " 2'";
    for (var q in e) for (var m = 0; m < h.length; m++) p[q + h[m]] = e[q];
    return p;
  }
  var t,
    E,
    n,
    C = (function () {
      function e(m, r) {
        m = m.split("");
        var H = p["URF".indexOf(r[0])];
        r = "? 2'".indexOf(r[1]);
        for (var y = 0; y < H.length; y++) mathlib.acycle(m, H[y], r);
        return m.join("");
      }
      var h = "URFDLB".split(""),
        p = [
          [
            [0, 1, 3, 2],
            [4, 8, 16, 20],
            [5, 9, 17, 21],
          ],
          [
            [4, 5, 7, 6],
            [1, 22, 13, 9],
            [3, 20, 15, 11],
          ],
          [
            [8, 9, 11, 10],
            [2, 4, 13, 19],
            [3, 6, 12, 17],
          ],
        ],
        q = new mathlib.gSolver(
          "XXXX???????????????????? ????XXXX???????????????? ????????XXXX???????????? ????????????XXXX???????? ????????????????XXXX???? ????????????????????XXXX".split(
            " "
          ),
          e,
          N({ U: 1, R: 2, F: 3 })
        );
      return function (m, r) {
        t = cubeutil.parseScramble(m, "URF");
        m = "UUUURRRRFFFFDDDDLLLLBBBB";
        for (var H = 0; H < t.length; H++) {
          var y = t[H];
          m = e(m, "URF".charAt(y[0]) + " 2'".charAt(y[2] - 1));
        }
        for (y = 0; 6 > y; y++) {
          var A = [];
          for (H = 0; 24 > H; H++)
            A.push(m[H] == "URFDLB".charAt(y) ? "X" : "?");
          H = q.search(A.join(""), 0);
          r.append(h[y] + ": ", tools.getSolutionSpan(H), "<br>");
        }
      };
    })(),
    c = (function () {
      function e(X, V) {
        X = X.split("");
        var Q = q["URFDLBurfdlbMESxyz".indexOf(V[0])];
        V = "? 2'".indexOf(V[1]);
        for (var d = 0; d < Q.length; d++) mathlib.acycle(X, Q[d], V);
        return X.join("");
      }
      function h(X, V) {
        var Q = +new Date(),
          d = [null, 0],
          l = [];
        n = [];
        for (var D = 0; D < X.length; D++) {
          if (!X[D].solv) {
            X[D].solv = {};
            for (var x in X[D].step)
              X[D].solv[x] = new mathlib.gSolver([x], e, X[D].move);
          }
          var R = void 0,
            G = e,
            L = X[D].solv,
            F = X[D].step,
            K = X[D].fmov || [];
          d = d[1];
          var M = X[D].maxl || 10,
            S = 0;
          a: for (; S < M + 1; S++)
            for (var Z in L)
              if ((F[Z] | d) == F[Z]) {
                var fa = b(G, Z);
                R = L[Z].search(fa, 0, S);
                if (void 0 != R) {
                  d |= F[Z];
                  break a;
                }
                for (var ea = 0; ea < K.length; ea++)
                  if (
                    ((R = G(fa, K[ea])),
                    (R = L[Z].search(R, 0, S)),
                    void 0 != R)
                  ) {
                    R.unshift(K[ea]);
                    d |= F[Z];
                    break a;
                  }
              }
          d = [R, d];
          l[D] = d[0];
          if (void 0 == d[0]) {
            V.append(
              X[D].head +
                ": &nbsp;(no solution found in %d moves)".replace(
                  "%d",
                  X[D].maxl || 10
                ),
              "<br>"
            );
            break;
          }
          V.append(
            X[D].head + ": ",
            0 == l[D].length ? "&nbsp;(skip)" : tools.getSolutionSpan(l[D]),
            "<br>"
          );
          n = n.concat(l[D]);
          DEBUG &&
            console.log(
              "[step solver]",
              X[D].head + ": ",
              l[D],
              "->",
              d[1],
              b(e, mathlib.SOLVED_FACELET),
              +new Date() - Q
            );
        }
        Q = V.append;
        D = $('<a class="click" target="_blank">alg.cubing.net</a>');
        x = D.attr;
        G = W + " // orientation \n";
        for (L = 0; L < l.length && void 0 != l[L]; L++)
          G +=
            l[L].join(" ").replace(/\s+/g, " ") +
            " // " +
            X[L].head +
            (0 == l[L].length ? " skip" : "") +
            "\n";
        X = "https://alg.cubing.net/?alg=" + encodeURIComponent(G);
        Q.call(V, x.call(D, "href", X + "&setup=" + encodeURIComponent(E)));
      }
      function p() {
        W = O.val();
        c.exec(J, E, P.empty());
      }
      var q = [
          [
            [0, 2, 8, 6],
            [1, 5, 7, 3],
            [18, 36, 45, 9],
            [19, 37, 46, 10],
            [20, 38, 47, 11],
          ],
          [
            [9, 11, 17, 15],
            [10, 14, 16, 12],
            [2, 51, 29, 20],
            [5, 48, 32, 23],
            [8, 45, 35, 26],
          ],
          [
            [18, 20, 26, 24],
            [19, 23, 25, 21],
            [6, 9, 29, 44],
            [7, 12, 28, 41],
            [8, 15, 27, 38],
          ],
          [
            [27, 29, 35, 33],
            [28, 32, 34, 30],
            [24, 15, 51, 42],
            [25, 16, 52, 43],
            [26, 17, 53, 44],
          ],
          [
            [36, 38, 44, 42],
            [37, 41, 43, 39],
            [0, 18, 27, 53],
            [3, 21, 30, 50],
            [6, 24, 33, 47],
          ],
          [
            [45, 47, 53, 51],
            [46, 50, 52, 48],
            [2, 36, 33, 17],
            [1, 39, 34, 14],
            [0, 42, 35, 11],
          ],
          [
            [0, 2, 8, 6],
            [1, 5, 7, 3],
            [18, 36, 45, 9],
            [19, 37, 46, 10],
            [20, 38, 47, 11],
            [21, 39, 48, 12],
            [22, 40, 49, 13],
            [23, 41, 50, 14],
          ],
          [
            [9, 11, 17, 15],
            [10, 14, 16, 12],
            [2, 51, 29, 20],
            [5, 48, 32, 23],
            [8, 45, 35, 26],
            [1, 52, 28, 19],
            [4, 49, 31, 22],
            [7, 46, 34, 25],
          ],
          [
            [18, 20, 26, 24],
            [19, 23, 25, 21],
            [6, 9, 29, 44],
            [7, 12, 28, 41],
            [8, 15, 27, 38],
            [3, 10, 32, 43],
            [4, 13, 31, 40],
            [5, 16, 30, 37],
          ],
          [
            [27, 29, 35, 33],
            [28, 32, 34, 30],
            [24, 15, 51, 42],
            [25, 16, 52, 43],
            [26, 17, 53, 44],
            [21, 12, 48, 39],
            [22, 13, 49, 40],
            [23, 14, 50, 41],
          ],
          [
            [36, 38, 44, 42],
            [37, 41, 43, 39],
            [0, 18, 27, 53],
            [3, 21, 30, 50],
            [6, 24, 33, 47],
            [1, 19, 28, 52],
            [4, 22, 31, 49],
            [7, 25, 34, 46],
          ],
          [
            [45, 47, 53, 51],
            [46, 50, 52, 48],
            [2, 36, 33, 17],
            [1, 39, 34, 14],
            [0, 42, 35, 11],
            [5, 37, 30, 16],
            [4, 40, 31, 13],
            [3, 43, 32, 10],
          ],
          [
            [1, 19, 28, 52],
            [4, 22, 31, 49],
            [7, 25, 34, 46],
          ],
          [
            [21, 12, 48, 39],
            [22, 13, 49, 40],
            [23, 14, 50, 41],
          ],
          [
            [3, 10, 32, 43],
            [4, 13, 31, 40],
            [5, 16, 30, 37],
          ],
          [
            [9, 11, 17, 15],
            [10, 14, 16, 12],
            [2, 51, 29, 20],
            [5, 48, 32, 23],
            [8, 45, 35, 26],
            [36, 42, 44, 38],
            [37, 39, 43, 41],
            [0, 53, 27, 18],
            [3, 50, 30, 21],
            [6, 47, 33, 24],
            [1, 52, 28, 19],
            [4, 49, 31, 22],
            [7, 46, 34, 25],
          ],
          [
            [0, 2, 8, 6],
            [1, 5, 7, 3],
            [18, 36, 45, 9],
            [19, 37, 46, 10],
            [20, 38, 47, 11],
            [27, 33, 35, 29],
            [28, 30, 34, 32],
            [24, 42, 51, 15],
            [25, 43, 52, 16],
            [26, 44, 53, 17],
            [21, 39, 48, 12],
            [22, 40, 49, 13],
            [23, 41, 50, 14],
          ],
          [
            [18, 20, 26, 24],
            [19, 23, 25, 21],
            [6, 9, 29, 44],
            [7, 12, 28, 41],
            [8, 15, 27, 38],
            [45, 51, 53, 47],
            [46, 48, 52, 50],
            [2, 17, 33, 36],
            [1, 14, 34, 39],
            [0, 11, 35, 42],
            [3, 10, 32, 43],
            [4, 13, 31, 40],
            [5, 16, 30, 37],
          ],
        ],
        m = N({ U: 0, R: 17, F: 34, D: 48, L: 65, B: 82 }),
        r = N({ U: 0, R: 17, F: 34, L: 65, B: 82 }),
        H = N({ U: 0, R: 17, M: 97, r: 113 }),
        y = N({ U: 0, R: 17, L: 65 }),
        A = [
          {
            move: m,
            maxl: 8,
            head: "Cross",
            step: {
              "----U--------R--R-----F--F--D-DDD-D-----L--L-----B--B-": 0,
            },
          },
          {
            move: r,
            head: "F2L-1",
            step: {
              "----U-------RR-RR-----FF-FF-DDDDD-D-----L--L-----B--B-": 1,
              "----U--------R--R----FF-FF-DD-DDD-D-----LL-LL----B--B-": 2,
              "----U--------RR-RR----F--F--D-DDD-DD----L--L----BB-BB-": 4,
              "----U--------R--R-----F--F--D-DDDDD----LL-LL-----BB-BB": 8,
            },
          },
          {
            move: r,
            head: "F2L-2",
            step: {
              "----U-------RR-RR----FFFFFFDDDDDD-D-----LL-LL----B--B-": 3,
              "----U-------RRRRRR----FF-FF-DDDDD-DD----L--L----BB-BB-": 5,
              "----U--------RR-RR---FF-FF-DD-DDD-DD----LL-LL---BB-BB-": 6,
              "----U-------RR-RR-----FF-FF-DDDDDDD----LL-LL-----BB-BB": 9,
              "----U--------R--R----FF-FF-DD-DDDDD----LLLLLL----BB-BB": 10,
              "----U--------RR-RR----F--F--D-DDDDDD---LL-LL----BBBBBB": 12,
            },
          },
          {
            move: r,
            head: "F2L-3",
            step: {
              "----U-------RRRRRR---FFFFFFDDDDDD-DD----LL-LL---BB-BB-": 7,
              "----U-------RR-RR----FFFFFFDDDDDDDD----LLLLLL----BB-BB": 11,
              "----U-------RRRRRR----FF-FF-DDDDDDDD---LL-LL----BBBBBB": 13,
              "----U--------RR-RR---FF-FF-DD-DDDDDD---LLLLLL---BBBBBB": 14,
            },
          },
          {
            move: r,
            head: "F2L-4",
            step: {
              "----U-------RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB": 15,
            },
          },
        ],
        w = [
          {
            move: m,
            maxl: 10,
            fmov: ["x ", "x2", "x'"],
            head: "Step 1",
            step: {
              "---------------------F--F--D--D--D-----LLLLLL-----B--B": 0,
            },
          },
          {
            move: H,
            maxl: 16,
            head: "Step 2",
            step: {
              "------------RRRRRR---F-FF-FD-DD-DD-D---LLLLLL---B-BB-B": 1,
            },
          },
        ],
        v = [
          {
            move: m,
            maxl: 8,
            head: "2x2x2",
            step: {
              "---------------------FF-FF-DD-DD--------LL-LL---------": 1,
              "------------------------------DD-DD----LL-LL-----BB-BB": 2,
            },
          },
          {
            move: m,
            maxl: 10,
            head: "2x2x3",
            step: {
              "---------------------FF-FF-DD-DD-DD----LLLLLL----BB-BB": 3,
            },
          },
        ],
        u = [
          {
            move: m,
            maxl: 10,
            head: "EOLine",
            step: {
              "-H-HUH-H-----R-------HFH-F--D-HDH-D-----L-------HBH-B-": 0,
            },
          },
          {
            move: y,
            maxl: 16,
            head: "ZZF2L1",
            step: {
              "-H-HUH-H----RRRRRR---HFF-FF-DDHDD-DD----L-------BBHBB-": 1,
              "-H-HUH-H-----R-------FFHFF-DD-DDHDD----LLLLLL---HBB-BB": 2,
            },
          },
          {
            move: y,
            maxl: 16,
            head: "ZZF2L2",
            step: {
              "-H-HUH-H----RRRRRR---FFFFFFDDDDDDDDD---LLLLLL---BBBBBB": 3,
            },
          },
        ],
        I = [
          {
            move: m,
            maxl: 7,
            head: "EO",
            step: {
              "-H-HUH-H-----R-------HFH----H-HDH-H-----L-------HBH---": 0,
            },
          },
          {
            move: m,
            maxl: 10,
            head: "DR",
            step: {
              "UUUUUUUUU---RRR------FFF---UUUUUUUUU---RRR------FFF---": 1,
            },
          },
        ],
        z,
        O,
        J,
        P,
        W = "z2";
      execMain(function () {
        for (var X = "z2;;z ;z';x ;x'".split(";"), V = 0; 6 > V; V++)
          for (var Q = 0; 3 > Q; Q++) X.push(X[V] + " y" + " 2'".charAt(Q));
        O = $("<select>");
        for (V = 0; V < X.length; V++)
          O.append($("<option>").val(X[V]).html(X[V]));
      });
      return {
        exec: function (X, V, Q) {
          if ("222" == X) {
            t = cubeutil.parseScramble(V, "URFDLB");
            for (X = 0; X < t.length; X++)
              t[X] = "URFDLB".charAt(t[X][0]) + " 2'".charAt(t[X][2] - 1);
            V = "URF UFL ULB UBR DFR DLF DBL DRB".split(" ");
            var d =
              "----UU-UURR-RR-----FF-FF------------------------------ ---UU-UU----------FF-FF--------------LL-LL------------ UU-UU-------------------------------LL-LL-----BB-BB--- -UU-UU----RR-RR------------------------------BB-BB---- ------------RR-RR-----FF-FF-DD-DD--------------------- ---------------------FF-FF-DD-DD--------LL-LL--------- ------------------------------DD-DD----LL-LL-----BB-BB -------------RR-RR-------------DD-DD------------BB-BB-".split(
                " "
              );
            z = z || new mathlib.gSolver(d, e, m);
            for (X = 0; 8 > X; X++) {
              Q.append(V[X] + ": ");
              n = [];
              var l = z.search(b(e, d[X]), 0);
              l
                ? Q.append(tools.getSolutionSpan(l), "<br>")
                : Q.append("no solution found<br>");
            }
          } else {
            P = Q;
            J = X;
            d = W.split(" ");
            l = [0, 1, 2, 3, 4, 5];
            for (
              var D = [
                  [5, 1, 0, 2, 4, 3],
                  [0, 2, 4, 3, 5, 1],
                  [1, 3, 2, 4, 0, 5],
                ],
                x = 0;
              x < d.length;
              x++
            )
              if (d[x][0])
                for (
                  var R = "xyz".indexOf(d[x][0]),
                    G = "? 2'".indexOf(d[x][1] || " "),
                    L = 0;
                  L < G;
                  L++
                )
                  for (var F = 0; 6 > F; F++) l[F] = D[R][l[F]];
            for (F = 0; 6 > F; F++) l[F] = "URFDLB".charAt(l[F]);
            d = l.join("");
            t = cubeutil.parseScramble(V, "URFDLB");
            for (V = 0; V < t.length; V++)
              t[V] = d.charAt(t[V][0]) + " 2'".charAt(t[V][2] - 1);
            Q.append("Orientation:", O.unbind("change").change(p), "<br>");
            "cf" == X && h(A, Q);
            "roux" == X && h(w, Q);
            "petrus" == X && h(v, Q);
            "zz" == X && h(u, Q);
            "eodr" == X && h(I, Q);
          }
        },
        move: e,
      };
    })(),
    k = (function () {
      function e(H, y) {
        if (!H) return null;
        y = ~~y;
        H = H.split("|");
        if (0 == y)
          (y = H[0].slice(6)),
            (H[0] = H[0].slice(0, 6) + H[1].slice(6)),
            (H[1] = H[1].slice(0, 6) + y);
        else {
          var A = 0 < y ? 0 : 1;
          y = Math.abs(y);
          H[A] = H[A].slice(y) + H[A].slice(0, y);
          if (/[a-h]/.exec(H[A][0] + H[A][6])) return null;
        }
        return H.join("|");
      }
      function h(H) {
        for (var y = 0, A = 0, w = [], v = 0; v < H.length; v++)
          0 == H[v]
            ? (0 == y && 0 == A
                ? w.push("/")
                : w.push(((y + 5) % 12) - 5 + "," + (((A + 5) % 12) - 5) + "/"),
              (y = A = 0))
            : 0 < H[v]
            ? (y += ~~H[v])
            : (A -= ~~H[v]);
        return w;
      }
      for (var p = { 0: 33 }, q = 1; 12 > q; q++)
        (p["" + q] = 0), (p["" + -q] = 16);
      var m, r;
      return function (H, y) {
        m =
          m ||
          new mathlib.gSolver(
            [
              "0Aa0Aa0Aa0Aa|Aa0Aa0Aa0Aa0",
              "0Aa0Aa0Aa0Aa|0Aa0Aa0Aa0Aa",
              "Aa0Aa0Aa0Aa0|Aa0Aa0Aa0Aa0",
              "Aa0Aa0Aa0Aa0|0Aa0Aa0Aa0Aa",
            ],
            e,
            p
          );
        r =
          r ||
          new mathlib.gSolver(
            [
              "0Aa0Aa0Aa0Aa|Bb1Bb1Bb1Bb1",
              "0Aa0Aa0Aa0Aa|1Bb1Bb1Bb1Bb",
              "Aa0Aa0Aa0Aa0|Bb1Bb1Bb1Bb1",
              "Aa0Aa0Aa0Aa0|1Bb1Bb1Bb1Bb",
            ],
            e,
            p
          );
        t = [];
        var A = /^\s*\(\s*(-?\d+),\s*(-?\d+)\s*\)\s*$/;
        H = H.split("/");
        for (var w = 0; w < H.length; w++) {
          if (!/^\s*$/.exec(H[w])) {
            var v = A.exec(H[w]);
            ~~v[1] && t.push((~~v[1] + 12) % 12);
            ~~v[2] && t.push(-(~~v[2] + 12) % 12);
          }
          t.push(0);
        }
        0 < t.length && t.pop();
        n = [];
        A = m.search(b(e, "0Aa0Aa0Aa0Aa|Aa0Aa0Aa0Aa0"), 0);
        y.append("Shape: ", tools.getSolutionSpan(h(A)), "<br>");
        n = n.concat(A);
        A = r.search(b(e, "0Aa0Aa0Aa0Aa|Bb1Bb1Bb1Bb1"), 0);
        y.append("Color: ", tools.getSolutionSpan(h(A)), "<br>");
      };
    })(),
    g = (function () {
      function e(q, m) {
        q = q.split("");
        var r = h["RULBrbxy".indexOf(m[0])];
        m = "? '*".indexOf(m[1]);
        for (var H = 0; H < r.length; H++) mathlib.acycle(q, r[H], m);
        return q.join("");
      }
      var h = [
          [
            [5, 25, 15],
            [9, 28, 17],
            [7, 29, 16],
            [8, 26, 19],
            [23, 14, 4],
          ],
          [
            [0, 20, 25],
            [2, 21, 27],
            [4, 22, 29],
            [1, 23, 26],
            [19, 7, 11],
          ],
          [
            [10, 15, 20],
            [13, 18, 24],
            [11, 16, 23],
            [14, 19, 22],
            [29, 1, 8],
          ],
          [
            [25, 20, 15],
            [29, 23, 19],
            [28, 21, 18],
            [27, 24, 17],
            [13, 9, 2],
          ],
          [
            [0, 25, 5],
            [4, 26, 7],
            [3, 27, 9],
            [2, 28, 6],
            [17, 12, 21],
          ],
          [
            [0, 20, 25],
            [2, 21, 27],
            [4, 22, 29],
            [1, 23, 26],
            [19, 7, 11],
          ],
          [
            [0, 25, 15, 10],
            [1, 27, 19, 13],
            [2, 29, 18, 11],
            [3, 26, 17, 14],
            [4, 28, 16, 12],
            [6, 7, 9, 8],
            [21, 23, 24, 22],
          ],
          [
            [5, 10, 20, 25],
            [6, 11, 21, 26],
            [7, 12, 22, 27],
            [8, 13, 23, 28],
            [9, 14, 24, 29],
            [1, 2, 4, 3],
            [16, 18, 19, 17],
          ],
          [],
        ],
        p;
      return function (q, m) {
        p =
          p ||
          new mathlib.gSolver(
            [
              "?L?L??B?B?UUUUU?R?R???F?F?????",
              "?F?F??L?L?UUUUU?B?B???R?R?????",
              "?R?R??F?F?UUUUU?L?L???B?B?????",
              "?B?B??R?R?UUUUU?F?F???L?L?????",
            ],
            e,
            N({ R: 0, r: 1, B: 2, b: 3 }, " '")
          );
        t = cubeutil.parseScramble(q, "RULB");
        for (q = 0; q < t.length; q++)
          t[q] = "RULB".charAt(t[q][0]) + " 2'".charAt(t[q][2] - 1);
        var r = "URFDLB".split(""),
          H =
            "UUUUU?RR???FF????????LL???BB?? ???BBUUUUU??L?L?FF????????R?R? ?B?B??R?R?UUUUU?F?F???L?L????? ????????RR???BBUUUUU???LL???FF ?BB????????R?R????FFUUUUU??L?L ??F?F??R?R???????B?B?L?L?UUUUU".split(
              " "
            );
        for (q = 0; 6 > q; q++) {
          n = [];
          var y = ["x*", "y ", null, "x ", "y*", "y'"],
            A = ~~(b(e, "U????R????F????D????L????B????").indexOf(r[q]) / 5);
          y[A] && n.push(y[A]);
          (y = p.search(b(e, H[q]), 0))
            ? (m.append(r[q] + ": "),
              n[0] &&
                m.append("&nbsp;" + n[0].replace("'", "2").replace("*", "'")),
              m.append(tools.getSolutionSpan(y), "<br>"))
            : m.append(r[q] + ": no solution found<br>");
        }
      };
    })(),
    f = (function () {
      function e(q, m) {
        q = q.split("");
        var r = h["RULB".indexOf(m[0])];
        m = "? '".indexOf(m[1]);
        for (var H = 0; H < r.length; H++) mathlib.acycle(q, r[H], m);
        return q.join("");
      }
      var h = [
          [
            [5, 9, 22],
            [0, 7, 20],
            [1, 8, 18],
          ],
          [
            [3, 16, 11],
            [1, 14, 6],
            [2, 12, 7],
          ],
          [
            [4, 23, 15],
            [2, 18, 13],
            [0, 19, 14],
          ],
          [
            [10, 17, 21],
            [8, 12, 19],
            [6, 13, 20],
          ],
        ],
        p;
      return function (q, m) {
        p =
          p ||
          new mathlib.gSolver(
            ["????FF??RRR??L?L?L?DDDDD"],
            e,
            N({ R: 0, U: 1, L: 2, B: 3 }, " '")
          );
        t = cubeutil.parseScramble(q, "RULBrulb");
        q = [];
        for (var r = 0; r < t.length; r++)
          1 == t[r][1] &&
            q.push("RULB".charAt(t[r][0]) + " 2'".charAt(t[r][2] - 1));
        var H = ["D", "L", "R", "F"],
          y = [
            ["RULB", "LUBR", "BURL"],
            ["URBL", "LRUB", "BRLU"],
            ["RLBU", "ULRB", "BLUR"],
            ["RBUL", "UBLR", "LBRU"],
          ];
        for (r = 0; 4 > r; r++) {
          n = [];
          var A,
            w = 0;
          a: for (; 99 > w; w++)
            for (var v = 0; 3 > v; v++) {
              var u = y[r][v];
              t = [];
              for (var I = 0; I < q.length; I++)
                t.push("RULB"[u.indexOf(q[I][0])] + q[I][1]);
              if ((A = p.search(b(e, "????FF??RRR??L?L?L?DDDDD"), w, w))) {
                for (I = 0; I < A.length; I++)
                  A[I] = u["RULB".indexOf(A[I][0])] + A[I][1];
                break a;
              }
            }
          A
            ? m.append(H[r] + ": ", tools.getSolutionSpan(A), "<br>")
            : m.append(H[r] + ": no solution found<br>");
        }
      };
    })(),
    a = execMain(function () {
      function e(M) {
        r();
        var S = W[0].getBoundingClientRect(),
          Z = ((M.offsetX / 30) * W[0].width) / S.width;
        M = ((M.offsetY / 30) * W[0].height) / S.height;
        for (S = 0; 6 > S; S++)
          if (
            Z >= 3.3 * l[S] &&
            Z <= 3.3 * l[S] + 3 &&
            M >= 3.3 * D[S] &&
            M <= 3.3 * D[S] + 3
          ) {
            var fa = ~~(Z - 3.3 * l[S]),
              ea = ~~(M - 3.3 * D[S]),
              va = V.split("");
            va[9 * S + 3 * ea + fa] = d;
            q(va.join(""));
            h(X, S, fa, ea, V);
          }
        Z >= l[6] &&
          Z <= l[6] + 5 &&
          M >= D[6] &&
          M <= D[6] + 2 &&
          ((fa = ~~(Z - l[6])),
          (ea = ~~(M - D[6])),
          (d = "URFDLB-XYZ".charAt(2 * fa + ea)),
          $.ctxDrawPolygon(X, Q[d], x, [30, 1.5, 1.5]));
      }
      function h(M, S, Z, fa, ea) {
        $.ctxDrawPolygon(
          M,
          Q[ea[9 * S + 3 * fa + Z]],
          [
            [Z, Z, Z + 1, Z + 1],
            [fa, fa + 1, fa + 1, fa],
          ],
          [30, 3.3 * l[S] + 0.1, 3.3 * D[S] + 0.1]
        );
      }
      function p(M) {
        M = w.val();
        w.val("");
        kernel.blur();
        "input" == M
          ? ((M = prompt("U1U2...U9R1..R9F1..D1..L1..B1..B9", V)),
            null != M && (R.exec(M) ? q(M) : logohint.push(LGHINT_INVALID)))
          : "" != M && q(M);
      }
      function q(M) {
        if (V != M) {
          V = M;
          M = X;
          var S = V,
            Z = kernel.getProp("imgSize") / 48;
          W.width(39 * Z + "em");
          W.height(29 * Z + "em");
          W.attr("width", 391);
          W.attr("height", (87 / 9) * 30 + 1);
          for (Z = 0; 6 > Z; Z++)
            for (var fa = 0; 3 > fa; fa++)
              for (var ea = 0; 3 > ea; ea++) h(M, Z, fa, ea, S);
          for (fa = 0; 5 > fa; fa++)
            for (ea = 0; 2 > ea; ea++)
              $.ctxDrawPolygon(
                M,
                Q["URFDLB-XYZ".charAt(2 * fa + ea)],
                [
                  [fa, fa, fa + 1, fa + 1],
                  [ea, ea + 1, ea + 1, ea],
                ],
                [30, 7.25, 0.5]
              );
          $.ctxDrawPolygon(M, Q[d], x, [30, 1.5, 1.5]);
          L = pat3x3.calcPattern(V, V);
          M = 4.325200327448986e19 / (L[0][0] * L[1][0] + L[0][1] * L[1][1]);
          O.html("|G:H|=" + (1e8 < M ? M.toExponential(3) : M));
          r();
        }
      }
      function m() {
        if (A) {
          var M = G[1].searchNext(1e3, 1e3);
          var S =
            J.length +
            " sol(s), @" +
            ~~((+new Date() - F) / 1e3) +
            "s|" +
            G[1].maxl +
            "f";
          M && J.push(M.join(" ") + " (" + M.length + "f)");
          if (1 == A) {
            if ((z.html(M ? J.join("\n") : S), M)) {
              K = 0;
              return;
            }
          } else
            I.html(J.join("\n") + "\n" + S),
              (I[0].scrollTop = I[0].scrollHeight);
          K = setTimeout(m, 1);
        }
      }
      function r() {
        (1 != A && 2 != A) || y();
      }
      function H() {
        G[0] != V &&
          ((G[0] = V),
          (G[1] = new mathlib.gSolver(
            [V],
            c.move,
            N({ U: 0, R: 17, F: 34, D: 48, L: 65, B: 82 })
          )));
        2 == A
          ? (W.hide(), O.addClass("click"), z.hide(), I.show())
          : (W.show(),
            O.removeClass("click"),
            z.html("Searching...").show(),
            I.hide());
        var M = b(c.move, V);
        G[1].search(M, 0, 0);
        F = +new Date();
        J = [];
        m();
      }
      function y() {
        0 == A
          ? (u.val("Stop!"),
            v.prop("disabled", !0),
            (A = "batch" == v.val() ? 2 : 1))
          : (u.val("Solve!"), v.prop("disabled", !1), (A = 0));
        kernel.blur();
        A && H();
      }
      var A = 0,
        w = $('<select style="font-size:0.75em;">'),
        v = $('<select style="font-size:0.75em;">'),
        u = $('<input type="button" value="Solve!" style="font-size:0.75em;">'),
        I = $(
          '<textarea wrap=off rows="8" cols="30" style="font-size:0.75em; display:none;">'
        ),
        z = $("<span>"),
        O = $('<span style="display:block;">'),
        J = [],
        P = {
          "3x3x3": mathlib.SOLVED_FACELET,
          Empty: "----U--------R--------F--------D--------L--------B----",
          "2x2x2": "----UU-UURR-RR-----FF-FF------------------------------",
          "2x2x3": "---UUUUUURR-RR----FFFFFF-------------LL-LL------------",
          Cross: "----U--------R--R-----F--F--D-DDD-D-----L--L-----B--B-",
          XCross: "----U-------RR-RR-----FF-FF-DDDDD-D-----L--L-----B--B-",
          EOLine: "-X-XUX-X-----R-------XFX-F--D-XDX-D-----L-------XBX-B-",
          Roux1: "---------------------F--F--D--D--D-----LLLLLL-----B--B",
          Domino: "UUUUUUUUU---RRR------FFF---UUUUUUUUU---RRR------FFF---",
          "EO&CO": "XYXYUYXYX----R-------YFY---XYXYDYXYX----L-------YBY---",
          Corner: "U-U---U-UR-R---R-RF-F---F-FD-D---D-DL-L---L-LB-B---B-B",
        },
        W,
        X,
        V = mathlib.SOLVED_FACELET,
        Q = {
          U: "#fff",
          R: "#f00",
          F: "#0d0",
          D: "#ff0",
          L: "#fa0",
          B: "#00f",
          "-": "#777",
          X: "#0ff",
          Y: "#f0f",
          Z: "#000",
        },
        d = "-",
        l = [1, 2, 1, 1, 0, 3, 7.25],
        D = [0, 1, 1, 2, 1, 1, 0.5],
        x = [
          [-0.7, -0.7, 0.7, 0.7],
          [-0.7, 0.7, 0.7, -0.7],
        ],
        R = /^[URFDLBXYZ-]{54}$/,
        G = ["", null],
        L = [
          [0, 0],
          [0, 0],
        ],
        F = 0,
        K = 0;
      $(function () {
        W = $("<canvas>");
        if (W[0].getContext) {
          X = W[0].getContext("2d");
          w.append($("<option>").val("").html("Edit subset"));
          for (var M in P) w.append($("<option>").val(P[M]).html(M));
          w.append($("<option>").val("input").html("..."));
          v.append($("<option>").val("single").html("Single"));
          v.append($("<option>").val("batch").html("Batch"));
          q(P.Cross);
        }
      });
      return function (M, S) {
        t = cubeutil.parseScramble(M, "URFDLB");
        for (M = 0; M < t.length; M++)
          t[M] = "URFDLB".charAt(t[M][0]) + " 2'".charAt(t[M][2] - 1);
        n = [];
        S.empty().append(
          $('<table class="table">').append(
            $("<tr>").append(
              $('<td style="padding:0;">').append(
                w.unbind("change").change(p),
                v,
                u.unbind("click").click(y)
              )
            ),
            $("<tr>").append($("<td>").append(I.empty(), z)),
            $("<tr>").append(
              $('<td style="padding:0;">').append(
                W.unbind("mousedown").bind("mousedown", e),
                O.unbind("click").click(function () {
                  r();
                  W.show();
                  O.removeClass("click");
                })
              )
            )
          )
        );
        A && (K && (clearTimeout(K), (K = 0)), H());
      };
    });
  execMain(function () {
    function e(h, p) {
      if (p) {
        p.empty();
        var q = $('<span class="sol"/>'),
          m = tools.getCurScramble();
        E = m[1];
        if ("222face" == h && tools.isPuzzle("222")) C(m[1], q);
        else if (
          "333udf" == h &&
          tools.isPuzzle("333") &&
          /^[URFDLB 2']+$/.exec(m[1])
        )
          a(m[1], q);
        else if (
          h.startsWith("333") &&
          tools.isPuzzle("333") &&
          /^[URFDLB 2']+$/.exec(m[1])
        )
          c.exec(h.slice(3), m[1], q);
        else if ("sq1cs" == h && tools.isPuzzle("sq1")) k(m[1], q);
        else if ("skbl1" == h && tools.isPuzzle("skb")) g(m[1], q);
        else if ("pyrv" == h && tools.isPuzzle("pyr")) f(m[1], q);
        else {
          p.html(IMAGE_UNAVAILABLE);
          return;
        }
        p.append(q);
      }
    }
    $(function () {
      tools.regTool(
        "222face",
        TOOLS_SOLVERS + ">" + TOOLS_222FACE,
        e.bind(null, "222face")
      );
      tools.regTool(
        "333cf",
        TOOLS_SOLVERS + ">Cross + F2L",
        e.bind(null, "333cf")
      );
      tools.regTool(
        "333roux",
        TOOLS_SOLVERS + ">Roux S1 + S2",
        e.bind(null, "333roux")
      );
      tools.regTool(
        "333petrus",
        TOOLS_SOLVERS + ">2x2x2 + 2x2x3",
        e.bind(null, "333petrus")
      );
      tools.regTool(
        "333zz",
        TOOLS_SOLVERS + ">EOLine + ZZF2L",
        e.bind(null, "333zz")
      );
      tools.regTool("333222", TOOLS_SOLVERS + ">2x2x2", e.bind(null, "333222"));
      tools.regTool(
        "333eodr",
        TOOLS_SOLVERS + ">EO + DR",
        e.bind(null, "333eodr")
      );
      tools.regTool(
        "sq1cs",
        TOOLS_SOLVERS + ">SQ1 S1 + S2",
        e.bind(null, "sq1cs")
      );
      tools.regTool(
        "pyrv",
        TOOLS_SOLVERS + ">Pyraminx V",
        e.bind(null, "pyrv")
      );
      tools.regTool(
        "skbl1",
        TOOLS_SOLVERS + ">Skewb Face",
        e.bind(null, "skbl1")
      );
      tools.regTool(
        "333udf",
        TOOLS_SOLVERS + ">3x3x3 General",
        e.bind(null, "333udf")
      );
    });
  });
})();
var thistlethwaite = (function () {
  function b(m) {
    var r = new mathlib.CubieCube();
    m = m.split(" ");
    for (var H = 0; H < m.length; H++) r.selfMoveStr(m[H]);
    return r.toPerm();
  }
  function N(m) {
    for (var r = [], H = 0; H < m.length; H++) r.push(b(m[H]));
    return r;
  }
  function t() {
    if (!(0 < p.length)) {
      for (var m = 0; m < g.length; m++) p[m] = N(g[m]);
      for (m = 0; m < g.length; m++)
        (q[m] = new grouplib.SubgroupSolver(p[m], p[m + 1], f[m] && N(f[m]))),
          q[m].initTables();
      var r = new mathlib.CubieCube();
      r.ori = 8;
      m = r.toPerm(null, null, null, !0);
      var H = k(m, m);
      r.ori = 23;
      r = r.toPerm(null, null, null, !0);
      a = [[m, H], [m, H, r, k(H, r), k(m, r)], [m, H], []];
      e = [["fb", "ud", "rl"], "ud rl fb rl fb ud".split(" "), [""], [""]];
      h = [[9, 21], [5, 17], [1, 13], null];
    }
  }
  function E(m, r, H, y, A) {
    t();
    var w = b(r);
    r = [w];
    var v = [];
    if (y)
      for (y = 0; y < a[m].length; y++) {
        var u = a[m][y],
          I = grouplib.permInv(u);
        r.push(k(u, k(w, I)));
      }
    for (y = 0; y < r.length; y++)
      2 == q[m].checkPerm(r[y]) ? (r[y] = null) : (v[y] = { mask: H ? 2 : 0 });
    var z = null,
      O = g[m],
      J = h[m];
    for (H = 0; 20 > H; H++)
      for (var P = 0; P < r.length; P++)
        if (null != r[P]) {
          var W = "URFDLB RFULBD FURBDL RDFLUB FRDBLU DFRUBL".split(" ")[P];
          if (
            q[m].DissectionSolve(r[P], H, H, v[P], function (X) {
              -1 == X.indexOf(-1) && X.unshift(-1);
              if (0 < X.length && null != J) {
                var V = X[0],
                  Q = X.at(-1);
                if (
                  (-1 != V && -1 == J.indexOf(4 * V[0] + V[1])) ||
                  (-1 != Q && -1 == J.indexOf(4 * Q[0] + Q[1]))
                )
                  return;
              }
              X = X.map(function (d) {
                if (-1 == d) return "@";
                var l = d[0];
                d = ("0 2'".indexOf(O[l][1]) * d[1]) % 4;
                return W.charAt(l) + "0 2'".charAt(d);
              });
              null == z && (z = X);
              return A ? A(X, e[m][P]) : X;
            })
          )
            return z;
        }
    return z;
  }
  function n(m, r) {
    var H = m + " " + r;
    -1 != r.indexOf("@") && (H = r.replace("@", m));
    return H.replace(/\s+/g, " ");
  }
  function C(m, r, H, y, A) {
    t();
    for (var w = [], v = 0; 4 > v; v++)
      (w[v] = []),
        r[v] && w[v].push(r[v]),
        E(v, m, H, y, function (u, I) {
          u = (I ? I + ": " : "") + u.join(" ").replace(/\s+/g, " ");
          -1 == w[v].indexOf(u) && w[v].push(u);
          return w[v].length >= A;
        }),
        (m = n(m, w[v][0].replace(/[^ ]+:/g, "")));
    return w;
  }
  function c(m) {
    var r = /^(.*:\s*)?\s*(.*?)\s*@\s*(.*)$/.exec(m);
    if (!r) return m;
    m = r[1] ? r[1] + " " : "";
    for (var H = r[2].split(" "), y = [], A = H.length - 1; 0 <= A; A--)
      "" != H[A] && y.push(H[A][0] + "' 2'".charAt("'2 ".indexOf(H[A][1]) + 1));
    return 0 < y.length
      ? m + "(" + y.join(" ") + ")" + (r[3] ? " " + r[3] : "")
      : m + r[3];
  }
  var k = grouplib.permMult,
    g = [
      "U ;R ;F ;D ;L ;B ".split(";"),
      "U ;R ;F2;D ;L ;B2".split(";"),
      "U ;R2;F2;D ;L2;B2".split(";"),
      "U2 R2 F2 D2 L2 B2".split(" "),
    ],
    f = [
      null,
      "U ;R2;F2;D ;L2;B2;R U R U R U' R' U' R' U'".split(";"),
      "U2;R2;F2;D2;L2;B2;U D".split(";"),
      null,
    ],
    a = null,
    e = null,
    h = null,
    p = [],
    q = [];
  execMain(function () {
    function m(P) {
      var W = $(P.target).attr("data");
      if (W)
        if ("niss" == W) J != !!w.prop("checked") && ((J = !J), H(z));
        else if (W.startsWith("step")) r(~~W.slice(4));
        else if (W.startsWith("sol")) {
          W = W.slice(3).split("_");
          P = ~~W[0];
          I[P] = O[P][~~W[1]];
          I.length = P + 1;
          O = C(z, I, J, !0, 5);
          for (W = 0; 4 > W; W++) I[W] = O[W][0];
          r(P);
        }
    }
    function r(P) {
      A.empty();
      w = $('<input type="checkbox" data="niss">').prop("checked", J);
      A.append(
        $("<tr>").append(
          "<th>Step</th><th>Solution</th>",
          $("<th>").append($("<label>").append("NISS", w))
        )
      );
      for (var W = 0; 4 > W; W++) {
        var X = $("<tr>").append("<td>" + u[W] + "</td>");
        v[W] = $('<td style="text-align:left" colspan=2>');
        X.append(v[W]);
        X.appendTo(A);
        v[W].append(
          $(
            '<span class="click" data="step' + W + '">' + c(I[W]) + "</span>"
          ).click(m)
        );
      }
      if (-1 != P) {
        W = v[P];
        X = O[P];
        W.empty();
        W.append("<span>" + c(X[0]) + "</span>");
        for (var V = 1; V < X.length; V++)
          W.append(
            "<br>",
            $(
              '<span class="click" data="sol' +
                P +
                "_" +
                V +
                '">' +
                c(X[V]) +
                "</span>"
            ).click(m)
          );
      }
      w.unbind("click").click(m);
    }
    function H(P) {
      z = P;
      O = C(z, [], J, !0, 5);
      for (P = 0; 4 > P; P++) I[P] = O[P][0];
      r(-1);
    }
    function y(P) {
      if (P) {
        P.empty();
        var W = tools.getCurScramble();
        tools.isPuzzle("333") && /^[URFDLB 2']+$/.exec(W[1])
          ? (P.append(A), H(W[1]))
          : P.html(IMAGE_UNAVAILABLE);
      }
    }
    var A = $('<table class="table">'),
      w,
      v = [],
      u = ["EO", "DR", "HTR", "OK"],
      I = [],
      z = "",
      O = [],
      J = !1;
    $(function () {
      tools.regTool("333thistle", TOOLS_SOLVERS + ">EO DR HTR OK", y);
    });
  });
  return { fillStepsCandidates: C };
})();
execMain(function () {
  function b(y) {
    var A = g[0].getBoundingClientRect(),
      w = ((y.offsetX / 30) * g[0].width) / A.width;
    y = ((y.offsetY / 30) * g[0].height) / A.height;
    for (A = 0; 6 > A; A++)
      if (
        w >= 3.3 * p[A] &&
        w <= 3.3 * p[A] + 3 &&
        y >= 3.3 * q[A] &&
        y <= 3.3 * q[A] + 3
      ) {
        var v = ~~(w - 3.3 * p[A]),
          u = ~~(y - 3.3 * q[A]);
        if (1 == v && 1 == u) return;
        var I = a.split("");
        I[9 * A + 3 * u + v] = h;
        t(I.join(""));
      }
    w >= p[6] &&
      w <= p[6] + 5 &&
      y >= q[6] &&
      y <= q[6] + 2 &&
      ((v = ~~(w - p[6])),
      (u = ~~(y - q[6])),
      (h = "URFDLB****".charAt(2 * v + u)),
      $.ctxDrawPolygon(f, e[h], m, [30, 1.5, 1.5]));
  }
  function N(y) {
    y = C.val();
    C.val("");
    kernel.blur();
    if ("input" == y) {
      y = prompt("U1U2...U9R1..R9F1..D1..L1..B1..B9", a);
      if (null == y) return;
      if (!r.exec(y)) {
        logohint.push(LGHINT_INVALID);
        return;
      }
      t(y);
    } else "" != y && t(y);
    E();
  }
  function t(y) {
    if (a != y) {
      a = y;
      y = f;
      var A = a,
        w = kernel.getProp("imgSize") / 48;
      g.width(39 * w + "em");
      g.height(29 * w + "em");
      g.attr("width", 392);
      g.attr("height", (87 / 9) * 30 + 2);
      for (w = 0; 6 > w; w++)
        for (var v = 0; 3 > v; v++)
          for (var u = 0; 3 > u; u++)
            $.ctxDrawPolygon(
              y,
              e[A[9 * w + 3 * u + v]],
              [
                [v, v, v + 1, v + 1],
                [u, u + 1, u + 1, u],
              ],
              [30, 3.3 * p[w] + 0.1, 3.3 * q[w] + 0.1]
            );
      for (v = 0; 5 > v; v++)
        for (u = 0; 2 > u; u++)
          $.ctxDrawPolygon(
            y,
            e["URFDLB****".charAt(2 * v + u)],
            [
              [v, v, v + 1, v + 1],
              [u, u + 1, u + 1, u],
            ],
            [30, 7.25, 0.5]
          );
      $.ctxDrawPolygon(y, e[h], m, [30, 1.5, 1.5]);
      E();
    }
  }
  function E() {
    H[6] != a && ((H = pat3x3.calcPattern(a)), (H[6] = a));
    var y = H[0][0] * H[1][0] + H[0][1] * H[1][1],
      A = y / 4.325200327448986e19;
    c.html(
      "p=" +
        (0 == y
          ? 0
          : 0.001 > A
          ? A.toExponential(3)
          : Math.round(1e6 * A) / 1e4 + "%") +
        (1e-8 > A ? "<br>N=" + (1e8 < y ? y.toExponential(3) : y) : "")
    ).unbind("click");
    "nocache_333patspec" != kernel.getProp("scrType")
      ? c.addClass("click").click(function () {
          kernel.setProp("scrType", "nocache_333patspec");
        })
      : c.removeClass("click");
  }
  function n(y) {
    y &&
      (tools.isPuzzle("333")
        ? (y
            .empty()
            .append(
              $("<table>").append(
                $("<tr>").append(
                  $("<td>").append(C.unbind("change").change(N)),
                  $("<td>").append(c)
                ),
                $("<tr>").append(
                  $("<td colspan=2>").append(
                    g.unbind("mousedown").bind("mousedown", b)
                  )
                )
              )
            ),
          E())
        : y.html(IMAGE_UNAVAILABLE));
  }
  var C = $('<select style="font-size:0.75em;">'),
    c = $("<span>"),
    k = {
      "3x3x3": mathlib.SOLVED_FACELET,
      Empty: "****U********R********F********D********L********B****",
      "U&D": "UUUUUUUUU****R********F****DDDDDDDDD****L********B****",
    },
    g,
    f,
    a = mathlib.SOLVED_FACELET,
    e = {
      U: "#fff",
      R: "#f00",
      F: "#0d0",
      D: "#ff0",
      L: "#fa0",
      B: "#00f",
      "*": "#777",
    },
    h = "*",
    p = [1, 2, 1, 1, 0, 3, 7.25],
    q = [0, 1, 1, 2, 1, 1, 0.5],
    m = [
      [-0.7, -0.7, 0.7, 0.7],
      [-0.7, 0.7, 0.7, -0.7],
    ],
    r = /^[URFDLB*]{54}$/,
    H = [
      [0, 0],
      [0, 0],
    ];
  scrMgr.reg("nocache_333patspec", function () {
    var y = H[0][0] * H[1][0] + H[0][1] * H[1][1];
    if (0 == y) return scramble_333.getRandomScramble();
    var A = pat3x3.genPattern.apply(null, H);
    if (1 == y && A == mathlib.SOLVED_FACELET)
      return scramble_333.getRandomScramble();
    for (; A == mathlib.SOLVED_FACELET; ) A = pat3x3.genPattern.apply(null, H);
    return scramble_333.genFacelet(A).replace(/ +/g, " ");
  });
  $(function () {
    g = $("<canvas>");
    if (g[0].getContext) {
      f = g[0].getContext("2d");
      C.append($("<option>").val("").html("Edit subset"));
      for (var y in k) C.append($("<option>").val(k[y]).html(y));
      C.append($("<option>").val("input").html("..."));
      t(k["U&D"]);
      tools.regTool("pat3x3", TOOLS_SOLVERS + ">3x3x3 Pattern", n);
    }
  });
});
var scrHinter = execMain(
    function (b) {
      function N(f, a, e) {
        var h = new b(),
          p = new b();
        a && h.init(a.ca, a.ea);
        a = 99;
        h.isEqual(f) && (a = 0);
        for (var q, m = 0; m < e.length; m++) {
          var r = 3 * e[m][0];
          for (q = 0; 3 > q; q++)
            if ((b.CubeMult(h, b.moveCube[r + q], p), p.isEqual(f))) {
              a = q == e[m][2] - 1 ? m + 1 : m;
              break;
            }
          if (a == m) break;
          r = 3 * e[m][0] + e[m][2] - 1;
          b.CubeMult(h, b.moveCube[r], p);
          h.init(p.ca, p.ea);
        }
        if (99 == a) return null;
        f = [];
        for (m = 0; m < e.length; m++)
          (r = e[m]),
            0 == a && 0 == m && (r = [r[0], r[1], (r[2] - q + 7) % 4]),
            m == a && f.push(":"),
            f.push("URFDLB".charAt(r[0]) + [null, "", "2", "'"][r[2]]),
            m == a && f.push(":");
        f = f.join(" ");
        return (f = cubeutil.getConjMoves(f, !0));
      }
      function t(f, a) {
        return (
          f &&
          $.map(f.split(" "), function (e) {
            return e && "<span class='" + a + "'>" + e.trim() + "</span>";
          }).join("")
        );
      }
      function E(f) {
        var a = "",
          e = -1 == f.indexOf(":");
        f = $.map(f.split(":", 3), function (h) {
          return h.trim();
        });
        e
          ? ((a += t(f[0], "smrtScrAct")),
            (a += "<span class='smrtScrMrk'>&#x2713;</span>"))
          : ((a += t(f[0], "smrtScrDim")),
            (a += t(f[1], "smrtScrCur")),
            (a += t(f[2], "smrtScrAct")));
        return a;
      }
      var n = [],
        C = null,
        c = null,
        k = null,
        g = new b();
      return {
        setScramble: function (f) {
          C = f;
          f = cubeutil.getConjMoves(f);
          f = cubeutil.parseScramble(f, "URFDLB");
          n = f.slice();
          k = c = null;
          g = new mathlib.CubieCube();
          for (var a = 0; a < f.length; a++) {
            var e = 3 * f[a][0] + f[a][2] - 1;
            0 > e ||
              18 <= e ||
              g.selfMoveStr(
                "URFDLB".charAt(f[a][0]) + " 2'".charAt(f[a][2] - 1)
              );
          }
        },
        getScrCubie: function () {
          return g;
        },
        checkScramble: function (f) {
          return "" == C ? !1 : g.isEqual(f);
        },
        checkState: function (f) {
          if (
            C &&
            GiikerCube.isConnected() &&
            "333" == tools.getCurPuzzle() &&
            0 == timer.getCurTime() &&
            !(0 < timer.status())
          ) {
            var a = null,
              e = null;
            c && (a = N(f, c, k));
            if (null == a || -1 == a.indexOf(":"))
              (e = N(f, null, n)), (a = c = null);
            if (null == e && null == a) {
              c = new b();
              c.init(f.ca, f.ea);
              a = new b();
              a.invFrom(f);
              var h = new b();
              b.CubeMult(a, g, h);
              k = scramble_333.genFacelet(h.toFaceCube());
              k = cubeutil.parseScramble(k, "URFDLB");
              a = N(f, c, k);
            }
            f = a ? E(a) : E(e);
            kernel.pushSignal("scrfix", f);
          }
        },
      };
    },
    [mathlib.CubieCube]
  ),
  giikerutil = execMain(
    function (b) {
      function N() {
        "n" != kernel.getProp("giiVRC") && "g" == kernel.getProp("input")
          ? X.css("font-size", "")
          : X.css("font-size", "75%");
        X.empty();
        X.append($("<tr>").append($("<td colspan=2>").append(A, w)));
        GiikerCube.isConnected() && J
          ? (X.append($("<tr>").append(P, W))
              .append(
                $("<tr>").append(
                  $("<td colspan=2>").append(v.unbind("click").click(k))
                )
              )
              .append(
                $("<tr>").append($("<td>").append(u), $("<td>").append(I))
              )
              .append(O),
            A.html(J).unbind("click").click(r),
            V())
          : A.html(TOOLS_GIIKER + "<br>" + GIIKER_CONNECT)
              .unbind("click")
              .click(q);
        w.unbind("click").click(Ba.showDialog);
      }
      function t(sa) {
        sa && (sa.empty().append(X), N());
      }
      function E(sa) {
        d = sa[0];
        P.html(
          '<span style="font-family:iconfont;"></span> ' + (d || "??") + "%"
        );
        J = sa[1];
        A.html(J);
      }
      function n() {
        GiikerCube.isConnected()
          ? (GiikerCube.getCube()
              .getBatteryLevel()
              .then(function (sa) {
                E(sa);
              }),
            (Q = setTimeout(n, 6e4)))
          : (Q = 0);
      }
      function C() {
        K && (clearTimeout(K), (K = 0));
        kernel.getProp("giiAED") &&
          (K = setTimeout(function () {
            a: {
              var sa = S.slice(Z);
              if (1 != sa.length % 2) {
                var ta = [];
                ta[sa.length] = new b();
                for (var na = sa.length - 1; 0 <= na; na--)
                  (ta[na] = new b()),
                    b.CubeMult(b.moveCube[sa[na][0]], ta[na + 1], ta[na]);
                for (na = 1; 3 > na; na++) {
                  M = 0;
                  if (c(sa, 0, na, new b(), ta)) {
                    sa = na;
                    break a;
                  }
                  if (9999 < M) break;
                }
              }
              sa = 99;
            }
            99 != sa &&
              ((sa = G.toFaceCube()),
              2 >= cubeutil.getProgress(sa, "cfop") ||
                ((sa = scramble_333.genFacelet(G.toFaceCube())),
                10 > sa.length / 3
                  ? DEBUG &&
                    console.log(
                      "[giiker]",
                      "Possible error, gen=" + sa.replace(/ /g, "") + ", ignore"
                    )
                  : (DEBUG &&
                      console.log(
                        "[giiker]",
                        "Almost error, gen=" +
                          sa.replace(/ /g, "") +
                          ", mark solved"
                      ),
                    k())));
          }, 1e3));
      }
      function c(sa, ta, na, U, ba) {
        if (0 == na) return U.isEqual(new b().invFrom(ba[ta]));
        for (var la = new b(); ta < sa.length - 1; ta++) {
          if (~~(sa[ta][0] / 3) % 3 != ~~(sa[ta + 1][0] / 3) % 3) {
            var ka = new b().init(U.ca, U.ea);
            b.CubeMult(ka, b.moveCube[sa[ta + 1][0]], la);
            b.CubeMult(la, b.moveCube[sa[ta][0]], ka);
            b.CubeMult(ka, ba[ta + 2], la);
            if (9999 < ++M) break;
            if (la.edgeCycles() < na) var Aa = c(sa, ta + 2, na - 1, ka, ba);
            if (Aa) return !0;
          }
          b.CubeMult(U, b.moveCube[sa[ta][0]], la);
          U.init(la.ca, la.ea);
        }
        return !1;
      }
      function k() {
        F.invFrom(R);
        L = mathlib.SOLVED_FACELET;
        kernel.setProp("giiSolved", x);
        Z = S.length;
        va = 0;
        V();
        l(L, [], [null, $.now()]);
      }
      function g(sa, ta, na, U) {
        var ba = $.now();
        na = na || [ba, ba];
        J != U && ((J = U), N());
        x = sa;
        R.fromFacelet(x);
        b.CubeMult(F, R, G);
        L = G.toFaceCube();
        0 < ta.length &&
          ((sa = 3 * "URFDLB".indexOf(ta[0][0]) + " 2'".indexOf(ta[0][1])),
          S.push([sa, na[0], na[1]]));
        0 < va && e();
        10 < S.length &&
          (50 < S.length - Z &&
            0 < Z &&
            S[Z - 1][2] < timer.getStartTime() &&
            ((S = S.slice(Z)), (Z = 0)),
          (sa = f(S, !0)),
          W.html(
            '<span style="font-family:iconfont;"></span> ' +
              Math.round(1e5 * (sa[0] - 1)) / 1e3 +
              "%"
          ));
        L == mathlib.SOLVED_FACELET && (y(), (Z = S.length), (va = 0));
        V();
        0 == Q && n();
        C();
        sa = L;
        ra && (b.CubeMult(ra, G, ya), (sa = ya.toFaceCube()));
        l(sa, ta, na);
        scrHinter.checkState(G);
      }
      function f(sa, ta) {
        for (
          var na = 0, U = 0, ba = 0, la = 0, ka = 0, Aa = 0, Da = 0;
          Da < sa.length;
          Da++
        ) {
          var Ha = sa[Da][ta ? 2 : 1],
            Ma = sa[Da][ta ? 1 : 2];
          null != Ha &&
            null != Ma &&
            (Aa++,
            (na += Ha),
            (U += Ma),
            (ba += Ha * Ma),
            (la += Ha * Ha),
            (ka += Ma * Ma));
        }
        sa = Aa * ka - U * U;
        la = Aa * la - na * na;
        ta = Aa * ba - na * U;
        ba = 0.001 > la ? 1 : ta / la;
        ta = 0.001 > la || 0.001 > sa ? 1 : Math.pow(ta, 2) / la / sa;
        return [
          ba,
          1 > Aa ? 0 : U / Aa - (ba * na) / Aa,
          ta,
          3 > Aa || 0.001 > la
            ? 0
            : Math.sqrt(((sa / la) * (1 - ta)) / (Aa - 2)),
        ];
      }
      function a(sa, ta, na) {
        if (0 == sa.length) return sa;
        if (2 <= sa.length) {
          for (var U = sa.length - 1; 0 < U; U--)
            null != sa[U][1] &&
              null == sa[U - 1][1] &&
              (sa[U - 1][1] = sa[U][1] - 50);
          for (U = 0; U < sa.length - 1; U++)
            null != sa[U][1] &&
              null == sa[U + 1][1] &&
              (sa[U + 1][1] = sa[U][1] + 50);
        }
        var ba = f(sa);
        U = ba[0];
        ba = ba[1];
        var la = Math.round(U * sa[0][1] + ba),
          ka = Math.round(U * sa.at(-1)[1] + ba);
        null == ta || ta > la
          ? (ta = la)
          : null != na && na < ka && (ta -= Math.min(la - ta, ka - na));
        for (na = 0; na < sa.length; na++)
          sa[na][1] = Math.round(U * sa[na][1] + ba) - ta;
        return sa;
      }
      function e() {
        for (var sa = S.length - Z, ta = "", na = 0; na < va; na++) {
          var U = S[na + Z][0];
          ta += "URFDLB".charAt(~~(U / 3)) + " 2'".charAt(U % 3);
        }
        var ba = "",
          la = [];
        for (na = va; na < sa; na++) la.push(S[na + Z].slice());
        la = a(la);
        for (na = 0; na < la.length; na++)
          (U = la[na]),
            (ba +=
              "URFDLB".charAt(~~(U[0] / 3)) +
              " 2'".charAt(U[0] % 3) +
              "/*" +
              U[1] +
              "*/");
        h(u, "Raw (" + sa + ")", ta, ba);
      }
      function h(sa, ta, na, U) {
        na || U
          ? sa.attr(
              "href",
              "https://alg.cubing.net/?alg=" +
                encodeURIComponent(U) +
                "&setup=" +
                encodeURIComponent(na)
            )
          : sa.removeAttr("href");
        sa.html(ta);
      }
      function p(sa, ta) {
        if ("disconnect" == sa)
          return (
            logohint.push(LGHINT_BTDISCON),
            N(),
            kernel.pushSignal("scrfix", fa),
            "function" == typeof D && D(sa, ta)
          );
      }
      function q() {
        d = Q = 0;
        J = null;
        x = mathlib.SOLVED_FACELET;
        R = new b();
        G = new b();
        L = x;
        F = new b();
        S = [];
        va = Z = 0;
        ra = null;
        ya = new b();
        W.html('<span style="font-family:iconfont;"></span> 0%');
        h(u, "Raw(N/A)");
        h(I, "Pretty(N/A)");
        x = kernel.getProp("giiSolved", mathlib.SOLVED_FACELET);
        R.fromFacelet(x);
        F.invFrom(R);
        GiikerCube.setCallback(g);
        GiikerCube.setEventCallback(p);
        return GiikerCube.isConnected()
          ? Promise.resolve()
          : GiikerCube.init().then(function () {
              logohint.push(LGHINT_BTCONSUC);
            });
      }
      function m() {
        return GiikerCube.isConnected()
          ? GiikerCube.stop().then(function () {
              p("disconnect");
            })
          : Promise.resolve();
      }
      function r() {
        GiikerCube.isConnected() && confirm("Disconnect?") && m();
      }
      function H(sa, ta) {
        "scrambling" == sa
          ? (fa = "")
          : "scramble" == sa || "scrambleX" == sa
          ? ((sa = ta[0]),
            (fa = ta[1]),
            "333" != tools.puzzleType(sa) && (fa = ""),
            scrHinter.setScramble(fa),
            scrHinter.checkState(G))
          : "property" == sa
          ? 0 <= ["giiVRC", "imgSize"].indexOf(ta[0])
            ? N()
            : /^(preScrT?|isTrainScr)$/.exec(ta[0]) &&
              (scrHinter.setScramble(fa), scrHinter.checkState(G))
          : "timestd" != sa ||
            ta[4] ||
            ((ea = [timer.getStartTime(), ta[0][1], ta[1]]), setTimeout(y, 0));
      }
      function y() {
        if (ea) {
          var sa = ea[0],
            ta = S.length,
            na = ea[2];
          0 < ta && S[ta - 1][2] > ea[0] + ea[1] + 1e3 && (ea = null);
          for (var U = S.length - 1; 0 <= U && !(S[U][2] < sa - 500); U--)
            ta = U;
          if (ta != S.length) {
            sa = new mathlib.CubieCube();
            var ba = [],
              la = mathlib.CubieCube.rotMulI[0][cubeutil.getPreConj()];
            for (U = ta; U < S.length; U++) {
              ta = S[U].slice();
              var ka = mathlib.CubieCube.rotMulM[la][ta[0]];
              ta[0] = "URFDLB".charAt(~~(ka / 3)) + " 2'".charAt(ka % 3);
              ba.push(ta);
              sa.selfMoveStr(ta[0]);
            }
            ba = a(ba);
            U = cubeutil.moveSeq2str(ba);
            kernel.pushSignal("giirecons", [na, [U, "333"]]);
            ba = (na || "").split(" ");
            na = new mathlib.CubieCube();
            for (U = 0; U < ba.length; U++) na.selfMoveStr(ba[U]);
            U = new mathlib.CubieCube();
            U.invFrom(sa);
            na.toFaceCube() == U.toFaceCube() &&
              (DEBUG && console.log("[bluetooth] recons clear, cube solved"),
              (ea = null));
          }
        }
      }
      var A = $('<span class="click"></span>'),
        w = $(
          '<span class="click" style="font-family:iconfont;padding-left:0.5em;"></span>'
        ),
        v = $("<span>" + GIIKER_RESET + "</span>").addClass("click"),
        u = $('<a target="_blank">Raw(N/A)</a>').addClass("click"),
        I = $('<a target="_blank">Pretty(N/A)</a>').addClass("click"),
        z = $("<canvas>").css({
          display: "block",
          "box-sizing": "content-box",
          margin: "auto",
          padding: "5px",
        }),
        O = $("<tr>").append($('<td colspan=2 style="padding:0;">').append(z)),
        J = null,
        P = $("<td>").html('<span style="font-family:iconfont;"></span> ??%'),
        W = $("<td>").html('<span style="font-family:iconfont;"></span> 0%'),
        X = $('<table class="table">'),
        V = (function () {
          var sa = [],
            ta,
            na = [
              [1, -0.5, 1.5, 0, 0.5, 0],
              [0.5, 0, 3, -0.5, 1, 1.5],
              [1, 0, 0, 0, 1, 1.5],
              [1, 0.5, 5.5, 0, 0.5, 0],
              [-0.5, 0, 7, -0.5, -1, 4.5],
              [-1, 0, 10, 0, -1, 4.5],
            ];
          return function () {
            if (z)
              if (
                "n" != kernel.getProp("giiVRC") &&
                "g" == kernel.getProp("input")
              )
                O.hide();
              else {
                sa = kernel.getProp("colcube").match(/#[0-9a-fA-F]{3}/g);
                O.show();
                ta = z[0].getContext("2d");
                var U = kernel.getProp("imgSize") / 60;
                z.width((10 / 4.5) * 21 * U + "em");
                z.height(21 * U + "em");
                z.attr("width", 300);
                z.attr("height", 135);
                for (U = 0; 6 > U; U++) {
                  for (
                    var ba = U, la = L, ka = na[ba].slice(), Aa = 0;
                    Aa < ka.length;
                    Aa++
                  )
                    ka[Aa] *= 30;
                  for (Aa = 0; 3 > Aa; Aa++)
                    for (var Da = 0; 3 > Da; Da++)
                      $.ctxDrawPolygon(
                        ta,
                        sa["DLBURF".indexOf(la[3 * (3 * ba + Da) + Aa])],
                        [
                          [Aa, Aa, Aa + 1, Aa + 1],
                          [Da, Da + 1, Da + 1, Da],
                        ],
                        ka
                      );
                }
              }
          };
        })(),
        Q = 0,
        d = 0,
        l = $.noop,
        D = $.noop,
        x = mathlib.SOLVED_FACELET,
        R = new b(),
        G = new b(),
        L = x,
        F = new b(),
        K = 0,
        M = 0,
        S = [],
        Z = 0,
        fa,
        ea = null,
        va = 0,
        ra = null,
        ya = new b(),
        Ba = (function () {
          function sa() {
            na = !1;
          }
          var ta = [],
            na = !1,
            U = $('<textarea style="width:100%;height:100%;" readonly>');
          return {
            showDialog: function () {
              na = !0;
              U.val(ta.join("\n"));
              U[0].scrollTop = U[0].scrollHeight;
              kernel.showDialog([U, sa, sa, sa], "share", "Bluetooth Debug");
            },
            appendLog: function () {
              for (
                var ba = new Date().toISOString(),
                  la = ["[" + ba + "]"],
                  ka = 0;
                ka < arguments.length;
                ka++
              )
                la.push(String(arguments[ka]));
              DEBUG &&
                console.log.apply(null, [].concat([ba], Array.from(arguments)));
              ta.push(la.join(" "));
              1e3 < ta.length && (ta = ta.slice(100));
              na &&
                (U.val(ta.join("\n")), (U[0].scrollTop = U[0].scrollHeight));
            },
          };
        })();
      $(function () {
        kernel.regListener("giiker", "scramble", H);
        kernel.regListener("giiker", "scrambling", H);
        kernel.regListener("giiker", "scrambleX", H);
        kernel.regListener("giiker", "timestd", H);
        kernel.regListener(
          "giiker",
          "property",
          H,
          /^(?:giiVRC|imgSize|preScrT?|isTrainScr)$/
        );
        tools.regTool("giikerutil", TOOLS_GIIKER, t);
      });
      return {
        setCallback: function (sa) {
          l = sa;
        },
        setEventCallback: function (sa) {
          D = sa;
        },
        markSolved: k,
        checkScramble: function () {
          return scrHinter.checkScramble(G);
        },
        markScrambled: function (sa) {
          var ta = G;
          sa && (ta = scrHinter.getScrCubie());
          ta.isEqual(G) ||
            (DEBUG && console.log("[bluetooth] scramble equal, start hack!"),
            (ra = new mathlib.CubieCube()),
            ya.invFrom(G),
            b.CubeMult(ta, ya, ra),
            (Z = S.length),
            l(ta.toFaceCube(), [], [null, $.now()]));
          va = S.length - Z;
          e();
          h(I, "Pretty(N/A)");
        },
        init: q,
        stop: m,
        isSync: function () {
          return null == ra;
        },
        reSync: function () {
          ra && ((ra = null), l(L, [], [null, $.now()]));
        },
        tsLinearFix: a,
        updateBattery: E,
        setLastSolve: function (sa) {
          h(I, "Pretty", cubeutil.getConjMoves(fa), sa);
        },
        log: Ba.appendLog,
      };
    },
    [mathlib.CubieCube]
  );
var metronome = execMain(function () {
  function b(u) {
    return 99 < u ? u : " " + u;
  }
  function N(u) {
    u
      ? (u
          .empty()
          .append("BPM: ", a, h, "<br />")
          .append("Vol: ", e, p, "<br />", f, "<br />")
          .append(
            "<br />",
            $("<label>").append(r, '<span class="click"> Beep at</span>'),
            "<br />",
            m
          ),
        a.unbind().on("input", function () {
          $.waitUser.call();
          g && (h.html(b(a.val())), E());
        }),
        e.unbind().on("input", function () {
          $.waitUser.call();
          g && (p.html(b(e.val())), (q.gain.value = e.val() / 100));
        }),
        f.html(H ? "Stop!" : "Start!"),
        f.unbind().click(function () {
          $.waitUser.call();
          H = !H;
          f.html(H ? "Stop!" : "Start!");
          E();
        }),
        t())
      : (null != y && (clearInterval(y), (y = null)), (H = !1));
  }
  function t() {
    r.unbind("change").change(C).prop("checked", kernel.getProp("beepEn"));
    m.unbind("change").change(C).val(kernel.getProp("beepAt"));
    C();
  }
  function E() {
    null != y && (clearInterval(y), (y = null));
    if (H) {
      var u = 6e4 / ~~a.val();
      y = setInterval(n, u);
    }
  }
  function n(u) {
    if (g) {
      var I = g.createOscillator();
      I.type = "sine";
      I.frequency.value = u || 440;
      I.connect(q);
      I.start(g.currentTime);
      I.stop(g.currentTime + 0.1);
    }
  }
  function C(u) {
    u && $.waitUser.call();
    r.prop("checked")
      ? c(m.val())
      : null != A && (clearInterval(A), (A = null));
    kernel.setProp("beepEn", r.prop("checked"));
    kernel.blur();
  }
  function c(u) {
    null != A && (clearInterval(A), (A = null));
    u = u.split(",");
    for (var I = 0; I < u.length; I++) u[I] = ~~(1e3 * u[I].trim()) / 1e3;
    u = u.filter(Number);
    u.sort(function (z, O) {
      return z - O;
    });
    w = u;
    m.val(u.join(","));
    kernel.setProp("beepAt", u.join(","));
    A = setInterval(k, 100);
  }
  function k() {
    var u = ~~timer.getCurTime() / 1e3;
    if (0 == u) v = 0;
    else {
      for (var I = !1; v < w.length && u > w[v] - 0.05; ) ++v, (I = !0);
      I && n(550);
    }
  }
  var g,
    f = $(
      '<span style="display:inline-block; text-align:center; width:100%;"/>'
    ).addClass("click"),
    a = $(
      '<input type="range" value="60" min="10" max="360" style="width:7em;" />'
    ),
    e = $(
      '<input type="range" value="30" min="0" max="100" style="width:7em;" />'
    ),
    h = $("<span />").html(" 60"),
    p = $("<span />").html(" 30"),
    q,
    m = $('<input type="text" style="width:7em;" />'),
    r = $('<input type="checkbox" />'),
    H = !1,
    y = null,
    A = null,
    w = [],
    v = 0;
  $(function () {
    kernel.regProp("tools", "beepEn", -6, "Beep Enable", [!1]);
    kernel.regProp("tools", "beepAt", -6, "Beep At", ["5,10,15,20"]);
    var u = window.AudioContext || window.webkitAudioContext;
    void 0 !== u &&
      ($.waitUser.reg(function () {
        g = new u();
        q = g.createGain();
        q.gain.value = 0.3;
        q.connect(g.destination);
      }),
      tools.regTool("mtrnm", TOOLS_METRONOME, N));
    t();
  });
  return { playTick: n };
});
var onlinecomp = execMain(function () {
  function b(d, l) {
    for (; z.length > l; ) z.pop().remove();
    var D = d;
    if (-1 != O.indexOf(D)) D = null;
    else {
      var x = [];
      D += "|";
      for (
        var R = D.length, G = $('<select style="max-width: unset;">'), L = 0;
        L < O.length;
        L++
      )
        if (O[L].startsWith(D)) {
          var F = O[L].slice(R).split("|", 1)[0];
          -1 == x.indexOf(F) &&
            (x.push(F), G.append($("<option>").val(F).html(F)));
        }
      D = 0 == x.length ? null : G.change(N);
    }
    D && ((z[l] = D), y.append(z[l]), b(d + "|" + z[l].val(), l + 1));
  }
  function N(d) {
    d = $(d.target).prevAll("select").length;
    for (var l = "", D = 0; D <= d; D++) l = l + "|" + z[D].val();
    b(l, d + 1);
    g();
    l == "|" + OLCOMP_UPDATELIST + "..." && t();
  }
  function t() {
    H.val("...");
    $.post("https://cstimer.net/comp.php", { action: "list" }, function (d) {
      O = [];
      d = JSON.parse(d).data;
      for (var l = 0; l < d.length; l++) {
        var D = d[l].fullname;
        J[D] = d[l].name;
        for (var x = JSON.parse(d[l].value), R = 0; R < x.length; R++)
          O.push("|" + D + "|" + x[R]);
      }
      O.push("|" + OLCOMP_UPDATELIST + "...");
      J[OLCOMP_UPDATELIST + "..."] = "update";
      b("", 0);
      g();
      H.hide();
    }).error(function () {
      logohint.push(LGHINT_NETERR);
      H.val(OLCOMP_UPDATELIST);
    });
  }
  function E() {
    for (var d = "", l = 0; l < z.length; l++) d += "|" + z[l].val();
    if (-1 == O.indexOf(d)) alert("Invalid Input");
    else
      return (
        (l = d.slice(1).split("|", 1)[0]),
        (d = d.slice(l.length + 2)),
        (l = J[l]),
        [l, d]
      );
  }
  function n() {
    var d = E();
    $.post(
      "https://cstimer.net/comp.php",
      { action: "scramble", comp: d[0], path: d[1] },
      function (l) {
        l = JSON.parse(l);
        0 == l.retcode && l.data
          ? ((V = l = l.data),
            (Q = $.map(l, function (D) {
              return (D = /^\$T([a-zA-Z0-9]+)\$\s*(.*)$/.exec(D))
                ? scramble.getTypeName(D[1])
                : "???";
            })),
            g(!0),
            kernel.setProp("scrType", "remoteComp"))
          : logohint.push(l.reason || LGHINT_SERVERR);
      }
    ).error(function () {
      logohint.push(LGHINT_NETERR);
    });
  }
  function C() {
    var d = prompt(OLCOMP_SUBMITAS, exportFunc.getDataId("locData", "compid"));
    if (null == d) return !1;
    if (!exportFunc.isValidId(d)) return alert(EXPORT_INVID), !1;
    localStorage.locData = JSON.stringify({
      id: exportFunc.getDataId("locData", "id"),
      compid: d,
    });
    c();
    return d;
  }
  function c() {
    q.empty().append("ID: ");
    m.empty();
    r.empty();
    if (exportFunc.getDataId("wcaData", "cstimer_token")) {
      var d = exportFunc.getDataId("wcaData", "wca_me").wca_id;
      m.append(d || "WCA Account", " (WCA)").click(function () {
        exportFunc.logoutFromWCA(!0);
        c();
      });
      q.append(m);
    } else
      m.append(EXPORT_LOGINWCA),
        m.click(function () {
          location.href = exportFunc.wcaLoginUrl;
        }),
        (d = exportFunc.getDataId("locData", "compid"))
          ? r.append(d + " (" + OLCOMP_ANONYM + ")")
          : r.append("N/A (" + OLCOMP_ANONYM + ")"),
        q.append(r.unbind("click").click(C), " | ", m);
  }
  function k(d, l) {
    !d || P
      ? (P = !!d)
      : (d
          .empty()
          .append(
            $('<div style="font-size: 0.75em; text-align: center;">')
              .append(q, H, y)
              .append(A)
              .append(w, " ", v, " ")
              .append($("<label>").append(I, OLCOMP_WITHANONYM), " ", u)
          ),
        b("", 0),
        c(),
        g(),
        (P = !0));
  }
  function g(d, l) {
    W = [];
    d || ((V = []), (Q = []));
    l || (X = !1);
    f();
  }
  function f() {
    w.unbind("click");
    v.unbind("click");
    u.unbind("click").click(h);
    if (2 > z.length)
      w.attr("disabled", !0).val(OLCOMP_START), v.attr("disabled", !0);
    else {
      A.empty();
      if (0 == Q.length)
        z[0].val().startsWith("*") || z[0].val().startsWith("+") || X
          ? X
            ? w.attr("disabled", !0).val(OLCOMP_SUBMIT)
            : w.attr("disabled", !0).val(OLCOMP_START)
          : w.removeAttr("disabled").val(OLCOMP_START).click(n);
      else {
        for (var d = 0; d < Q.length; d++)
          /^\$T([a-zA-Z0-9]+)\$\s*(.*)$/.exec(Q[d]),
            A.append(
              d + 1 + ". " + (W[d] ? stats.pretty(W[d][0]) : Q[d]),
              "<br>"
            );
        W.length != Q.length || X
          ? w.attr("disabled", !0)
          : (w.removeAttr("disabled"), w.val(OLCOMP_SUBMIT).click(a));
      }
      v.removeAttr("disabled").click(e);
    }
    kernel.blur();
  }
  function a() {
    if (!X) {
      var d =
        exportFunc.getDataId("wcaData", "cstimer_token") ||
        exportFunc.getDataId("locData", "compid") ||
        C();
      if (d) {
        var l = E();
        $.post(
          "https://cstimer.net/comp.php",
          {
            action: "submit",
            comp: l[0],
            path: l[1],
            uid: d,
            value: JSON.stringify(W),
          },
          function (D) {
            '{"retcode":0}' == D
              ? ((X = !0), logohint.push(LGHINT_SUBMITED))
              : logohint.push(LGHINT_NETERR);
            f();
          }
        ).error(function () {
          logohint.push(LGHINT_NETERR);
        });
      }
    }
  }
  function e() {
    if (0 == W.length || X || confirm(OLCOMP_ABORT)) {
      g(!1, !0);
      var d = E(),
        l = I.prop("checked") ? 1 : 0;
      $.post(
        "https://cstimer.net/comp.php",
        { action: "result", comp: d[0], path: d[1], anonym: l },
        function (D) {
          try {
            D = JSON.parse(D);
          } catch (ea) {
            D = {};
          }
          if (0 !== D.retcode) logohint.push(LGHINT_SERVERR);
          else {
            var x = $.sha256(
                "cstimer_public_salt_" +
                  exportFunc.getDataId("locData", "compid")
              ),
              R = (exportFunc.getDataId("wcaData", "wca_me") || {}).wca_id,
              G = D.scramble;
            D = $.map(D.data, function (ea) {
              var va = JSON.parse(ea.value);
              if (5 == va.length) {
                var ra = new TimeStat([5], va.length, function (ya) {
                  return -1 == va[ya][0][0] ? -1 : va[ya][0][0] + va[ya][0][1];
                });
                ra.getAllStats();
                return {
                  uid: ea.uid,
                  wca_id: ea.wca_id,
                  value: va,
                  ao5: ra.lastAvg[0][0],
                  bo5: ra.bestTime,
                };
              }
            });
            D.sort(function (ea, va) {
              var ra = TimeStat.dnfsort(ea.ao5, va.ao5);
              return 0 == ra ? TimeStat.dnfsort(ea.bo5, va.bo5) : ra;
            });
            for (
              var L = [
                  '<table class="table"><tr><th></th><th>User</th><th>ao5</th><th>bo5</th><th>Results</th></tr>',
                ],
                F = 0;
              F < D.length;
              F++
            ) {
              var K = D[F].uid,
                M = D[F].value,
                S = D[F].ao5,
                Z = D[F].bo5,
                fa = D[F].wca_id;
              L.push("<tr><td>" + (F + 1) + "</td>");
              void 0 !== fa
                ? ((K = fa
                    ? '<a target="_blank" href="https://www.worldcubeassociation.org/persons/' +
                      fa +
                      '">' +
                      fa +
                      "</a>"
                    : OLCOMP_WCAACCOUNT),
                  L.push(
                    fa == R
                      ? "<th>" + OLCOMP_ME + ":" + K + "</th><td>"
                      : "<td>" + K + "</td><td>"
                  ))
                : L.push(
                    K == x
                      ? "<th>" + OLCOMP_ME + "</th><td>"
                      : "<td>" + OLCOMP_ANONYM + "</td><td>"
                  );
              L.push(
                kernel.pretty(S) + "</td><td>" + kernel.pretty(Z) + "</td><td>"
              );
              for (K = 0; K < M.length; K++)
                4 < M[K].length
                  ? ((M[K][1] = scramble.scrStd("", G[K] || "")[1]),
                    L.push(
                      '<a target="_blank" class="click" href="' +
                        stats.getReviewUrl(M[K]) +
                        '">' +
                        stats.pretty(M[K][0]) +
                        "</a> "
                    ))
                  : L.push(stats.pretty(M[K][0]) + " ");
              L.push("</td>");
              L.push("</tr>");
            }
            L.push("</table>");
            A.empty().html(L.join(""));
          }
        }
      ).error(function () {
        logohint.push(LGHINT_NETERR);
      });
    }
  }
  function h() {
    if (0 == W.length || X || confirm(OLCOMP_ABORT)) {
      g(!1, !0);
      var d =
        exportFunc.getDataId("wcaData", "cstimer_token") ||
        exportFunc.getDataId("locData", "compid") ||
        C();
      d &&
        $.post(
          "https://cstimer.net/comp.php",
          { action: "myresult", uid: d },
          function (l) {
            try {
              l = JSON.parse(l);
            } catch (L) {
              l = {};
            }
            if (0 !== l.retcode) logohint.push(LGHINT_SERVERR);
            else {
              l = l.data;
              for (
                var D = [
                    '<table class="table"><tr><th></th><th>Comp.</th><th>ao5</th><th>bo5</th><th>Results</th></tr>',
                  ],
                  x = 0;
                x < l.length;
                x++
              ) {
                var R = JSON.parse(l[x].value);
                if (5 != R.length) return;
                var G = new TimeStat([5], R.length, function (L) {
                  return -1 == R[L][0][0] ? -1 : R[L][0][0] + R[L][0][1];
                });
                G.getAllStats();
                D.push("<tr><td>" + (x + 1) + "</td>");
                D.push("<td>" + l[x].fullname + "|" + l[x].path + "</td>");
                D.push("<td>" + kernel.pretty(G.lastAvg[0][0]) + "</td>");
                D.push("<td>" + kernel.pretty(G.bestTime) + "</td><td>");
                for (G = 0; G < R.length; G++)
                  4 < R[G].length
                    ? ((R[G][1] = scramble.scrStd(
                        "",
                        JSON.parse(l[x].scramble)[G] || ""
                      )[1]),
                      D.push(
                        '<a target="_blank" class="click" href="' +
                          stats.getReviewUrl(R[G]) +
                          '">' +
                          stats.pretty(R[G][0]) +
                          "</a> "
                      ))
                    : D.push(stats.pretty(R[G][0]) + " ");
                D.push("</td>");
                D.push("</tr>");
              }
              D.push("</table>");
              A.empty().html(D.join(""));
            }
          }
        ).error(function () {
          logohint.push(LGHINT_NETERR);
        });
    }
  }
  function p(d, l) {
    if (P)
      if ("export" == d) c();
      else {
        l = JSON.parse(JSON.stringify(l));
        var D = l[1];
        l[1] = "";
        l[2] = "";
        if ("timestd" == d)
          for (d = W.length; d < V.length; d++) {
            var x = scramble.scrStd("", V[d])[1];
            if (x != D) (l[0] = [-1, 1]), W.push(l);
            else {
              W.push(l);
              break;
            }
          }
        else if ("timepnt" == d)
          for (d = 0; d < W.length; d++)
            if (((x = scramble.scrStd("", V[d])[1]), x == D)) {
              W[d] = l;
              break;
            }
        f();
      }
  }
  var q = $("<div>"),
    m = $('<span class="click">'),
    r = $('<span class="click">'),
    H = $('<input type="button">').val(OLCOMP_UPDATELIST).click(t),
    y = $("<div>"),
    A = $(
      '<div class="noScrollBar" style="max-height: 8em; overflow-y: auto;">'
    ),
    w = $('<input type="button">'),
    v = $('<input type="button">').val(OLCOMP_VIEWRESULT),
    u = $('<input type="button">').val(OLCOMP_VIEWMYRESULT),
    I = $('<input type="checkbox">'),
    z = [],
    O = [],
    J = {},
    P = !1,
    W = [],
    X = !1,
    V = [],
    Q = [];
  $(function () {
    tools.regTool("onlinecomp", OLCOMP_OLCOMP, k);
    kernel.regListener("onlinecomp", "timestd", p);
    kernel.regListener("onlinecomp", "timepnt", p);
    kernel.regListener("onlinecomp", "export", p, /^account$/);
  });
  return {
    getScrambles: function () {
      return 0 == W.length ? Promise.resolve(V.slice()) : Promise.reject();
    },
  };
});
var battle = execMain(function () {
  function b(P) {
    A &&
      w &&
      H.isConnected() &&
      (!P && y && (clearTimeout(y), (y = 0)),
      P && H.pushMsg({ action: "heartBeat", roomId: A, accountId: w }),
      (y = setTimeout(b.bind(null, !0), 15e3)));
  }
  function N(P) {
    if (P || !A) {
      P = prompt(
        TOOLS_BATTLE_JOINALERT + " [a-zA-Z0-9]",
        A || 100 + ~~(900 * Math.random())
      );
      if (!/^[0-9a-zA-Z]{3,20}$/.exec(P)) {
        alert("invalid room ID");
        return;
      }
      A = P;
    }
    H.isConnected()
      ? E() &&
        A &&
        H.remoteCall({
          action: "joinRoom",
          roomId: A,
          accountId: w,
          scramble: scramble_333.getRandomScramble().trim(),
        }).then(function (W) {
          DEBUG && console.log("[battle] joinRoom ret=", JSON.stringify(W));
          b();
        })
      : H.connect().then(N.bind(null, !1));
  }
  function t(P) {
    E(!0) &&
      A &&
      (P || confirm(TOOLS_BATTLE_LEAVEALERT + "?")) &&
      (H.remoteCall({ action: "leaveRoom", roomId: A, accountId: w }).then(
        H.close,
        H.close
      ),
      (v = null),
      c(),
      b());
  }
  function E(P) {
    return (!v && P) || !H.isConnected()
      ? (w = null)
      : (w =
          exportFunc.getDataId("wcaData", "cstimer_token") ||
          exportFunc.getDataId("locData", "compid") ||
          g());
  }
  function n(P) {
    E(!0) &&
      A &&
      H.remoteCall({
        action: "updateStatus",
        roomId: A,
        accountId: w,
        status: P,
      }).then(function (W) {
        DEBUG && console.log("[battle] update status ret=", W);
        b();
      });
  }
  function C(P, W) {
    if (E(!0) && A) {
      var X = P[1];
      if (X == v.cur[1] || X == v.last[1])
        if (!u || u[1] != P[1] || (W && P[0][1] == u[0][1]))
          (u = P),
            H.remoteCall({
              action: "uploadSolve",
              roomId: A,
              accountId: w,
              solveId: X == v.cur[1] ? v.cur[0] : v.last[0],
              time: P,
              scramble: scramble_333.getRandomScramble().trim(),
            }).then(function (V) {
              DEBUG && console.log("[battle] upload solve ret=", V);
              b();
            });
    }
  }
  function c() {
    DEBUG && console.log("[battle] render room", v);
    v ? e.hide() : e.show();
    I.empty();
    var P = TOOLS_BATTLE_TITLE.split("|").slice(0, 3);
    P.splice(1, 0, "ELO");
    I.append(
      $("<tr>").append($("<td colspan=5>").append(q[0] + ": ", m, "&nbsp;", r))
    );
    I.append("<tr><td colspan=2>" + P.join("</td><td>") + "</td></tr>");
    m.unbind("click");
    r.unbind("click");
    if (v) {
      m.removeClass("click").html(v.roomId);
      r.click(t.bind(null, !1)).show();
      P = v.players;
      for (
        var W = v.solves,
          X = {},
          V = !1,
          Q = ("???|" + TOOLS_BATTLE_STATUS).split("|"),
          d = 0;
        d < W.length;
        d++
      ) {
        var l = W[d],
          D = l.accountId;
        X[D] = X[D] || {};
        X[D][l.solveId] = [l.time, l.soltime];
        l.solveId == v.cur[0] && (V = !0);
      }
      P.sort(function (L, F) {
        return F.elo - L.elo;
      });
      W = v.cur[0];
      for (d = 0; d < P.length; d++) {
        l = P[d];
        D = l.accountId;
        -1 != D.indexOf("|")
          ? (D = "<b>" + D.split("|")[1] + "</b>")
          : 10 < D.length &&
            (D = D.slice(0, 4) + "..." + D.slice(D.length - 3));
        var x = (X[l.accountId] || {})[W],
          R = "SOLVED" == l.status,
          G = (X[l.accountId] || {})[W - 1];
        G = (G = R ? x : G) ? stats.pretty(G[0], !0) : "N/A";
        V && !R && (G = '<span style="color:#888">' + G + "</span>");
        I.append(
          "<tr><td>" +
            (d + 1) +
            "</td><td>" +
            D +
            "</td><td>" +
            l.elo +
            "</td><td>" +
            Q[
              ["READY", "INSPECT", "SOLVING", "SOLVED", "LOSS"].indexOf(
                l.status
              ) + 1
            ] +
            "</td><td>" +
            G +
            "</td></tr>"
        );
      }
    } else I.append('<tr><td colspan=5 style="width:0;">' + TOOLS_BATTLE_INFO + "</td></tr>"), m.addClass("click").html(q[1]).click(N.bind(null, !0)), r.hide();
  }
  function k() {
    e.empty().append("ID: ");
    h.empty();
    p.empty();
    if (exportFunc.getDataId("wcaData", "cstimer_token")) {
      var P = exportFunc.getDataId("wcaData", "wca_me").wca_id;
      h.append(P || "WCA Account", " (WCA)").click(function () {
        exportFunc.logoutFromWCA(!0);
        k();
      });
      e.append(h);
    } else
      h.append(EXPORT_LOGINWCA),
        h.click(function () {
          location.href = exportFunc.wcaLoginUrl;
        }),
        (P = exportFunc.getDataId("locData", "compid")),
        p.append((P || "N/A") + " (" + OLCOMP_ANONYM + ")"),
        e.append(p.unbind("click").click(g), " | ", h);
  }
  function g() {
    var P = prompt(OLCOMP_SUBMITAS, exportFunc.getDataId("locData", "compid"));
    if (null == P) return !1;
    if (!exportFunc.isValidId(P)) return alert(EXPORT_INVID), !1;
    localStorage.locData = JSON.stringify({
      id: exportFunc.getDataId("locData", "id"),
      compid: P,
    });
    k();
    return P;
  }
  function f(P, W) {
    !P || z
      ? ((z = !!P), P || H.close())
      : (P.empty().append(
          $('<div style="font-size: 0.75em; text-align: center;">').append(e, I)
        ),
        k(),
        c(),
        (z = !0));
  }
  function a(P, W) {
    z &&
      ("export" == P
        ? k()
        : "timerStatus" == P
        ? ((P = "READY"),
          0 < W ? (P = "SOLVING") : -2 > W && (P = "INSPECT"),
          P != O && ((O = P), n(P)))
        : ((W = JSON.parse(JSON.stringify(W))),
          "timestd" == P ? C(W, !1) : "timepnt" == P && C(W, !0)));
  }
  var e = $("<div>"),
    h = $('<span class="click">'),
    p = $('<span class="click">'),
    q = TOOLS_BATTLE_HEAD.split("|"),
    m = $('<span class="click">').html(q[1]),
    r = $('<span class="click">').html("[X]"),
    H = (function () {
      function P(G) {
        for (d = !0; 0 < R.length; ) R.pop()();
      }
      function W(G) {
        d = !1;
        x && x("close");
      }
      function X(G) {
        d = !1;
        x && x("error");
      }
      function V(G) {
        G = JSON.parse(G.data);
        var L = G.msgid;
        if (L in D) {
          var F = D[L];
          delete D[L];
          F(G);
        } else x && x("msg", G);
      }
      var Q,
        d = !1,
        l = 1,
        D = [],
        x = null,
        R = [];
      return {
        connect: function () {
          return d
            ? Promise.resolve()
            : new Promise(function (G, L) {
                R.push(G);
                Q = new WebSocket("wss://cstimer.net/ws20230409");
                Q.onopen = P;
                Q.onclose = W;
                Q.onerror = X;
                Q.onmessage = V;
              });
        },
        close: function () {
          if (!d) return -1;
          Q.close();
          d = !1;
          return 0;
        },
        isConnected: function () {
          return d;
        },
        setCallback: function (G) {
          x = G;
        },
        pushMsg: function (G) {
          if (!d) return -1;
          Q.send(JSON.stringify(G));
          return 0;
        },
        remoteCall: function (G) {
          return new Promise(function (L, F) {
            d
              ? ((G.msgid = l),
                (D[l] = L),
                l++,
                Q.send(JSON.stringify(G)),
                setTimeout(
                  function (K) {
                    K(-2);
                  }.bind(null, F),
                  5e3
                ))
              : F(-1);
          });
        },
      };
    })(),
    y = 0,
    A,
    w,
    v,
    u = [[-1, 1], null];
  H.setCallback(function (P, W) {
    "msg" == P
      ? "roomInfo" in W &&
        ((v = W.roomInfo),
        v &&
          v.cur[1] &&
          v.cur[1] != u[1] &&
          (J && J(["$T333$" + v.cur[1]]),
          (J = null),
          "remoteBattle" != kernel.getProp("scrType") &&
            kernel.setProp("scrType", "remoteBattle")))
      : ((v = null),
        "remoteBattle" == kernel.getProp("scrType") &&
          kernel.pushSignal("ctrl", ["scramble", "next"]));
    c();
  });
  var I,
    z = !1,
    O = "READY",
    J;
  $(function () {
    I = $('<table class="table">');
    tools.regTool("battle", TOOLS_BATTLE, f);
    kernel.regListener("battle", "timestd", a);
    kernel.regListener("battle", "timepnt", a);
    kernel.regListener("battle", "timerStatus", a);
    kernel.regListener("battle", "export", a, /^account$/);
  });
  return {
    getScrambles: function () {
      return v
        ? v.cur[1] && v.cur[1] != u[1]
          ? Promise.resolve(["$T333$" + v.cur[1]])
          : new Promise(function (P, W) {
              J = P;
            })
        : Promise.reject();
    },
  };
});
execMain(function () {
  function b() {
    var h = prompt(TOOLS_SYNCSEED_INPUTA);
    kernel.blur();
    null != h &&
      (/^[a-zA-Z0-9]+$/.exec(h) ? N(h) : logohint.push(LGHINT_INVALID));
  }
  function N(h) {
    a = !0;
    e = e || mathlib.getSeed();
    mathlib.setSeed(256, "syncseed" + h);
    scramble.setCacheEnable(!1);
    c.html(h).addClass("click");
    kernel.pushSignal("ctrl", ["scramble", "next"]);
  }
  function t() {
    a &&
      confirm(TOOLS_SYNCSEED_DISABLE) &&
      (a &&
        ((a = !1),
        mathlib.setSeed(256, e[1] + "" + e[0]),
        (e = void 0),
        scramble.setCacheEnable(!0),
        kernel.pushSignal("ctrl", ["scramble", "next"])),
      c.html("N/A").unbind("click").removeClass("click"));
  }
  function E() {
    N("" + ~~(new Date().getTime() / 1e3 / 30));
    kernel.blur();
  }
  function n() {
    alert(TOOLS_SYNCSEED_HELP);
  }
  function C(h) {
    h &&
      h
        .empty()
        .append(
          TOOLS_SYNCSEED_SEED,
          k.unbind("click").click(n),
          ": ",
          c.unbind("click").click(t)
        )
        .append("<br><br>", g.unbind("click").click(b))
        .append("<br>", f.unbind("click").click(E));
  }
  var c = $("<span>").html("N/A"),
    k = $('<span class="click">').html("[?]"),
    g = $('<input type="button">').val(TOOLS_SYNCSEED_INPUT),
    f = $('<input type="button">').val(TOOLS_SYNCSEED_30S),
    a = !1,
    e;
  $(function () {
    tools.regTool("syncseed", TOOLS_SYNCSEED, C);
  });
});
var bldhelper = execMain(function () {
  function b(d, l) {
    if (void 0 == l) {
      for (var D = [], x = 0; x < d; x++) (l = b(d, x + 1)), D.push.apply(D, l);
      return D;
    }
    if (d < l || 1 > d || 1 > l) return [];
    if (d == l) return [mathlib.valuedArray(d, 1)];
    D = b(d - 1, l - 1);
    for (x = 0; x < D.length; x++) D[x].push(1);
    d = b(d - l, l);
    for (x = 0; x < d.length; x++) {
      l = d[x];
      for (var R = 0; R < l.length; R++) l[R]++;
    }
    return D.concat(d);
  }
  function N(d, l, D, x, R, G, L, F, K) {
    for (var M = 0, S = 0, Z = 0, fa = 0; fa < F.length; fa++)
      1 == F[fa] ? S++ : ((Z += F[fa]), M++);
    K && 3 == (d & 3) && (d &= -3);
    var ea = 0,
      va = null;
    for (fa = 0; 3 > fa; fa++)
      if (0 != ((d >> fa) & 1)) {
        var ra = M - (fa >> 1),
          ya = Z + M - 2 * (fa >> 1);
        if (!(ra < R[0] || ra > R[1] || ya < G[0] || ya > G[1])) {
          ya = 1 == fa ? 1 : 0;
          var Ba = D + ya;
          ra = l + D + (2 > fa ? 1 : 0);
          if (!(S < Math.max(ra, x[0] + ya) || D > x[1])) {
            var sa = S - ra,
              ta = 0,
              na = null,
              U = 0;
            for (
              ya = Math.max(x[0] - D, 0);
              ya <= Math.min(x[1] - D, sa);
              ya++
            ) {
              var ba = M + S;
              var la = L,
                ka = S - Ba - ya,
                Aa = Ba + ya;
              if (ka + Aa > ba) ba = [0, null];
              else {
                for (var Da = 0, Ha = [], Ma = ka; Ma < ba - 1; Ma++) {
                  var da = Ma < ka + Aa ? 1 : 0;
                  da = mathlib.rn(la - da) + da;
                  Ha.push(da);
                  Da += da;
                }
                if (ka + Aa < ba)
                  Ha.push((la * ba - Da) % la),
                    (ba = [
                      Math.pow(la - 1, Aa) * Math.pow(la, ba - ka - Aa - 1),
                      mathlib.valuedArray(ka, 0).concat(Ha),
                    ]);
                else {
                  var wa = mathlib.valuedArray(la, 0);
                  wa[0] = 1;
                  for (Ma = 0; Ma < Aa; Ma++) {
                    da = mathlib.valuedArray(la, 0);
                    for (var ha = 1; ha < la; ha++)
                      for (var Ea = 0; Ea < la; Ea++)
                        da[(ha + Ea) % la] += wa[Ea];
                    wa = da;
                  }
                  if (0 == wa[0]) ba = [0, null];
                  else {
                    for (Da = (la * ba - Da) % la; 0 == Da && 0 < Aa; ) {
                      Da = 0;
                      Ha = [];
                      for (Ma = ka; Ma < ba - 1; Ma++)
                        (da = Ma < ka + Aa ? 1 : 0),
                          (da = mathlib.rn(la - da) + da),
                          Ha.push(da),
                          (Da += da);
                      Da = (la * ba - Da) % la;
                    }
                    Ha.push(Da);
                    ba = [wa[0], mathlib.valuedArray(ka, 0).concat(Ha)];
                  }
                }
              }
              ka = ba[0] * mathlib.Cnk[sa][ya];
              ta += ka;
              mathlib.rndHit(ka / ta) && ((na = ba[1]), (U = ya));
            }
            if (0 != ta || K) {
              ta *= Math.pow(L, Z - M);
              Ba = F.slice(0, F.length - ra);
              ya = S + Z - ra;
              for (ba = 1; 0 < Ba.length; ) {
                la = Ba.pop();
                ka = 1;
                ba *= mathlib.Cnk[ya][la] * mathlib.fact[la - 1];
                for (ya -= la; Ba.at(-1) == la; )
                  Ba.pop(),
                    ka++,
                    (ba *= mathlib.Cnk[ya][la] * mathlib.fact[la - 1]),
                    (ba /= ka),
                    (ya -= la);
                1 == la && 2 == fa && ((ba *= Z), (ba /= S + Z - ra));
              }
              ya = (K ? 1 : ta) * ba;
              ea += ya;
              if (mathlib.rndHit(ya / ea)) {
                ta = [];
                for (ya = 0; ya < M; ya++) {
                  va = na.pop();
                  la = F[ya];
                  for (ka = 0; ka < la - 1; ka++)
                    (ba = mathlib.rn(L)), ta.push(ba), (va += L - ba);
                  ta.push(va % L);
                }
                va = mathlib.rndPerm(sa);
                for (ya = 0; ya < va.length; ya++)
                  va[ya] < U ? ta.push(na.pop()) : ta.push(na.shift());
                2 > fa
                  ? (ta.unshift(0 == fa ? na.shift() : na.pop()),
                    ta.splice.apply(ta, [1, 0].concat(na)))
                  : ta.splice.apply(ta, [0, 0].concat(na));
                Ba = F.slice(0, F.length - ra);
                va = [];
                na = [0];
                ka = 2 == fa ? 1 : 0;
                0 == ka && (va[0] = [0, ta.shift()]);
                for (ya = 1; ya < Z + S; ya++)
                  ya >= 1 + l + D
                    ? ((na[ka] = ya), ka++)
                    : (va[ya] = [ya, ta.shift()]);
                ya = S + Z - ra;
                ra = mathlib.rndPerm(ya);
                2 == fa &&
                  ra.indexOf(0) >= Z &&
                  ((ya = (ra.indexOf(0) - mathlib.rn(Z) + ya) % ya),
                  (ra = ra.slice(ya).concat(ra.slice(0, ya))));
                U = [];
                for (ya = 0; ya < Ba.length; ya++)
                  for (
                    ba = ra.slice(0, Ba[ya]),
                      U.push(ba),
                      ra = ra.slice(Ba[ya]),
                      sa = 0;
                    sa < ba.length;
                    sa++
                  )
                    va[na[ba[sa]]] = [na[ba[(sa + 1) % ba.length]], ta.shift()];
              }
            }
          }
        }
      }
    return [ea, va];
  }
  function t(d) {
    for (var l = 0, D = 0; D < d.length; D++) l ^= d[D] + 1;
    return l & 1;
  }
  function E(d, l) {
    for (
      var D = d.cfix.split(" "),
        x = [],
        R = [],
        G = /^(UFR|UFL|UBL|UBR|DFR|DFL|DBL|DBR)(\+?)$/i,
        L = a.split(" "),
        F = 0;
      F < D.length;
      F++
    ) {
      var K = G.exec(D[F]);
      K &&
        K[1] != L[d.cbuff[0] % 8] &&
        (K[2] ? R.push(L.indexOf(K[1])) : x.push(L.indexOf(K[1])));
    }
    var M = d.efix.split(" ");
    D = [];
    var S = [];
    G = /^(UR|UF|UL|UB|DR|DF|DL|DB|FR|FL|BL|BR)(\+?)$/i;
    for (F = 0; F < M.length; F++)
      (K = G.exec(M[F])) &&
        K[1] != L[(d.ebuff[0] % 12) + 8] &&
        (K[2] ? S.push(L.indexOf(K[1]) - 8) : D.push(L.indexOf(K[1]) - 8));
    M = d.ceparity;
    L = [0, 0];
    K = [null, null];
    var Z = b(8);
    for (F = 0; F < Z.length; F++) {
      var fa = t(Z[F]);
      0 != ((M >> fa) & 1) &&
        ((G = N(
          d.cbuff[1],
          x.length,
          R.length,
          d.cnerrLR,
          d.cscycLR,
          d.cncodeLR,
          3,
          Z[F]
        )),
        (L[fa] += G[0]),
        mathlib.rndHit(G[0] / L[fa]) && (K[fa] = G[1]));
    }
    Z = [0, 0];
    var ea = [null, null],
      va = b(12);
    for (F = 0; F < va.length; F++)
      (fa = t(va[F])),
        0 != ((M >> fa) & 1) &&
          ((G = N(
            d.ebuff[1],
            D.length,
            S.length,
            d.enerrLR,
            d.escycLR,
            d.encodeLR,
            2,
            va[F]
          )),
          (Z[fa] += G[0]),
          mathlib.rndHit(G[0] / Z[fa]) && (ea[fa] = G[1]));
    F = L[0] * Z[0] + L[1] * Z[1];
    G = [F, K[1], ea[1]];
    mathlib.rndHit((L[0] * Z[0]) / F) && (G = [F, K[0], ea[0]]);
    if (!l) return G;
    if (0 == G[0]) return "N/A";
    R = [d.cbuff[0] % 8].concat(x, R);
    D = [d.ebuff[0] % 12].concat(D, S);
    for (F = 0; 8 > F; F++) -1 == R.indexOf(F) && R.push(F);
    for (F = 0; 12 > F; F++) -1 == D.indexOf(F) && D.push(F);
    l = [];
    x = [];
    for (F = 0; 8 > F; F++) l[R[F]] = R[G[1][F][0]] | (G[1][F][1] << 3);
    for (F = 0; 12 > F; F++) x[D[F]] = (D[G[2][F][0]] << 1) | G[2][F][1];
    R = new mathlib.CubieCube();
    F = d.ceori ? mathlib.rndEl(" Rw Rw2 Rw' Fw Fw'".split(" ")) : "";
    d = d.ceori ? mathlib.rndEl(["", "Uw", "Uw2", "Uw'"]) : "";
    D = R.selfMoveStr(F);
    S = R.selfMoveStr(d);
    R.init(l, x);
    R.ori = 0;
    if (R.isEqual()) return "U U'";
    null != S &&
      R.selfMoveStr("URFDLB".charAt(~~(S / 3)) + " 2'".charAt(S % 3), !0);
    null != D &&
      R.selfMoveStr("URFDLB".charAt(~~(D / 3)) + " 2'".charAt(D % 3), !0);
    l = R.toFaceCube();
    return (
      (scramble_333.genFacelet(l) + " " + F + " " + d).replace(/ +/g, " ") ||
      "U U'"
    );
  }
  function n(d) {
    var l = $(d.target);
    if ((d = l.attr("id"))) {
      if (/^[ce]buff[01]$/.exec(d)) (e[d.slice(0, 5)][~~d[5]] = ~~l.val()), g();
      else if (d.endsWith("LR")) {
        l =
          /^(\d{1,2})-(\d{1,2})$/.exec(l.val()) ||
          /^((\d{1,2}))$/.exec(l.val());
        if (!l) return;
        var D = ~~l[1],
          x = ~~l[2];
        e[d] = [Math.min(D, x), Math.max(D, x)];
      } else if ("ceparity" == d) e[d] = ~~l.val();
      else if ("ceori" == d) e[d] = l[0].checked;
      else if (d.endsWith("fix")) {
        var R = l.val().toUpperCase().split(" "),
          G = {},
          L =
            "cfix" == d
              ? /^(UFR|UFL|UBL|UBR|DFR|DFL|DBL|DBR)(\+?)$/
              : /^(UR|UF|UL|UB|DR|DF|DL|DB|FR|FL|BL|BR)(\+?)$/;
        for (D = 0; D < R.length; D++) (l = L.exec(R[D])) && (G[l[1]] = l[2]);
        D = [];
        for (x in G) D.push(x + G[x]);
        e[d] = D.join(" ");
      } else if ("bldsClr" == d || "bldsEg" == d)
        for (D in ((x = {
          cnerrLR: [0, 7],
          cscycLR: [0, 3],
          cncodeLR: [0, 10],
          enerrLR: [0, 11],
          escycLR: [0, 5],
          encodeLR: [0, 16],
        }),
        "bldsClr" == d
          ? ((x.cfix = ""), (x.efix = ""), (x.ceparity = 3))
          : ((x.cfix = "UBL DFR+"), (x.efix = "DR DF+"), (x.ceparity = 1)),
        x))
          e[D] = x[D];
      else if ("bldsEdge" == d || "bldsCorn" == d)
        (D = ~~l.val()),
          (d = "bldsEdge" == d ? "e" : "c"),
          (e[d + "fix"] = ""),
          (e[d + "scycLR"] = "e" == d ? [0, 5] : [0, 3]),
          1 == D
            ? ((e[d + "buff"] = [e[d + "buff"][0], 1]),
              (e[d + "nerrLR"] = [0, 0]),
              (e[d + "ncodeLR"] = [0, 0]))
            : 2 == D &&
              ((e[d + "buff"] = [e[d + "buff"][0], 7]),
              (e[d + "nerrLR"] = "e" == d ? [0, 11] : [0, 7]),
              (e[d + "ncodeLR"] = "e" == d ? [0, 16] : [0, 10]));
      else if ("scheme" == d) {
        D = l.val();
        if ("speffz" == D)
          e.scheme =
            "CJM DIF ARE BQN VKP ULG XSH WTO BM CI DE AQ VO UK XG WS JP LF RH TN";
        else if ("chichu" == D)
          e.scheme =
            "JLK ABC DFE GHI XYZ WNM OPQ RTS GH AB CD EF OP IJ KL MN QR ST WX YZ";
        else if ("custom" == D || "customed" == D) {
          x = prompt("Code for " + a, e.scheme);
          if (!x) {
            k();
            return;
          }
          if (!/^([^\s]{3} ){8}([^\s]{2} ){11}[^\s]{2}$/i.exec(x)) {
            alert("Invalid Scheme!");
            k();
            return;
          }
          e.scheme = x;
        }
        g();
      } else if ("order" == d) {
        D = l.val();
        if ("default" == D) e.order = "012345670123456789ab";
        else if ("custom" == D || "customed" == D) {
          x = "";
          d = e.scheme;
          for (D = 0; 20 > D; D++)
            (l = parseInt(e.order[D], 24)),
              (x +=
                8 > D
                  ? d[(l % 8) * 4 + ~~(l / 8)]
                  : d[32 + (l % 12) * 3 + ~~(l / 12)]);
          x = prompt("Code order", x.slice(0, 8) + " " + x.slice(8));
          if (!x) {
            k();
            return;
          }
          x = x.replace(/\s+/g, "");
          l = [];
          G = [];
          for (D = R = 0; D < x.length; D++) {
            L = 8 > D ? 0 : 32;
            L = d.indexOf(x[D], L) - L;
            if (0 > L) {
              R = 0;
              break;
            }
            8 > D
              ? ((L = 8 * (L & 3) + (L >> 2)),
                l.push(L.toString(24)),
                (R |= 1 << L % 8))
              : ((L = (L % 3) * 12 + ~~(L / 3)),
                G.push(L.toString(24)),
                (R |= 1 << ((L % 12) + 8)));
          }
          if (8 != l.length || 12 != G.length || 1048575 != R) {
            alert("Invalid Order!");
            k();
            return;
          }
          e.order = l.join("") + G.join("");
        }
        g();
      } else "scr" == d && kernel.setProp("scrType", "nocache_333bldspec");
      kernel.setProp("bldSets", JSON.stringify(e));
      c(e, Q);
    }
  }
  function C(d, l) {
    return d[l][0] + "-" + d[l][1];
  }
  function c(d, l) {
    l.empty();
    m.empty();
    u.empty();
    for (var D = e.scheme, x = 0; 24 > x; x++) {
      var R = ~~(x / 8),
        G = x % 8,
        L = a.slice(4 * G, 4 * G + 3);
      L = L.slice(R) + L.slice(0, R) + " [" + D.charAt(4 * G + R) + "]";
      m.append('<option value="' + x + '">' + L + "</option>");
    }
    for (x = 0; 24 > x; x++)
      (R = ~~(x / 12)),
        (G = x % 12),
        (L = a.slice(32 + 3 * G, 3 * G + 34)),
        (L =
          L.slice(R) + L.slice(0, R) + " [" + D.charAt(32 + 3 * G + R) + "]"),
        u.append('<option value="' + x + '">' + L + "</option>");
    H.val(d.cfix);
    y.val(C(d, "cnerrLR"));
    A.val(C(d, "cscycLR"));
    w.val(C(d, "cncodeLR"));
    z.val(d.efix);
    O.val(C(d, "enerrLR"));
    J.val(C(d, "escycLR"));
    P.val(C(d, "encodeLR"));
    q.val(0);
    v.val(0);
    m.val(d.cbuff[0]);
    u.val(d.ebuff[0]);
    r.val(d.cbuff[1]);
    I.val(d.ebuff[1]);
    W.val(d.ceparity);
    X[0].checked = d.ceori;
    d = E(d);
    l.append(
      $("<tr>").append($("<th>Coder</th>"), $("<td colspan=2>").append(h, p))
    );
    l.append($("<tr>").append($('<td colspan=3 style="width:0;">').append(V)));
    l.append(
      $("<tr>").append($('<td colspan=3 style="height:0.2em;border:none;">'))
    );
    l.append(
      $("<tr>").append(
        '<th colspan=3>Scrambler|<span class="click" id="bldsClr">clr</span>|<span class="click" id="bldsEg">eg.</span></th>'
      )
    );
    l.append(
      $("<tr>").append(
        $("<td>").append(W),
        $("<td>").append(q),
        $("<td>").append(v)
      )
    );
    l.append(
      $("<tr>").append(
        "<td>buffer</td>",
        $("<td>").append(m, r),
        $("<td>").append(u, I)
      )
    );
    l.append(
      $("<tr>").append(
        "<td>fixed</td>",
        $("<td>").append(H),
        $("<td>").append(z)
      )
    );
    l.append(
      $("<tr>").append(
        "<td>flip</td>",
        $("<td>").append(y),
        $("<td>").append(O)
      )
    );
    l.append(
      $("<tr>").append(
        "<td>ex-cyc</td>",
        $("<td>").append(A),
        $("<td>").append(J)
      )
    );
    l.append(
      $("<tr>").append(
        "<td>#codes</td>",
        $("<td>").append(w),
        $("<td>").append(P)
      )
    );
    D = d[0] / 4.325200327448986e19;
    l.append(
      $("<tr>").append(
        "<td>probs</td>",
        $("<td colspan=2>").append(
          (0 == d[0]
            ? 0
            : 0.001 > D
            ? D.toExponential(3)
            : Math.round(1e6 * D) / 1e4 + "%") +
            (1e-8 > D
              ? "<br>N=" + (1e8 < d[0] ? d[0].toExponential(3) : d[0])
              : "")
        )
      )
    );
    l.append(
      $("<tr>").append(
        $("<td>").append($("<label>").append(X, "ori")),
        '<td colspan=2><span id="scr">' + SCRGEN_GEN + "</span></td>"
      )
    );
    "nocache_333bldspec" != kernel.getProp("scrType") &&
      l.find("#scr").addClass("click");
    l.find("input,select").css({ padding: 0 }).unbind("change").change(n);
    l.find("span.click").unbind("click").click(n);
    l.find("td,th").css({ padding: 0 });
    k();
    return l;
  }
  function k() {
    var d = e.scheme;
    "CJM DIF ARE BQN VKP ULG XSH WTO BM CI DE AQ VO UK XG WS JP LF RH TN" == d
      ? h.val("speffz")
      : "JLK ABC DFE GHI XYZ WNM OPQ RTS GH AB CD EF OP IJ KL MN QR ST WX YZ" ==
        d
      ? h.val("chichu")
      : h.val("customed");
    "012345670123456789ab" == e.order ? p.val("default") : p.val("customed");
  }
  function g() {
    var d = tools.getCurScramble(),
      l = cubeutil.getScrambledState(d),
      D = e.scheme,
      x = e.cbuff[0],
      R = e.ebuff[0],
      G = e.order,
      L = ~~(x / 8);
    x %= 8;
    L ^= 3 * ((165 >> x) & 1);
    var F = ~~(R / 12);
    R %= 12;
    for (var K = [], M = [], S = 0; 8 > S; S++)
      (K[S] = D.slice(4 * S, 4 * S + 3)), (M[S] = parseInt(G[S], 24));
    var Z = [],
      fa = [];
    for (S = 0; 12 > S; S++)
      (Z[S] = D.slice(32 + 3 * S, 3 * S + 34)),
        (fa[S] = parseInt(G[S + 8], 24));
    D = [];
    G = [];
    var ea = new mathlib.CubieCube();
    ea.init(l.ca, l.ea);
    var va = 1 << x;
    for (S = 0; 8 > S; S++) ea.ca[S] == S && (va |= 1 << S);
    for (; 255 != va; )
      if (((S = ea.ca[x] & 7), S == x)) {
        for (S = -1; (va >> M[++S] % 8) & 1; );
        S = M[S];
        l = ~~(S / 8);
        S %= 8;
        l ^= 3 * ((165 >> S) & 1);
        mathlib.circle(ea.ca, S, x);
        ea.ca[S] = (ea.ca[S] + ((6 + l - L) << 3)) % 24;
        ea.ca[x] = (ea.ca[x] + ((6 - l + L) << 3)) % 24;
        D.push(((6 - l + L) % 3) * 8 + S);
      } else
        D.push(ea.ca[x]),
          (ea.ca[x] = (ea.ca[S] + (ea.ca[x] & 248)) % 24),
          (ea.ca[S] = S),
          (va |= 1 << S);
    va = 1 << R;
    for (S = 0; 12 > S; S++) ea.ea[S] == 2 * S && (va |= 1 << S);
    for (; 4095 != va; )
      if (((S = ea.ea[R] >> 1), S == R)) {
        for (S = -1; (va >> fa[++S] % 12) & 1; );
        S = fa[S];
        l = ~~(S / 12) ^ F;
        S %= 12;
        mathlib.circle(ea.ea, S, R);
        ea.ea[S] ^= l;
        ea.ea[R] ^= l;
        G.push(2 * S + l);
      } else
        G.push(ea.ea[R]),
          (ea.ea[R] = ea.ea[S] ^ (ea.ea[R] & 1)),
          (ea.ea[S] = S << 1),
          (va |= 1 << S);
    x = [[], []];
    for (S = 0; S < D.length; S++)
      (R = D[S] & 7),
        (l = (6 - (D[S] >> 3) + L) % 3),
        (l ^= 3 * ((165 >> R) & 1)),
        x[0].push(K[R].charAt(l % 3)),
        1 == S % 2 && x[0].push(" ");
    for (S = 0; S < G.length; S++)
      (R = G[S] ^ F),
        x[1].push(Z[R >> 1].charAt(R & 1)),
        1 == S % 2 && x[1].push(" ");
    V.html("C: " + x[0].join("") + "<br>E: " + x[1].join(""));
    if (DEBUG) {
      F = [x[0].join("").replace(/\s/g, ""), x[1].join("").replace(/\s/g, "")];
      K = e.scheme;
      Z = e.cbuff[0];
      x = e.ebuff[0];
      L = new mathlib.CubieCube();
      for (R = 0; 8 > R; R++) L.ca[R] = R;
      for (R = 0; 12 > R; R++) L.ea[R] = 2 * R;
      M = ~~(Z / 8);
      Z %= 8;
      M ^= 3 * ((165 >> Z) & 1);
      S = ~~(x / 12);
      x %= 12;
      for (R = 0; R < F[0].length; R++)
        (fa = K.indexOf(F[0][R])),
          (D = fa & 3),
          (fa >>= 2),
          mathlib.circle(L.ca, fa, Z),
          (D ^= 3 * ((165 >> fa) & 1)),
          (L.ca[fa] = (L.ca[fa] + ((6 + D - M) << 3)) % 24),
          (L.ca[Z] = (L.ca[Z] + ((6 - D + M) << 3)) % 24);
      for (R = 0; R < F[1].length; R++)
        (fa = K.indexOf(F[1][R], 32) - 32),
          (D = fa % 3),
          (fa = ~~(fa / 3)),
          mathlib.circle(L.ea, fa, x),
          (L.ea[fa] = L.ea[fa] ^ S ^ D),
          (L.ea[x] = L.ea[x] ^ S ^ D);
      F = new mathlib.CubieCube();
      F.invFrom(L);
      L = scramble_333.genFacelet(F.toFaceCube());
      L.replace(/\s/g, "") != d[1].replace(/\s/g, "") &&
        console.log("[bldhelper] bld code check error", L);
    }
  }
  function f(d) {
    d &&
      (tools.isPuzzle("333")
        ? (d.empty().append(Q), c(e, Q), g())
        : d.html(IMAGE_UNAVAILABLE));
  }
  scrMgr.reg("nocache_333bldspec", function () {
    return E(e, !0);
  });
  var a = "UFR UFL UBL UBR DFR DFL DBL DBR UR UF UL UB DR DF DL DB FR FL BL BR",
    e = {
      cbuff: [0, 7],
      cfix: "",
      cnerrLR: [0, 7],
      cscycLR: [0, 3],
      cncodeLR: [0, 10],
      ebuff: [1, 7],
      efix: "",
      enerrLR: [0, 11],
      escycLR: [0, 5],
      encodeLR: [0, 16],
      ceparity: 3,
      ceori: !0,
      scheme:
        "CJM DIF ARE BQN VKP ULG XSH WTO BM CI DE AQ VO UK XG WS JP LF RH TN",
      order: "012345670123456789ab",
    },
    h,
    p,
    q,
    m,
    r,
    H,
    y,
    A,
    w,
    v,
    u,
    I,
    z,
    O,
    J,
    P,
    W,
    X,
    V = $('<div style="text-align:left;">'),
    Q = $('<table style="border-spacing:0; border:none;" class="table">');
  $(function () {
    var d = $.format.bind(
        null,
        '<input id="{0}" type="text" style="width:4em" value="" pattern="d{1,2}-d{1,2}">'
      ),
      l = $.format.bind(null, '<option value="{1}">{0}</option>'),
      D = JSON.parse(kernel.getProp("bldSets", "{}")),
      x;
    for (x in e) x in D && (e[x] = D[x]);
    h = $('<select id="scheme" style="max-width:4em">');
    h.append(
      [
        ["Customed", "customed"],
        ["Speffz", "speffz"],
        ["ChiChu", "chichu"],
        ["Custom", "custom"],
      ]
        .map(l)
        .join("")
    );
    p = $('<select id="order" style="max-width:4em">');
    p.append(
      [
        ["Customed", "customed"],
        ["U>D>E", "default"],
        ["Custom", "custom"],
      ]
        .map(l)
        .join("")
    );
    q = $('<select id="bldsCorn">');
    m = $('<select data="bufcorn" id="cbuff0" style="width:2em">');
    r = $('<select id="cbuff1" style="width:2em">');
    H = $(
      '<input id="cfix" type="text" style="width:4em" value="" pattern="[URFDLBurfdlb +]*">'
    );
    y = $(d(["cnerrLR"]));
    A = $(d(["cscycLR"]));
    w = $(d(["cncodeLR"]));
    v = $('<select id="bldsEdge">');
    u = $('<select data="bufedge" id="ebuff0" style="width:2em">');
    I = $('<select id="ebuff1" style="width:2em">');
    z = $(
      '<input id="efix" type="text" style="width:4em" value="" pattern="[URFDLBurfdlb +]*">'
    );
    O = $(d(["enerrLR"]));
    J = $(d(["escycLR"]));
    P = $(d(["encodeLR"]));
    W = $('<select id="ceparity">');
    X = $('<input type="checkbox" id="ceori">');
    d = [
      ["any", 7],
      ["ok", 1],
      ["flip", 2],
      ["move", 4],
      ["not ok", 6],
      ["ok/flip", 3],
      ["ok/move", 5],
    ]
      .map(l)
      .join("");
    r.append(d);
    I.append(d);
    W.append(
      [
        ["parity", 3],
        ["even", 1],
        ["odd", 2],
      ]
        .map(l)
        .join("")
    );
    l = [
      ["$", 0],
      ["solved", 1],
      ["any", 2],
    ];
    for (d = 0; d < l.length; d++)
      q.append(
        '<option value="' +
          l[d][1] +
          '">' +
          l[d][0].replace("$", "Corner") +
          "</option>"
      ),
        v.append(
          '<option value="' +
            l[d][1] +
            '">' +
            l[d][0].replace("$", "Edge") +
            "</option>"
        );
    tools.regTool("bldhelper", TOOLS_BLDHELPER, f);
  });
});
var replay = execMain(function () {
  function b(x) {
    x != d && ((d = x), I.html(d ? "" : ""));
  }
  function N() {
    P && (clearTimeout(P), (P = 0));
    J = +new Date() - Q;
    b(1);
    c();
  }
  function t(x, R) {
    return R ? (0 > x ? -1 : x * y[A]) : 0 > x ? -2e3 : x / y[A];
  }
  function E(x) {
    if (x > V)
      for (var R = V; R < x; R++)
        3 < Math.abs(x - 1 - R)
          ? h.applyMoves([X[R][0]])
          : h.addMoves([X[R][0]]);
    else if (x < V)
      for (R = V - 1; R >= x; R--) {
        var G = h.moveInv(X[R][0]);
        3 < Math.abs(x - 1 - R) ? h.applyMoves([G]) : h.addMoves([G]);
      }
    V = x;
    x = X[Math.max(0, x - 1)];
    Q = t(x ? x[1] : 0);
    c();
  }
  function n(x) {
    x = $(x.target);
    if (x.hasClass("click") || x.is("input")) {
      var R = x.attr("data"),
        G = d,
        L = t(Q, !0);
      b(0);
      if ("l" == R) 0 < V && E(V - 1);
      else if ("n" == R) V < X.length && E(V + 1);
      else if ("p" == R)
        0 == G && 0 < X.length && Q >= t(X.at(-1)[1]) && E(0),
          b(1 - G),
          1 == d && N();
      else if ("s" == R) E(0);
      else if ("e" == R) E(X.length);
      else if ("r" == R)
        a: {
          x = r.val();
          for (R = 0; R < X.length; R++)
            if (X[R][1] >= x) {
              E(R);
              break a;
            }
          E(X.length);
        }
      else
        "s+" == R
          ? ((A = Math.min(A + 1, y.length - 1)),
            w.html(y[A] + "x"),
            (Q = t(L)))
          : "s-" == R
          ? ((A = Math.max(A - 1, 0)), w.html(y[A] + "x"), (Q = t(L)))
          : "a" == R
          ? $.clipboardCopy(v).then(
              logohint.push.bind(logohint, LGHINT_LINKCOPY),
              logohint.push.bind(logohint, "Copy Failed")
            )
          : "o" == R && ((m = !m) ? x.html(D[1]) : x.html(D[0]), E(0), g(q));
    }
  }
  function C() {
    var x = +new Date() - J;
    P && (clearTimeout(P), (P = 0));
    if (0 == d) return Q;
    for (; V < X.length && t(X[V][1]) <= x; ) h.addMoves([X[V][0]]), V++;
    if (V >= X.length) return x;
    P = setTimeout(C, t(X[V][1]) - x);
    return x;
  }
  function c() {
    Q = C();
    var x = 0 < X.length ? X.at(-1)[1] : 0;
    Q = Math.min(Q, t(x));
    r.val(t(Q, !0));
    H.html((0 <= Q ? kernel.pretty(t(Q, !0)) : "--") + "/" + kernel.pretty(x));
    for (var R = [], G = -4; 5 > G; G++) {
      var L = G + V;
      if (0 > L || L >= X.length) {
        R[G + 4] = '<span style="color:#888;">~</span>';
        var F = mathlib.valuedArray(l - 1, " ").join("");
      } else {
        var K = h.move2str(X[L][0]);
        F = mathlib.valuedArray(l - K.length, " ").join("");
        h.isRotation(X[L][0]) &&
          (K = '<span style="color:#888;">' + K + "</span>");
        R[G + 4] = K;
      }
      0 == G && (R[G + 4] = "<b><u>" + R[G + 4] + "</u></b>");
      R[G + 4] = F + R[G + 4];
    }
    O.empty();
    O.html(R.join("<br>"));
    Q >= t(x) && b(0);
    1 == d && requestAnimFrame(c);
  }
  function k(x, R) {
    if (!m || !/^\d+$/.exec(p)) return R ? [] : x;
    var G = kernel.getProp("giiOri");
    if ("auto" == G) return R ? [] : x;
    if (R) return h.parseScramble(mathlib.CubieCube.rot2str[G]);
    G = mathlib.CubieCube.rotMulI[0][~~G];
    R = "URFDLB".indexOf(x[2]);
    R = mathlib.CubieCube.rotMulM[G][3 * R] / 3;
    x = x.slice();
    x[2] = "URFDLB".charAt(R);
    return x;
  }
  function g(x) {
    q = x;
    u.attr(
      "href",
      "https://alg.cubing.net/?alg=" +
        encodeURIComponent(
          (x || "").replace(/@(\d+)/g, "/*$1*/").replace(/-/g, "&#45;")
        ) +
        "&setup=" +
        encodeURIComponent(z || "")
    );
    var R = x.split(" "),
      G = [];
    x = [];
    for (var L = 0; L < R.length; L++) {
      var F = /^(.*)@(\d+)$/.exec(R[L]);
      F && (G.push(F[1]), x.push(~~F[2]));
    }
    R = h.parseScramble(G.join(" "));
    if (R.length != x.length) console.log("parse error");
    else {
      r.attr("min", -1);
      r.attr("max", x.at(-1));
      X = k(null, !0);
      for (L = 0; L < X.length; L++) X[L] = [X[L], -1];
      for (L = 0; L < R.length; L++)
        0 == x[L] && h.isRotation(R[L]) && --x[L], X.push([k(R[L]), x[L]]);
      for (L = l = 0; L < X.length; L++)
        l = Math.max(l, ("" + h.move2str(X[L][0])).length);
      V = 0;
      Q = t(-1);
      N();
    }
  }
  function f(x, R, G) {
    p = G || tools.puzzleType(tools.getCurScramble()[0]);
    G = "222 333 444 555 666 777 888 999 101010 111111".split(" ").indexOf(p);
    z = x;
    v = new URL(
      "?vrcreplay=" +
        LZString.compressToEncodedURIComponent(JSON.stringify([x, R, p])),
      location
    ).toString();
    var L = { puzzle: "cube3" };
    -1 != G
      ? (L.puzzle = "cube" + (G + 2))
      : /^udpoly$/.exec(p)
      ? ((L.puzzle = p), (L.scramble = x))
      : puzzleFactory.twistyre.exec(p) && (L.puzzle = p);
    kernel.showDialog(
      [
        a,
        function () {
          b(0);
        },
        void 0,
        function () {
          b(0);
        },
      ],
      "share",
      VRCREPLAY_TITLE,
      function () {
        puzzleFactory.init(L, $.noop, e, function (F, K) {
          a.unbind("click").click(n);
          r.unbind("input click").bind("input", n);
          (h = F) && h.resize();
          W = h.parseScramble(x);
          h.applyMoves(W);
          g(R);
        });
      }
    );
  }
  var a,
    e,
    h,
    p,
    q,
    m = !0,
    r,
    H,
    y = [0.2, 0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5],
    A = 4,
    w,
    v,
    u,
    I,
    z,
    O,
    J = 0,
    P = 0,
    W = [],
    X = [],
    V = 0,
    Q = 0,
    d = 0,
    l = 0,
    D = VRCREPLAY_ORI.split("|");
  $(function () {
    a = $('<table style="height:98%">');
    e = $('<td style="height:80%">');
    var x = $.format.bind(
      null,
      '<span class="click playbutton" data="{0}">{1}</span>'
    );
    r = $('<input type="range" style="width:50%;" data="r">');
    H = $('<span style="user-select:none;"></span>');
    w = $('<span style="user-select:none;">1x</span>');
    u = $('<a target="_blank">⏯Alg</a>');
    I = $(x(["p", ""]));
    O = $('<td style="width:0%;font-family:monospace;white-space:pre;">');
    a.append(
      $("<tr>").append(
        $("<td>").append(
          x(["o", D[1]]),
          "| ",
          u,
          " |",
          x(["a", VRCREPLAY_SHARE])
        )
      ),
      $("<tr>").append(e, O),
      $("<tr>").append(
        $('<td style="display:flex;justify-content:center;">').append(
          w,
          " ",
          r,
          " ",
          H
        )
      ),
      $("<tr>").append(
        $("<td>").append(
          x(["s-", ""]),
          x(["s+", ""]),
          x(["s", ""]),
          x(["l", ""]),
          I,
          x(["n", ""]),
          x(["e", ""])
        )
      )
    );
    var R = $.urlParam("vrcreplay");
    if (R) {
      $.clearUrl("vrcreplay");
      try {
        (R = JSON.parse(
          LZString.decompressFromEncodedURIComponent(decodeURIComponent(R))
        )),
          setTimeout(function () {
            f(R[0], R[1], R[2]);
          }, 500);
      } catch (G) {
        console.log(G);
      }
    }
  });
  return {
    popupReplay: f,
    bindDomElem: function (x, R, G, L) {
      x.hasClass("click") || x.addClass("click");
      x.unbind("click").click(f.bind(null, R, G, L));
    },
  };
});
var shortcuts = execMain(function () {
  function b(p, q) {
    if (kernel.getProp("useKSC")) {
      var m;
      q.altKey && q.ctrlKey
        ? (m = c[q.which])
        : q.altKey
        ? (m = n[q.which])
        : q.ctrlKey && (m = C[q.which]);
      N(m);
    }
  }
  function N(p) {
    p &&
      (void 0 == p[1]
        ? kernel.setProp(p[0][0], p[0][1])
        : kernel.pushSignal(p[1], p[0]),
      kernel.clrKey(),
      kernel.blur());
  }
  function t(p) {
    var q = p.pageX,
      m = p.pageY;
    p.type.startsWith("touch") &&
      ((p = p.originalEvent.touches[0] || p.originalEvent.changedTouches[0]),
      (q = p.pageX),
      (m = p.pageY));
    return [q, m];
  }
  function E() {
    DEBUG && console.log("[shortcut] long touch callback");
    k && clearTimeout(k);
    timer.onkeydown({ which: 28 });
  }
  var n = {
      49: [["scrType", "sqrs"]],
      50: [["scrType", "222so"]],
      51: [["scrType", "333"]],
      52: [["scrType", "444wca"]],
      53: [["scrType", "555wca"]],
      54: [["scrType", "666wca"]],
      55: [["scrType", "777wca"]],
      67: [["scrType", "clkwca"]],
      77: [["scrType", "mgmp"]],
      80: [["scrType", "pyrso"]],
      83: [["scrType", "skbso"]],
      73: [["scrType", "input"]],
      37: [["scramble", "last"], "ctrl"],
      39: [["scramble", "next"], "ctrl"],
      38: [["stats", "-"], "ctrl"],
      40: [["stats", "+"], "ctrl"],
      68: [["stats", "clr"], "ctrl"],
      90: [["stats", "undo"], "ctrl"],
    },
    C = {
      49: [["stats", "OK"], "ctrl"],
      50: [["stats", "+2"], "ctrl"],
      51: [["stats", "DNF"], "ctrl"],
      90: [["stats", "undo"], "ctrl"],
    },
    c = {
      84: [["input", "t"]],
      73: [["input", "i"]],
      83: [["input", "s"]],
      77: [["input", "m"]],
      86: [["input", "v"]],
      71: [["input", "g"]],
      81: [["input", "q"]],
      66: [["input", "b"]],
      76: [["input", "l"]],
    },
    k = 0,
    g = null,
    f = -1,
    a = [
      [["scramble", "next"], "ctrl", "->"],
      [["stats", "OK"], "ctrl", "OK"],
      [["stats", "+2"], "ctrl", "+2"],
      [["stats", "DNF"], "ctrl", "DNF"],
      [["scramble", "last"], "ctrl", "<-"],
      [["stats", "cmt"], "ctrl", "*"],
      [["stats", "undo"], "ctrl", "⌫"],
      [["stats", "cfm"], "ctrl", "⌕"],
    ],
    e = [],
    h;
  $(function () {
    kernel.regListener("shortcut", "keydown", b);
    kernel.regProp("tools", "useKSC", 0, PROPERTY_USEKSC, [!0]);
    kernel.regProp("tools", "useGES", 0, PROPERTY_USEGES, [!0]);
    h = $('<div id="astouch">').appendTo("body");
    for (var p = 1.5 / Math.sin(Math.PI / 8), q = 0; 8 > q; q++)
      (e[q] = e[q] || $('<span class="astouch"/>').appendTo(h)),
        e[q]
          .css({
            left: p * Math.cos((q * Math.PI) / 4) + "em",
            top: -p * Math.sin((q * Math.PI) / 4) + "em",
          })
          .text(a[q][2]);
  });
  return {
    onTouchStart: function (p) {
      DEBUG && console.log("[shortcut] touch start", p);
      k && clearTimeout(k);
      k = setTimeout(E, 2e3);
      -1 == timer.status() &&
        kernel.getProp("useGES") &&
        ((g = t(p)), h && h.css({ left: g[0], top: g[1], opacity: 0 }).show());
    },
    onTouchMove: function (p) {
      DEBUG && console.log("[shortcut] touch move", p);
      if (g) {
        p = t(p);
        var q = Math.hypot(p[0] - g[0], p[1] - g[1]);
        -1 != f && e[f].removeClass("hit");
        q <= e[0].width()
          ? ((f = -1), h && h.css("opacity", q / e[0].width()))
          : ((f =
              Math.floor(
                (-Math.atan2(p[1] - g[1], p[0] - g[0]) / Math.PI) * 4 + 8.5
              ) % 8),
            h && h.css("opacity", 1),
            e[f].addClass("hit"),
            timer.softESC());
      }
    },
    onTouchEnd: function (p) {
      DEBUG && console.log("[shortcut] touch end", p);
      k && clearTimeout(k);
      h && h.hide();
      -1 != f &&
        (e[f].removeClass("hit"),
        timer.softESC(),
        Promise.resolve().then(N.bind(null, a[f])));
      g = null;
      f = -1;
    },
  };
});
var help = execMain(
  function (b, N, t) {
    function E() {
      $(this).hasClass("enable") || n($(this).html());
    }
    function n(z) {
      if (void 0 === z) for (z in p) break;
      c(z) && C(z);
    }
    function C(z) {
      var O = m.children();
      if (0 == O.length) {
        for (var J in p)
          $("<div />")
            .html(J)
            .addClass(J == z ? "tab enable" : "tab disable")
            .click(E)
            .appendTo(m);
        O = m.children();
      }
      O.each(function (P, W) {
        W = $(W);
        W.html() == z
          ? W.removeClass("disable").addClass("enable")
          : W.removeClass("enable").addClass("disable");
      });
    }
    function c(z) {
      setTimeout(function () {
        p[z] && H.scrollTop(H.scrollTop() + p[z].position().top - 3);
      }, 0);
      return !0;
    }
    function k() {
      var z = ABOUT_LANG,
        O;
      for (O in p)
        10 < p[O].position().top ||
          (z = p[O].is("h1, h2, h3") ? p[O].html() : ABOUT_LANG);
      C(z);
    }
    function g() {
      for (var z = $("#about").children(), O = 0; O < z.length; O++) {
        var J = z.eq(O),
          P = J.appendTo(H).html();
        J.is("h1, h2, h3") && !z.eq(O + 1).is("h1, h2, h3")
          ? (p[P] = J)
          : (p[ABOUT_LANG] = p[ABOUT_LANG] || J);
      }
    }
    function f() {
      for (var z = H.find(".click"), O = 0; O < z.length; O++) {
        var J = z.eq(O);
        A.exec(J.attr("href")) &&
          (J.parent().after(a(J.attr("href"))), J.parent().remove());
      }
    }
    function a(z) {
      if (A.exec(z)) {
        for (var O = [], J = 0; 7 > J; J++) O[J] = z.substr(4 * J, 4);
        J = $(
          '<div class="colorPrevV" style="width:10em; height:14em;"><table style="width:100%; height:100%; border-collapse: collapse;"><tbody><tr style="height:15%;"><td class="clpr-bd" colspan=8>U R F D L B</td></tr><tr style="height:50%;"><td colspan=8><span class="clpr-tm" style="font-size:2em; font-family:lcd;">0.00</span><br><span class="clpr-lk">ao5: xx.xx<br>ao12: xx.xx</span></td></tr><tr style="height:25%;"><td class="clpr-bd" colspan=4>XXxXX<br>XXxXX</td><td class="bgcolor"></td></tr><tr style="height:10%;"><td class="clpr-bt0"/><td class="clpr-bt0"/><td class="clpr-bt1"/><td class="clpr-lg" style="width:33%; font-family:MyImpact;" colspan=2>csTimer</td><td class="clpr-bt1"/><td class="clpr-bt0"/><td class="clpr-bt0"/></tr></tbody></table></div><div class="colorPrevH" style="width:15em; height:11em;"><table style="width:100%; height:100%; border-collapse: collapse;"><tbody><tr style="height:15%;"><td class="clpr-bt0"/><td class="clpr-bt0"/><td class="clpr-bt1"/>\t<td class="clpr-bd" rowspan=2>U R F D L B</td></tr><tr style="height:15%;"><td class="clpr-lg" style="font-family:MyImpact;" colspan=3>csTimer</td></tr><tr style="height:15%;"><td class="clpr-bt1"/><td class="clpr-bt0"/><td class="clpr-bt0"/>\t<td rowspan=2><span class="clpr-tm" style="font-size:2em; font-family:lcd;">0.00</span><br>\t\t<span class="clpr-lk">ao5: xx.xx<br>ao12: xx.xx</span></td></tr><tr style="height:45%;"><td class="clpr-bd" colspan=3>XXxXX<br>XXxXX</td></tr></tbody></table>'
        );
        J.css({ color: O[0], "background-color": O[1] });
        J.find(".clpr-bt0").css({ width: "11%" }).html("O");
        J.find(".clpr-bt1")
          .css({ width: "11%", "background-color": O[3] })
          .html("O");
        J.find(".clpr-bd").css({ "background-color": O[2] });
        J.find(".clpr-lk").css({ color: O[4] });
        J.find(".clpr-lg").css({ color: O[5], "background-color": O[6] });
        J.click(
          function (P) {
            $.confirm("Change color scheme?") && (window.location.href = P);
          }.bind(null, z)
        );
        return J;
      }
    }
    function e(z) {
      var O = $(z.target).val();
      kernel.blur();
      $(z.target).val("...");
      if (O in w) N("vrcKBL", O), h(O);
      else if (
        "other" == O &&
        ((z = t("vrcKBL")),
        (z = w[z] || z),
        (z = prompt("input keyboard layout", z)))
      ) {
        47 != z.length && alert("Invalid Keyboard Layout");
        for (O = 0; O < z.length; O++)
          if (-1 == z.indexOf(w.qwerty.charAt(O))) {
            alert("Invalid Keyboard Layout");
            return;
          }
        N("vrcKBL", z);
        h(z);
      }
    }
    function h(z) {
      z in w && (z = w[z]);
      var O = [];
      z = z.toUpperCase();
      for (var J = 0; J < v.length; J++) {
        O.push("<tr>");
        for (var P = 0; P < v[J].length; P++)
          O.push("<td>" + z[v[J][P]] + "<br><span>" + u[J][P] + "</span></td>");
        O.push("</tr>");
      }
      J = $("#vrckey");
      J.find("tr:not(:first)").remove();
      P = $("<tr>");
      var W = $('<select id="vrckeylayout">');
      W.append($("<option />").val("...").html("select layout"));
      for (var X in w) W.append($("<option />").val(X).html(X));
      W.append($("<option />").val("other").html("..."));
      W.unbind("change").change(e);
      J.append(P.append($('<th colspan="10">').append("Layout: ", W)));
      J.append(O.join(""));
      O = w.qwerty.toUpperCase();
      z = z.toUpperCase();
      X = {
        96: 192,
        45: 189,
        61: 187,
        91: 219,
        93: 221,
        92: 220,
        59: 186,
        39: 222,
        44: 188,
        46: 190,
        47: 191,
      };
      I = {};
      for (J = 0; J < O.length; J++)
        (P = O.charCodeAt(J)),
          (W = z.charCodeAt(J)),
          (P = X[P] || P),
          (W = X[W] || W),
          P != W && (I[W] = P),
          186 == W && (I[59] = P);
    }
    var p = {},
      q = $('<table class="options" />'),
      m = $("<td />"),
      r = $("<td />").addClass("tabValue"),
      H = $('<div class="noScrollBar helptable">'),
      y = $("<div />");
    q.append($("<tr />").append(m, r.append(H)));
    var A = /^\s*((#[0-9a-fA-F]{3}){7})\s*$/,
      w = {
        qwerty: "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./",
        dvorak: "`1234567890[]',.pyfgcrl/=\\aoeuidhtns-;qjkxbmwvz",
        colemak: "`1234567890-=qwfpgjluy;[]\\arstdhneio'zxcvbkm,./",
      },
      v = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
        [26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
        [37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
      ],
      u = [
        " S',  E,&lt;,&gt;,  M,  M,&lt;,&gt;, E',  S".split(","),
        " z';  B; L';Lw';  x;  x; Rw;  R; B';  z".split(";"),
        " y';  D;  L; U'; F';  F;  U; R'; D';  y".split(";"),
        " Dw; M';Uw'; Lw; x'; x';Rw'; Uw; M';Dw'".split(";"),
      ],
      I = {};
    $(function () {
      g();
      f();
      n();
      $("#about").html(q);
      H.scrollTop();
      H.unbind("scroll").scroll(k);
      b("vrc", "vrcKBL", -6, "VRC Keyboard Layout", ["qwerty"]);
      var z = t("vrcKBL");
      h(z);
      $(".donate").appendTo(y);
      y.find("a").each(function (O, J) {
        $(J).attr("target", "_blank");
      });
      kernel.addButton(
        "donate",
        BUTTON_DONATE,
        function () {
          kernel.showDialog(
            [y, 0, void 0, 0],
            "donate",
            BUTTON_DONATE.replace(/-?<br>-?/g, "")
          );
        },
        5
      );
    });
    return {
      genColorPreview: a,
      getMappedCode: function (z) {
        return I[z] || z;
      },
    };
  },
  [kernel.regProp, kernel.setProp, kernel.getProp]
);
var stackmat = execMain(function () {
  function b(Q) {
    C = Q;
    c = n.createMediaStreamSource(Q);
    k = n.createScriptProcessor(1024, 1, 1);
    k.onaudioprocess = function (d) {
      d = d.inputBuffer.getChannelData(0);
      for (var l = 0; l < d.length; l++) {
        e = Math.max(1e-4, e + (d[l] * d[l] - e) * h);
        var D = (1 / Math.sqrt(e)) * d[l];
        p.unshift(D);
        if (
          (p.pop() - D) * (q ? 1 : -1) > r &&
          Math.abs(D - (q ? 1 : -1)) - 1 > m &&
          H > 0.6 * g
        ) {
          for (var x = 0; x < Math.round(H / g); x++) f(q);
          q ^= 1;
          H = 0;
        } else H > 2 * g && (f(q), (H -= g));
        H++;
        10 > I
          ? (y = Math.max(1e-4, y + (Math.pow(D - (q ? 1 : -1), 2) - y) * h))
          : 100 < I && (y = 1);
        0 < P &&
          (P--,
          W.raw.push(D),
          W.bin.push(q),
          0 == P && (J && J(W), (J = null)));
      }
    };
    c.connect(k);
    k.connect(n.destination);
  }
  function N(Q) {
    var d = null;
    A.push(Q);
    Q != u ? ((u = Q), (I = 1)) : I++;
    z++;
    if (10 < I)
      (v = Q),
        (A = []),
        0 != w.length && (w = []),
        100 < I && X.on
          ? ((X.on = !1), (X.noise = Math.min(1, y) || 0), (X.power = e), V(X))
          : 700 < z &&
            ((z = 100), (X.noise = Math.min(1, y) || 0), (X.power = e), V(X));
    else if (10 == A.length)
      if (A[0] == v || A[9] != v) A = A.slice(1);
      else {
        d = 0;
        for (var l = 8; 0 < l; l--) d = (d << 1) | (A[l] == v ? 1 : 0);
        d = String.fromCharCode(d);
        w.push(d);
        a: if (((l = w), 9 == l.length || 10 == l.length)) {
          DEBUG && console.log("[stackmat]", l);
          var D = /[0-9]/,
            x = l[0];
          if (/[ SILRCA]/.exec(x)) {
            for (var R = 64, G = 1; G < l.length - 3; G++) {
              if (!D.exec(l[G])) break a;
              R += ~~l[G];
            }
            R == l.at(-3).charCodeAt(0) &&
              t(
                x,
                6e4 * ~~l[1] +
                  1e3 * ~~(l[2] + l[3]) +
                  ~~(l[4] + l[5] + (10 == l.length ? l[6] : "0")),
                9 == l.length ? 10 : 1
              );
          }
        }
        A = [];
      }
    0 < P && (W.bits.push(Q), null != d && W.bytes.push(d));
  }
  function t(Q, d, l) {
    var D = $.now();
    200 < D - O && DEBUG && console.log("[stackmat] signal miss ", D - O);
    O = D;
    D = {};
    D.time_milli = d;
    D.unit = l;
    D.on = !0;
    kernel.getProp("stkHead") || (Q = "S");
    d =
      l == X.unit
        ? D.time_milli > X.time_milli
        : Math.floor(D.time_milli / 10) > Math.floor(X.time_milli / 10);
    D.greenLight = "A" == Q;
    D.leftHand = "L" == Q || "A" == Q || "C" == Q;
    D.rightHand = "R" == Q || "A" == Q || "C" == Q;
    D.running = ("S" != Q || "S" == X.signalHeader) && (" " == Q || d);
    D.signalHeader = Q;
    D.unknownRunning = !X.on;
    D.noise = Math.min(1, y) || 0;
    D.power = e;
    X = D;
    z = 0;
    V(X);
  }
  function E(Q) {
    if (u != v && 1 == I && (A.push(Q), 24 == A.length)) {
      for (var d = 0, l = 5; 0 <= l; l--) {
        d *= 10;
        for (var D = 0; 4 > D; D++) d += A[4 * l + D] << D;
      }
      A = [];
      t("S", d, 1);
    }
    Q != u ? ((u = Q), (I = 1)) : I++;
    10 < I &&
      ((v = Q),
      (A = []),
      (w = []),
      1e3 < I && X.on
        ? ((X.on = !1), (X.noise = Math.min(1, y) || 0), (X.power = e), V(X))
        : 4e3 < I &&
          ((I = 1e3), (X.noise = Math.min(1, y) || 0), (X.power = e), V(X)));
    0 < P && W.bits.push(Q);
  }
  var n,
    C,
    c,
    k,
    g,
    f,
    a,
    e = 1,
    h = 1e-4,
    p = [],
    q = 0,
    m = 0.2,
    r = 0.7,
    H = 0,
    y = 0,
    A = [],
    w = [],
    v = 0,
    u = 0,
    I = 0,
    z = 0,
    O = 0,
    J = null,
    P = 0,
    W = {},
    X = {
      time_milli: 0,
      unit: 10,
      on: !1,
      greenLight: !1,
      leftHand: !1,
      rightHand: !1,
      running: !1,
      unknownRunning: !0,
      signalHeader: "I",
      noise: 1,
      power: 1,
    },
    V = $.noop;
  return {
    init: function (Q, d, l) {
      a = Q;
      void 0 === navigator.mediaDevices && (navigator.mediaDevices = {});
      void 0 === navigator.mediaDevices.getUserMedia &&
        (navigator.mediaDevices.getUserMedia = function (D) {
          var x =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
          return x
            ? new Promise(function (R, G) {
                x.call(navigator, D, R, G);
              })
            : Promise.reject(
                Error("getUserMedia is not implemented in this browser")
              );
        });
      n = new (window.AudioContext || window.webkitAudioContext)();
      "m" == a
        ? ((g = n.sampleRate / 8e3), (f = E))
        : ((g = n.sampleRate / 1200), (f = N));
      h = 0.001 / g;
      p.length = Math.ceil(g / 6);
      A = [];
      w = [];
      Q = { echoCancellation: !1, noiseSuppression: !1 };
      d && (Q.deviceId = { exact: d });
      return void 0 == C
        ? navigator.mediaDevices.getUserMedia({ audio: Q }).then(function (D) {
            if ("suspended" == n.state && !l) return Promise.reject();
            b(D);
          }, console.log)
        : Promise.resolve();
    },
    stop: function () {
      if (void 0 != C) {
        try {
          c.disconnect(k), k.disconnect(n.destination), C.stop && C.stop();
        } catch (Q) {}
        C = void 0;
      }
    },
    updateInputDevices: function () {
      var Q = [],
        d = Promise.resolve(Q);
      return navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
        ? navigator.mediaDevices.enumerateDevices().then(function (l) {
            for (var D = 0; D < l.length; D++) {
              var x = l[D];
              "audioinput" === x.kind &&
                Q.push([x.deviceId, x.label || "microphone " + (Q.length + 1)]);
            }
            return d;
          })
        : d;
    },
    getSample: function (Q, d) {
      J = d;
      P = Math.ceil(Q * (n.sampleRate || 44100));
      W = { raw: [], bin: [], bits: [], bytes: [] };
    },
    setCallBack: function (Q) {
      V = Q;
    },
  };
});
execMain(function () {
  window.nativeStackmat &&
    (stackmat = (function () {
      DEBUG && console.log("Use Native Stackmat");
      var b = "stackmat_callback_" + ~~(1e7 * Math.random()),
        N;
      nativeStackmat.setCallback(b);
      window[b] = function (t) {
        DEBUG && console.log(JSON.stringify(t));
        N && N(t);
      };
      return {
        init: function () {
          nativeStackmat.init();
          return Promise.resolve();
        },
        stop: function () {
          nativeStackmat.stop();
          return Promise.resolve();
        },
        updateInputDevices: function () {
          return Promise.resolve([[void 0, "native"]]);
        },
        setCallBack: function (t) {
          N = t;
        },
        getSample: function () {},
      };
    })());
});
var stackmatutil = execMain(function (b) {
  function N() {
    a &&
      stackmat.getSample(0.2, function (m) {
        if (q) {
          h.html(
            "RxBits: [" +
              m.bits.join("") +
              "]<br>RxBytes: [" +
              escape(m.bytes.join("")) +
              "]"
          );
          var r = Math.max(e.width(), 1024),
            H = 0.3 * r;
          e.attr("width", r);
          e.attr("height", H);
          var y = e[0].getContext("2d");
          y.fillStyle = "#fff";
          y.fillRect(0, 0, r, H);
          var A = m.raw;
          m = m.bin;
          y.strokeStyle = "#ccc";
          y.beginPath();
          y.moveTo(0, 0.5 * H);
          y.lineTo(r, 0.5 * H);
          y.stroke();
          y.strokeStyle = "#444";
          y.beginPath();
          y.moveTo(0, 0.5 * H - 0.3 * H * A[0]);
          for (var w = 1; w < A.length; w++)
            y.lineTo((w * r) / (A.length - 1), 0.5 * H - 0.3 * H * A[w]);
          y.stroke();
          y.strokeStyle = "#00f";
          y.beginPath();
          y.moveTo(0, 0.8 * H - 0.6 * H * m[0]);
          for (w = 1; w < m.length; w++)
            y.lineTo((w * r) / (m.length - 1), 0.8 * H - 0.6 * H * m[w]);
          y.stroke();
        }
      });
  }
  function t() {
    q = !1;
  }
  function E() {
    a ||
      ((a = $("<div>")),
      (e = $('<canvas style="display:block; width:95%; margin:auto;">')),
      (h = $('<span style="word-break:break-all;">')),
      (p = $('<span class="click">Sample!</span>')),
      a.append(p, e, h));
    q = !0;
    p.reclk(E);
    kernel.showDialog([a, t, t, t], "share", "Stackmat Debug", N);
  }
  function n(m) {
    m
      ? ((f = !0),
        m.empty().append(c, "<br>", "Device:&nbsp;&nbsp;", k, g),
        g.reclk(E))
      : (f = !1);
  }
  function C() {
    stackmat.updateInputDevices().then(function (m) {
      k.empty();
      for (var r = 0; r < m.length; r++)
        k.append($("<option>").val(m[r][0]).text(m[r][1]));
      k.unbind("change").change(function () {
        stackmat.stop();
        console.log("select device ", k.val());
        stackmat.init(void 0, k.val(), !0);
        kernel.blur();
      });
    });
  }
  var c = $("<span>").html("status:  unknown"),
    k = $('<select style="font-size: 1rem;">'),
    g = $(
      '<span class="click" style="font-family:iconfont;padding-left:0.5em;"></span>'
    ),
    f = !1,
    a,
    e,
    h,
    p,
    q = !1;
  $(function () {
    tools.regTool("stackmatutil", "stackmat", n);
    kernel.regProp("timer", "stkHead", 0, PROPERTY_STKHEAD, [!0]);
    C();
  });
  return {
    init: function (m, r) {
      return stackmat.init(m, void 0, r).then(C);
    },
    stop: stackmat.stop,
    setCallBack: function (m) {
      stackmat.setCallBack(function (r) {
        if (f) {
          var H = "status:  " + (r.on ? "on" : "off") + "<br>";
          H += "noise:   " + ~~(100 * r.noise) + "%<br>";
          H += "power:   " + ~~(100 * Math.log10(r.power)) / 10 + "dB<br>";
          H += "header:  " + r.signalHeader + "<br>";
          H +=
            "pad:     " +
            (r.leftHand ? "L" : " ") +
            (r.rightHand ? "R" : " ") +
            "<br>";
          H += "running: " + (r.running ? "yes" : "no");
          c.html(H.replace(/ /g, "&nbsp;"));
        }
        m && m(r);
      });
    },
  };
});
var GiikerCube = execMain(function () {
  function b(g) {
    /^[0-9A-Fa-f]{4}$/.exec(g) &&
      (g = "0000" + g + "-0000-1000-8000-00805F9B34FB");
    return g.toUpperCase();
  }
  function N() {
    return n
      ? Promise.resolve(E && E.clear()).then(function () {
          n.removeEventListener("gattserverdisconnected", C);
          n.gatt.disconnect();
          n = null;
        })
      : Promise.resolve();
  }
  var t = {},
    E = void 0,
    n = null,
    C = function (g, f) {
      var a = Promise.resolve();
      "disconnect" == g && (a = Promise.resolve(N()));
      return a.then(function () {
        return "function" == typeof k && k(g, f);
      });
    }.bind(null, "disconnect"),
    c = $.noop,
    k = $.noop;
  return {
    init: function (g) {
      if (!window.navigator || !window.navigator.bluetooth)
        return alert(GIIKER_NOBLEMSG), Promise.reject();
      g = Promise.resolve(!0);
      window.navigator.bluetooth.getAvailability &&
        (g = window.navigator.bluetooth.getAvailability());
      return g
        .then(function (f) {
          giikerutil.log("[bluetooth] is available", f);
          if (!f) return Promise.reject(GIIKER_NOBLEMSG);
          f = Object.keys(t).map(function (h) {
            return { namePrefix: h };
          });
          var a = [].concat(
              $jscomp.arrayFromIterable(
                new Set(
                  Array.prototype.concat.apply(
                    [],
                    Object.values(t).map(function (h) {
                      return h.opservs || [];
                    })
                  )
                )
              )
            ),
            e = [].concat(
              $jscomp.arrayFromIterable(
                new Set(
                  Array.prototype.concat.apply(
                    [],
                    Object.values(t).map(function (h) {
                      return h.cics || [];
                    })
                  )
                )
              )
            );
          giikerutil.log("[bluetooth]", "scanning...", Object.keys(t));
          return window.navigator.bluetooth.requestDevice({
            filters: f,
            optionalServices: a,
            optionalManufacturerData: e,
          });
        })
        .then(function (f) {
          giikerutil.log(
            "[bluetooth]",
            "BLE device is selected, name=" + f.name,
            f
          );
          n = f;
          f.addEventListener("gattserverdisconnected", C);
          E = null;
          for (var a in t)
            if (f.name.startsWith(a)) {
              E = t[a];
              break;
            }
          return E ? E.init(f) : Promise.reject("Cannot detect device type");
        });
    },
    stop: N,
    isConnected: function () {
      return null != n || DEBUGBL;
    },
    setCallback: function (g) {
      c = g;
    },
    setEventCallback: function (g) {
      k = g;
    },
    getCube: function () {
      return (
        E ||
        (DEBUGBL && {
          getBatteryLevel: function () {
            return Promise.resolve(80);
          },
        })
      );
    },
    regCubeModel: function (g) {
      $.isArray(g.prefix)
        ? g.prefix.map(function (f) {
            t[f] = g;
          })
        : (t[g.prefix] = g);
    },
    matchUUID: function (g, f) {
      return b(g) == b(f);
    },
    waitForAdvs: function () {
      if (!n || !n.watchAdvertisements) return Promise.reject(-1);
      var g = new AbortController();
      return new Promise(function (f, a) {
        var e = function (h) {
          giikerutil.log("[bluetooth] receive adv event", h);
          n && n.removeEventListener("advertisementreceived", e);
          g.abort();
          f(h.manufacturerData);
        };
        n.addEventListener("advertisementreceived", e);
        n.watchAdvertisements({ signal: g.signal });
        setTimeout(function () {
          n && n.removeEventListener("advertisementreceived", e);
          g.abort();
          a(-2);
        }, 1e4);
      });
    },
    onDisconnect: C,
    callback: function () {
      return c.apply(null, arguments);
    },
  };
});
execMain(function () {
  function b(g) {
    N(g.target.value);
  }
  function N(g) {
    for (var f = $.now(), a = [], e = 0; 20 > e; e++) a.push(g.getUint8(e));
    if (167 == a[18]) {
      g = [
        176, 81, 104, 224, 86, 137, 237, 119, 38, 26, 193, 161, 210, 126, 150,
        81, 93, 13, 236, 249, 89, 235, 88, 24, 113, 81, 214, 131, 130, 199, 2,
        169, 39, 165, 171, 41,
      ];
      var h = (a[19] >> 4) & 15,
        p = a[19] & 15;
      for (e = 0; 18 > e; e++) a[e] += g[e + h] + g[e + p];
      a = a.slice(0, 18);
    }
    g = [];
    for (e = 0; e < a.length; e++) g.push((a[e] >> 4) & 15), g.push(a[e] & 15);
    e = [];
    for (a = 0; 3 > a; a++)
      for (h = 8; 0 != h; h >>= 1) e.push(g[a + 28] & h ? 1 : 0);
    h = new mathlib.CubieCube();
    p = [-1, 1, -1, 1, 1, -1, 1, -1];
    for (a = 0; 8 > a; a++)
      h.ca[a] = (g[a] - 1) | ((3 + g[a + 8] * p[a]) % 3 << 3);
    for (a = 0; 12 > a; a++) h.ea[a] = ((g[a + 16] - 1) << 1) | e[a];
    e = h.toFaceCube(c, k);
    p = g.slice(32, 40);
    h = [];
    for (a = 0; a < p.length; a += 2)
      h.push("BDLURF".charAt(p[a] - 1) + " 2'".charAt((p[a + 1] - 1) % 7));
    if (DEBUG) {
      p = [];
      for (a = 0; 40 > a; a++) p.push("0123456789abcdef".charAt(g[a]));
      giikerutil.log("[giiker] Raw Data: ", g.join(""));
      giikerutil.log("[giiker] Current State: ", e);
      giikerutil.log(
        "[giiker] A Valid Generator: ",
        scramble_333.genFacelet(e)
      );
      giikerutil.log(
        "[giiker] Previous Moves: ",
        h.slice().reverse().join(" ")
      );
    }
    GiikerCube.callback(e, h, [f, f], C);
    return [e, h];
  }
  function t() {
    var g = Promise.resolve();
    n &&
      (n.removeEventListener("characteristicvaluechanged", b),
      (g = n.stopNotifications().catch($.noop)),
      (n = null));
    C = E = null;
    return g;
  }
  var E = null,
    n = null,
    C,
    c = [
      [26, 15, 29],
      [20, 8, 9],
      [18, 38, 6],
      [24, 27, 44],
      [51, 35, 17],
      [45, 11, 2],
      [47, 0, 36],
      [53, 42, 33],
    ],
    k = [
      [25, 28],
      [23, 12],
      [19, 7],
      [21, 41],
      [32, 16],
      [5, 10],
      [3, 37],
      [30, 43],
      [52, 34],
      [48, 14],
      [46, 1],
      [50, 39],
    ];
  GiikerCube.regCubeModel({
    prefix: ["Gi", "Mi Smart Magic Cube", "Hi-"],
    init: function (g) {
      t();
      C = g.name.startsWith("Gi") ? "Giiker" : "Mi Smart";
      return g.gatt
        .connect()
        .then(function (f) {
          E = f;
          return f.getPrimaryService("0000aadb-0000-1000-8000-00805f9b34fb");
        })
        .then(function (f) {
          return f.getCharacteristic("0000aadc-0000-1000-8000-00805f9b34fb");
        })
        .then(function (f) {
          n = f;
          return n.startNotifications();
        })
        .then(function () {
          return n.readValue();
        })
        .then(function (f) {
          N(f)[0] != kernel.getProp("giiSolved", mathlib.SOLVED_FACELET) &&
            ((f = kernel.getProp("giiRST")),
            ("a" == f || ("p" == f && confirm(CONFIRM_GIIRST))) &&
              giikerutil.markSolved());
          return n.addEventListener("characteristicvaluechanged", b);
        });
    },
    opservs: [
      "0000aadb-0000-1000-8000-00805f9b34fb",
      "0000aaaa-0000-1000-8000-00805f9b34fb",
    ],
    getBatteryLevel: function () {
      if (!E) return Promise.reject("Bluetooth Cube is not connected");
      var g,
        f,
        a,
        e = function (h) {
          a([h.target.value.getUint8(1), C]);
          f.removeEventListener("characteristicvaluechanged", e);
          f.stopNotifications();
        };
      return E.getPrimaryService("0000aaaa-0000-1000-8000-00805f9b34fb")
        .then(function (h) {
          g = h;
          return h.getCharacteristic("0000aaab-0000-1000-8000-00805f9b34fb");
        })
        .then(function (h) {
          f = h;
          return f.startNotifications();
        })
        .then(function () {
          return f.addEventListener("characteristicvaluechanged", e);
        })
        .then(function () {
          return g.getCharacteristic("0000aaac-0000-1000-8000-00805f9b34fb");
        })
        .then(function (h) {
          h.writeValue(new Uint8Array([181]).buffer);
          return new Promise(function (p) {
            a = p;
          });
        });
    },
    clear: t,
  });
});
execMain(function () {
  function b(r) {
    r = r.target.value;
    var H = $.now();
    if (
      !(4 > r.byteLength) &&
      42 == r.getUint8(0) &&
      13 == r.getUint8(r.byteLength - 2) &&
      10 == r.getUint8(r.byteLength - 1)
    ) {
      var y = r.getUint8(2),
        A = r.byteLength - 6;
      if (1 == y)
        for (y = 0; y < A; y += 2) {
          var w = g[r.getUint8(3 + y) >> 1],
            v = [0, 2][r.getUint8(3 + y) & 1],
            u = 3 * w + v;
          giikerutil.log("[gocube] move", "URFDLB".charAt(w) + " 2'".charAt(v));
          mathlib.CubieCube.CubeMult(q, mathlib.CubieCube.moveCube[u], p);
          h = p.toFaceCube();
          m.unshift("URFDLB".charAt(w) + " 2'".charAt(v));
          8 < m.length && (m = m.slice(0, 8));
          GiikerCube.callback(h, m, [H, H], c);
          w = p;
          p = q;
          q = w;
          20 < ++e && ((e = 0), C.writeValue(new Uint8Array([51]).buffer));
        }
      else if (2 == y) {
        H = [];
        for (A = 0; 6 > A; A++)
          for (
            w = 9 * g[A],
              v = a[A],
              H[w + 4] = "BFUDRL".charAt(r.getUint8(3 + 9 * A)),
              y = 0;
            8 > y;
            y++
          )
            H[w + f[(y + v) % 8]] = "BFUDRL".charAt(
              r.getUint8(3 + 9 * A + y + 1)
            );
        r = H.join("");
        r != h && (giikerutil.log("[gocube] facelet", r), p.fromFacelet(r));
      } else
        3 != y &&
          (5 == y
            ? ((k = r.getUint8(3)), giikerutil.log("[gocube] battery level", k))
            : 7 == y
            ? giikerutil.log("[gocube] offline stats", N(r))
            : 8 == y && giikerutil.log("[gocube] cube type", N(r)));
    }
  }
  function N(r) {
    for (var H = [], y = 0; y < r.byteLength; y++)
      H.push((r.getUint8(y) >> 4) & 15), H.push(r.getUint8(y) & 15);
    return H;
  }
  function t() {
    var r = Promise.resolve();
    n &&
      (n.removeEventListener("characteristicvaluechanged", b),
      (r = n.stopNotifications().catch($.noop)),
      (n = null));
    c = E = C = null;
    e = 100;
    h = mathlib.SOLVED_FACELET;
    p = new mathlib.CubieCube();
    q = new mathlib.CubieCube();
    m = [];
    return r;
  }
  var E,
    n,
    C,
    c,
    k,
    g = [5, 2, 0, 3, 1, 4],
    f = [0, 1, 2, 5, 8, 7, 6, 3],
    a = [0, 0, 6, 2, 0, 0],
    e = 100,
    h = mathlib.SOLVED_FACELET,
    p = new mathlib.CubieCube(),
    q = new mathlib.CubieCube(),
    m = [];
  GiikerCube.regCubeModel({
    prefix: ["GoCube", "Rubiks"],
    init: function (r) {
      t();
      c = r.name.startsWith("GoCube") ? "GoCube" : "Rubiks Connected";
      return r.gatt
        .connect()
        .then(function (H) {
          return H.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
        })
        .then(function (H) {
          E = H;
          return E.getCharacteristic("6e400002-b5a3-f393-e0a9-e50e24dcca9e");
        })
        .then(function (H) {
          C = H;
          return E.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e");
        })
        .then(function (H) {
          n = H;
          return n.startNotifications();
        })
        .then(function () {
          return n.addEventListener("characteristicvaluechanged", b);
        })
        .then(function () {
          return C.writeValue(new Uint8Array([51]).buffer);
        });
    },
    opservs: ["6e400001-b5a3-f393-e0a9-e50e24dcca9e"],
    getBatteryLevel: function () {
      if (!C) return Promise.reject("Bluetooth Cube is not connected");
      C.writeValue(new Uint8Array([50]).buffer);
      return new Promise(function (r) {
        $.delayExec(
          "getBatteryLevel",
          function () {
            r([k, c]);
          },
          1e3
        );
      });
    },
    clear: t,
  });
});
execMain(function () {
  function b(da) {
    for (var wa = [], ha = 0; ha < da.byteLength; ha++)
      wa[ha] = da.getUint8(ha);
    if (null == Z) return wa;
    da = Z.iv || [];
    if (16 < wa.length) {
      var Ea = wa.length - 16,
        Ka = Z.decrypt(wa.slice(Ea));
      for (ha = 0; 16 > ha; ha++) wa[ha + Ea] = Ka[ha] ^ ~~da[ha];
    }
    Z.decrypt(wa);
    for (ha = 0; 16 > ha; ha++) wa[ha] ^= ~~da[ha];
    return wa;
  }
  function N(da) {
    if (null == Z) return da;
    for (var wa = Z.iv || [], ha = 0; 16 > ha; ha++) da[ha] ^= ~~wa[ha];
    Z.encrypt(da);
    if (16 < da.length) {
      var Ea = da.length - 16,
        Ka = da.slice(Ea);
      for (ha = 0; 16 > ha; ha++) Ka[ha] ^= ~~wa[ha];
      Z.encrypt(Ka);
      for (ha = 0; 16 > ha; ha++) da[ha + Ea] = Ka[ha];
    }
    return da;
  }
  function t() {
    giikerutil.log("[gancube] v1init start");
    return W.getCharacteristic("00002a28-0000-1000-8000-00805f9b34fb")
      .then(function (da) {
        return da.readValue();
      })
      .then(function (da) {
        var wa =
          (da.getUint8(0) << 16) | (da.getUint8(1) << 8) | da.getUint8(2);
        giikerutil.log("[gancube] version", wa.toString(16));
        Z = null;
        if (65543 < wa && 65536 == (wa & 16776704))
          return W.getCharacteristic("00002a23-0000-1000-8000-00805f9b34fb")
            .then(function (ha) {
              return ha.readValue();
            })
            .then(function (ha) {
              var Ea = va[(wa >> 8) & 255];
              if (Ea) {
                Ea = JSON.parse(LZString.decompressFromEncodedURIComponent(Ea));
                for (var Ka = 0; 6 > Ka; Ka++)
                  Ea[Ka] = (Ea[Ka] + ha.getUint8(5 - Ka)) & 255;
                ha = Ea;
              } else ha = void 0;
              ha
                ? (giikerutil.log("[gancube] key", JSON.stringify(ha)),
                  (Z = $.aes128(ha)))
                : logohint.push(LGHINT_BTNOTSUP);
            });
        logohint.push(LGHINT_BTNOTSUP);
      })
      .then(function () {
        return P.getCharacteristics();
      })
      .then(function (da) {
        for (var wa = 0; wa < da.length; wa++) {
          var ha = da[wa];
          giikerutil.log("[gancube] v1init find chrct", ha.uuid);
          GiikerCube.matchUUID(ha.uuid, "0000fff2-0000-1000-8000-00805f9b34fb")
            ? (X = ha)
            : GiikerCube.matchUUID(
                ha.uuid,
                "0000fff5-0000-1000-8000-00805f9b34fb"
              )
            ? (V = ha)
            : GiikerCube.matchUUID(
                ha.uuid,
                "0000fff6-0000-1000-8000-00805f9b34fb"
              )
            ? (Q = ha)
            : GiikerCube.matchUUID(
                ha.uuid,
                "0000fff7-0000-1000-8000-00805f9b34fb"
              ) && (d = ha);
        }
      })
      .then(q);
  }
  function E(da, wa, ha) {
    if (ea) {
      var Ea = JSON.parse(kernel.getProp("giiMacMap", "{}"));
      (da = Ea[fa]) && da.toUpperCase() == ea.toUpperCase()
        ? giikerutil.log("[gancube] v2init mac matched")
        : (giikerutil.log("[gancube] v2init mac updated"),
          (Ea[fa] = ea),
          kernel.setProp("giiMacMap", JSON.stringify(Ea)));
      n(ea, ha);
    } else {
      Ea = JSON.parse(kernel.getProp("giiMacMap", "{}"));
      var Ka = Ea[fa];
      if (!Ka || da)
        Ka = prompt(
          (wa ? "The MAC provided might be wrong!\n" : "") + GIIKER_REQMACMSG,
          Ka || "xx:xx:xx:xx:xx:xx"
        );
      /^([0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i.exec(Ka)
        ? (Ka != Ea[fa] &&
            ((Ea[fa] = Ka), kernel.setProp("giiMacMap", JSON.stringify(Ea))),
          n(Ka, ha))
        : (logohint.push(LGHINT_BTINVMAC), (Z = null));
    }
  }
  function n(da, wa) {
    for (var ha = [], Ea = 0; 6 > Ea; Ea++)
      ha.push(parseInt(da.slice(3 * Ea, 3 * Ea + 2), 16));
    wa = wa || 0;
    da = JSON.parse(LZString.decompressFromEncodedURIComponent(va[2 + 2 * wa]));
    wa = JSON.parse(LZString.decompressFromEncodedURIComponent(va[3 + 2 * wa]));
    for (Ea = 0; 6 > Ea; Ea++)
      (da[Ea] = (da[Ea] + ha[5 - Ea]) % 255),
        (wa[Ea] = (wa[Ea] + ha[5 - Ea]) % 255);
    ha = [da, wa];
    Z = $.aes128(ha[0]);
    Z.iv = ha[1];
  }
  function C(da) {
    var wa = mathlib.valuedArray(20, 0);
    wa[0] = da;
    x
      ? ((da = N(wa.slice())),
        giikerutil.log("[gancube] v2sendRequest", wa, da),
        (wa = x.writeValue(new Uint8Array(da).buffer)))
      : (giikerutil.log("[gancube] v2sendRequest cannot find v2write chrct"),
        (wa = void 0));
    return wa;
  }
  function c(da) {
    giikerutil.log("[gancube] v2init start");
    Ma = 0;
    E(!0, !1, da);
    return l
      .getCharacteristics()
      .then(function (wa) {
        giikerutil.log("[gancube] v2init find chrcts", wa);
        for (var ha = 0; ha < wa.length; ha++) {
          var Ea = wa[ha];
          giikerutil.log("[gancube] v2init find chrct", Ea.uuid);
          GiikerCube.matchUUID(Ea.uuid, "28be4cb6-cd67-11e9-a32f-2a2ae2dbcce4")
            ? (D = Ea)
            : GiikerCube.matchUUID(
                Ea.uuid,
                "28be4a4a-cd67-11e9-a32f-2a2ae2dbcce4"
              ) && (x = Ea);
        }
        D || giikerutil.log("[gancube] v2init cannot find v2read chrct");
      })
      .then(function () {
        giikerutil.log("[gancube] v2init v2read start notifications");
        return D.startNotifications();
      })
      .then(function () {
        giikerutil.log("[gancube] v2init v2read notification started");
        return D.addEventListener("characteristicvaluechanged", m);
      })
      .then(function () {
        return C(5);
      })
      .then(function () {
        return C(4);
      })
      .then(function () {
        return C(9);
      });
  }
  function k(da) {
    var wa = mathlib.valuedArray(16, 0);
    wa[0] = 104;
    wa[1] = da;
    L
      ? ((da = N(wa.slice())),
        giikerutil.log("[gancube] v3sendRequest", wa, da),
        (wa = L.writeValue(new Uint8Array(da).buffer)))
      : (giikerutil.log("[gancube] v3sendRequest cannot find v3write chrct"),
        (wa = void 0));
    return wa;
  }
  function g() {
    giikerutil.log("[gancube] v3init start");
    Ma = 0;
    E(!0, !1, 0);
    return R.getCharacteristics()
      .then(function (da) {
        giikerutil.log("[gancube] v3init find chrcts", da);
        for (var wa = 0; wa < da.length; wa++) {
          var ha = da[wa];
          giikerutil.log("[gancube] v3init find chrct", ha.uuid);
          GiikerCube.matchUUID(ha.uuid, "8653000b-43e6-47b7-9cb0-5fc21d4ae340")
            ? (G = ha)
            : GiikerCube.matchUUID(
                ha.uuid,
                "8653000c-43e6-47b7-9cb0-5fc21d4ae340"
              ) && (L = ha);
        }
        G || giikerutil.log("[gancube] v3init cannot find v3read chrct");
      })
      .then(function () {
        giikerutil.log("[gancube] v3init v3read start notifications");
        return G.startNotifications();
      })
      .then(function () {
        giikerutil.log("[gancube] v3init v3read notification started");
        return G.addEventListener("characteristicvaluechanged", v);
      })
      .then(function () {
        return k(4);
      })
      .then(function () {
        return k(1);
      })
      .then(function () {
        return k(7);
      });
  }
  function f(da) {
    if (M) {
      var wa = N(da.slice());
      giikerutil.log("[gancube] v4sendRequest", da, wa);
      return M.writeValue(new Uint8Array(wa).buffer);
    }
    giikerutil.log("[gancube] v4sendRequest cannot find v4write chrct");
  }
  function a() {
    giikerutil.log("[gancube] v4init start");
    Ma = 0;
    E(!0, !1, 0);
    return F.getCharacteristics()
      .then(function (da) {
        giikerutil.log("[gancube] v4init find chrcts", da);
        for (var wa = 0; wa < da.length; wa++) {
          var ha = da[wa];
          giikerutil.log("[gancube] v4init find chrct", ha.uuid);
          GiikerCube.matchUUID(ha.uuid, "0000fff6-0000-1000-8000-00805f9b34fb")
            ? (K = ha)
            : GiikerCube.matchUUID(
                ha.uuid,
                "0000fff5-0000-1000-8000-00805f9b34fb"
              ) && (M = ha);
        }
        K || giikerutil.log("[gancube] v4init cannot find v4read chrct");
      })
      .then(function () {
        giikerutil.log("[gancube] v4init v4read start notifications");
        return K.startNotifications();
      })
      .then(function () {
        giikerutil.log("[gancube] v4init v4read notification started");
        return K.addEventListener("characteristicvaluechanged", I);
      })
      .then(function () {
        var da = mathlib.valuedArray(20, 0);
        da[0] = 223;
        da[1] = 3;
        return f(da);
      })
      .then(function () {
        var da = mathlib.valuedArray(20, 0);
        da[0] = 221;
        da[1] = 4;
        da[3] = 237;
        return f(da);
      })
      .then(function () {
        var da = mathlib.valuedArray(20, 0);
        da[0] = 221;
        da[1] = 4;
        da[3] = 239;
        return f(da);
      });
  }
  function e() {
    var da = $.now();
    giikerutil.log("[gancube]", "init cube state");
    GiikerCube.callback(na, [], [null, da], fa);
    sa.fromFacelet(na);
    ka = la;
    na != kernel.getProp("giiSolved", mathlib.SOLVED_FACELET) &&
      ((da = kernel.getProp("giiRST")),
      ("a" == da || ("p" == da && confirm(CONFIRM_GIIRST))) &&
        giikerutil.markSolved());
  }
  function h() {
    return 50 > Da
      ? Promise.resolve(!1)
      : X.readValue().then(function (da) {
          da = b(da);
          for (var wa = [], ha = 0; ha < da.length - 2; ha += 3)
            for (
              var Ea =
                  (da[ha ^ 1] << 16) |
                  (da[(ha + 1) ^ 1] << 8) |
                  da[(ha + 2) ^ 1],
                Ka = 21;
              0 <= Ka;
              Ka -= 3
            )
              wa.push("URFDLB".charAt((Ea >> Ka) & 7)),
                12 == Ka && wa.push("URFDLB".charAt(ha / 3));
          na = wa.join("");
          Da = 0;
          if (-1 == ka) e();
          else return Promise.resolve(!0);
        });
  }
  function p(da, wa) {
    var ha = (la - ka) & 255;
    1 < ha &&
      giikerutil.log("[gancube]", "bluetooth event was lost, moveDiff = " + ha);
    ka = la;
    Da += ha;
    ha > ra.length && ((Da = 50), (ha = ra.length));
    for (var Ea = U + ba, Ka = ha - 1; 0 <= Ka; Ka--) Ea += ya[Ka];
    if (!U || 2e3 < Math.abs(da - Ea))
      giikerutil.log("[gancube]", "time adjust", da - Ea, "@", da),
        (U += da - Ea);
    for (Ka = ha - 1; 0 <= Ka; Ka--)
      (ha = 3 * "URFDLB".indexOf(ra[Ka][0]) + " 2'".indexOf(ra[Ka][1])),
        mathlib.CubieCube.CubeMult(sa, mathlib.CubieCube.moveCube[ha], ta),
        (U += ya[Ka]),
        GiikerCube.callback(
          ta.toFaceCube(),
          ra.slice(Ka),
          [U, 0 == Ka ? da : null],
          fa + (wa ? "*" : "")
        ),
        (ha = ta),
        (ta = sa),
        (sa = ha),
        giikerutil.log("[gancube] move", ra[Ka], ya[Ka]);
    ba = da - U;
  }
  function q() {
    if (J)
      return V.readValue()
        .then(function (da) {
          da = b(da);
          var wa = $.now();
          la = da[12];
          if (la != ka) {
            ra = [];
            for (var ha = 0; 6 > ha; ha++) {
              var Ea = da[13 + ha];
              ra.unshift("URFDLB".charAt(~~(Ea / 3)) + " 2'".charAt(Ea % 3));
            }
            var Ka;
            return Q.readValue()
              .then(function (Qa) {
                Ka = Qa = b(Qa);
                return h();
              })
              .then(function (Qa) {
                if (Qa)
                  giikerutil.log(
                    "[gancube]",
                    "facelet state calc",
                    sa.toFaceCube()
                  ),
                    giikerutil.log("[gancube]", "facelet state read", na),
                    sa.toFaceCube() != na &&
                      giikerutil.log("[gancube]", "Cube state check error");
                else {
                  ya = [];
                  for (Qa = 0; 9 > Qa; Qa++)
                    ya.unshift(Ka[2 * Qa + 1] | (Ka[2 * Qa + 2] << 8));
                  p(wa, 0);
                }
              });
          }
        })
        .then(q);
  }
  function m(da) {
    null != Z && r(da.target.value);
  }
  function r(da) {
    var wa = $.now();
    da = b(da);
    for (var ha = 0; ha < da.length; ha++)
      da[ha] = (da[ha] + 256).toString(2).slice(1);
    da = da.join("");
    ha = parseInt(da.slice(0, 4), 2);
    if (1 != ha)
      if (2 == ha) {
        if (
          (giikerutil.log("[gancube]", "v2 received move event", da),
          (la = parseInt(da.slice(4, 12), 2)),
          la != ka && -1 != ka)
        ) {
          ya = [];
          ra = [];
          var Ea = 0;
          for (ha = 0; 7 > ha; ha++) {
            var Ka = parseInt(da.slice(12 + 5 * ha, 17 + 5 * ha), 2);
            ya[ha] = parseInt(da.slice(47 + 16 * ha, 63 + 16 * ha), 2);
            ra[ha] = "URFDLB".charAt(Ka >> 1) + " '".charAt(Ka & 1);
            12 <= Ka && ((ra[ha] = "U "), (Ea = 1));
          }
          Ma += Ea;
          0 == Ea && p(wa, 1);
        }
      } else if (4 == ha) {
        if (
          (giikerutil.log("[gancube]", "v2 received facelets event", da),
          -1 == ka)
        ) {
          la = parseInt(da.slice(4, 12), 2);
          wa = new mathlib.CubieCube();
          Ea = 0;
          Ka = 3840;
          for (ha = 0; 7 > ha; ha++) {
            var Qa = parseInt(da.slice(12 + 3 * ha, 15 + 3 * ha), 2),
              ia = parseInt(da.slice(33 + 2 * ha, 35 + 2 * ha), 2);
            Ka -= ia << 3;
            Ka ^= Qa;
            wa.ca[ha] = (ia << 3) | Qa;
          }
          wa.ca[7] = (Ka & 4088) % 24 | (Ka & 7);
          for (ha = 0; 11 > ha; ha++)
            (Qa = parseInt(da.slice(47 + 4 * ha, 51 + 4 * ha), 2)),
              (ia = parseInt(da.slice(91 + ha, 92 + ha), 2)),
              (Ea ^= (Qa << 1) | ia),
              (wa.ea[ha] = (Qa << 1) | ia);
          wa.ea[11] = Ea;
          0 != wa.verify()
            ? (Ma++,
              giikerutil.log("[gancube]", "v2 facelets state verify error"))
            : ((na = wa.toFaceCube()),
              giikerutil.log("[gancube]", "v2 facelets event state parsed", na),
              e());
        }
      } else if (5 == ha) {
        giikerutil.log("[gancube]", "v2 received hardware info event", da);
        wa = parseInt(da.slice(8, 16), 2) + "." + parseInt(da.slice(16, 24), 2);
        Ea =
          parseInt(da.slice(24, 32), 2) + "." + parseInt(da.slice(32, 40), 2);
        Ka = "";
        for (ha = 0; 8 > ha; ha++)
          Ka += String.fromCharCode(
            parseInt(da.slice(40 + 8 * ha, 48 + 8 * ha), 2)
          );
        da = 1 === parseInt(da.slice(104, 105), 2);
        giikerutil.log("[gancube]", "Hardware Version", wa);
        giikerutil.log("[gancube]", "Software Version", Ea);
        giikerutil.log("[gancube]", "Device Name", Ka);
        giikerutil.log("[gancube]", "Gyro Enabled", da);
      } else
        9 == ha
          ? (giikerutil.log("[gancube]", "v2 received battery event", da),
            (Ha = parseInt(da.slice(8, 16), 2)),
            giikerutil.updateBattery([Ha, fa + "*"]))
          : giikerutil.log("[gancube]", "v2 received unknown event", da);
  }
  function H(da, wa, ha, Ea, Ka) {
    return (
      ((wa - da) & 255) >= ((ha - da) & 255) &&
      (Ea || 0 < ((da - ha) & 255)) &&
      (Ka || 0 < ((wa - ha) & 255))
    );
  }
  function y(da) {
    0 < Ba.length
      ? (giikerutil.log(
          "[gancube]",
          "trying to inject lost move",
          ka,
          Ba[0][0],
          da
        ),
        !Ba.some(function (wa) {
          return wa[0] == da[0];
        }) &&
          H(ka, Ba[0][0], da[0]) &&
          da[0] == ((Ba[0][0] - 1) & 255) &&
          (Ba.unshift(da),
          giikerutil.log("[gancube]", "lost move recovered", da[0], da[1])))
      : (giikerutil.log(
          "[gancube]",
          "trying to inject lost move (empty buffer)",
          ka,
          la,
          da
        ),
        H(ka, la, da[0], !1, !0) &&
          (Ba.unshift(da),
          giikerutil.log(
            "[gancube]",
            "lost move recovered (empty buffer)",
            da[0],
            da[1]
          )));
  }
  function A(da, wa) {
    0 == da % 2 && (da = (da - 1) & 255);
    1 == wa % 2 && wa++;
    wa = Math.min(wa, da + 1);
    if (R) {
      var ha = mathlib.valuedArray(16, 0);
      ha[0] = 104;
      ha[1] = 3;
      var Ea = L;
    } else if (F)
      (ha = mathlib.valuedArray(20, 0)), (ha[0] = 209), (ha[1] = 4), (Ea = M);
    else return;
    ha[2] = da;
    ha[3] = 0;
    ha[4] = wa;
    ha[5] = 0;
    giikerutil.log("[gancube]", "requesting move history", ka, da, wa);
    da = N(ha.slice());
    return Ea.writeValue(new Uint8Array(da).buffer).catch($.noop);
  }
  function w(da) {
    for (; 0 < Ba.length; ) {
      var wa = (Ba[0][0] - ka) & 255;
      if (1 < wa) {
        giikerutil.log("[gancube]", "lost move detected", ka, Ba[0][0], wa);
        da && A(Ba[0][0], wa);
        break;
      } else {
        wa = Ba.shift();
        var ha = 3 * "URFDLB".indexOf(wa[1][0]) + " 2'".indexOf(wa[1][1]);
        mathlib.CubieCube.CubeMult(sa, mathlib.CubieCube.moveCube[ha], ta);
        ra.unshift(wa[1]);
        8 < ra.length && (ra = ra.slice(0, 8));
        GiikerCube.callback(ta.toFaceCube(), ra, [wa[2], wa[3]], fa + "*");
        ha = ta;
        ta = sa;
        sa = ha;
        ka = wa[0];
        giikerutil.log(
          "[gancube]",
          "move evicted from fifo buffer",
          wa[0],
          wa[1],
          wa[2],
          wa[3]
        );
      }
    }
    16 < Ba.length &&
      (giikerutil.log(
        "[gancube]",
        "something wrong, moves are not evicted from buffer, force cube disconnection",
        ka,
        JSON.stringify(Ba)
      ),
      GiikerCube.onDisconnect());
  }
  function v(da) {
    null != Z && u(da.target.value);
  }
  function u(da) {
    var wa = $.now();
    da = b(da);
    for (var ha = 0; ha < da.length; ha++)
      da[ha] = (da[ha] + 256).toString(2).slice(1);
    da = da.join("");
    var Ea = parseInt(da.slice(0, 8), 2),
      Ka = parseInt(da.slice(8, 16), 2);
    ha = parseInt(da.slice(16, 24), 2);
    if (85 != Ea || 0 >= ha)
      giikerutil.log("[gancube]", "v3 invalid magic or len", da);
    else if (1 == Ka)
      (Aa = wa),
        (la = parseInt(da.slice(64, 72) + da.slice(56, 64), 2)),
        giikerutil.log("[gancube]", "v3 received move event", ka, la, da),
        la != ka &&
          -1 != ka &&
          ((ha = parseInt(
            da.slice(48, 56) +
              da.slice(40, 48) +
              da.slice(32, 40) +
              da.slice(24, 32),
            2
          )),
          (Ea = parseInt(da.slice(72, 74), 2)),
          (Ka = [2, 32, 8, 1, 16, 4].indexOf(parseInt(da.slice(74, 80), 2))),
          -1 == Ka
            ? giikerutil.log("[gancube]", "v3 move event invalid axis")
            : ((Ea = "URFDLB".charAt(Ka) + " '".charAt(Ea)),
              Ba.push([la, Ea, ha, wa]),
              giikerutil.log(
                "[gancube]",
                "v3 move placed to fifo buffer",
                la,
                Ea,
                ha,
                wa
              ),
              w(!0)));
    else if (2 == Ka)
      if (((la = parseInt(da.slice(32, 40) + da.slice(24, 32), 2)), -1 != ka))
        null != Aa &&
          500 < wa - Aa &&
          ((da = (la - ka) & 255),
          0 < da &&
            (giikerutil.log(
              "[gancube]",
              "v3 cube state is ahead of the last recorded move",
              ka,
              la,
              da
            ),
            0 != la &&
              ((wa = Ba[0] ? Ba[0][0] : (la + 1) & 255), A(wa, da + 1))));
      else {
        giikerutil.log("[gancube]", "v3 processing facelets event", ka, la, da);
        wa = new mathlib.CubieCube();
        Ea = 0;
        Ka = 3840;
        for (ha = 0; 7 > ha; ha++) {
          var Qa = parseInt(da.slice(40 + 3 * ha, 43 + 3 * ha), 2),
            ia = parseInt(da.slice(61 + 2 * ha, 63 + 2 * ha), 2);
          Ka -= ia << 3;
          Ka ^= Qa;
          wa.ca[ha] = (ia << 3) | Qa;
        }
        wa.ca[7] = (Ka & 4088) % 24 | (Ka & 7);
        for (ha = 0; 11 > ha; ha++)
          (Qa = parseInt(da.slice(77 + 4 * ha, 81 + 4 * ha), 2)),
            (ia = parseInt(da.slice(121 + ha, 122 + ha), 2)),
            (Ea ^= (Qa << 1) | ia),
            (wa.ea[ha] = (Qa << 1) | ia);
        wa.ea[11] = Ea;
        0 != wa.verify()
          ? (Ma++,
            giikerutil.log("[gancube]", "v3 facelets state verify error"))
          : ((na = wa.toFaceCube()),
            giikerutil.log("[gancube]", "v3 facelets event state parsed", na),
            e());
      }
    else if (6 == Ka) {
      wa = parseInt(da.slice(24, 32), 2);
      Qa = 2 * (ha - 1);
      giikerutil.log("[gancube]", "v3 received move history event", wa, Qa, da);
      for (ha = 0; ha < Qa; ha++)
        (Ka = parseInt(da.slice(32 + 4 * ha, 35 + 4 * ha), 2)),
          (Ea = parseInt(da.slice(35 + 4 * ha, 36 + 4 * ha), 2)),
          6 > Ka &&
            ((Ea = "DUBFLR".charAt(Ka) + " '".charAt(Ea)),
            y([(wa - ha) & 255, Ea, null, null]));
      w(!1);
    } else if (7 == Ka) {
      giikerutil.log("[gancube]", "v3 received hardware info event", da);
      wa = parseInt(da.slice(80, 84), 2) + "." + parseInt(da.slice(84, 88), 2);
      Ea = parseInt(da.slice(72, 76), 2) + "." + parseInt(da.slice(76, 80), 2);
      Ka = "";
      for (ha = 0; 5 > ha; ha++)
        Ka += String.fromCharCode(
          parseInt(da.slice(32 + 8 * ha, 40 + 8 * ha), 2)
        );
      giikerutil.log("[gancube]", "Hardware Version", wa);
      giikerutil.log("[gancube]", "Software Version", Ea);
      giikerutil.log("[gancube]", "Device Name", Ka);
    } else
      16 == Ka
        ? (giikerutil.log("[gancube]", "v3 received battery event", da),
          (Ha = parseInt(da.slice(24, 32), 2)),
          giikerutil.updateBattery([Ha, fa + "*"]))
        : giikerutil.log("[gancube]", "v3 received unknown event", Ka, da);
  }
  function I(da) {
    null != Z && z(da.target.value);
  }
  function z(da) {
    var wa = $.now();
    da = b(da);
    for (var ha = 0; ha < da.length; ha++)
      da[ha] = (da[ha] + 256).toString(2).slice(1);
    da = da.join("");
    ha = parseInt(da.slice(0, 8), 2);
    var Ea = parseInt(da.slice(8, 16), 2);
    if (1 == ha) {
      if (
        ((Aa = wa),
        (la = parseInt(da.slice(56, 64) + da.slice(48, 56), 2)),
        giikerutil.log("[gancube]", "v4 received move event", ka, la, da),
        la != ka && -1 != ka)
      ) {
        ha = parseInt(
          da.slice(40, 48) +
            da.slice(32, 40) +
            da.slice(24, 32) +
            da.slice(16, 24),
          2
        );
        Ea = parseInt(da.slice(64, 66), 2);
        var Ka = [2, 32, 8, 1, 16, 4].indexOf(parseInt(da.slice(66, 72), 2));
        -1 == Ka
          ? giikerutil.log("[gancube]", "v4 move event invalid axis")
          : ((Ea = "URFDLB".charAt(Ka) + " '".charAt(Ea)),
            Ba.push([la, Ea, ha, wa]),
            giikerutil.log(
              "[gancube]",
              "v4 move placed to fifo buffer",
              la,
              Ea,
              ha,
              wa
            ),
            w(!0));
      }
    } else if (237 == ha)
      if (((la = parseInt(da.slice(24, 32) + da.slice(16, 24), 2)), -1 != ka))
        null != Aa &&
          500 < wa - Aa &&
          ((da = (la - ka) & 255),
          0 < da &&
            (giikerutil.log(
              "[gancube]",
              "v4 cube state is ahead of the last recorded move",
              ka,
              la,
              da
            ),
            0 != la &&
              ((wa = Ba[0] ? Ba[0][0] : (la + 1) & 255), A(wa, da + 1))));
      else {
        giikerutil.log("[gancube]", "v4 processing facelets event", ka, la, da);
        wa = new mathlib.CubieCube();
        Ea = 0;
        Ka = 3840;
        for (ha = 0; 7 > ha; ha++) {
          var Qa = parseInt(da.slice(32 + 3 * ha, 35 + 3 * ha), 2),
            ia = parseInt(da.slice(53 + 2 * ha, 55 + 2 * ha), 2);
          Ka -= ia << 3;
          Ka ^= Qa;
          wa.ca[ha] = (ia << 3) | Qa;
        }
        wa.ca[7] = (Ka & 4088) % 24 | (Ka & 7);
        for (ha = 0; 11 > ha; ha++)
          (Qa = parseInt(da.slice(69 + 4 * ha, 73 + 4 * ha), 2)),
            (ia = parseInt(da.slice(113 + ha, 114 + ha), 2)),
            (Ea ^= (Qa << 1) | ia),
            (wa.ea[ha] = (Qa << 1) | ia);
        wa.ea[11] = Ea;
        0 != wa.verify()
          ? (Ma++,
            giikerutil.log("[gancube]", "v4 facelets state verify error"))
          : ((na = wa.toFaceCube()),
            giikerutil.log("[gancube]", "v4 facelets event state parsed", na),
            e());
      }
    else if (209 == ha) {
      wa = parseInt(da.slice(16, 24), 2);
      Qa = 2 * (Ea - 1);
      giikerutil.log("[gancube]", "v4 received move history event", wa, Qa, da);
      for (ha = 0; ha < Qa; ha++)
        (Ka = parseInt(da.slice(24 + 4 * ha, 27 + 4 * ha), 2)),
          (Ea = parseInt(da.slice(27 + 4 * ha, 28 + 4 * ha), 2)),
          6 > Ka &&
            ((Ea = "DUBFLR".charAt(Ka) + " '".charAt(Ea)),
            y([(wa - ha) & 255, Ea, null, null]));
      w(!1);
    } else if (-1 != [245, 246, 250, 252, 253, 254, 255].indexOf(ha))
      switch (ha) {
        case 250:
          ha = parseInt(da.slice(32, 40) + da.slice(24, 32), 2);
          wa = parseInt(da.slice(40, 48), 2);
          da = parseInt(da.slice(48, 56), 2);
          giikerutil.log("[gancube]", "Product Date", ha + "-" + wa + "-" + da);
          break;
        case 252:
          wa = "";
          for (ha = 0; ha < Ea - 1; ha++)
            wa += String.fromCharCode(
              parseInt(da.slice(24 + 8 * ha, 32 + 8 * ha), 2)
            );
          giikerutil.log("[gancube]", "Hardware Name", wa);
          break;
        case 253:
          ha = parseInt(da.slice(24, 28), 2);
          da = parseInt(da.slice(28, 32), 2);
          giikerutil.log("[gancube]", "Software Version", ha + "." + da);
          break;
        case 254:
          (ha = parseInt(da.slice(24, 28), 2)),
            (da = parseInt(da.slice(28, 32), 2)),
            giikerutil.log("[gancube]", "Hardware Version", ha + "." + da);
      }
    else
      239 == ha
        ? (giikerutil.log("[gancube]", "v4 received battery event", da),
          (Ha = parseInt(da.slice(8 + 8 * Ea, 16 + 8 * Ea), 2)),
          giikerutil.log("[gancube]", "v4 battery level", Ha),
          giikerutil.updateBattery([Ha, fa + "*"]))
        : 236 != ha &&
          giikerutil.log("[gancube]", "v4 received unknown event", ha, da);
  }
  function O() {
    var da = Promise.resolve();
    D &&
      (D.removeEventListener("characteristicvaluechanged", m),
      (da = D.stopNotifications().catch($.noop)),
      (D = null));
    G &&
      (G.removeEventListener("characteristicvaluechanged", v),
      (da = G.stopNotifications().catch($.noop)),
      (G = null));
    K &&
      (K.removeEventListener("characteristicvaluechanged", I),
      (da = K.stopNotifications().catch($.noop)),
      (K = null));
    ea = fa = J = F = R = l = M = L = x = W = P = null;
    ra = [];
    ya = [];
    Ba = [];
    sa = new mathlib.CubieCube();
    ta = new mathlib.CubieCube();
    na = mathlib.SOLVED_FACELET;
    ba = U = 0;
    ka = la = -1;
    Aa = null;
    Da = 1e3;
    Ha = 0;
    return da;
  }
  var J,
    P,
    W,
    X,
    V,
    Q,
    d,
    l,
    D,
    x,
    R,
    G,
    L,
    F,
    K,
    M,
    S = mathlib.valuedArray(256, function (da) {
      return (da << 8) | 1;
    }),
    Z = null,
    fa = null,
    ea = null,
    va =
      "NoRgnAHANATADDWJYwMxQOxiiEcfYgSK6Hpr4TYCs0IG1OEAbDszALpA NoNg7ANATFIQnARmogLBRUCs0oAYN8U5J45EQBmFADg0oJAOSlUQF0g NoRgNATGBs1gLABgQTjCeBWSUDsYBmKbCeMADjNnXxHIoIF0g NoRg7ANAzBCsAMEAsioxBEIAc0Cc0ATJkgSIYhXIjhMQGxgC6QA NoVgNAjAHGBMYDYCcdJgCwTFBkYVgAY9JpJYUsYBmAXSA NoRgNAbAHGAsAMkwgMyzClH0LFcArHnAJzIqIBMGWEAukA".split(
        " "
      ),
    ra = [],
    ya = [],
    Ba = [],
    sa = new mathlib.CubieCube(),
    ta = new mathlib.CubieCube(),
    na = mathlib.SOLVED_FACELET,
    U = 0,
    ba = 0,
    la = -1,
    ka = -1,
    Aa = null,
    Da = 1e3,
    Ha = 0,
    Ma = 0;
  $.parseV2Data = r;
  $.parseV3Data = u;
  $.parseV4Data = z;
  GiikerCube.regCubeModel({
    prefix: ["GAN", "MG", "AiCube"],
    init: function (da) {
      O();
      fa = da.name;
      giikerutil.log("[gancube] init gan cube start");
      return GiikerCube.waitForAdvs()
        .then(function (wa) {
          a: if (wa instanceof DataView)
            wa = new DataView(wa.buffer.slice(2, 11));
          else {
            var ha,
              Ea = $jscomp.makeIterator(S);
            for (ha = Ea.next(); !ha.done; ha = Ea.next())
              if (((ha = ha.value), wa.has(ha))) {
                giikerutil.log(
                  "[gancube] found Manufacturer Data under CIC = 0x" +
                    ha.toString(16).padStart(4, "0")
                );
                wa = new DataView(wa.get(ha).buffer.slice(0, 9));
                break a;
              }
            giikerutil.log(
              "[gancube] Looks like this cube has new unknown CIC"
            );
            wa = void 0;
          }
          if (wa && 6 <= wa.byteLength) {
            Ea = [];
            for (ha = 0; 6 > ha; ha++)
              Ea.push(
                (wa.getUint8(wa.byteLength - ha - 1) + 256)
                  .toString(16)
                  .slice(1)
              );
            return Promise.resolve(Ea.join(":"));
          }
          return Promise.reject(-3);
        })
        .then(
          function (wa) {
            giikerutil.log(
              "[gancube] init, found cube bluetooth hardware MAC = " + wa
            );
            ea = wa;
          },
          function (wa) {
            giikerutil.log(
              "[gancube] init, unable to automatically determine cube MAC, error code = " +
                wa
            );
          }
        )
        .then(function () {
          return da.gatt.connect();
        })
        .then(function (wa) {
          J = wa;
          return wa.getPrimaryServices();
        })
        .then(function (wa) {
          for (var ha = 0; ha < wa.length; ha++) {
            var Ea = wa[ha];
            giikerutil.log("[gancube] checkHardware find service", Ea.uuid);
            GiikerCube.matchUUID(
              Ea.uuid,
              "0000180a-0000-1000-8000-00805f9b34fb"
            )
              ? (W = Ea)
              : GiikerCube.matchUUID(
                  Ea.uuid,
                  "0000fff0-0000-1000-8000-00805f9b34fb"
                )
              ? (P = Ea)
              : GiikerCube.matchUUID(
                  Ea.uuid,
                  "6e400001-b5a3-f393-e0a9-e50e24dc4179"
                )
              ? (l = Ea)
              : GiikerCube.matchUUID(
                  Ea.uuid,
                  "8653000a-43e6-47b7-9cb0-5fc21d4ae340"
                )
              ? (R = Ea)
              : GiikerCube.matchUUID(
                  Ea.uuid,
                  "00000010-0000-fff7-fff6-fff5fff4fff0"
                ) && (F = Ea);
          }
          if (l) return c((fa || "").startsWith("AiCube") ? 1 : 0);
          if (R) return g();
          if (F) return a();
          if (P && W) return t();
          logohint.push(LGHINT_BTNOTSUP);
        });
    },
    opservs: [
      "0000fff0-0000-1000-8000-00805f9b34fb",
      "0000180a-0000-1000-8000-00805f9b34fb",
      "6e400001-b5a3-f393-e0a9-e50e24dc4179",
      "8653000a-43e6-47b7-9cb0-5fc21d4ae340",
      "00000010-0000-fff7-fff6-fff5fff4fff0",
    ],
    cics: S,
    getBatteryLevel: function () {
      return J
        ? l || R || F
          ? Promise.resolve([Ha, fa + "*"])
          : d
          ? d.readValue().then(function (da) {
              da = b(da);
              return Promise.resolve([da[7], fa]);
            })
          : Promise.resolve([Ha, fa])
        : Promise.reject("Bluetooth Cube is not connected");
    },
    clear: O,
  });
});
execMain(function () {
  function b(m) {
    giikerutil.log("[moyucube] Received read event", m.target.value);
  }
  function N(m) {
    giikerutil.log("[moyucube] Received gyro event", m.target.value);
  }
  function t(m) {
    m = m.target.value;
    giikerutil.log("[moyucube] Received turn event", m);
    var r = $.now();
    if (!(1 > m.byteLength)) {
      var H = m.getUint8(0);
      if (!(m.byteLength < 1 + 6 * H))
        for (var y = 0; y < H; y++) {
          var A = 1 + 6 * y,
            w =
              (m.getUint8(A + 1) << 24) |
              (m.getUint8(A + 0) << 16) |
              (m.getUint8(A + 3) << 8) |
              m.getUint8(A + 2);
          w = Math.round((w / 65536) * 1e3);
          var v = m.getUint8(A + 4),
            u = Math.round(m.getUint8(A + 5) / 36);
          A = a[v];
          u = a[v] + u;
          a[v] = (u + 9) % 9;
          v = [3, 4, 5, 1, 2, 0][v];
          if (5 <= A && 4 >= u) A = 2;
          else if (4 >= A && 5 <= u) A = 0;
          else continue;
          u = 3 * v + A;
          giikerutil.log(
            "[moyucube] move",
            "URFDLB".charAt(v) + " 2'".charAt(A)
          );
          mathlib.CubieCube.CubeMult(p, mathlib.CubieCube.moveCube[u], h);
          e = h.toFaceCube();
          q.unshift("URFDLB".charAt(v) + " 2'".charAt(A));
          8 < q.length && (q = q.slice(0, 8));
          GiikerCube.callback(e, q, [w, r], c);
          w = h;
          h = p;
          p = w;
        }
    }
  }
  function E() {
    var m = Promise.resolve();
    if (k || g || f)
      k && k.removeEventListener("characteristicvaluechanged", b),
        g && g.removeEventListener("characteristicvaluechanged", t),
        f && f.removeEventListener("characteristicvaluechanged", N),
        (m = Promise.all([
          k && k.stopNotifications().catch($.noop),
          g && g.stopNotifications().catch($.noop),
          f && f.stopNotifications().catch($.noop),
        ])),
        (f = g = k = null);
    c = n = C = null;
    a = [0, 0, 0, 0, 0, 0];
    e = mathlib.SOLVED_FACELET;
    h = new mathlib.CubieCube();
    p = new mathlib.CubieCube();
    q = [];
    return m;
  }
  var n,
    C,
    c,
    k,
    g,
    f,
    a = [0, 0, 0, 0, 0, 0],
    e = mathlib.SOLVED_FACELET,
    h = new mathlib.CubieCube(),
    p = new mathlib.CubieCube(),
    q = [];
  GiikerCube.regCubeModel({
    prefix: "MHC",
    init: function (m) {
      E();
      c = m.name;
      return m.gatt
        .connect()
        .then(function (r) {
          n = r;
          return r.getPrimaryService("00001000-0000-1000-8000-00805f9b34fb");
        })
        .then(function (r) {
          C = r;
          return C.getCharacteristics();
        })
        .then(function (r) {
          for (var H = 0; H < r.length; H++) {
            var y = r[H];
            giikerutil.log("[moyucube]", "init find chrct", y.uuid);
            GiikerCube.matchUUID(
              y.uuid,
              "00001001-0000-1000-8000-00805f9b34fb"
            ) ||
              (GiikerCube.matchUUID(
                y.uuid,
                "00001002-0000-1000-8000-00805f9b34fb"
              )
                ? (k = y)
                : GiikerCube.matchUUID(
                    y.uuid,
                    "00001003-0000-1000-8000-00805f9b34fb"
                  )
                ? (g = y)
                : GiikerCube.matchUUID(
                    y.uuid,
                    "00001004-0000-1000-8000-00805f9b34fb"
                  ) && (f = y));
          }
        })
        .then(function () {
          k.addEventListener("characteristicvaluechanged", b);
          g.addEventListener("characteristicvaluechanged", t);
          f.addEventListener("characteristicvaluechanged", N);
          k.startNotifications();
          g.startNotifications();
          f.startNotifications();
        });
    },
    opservs: ["00001000-0000-1000-8000-00805f9b34fb"],
    getBatteryLevel: function () {
      if (!n) return Promise.reject("Bluetooth Cube is not connected");
      Promise.resolve([100, c]);
    },
    clear: E,
  });
});
execMain(function () {
  function b(v) {
    var u = mathlib.valuedArray(20, 0);
    u[0] = v;
    if (C) {
      v = u.slice();
      if (null != y) {
        for (var I = y.iv || [], z = 0; 16 > z; z++) v[z] ^= ~~I[z];
        y.encrypt(v);
        if (16 < v.length) {
          var O = v.length - 16,
            J = v.slice(O);
          for (z = 0; 16 > z; z++) J[z] ^= ~~I[z];
          y.encrypt(J);
          for (z = 0; 16 > z; z++) v[z + O] = J[z];
        }
      }
      giikerutil.log("[Moyu32Cube] sendRequest", u, v);
      u = C.writeValue(new Uint8Array(v).buffer);
    } else giikerutil.log("[Moyu32Cube] sendRequest cannot find write chrct"), (u = void 0);
    return u;
  }
  function N(v) {
    if (null != y) {
      var u = v.target.value;
      v = $.now();
      var I = u;
      u = [];
      for (var z = 0; z < I.byteLength; z++) u[z] = I.getUint8(z);
      if (null != y) {
        I = y.iv || [];
        if (16 < u.length) {
          var O = u.length - 16,
            J = y.decrypt(u.slice(O));
          for (z = 0; 16 > z; z++) u[z + O] = J[z] ^ ~~I[z];
        }
        y.decrypt(u);
        for (z = 0; 16 > z; z++) u[z] ^= ~~I[z];
      }
      for (z = 0; z < u.length; z++) u[z] = (u[z] + 256).toString(2).slice(1);
      u = u.join("");
      z = parseInt(u.slice(0, 8), 2);
      if (161 == z) {
        giikerutil.log("[Moyu32Cube] received hardware info event", u);
        v = "";
        for (z = 0; 8 > z; z++)
          v += String.fromCharCode(parseInt(u.slice(8 + 8 * z, 16 + 8 * z), 2));
        z = parseInt(u.slice(88, 96), 2) + "." + parseInt(u.slice(96, 104), 2);
        u = parseInt(u.slice(72, 80), 2) + "." + parseInt(u.slice(80, 88), 2);
        giikerutil.log("[Moyu32Cube] Hardware Version (?)", z);
        giikerutil.log("[Moyu32Cube] Software Version", u);
        giikerutil.log("[Moyu32Cube] Device Name", v);
      } else if (163 == z) {
        if (-1 == r) {
          m = parseInt(u.slice(152, 160), 2);
          v = u.slice(8, 152);
          u = [];
          z = [2, 5, 0, 3, 4, 1];
          for (I = 0; 6 > I; I += 1)
            for (O = v.slice(24 * z[I], 24 + 24 * z[I]), J = 0; 8 > J; J += 1)
              u.push("FBUDLR".charAt(parseInt(O.slice(3 * J, 3 + 3 * J), 2))),
                3 == J && u.push("FBUDLR".charAt(z[I]));
          h = u.join("");
          v = $.now();
          giikerutil.log("[Moyu32Cube] initialising cube state");
          GiikerCube.callback(h, [], [null, v], c);
          a.fromFacelet(h);
          r = m;
          h != kernel.getProp("giiSolved", mathlib.SOLVED_FACELET) &&
            ((v = kernel.getProp("giiRST")),
            ("a" == v || ("p" == v && confirm(CONFIRM_GIIRST))) &&
              giikerutil.markSolved());
        }
      } else if (164 == z)
        (H = parseInt(u.slice(8, 16), 2)), giikerutil.updateBattery([H, c]);
      else if (
        165 == z &&
        ((m = parseInt(u.slice(88, 96), 2)), m != r && -1 != r)
      ) {
        f = [];
        g = [];
        I = !1;
        for (z = 0; 5 > z; z++)
          (O = parseInt(u.slice(96 + 5 * z, 101 + 5 * z), 2)),
            (f[z] = parseInt(u.slice(8 + 16 * z, 24 + 16 * z), 2)),
            (g[z] = "FBUDLR".charAt(O >> 1) + " '".charAt(O & 1)),
            12 <= O && ((g[z] = "U "), (I = !0));
        if (!I) {
          z = (m - r) & 255;
          1 < z &&
            giikerutil.log(
              "[Moyu32Cube] bluetooth event was lost, moveDiff = " + z
            );
          r = m;
          z > g.length && (z = g.length);
          I = p + q;
          for (u = z - 1; 0 <= u; u--) I += f[u];
          if (!p || 2e3 < Math.abs(v - I))
            giikerutil.log("[Moyu32Cube] time adjust", v - I, "@", v),
              (p += v - I);
          for (u = z - 1; 0 <= u; u--)
            (z = 3 * "URFDLB".indexOf(g[u][0]) + " 2'".indexOf(g[u][1])),
              mathlib.CubieCube.CubeMult(a, mathlib.CubieCube.moveCube[z], e),
              (p += f[u]),
              GiikerCube.callback(
                e.toFaceCube(),
                g.slice(u),
                [p, 0 == u ? v : null],
                c
              ),
              (z = e),
              (e = a),
              (a = z),
              giikerutil.log("[Moyu32Cube] move", g[u], f[u]);
          q = v - p;
        }
      }
    }
  }
  function t() {
    var v = Promise.resolve();
    E = null;
    n &&
      (n.removeEventListener("characteristicvaluechanged", N),
      (v = n.stopNotifications().catch($.noop)),
      (n = null));
    k = c = C = null;
    g = [];
    f = [];
    a = new mathlib.CubieCube();
    e = new mathlib.CubieCube();
    h = mathlib.SOLVED_FACELET;
    q = p = 0;
    r = m = -1;
    H = 0;
    return v;
  }
  var E,
    n,
    C,
    c,
    k = null,
    g = [],
    f = [],
    a = new mathlib.CubieCube(),
    e = new mathlib.CubieCube(),
    h = mathlib.SOLVED_FACELET,
    p = 0,
    q = 0,
    m = -1,
    r = -1,
    H = 0,
    y = null,
    A = [
      "NoJgjANGYJwQrADgjEUAMBmKAWCP4JNIRswt81Yp5DztE1EB2AXSA",
      "NoRg7ANAzArNAc1IigFgqgTB9MCcE8cAbBCJpKgeaSAAxTSPxgC6QA",
    ],
    w = mathlib.valuedArray(255, function (v) {
      return (v + 1) << 8;
    });
  GiikerCube.regCubeModel({
    prefix: "WCU_MY3",
    init: function (v) {
      t();
      c = v.name.trim();
      giikerutil.log("[Moyu32Cube] start init device");
      return GiikerCube.waitForAdvs()
        .then(function (u) {
          a: if (u instanceof DataView) u = new DataView(u.buffer.slice(2));
          else {
            var I,
              z = $jscomp.makeIterator(w);
            for (I = z.next(); !I.done; I = z.next())
              if (((I = I.value), u.has(I))) {
                giikerutil.log(
                  "[Moyu32Cube] found Manufacturer Data under CIC = 0x" +
                    I.toString(16).padStart(4, "0")
                );
                u = u.get(I);
                break a;
              }
            giikerutil.log(
              "[Moyu32Cube] Looks like this cube has new unknown CIC"
            );
            u = void 0;
          }
          if (u && 6 <= u.byteLength) {
            z = [];
            for (I = 0; 6 > I; I++)
              z.push(
                (u.getUint8(u.byteLength - I - 1) + 256).toString(16).slice(1)
              );
            return Promise.resolve(z.join(":"));
          }
          return Promise.reject(-3);
        })
        .then(
          function (u) {
            giikerutil.log(
              "[Moyu32Cube] init, found cube bluetooth hardware MAC = " + u
            );
            k = u;
          },
          function (u) {
            giikerutil.log(
              "[Moyu32Cube] init, unable to automatically determine cube MAC, error code = " +
                u
            );
          }
        )
        .then(function () {
          return v.gatt.connect();
        })
        .then(function (u) {
          return u.getPrimaryService("0783b03e-7735-b5a0-1760-a305d2795cb0");
        })
        .then(function (u) {
          E = u;
          giikerutil.log(
            "[Moyu32Cube] got primary service",
            "0783b03e-7735-b5a0-1760-a305d2795cb0"
          );
          return E.getCharacteristics();
        })
        .then(function (u) {
          for (var I = 0; I < u.length; I++) {
            var z = u[I];
            giikerutil.log("[Moyu32Cube] init find chrct", z.uuid);
            GiikerCube.matchUUID(z.uuid, "0783b03e-7735-b5a0-1760-a305d2795cb1")
              ? (n = z)
              : GiikerCube.matchUUID(
                  z.uuid,
                  "0783b03e-7735-b5a0-1760-a305d2795cb2"
                ) && (C = z);
          }
        })
        .then(function () {
          n.addEventListener("characteristicvaluechanged", N);
          return n.startNotifications();
        })
        .then(function () {
          a: {
            if (k) {
              var u = JSON.parse(kernel.getProp("giiMacMap", "{}")),
                I = u[c];
              I && I.toUpperCase() == k.toUpperCase()
                ? giikerutil.log("[Moyu32Cube] mac matched")
                : (giikerutil.log("[Moyu32Cube] mac updated"),
                  (u[c] = k),
                  kernel.setProp("giiMacMap", JSON.stringify(u)));
            } else {
              u = JSON.parse(kernel.getProp("giiMacMap", "{}"));
              I = u[c];
              !I &&
                /^WCU_MY32_[0-9A-F]{4}$/.exec(c) &&
                (I = "CF:30:16:00:" + c.slice(9, 11) + ":" + c.slice(11, 13));
              I = prompt("" + GIIKER_REQMACMSG, I || "xx:xx:xx:xx:xx:xx");
              if (!/^([0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i.exec(I)) {
                logohint.push(LGHINT_BTINVMAC);
                y = null;
                break a;
              }
              I != u[c] &&
                ((u[c] = I), kernel.setProp("giiMacMap", JSON.stringify(u)));
              k = I;
            }
            I = k;
            u = [];
            for (var z = 0; 6 > z; z++)
              u.push(parseInt(I.slice(3 * z, 3 * z + 2), 16));
            I = JSON.parse(LZString.decompressFromEncodedURIComponent(A[0]));
            z = JSON.parse(LZString.decompressFromEncodedURIComponent(A[1]));
            for (var O = 0; 6 > O; O++)
              (I[O] = (I[O] + u[5 - O]) % 255),
                (z[O] = (z[O] + u[5 - O]) % 255);
            u = [I, z];
            y = $.aes128(u[0]);
            y.iv = u[1];
          }
          return b(161);
        })
        .then(function () {
          return b(163);
        })
        .then(function () {
          return b(164);
        });
    },
    opservs: ["0783b03e-7735-b5a0-1760-a305d2795cb0"],
    cics: w,
    getBatteryLevel: function () {
      return b(164).then(function () {
        return Promise.resolve([H, c]);
      });
    },
    clear: t,
  });
});
execMain(function () {
  function b(y) {
    for (var A = 65535, w = 0; w < y.length; w++) {
      A ^= y[w];
      for (var v = 0; 8 > v; v++) A = 0 < (A & 1) ? (A >> 1) ^ 40961 : A >> 1;
    }
    return A;
  }
  function N(y) {
    if (!g || DEBUGBL) return DEBUGBL ? Promise.resolve() : Promise.reject();
    var A = [254];
    A.push(4 + y.length);
    for (var w = 0; w < y.length; w++) A.push(y[w]);
    w = b(A);
    A.push(w & 255, w >> 8);
    y = (16 - (A.length % 16)) % 16;
    for (w = 0; w < y; w++) A.push(0);
    y = [];
    a =
      a ||
      $.aes128(JSON.parse(LZString.decompressFromEncodedURIComponent(h[0])));
    for (w = 0; w < A.length; w += 16) {
      var v = A.slice(w, w + 16);
      a.encrypt(v);
      for (var u = 0; 16 > u; u++) y[w + u] = v[u];
    }
    giikerutil.log("[qiyicube] send message to cube", A, y);
    return g.writeValue(new Uint8Array(y).buffer);
  }
  function t(y) {
    var A = y.target.value;
    y = [];
    for (var w = 0; w < A.byteLength; w++) y[w] = A.getUint8(w);
    giikerutil.log("[qiyicube] receive enc data", y);
    a =
      a ||
      $.aes128(JSON.parse(LZString.decompressFromEncodedURIComponent(h[0])));
    A = [];
    for (w = 0; w < y.length; w += 16) {
      var v = y.slice(w, w + 16);
      a.decrypt(v);
      for (var u = 0; 16 > u; u++) A[w + u] = v[u];
    }
    giikerutil.log("[qiyicube] decrypted msg", A);
    A = A.slice(0, A[1]);
    3 > A.length || 0 != b(A)
      ? giikerutil.log("[qiyicube] crc checked error")
      : E(A);
  }
  function E(y) {
    var A = $.now();
    254 != y[0] && giikerutil.log("[qiyicube] error cube data", y);
    var w = y[2],
      v = (y[3] << 24) | (y[4] << 16) | (y[5] << 8) | y[6];
    if (2 == w)
      (H = y[35]),
        N(y.slice(2, 7)),
        (w = n(y.slice(7, 34))),
        GiikerCube.callback(w, [], [Math.trunc(v / 1.6), A], k),
        q.fromFacelet(w),
        w != kernel.getProp("giiSolved", mathlib.SOLVED_FACELET) &&
          ((y = kernel.getProp("giiRST")),
          ("a" == y || ("p" == y && confirm(CONFIRM_GIIRST))) &&
            giikerutil.markSolved());
    else if (3 == w) {
      N(y.slice(2, 7));
      for (w = [[y[34], v]]; 10 > w.length; ) {
        var u = 91 - 5 * w.length,
          I = (y[u] << 24) | (y[u + 1] << 16) | (y[u + 2] << 8) | y[u + 3];
        if (I <= r) break;
        w.push([y[u + 4], I]);
      }
      1 < w.length &&
        giikerutil.log("[qiyicube] miss history moves", JSON.stringify(w), r);
      u = [];
      for (I = w.length - 1; 0 <= I; I--) {
        var z = [4, 1, 3, 0, 2, 5][(w[I][0] - 1) >> 1];
        var O = [0, 2][w[I][0] & 1];
        mathlib.CubieCube.CubeMult(q, mathlib.CubieCube.moveCube[3 * z + O], p);
        m.unshift("URFDLB".charAt(z) + " 2'".charAt(O));
        m = m.slice(0, 8);
        z = p.toFaceCube();
        u.push([z, m.slice(), [Math.trunc(w[I][1] / 1.6), A], k]);
        O = p;
        p = q;
        q = O;
      }
      w = n(y.slice(7, 34));
      if (w != z)
        giikerutil.log("[qiyicube] facelet", w),
          p.fromFacelet(w),
          GiikerCube.callback(w, m, [Math.trunc(v / 1.6), A], k),
          (O = p),
          (p = q),
          (q = O);
      else for (I = 0; I < u.length; I++) GiikerCube.callback.apply(null, u[I]);
      y = y[35];
      y != H && ((H = y), giikerutil.updateBattery([H, k]));
    }
    r = v;
  }
  function n(y) {
    for (var A = [], w = 0; 54 > w; w++)
      A.push("LRDUFB".charAt((y[w >> 1] >> (w % 2 << 2)) & 15));
    return (A = A.join(""));
  }
  function C() {
    var y = Promise.resolve();
    g &&
      (g.removeEventListener("characteristicvaluechanged", t),
      (y = g.stopNotifications().catch($.noop)),
      (g = null));
    e = k = c = null;
    p = new mathlib.CubieCube();
    q = new mathlib.CubieCube();
    m = [];
    H = r = 0;
    return y;
  }
  var c,
    k,
    g,
    f = [1284],
    a = null,
    e = null,
    h = ["NoDg7ANAjGkEwBYCc0xQnADAVgkzGAzHNAGyRTanQi5QIFyHrjQMQgsC6QA"],
    p = new mathlib.CubieCube(),
    q = new mathlib.CubieCube(),
    m = [],
    r = 0,
    H = 0;
  $.parseQYData = E;
  GiikerCube.regCubeModel({
    prefix: "QY-QYSC",
    init: function (y) {
      C();
      k = y.name.trim();
      giikerutil.log("[qiyicube] start init device");
      return GiikerCube.waitForAdvs()
        .then(function (A) {
          a: if (A instanceof DataView) A = new DataView(A.buffer.slice(2));
          else {
            var w,
              v = $jscomp.makeIterator(f);
            for (w = v.next(); !w.done; w = v.next())
              if (((w = w.value), A.has(w))) {
                giikerutil.log(
                  "[qiyicube] found Manufacturer Data under CIC = 0x" +
                    w.toString(16).padStart(4, "0")
                );
                A = A.get(w);
                break a;
              }
            giikerutil.log(
              "[qiyicube] Looks like this cube has new unknown CIC"
            );
            A = void 0;
          }
          if (A && 6 <= A.byteLength) {
            v = [];
            for (w = 5; 0 <= w; w--)
              v.push((A.getUint8(w) + 256).toString(16).slice(1));
            return Promise.resolve(v.join(":"));
          }
          return Promise.reject(-3);
        })
        .then(
          function (A) {
            giikerutil.log(
              "[qiyicube] init, found cube bluetooth hardware MAC = " + A
            );
            e = A;
          },
          function (A) {
            giikerutil.log(
              "[qiyicube] init, unable to automatically determine cube MAC, error code = " +
                A
            );
          }
        )
        .then(function () {
          return y.gatt.connect();
        })
        .then(function (A) {
          return A.getPrimaryService("0000fff0-0000-1000-8000-00805f9b34fb");
        })
        .then(function (A) {
          c = A;
          giikerutil.log(
            "[qiyicube] got primary service",
            "0000fff0-0000-1000-8000-00805f9b34fb"
          );
          return c.getCharacteristics();
        })
        .then(function (A) {
          for (var w = 0; w < A.length; w++) {
            var v = A[w];
            giikerutil.log("[qiyicube] init find chrct", v.uuid);
            GiikerCube.matchUUID(
              v.uuid,
              "0000fff6-0000-1000-8000-00805f9b34fb"
            ) && (g = v);
          }
        })
        .then(function () {
          g.addEventListener("characteristicvaluechanged", t);
          return g.startNotifications();
        })
        .then(function () {
          if (e) {
            var A = JSON.parse(kernel.getProp("giiMacMap", "{}")),
              w = A[k];
            w && w.toUpperCase() == e.toUpperCase()
              ? giikerutil.log("[qiyicube] mac matched")
              : (giikerutil.log("[qiyicube] mac updated"),
                (A[k] = e),
                kernel.setProp("giiMacMap", JSON.stringify(A)));
          } else (A = JSON.parse(kernel.getProp("giiMacMap", "{}"))), (w = A[k]), !w && /^QY-QYSC-.-[0-9A-F]{4}$/.exec(k) && (w = "CC:A3:00:00:" + k.slice(10, 12) + ":" + k.slice(12, 14)), (w = prompt("" + GIIKER_REQMACMSG, w || "xx:xx:xx:xx:xx:xx")), /^([0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i.exec(w) ? (w != A[k] && ((A[k] = w), kernel.setProp("giiMacMap", JSON.stringify(A))), (e = w)) : logohint.push(LGHINT_BTINVMAC);
          if ((A = e)) {
            w = [0, 107, 1, 0, 0, 34, 6, 0, 2, 8, 0];
            for (var v = 5; 0 <= v; v--)
              w.push(parseInt(A.slice(3 * v, 3 * v + 2), 16));
            A = N(w);
          } else A = Promise.reject("empty mac");
          return A;
        });
    },
    opservs: ["0000fff0-0000-1000-8000-00805f9b34fb"],
    cics: f,
    getBatteryLevel: function () {
      return Promise.resolve([H, k]);
    },
    clear: C,
  });
});
var GanTimerState = {};
GanTimerState[(GanTimerState.DISCONNECT = 0)] = "DISCONNECT";
GanTimerState[(GanTimerState.GET_SET = 1)] = "GET_SET";
GanTimerState[(GanTimerState.HANDS_OFF = 2)] = "HANDS_OFF";
GanTimerState[(GanTimerState.RUNNING = 3)] = "RUNNING";
GanTimerState[(GanTimerState.STOPPED = 4)] = "STOPPED";
GanTimerState[(GanTimerState.IDLE = 5)] = "IDLE";
GanTimerState[(GanTimerState.HANDS_ON = 6)] = "HANDS_ON";
GanTimerState[(GanTimerState.FINISHED = 7)] = "FINISHED";
var GanTimerDriver = execMain(function () {
  function b(k) {
    k = k.target.value;
    try {
      if (k && 0 != k.byteLength && 254 == k.getUint8(0)) {
        var g = k.getUint16(k.byteLength - 2, !0),
          f = k.buffer.slice(2, k.byteLength - 2),
          a = new DataView(f);
        f = 65535;
        for (var e = 0; e < a.byteLength; ++e) {
          f ^= a.getUint8(e) << 8;
          for (var h = 0; 8 > h; ++h)
            f = 0 < (f & 32768) ? (f << 1) ^ 4129 : f << 1;
        }
        var p = g == (f & 65535);
      } else p = !1;
    } catch (q) {
      p = !1;
    }
    if (p)
      "function" == typeof C &&
        ((p = C),
        (g = { state: k.getUint8(3) }),
        g.state == GanTimerState.STOPPED &&
          ((a = k.getUint8(4)),
          (f = k.getUint8(5)),
          (k = k.getUint16(6, !0)),
          (g.recordedTime = {
            minutes: a,
            seconds: f,
            milliseconds: k,
            asTimestamp: 6e4 * a + 1e3 * f + k,
          })),
        p(g));
    else {
      p = console;
      g = p.log;
      a = [];
      if (k)
        for (f = 0; f < k.byteLength; f++)
          a.push(k.getUint8(f).toString(16).padStart(2, "0"));
      k = a.join(" ");
      g.call(
        p,
        "[GanTimerDriver] Invalid event data received from Timer: " + k
      );
    }
  }
  function N() {
    E().then(function () {
      "function" == typeof C && C({ state: GanTimerState.DISCONNECT });
    });
  }
  function t(k) {
    var g = new AbortController();
    return new Promise(function (f, a) {
      if (k.watchAdvertisements) {
        var e = function (h) {
          DEBUG &&
            console.log(
              "[GanTimerDriver] received advertisement packet from device",
              h
            );
          delete k.stopWaiting;
          k.removeEventListener("advertisementreceived", e);
          g.abort();
          f(k);
        };
        k.stopWaiting = function () {
          DEBUG &&
            console.log(
              "[GanTimerDriver] cancel waiting for device advertisements"
            );
          delete k.stopWaiting;
          k.removeEventListener("advertisementreceived", e);
          g.abort();
        };
        k.addEventListener("advertisementreceived", e);
        k.watchAdvertisements({ signal: g.signal });
        DEBUG &&
          console.log(
            "[GanTimerDriver] start waiting for device advertisement packet"
          );
      } else a("Bluetooth Advertisements API is not supported by this browser");
    });
  }
  function E() {
    n && n.stopWaiting && n.stopWaiting();
    return c
      ? (DEBUG &&
          console.log("[GanTimerDriver] disconnecting from timer device"),
        c.service.device.removeEventListener("gattserverdisconnected", N),
        c.removeEventListener("characteristicvaluechanged", b),
        c
          .stopNotifications()
          .catch($.noop)
          .finally(function () {
            c.service.device.gatt.disconnect();
            c = void 0;
          }))
      : Promise.resolve();
  }
  var n, C, c;
  return {
    connect: function (k) {
      if (!window.navigator.bluetooth)
        return Promise.reject(
          "Bluetooth API is not supported by this browser. Try fresh Chrome version!"
        );
      var g = Promise.resolve(!0);
      window.navigator.bluetooth.getAvailability &&
        (g = window.navigator.bluetooth.getAvailability());
      return g
        .then(function (f) {
          if (!f)
            return Promise.reject(
              "Bluetooth is not available. Ensure HTTPS access, and check bluetooth is enabled on your device"
            );
        })
        .then(function () {
          DEBUG &&
            console.log(
              "[GanTimerDriver] requesting for bluetooth device, reconnect = " +
                !!k
            );
          return n && k
            ? t(n)
            : navigator.bluetooth.requestDevice({
                filters: [
                  { namePrefix: "GAN" },
                  { namePrefix: "gan" },
                  { namePrefix: "Gan" },
                ],
                optionalServices: ["0000fff0-0000-1000-8000-00805f9b34fb"],
              });
        })
        .then(function (f) {
          DEBUG && console.log("[GanTimerDriver] connecting to GATT server");
          n = f;
          f.addEventListener("gattserverdisconnected", N);
          return f.gatt.connect();
        })
        .then(function (f) {
          DEBUG &&
            console.log("[GanTimerDriver] getting timer primary service");
          return f.getPrimaryService("0000fff0-0000-1000-8000-00805f9b34fb");
        })
        .then(function (f) {
          DEBUG &&
            console.log("[GanTimerDriver] getting timer state characteristic");
          return f.getCharacteristic("0000fff5-0000-1000-8000-00805f9b34fb");
        })
        .then(function (f) {
          DEBUG &&
            console.log(
              "[GanTimerDriver] start listening to state characteristic value updates"
            );
          c = f;
          c.addEventListener("characteristicvaluechanged", b);
          c.startNotifications();
        });
    },
    isConnected: function () {
      return !!c;
    },
    disconnect: E,
    setStateUpdateCallback: function (k) {
      C = k;
    },
  };
});
var csTimerWorker = execBoth(
  ISCSTIMER &&
    function () {
      if (!window.Worker) return {};
      var b = new Worker("js/cstimer.js"),
        N = {},
        t = 0;
      b.onmessage = function (E) {
        E = E.data;
        var n = N[E[0]];
        delete N[E[0]];
        n && n(E[2]);
      };
      b.postMessage([0, "set", ["SCRAMBLE_NOOBST", SCRAMBLE_NOOBST]]);
      b.postMessage([0, "set", ["SCRAMBLE_NOOBSS", SCRAMBLE_NOOBSS]]);
      return {
        getScramble: function (E, n) {
          ++t;
          N[t] = n;
          b.postMessage([t, "scramble", E]);
          return t;
        },
      };
    },
  function () {
    self.kernel = {
      getProp: function (E, n) {
        return void 0 == self[E] ? n : self[E];
      },
      setProp: function (E, n) {
        self[E] = n;
      },
    };
    var b = {
        colcube: "#ff0#fa0#00f#fff#f00#0d0",
        colpyr: "#0f0#f00#00f#ff0",
        colskb: "#fff#00f#f00#ff0#0f0#f80",
        colmgm: "#fff#d00#060#81f#fc0#00b#ffb#8df#f83#7e0#f9f#999",
        colsq1: "#ff0#f80#0f0#fff#f00#00f",
        colclk: "#f00#37b#5cf#ff0#850",
        col15p: "#f99#9f9#99f#fff",
        colfto: "#fff#808#0d0#f00#00f#bbb#ff0#fa0",
        colico:
          "#fff#084#b36#a85#088#811#e71#b9b#05a#ed1#888#6a3#e8b#a52#6cb#c10#fa0#536#49c#ec9",
      },
      N;
    for (N in b) self.kernel.setProp(N, b[N]);
    var t = {
      getScrambleTypes: function () {
        var E = [],
          n;
        for (n in scrMgr.scramblers) E.push(n);
        return E;
      },
      getScramble: function () {
        var E = scrMgr.scramblers[arguments[0]];
        E = E.apply(E, arguments);
        ISCSTIMER || (E = scrMgr.toTxt(E));
        return E;
      },
      setSeed: function (E) {
        mathlib.setSeed(256, E.toString());
      },
      setGlobal: function (E, n) {
        self.kernel.setProp(E, n);
      },
      getImage: function (E, n) {
        return (E = image.draw([n || "333", E])) && E.render();
      },
    };
    self.onmessage = function (E) {
      var n = E.data;
      E = n[0];
      var C = n[1];
      n = n[2];
      var c = void 0;
      switch (C) {
        case "scrtype":
          c = t.getScrambleTypes();
          break;
        case "scramble":
          c = t.getScramble.apply(null, n);
          break;
        case "seed":
          t.setSeed(n[0]);
          break;
        case "image":
          c = t.getImage.apply(null, n);
          break;
        case "set":
          t.setGlobal.apply(null, n);
      }
      postMessage([E, C, c]);
    };
    "undefined" !== typeof module &&
      "undefined" !== typeof module.exports &&
      (module.exports = t);
  }
);
