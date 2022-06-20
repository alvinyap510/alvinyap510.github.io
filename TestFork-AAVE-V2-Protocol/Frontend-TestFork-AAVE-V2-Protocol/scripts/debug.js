!(function (a) {
  if ("object" == typeof exports && "undefined" != typeof module)
    module.exports = a();
  else if ("function" == typeof define && define.amd) define([], a);
  else {
    var b;
    (b =
      "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : this),
      (b.ethers = a());
  }
})(function () {
  var a;
  return (function () {
    function a(b, c, d) {
      function e(g, h) {
        if (!c[g]) {
          if (!b[g]) {
            var i = "function" == typeof require && require;
            if (!h && i) return i(g, !0);
            if (f) return f(g, !0);
            var j = new Error("Cannot find module '" + g + "'");
            throw ((j.code = "MODULE_NOT_FOUND"), j);
          }
          var k = (c[g] = { exports: {} });
          b[g][0].call(
            k.exports,
            function (a) {
              var c = b[g][1][a];
              return e(c ? c : a);
            },
            k,
            k.exports,
            a,
            b,
            c,
            d
          );
        }
        return c[g].exports;
      }
      for (
        var f = "function" == typeof require && require, g = 0;
        g < d.length;
        g++
      )
        e(d[g]);
      return e;
    }
    return a;
  })()(
    {
      1: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            var b = {};
            for (var c in a) b[c] = a[c];
            return b;
          }
          function e(a, b, c) {
            function j(c, e) {
              return function () {
                var f = {},
                  j = Array.prototype.slice.call(arguments);
                if (
                  j.length === c.inputs.types.length + 1 &&
                  "object" == typeof j[j.length - 1]
                ) {
                  f = d(j.pop());
                  for (var m in f)
                    if (!i[m])
                      throw new Error("unknown transaction override " + m);
                }
                ["data", "to"].forEach(function (a) {
                  if (null != f[a]) throw new Error("cannot override " + a);
                });
                var n = c.apply(b, j);
                switch (((f.to = a), (f.data = n.data), n.type)) {
                  case "call":
                    if (e) return Promise.resolve(new g.bigNumberify(0));
                    ["gasLimit", "gasPrice", "value"].forEach(function (a) {
                      if (null != f[a])
                        throw new Error("call cannot override " + a);
                    });
                    var o = null;
                    return (
                      null == f.from && k && k.getAddress
                        ? ((o = k.getAddress()),
                          o instanceof Promise || (o = Promise.resolve(o)))
                        : (o = Promise.resolve(null)),
                      o
                        .then(function (a) {
                          return a && (f.from = g.getAddress(a)), l.call(f);
                        })
                        .then(function (b) {
                          try {
                            var d = n.parse(b);
                          } catch (e) {
                            throw (
                              ("0x" === b &&
                                c.outputs.types.length > 0 &&
                                h.throwError(
                                  "call exception",
                                  h.CALL_EXCEPTION,
                                  { address: a, method: n.signature, value: j }
                                ),
                              e)
                            );
                          }
                          return 1 === c.outputs.types.length && (d = d[0]), d;
                        })
                    );
                  case "transaction":
                    if (!k) return Promise.reject(new Error("missing signer"));
                    if (null != f.from)
                      throw new Error("transaction cannot override from");
                    if (e)
                      return k && k.estimateGas
                        ? k.estimateGas(f)
                        : l.estimateGas(f);
                    if (k.sendTransaction) return k.sendTransaction(f);
                    if (!k.sign)
                      return Promise.reject(
                        new Error("custom signer does not support signing")
                      );
                    null == f.gasLimit &&
                      (f.gasLimit = k.defaultGasLimit || 2e6);
                    var p = null;
                    if (f.nonce) p = Promise.resolve(f.nonce);
                    else if (k.getTransactionCount)
                      (p = k.getTransactionCount()),
                        p instanceof Promise || (p = Promise.resolve(p));
                    else {
                      var q = k.getAddress();
                      q instanceof Promise || (q = Promise.resolve(q)),
                        (p = q.then(function (a) {
                          return l.getTransactionCount(a, "pending");
                        }));
                    }
                    var r = null;
                    return (
                      (r = f.gasPrice
                        ? Promise.resolve(f.gasPrice)
                        : l.getGasPrice()),
                      Promise.all([p, r])
                        .then(function (a) {
                          return (
                            (f.nonce = a[0]), (f.gasPrice = a[1]), k.sign(f)
                          );
                        })
                        .then(function (a) {
                          return l.sendTransaction(a);
                        })
                    );
                }
              };
            }
            if (!(this instanceof e)) throw new Error("missing new");
            if ((b instanceof f || (b = new f(b)), !c))
              throw new Error("missing signer or provider");
            var k = c,
              l = null;
            c.provider ? (l = c.provider) : ((l = c), (k = null)),
              g.defineProperty(this, "address", a),
              g.defineProperty(this, "interface", b),
              g.defineProperty(this, "signer", k),
              g.defineProperty(this, "provider", l);
            var m = l.resolveName(a),
              n = {};
            g.defineProperty(this, "estimate", n);
            var o = {};
            g.defineProperty(this, "functions", o);
            var p = {};
            g.defineProperty(this, "events", p),
              Object.keys(b.functions).forEach(function (a) {
                var c = b.functions[a],
                  d = j(c, !1);
                null == this[a]
                  ? g.defineProperty(this, a, d)
                  : console.log("WARNING: Multiple definitions for " + c),
                  null == o[c] &&
                    (g.defineProperty(o, a, d),
                    g.defineProperty(n, a, j(c, !0)));
              }, this),
              Object.keys(b.events).forEach(function (a) {
                function c(b) {
                  m.then(function (f) {
                    if (f == b.address)
                      try {
                        var g = d.parse(b.topics, b.data);
                        (b.args = g),
                          (b.event = a),
                          (b.parse = d.parse),
                          (b.removeListener = function () {
                            l.removeListener(d.topics, c);
                          }),
                          (b.getBlock = function () {
                            return l.getBlock(b.blockHash);
                          }),
                          (b.getTransaction = function () {
                            return l.getTransaction(b.transactionHash);
                          }),
                          (b.getTransactionReceipt = function () {
                            return l.getTransactionReceipt(b.transactionHash);
                          }),
                          (b.eventSignature = d.signature),
                          e.apply(b, Array.prototype.slice.call(g));
                      } catch (h) {
                        console.log(h);
                      }
                  });
                }
                var d = b.events[a],
                  e = null,
                  f = {
                    enumerable: !0,
                    get: function () {
                      return e;
                    },
                    set: function (a) {
                      a || (a = null),
                        !a && e
                          ? l.removeListener(d.topics, c)
                          : a && !e && l.on(d.topics, c),
                        (e = a);
                    },
                  },
                  g = "on" + a.toLowerCase();
                null == this[g] && Object.defineProperty(this, g, f),
                  Object.defineProperty(p, a, f);
              }, this);
          }
          var f = a("./interface.js"),
            g = (function () {
              return {
                defineProperty: a("../utils/properties.js").defineProperty,
                getAddress: a("../utils/address.js").getAddress,
                bigNumberify: a("../utils/bignumber.js").bigNumberify,
                hexlify: a("../utils/convert.js").hexlify,
              };
            })(),
            h = a("../utils/errors"),
            i = {
              data: !0,
              from: !0,
              gasLimit: !0,
              gasPrice: !0,
              nonce: !0,
              to: !0,
              value: !0,
            };
          g.defineProperty(e.prototype, "connect", function (a) {
            return new e(this.address, this["interface"], a);
          }),
            g.defineProperty(e, "getDeployTransaction", function (a, b) {
              b instanceof f || (b = new f(b));
              var c = Array.prototype.slice.call(arguments);
              return (
                c.splice(1, 1), { data: b.deployFunction.apply(b, c).bytecode }
              );
            }),
            (b.exports = e);
        },
        {
          "../utils/address.js": 56,
          "../utils/bignumber.js": 57,
          "../utils/convert.js": 61,
          "../utils/errors": 63,
          "../utils/properties.js": 70,
          "./interface.js": 3,
        },
      ],
      2: [
        function (a, b, c) {
          "use strict";
          var d = a("./contract.js"),
            e = a("./interface.js");
          b.exports = { Contract: d, Interface: e };
        },
        { "./contract.js": 1, "./interface.js": 3 },
      ],
      3: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            var b = [],
              c = [];
            return (
              a.forEach(function (a) {
                if (null != a.components) {
                  if ("tuple" !== a.type.substring(0, 5))
                    throw new Error("internal error; report on GitHub");
                  var e = "",
                    f = a.type.indexOf("[");
                  f >= 0 && (e = a.type.substring(f));
                  var g = d(a.components);
                  b.push({ name: a.name || null, names: g.names }),
                    c.push("tuple(" + g.types.join(",") + ")" + e);
                } else b.push(a.name || null), c.push(a.type);
              }),
              { names: b, types: c }
            );
          }
          function e(a, b) {
            for (var c in b) l.defineProperty(a, c, b[c]);
            return a;
          }
          function f() {}
          function g() {}
          function h() {}
          function i(a) {
            l.defineProperty(this, "indexed", !0),
              l.defineProperty(this, "hash", a);
          }
          function j() {}
          function k(a) {
            function b(a) {
              switch (a.type) {
                case "constructor":
                  var b = (function () {
                    var b = d(a.inputs),
                      c = function (c) {
                        l.isHexString(c) ||
                          m.throwError(
                            "invalid contract bytecode",
                            m.INVALID_ARGUMENT,
                            { arg: "bytecode", type: typeof c, value: c }
                          );
                        var d = Array.prototype.slice.call(arguments, 1);
                        d.length < b.types.length
                          ? m.throwError(
                              "missing constructor argument",
                              m.MISSING_ARGUMENT,
                              {
                                arg: b.names[d.length] || "unknown",
                                count: d.length,
                                expectedCount: b.types.length,
                              }
                            )
                          : d.length > b.types.length &&
                            m.throwError(
                              "too many constructor arguments",
                              m.UNEXPECTED_ARGUMENT,
                              { count: d.length, expectedCount: b.types.length }
                            );
                        try {
                          var g = l.coder.encode(a.inputs, d);
                        } catch (h) {
                          m.throwError(
                            "invalid constructor argument",
                            m.INVALID_ARGUMENT,
                            { arg: h.arg, reason: h.reason, value: h.value }
                          );
                        }
                        var i = {
                          bytecode: c + g.substring(2),
                          type: "deploy",
                        };
                        return e(new f(), i);
                      };
                    return (
                      l.defineFrozen(c, "inputs", b),
                      l.defineProperty(
                        c,
                        "payable",
                        null == a.payable || !!a.payable
                      ),
                      c
                    );
                  })();
                  q || (q = b);
                  break;
                case "function":
                  var b = (function () {
                    var b = d(a.inputs),
                      c = d(a.outputs),
                      f = "(" + b.types.join(",") + ")";
                    (f = f.replace(/tuple/g, "")), (f = a.name + f);
                    var h = function (b) {
                        try {
                          return l.coder.decode(a.outputs, l.arrayify(b));
                        } catch (c) {
                          m.throwError(
                            "invalid data for function output",
                            m.INVALID_ARGUMENT,
                            {
                              arg: "data",
                              errorArg: c.arg,
                              errorValue: c.value,
                              value: b,
                              reason: c.reason,
                            }
                          );
                        }
                      },
                      i = l.keccak256(l.toUtf8Bytes(f)).substring(0, 10),
                      j = function () {
                        var c = {
                            name: a.name,
                            signature: f,
                            sighash: i,
                            type: a.constant ? "call" : "transaction",
                          },
                          d = Array.prototype.slice.call(arguments, 0);
                        d.length < b.types.length
                          ? m.throwError(
                              "missing input argument",
                              m.MISSING_ARGUMENT,
                              {
                                arg: b.names[d.length] || "unknown",
                                count: d.length,
                                expectedCount: b.types.length,
                                name: a.name,
                              }
                            )
                          : d.length > b.types.length &&
                            m.throwError(
                              "too many input arguments",
                              m.UNEXPECTED_ARGUMENT,
                              { count: d.length, expectedCount: b.types.length }
                            );
                        try {
                          var j = l.coder.encode(a.inputs, d);
                        } catch (k) {
                          m.throwError(
                            "invalid input argument",
                            m.INVALID_ARGUMENT,
                            { arg: k.arg, reason: k.reason, value: k.value }
                          );
                        }
                        return (
                          (c.data = i + j.substring(2)),
                          (c.parse = h),
                          e(new g(), c)
                        );
                      };
                    return (
                      l.defineFrozen(j, "inputs", b),
                      l.defineFrozen(j, "outputs", c),
                      l.defineProperty(
                        j,
                        "payable",
                        null == a.payable || !!a.payable
                      ),
                      l.defineProperty(j, "parseResult", h),
                      l.defineProperty(j, "signature", f),
                      l.defineProperty(j, "sighash", i),
                      j
                    );
                  })();
                  a.name && null == o[a.name] && l.defineProperty(o, a.name, b),
                    null == o[b.signature] &&
                      l.defineProperty(o, b.signature, b);
                  break;
                case "event":
                  var b = (function () {
                    var b = d(a.inputs),
                      c = "(" + b.types.join(",") + ")";
                    (c = c.replace(/tuple/g, "")), (c = a.name + c);
                    var f = {
                      anonymous: !!a.anonymous,
                      name: a.name,
                      signature: c,
                      type: "event",
                    };
                    f.parse = function (b, c) {
                      null == c && ((c = b), (b = null)),
                        null == b || a.anonymous || (b = b.slice(1));
                      var d = [],
                        e = [],
                        f = [];
                      if (
                        (a.inputs.forEach(function (a, b) {
                          a.indexed
                            ? "string" === a.type ||
                              "bytes" === a.type ||
                              a.type.indexOf("[") >= 0 ||
                              "tuple" === a.type.substring(0, 5)
                              ? (d.push({
                                  type: "bytes32",
                                  name: a.name || "",
                                }),
                                f.push(!0))
                              : (d.push(a), f.push(!1))
                            : (e.push(a), f.push(!1));
                        }),
                        null != b)
                      )
                        var g = l.coder.decode(d, l.concat(b));
                      var h = l.coder.decode(e, l.arrayify(c)),
                        k = new j(),
                        m = 0,
                        n = 0;
                      return (
                        a.inputs.forEach(function (a, c) {
                          a.indexed
                            ? null == b
                              ? (k[c] = new i(null))
                              : f[c]
                              ? (k[c] = new i(g[n++]))
                              : (k[c] = g[n++])
                            : (k[c] = h[m++]),
                            a.name && (k[a.name] = k[c]);
                        }),
                        (k.length = a.inputs.length),
                        k
                      );
                    };
                    var g = e(new h(), f);
                    return (
                      l.defineFrozen(g, "topics", [
                        l.keccak256(l.toUtf8Bytes(c)),
                      ]),
                      l.defineFrozen(g, "inputs", b),
                      g
                    );
                  })();
                  a.name && null == p[a.name] && l.defineProperty(p, a.name, b),
                    null == o[b.signature] &&
                      l.defineProperty(o, b.signature, b);
                  break;
                case "fallback":
                  break;
                default:
                  console.log("WARNING: unsupported ABI type - " + a.type);
              }
            }
            if (!(this instanceof k)) throw new Error("missing new");
            if ("string" == typeof a)
              try {
                a = JSON.parse(a);
              } catch (c) {
                m.throwError("could not parse ABI JSON", m.INVALID_ARGUMENT, {
                  arg: "abi",
                  errorMessage: c.message,
                  value: a,
                });
              }
            var n = [];
            a.forEach(function (a) {
              "string" == typeof a && (a = l.parseSignature(a)), n.push(a);
            }),
              l.defineFrozen(this, "abi", n);
            var o = {},
              p = {},
              q = null;
            l.defineProperty(this, "functions", o),
              l.defineProperty(this, "events", p),
              n.forEach(b, this),
              q || b({ type: "constructor", inputs: [] }),
              l.defineProperty(this, "deployFunction", q);
          }
          var l = (function () {
              var b = a("../utils/abi-coder"),
                c = a("../utils/convert"),
                d = a("../utils/properties"),
                e = a("../utils/utf8");
              return {
                defineFrozen: d.defineFrozen,
                defineProperty: d.defineProperty,
                coder: b.defaultCoder,
                parseSignature: b.parseSignature,
                arrayify: c.arrayify,
                concat: c.concat,
                isHexString: c.isHexString,
                toUtf8Bytes: e.toUtf8Bytes,
                keccak256: a("../utils/keccak256"),
              };
            })(),
            m = a("../utils/errors");
          l.defineProperty(k.prototype, "parseTransaction", function (a) {
            var b = a.data.substring(0, 10).toLowerCase();
            for (var c in this.functions)
              if (c.indexOf("(") !== -1) {
                var d = this.functions[c];
                if (d.sighash === b) {
                  var e = l.coder.decode(
                    d.inputs.types,
                    "0x" + a.data.substring(10)
                  );
                  return {
                    args: e,
                    signature: d.signature,
                    sighash: d.sighash,
                    parse: d.parseResult,
                    value: a.value,
                  };
                }
              }
            return null;
          }),
            (b.exports = k);
        },
        {
          "../utils/abi-coder": 55,
          "../utils/convert": 61,
          "../utils/errors": 63,
          "../utils/keccak256": 67,
          "../utils/properties": 70,
          "../utils/utf8": 76,
        },
      ],
      4: [
        function (a, b, c) {
          "use strict";
          var d = a("./package.json").version,
            e = a("./contracts"),
            f = a("./providers"),
            g = a("./utils/errors"),
            h = a("./utils"),
            i = a("./wallet");
          b.exports = {
            Wallet: i.Wallet,
            HDNode: i.HDNode,
            SigningKey: i.SigningKey,
            Contract: e.Contract,
            Interface: e.Interface,
            networks: f.networks,
            providers: f,
            errors: g,
            utils: h,
            version: d,
          };
        },
        {
          "./contracts": 2,
          "./package.json": 45,
          "./providers": 49,
          "./utils": 66,
          "./utils/errors": 63,
          "./wallet": 78,
        },
      ],
      5: [
        function (b, c, d) {
          "use strict";
          !(function (b) {
            function e(a) {
              return parseInt(a) === a;
            }
            function f(a) {
              if (!e(a.length)) return !1;
              for (var b = 0; b < a.length; b++)
                if (!e(a[b]) || a[b] < 0 || a[b] > 255) return !1;
              return !0;
            }
            function g(a, b) {
              if (a.buffer && ArrayBuffer.isView(a) && "Uint8Array" === a.name)
                return (
                  b &&
                    (a = a.slice ? a.slice() : Array.prototype.slice.call(a)),
                  a
                );
              if (Array.isArray(a)) {
                if (!f(a))
                  throw new Error("Array contains invalid value: " + a);
                return new Uint8Array(a);
              }
              if (e(a.length) && f(a)) return new Uint8Array(a);
              throw new Error("unsupported array-like object");
            }
            function h(a) {
              return new Uint8Array(a);
            }
            function i(a, b, c, d, e) {
              (null == d && null == e) ||
                (a = a.slice
                  ? a.slice(d, e)
                  : Array.prototype.slice.call(a, d, e)),
                b.set(a, c);
            }
            function j(a) {
              for (var b = [], c = 0; c < a.length; c += 4)
                b.push(
                  (a[c] << 24) | (a[c + 1] << 16) | (a[c + 2] << 8) | a[c + 3]
                );
              return b;
            }
            function k(a) {
              a = g(a, !0);
              var b = 16 - (a.length % 16),
                c = h(a.length + b);
              i(a, c);
              for (var d = a.length; d < c.length; d++) c[d] = b;
              return c;
            }
            function l(a) {
              if (((a = g(a, !0)), a.length < 16))
                throw new Error("PKCS#7 invalid length");
              var b = a[a.length - 1];
              if (b > 16) throw new Error("PKCS#7 padding byte out of range");
              for (var c = a.length - b, d = 0; d < b; d++)
                if (a[c + d] !== b)
                  throw new Error("PKCS#7 invalid padding byte");
              var e = h(c);
              return i(a, e, 0, 0, c), e;
            }
            var m = (function () {
                function a(a) {
                  var b = [],
                    c = 0;
                  for (a = encodeURI(a); c < a.length; ) {
                    var d = a.charCodeAt(c++);
                    37 === d
                      ? (b.push(parseInt(a.substr(c, 2), 16)), (c += 2))
                      : b.push(d);
                  }
                  return g(b);
                }
                function b(a) {
                  for (var b = [], c = 0; c < a.length; ) {
                    var d = a[c];
                    d < 128
                      ? (b.push(String.fromCharCode(d)), c++)
                      : d > 191 && d < 224
                      ? (b.push(
                          String.fromCharCode(((31 & d) << 6) | (63 & a[c + 1]))
                        ),
                        (c += 2))
                      : (b.push(
                          String.fromCharCode(
                            ((15 & d) << 12) |
                              ((63 & a[c + 1]) << 6) |
                              (63 & a[c + 2])
                          )
                        ),
                        (c += 3));
                  }
                  return b.join("");
                }
                return { toBytes: a, fromBytes: b };
              })(),
              n = (function () {
                function a(a) {
                  for (var b = [], c = 0; c < a.length; c += 2)
                    b.push(parseInt(a.substr(c, 2), 16));
                  return b;
                }
                function b(a) {
                  for (var b = [], d = 0; d < a.length; d++) {
                    var e = a[d];
                    b.push(c[(240 & e) >> 4] + c[15 & e]);
                  }
                  return b.join("");
                }
                var c = "0123456789abcdef";
                return { toBytes: a, fromBytes: b };
              })(),
              o = { 16: 10, 24: 12, 32: 14 },
              p = [
                1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47,
                94, 188, 99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197,
                145,
              ],
              q = [
                99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215,
                171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162,
                175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204,
                52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150,
                5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27,
                110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0,
                237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208,
                239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159,
                168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16,
                255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126,
                61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70,
                238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92,
                194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141,
                213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37,
                46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138,
                112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193,
                29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135,
                233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65,
                153, 45, 15, 176, 84, 187, 22,
              ],
              r = [
                82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243,
                215, 251, 124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68,
                196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76,
                149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178,
                118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100, 134,
                104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112,
                72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132,
                144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179,
                69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1,
                19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207,
                206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133,
                226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26, 113, 29, 41,
                197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75,
                198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31,
                221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236,
                95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147,
                201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235,
                187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38,
                225, 105, 20, 99, 85, 33, 12, 125,
              ],
              s = [
                3328402341, 4168907908, 4000806809, 4135287693, 4294111757,
                3597364157, 3731845041, 2445657428, 1613770832, 33620227,
                3462883241, 1445669757, 3892248089, 3050821474, 1303096294,
                3967186586, 2412431941, 528646813, 2311702848, 4202528135,
                4026202645, 2992200171, 2387036105, 4226871307, 1101901292,
                3017069671, 1604494077, 1169141738, 597466303, 1403299063,
                3832705686, 2613100635, 1974974402, 3791519004, 1033081774,
                1277568618, 1815492186, 2118074177, 4126668546, 2211236943,
                1748251740, 1369810420, 3521504564, 4193382664, 3799085459,
                2883115123, 1647391059, 706024767, 134480908, 2512897874,
                1176707941, 2646852446, 806885416, 932615841, 168101135,
                798661301, 235341577, 605164086, 461406363, 3756188221,
                3454790438, 1311188841, 2142417613, 3933566367, 302582043,
                495158174, 1479289972, 874125870, 907746093, 3698224818,
                3025820398, 1537253627, 2756858614, 1983593293, 3084310113,
                2108928974, 1378429307, 3722699582, 1580150641, 327451799,
                2790478837, 3117535592, 0, 3253595436, 1075847264, 3825007647,
                2041688520, 3059440621, 3563743934, 2378943302, 1740553945,
                1916352843, 2487896798, 2555137236, 2958579944, 2244988746,
                3151024235, 3320835882, 1336584933, 3992714006, 2252555205,
                2588757463, 1714631509, 293963156, 2319795663, 3925473552,
                67240454, 4269768577, 2689618160, 2017213508, 631218106,
                1269344483, 2723238387, 1571005438, 2151694528, 93294474,
                1066570413, 563977660, 1882732616, 4059428100, 1673313503,
                2008463041, 2950355573, 1109467491, 537923632, 3858759450,
                4260623118, 3218264685, 2177748300, 403442708, 638784309,
                3287084079, 3193921505, 899127202, 2286175436, 773265209,
                2479146071, 1437050866, 4236148354, 2050833735, 3362022572,
                3126681063, 840505643, 3866325909, 3227541664, 427917720,
                2655997905, 2749160575, 1143087718, 1412049534, 999329963,
                193497219, 2353415882, 3354324521, 1807268051, 672404540,
                2816401017, 3160301282, 369822493, 2916866934, 3688947771,
                1681011286, 1949973070, 336202270, 2454276571, 201721354,
                1210328172, 3093060836, 2680341085, 3184776046, 1135389935,
                3294782118, 965841320, 831886756, 3554993207, 4068047243,
                3588745010, 2345191491, 1849112409, 3664604599, 26054028,
                2983581028, 2622377682, 1235855840, 3630984372, 2891339514,
                4092916743, 3488279077, 3395642799, 4101667470, 1202630377,
                268961816, 1874508501, 4034427016, 1243948399, 1546530418,
                941366308, 1470539505, 1941222599, 2546386513, 3421038627,
                2715671932, 3899946140, 1042226977, 2521517021, 1639824860,
                227249030, 260737669, 3765465232, 2084453954, 1907733956,
                3429263018, 2420656344, 100860677, 4160157185, 470683154,
                3261161891, 1781871967, 2924959737, 1773779408, 394692241,
                2579611992, 974986535, 664706745, 3655459128, 3958962195,
                731420851, 571543859, 3530123707, 2849626480, 126783113,
                865375399, 765172662, 1008606754, 361203602, 3387549984,
                2278477385, 2857719295, 1344809080, 2782912378, 59542671,
                1503764984, 160008576, 437062935, 1707065306, 3622233649,
                2218934982, 3496503480, 2185314755, 697932208, 1512910199,
                504303377, 2075177163, 2824099068, 1841019862, 739644986,
              ],
              t = [
                2781242211, 2230877308, 2582542199, 2381740923, 234877682,
                3184946027, 2984144751, 1418839493, 1348481072, 50462977,
                2848876391, 2102799147, 434634494, 1656084439, 3863849899,
                2599188086, 1167051466, 2636087938, 1082771913, 2281340285,
                368048890, 3954334041, 3381544775, 201060592, 3963727277,
                1739838676, 4250903202, 3930435503, 3206782108, 4149453988,
                2531553906, 1536934080, 3262494647, 484572669, 2923271059,
                1783375398, 1517041206, 1098792767, 49674231, 1334037708,
                1550332980, 4098991525, 886171109, 150598129, 2481090929,
                1940642008, 1398944049, 1059722517, 201851908, 1385547719,
                1699095331, 1587397571, 674240536, 2704774806, 252314885,
                3039795866, 151914247, 908333586, 2602270848, 1038082786,
                651029483, 1766729511, 3447698098, 2682942837, 454166793,
                2652734339, 1951935532, 775166490, 758520603, 3000790638,
                4004797018, 4217086112, 4137964114, 1299594043, 1639438038,
                3464344499, 2068982057, 1054729187, 1901997871, 2534638724,
                4121318227, 1757008337, 0, 750906861, 1614815264, 535035132,
                3363418545, 3988151131, 3201591914, 1183697867, 3647454910,
                1265776953, 3734260298, 3566750796, 3903871064, 1250283471,
                1807470800, 717615087, 3847203498, 384695291, 3313910595,
                3617213773, 1432761139, 2484176261, 3481945413, 283769337,
                100925954, 2180939647, 4037038160, 1148730428, 3123027871,
                3813386408, 4087501137, 4267549603, 3229630528, 2315620239,
                2906624658, 3156319645, 1215313976, 82966005, 3747855548,
                3245848246, 1974459098, 1665278241, 807407632, 451280895,
                251524083, 1841287890, 1283575245, 337120268, 891687699,
                801369324, 3787349855, 2721421207, 3431482436, 959321879,
                1469301956, 4065699751, 2197585534, 1199193405, 2898814052,
                3887750493, 724703513, 2514908019, 2696962144, 2551808385,
                3516813135, 2141445340, 1715741218, 2119445034, 2872807568,
                2198571144, 3398190662, 700968686, 3547052216, 1009259540,
                2041044702, 3803995742, 487983883, 1991105499, 1004265696,
                1449407026, 1316239930, 504629770, 3683797321, 168560134,
                1816667172, 3837287516, 1570751170, 1857934291, 4014189740,
                2797888098, 2822345105, 2754712981, 936633572, 2347923833,
                852879335, 1133234376, 1500395319, 3084545389, 2348912013,
                1689376213, 3533459022, 3762923945, 3034082412, 4205598294,
                133428468, 634383082, 2949277029, 2398386810, 3913789102,
                403703816, 3580869306, 2297460856, 1867130149, 1918643758,
                607656988, 4049053350, 3346248884, 1368901318, 600565992,
                2090982877, 2632479860, 557719327, 3717614411, 3697393085,
                2249034635, 2232388234, 2430627952, 1115438654, 3295786421,
                2865522278, 3633334344, 84280067, 33027830, 303828494,
                2747425121, 1600795957, 4188952407, 3496589753, 2434238086,
                1486471617, 658119965, 3106381470, 953803233, 334231800,
                3005978776, 857870609, 3151128937, 1890179545, 2298973838,
                2805175444, 3056442267, 574365214, 2450884487, 550103529,
                1233637070, 4289353045, 2018519080, 2057691103, 2399374476,
                4166623649, 2148108681, 387583245, 3664101311, 836232934,
                3330556482, 3100665960, 3280093505, 2955516313, 2002398509,
                287182607, 3413881008, 4238890068, 3597515707, 975967766,
              ],
              u = [
                1671808611, 2089089148, 2006576759, 2072901243, 4061003762,
                1807603307, 1873927791, 3310653893, 810573872, 16974337,
                1739181671, 729634347, 4263110654, 3613570519, 2883997099,
                1989864566, 3393556426, 2191335298, 3376449993, 2106063485,
                4195741690, 1508618841, 1204391495, 4027317232, 2917941677,
                3563566036, 2734514082, 2951366063, 2629772188, 2767672228,
                1922491506, 3227229120, 3082974647, 4246528509, 2477669779,
                644500518, 911895606, 1061256767, 4144166391, 3427763148,
                878471220, 2784252325, 3845444069, 4043897329, 1905517169,
                3631459288, 827548209, 356461077, 67897348, 3344078279,
                593839651, 3277757891, 405286936, 2527147926, 84871685,
                2595565466, 118033927, 305538066, 2157648768, 3795705826,
                3945188843, 661212711, 2999812018, 1973414517, 152769033,
                2208177539, 745822252, 439235610, 455947803, 1857215598,
                1525593178, 2700827552, 1391895634, 994932283, 3596728278,
                3016654259, 695947817, 3812548067, 795958831, 2224493444,
                1408607827, 3513301457, 0, 3979133421, 543178784, 4229948412,
                2982705585, 1542305371, 1790891114, 3410398667, 3201918910,
                961245753, 1256100938, 1289001036, 1491644504, 3477767631,
                3496721360, 4012557807, 2867154858, 4212583931, 1137018435,
                1305975373, 861234739, 2241073541, 1171229253, 4178635257,
                33948674, 2139225727, 1357946960, 1011120188, 2679776671,
                2833468328, 1374921297, 2751356323, 1086357568, 2408187279,
                2460827538, 2646352285, 944271416, 4110742005, 3168756668,
                3066132406, 3665145818, 560153121, 271589392, 4279952895,
                4077846003, 3530407890, 3444343245, 202643468, 322250259,
                3962553324, 1608629855, 2543990167, 1154254916, 389623319,
                3294073796, 2817676711, 2122513534, 1028094525, 1689045092,
                1575467613, 422261273, 1939203699, 1621147744, 2174228865,
                1339137615, 3699352540, 577127458, 712922154, 2427141008,
                2290289544, 1187679302, 3995715566, 3100863416, 339486740,
                3732514782, 1591917662, 186455563, 3681988059, 3762019296,
                844522546, 978220090, 169743370, 1239126601, 101321734,
                611076132, 1558493276, 3260915650, 3547250131, 2901361580,
                1655096418, 2443721105, 2510565781, 3828863972, 2039214713,
                3878868455, 3359869896, 928607799, 1840765549, 2374762893,
                3580146133, 1322425422, 2850048425, 1823791212, 1459268694,
                4094161908, 3928346602, 1706019429, 2056189050, 2934523822,
                135794696, 3134549946, 2022240376, 628050469, 779246638,
                472135708, 2800834470, 3032970164, 3327236038, 3894660072,
                3715932637, 1956440180, 522272287, 1272813131, 3185336765,
                2340818315, 2323976074, 1888542832, 1044544574, 3049550261,
                1722469478, 1222152264, 50660867, 4127324150, 236067854,
                1638122081, 895445557, 1475980887, 3117443513, 2257655686,
                3243809217, 489110045, 2662934430, 3778599393, 4162055160,
                2561878936, 288563729, 1773916777, 3648039385, 2391345038,
                2493985684, 2612407707, 505560094, 2274497927, 3911240169,
                3460925390, 1442818645, 678973480, 3749357023, 2358182796,
                2717407649, 2306869641, 219617805, 3218761151, 3862026214,
                1120306242, 1756942440, 1103331905, 2578459033, 762796589,
                252780047, 2966125488, 1425844308, 3151392187, 372911126,
              ],
              v = [
                1667474886, 2088535288, 2004326894, 2071694838, 4075949567,
                1802223062, 1869591006, 3318043793, 808472672, 16843522,
                1734846926, 724270422, 4278065639, 3621216949, 2880169549,
                1987484396, 3402253711, 2189597983, 3385409673, 2105378810,
                4210693615, 1499065266, 1195886990, 4042263547, 2913856577,
                3570689971, 2728590687, 2947541573, 2627518243, 2762274643,
                1920112356, 3233831835, 3082273397, 4261223649, 2475929149,
                640051788, 909531756, 1061110142, 4160160501, 3435941763,
                875846760, 2779116625, 3857003729, 4059105529, 1903268834,
                3638064043, 825316194, 353713962, 67374088, 3351728789,
                589522246, 3284360861, 404236336, 2526454071, 84217610,
                2593830191, 117901582, 303183396, 2155911963, 3806477791,
                3958056653, 656894286, 2998062463, 1970642922, 151591698,
                2206440989, 741110872, 437923380, 454765878, 1852748508,
                1515908788, 2694904667, 1381168804, 993742198, 3604373943,
                3014905469, 690584402, 3823320797, 791638366, 2223281939,
                1398011302, 3520161977, 0, 3991743681, 538992704, 4244381667,
                2981218425, 1532751286, 1785380564, 3419096717, 3200178535,
                960056178, 1246420628, 1280103576, 1482221744, 3486468741,
                3503319995, 4025428677, 2863326543, 4227536621, 1128514950,
                1296947098, 859002214, 2240123921, 1162203018, 4193849577,
                33687044, 2139062782, 1347481760, 1010582648, 2678045221,
                2829640523, 1364325282, 2745433693, 1077985408, 2408548869,
                2459086143, 2644360225, 943212656, 4126475505, 3166494563,
                3065430391, 3671750063, 555836226, 269496352, 4294908645,
                4092792573, 3537006015, 3452783745, 202118168, 320025894,
                3974901699, 1600119230, 2543297077, 1145359496, 387397934,
                3301201811, 2812801621, 2122220284, 1027426170, 1684319432,
                1566435258, 421079858, 1936954854, 1616945344, 2172753945,
                1330631070, 3705438115, 572679748, 707427924, 2425400123,
                2290647819, 1179044492, 4008585671, 3099120491, 336870440,
                3739122087, 1583276732, 185277718, 3688593069, 3772791771,
                842159716, 976899700, 168435220, 1229577106, 101059084,
                606366792, 1549591736, 3267517855, 3553849021, 2897014595,
                1650632388, 2442242105, 2509612081, 3840161747, 2038008818,
                3890688725, 3368567691, 926374254, 1835907034, 2374863873,
                3587531953, 1313788572, 2846482505, 1819063512, 1448540844,
                4109633523, 3941213647, 1701162954, 2054852340, 2930698567,
                134748176, 3132806511, 2021165296, 623210314, 774795868,
                471606328, 2795958615, 3031746419, 3334885783, 3907527627,
                3722280097, 1953799400, 522133822, 1263263126, 3183336545,
                2341176845, 2324333839, 1886425312, 1044267644, 3048588401,
                1718004428, 1212733584, 50529542, 4143317495, 235803164,
                1633788866, 892690282, 1465383342, 3115962473, 2256965911,
                3250673817, 488449850, 2661202215, 3789633753, 4177007595,
                2560144171, 286339874, 1768537042, 3654906025, 2391705863,
                2492770099, 2610673197, 505291324, 2273808917, 3924369609,
                3469625735, 1431699370, 673740880, 3755965093, 2358021891,
                2711746649, 2307489801, 218961690, 3217021541, 3873845719,
                1111672452, 1751693520, 1094828930, 2576986153, 757954394,
                252645662, 2964376443, 1414855848, 3149649517, 370555436,
              ],
              w = [
                1374988112, 2118214995, 437757123, 975658646, 1001089995,
                530400753, 2902087851, 1273168787, 540080725, 2910219766,
                2295101073, 4110568485, 1340463100, 3307916247, 641025152,
                3043140495, 3736164937, 632953703, 1172967064, 1576976609,
                3274667266, 2169303058, 2370213795, 1809054150, 59727847,
                361929877, 3211623147, 2505202138, 3569255213, 1484005843,
                1239443753, 2395588676, 1975683434, 4102977912, 2572697195,
                666464733, 3202437046, 4035489047, 3374361702, 2110667444,
                1675577880, 3843699074, 2538681184, 1649639237, 2976151520,
                3144396420, 4269907996, 4178062228, 1883793496, 2403728665,
                2497604743, 1383856311, 2876494627, 1917518562, 3810496343,
                1716890410, 3001755655, 800440835, 2261089178, 3543599269,
                807962610, 599762354, 33778362, 3977675356, 2328828971,
                2809771154, 4077384432, 1315562145, 1708848333, 101039829,
                3509871135, 3299278474, 875451293, 2733856160, 92987698,
                2767645557, 193195065, 1080094634, 1584504582, 3178106961,
                1042385657, 2531067453, 3711829422, 1306967366, 2438237621,
                1908694277, 67556463, 1615861247, 429456164, 3602770327,
                2302690252, 1742315127, 2968011453, 126454664, 3877198648,
                2043211483, 2709260871, 2084704233, 4169408201, 0, 159417987,
                841739592, 504459436, 1817866830, 4245618683, 260388950,
                1034867998, 908933415, 168810852, 1750902305, 2606453969,
                607530554, 202008497, 2472011535, 3035535058, 463180190,
                2160117071, 1641816226, 1517767529, 470948374, 3801332234,
                3231722213, 1008918595, 303765277, 235474187, 4069246893,
                766945465, 337553864, 1475418501, 2943682380, 4003061179,
                2743034109, 4144047775, 1551037884, 1147550661, 1543208500,
                2336434550, 3408119516, 3069049960, 3102011747, 3610369226,
                1113818384, 328671808, 2227573024, 2236228733, 3535486456,
                2935566865, 3341394285, 496906059, 3702665459, 226906860,
                2009195472, 733156972, 2842737049, 294930682, 1206477858,
                2835123396, 2700099354, 1451044056, 573804783, 2269728455,
                3644379585, 2362090238, 2564033334, 2801107407, 2776292904,
                3669462566, 1068351396, 742039012, 1350078989, 1784663195,
                1417561698, 4136440770, 2430122216, 775550814, 2193862645,
                2673705150, 1775276924, 1876241833, 3475313331, 3366754619,
                270040487, 3902563182, 3678124923, 3441850377, 1851332852,
                3969562369, 2203032232, 3868552805, 2868897406, 566021896,
                4011190502, 3135740889, 1248802510, 3936291284, 699432150,
                832877231, 708780849, 3332740144, 899835584, 1951317047,
                4236429990, 3767586992, 866637845, 4043610186, 1106041591,
                2144161806, 395441711, 1984812685, 1139781709, 3433712980,
                3835036895, 2664543715, 1282050075, 3240894392, 1181045119,
                2640243204, 25965917, 4203181171, 4211818798, 3009879386,
                2463879762, 3910161971, 1842759443, 2597806476, 933301370,
                1509430414, 3943906441, 3467192302, 3076639029, 3776767469,
                2051518780, 2631065433, 1441952575, 404016761, 1942435775,
                1408749034, 1610459739, 3745345300, 2017778566, 3400528769,
                3110650942, 941896748, 3265478751, 371049330, 3168937228,
                675039627, 4279080257, 967311729, 135050206, 3635733660,
                1683407248, 2076935265, 3576870512, 1215061108, 3501741890,
              ],
              x = [
                1347548327, 1400783205, 3273267108, 2520393566, 3409685355,
                4045380933, 2880240216, 2471224067, 1428173050, 4138563181,
                2441661558, 636813900, 4233094615, 3620022987, 2149987652,
                2411029155, 1239331162, 1730525723, 2554718734, 3781033664,
                46346101, 310463728, 2743944855, 3328955385, 3875770207,
                2501218972, 3955191162, 3667219033, 768917123, 3545789473,
                692707433, 1150208456, 1786102409, 2029293177, 1805211710,
                3710368113, 3065962831, 401639597, 1724457132, 3028143674,
                409198410, 2196052529, 1620529459, 1164071807, 3769721975,
                2226875310, 486441376, 2499348523, 1483753576, 428819965,
                2274680428, 3075636216, 598438867, 3799141122, 1474502543,
                711349675, 129166120, 53458370, 2592523643, 2782082824,
                4063242375, 2988687269, 3120694122, 1559041666, 730517276,
                2460449204, 4042459122, 2706270690, 3446004468, 3573941694,
                533804130, 2328143614, 2637442643, 2695033685, 839224033,
                1973745387, 957055980, 2856345839, 106852767, 1371368976,
                4181598602, 1033297158, 2933734917, 1179510461, 3046200461,
                91341917, 1862534868, 4284502037, 605657339, 2547432937,
                3431546947, 2003294622, 3182487618, 2282195339, 954669403,
                3682191598, 1201765386, 3917234703, 3388507166, 0, 2198438022,
                1211247597, 2887651696, 1315723890, 4227665663, 1443857720,
                507358933, 657861945, 1678381017, 560487590, 3516619604,
                975451694, 2970356327, 261314535, 3535072918, 2652609425,
                1333838021, 2724322336, 1767536459, 370938394, 182621114,
                3854606378, 1128014560, 487725847, 185469197, 2918353863,
                3106780840, 3356761769, 2237133081, 1286567175, 3152976349,
                4255350624, 2683765030, 3160175349, 3309594171, 878443390,
                1988838185, 3704300486, 1756818940, 1673061617, 3403100636,
                272786309, 1075025698, 545572369, 2105887268, 4174560061,
                296679730, 1841768865, 1260232239, 4091327024, 3960309330,
                3497509347, 1814803222, 2578018489, 4195456072, 575138148,
                3299409036, 446754879, 3629546796, 4011996048, 3347532110,
                3252238545, 4270639778, 915985419, 3483825537, 681933534,
                651868046, 2755636671, 3828103837, 223377554, 2607439820,
                1649704518, 3270937875, 3901806776, 1580087799, 4118987695,
                3198115200, 2087309459, 2842678573, 3016697106, 1003007129,
                2802849917, 1860738147, 2077965243, 164439672, 4100872472,
                32283319, 2827177882, 1709610350, 2125135846, 136428751,
                3874428392, 3652904859, 3460984630, 3572145929, 3593056380,
                2939266226, 824852259, 818324884, 3224740454, 930369212,
                2801566410, 2967507152, 355706840, 1257309336, 4148292826,
                243256656, 790073846, 2373340630, 1296297904, 1422699085,
                3756299780, 3818836405, 457992840, 3099667487, 2135319889,
                77422314, 1560382517, 1945798516, 788204353, 1521706781,
                1385356242, 870912086, 325965383, 2358957921, 2050466060,
                2388260884, 2313884476, 4006521127, 901210569, 3990953189,
                1014646705, 1503449823, 1062597235, 2031621326, 3212035895,
                3931371469, 1533017514, 350174575, 2256028891, 2177544179,
                1052338372, 741876788, 1606591296, 1914052035, 213705253,
                2334669897, 1107234197, 1899603969, 3725069491, 2631447780,
                2422494913, 1635502980, 1893020342, 1950903388, 1120974935,
              ],
              y = [
                2807058932, 1699970625, 2764249623, 1586903591, 1808481195,
                1173430173, 1487645946, 59984867, 4199882800, 1844882806,
                1989249228, 1277555970, 3623636965, 3419915562, 1149249077,
                2744104290, 1514790577, 459744698, 244860394, 3235995134,
                1963115311, 4027744588, 2544078150, 4190530515, 1608975247,
                2627016082, 2062270317, 1507497298, 2200818878, 567498868,
                1764313568, 3359936201, 2305455554, 2037970062, 1047239e3,
                1910319033, 1337376481, 2904027272, 2892417312, 984907214,
                1243112415, 830661914, 861968209, 2135253587, 2011214180,
                2927934315, 2686254721, 731183368, 1750626376, 4246310725,
                1820824798, 4172763771, 3542330227, 48394827, 2404901663,
                2871682645, 671593195, 3254988725, 2073724613, 145085239,
                2280796200, 2779915199, 1790575107, 2187128086, 472615631,
                3029510009, 4075877127, 3802222185, 4107101658, 3201631749,
                1646252340, 4270507174, 1402811438, 1436590835, 3778151818,
                3950355702, 3963161475, 4020912224, 2667994737, 273792366,
                2331590177, 104699613, 95345982, 3175501286, 2377486676,
                1560637892, 3564045318, 369057872, 4213447064, 3919042237,
                1137477952, 2658625497, 1119727848, 2340947849, 1530455833,
                4007360968, 172466556, 266959938, 516552836, 0, 2256734592,
                3980931627, 1890328081, 1917742170, 4294704398, 945164165,
                3575528878, 958871085, 3647212047, 2787207260, 1423022939,
                775562294, 1739656202, 3876557655, 2530391278, 2443058075,
                3310321856, 547512796, 1265195639, 437656594, 3121275539,
                719700128, 3762502690, 387781147, 218828297, 3350065803,
                2830708150, 2848461854, 428169201, 122466165, 3720081049,
                1627235199, 648017665, 4122762354, 1002783846, 2117360635,
                695634755, 3336358691, 4234721005, 4049844452, 3704280881,
                2232435299, 574624663, 287343814, 612205898, 1039717051,
                840019705, 2708326185, 793451934, 821288114, 1391201670,
                3822090177, 376187827, 3113855344, 1224348052, 1679968233,
                2361698556, 1058709744, 752375421, 2431590963, 1321699145,
                3519142200, 2734591178, 188127444, 2177869557, 3727205754,
                2384911031, 3215212461, 2648976442, 2450346104, 3432737375,
                1180849278, 331544205, 3102249176, 4150144569, 2952102595,
                2159976285, 2474404304, 766078933, 313773861, 2570832044,
                2108100632, 1668212892, 3145456443, 2013908262, 418672217,
                3070356634, 2594734927, 1852171925, 3867060991, 3473416636,
                3907448597, 2614737639, 919489135, 164948639, 2094410160,
                2997825956, 590424639, 2486224549, 1723872674, 3157750862,
                3399941250, 3501252752, 3625268135, 2555048196, 3673637356,
                1343127501, 4130281361, 3599595085, 2957853679, 1297403050,
                81781910, 3051593425, 2283490410, 532201772, 1367295589,
                3926170974, 895287692, 1953757831, 1093597963, 492483431,
                3528626907, 1446242576, 1192455638, 1636604631, 209336225,
                344873464, 1015671571, 669961897, 3375740769, 3857572124,
                2973530695, 3747192018, 1933530610, 3464042516, 935293895,
                3454686199, 2858115069, 1863638845, 3683022916, 4085369519,
                3292445032, 875313188, 1080017571, 3279033885, 621591778,
                1233856572, 2504130317, 24197544, 3017672716, 3835484340,
                3247465558, 2220981195, 3060847922, 1551124588, 1463996600,
              ],
              z = [
                4104605777, 1097159550, 396673818, 660510266, 2875968315,
                2638606623, 4200115116, 3808662347, 821712160, 1986918061,
                3430322568, 38544885, 3856137295, 718002117, 893681702,
                1654886325, 2975484382, 3122358053, 3926825029, 4274053469,
                796197571, 1290801793, 1184342925, 3556361835, 2405426947,
                2459735317, 1836772287, 1381620373, 3196267988, 1948373848,
                3764988233, 3385345166, 3263785589, 2390325492, 1480485785,
                3111247143, 3780097726, 2293045232, 548169417, 3459953789,
                3746175075, 439452389, 1362321559, 1400849762, 1685577905,
                1806599355, 2174754046, 137073913, 1214797936, 1174215055,
                3731654548, 2079897426, 1943217067, 1258480242, 529487843,
                1437280870, 3945269170, 3049390895, 3313212038, 923313619,
                679998e3, 3215307299, 57326082, 377642221, 3474729866,
                2041877159, 133361907, 1776460110, 3673476453, 96392454,
                878845905, 2801699524, 777231668, 4082475170, 2330014213,
                4142626212, 2213296395, 1626319424, 1906247262, 1846563261,
                562755902, 3708173718, 1040559837, 3871163981, 1418573201,
                3294430577, 114585348, 1343618912, 2566595609, 3186202582,
                1078185097, 3651041127, 3896688048, 2307622919, 425408743,
                3371096953, 2081048481, 1108339068, 2216610296, 0, 2156299017,
                736970802, 292596766, 1517440620, 251657213, 2235061775,
                2933202493, 758720310, 265905162, 1554391400, 1532285339,
                908999204, 174567692, 1474760595, 4002861748, 2610011675,
                3234156416, 3693126241, 2001430874, 303699484, 2478443234,
                2687165888, 585122620, 454499602, 151849742, 2345119218,
                3064510765, 514443284, 4044981591, 1963412655, 2581445614,
                2137062819, 19308535, 1928707164, 1715193156, 4219352155,
                1126790795, 600235211, 3992742070, 3841024952, 836553431,
                1669664834, 2535604243, 3323011204, 1243905413, 3141400786,
                4180808110, 698445255, 2653899549, 2989552604, 2253581325,
                3252932727, 3004591147, 1891211689, 2487810577, 3915653703,
                4237083816, 4030667424, 2100090966, 865136418, 1229899655,
                953270745, 3399679628, 3557504664, 4118925222, 2061379749,
                3079546586, 2915017791, 983426092, 2022837584, 1607244650,
                2118541908, 2366882550, 3635996816, 972512814, 3283088770,
                1568718495, 3499326569, 3576539503, 621982671, 2895723464,
                410887952, 2623762152, 1002142683, 645401037, 1494807662,
                2595684844, 1335535747, 2507040230, 4293295786, 3167684641,
                367585007, 3885750714, 1865862730, 2668221674, 2960971305,
                2763173681, 1059270954, 2777952454, 2724642869, 1320957812,
                2194319100, 2429595872, 2815956275, 77089521, 3973773121,
                3444575871, 2448830231, 1305906550, 4021308739, 2857194700,
                2516901860, 3518358430, 1787304780, 740276417, 1699839814,
                1592394909, 2352307457, 2272556026, 188821243, 1729977011,
                3687994002, 274084841, 3594982253, 3613494426, 2701949495,
                4162096729, 322734571, 2837966542, 1640576439, 484830689,
                1202797690, 3537852828, 4067639125, 349075736, 3342319475,
                4157467219, 4255800159, 1030690015, 1155237496, 2951971274,
                1757691577, 607398968, 2738905026, 499347990, 3794078908,
                1011452712, 227885567, 2818666809, 213114376, 3034881240,
                1455525988, 3414450555, 850817237, 1817998408, 3092726480,
              ],
              A = [
                0, 235474187, 470948374, 303765277, 941896748, 908933415,
                607530554, 708780849, 1883793496, 2118214995, 1817866830,
                1649639237, 1215061108, 1181045119, 1417561698, 1517767529,
                3767586992, 4003061179, 4236429990, 4069246893, 3635733660,
                3602770327, 3299278474, 3400528769, 2430122216, 2664543715,
                2362090238, 2193862645, 2835123396, 2801107407, 3035535058,
                3135740889, 3678124923, 3576870512, 3341394285, 3374361702,
                3810496343, 3977675356, 4279080257, 4043610186, 2876494627,
                2776292904, 3076639029, 3110650942, 2472011535, 2640243204,
                2403728665, 2169303058, 1001089995, 899835584, 666464733,
                699432150, 59727847, 226906860, 530400753, 294930682,
                1273168787, 1172967064, 1475418501, 1509430414, 1942435775,
                2110667444, 1876241833, 1641816226, 2910219766, 2743034109,
                2976151520, 3211623147, 2505202138, 2606453969, 2302690252,
                2269728455, 3711829422, 3543599269, 3240894392, 3475313331,
                3843699074, 3943906441, 4178062228, 4144047775, 1306967366,
                1139781709, 1374988112, 1610459739, 1975683434, 2076935265,
                1775276924, 1742315127, 1034867998, 866637845, 566021896,
                800440835, 92987698, 193195065, 429456164, 395441711,
                1984812685, 2017778566, 1784663195, 1683407248, 1315562145,
                1080094634, 1383856311, 1551037884, 101039829, 135050206,
                437757123, 337553864, 1042385657, 807962610, 573804783,
                742039012, 2531067453, 2564033334, 2328828971, 2227573024,
                2935566865, 2700099354, 3001755655, 3168937228, 3868552805,
                3902563182, 4203181171, 4102977912, 3736164937, 3501741890,
                3265478751, 3433712980, 1106041591, 1340463100, 1576976609,
                1408749034, 2043211483, 2009195472, 1708848333, 1809054150,
                832877231, 1068351396, 766945465, 599762354, 159417987,
                126454664, 361929877, 463180190, 2709260871, 2943682380,
                3178106961, 3009879386, 2572697195, 2538681184, 2236228733,
                2336434550, 3509871135, 3745345300, 3441850377, 3274667266,
                3910161971, 3877198648, 4110568485, 4211818798, 2597806476,
                2497604743, 2261089178, 2295101073, 2733856160, 2902087851,
                3202437046, 2968011453, 3936291284, 3835036895, 4136440770,
                4169408201, 3535486456, 3702665459, 3467192302, 3231722213,
                2051518780, 1951317047, 1716890410, 1750902305, 1113818384,
                1282050075, 1584504582, 1350078989, 168810852, 67556463,
                371049330, 404016761, 841739592, 1008918595, 775550814,
                540080725, 3969562369, 3801332234, 4035489047, 4269907996,
                3569255213, 3669462566, 3366754619, 3332740144, 2631065433,
                2463879762, 2160117071, 2395588676, 2767645557, 2868897406,
                3102011747, 3069049960, 202008497, 33778362, 270040487,
                504459436, 875451293, 975658646, 675039627, 641025152,
                2084704233, 1917518562, 1615861247, 1851332852, 1147550661,
                1248802510, 1484005843, 1451044056, 933301370, 967311729,
                733156972, 632953703, 260388950, 25965917, 328671808, 496906059,
                1206477858, 1239443753, 1543208500, 1441952575, 2144161806,
                1908694277, 1675577880, 1842759443, 3610369226, 3644379585,
                3408119516, 3307916247, 4011190502, 3776767469, 4077384432,
                4245618683, 2809771154, 2842737049, 3144396420, 3043140495,
                2673705150, 2438237621, 2203032232, 2370213795,
              ],
              B = [
                0, 185469197, 370938394, 487725847, 741876788, 657861945,
                975451694, 824852259, 1483753576, 1400783205, 1315723890,
                1164071807, 1950903388, 2135319889, 1649704518, 1767536459,
                2967507152, 3152976349, 2801566410, 2918353863, 2631447780,
                2547432937, 2328143614, 2177544179, 3901806776, 3818836405,
                4270639778, 4118987695, 3299409036, 3483825537, 3535072918,
                3652904859, 2077965243, 1893020342, 1841768865, 1724457132,
                1474502543, 1559041666, 1107234197, 1257309336, 598438867,
                681933534, 901210569, 1052338372, 261314535, 77422314,
                428819965, 310463728, 3409685355, 3224740454, 3710368113,
                3593056380, 3875770207, 3960309330, 4045380933, 4195456072,
                2471224067, 2554718734, 2237133081, 2388260884, 3212035895,
                3028143674, 2842678573, 2724322336, 4138563181, 4255350624,
                3769721975, 3955191162, 3667219033, 3516619604, 3431546947,
                3347532110, 2933734917, 2782082824, 3099667487, 3016697106,
                2196052529, 2313884476, 2499348523, 2683765030, 1179510461,
                1296297904, 1347548327, 1533017514, 1786102409, 1635502980,
                2087309459, 2003294622, 507358933, 355706840, 136428751,
                53458370, 839224033, 957055980, 605657339, 790073846,
                2373340630, 2256028891, 2607439820, 2422494913, 2706270690,
                2856345839, 3075636216, 3160175349, 3573941694, 3725069491,
                3273267108, 3356761769, 4181598602, 4063242375, 4011996048,
                3828103837, 1033297158, 915985419, 730517276, 545572369,
                296679730, 446754879, 129166120, 213705253, 1709610350,
                1860738147, 1945798516, 2029293177, 1239331162, 1120974935,
                1606591296, 1422699085, 4148292826, 4233094615, 3781033664,
                3931371469, 3682191598, 3497509347, 3446004468, 3328955385,
                2939266226, 2755636671, 3106780840, 2988687269, 2198438022,
                2282195339, 2501218972, 2652609425, 1201765386, 1286567175,
                1371368976, 1521706781, 1805211710, 1620529459, 2105887268,
                1988838185, 533804130, 350174575, 164439672, 46346101,
                870912086, 954669403, 636813900, 788204353, 2358957921,
                2274680428, 2592523643, 2441661558, 2695033685, 2880240216,
                3065962831, 3182487618, 3572145929, 3756299780, 3270937875,
                3388507166, 4174560061, 4091327024, 4006521127, 3854606378,
                1014646705, 930369212, 711349675, 560487590, 272786309,
                457992840, 106852767, 223377554, 1678381017, 1862534868,
                1914052035, 2031621326, 1211247597, 1128014560, 1580087799,
                1428173050, 32283319, 182621114, 401639597, 486441376,
                768917123, 651868046, 1003007129, 818324884, 1503449823,
                1385356242, 1333838021, 1150208456, 1973745387, 2125135846,
                1673061617, 1756818940, 2970356327, 3120694122, 2802849917,
                2887651696, 2637442643, 2520393566, 2334669897, 2149987652,
                3917234703, 3799141122, 4284502037, 4100872472, 3309594171,
                3460984630, 3545789473, 3629546796, 2050466060, 1899603969,
                1814803222, 1730525723, 1443857720, 1560382517, 1075025698,
                1260232239, 575138148, 692707433, 878443390, 1062597235,
                243256656, 91341917, 409198410, 325965383, 3403100636,
                3252238545, 3704300486, 3620022987, 3874428392, 3990953189,
                4042459122, 4227665663, 2460449204, 2578018489, 2226875310,
                2411029155, 3198115200, 3046200461, 2827177882, 2743944855,
              ],
              C = [
                0, 218828297, 437656594, 387781147, 875313188, 958871085,
                775562294, 590424639, 1750626376, 1699970625, 1917742170,
                2135253587, 1551124588, 1367295589, 1180849278, 1265195639,
                3501252752, 3720081049, 3399941250, 3350065803, 3835484340,
                3919042237, 4270507174, 4085369519, 3102249176, 3051593425,
                2734591178, 2952102595, 2361698556, 2177869557, 2530391278,
                2614737639, 3145456443, 3060847922, 2708326185, 2892417312,
                2404901663, 2187128086, 2504130317, 2555048196, 3542330227,
                3727205754, 3375740769, 3292445032, 3876557655, 3926170974,
                4246310725, 4027744588, 1808481195, 1723872674, 1910319033,
                2094410160, 1608975247, 1391201670, 1173430173, 1224348052,
                59984867, 244860394, 428169201, 344873464, 935293895, 984907214,
                766078933, 547512796, 1844882806, 1627235199, 2011214180,
                2062270317, 1507497298, 1423022939, 1137477952, 1321699145,
                95345982, 145085239, 532201772, 313773861, 830661914,
                1015671571, 731183368, 648017665, 3175501286, 2957853679,
                2807058932, 2858115069, 2305455554, 2220981195, 2474404304,
                2658625497, 3575528878, 3625268135, 3473416636, 3254988725,
                3778151818, 3963161475, 4213447064, 4130281361, 3599595085,
                3683022916, 3432737375, 3247465558, 3802222185, 4020912224,
                4172763771, 4122762354, 3201631749, 3017672716, 2764249623,
                2848461854, 2331590177, 2280796200, 2431590963, 2648976442,
                104699613, 188127444, 472615631, 287343814, 840019705,
                1058709744, 671593195, 621591778, 1852171925, 1668212892,
                1953757831, 2037970062, 1514790577, 1463996600, 1080017571,
                1297403050, 3673637356, 3623636965, 3235995134, 3454686199,
                4007360968, 3822090177, 4107101658, 4190530515, 2997825956,
                3215212461, 2830708150, 2779915199, 2256734592, 2340947849,
                2627016082, 2443058075, 172466556, 122466165, 273792366,
                492483431, 1047239e3, 861968209, 612205898, 695634755,
                1646252340, 1863638845, 2013908262, 1963115311, 1446242576,
                1530455833, 1277555970, 1093597963, 1636604631, 1820824798,
                2073724613, 1989249228, 1436590835, 1487645946, 1337376481,
                1119727848, 164948639, 81781910, 331544205, 516552836,
                1039717051, 821288114, 669961897, 719700128, 2973530695,
                3157750862, 2871682645, 2787207260, 2232435299, 2283490410,
                2667994737, 2450346104, 3647212047, 3564045318, 3279033885,
                3464042516, 3980931627, 3762502690, 4150144569, 4199882800,
                3070356634, 3121275539, 2904027272, 2686254721, 2200818878,
                2384911031, 2570832044, 2486224549, 3747192018, 3528626907,
                3310321856, 3359936201, 3950355702, 3867060991, 4049844452,
                4234721005, 1739656202, 1790575107, 2108100632, 1890328081,
                1402811438, 1586903591, 1233856572, 1149249077, 266959938,
                48394827, 369057872, 418672217, 1002783846, 919489135,
                567498868, 752375421, 209336225, 24197544, 376187827, 459744698,
                945164165, 895287692, 574624663, 793451934, 1679968233,
                1764313568, 2117360635, 1933530610, 1343127501, 1560637892,
                1243112415, 1192455638, 3704280881, 3519142200, 3336358691,
                3419915562, 3907448597, 3857572124, 4075877127, 4294704398,
                3029510009, 3113855344, 2927934315, 2744104290, 2159976285,
                2377486676, 2594734927, 2544078150,
              ],
              D = [
                0, 151849742, 303699484, 454499602, 607398968, 758720310,
                908999204, 1059270954, 1214797936, 1097159550, 1517440620,
                1400849762, 1817998408, 1699839814, 2118541908, 2001430874,
                2429595872, 2581445614, 2194319100, 2345119218, 3034881240,
                3186202582, 2801699524, 2951971274, 3635996816, 3518358430,
                3399679628, 3283088770, 4237083816, 4118925222, 4002861748,
                3885750714, 1002142683, 850817237, 698445255, 548169417,
                529487843, 377642221, 227885567, 77089521, 1943217067,
                2061379749, 1640576439, 1757691577, 1474760595, 1592394909,
                1174215055, 1290801793, 2875968315, 2724642869, 3111247143,
                2960971305, 2405426947, 2253581325, 2638606623, 2487810577,
                3808662347, 3926825029, 4044981591, 4162096729, 3342319475,
                3459953789, 3576539503, 3693126241, 1986918061, 2137062819,
                1685577905, 1836772287, 1381620373, 1532285339, 1078185097,
                1229899655, 1040559837, 923313619, 740276417, 621982671,
                439452389, 322734571, 137073913, 19308535, 3871163981,
                4021308739, 4104605777, 4255800159, 3263785589, 3414450555,
                3499326569, 3651041127, 2933202493, 2815956275, 3167684641,
                3049390895, 2330014213, 2213296395, 2566595609, 2448830231,
                1305906550, 1155237496, 1607244650, 1455525988, 1776460110,
                1626319424, 2079897426, 1928707164, 96392454, 213114376,
                396673818, 514443284, 562755902, 679998e3, 865136418, 983426092,
                3708173718, 3557504664, 3474729866, 3323011204, 4180808110,
                4030667424, 3945269170, 3794078908, 2507040230, 2623762152,
                2272556026, 2390325492, 2975484382, 3092726480, 2738905026,
                2857194700, 3973773121, 3856137295, 4274053469, 4157467219,
                3371096953, 3252932727, 3673476453, 3556361835, 2763173681,
                2915017791, 3064510765, 3215307299, 2156299017, 2307622919,
                2459735317, 2610011675, 2081048481, 1963412655, 1846563261,
                1729977011, 1480485785, 1362321559, 1243905413, 1126790795,
                878845905, 1030690015, 645401037, 796197571, 274084841,
                425408743, 38544885, 188821243, 3613494426, 3731654548,
                3313212038, 3430322568, 4082475170, 4200115116, 3780097726,
                3896688048, 2668221674, 2516901860, 2366882550, 2216610296,
                3141400786, 2989552604, 2837966542, 2687165888, 1202797690,
                1320957812, 1437280870, 1554391400, 1669664834, 1787304780,
                1906247262, 2022837584, 265905162, 114585348, 499347990,
                349075736, 736970802, 585122620, 972512814, 821712160,
                2595684844, 2478443234, 2293045232, 2174754046, 3196267988,
                3079546586, 2895723464, 2777952454, 3537852828, 3687994002,
                3234156416, 3385345166, 4142626212, 4293295786, 3841024952,
                3992742070, 174567692, 57326082, 410887952, 292596766,
                777231668, 660510266, 1011452712, 893681702, 1108339068,
                1258480242, 1343618912, 1494807662, 1715193156, 1865862730,
                1948373848, 2100090966, 2701949495, 2818666809, 3004591147,
                3122358053, 2235061775, 2352307457, 2535604243, 2653899549,
                3915653703, 3764988233, 4219352155, 4067639125, 3444575871,
                3294430577, 3746175075, 3594982253, 836553431, 953270745,
                600235211, 718002117, 367585007, 484830689, 133361907,
                251657213, 2041877159, 1891211689, 1806599355, 1654886325,
                1568718495, 1418573201, 1335535747, 1184342925,
              ],
              E = function (a) {
                if (!(this instanceof E))
                  throw Error("AES must be instanitated with `new`");
                Object.defineProperty(this, "key", { value: g(a, !0) }),
                  this._prepare();
              };
            (E.prototype._prepare = function () {
              var a = o[this.key.length];
              if (null == a)
                throw new Error(
                  "invalid key size (must be 16, 24 or 32 bytes)"
                );
              (this._Ke = []), (this._Kd = []);
              for (var b = 0; b <= a; b++)
                this._Ke.push([0, 0, 0, 0]), this._Kd.push([0, 0, 0, 0]);
              for (
                var c,
                  d = 4 * (a + 1),
                  e = this.key.length / 4,
                  f = j(this.key),
                  b = 0;
                b < e;
                b++
              )
                (c = b >> 2),
                  (this._Ke[c][b % 4] = f[b]),
                  (this._Kd[a - c][b % 4] = f[b]);
              for (var g, h = 0, i = e; i < d; ) {
                if (
                  ((g = f[e - 1]),
                  (f[0] ^=
                    (q[(g >> 16) & 255] << 24) ^
                    (q[(g >> 8) & 255] << 16) ^
                    (q[255 & g] << 8) ^
                    q[(g >> 24) & 255] ^
                    (p[h] << 24)),
                  (h += 1),
                  8 != e)
                )
                  for (var b = 1; b < e; b++) f[b] ^= f[b - 1];
                else {
                  for (var b = 1; b < e / 2; b++) f[b] ^= f[b - 1];
                  (g = f[e / 2 - 1]),
                    (f[e / 2] ^=
                      q[255 & g] ^
                      (q[(g >> 8) & 255] << 8) ^
                      (q[(g >> 16) & 255] << 16) ^
                      (q[(g >> 24) & 255] << 24));
                  for (var b = e / 2 + 1; b < e; b++) f[b] ^= f[b - 1];
                }
                for (var k, l, b = 0; b < e && i < d; )
                  (k = i >> 2),
                    (l = i % 4),
                    (this._Ke[k][l] = f[b]),
                    (this._Kd[a - k][l] = f[b++]),
                    i++;
              }
              for (var k = 1; k < a; k++)
                for (var l = 0; l < 4; l++)
                  (g = this._Kd[k][l]),
                    (this._Kd[k][l] =
                      A[(g >> 24) & 255] ^
                      B[(g >> 16) & 255] ^
                      C[(g >> 8) & 255] ^
                      D[255 & g]);
            }),
              (E.prototype.encrypt = function (a) {
                if (16 != a.length)
                  throw new Error("invalid plaintext size (must be 16 bytes)");
                for (
                  var b = this._Ke.length - 1,
                    c = [0, 0, 0, 0],
                    d = j(a),
                    e = 0;
                  e < 4;
                  e++
                )
                  d[e] ^= this._Ke[0][e];
                for (var f = 1; f < b; f++) {
                  for (var e = 0; e < 4; e++)
                    c[e] =
                      s[(d[e] >> 24) & 255] ^
                      t[(d[(e + 1) % 4] >> 16) & 255] ^
                      u[(d[(e + 2) % 4] >> 8) & 255] ^
                      v[255 & d[(e + 3) % 4]] ^
                      this._Ke[f][e];
                  d = c.slice();
                }
                for (var g, i = h(16), e = 0; e < 4; e++)
                  (g = this._Ke[b][e]),
                    (i[4 * e] = 255 & (q[(d[e] >> 24) & 255] ^ (g >> 24))),
                    (i[4 * e + 1] =
                      255 & (q[(d[(e + 1) % 4] >> 16) & 255] ^ (g >> 16))),
                    (i[4 * e + 2] =
                      255 & (q[(d[(e + 2) % 4] >> 8) & 255] ^ (g >> 8))),
                    (i[4 * e + 3] = 255 & (q[255 & d[(e + 3) % 4]] ^ g));
                return i;
              }),
              (E.prototype.decrypt = function (a) {
                if (16 != a.length)
                  throw new Error("invalid ciphertext size (must be 16 bytes)");
                for (
                  var b = this._Kd.length - 1,
                    c = [0, 0, 0, 0],
                    d = j(a),
                    e = 0;
                  e < 4;
                  e++
                )
                  d[e] ^= this._Kd[0][e];
                for (var f = 1; f < b; f++) {
                  for (var e = 0; e < 4; e++)
                    c[e] =
                      w[(d[e] >> 24) & 255] ^
                      x[(d[(e + 3) % 4] >> 16) & 255] ^
                      y[(d[(e + 2) % 4] >> 8) & 255] ^
                      z[255 & d[(e + 1) % 4]] ^
                      this._Kd[f][e];
                  d = c.slice();
                }
                for (var g, i = h(16), e = 0; e < 4; e++)
                  (g = this._Kd[b][e]),
                    (i[4 * e] = 255 & (r[(d[e] >> 24) & 255] ^ (g >> 24))),
                    (i[4 * e + 1] =
                      255 & (r[(d[(e + 3) % 4] >> 16) & 255] ^ (g >> 16))),
                    (i[4 * e + 2] =
                      255 & (r[(d[(e + 2) % 4] >> 8) & 255] ^ (g >> 8))),
                    (i[4 * e + 3] = 255 & (r[255 & d[(e + 1) % 4]] ^ g));
                return i;
              });
            var F = function (a) {
              if (!(this instanceof F))
                throw Error("AES must be instanitated with `new`");
              (this.description = "Electronic Code Block"),
                (this.name = "ecb"),
                (this._aes = new E(a));
            };
            (F.prototype.encrypt = function (a) {
              if (((a = g(a)), a.length % 16 !== 0))
                throw new Error(
                  "invalid plaintext size (must be multiple of 16 bytes)"
                );
              for (var b = h(a.length), c = h(16), d = 0; d < a.length; d += 16)
                i(a, c, 0, d, d + 16), (c = this._aes.encrypt(c)), i(c, b, d);
              return b;
            }),
              (F.prototype.decrypt = function (a) {
                if (((a = g(a)), a.length % 16 !== 0))
                  throw new Error(
                    "invalid ciphertext size (must be multiple of 16 bytes)"
                  );
                for (
                  var b = h(a.length), c = h(16), d = 0;
                  d < a.length;
                  d += 16
                )
                  i(a, c, 0, d, d + 16), (c = this._aes.decrypt(c)), i(c, b, d);
                return b;
              });
            var G = function (a, b) {
              if (!(this instanceof G))
                throw Error("AES must be instanitated with `new`");
              if (
                ((this.description = "Cipher Block Chaining"),
                (this.name = "cbc"),
                b)
              ) {
                if (16 != b.length)
                  throw new Error(
                    "invalid initialation vector size (must be 16 bytes)"
                  );
              } else b = h(16);
              (this._lastCipherblock = g(b, !0)), (this._aes = new E(a));
            };
            (G.prototype.encrypt = function (a) {
              if (((a = g(a)), a.length % 16 !== 0))
                throw new Error(
                  "invalid plaintext size (must be multiple of 16 bytes)"
                );
              for (
                var b = h(a.length), c = h(16), d = 0;
                d < a.length;
                d += 16
              ) {
                i(a, c, 0, d, d + 16);
                for (var e = 0; e < 16; e++) c[e] ^= this._lastCipherblock[e];
                (this._lastCipherblock = this._aes.encrypt(c)),
                  i(this._lastCipherblock, b, d);
              }
              return b;
            }),
              (G.prototype.decrypt = function (a) {
                if (((a = g(a)), a.length % 16 !== 0))
                  throw new Error(
                    "invalid ciphertext size (must be multiple of 16 bytes)"
                  );
                for (
                  var b = h(a.length), c = h(16), d = 0;
                  d < a.length;
                  d += 16
                ) {
                  i(a, c, 0, d, d + 16), (c = this._aes.decrypt(c));
                  for (var e = 0; e < 16; e++)
                    b[d + e] = c[e] ^ this._lastCipherblock[e];
                  i(a, this._lastCipherblock, 0, d, d + 16);
                }
                return b;
              });
            var H = function (a, b, c) {
              if (!(this instanceof H))
                throw Error("AES must be instanitated with `new`");
              if (
                ((this.description = "Cipher Feedback"), (this.name = "cfb"), b)
              ) {
                if (16 != b.length)
                  throw new Error(
                    "invalid initialation vector size (must be 16 size)"
                  );
              } else b = h(16);
              c || (c = 1),
                (this.segmentSize = c),
                (this._shiftRegister = g(b, !0)),
                (this._aes = new E(a));
            };
            (H.prototype.encrypt = function (a) {
              if (a.length % this.segmentSize != 0)
                throw new Error(
                  "invalid plaintext size (must be segmentSize bytes)"
                );
              for (
                var b, c = g(a, !0), d = 0;
                d < c.length;
                d += this.segmentSize
              ) {
                b = this._aes.encrypt(this._shiftRegister);
                for (var e = 0; e < this.segmentSize; e++) c[d + e] ^= b[e];
                i(
                  this._shiftRegister,
                  this._shiftRegister,
                  0,
                  this.segmentSize
                ),
                  i(
                    c,
                    this._shiftRegister,
                    16 - this.segmentSize,
                    d,
                    d + this.segmentSize
                  );
              }
              return c;
            }),
              (H.prototype.decrypt = function (a) {
                if (a.length % this.segmentSize != 0)
                  throw new Error(
                    "invalid ciphertext size (must be segmentSize bytes)"
                  );
                for (
                  var b, c = g(a, !0), d = 0;
                  d < c.length;
                  d += this.segmentSize
                ) {
                  b = this._aes.encrypt(this._shiftRegister);
                  for (var e = 0; e < this.segmentSize; e++) c[d + e] ^= b[e];
                  i(
                    this._shiftRegister,
                    this._shiftRegister,
                    0,
                    this.segmentSize
                  ),
                    i(
                      a,
                      this._shiftRegister,
                      16 - this.segmentSize,
                      d,
                      d + this.segmentSize
                    );
                }
                return c;
              });
            var I = function (a, b) {
              if (!(this instanceof I))
                throw Error("AES must be instanitated with `new`");
              if (
                ((this.description = "Output Feedback"), (this.name = "ofb"), b)
              ) {
                if (16 != b.length)
                  throw new Error(
                    "invalid initialation vector size (must be 16 bytes)"
                  );
              } else b = h(16);
              (this._lastPrecipher = g(b, !0)),
                (this._lastPrecipherIndex = 16),
                (this._aes = new E(a));
            };
            (I.prototype.encrypt = function (a) {
              for (var b = g(a, !0), c = 0; c < b.length; c++)
                16 === this._lastPrecipherIndex &&
                  ((this._lastPrecipher = this._aes.encrypt(
                    this._lastPrecipher
                  )),
                  (this._lastPrecipherIndex = 0)),
                  (b[c] ^= this._lastPrecipher[this._lastPrecipherIndex++]);
              return b;
            }),
              (I.prototype.decrypt = I.prototype.encrypt);
            var J = function (a) {
              if (!(this instanceof J))
                throw Error("Counter must be instanitated with `new`");
              0 === a || a || (a = 1),
                "number" == typeof a
                  ? ((this._counter = h(16)), this.setValue(a))
                  : this.setBytes(a);
            };
            (J.prototype.setValue = function (a) {
              if ("number" != typeof a || parseInt(a) != a)
                throw new Error("invalid counter value (must be an integer)");
              for (var b = 15; b >= 0; --b)
                (this._counter[b] = a % 256), (a >>= 8);
            }),
              (J.prototype.setBytes = function (a) {
                if (((a = g(a, !0)), 16 != a.length))
                  throw new Error(
                    "invalid counter bytes size (must be 16 bytes)"
                  );
                this._counter = a;
              }),
              (J.prototype.increment = function () {
                for (var a = 15; a >= 0; a--) {
                  if (255 !== this._counter[a]) {
                    this._counter[a]++;
                    break;
                  }
                  this._counter[a] = 0;
                }
              });
            var K = function (a, b) {
              if (!(this instanceof K))
                throw Error("AES must be instanitated with `new`");
              (this.description = "Counter"),
                (this.name = "ctr"),
                b instanceof J || (b = new J(b)),
                (this._counter = b),
                (this._remainingCounter = null),
                (this._remainingCounterIndex = 16),
                (this._aes = new E(a));
            };
            (K.prototype.encrypt = function (a) {
              for (var b = g(a, !0), c = 0; c < b.length; c++)
                16 === this._remainingCounterIndex &&
                  ((this._remainingCounter = this._aes.encrypt(
                    this._counter._counter
                  )),
                  (this._remainingCounterIndex = 0),
                  this._counter.increment()),
                  (b[c] ^=
                    this._remainingCounter[this._remainingCounterIndex++]);
              return b;
            }),
              (K.prototype.decrypt = K.prototype.encrypt);
            var L = {
              AES: E,
              Counter: J,
              ModeOfOperation: { ecb: F, cbc: G, cfb: H, ofb: I, ctr: K },
              utils: { hex: n, utf8: m },
              padding: { pkcs7: { pad: k, strip: l } },
              _arrayTest: { coerceArray: g, createArray: h, copyArray: i },
            };
            "undefined" != typeof d
              ? (c.exports = L)
              : "function" == typeof a && a.amd
              ? a(L)
              : (b.aesjs && (L._aesjs = b.aesjs), (b.aesjs = L));
          })(this);
        },
        {},
      ],
      6: [
        function (a, b, c) {
          !(function (b, c) {
            "use strict";
            function d(a, b) {
              if (!a) throw new Error(b || "Assertion failed");
            }
            function e(a, b) {
              a.super_ = b;
              var c = function () {};
              (c.prototype = b.prototype),
                (a.prototype = new c()),
                (a.prototype.constructor = a);
            }
            function f(a, b, c) {
              return f.isBN(a)
                ? a
                : ((this.negative = 0),
                  (this.words = null),
                  (this.length = 0),
                  (this.red = null),
                  void (
                    null !== a &&
                    (("le" !== b && "be" !== b) || ((c = b), (b = 10)),
                    this._init(a || 0, b || 10, c || "be"))
                  ));
            }
            function g(a, b, c) {
              for (var d = 0, e = Math.min(a.length, c), f = b; f < e; f++) {
                var g = a.charCodeAt(f) - 48;
                (d <<= 4),
                  (d |=
                    g >= 49 && g <= 54
                      ? g - 49 + 10
                      : g >= 17 && g <= 22
                      ? g - 17 + 10
                      : 15 & g);
              }
              return d;
            }
            function h(a, b, c, d) {
              for (var e = 0, f = Math.min(a.length, c), g = b; g < f; g++) {
                var h = a.charCodeAt(g) - 48;
                (e *= d),
                  (e += h >= 49 ? h - 49 + 10 : h >= 17 ? h - 17 + 10 : h);
              }
              return e;
            }
            function i(a) {
              for (var b = new Array(a.bitLength()), c = 0; c < b.length; c++) {
                var d = (c / 26) | 0,
                  e = c % 26;
                b[c] = (a.words[d] & (1 << e)) >>> e;
              }
              return b;
            }
            function j(a, b, c) {
              c.negative = b.negative ^ a.negative;
              var d = (a.length + b.length) | 0;
              (c.length = d), (d = (d - 1) | 0);
              var e = 0 | a.words[0],
                f = 0 | b.words[0],
                g = e * f,
                h = 67108863 & g,
                i = (g / 67108864) | 0;
              c.words[0] = h;
              for (var j = 1; j < d; j++) {
                for (
                  var k = i >>> 26,
                    l = 67108863 & i,
                    m = Math.min(j, b.length - 1),
                    n = Math.max(0, j - a.length + 1);
                  n <= m;
                  n++
                ) {
                  var o = (j - n) | 0;
                  (e = 0 | a.words[o]),
                    (f = 0 | b.words[n]),
                    (g = e * f + l),
                    (k += (g / 67108864) | 0),
                    (l = 67108863 & g);
                }
                (c.words[j] = 0 | l), (i = 0 | k);
              }
              return 0 !== i ? (c.words[j] = 0 | i) : c.length--, c.strip();
            }
            function k(a, b, c) {
              (c.negative = b.negative ^ a.negative),
                (c.length = a.length + b.length);
              for (var d = 0, e = 0, f = 0; f < c.length - 1; f++) {
                var g = e;
                e = 0;
                for (
                  var h = 67108863 & d,
                    i = Math.min(f, b.length - 1),
                    j = Math.max(0, f - a.length + 1);
                  j <= i;
                  j++
                ) {
                  var k = f - j,
                    l = 0 | a.words[k],
                    m = 0 | b.words[j],
                    n = l * m,
                    o = 67108863 & n;
                  (g = (g + ((n / 67108864) | 0)) | 0),
                    (o = (o + h) | 0),
                    (h = 67108863 & o),
                    (g = (g + (o >>> 26)) | 0),
                    (e += g >>> 26),
                    (g &= 67108863);
                }
                (c.words[f] = h), (d = g), (g = e);
              }
              return 0 !== d ? (c.words[f] = d) : c.length--, c.strip();
            }
            function l(a, b, c) {
              var d = new m();
              return d.mulp(a, b, c);
            }
            function m(a, b) {
              (this.x = a), (this.y = b);
            }
            function n(a, b) {
              (this.name = a),
                (this.p = new f(b, 16)),
                (this.n = this.p.bitLength()),
                (this.k = new f(1).iushln(this.n).isub(this.p)),
                (this.tmp = this._tmp());
            }
            function o() {
              n.call(
                this,
                "k256",
                "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
              );
            }
            function p() {
              n.call(
                this,
                "p224",
                "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
              );
            }
            function q() {
              n.call(
                this,
                "p192",
                "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
              );
            }
            function r() {
              n.call(
                this,
                "25519",
                "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
              );
            }
            function s(a) {
              if ("string" == typeof a) {
                var b = f._prime(a);
                (this.m = b.p), (this.prime = b);
              } else
                d(a.gtn(1), "modulus must be greater than 1"),
                  (this.m = a),
                  (this.prime = null);
            }
            function t(a) {
              s.call(this, a),
                (this.shift = this.m.bitLength()),
                this.shift % 26 !== 0 && (this.shift += 26 - (this.shift % 26)),
                (this.r = new f(1).iushln(this.shift)),
                (this.r2 = this.imod(this.r.sqr())),
                (this.rinv = this.r._invmp(this.m)),
                (this.minv = this.rinv.mul(this.r).isubn(1).div(this.m)),
                (this.minv = this.minv.umod(this.r)),
                (this.minv = this.r.sub(this.minv));
            }
            "object" == typeof b ? (b.exports = f) : (c.BN = f),
              (f.BN = f),
              (f.wordSize = 26);
            var u;
            try {
              u = a("buffer").Buffer;
            } catch (v) {}
            (f.isBN = function (a) {
              return (
                a instanceof f ||
                (null !== a &&
                  "object" == typeof a &&
                  a.constructor.wordSize === f.wordSize &&
                  Array.isArray(a.words))
              );
            }),
              (f.max = function (a, b) {
                return a.cmp(b) > 0 ? a : b;
              }),
              (f.min = function (a, b) {
                return a.cmp(b) < 0 ? a : b;
              }),
              (f.prototype._init = function (a, b, c) {
                if ("number" == typeof a) return this._initNumber(a, b, c);
                if ("object" == typeof a) return this._initArray(a, b, c);
                "hex" === b && (b = 16),
                  d(b === (0 | b) && b >= 2 && b <= 36),
                  (a = a.toString().replace(/\s+/g, ""));
                var e = 0;
                "-" === a[0] && e++,
                  16 === b ? this._parseHex(a, e) : this._parseBase(a, b, e),
                  "-" === a[0] && (this.negative = 1),
                  this.strip(),
                  "le" === c && this._initArray(this.toArray(), b, c);
              }),
              (f.prototype._initNumber = function (a, b, c) {
                a < 0 && ((this.negative = 1), (a = -a)),
                  a < 67108864
                    ? ((this.words = [67108863 & a]), (this.length = 1))
                    : a < 4503599627370496
                    ? ((this.words = [67108863 & a, (a / 67108864) & 67108863]),
                      (this.length = 2))
                    : (d(a < 9007199254740992),
                      (this.words = [
                        67108863 & a,
                        (a / 67108864) & 67108863,
                        1,
                      ]),
                      (this.length = 3)),
                  "le" === c && this._initArray(this.toArray(), b, c);
              }),
              (f.prototype._initArray = function (a, b, c) {
                if ((d("number" == typeof a.length), a.length <= 0))
                  return (this.words = [0]), (this.length = 1), this;
                (this.length = Math.ceil(a.length / 3)),
                  (this.words = new Array(this.length));
                for (var e = 0; e < this.length; e++) this.words[e] = 0;
                var f,
                  g,
                  h = 0;
                if ("be" === c)
                  for (e = a.length - 1, f = 0; e >= 0; e -= 3)
                    (g = a[e] | (a[e - 1] << 8) | (a[e - 2] << 16)),
                      (this.words[f] |= (g << h) & 67108863),
                      (this.words[f + 1] = (g >>> (26 - h)) & 67108863),
                      (h += 24),
                      h >= 26 && ((h -= 26), f++);
                else if ("le" === c)
                  for (e = 0, f = 0; e < a.length; e += 3)
                    (g = a[e] | (a[e + 1] << 8) | (a[e + 2] << 16)),
                      (this.words[f] |= (g << h) & 67108863),
                      (this.words[f + 1] = (g >>> (26 - h)) & 67108863),
                      (h += 24),
                      h >= 26 && ((h -= 26), f++);
                return this.strip();
              }),
              (f.prototype._parseHex = function (a, b) {
                (this.length = Math.ceil((a.length - b) / 6)),
                  (this.words = new Array(this.length));
                for (var c = 0; c < this.length; c++) this.words[c] = 0;
                var d,
                  e,
                  f = 0;
                for (c = a.length - 6, d = 0; c >= b; c -= 6)
                  (e = g(a, c, c + 6)),
                    (this.words[d] |= (e << f) & 67108863),
                    (this.words[d + 1] |= (e >>> (26 - f)) & 4194303),
                    (f += 24),
                    f >= 26 && ((f -= 26), d++);
                c + 6 !== b &&
                  ((e = g(a, b, c + 6)),
                  (this.words[d] |= (e << f) & 67108863),
                  (this.words[d + 1] |= (e >>> (26 - f)) & 4194303)),
                  this.strip();
              }),
              (f.prototype._parseBase = function (a, b, c) {
                (this.words = [0]), (this.length = 1);
                for (var d = 0, e = 1; e <= 67108863; e *= b) d++;
                d--, (e = (e / b) | 0);
                for (
                  var f = a.length - c,
                    g = f % d,
                    i = Math.min(f, f - g) + c,
                    j = 0,
                    k = c;
                  k < i;
                  k += d
                )
                  (j = h(a, k, k + d, b)),
                    this.imuln(e),
                    this.words[0] + j < 67108864
                      ? (this.words[0] += j)
                      : this._iaddn(j);
                if (0 !== g) {
                  var l = 1;
                  for (j = h(a, k, a.length, b), k = 0; k < g; k++) l *= b;
                  this.imuln(l),
                    this.words[0] + j < 67108864
                      ? (this.words[0] += j)
                      : this._iaddn(j);
                }
              }),
              (f.prototype.copy = function (a) {
                a.words = new Array(this.length);
                for (var b = 0; b < this.length; b++)
                  a.words[b] = this.words[b];
                (a.length = this.length),
                  (a.negative = this.negative),
                  (a.red = this.red);
              }),
              (f.prototype.clone = function () {
                var a = new f(null);
                return this.copy(a), a;
              }),
              (f.prototype._expand = function (a) {
                for (; this.length < a; ) this.words[this.length++] = 0;
                return this;
              }),
              (f.prototype.strip = function () {
                for (; this.length > 1 && 0 === this.words[this.length - 1]; )
                  this.length--;
                return this._normSign();
              }),
              (f.prototype._normSign = function () {
                return (
                  1 === this.length &&
                    0 === this.words[0] &&
                    (this.negative = 0),
                  this
                );
              }),
              (f.prototype.inspect = function () {
                return (
                  (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">"
                );
              });
            var w = [
                "",
                "0",
                "00",
                "000",
                "0000",
                "00000",
                "000000",
                "0000000",
                "00000000",
                "000000000",
                "0000000000",
                "00000000000",
                "000000000000",
                "0000000000000",
                "00000000000000",
                "000000000000000",
                "0000000000000000",
                "00000000000000000",
                "000000000000000000",
                "0000000000000000000",
                "00000000000000000000",
                "000000000000000000000",
                "0000000000000000000000",
                "00000000000000000000000",
                "000000000000000000000000",
                "0000000000000000000000000",
              ],
              x = [
                0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6,
                6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
              ],
              y = [
                0, 0, 33554432, 43046721, 16777216, 48828125, 60466176,
                40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517,
                7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6,
                4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907,
                17210368, 20511149, 243e5, 28629151, 33554432, 39135393,
                45435424, 52521875, 60466176,
              ];
            (f.prototype.toString = function (a, b) {
              (a = a || 10), (b = 0 | b || 1);
              var c;
              if (16 === a || "hex" === a) {
                c = "";
                for (var e = 0, f = 0, g = 0; g < this.length; g++) {
                  var h = this.words[g],
                    i = (16777215 & ((h << e) | f)).toString(16);
                  (f = (h >>> (24 - e)) & 16777215),
                    (c =
                      0 !== f || g !== this.length - 1
                        ? w[6 - i.length] + i + c
                        : i + c),
                    (e += 2),
                    e >= 26 && ((e -= 26), g--);
                }
                for (0 !== f && (c = f.toString(16) + c); c.length % b !== 0; )
                  c = "0" + c;
                return 0 !== this.negative && (c = "-" + c), c;
              }
              if (a === (0 | a) && a >= 2 && a <= 36) {
                var j = x[a],
                  k = y[a];
                c = "";
                var l = this.clone();
                for (l.negative = 0; !l.isZero(); ) {
                  var m = l.modn(k).toString(a);
                  (l = l.idivn(k)),
                    (c = l.isZero() ? m + c : w[j - m.length] + m + c);
                }
                for (this.isZero() && (c = "0" + c); c.length % b !== 0; )
                  c = "0" + c;
                return 0 !== this.negative && (c = "-" + c), c;
              }
              d(!1, "Base should be between 2 and 36");
            }),
              (f.prototype.toNumber = function () {
                var a = this.words[0];
                return (
                  2 === this.length
                    ? (a += 67108864 * this.words[1])
                    : 3 === this.length && 1 === this.words[2]
                    ? (a += 4503599627370496 + 67108864 * this.words[1])
                    : this.length > 2 &&
                      d(!1, "Number can only safely store up to 53 bits"),
                  0 !== this.negative ? -a : a
                );
              }),
              (f.prototype.toJSON = function () {
                return this.toString(16);
              }),
              (f.prototype.toBuffer = function (a, b) {
                return d("undefined" != typeof u), this.toArrayLike(u, a, b);
              }),
              (f.prototype.toArray = function (a, b) {
                return this.toArrayLike(Array, a, b);
              }),
              (f.prototype.toArrayLike = function (a, b, c) {
                var e = this.byteLength(),
                  f = c || Math.max(1, e);
                d(e <= f, "byte array longer than desired length"),
                  d(f > 0, "Requested array length <= 0"),
                  this.strip();
                var g,
                  h,
                  i = "le" === b,
                  j = new a(f),
                  k = this.clone();
                if (i) {
                  for (h = 0; !k.isZero(); h++)
                    (g = k.andln(255)), k.iushrn(8), (j[h] = g);
                  for (; h < f; h++) j[h] = 0;
                } else {
                  for (h = 0; h < f - e; h++) j[h] = 0;
                  for (h = 0; !k.isZero(); h++)
                    (g = k.andln(255)), k.iushrn(8), (j[f - h - 1] = g);
                }
                return j;
              }),
              Math.clz32
                ? (f.prototype._countBits = function (a) {
                    return 32 - Math.clz32(a);
                  })
                : (f.prototype._countBits = function (a) {
                    var b = a,
                      c = 0;
                    return (
                      b >= 4096 && ((c += 13), (b >>>= 13)),
                      b >= 64 && ((c += 7), (b >>>= 7)),
                      b >= 8 && ((c += 4), (b >>>= 4)),
                      b >= 2 && ((c += 2), (b >>>= 2)),
                      c + b
                    );
                  }),
              (f.prototype._zeroBits = function (a) {
                if (0 === a) return 26;
                var b = a,
                  c = 0;
                return (
                  0 === (8191 & b) && ((c += 13), (b >>>= 13)),
                  0 === (127 & b) && ((c += 7), (b >>>= 7)),
                  0 === (15 & b) && ((c += 4), (b >>>= 4)),
                  0 === (3 & b) && ((c += 2), (b >>>= 2)),
                  0 === (1 & b) && c++,
                  c
                );
              }),
              (f.prototype.bitLength = function () {
                var a = this.words[this.length - 1],
                  b = this._countBits(a);
                return 26 * (this.length - 1) + b;
              }),
              (f.prototype.zeroBits = function () {
                if (this.isZero()) return 0;
                for (var a = 0, b = 0; b < this.length; b++) {
                  var c = this._zeroBits(this.words[b]);
                  if (((a += c), 26 !== c)) break;
                }
                return a;
              }),
              (f.prototype.byteLength = function () {
                return Math.ceil(this.bitLength() / 8);
              }),
              (f.prototype.toTwos = function (a) {
                return 0 !== this.negative
                  ? this.abs().inotn(a).iaddn(1)
                  : this.clone();
              }),
              (f.prototype.fromTwos = function (a) {
                return this.testn(a - 1)
                  ? this.notn(a).iaddn(1).ineg()
                  : this.clone();
              }),
              (f.prototype.isNeg = function () {
                return 0 !== this.negative;
              }),
              (f.prototype.neg = function () {
                return this.clone().ineg();
              }),
              (f.prototype.ineg = function () {
                return this.isZero() || (this.negative ^= 1), this;
              }),
              (f.prototype.iuor = function (a) {
                for (; this.length < a.length; ) this.words[this.length++] = 0;
                for (var b = 0; b < a.length; b++)
                  this.words[b] = this.words[b] | a.words[b];
                return this.strip();
              }),
              (f.prototype.ior = function (a) {
                return d(0 === (this.negative | a.negative)), this.iuor(a);
              }),
              (f.prototype.or = function (a) {
                return this.length > a.length
                  ? this.clone().ior(a)
                  : a.clone().ior(this);
              }),
              (f.prototype.uor = function (a) {
                return this.length > a.length
                  ? this.clone().iuor(a)
                  : a.clone().iuor(this);
              }),
              (f.prototype.iuand = function (a) {
                var b;
                b = this.length > a.length ? a : this;
                for (var c = 0; c < b.length; c++)
                  this.words[c] = this.words[c] & a.words[c];
                return (this.length = b.length), this.strip();
              }),
              (f.prototype.iand = function (a) {
                return d(0 === (this.negative | a.negative)), this.iuand(a);
              }),
              (f.prototype.and = function (a) {
                return this.length > a.length
                  ? this.clone().iand(a)
                  : a.clone().iand(this);
              }),
              (f.prototype.uand = function (a) {
                return this.length > a.length
                  ? this.clone().iuand(a)
                  : a.clone().iuand(this);
              }),
              (f.prototype.iuxor = function (a) {
                var b, c;
                this.length > a.length
                  ? ((b = this), (c = a))
                  : ((b = a), (c = this));
                for (var d = 0; d < c.length; d++)
                  this.words[d] = b.words[d] ^ c.words[d];
                if (this !== b)
                  for (; d < b.length; d++) this.words[d] = b.words[d];
                return (this.length = b.length), this.strip();
              }),
              (f.prototype.ixor = function (a) {
                return d(0 === (this.negative | a.negative)), this.iuxor(a);
              }),
              (f.prototype.xor = function (a) {
                return this.length > a.length
                  ? this.clone().ixor(a)
                  : a.clone().ixor(this);
              }),
              (f.prototype.uxor = function (a) {
                return this.length > a.length
                  ? this.clone().iuxor(a)
                  : a.clone().iuxor(this);
              }),
              (f.prototype.inotn = function (a) {
                d("number" == typeof a && a >= 0);
                var b = 0 | Math.ceil(a / 26),
                  c = a % 26;
                this._expand(b), c > 0 && b--;
                for (var e = 0; e < b; e++)
                  this.words[e] = 67108863 & ~this.words[e];
                return (
                  c > 0 &&
                    (this.words[e] = ~this.words[e] & (67108863 >> (26 - c))),
                  this.strip()
                );
              }),
              (f.prototype.notn = function (a) {
                return this.clone().inotn(a);
              }),
              (f.prototype.setn = function (a, b) {
                d("number" == typeof a && a >= 0);
                var c = (a / 26) | 0,
                  e = a % 26;
                return (
                  this._expand(c + 1),
                  b
                    ? (this.words[c] = this.words[c] | (1 << e))
                    : (this.words[c] = this.words[c] & ~(1 << e)),
                  this.strip()
                );
              }),
              (f.prototype.iadd = function (a) {
                var b;
                if (0 !== this.negative && 0 === a.negative)
                  return (
                    (this.negative = 0),
                    (b = this.isub(a)),
                    (this.negative ^= 1),
                    this._normSign()
                  );
                if (0 === this.negative && 0 !== a.negative)
                  return (
                    (a.negative = 0),
                    (b = this.isub(a)),
                    (a.negative = 1),
                    b._normSign()
                  );
                var c, d;
                this.length > a.length
                  ? ((c = this), (d = a))
                  : ((c = a), (d = this));
                for (var e = 0, f = 0; f < d.length; f++)
                  (b = (0 | c.words[f]) + (0 | d.words[f]) + e),
                    (this.words[f] = 67108863 & b),
                    (e = b >>> 26);
                for (; 0 !== e && f < c.length; f++)
                  (b = (0 | c.words[f]) + e),
                    (this.words[f] = 67108863 & b),
                    (e = b >>> 26);
                if (((this.length = c.length), 0 !== e))
                  (this.words[this.length] = e), this.length++;
                else if (c !== this)
                  for (; f < c.length; f++) this.words[f] = c.words[f];
                return this;
              }),
              (f.prototype.add = function (a) {
                var b;
                return 0 !== a.negative && 0 === this.negative
                  ? ((a.negative = 0), (b = this.sub(a)), (a.negative ^= 1), b)
                  : 0 === a.negative && 0 !== this.negative
                  ? ((this.negative = 0),
                    (b = a.sub(this)),
                    (this.negative = 1),
                    b)
                  : this.length > a.length
                  ? this.clone().iadd(a)
                  : a.clone().iadd(this);
              }),
              (f.prototype.isub = function (a) {
                if (0 !== a.negative) {
                  a.negative = 0;
                  var b = this.iadd(a);
                  return (a.negative = 1), b._normSign();
                }
                if (0 !== this.negative)
                  return (
                    (this.negative = 0),
                    this.iadd(a),
                    (this.negative = 1),
                    this._normSign()
                  );
                var c = this.cmp(a);
                if (0 === c)
                  return (
                    (this.negative = 0),
                    (this.length = 1),
                    (this.words[0] = 0),
                    this
                  );
                var d, e;
                c > 0 ? ((d = this), (e = a)) : ((d = a), (e = this));
                for (var f = 0, g = 0; g < e.length; g++)
                  (b = (0 | d.words[g]) - (0 | e.words[g]) + f),
                    (f = b >> 26),
                    (this.words[g] = 67108863 & b);
                for (; 0 !== f && g < d.length; g++)
                  (b = (0 | d.words[g]) + f),
                    (f = b >> 26),
                    (this.words[g] = 67108863 & b);
                if (0 === f && g < d.length && d !== this)
                  for (; g < d.length; g++) this.words[g] = d.words[g];
                return (
                  (this.length = Math.max(this.length, g)),
                  d !== this && (this.negative = 1),
                  this.strip()
                );
              }),
              (f.prototype.sub = function (a) {
                return this.clone().isub(a);
              });
            var z = function (a, b, c) {
              var d,
                e,
                f,
                g = a.words,
                h = b.words,
                i = c.words,
                j = 0,
                k = 0 | g[0],
                l = 8191 & k,
                m = k >>> 13,
                n = 0 | g[1],
                o = 8191 & n,
                p = n >>> 13,
                q = 0 | g[2],
                r = 8191 & q,
                s = q >>> 13,
                t = 0 | g[3],
                u = 8191 & t,
                v = t >>> 13,
                w = 0 | g[4],
                x = 8191 & w,
                y = w >>> 13,
                z = 0 | g[5],
                A = 8191 & z,
                B = z >>> 13,
                C = 0 | g[6],
                D = 8191 & C,
                E = C >>> 13,
                F = 0 | g[7],
                G = 8191 & F,
                H = F >>> 13,
                I = 0 | g[8],
                J = 8191 & I,
                K = I >>> 13,
                L = 0 | g[9],
                M = 8191 & L,
                N = L >>> 13,
                O = 0 | h[0],
                P = 8191 & O,
                Q = O >>> 13,
                R = 0 | h[1],
                S = 8191 & R,
                T = R >>> 13,
                U = 0 | h[2],
                V = 8191 & U,
                W = U >>> 13,
                X = 0 | h[3],
                Y = 8191 & X,
                Z = X >>> 13,
                $ = 0 | h[4],
                _ = 8191 & $,
                aa = $ >>> 13,
                ba = 0 | h[5],
                ca = 8191 & ba,
                da = ba >>> 13,
                ea = 0 | h[6],
                fa = 8191 & ea,
                ga = ea >>> 13,
                ha = 0 | h[7],
                ia = 8191 & ha,
                ja = ha >>> 13,
                ka = 0 | h[8],
                la = 8191 & ka,
                ma = ka >>> 13,
                na = 0 | h[9],
                oa = 8191 & na,
                pa = na >>> 13;
              (c.negative = a.negative ^ b.negative),
                (c.length = 19),
                (d = Math.imul(l, P)),
                (e = Math.imul(l, Q)),
                (e = (e + Math.imul(m, P)) | 0),
                (f = Math.imul(m, Q));
              var qa = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (qa >>> 26)) | 0),
                (qa &= 67108863),
                (d = Math.imul(o, P)),
                (e = Math.imul(o, Q)),
                (e = (e + Math.imul(p, P)) | 0),
                (f = Math.imul(p, Q)),
                (d = (d + Math.imul(l, S)) | 0),
                (e = (e + Math.imul(l, T)) | 0),
                (e = (e + Math.imul(m, S)) | 0),
                (f = (f + Math.imul(m, T)) | 0);
              var ra = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (ra >>> 26)) | 0),
                (ra &= 67108863),
                (d = Math.imul(r, P)),
                (e = Math.imul(r, Q)),
                (e = (e + Math.imul(s, P)) | 0),
                (f = Math.imul(s, Q)),
                (d = (d + Math.imul(o, S)) | 0),
                (e = (e + Math.imul(o, T)) | 0),
                (e = (e + Math.imul(p, S)) | 0),
                (f = (f + Math.imul(p, T)) | 0),
                (d = (d + Math.imul(l, V)) | 0),
                (e = (e + Math.imul(l, W)) | 0),
                (e = (e + Math.imul(m, V)) | 0),
                (f = (f + Math.imul(m, W)) | 0);
              var sa = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (sa >>> 26)) | 0),
                (sa &= 67108863),
                (d = Math.imul(u, P)),
                (e = Math.imul(u, Q)),
                (e = (e + Math.imul(v, P)) | 0),
                (f = Math.imul(v, Q)),
                (d = (d + Math.imul(r, S)) | 0),
                (e = (e + Math.imul(r, T)) | 0),
                (e = (e + Math.imul(s, S)) | 0),
                (f = (f + Math.imul(s, T)) | 0),
                (d = (d + Math.imul(o, V)) | 0),
                (e = (e + Math.imul(o, W)) | 0),
                (e = (e + Math.imul(p, V)) | 0),
                (f = (f + Math.imul(p, W)) | 0),
                (d = (d + Math.imul(l, Y)) | 0),
                (e = (e + Math.imul(l, Z)) | 0),
                (e = (e + Math.imul(m, Y)) | 0),
                (f = (f + Math.imul(m, Z)) | 0);
              var ta = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (ta >>> 26)) | 0),
                (ta &= 67108863),
                (d = Math.imul(x, P)),
                (e = Math.imul(x, Q)),
                (e = (e + Math.imul(y, P)) | 0),
                (f = Math.imul(y, Q)),
                (d = (d + Math.imul(u, S)) | 0),
                (e = (e + Math.imul(u, T)) | 0),
                (e = (e + Math.imul(v, S)) | 0),
                (f = (f + Math.imul(v, T)) | 0),
                (d = (d + Math.imul(r, V)) | 0),
                (e = (e + Math.imul(r, W)) | 0),
                (e = (e + Math.imul(s, V)) | 0),
                (f = (f + Math.imul(s, W)) | 0),
                (d = (d + Math.imul(o, Y)) | 0),
                (e = (e + Math.imul(o, Z)) | 0),
                (e = (e + Math.imul(p, Y)) | 0),
                (f = (f + Math.imul(p, Z)) | 0),
                (d = (d + Math.imul(l, _)) | 0),
                (e = (e + Math.imul(l, aa)) | 0),
                (e = (e + Math.imul(m, _)) | 0),
                (f = (f + Math.imul(m, aa)) | 0);
              var ua = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (ua >>> 26)) | 0),
                (ua &= 67108863),
                (d = Math.imul(A, P)),
                (e = Math.imul(A, Q)),
                (e = (e + Math.imul(B, P)) | 0),
                (f = Math.imul(B, Q)),
                (d = (d + Math.imul(x, S)) | 0),
                (e = (e + Math.imul(x, T)) | 0),
                (e = (e + Math.imul(y, S)) | 0),
                (f = (f + Math.imul(y, T)) | 0),
                (d = (d + Math.imul(u, V)) | 0),
                (e = (e + Math.imul(u, W)) | 0),
                (e = (e + Math.imul(v, V)) | 0),
                (f = (f + Math.imul(v, W)) | 0),
                (d = (d + Math.imul(r, Y)) | 0),
                (e = (e + Math.imul(r, Z)) | 0),
                (e = (e + Math.imul(s, Y)) | 0),
                (f = (f + Math.imul(s, Z)) | 0),
                (d = (d + Math.imul(o, _)) | 0),
                (e = (e + Math.imul(o, aa)) | 0),
                (e = (e + Math.imul(p, _)) | 0),
                (f = (f + Math.imul(p, aa)) | 0),
                (d = (d + Math.imul(l, ca)) | 0),
                (e = (e + Math.imul(l, da)) | 0),
                (e = (e + Math.imul(m, ca)) | 0),
                (f = (f + Math.imul(m, da)) | 0);
              var va = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (va >>> 26)) | 0),
                (va &= 67108863),
                (d = Math.imul(D, P)),
                (e = Math.imul(D, Q)),
                (e = (e + Math.imul(E, P)) | 0),
                (f = Math.imul(E, Q)),
                (d = (d + Math.imul(A, S)) | 0),
                (e = (e + Math.imul(A, T)) | 0),
                (e = (e + Math.imul(B, S)) | 0),
                (f = (f + Math.imul(B, T)) | 0),
                (d = (d + Math.imul(x, V)) | 0),
                (e = (e + Math.imul(x, W)) | 0),
                (e = (e + Math.imul(y, V)) | 0),
                (f = (f + Math.imul(y, W)) | 0),
                (d = (d + Math.imul(u, Y)) | 0),
                (e = (e + Math.imul(u, Z)) | 0),
                (e = (e + Math.imul(v, Y)) | 0),
                (f = (f + Math.imul(v, Z)) | 0),
                (d = (d + Math.imul(r, _)) | 0),
                (e = (e + Math.imul(r, aa)) | 0),
                (e = (e + Math.imul(s, _)) | 0),
                (f = (f + Math.imul(s, aa)) | 0),
                (d = (d + Math.imul(o, ca)) | 0),
                (e = (e + Math.imul(o, da)) | 0),
                (e = (e + Math.imul(p, ca)) | 0),
                (f = (f + Math.imul(p, da)) | 0),
                (d = (d + Math.imul(l, fa)) | 0),
                (e = (e + Math.imul(l, ga)) | 0),
                (e = (e + Math.imul(m, fa)) | 0),
                (f = (f + Math.imul(m, ga)) | 0);
              var wa = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (wa >>> 26)) | 0),
                (wa &= 67108863),
                (d = Math.imul(G, P)),
                (e = Math.imul(G, Q)),
                (e = (e + Math.imul(H, P)) | 0),
                (f = Math.imul(H, Q)),
                (d = (d + Math.imul(D, S)) | 0),
                (e = (e + Math.imul(D, T)) | 0),
                (e = (e + Math.imul(E, S)) | 0),
                (f = (f + Math.imul(E, T)) | 0),
                (d = (d + Math.imul(A, V)) | 0),
                (e = (e + Math.imul(A, W)) | 0),
                (e = (e + Math.imul(B, V)) | 0),
                (f = (f + Math.imul(B, W)) | 0),
                (d = (d + Math.imul(x, Y)) | 0),
                (e = (e + Math.imul(x, Z)) | 0),
                (e = (e + Math.imul(y, Y)) | 0),
                (f = (f + Math.imul(y, Z)) | 0),
                (d = (d + Math.imul(u, _)) | 0),
                (e = (e + Math.imul(u, aa)) | 0),
                (e = (e + Math.imul(v, _)) | 0),
                (f = (f + Math.imul(v, aa)) | 0),
                (d = (d + Math.imul(r, ca)) | 0),
                (e = (e + Math.imul(r, da)) | 0),
                (e = (e + Math.imul(s, ca)) | 0),
                (f = (f + Math.imul(s, da)) | 0),
                (d = (d + Math.imul(o, fa)) | 0),
                (e = (e + Math.imul(o, ga)) | 0),
                (e = (e + Math.imul(p, fa)) | 0),
                (f = (f + Math.imul(p, ga)) | 0),
                (d = (d + Math.imul(l, ia)) | 0),
                (e = (e + Math.imul(l, ja)) | 0),
                (e = (e + Math.imul(m, ia)) | 0),
                (f = (f + Math.imul(m, ja)) | 0);
              var xa = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (xa >>> 26)) | 0),
                (xa &= 67108863),
                (d = Math.imul(J, P)),
                (e = Math.imul(J, Q)),
                (e = (e + Math.imul(K, P)) | 0),
                (f = Math.imul(K, Q)),
                (d = (d + Math.imul(G, S)) | 0),
                (e = (e + Math.imul(G, T)) | 0),
                (e = (e + Math.imul(H, S)) | 0),
                (f = (f + Math.imul(H, T)) | 0),
                (d = (d + Math.imul(D, V)) | 0),
                (e = (e + Math.imul(D, W)) | 0),
                (e = (e + Math.imul(E, V)) | 0),
                (f = (f + Math.imul(E, W)) | 0),
                (d = (d + Math.imul(A, Y)) | 0),
                (e = (e + Math.imul(A, Z)) | 0),
                (e = (e + Math.imul(B, Y)) | 0),
                (f = (f + Math.imul(B, Z)) | 0),
                (d = (d + Math.imul(x, _)) | 0),
                (e = (e + Math.imul(x, aa)) | 0),
                (e = (e + Math.imul(y, _)) | 0),
                (f = (f + Math.imul(y, aa)) | 0),
                (d = (d + Math.imul(u, ca)) | 0),
                (e = (e + Math.imul(u, da)) | 0),
                (e = (e + Math.imul(v, ca)) | 0),
                (f = (f + Math.imul(v, da)) | 0),
                (d = (d + Math.imul(r, fa)) | 0),
                (e = (e + Math.imul(r, ga)) | 0),
                (e = (e + Math.imul(s, fa)) | 0),
                (f = (f + Math.imul(s, ga)) | 0),
                (d = (d + Math.imul(o, ia)) | 0),
                (e = (e + Math.imul(o, ja)) | 0),
                (e = (e + Math.imul(p, ia)) | 0),
                (f = (f + Math.imul(p, ja)) | 0),
                (d = (d + Math.imul(l, la)) | 0),
                (e = (e + Math.imul(l, ma)) | 0),
                (e = (e + Math.imul(m, la)) | 0),
                (f = (f + Math.imul(m, ma)) | 0);
              var ya = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (ya >>> 26)) | 0),
                (ya &= 67108863),
                (d = Math.imul(M, P)),
                (e = Math.imul(M, Q)),
                (e = (e + Math.imul(N, P)) | 0),
                (f = Math.imul(N, Q)),
                (d = (d + Math.imul(J, S)) | 0),
                (e = (e + Math.imul(J, T)) | 0),
                (e = (e + Math.imul(K, S)) | 0),
                (f = (f + Math.imul(K, T)) | 0),
                (d = (d + Math.imul(G, V)) | 0),
                (e = (e + Math.imul(G, W)) | 0),
                (e = (e + Math.imul(H, V)) | 0),
                (f = (f + Math.imul(H, W)) | 0),
                (d = (d + Math.imul(D, Y)) | 0),
                (e = (e + Math.imul(D, Z)) | 0),
                (e = (e + Math.imul(E, Y)) | 0),
                (f = (f + Math.imul(E, Z)) | 0),
                (d = (d + Math.imul(A, _)) | 0),
                (e = (e + Math.imul(A, aa)) | 0),
                (e = (e + Math.imul(B, _)) | 0),
                (f = (f + Math.imul(B, aa)) | 0),
                (d = (d + Math.imul(x, ca)) | 0),
                (e = (e + Math.imul(x, da)) | 0),
                (e = (e + Math.imul(y, ca)) | 0),
                (f = (f + Math.imul(y, da)) | 0),
                (d = (d + Math.imul(u, fa)) | 0),
                (e = (e + Math.imul(u, ga)) | 0),
                (e = (e + Math.imul(v, fa)) | 0),
                (f = (f + Math.imul(v, ga)) | 0),
                (d = (d + Math.imul(r, ia)) | 0),
                (e = (e + Math.imul(r, ja)) | 0),
                (e = (e + Math.imul(s, ia)) | 0),
                (f = (f + Math.imul(s, ja)) | 0),
                (d = (d + Math.imul(o, la)) | 0),
                (e = (e + Math.imul(o, ma)) | 0),
                (e = (e + Math.imul(p, la)) | 0),
                (f = (f + Math.imul(p, ma)) | 0),
                (d = (d + Math.imul(l, oa)) | 0),
                (e = (e + Math.imul(l, pa)) | 0),
                (e = (e + Math.imul(m, oa)) | 0),
                (f = (f + Math.imul(m, pa)) | 0);
              var za = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (za >>> 26)) | 0),
                (za &= 67108863),
                (d = Math.imul(M, S)),
                (e = Math.imul(M, T)),
                (e = (e + Math.imul(N, S)) | 0),
                (f = Math.imul(N, T)),
                (d = (d + Math.imul(J, V)) | 0),
                (e = (e + Math.imul(J, W)) | 0),
                (e = (e + Math.imul(K, V)) | 0),
                (f = (f + Math.imul(K, W)) | 0),
                (d = (d + Math.imul(G, Y)) | 0),
                (e = (e + Math.imul(G, Z)) | 0),
                (e = (e + Math.imul(H, Y)) | 0),
                (f = (f + Math.imul(H, Z)) | 0),
                (d = (d + Math.imul(D, _)) | 0),
                (e = (e + Math.imul(D, aa)) | 0),
                (e = (e + Math.imul(E, _)) | 0),
                (f = (f + Math.imul(E, aa)) | 0),
                (d = (d + Math.imul(A, ca)) | 0),
                (e = (e + Math.imul(A, da)) | 0),
                (e = (e + Math.imul(B, ca)) | 0),
                (f = (f + Math.imul(B, da)) | 0),
                (d = (d + Math.imul(x, fa)) | 0),
                (e = (e + Math.imul(x, ga)) | 0),
                (e = (e + Math.imul(y, fa)) | 0),
                (f = (f + Math.imul(y, ga)) | 0),
                (d = (d + Math.imul(u, ia)) | 0),
                (e = (e + Math.imul(u, ja)) | 0),
                (e = (e + Math.imul(v, ia)) | 0),
                (f = (f + Math.imul(v, ja)) | 0),
                (d = (d + Math.imul(r, la)) | 0),
                (e = (e + Math.imul(r, ma)) | 0),
                (e = (e + Math.imul(s, la)) | 0),
                (f = (f + Math.imul(s, ma)) | 0),
                (d = (d + Math.imul(o, oa)) | 0),
                (e = (e + Math.imul(o, pa)) | 0),
                (e = (e + Math.imul(p, oa)) | 0),
                (f = (f + Math.imul(p, pa)) | 0);
              var Aa = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (Aa >>> 26)) | 0),
                (Aa &= 67108863),
                (d = Math.imul(M, V)),
                (e = Math.imul(M, W)),
                (e = (e + Math.imul(N, V)) | 0),
                (f = Math.imul(N, W)),
                (d = (d + Math.imul(J, Y)) | 0),
                (e = (e + Math.imul(J, Z)) | 0),
                (e = (e + Math.imul(K, Y)) | 0),
                (f = (f + Math.imul(K, Z)) | 0),
                (d = (d + Math.imul(G, _)) | 0),
                (e = (e + Math.imul(G, aa)) | 0),
                (e = (e + Math.imul(H, _)) | 0),
                (f = (f + Math.imul(H, aa)) | 0),
                (d = (d + Math.imul(D, ca)) | 0),
                (e = (e + Math.imul(D, da)) | 0),
                (e = (e + Math.imul(E, ca)) | 0),
                (f = (f + Math.imul(E, da)) | 0),
                (d = (d + Math.imul(A, fa)) | 0),
                (e = (e + Math.imul(A, ga)) | 0),
                (e = (e + Math.imul(B, fa)) | 0),
                (f = (f + Math.imul(B, ga)) | 0),
                (d = (d + Math.imul(x, ia)) | 0),
                (e = (e + Math.imul(x, ja)) | 0),
                (e = (e + Math.imul(y, ia)) | 0),
                (f = (f + Math.imul(y, ja)) | 0),
                (d = (d + Math.imul(u, la)) | 0),
                (e = (e + Math.imul(u, ma)) | 0),
                (e = (e + Math.imul(v, la)) | 0),
                (f = (f + Math.imul(v, ma)) | 0),
                (d = (d + Math.imul(r, oa)) | 0),
                (e = (e + Math.imul(r, pa)) | 0),
                (e = (e + Math.imul(s, oa)) | 0),
                (f = (f + Math.imul(s, pa)) | 0);
              var Ba = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (Ba >>> 26)) | 0),
                (Ba &= 67108863),
                (d = Math.imul(M, Y)),
                (e = Math.imul(M, Z)),
                (e = (e + Math.imul(N, Y)) | 0),
                (f = Math.imul(N, Z)),
                (d = (d + Math.imul(J, _)) | 0),
                (e = (e + Math.imul(J, aa)) | 0),
                (e = (e + Math.imul(K, _)) | 0),
                (f = (f + Math.imul(K, aa)) | 0),
                (d = (d + Math.imul(G, ca)) | 0),
                (e = (e + Math.imul(G, da)) | 0),
                (e = (e + Math.imul(H, ca)) | 0),
                (f = (f + Math.imul(H, da)) | 0),
                (d = (d + Math.imul(D, fa)) | 0),
                (e = (e + Math.imul(D, ga)) | 0),
                (e = (e + Math.imul(E, fa)) | 0),
                (f = (f + Math.imul(E, ga)) | 0),
                (d = (d + Math.imul(A, ia)) | 0),
                (e = (e + Math.imul(A, ja)) | 0),
                (e = (e + Math.imul(B, ia)) | 0),
                (f = (f + Math.imul(B, ja)) | 0),
                (d = (d + Math.imul(x, la)) | 0),
                (e = (e + Math.imul(x, ma)) | 0),
                (e = (e + Math.imul(y, la)) | 0),
                (f = (f + Math.imul(y, ma)) | 0),
                (d = (d + Math.imul(u, oa)) | 0),
                (e = (e + Math.imul(u, pa)) | 0),
                (e = (e + Math.imul(v, oa)) | 0),
                (f = (f + Math.imul(v, pa)) | 0);
              var Ca = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (Ca >>> 26)) | 0),
                (Ca &= 67108863),
                (d = Math.imul(M, _)),
                (e = Math.imul(M, aa)),
                (e = (e + Math.imul(N, _)) | 0),
                (f = Math.imul(N, aa)),
                (d = (d + Math.imul(J, ca)) | 0),
                (e = (e + Math.imul(J, da)) | 0),
                (e = (e + Math.imul(K, ca)) | 0),
                (f = (f + Math.imul(K, da)) | 0),
                (d = (d + Math.imul(G, fa)) | 0),
                (e = (e + Math.imul(G, ga)) | 0),
                (e = (e + Math.imul(H, fa)) | 0),
                (f = (f + Math.imul(H, ga)) | 0),
                (d = (d + Math.imul(D, ia)) | 0),
                (e = (e + Math.imul(D, ja)) | 0),
                (e = (e + Math.imul(E, ia)) | 0),
                (f = (f + Math.imul(E, ja)) | 0),
                (d = (d + Math.imul(A, la)) | 0),
                (e = (e + Math.imul(A, ma)) | 0),
                (e = (e + Math.imul(B, la)) | 0),
                (f = (f + Math.imul(B, ma)) | 0),
                (d = (d + Math.imul(x, oa)) | 0),
                (e = (e + Math.imul(x, pa)) | 0),
                (e = (e + Math.imul(y, oa)) | 0),
                (f = (f + Math.imul(y, pa)) | 0);
              var Da = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (Da >>> 26)) | 0),
                (Da &= 67108863),
                (d = Math.imul(M, ca)),
                (e = Math.imul(M, da)),
                (e = (e + Math.imul(N, ca)) | 0),
                (f = Math.imul(N, da)),
                (d = (d + Math.imul(J, fa)) | 0),
                (e = (e + Math.imul(J, ga)) | 0),
                (e = (e + Math.imul(K, fa)) | 0),
                (f = (f + Math.imul(K, ga)) | 0),
                (d = (d + Math.imul(G, ia)) | 0),
                (e = (e + Math.imul(G, ja)) | 0),
                (e = (e + Math.imul(H, ia)) | 0),
                (f = (f + Math.imul(H, ja)) | 0),
                (d = (d + Math.imul(D, la)) | 0),
                (e = (e + Math.imul(D, ma)) | 0),
                (e = (e + Math.imul(E, la)) | 0),
                (f = (f + Math.imul(E, ma)) | 0),
                (d = (d + Math.imul(A, oa)) | 0),
                (e = (e + Math.imul(A, pa)) | 0),
                (e = (e + Math.imul(B, oa)) | 0),
                (f = (f + Math.imul(B, pa)) | 0);
              var Ea = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (Ea >>> 26)) | 0),
                (Ea &= 67108863),
                (d = Math.imul(M, fa)),
                (e = Math.imul(M, ga)),
                (e = (e + Math.imul(N, fa)) | 0),
                (f = Math.imul(N, ga)),
                (d = (d + Math.imul(J, ia)) | 0),
                (e = (e + Math.imul(J, ja)) | 0),
                (e = (e + Math.imul(K, ia)) | 0),
                (f = (f + Math.imul(K, ja)) | 0),
                (d = (d + Math.imul(G, la)) | 0),
                (e = (e + Math.imul(G, ma)) | 0),
                (e = (e + Math.imul(H, la)) | 0),
                (f = (f + Math.imul(H, ma)) | 0),
                (d = (d + Math.imul(D, oa)) | 0),
                (e = (e + Math.imul(D, pa)) | 0),
                (e = (e + Math.imul(E, oa)) | 0),
                (f = (f + Math.imul(E, pa)) | 0);
              var Fa = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (Fa >>> 26)) | 0),
                (Fa &= 67108863),
                (d = Math.imul(M, ia)),
                (e = Math.imul(M, ja)),
                (e = (e + Math.imul(N, ia)) | 0),
                (f = Math.imul(N, ja)),
                (d = (d + Math.imul(J, la)) | 0),
                (e = (e + Math.imul(J, ma)) | 0),
                (e = (e + Math.imul(K, la)) | 0),
                (f = (f + Math.imul(K, ma)) | 0),
                (d = (d + Math.imul(G, oa)) | 0),
                (e = (e + Math.imul(G, pa)) | 0),
                (e = (e + Math.imul(H, oa)) | 0),
                (f = (f + Math.imul(H, pa)) | 0);
              var Ga = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (Ga >>> 26)) | 0),
                (Ga &= 67108863),
                (d = Math.imul(M, la)),
                (e = Math.imul(M, ma)),
                (e = (e + Math.imul(N, la)) | 0),
                (f = Math.imul(N, ma)),
                (d = (d + Math.imul(J, oa)) | 0),
                (e = (e + Math.imul(J, pa)) | 0),
                (e = (e + Math.imul(K, oa)) | 0),
                (f = (f + Math.imul(K, pa)) | 0);
              var Ha = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              (j = (((f + (e >>> 13)) | 0) + (Ha >>> 26)) | 0),
                (Ha &= 67108863),
                (d = Math.imul(M, oa)),
                (e = Math.imul(M, pa)),
                (e = (e + Math.imul(N, oa)) | 0),
                (f = Math.imul(N, pa));
              var Ia = (((j + d) | 0) + ((8191 & e) << 13)) | 0;
              return (
                (j = (((f + (e >>> 13)) | 0) + (Ia >>> 26)) | 0),
                (Ia &= 67108863),
                (i[0] = qa),
                (i[1] = ra),
                (i[2] = sa),
                (i[3] = ta),
                (i[4] = ua),
                (i[5] = va),
                (i[6] = wa),
                (i[7] = xa),
                (i[8] = ya),
                (i[9] = za),
                (i[10] = Aa),
                (i[11] = Ba),
                (i[12] = Ca),
                (i[13] = Da),
                (i[14] = Ea),
                (i[15] = Fa),
                (i[16] = Ga),
                (i[17] = Ha),
                (i[18] = Ia),
                0 !== j && ((i[19] = j), c.length++),
                c
              );
            };
            Math.imul || (z = j),
              (f.prototype.mulTo = function (a, b) {
                var c,
                  d = this.length + a.length;
                return (c =
                  10 === this.length && 10 === a.length
                    ? z(this, a, b)
                    : d < 63
                    ? j(this, a, b)
                    : d < 1024
                    ? k(this, a, b)
                    : l(this, a, b));
              }),
              (m.prototype.makeRBT = function (a) {
                for (
                  var b = new Array(a),
                    c = f.prototype._countBits(a) - 1,
                    d = 0;
                  d < a;
                  d++
                )
                  b[d] = this.revBin(d, c, a);
                return b;
              }),
              (m.prototype.revBin = function (a, b, c) {
                if (0 === a || a === c - 1) return a;
                for (var d = 0, e = 0; e < b; e++)
                  (d |= (1 & a) << (b - e - 1)), (a >>= 1);
                return d;
              }),
              (m.prototype.permute = function (a, b, c, d, e, f) {
                for (var g = 0; g < f; g++) (d[g] = b[a[g]]), (e[g] = c[a[g]]);
              }),
              (m.prototype.transform = function (a, b, c, d, e, f) {
                this.permute(f, a, b, c, d, e);
                for (var g = 1; g < e; g <<= 1)
                  for (
                    var h = g << 1,
                      i = Math.cos((2 * Math.PI) / h),
                      j = Math.sin((2 * Math.PI) / h),
                      k = 0;
                    k < e;
                    k += h
                  )
                    for (var l = i, m = j, n = 0; n < g; n++) {
                      var o = c[k + n],
                        p = d[k + n],
                        q = c[k + n + g],
                        r = d[k + n + g],
                        s = l * q - m * r;
                      (r = l * r + m * q),
                        (q = s),
                        (c[k + n] = o + q),
                        (d[k + n] = p + r),
                        (c[k + n + g] = o - q),
                        (d[k + n + g] = p - r),
                        n !== h &&
                          ((s = i * l - j * m), (m = i * m + j * l), (l = s));
                    }
              }),
              (m.prototype.guessLen13b = function (a, b) {
                var c = 1 | Math.max(b, a),
                  d = 1 & c,
                  e = 0;
                for (c = (c / 2) | 0; c; c >>>= 1) e++;
                return 1 << (e + 1 + d);
              }),
              (m.prototype.conjugate = function (a, b, c) {
                if (!(c <= 1))
                  for (var d = 0; d < c / 2; d++) {
                    var e = a[d];
                    (a[d] = a[c - d - 1]),
                      (a[c - d - 1] = e),
                      (e = b[d]),
                      (b[d] = -b[c - d - 1]),
                      (b[c - d - 1] = -e);
                  }
              }),
              (m.prototype.normalize13b = function (a, b) {
                for (var c = 0, d = 0; d < b / 2; d++) {
                  var e =
                    8192 * Math.round(a[2 * d + 1] / b) +
                    Math.round(a[2 * d] / b) +
                    c;
                  (a[d] = 67108863 & e),
                    (c = e < 67108864 ? 0 : (e / 67108864) | 0);
                }
                return a;
              }),
              (m.prototype.convert13b = function (a, b, c, e) {
                for (var f = 0, g = 0; g < b; g++)
                  (f += 0 | a[g]),
                    (c[2 * g] = 8191 & f),
                    (f >>>= 13),
                    (c[2 * g + 1] = 8191 & f),
                    (f >>>= 13);
                for (g = 2 * b; g < e; ++g) c[g] = 0;
                d(0 === f), d(0 === (f & -8192));
              }),
              (m.prototype.stub = function (a) {
                for (var b = new Array(a), c = 0; c < a; c++) b[c] = 0;
                return b;
              }),
              (m.prototype.mulp = function (a, b, c) {
                var d = 2 * this.guessLen13b(a.length, b.length),
                  e = this.makeRBT(d),
                  f = this.stub(d),
                  g = new Array(d),
                  h = new Array(d),
                  i = new Array(d),
                  j = new Array(d),
                  k = new Array(d),
                  l = new Array(d),
                  m = c.words;
                (m.length = d),
                  this.convert13b(a.words, a.length, g, d),
                  this.convert13b(b.words, b.length, j, d),
                  this.transform(g, f, h, i, d, e),
                  this.transform(j, f, k, l, d, e);
                for (var n = 0; n < d; n++) {
                  var o = h[n] * k[n] - i[n] * l[n];
                  (i[n] = h[n] * l[n] + i[n] * k[n]), (h[n] = o);
                }
                return (
                  this.conjugate(h, i, d),
                  this.transform(h, i, m, f, d, e),
                  this.conjugate(m, f, d),
                  this.normalize13b(m, d),
                  (c.negative = a.negative ^ b.negative),
                  (c.length = a.length + b.length),
                  c.strip()
                );
              }),
              (f.prototype.mul = function (a) {
                var b = new f(null);
                return (
                  (b.words = new Array(this.length + a.length)),
                  this.mulTo(a, b)
                );
              }),
              (f.prototype.mulf = function (a) {
                var b = new f(null);
                return (
                  (b.words = new Array(this.length + a.length)), l(this, a, b)
                );
              }),
              (f.prototype.imul = function (a) {
                return this.clone().mulTo(a, this);
              }),
              (f.prototype.imuln = function (a) {
                d("number" == typeof a), d(a < 67108864);
                for (var b = 0, c = 0; c < this.length; c++) {
                  var e = (0 | this.words[c]) * a,
                    f = (67108863 & e) + (67108863 & b);
                  (b >>= 26),
                    (b += (e / 67108864) | 0),
                    (b += f >>> 26),
                    (this.words[c] = 67108863 & f);
                }
                return 0 !== b && ((this.words[c] = b), this.length++), this;
              }),
              (f.prototype.muln = function (a) {
                return this.clone().imuln(a);
              }),
              (f.prototype.sqr = function () {
                return this.mul(this);
              }),
              (f.prototype.isqr = function () {
                return this.imul(this.clone());
              }),
              (f.prototype.pow = function (a) {
                var b = i(a);
                if (0 === b.length) return new f(1);
                for (
                  var c = this, d = 0;
                  d < b.length && 0 === b[d];
                  d++, c = c.sqr()
                );
                if (++d < b.length)
                  for (var e = c.sqr(); d < b.length; d++, e = e.sqr())
                    0 !== b[d] && (c = c.mul(e));
                return c;
              }),
              (f.prototype.iushln = function (a) {
                d("number" == typeof a && a >= 0);
                var b,
                  c = a % 26,
                  e = (a - c) / 26,
                  f = (67108863 >>> (26 - c)) << (26 - c);
                if (0 !== c) {
                  var g = 0;
                  for (b = 0; b < this.length; b++) {
                    var h = this.words[b] & f,
                      i = ((0 | this.words[b]) - h) << c;
                    (this.words[b] = i | g), (g = h >>> (26 - c));
                  }
                  g && ((this.words[b] = g), this.length++);
                }
                if (0 !== e) {
                  for (b = this.length - 1; b >= 0; b--)
                    this.words[b + e] = this.words[b];
                  for (b = 0; b < e; b++) this.words[b] = 0;
                  this.length += e;
                }
                return this.strip();
              }),
              (f.prototype.ishln = function (a) {
                return d(0 === this.negative), this.iushln(a);
              }),
              (f.prototype.iushrn = function (a, b, c) {
                d("number" == typeof a && a >= 0);
                var e;
                e = b ? (b - (b % 26)) / 26 : 0;
                var f = a % 26,
                  g = Math.min((a - f) / 26, this.length),
                  h = 67108863 ^ ((67108863 >>> f) << f),
                  i = c;
                if (((e -= g), (e = Math.max(0, e)), i)) {
                  for (var j = 0; j < g; j++) i.words[j] = this.words[j];
                  i.length = g;
                }
                if (0 === g);
                else if (this.length > g)
                  for (this.length -= g, j = 0; j < this.length; j++)
                    this.words[j] = this.words[j + g];
                else (this.words[0] = 0), (this.length = 1);
                var k = 0;
                for (j = this.length - 1; j >= 0 && (0 !== k || j >= e); j--) {
                  var l = 0 | this.words[j];
                  (this.words[j] = (k << (26 - f)) | (l >>> f)), (k = l & h);
                }
                return (
                  i && 0 !== k && (i.words[i.length++] = k),
                  0 === this.length && ((this.words[0] = 0), (this.length = 1)),
                  this.strip()
                );
              }),
              (f.prototype.ishrn = function (a, b, c) {
                return d(0 === this.negative), this.iushrn(a, b, c);
              }),
              (f.prototype.shln = function (a) {
                return this.clone().ishln(a);
              }),
              (f.prototype.ushln = function (a) {
                return this.clone().iushln(a);
              }),
              (f.prototype.shrn = function (a) {
                return this.clone().ishrn(a);
              }),
              (f.prototype.ushrn = function (a) {
                return this.clone().iushrn(a);
              }),
              (f.prototype.testn = function (a) {
                d("number" == typeof a && a >= 0);
                var b = a % 26,
                  c = (a - b) / 26,
                  e = 1 << b;
                if (this.length <= c) return !1;
                var f = this.words[c];
                return !!(f & e);
              }),
              (f.prototype.imaskn = function (a) {
                d("number" == typeof a && a >= 0);
                var b = a % 26,
                  c = (a - b) / 26;
                if (
                  (d(
                    0 === this.negative,
                    "imaskn works only with positive numbers"
                  ),
                  this.length <= c)
                )
                  return this;
                if (
                  (0 !== b && c++,
                  (this.length = Math.min(c, this.length)),
                  0 !== b)
                ) {
                  var e = 67108863 ^ ((67108863 >>> b) << b);
                  this.words[this.length - 1] &= e;
                }
                return this.strip();
              }),
              (f.prototype.maskn = function (a) {
                return this.clone().imaskn(a);
              }),
              (f.prototype.iaddn = function (a) {
                return (
                  d("number" == typeof a),
                  d(a < 67108864),
                  a < 0
                    ? this.isubn(-a)
                    : 0 !== this.negative
                    ? 1 === this.length && (0 | this.words[0]) < a
                      ? ((this.words[0] = a - (0 | this.words[0])),
                        (this.negative = 0),
                        this)
                      : ((this.negative = 0),
                        this.isubn(a),
                        (this.negative = 1),
                        this)
                    : this._iaddn(a)
                );
              }),
              (f.prototype._iaddn = function (a) {
                this.words[0] += a;
                for (
                  var b = 0;
                  b < this.length && this.words[b] >= 67108864;
                  b++
                )
                  (this.words[b] -= 67108864),
                    b === this.length - 1
                      ? (this.words[b + 1] = 1)
                      : this.words[b + 1]++;
                return (this.length = Math.max(this.length, b + 1)), this;
              }),
              (f.prototype.isubn = function (a) {
                if ((d("number" == typeof a), d(a < 67108864), a < 0))
                  return this.iaddn(-a);
                if (0 !== this.negative)
                  return (
                    (this.negative = 0),
                    this.iaddn(a),
                    (this.negative = 1),
                    this
                  );
                if (
                  ((this.words[0] -= a), 1 === this.length && this.words[0] < 0)
                )
                  (this.words[0] = -this.words[0]), (this.negative = 1);
                else
                  for (var b = 0; b < this.length && this.words[b] < 0; b++)
                    (this.words[b] += 67108864), (this.words[b + 1] -= 1);
                return this.strip();
              }),
              (f.prototype.addn = function (a) {
                return this.clone().iaddn(a);
              }),
              (f.prototype.subn = function (a) {
                return this.clone().isubn(a);
              }),
              (f.prototype.iabs = function () {
                return (this.negative = 0), this;
              }),
              (f.prototype.abs = function () {
                return this.clone().iabs();
              }),
              (f.prototype._ishlnsubmul = function (a, b, c) {
                var e,
                  f = a.length + c;
                this._expand(f);
                var g,
                  h = 0;
                for (e = 0; e < a.length; e++) {
                  g = (0 | this.words[e + c]) + h;
                  var i = (0 | a.words[e]) * b;
                  (g -= 67108863 & i),
                    (h = (g >> 26) - ((i / 67108864) | 0)),
                    (this.words[e + c] = 67108863 & g);
                }
                for (; e < this.length - c; e++)
                  (g = (0 | this.words[e + c]) + h),
                    (h = g >> 26),
                    (this.words[e + c] = 67108863 & g);
                if (0 === h) return this.strip();
                for (d(h === -1), h = 0, e = 0; e < this.length; e++)
                  (g = -(0 | this.words[e]) + h),
                    (h = g >> 26),
                    (this.words[e] = 67108863 & g);
                return (this.negative = 1), this.strip();
              }),
              (f.prototype._wordDiv = function (a, b) {
                var c = this.length - a.length,
                  d = this.clone(),
                  e = a,
                  g = 0 | e.words[e.length - 1],
                  h = this._countBits(g);
                (c = 26 - h),
                  0 !== c &&
                    ((e = e.ushln(c)),
                    d.iushln(c),
                    (g = 0 | e.words[e.length - 1]));
                var i,
                  j = d.length - e.length;
                if ("mod" !== b) {
                  (i = new f(null)),
                    (i.length = j + 1),
                    (i.words = new Array(i.length));
                  for (var k = 0; k < i.length; k++) i.words[k] = 0;
                }
                var l = d.clone()._ishlnsubmul(e, 1, j);
                0 === l.negative && ((d = l), i && (i.words[j] = 1));
                for (var m = j - 1; m >= 0; m--) {
                  var n =
                    67108864 * (0 | d.words[e.length + m]) +
                    (0 | d.words[e.length + m - 1]);
                  for (
                    n = Math.min((n / g) | 0, 67108863),
                      d._ishlnsubmul(e, n, m);
                    0 !== d.negative;

                  )
                    n--,
                      (d.negative = 0),
                      d._ishlnsubmul(e, 1, m),
                      d.isZero() || (d.negative ^= 1);
                  i && (i.words[m] = n);
                }
                return (
                  i && i.strip(),
                  d.strip(),
                  "div" !== b && 0 !== c && d.iushrn(c),
                  { div: i || null, mod: d }
                );
              }),
              (f.prototype.divmod = function (a, b, c) {
                if ((d(!a.isZero()), this.isZero()))
                  return { div: new f(0), mod: new f(0) };
                var e, g, h;
                return 0 !== this.negative && 0 === a.negative
                  ? ((h = this.neg().divmod(a, b)),
                    "mod" !== b && (e = h.div.neg()),
                    "div" !== b &&
                      ((g = h.mod.neg()), c && 0 !== g.negative && g.iadd(a)),
                    { div: e, mod: g })
                  : 0 === this.negative && 0 !== a.negative
                  ? ((h = this.divmod(a.neg(), b)),
                    "mod" !== b && (e = h.div.neg()),
                    { div: e, mod: h.mod })
                  : 0 !== (this.negative & a.negative)
                  ? ((h = this.neg().divmod(a.neg(), b)),
                    "div" !== b &&
                      ((g = h.mod.neg()), c && 0 !== g.negative && g.isub(a)),
                    { div: h.div, mod: g })
                  : a.length > this.length || this.cmp(a) < 0
                  ? { div: new f(0), mod: this }
                  : 1 === a.length
                  ? "div" === b
                    ? { div: this.divn(a.words[0]), mod: null }
                    : "mod" === b
                    ? { div: null, mod: new f(this.modn(a.words[0])) }
                    : {
                        div: this.divn(a.words[0]),
                        mod: new f(this.modn(a.words[0])),
                      }
                  : this._wordDiv(a, b);
              }),
              (f.prototype.div = function (a) {
                return this.divmod(a, "div", !1).div;
              }),
              (f.prototype.mod = function (a) {
                return this.divmod(a, "mod", !1).mod;
              }),
              (f.prototype.umod = function (a) {
                return this.divmod(a, "mod", !0).mod;
              }),
              (f.prototype.divRound = function (a) {
                var b = this.divmod(a);
                if (b.mod.isZero()) return b.div;
                var c = 0 !== b.div.negative ? b.mod.isub(a) : b.mod,
                  d = a.ushrn(1),
                  e = a.andln(1),
                  f = c.cmp(d);
                return f < 0 || (1 === e && 0 === f)
                  ? b.div
                  : 0 !== b.div.negative
                  ? b.div.isubn(1)
                  : b.div.iaddn(1);
              }),
              (f.prototype.modn = function (a) {
                d(a <= 67108863);
                for (
                  var b = (1 << 26) % a, c = 0, e = this.length - 1;
                  e >= 0;
                  e--
                )
                  c = (b * c + (0 | this.words[e])) % a;
                return c;
              }),
              (f.prototype.idivn = function (a) {
                d(a <= 67108863);
                for (var b = 0, c = this.length - 1; c >= 0; c--) {
                  var e = (0 | this.words[c]) + 67108864 * b;
                  (this.words[c] = (e / a) | 0), (b = e % a);
                }
                return this.strip();
              }),
              (f.prototype.divn = function (a) {
                return this.clone().idivn(a);
              }),
              (f.prototype.egcd = function (a) {
                d(0 === a.negative), d(!a.isZero());
                var b = this,
                  c = a.clone();
                b = 0 !== b.negative ? b.umod(a) : b.clone();
                for (
                  var e = new f(1),
                    g = new f(0),
                    h = new f(0),
                    i = new f(1),
                    j = 0;
                  b.isEven() && c.isEven();

                )
                  b.iushrn(1), c.iushrn(1), ++j;
                for (var k = c.clone(), l = b.clone(); !b.isZero(); ) {
                  for (
                    var m = 0, n = 1;
                    0 === (b.words[0] & n) && m < 26;
                    ++m, n <<= 1
                  );
                  if (m > 0)
                    for (b.iushrn(m); m-- > 0; )
                      (e.isOdd() || g.isOdd()) && (e.iadd(k), g.isub(l)),
                        e.iushrn(1),
                        g.iushrn(1);
                  for (
                    var o = 0, p = 1;
                    0 === (c.words[0] & p) && o < 26;
                    ++o, p <<= 1
                  );
                  if (o > 0)
                    for (c.iushrn(o); o-- > 0; )
                      (h.isOdd() || i.isOdd()) && (h.iadd(k), i.isub(l)),
                        h.iushrn(1),
                        i.iushrn(1);
                  b.cmp(c) >= 0
                    ? (b.isub(c), e.isub(h), g.isub(i))
                    : (c.isub(b), h.isub(e), i.isub(g));
                }
                return { a: h, b: i, gcd: c.iushln(j) };
              }),
              (f.prototype._invmp = function (a) {
                d(0 === a.negative), d(!a.isZero());
                var b = this,
                  c = a.clone();
                b = 0 !== b.negative ? b.umod(a) : b.clone();
                for (
                  var e = new f(1), g = new f(0), h = c.clone();
                  b.cmpn(1) > 0 && c.cmpn(1) > 0;

                ) {
                  for (
                    var i = 0, j = 1;
                    0 === (b.words[0] & j) && i < 26;
                    ++i, j <<= 1
                  );
                  if (i > 0)
                    for (b.iushrn(i); i-- > 0; )
                      e.isOdd() && e.iadd(h), e.iushrn(1);
                  for (
                    var k = 0, l = 1;
                    0 === (c.words[0] & l) && k < 26;
                    ++k, l <<= 1
                  );
                  if (k > 0)
                    for (c.iushrn(k); k-- > 0; )
                      g.isOdd() && g.iadd(h), g.iushrn(1);
                  b.cmp(c) >= 0
                    ? (b.isub(c), e.isub(g))
                    : (c.isub(b), g.isub(e));
                }
                var m;
                return (
                  (m = 0 === b.cmpn(1) ? e : g), m.cmpn(0) < 0 && m.iadd(a), m
                );
              }),
              (f.prototype.gcd = function (a) {
                if (this.isZero()) return a.abs();
                if (a.isZero()) return this.abs();
                var b = this.clone(),
                  c = a.clone();
                (b.negative = 0), (c.negative = 0);
                for (var d = 0; b.isEven() && c.isEven(); d++)
                  b.iushrn(1), c.iushrn(1);
                for (;;) {
                  for (; b.isEven(); ) b.iushrn(1);
                  for (; c.isEven(); ) c.iushrn(1);
                  var e = b.cmp(c);
                  if (e < 0) {
                    var f = b;
                    (b = c), (c = f);
                  } else if (0 === e || 0 === c.cmpn(1)) break;
                  b.isub(c);
                }
                return c.iushln(d);
              }),
              (f.prototype.invm = function (a) {
                return this.egcd(a).a.umod(a);
              }),
              (f.prototype.isEven = function () {
                return 0 === (1 & this.words[0]);
              }),
              (f.prototype.isOdd = function () {
                return 1 === (1 & this.words[0]);
              }),
              (f.prototype.andln = function (a) {
                return this.words[0] & a;
              }),
              (f.prototype.bincn = function (a) {
                d("number" == typeof a);
                var b = a % 26,
                  c = (a - b) / 26,
                  e = 1 << b;
                if (this.length <= c)
                  return this._expand(c + 1), (this.words[c] |= e), this;
                for (var f = e, g = c; 0 !== f && g < this.length; g++) {
                  var h = 0 | this.words[g];
                  (h += f),
                    (f = h >>> 26),
                    (h &= 67108863),
                    (this.words[g] = h);
                }
                return 0 !== f && ((this.words[g] = f), this.length++), this;
              }),
              (f.prototype.isZero = function () {
                return 1 === this.length && 0 === this.words[0];
              }),
              (f.prototype.cmpn = function (a) {
                var b = a < 0;
                if (0 !== this.negative && !b) return -1;
                if (0 === this.negative && b) return 1;
                this.strip();
                var c;
                if (this.length > 1) c = 1;
                else {
                  b && (a = -a), d(a <= 67108863, "Number is too big");
                  var e = 0 | this.words[0];
                  c = e === a ? 0 : e < a ? -1 : 1;
                }
                return 0 !== this.negative ? 0 | -c : c;
              }),
              (f.prototype.cmp = function (a) {
                if (0 !== this.negative && 0 === a.negative) return -1;
                if (0 === this.negative && 0 !== a.negative) return 1;
                var b = this.ucmp(a);
                return 0 !== this.negative ? 0 | -b : b;
              }),
              (f.prototype.ucmp = function (a) {
                if (this.length > a.length) return 1;
                if (this.length < a.length) return -1;
                for (var b = 0, c = this.length - 1; c >= 0; c--) {
                  var d = 0 | this.words[c],
                    e = 0 | a.words[c];
                  if (d !== e) {
                    d < e ? (b = -1) : d > e && (b = 1);
                    break;
                  }
                }
                return b;
              }),
              (f.prototype.gtn = function (a) {
                return 1 === this.cmpn(a);
              }),
              (f.prototype.gt = function (a) {
                return 1 === this.cmp(a);
              }),
              (f.prototype.gten = function (a) {
                return this.cmpn(a) >= 0;
              }),
              (f.prototype.gte = function (a) {
                return this.cmp(a) >= 0;
              }),
              (f.prototype.ltn = function (a) {
                return this.cmpn(a) === -1;
              }),
              (f.prototype.lt = function (a) {
                return this.cmp(a) === -1;
              }),
              (f.prototype.lten = function (a) {
                return this.cmpn(a) <= 0;
              }),
              (f.prototype.lte = function (a) {
                return this.cmp(a) <= 0;
              }),
              (f.prototype.eqn = function (a) {
                return 0 === this.cmpn(a);
              }),
              (f.prototype.eq = function (a) {
                return 0 === this.cmp(a);
              }),
              (f.red = function (a) {
                return new s(a);
              }),
              (f.prototype.toRed = function (a) {
                return (
                  d(!this.red, "Already a number in reduction context"),
                  d(0 === this.negative, "red works only with positives"),
                  a.convertTo(this)._forceRed(a)
                );
              }),
              (f.prototype.fromRed = function () {
                return (
                  d(
                    this.red,
                    "fromRed works only with numbers in reduction context"
                  ),
                  this.red.convertFrom(this)
                );
              }),
              (f.prototype._forceRed = function (a) {
                return (this.red = a), this;
              }),
              (f.prototype.forceRed = function (a) {
                return (
                  d(!this.red, "Already a number in reduction context"),
                  this._forceRed(a)
                );
              }),
              (f.prototype.redAdd = function (a) {
                return (
                  d(this.red, "redAdd works only with red numbers"),
                  this.red.add(this, a)
                );
              }),
              (f.prototype.redIAdd = function (a) {
                return (
                  d(this.red, "redIAdd works only with red numbers"),
                  this.red.iadd(this, a)
                );
              }),
              (f.prototype.redSub = function (a) {
                return (
                  d(this.red, "redSub works only with red numbers"),
                  this.red.sub(this, a)
                );
              }),
              (f.prototype.redISub = function (a) {
                return (
                  d(this.red, "redISub works only with red numbers"),
                  this.red.isub(this, a)
                );
              }),
              (f.prototype.redShl = function (a) {
                return (
                  d(this.red, "redShl works only with red numbers"),
                  this.red.shl(this, a)
                );
              }),
              (f.prototype.redMul = function (a) {
                return (
                  d(this.red, "redMul works only with red numbers"),
                  this.red._verify2(this, a),
                  this.red.mul(this, a)
                );
              }),
              (f.prototype.redIMul = function (a) {
                return (
                  d(this.red, "redMul works only with red numbers"),
                  this.red._verify2(this, a),
                  this.red.imul(this, a)
                );
              }),
              (f.prototype.redSqr = function () {
                return (
                  d(this.red, "redSqr works only with red numbers"),
                  this.red._verify1(this),
                  this.red.sqr(this)
                );
              }),
              (f.prototype.redISqr = function () {
                return (
                  d(this.red, "redISqr works only with red numbers"),
                  this.red._verify1(this),
                  this.red.isqr(this)
                );
              }),
              (f.prototype.redSqrt = function () {
                return (
                  d(this.red, "redSqrt works only with red numbers"),
                  this.red._verify1(this),
                  this.red.sqrt(this)
                );
              }),
              (f.prototype.redInvm = function () {
                return (
                  d(this.red, "redInvm works only with red numbers"),
                  this.red._verify1(this),
                  this.red.invm(this)
                );
              }),
              (f.prototype.redNeg = function () {
                return (
                  d(this.red, "redNeg works only with red numbers"),
                  this.red._verify1(this),
                  this.red.neg(this)
                );
              }),
              (f.prototype.redPow = function (a) {
                return (
                  d(this.red && !a.red, "redPow(normalNum)"),
                  this.red._verify1(this),
                  this.red.pow(this, a)
                );
              });
            var A = { k256: null, p224: null, p192: null, p25519: null };
            (n.prototype._tmp = function () {
              var a = new f(null);
              return (a.words = new Array(Math.ceil(this.n / 13))), a;
            }),
              (n.prototype.ireduce = function (a) {
                var b,
                  c = a;
                do
                  this.split(c, this.tmp),
                    (c = this.imulK(c)),
                    (c = c.iadd(this.tmp)),
                    (b = c.bitLength());
                while (b > this.n);
                var d = b < this.n ? -1 : c.ucmp(this.p);
                return (
                  0 === d
                    ? ((c.words[0] = 0), (c.length = 1))
                    : d > 0
                    ? c.isub(this.p)
                    : c.strip(),
                  c
                );
              }),
              (n.prototype.split = function (a, b) {
                a.iushrn(this.n, 0, b);
              }),
              (n.prototype.imulK = function (a) {
                return a.imul(this.k);
              }),
              e(o, n),
              (o.prototype.split = function (a, b) {
                for (
                  var c = 4194303, d = Math.min(a.length, 9), e = 0;
                  e < d;
                  e++
                )
                  b.words[e] = a.words[e];
                if (((b.length = d), a.length <= 9))
                  return (a.words[0] = 0), void (a.length = 1);
                var f = a.words[9];
                for (b.words[b.length++] = f & c, e = 10; e < a.length; e++) {
                  var g = 0 | a.words[e];
                  (a.words[e - 10] = ((g & c) << 4) | (f >>> 22)), (f = g);
                }
                (f >>>= 22),
                  (a.words[e - 10] = f),
                  0 === f && a.length > 10 ? (a.length -= 10) : (a.length -= 9);
              }),
              (o.prototype.imulK = function (a) {
                (a.words[a.length] = 0),
                  (a.words[a.length + 1] = 0),
                  (a.length += 2);
                for (var b = 0, c = 0; c < a.length; c++) {
                  var d = 0 | a.words[c];
                  (b += 977 * d),
                    (a.words[c] = 67108863 & b),
                    (b = 64 * d + ((b / 67108864) | 0));
                }
                return (
                  0 === a.words[a.length - 1] &&
                    (a.length--, 0 === a.words[a.length - 1] && a.length--),
                  a
                );
              }),
              e(p, n),
              e(q, n),
              e(r, n),
              (r.prototype.imulK = function (a) {
                for (var b = 0, c = 0; c < a.length; c++) {
                  var d = 19 * (0 | a.words[c]) + b,
                    e = 67108863 & d;
                  (d >>>= 26), (a.words[c] = e), (b = d);
                }
                return 0 !== b && (a.words[a.length++] = b), a;
              }),
              (f._prime = function B(a) {
                if (A[a]) return A[a];
                var B;
                if ("k256" === a) B = new o();
                else if ("p224" === a) B = new p();
                else if ("p192" === a) B = new q();
                else {
                  if ("p25519" !== a) throw new Error("Unknown prime " + a);
                  B = new r();
                }
                return (A[a] = B), B;
              }),
              (s.prototype._verify1 = function (a) {
                d(0 === a.negative, "red works only with positives"),
                  d(a.red, "red works only with red numbers");
              }),
              (s.prototype._verify2 = function (a, b) {
                d(
                  0 === (a.negative | b.negative),
                  "red works only with positives"
                ),
                  d(
                    a.red && a.red === b.red,
                    "red works only with red numbers"
                  );
              }),
              (s.prototype.imod = function (a) {
                return this.prime
                  ? this.prime.ireduce(a)._forceRed(this)
                  : a.umod(this.m)._forceRed(this);
              }),
              (s.prototype.neg = function (a) {
                return a.isZero() ? a.clone() : this.m.sub(a)._forceRed(this);
              }),
              (s.prototype.add = function (a, b) {
                this._verify2(a, b);
                var c = a.add(b);
                return c.cmp(this.m) >= 0 && c.isub(this.m), c._forceRed(this);
              }),
              (s.prototype.iadd = function (a, b) {
                this._verify2(a, b);
                var c = a.iadd(b);
                return c.cmp(this.m) >= 0 && c.isub(this.m), c;
              }),
              (s.prototype.sub = function (a, b) {
                this._verify2(a, b);
                var c = a.sub(b);
                return c.cmpn(0) < 0 && c.iadd(this.m), c._forceRed(this);
              }),
              (s.prototype.isub = function (a, b) {
                this._verify2(a, b);
                var c = a.isub(b);
                return c.cmpn(0) < 0 && c.iadd(this.m), c;
              }),
              (s.prototype.shl = function (a, b) {
                return this._verify1(a), this.imod(a.ushln(b));
              }),
              (s.prototype.imul = function (a, b) {
                return this._verify2(a, b), this.imod(a.imul(b));
              }),
              (s.prototype.mul = function (a, b) {
                return this._verify2(a, b), this.imod(a.mul(b));
              }),
              (s.prototype.isqr = function (a) {
                return this.imul(a, a.clone());
              }),
              (s.prototype.sqr = function (a) {
                return this.mul(a, a);
              }),
              (s.prototype.sqrt = function (a) {
                if (a.isZero()) return a.clone();
                var b = this.m.andln(3);
                if ((d(b % 2 === 1), 3 === b)) {
                  var c = this.m.add(new f(1)).iushrn(2);
                  return this.pow(a, c);
                }
                for (
                  var e = this.m.subn(1), g = 0;
                  !e.isZero() && 0 === e.andln(1);

                )
                  g++, e.iushrn(1);
                d(!e.isZero());
                var h = new f(1).toRed(this),
                  i = h.redNeg(),
                  j = this.m.subn(1).iushrn(1),
                  k = this.m.bitLength();
                for (
                  k = new f(2 * k * k).toRed(this);
                  0 !== this.pow(k, j).cmp(i);

                )
                  k.redIAdd(i);
                for (
                  var l = this.pow(k, e),
                    m = this.pow(a, e.addn(1).iushrn(1)),
                    n = this.pow(a, e),
                    o = g;
                  0 !== n.cmp(h);

                ) {
                  for (var p = n, q = 0; 0 !== p.cmp(h); q++) p = p.redSqr();
                  d(q < o);
                  var r = this.pow(l, new f(1).iushln(o - q - 1));
                  (m = m.redMul(r)),
                    (l = r.redSqr()),
                    (n = n.redMul(l)),
                    (o = q);
                }
                return m;
              }),
              (s.prototype.invm = function (a) {
                var b = a._invmp(this.m);
                return 0 !== b.negative
                  ? ((b.negative = 0), this.imod(b).redNeg())
                  : this.imod(b);
              }),
              (s.prototype.pow = function (a, b) {
                if (b.isZero()) return new f(1).toRed(this);
                if (0 === b.cmpn(1)) return a.clone();
                var c = 4,
                  d = new Array(1 << c);
                (d[0] = new f(1).toRed(this)), (d[1] = a);
                for (var e = 2; e < d.length; e++) d[e] = this.mul(d[e - 1], a);
                var g = d[0],
                  h = 0,
                  i = 0,
                  j = b.bitLength() % 26;
                for (0 === j && (j = 26), e = b.length - 1; e >= 0; e--) {
                  for (var k = b.words[e], l = j - 1; l >= 0; l--) {
                    var m = (k >> l) & 1;
                    g !== d[0] && (g = this.sqr(g)),
                      0 !== m || 0 !== h
                        ? ((h <<= 1),
                          (h |= m),
                          i++,
                          (i === c || (0 === e && 0 === l)) &&
                            ((g = this.mul(g, d[h])), (i = 0), (h = 0)))
                        : (i = 0);
                  }
                  j = 26;
                }
                return g;
              }),
              (s.prototype.convertTo = function (a) {
                var b = a.umod(this.m);
                return b === a ? b.clone() : b;
              }),
              (s.prototype.convertFrom = function (a) {
                var b = a.clone();
                return (b.red = null), b;
              }),
              (f.mont = function (a) {
                return new t(a);
              }),
              e(t, s),
              (t.prototype.convertTo = function (a) {
                return this.imod(a.ushln(this.shift));
              }),
              (t.prototype.convertFrom = function (a) {
                var b = this.imod(a.mul(this.rinv));
                return (b.red = null), b;
              }),
              (t.prototype.imul = function (a, b) {
                if (a.isZero() || b.isZero())
                  return (a.words[0] = 0), (a.length = 1), a;
                var c = a.imul(b),
                  d = c
                    .maskn(this.shift)
                    .mul(this.minv)
                    .imaskn(this.shift)
                    .mul(this.m),
                  e = c.isub(d).iushrn(this.shift),
                  f = e;
                return (
                  e.cmp(this.m) >= 0
                    ? (f = e.isub(this.m))
                    : e.cmpn(0) < 0 && (f = e.iadd(this.m)),
                  f._forceRed(this)
                );
              }),
              (t.prototype.mul = function (a, b) {
                if (a.isZero() || b.isZero()) return new f(0)._forceRed(this);
                var c = a.mul(b),
                  d = c
                    .maskn(this.shift)
                    .mul(this.minv)
                    .imaskn(this.shift)
                    .mul(this.m),
                  e = c.isub(d).iushrn(this.shift),
                  g = e;
                return (
                  e.cmp(this.m) >= 0
                    ? (g = e.isub(this.m))
                    : e.cmpn(0) < 0 && (g = e.iadd(this.m)),
                  g._forceRed(this)
                );
              }),
              (t.prototype.invm = function (a) {
                var b = this.imod(a._invmp(this.m).mul(this.r2));
                return b._forceRed(this);
              });
          })("undefined" == typeof b || b, this);
        },
        { buffer: 8 },
      ],
      7: [
        function (a, b, c) {
          var d = a("../../utils").randomBytes;
          b.exports = function (a) {
            return d(a);
          };
        },
        { "../../utils": 66 },
      ],
      8: [function (a, b, c) {}, {}],
      9: [
        function (a, b, c) {
          "use strict";
          var d = c;
          (d.version = a("../package.json").version),
            (d.utils = a("./elliptic/utils")),
            (d.rand = a("brorand")),
            (d.hmacDRBG = a("./elliptic/hmac-drbg")),
            (d.curve = a("./elliptic/curve")),
            (d.curves = a("./elliptic/curves")),
            (d.ec = a("./elliptic/ec")),
            (d.eddsa = a("./elliptic/eddsa"));
        },
        {
          "../package.json": 23,
          "./elliptic/curve": 12,
          "./elliptic/curves": 15,
          "./elliptic/ec": 16,
          "./elliptic/eddsa": 19,
          "./elliptic/hmac-drbg": 20,
          "./elliptic/utils": 22,
          brorand: 7,
        },
      ],
      10: [
        function (a, b, c) {
          "use strict";
          function d(a, b) {
            (this.type = a),
              (this.p = new f(b.p, 16)),
              (this.red = b.prime ? f.red(b.prime) : f.mont(this.p)),
              (this.zero = new f(0).toRed(this.red)),
              (this.one = new f(1).toRed(this.red)),
              (this.two = new f(2).toRed(this.red)),
              (this.n = b.n && new f(b.n, 16)),
              (this.g = b.g && this.pointFromJSON(b.g, b.gRed)),
              (this._wnafT1 = new Array(4)),
              (this._wnafT2 = new Array(4)),
              (this._wnafT3 = new Array(4)),
              (this._wnafT4 = new Array(4));
            var c = this.n && this.p.div(this.n);
            !c || c.cmpn(100) > 0
              ? (this.redN = null)
              : ((this._maxwellTrick = !0),
                (this.redN = this.n.toRed(this.red)));
          }
          function e(a, b) {
            (this.curve = a), (this.type = b), (this.precomputed = null);
          }
          var f = a("bn.js"),
            g = a("../../elliptic"),
            h = g.utils,
            i = h.getNAF,
            j = h.getJSF,
            k = h.assert;
          (b.exports = d),
            (d.prototype.point = function () {
              throw new Error("Not implemented");
            }),
            (d.prototype.validate = function () {
              throw new Error("Not implemented");
            }),
            (d.prototype._fixedNafMul = function (a, b) {
              k(a.precomputed);
              var c = a._getDoubles(),
                d = i(b, 1),
                e = (1 << (c.step + 1)) - (c.step % 2 === 0 ? 2 : 1);
              e /= 3;
              for (var f = [], g = 0; g < d.length; g += c.step) {
                for (var h = 0, b = g + c.step - 1; b >= g; b--)
                  h = (h << 1) + d[b];
                f.push(h);
              }
              for (
                var j = this.jpoint(null, null, null),
                  l = this.jpoint(null, null, null),
                  m = e;
                m > 0;
                m--
              ) {
                for (var g = 0; g < f.length; g++) {
                  var h = f[g];
                  h === m
                    ? (l = l.mixedAdd(c.points[g]))
                    : h === -m && (l = l.mixedAdd(c.points[g].neg()));
                }
                j = j.add(l);
              }
              return j.toP();
            }),
            (d.prototype._wnafMul = function (a, b) {
              var c = 4,
                d = a._getNAFPoints(c);
              c = d.wnd;
              for (
                var e = d.points,
                  f = i(b, c),
                  g = this.jpoint(null, null, null),
                  h = f.length - 1;
                h >= 0;
                h--
              ) {
                for (var b = 0; h >= 0 && 0 === f[h]; h--) b++;
                if ((h >= 0 && b++, (g = g.dblp(b)), h < 0)) break;
                var j = f[h];
                k(0 !== j),
                  (g =
                    "affine" === a.type
                      ? j > 0
                        ? g.mixedAdd(e[(j - 1) >> 1])
                        : g.mixedAdd(e[(-j - 1) >> 1].neg())
                      : j > 0
                      ? g.add(e[(j - 1) >> 1])
                      : g.add(e[(-j - 1) >> 1].neg()));
              }
              return "affine" === a.type ? g.toP() : g;
            }),
            (d.prototype._wnafMulAdd = function (a, b, c, d, e) {
              for (
                var f = this._wnafT1,
                  g = this._wnafT2,
                  h = this._wnafT3,
                  k = 0,
                  l = 0;
                l < d;
                l++
              ) {
                var m = b[l],
                  n = m._getNAFPoints(a);
                (f[l] = n.wnd), (g[l] = n.points);
              }
              for (var l = d - 1; l >= 1; l -= 2) {
                var o = l - 1,
                  p = l;
                if (1 === f[o] && 1 === f[p]) {
                  var q = [b[o], null, null, b[p]];
                  0 === b[o].y.cmp(b[p].y)
                    ? ((q[1] = b[o].add(b[p])),
                      (q[2] = b[o].toJ().mixedAdd(b[p].neg())))
                    : 0 === b[o].y.cmp(b[p].y.redNeg())
                    ? ((q[1] = b[o].toJ().mixedAdd(b[p])),
                      (q[2] = b[o].add(b[p].neg())))
                    : ((q[1] = b[o].toJ().mixedAdd(b[p])),
                      (q[2] = b[o].toJ().mixedAdd(b[p].neg())));
                  var r = [-3, -1, -5, -7, 0, 7, 5, 1, 3],
                    s = j(c[o], c[p]);
                  (k = Math.max(s[0].length, k)),
                    (h[o] = new Array(k)),
                    (h[p] = new Array(k));
                  for (var t = 0; t < k; t++) {
                    var u = 0 | s[0][t],
                      v = 0 | s[1][t];
                    (h[o][t] = r[3 * (u + 1) + (v + 1)]),
                      (h[p][t] = 0),
                      (g[o] = q);
                  }
                } else
                  (h[o] = i(c[o], f[o])),
                    (h[p] = i(c[p], f[p])),
                    (k = Math.max(h[o].length, k)),
                    (k = Math.max(h[p].length, k));
              }
              for (
                var w = this.jpoint(null, null, null), x = this._wnafT4, l = k;
                l >= 0;
                l--
              ) {
                for (var y = 0; l >= 0; ) {
                  for (var z = !0, t = 0; t < d; t++)
                    (x[t] = 0 | h[t][l]), 0 !== x[t] && (z = !1);
                  if (!z) break;
                  y++, l--;
                }
                if ((l >= 0 && y++, (w = w.dblp(y)), l < 0)) break;
                for (var t = 0; t < d; t++) {
                  var m,
                    A = x[t];
                  0 !== A &&
                    (A > 0
                      ? (m = g[t][(A - 1) >> 1])
                      : A < 0 && (m = g[t][(-A - 1) >> 1].neg()),
                    (w = "affine" === m.type ? w.mixedAdd(m) : w.add(m)));
                }
              }
              for (var l = 0; l < d; l++) g[l] = null;
              return e ? w : w.toP();
            }),
            (d.BasePoint = e),
            (e.prototype.eq = function () {
              throw new Error("Not implemented");
            }),
            (e.prototype.validate = function () {
              return this.curve.validate(this);
            }),
            (d.prototype.decodePoint = function (a, b) {
              a = h.toArray(a, b);
              var c = this.p.byteLength();
              if (
                (4 === a[0] || 6 === a[0] || 7 === a[0]) &&
                a.length - 1 === 2 * c
              ) {
                6 === a[0]
                  ? k(a[a.length - 1] % 2 === 0)
                  : 7 === a[0] && k(a[a.length - 1] % 2 === 1);
                var d = this.point(
                  a.slice(1, 1 + c),
                  a.slice(1 + c, 1 + 2 * c)
                );
                return d;
              }
              if ((2 === a[0] || 3 === a[0]) && a.length - 1 === c)
                return this.pointFromX(a.slice(1, 1 + c), 3 === a[0]);
              throw new Error("Unknown point format");
            }),
            (e.prototype.encodeCompressed = function (a) {
              return this.encode(a, !0);
            }),
            (e.prototype._encode = function (a) {
              var b = this.curve.p.byteLength(),
                c = this.getX().toArray("be", b);
              return a
                ? [this.getY().isEven() ? 2 : 3].concat(c)
                : [4].concat(c, this.getY().toArray("be", b));
            }),
            (e.prototype.encode = function (a, b) {
              return h.encode(this._encode(b), a);
            }),
            (e.prototype.precompute = function (a) {
              if (this.precomputed) return this;
              var b = { doubles: null, naf: null, beta: null };
              return (
                (b.naf = this._getNAFPoints(8)),
                (b.doubles = this._getDoubles(4, a)),
                (b.beta = this._getBeta()),
                (this.precomputed = b),
                this
              );
            }),
            (e.prototype._hasDoubles = function (a) {
              if (!this.precomputed) return !1;
              var b = this.precomputed.doubles;
              return (
                !!b &&
                b.points.length >= Math.ceil((a.bitLength() + 1) / b.step)
              );
            }),
            (e.prototype._getDoubles = function (a, b) {
              if (this.precomputed && this.precomputed.doubles)
                return this.precomputed.doubles;
              for (var c = [this], d = this, e = 0; e < b; e += a) {
                for (var f = 0; f < a; f++) d = d.dbl();
                c.push(d);
              }
              return { step: a, points: c };
            }),
            (e.prototype._getNAFPoints = function (a) {
              if (this.precomputed && this.precomputed.naf)
                return this.precomputed.naf;
              for (
                var b = [this],
                  c = (1 << a) - 1,
                  d = 1 === c ? null : this.dbl(),
                  e = 1;
                e < c;
                e++
              )
                b[e] = b[e - 1].add(d);
              return { wnd: a, points: b };
            }),
            (e.prototype._getBeta = function () {
              return null;
            }),
            (e.prototype.dblp = function (a) {
              for (var b = this, c = 0; c < a; c++) b = b.dbl();
              return b;
            });
        },
        { "../../elliptic": 9, "bn.js": 6 },
      ],
      11: [
        function (a, b, c) {
          b.exports = {};
        },
        {},
      ],
      12: [
        function (a, b, c) {
          "use strict";
          var d = c;
          (d.base = a("./base")),
            (d["short"] = a("./short")),
            (d.mont = a("./mont")),
            (d.edwards = a("./edwards"));
        },
        { "./base": 10, "./edwards": 11, "./mont": 13, "./short": 14 },
      ],
      13: [
        function (a, b, c) {
          arguments[4][11][0].apply(c, arguments);
        },
        { dup: 11 },
      ],
      14: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            k.call(this, "short", a),
              (this.a = new i(a.a, 16).toRed(this.red)),
              (this.b = new i(a.b, 16).toRed(this.red)),
              (this.tinv = this.two.redInvm()),
              (this.zeroA = 0 === this.a.fromRed().cmpn(0)),
              (this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3)),
              (this.endo = this._getEndomorphism(a)),
              (this._endoWnafT1 = new Array(4)),
              (this._endoWnafT2 = new Array(4));
          }
          function e(a, b, c, d) {
            k.BasePoint.call(this, a, "affine"),
              null === b && null === c
                ? ((this.x = null), (this.y = null), (this.inf = !0))
                : ((this.x = new i(b, 16)),
                  (this.y = new i(c, 16)),
                  d &&
                    (this.x.forceRed(this.curve.red),
                    this.y.forceRed(this.curve.red)),
                  this.x.red || (this.x = this.x.toRed(this.curve.red)),
                  this.y.red || (this.y = this.y.toRed(this.curve.red)),
                  (this.inf = !1));
          }
          function f(a, b, c, d) {
            k.BasePoint.call(this, a, "jacobian"),
              null === b && null === c && null === d
                ? ((this.x = this.curve.one),
                  (this.y = this.curve.one),
                  (this.z = new i(0)))
                : ((this.x = new i(b, 16)),
                  (this.y = new i(c, 16)),
                  (this.z = new i(d, 16))),
              this.x.red || (this.x = this.x.toRed(this.curve.red)),
              this.y.red || (this.y = this.y.toRed(this.curve.red)),
              this.z.red || (this.z = this.z.toRed(this.curve.red)),
              (this.zOne = this.z === this.curve.one);
          }
          var g = a("../curve"),
            h = a("../../elliptic"),
            i = a("bn.js"),
            j = a("inherits"),
            k = g.base,
            l = h.utils.assert;
          j(d, k),
            (b.exports = d),
            (d.prototype._getEndomorphism = function (a) {
              if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
                var b, c;
                if (a.beta) b = new i(a.beta, 16).toRed(this.red);
                else {
                  var d = this._getEndoRoots(this.p);
                  (b = d[0].cmp(d[1]) < 0 ? d[0] : d[1]),
                    (b = b.toRed(this.red));
                }
                if (a.lambda) c = new i(a.lambda, 16);
                else {
                  var e = this._getEndoRoots(this.n);
                  0 === this.g.mul(e[0]).x.cmp(this.g.x.redMul(b))
                    ? (c = e[0])
                    : ((c = e[1]),
                      l(0 === this.g.mul(c).x.cmp(this.g.x.redMul(b))));
                }
                var f;
                return (
                  (f = a.basis
                    ? a.basis.map(function (a) {
                        return { a: new i(a.a, 16), b: new i(a.b, 16) };
                      })
                    : this._getEndoBasis(c)),
                  { beta: b, lambda: c, basis: f }
                );
              }
            }),
            (d.prototype._getEndoRoots = function (a) {
              var b = a === this.p ? this.red : i.mont(a),
                c = new i(2).toRed(b).redInvm(),
                d = c.redNeg(),
                e = new i(3).toRed(b).redNeg().redSqrt().redMul(c),
                f = d.redAdd(e).fromRed(),
                g = d.redSub(e).fromRed();
              return [f, g];
            }),
            (d.prototype._getEndoBasis = function (a) {
              for (
                var b,
                  c,
                  d,
                  e,
                  f,
                  g,
                  h,
                  j,
                  k,
                  l = this.n.ushrn(Math.floor(this.n.bitLength() / 2)),
                  m = a,
                  n = this.n.clone(),
                  o = new i(1),
                  p = new i(0),
                  q = new i(0),
                  r = new i(1),
                  s = 0;
                0 !== m.cmpn(0);

              ) {
                var t = n.div(m);
                (j = n.sub(t.mul(m))), (k = q.sub(t.mul(o)));
                var u = r.sub(t.mul(p));
                if (!d && j.cmp(l) < 0)
                  (b = h.neg()), (c = o), (d = j.neg()), (e = k);
                else if (d && 2 === ++s) break;
                (h = j), (n = m), (m = j), (q = o), (o = k), (r = p), (p = u);
              }
              (f = j.neg()), (g = k);
              var v = d.sqr().add(e.sqr()),
                w = f.sqr().add(g.sqr());
              return (
                w.cmp(v) >= 0 && ((f = b), (g = c)),
                d.negative && ((d = d.neg()), (e = e.neg())),
                f.negative && ((f = f.neg()), (g = g.neg())),
                [
                  { a: d, b: e },
                  { a: f, b: g },
                ]
              );
            }),
            (d.prototype._endoSplit = function (a) {
              var b = this.endo.basis,
                c = b[0],
                d = b[1],
                e = d.b.mul(a).divRound(this.n),
                f = c.b.neg().mul(a).divRound(this.n),
                g = e.mul(c.a),
                h = f.mul(d.a),
                i = e.mul(c.b),
                j = f.mul(d.b),
                k = a.sub(g).sub(h),
                l = i.add(j).neg();
              return { k1: k, k2: l };
            }),
            (d.prototype.pointFromX = function (a, b) {
              (a = new i(a, 16)), a.red || (a = a.toRed(this.red));
              var c = a
                  .redSqr()
                  .redMul(a)
                  .redIAdd(a.redMul(this.a))
                  .redIAdd(this.b),
                d = c.redSqrt();
              if (0 !== d.redSqr().redSub(c).cmp(this.zero))
                throw new Error("invalid point");
              var e = d.fromRed().isOdd();
              return (
                ((b && !e) || (!b && e)) && (d = d.redNeg()), this.point(a, d)
              );
            }),
            (d.prototype.validate = function (a) {
              if (a.inf) return !0;
              var b = a.x,
                c = a.y,
                d = this.a.redMul(b),
                e = b.redSqr().redMul(b).redIAdd(d).redIAdd(this.b);
              return 0 === c.redSqr().redISub(e).cmpn(0);
            }),
            (d.prototype._endoWnafMulAdd = function (a, b, c) {
              for (
                var d = this._endoWnafT1, e = this._endoWnafT2, f = 0;
                f < a.length;
                f++
              ) {
                var g = this._endoSplit(b[f]),
                  h = a[f],
                  i = h._getBeta();
                g.k1.negative && (g.k1.ineg(), (h = h.neg(!0))),
                  g.k2.negative && (g.k2.ineg(), (i = i.neg(!0))),
                  (d[2 * f] = h),
                  (d[2 * f + 1] = i),
                  (e[2 * f] = g.k1),
                  (e[2 * f + 1] = g.k2);
              }
              for (
                var j = this._wnafMulAdd(1, d, e, 2 * f, c), k = 0;
                k < 2 * f;
                k++
              )
                (d[k] = null), (e[k] = null);
              return j;
            }),
            j(e, k.BasePoint),
            (d.prototype.point = function (a, b, c) {
              return new e(this, a, b, c);
            }),
            (d.prototype.pointFromJSON = function (a, b) {
              return e.fromJSON(this, a, b);
            }),
            (e.prototype._getBeta = function () {
              if (this.curve.endo) {
                var a = this.precomputed;
                if (a && a.beta) return a.beta;
                var b = this.curve.point(
                  this.x.redMul(this.curve.endo.beta),
                  this.y
                );
                if (a) {
                  var c = this.curve,
                    d = function (a) {
                      return c.point(a.x.redMul(c.endo.beta), a.y);
                    };
                  (a.beta = b),
                    (b.precomputed = {
                      beta: null,
                      naf: a.naf && {
                        wnd: a.naf.wnd,
                        points: a.naf.points.map(d),
                      },
                      doubles: a.doubles && {
                        step: a.doubles.step,
                        points: a.doubles.points.map(d),
                      },
                    });
                }
                return b;
              }
            }),
            (e.prototype.toJSON = function () {
              return this.precomputed
                ? [
                    this.x,
                    this.y,
                    this.precomputed && {
                      doubles: this.precomputed.doubles && {
                        step: this.precomputed.doubles.step,
                        points: this.precomputed.doubles.points.slice(1),
                      },
                      naf: this.precomputed.naf && {
                        wnd: this.precomputed.naf.wnd,
                        points: this.precomputed.naf.points.slice(1),
                      },
                    },
                  ]
                : [this.x, this.y];
            }),
            (e.fromJSON = function (a, b, c) {
              function d(b) {
                return a.point(b[0], b[1], c);
              }
              "string" == typeof b && (b = JSON.parse(b));
              var e = a.point(b[0], b[1], c);
              if (!b[2]) return e;
              var f = b[2];
              return (
                (e.precomputed = {
                  beta: null,
                  doubles: f.doubles && {
                    step: f.doubles.step,
                    points: [e].concat(f.doubles.points.map(d)),
                  },
                  naf: f.naf && {
                    wnd: f.naf.wnd,
                    points: [e].concat(f.naf.points.map(d)),
                  },
                }),
                e
              );
            }),
            (e.prototype.inspect = function () {
              return this.isInfinity()
                ? "<EC Point Infinity>"
                : "<EC Point x: " +
                    this.x.fromRed().toString(16, 2) +
                    " y: " +
                    this.y.fromRed().toString(16, 2) +
                    ">";
            }),
            (e.prototype.isInfinity = function () {
              return this.inf;
            }),
            (e.prototype.add = function (a) {
              if (this.inf) return a;
              if (a.inf) return this;
              if (this.eq(a)) return this.dbl();
              if (this.neg().eq(a)) return this.curve.point(null, null);
              if (0 === this.x.cmp(a.x)) return this.curve.point(null, null);
              var b = this.y.redSub(a.y);
              0 !== b.cmpn(0) && (b = b.redMul(this.x.redSub(a.x).redInvm()));
              var c = b.redSqr().redISub(this.x).redISub(a.x),
                d = b.redMul(this.x.redSub(c)).redISub(this.y);
              return this.curve.point(c, d);
            }),
            (e.prototype.dbl = function () {
              if (this.inf) return this;
              var a = this.y.redAdd(this.y);
              if (0 === a.cmpn(0)) return this.curve.point(null, null);
              var b = this.curve.a,
                c = this.x.redSqr(),
                d = a.redInvm(),
                e = c.redAdd(c).redIAdd(c).redIAdd(b).redMul(d),
                f = e.redSqr().redISub(this.x.redAdd(this.x)),
                g = e.redMul(this.x.redSub(f)).redISub(this.y);
              return this.curve.point(f, g);
            }),
            (e.prototype.getX = function () {
              return this.x.fromRed();
            }),
            (e.prototype.getY = function () {
              return this.y.fromRed();
            }),
            (e.prototype.mul = function (a) {
              return (
                (a = new i(a, 16)),
                this._hasDoubles(a)
                  ? this.curve._fixedNafMul(this, a)
                  : this.curve.endo
                  ? this.curve._endoWnafMulAdd([this], [a])
                  : this.curve._wnafMul(this, a)
              );
            }),
            (e.prototype.mulAdd = function (a, b, c) {
              var d = [this, b],
                e = [a, c];
              return this.curve.endo
                ? this.curve._endoWnafMulAdd(d, e)
                : this.curve._wnafMulAdd(1, d, e, 2);
            }),
            (e.prototype.jmulAdd = function (a, b, c) {
              var d = [this, b],
                e = [a, c];
              return this.curve.endo
                ? this.curve._endoWnafMulAdd(d, e, !0)
                : this.curve._wnafMulAdd(1, d, e, 2, !0);
            }),
            (e.prototype.eq = function (a) {
              return (
                this === a ||
                (this.inf === a.inf &&
                  (this.inf ||
                    (0 === this.x.cmp(a.x) && 0 === this.y.cmp(a.y))))
              );
            }),
            (e.prototype.neg = function (a) {
              if (this.inf) return this;
              var b = this.curve.point(this.x, this.y.redNeg());
              if (a && this.precomputed) {
                var c = this.precomputed,
                  d = function (a) {
                    return a.neg();
                  };
                b.precomputed = {
                  naf: c.naf && { wnd: c.naf.wnd, points: c.naf.points.map(d) },
                  doubles: c.doubles && {
                    step: c.doubles.step,
                    points: c.doubles.points.map(d),
                  },
                };
              }
              return b;
            }),
            (e.prototype.toJ = function () {
              if (this.inf) return this.curve.jpoint(null, null, null);
              var a = this.curve.jpoint(this.x, this.y, this.curve.one);
              return a;
            }),
            j(f, k.BasePoint),
            (d.prototype.jpoint = function (a, b, c) {
              return new f(this, a, b, c);
            }),
            (f.prototype.toP = function () {
              if (this.isInfinity()) return this.curve.point(null, null);
              var a = this.z.redInvm(),
                b = a.redSqr(),
                c = this.x.redMul(b),
                d = this.y.redMul(b).redMul(a);
              return this.curve.point(c, d);
            }),
            (f.prototype.neg = function () {
              return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
            }),
            (f.prototype.add = function (a) {
              if (this.isInfinity()) return a;
              if (a.isInfinity()) return this;
              var b = a.z.redSqr(),
                c = this.z.redSqr(),
                d = this.x.redMul(b),
                e = a.x.redMul(c),
                f = this.y.redMul(b.redMul(a.z)),
                g = a.y.redMul(c.redMul(this.z)),
                h = d.redSub(e),
                i = f.redSub(g);
              if (0 === h.cmpn(0))
                return 0 !== i.cmpn(0)
                  ? this.curve.jpoint(null, null, null)
                  : this.dbl();
              var j = h.redSqr(),
                k = j.redMul(h),
                l = d.redMul(j),
                m = i.redSqr().redIAdd(k).redISub(l).redISub(l),
                n = i.redMul(l.redISub(m)).redISub(f.redMul(k)),
                o = this.z.redMul(a.z).redMul(h);
              return this.curve.jpoint(m, n, o);
            }),
            (f.prototype.mixedAdd = function (a) {
              if (this.isInfinity()) return a.toJ();
              if (a.isInfinity()) return this;
              var b = this.z.redSqr(),
                c = this.x,
                d = a.x.redMul(b),
                e = this.y,
                f = a.y.redMul(b).redMul(this.z),
                g = c.redSub(d),
                h = e.redSub(f);
              if (0 === g.cmpn(0))
                return 0 !== h.cmpn(0)
                  ? this.curve.jpoint(null, null, null)
                  : this.dbl();
              var i = g.redSqr(),
                j = i.redMul(g),
                k = c.redMul(i),
                l = h.redSqr().redIAdd(j).redISub(k).redISub(k),
                m = h.redMul(k.redISub(l)).redISub(e.redMul(j)),
                n = this.z.redMul(g);
              return this.curve.jpoint(l, m, n);
            }),
            (f.prototype.dblp = function (a) {
              if (0 === a) return this;
              if (this.isInfinity()) return this;
              if (!a) return this.dbl();
              if (this.curve.zeroA || this.curve.threeA) {
                for (var b = this, c = 0; c < a; c++) b = b.dbl();
                return b;
              }
              for (
                var d = this.curve.a,
                  e = this.curve.tinv,
                  f = this.x,
                  g = this.y,
                  h = this.z,
                  i = h.redSqr().redSqr(),
                  j = g.redAdd(g),
                  c = 0;
                c < a;
                c++
              ) {
                var k = f.redSqr(),
                  l = j.redSqr(),
                  m = l.redSqr(),
                  n = k.redAdd(k).redIAdd(k).redIAdd(d.redMul(i)),
                  o = f.redMul(l),
                  p = n.redSqr().redISub(o.redAdd(o)),
                  q = o.redISub(p),
                  r = n.redMul(q);
                r = r.redIAdd(r).redISub(m);
                var s = j.redMul(h);
                c + 1 < a && (i = i.redMul(m)), (f = p), (h = s), (j = r);
              }
              return this.curve.jpoint(f, j.redMul(e), h);
            }),
            (f.prototype.dbl = function () {
              return this.isInfinity()
                ? this
                : this.curve.zeroA
                ? this._zeroDbl()
                : this.curve.threeA
                ? this._threeDbl()
                : this._dbl();
            }),
            (f.prototype._zeroDbl = function () {
              var a, b, c;
              if (this.zOne) {
                var d = this.x.redSqr(),
                  e = this.y.redSqr(),
                  f = e.redSqr(),
                  g = this.x.redAdd(e).redSqr().redISub(d).redISub(f);
                g = g.redIAdd(g);
                var h = d.redAdd(d).redIAdd(d),
                  i = h.redSqr().redISub(g).redISub(g),
                  j = f.redIAdd(f);
                (j = j.redIAdd(j)),
                  (j = j.redIAdd(j)),
                  (a = i),
                  (b = h.redMul(g.redISub(i)).redISub(j)),
                  (c = this.y.redAdd(this.y));
              } else {
                var k = this.x.redSqr(),
                  l = this.y.redSqr(),
                  m = l.redSqr(),
                  n = this.x.redAdd(l).redSqr().redISub(k).redISub(m);
                n = n.redIAdd(n);
                var o = k.redAdd(k).redIAdd(k),
                  p = o.redSqr(),
                  q = m.redIAdd(m);
                (q = q.redIAdd(q)),
                  (q = q.redIAdd(q)),
                  (a = p.redISub(n).redISub(n)),
                  (b = o.redMul(n.redISub(a)).redISub(q)),
                  (c = this.y.redMul(this.z)),
                  (c = c.redIAdd(c));
              }
              return this.curve.jpoint(a, b, c);
            }),
            (f.prototype._threeDbl = function () {
              var a, b, c;
              if (this.zOne) {
                var d = this.x.redSqr(),
                  e = this.y.redSqr(),
                  f = e.redSqr(),
                  g = this.x.redAdd(e).redSqr().redISub(d).redISub(f);
                g = g.redIAdd(g);
                var h = d.redAdd(d).redIAdd(d).redIAdd(this.curve.a),
                  i = h.redSqr().redISub(g).redISub(g);
                a = i;
                var j = f.redIAdd(f);
                (j = j.redIAdd(j)),
                  (j = j.redIAdd(j)),
                  (b = h.redMul(g.redISub(i)).redISub(j)),
                  (c = this.y.redAdd(this.y));
              } else {
                var k = this.z.redSqr(),
                  l = this.y.redSqr(),
                  m = this.x.redMul(l),
                  n = this.x.redSub(k).redMul(this.x.redAdd(k));
                n = n.redAdd(n).redIAdd(n);
                var o = m.redIAdd(m);
                o = o.redIAdd(o);
                var p = o.redAdd(o);
                (a = n.redSqr().redISub(p)),
                  (c = this.y.redAdd(this.z).redSqr().redISub(l).redISub(k));
                var q = l.redSqr();
                (q = q.redIAdd(q)),
                  (q = q.redIAdd(q)),
                  (q = q.redIAdd(q)),
                  (b = n.redMul(o.redISub(a)).redISub(q));
              }
              return this.curve.jpoint(a, b, c);
            }),
            (f.prototype._dbl = function () {
              var a = this.curve.a,
                b = this.x,
                c = this.y,
                d = this.z,
                e = d.redSqr().redSqr(),
                f = b.redSqr(),
                g = c.redSqr(),
                h = f.redAdd(f).redIAdd(f).redIAdd(a.redMul(e)),
                i = b.redAdd(b);
              i = i.redIAdd(i);
              var j = i.redMul(g),
                k = h.redSqr().redISub(j.redAdd(j)),
                l = j.redISub(k),
                m = g.redSqr();
              (m = m.redIAdd(m)), (m = m.redIAdd(m)), (m = m.redIAdd(m));
              var n = h.redMul(l).redISub(m),
                o = c.redAdd(c).redMul(d);
              return this.curve.jpoint(k, n, o);
            }),
            (f.prototype.trpl = function () {
              if (!this.curve.zeroA) return this.dbl().add(this);
              var a = this.x.redSqr(),
                b = this.y.redSqr(),
                c = this.z.redSqr(),
                d = b.redSqr(),
                e = a.redAdd(a).redIAdd(a),
                f = e.redSqr(),
                g = this.x.redAdd(b).redSqr().redISub(a).redISub(d);
              (g = g.redIAdd(g)),
                (g = g.redAdd(g).redIAdd(g)),
                (g = g.redISub(f));
              var h = g.redSqr(),
                i = d.redIAdd(d);
              (i = i.redIAdd(i)), (i = i.redIAdd(i)), (i = i.redIAdd(i));
              var j = e.redIAdd(g).redSqr().redISub(f).redISub(h).redISub(i),
                k = b.redMul(j);
              (k = k.redIAdd(k)), (k = k.redIAdd(k));
              var l = this.x.redMul(h).redISub(k);
              (l = l.redIAdd(l)), (l = l.redIAdd(l));
              var m = this.y.redMul(
                j.redMul(i.redISub(j)).redISub(g.redMul(h))
              );
              (m = m.redIAdd(m)), (m = m.redIAdd(m)), (m = m.redIAdd(m));
              var n = this.z.redAdd(g).redSqr().redISub(c).redISub(h);
              return this.curve.jpoint(l, m, n);
            }),
            (f.prototype.mul = function (a, b) {
              return (a = new i(a, b)), this.curve._wnafMul(this, a);
            }),
            (f.prototype.eq = function (a) {
              if ("affine" === a.type) return this.eq(a.toJ());
              if (this === a) return !0;
              var b = this.z.redSqr(),
                c = a.z.redSqr();
              if (0 !== this.x.redMul(c).redISub(a.x.redMul(b)).cmpn(0))
                return !1;
              var d = b.redMul(this.z),
                e = c.redMul(a.z);
              return 0 === this.y.redMul(e).redISub(a.y.redMul(d)).cmpn(0);
            }),
            (f.prototype.eqXToP = function (a) {
              var b = this.z.redSqr(),
                c = a.toRed(this.curve.red).redMul(b);
              if (0 === this.x.cmp(c)) return !0;
              for (var d = a.clone(), e = this.curve.redN.redMul(b); ; ) {
                if ((d.iadd(this.curve.n), d.cmp(this.curve.p) >= 0)) return !1;
                if ((c.redIAdd(e), 0 === this.x.cmp(c))) return !0;
              }
              return !1;
            }),
            (f.prototype.inspect = function () {
              return this.isInfinity()
                ? "<EC JPoint Infinity>"
                : "<EC JPoint x: " +
                    this.x.toString(16, 2) +
                    " y: " +
                    this.y.toString(16, 2) +
                    " z: " +
                    this.z.toString(16, 2) +
                    ">";
            }),
            (f.prototype.isInfinity = function () {
              return 0 === this.z.cmpn(0);
            });
        },
        { "../../elliptic": 9, "../curve": 12, "bn.js": 6, inherits: 37 },
      ],
      15: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            "short" === a.type
              ? (this.curve = new h.curve["short"](a))
              : "edwards" === a.type
              ? (this.curve = new h.curve.edwards(a))
              : (this.curve = new h.curve.mont(a)),
              (this.g = this.curve.g),
              (this.n = this.curve.n),
              (this.hash = a.hash),
              i(this.g.validate(), "Invalid curve"),
              i(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
          }
          function e(a, b) {
            Object.defineProperty(f, a, {
              configurable: !0,
              enumerable: !0,
              get: function () {
                var c = new d(b);
                return (
                  Object.defineProperty(f, a, {
                    configurable: !0,
                    enumerable: !0,
                    value: c,
                  }),
                  c
                );
              },
            });
          }
          var f = c,
            g = a("hash.js"),
            h = a("../elliptic"),
            i = h.utils.assert;
          (f.PresetCurve = d),
            e("p192", {
              type: "short",
              prime: "p192",
              p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
              a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
              b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
              n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
              hash: g.sha256,
              gRed: !1,
              g: [
                "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
                "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811",
              ],
            }),
            e("p224", {
              type: "short",
              prime: "p224",
              p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
              a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
              b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
              n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
              hash: g.sha256,
              gRed: !1,
              g: [
                "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
                "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34",
              ],
            }),
            e("p256", {
              type: "short",
              prime: null,
              p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
              a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
              b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
              n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
              hash: g.sha256,
              gRed: !1,
              g: [
                "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
                "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5",
              ],
            }),
            e("p384", {
              type: "short",
              prime: null,
              p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
              a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
              b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
              n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
              hash: g.sha384,
              gRed: !1,
              g: [
                "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
                "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f",
              ],
            }),
            e("p521", {
              type: "short",
              prime: null,
              p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
              a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
              b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
              n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
              hash: g.sha512,
              gRed: !1,
              g: [
                "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
                "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650",
              ],
            }),
            e("curve25519", {
              type: "mont",
              prime: "p25519",
              p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
              a: "76d06",
              b: "1",
              n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
              hash: g.sha256,
              gRed: !1,
              g: ["9"],
            }),
            e("ed25519", {
              type: "edwards",
              prime: "p25519",
              p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
              a: "-1",
              c: "1",
              d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
              n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
              hash: g.sha256,
              gRed: !1,
              g: [
                "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
                "6666666666666666666666666666666666666666666666666666666666666658",
              ],
            });
          var j;
          try {
            j = a("./precomputed/secp256k1");
          } catch (k) {
            j = void 0;
          }
          e("secp256k1", {
            type: "short",
            prime: "k256",
            p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
            a: "0",
            b: "7",
            n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
            h: "1",
            hash: g.sha256,
            beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
            lambda:
              "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
            basis: [
              {
                a: "3086d221a7d46bcde86c90e49284eb15",
                b: "-e4437ed6010e88286f547fa90abfe4c3",
              },
              {
                a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
                b: "3086d221a7d46bcde86c90e49284eb15",
              },
            ],
            gRed: !1,
            g: [
              "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
              "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
              j,
            ],
          });
        },
        { "../elliptic": 9, "./precomputed/secp256k1": 21, "hash.js": 24 },
      ],
      16: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            return this instanceof d
              ? ("string" == typeof a &&
                  (h(f.curves.hasOwnProperty(a), "Unknown curve " + a),
                  (a = f.curves[a])),
                a instanceof f.curves.PresetCurve && (a = { curve: a }),
                (this.curve = a.curve.curve),
                (this.n = this.curve.n),
                (this.nh = this.n.ushrn(1)),
                (this.g = this.curve.g),
                (this.g = a.curve.g),
                this.g.precompute(a.curve.n.bitLength() + 1),
                void (this.hash = a.hash || a.curve.hash))
              : new d(a);
          }
          var e = a("bn.js"),
            f = a("../../elliptic"),
            g = f.utils,
            h = g.assert,
            i = a("./key"),
            j = a("./signature");
          (b.exports = d),
            (d.prototype.keyPair = function (a) {
              return new i(this, a);
            }),
            (d.prototype.keyFromPrivate = function (a, b) {
              return i.fromPrivate(this, a, b);
            }),
            (d.prototype.keyFromPublic = function (a, b) {
              return i.fromPublic(this, a, b);
            }),
            (d.prototype.genKeyPair = function (a) {
              a || (a = {});
              for (
                var b = new f.hmacDRBG({
                    hash: this.hash,
                    pers: a.pers,
                    entropy: a.entropy || f.rand(this.hash.hmacStrength),
                    nonce: this.n.toArray(),
                  }),
                  c = this.n.byteLength(),
                  d = this.n.sub(new e(2));
                ;

              ) {
                var g = new e(b.generate(c));
                if (!(g.cmp(d) > 0)) return g.iaddn(1), this.keyFromPrivate(g);
              }
            }),
            (d.prototype._truncateToN = function (a, b) {
              var c = 8 * a.byteLength() - this.n.bitLength();
              return (
                c > 0 && (a = a.ushrn(c)),
                !b && a.cmp(this.n) >= 0 ? a.sub(this.n) : a
              );
            }),
            (d.prototype.sign = function (a, b, c, d) {
              "object" == typeof c && ((d = c), (c = null)),
                d || (d = {}),
                (b = this.keyFromPrivate(b, c)),
                (a = this._truncateToN(new e(a, 16)));
              for (
                var g = this.n.byteLength(),
                  h = b.getPrivate().toArray("be", g),
                  i = a.toArray("be", g),
                  k = new f.hmacDRBG({
                    hash: this.hash,
                    entropy: h,
                    nonce: i,
                    pers: d.pers,
                    persEnc: d.persEnc,
                  }),
                  l = this.n.sub(new e(1)),
                  m = 0;
                !0;
                m++
              ) {
                var n = d.k ? d.k(m) : new e(k.generate(this.n.byteLength()));
                if (
                  ((n = this._truncateToN(n, !0)),
                  !(n.cmpn(1) <= 0 || n.cmp(l) >= 0))
                ) {
                  var o = this.g.mul(n);
                  if (!o.isInfinity()) {
                    var p = o.getX(),
                      q = p.umod(this.n);
                    if (0 !== q.cmpn(0)) {
                      var r = n.invm(this.n).mul(q.mul(b.getPrivate()).iadd(a));
                      if (((r = r.umod(this.n)), 0 !== r.cmpn(0))) {
                        var s =
                          (o.getY().isOdd() ? 1 : 0) | (0 !== p.cmp(q) ? 2 : 0);
                        return (
                          d.canonical &&
                            r.cmp(this.nh) > 0 &&
                            ((r = this.n.sub(r)), (s ^= 1)),
                          new j({ r: q, s: r, recoveryParam: s })
                        );
                      }
                    }
                  }
                }
              }
            }),
            (d.prototype.verify = function (a, b, c, d) {
              (a = this._truncateToN(new e(a, 16))),
                (c = this.keyFromPublic(c, d)),
                (b = new j(b, "hex"));
              var f = b.r,
                g = b.s;
              if (f.cmpn(1) < 0 || f.cmp(this.n) >= 0) return !1;
              if (g.cmpn(1) < 0 || g.cmp(this.n) >= 0) return !1;
              var h = g.invm(this.n),
                i = h.mul(a).umod(this.n),
                k = h.mul(f).umod(this.n);
              if (!this.curve._maxwellTrick) {
                var l = this.g.mulAdd(i, c.getPublic(), k);
                return !l.isInfinity() && 0 === l.getX().umod(this.n).cmp(f);
              }
              var l = this.g.jmulAdd(i, c.getPublic(), k);
              return !l.isInfinity() && l.eqXToP(f);
            }),
            (d.prototype.recoverPubKey = function (a, b, c, d) {
              h((3 & c) === c, "The recovery param is more than two bits"),
                (b = new j(b, d));
              var f = this.n,
                g = new e(a),
                i = b.r,
                k = b.s,
                l = 1 & c,
                m = c >> 1;
              if (i.cmp(this.curve.p.umod(this.curve.n)) >= 0 && m)
                throw new Error("Unable to find sencond key candinate");
              i = m
                ? this.curve.pointFromX(i.add(this.curve.n), l)
                : this.curve.pointFromX(i, l);
              var n = b.r.invm(f),
                o = f.sub(g).mul(n).umod(f),
                p = k.mul(n).umod(f);
              return this.g.mulAdd(o, i, p);
            }),
            (d.prototype.getKeyRecoveryParam = function (a, b, c, d) {
              if (((b = new j(b, d)), null !== b.recoveryParam))
                return b.recoveryParam;
              for (var e = 0; e < 4; e++) {
                var f;
                try {
                  f = this.recoverPubKey(a, b, e);
                } catch (a) {
                  continue;
                }
                if (f.eq(c)) return e;
              }
              throw new Error("Unable to find valid recovery factor");
            });
        },
        { "../../elliptic": 9, "./key": 17, "./signature": 18, "bn.js": 6 },
      ],
      17: [
        function (a, b, c) {
          "use strict";
          function d(a, b) {
            (this.ec = a),
              (this.priv = null),
              (this.pub = null),
              b.priv && this._importPrivate(b.priv, b.privEnc),
              b.pub && this._importPublic(b.pub, b.pubEnc);
          }
          var e = a("bn.js"),
            f = a("../../elliptic"),
            g = f.utils,
            h = g.assert;
          (b.exports = d),
            (d.fromPublic = function (a, b, c) {
              return b instanceof d ? b : new d(a, { pub: b, pubEnc: c });
            }),
            (d.fromPrivate = function (a, b, c) {
              return b instanceof d ? b : new d(a, { priv: b, privEnc: c });
            }),
            (d.prototype.validate = function () {
              var a = this.getPublic();
              return a.isInfinity()
                ? { result: !1, reason: "Invalid public key" }
                : a.validate()
                ? a.mul(this.ec.curve.n).isInfinity()
                  ? { result: !0, reason: null }
                  : { result: !1, reason: "Public key * N != O" }
                : { result: !1, reason: "Public key is not a point" };
            }),
            (d.prototype.getPublic = function (a, b) {
              return (
                "string" == typeof a && ((b = a), (a = null)),
                this.pub || (this.pub = this.ec.g.mul(this.priv)),
                b ? this.pub.encode(b, a) : this.pub
              );
            }),
            (d.prototype.getPrivate = function (a) {
              return "hex" === a ? this.priv.toString(16, 2) : this.priv;
            }),
            (d.prototype._importPrivate = function (a, b) {
              (this.priv = new e(a, b || 16)),
                (this.priv = this.priv.umod(this.ec.curve.n));
            }),
            (d.prototype._importPublic = function (a, b) {
              return a.x || a.y
                ? ("mont" === this.ec.curve.type
                    ? h(a.x, "Need x coordinate")
                    : ("short" !== this.ec.curve.type &&
                        "edwards" !== this.ec.curve.type) ||
                      h(a.x && a.y, "Need both x and y coordinate"),
                  void (this.pub = this.ec.curve.point(a.x, a.y)))
                : void (this.pub = this.ec.curve.decodePoint(a, b));
            }),
            (d.prototype.derive = function (a) {
              return a.mul(this.priv).getX();
            }),
            (d.prototype.sign = function (a, b, c) {
              return this.ec.sign(a, this, b, c);
            }),
            (d.prototype.verify = function (a, b) {
              return this.ec.verify(a, b, this);
            }),
            (d.prototype.inspect = function () {
              return (
                "<Key priv: " +
                (this.priv && this.priv.toString(16, 2)) +
                " pub: " +
                (this.pub && this.pub.inspect()) +
                " >"
              );
            });
        },
        { "../../elliptic": 9, "bn.js": 6 },
      ],
      18: [
        function (a, b, c) {
          "use strict";
          function d(a, b) {
            return a instanceof d
              ? a
              : void (
                  this._importDER(a, b) ||
                  (l(a.r && a.s, "Signature without r or s"),
                  (this.r = new i(a.r, 16)),
                  (this.s = new i(a.s, 16)),
                  void 0 === a.recoveryParam
                    ? (this.recoveryParam = null)
                    : (this.recoveryParam = a.recoveryParam))
                );
          }
          function e() {
            this.place = 0;
          }
          function f(a, b) {
            var c = a[b.place++];
            if (!(128 & c)) return c;
            for (var d = 15 & c, e = 0, f = 0, g = b.place; f < d; f++, g++)
              (e <<= 8), (e |= a[g]);
            return (b.place = g), e;
          }
          function g(a) {
            for (
              var b = 0, c = a.length - 1;
              !a[b] && !(128 & a[b + 1]) && b < c;

            )
              b++;
            return 0 === b ? a : a.slice(b);
          }
          function h(a, b) {
            if (b < 128) return void a.push(b);
            var c = 1 + ((Math.log(b) / Math.LN2) >>> 3);
            for (a.push(128 | c); --c; ) a.push((b >>> (c << 3)) & 255);
            a.push(b);
          }
          var i = a("bn.js"),
            j = a("../../elliptic"),
            k = j.utils,
            l = k.assert;
          (b.exports = d),
            (d.prototype._importDER = function (a, b) {
              a = k.toArray(a, b);
              var c = new e();
              if (48 !== a[c.place++]) return !1;
              var d = f(a, c);
              if (d + c.place !== a.length) return !1;
              if (2 !== a[c.place++]) return !1;
              var g = f(a, c),
                h = a.slice(c.place, g + c.place);
              if (((c.place += g), 2 !== a[c.place++])) return !1;
              var j = f(a, c);
              if (a.length !== j + c.place) return !1;
              var l = a.slice(c.place, j + c.place);
              return (
                0 === h[0] && 128 & h[1] && (h = h.slice(1)),
                0 === l[0] && 128 & l[1] && (l = l.slice(1)),
                (this.r = new i(h)),
                (this.s = new i(l)),
                (this.recoveryParam = null),
                !0
              );
            }),
            (d.prototype.toDER = function (a) {
              var b = this.r.toArray(),
                c = this.s.toArray();
              for (
                128 & b[0] && (b = [0].concat(b)),
                  128 & c[0] && (c = [0].concat(c)),
                  b = g(b),
                  c = g(c);
                !(c[0] || 128 & c[1]);

              )
                c = c.slice(1);
              var d = [2];
              h(d, b.length), (d = d.concat(b)), d.push(2), h(d, c.length);
              var e = d.concat(c),
                f = [48];
              return h(f, e.length), (f = f.concat(e)), k.encode(f, a);
            });
        },
        { "../../elliptic": 9, "bn.js": 6 },
      ],
      19: [
        function (a, b, c) {
          arguments[4][11][0].apply(c, arguments);
        },
        { dup: 11 },
      ],
      20: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            if (!(this instanceof d)) return new d(a);
            (this.hash = a.hash),
              (this.predResist = !!a.predResist),
              (this.outLen = this.hash.outSize),
              (this.minEntropy = a.minEntropy || this.hash.hmacStrength),
              (this.reseed = null),
              (this.reseedInterval = null),
              (this.K = null),
              (this.V = null);
            var b = g.toArray(a.entropy, a.entropyEnc),
              c = g.toArray(a.nonce, a.nonceEnc),
              e = g.toArray(a.pers, a.persEnc);
            h(
              b.length >= this.minEntropy / 8,
              "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
            ),
              this._init(b, c, e);
          }
          var e = a("hash.js"),
            f = a("../elliptic"),
            g = f.utils,
            h = g.assert;
          (b.exports = d),
            (d.prototype._init = function (a, b, c) {
              var d = a.concat(b).concat(c);
              (this.K = new Array(this.outLen / 8)),
                (this.V = new Array(this.outLen / 8));
              for (var e = 0; e < this.V.length; e++)
                (this.K[e] = 0), (this.V[e] = 1);
              this._update(d),
                (this.reseed = 1),
                (this.reseedInterval = 281474976710656);
            }),
            (d.prototype._hmac = function () {
              return new e.hmac(this.hash, this.K);
            }),
            (d.prototype._update = function (a) {
              var b = this._hmac().update(this.V).update([0]);
              a && (b = b.update(a)),
                (this.K = b.digest()),
                (this.V = this._hmac().update(this.V).digest()),
                a &&
                  ((this.K = this._hmac()
                    .update(this.V)
                    .update([1])
                    .update(a)
                    .digest()),
                  (this.V = this._hmac().update(this.V).digest()));
            }),
            (d.prototype.reseed = function (a, b, c, d) {
              "string" != typeof b && ((d = c), (c = b), (b = null)),
                (a = g.toBuffer(a, b)),
                (c = g.toBuffer(c, d)),
                h(
                  a.length >= this.minEntropy / 8,
                  "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
                ),
                this._update(a.concat(c || [])),
                (this.reseed = 1);
            }),
            (d.prototype.generate = function (a, b, c, d) {
              if (this.reseed > this.reseedInterval)
                throw new Error("Reseed is required");
              "string" != typeof b && ((d = c), (c = b), (b = null)),
                c && ((c = g.toArray(c, d)), this._update(c));
              for (var e = []; e.length < a; )
                (this.V = this._hmac().update(this.V).digest()),
                  (e = e.concat(this.V));
              var f = e.slice(0, a);
              return this._update(c), this.reseed++, g.encode(f, b);
            });
        },
        { "../elliptic": 9, "hash.js": 24 },
      ],
      21: [
        function (a, b, c) {
          b.exports = void 0;
        },
        {},
      ],
      22: [
        function (a, b, c) {
          "use strict";
          function d(a, b) {
            if (Array.isArray(a)) return a.slice();
            if (!a) return [];
            var c = [];
            if ("string" != typeof a) {
              for (var d = 0; d < a.length; d++) c[d] = 0 | a[d];
              return c;
            }
            if (b) {
              if ("hex" === b) {
                (a = a.replace(/[^a-z0-9]+/gi, "")),
                  a.length % 2 !== 0 && (a = "0" + a);
                for (var d = 0; d < a.length; d += 2)
                  c.push(parseInt(a[d] + a[d + 1], 16));
              }
            } else
              for (var d = 0; d < a.length; d++) {
                var e = a.charCodeAt(d),
                  f = e >> 8,
                  g = 255 & e;
                f ? c.push(f, g) : c.push(g);
              }
            return c;
          }
          function e(a) {
            return 1 === a.length ? "0" + a : a;
          }
          function f(a) {
            for (var b = "", c = 0; c < a.length; c++)
              b += e(a[c].toString(16));
            return b;
          }
          function g(a, b) {
            for (
              var c = [], d = 1 << (b + 1), e = a.clone();
              e.cmpn(1) >= 0;

            ) {
              var f;
              if (e.isOdd()) {
                var g = e.andln(d - 1);
                (f = g > (d >> 1) - 1 ? (d >> 1) - g : g), e.isubn(f);
              } else f = 0;
              c.push(f);
              for (
                var h = 0 !== e.cmpn(0) && 0 === e.andln(d - 1) ? b + 1 : 1,
                  i = 1;
                i < h;
                i++
              )
                c.push(0);
              e.iushrn(h);
            }
            return c;
          }
          function h(a, b) {
            var c = [[], []];
            (a = a.clone()), (b = b.clone());
            for (var d = 0, e = 0; a.cmpn(-d) > 0 || b.cmpn(-e) > 0; ) {
              var f = (a.andln(3) + d) & 3,
                g = (b.andln(3) + e) & 3;
              3 === f && (f = -1), 3 === g && (g = -1);
              var h;
              if (0 === (1 & f)) h = 0;
              else {
                var i = (a.andln(7) + d) & 7;
                h = (3 !== i && 5 !== i) || 2 !== g ? f : -f;
              }
              c[0].push(h);
              var j;
              if (0 === (1 & g)) j = 0;
              else {
                var i = (b.andln(7) + e) & 7;
                j = (3 !== i && 5 !== i) || 2 !== f ? g : -g;
              }
              c[1].push(j),
                2 * d === h + 1 && (d = 1 - d),
                2 * e === j + 1 && (e = 1 - e),
                a.iushrn(1),
                b.iushrn(1);
            }
            return c;
          }
          function i(a, b, c) {
            var d = "_" + b;
            a.prototype[b] = function () {
              return void 0 !== this[d] ? this[d] : (this[d] = c.call(this));
            };
          }
          function j(a) {
            return "string" == typeof a ? l.toArray(a, "hex") : a;
          }
          function k(a) {
            return new m(a, "hex", "le");
          }
          var l = c,
            m = a("bn.js");
          (l.assert = function (a, b) {
            if (!a) throw new Error(b || "Assertion failed");
          }),
            (l.toArray = d),
            (l.zero2 = e),
            (l.toHex = f),
            (l.encode = function (a, b) {
              return "hex" === b ? f(a) : a;
            }),
            (l.getNAF = g),
            (l.getJSF = h),
            (l.cachedProperty = i),
            (l.parseBytes = j),
            (l.intFromLE = k);
        },
        { "bn.js": 6 },
      ],
      23: [
        function (a, b, c) {
          b.exports = { version: "6.3.3" };
        },
        {},
      ],
      24: [
        function (a, b, c) {
          var d = c;
          (d.utils = a("./hash/utils")),
            (d.common = a("./hash/common")),
            (d.sha = a("./hash/sha")),
            (d.ripemd = a("./hash/ripemd")),
            (d.hmac = a("./hash/hmac")),
            (d.sha1 = d.sha.sha1),
            (d.sha256 = d.sha.sha256),
            (d.sha224 = d.sha.sha224),
            (d.sha384 = d.sha.sha384),
            (d.sha512 = d.sha.sha512),
            (d.ripemd160 = d.ripemd.ripemd160);
        },
        {
          "./hash/common": 25,
          "./hash/hmac": 26,
          "./hash/ripemd": 27,
          "./hash/sha": 28,
          "./hash/utils": 35,
        },
      ],
      25: [
        function (a, b, c) {
          "use strict";
          function d() {
            (this.pending = null),
              (this.pendingTotal = 0),
              (this.blockSize = this.constructor.blockSize),
              (this.outSize = this.constructor.outSize),
              (this.hmacStrength = this.constructor.hmacStrength),
              (this.padLength = this.constructor.padLength / 8),
              (this.endian = "big"),
              (this._delta8 = this.blockSize / 8),
              (this._delta32 = this.blockSize / 32);
          }
          var e = a("./utils"),
            f = a("minimalistic-assert");
          (c.BlockHash = d),
            (d.prototype.update = function (a, b) {
              if (
                ((a = e.toArray(a, b)),
                this.pending
                  ? (this.pending = this.pending.concat(a))
                  : (this.pending = a),
                (this.pendingTotal += a.length),
                this.pending.length >= this._delta8)
              ) {
                a = this.pending;
                var c = a.length % this._delta8;
                (this.pending = a.slice(a.length - c, a.length)),
                  0 === this.pending.length && (this.pending = null),
                  (a = e.join32(a, 0, a.length - c, this.endian));
                for (var d = 0; d < a.length; d += this._delta32)
                  this._update(a, d, d + this._delta32);
              }
              return this;
            }),
            (d.prototype.digest = function (a) {
              return (
                this.update(this._pad()),
                f(null === this.pending),
                this._digest(a)
              );
            }),
            (d.prototype._pad = function () {
              var a = this.pendingTotal,
                b = this._delta8,
                c = b - ((a + this.padLength) % b),
                d = new Array(c + this.padLength);
              d[0] = 128;
              for (var e = 1; e < c; e++) d[e] = 0;
              if (((a <<= 3), "big" === this.endian)) {
                for (var f = 8; f < this.padLength; f++) d[e++] = 0;
                (d[e++] = 0),
                  (d[e++] = 0),
                  (d[e++] = 0),
                  (d[e++] = 0),
                  (d[e++] = (a >>> 24) & 255),
                  (d[e++] = (a >>> 16) & 255),
                  (d[e++] = (a >>> 8) & 255),
                  (d[e++] = 255 & a);
              } else
                for (
                  d[e++] = 255 & a,
                    d[e++] = (a >>> 8) & 255,
                    d[e++] = (a >>> 16) & 255,
                    d[e++] = (a >>> 24) & 255,
                    d[e++] = 0,
                    d[e++] = 0,
                    d[e++] = 0,
                    d[e++] = 0,
                    f = 8;
                  f < this.padLength;
                  f++
                )
                  d[e++] = 0;
              return d;
            });
        },
        { "./utils": 35, "minimalistic-assert": 39 },
      ],
      26: [
        function (a, b, c) {
          "use strict";
          function d(a, b, c) {
            return this instanceof d
              ? ((this.Hash = a),
                (this.blockSize = a.blockSize / 8),
                (this.outSize = a.outSize / 8),
                (this.inner = null),
                (this.outer = null),
                void this._init(e.toArray(b, c)))
              : new d(a, b, c);
          }
          var e = a("./utils"),
            f = a("minimalistic-assert");
          (b.exports = d),
            (d.prototype._init = function (a) {
              a.length > this.blockSize &&
                (a = new this.Hash().update(a).digest()),
                f(a.length <= this.blockSize);
              for (var b = a.length; b < this.blockSize; b++) a.push(0);
              for (b = 0; b < a.length; b++) a[b] ^= 54;
              for (
                this.inner = new this.Hash().update(a), b = 0;
                b < a.length;
                b++
              )
                a[b] ^= 106;
              this.outer = new this.Hash().update(a);
            }),
            (d.prototype.update = function (a, b) {
              return this.inner.update(a, b), this;
            }),
            (d.prototype.digest = function (a) {
              return (
                this.outer.update(this.inner.digest()), this.outer.digest(a)
              );
            });
        },
        { "./utils": 35, "minimalistic-assert": 39 },
      ],
      27: [
        function (a, b, c) {
          b.exports = { ripemd160: null };
        },
        {},
      ],
      28: [
        function (a, b, c) {
          "use strict";
          (c.sha1 = a("./sha/1")),
            (c.sha224 = a("./sha/224")),
            (c.sha256 = a("./sha/256")),
            (c.sha384 = a("./sha/384")),
            (c.sha512 = a("./sha/512"));
        },
        {
          "./sha/1": 29,
          "./sha/224": 30,
          "./sha/256": 31,
          "./sha/384": 32,
          "./sha/512": 33,
        },
      ],
      29: [
        function (a, b, c) {
          arguments[4][11][0].apply(c, arguments);
        },
        { dup: 11 },
      ],
      30: [
        function (a, b, c) {
          arguments[4][11][0].apply(c, arguments);
        },
        { dup: 11 },
      ],
      31: [
        function (a, b, c) {
          "use strict";
          function d() {
            return this instanceof d
              ? (r.call(this),
                (this.h = [
                  1779033703, 3144134277, 1013904242, 2773480762, 1359893119,
                  2600822924, 528734635, 1541459225,
                ]),
                (this.k = s),
                void (this.W = new Array(64)))
              : new d();
          }
          var e = a("../utils"),
            f = a("../common"),
            g = a("./common"),
            h = a("minimalistic-assert"),
            i = e.sum32,
            j = e.sum32_4,
            k = e.sum32_5,
            l = g.ch32,
            m = g.maj32,
            n = g.s0_256,
            o = g.s1_256,
            p = g.g0_256,
            q = g.g1_256,
            r = f.BlockHash,
            s = [
              1116352408, 1899447441, 3049323471, 3921009573, 961987163,
              1508970993, 2453635748, 2870763221, 3624381080, 310598401,
              607225278, 1426881987, 1925078388, 2162078206, 2614888103,
              3248222580, 3835390401, 4022224774, 264347078, 604807628,
              770255983, 1249150122, 1555081692, 1996064986, 2554220882,
              2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
              113926993, 338241895, 666307205, 773529912, 1294757372,
              1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
              2730485921, 2820302411, 3259730800, 3345764771, 3516065817,
              3600352804, 4094571909, 275423344, 430227734, 506948616,
              659060556, 883997877, 958139571, 1322822218, 1537002063,
              1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
              2428436474, 2756734187, 3204031479, 3329325298,
            ];
          e.inherits(d, r),
            (b.exports = d),
            (d.blockSize = 512),
            (d.outSize = 256),
            (d.hmacStrength = 192),
            (d.padLength = 64),
            (d.prototype._update = function (a, b) {
              for (var c = this.W, d = 0; d < 16; d++) c[d] = a[b + d];
              for (; d < c.length; d++)
                c[d] = j(q(c[d - 2]), c[d - 7], p(c[d - 15]), c[d - 16]);
              var e = this.h[0],
                f = this.h[1],
                g = this.h[2],
                r = this.h[3],
                s = this.h[4],
                t = this.h[5],
                u = this.h[6],
                v = this.h[7];
              for (h(this.k.length === c.length), d = 0; d < c.length; d++) {
                var w = k(v, o(s), l(s, t, u), this.k[d], c[d]),
                  x = i(n(e), m(e, f, g));
                (v = u),
                  (u = t),
                  (t = s),
                  (s = i(r, w)),
                  (r = g),
                  (g = f),
                  (f = e),
                  (e = i(w, x));
              }
              (this.h[0] = i(this.h[0], e)),
                (this.h[1] = i(this.h[1], f)),
                (this.h[2] = i(this.h[2], g)),
                (this.h[3] = i(this.h[3], r)),
                (this.h[4] = i(this.h[4], s)),
                (this.h[5] = i(this.h[5], t)),
                (this.h[6] = i(this.h[6], u)),
                (this.h[7] = i(this.h[7], v));
            }),
            (d.prototype._digest = function (a) {
              return "hex" === a
                ? e.toHex32(this.h, "big")
                : e.split32(this.h, "big");
            });
        },
        {
          "../common": 25,
          "../utils": 35,
          "./common": 34,
          "minimalistic-assert": 39,
        },
      ],
      32: [
        function (a, b, c) {
          arguments[4][11][0].apply(c, arguments);
        },
        { dup: 11 },
      ],
      33: [
        function (a, b, c) {
          "use strict";
          function d() {
            return this instanceof d
              ? (E.call(this),
                (this.h = [
                  1779033703, 4089235720, 3144134277, 2227873595, 1013904242,
                  4271175723, 2773480762, 1595750129, 1359893119, 2917565137,
                  2600822924, 725511199, 528734635, 4215389547, 1541459225,
                  327033209,
                ]),
                (this.k = F),
                void (this.W = new Array(160)))
              : new d();
          }
          function e(a, b, c, d, e) {
            var f = (a & c) ^ (~a & e);
            return f < 0 && (f += 4294967296), f;
          }
          function f(a, b, c, d, e, f) {
            var g = (b & d) ^ (~b & f);
            return g < 0 && (g += 4294967296), g;
          }
          function g(a, b, c, d, e) {
            var f = (a & c) ^ (a & e) ^ (c & e);
            return f < 0 && (f += 4294967296), f;
          }
          function h(a, b, c, d, e, f) {
            var g = (b & d) ^ (b & f) ^ (d & f);
            return g < 0 && (g += 4294967296), g;
          }
          function i(a, b) {
            var c = t(a, b, 28),
              d = t(b, a, 2),
              e = t(b, a, 7),
              f = c ^ d ^ e;
            return f < 0 && (f += 4294967296), f;
          }
          function j(a, b) {
            var c = u(a, b, 28),
              d = u(b, a, 2),
              e = u(b, a, 7),
              f = c ^ d ^ e;
            return f < 0 && (f += 4294967296), f;
          }
          function k(a, b) {
            var c = t(a, b, 14),
              d = t(a, b, 18),
              e = t(b, a, 9),
              f = c ^ d ^ e;
            return f < 0 && (f += 4294967296), f;
          }
          function l(a, b) {
            var c = u(a, b, 14),
              d = u(a, b, 18),
              e = u(b, a, 9),
              f = c ^ d ^ e;
            return f < 0 && (f += 4294967296), f;
          }
          function m(a, b) {
            var c = t(a, b, 1),
              d = t(a, b, 8),
              e = v(a, b, 7),
              f = c ^ d ^ e;
            return f < 0 && (f += 4294967296), f;
          }
          function n(a, b) {
            var c = u(a, b, 1),
              d = u(a, b, 8),
              e = w(a, b, 7),
              f = c ^ d ^ e;
            return f < 0 && (f += 4294967296), f;
          }
          function o(a, b) {
            var c = t(a, b, 19),
              d = t(b, a, 29),
              e = v(a, b, 6),
              f = c ^ d ^ e;
            return f < 0 && (f += 4294967296), f;
          }
          function p(a, b) {
            var c = u(a, b, 19),
              d = u(b, a, 29),
              e = w(a, b, 6),
              f = c ^ d ^ e;
            return f < 0 && (f += 4294967296), f;
          }
          var q = a("../utils"),
            r = a("../common"),
            s = a("minimalistic-assert"),
            t = q.rotr64_hi,
            u = q.rotr64_lo,
            v = q.shr64_hi,
            w = q.shr64_lo,
            x = q.sum64,
            y = q.sum64_hi,
            z = q.sum64_lo,
            A = q.sum64_4_hi,
            B = q.sum64_4_lo,
            C = q.sum64_5_hi,
            D = q.sum64_5_lo,
            E = r.BlockHash,
            F = [
              1116352408, 3609767458, 1899447441, 602891725, 3049323471,
              3964484399, 3921009573, 2173295548, 961987163, 4081628472,
              1508970993, 3053834265, 2453635748, 2937671579, 2870763221,
              3664609560, 3624381080, 2734883394, 310598401, 1164996542,
              607225278, 1323610764, 1426881987, 3590304994, 1925078388,
              4068182383, 2162078206, 991336113, 2614888103, 633803317,
              3248222580, 3479774868, 3835390401, 2666613458, 4022224774,
              944711139, 264347078, 2341262773, 604807628, 2007800933,
              770255983, 1495990901, 1249150122, 1856431235, 1555081692,
              3175218132, 1996064986, 2198950837, 2554220882, 3999719339,
              2821834349, 766784016, 2952996808, 2566594879, 3210313671,
              3203337956, 3336571891, 1034457026, 3584528711, 2466948901,
              113926993, 3758326383, 338241895, 168717936, 666307205,
              1188179964, 773529912, 1546045734, 1294757372, 1522805485,
              1396182291, 2643833823, 1695183700, 2343527390, 1986661051,
              1014477480, 2177026350, 1206759142, 2456956037, 344077627,
              2730485921, 1290863460, 2820302411, 3158454273, 3259730800,
              3505952657, 3345764771, 106217008, 3516065817, 3606008344,
              3600352804, 1432725776, 4094571909, 1467031594, 275423344,
              851169720, 430227734, 3100823752, 506948616, 1363258195,
              659060556, 3750685593, 883997877, 3785050280, 958139571,
              3318307427, 1322822218, 3812723403, 1537002063, 2003034995,
              1747873779, 3602036899, 1955562222, 1575990012, 2024104815,
              1125592928, 2227730452, 2716904306, 2361852424, 442776044,
              2428436474, 593698344, 2756734187, 3733110249, 3204031479,
              2999351573, 3329325298, 3815920427, 3391569614, 3928383900,
              3515267271, 566280711, 3940187606, 3454069534, 4118630271,
              4000239992, 116418474, 1914138554, 174292421, 2731055270,
              289380356, 3203993006, 460393269, 320620315, 685471733, 587496836,
              852142971, 1086792851, 1017036298, 365543100, 1126000580,
              2618297676, 1288033470, 3409855158, 1501505948, 4234509866,
              1607167915, 987167468, 1816402316, 1246189591,
            ];
          q.inherits(d, E),
            (b.exports = d),
            (d.blockSize = 1024),
            (d.outSize = 512),
            (d.hmacStrength = 192),
            (d.padLength = 128),
            (d.prototype._prepareBlock = function (a, b) {
              for (var c = this.W, d = 0; d < 32; d++) c[d] = a[b + d];
              for (; d < c.length; d += 2) {
                var e = o(c[d - 4], c[d - 3]),
                  f = p(c[d - 4], c[d - 3]),
                  g = c[d - 14],
                  h = c[d - 13],
                  i = m(c[d - 30], c[d - 29]),
                  j = n(c[d - 30], c[d - 29]),
                  k = c[d - 32],
                  l = c[d - 31];
                (c[d] = A(e, f, g, h, i, j, k, l)),
                  (c[d + 1] = B(e, f, g, h, i, j, k, l));
              }
            }),
            (d.prototype._update = function (a, b) {
              this._prepareBlock(a, b);
              var c = this.W,
                d = this.h[0],
                m = this.h[1],
                n = this.h[2],
                o = this.h[3],
                p = this.h[4],
                q = this.h[5],
                r = this.h[6],
                t = this.h[7],
                u = this.h[8],
                v = this.h[9],
                w = this.h[10],
                A = this.h[11],
                B = this.h[12],
                E = this.h[13],
                F = this.h[14],
                G = this.h[15];
              s(this.k.length === c.length);
              for (var H = 0; H < c.length; H += 2) {
                var I = F,
                  J = G,
                  K = k(u, v),
                  L = l(u, v),
                  M = e(u, v, w, A, B, E),
                  N = f(u, v, w, A, B, E),
                  O = this.k[H],
                  P = this.k[H + 1],
                  Q = c[H],
                  R = c[H + 1],
                  S = C(I, J, K, L, M, N, O, P, Q, R),
                  T = D(I, J, K, L, M, N, O, P, Q, R);
                (I = i(d, m)),
                  (J = j(d, m)),
                  (K = g(d, m, n, o, p, q)),
                  (L = h(d, m, n, o, p, q));
                var U = y(I, J, K, L),
                  V = z(I, J, K, L);
                (F = B),
                  (G = E),
                  (B = w),
                  (E = A),
                  (w = u),
                  (A = v),
                  (u = y(r, t, S, T)),
                  (v = z(t, t, S, T)),
                  (r = p),
                  (t = q),
                  (p = n),
                  (q = o),
                  (n = d),
                  (o = m),
                  (d = y(S, T, U, V)),
                  (m = z(S, T, U, V));
              }
              x(this.h, 0, d, m),
                x(this.h, 2, n, o),
                x(this.h, 4, p, q),
                x(this.h, 6, r, t),
                x(this.h, 8, u, v),
                x(this.h, 10, w, A),
                x(this.h, 12, B, E),
                x(this.h, 14, F, G);
            }),
            (d.prototype._digest = function (a) {
              return "hex" === a
                ? q.toHex32(this.h, "big")
                : q.split32(this.h, "big");
            });
        },
        { "../common": 25, "../utils": 35, "minimalistic-assert": 39 },
      ],
      34: [
        function (a, b, c) {
          "use strict";
          function d(a, b, c, d) {
            return 0 === a
              ? e(b, c, d)
              : 1 === a || 3 === a
              ? g(b, c, d)
              : 2 === a
              ? f(b, c, d)
              : void 0;
          }
          function e(a, b, c) {
            return (a & b) ^ (~a & c);
          }
          function f(a, b, c) {
            return (a & b) ^ (a & c) ^ (b & c);
          }
          function g(a, b, c) {
            return a ^ b ^ c;
          }
          function h(a) {
            return m(a, 2) ^ m(a, 13) ^ m(a, 22);
          }
          function i(a) {
            return m(a, 6) ^ m(a, 11) ^ m(a, 25);
          }
          function j(a) {
            return m(a, 7) ^ m(a, 18) ^ (a >>> 3);
          }
          function k(a) {
            return m(a, 17) ^ m(a, 19) ^ (a >>> 10);
          }
          var l = a("../utils"),
            m = l.rotr32;
          (c.ft_1 = d),
            (c.ch32 = e),
            (c.maj32 = f),
            (c.p32 = g),
            (c.s0_256 = h),
            (c.s1_256 = i),
            (c.g0_256 = j),
            (c.g1_256 = k);
        },
        { "../utils": 35 },
      ],
      35: [
        function (a, b, c) {
          "use strict";
          function d(a, b) {
            if (Array.isArray(a)) return a.slice();
            if (!a) return [];
            var c = [];
            if ("string" == typeof a)
              if (b) {
                if ("hex" === b)
                  for (
                    a = a.replace(/[^a-z0-9]+/gi, ""),
                      a.length % 2 !== 0 && (a = "0" + a),
                      d = 0;
                    d < a.length;
                    d += 2
                  )
                    c.push(parseInt(a[d] + a[d + 1], 16));
              } else
                for (var d = 0; d < a.length; d++) {
                  var e = a.charCodeAt(d),
                    f = e >> 8,
                    g = 255 & e;
                  f ? c.push(f, g) : c.push(g);
                }
            else for (d = 0; d < a.length; d++) c[d] = 0 | a[d];
            return c;
          }
          function e(a) {
            for (var b = "", c = 0; c < a.length; c++)
              b += h(a[c].toString(16));
            return b;
          }
          function f(a) {
            var b =
              (a >>> 24) |
              ((a >>> 8) & 65280) |
              ((a << 8) & 16711680) |
              ((255 & a) << 24);
            return b >>> 0;
          }
          function g(a, b) {
            for (var c = "", d = 0; d < a.length; d++) {
              var e = a[d];
              "little" === b && (e = f(e)), (c += i(e.toString(16)));
            }
            return c;
          }
          function h(a) {
            return 1 === a.length ? "0" + a : a;
          }
          function i(a) {
            return 7 === a.length
              ? "0" + a
              : 6 === a.length
              ? "00" + a
              : 5 === a.length
              ? "000" + a
              : 4 === a.length
              ? "0000" + a
              : 3 === a.length
              ? "00000" + a
              : 2 === a.length
              ? "000000" + a
              : 1 === a.length
              ? "0000000" + a
              : a;
          }
          function j(a, b, c, d) {
            var e = c - b;
            C(e % 4 === 0);
            for (
              var f = new Array(e / 4), g = 0, h = b;
              g < f.length;
              g++, h += 4
            ) {
              var i;
              (i =
                "big" === d
                  ? (a[h] << 24) | (a[h + 1] << 16) | (a[h + 2] << 8) | a[h + 3]
                  : (a[h + 3] << 24) |
                    (a[h + 2] << 16) |
                    (a[h + 1] << 8) |
                    a[h]),
                (f[g] = i >>> 0);
            }
            return f;
          }
          function k(a, b) {
            for (
              var c = new Array(4 * a.length), d = 0, e = 0;
              d < a.length;
              d++, e += 4
            ) {
              var f = a[d];
              "big" === b
                ? ((c[e] = f >>> 24),
                  (c[e + 1] = (f >>> 16) & 255),
                  (c[e + 2] = (f >>> 8) & 255),
                  (c[e + 3] = 255 & f))
                : ((c[e + 3] = f >>> 24),
                  (c[e + 2] = (f >>> 16) & 255),
                  (c[e + 1] = (f >>> 8) & 255),
                  (c[e] = 255 & f));
            }
            return c;
          }
          function l(a, b) {
            return (a >>> b) | (a << (32 - b));
          }
          function m(a, b) {
            return (a << b) | (a >>> (32 - b));
          }
          function n(a, b) {
            return (a + b) >>> 0;
          }
          function o(a, b, c) {
            return (a + b + c) >>> 0;
          }
          function p(a, b, c, d) {
            return (a + b + c + d) >>> 0;
          }
          function q(a, b, c, d, e) {
            return (a + b + c + d + e) >>> 0;
          }
          function r(a, b, c, d) {
            var e = a[b],
              f = a[b + 1],
              g = (d + f) >>> 0,
              h = (g < d ? 1 : 0) + c + e;
            (a[b] = h >>> 0), (a[b + 1] = g);
          }
          function s(a, b, c, d) {
            var e = (b + d) >>> 0,
              f = (e < b ? 1 : 0) + a + c;
            return f >>> 0;
          }
          function t(a, b, c, d) {
            var e = b + d;
            return e >>> 0;
          }
          function u(a, b, c, d, e, f, g, h) {
            var i = 0,
              j = b;
            (j = (j + d) >>> 0),
              (i += j < b ? 1 : 0),
              (j = (j + f) >>> 0),
              (i += j < f ? 1 : 0),
              (j = (j + h) >>> 0),
              (i += j < h ? 1 : 0);
            var k = a + c + e + g + i;
            return k >>> 0;
          }
          function v(a, b, c, d, e, f, g, h) {
            var i = b + d + f + h;
            return i >>> 0;
          }
          function w(a, b, c, d, e, f, g, h, i, j) {
            var k = 0,
              l = b;
            (l = (l + d) >>> 0),
              (k += l < b ? 1 : 0),
              (l = (l + f) >>> 0),
              (k += l < f ? 1 : 0),
              (l = (l + h) >>> 0),
              (k += l < h ? 1 : 0),
              (l = (l + j) >>> 0),
              (k += l < j ? 1 : 0);
            var m = a + c + e + g + i + k;
            return m >>> 0;
          }
          function x(a, b, c, d, e, f, g, h, i, j) {
            var k = b + d + f + h + j;
            return k >>> 0;
          }
          function y(a, b, c) {
            var d = (b << (32 - c)) | (a >>> c);
            return d >>> 0;
          }
          function z(a, b, c) {
            var d = (a << (32 - c)) | (b >>> c);
            return d >>> 0;
          }
          function A(a, b, c) {
            return a >>> c;
          }
          function B(a, b, c) {
            var d = (a << (32 - c)) | (b >>> c);
            return d >>> 0;
          }
          var C = a("minimalistic-assert"),
            D = a("inherits");
          (c.inherits = D),
            (c.toArray = d),
            (c.toHex = e),
            (c.htonl = f),
            (c.toHex32 = g),
            (c.zero2 = h),
            (c.zero8 = i),
            (c.join32 = j),
            (c.split32 = k),
            (c.rotr32 = l),
            (c.rotl32 = m),
            (c.sum32 = n),
            (c.sum32_3 = o),
            (c.sum32_4 = p),
            (c.sum32_5 = q),
            (c.sum64 = r),
            (c.sum64_hi = s),
            (c.sum64_lo = t),
            (c.sum64_4_hi = u),
            (c.sum64_4_lo = v),
            (c.sum64_5_hi = w),
            (c.sum64_5_lo = x),
            (c.rotr64_hi = y),
            (c.rotr64_lo = z),
            (c.shr64_hi = A),
            (c.shr64_lo = B);
        },
        { inherits: 36, "minimalistic-assert": 39 },
      ],
      36: [
        function (a, b, c) {
          "function" == typeof Object.create
            ? (b.exports = function (a, b) {
                (a.super_ = b),
                  (a.prototype = Object.create(b.prototype, {
                    constructor: {
                      value: a,
                      enumerable: !1,
                      writable: !0,
                      configurable: !0,
                    },
                  }));
              })
            : (b.exports = function (a, b) {
                a.super_ = b;
                var c = function () {};
                (c.prototype = b.prototype),
                  (a.prototype = new c()),
                  (a.prototype.constructor = a);
              });
        },
        {},
      ],
      37: [
        function (a, b, c) {
          arguments[4][36][0].apply(c, arguments);
        },
        { dup: 36 },
      ],
      38: [
        function (a, b, c) {
          (function (a, c) {
            !(function () {
              "use strict";
              function d(a, b, c) {
                (this.blocks = []),
                  (this.s = []),
                  (this.padding = b),
                  (this.outputBits = c),
                  (this.reset = !0),
                  (this.block = 0),
                  (this.start = 0),
                  (this.blockCount = (1600 - (a << 1)) >> 5),
                  (this.byteCount = this.blockCount << 2),
                  (this.outputBlocks = c >> 5),
                  (this.extraBytes = (31 & c) >> 3);
                for (var d = 0; d < 50; ++d) this.s[d] = 0;
              }
              var e = "object" == typeof window ? window : {},
                f =
                  !e.JS_SHA3_NO_NODE_JS &&
                  "object" == typeof a &&
                  a.versions &&
                  a.versions.node;
              f && (e = c);
              for (
                var g =
                    !e.JS_SHA3_NO_COMMON_JS &&
                    "object" == typeof b &&
                    b.exports,
                  h = "0123456789abcdef".split(""),
                  i = [31, 7936, 2031616, 520093696],
                  j = [1, 256, 65536, 16777216],
                  k = [6, 1536, 393216, 100663296],
                  l = [0, 8, 16, 24],
                  m = [
                    1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648,
                    32907, 0, 2147483649, 0, 2147516545, 2147483648, 32777,
                    2147483648, 138, 0, 136, 0, 2147516425, 0, 2147483658, 0,
                    2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
                    2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0,
                    2147483658, 2147483648, 2147516545, 2147483648, 32896,
                    2147483648, 2147483649, 0, 2147516424, 2147483648,
                  ],
                  n = [224, 256, 384, 512],
                  o = [128, 256],
                  p = ["hex", "buffer", "arrayBuffer", "array"],
                  q = function (a, b, c) {
                    return function (e) {
                      return new d(a, b, a).update(e)[c]();
                    };
                  },
                  r = function (a, b, c) {
                    return function (e, f) {
                      return new d(a, b, f).update(e)[c]();
                    };
                  },
                  s = function (a, b) {
                    var c = q(a, b, "hex");
                    (c.create = function () {
                      return new d(a, b, a);
                    }),
                      (c.update = function (a) {
                        return c.create().update(a);
                      });
                    for (var e = 0; e < p.length; ++e) {
                      var f = p[e];
                      c[f] = q(a, b, f);
                    }
                    return c;
                  },
                  t = function (a, b) {
                    var c = r(a, b, "hex");
                    (c.create = function (c) {
                      return new d(a, b, c);
                    }),
                      (c.update = function (a, b) {
                        return c.create(b).update(a);
                      });
                    for (var e = 0; e < p.length; ++e) {
                      var f = p[e];
                      c[f] = r(a, b, f);
                    }
                    return c;
                  },
                  u = [
                    { name: "keccak", padding: j, bits: n, createMethod: s },
                    { name: "sha3", padding: k, bits: n, createMethod: s },
                    { name: "shake", padding: i, bits: o, createMethod: t },
                  ],
                  v = {},
                  w = [],
                  x = 0;
                x < u.length;
                ++x
              )
                for (var y = u[x], z = y.bits, A = 0; A < z.length; ++A) {
                  var B = y.name + "_" + z[A];
                  w.push(B), (v[B] = y.createMethod(z[A], y.padding));
                }
              (d.prototype.update = function (a) {
                var b = "string" != typeof a;
                b && a.constructor === ArrayBuffer && (a = new Uint8Array(a));
                for (
                  var c,
                    d,
                    e = a.length,
                    f = this.blocks,
                    g = this.byteCount,
                    h = this.blockCount,
                    i = 0,
                    j = this.s;
                  i < e;

                ) {
                  if (this.reset)
                    for (
                      this.reset = !1, f[0] = this.block, c = 1;
                      c < h + 1;
                      ++c
                    )
                      f[c] = 0;
                  if (b)
                    for (c = this.start; i < e && c < g; ++i)
                      f[c >> 2] |= a[i] << l[3 & c++];
                  else
                    for (c = this.start; i < e && c < g; ++i)
                      (d = a.charCodeAt(i)),
                        d < 128
                          ? (f[c >> 2] |= d << l[3 & c++])
                          : d < 2048
                          ? ((f[c >> 2] |= (192 | (d >> 6)) << l[3 & c++]),
                            (f[c >> 2] |= (128 | (63 & d)) << l[3 & c++]))
                          : d < 55296 || d >= 57344
                          ? ((f[c >> 2] |= (224 | (d >> 12)) << l[3 & c++]),
                            (f[c >> 2] |=
                              (128 | ((d >> 6) & 63)) << l[3 & c++]),
                            (f[c >> 2] |= (128 | (63 & d)) << l[3 & c++]))
                          : ((d =
                              65536 +
                              (((1023 & d) << 10) |
                                (1023 & a.charCodeAt(++i)))),
                            (f[c >> 2] |= (240 | (d >> 18)) << l[3 & c++]),
                            (f[c >> 2] |=
                              (128 | ((d >> 12) & 63)) << l[3 & c++]),
                            (f[c >> 2] |=
                              (128 | ((d >> 6) & 63)) << l[3 & c++]),
                            (f[c >> 2] |= (128 | (63 & d)) << l[3 & c++]));
                  if (((this.lastByteIndex = c), c >= g)) {
                    for (
                      this.start = c - g, this.block = f[h], c = 0;
                      c < h;
                      ++c
                    )
                      j[c] ^= f[c];
                    C(j), (this.reset = !0);
                  } else this.start = c;
                }
                return this;
              }),
                (d.prototype.finalize = function () {
                  var a = this.blocks,
                    b = this.lastByteIndex,
                    c = this.blockCount,
                    d = this.s;
                  if (
                    ((a[b >> 2] |= this.padding[3 & b]),
                    this.lastByteIndex === this.byteCount)
                  )
                    for (a[0] = a[c], b = 1; b < c + 1; ++b) a[b] = 0;
                  for (a[c - 1] |= 2147483648, b = 0; b < c; ++b) d[b] ^= a[b];
                  C(d);
                }),
                (d.prototype.toString = d.prototype.hex =
                  function () {
                    this.finalize();
                    for (
                      var a,
                        b = this.blockCount,
                        c = this.s,
                        d = this.outputBlocks,
                        e = this.extraBytes,
                        f = 0,
                        g = 0,
                        i = "";
                      g < d;

                    ) {
                      for (f = 0; f < b && g < d; ++f, ++g)
                        (a = c[f]),
                          (i +=
                            h[(a >> 4) & 15] +
                            h[15 & a] +
                            h[(a >> 12) & 15] +
                            h[(a >> 8) & 15] +
                            h[(a >> 20) & 15] +
                            h[(a >> 16) & 15] +
                            h[(a >> 28) & 15] +
                            h[(a >> 24) & 15]);
                      g % b === 0 && (C(c), (f = 0));
                    }
                    return (
                      e &&
                        ((a = c[f]),
                        e > 0 && (i += h[(a >> 4) & 15] + h[15 & a]),
                        e > 1 && (i += h[(a >> 12) & 15] + h[(a >> 8) & 15]),
                        e > 2 && (i += h[(a >> 20) & 15] + h[(a >> 16) & 15])),
                      i
                    );
                  }),
                (d.prototype.arrayBuffer = function () {
                  this.finalize();
                  var a,
                    b = this.blockCount,
                    c = this.s,
                    d = this.outputBlocks,
                    e = this.extraBytes,
                    f = 0,
                    g = 0,
                    h = this.outputBits >> 3;
                  a = e ? new ArrayBuffer((d + 1) << 2) : new ArrayBuffer(h);
                  for (var i = new Uint32Array(a); g < d; ) {
                    for (f = 0; f < b && g < d; ++f, ++g) i[g] = c[f];
                    g % b === 0 && C(c);
                  }
                  return e && ((i[f] = c[f]), (a = a.slice(0, h))), a;
                }),
                (d.prototype.buffer = d.prototype.arrayBuffer),
                (d.prototype.digest = d.prototype.array =
                  function () {
                    this.finalize();
                    for (
                      var a,
                        b,
                        c = this.blockCount,
                        d = this.s,
                        e = this.outputBlocks,
                        f = this.extraBytes,
                        g = 0,
                        h = 0,
                        i = [];
                      h < e;

                    ) {
                      for (g = 0; g < c && h < e; ++g, ++h)
                        (a = h << 2),
                          (b = d[g]),
                          (i[a] = 255 & b),
                          (i[a + 1] = (b >> 8) & 255),
                          (i[a + 2] = (b >> 16) & 255),
                          (i[a + 3] = (b >> 24) & 255);
                      h % c === 0 && C(d);
                    }
                    return (
                      f &&
                        ((a = h << 2),
                        (b = d[g]),
                        f > 0 && (i[a] = 255 & b),
                        f > 1 && (i[a + 1] = (b >> 8) & 255),
                        f > 2 && (i[a + 2] = (b >> 16) & 255)),
                      i
                    );
                  });
              var C = function (a) {
                var b,
                  c,
                  d,
                  e,
                  f,
                  g,
                  h,
                  i,
                  j,
                  k,
                  l,
                  n,
                  o,
                  p,
                  q,
                  r,
                  s,
                  t,
                  u,
                  v,
                  w,
                  x,
                  y,
                  z,
                  A,
                  B,
                  C,
                  D,
                  E,
                  F,
                  G,
                  H,
                  I,
                  J,
                  K,
                  L,
                  M,
                  N,
                  O,
                  P,
                  Q,
                  R,
                  S,
                  T,
                  U,
                  V,
                  W,
                  X,
                  Y,
                  Z,
                  $,
                  _,
                  aa,
                  ba,
                  ca,
                  da,
                  ea,
                  fa,
                  ga,
                  ha,
                  ia,
                  ja,
                  ka;
                for (d = 0; d < 48; d += 2)
                  (e = a[0] ^ a[10] ^ a[20] ^ a[30] ^ a[40]),
                    (f = a[1] ^ a[11] ^ a[21] ^ a[31] ^ a[41]),
                    (g = a[2] ^ a[12] ^ a[22] ^ a[32] ^ a[42]),
                    (h = a[3] ^ a[13] ^ a[23] ^ a[33] ^ a[43]),
                    (i = a[4] ^ a[14] ^ a[24] ^ a[34] ^ a[44]),
                    (j = a[5] ^ a[15] ^ a[25] ^ a[35] ^ a[45]),
                    (k = a[6] ^ a[16] ^ a[26] ^ a[36] ^ a[46]),
                    (l = a[7] ^ a[17] ^ a[27] ^ a[37] ^ a[47]),
                    (n = a[8] ^ a[18] ^ a[28] ^ a[38] ^ a[48]),
                    (o = a[9] ^ a[19] ^ a[29] ^ a[39] ^ a[49]),
                    (b = n ^ ((g << 1) | (h >>> 31))),
                    (c = o ^ ((h << 1) | (g >>> 31))),
                    (a[0] ^= b),
                    (a[1] ^= c),
                    (a[10] ^= b),
                    (a[11] ^= c),
                    (a[20] ^= b),
                    (a[21] ^= c),
                    (a[30] ^= b),
                    (a[31] ^= c),
                    (a[40] ^= b),
                    (a[41] ^= c),
                    (b = e ^ ((i << 1) | (j >>> 31))),
                    (c = f ^ ((j << 1) | (i >>> 31))),
                    (a[2] ^= b),
                    (a[3] ^= c),
                    (a[12] ^= b),
                    (a[13] ^= c),
                    (a[22] ^= b),
                    (a[23] ^= c),
                    (a[32] ^= b),
                    (a[33] ^= c),
                    (a[42] ^= b),
                    (a[43] ^= c),
                    (b = g ^ ((k << 1) | (l >>> 31))),
                    (c = h ^ ((l << 1) | (k >>> 31))),
                    (a[4] ^= b),
                    (a[5] ^= c),
                    (a[14] ^= b),
                    (a[15] ^= c),
                    (a[24] ^= b),
                    (a[25] ^= c),
                    (a[34] ^= b),
                    (a[35] ^= c),
                    (a[44] ^= b),
                    (a[45] ^= c),
                    (b = i ^ ((n << 1) | (o >>> 31))),
                    (c = j ^ ((o << 1) | (n >>> 31))),
                    (a[6] ^= b),
                    (a[7] ^= c),
                    (a[16] ^= b),
                    (a[17] ^= c),
                    (a[26] ^= b),
                    (a[27] ^= c),
                    (a[36] ^= b),
                    (a[37] ^= c),
                    (a[46] ^= b),
                    (a[47] ^= c),
                    (b = k ^ ((e << 1) | (f >>> 31))),
                    (c = l ^ ((f << 1) | (e >>> 31))),
                    (a[8] ^= b),
                    (a[9] ^= c),
                    (a[18] ^= b),
                    (a[19] ^= c),
                    (a[28] ^= b),
                    (a[29] ^= c),
                    (a[38] ^= b),
                    (a[39] ^= c),
                    (a[48] ^= b),
                    (a[49] ^= c),
                    (p = a[0]),
                    (q = a[1]),
                    (V = (a[11] << 4) | (a[10] >>> 28)),
                    (W = (a[10] << 4) | (a[11] >>> 28)),
                    (D = (a[20] << 3) | (a[21] >>> 29)),
                    (E = (a[21] << 3) | (a[20] >>> 29)),
                    (ha = (a[31] << 9) | (a[30] >>> 23)),
                    (ia = (a[30] << 9) | (a[31] >>> 23)),
                    (R = (a[40] << 18) | (a[41] >>> 14)),
                    (S = (a[41] << 18) | (a[40] >>> 14)),
                    (J = (a[2] << 1) | (a[3] >>> 31)),
                    (K = (a[3] << 1) | (a[2] >>> 31)),
                    (r = (a[13] << 12) | (a[12] >>> 20)),
                    (s = (a[12] << 12) | (a[13] >>> 20)),
                    (X = (a[22] << 10) | (a[23] >>> 22)),
                    (Y = (a[23] << 10) | (a[22] >>> 22)),
                    (F = (a[33] << 13) | (a[32] >>> 19)),
                    (G = (a[32] << 13) | (a[33] >>> 19)),
                    (ja = (a[42] << 2) | (a[43] >>> 30)),
                    (ka = (a[43] << 2) | (a[42] >>> 30)),
                    (ba = (a[5] << 30) | (a[4] >>> 2)),
                    (ca = (a[4] << 30) | (a[5] >>> 2)),
                    (L = (a[14] << 6) | (a[15] >>> 26)),
                    (M = (a[15] << 6) | (a[14] >>> 26)),
                    (t = (a[25] << 11) | (a[24] >>> 21)),
                    (u = (a[24] << 11) | (a[25] >>> 21)),
                    (Z = (a[34] << 15) | (a[35] >>> 17)),
                    ($ = (a[35] << 15) | (a[34] >>> 17)),
                    (H = (a[45] << 29) | (a[44] >>> 3)),
                    (I = (a[44] << 29) | (a[45] >>> 3)),
                    (z = (a[6] << 28) | (a[7] >>> 4)),
                    (A = (a[7] << 28) | (a[6] >>> 4)),
                    (da = (a[17] << 23) | (a[16] >>> 9)),
                    (ea = (a[16] << 23) | (a[17] >>> 9)),
                    (N = (a[26] << 25) | (a[27] >>> 7)),
                    (O = (a[27] << 25) | (a[26] >>> 7)),
                    (v = (a[36] << 21) | (a[37] >>> 11)),
                    (w = (a[37] << 21) | (a[36] >>> 11)),
                    (_ = (a[47] << 24) | (a[46] >>> 8)),
                    (aa = (a[46] << 24) | (a[47] >>> 8)),
                    (T = (a[8] << 27) | (a[9] >>> 5)),
                    (U = (a[9] << 27) | (a[8] >>> 5)),
                    (B = (a[18] << 20) | (a[19] >>> 12)),
                    (C = (a[19] << 20) | (a[18] >>> 12)),
                    (fa = (a[29] << 7) | (a[28] >>> 25)),
                    (ga = (a[28] << 7) | (a[29] >>> 25)),
                    (P = (a[38] << 8) | (a[39] >>> 24)),
                    (Q = (a[39] << 8) | (a[38] >>> 24)),
                    (x = (a[48] << 14) | (a[49] >>> 18)),
                    (y = (a[49] << 14) | (a[48] >>> 18)),
                    (a[0] = p ^ (~r & t)),
                    (a[1] = q ^ (~s & u)),
                    (a[10] = z ^ (~B & D)),
                    (a[11] = A ^ (~C & E)),
                    (a[20] = J ^ (~L & N)),
                    (a[21] = K ^ (~M & O)),
                    (a[30] = T ^ (~V & X)),
                    (a[31] = U ^ (~W & Y)),
                    (a[40] = ba ^ (~da & fa)),
                    (a[41] = ca ^ (~ea & ga)),
                    (a[2] = r ^ (~t & v)),
                    (a[3] = s ^ (~u & w)),
                    (a[12] = B ^ (~D & F)),
                    (a[13] = C ^ (~E & G)),
                    (a[22] = L ^ (~N & P)),
                    (a[23] = M ^ (~O & Q)),
                    (a[32] = V ^ (~X & Z)),
                    (a[33] = W ^ (~Y & $)),
                    (a[42] = da ^ (~fa & ha)),
                    (a[43] = ea ^ (~ga & ia)),
                    (a[4] = t ^ (~v & x)),
                    (a[5] = u ^ (~w & y)),
                    (a[14] = D ^ (~F & H)),
                    (a[15] = E ^ (~G & I)),
                    (a[24] = N ^ (~P & R)),
                    (a[25] = O ^ (~Q & S)),
                    (a[34] = X ^ (~Z & _)),
                    (a[35] = Y ^ (~$ & aa)),
                    (a[44] = fa ^ (~ha & ja)),
                    (a[45] = ga ^ (~ia & ka)),
                    (a[6] = v ^ (~x & p)),
                    (a[7] = w ^ (~y & q)),
                    (a[16] = F ^ (~H & z)),
                    (a[17] = G ^ (~I & A)),
                    (a[26] = P ^ (~R & J)),
                    (a[27] = Q ^ (~S & K)),
                    (a[36] = Z ^ (~_ & T)),
                    (a[37] = $ ^ (~aa & U)),
                    (a[46] = ha ^ (~ja & ba)),
                    (a[47] = ia ^ (~ka & ca)),
                    (a[8] = x ^ (~p & r)),
                    (a[9] = y ^ (~q & s)),
                    (a[18] = H ^ (~z & B)),
                    (a[19] = I ^ (~A & C)),
                    (a[28] = R ^ (~J & L)),
                    (a[29] = S ^ (~K & M)),
                    (a[38] = _ ^ (~T & V)),
                    (a[39] = aa ^ (~U & W)),
                    (a[48] = ja ^ (~ba & da)),
                    (a[49] = ka ^ (~ca & ea)),
                    (a[0] ^= m[d]),
                    (a[1] ^= m[d + 1]);
              };
              if (g) b.exports = v;
              else for (var x = 0; x < w.length; ++x) e[w[x]] = v[w[x]];
            })();
          }.call(
            this,
            a("_process"),
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          ));
        },
        { _process: 40 },
      ],
      39: [
        function (a, b, c) {
          function d(a, b) {
            if (!a) throw new Error(b || "Assertion failed");
          }
          (b.exports = d),
            (d.equal = function (a, b, c) {
              if (a != b)
                throw new Error(c || "Assertion failed: " + a + " != " + b);
            });
        },
        {},
      ],
      40: [
        function (a, b, c) {
          function d() {
            throw new Error("setTimeout has not been defined");
          }
          function e() {
            throw new Error("clearTimeout has not been defined");
          }
          function f(a) {
            if (l === setTimeout) return setTimeout(a, 0);
            if ((l === d || !l) && setTimeout)
              return (l = setTimeout), setTimeout(a, 0);
            try {
              return l(a, 0);
            } catch (b) {
              try {
                return l.call(null, a, 0);
              } catch (b) {
                return l.call(this, a, 0);
              }
            }
          }
          function g(a) {
            if (m === clearTimeout) return clearTimeout(a);
            if ((m === e || !m) && clearTimeout)
              return (m = clearTimeout), clearTimeout(a);
            try {
              return m(a);
            } catch (b) {
              try {
                return m.call(null, a);
              } catch (b) {
                return m.call(this, a);
              }
            }
          }
          function h() {
            q &&
              o &&
              ((q = !1),
              o.length ? (p = o.concat(p)) : (r = -1),
              p.length && i());
          }
          function i() {
            if (!q) {
              var a = f(h);
              q = !0;
              for (var b = p.length; b; ) {
                for (o = p, p = []; ++r < b; ) o && o[r].run();
                (r = -1), (b = p.length);
              }
              (o = null), (q = !1), g(a);
            }
          }
          function j(a, b) {
            (this.fun = a), (this.array = b);
          }
          function k() {}
          var l,
            m,
            n = (b.exports = {});
          !(function () {
            try {
              l = "function" == typeof setTimeout ? setTimeout : d;
            } catch (a) {
              l = d;
            }
            try {
              m = "function" == typeof clearTimeout ? clearTimeout : e;
            } catch (a) {
              m = e;
            }
          })();
          var o,
            p = [],
            q = !1,
            r = -1;
          (n.nextTick = function (a) {
            var b = new Array(arguments.length - 1);
            if (arguments.length > 1)
              for (var c = 1; c < arguments.length; c++)
                b[c - 1] = arguments[c];
            p.push(new j(a, b)), 1 !== p.length || q || f(i);
          }),
            (j.prototype.run = function () {
              this.fun.apply(null, this.array);
            }),
            (n.title = "browser"),
            (n.browser = !0),
            (n.env = {}),
            (n.argv = []),
            (n.version = ""),
            (n.versions = {}),
            (n.on = k),
            (n.addListener = k),
            (n.once = k),
            (n.off = k),
            (n.removeListener = k),
            (n.removeAllListeners = k),
            (n.emit = k),
            (n.prependListener = k),
            (n.prependOnceListener = k),
            (n.listeners = function (a) {
              return [];
            }),
            (n.binding = function (a) {
              throw new Error("process.binding is not supported");
            }),
            (n.cwd = function () {
              return "/";
            }),
            (n.chdir = function (a) {
              throw new Error("process.chdir is not supported");
            }),
            (n.umask = function () {
              return 0;
            });
        },
        {},
      ],
      41: [
        function (b, c, d) {
          "use strict";
          !(function (b) {
            function e(a) {
              function b(a) {
                for (var b = 0, m = a.length; m >= 64; ) {
                  var n,
                    o,
                    p,
                    q,
                    r,
                    s = d,
                    t = e,
                    u = f,
                    v = g,
                    w = h,
                    x = i,
                    y = j,
                    z = k;
                  for (o = 0; o < 16; o++)
                    (p = b + 4 * o),
                      (l[o] =
                        ((255 & a[p]) << 24) |
                        ((255 & a[p + 1]) << 16) |
                        ((255 & a[p + 2]) << 8) |
                        (255 & a[p + 3]));
                  for (o = 16; o < 64; o++)
                    (n = l[o - 2]),
                      (q =
                        ((n >>> 17) | (n << 15)) ^
                        ((n >>> 19) | (n << 13)) ^
                        (n >>> 10)),
                      (n = l[o - 15]),
                      (r =
                        ((n >>> 7) | (n << 25)) ^
                        ((n >>> 18) | (n << 14)) ^
                        (n >>> 3)),
                      (l[o] =
                        (((q + l[o - 7]) | 0) + ((r + l[o - 16]) | 0)) | 0);
                  for (o = 0; o < 64; o++)
                    (q =
                      ((((((w >>> 6) | (w << 26)) ^
                        ((w >>> 11) | (w << 21)) ^
                        ((w >>> 25) | (w << 7))) +
                        ((w & x) ^ (~w & y))) |
                        0) +
                        ((z + ((c[o] + l[o]) | 0)) | 0)) |
                      0),
                      (r =
                        ((((s >>> 2) | (s << 30)) ^
                          ((s >>> 13) | (s << 19)) ^
                          ((s >>> 22) | (s << 10))) +
                          ((s & t) ^ (s & u) ^ (t & u))) |
                        0),
                      (z = y),
                      (y = x),
                      (x = w),
                      (w = (v + q) | 0),
                      (v = u),
                      (u = t),
                      (t = s),
                      (s = (q + r) | 0);
                  (d = (d + s) | 0),
                    (e = (e + t) | 0),
                    (f = (f + u) | 0),
                    (g = (g + v) | 0),
                    (h = (h + w) | 0),
                    (i = (i + x) | 0),
                    (j = (j + y) | 0),
                    (k = (k + z) | 0),
                    (b += 64),
                    (m -= 64);
                }
              }
              var c = [
                  1116352408, 1899447441, 3049323471, 3921009573, 961987163,
                  1508970993, 2453635748, 2870763221, 3624381080, 310598401,
                  607225278, 1426881987, 1925078388, 2162078206, 2614888103,
                  3248222580, 3835390401, 4022224774, 264347078, 604807628,
                  770255983, 1249150122, 1555081692, 1996064986, 2554220882,
                  2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
                  113926993, 338241895, 666307205, 773529912, 1294757372,
                  1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
                  2730485921, 2820302411, 3259730800, 3345764771, 3516065817,
                  3600352804, 4094571909, 275423344, 430227734, 506948616,
                  659060556, 883997877, 958139571, 1322822218, 1537002063,
                  1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
                  2428436474, 2756734187, 3204031479, 3329325298,
                ],
                d = 1779033703,
                e = 3144134277,
                f = 1013904242,
                g = 2773480762,
                h = 1359893119,
                i = 2600822924,
                j = 528734635,
                k = 1541459225,
                l = new Array(64);
              b(a);
              var m,
                n = a.length % 64,
                o = (a.length / 536870912) | 0,
                p = a.length << 3,
                q = n < 56 ? 56 : 120,
                r = a.slice(a.length - n, a.length);
              for (r.push(128), m = n + 1; m < q; m++) r.push(0);
              return (
                r.push((o >>> 24) & 255),
                r.push((o >>> 16) & 255),
                r.push((o >>> 8) & 255),
                r.push((o >>> 0) & 255),
                r.push((p >>> 24) & 255),
                r.push((p >>> 16) & 255),
                r.push((p >>> 8) & 255),
                r.push((p >>> 0) & 255),
                b(r),
                [
                  (d >>> 24) & 255,
                  (d >>> 16) & 255,
                  (d >>> 8) & 255,
                  (d >>> 0) & 255,
                  (e >>> 24) & 255,
                  (e >>> 16) & 255,
                  (e >>> 8) & 255,
                  (e >>> 0) & 255,
                  (f >>> 24) & 255,
                  (f >>> 16) & 255,
                  (f >>> 8) & 255,
                  (f >>> 0) & 255,
                  (g >>> 24) & 255,
                  (g >>> 16) & 255,
                  (g >>> 8) & 255,
                  (g >>> 0) & 255,
                  (h >>> 24) & 255,
                  (h >>> 16) & 255,
                  (h >>> 8) & 255,
                  (h >>> 0) & 255,
                  (i >>> 24) & 255,
                  (i >>> 16) & 255,
                  (i >>> 8) & 255,
                  (i >>> 0) & 255,
                  (j >>> 24) & 255,
                  (j >>> 16) & 255,
                  (j >>> 8) & 255,
                  (j >>> 0) & 255,
                  (k >>> 24) & 255,
                  (k >>> 16) & 255,
                  (k >>> 8) & 255,
                  (k >>> 0) & 255,
                ]
              );
            }
            function f(a, b, c) {
              function d() {
                for (var a = g - 1; a >= g - 4; a--) {
                  if ((h[a]++, h[a] <= 255)) return;
                  h[a] = 0;
                }
              }
              a = a.length <= 64 ? a : e(a);
              var f,
                g = 64 + b.length + 4,
                h = new Array(g),
                i = new Array(64),
                j = [];
              for (f = 0; f < 64; f++) h[f] = 54;
              for (f = 0; f < a.length; f++) h[f] ^= a[f];
              for (f = 0; f < b.length; f++) h[64 + f] = b[f];
              for (f = g - 4; f < g; f++) h[f] = 0;
              for (f = 0; f < 64; f++) i[f] = 92;
              for (f = 0; f < a.length; f++) i[f] ^= a[f];
              for (; c >= 32; )
                d(), (j = j.concat(e(i.concat(e(h))))), (c -= 32);
              return (
                c > 0 && (d(), (j = j.concat(e(i.concat(e(h))).slice(0, c)))), j
              );
            }
            function g(a, b, c, d, e) {
              var f;
              for (k(a, 16 * (2 * c - 1), e, 0, 16), f = 0; f < 2 * c; f++)
                j(a, 16 * f, e, 16), i(e, d), k(e, 0, a, b + 16 * f, 16);
              for (f = 0; f < c; f++) k(a, b + 2 * f * 16, a, 16 * f, 16);
              for (f = 0; f < c; f++)
                k(a, b + 16 * (2 * f + 1), a, 16 * (f + c), 16);
            }
            function h(a, b) {
              return (a << b) | (a >>> (32 - b));
            }
            function i(a, b) {
              k(a, 0, b, 0, 16);
              for (var c = 8; c > 0; c -= 2)
                (b[4] ^= h(b[0] + b[12], 7)),
                  (b[8] ^= h(b[4] + b[0], 9)),
                  (b[12] ^= h(b[8] + b[4], 13)),
                  (b[0] ^= h(b[12] + b[8], 18)),
                  (b[9] ^= h(b[5] + b[1], 7)),
                  (b[13] ^= h(b[9] + b[5], 9)),
                  (b[1] ^= h(b[13] + b[9], 13)),
                  (b[5] ^= h(b[1] + b[13], 18)),
                  (b[14] ^= h(b[10] + b[6], 7)),
                  (b[2] ^= h(b[14] + b[10], 9)),
                  (b[6] ^= h(b[2] + b[14], 13)),
                  (b[10] ^= h(b[6] + b[2], 18)),
                  (b[3] ^= h(b[15] + b[11], 7)),
                  (b[7] ^= h(b[3] + b[15], 9)),
                  (b[11] ^= h(b[7] + b[3], 13)),
                  (b[15] ^= h(b[11] + b[7], 18)),
                  (b[1] ^= h(b[0] + b[3], 7)),
                  (b[2] ^= h(b[1] + b[0], 9)),
                  (b[3] ^= h(b[2] + b[1], 13)),
                  (b[0] ^= h(b[3] + b[2], 18)),
                  (b[6] ^= h(b[5] + b[4], 7)),
                  (b[7] ^= h(b[6] + b[5], 9)),
                  (b[4] ^= h(b[7] + b[6], 13)),
                  (b[5] ^= h(b[4] + b[7], 18)),
                  (b[11] ^= h(b[10] + b[9], 7)),
                  (b[8] ^= h(b[11] + b[10], 9)),
                  (b[9] ^= h(b[8] + b[11], 13)),
                  (b[10] ^= h(b[9] + b[8], 18)),
                  (b[12] ^= h(b[15] + b[14], 7)),
                  (b[13] ^= h(b[12] + b[15], 9)),
                  (b[14] ^= h(b[13] + b[12], 13)),
                  (b[15] ^= h(b[14] + b[13], 18));
              for (c = 0; c < 16; ++c) a[c] += b[c];
            }
            function j(a, b, c, d) {
              for (var e = 0; e < d; e++) c[e] ^= a[b + e];
            }
            function k(a, b, c, d, e) {
              for (; e--; ) c[d++] = a[b++];
            }
            function l(a) {
              if (!a || "number" != typeof a.length) return !1;
              for (var b = 0; b < a.length; b++) {
                if ("number" != typeof a[b]) return !1;
                var c = parseInt(a[b]);
                if (c != a[b] || c < 0 || c >= 256) return !1;
              }
              return !0;
            }
            function m(a, b) {
              var c = parseInt(a);
              if (a != c) throw new Error("invalid " + b);
              return c;
            }
            function n(a, b, c, d, e, h, i) {
              if (!i) throw new Error("missing callback");
              if (
                ((c = m(c, "N")),
                (d = m(d, "r")),
                (e = m(e, "p")),
                (h = m(h, "dkLen")),
                0 === c || 0 !== (c & (c - 1)))
              )
                throw new Error("N must be power of 2");
              if (c > o / 128 / d) throw new Error("N too large");
              if (d > o / 128 / e) throw new Error("r too large");
              if (!l(a)) throw new Error("password must be an array or buffer");
              if (!l(b)) throw new Error("salt must be an array or buffer");
              for (
                var n = f(a, b, 128 * e * d),
                  p = new Uint32Array(32 * e * d),
                  q = 0;
                q < p.length;
                q++
              ) {
                var r = 4 * q;
                p[q] =
                  ((255 & n[r + 3]) << 24) |
                  ((255 & n[r + 2]) << 16) |
                  ((255 & n[r + 1]) << 8) |
                  ((255 & n[r + 0]) << 0);
              }
              var s,
                t,
                u = new Uint32Array(64 * d),
                v = new Uint32Array(32 * d * c),
                w = 32 * d,
                x = new Uint32Array(16),
                y = new Uint32Array(16),
                z = e * c * 2,
                A = 0,
                B = null,
                C = !1,
                D = 0,
                E = 0,
                F = parseInt(1e3 / d),
                G =
                  "undefined" != typeof setImmediate
                    ? setImmediate
                    : setTimeout,
                H = function () {
                  if (C) return i(new Error("cancelled"), A / z);
                  switch (D) {
                    case 0:
                      (t = 32 * E * d), k(p, t, u, 0, w), (D = 1), (s = 0);
                    case 1:
                      var b = c - s;
                      b > F && (b = F);
                      for (var l = 0; l < b; l++)
                        k(u, 0, v, (s + l) * w, w), g(u, w, d, x, y);
                      (s += b), (A += b);
                      var m = parseInt((1e3 * A) / z);
                      if (m !== B) {
                        if ((C = i(null, A / z))) break;
                        B = m;
                      }
                      if (s < c) break;
                      (s = 0), (D = 2);
                    case 2:
                      var b = c - s;
                      b > F && (b = F);
                      for (var l = 0; l < b; l++) {
                        var o = 16 * (2 * d - 1),
                          q = u[o] & (c - 1);
                        j(v, q * w, u, w), g(u, w, d, x, y);
                      }
                      (s += b), (A += b);
                      var m = parseInt((1e3 * A) / z);
                      if (m !== B) {
                        if ((C = i(null, A / z))) break;
                        B = m;
                      }
                      if (s < c) break;
                      if ((k(u, 0, p, t, w), E++, E < e)) {
                        D = 0;
                        break;
                      }
                      n = [];
                      for (var l = 0; l < p.length; l++)
                        n.push((p[l] >> 0) & 255),
                          n.push((p[l] >> 8) & 255),
                          n.push((p[l] >> 16) & 255),
                          n.push((p[l] >> 24) & 255);
                      var r = f(a, n, h);
                      return i(null, 1, r);
                  }
                  G(H);
                };
              H();
            }
            var o = 2147483647;
            "undefined" != typeof d
              ? (c.exports = n)
              : "function" == typeof a && a.amd
              ? a(n)
              : b && (b.scrypt && (b._scrypt = b.scrypt), (b.scrypt = n));
          })(this);
        },
        {},
      ],
      42: [
        function (a, b, c) {
          (function (a, b) {
            !(function (b, c) {
              "use strict";
              function d(a) {
                return (p[o] = e.apply(c, a)), o++;
              }
              function e(a) {
                var b = [].slice.call(arguments, 1);
                return function () {
                  "function" == typeof a
                    ? a.apply(c, b)
                    : new Function("" + a)();
                };
              }
              function f(a) {
                if (q) setTimeout(e(f, a), 0);
                else {
                  var b = p[a];
                  if (b) {
                    q = !0;
                    try {
                      b();
                    } finally {
                      g(a), (q = !1);
                    }
                  }
                }
              }
              function g(a) {
                delete p[a];
              }
              function h() {
                n = function () {
                  var b = d(arguments);
                  return a.nextTick(e(f, b)), b;
                };
              }
              function i() {
                if (b.postMessage && !b.importScripts) {
                  var a = !0,
                    c = b.onmessage;
                  return (
                    (b.onmessage = function () {
                      a = !1;
                    }),
                    b.postMessage("", "*"),
                    (b.onmessage = c),
                    a
                  );
                }
              }
              function j() {
                var a = "setImmediate$" + Math.random() + "$",
                  c = function (c) {
                    c.source === b &&
                      "string" == typeof c.data &&
                      0 === c.data.indexOf(a) &&
                      f(+c.data.slice(a.length));
                  };
                b.addEventListener
                  ? b.addEventListener("message", c, !1)
                  : b.attachEvent("onmessage", c),
                  (n = function () {
                    var c = d(arguments);
                    return b.postMessage(a + c, "*"), c;
                  });
              }
              function k() {
                var a = new MessageChannel();
                (a.port1.onmessage = function (a) {
                  var b = a.data;
                  f(b);
                }),
                  (n = function () {
                    var b = d(arguments);
                    return a.port2.postMessage(b), b;
                  });
              }
              function l() {
                var a = r.documentElement;
                n = function () {
                  var b = d(arguments),
                    c = r.createElement("script");
                  return (
                    (c.onreadystatechange = function () {
                      f(b),
                        (c.onreadystatechange = null),
                        a.removeChild(c),
                        (c = null);
                    }),
                    a.appendChild(c),
                    b
                  );
                };
              }
              function m() {
                n = function () {
                  var a = d(arguments);
                  return setTimeout(e(f, a), 0), a;
                };
              }
              if (!b.setImmediate) {
                var n,
                  o = 1,
                  p = {},
                  q = !1,
                  r = b.document,
                  s = Object.getPrototypeOf && Object.getPrototypeOf(b);
                (s = s && s.setTimeout ? s : b),
                  "[object process]" === {}.toString.call(b.process)
                    ? h()
                    : i()
                    ? j()
                    : b.MessageChannel
                    ? k()
                    : r && "onreadystatechange" in r.createElement("script")
                    ? l()
                    : m(),
                  (s.setImmediate = n),
                  (s.clearImmediate = g);
              }
            })(
              "undefined" == typeof self
                ? "undefined" == typeof b
                  ? this
                  : b
                : self
            );
          }.call(
            this,
            a("_process"),
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          ));
        },
        { _process: 40 },
      ],
      43: [
        function (a, b, c) {
          (function (a) {
            var c;
            if (a.crypto && crypto.getRandomValues) {
              var d = new Uint8Array(16);
              c = function () {
                return crypto.getRandomValues(d), d;
              };
            }
            if (!c) {
              var e = new Array(16);
              c = function () {
                for (var a, b = 0; b < 16; b++)
                  0 === (3 & b) && (a = 4294967296 * Math.random()),
                    (e[b] = (a >>> ((3 & b) << 3)) & 255);
                return e;
              };
            }
            b.exports = c;
          }.call(
            this,
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          ));
        },
        {},
      ],
      44: [
        function (a, b, c) {
          function d(a, b, c) {
            var d = (b && c) || 0,
              e = 0;
            for (
              b = b || [],
                a.toLowerCase().replace(/[0-9a-f]{2}/g, function (a) {
                  e < 16 && (b[d + e++] = j[a]);
                });
              e < 16;

            )
              b[d + e++] = 0;
            return b;
          }
          function e(a, b) {
            var c = b || 0,
              d = i;
            return (
              d[a[c++]] +
              d[a[c++]] +
              d[a[c++]] +
              d[a[c++]] +
              "-" +
              d[a[c++]] +
              d[a[c++]] +
              "-" +
              d[a[c++]] +
              d[a[c++]] +
              "-" +
              d[a[c++]] +
              d[a[c++]] +
              "-" +
              d[a[c++]] +
              d[a[c++]] +
              d[a[c++]] +
              d[a[c++]] +
              d[a[c++]] +
              d[a[c++]]
            );
          }
          function f(a, b, c) {
            var d = (b && c) || 0,
              f = b || [];
            a = a || {};
            var g = void 0 !== a.clockseq ? a.clockseq : n,
              h = void 0 !== a.msecs ? a.msecs : new Date().getTime(),
              i = void 0 !== a.nsecs ? a.nsecs : p + 1,
              j = h - o + (i - p) / 1e4;
            if (
              (j < 0 && void 0 === a.clockseq && (g = (g + 1) & 16383),
              (j < 0 || h > o) && void 0 === a.nsecs && (i = 0),
              i >= 1e4)
            )
              throw new Error(
                "uuid.v1(): Can't create more than 10M uuids/sec"
              );
            (o = h), (p = i), (n = g), (h += 122192928e5);
            var k = (1e4 * (268435455 & h) + i) % 4294967296;
            (f[d++] = (k >>> 24) & 255),
              (f[d++] = (k >>> 16) & 255),
              (f[d++] = (k >>> 8) & 255),
              (f[d++] = 255 & k);
            var l = ((h / 4294967296) * 1e4) & 268435455;
            (f[d++] = (l >>> 8) & 255),
              (f[d++] = 255 & l),
              (f[d++] = ((l >>> 24) & 15) | 16),
              (f[d++] = (l >>> 16) & 255),
              (f[d++] = (g >>> 8) | 128),
              (f[d++] = 255 & g);
            for (var q = a.node || m, r = 0; r < 6; r++) f[d + r] = q[r];
            return b ? b : e(f);
          }
          function g(a, b, c) {
            var d = (b && c) || 0;
            "string" == typeof a &&
              ((b = "binary" == a ? new Array(16) : null), (a = null)),
              (a = a || {});
            var f = a.random || (a.rng || h)();
            if (((f[6] = (15 & f[6]) | 64), (f[8] = (63 & f[8]) | 128), b))
              for (var g = 0; g < 16; g++) b[d + g] = f[g];
            return b || e(f);
          }
          for (var h = a("./rng"), i = [], j = {}, k = 0; k < 256; k++)
            (i[k] = (k + 256).toString(16).substr(1)), (j[i[k]] = k);
          var l = h(),
            m = [1 | l[0], l[1], l[2], l[3], l[4], l[5]],
            n = 16383 & ((l[6] << 8) | l[7]),
            o = 0,
            p = 0,
            q = g;
          (q.v1 = f),
            (q.v4 = g),
            (q.parse = d),
            (q.unparse = e),
            (b.exports = q);
        },
        { "./rng": 43 },
      ],
      45: [
        function (a, b, c) {
          b.exports = { version: "3.0.21" };
        },
        {},
      ],
      46: [
        function (a, b, c) {
          "use strict";
          try {
            b.exports.XMLHttpRequest = XMLHttpRequest;
          } catch (d) {
            console.log("Warning: XMLHttpRequest is not defined"),
              (b.exports.XMLHttpRequest = null);
          }
        },
        {},
      ],
      47: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            var b = [];
            for (var c in a)
              if (null != a[c]) {
                var d = j.hexlify(a[c]);
                ({ gasLimit: !0, gasPrice: !0, nonce: !0, value: !0 }[c] &&
                  (d = j.hexStripZeros(d)),
                  b.push(c + "=" + d));
              }
            return b.join("&");
          }
          function e(a, b) {
            i.call(this, a);
            var c = null;
            switch (this.name) {
              case "homestead":
                c = "https://api.etherscan.io";
                break;
              case "ropsten":
                c = "https://api-ropsten.etherscan.io";
                break;
              case "rinkeby":
                c = "https://api-rinkeby.etherscan.io";
                break;
              case "kovan":
                c = "https://api-kovan.etherscan.io";
                break;
              default:
                throw new Error("unsupported network");
            }
            j.defineProperty(this, "baseUrl", c),
              j.defineProperty(this, "apiKey", b || null);
          }
          function f(a) {
            if (
              0 == a.status &&
              ("No records found" === a.message ||
                "No transactions found" === a.message)
            )
              return a.result;
            if (1 != a.status || "OK" != a.message) {
              var b = new Error("invalid response");
              throw ((b.result = JSON.stringify(a)), b);
            }
            return a.result;
          }
          function g(a) {
            if ("2.0" != a.jsonrpc) {
              var b = new Error("invalid response");
              throw ((b.result = JSON.stringify(a)), b);
            }
            if (a.error) {
              var b = new Error(a.error.message || "unknown error");
              throw (
                (a.error.code && (b.code = a.error.code),
                a.error.data && (b.data = a.error.data),
                b)
              );
            }
            return a.result;
          }
          function h(a) {
            if ("pending" === a) throw new Error("pending not supported");
            return "latest" === a ? a : parseInt(a.substring(2), 16);
          }
          var i = a("./provider.js"),
            j = (function () {
              var b = a("../utils/convert.js");
              return {
                defineProperty: a("../utils/properties.js").defineProperty,
                hexlify: b.hexlify,
                hexStripZeros: b.hexStripZeros,
              };
            })();
          i.inherits(e),
            j.defineProperty(e.prototype, "_call", function () {}),
            j.defineProperty(e.prototype, "_callProxy", function () {}),
            j.defineProperty(e.prototype, "perform", function (a, b) {
              b || (b = {});
              var c = this.baseUrl,
                e = "";
              switch ((this.apiKey && (e += "&apikey=" + this.apiKey), a)) {
                case "getBlockNumber":
                  return (
                    (c += "/api?module=proxy&action=eth_blockNumber" + e),
                    i.fetchJSON(c, null, g)
                  );
                case "getGasPrice":
                  return (
                    (c += "/api?module=proxy&action=eth_gasPrice" + e),
                    i.fetchJSON(c, null, g)
                  );
                case "getBalance":
                  return (
                    (c +=
                      "/api?module=account&action=balance&address=" +
                      b.address),
                    (c += "&tag=" + b.blockTag + e),
                    i.fetchJSON(c, null, f)
                  );
                case "getTransactionCount":
                  return (
                    (c +=
                      "/api?module=proxy&action=eth_getTransactionCount&address=" +
                      b.address),
                    (c += "&tag=" + b.blockTag + e),
                    i.fetchJSON(c, null, g)
                  );
                case "getCode":
                  return (
                    (c +=
                      "/api?module=proxy&action=eth_getCode&address=" +
                      b.address),
                    (c += "&tag=" + b.blockTag + e),
                    i.fetchJSON(c, null, g)
                  );
                case "getStorageAt":
                  return (
                    (c +=
                      "/api?module=proxy&action=eth_getStorageAt&address=" +
                      b.address),
                    (c += "&position=" + b.position),
                    (c += "&tag=" + b.blockTag + e),
                    i.fetchJSON(c, null, g)
                  );
                case "sendTransaction":
                  return (
                    (c +=
                      "/api?module=proxy&action=eth_sendRawTransaction&hex=" +
                      b.signedTransaction),
                    (c += e),
                    i.fetchJSON(c, null, g)
                  );
                case "getBlock":
                  if (b.blockTag)
                    return (
                      (c +=
                        "/api?module=proxy&action=eth_getBlockByNumber&tag=" +
                        b.blockTag),
                      (c += "&boolean=false"),
                      (c += e),
                      i.fetchJSON(c, null, g)
                    );
                  throw new Error("getBlock by blockHash not implmeneted");
                case "getTransaction":
                  return (
                    (c +=
                      "/api?module=proxy&action=eth_getTransactionByHash&txhash=" +
                      b.transactionHash),
                    (c += e),
                    i.fetchJSON(c, null, g)
                  );
                case "getTransactionReceipt":
                  return (
                    (c +=
                      "/api?module=proxy&action=eth_getTransactionReceipt&txhash=" +
                      b.transactionHash),
                    (c += e),
                    i.fetchJSON(c, null, g)
                  );
                case "call":
                  var j = d(b.transaction);
                  return (
                    j && (j = "&" + j),
                    (c += "/api?module=proxy&action=eth_call" + j),
                    (c += e),
                    i.fetchJSON(c, null, g)
                  );
                case "estimateGas":
                  var j = d(b.transaction);
                  return (
                    j && (j = "&" + j),
                    (c += "/api?module=proxy&action=eth_estimateGas&" + j),
                    (c += e),
                    i.fetchJSON(c, null, g)
                  );
                case "getLogs":
                  c += "/api?module=logs&action=getLogs";
                  try {
                    if (
                      (b.filter.fromBlock &&
                        (c += "&fromBlock=" + h(b.filter.fromBlock)),
                      b.filter.toBlock &&
                        (c += "&toBlock=" + h(b.filter.toBlock)),
                      b.filter.address && (c += "&address=" + b.filter.address),
                      b.filter.topics && b.filter.topics.length > 0)
                    ) {
                      if (b.filter.topics.length > 1)
                        throw new Error("unsupported topic format");
                      var k = b.filter.topics[0];
                      if ("string" != typeof k || 66 !== k.length)
                        throw new Error("unsupported topic0 format");
                      c += "&topic0=" + k;
                    }
                  } catch (l) {
                    return Promise.reject(l);
                  }
                  c += e;
                  var m = this;
                  return i.fetchJSON(c, null, f).then(function (a) {
                    var b = {},
                      c = Promise.resolve();
                    return (
                      a.forEach(function (a) {
                        c = c.then(function () {
                          if (null == a.blockHash)
                            return (
                              (a.blockHash = b[a.transactionHash]),
                              null == a.blockHash
                                ? m
                                    .getTransaction(a.transactionHash)
                                    .then(function (c) {
                                      (b[a.transactionHash] = c.blockHash),
                                        (a.blockHash = c.blockHash);
                                    })
                                : void 0
                            );
                        });
                      }),
                      c.then(function () {
                        return a;
                      })
                    );
                  });
                case "getEtherPrice":
                  return "homestead" !== this.name
                    ? Promise.resolve(0)
                    : ((c += "/api?module=stats&action=ethprice"),
                      (c += e),
                      i.fetchJSON(c, null, f).then(function (a) {
                        return parseFloat(a.ethusd);
                      }));
              }
              return Promise.reject(new Error("not implemented - " + a));
            }),
            j.defineProperty(e.prototype, "getHistory", function (a, b, c) {
              var d = this.baseUrl,
                e = "";
              return (
                this.apiKey && (e += "&apikey=" + this.apiKey),
                null == b && (b = 0),
                null == c && (c = 99999999),
                this.resolveName(a).then(function (a) {
                  return (
                    (d += "/api?module=account&action=txlist&address=" + a),
                    (d += "&startblock=" + b),
                    (d += "&endblock=" + c),
                    (d += "&sort=asc"),
                    i.fetchJSON(d, null, f).then(function (a) {
                      var b = [];
                      return (
                        a.forEach(function (a) {
                          ["contractAddress", "to"].forEach(function (b) {
                            "" == a[b] && delete a[b];
                          }),
                            null == a.creates &&
                              null != a.contractAddress &&
                              (a.creates = a.contractAddress);
                          var c = i._formatters.checkTransactionResponse(a);
                          a.timeStamp && (c.timestamp = parseInt(a.timeStamp)),
                            b.push(c);
                        }),
                        b
                      );
                    })
                  );
                })
              );
            }),
            (b.exports = e);
        },
        {
          "../utils/convert.js": 61,
          "../utils/properties.js": 70,
          "./provider.js": 53,
        },
      ],
      48: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            if (0 === a.length) throw new Error("no providers");
            var b = {};
            if (
              (["chainId", "ensAddress", "name", "testnet"].forEach(function (
                c
              ) {
                for (var d = 1; d < a.length; d++)
                  if (a[0][c] !== a[d][c])
                    throw new Error(
                      "incompatible providers - " + c + " mismatch"
                    );
                b[c] = a[0][c];
              }),
              !(this instanceof d))
            )
              throw new Error("missing new");
            f.call(this, b),
              (a = a.slice(0)),
              Object.defineProperty(this, "providers", {
                get: function () {
                  return a.slice(0);
                },
              });
          }
          var e = a("inherits"),
            f = a("./provider.js"),
            g = (function () {
              return {
                defineProperty: a("../utils/properties.js").defineProperty,
              };
            })();
          e(d, f),
            g.defineProperty(d.prototype, "perform", function (a, b) {
              var c = this.providers;
              return new Promise(function (d, e) {
                function f() {
                  if (!c.length) return void e(g);
                  var h = c.shift();
                  h.perform(a, b).then(
                    function (a) {
                      d(a);
                    },
                    function (a) {
                      g || (g = a), f();
                    }
                  );
                }
                var g = null;
                f();
              });
            }),
            (b.exports = d);
        },
        { "../utils/properties.js": 70, "./provider.js": 53, inherits: 37 },
      ],
      49: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            return new g([new i(a), new f(a)]);
          }
          var e = a("./provider"),
            f = a("./etherscan-provider"),
            g = a("./fallback-provider"),
            h = a("./ipc-provider"),
            i = a("./infura-provider"),
            j = a("./json-rpc-provider"),
            k = a("./web3-provider"),
            c = {
              EtherscanProvider: f,
              FallbackProvider: g,
              InfuraProvider: i,
              JsonRpcProvider: j,
              Web3Provider: k,
              isProvider: e.isProvider,
              networks: e.networks,
              getDefaultProvider: d,
              Provider: e,
            };
          h && (c.IpcProvider = h), (b.exports = c);
        },
        {
          "./etherscan-provider": 47,
          "./fallback-provider": 48,
          "./infura-provider": 50,
          "./ipc-provider": 62,
          "./json-rpc-provider": 51,
          "./provider": 53,
          "./web3-provider": 54,
        },
      ],
      50: [
        function (a, b, c) {
          "use strict";
          function d(a, b) {
            h.checkNew(this, d), (a = e.getNetwork(a));
            var c = null;
            switch (a.name) {
              case "homestead":
                c = "mainnet.infura.io";
                break;
              case "ropsten":
                c = "ropsten.infura.io";
                break;
              case "rinkeby":
                c = "rinkeby.infura.io";
                break;
              case "kovan":
                c = "kovan.infura.io";
                break;
              default:
                throw new Error("unsupported network");
            }
            var i = "https://" + c + "/" + (b || "");
            f.call(this, i, a),
              g.defineProperty(this, "apiAccessToken", b || null);
          }
          var e = a("./provider"),
            f = a("./json-rpc-provider"),
            g = (function () {
              return {
                defineProperty: a("../utils/properties").defineProperty,
              };
            })(),
            h = a("../utils/errors");
          f.inherits(d),
            g.defineProperty(d.prototype, "_startPending", function () {
              console.log("WARNING: INFURA does not support pending filters");
            }),
            g.defineProperty(d.prototype, "_stopPending", function () {}),
            g.defineProperty(d.prototype, "getSigner", function (a) {
              h.throwError(
                "INFURA does not support signing",
                h.UNSUPPORTED_OPERATION,
                { operation: "getSigner" }
              );
            }),
            g.defineProperty(d.prototype, "listAccounts", function () {
              return Promise.resolve([]);
            }),
            (b.exports = d);
        },
        {
          "../utils/errors": 63,
          "../utils/properties": 70,
          "./json-rpc-provider": 51,
          "./provider": 53,
        },
      ],
      51: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            return new Promise(function (b) {
              setTimeout(function () {
                b();
              }, a);
            });
          }
          function e(a) {
            if (a.error) {
              var b = new Error(a.error.message);
              throw ((b.code = a.error.code), (b.data = a.error.data), b);
            }
            return a.result;
          }
          function f(a) {
            var b = {};
            for (var c in a) b[c] = k.hexlify(a[c]);
            return (
              ["gasLimit", "gasPrice", "nonce", "value"].forEach(function (a) {
                b[a] && (b[a] = k.hexStripZeros(b[a]));
              }),
              null != b.gasLimit &&
                null == b.gas &&
                ((b.gas = b.gasLimit), delete b.gasLimit),
              b
            );
          }
          function g(a) {
            return a ? a.toLowerCase() : a;
          }
          function h(a, b) {
            l.checkNew(this, h),
              k.defineProperty(this, "provider", a),
              b
                ? (k.defineProperty(this, "address", b),
                  k.defineProperty(this, "_syncAddress", !0))
                : (Object.defineProperty(this, "address", {
                    enumerable: !0,
                    get: function () {
                      l.throwError(
                        "no sync sync address available; use getAddress",
                        l.UNSUPPORTED_OPERATION,
                        { operation: "address" }
                      );
                    },
                  }),
                  k.defineProperty(this, "_syncAddress", !1));
          }
          function i(a, b) {
            if ((l.checkNew(this, i), 1 == arguments.length))
              if ("string" == typeof a)
                try {
                  (b = j.getNetwork(a)), (a = null);
                } catch (c) {}
              else a && null == a.url && ((b = a), (a = null));
            j.call(this, b),
              a || (a = "http://localhost:8545"),
              k.defineProperty(this, "url", a);
          }
          var j = a("./provider.js"),
            k = (function () {
              var b = a("../utils/convert");
              return {
                defineProperty: a("../utils/properties").defineProperty,
                hexlify: b.hexlify,
                isHexString: b.isHexString,
                hexStripZeros: b.hexStripZeros,
                toUtf8Bytes: a("../utils/utf8").toUtf8Bytes,
                getAddress: a("../utils/address").getAddress,
              };
            })(),
            l = a("../utils/errors");
          k.defineProperty(h.prototype, "getAddress", function () {
            return this._syncAddress
              ? Promise.resolve(this.address)
              : this.provider.send("eth_accounts", []).then(function (a) {
                  return (
                    0 === a.length &&
                      l.throwError("no accounts", l.UNSUPPORTED_OPERATION, {
                        operation: "getAddress",
                      }),
                    k.getAddress(a[0])
                  );
                });
          }),
            k.defineProperty(h.prototype, "getBalance", function (a) {
              var b = this.provider;
              return this.getAddress().then(function (c) {
                return b.getBalance(c, a);
              });
            }),
            k.defineProperty(h.prototype, "getTransactionCount", function (a) {
              var b = this.provider;
              return this.getAddress().then(function (c) {
                return b.getTransactionCount(c, a);
              });
            }),
            k.defineProperty(h.prototype, "sendTransaction", function (a) {
              var b = this.provider;
              return (
                (a = f(a)),
                this.getAddress().then(function (c) {
                  return (
                    (a.from = c.toLowerCase()),
                    b.send("eth_sendTransaction", [a]).then(function (a) {
                      return new Promise(function (c, d) {
                        function e() {
                          b.getTransaction(a).then(function (d) {
                            return d
                              ? ((d.wait = function () {
                                  return b.waitForTransaction(a);
                                }),
                                void c(d))
                              : void setTimeout(e, 1e3);
                          });
                        }
                        e();
                      });
                    })
                  );
                })
              );
            }),
            k.defineProperty(h.prototype, "signMessage", function (a) {
              var b = this.provider,
                c = "string" == typeof a ? k.toUtf8Bytes(a) : a;
              return this.getAddress().then(function (a) {
                return b.send("eth_sign", [a.toLowerCase(), k.hexlify(c)]);
              });
            }),
            k.defineProperty(h.prototype, "unlock", function (a) {
              var b = this.provider;
              return this.getAddress().then(function (c) {
                return b.send("personal_unlockAccount", [
                  c.toLowerCase(),
                  a,
                  null,
                ]);
              });
            }),
            j.inherits(i),
            k.defineProperty(i.prototype, "getSigner", function (a) {
              return new h(this, a);
            }),
            k.defineProperty(i.prototype, "listAccounts", function () {
              return this.send("eth_accounts", []).then(function (a) {
                return (
                  a.forEach(function (b, c) {
                    a[c] = k.getAddress(b);
                  }),
                  a
                );
              });
            }),
            k.defineProperty(i.prototype, "send", function (a, b) {
              var c = { method: a, params: b, id: 42, jsonrpc: "2.0" };
              return j.fetchJSON(this.url, JSON.stringify(c), e);
            }),
            k.defineProperty(i.prototype, "perform", function (a, b) {
              switch (a) {
                case "getBlockNumber":
                  return this.send("eth_blockNumber", []);
                case "getGasPrice":
                  return this.send("eth_gasPrice", []);
                case "getBalance":
                  return this.send("eth_getBalance", [
                    g(b.address),
                    b.blockTag,
                  ]);
                case "getTransactionCount":
                  return this.send("eth_getTransactionCount", [
                    g(b.address),
                    b.blockTag,
                  ]);
                case "getCode":
                  return this.send("eth_getCode", [g(b.address), b.blockTag]);
                case "getStorageAt":
                  return this.send("eth_getStorageAt", [
                    g(b.address),
                    b.position,
                    b.blockTag,
                  ]);
                case "sendTransaction":
                  return this.send("eth_sendRawTransaction", [
                    b.signedTransaction,
                  ]);
                case "getBlock":
                  return b.blockTag
                    ? this.send("eth_getBlockByNumber", [b.blockTag, !1])
                    : b.blockHash
                    ? this.send("eth_getBlockByHash", [b.blockHash, !1])
                    : Promise.reject(
                        new Error("invalid block tag or block hash")
                      );
                case "getTransaction":
                  return this.send("eth_getTransactionByHash", [
                    b.transactionHash,
                  ]);
                case "getTransactionReceipt":
                  return this.send("eth_getTransactionReceipt", [
                    b.transactionHash,
                  ]);
                case "call":
                  return this.send("eth_call", [f(b.transaction), "latest"]);
                case "estimateGas":
                  return this.send("eth_estimateGas", [f(b.transaction)]);
                case "getLogs":
                  return (
                    b.filter &&
                      null != b.filter.address &&
                      (b.filter.address = g(b.filter.address)),
                    this.send("eth_getLogs", [b.filter])
                  );
              }
              return Promise.reject(new Error("not implemented - " + a));
            }),
            k.defineProperty(i.prototype, "_startPending", function () {
              if (null == this._pendingFilter) {
                var a = this,
                  b = this.send("eth_newPendingTransactionFilter", []);
                (this._pendingFilter = b),
                  b.then(function (c) {
                    function e() {
                      a.send("eth_getFilterChanges", [c])
                        .then(function (c) {
                          if (a._pendingFilter == b) {
                            var e = Promise.resolve();
                            return (
                              c.forEach(function (b) {
                                (a._emitted["t:" + b.toLowerCase()] =
                                  "pending"),
                                  (e = e.then(function () {
                                    return a
                                      .getTransaction(b)
                                      .then(function (b) {
                                        a.emit("pending", b);
                                      });
                                  }));
                              }),
                              e.then(function () {
                                return d(1e3);
                              })
                            );
                          }
                        })
                        .then(function () {
                          return a._pendingFilter != b
                            ? void a.send("eth_uninstallFilter", [filterIf])
                            : void setTimeout(function () {
                                e();
                              }, 0);
                        });
                    }
                    return e(), c;
                  });
              }
            }),
            k.defineProperty(i.prototype, "_stopPending", function () {
              this._pendingFilter = null;
            }),
            k.defineProperty(i, "_hexlifyTransaction", function (a) {
              return f(a);
            }),
            (b.exports = i);
        },
        {
          "../utils/address": 56,
          "../utils/convert": 61,
          "../utils/errors": 63,
          "../utils/properties": 70,
          "../utils/utf8": 76,
          "./provider.js": 53,
        },
      ],
      52: [
        function (a, b, c) {
          b.exports = {
            unspecified: { chainId: 0, name: "unspecified" },
            homestead: {
              chainId: 1,
              ensAddress: "0x314159265dd8dbb310642f98f50c066173c1259b",
              name: "homestead",
            },
            mainnet: {
              chainId: 1,
              ensAddress: "0x314159265dd8dbb310642f98f50c066173c1259b",
              name: "homestead",
            },
            morden: { chainId: 2, name: "morden" },
            ropsten: {
              chainId: 3,
              ensAddress: "0x112234455c3a32fd11230c42e7bccd4a84e02010",
              name: "ropsten",
            },
            testnet: {
              chainId: 3,
              ensAddress: "0x112234455c3a32fd11230c42e7bccd4a84e02010",
              name: "ropsten",
            },
            rinkeby: { chainId: 4, name: "rinkeby" },
            kovan: { chainId: 42, name: "kovan" },
            classic: { chainId: 61, name: "classic" },
          };
        },
        {},
      ],
      53: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            var b = {};
            for (var c in a) b[c] = a[c];
            return b;
          }
          function e(a, b) {
            var c = {};
            for (var d in a)
              try {
                var e = a[d](b[d]);
                void 0 !== e && (c[d] = e);
              } catch (f) {
                throw ((f.checkKey = d), (f.checkValue = b[d]), f);
              }
            return c;
          }
          function f(a, b) {
            return function (c) {
              return null == c ? b : a(c);
            };
          }
          function g(a, b) {
            return function (c) {
              return c ? a(c) : b;
            };
          }
          function h(a) {
            return function (b) {
              if (!Array.isArray(b)) throw new Error("not an array");
              var c = [];
              return (
                b.forEach(function (b) {
                  c.push(a(b));
                }),
                c
              );
            };
          }
          function i(a) {
            if (!F.isHexString(a) || 66 !== a.length)
              throw new Error("invalid hash - " + a);
            return a;
          }
          function j(a) {
            return F.bigNumberify(a).toNumber();
          }
          function k(a) {
            var b = F.bigNumberify(a);
            try {
              b = b.toNumber();
            } catch (c) {
              b = null;
            }
            return b;
          }
          function l(a) {
            if ("boolean" == typeof a) return a;
            if ("string" == typeof a) {
              if ("true" === a) return !0;
              if ("false" === a) return !1;
            }
            throw new Error("invaid boolean - " + a);
          }
          function m(a) {
            if (!F.isHexString(a)) throw new Error("invalid uint256");
            for (; a.length < 66; ) a = "0x0" + a.substring(2);
            return a;
          }
          function n(a) {
            if (null == a) return "latest";
            if ("earliest" === a) return "0x0";
            if ("latest" === a || "pending" === a) return a;
            if ("number" == typeof a) return F.hexStripZeros(F.hexlify(a));
            if (F.isHexString(a)) return F.hexStripZeros(a);
            throw new Error("invalid blockTag");
          }
          function o(a) {
            return (
              null != a.author && null == a.miner && (a.miner = a.author),
              e(H, a)
            );
          }
          function p(a) {
            if (
              (null != a.gas && null == a.gasLimit && (a.gasLimit = a.gas),
              a.to &&
                F.bigNumberify(a.to).isZero() &&
                (a.to = "0x0000000000000000000000000000000000000000"),
              null != a.input && null == a.data && (a.data = a.input),
              null == a.to &&
                null == a.creates &&
                (a.creates = F.getContractAddress(a)),
              !a.raw && a.v && a.r && a.s)
            ) {
              var b = [
                F.stripZeros(F.hexlify(a.nonce)),
                F.stripZeros(F.hexlify(a.gasPrice)),
                F.stripZeros(F.hexlify(a.gasLimit)),
                a.to || "0x",
                F.stripZeros(F.hexlify(a.value || "0x")),
                F.hexlify(a.data || "0x"),
                F.stripZeros(F.hexlify(a.v || "0x")),
                F.stripZeros(F.hexlify(a.r)),
                F.stripZeros(F.hexlify(a.s)),
              ];
              a.raw = F.RLP.encode(b);
            }
            var c = e(I, a),
              d = a.networkId;
            return (
              F.isHexString(d) && (d = F.bigNumberify(d).toNumber()),
              "number" != typeof d &&
                null != c.v &&
                ((d = (c.v - 35) / 2), d < 0 && (d = 0), (d = parseInt(d))),
              "number" != typeof d && (d = 0),
              (c.networkId = d),
              c.blockHash &&
                "x" === c.blockHash.replace(/0/g, "") &&
                (c.blockHash = null),
              c
            );
          }
          function q(a) {
            return e(J, a);
          }
          function r(a) {
            return e(K, a);
          }
          function s(a) {
            var b = (a.status, a.root, e(L, a));
            return (
              b.logs.forEach(function (a, b) {
                null == a.transactionLogIndex && (a.transactionLogIndex = b);
              }),
              null != a.status && (b.byzantium = !0),
              b
            );
          }
          function t(a) {
            return (
              Array.isArray(a)
                ? a.forEach(function (a) {
                    t(a);
                  })
                : null != a && i(a),
              a
            );
          }
          function u(a) {
            return e(M, a);
          }
          function v(a) {
            return e(N, a);
          }
          function w(a) {
            function b() {
              e.getBlockNumber().then(function (a) {
                if (a !== f) {
                  null === f && (f = a - 1);
                  for (var b = f + 1; b <= a; b++)
                    e._emitted.block < b &&
                      ((e._emitted.block = b),
                      Object.keys(e._emitted).forEach(function (a) {
                        "block" !== a &&
                          e._emitted[a] > b + 12 &&
                          delete e._emitted[a];
                      })),
                      e.emit("block", b);
                  var c = {};
                  Object.keys(d).forEach(function (b) {
                    var d = B(b);
                    "transaction" === d.type
                      ? e.getTransaction(d.hash).then(function (a) {
                          a &&
                            null != a.blockNumber &&
                            ((e._emitted["t:" + a.hash.toLowerCase()] =
                              a.blockNumber),
                            e.emit(d.hash, a));
                        })
                      : "address" === d.type
                      ? (g[d.address] && (c[d.address] = g[d.address]),
                        e.getBalance(d.address, "latest").then(function (a) {
                          var b = g[d.address];
                          (b && a.eq(b)) ||
                            ((g[d.address] = a), e.emit(d.address, a));
                        }))
                      : "topic" === d.type &&
                        e
                          .getLogs({
                            fromBlock: f + 1,
                            toBlock: a,
                            topics: d.topic,
                          })
                          .then(function (a) {
                            0 !== a.length &&
                              a.forEach(function (a) {
                                (e._emitted["b:" + a.blockHash.toLowerCase()] =
                                  a.blockNumber),
                                  (e._emitted[
                                    "t:" + a.transactionHash.toLowerCase()
                                  ] = a.blockNumber),
                                  e.emit(d.topic, a);
                              });
                          });
                  }),
                    (f = a),
                    (g = c);
                }
              }),
                e.doPoll();
            }
            if (!(this instanceof w)) throw new Error("missing new");
            a = w.getNetwork(a);
            var c = null;
            a.ensAddress && (c = F.getAddress(a.ensAddress)),
              F.defineProperty(this, "chainId", a.chainId),
              F.defineProperty(this, "ensAddress", c),
              F.defineProperty(this, "name", a.name);
            var d = {};
            F.defineProperty(this, "_events", d),
              F.defineProperty(this, "_emitted", { block: -1 });
            var e = this,
              f = null,
              g = {};
            F.defineProperty(this, "resetEventsBlock", function (a) {
              (f = a), e.doPoll();
            });
            var h = 4e3,
              i = null;
            Object.defineProperty(this, "polling", {
              get: function () {
                return null != i;
              },
              set: function (a) {
                setTimeout(function () {
                  a && !i
                    ? (i = setInterval(b, h))
                    : !a && i && (clearInterval(i), (i = null));
                }, 0);
              },
            }),
              Object.defineProperty(this, "pollingInterval", {
                get: function () {
                  return h;
                },
                set: function (a) {
                  if ("number" != typeof a || a <= 0 || parseInt(a) != a)
                    throw new Error("invalid polling interval");
                  (h = a), i && (clearInterval(i), (i = setInterval(b, h)));
                },
              });
          }
          function x(a) {
            return function (b) {
              C(b, a), F.defineProperty(b, "inherits", x(b));
            };
          }
          function y(a, b) {
            return new Promise(function (c, d) {
              function e() {
                b().then(
                  function (b) {
                    if (b || a()) c(b);
                    else {
                      f++;
                      var d = 500 + 250 * parseInt(Math.random() * (1 << f));
                      d > 1e4 && (d = 1e4), setTimeout(e, d);
                    }
                  },
                  function (a) {
                    d(a);
                  }
                );
              }
              var f = 0;
              e();
            });
          }
          function z(a, b) {
            if (Array.isArray(a)) {
              var c = [];
              return (
                a.forEach(function (a) {
                  c.push(z(a, b));
                }),
                c
              );
            }
            return b(a);
          }
          function A(a) {
            try {
              return "address:" + F.getAddress(a);
            } catch (b) {}
            if ("block" === a) return "block";
            if ("pending" === a) return "pending";
            if (F.isHexString(a)) {
              if (66 === a.length) return "tx:" + a;
            } else if (Array.isArray(a)) {
              a = z(a, function (a) {
                return null == a && (a = "0x"), a;
              });
              try {
                return "topic:" + F.RLP.encode(a);
              } catch (b) {
                console.log(b);
              }
            }
            throw new Error("invalid event - " + a);
          }
          function B(a) {
            if ("tx:" === a.substring(0, 3))
              return { type: "transaction", hash: a.substring(3) };
            if ("block" === a) return { type: "block" };
            if ("pending" === a) return { type: "pending" };
            if ("address:" === a.substring(0, 8))
              return { type: "address", address: a.substring(8) };
            if ("topic:" === a.substring(0, 6))
              try {
                var b = F.RLP.decode(a.substring(6));
                return (
                  (b = z(b, function (a) {
                    return "0x" === a && (a = null), a;
                  })),
                  { type: "topic", topic: b }
                );
              } catch (c) {
                console.log(c);
              }
            throw new Error("invalid event string");
          }
          var C = a("inherits"),
            D = a("xmlhttprequest").XMLHttpRequest,
            E = a("./networks.json"),
            F = (function () {
              var b = a("../utils/convert"),
                c = a("../utils/utf8");
              return {
                defineProperty: a("../utils/properties").defineProperty,
                getAddress: a("../utils/address").getAddress,
                getContractAddress: a("../utils/contract-address")
                  .getContractAddress,
                bigNumberify: a("../utils/bignumber").bigNumberify,
                arrayify: b.arrayify,
                hexlify: b.hexlify,
                isHexString: b.isHexString,
                concat: b.concat,
                hexStripZeros: b.hexStripZeros,
                stripZeros: b.stripZeros,
                base64: a("../utils/base64"),
                namehash: a("../utils/namehash"),
                toUtf8String: c.toUtf8String,
                toUtf8Bytes: c.toUtf8Bytes,
                RLP: a("../utils/rlp"),
              };
            })(),
            G = a("../utils/errors"),
            H = {
              hash: i,
              parentHash: i,
              number: j,
              timestamp: j,
              nonce: f(F.hexlify),
              difficulty: k,
              gasLimit: F.bigNumberify,
              gasUsed: F.bigNumberify,
              miner: F.getAddress,
              extraData: F.hexlify,
              transactions: f(h(i)),
            },
            I = {
              hash: i,
              blockHash: f(i, null),
              blockNumber: f(j, null),
              transactionIndex: f(j, null),
              from: F.getAddress,
              gasPrice: F.bigNumberify,
              gasLimit: F.bigNumberify,
              to: f(F.getAddress, null),
              value: F.bigNumberify,
              nonce: j,
              data: F.hexlify,
              r: f(m),
              s: f(m),
              v: f(j),
              creates: f(F.getAddress, null),
              raw: f(F.hexlify),
            },
            J = {
              from: f(F.getAddress),
              nonce: f(j),
              gasLimit: f(F.bigNumberify),
              gasPrice: f(F.bigNumberify),
              to: f(F.getAddress),
              value: f(F.bigNumberify),
              data: f(F.hexlify),
            },
            K = {
              transactionLogIndex: f(j),
              transactionIndex: j,
              blockNumber: j,
              transactionHash: i,
              address: F.getAddress,
              topics: h(i),
              data: F.hexlify,
              logIndex: j,
              blockHash: i,
            },
            L = {
              contractAddress: f(F.getAddress, null),
              transactionIndex: j,
              root: f(i),
              gasUsed: F.bigNumberify,
              logsBloom: f(F.hexlify),
              blockHash: i,
              transactionHash: i,
              logs: h(r),
              blockNumber: j,
              cumulativeGasUsed: F.bigNumberify,
              status: f(j),
            },
            M = {
              fromBlock: f(n, void 0),
              toBlock: f(n, void 0),
              address: f(F.getAddress, void 0),
              topics: f(t, void 0),
            },
            N = {
              blockNumber: f(j),
              blockHash: f(i),
              transactionIndex: j,
              removed: f(l),
              address: F.getAddress,
              data: g(F.hexlify, "0x"),
              topics: h(i),
              transactionHash: i,
              logIndex: j,
            };
          F.defineProperty(w, "inherits", x(w)),
            F.defineProperty(w, "getNetwork", function (a) {
              if ("string" == typeof a) {
                if (((a = E[a]), !a)) throw new Error("unknown network");
              } else null == a && (a = E.homestead);
              if ("number" != typeof a.chainId)
                throw new Error("invalid chainId");
              return a;
            }),
            F.defineProperty(w, "networks", E),
            F.defineProperty(w, "fetchJSON", function (a, b, c) {
              var d = [];
              if (
                "object" == typeof a &&
                null != a.url &&
                null != a.user &&
                null != a.password
              ) {
                "https:" !== a.url.substring(0, 6) &&
                  a.forceInsecure !== !0 &&
                  G.throwError(
                    "basic authentication requires a secure https url",
                    G.INVALID_ARGUMENT,
                    {
                      arg: "url",
                      url: a.url,
                      user: a.user,
                      password: "[REDACTED]",
                    }
                  );
                var e = a.user + ":" + a.password;
                d.push({
                  key: "Authorization",
                  value: "Basic " + F.base64.encode(F.toUtf8Bytes(e)),
                }),
                  (a = a.url);
              }
              return new Promise(function (e, f) {
                var g = new D();
                b
                  ? (g.open("POST", a, !0),
                    d.push({ key: "Content-Type", value: "application/json" }))
                  : g.open("GET", a, !0),
                  d.forEach(function (a) {
                    g.setRequestHeader(a.key, a.value);
                  }),
                  (g.onreadystatechange = function () {
                    if (4 === g.readyState) {
                      try {
                        var d = JSON.parse(g.responseText);
                      } catch (h) {
                        var i = new Error("invalid json response");
                        return (
                          (i.orginialError = h),
                          (i.responseText = g.responseText),
                          (i.url = a),
                          void f(i)
                        );
                      }
                      if (c)
                        try {
                          d = c(d);
                        } catch (h) {
                          return (
                            (h.url = a),
                            (h.body = b),
                            (h.responseText = g.responseText),
                            void f(h)
                          );
                        }
                      if (200 != g.status) {
                        var h = new Error("invalid response - " + g.status);
                        return (h.statusCode = g.statusCode), void f(h);
                      }
                      e(d);
                    }
                  }),
                  (g.onerror = function (a) {
                    f(a);
                  });
                try {
                  b ? g.send(b) : g.send();
                } catch (h) {
                  var i = new Error("connection error");
                  (i.error = h), f(i);
                }
              });
            }),
            F.defineProperty(
              w.prototype,
              "waitForTransaction",
              function (a, b) {
                var c = this;
                return new Promise(function (d, e) {
                  function f(a) {
                    g && clearTimeout(g), d(a);
                  }
                  var g = null;
                  c.once(a, f),
                    "number" == typeof b &&
                      b > 0 &&
                      (g = setTimeout(function () {
                        c.removeListener(a, f), e(new Error("timeout"));
                      }, b));
                });
              }
            ),
            F.defineProperty(w.prototype, "getBlockNumber", function () {
              try {
                return this.perform("getBlockNumber").then(function (a) {
                  var b = parseInt(a);
                  if (b != a)
                    throw new Error("invalid response - getBlockNumber");
                  return b;
                });
              } catch (a) {
                return Promise.reject(a);
              }
            }),
            F.defineProperty(w.prototype, "getGasPrice", function () {
              try {
                return this.perform("getGasPrice").then(function (a) {
                  return F.bigNumberify(a);
                });
              } catch (a) {
                return Promise.reject(a);
              }
            }),
            F.defineProperty(w.prototype, "getBalance", function (a, b) {
              var c = this;
              return this.resolveName(a).then(function (a) {
                var d = { address: a, blockTag: n(b) };
                return c.perform("getBalance", d).then(function (a) {
                  return F.bigNumberify(a);
                });
              });
            }),
            F.defineProperty(
              w.prototype,
              "getTransactionCount",
              function (a, b) {
                var c = this;
                return this.resolveName(a).then(function (a) {
                  var d = { address: a, blockTag: n(b) };
                  return c.perform("getTransactionCount", d).then(function (a) {
                    var b = parseInt(a);
                    if (b != a)
                      throw new Error("invalid response - getTransactionCount");
                    return b;
                  });
                });
              }
            ),
            F.defineProperty(w.prototype, "getCode", function (a, b) {
              var c = this;
              return this.resolveName(a).then(function (a) {
                var d = { address: a, blockTag: n(b) };
                return c.perform("getCode", d).then(function (a) {
                  return F.hexlify(a);
                });
              });
            }),
            F.defineProperty(w.prototype, "getStorageAt", function (a, b, c) {
              var d = this;
              return this.resolveName(a).then(function (a) {
                var e = {
                  address: a,
                  blockTag: n(c),
                  position: F.hexStripZeros(F.hexlify(b)),
                };
                return d.perform("getStorageAt", e).then(function (a) {
                  return F.hexlify(a);
                });
              });
            }),
            F.defineProperty(w.prototype, "sendTransaction", function (a) {
              try {
                var b = { signedTransaction: F.hexlify(a) };
                return this.perform("sendTransaction", b).then(function (a) {
                  if (((a = F.hexlify(a)), 66 !== a.length))
                    throw new Error("invalid response - sendTransaction");
                  return a;
                });
              } catch (c) {
                return Promise.reject(c);
              }
            }),
            F.defineProperty(w.prototype, "call", function (a) {
              var b = this;
              return this._resolveNames(a, ["to", "from"]).then(function (a) {
                var c = { transaction: q(a) };
                return b.perform("call", c).then(function (a) {
                  return F.hexlify(a);
                });
              });
            }),
            F.defineProperty(w.prototype, "estimateGas", function (a) {
              var b = this;
              return this._resolveNames(a, ["to", "from"]).then(function (a) {
                var c = { transaction: q(a) };
                return b.perform("estimateGas", c).then(function (a) {
                  return F.bigNumberify(a);
                });
              });
            }),
            F.defineProperty(w.prototype, "getBlock", function (a) {
              var b = this;
              try {
                var c = F.hexlify(a);
                if (66 === c.length)
                  return y(
                    function () {
                      return null == b._emitted["b:" + c.toLowerCase()];
                    },
                    function () {
                      return b
                        .perform("getBlock", { blockHash: c })
                        .then(function (a) {
                          return null == a ? null : o(a);
                        });
                    }
                  );
              } catch (d) {}
              try {
                var e = n(a);
                return y(
                  function () {
                    if (F.isHexString(e)) {
                      var a = parseInt(e.substring(2), 16);
                      return a > b._emitted.block;
                    }
                    return !0;
                  },
                  function () {
                    return b
                      .perform("getBlock", { blockTag: e })
                      .then(function (a) {
                        return null == a ? null : o(a);
                      });
                  }
                );
              } catch (d) {}
              return Promise.reject(
                new Error("invalid block hash or block tag")
              );
            }),
            F.defineProperty(w.prototype, "getTransaction", function (a) {
              var b = this;
              try {
                var c = { transactionHash: i(a) };
                return y(
                  function () {
                    return null == b._emitted["t:" + a.toLowerCase()];
                  },
                  function () {
                    return b.perform("getTransaction", c).then(function (a) {
                      return null != a && (a = p(a)), a;
                    });
                  }
                );
              } catch (d) {
                return Promise.reject(d);
              }
            }),
            F.defineProperty(
              w.prototype,
              "getTransactionReceipt",
              function (a) {
                var b = this;
                try {
                  var c = { transactionHash: i(a) };
                  return y(
                    function () {
                      return null == b._emitted["t:" + a.toLowerCase()];
                    },
                    function () {
                      return b
                        .perform("getTransactionReceipt", c)
                        .then(function (a) {
                          return null != a && (a = s(a)), a;
                        });
                    }
                  );
                } catch (d) {
                  return Promise.reject(d);
                }
              }
            ),
            F.defineProperty(w.prototype, "getLogs", function (a) {
              var b = this;
              return this._resolveNames(a, ["address"]).then(function (a) {
                var c = { filter: u(a) };
                return b.perform("getLogs", c).then(function (a) {
                  return h(v)(a);
                });
              });
            }),
            F.defineProperty(w.prototype, "getEtherPrice", function () {
              try {
                return this.perform("getEtherPrice", {}).then(function (a) {
                  return a;
                });
              } catch (a) {
                return Promise.reject(a);
              }
            }),
            F.defineProperty(w.prototype, "_resolveNames", function (a, b) {
              var c = [],
                e = d(a);
              return (
                b.forEach(function (a) {
                  void 0 !== e[a] &&
                    c.push(
                      this.resolveName(e[a]).then(function (b) {
                        e[a] = b;
                      })
                    );
                }, this),
                Promise.all(c).then(function () {
                  return e;
                })
              );
            }),
            F.defineProperty(w.prototype, "_getResolver", function (a) {
              var b = F.namehash(a),
                c = "0x0178b8bf" + b.substring(2),
                d = { to: this.ensAddress, data: c };
              return this.call(d).then(function (a) {
                return 66 != a.length
                  ? null
                  : F.getAddress("0x" + a.substring(26));
              });
            }),
            F.defineProperty(w.prototype, "resolveName", function (a) {
              try {
                return Promise.resolve(F.getAddress(a));
              } catch (b) {}
              if (!this.ensAddress)
                throw new Error("network does not have ENS deployed");
              var c = this,
                d = F.namehash(a);
              return this._getResolver(a)
                .then(function (a) {
                  var b = "0x3b3b57de" + d.substring(2),
                    e = { to: a, data: b };
                  return c.call(e);
                })
                .then(function (a) {
                  if (66 != a.length) return null;
                  var b = F.getAddress("0x" + a.substring(26));
                  return "0x0000000000000000000000000000000000000000" === b
                    ? null
                    : b;
                });
            }),
            F.defineProperty(w.prototype, "lookupAddress", function (a) {
              if (!this.ensAddress)
                throw new Error("network does not have ENS deployed");
              a = F.getAddress(a);
              var b = a.substring(2) + ".addr.reverse",
                c = F.namehash(b),
                d = this;
              return this._getResolver(b)
                .then(function (a) {
                  if (!a) return null;
                  var b = "0x691f3431" + c.substring(2),
                    e = { to: a, data: b };
                  return d.call(e);
                })
                .then(function (b) {
                  if (((b = b.substring(2)), b.length < 64)) return null;
                  if (((b = b.substring(64)), b.length < 64)) return null;
                  var c = F.bigNumberify("0x" + b.substring(0, 64)).toNumber();
                  if (((b = b.substring(64)), 2 * c > b.length)) return null;
                  var e = F.toUtf8String("0x" + b.substring(0, 2 * c));
                  return d.resolveName(e).then(function (b) {
                    return b != a ? null : e;
                  });
                });
            }),
            F.defineProperty(w.prototype, "doPoll", function () {}),
            F.defineProperty(w.prototype, "perform", function (a, b) {
              return Promise.reject(new Error("not implemented - " + a));
            }),
            F.defineProperty(w.prototype, "_startPending", function () {
              console.log(
                "WARNING: this provider does not support pending events"
              );
            }),
            F.defineProperty(w.prototype, "_stopPending", function () {}),
            F.defineProperty(w.prototype, "on", function (a, b) {
              var c = A(a);
              this._events[c] || (this._events[c] = []),
                this._events[c].push({ eventName: a, listener: b, type: "on" }),
                "pending" === c && this._startPending(),
                (this.polling = !0);
            }),
            F.defineProperty(w.prototype, "once", function (a, b) {
              var c = A(a);
              this._events[c] || (this._events[c] = []),
                this._events[c].push({
                  eventName: a,
                  listener: b,
                  type: "once",
                }),
                "pending" === c && this._startPending(),
                (this.polling = !0);
            }),
            F.defineProperty(w.prototype, "emit", function (a) {
              var b = A(a),
                c = Array.prototype.slice.call(arguments, 1),
                d = this._events[b];
              if (d) {
                for (var e = 0; e < d.length; e++) {
                  var f = d[e];
                  "once" === f.type && (d.splice(e, 1), e--);
                  try {
                    f.listener.apply(this, c);
                  } catch (g) {
                    console.log("Event Listener Error: " + g.message);
                  }
                }
                0 === d.length &&
                  (delete this._events[b],
                  "pending" === b && this._stopPending()),
                  0 === this.listenerCount() && (this.polling = !1);
              }
            }),
            F.defineProperty(w.prototype, "listenerCount", function (a) {
              if (!a) {
                var b = 0;
                for (var c in this._events) b += this._events[c].length;
                return b;
              }
              var d = this._events[A(a)];
              return d ? d.length : 0;
            }),
            F.defineProperty(w.prototype, "listeners", function (a) {
              var b = this._events[A(a)];
              if (!b) return 0;
              for (var c = [], d = 0; d < b.length; d++) c.push(b[d].listener);
              return c;
            }),
            F.defineProperty(w.prototype, "removeAllListeners", function (a) {
              delete this._events[A(a)],
                0 === this.listenerCount() && (this.polling = !1);
            }),
            F.defineProperty(w.prototype, "removeListener", function (a, b) {
              var c = A(a),
                d = this._events[c];
              if (!d) return 0;
              for (var e = 0; e < d.length; e++)
                if (d[e].listener === b) {
                  d.splice(e, 1);
                  break;
                }
              0 === d.length && this.removeAllListeners(a);
            }),
            F.defineProperty(w, "_formatters", { checkTransactionResponse: p }),
            (b.exports = w);
        },
        {
          "../utils/address": 56,
          "../utils/base64": 58,
          "../utils/bignumber": 57,
          "../utils/contract-address": 60,
          "../utils/convert": 61,
          "../utils/errors": 63,
          "../utils/namehash": 68,
          "../utils/properties": 70,
          "../utils/rlp": 71,
          "../utils/utf8": 76,
          "./networks.json": 52,
          inherits: 37,
          xmlhttprequest: 46,
        },
      ],
      54: [
        function (a, b, c) {
          "use strict";
          function d(a, b) {
            g.checkNew(this, d);
            var c = a.host || a.path || "unknown";
            null == b && (b = "homestead"),
              e.call(this, c, b),
              f.defineProperty(this, "_web3Provider", a);
          }
          var e = (a("./provider"), a("./json-rpc-provider")),
            f = (function () {
              return {
                defineProperty: a("../utils/properties").defineProperty,
              };
            })(),
            g = a("../utils/errors");
          e.inherits(d),
            f.defineProperty(d.prototype, "send", function (a, b) {
              "eth_sign" == a &&
                this._web3Provider.isMetaMask &&
                ((a = "personal_sign"), (b = [b[1], b[0]]));
              var c = this._web3Provider;
              return new Promise(function (d, e) {
                var f = { method: a, params: b, id: 42, jsonrpc: "2.0" };
                c.sendAsync(f, function (a, b) {
                  if (a) return void e(a);
                  if (b.error) {
                    var a = new Error(b.error.message);
                    return (
                      (a.code = b.error.code),
                      (a.data = b.error.data),
                      void e(a)
                    );
                  }
                  d(b.result);
                });
              });
            }),
            (b.exports = d);
        },
        {
          "../utils/errors": 63,
          "../utils/properties": 70,
          "./json-rpc-provider": 51,
          "./provider": 53,
        },
      ],
      55: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            return (
              a.match(/^uint($|[^1-9])/)
                ? (a = "uint256" + a.substring(4))
                : a.match(/^int($|[^1-9])/) && (a = "int256" + a.substring(3)),
              a
            );
          }
          function e(a, b) {
            function c(b) {
              throw new Error(
                'unexpected character "' +
                  a[b] +
                  '" at position ' +
                  b +
                  ' in "' +
                  a +
                  '"'
              );
            }
            for (
              var e = { type: "", name: "", state: { allowType: !0 } },
                f = e,
                g = 0;
              g < a.length;
              g++
            ) {
              var h = a[g];
              switch (h) {
                case "(":
                  f.state.allowParams || c(g),
                    delete f.state.allowType,
                    (f.type = d(f.type)),
                    (f.components = [
                      {
                        type: "",
                        name: "",
                        parent: f,
                        state: { allowType: !0 },
                      },
                    ]),
                    (f = f.components[0]);
                  break;
                case ")":
                  delete f.state, (f.type = d(f.type));
                  var i = f;
                  (f = f.parent),
                    f || c(g),
                    delete i.parent,
                    delete f.state.allowParams,
                    (f.state.allowName = !0),
                    (f.state.allowArray = !0);
                  break;
                case ",":
                  delete f.state, (f.type = d(f.type));
                  var j = {
                    type: "",
                    name: "",
                    parent: f.parent,
                    state: { allowType: !0 },
                  };
                  f.parent.components.push(j), delete f.parent, (f = j);
                  break;
                case " ":
                  f.state.allowType &&
                    "" !== f.type &&
                    ((f.type = d(f.type)),
                    delete f.state.allowType,
                    (f.state.allowName = !0),
                    (f.state.allowParams = !0)),
                    f.state.allowName &&
                      "" !== f.name &&
                      (b && "indexed" === f.name
                        ? ((f.indexed = !0), (f.name = ""))
                        : delete f.state.allowName);
                  break;
                case "[":
                  f.state.allowArray || c(g),
                    (f.type += h),
                    delete f.state.allowArray,
                    delete f.state.allowName,
                    (f.state.readArray = !0);
                  break;
                case "]":
                  f.state.readArray || c(g),
                    (f.type += h),
                    delete f.state.readArray,
                    (f.state.allowArray = !0),
                    (f.state.allowName = !0);
                  break;
                default:
                  f.state.allowType
                    ? ((f.type += h),
                      (f.state.allowParams = !0),
                      (f.state.allowArray = !0))
                    : f.state.allowName
                    ? ((f.name += h), delete f.state.allowArray)
                    : f.state.readArray
                    ? (f.type += h)
                    : c(g);
              }
            }
            if (f.parent) throw new Error("unexpected eof");
            return delete e.state, (e.type = d(e.type)), e;
          }
          function f(a) {
            var b = { anonymous: !1, inputs: [], type: "event" },
              c = a.match(A);
            if (!c) throw new Error("invalid event: " + a);
            if (
              ((b.name = c[1].trim()),
              p(c[2]).forEach(function (a) {
                (a = e(a, !0)), (a.indexed = !!a.indexed), b.inputs.push(a);
              }),
              c[3].split(" ").forEach(function (a) {
                switch (a) {
                  case "anonymous":
                    b.anonymous = !0;
                    break;
                  case "":
                    break;
                  default:
                    console.log("unknown modifier: " + mdifier);
                }
              }),
              b.name && !b.name.match(B))
            )
              throw new Error('invalid identifier: "' + result.name + '"');
            return b;
          }
          function g(a) {
            var b = {
                constant: !1,
                inputs: [],
                outputs: [],
                payable: !1,
                type: "function",
              },
              c = a.split(" returns "),
              d = c[0].match(A);
            if (!d) throw new Error("invalid signature");
            if (((b.name = d[1].trim()), !b.name.match(B)))
              throw new Error('invalid identifier: "' + d[1] + '"');
            if (
              (p(d[2]).forEach(function (a) {
                b.inputs.push(e(a));
              }),
              d[3].split(" ").forEach(function (a) {
                switch (a) {
                  case "constant":
                    b.constant = !0;
                    break;
                  case "payable":
                    b.payable = !0;
                    break;
                  case "pure":
                    (b.constant = !0), (b.stateMutability = "pure");
                    break;
                  case "view":
                    (b.constant = !0), (b.stateMutability = "view");
                    break;
                  case "":
                    break;
                  default:
                    console.log("unknown modifier: " + a);
                }
              }),
              c.length > 1)
            ) {
              var f = c[1].match(A);
              if ("" != f[1].trim() || "" != f[3].trim())
                throw new Error("unexpected tokens");
              p(f[2]).forEach(function (a) {
                b.outputs.push(e(a));
              });
            }
            return b;
          }
          function h(a) {
            if ("string" == typeof a)
              return (
                (a = a
                  .replace(/\(/g, " (")
                  .replace(/\)/g, ") ")
                  .replace(/\s+/g, " ")),
                (a = a.trim()),
                "event " === a.substring(0, 6)
                  ? f(a.substring(6).trim())
                  : ("function " === a.substring(0, 9) && (a = a.substring(9)),
                    g(a.trim()))
              );
            throw new Error("unknown fragment");
          }
          function i(a) {
            var b = parseInt(32 * Math.ceil(a.length / 32)),
              c = new Uint8Array(b - a.length);
            return u.concat([E.encode(a.length), a, c]);
          }
          function j(a, b, c) {
            a.length < b + 32 &&
              v.throwError(
                "insufficient data for dynamicBytes length",
                v.INVALID_ARGUMENT,
                {
                  arg: c,
                  coderType: "dynamicBytes",
                  value: u.hexlify(a.slice(b, b + 32)),
                }
              );
            var d = E.decode(a, b).value;
            try {
              d = d.toNumber();
            } catch (e) {
              v.throwError(
                "dynamic bytes count too large",
                v.INVALID_ARGUMENT,
                { arg: c, coderType: "dynamicBytes", value: d.toString() }
              );
            }
            return (
              a.length < b + 32 + d &&
                v.throwError(
                  "insufficient data for dynamicBytes type",
                  v.INVALID_ARGUMENT,
                  {
                    arg: c,
                    coderType: "dynamicBytes",
                    value: u.hexlify(a.slice(b, b + 32 + d)),
                  }
                ),
              {
                consumed: parseInt(32 + 32 * Math.ceil(d / 32)),
                value: a.slice(b + 32, b + 32 + d),
              }
            );
          }
          function k(a) {
            return parseInt(32 * Math.ceil(a / 32));
          }
          function l(a, b) {
            if (Array.isArray(b));
            else if (b && "object" == typeof b) {
              var c = [];
              a.forEach(function (a) {
                c.push(b[a.localName]);
              }),
                (b = c);
            } else
              v.throwError("invalid tuple value", v.INVALID_ARGUMENT, {
                coderType: "tuple",
                type: typeof b,
                value: b,
              });
            a.length !== b.length &&
              v.throwError("types/value length mismatch", v.INVALID_ARGUMENT, {
                coderType: "tuple",
                value: b,
              });
            var d = [];
            a.forEach(function (a, c) {
              d.push({ dynamic: a.dynamic, value: a.encode(b[c]) });
            });
            var e = 0,
              f = 0;
            d.forEach(function (a, b) {
              a.dynamic
                ? ((e += 32), (f += k(a.value.length)))
                : (e += k(a.value.length));
            });
            var g = 0,
              h = e,
              i = new Uint8Array(e + f);
            return (
              d.forEach(function (a, b) {
                a.dynamic
                  ? (i.set(E.encode(h), g),
                    (g += 32),
                    i.set(a.value, h),
                    (h += k(a.value.length)))
                  : (i.set(a.value, g), (g += k(a.value.length)));
              }),
              i
            );
          }
          function m(a, b, c) {
            var d = c,
              e = 0,
              f = [];
            return (
              a.forEach(function (a) {
                if (a.dynamic) {
                  var g = E.decode(b, c),
                    h = a.decode(b, d + g.value.toNumber());
                  h.consumed = g.consumed;
                } else var h = a.decode(b, c);
                void 0 != h.value && f.push(h.value),
                  (c += h.consumed),
                  (e += h.consumed);
              }),
              a.forEach(function (a, b) {
                var c = a.localName;
                c &&
                  ("object" == typeof c && (c = c.name),
                  c &&
                    ("length" === c && (c = "_length"),
                    null == f[c] && (f[c] = f[b])));
              }),
              { value: f, consumed: e }
            );
          }
          function n(a, b, c, d) {
            var e = b.type + "[" + (c >= 0 ? c : "") + "]";
            return {
              coder: b,
              localName: d,
              length: c,
              name: "array",
              type: e,
              encode: function (a) {
                Array.isArray(a) ||
                  v.throwError("expected array value", v.INVALID_ARGUMENT, {
                    arg: d,
                    coderType: "array",
                    type: typeof a,
                    value: a,
                  });
                var e = c,
                  f = new Uint8Array(0);
                e === -1 && ((e = a.length), (f = E.encode(e))),
                  e !== a.length &&
                    error.throwError(
                      "array value length mismatch",
                      v.INVALID_ARGUMENT,
                      {
                        arg: d,
                        coderType: "array",
                        count: a.length,
                        expectedCount: e,
                        value: a,
                      }
                    );
                var g = [];
                return (
                  a.forEach(function (a) {
                    g.push(b);
                  }),
                  u.concat([f, l(g, a)])
                );
              },
              decode: function (f, g) {
                var h = 0,
                  i = c;
                if (i === -1) {
                  try {
                    var j = E.decode(f, g);
                  } catch (k) {
                    v.throwError(
                      "insufficient data for dynamic array length",
                      v.INVALID_ARGUMENT,
                      { arg: d, coderType: "array", value: k.value }
                    );
                  }
                  try {
                    i = j.value.toNumber();
                  } catch (k) {
                    v.throwError("array count too large", v.INVALID_ARGUMENT, {
                      arg: d,
                      coderType: "array",
                      value: j.value.toString(),
                    });
                  }
                  (h += j.consumed), (g += j.consumed);
                }
                for (var l = [], n = 0; n < i; n++) l.push(b);
                var o = m(l, f, g);
                return (o.consumed += h), (o.value = a(e, o.value)), o;
              },
              dynamic: c === -1 || b.dynamic,
            };
          }
          function o(a, b, c) {
            var d = !1,
              e = [];
            b.forEach(function (a) {
              a.dynamic && (d = !0), e.push(a.type);
            });
            var f = "tuple(" + e.join(",") + ")";
            return {
              coders: b,
              localName: c,
              name: "tuple",
              type: f,
              encode: function (a) {
                return l(b, a);
              },
              decode: function (c, d) {
                var e = m(b, c, d);
                return (e.value = a(f, e.value)), e;
              },
              dynamic: d,
            };
          }
          function p(a) {
            for (var b = [], c = "", d = 0, e = 0; e < a.length; e++) {
              var f = a[e];
              if ("," === f && 0 === d) b.push(c), (c = "");
              else if (((c += f), "(" === f)) d++;
              else if (")" === f && (d--, d === -1))
                throw new Error("unbalanced parenthsis");
            }
            return b.push(c), b;
          }
          function q(a, b, c) {
            b || (b = []);
            var d = [];
            return (
              b.forEach(function (b) {
                d.push(r(a, b));
              }),
              o(a, d, c)
            );
          }
          function r(a, b) {
            var c = K[b.type];
            if (c) return c(a, b.name);
            var d = b.type.match(x);
            if (d) {
              var e = parseInt(d[2] || 256);
              return (
                (0 === e || e > 256 || e % 8 !== 0) &&
                  v.throwError(
                    "invalid " + d[1] + " bit length",
                    v.INVALID_ARGUMENT,
                    { arg: "param", value: b }
                  ),
                D(a, e / 8, "int" === d[1], b.name)
              );
            }
            var d = b.type.match(w);
            if (d) {
              var e = parseInt(d[1]);
              return (
                (0 === e || e > 32) &&
                  v.throwError("invalid bytes length", v.INVALID_ARGUMENT, {
                    arg: "param",
                    value: b,
                  }),
                G(a, e, b.name)
              );
            }
            var d = b.type.match(y);
            if (d) {
              var e = parseInt(d[2] || -1);
              return (b.type = d[1]), n(a, r(a, b), e, b.name);
            }
            return "tuple" === b.type.substring(0, 5)
              ? q(a, b.components, b.name)
              : "" === type
              ? C(a)
              : void v.throwError("invalid type", v.INVALID_ARGUMENT, {
                  arg: "type",
                  value: type,
                });
          }
          function s(a) {
            if (!(this instanceof s)) throw new Error("missing new");
            a || (a = z), u.defineProperty(this, "coerceFunc", a);
          }
          function t(a, b) {
            b &&
              ("tuple" === a.type.substring(0, 5) &&
                "string" != typeof b &&
                (a.components.length != b.names.length &&
                  v.throwError(
                    "names/types length mismatch",
                    v.INVALID_ARGUMENT,
                    {
                      count: {
                        names: b.names.length,
                        types: a.components.length,
                      },
                      value: { names: b.names, types: a.components },
                    }
                  ),
                b.names.forEach(function (b, c) {
                  t(a.components[c], b);
                }),
                (b = b.name || "")),
              a.name || "string" != typeof b || (a.name = b));
          }
          var u = (function () {
              var b = a("../utils/convert.js"),
                c = a("../utils/utf8.js");
              return {
                defineProperty: a("../utils/properties.js").defineProperty,
                arrayify: b.arrayify,
                padZeros: b.padZeros,
                bigNumberify: a("../utils/bignumber.js").bigNumberify,
                getAddress: a("../utils/address").getAddress,
                concat: b.concat,
                toUtf8Bytes: c.toUtf8Bytes,
                toUtf8String: c.toUtf8String,
                hexlify: b.hexlify,
              };
            })(),
            v = a("./errors"),
            w = new RegExp(/^bytes([0-9]*)$/),
            x = new RegExp(/^(u?int)([0-9]*)$/),
            y = new RegExp(/^(.*)\[([0-9]*)\]$/),
            z = function (a, b) {
              var c = a.match(x);
              return c && parseInt(c[2]) <= 48 ? b.toNumber() : b;
            },
            A = new RegExp("^([^)(]*)\\((.*)\\)([^)(]*)$"),
            B = new RegExp("^[A-Za-z_][A-Za-z0-9_]*$"),
            C = function (a) {
              return {
                name: "null",
                type: "",
                encode: function (a) {
                  return u.arrayify([]);
                },
                decode: function (b, c) {
                  if (c > b.length) throw new Error("invalid null");
                  return { consumed: 0, value: a("null", void 0) };
                },
                dynamic: !1,
              };
            },
            D = function (a, b, c, d) {
              var e = (c ? "int" : "uint") + 8 * b;
              return {
                localName: d,
                name: e,
                type: e,
                encode: function (a) {
                  try {
                    a = u.bigNumberify(a);
                  } catch (e) {
                    v.throwError("invalid number value", v.INVALID_ARGUMENT, {
                      arg: d,
                      type: typeof a,
                      value: a,
                    });
                  }
                  return (
                    (a = a.toTwos(8 * b).maskn(8 * b)),
                    c && (a = a.fromTwos(8 * b).toTwos(256)),
                    u.padZeros(u.arrayify(a), 32)
                  );
                },
                decode: function (f, g) {
                  f.length < g + 32 &&
                    v.throwError(
                      "insufficient data for " + e + " type",
                      v.INVALID_ARGUMENT,
                      {
                        arg: d,
                        coderType: e,
                        value: u.hexlify(f.slice(g, g + 32)),
                      }
                    );
                  var h = 32 - b,
                    i = u.bigNumberify(f.slice(g + h, g + 32));
                  return (
                    (i = c ? i.fromTwos(8 * b) : i.maskn(8 * b)),
                    { consumed: 32, value: a(e, i) }
                  );
                },
              };
            },
            E = D(
              function (a, b) {
                return b;
              },
              32,
              !1
            ),
            F = function (a, b) {
              return {
                localName: b,
                name: "bool",
                type: "bool",
                encode: function (a) {
                  return E.encode(a ? 1 : 0);
                },
                decode: function (c, d) {
                  try {
                    var e = E.decode(c, d);
                  } catch (f) {
                    throw (
                      ("insufficient data for uint256 type" === f.reason &&
                        v.throwError(
                          "insufficient data for boolean type",
                          v.INVALID_ARGUMENT,
                          { arg: b, coderType: "boolean", value: f.value }
                        ),
                      f)
                    );
                  }
                  return {
                    consumed: e.consumed,
                    value: a("boolean", !e.value.isZero()),
                  };
                },
              };
            },
            G = function (a, b, c) {
              var d = "bytes" + b;
              return {
                localName: c,
                name: d,
                type: d,
                encode: function (a) {
                  try {
                    a = u.arrayify(a);
                  } catch (e) {
                    v.throwError(
                      "invalid " + d + " value",
                      v.INVALID_ARGUMENT,
                      { arg: c, type: typeof a, value: e.value }
                    );
                  }
                  if (32 === b) return a;
                  var f = new Uint8Array(32);
                  return f.set(a), f;
                },
                decode: function (e, f) {
                  return (
                    e.length < f + 32 &&
                      v.throwError(
                        "insufficient data for " + d + " type",
                        v.INVALID_ARGUMENT,
                        {
                          arg: c,
                          coderType: d,
                          value: u.hexlify(e.slice(f, f + 32)),
                        }
                      ),
                    { consumed: 32, value: a(d, u.hexlify(e.slice(f, f + b))) }
                  );
                },
              };
            },
            H = function (a, b) {
              return {
                localName: b,
                name: "address",
                type: "address",
                encode: function (a) {
                  try {
                    a = u.arrayify(u.getAddress(a));
                  } catch (c) {
                    v.throwError("invalid address", v.INVALID_ARGUMENT, {
                      arg: b,
                      type: typeof a,
                      value: a,
                    });
                  }
                  var d = new Uint8Array(32);
                  return d.set(a, 12), d;
                },
                decode: function (c, d) {
                  return (
                    c.length < d + 32 &&
                      v.throwError(
                        "insufficuent data for address type",
                        v.INVALID_ARGUMENT,
                        {
                          arg: b,
                          coderType: "address",
                          value: u.hexlify(c.slice(d, d + 32)),
                        }
                      ),
                    {
                      consumed: 32,
                      value: a(
                        "address",
                        u.getAddress(u.hexlify(c.slice(d + 12, d + 32)))
                      ),
                    }
                  );
                },
              };
            },
            I = function (a, b) {
              return {
                localName: b,
                name: "bytes",
                type: "bytes",
                encode: function (a) {
                  try {
                    a = u.arrayify(a);
                  } catch (c) {
                    v.throwError("invalid bytes value", v.INVALID_ARGUMENT, {
                      arg: b,
                      type: typeof a,
                      value: c.value,
                    });
                  }
                  return i(a);
                },
                decode: function (c, d) {
                  var e = j(c, d, b);
                  return (e.value = a("bytes", u.hexlify(e.value))), e;
                },
                dynamic: !0,
              };
            },
            J = function (a, b) {
              return {
                localName: b,
                name: "string",
                type: "string",
                encode: function (a) {
                  return (
                    "string" != typeof a &&
                      v.throwError("invalid string value", v.INVALID_ARGUMENT, {
                        arg: b,
                        type: typeof a,
                        value: a,
                      }),
                    i(u.toUtf8Bytes(a))
                  );
                },
                decode: function (c, d) {
                  var e = j(c, d, b);
                  return (e.value = a("string", u.toUtf8String(e.value))), e;
                },
                dynamic: !0,
              };
            },
            K = { address: H, bool: F, string: J, bytes: I };
          u.defineProperty(s.prototype, "encode", function (a, b, c) {
            arguments.length < 3 && ((c = b), (b = a), (a = [])),
              b.length !== c.length &&
                v.throwError(
                  "types/values length mismatch",
                  v.INVALID_ARGUMENT,
                  {
                    count: { types: b.length, values: c.length },
                    value: { types: b, values: c },
                  }
                );
            var d = [];
            return (
              b.forEach(function (b, c) {
                "string" == typeof b && (b = e(b)),
                  t(b, a[c]),
                  d.push(r(this.coerceFunc, b));
              }, this),
              u.hexlify(o(this.coerceFunc, d).encode(c))
            );
          }),
            u.defineProperty(s.prototype, "decode", function (a, b, c) {
              arguments.length < 3 && ((c = b), (b = a), (a = [])),
                (c = u.arrayify(c));
              var d = [];
              return (
                b.forEach(function (b, c) {
                  "string" == typeof b && (b = e(b)),
                    t(b, a[c]),
                    d.push(r(this.coerceFunc, b));
                }, this),
                o(this.coerceFunc, d).decode(c, 0).value
              );
            }),
            u.defineProperty(s, "defaultCoder", new s()),
            u.defineProperty(s, "parseSignature", h),
            (b.exports = s);
        },
        {
          "../utils/address": 56,
          "../utils/bignumber.js": 57,
          "../utils/convert.js": 61,
          "../utils/properties.js": 70,
          "../utils/utf8.js": 76,
          "./errors": 63,
        },
      ],
      56: [
        function (a, b, c) {
          function d(a) {
            ("string" == typeof a && a.match(/^0x[0-9A-Fa-f]{40}$/)) ||
              i("invalid address", { input: a }),
              (a = a.toLowerCase());
            for (var b = a.substring(2).split(""), c = 0; c < b.length; c++)
              b[c] = b[c].charCodeAt(0);
            (b = h.arrayify(j(b))), (a = a.substring(2).split(""));
            for (var c = 0; c < 40; c += 2)
              b[c >> 1] >> 4 >= 8 && (a[c] = a[c].toUpperCase()),
                (15 & b[c >> 1]) >= 8 && (a[c + 1] = a[c + 1].toUpperCase());
            return "0x" + a.join("");
          }
          function e(a) {
            return Math.log10 ? Math.log10(a) : Math.log(a) / Math.LN10;
          }
          function f(a, b) {
            var c = null;
            if (
              ("string" != typeof a && i("invalid address", { input: a }),
              a.match(/^(0x)?[0-9a-fA-F]{40}$/))
            )
              "0x" !== a.substring(0, 2) && (a = "0x" + a),
                (c = d(a)),
                a.match(/([A-F].*[a-f])|([a-f].*[A-F])/) &&
                  c !== a &&
                  i("invalid address checksum", { input: a, expected: c });
            else if (a.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
              for (
                a.substring(2, 4) !== l(a) &&
                  i("invalid address icap checksum", {
                    input: a,
                  }),
                  c = new g(a.substring(4), 36).toString(16);
                c.length < 40;

              )
                c = "0" + c;
              c = d("0x" + c);
            } else i("invalid address", { input: a });
            if (b) {
              for (
                var e = new g(c.substring(2), 16).toString(36).toUpperCase();
                e.length < 30;

              )
                e = "0" + e;
              return "XE" + l("XE00" + e) + e;
            }
            return c;
          }
          var g = a("bn.js"),
            h = a("./convert"),
            i = a("./throw-error"),
            j = a("./keccak256"),
            k = 9007199254740991,
            l = (function () {
              for (var a = {}, b = 0; b < 10; b++) a[String(b)] = String(b);
              for (var b = 0; b < 26; b++)
                a[String.fromCharCode(65 + b)] = String(10 + b);
              var c = Math.floor(e(k));
              return function (b) {
                (b = b.toUpperCase()),
                  (b = b.substring(4) + b.substring(0, 2) + "00");
                for (var d = b.split(""), e = 0; e < d.length; e++)
                  d[e] = a[d[e]];
                for (d = d.join(""); d.length >= c; ) {
                  var f = d.substring(0, c);
                  d = (parseInt(f, 10) % 97) + d.substring(f.length);
                }
                for (
                  var g = String(98 - (parseInt(d, 10) % 97));
                  g.length < 2;

                )
                  g = "0" + g;
                return g;
              };
            })();
          b.exports = { getAddress: f };
        },
        { "./convert": 61, "./keccak256": 67, "./throw-error": 74, "bn.js": 6 },
      ],
      57: [
        function (a, b, c) {
          function d(a) {
            if (!(this instanceof d)) throw new Error("missing new");
            i.isHexString(a)
              ? ("0x" == a && (a = "0x0"), (a = new g(a.substring(2), 16)))
              : "string" == typeof a &&
                "-" === a[0] &&
                i.isHexString(a.substring(1))
              ? (a = new g(a.substring(3), 16).mul(d.constantNegativeOne._bn))
              : "string" == typeof a && a.match(/^-?[0-9]*$/)
              ? ("" == a && (a = "0"), (a = new g(a)))
              : "number" == typeof a && parseInt(a) == a
              ? (a = new g(a))
              : g.isBN(a) ||
                (e(a)
                  ? (a = a._bn)
                  : i.isArrayish(a)
                  ? (a = new g(i.hexlify(a).substring(2), 16))
                  : j("invalid BigNumber value", { input: a })),
              h(this, "_bn", a);
          }
          function e(a) {
            return a._bn && a._bn.mod;
          }
          function f(a) {
            return e(a) ? a : new d(a);
          }
          var g = a("bn.js"),
            h = a("./properties").defineProperty,
            i = a("./convert"),
            j = a("./throw-error");
          h(d, "constantNegativeOne", f(-1)),
            h(d, "constantZero", f(0)),
            h(d, "constantOne", f(1)),
            h(d, "constantTwo", f(2)),
            h(d, "constantWeiPerEther", f(new g("1000000000000000000"))),
            h(d.prototype, "fromTwos", function (a) {
              return new d(this._bn.fromTwos(a));
            }),
            h(d.prototype, "toTwos", function (a) {
              return new d(this._bn.toTwos(a));
            }),
            h(d.prototype, "add", function (a) {
              return new d(this._bn.add(f(a)._bn));
            }),
            h(d.prototype, "sub", function (a) {
              return new d(this._bn.sub(f(a)._bn));
            }),
            h(d.prototype, "div", function (a) {
              return new d(this._bn.div(f(a)._bn));
            }),
            h(d.prototype, "mul", function (a) {
              return new d(this._bn.mul(f(a)._bn));
            }),
            h(d.prototype, "mod", function (a) {
              return new d(this._bn.mod(f(a)._bn));
            }),
            h(d.prototype, "pow", function (a) {
              return new d(this._bn.pow(f(a)._bn));
            }),
            h(d.prototype, "maskn", function (a) {
              return new d(this._bn.maskn(a));
            }),
            h(d.prototype, "eq", function (a) {
              return this._bn.eq(f(a)._bn);
            }),
            h(d.prototype, "lt", function (a) {
              return this._bn.lt(f(a)._bn);
            }),
            h(d.prototype, "lte", function (a) {
              return this._bn.lte(f(a)._bn);
            }),
            h(d.prototype, "gt", function (a) {
              return this._bn.gt(f(a)._bn);
            }),
            h(d.prototype, "gte", function (a) {
              return this._bn.gte(f(a)._bn);
            }),
            h(d.prototype, "isZero", function () {
              return this._bn.isZero();
            }),
            h(d.prototype, "toNumber", function (a) {
              return this._bn.toNumber();
            }),
            h(d.prototype, "toString", function () {
              return this._bn.toString(10);
            }),
            h(d.prototype, "toHexString", function () {
              var a = this._bn.toString(16);
              return a.length % 2 && (a = "0" + a), "0x" + a;
            }),
            (b.exports = { isBigNumber: e, bigNumberify: f, BigNumber: d });
        },
        {
          "./convert": 61,
          "./properties": 70,
          "./throw-error": 74,
          "bn.js": 6,
        },
      ],
      58: [
        function (a, b, c) {
          "use strict";
          var d = a("./convert");
          b.exports = {
            decode: function (a) {
              a = atob(a);
              for (var b = [], c = 0; c < a.length; c++)
                b.push(a.charCodeAt(c));
              return d.arrayify(b);
            },
            encode: function (a) {
              a = d.arrayify(a);
              for (var b = "", c = 0; c < a.length; c++)
                b += String.fromCharCode(a[c]);
              return btoa(b);
            },
          };
        },
        { "./convert": 61 },
      ],
      59: [
        function (a, b, c) {
          (function (c) {
            "use strict";
            function d(a) {
              if (a <= 0 || a > 1024 || parseInt(a) != a)
                throw new Error("invalid length");
              var b = new Uint8Array(a);
              return g.getRandomValues(b), e.arrayify(b);
            }
            var e = a("./convert"),
              f = a("./properties").defineProperty,
              g = c.crypto || c.msCrypto;
            (g && g.getRandomValues) ||
              (console.log(
                "WARNING: Missing strong random number source; using weak randomBytes"
              ),
              (g = {
                getRandomValues: function (a) {
                  for (var b = 0; b < 20; b++)
                    for (var c = 0; c < a.length; c++)
                      b
                        ? (a[c] ^= parseInt(256 * Math.random()))
                        : (a[c] = parseInt(256 * Math.random()));
                  return a;
                },
                _weakCrypto: !0,
              })),
              g._weakCrypto === !0 && f(d, "_weakCrypto", !0),
              (b.exports = d);
          }.call(
            this,
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          ));
        },
        { "./convert": 61, "./properties": 70 },
      ],
      60: [
        function (a, b, c) {
          function d(a) {
            if (!a.from) throw new Error("missing from address");
            var b = a.nonce;
            return e(
              "0x" +
                g(
                  h.encode([e(a.from), f.stripZeros(f.hexlify(b, "nonce"))])
                ).substring(26)
            );
          }
          var e = a("./address").getAddress,
            f = a("./convert"),
            g = a("./keccak256"),
            h = a("./rlp");
          b.exports = { getContractAddress: d };
        },
        { "./address": 56, "./convert": 61, "./keccak256": 67, "./rlp": 71 },
      ],
      61: [
        function (a, b, c) {
          function d(a) {
            return a.slice
              ? a
              : ((a.slice = function () {
                  var b = Array.prototype.slice.call(arguments);
                  return new Uint8Array(Array.prototype.slice.apply(a, b));
                }),
                a);
          }
          function e(a) {
            if (!a || parseInt(a.length) != a.length || "string" == typeof a)
              return !1;
            for (var b = 0; b < a.length; b++) {
              var c = a[b];
              if (c < 0 || c >= 256 || parseInt(c) != c) return !1;
            }
            return !0;
          }
          function f(a) {
            if (
              (null == a &&
                o.throwError(
                  "cannot convert null value to array",
                  o.INVALID_ARGUMENT,
                  { arg: "value", value: a }
                ),
              a && a.toHexString && (a = a.toHexString()),
              j(a))
            ) {
              (a = a.substring(2)), a.length % 2 && (a = "0" + a);
              for (var b = [], c = 0; c < a.length; c += 2)
                b.push(parseInt(a.substr(c, 2), 16));
              return d(new Uint8Array(b));
            }
            return (
              "string" == typeof a &&
                (a.match(/^[0-9a-fA-F]*$/) &&
                  o.throwError(
                    "hex string must have 0x prefix",
                    o.INVALID_ARGUMENT,
                    { arg: "value", value: a }
                  ),
                o.throwError("invalid hexidecimal string", o.INVALID_ARGUMENT, {
                  arg: "value",
                  value: a,
                })),
              e(a)
                ? d(new Uint8Array(a))
                : void o.throwError("invalid arrayify value", {
                    arg: "value",
                    value: a,
                    type: typeof a,
                  })
            );
          }
          function g(a) {
            for (var b = [], c = 0, e = 0; e < a.length; e++) {
              var g = f(a[e]);
              b.push(g), (c += g.length);
            }
            for (var h = new Uint8Array(c), i = 0, e = 0; e < b.length; e++)
              h.set(b[e], i), (i += b[e].length);
            return d(h);
          }
          function h(a) {
            if (((a = f(a)), 0 === a.length)) return a;
            for (var b = 0; 0 === a[b]; ) b++;
            return b && (a = a.slice(b)), a;
          }
          function i(a, b) {
            if (((a = f(a)), b < a.length)) throw new Error("cannot pad");
            var c = new Uint8Array(b);
            return c.set(a, b - a.length), d(c);
          }
          function j(a, b) {
            return (
              !("string" != typeof a || !a.match(/^0x[0-9A-Fa-f]*$/)) &&
              (!b || a.length === 2 + 2 * b)
            );
          }
          function k(a) {
            if (a && a.toHexString) return a.toHexString();
            if ("number" == typeof a) {
              a < 0 &&
                o.throwError("cannot hexlify negative value", o.INVALID_ARG, {
                  arg: "value",
                  value: a,
                });
              for (var b = ""; a; ) (b = p[15 & a] + b), (a = parseInt(a / 16));
              return b.length
                ? (b.length % 2 && (b = "0" + b), "0x" + b)
                : "0x00";
            }
            if (j(a)) return a.length % 2 && (a = "0x0" + a.substring(2)), a;
            if (e(a)) {
              for (var c = [], d = 0; d < a.length; d++) {
                var f = a[d];
                c.push(p[(240 & f) >> 4] + p[15 & f]);
              }
              return "0x" + c.join("");
            }
            o.throwError("invalid hexlify value", { arg: "value", value: a });
          }
          function l(a) {
            for (; a.length > 3 && "0x0" === a.substring(0, 3); )
              a = "0x" + a.substring(3);
            return a;
          }
          function m(a, b) {
            for (; a.length < 2 * b + 2; ) a = "0x0" + a.substring(2);
            return a;
          }
          function n(a) {
            if (((a = f(a)), 65 !== a.length))
              throw new Error("invalid signature");
            var b = a[64];
            return (
              27 !== b && 28 !== b && (b = 27 + (b % 2)),
              { r: k(a.slice(0, 32)), s: k(a.slice(32, 64)), v: b }
            );
          }
          var o = (a("./properties.js").defineProperty, a("./errors")),
            p = "0123456789abcdef";
          b.exports = {
            arrayify: f,
            isArrayish: e,
            concat: g,
            padZeros: i,
            stripZeros: h,
            splitSignature: n,
            hexlify: k,
            isHexString: j,
            hexStripZeros: l,
            hexZeroPad: m,
          };
        },
        { "./errors": 63, "./properties.js": 70 },
      ],
      62: [
        function (a, b, c) {
          b.exports = void 0;
        },
        {},
      ],
      63: [
        function (a, b, c) {
          "use strict";
          var d = a("./properties").defineProperty,
            e = {};
          [
            "UNKNOWN_ERROR",
            "NOT_IMPLEMENTED",
            "MISSING_NEW",
            "CALL_EXCEPTION",
            "INVALID_ARGUMENT",
            "MISSING_ARGUMENT",
            "UNEXPECTED_ARGUMENT",
            "UNSUPPORTED_OPERATION",
          ].forEach(function (a) {
            d(e, a, a);
          }),
            d(e, "throwError", function (a, b, c) {
              b || (b = e.UNKNOWN_ERROR), c || (c = {});
              var d = [];
              Object.keys(c).forEach(function (a) {
                try {
                  d.push(a + "=" + JSON.stringify(c[a]));
                } catch (b) {
                  d.push(a + "=" + JSON.stringify(c[a].toString()));
                }
              });
              var f = a;
              d.length && (a += " (" + d.join(", ") + ")");
              var g = new Error(a);
              throw (
                ((g.reason = f),
                (g.code = b),
                Object.keys(c).forEach(function (a) {
                  g[a] = c[a];
                }),
                g)
              );
            }),
            d(e, "checkNew", function (a, b) {
              a instanceof b ||
                e.throwError("missing new", e.MISSING_NEW, { name: b.name });
            }),
            (b.exports = e);
        },
        { "./properties": 70 },
      ],
      64: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            return (
              a.buffer || (a = h.arrayify(a)), new f.hmac(g.createSha256, a)
            );
          }
          function e(a) {
            return (
              a.buffer || (a = h.arrayify(a)), new f.hmac(g.createSha512, a)
            );
          }
          var f = a("hash.js"),
            g = a("./sha2.js"),
            h = a("./convert.js");
          b.exports = { createSha256Hmac: d, createSha512Hmac: e };
        },
        { "./convert.js": 61, "./sha2.js": 72, "hash.js": 24 },
      ],
      65: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            return e(f.toUtf8Bytes(a));
          }
          var e = a("./keccak256"),
            f = a("./utf8");
          b.exports = d;
        },
        { "./keccak256": 67, "./utf8": 76 },
      ],
      66: [
        function (a, b, c) {
          "use strict";
          var d = a("./address"),
            e = a("./abi-coder"),
            f = a("./base64"),
            g = a("./bignumber"),
            h = a("./contract-address"),
            i = a("./convert"),
            j = a("./id"),
            k = a("./keccak256"),
            l = a("./namehash"),
            m = a("./sha2").sha256,
            n = a("./solidity"),
            o = a("./random-bytes"),
            p = a("./properties"),
            q = a("./rlp"),
            r = a("./utf8"),
            s = a("./units");
          b.exports = {
            AbiCoder: e,
            RLP: q,
            defineProperty: p.defineProperty,
            etherSymbol: "Ξ",
            arrayify: i.arrayify,
            concat: i.concat,
            padZeros: i.padZeros,
            stripZeros: i.stripZeros,
            base64: f,
            bigNumberify: g.bigNumberify,
            BigNumber: g.BigNumber,
            hexlify: i.hexlify,
            toUtf8Bytes: r.toUtf8Bytes,
            toUtf8String: r.toUtf8String,
            namehash: l,
            id: j,
            getAddress: d.getAddress,
            getContractAddress: h.getContractAddress,
            formatEther: s.formatEther,
            parseEther: s.parseEther,
            formatUnits: s.formatUnits,
            parseUnits: s.parseUnits,
            keccak256: k,
            sha256: m,
            randomBytes: o,
            solidityPack: n.pack,
            solidityKeccak256: n.keccak256,
            soliditySha256: n.sha256,
            splitSignature: i.splitSignature,
          };
        },
        {
          "./abi-coder": 55,
          "./address": 56,
          "./base64": 58,
          "./bignumber": 57,
          "./contract-address": 60,
          "./convert": 61,
          "./id": 65,
          "./keccak256": 67,
          "./namehash": 68,
          "./properties": 70,
          "./random-bytes": 59,
          "./rlp": 71,
          "./sha2": 72,
          "./solidity": 73,
          "./units": 75,
          "./utf8": 76,
        },
      ],
      67: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            return (a = f.arrayify(a)), "0x" + e.keccak_256(a);
          }
          var e = a("js-sha3"),
            f = a("./convert.js");
          b.exports = d;
        },
        { "./convert.js": 61, "js-sha3": 38 },
      ],
      68: [
        function (a, b, c) {
          "use strict";
          function d(a, b) {
            if (((a = a.toLowerCase()), !a.match(j)))
              throw new Error("contains invalid UseSTD3ASCIIRules characters");
            for (var c = h, d = 0; a.length && (!b || d < b); ) {
              var k = a.match(i),
                l = f.toUtf8Bytes(k[3]);
              (c = g(e.concat([c, g(l)]))), (a = k[2] || ""), d++;
            }
            return e.hexlify(c);
          }
          var e = a("./convert"),
            f = a("./utf8"),
            g = a("./keccak256"),
            h = [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
            i = new RegExp("^((.*)\\.)?([^.]+)$"),
            j = new RegExp("^[a-z0-9.-]*$");
          b.exports = d;
        },
        { "./convert": 61, "./keccak256": 67, "./utf8": 76 },
      ],
      69: [
        function (a, b, c) {
          "use strict";
          function d(a, b, c, d, f) {
            var g,
              h = 1,
              i = new Uint8Array(d),
              j = new Uint8Array(b.length + 4);
            j.set(b);
            for (var k, l, m = 1; m <= h; m++) {
              (j[b.length] = (m >> 24) & 255),
                (j[b.length + 1] = (m >> 16) & 255),
                (j[b.length + 2] = (m >> 8) & 255),
                (j[b.length + 3] = 255 & m);
              var n = f(a).update(j).digest();
              g ||
                ((g = n.length),
                (l = new Uint8Array(g)),
                (h = Math.ceil(d / g)),
                (k = d - (h - 1) * g)),
                l.set(n);
              for (var o = 1; o < c; o++) {
                n = f(a).update(n).digest();
                for (var p = 0; p < g; p++) l[p] ^= n[p];
              }
              var q = (m - 1) * g,
                r = m === h ? k : g;
              i.set(e.arrayify(l).slice(0, r), q);
            }
            return e.arrayify(i);
          }
          var e = a("./convert");
          b.exports = d;
        },
        { "./convert": 61 },
      ],
      70: [
        function (a, b, c) {
          "use strict";
          function d(a, b, c) {
            Object.defineProperty(a, b, {
              enumerable: !0,
              value: c,
              writable: !1,
            });
          }
          function e(a, b, c) {
            var d = JSON.stringify(c);
            Object.defineProperty(a, b, {
              enumerable: !0,
              get: function () {
                return JSON.parse(d);
              },
            });
          }
          b.exports = { defineFrozen: e, defineProperty: d };
        },
        {},
      ],
      71: [
        function (a, b, c) {
          function d(a) {
            for (var b = []; a; ) b.unshift(255 & a), (a >>= 8);
            return b;
          }
          function e(a, b, c) {
            for (var d = 0, e = 0; e < c; e++) d = 256 * d + a[b + e];
            return d;
          }
          function f(a) {
            if (Array.isArray(a)) {
              var b = [];
              if (
                (a.forEach(function (a) {
                  b = b.concat(f(a));
                }),
                b.length <= 55)
              )
                return b.unshift(192 + b.length), b;
              var c = d(b.length);
              return c.unshift(247 + c.length), c.concat(b);
            }
            if (
              ((a = [].slice.call(k.arrayify(a))),
              1 === a.length && a[0] <= 127)
            )
              return a;
            if (a.length <= 55) return a.unshift(128 + a.length), a;
            var c = d(a.length);
            return c.unshift(183 + c.length), c.concat(a);
          }
          function g(a) {
            return k.hexlify(f(a));
          }
          function h(a, b, c, d) {
            for (var e = []; c < b + 1 + d; ) {
              var f = i(a, c);
              if ((e.push(f.result), (c += f.consumed), c > b + 1 + d))
                throw new Error("invalid rlp");
            }
            return { consumed: 1 + d, result: e };
          }
          function i(a, b) {
            if (0 === a.length) throw new Error("invalid rlp data");
            if (a[b] >= 248) {
              var c = a[b] - 247;
              if (b + 1 + c > a.length) throw new Error("too short");
              var d = e(a, b + 1, c);
              if (b + 1 + c + d > a.length) throw new Error("to short");
              return h(a, b, b + 1 + c, c + d);
            }
            if (a[b] >= 192) {
              var d = a[b] - 192;
              if (b + 1 + d > a.length) throw new Error("invalid rlp data");
              return h(a, b, b + 1, d);
            }
            if (a[b] >= 184) {
              var c = a[b] - 183;
              if (b + 1 + c > a.length) throw new Error("invalid rlp data");
              var d = e(a, b + 1, c);
              if (b + 1 + c + d > a.length) throw new Error("invalid rlp data");
              var f = k.hexlify(a.slice(b + 1 + c, b + 1 + c + d));
              return { consumed: 1 + c + d, result: f };
            }
            if (a[b] >= 128) {
              var d = a[b] - 128;
              if (b + 1 + d > a.offset) throw new Error("invlaid rlp data");
              var f = k.hexlify(a.slice(b + 1, b + 1 + d));
              return { consumed: 1 + d, result: f };
            }
            return { consumed: 1, result: k.hexlify(a[b]) };
          }
          function j(a) {
            a = k.arrayify(a);
            var b = i(a, 0);
            if (b.consumed !== a.length) throw new Error("invalid rlp data");
            return b.result;
          }
          var k = a("./convert.js");
          b.exports = { encode: g, decode: j };
        },
        { "./convert.js": 61 },
      ],
      72: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            return (
              (a = g.arrayify(a)), "0x" + f.sha256().update(a).digest("hex")
            );
          }
          function e(a) {
            return (
              (a = g.arrayify(a)), "0x" + f.sha512().update(a).digest("hex")
            );
          }
          var f = a("hash.js"),
            g = a("./convert.js");
          b.exports = {
            sha256: d,
            sha512: e,
            createSha256: f.sha256,
            createSha512: f.sha512,
          };
        },
        { "./convert.js": 61, "hash.js": 24 },
      ],
      73: [
        function (a, b, c) {
          "use strict";
          function d(a, b, c) {
            switch (a) {
              case "address":
                return c ? i.padZeros(b, 32) : i.arrayify(b);
              case "string":
                return j.toUtf8Bytes(b);
              case "bytes":
                return i.arrayify(b);
              case "bool":
                return (
                  (b = b ? "0x01" : "0x00"),
                  c ? i.padZeros(b, 32) : i.arrayify(b)
                );
            }
            var e = a.match(n);
            if (e) {
              var f = ("int" === e[1], parseInt(e[2] || "256"));
              if (f % 8 != 0 || 0 === f || f > 256)
                throw new Error("invalid number type - " + a);
              return c && (f = 256), (b = h(b).toTwos(f)), i.padZeros(b, f / 8);
            }
            if ((e = a.match(m))) {
              var f = e[1];
              if (f != parseInt(f) || 0 === f || f > 32)
                throw new Error("invalid number type - " + a);
              if (((f = parseInt(f)), i.arrayify(b).byteLength !== f))
                throw new Error("invalid value for " + a);
              return c ? (b + p).substring(0, 66) : b;
            }
            if ((e = a.match(o))) {
              var g = e[1],
                k = parseInt(e[2] || b.length);
              if (k != b.length) throw new Error("invalid value for " + a);
              var l = [];
              return (
                b.forEach(function (a) {
                  (a = d(g, a, !0)), l.push(a);
                }),
                i.concat(l)
              );
            }
            throw new Error("unknown type - " + a);
          }
          function e(a, b) {
            if (a.length != b.length)
              throw new Error("type/value count mismatch");
            var c = [];
            return (
              a.forEach(function (a, e) {
                c.push(d(a, b[e]));
              }),
              i.hexlify(i.concat(c))
            );
          }
          function f(a, b) {
            return k(e(a, b));
          }
          function g(a, b) {
            return l(e(a, b));
          }
          var h = a("./bignumber").bigNumberify,
            i = a("./convert"),
            j = (a("./address").getAddress, a("./utf8")),
            k = a("./keccak256"),
            l = a("./sha2").sha256,
            m = new RegExp("^bytes([0-9]+)$"),
            n = new RegExp("^(u?int)([0-9]*)$"),
            o = new RegExp("^(.*)\\[([0-9]*)\\]$"),
            p =
              "0000000000000000000000000000000000000000000000000000000000000000";
          b.exports = { pack: e, keccak256: f, sha256: g };
        },
        {
          "./address": 56,
          "./bignumber": 57,
          "./convert": 61,
          "./keccak256": 67,
          "./sha2": 72,
          "./utf8": 76,
        },
      ],
      74: [
        function (a, b, c) {
          "use strict";
          function d(a, b) {
            var c = new Error(a);
            for (var d in b) c[d] = b[d];
            throw c;
          }
          b.exports = d;
        },
        {},
      ],
      75: [
        function (a, b, c) {
          function d(a, b, c) {
            "object" != typeof b || c || ((c = b), (b = void 0)),
              null == b && (b = 18);
            var d = m(b);
            (a = h(a)), c || (c = {});
            var e = a.lt(j);
            e && (a = a.mul(k));
            for (
              var f = a.mod(d.tenPower).toString(10);
              f.length < d.decimals;

            )
              f = "0" + f;
            c.pad || (f = f.match(/^([0-9]*[1-9]|0)(0*)/)[1]);
            var g = a.div(d.tenPower).toString(10);
            c.commify && (g = g.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            var a = g + "." + f;
            return e && (a = "-" + a), a;
          }
          function e(a, b) {
            null == b && (b = 18);
            var c = m(b);
            ("string" == typeof a && a.match(/^-?[0-9.,]+$/)) ||
              i("invalid value", { input: a });
            var a = a.replace(/,/g, ""),
              d = "-" === a.substring(0, 1);
            d && (a = a.substring(1)),
              "." === a && i("invalid value", { input: a });
            var e = a.split(".");
            e.length > 2 && i("too many decimal points", { input: a });
            var f = e[0],
              g = e[1];
            for (
              f || (f = "0"),
                g || (g = "0"),
                g.length > c.decimals &&
                  i("too many decimal places", {
                    input: a,
                    decimals: g.length,
                  });
              g.length < c.decimals;

            )
              g += "0";
            (f = h(f)), (g = h(g));
            var j = f.mul(c.tenPower).add(g);
            return d && (j = j.mul(k)), j;
          }
          function f(a, b) {
            return d(a, 18, b);
          }
          function g(a) {
            return e(a, 18);
          }
          var h = a("./bignumber.js").bigNumberify,
            i = a("./throw-error"),
            j = new h(0),
            k = new h(-1),
            l = ["wei", "kwei", "Mwei", "Gwei", "szabo", "finny", "ether"],
            m = (function () {
              function a(a) {
                return { decimals: a.length - 1, tenPower: h(a) };
              }
              var b = {},
                c = "1";
              return (
                l.forEach(function (d) {
                  var e = a(c);
                  (b[d.toLowerCase()] = e),
                    (b[String(e.decimals)] = e),
                    (c += "000");
                }),
                function (c) {
                  var d = b[String(c).toLowerCase()];
                  if (
                    !d &&
                    "number" == typeof c &&
                    parseInt(c) == c &&
                    c >= 0 &&
                    c <= 256
                  ) {
                    for (var e = "1", f = 0; f < c; f++) e += "0";
                    d = a(e);
                  }
                  return d || i("invalid unitType", { unitType: c }), d;
                }
              );
            })();
          b.exports = {
            formatEther: f,
            parseEther: g,
            formatUnits: d,
            parseUnits: e,
          };
        },
        { "./bignumber.js": 57, "./throw-error": 74 },
      ],
      76: [
        function (a, b, c) {
          function d(a) {
            for (var b = [], c = 0, d = 0; d < a.length; d++) {
              var e = a.charCodeAt(d);
              e < 128
                ? (b[c++] = e)
                : e < 2048
                ? ((b[c++] = (e >> 6) | 192), (b[c++] = (63 & e) | 128))
                : 55296 == (64512 & e) &&
                  d + 1 < a.length &&
                  56320 == (64512 & a.charCodeAt(d + 1))
                ? ((e =
                    65536 + ((1023 & e) << 10) + (1023 & a.charCodeAt(++d))),
                  (b[c++] = (e >> 18) | 240),
                  (b[c++] = ((e >> 12) & 63) | 128),
                  (b[c++] = ((e >> 6) & 63) | 128),
                  (b[c++] = (63 & e) | 128))
                : ((b[c++] = (e >> 12) | 224),
                  (b[c++] = ((e >> 6) & 63) | 128),
                  (b[c++] = (63 & e) | 128));
            }
            return f.arrayify(b);
          }
          function e(a) {
            a = f.arrayify(a);
            for (var b = "", c = 0; c < a.length; ) {
              var d = a[c++];
              if (d >> 7 != 0) {
                if (d >> 6 != 2) {
                  var e = null;
                  if (d >> 5 == 6) e = 1;
                  else if (d >> 4 == 14) e = 2;
                  else if (d >> 3 == 30) e = 3;
                  else if (d >> 2 == 62) e = 4;
                  else {
                    if (d >> 1 != 126) continue;
                    e = 5;
                  }
                  if (c + e > a.length) {
                    for (; c < a.length && a[c] >> 6 == 2; c++);
                    if (c != a.length) continue;
                    return b;
                  }
                  var g,
                    h = d & ((1 << (8 - e - 1)) - 1);
                  for (g = 0; g < e; g++) {
                    var i = a[c++];
                    if (i >> 6 != 2) break;
                    h = (h << 6) | (63 & i);
                  }
                  g == e
                    ? h <= 65535
                      ? (b += String.fromCharCode(h))
                      : ((h -= 65536),
                        (b += String.fromCharCode(
                          ((h >> 10) & 1023) + 55296,
                          (1023 & h) + 56320
                        )))
                    : c--;
                }
              } else b += String.fromCharCode(d);
            }
            return b;
          }
          var f = a("./convert.js");
          b.exports = { toUtf8Bytes: d, toUtf8String: e };
        },
        { "./convert.js": 61 },
      ],
      77: [
        function (a, b, c) {
          function d(a) {
            return ((1 << a) - 1) << (8 - a);
          }
          function e(a) {
            return (1 << a) - 1;
          }
          function f(a, b, c, d) {
            if (!(this instanceof f)) throw new Error("missing new");
            m.defineProperty(this, "_keyPair", a),
              m.defineProperty(
                this,
                "privateKey",
                m.hexlify(a.priv.toArray("be", 32))
              ),
              m.defineProperty(
                this,
                "publicKey",
                "0x" + a.getPublic(!0, "hex")
              ),
              m.defineProperty(this, "chainCode", m.hexlify(b)),
              m.defineProperty(this, "index", c),
              m.defineProperty(this, "depth", d);
          }
          function g(a, b) {
            if (b)
              if (b.normalize) b = b.normalize("NFKD");
              else
                for (var c = 0; c < b.length; c++) {
                  var d = b.charCodeAt(c);
                  if (d < 32 || d > 127)
                    throw new Error(
                      "passwords with non-ASCII characters not supported in this environment"
                    );
                }
            else b = "";
            a = m.toUtf8Bytes(a, "NFKD");
            var e = m.toUtf8Bytes("mnemonic" + b, "NFKD");
            return m.hexlify(m.pbkdf2(a, e, 2048, 64, m.createSha512Hmac));
          }
          function h(a) {
            var b = a.toLowerCase().split(" ");
            if (b.length % 3 !== 0) throw new Error("invalid mnemonic");
            for (
              var c = m.arrayify(
                  new Uint8Array(Math.ceil((11 * b.length) / 8))
                ),
                e = 0,
                f = 0;
              f < b.length;
              f++
            ) {
              var g = l.indexOf(b[f]);
              if (g === -1) throw new Error("invalid mnemonic");
              for (var h = 0; h < 11; h++)
                g & (1 << (10 - h)) && (c[e >> 3] |= 1 << (7 - (e % 8))), e++;
            }
            var i = (32 * b.length) / 3,
              j = b.length / 3,
              k = d(j),
              n = m.arrayify(m.sha256(c.slice(0, i / 8)))[0];
            if (((n &= k), n !== (c[c.length - 1] & k)))
              throw new Error("invalid checksum");
            return m.hexlify(c.slice(0, i / 8));
          }
          function i(a) {
            if (
              ((a = m.arrayify(a)),
              a.length % 4 !== 0 || a.length < 16 || a.length > 32)
            )
              throw new Error("invalid entropy");
            for (var b = [0], c = 11, f = 0; f < a.length; f++)
              c > 8
                ? ((b[b.length - 1] <<= 8), (b[b.length - 1] |= a[f]), (c -= 8))
                : ((b[b.length - 1] <<= c),
                  (b[b.length - 1] |= a[f] >> (8 - c)),
                  b.push(a[f] & e(8 - c)),
                  (c += 3));
            var g = m.arrayify(m.sha256(a))[0],
              h = a.length / 4;
            (g &= d(h)),
              (b[b.length - 1] <<= h),
              (b[b.length - 1] |= g >> (8 - h));
            for (var f = 0; f < b.length; f++) b[f] = l[b[f]];
            return b.join(" ");
          }
          function j(a) {
            try {
              return h(a), !0;
            } catch (b) {}
            return !1;
          }
          var k = new (a("elliptic").ec)("secp256k1"),
            l = (function () {
              var b = a("./words.json");
              return b
                .replace(/([A-Z])/g, " $1")
                .toLowerCase()
                .substring(1)
                .split(" ");
            })(),
            m = (function () {
              var b = a("../utils/convert.js"),
                c = a("../utils/sha2"),
                d = a("../utils/hmac");
              return {
                defineProperty: a("../utils/properties.js").defineProperty,
                arrayify: b.arrayify,
                bigNumberify: a("../utils/bignumber.js").bigNumberify,
                hexlify: b.hexlify,
                toUtf8Bytes: a("../utils/utf8.js").toUtf8Bytes,
                sha256: c.sha256,
                createSha512Hmac: d.createSha512Hmac,
                pbkdf2: a("../utils/pbkdf2.js"),
              };
            })(),
            n = m.toUtf8Bytes("Bitcoin seed"),
            o = 2147483648;
          m.defineProperty(f.prototype, "_derive", function (a) {
            if (!this.privateKey) {
              if (a >= o)
                throw new Error("cannot derive child of neutered node");
              throw new Error("not implemented");
            }
            var b = new Uint8Array(37);
            a & o
              ? b.set(m.arrayify(this.privateKey), 1)
              : b.set(this._keyPair.getPublic().encode(null, !0));
            for (var c = 24; c >= 0; c -= 8)
              b[33 + (c >> 3)] = (a >> (24 - c)) & 255;
            var d = m.arrayify(
                m.createSha512Hmac(this.chainCode).update(b).digest()
              ),
              e = m.bigNumberify(d.slice(0, 32)),
              g =
                (d.slice(32),
                e
                  .add("0x" + this._keyPair.getPrivate("hex"))
                  .mod("0x" + k.curve.n.toString(16)));
            return new f(
              k.keyFromPrivate(m.arrayify(g)),
              d.slice(32),
              a,
              this.depth + 1
            );
          }),
            m.defineProperty(f.prototype, "derivePath", function (a) {
              var b = a.split("/");
              if (0 === b.length || ("m" === b[0] && 0 !== this.depth))
                throw new Error("invalid path");
              "m" === b[0] && b.shift();
              for (var c = this, d = 0; d < b.length; d++) {
                var e = b[d];
                if (e.match(/^[0-9]+'$/)) {
                  var f = parseInt(e.substring(0, e.length - 1));
                  if (f >= o) throw new Error("invalid path index - " + e);
                  c = c._derive(o + f);
                } else {
                  if (!e.match(/^[0-9]+$/))
                    throw new Error("invlaid path component - " + e);
                  var f = parseInt(e);
                  if (f >= o) throw new Error("invalid path index - " + e);
                  c = c._derive(f);
                }
              }
              return c;
            }),
            m.defineProperty(f, "fromMnemonic", function (a) {
              return h(a), f.fromSeed(g(a));
            }),
            m.defineProperty(f, "fromSeed", function (a) {
              if (((a = m.arrayify(a)), a.length < 16 || a.length > 64))
                throw new Error("invalid seed");
              var b = m.arrayify(m.createSha512Hmac(n).update(a).digest());
              return new f(
                k.keyFromPrivate(b.slice(0, 32)),
                b.slice(32),
                0,
                0,
                0
              );
            }),
            (b.exports = {
              fromMnemonic: f.fromMnemonic,
              fromSeed: f.fromSeed,
              mnemonicToEntropy: h,
              entropyToMnemonic: i,
              mnemonicToSeed: g,
              isValidMnemonic: j,
            });
        },
        {
          "../utils/bignumber.js": 57,
          "../utils/convert.js": 61,
          "../utils/hmac": 64,
          "../utils/pbkdf2.js": 69,
          "../utils/properties.js": 70,
          "../utils/sha2": 72,
          "../utils/utf8.js": 76,
          "./words.json": 82,
          elliptic: 9,
        },
      ],
      78: [
        function (a, b, c) {
          "use strict";
          var d = a("./wallet"),
            e = a("./hdnode"),
            f = a("./signing-key");
          b.exports = { HDNode: e, Wallet: d, SigningKey: f };
        },
        { "./hdnode": 77, "./signing-key": 80, "./wallet": 81 },
      ],
      79: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            return (
              "string" == typeof a &&
                "0x" !== a.substring(0, 2) &&
                (a = "0x" + a),
              m.arrayify(a)
            );
          }
          function e(a, b) {
            for (a = String(a); a.length < b; ) a = "0" + a;
            return a;
          }
          function f(a) {
            return "string" == typeof a
              ? m.toUtf8Bytes(a, "NFKC")
              : m.arrayify(a, "password");
          }
          function g(a, b) {
            for (
              var c = a, d = b.toLowerCase().split("/"), e = 0;
              e < d.length;
              e++
            ) {
              var f = null;
              for (var g in c)
                if (g.toLowerCase() === d[e]) {
                  f = c[g];
                  break;
                }
              if (null === f) return null;
              c = f;
            }
            return c;
          }
          var h = a("aes-js"),
            i = a("scrypt-js"),
            j = a("uuid"),
            k = a("../utils/hmac"),
            l = a("../utils/pbkdf2"),
            m = a("../utils"),
            n = a("./signing-key"),
            o = a("./hdnode"),
            p = "m/44'/60'/0'/0/0",
            q = {};
          m.defineProperty(q, "isCrowdsaleWallet", function (a) {
            try {
              var b = JSON.parse(a);
            } catch (c) {
              return !1;
            }
            return b.encseed && b.ethaddr;
          }),
            m.defineProperty(q, "isValidWallet", function (a) {
              try {
                var b = JSON.parse(a);
              } catch (c) {
                return !1;
              }
              return !(
                !b.version ||
                parseInt(b.version) !== b.version ||
                3 !== parseInt(b.version)
              );
            }),
            m.defineProperty(q, "decryptCrowdsale", function (a, b) {
              var c = JSON.parse(a);
              b = f(b);
              var e = m.getAddress(g(c, "ethaddr")),
                i = d(g(c, "encseed"));
              if (!i || i.length % 16 !== 0) throw new Error("invalid encseed");
              var j = l(b, b, 2e3, 32, k.createSha256Hmac).slice(0, 16),
                o = i.slice(0, 16),
                p = i.slice(16),
                q = new h.ModeOfOperation.cbc(j, o),
                r = m.arrayify(q.decrypt(p));
              r = h.padding.pkcs7.strip(r);
              for (var s = "", t = 0; t < r.length; t++)
                s += String.fromCharCode(r[t]);
              var u = m.toUtf8Bytes(s),
                v = new n(m.keccak256(u));
              if (v.address !== e) throw new Error("corrupt crowdsale wallet");
              return v;
            }),
            m.defineProperty(q, "decrypt", function (a, b, c) {
              var e = JSON.parse(a);
              b = f(b);
              var j = function (a, b) {
                  var c = g(e, "crypto/cipher");
                  if ("aes-128-ctr" === c) {
                    var f = d(
                        g(e, "crypto/cipherparams/iv"),
                        "crypto/cipherparams/iv"
                      ),
                      i = new h.Counter(f),
                      j = new h.ModeOfOperation.ctr(a, i);
                    return d(j.decrypt(b));
                  }
                  return null;
                },
                q = function (a, b) {
                  return m.keccak256(m.concat([a, b]));
                },
                r = function (a, b) {
                  var c = d(g(e, "crypto/ciphertext")),
                    f = m.hexlify(q(a.slice(16, 32), c)).substring(2);
                  if (f !== g(e, "crypto/mac").toLowerCase())
                    return b(new Error("invalid password")), null;
                  var i = j(a.slice(0, 16), c),
                    k = a.slice(32, 64);
                  if (!i) return b(new Error("unsupported cipher")), null;
                  var l = new n(i);
                  if (l.address !== m.getAddress(e.address))
                    return b(new Error("address mismatch")), null;
                  if ("0.1" === g(e, "x-ethers/version")) {
                    var r = d(
                        g(e, "x-ethers/mnemonicCiphertext"),
                        "x-ethers/mnemonicCiphertext"
                      ),
                      s = d(
                        g(e, "x-ethers/mnemonicCounter"),
                        "x-ethers/mnemonicCounter"
                      ),
                      t = new h.Counter(s),
                      u = new h.ModeOfOperation.ctr(k, t),
                      v = g(e, "x-ethers/path") || p,
                      w = d(u.decrypt(r)),
                      x = o.entropyToMnemonic(w);
                    if (
                      o.fromMnemonic(x).derivePath(v).privateKey != m.hexlify(i)
                    )
                      return b(new Error("mnemonic mismatch")), null;
                    (l.mnemonic = x), (l.path = v);
                  }
                  return l;
                };
              return new Promise(function (a, f) {
                var h = g(e, "crypto/kdf");
                if (h && "string" == typeof h)
                  if ("scrypt" === h.toLowerCase()) {
                    var j = d(
                        g(e, "crypto/kdfparams/salt"),
                        "crypto/kdfparams/salt"
                      ),
                      m = parseInt(g(e, "crypto/kdfparams/n")),
                      n = parseInt(g(e, "crypto/kdfparams/r")),
                      o = parseInt(g(e, "crypto/kdfparams/p"));
                    if (!m || !n || !o)
                      return void f(
                        new Error(
                          "unsupported key-derivation function parameters"
                        )
                      );
                    if (0 !== (m & (m - 1)))
                      return void f(
                        new Error(
                          "unsupported key-derivation function parameter value for N"
                        )
                      );
                    var p = parseInt(g(e, "crypto/kdfparams/dklen"));
                    if (32 !== p)
                      return void f(
                        new Error(
                          "unsupported key-derivation derived-key length"
                        )
                      );
                    i(b, j, m, n, o, 64, function (b, e, g) {
                      if (b) (b.progress = e), f(b);
                      else if (g) {
                        g = d(g);
                        var h = r(g, f);
                        if (!h) return;
                        c && c(1), a(h);
                      } else if (c) return c(e);
                    });
                  } else if ("pbkdf2" === h.toLowerCase()) {
                    var j = d(
                        g(e, "crypto/kdfparams/salt"),
                        "crypto/kdfparams/salt"
                      ),
                      q = null,
                      s = g(e, "crypto/kdfparams/prf");
                    if ("hmac-sha256" === s) q = k.createSha256Hmac;
                    else {
                      if ("hmac-sha512" !== s)
                        return void f(new Error("unsupported prf"));
                      q = k.createSha512Hmac;
                    }
                    var t = parseInt(g(e, "crypto/kdfparams/c")),
                      p = parseInt(g(e, "crypto/kdfparams/dklen"));
                    if (32 !== p)
                      return void f(
                        new Error(
                          "unsupported key-derivation derived-key length"
                        )
                      );
                    var u = l(b, j, t, p, q),
                      v = r(u, f);
                    if (!v) return;
                    a(v);
                  } else f(new Error("unsupported key-derivation function"));
                else f(new Error("unsupported key-derivation function"));
              });
            }),
            m.defineProperty(q, "encrypt", function (a, b, c, g) {
              if (
                ("function" != typeof c || g || ((g = c), (c = {})),
                c || (c = {}),
                a instanceof n && (a = a.privateKey),
                (a = d(a, "private key")),
                32 !== a.length)
              )
                throw new Error("invalid private key");
              b = f(b);
              var k = c.entropy;
              if (c.mnemonic)
                if (k) {
                  if (o.entropyToMnemonic(k) !== c.mnemonic)
                    throw new Error("entropy and mnemonic mismatch");
                } else k = o.mnemonicToEntropy(c.mnemonic);
              k && (k = d(k, "entropy"));
              var l = c.path;
              k && !l && (l = p);
              var q = c.client;
              q || (q = "ethers.js");
              var r = c.salt;
              r = r ? d(r, "salt") : m.randomBytes(32);
              var s = null;
              if (c.iv) {
                if (((s = d(c.iv, "iv")), 16 !== s.length))
                  throw new Error("invalid iv");
              } else s = m.randomBytes(16);
              var t = c.uuid;
              if (t) {
                if (((t = d(t, "uuid")), 16 !== t.length))
                  throw new Error("invalid uuid");
              } else t = m.randomBytes(16);
              var u = 1 << 17,
                v = 8,
                w = 1;
              return (
                c.scrypt &&
                  (c.scrypt.N && (u = c.scrypt.N),
                  c.scrypt.r && (v = c.scrypt.r),
                  c.scrypt.p && (w = c.scrypt.p)),
                new Promise(function (c, f) {
                  i(b, r, u, v, w, 64, function (b, i, l) {
                    if (b) (b.progress = i), f(b);
                    else if (l) {
                      l = d(l);
                      var o = l.slice(0, 16),
                        p = l.slice(16, 32),
                        x = l.slice(32, 64),
                        y = new n(a).address,
                        z = new h.Counter(s),
                        A = new h.ModeOfOperation.ctr(o, z),
                        B = m.arrayify(A.encrypt(a)),
                        C = m.keccak256(m.concat([p, B])),
                        D = {
                          address: y.substring(2).toLowerCase(),
                          id: j.v4({ random: t }),
                          version: 3,
                          Crypto: {
                            cipher: "aes-128-ctr",
                            cipherparams: { iv: m.hexlify(s).substring(2) },
                            ciphertext: m.hexlify(B).substring(2),
                            kdf: "scrypt",
                            kdfparams: {
                              salt: m.hexlify(r).substring(2),
                              n: u,
                              dklen: 32,
                              p: w,
                              r: v,
                            },
                            mac: C.substring(2),
                          },
                        };
                      if (k) {
                        var E = m.randomBytes(16),
                          F = new h.Counter(E),
                          G = new h.ModeOfOperation.ctr(x, F),
                          H = m.arrayify(G.encrypt(k)),
                          I = new Date(),
                          J =
                            I.getUTCFullYear() +
                            "-" +
                            e(I.getUTCMonth() + 1, 2) +
                            "-" +
                            e(I.getUTCDate(), 2) +
                            "T" +
                            e(I.getUTCHours(), 2) +
                            "-" +
                            e(I.getUTCMinutes(), 2) +
                            "-" +
                            e(I.getUTCSeconds(), 2) +
                            ".0Z";
                        D["x-ethers"] = {
                          client: q,
                          gethFilename: "UTC--" + J + "--" + D.address,
                          mnemonicCounter: m.hexlify(E).substring(2),
                          mnemonicCiphertext: m.hexlify(H).substring(2),
                          version: "0.1",
                        };
                      }
                      g && g(1), c(JSON.stringify(D));
                    } else if (g) return g(i);
                  });
                })
              );
            }),
            (b.exports = q);
        },
        {
          "../utils": 66,
          "../utils/hmac": 64,
          "../utils/pbkdf2": 69,
          "./hdnode": 77,
          "./signing-key": 80,
          "aes-js": 5,
          "scrypt-js": 41,
          uuid: 44,
        },
      ],
      80: [
        function (a, b, c) {
          "use strict";
          function d(a) {
            g.checkNew(this, d);
            try {
              (a = f.arrayify(a)),
                32 !== a.length &&
                  g.throwError(
                    "exactly 32 bytes required",
                    g.INVALID_ARGUMENT,
                    { value: a }
                  );
            } catch (b) {
              var c = {
                arg: "privateKey",
                reason: b.reason,
                value: "[REDACTED]",
              };
              b.value &&
                ("number" == typeof b.value.length &&
                  (c.length = b.value.length),
                (c.type = typeof b.value)),
                g.throwError("invalid private key", b.code, c);
            }
            f.defineProperty(this, "privateKey", f.hexlify(a));
            var h = e.keyFromPrivate(a);
            f.defineProperty(this, "publicKey", "0x" + h.getPublic(!0, "hex"));
            var i = d.publicKeyToAddress("0x" + h.getPublic(!1, "hex"));
            f.defineProperty(this, "address", i),
              f.defineProperty(this, "signDigest", function (a) {
                var b = h.sign(f.arrayify(a), { canonical: !0 });
                return {
                  recoveryParam: b.recoveryParam,
                  r: "0x" + b.r.toString(16),
                  s: "0x" + b.s.toString(16),
                };
              });
          }
          var e = new (a("elliptic").ec)("secp256k1"),
            f = (function () {
              var b = a("../utils/convert");
              return {
                defineProperty: a("../utils/properties").defineProperty,
                arrayify: b.arrayify,
                hexlify: b.hexlify,
                getAddress: a("../utils/address").getAddress,
                keccak256: a("../utils/keccak256"),
              };
            })(),
            g = a("../utils/errors");
          f.defineProperty(d, "recover", function (a, b, c, g) {
            var h = { r: f.arrayify(b), s: f.arrayify(c) },
              i = e.recoverPubKey(f.arrayify(a), h, g);
            return d.publicKeyToAddress("0x" + i.encode("hex", !1));
          }),
            f.defineProperty(d, "getPublicKey", function (a, b) {
              if (((a = f.arrayify(a)), (b = !!b), 32 === a.length)) {
                var c = e.keyFromPrivate(a);
                return "0x" + c.getPublic(b, "hex");
              }
              if (33 === a.length) {
                var c = e.keyFromPublic(a);
                return "0x" + c.getPublic(b, "hex");
              }
              if (65 === a.length) {
                var c = e.keyFromPublic(a);
                return "0x" + c.getPublic(b, "hex");
              }
              throw new Error("invalid value");
            }),
            f.defineProperty(d, "publicKeyToAddress", function (a) {
              return (
                (a = "0x" + d.getPublicKey(a, !1).slice(4)),
                f.getAddress("0x" + f.keccak256(a).substring(26))
              );
            }),
            (b.exports = d);
        },
        {
          "../utils/address": 56,
          "../utils/convert": 61,
          "../utils/errors": 63,
          "../utils/keccak256": 67,
          "../utils/properties": 70,
          elliptic: 9,
        },
      ],
      81: [
        function (a, b, c) {
          "use strict";
          function d(a, b) {
            g.checkNew(this, d);
            var c = a;
            a instanceof j || (c = new j(a)),
              f.defineProperty(this, "privateKey", c.privateKey),
              Object.defineProperty(this, "provider", {
                enumerable: !0,
                get: function () {
                  return b;
                },
                set: function (a) {
                  b = a;
                },
              }),
              b && (this.provider = b);
            var e = 15e5;
            Object.defineProperty(this, "defaultGasLimit", {
              enumerable: !0,
              get: function () {
                return e;
              },
              set: function (a) {
                if ("number" != typeof a)
                  throw new Error("invalid defaultGasLimit");
                e = a;
              },
            }),
              f.defineProperty(this, "address", c.address),
              f.defineProperty(this, "sign", function (a) {
                var b = a.chainId;
                null == b && this.provider && (b = this.provider.chainId),
                  b || (b = 0);
                var d = [];
                l.forEach(function (b) {
                  var c = a[b.name] || [];
                  if (
                    ((c = f.arrayify(f.hexlify(c), b.name)),
                    b.length && c.length !== b.length && c.length > 0)
                  ) {
                    var e = new Error("invalid " + b.name);
                    throw ((e.reason = "wrong length"), (e.value = c), e);
                  }
                  if (
                    b.maxLength &&
                    ((c = f.stripZeros(c)), c.length > b.maxLength)
                  ) {
                    var e = new Error("invalid " + b.name);
                    throw ((e.reason = "too long"), (e.value = c), e);
                  }
                  d.push(f.hexlify(c));
                }),
                  b && (d.push(f.hexlify(b)), d.push("0x"), d.push("0x"));
                var e = f.keccak256(f.RLP.encode(d)),
                  g = c.signDigest(e),
                  h = 27 + g.recoveryParam;
                return (
                  b && (d.pop(), d.pop(), d.pop(), (h += 2 * b + 8)),
                  d.push(f.hexlify(h)),
                  d.push(g.r),
                  d.push(g.s),
                  f.RLP.encode(d)
                );
              });
          }
          var e = a("scrypt-js"),
            f = (function () {
              var b = a("../utils/convert");
              return {
                defineProperty: a("../utils/properties").defineProperty,
                arrayify: b.arrayify,
                concat: b.concat,
                hexlify: b.hexlify,
                stripZeros: b.stripZeros,
                hexZeroPad: b.hexZeroPad,
                bigNumberify: a("../utils/bignumber").bigNumberify,
                toUtf8Bytes: a("../utils/utf8").toUtf8Bytes,
                getAddress: a("../utils/address").getAddress,
                keccak256: a("../utils/keccak256"),
                randomBytes: a("../utils").randomBytes,
                RLP: a("../utils/rlp"),
              };
            })(),
            g = a("../utils/errors"),
            h = a("./hdnode"),
            i = a("./secret-storage"),
            j = a("./signing-key");
          a("setimmediate");
          var k = "m/44'/60'/0'/0/0",
            l = [
              { name: "nonce", maxLength: 32 },
              { name: "gasPrice", maxLength: 32 },
              { name: "gasLimit", maxLength: 32 },
              { name: "to", length: 20 },
              { name: "value", maxLength: 32 },
              { name: "data" },
            ];
          f.defineProperty(d, "parseTransaction", function (a) {
            a = f.hexlify(a, "rawTransaction");
            var b = f.RLP.decode(a);
            if (9 !== b.length) throw new Error("invalid transaction");
            var c = [],
              d = {};
            l.forEach(function (a, e) {
              (d[a.name] = b[e]), c.push(b[e]);
            }),
              d.to &&
                ("0x" == d.to ? delete d.to : (d.to = f.getAddress(d.to))),
              ["gasPrice", "gasLimit", "nonce", "value"].forEach(function (a) {
                d[a] &&
                  (0 === d[a].length
                    ? (d[a] = f.bigNumberify(0))
                    : (d[a] = f.bigNumberify(d[a])));
              }),
              d.nonce ? (d.nonce = d.nonce.toNumber()) : (d.nonce = 0);
            var e = f.arrayify(b[6]),
              g = f.arrayify(b[7]),
              h = f.arrayify(b[8]);
            if (
              e.length >= 1 &&
              g.length >= 1 &&
              g.length <= 32 &&
              h.length >= 1 &&
              h.length <= 32
            ) {
              (d.v = f.bigNumberify(e).toNumber()), (d.r = b[7]), (d.s = b[8]);
              var i = (d.v - 35) / 2;
              i < 0 && (i = 0), (i = parseInt(i)), (d.chainId = i);
              var k = d.v - 27;
              i &&
                (c.push(f.hexlify(i)),
                c.push("0x"),
                c.push("0x"),
                (k -= 2 * i + 8));
              var m = f.keccak256(f.RLP.encode(c));
              try {
                d.from = j.recover(m, g, h, k);
              } catch (n) {
                console.log(n);
              }
            }
            return d;
          }),
            f.defineProperty(d.prototype, "getAddress", function () {
              return this.address;
            }),
            f.defineProperty(d.prototype, "getBalance", function (a) {
              if (!this.provider) throw new Error("missing provider");
              return this.provider.getBalance(this.address, a);
            }),
            f.defineProperty(d.prototype, "getTransactionCount", function (a) {
              if (!this.provider) throw new Error("missing provider");
              return this.provider.getTransactionCount(this.address, a);
            }),
            f.defineProperty(d.prototype, "estimateGas", function (a) {
              if (!this.provider) throw new Error("missing provider");
              var b = {};
              return (
                ["from", "to", "data", "value"].forEach(function (c) {
                  null != a[c] && (b[c] = a[c]);
                }),
                null == a.from && (b.from = this.address),
                this.provider.estimateGas(b)
              );
            }),
            f.defineProperty(d.prototype, "sendTransaction", function (a) {
              if (!this.provider) throw new Error("missing provider");
              if (!a || "object" != typeof a)
                throw new Error("invalid transaction object");
              var b = a.gasLimit;
              null == b && (b = this.defaultGasLimit);
              var c = this,
                e = null;
              e = a.gasPrice
                ? Promise.resolve(a.gasPrice)
                : this.provider.getGasPrice();
              var g = null;
              g = a.nonce
                ? Promise.resolve(a.nonce)
                : this.provider.getTransactionCount(c.address, "pending");
              var h = this.provider.chainId,
                i = null;
              i = a.to
                ? this.provider.resolveName(a.to)
                : Promise.resolve(void 0);
              var j = f.hexlify(a.data || "0x"),
                k = f.hexlify(a.value || 0);
              return Promise.all([e, g, i]).then(function (a) {
                var e = c.sign({
                  to: a[2],
                  data: j,
                  gasLimit: b,
                  gasPrice: a[0],
                  nonce: a[1],
                  value: k,
                  chainId: h,
                });
                return c.provider.sendTransaction(e).then(function (a) {
                  var b = d.parseTransaction(e);
                  return (
                    (b.hash = a),
                    (b.wait = function () {
                      return c.provider.waitForTransaction(a);
                    }),
                    b
                  );
                });
              });
            }),
            f.defineProperty(d.prototype, "send", function (a, b, c) {
              return (
                c || (c = {}),
                this.sendTransaction({
                  to: a,
                  gasLimit: c.gasLimit,
                  gasPrice: c.gasPrice,
                  nonce: c.nonce,
                  value: b,
                })
              );
            }),
            f.defineProperty(d, "hashMessage", function (a) {
              var b = f.concat([
                f.toUtf8Bytes("Ethereum Signed Message:\n"),
                f.toUtf8Bytes(String(a.length)),
                "string" == typeof a ? f.toUtf8Bytes(a) : a,
              ]);
              return f.keccak256(b);
            }),
            f.defineProperty(d.prototype, "signMessage", function (a) {
              var b = new j(this.privateKey),
                c = b.signDigest(d.hashMessage(a));
              return (
                f.hexZeroPad(c.r, 32) +
                f.hexZeroPad(c.s, 32).substring(2) +
                (c.recoveryParam ? "1c" : "1b")
              );
            }),
            f.defineProperty(d, "verifyMessage", function (a, b) {
              if (((b = f.hexlify(b)), 132 != b.length))
                throw new Error("invalid signature");
              var c = d.hashMessage(a),
                e = parseInt(b.substring(130), 16);
              if ((e >= 27 && (e -= 27), e < 0))
                throw new Error("invalid signature");
              return j.recover(
                c,
                b.substring(0, 66),
                "0x" + b.substring(66, 130),
                e
              );
            }),
            f.defineProperty(d.prototype, "encrypt", function (a, b, c) {
              if (
                ("function" != typeof b || c || ((c = b), (b = {})),
                c && "function" != typeof c)
              )
                throw new Error("invalid callback");
              if ((b || (b = {}), this.mnemonic)) {
                var d = {};
                for (var e in b) d[e] = b[e];
                (b = d), (b.mnemonic = this.mnemonic), (b.path = this.path);
              }
              return i.encrypt(this.privateKey, a, b, c);
            }),
            f.defineProperty(d, "isEncryptedWallet", function (a) {
              return i.isValidWallet(a) || i.isCrowdsaleWallet(a);
            }),
            f.defineProperty(d, "createRandom", function (a) {
              var b = f.randomBytes(16);
              a || (a = {}),
                a.extraEntropy &&
                  (b = f
                    .keccak256(f.concat([b, a.extraEntropy]))
                    .substring(0, 34));
              var c = h.entropyToMnemonic(b);
              return d.fromMnemonic(c, a.path);
            }),
            f.defineProperty(d, "fromEncryptedWallet", function (a, b, c) {
              if (c && "function" != typeof c)
                throw new Error("invalid callback");
              return new Promise(function (e, g) {
                if (i.isCrowdsaleWallet(a))
                  try {
                    var h = i.decryptCrowdsale(a, b);
                    e(new d(h));
                  } catch (j) {
                    g(j);
                  }
                else
                  i.isValidWallet(a)
                    ? i.decrypt(a, b, c).then(
                        function (a) {
                          var b = new d(a);
                          a.mnemonic &&
                            a.path &&
                            (f.defineProperty(b, "mnemonic", a.mnemonic),
                            f.defineProperty(b, "path", a.path)),
                            e(b);
                        },
                        function (a) {
                          g(a);
                        }
                      )
                    : g("invalid wallet JSON");
              });
            }),
            f.defineProperty(d, "fromMnemonic", function (a, b) {
              b || (b = k);
              var c = h.fromMnemonic(a).derivePath(b),
                e = new d(c.privateKey);
              return (
                f.defineProperty(e, "mnemonic", a),
                f.defineProperty(e, "path", b),
                e
              );
            }),
            f.defineProperty(d, "fromBrainWallet", function (a, b, c) {
              if (c && "function" != typeof c)
                throw new Error("invalid callback");
              return (
                (a =
                  "string" == typeof a
                    ? f.toUtf8Bytes(a, "NFKC")
                    : f.arrayify(a, "password")),
                (b =
                  "string" == typeof b
                    ? f.toUtf8Bytes(b, "NFKC")
                    : f.arrayify(b, "password")),
                new Promise(function (g, h) {
                  e(b, a, 1 << 18, 8, 1, 32, function (a, b, e) {
                    if (a) h(a);
                    else if (e) g(new d(f.hexlify(e)));
                    else if (c) return c(b);
                  });
                })
              );
            }),
            (b.exports = d);
        },
        {
          "../utils": 66,
          "../utils/address": 56,
          "../utils/bignumber": 57,
          "../utils/convert": 61,
          "../utils/errors": 63,
          "../utils/keccak256": 67,
          "../utils/properties": 70,
          "../utils/rlp": 71,
          "../utils/utf8": 76,
          "./hdnode": 77,
          "./secret-storage": 79,
          "./signing-key": 80,
          "scrypt-js": 41,
          setimmediate: 42,
        },
      ],
      82: [
        function (a, b, c) {
          b.exports =
            "AbandonAbilityAbleAboutAboveAbsentAbsorbAbstractAbsurdAbuseAccessAccidentAccountAccuseAchieveAcidAcousticAcquireAcrossActActionActorActressActualAdaptAddAddictAddressAdjustAdmitAdultAdvanceAdviceAerobicAffairAffordAfraidAgainAgeAgentAgreeAheadAimAirAirportAisleAlarmAlbumAlcoholAlertAlienAllAlleyAllowAlmostAloneAlphaAlreadyAlsoAlterAlwaysAmateurAmazingAmongAmountAmusedAnalystAnchorAncientAngerAngleAngryAnimalAnkleAnnounceAnnualAnotherAnswerAntennaAntiqueAnxietyAnyApartApologyAppearAppleApproveAprilArchArcticAreaArenaArgueArmArmedArmorArmyAroundArrangeArrestArriveArrowArtArtefactArtistArtworkAskAspectAssaultAssetAssistAssumeAsthmaAthleteAtomAttackAttendAttitudeAttractAuctionAuditAugustAuntAuthorAutoAutumnAverageAvocadoAvoidAwakeAwareAwayAwesomeAwfulAwkwardAxisBabyBachelorBaconBadgeBagBalanceBalconyBallBambooBananaBannerBarBarelyBargainBarrelBaseBasicBasketBattleBeachBeanBeautyBecauseBecomeBeefBeforeBeginBehaveBehindBelieveBelowBeltBenchBenefitBestBetrayBetterBetweenBeyondBicycleBidBikeBindBiologyBirdBirthBitterBlackBladeBlameBlanketBlastBleakBlessBlindBloodBlossomBlouseBlueBlurBlushBoardBoatBodyBoilBombBoneBonusBookBoostBorderBoringBorrowBossBottomBounceBoxBoyBracketBrainBrandBrassBraveBreadBreezeBrickBridgeBriefBrightBringBriskBroccoliBrokenBronzeBroomBrotherBrownBrushBubbleBuddyBudgetBuffaloBuildBulbBulkBulletBundleBunkerBurdenBurgerBurstBusBusinessBusyButterBuyerBuzzCabbageCabinCableCactusCageCakeCallCalmCameraCampCanCanalCancelCandyCannonCanoeCanvasCanyonCapableCapitalCaptainCarCarbonCardCargoCarpetCarryCartCaseCashCasinoCastleCasualCatCatalogCatchCategoryCattleCaughtCauseCautionCaveCeilingCeleryCementCensusCenturyCerealCertainChairChalkChampionChangeChaosChapterChargeChaseChatCheapCheckCheeseChefCherryChestChickenChiefChildChimneyChoiceChooseChronicChuckleChunkChurnCigarCinnamonCircleCitizenCityCivilClaimClapClarifyClawClayCleanClerkCleverClickClientCliffClimbClinicClipClockClogCloseClothCloudClownClubClumpClusterClutchCoachCoastCoconutCodeCoffeeCoilCoinCollectColorColumnCombineComeComfortComicCommonCompanyConcertConductConfirmCongressConnectConsiderControlConvinceCookCoolCopperCopyCoralCoreCornCorrectCostCottonCouchCountryCoupleCourseCousinCoverCoyoteCrackCradleCraftCramCraneCrashCraterCrawlCrazyCreamCreditCreekCrewCricketCrimeCrispCriticCropCrossCrouchCrowdCrucialCruelCruiseCrumbleCrunchCrushCryCrystalCubeCultureCupCupboardCuriousCurrentCurtainCurveCushionCustomCuteCycleDadDamageDampDanceDangerDaringDashDaughterDawnDayDealDebateDebrisDecadeDecemberDecideDeclineDecorateDecreaseDeerDefenseDefineDefyDegreeDelayDeliverDemandDemiseDenialDentistDenyDepartDependDepositDepthDeputyDeriveDescribeDesertDesignDeskDespairDestroyDetailDetectDevelopDeviceDevoteDiagramDialDiamondDiaryDiceDieselDietDifferDigitalDignityDilemmaDinnerDinosaurDirectDirtDisagreeDiscoverDiseaseDishDismissDisorderDisplayDistanceDivertDivideDivorceDizzyDoctorDocumentDogDollDolphinDomainDonateDonkeyDonorDoorDoseDoubleDoveDraftDragonDramaDrasticDrawDreamDressDriftDrillDrinkDripDriveDropDrumDryDuckDumbDuneDuringDustDutchDutyDwarfDynamicEagerEagleEarlyEarnEarthEasilyEastEasyEchoEcologyEconomyEdgeEditEducateEffortEggEightEitherElbowElderElectricElegantElementElephantElevatorEliteElseEmbarkEmbodyEmbraceEmergeEmotionEmployEmpowerEmptyEnableEnactEndEndlessEndorseEnemyEnergyEnforceEngageEngineEnhanceEnjoyEnlistEnoughEnrichEnrollEnsureEnterEntireEntryEnvelopeEpisodeEqualEquipEraEraseErodeErosionErrorEruptEscapeEssayEssenceEstateEternalEthicsEvidenceEvilEvokeEvolveExactExampleExcessExchangeExciteExcludeExcuseExecuteExerciseExhaustExhibitExileExistExitExoticExpandExpectExpireExplainExposeExpressExtendExtraEyeEyebrowFabricFaceFacultyFadeFaintFaithFallFalseFameFamilyFamousFanFancyFantasyFarmFashionFatFatalFatherFatigueFaultFavoriteFeatureFebruaryFederalFeeFeedFeelFemaleFenceFestivalFetchFeverFewFiberFictionFieldFigureFileFilmFilterFinalFindFineFingerFinishFireFirmFirstFiscalFishFitFitnessFixFlagFlameFlashFlatFlavorFleeFlightFlipFloatFlockFloorFlowerFluidFlushFlyFoamFocusFogFoilFoldFollowFoodFootForceForestForgetForkFortuneForumForwardFossilFosterFoundFoxFragileFrameFrequentFreshFriendFringeFrogFrontFrostFrownFrozenFruitFuelFunFunnyFurnaceFuryFutureGadgetGainGalaxyGalleryGameGapGarageGarbageGardenGarlicGarmentGasGaspGateGatherGaugeGazeGeneralGeniusGenreGentleGenuineGestureGhostGiantGiftGiggleGingerGiraffeGirlGiveGladGlanceGlareGlassGlideGlimpseGlobeGloomGloryGloveGlowGlueGoatGoddessGoldGoodGooseGorillaGospelGossipGovernGownGrabGraceGrainGrantGrapeGrassGravityGreatGreenGridGriefGritGroceryGroupGrowGruntGuardGuessGuideGuiltGuitarGunGymHabitHairHalfHammerHamsterHandHappyHarborHardHarshHarvestHatHaveHawkHazardHeadHealthHeartHeavyHedgehogHeightHelloHelmetHelpHenHeroHiddenHighHillHintHipHireHistoryHobbyHockeyHoldHoleHolidayHollowHomeHoneyHoodHopeHornHorrorHorseHospitalHostHotelHourHoverHubHugeHumanHumbleHumorHundredHungryHuntHurdleHurryHurtHusbandHybridIceIconIdeaIdentifyIdleIgnoreIllIllegalIllnessImageImitateImmenseImmuneImpactImposeImproveImpulseInchIncludeIncomeIncreaseIndexIndicateIndoorIndustryInfantInflictInformInhaleInheritInitialInjectInjuryInmateInnerInnocentInputInquiryInsaneInsectInsideInspireInstallIntactInterestIntoInvestInviteInvolveIronIslandIsolateIssueItemIvoryJacketJaguarJarJazzJealousJeansJellyJewelJobJoinJokeJourneyJoyJudgeJuiceJumpJungleJuniorJunkJustKangarooKeenKeepKetchupKeyKickKidKidneyKindKingdomKissKitKitchenKiteKittenKiwiKneeKnifeKnockKnowLabLabelLaborLadderLadyLakeLampLanguageLaptopLargeLaterLatinLaughLaundryLavaLawLawnLawsuitLayerLazyLeaderLeafLearnLeaveLectureLeftLegLegalLegendLeisureLemonLendLengthLensLeopardLessonLetterLevelLiarLibertyLibraryLicenseLifeLiftLightLikeLimbLimitLinkLionLiquidListLittleLiveLizardLoadLoanLobsterLocalLockLogicLonelyLongLoopLotteryLoudLoungeLoveLoyalLuckyLuggageLumberLunarLunchLuxuryLyricsMachineMadMagicMagnetMaidMailMainMajorMakeMammalManManageMandateMangoMansionManualMapleMarbleMarchMarginMarineMarketMarriageMaskMassMasterMatchMaterialMathMatrixMatterMaximumMazeMeadowMeanMeasureMeatMechanicMedalMediaMelodyMeltMemberMemoryMentionMenuMercyMergeMeritMerryMeshMessageMetalMethodMiddleMidnightMilkMillionMimicMindMinimumMinorMinuteMiracleMirrorMiseryMissMistakeMixMixedMixtureMobileModelModifyMomMomentMonitorMonkeyMonsterMonthMoonMoralMoreMorningMosquitoMotherMotionMotorMountainMouseMoveMovieMuchMuffinMuleMultiplyMuscleMuseumMushroomMusicMustMutualMyselfMysteryMythNaiveNameNapkinNarrowNastyNationNatureNearNeckNeedNegativeNeglectNeitherNephewNerveNestNetNetworkNeutralNeverNewsNextNiceNightNobleNoiseNomineeNoodleNormalNorthNoseNotableNoteNothingNoticeNovelNowNuclearNumberNurseNutOakObeyObjectObligeObscureObserveObtainObviousOccurOceanOctoberOdorOffOfferOfficeOftenOilOkayOldOliveOlympicOmitOnceOneOnionOnlineOnlyOpenOperaOpinionOpposeOptionOrangeOrbitOrchardOrderOrdinaryOrganOrientOriginalOrphanOstrichOtherOutdoorOuterOutputOutsideOvalOvenOverOwnOwnerOxygenOysterOzonePactPaddlePagePairPalacePalmPandaPanelPanicPantherPaperParadeParentParkParrotPartyPassPatchPathPatientPatrolPatternPausePavePaymentPeacePeanutPearPeasantPelicanPenPenaltyPencilPeoplePepperPerfectPermitPersonPetPhonePhotoPhrasePhysicalPianoPicnicPicturePiecePigPigeonPillPilotPinkPioneerPipePistolPitchPizzaPlacePlanetPlasticPlatePlayPleasePledgePluckPlugPlungePoemPoetPointPolarPolePolicePondPonyPoolPopularPortionPositionPossiblePostPotatoPotteryPovertyPowderPowerPracticePraisePredictPreferPreparePresentPrettyPreventPricePridePrimaryPrintPriorityPrisonPrivatePrizeProblemProcessProduceProfitProgramProjectPromoteProofPropertyProsperProtectProudProvidePublicPuddingPullPulpPulsePumpkinPunchPupilPuppyPurchasePurityPurposePursePushPutPuzzlePyramidQualityQuantumQuarterQuestionQuickQuitQuizQuoteRabbitRaccoonRaceRackRadarRadioRailRainRaiseRallyRampRanchRandomRangeRapidRareRateRatherRavenRawRazorReadyRealReasonRebelRebuildRecallReceiveRecipeRecordRecycleReduceReflectReformRefuseRegionRegretRegularRejectRelaxReleaseReliefRelyRemainRememberRemindRemoveRenderRenewRentReopenRepairRepeatReplaceReportRequireRescueResembleResistResourceResponseResultRetireRetreatReturnReunionRevealReviewRewardRhythmRibRibbonRiceRichRideRidgeRifleRightRigidRingRiotRippleRiskRitualRivalRiverRoadRoastRobotRobustRocketRomanceRoofRookieRoomRoseRotateRoughRoundRouteRoyalRubberRudeRugRuleRunRunwayRuralSadSaddleSadnessSafeSailSaladSalmonSalonSaltSaluteSameSampleSandSatisfySatoshiSauceSausageSaveSayScaleScanScareScatterSceneSchemeSchoolScienceScissorsScorpionScoutScrapScreenScriptScrubSeaSearchSeasonSeatSecondSecretSectionSecuritySeedSeekSegmentSelectSellSeminarSeniorSenseSentenceSeriesServiceSessionSettleSetupSevenShadowShaftShallowShareShedShellSheriffShieldShiftShineShipShiverShockShoeShootShopShortShoulderShoveShrimpShrugShuffleShySiblingSickSideSiegeSightSignSilentSilkSillySilverSimilarSimpleSinceSingSirenSisterSituateSixSizeSkateSketchSkiSkillSkinSkirtSkullSlabSlamSleepSlenderSliceSlideSlightSlimSloganSlotSlowSlushSmallSmartSmileSmokeSmoothSnackSnakeSnapSniffSnowSoapSoccerSocialSockSodaSoftSolarSoldierSolidSolutionSolveSomeoneSongSoonSorrySortSoulSoundSoupSourceSouthSpaceSpareSpatialSpawnSpeakSpecialSpeedSpellSpendSphereSpiceSpiderSpikeSpinSpiritSplitSpoilSponsorSpoonSportSpotSpraySpreadSpringSpySquareSqueezeSquirrelStableStadiumStaffStageStairsStampStandStartStateStaySteakSteelStemStepStereoStickStillStingStockStomachStoneStoolStoryStoveStrategyStreetStrikeStrongStruggleStudentStuffStumbleStyleSubjectSubmitSubwaySuccessSuchSuddenSufferSugarSuggestSuitSummerSunSunnySunsetSuperSupplySupremeSureSurfaceSurgeSurpriseSurroundSurveySuspectSustainSwallowSwampSwapSwarmSwearSweetSwiftSwimSwingSwitchSwordSymbolSymptomSyrupSystemTableTackleTagTailTalentTalkTankTapeTargetTaskTasteTattooTaxiTeachTeamTellTenTenantTennisTentTermTestTextThankThatThemeThenTheoryThereTheyThingThisThoughtThreeThriveThrowThumbThunderTicketTideTigerTiltTimberTimeTinyTipTiredTissueTitleToastTobaccoTodayToddlerToeTogetherToiletTokenTomatoTomorrowToneTongueTonightToolToothTopTopicToppleTorchTornadoTortoiseTossTotalTouristTowardTowerTownToyTrackTradeTrafficTragicTrainTransferTrapTrashTravelTrayTreatTreeTrendTrialTribeTrickTriggerTrimTripTrophyTroubleTruckTrueTrulyTrumpetTrustTruthTryTubeTuitionTumbleTunaTunnelTurkeyTurnTurtleTwelveTwentyTwiceTwinTwistTwoTypeTypicalUglyUmbrellaUnableUnawareUncleUncoverUnderUndoUnfairUnfoldUnhappyUniformUniqueUnitUniverseUnknownUnlockUntilUnusualUnveilUpdateUpgradeUpholdUponUpperUpsetUrbanUrgeUsageUseUsedUsefulUselessUsualUtilityVacantVacuumVagueValidValleyValveVanVanishVaporVariousVastVaultVehicleVelvetVendorVentureVenueVerbVerifyVersionVeryVesselVeteranViableVibrantViciousVictoryVideoViewVillageVintageViolinVirtualVirusVisaVisitVisualVitalVividVocalVoiceVoidVolcanoVolumeVoteVoyageWageWagonWaitWalkWallWalnutWantWarfareWarmWarriorWashWaspWasteWaterWaveWayWealthWeaponWearWeaselWeatherWebWeddingWeekendWeirdWelcomeWestWetWhaleWhatWheatWheelWhenWhereWhipWhisperWideWidthWifeWildWillWinWindowWineWingWinkWinnerWinterWireWisdomWiseWishWitnessWolfWomanWonderWoodWoolWordWorkWorldWorryWorthWrapWreckWrestleWristWriteWrongYardYearYellowYouYoungYouthZebraZeroZoneZoo";
        },
        {},
      ],
    },
    {},
    [4]
  )(4);
});
