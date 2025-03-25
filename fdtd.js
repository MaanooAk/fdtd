/*

Freedom Data Text (v 0.1)

Usage:
- FDTD.parse(`rules`, `document`);
- FDTD.parse(FDTD.compile(`rules`), `document`);

*/

const FDTD = {};
try { module.exports = { FDTD }; } catch { }

(function () {

    FDTD.self_def = {
        // start: "document",
        rules: {
            "document": {
                name: "document",
                options: [
                    {
                        pattern: [
                            { list: { rule: "rule" }, separator: { rule: "rule-sep" } }
                        ],
                        export: {
                            properties: [{
                                key: "rules", value: {
                                    properties: [{ variable: 1, spread: 1 }]
                                }
                            }]
                        }
                    }
                ]
            },
            "rule-sep": {
                name: "rule-sep",
                options: [
                    {
                        pattern: [
                            { regex: "\\n\\n+" }
                        ]
                    }
                ]
            },
            "rule": {
                name: "rule",
                options: [
                    {
                        pattern: [
                            { rule: "text" },
                            { text: "\n" },
                            { list: { rule: "rule-def" }, separator: { text: "\n" }, min: 1 }
                        ],
                        export: {
                            properties: [{
                                key: { variable: 1 }, value: { // TODO wrap in string
                                    properties: [{
                                        key: "name", value: { variable: 1 }, // TODO wrap in string
                                    }, {
                                        key: "options", value: { variable: 3 }
                                    }]
                                }
                            }]
                        },
                    }
                ]
            },
            "rule-def": {
                name: "rule-def",
                options: [
                    {
                        pattern: [
                            { rule: "pattern" }, { text: "=" }, { rule: "export" }
                        ],
                        export: {
                            properties: [{
                                key: "pattern", value: { variable: 1 },
                            }, {
                                key: "export", value: { variable: 3 }
                            }]
                        },
                    },
                    {
                        pattern: [
                            { rule: "pattern" }
                        ],
                        export: {
                            properties: [{
                                key: "pattern", value: { variable: 1 },
                            }]
                        }
                    },
                ]
            },
            "pattern": {
                name: "pattern",
                options: [
                    {
                        pattern: [
                            { list: { rule: "opt-term" }, separator: { text: " " }, min: 1 }
                        ]
                    }
                ]
            },
            "opt-term": {
                name: "opt-term",
                options: [
                    {
                        pattern: [
                            { rule: "term" }, { text: "?" }
                        ],
                        export: {
                            properties: [{
                                key: "optional", value: { variable: 1 }
                            }]
                        }
                    },
                    {
                        pattern: [
                            { rule: "term" }
                        ]
                    }
                ]
            },
            "term": {
                name: "term",
                options: [
                    {
                        pattern: [
                            { rule: "simple-term" }, { text: "*" }, { rule: "simple-term" },
                        ],
                        export: {
                            properties: [{
                                key: "list", value: { variable: 1 },
                            }, {
                                key: "separator", value: { variable: 3 }
                            }]
                        },
                    },
                    {
                        pattern: [
                            { rule: "simple-term" }, { text: "+" }, { rule: "simple-term" },
                        ],
                        export: {
                            properties: [{
                                key: "list", value: { variable: 1 },
                            }, {
                                key: "separator", value: { variable: 3 }
                            }, {
                                key: "min", value: 1,
                            }]
                        },
                    },
                    {
                        pattern: [
                            { rule: "simple-term" },
                        ]
                    },
                ]
            },
            "simple-term": {
                name: "simple-term",
                options: [
                    {
                        pattern: [
                            { regex: "[a-z-_]+" }
                        ],
                        export: { properties: [{ key: "rule", value: { variable: 1 } }] }
                    },
                    {
                        pattern: [
                            { rule: "string-single" }
                        ],
                        export: { properties: [{ key: "text", value: { variable: 1 } }] }
                    },
                    {
                        pattern: [
                            { text: "/" }, { regex: "[^\\x2F]*" }, { text: "/" },
                        ],
                        export: { properties: [{ key: "regex", value: { variable: 2 } }] }
                    },
                ],
            },
            "export": {
                name: "export",
                options: [
                    {
                        pattern: [
                            { text: "[" },
                            { list: { rule: "array-export" }, separator: { text: "," } },
                            { text: "]" }
                        ],
                        export: { properties: [{ key: "elements", value: { variable: 2 } }] }
                    },
                    {
                        pattern: [
                            { text: "{" },
                            { list: { rule: "dict-export" }, separator: { text: "," } },
                            { text: "}" }
                        ],
                        export: { properties: [{ key: "properties", value: { variable: 2 } }] }
                    },
                    {
                        pattern: [
                            { rule: "array-export" }
                        ]
                    }
                ]
            },
            "array-export": {
                name: "array-export",
                options: [
                    {
                        pattern: [
                            { rule: "string-double" }
                        ]
                    },
                    {
                        pattern: [
                            { rule: "js" }
                        ],
                    },
                    {
                        pattern: [
                            { rule: "variable" }
                        ]
                    },
                    {
                        pattern: [
                            { rule: "number" }
                        ]
                    },
                    {
                        pattern: [
                            { rule: "boolean" }
                        ]
                    },
                ]
            },
            "dict-export": {
                name: "dict-export",
                options: [
                    {
                        pattern: [
                            { rule: "variable" }, { text: ":" }, { rule: "export" }
                        ],
                        export: {
                            properties: [{
                                key: "key", value: { variable: 1 }
                            }, {
                                key: "value", value: { variable: 3 }
                            }]
                        }
                    },
                    {
                        pattern: [
                            { rule: "text" }, { text: ":" }, { rule: "export" }
                        ],
                        export: {
                            properties: [{
                                key: "key", value: { variable: 1 }
                            }, {
                                key: "value", value: { variable: 3 }
                            }]
                        }
                    },
                    {
                        pattern: [
                            { rule: "variable" }
                        ]
                    },
                ]
            },
            "variable": {
                name: "variable",
                options: [
                    {
                        pattern: [
                            { text: "$" }, { rule: "number" }
                        ],
                        export: { properties: [{ key: "variable", value: { variable: 2 } }] }
                    },
                    {
                        pattern: [
                            { text: "...$" }, { rule: "number" }
                        ],
                        export: {
                            properties: [{
                                key: "variable", value: { variable: 2 }
                            }, {
                                key: "spread", value: true
                            }]
                        }
                    }
                ]
            }
        }
    }

    FDTD.builtin_rules = {
        "text": {
            name: "text",
            options: [
                { pattern: [{ regex: "[A-Za-z0-9-_]+" }], export: (args) => args[0] }
            ]
        },
        "string-single": {
            name: "string-single",
            options: [
                { pattern: [{ regex: `'[^']*'` }], export: (args) => eval(args[0]) }
            ]
        },
        "string-double": {
            name: "string-double",
            options: [
                { pattern: [{ regex: `"[^"]*"` }], export: (args) => eval(args[0]) }
            ]
        },
        "number": {
            name: "number",
            options: [
                { pattern: [{ regex: "[-+]?(\\d*\\.\\d+|\\d+)" }], export: (args) => parseFloat(args[0]) },
            ]
        },
        "integer": {
            name: "integer",
            options: [
                { pattern: [{ regex: "[-+]?\\d+" }], export: (args) => parseInt(args[0]) },
            ]
        },
        "boolean": {
            name: "boolean",
            options: [
                { pattern: [{ text: "true" }], export: () => true },
                { pattern: [{ text: "false" }], export: () => false }
            ]
        },
        "null": {
            name: "null",
            options: [
                { pattern: [{ text: "null" }], export: () => null },
            ]
        },
        "whitespace": {
            name: "whitespace",
            options: [
                { pattern: [{ regex: "\\s+" }], export: (args) => args[0] },
            ]
        },
        "js": {
            name: "js",
            options: [
                { pattern: [{ text: "${" }, { special: "js" }, { text: "}" }], export: (args) => ({ js: args[1] }) }
            ]
        }
        // TODO js
    }

    function parse_document(def, text) {
        if (typeof def === "string") {
            def = compile_rules(def);
        }
        const start_rule_name = def.start ?? "document";
        text = text.trim();
        const result = parse_rule(def, start_rule_name, text, 0, true);
        if (result.index < text.length) {
            throw `unparsed trailing: '` + text.substring(result.index).replace(/\n/g, "\\n") + "'";
        }
        return result.matched;
    }

    function parse_rule(def, rule_name, text, index, must) {
        const rule = def.rules[rule_name] || FDTD.builtin_rules[rule_name];
        if (rule === undefined) {
            throw `rule '${rule_name}' not found`;
        }
        if (must && rule.options.length == 1) {
            return parse_rule_option(def, rule, rule.options[0], text, index, true);
        }
        for (const option of rule.options) {
            const result = parse_rule_option(def, rule, option, text, index);
            if (result) return result;
        }
        if (must) {
            const possible = [];
            for (const option of rule.options) {
                try {
                    parse_rule_option(def, rule, option, text, index, true);
                } catch (e) {
                    possible.push(e);
                }
            }
            throw `expected one of: \n` + possible.join("\n");
        }
        return false;
    }

    function parse_rule_option(def, rule, option, text, index, must) {
        const pattern = option.pattern;
        let matched = [];
        for (const pat of pattern) {
            const result = match_pat(def, pat, text, index, must && pattern.length == 1);
            if (!result) {
                if (must) throw `expected ${JSON.stringify(pat)} @${index}`;
                return false;
            }
            matched.push(result.matched);
            index = result.index;
        }
        matched = generate_export(option.export, matched);
        return { index, matched }
    }

    var in_ignore = false;

    function match_pat(def, pat, text, index, must) {
        if (pat.text !== undefined) {
            if (text.substring(index).startsWith(pat.text)) {
                return { index: index + pat.text.length, matched: (pat.text) }
            }
        } else if (pat.regex !== undefined) {
            const regex = regex_of(pat.regex);
            const match = text.substring(index).match(regex);
            if (match !== null) {
                return { index: index + match[0].length, matched: (match[0]) }
            }
        } else if (pat.rule !== undefined) {
            const result = parse_rule(def, pat.rule, text, index, must && in_ignore);
            if (result) return result;
        } else if (pat.optional !== undefined) {
            const result = match_pat(def, pat.optional, text, index, must && in_ignore);
            if (result) return result;
            return { index, matched: null };
        } else if (pat.list !== undefined) {
            const matched = [];
            { // first element
                const result = match_pat(def, pat.list, text, index);
                if (!result && pat.min == 1) return false;
                if (!result) return { index, matched };
                matched.push(result.matched);
                index = result.index;
            }
            while (true) {
                const result_sep = match_pat(def, pat.separator, text, index);
                if (!result_sep) break;
                const result = match_pat(def, pat.list, text, result_sep.index);
                if (!result) break;
                matched.push(result.matched);
                index = result.index;
            }
            return { index, matched }
        } else if (pat.special === "js") {
            const start = index;
            let open = 0;
            while (open || text[index] !== "}") {
                if (text[index] == "{") open++;
                else if (text[index] == "}") open--;
                index++;
            }
            return { index, matched: text.substring(start, index) }
        } else {
            throw JSON.stringify(pat);
        }

        if (def.rules.ignore && !in_ignore) {
            debugger;
            in_ignore = true;
            const result = parse_rule(def, "ignore", text, index);
            in_ignore = false;
            if (!result) return false;
            index = result.index;
        } else {
            if (text[index] !== " ") return false;
            while (text[index] == " ") index++;
        }
        return match_pat(def, pat, text, index, must);
    }

    function generate_export(guide, args) {
        if (guide === undefined) {
            return args[0];
        } else if (typeof guide === "function") {
            return guide(args);
        } else if (guide.properties !== undefined) {
            const o = {};
            for (const i of guide.properties) {
                if (i.key !== undefined) {
                    o[generate_export(i.key, args)] = generate_export(i.value, args);
                } else if (i.variable !== undefined) {
                    if (i.spread) {
                        Object.assign(o, ...args[i.variable - 1]);
                    } else {
                        Object.assign(o, args[i.variable - 1]);
                    }
                }
            }
            return o;
        } else if (guide.elements !== undefined) {
            const o = [];
            for (const i of guide.elements) {
                if (i.variable !== undefined) {
                    if (i.spread) {
                        o.push(...args[i.variable - 1]);
                    } else {
                        o.push(args[i.variable - 1]);
                    }
                } else {
                    o.push(generate_export(i, args));
                }
            }
            return o;
        } else if (guide.variable !== undefined) {
            return args[guide.variable - 1];
        } else if (guide.js) {
            if (!guide.callable) guide.callable = eval(guide.js)
            return typeof guide.callable === "function" ? guide.callable(args) : guide.callable;
        } else {
            return guide;
        }
    }

    const regexes = {};

    function regex_of(x) {
        const r = regexes[x];
        if (r) return r;
        return regexes[x] = new RegExp("^" + x);
    }

    function compile_rules(text) {
        return parse_document(FDTD.self_def, text);
    }

    FDTD.parse = parse_document;
    FDTD.compile = compile_rules;
})();
