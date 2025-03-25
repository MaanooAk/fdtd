
const fs = require('fs');

const FDTD = require('../fdtd.js').FDTD;

function file(directory, name) {
    try {
        return fs.readFileSync(`tests/${directory}/${name}`, "utf8");
    } catch {
        return null;
    }
}

function test(directory) {
    console.log(directory)
    const file_text = file(directory, "rules.fdtd");
    const compiled = FDTD.compile(file_text);
    console.log(`- compile pass`);
    const compiled_text = file(directory, "compiled.json");
    if (compiled_text) {
        compare_objects(JSON.parse(compiled_text), compiled)
        console.log(`- compile compare pass`);
    }
    for (const i of fs.readdirSync(`tests/${directory}`)) {
        if (!i.endsWith(".txt")) continue;
        const document = FDTD.parse(compiled, file(directory, i));
        console.log(`- compile ${i} pass`);
        const document_text = file(directory, i.replace(".txt", ".json"));
        compare_objects(JSON.parse(document_text), document);
        console.log(`- compile ${i} compare pass`);
    }
}

function compare_objects(o1, o2, path = "") {
    try {
        if (o1 == o2) return;
        if (typeof o1 !== typeof o2) {
            throw `diff type expected ${typeof o1} != ${typeof o2} @ ${path}`
        } else if (Array.isArray(o1)) {
            for (let i = 0; i < Math.min(o1.length, o2.length); i++) {
                compare_objects(o1[i], o2[i], path + "." + i);
            }
            if (o1.length > o2.length) {
                throw `missing ${o1.length - o2.length} elements [${o1.slice(o2.length)}] @ ${path}`
            } else if (o1.length < o2.length) {
                throw `extra ${o2.length - o1.length} elements [${o2.slice(o1.length)}] @ ${path}`
            }
        } else if (typeof o1 === "object") {
            const o1keys = Object.keys(o1);
            const o2keys = Object.keys(o2);
            compare_objects(o1keys, o2keys, path + ".KEYS");
            for (const key of o1keys) {
                compare_objects(o1[key], o2[key], path + "." + key);
            }
        } else {
            throw `expected ${o1} instead of ${o2} @ ${path}`
        }
    } catch (e) {
        console.log(JSON.stringify(o1), JSON.stringify(o2));
        throw e;
    }
}

function test_all() {

    for (const i of fs.readdirSync(`tests`)) {
        if (i.endsWith(".js")) continue;
        test(i);
    }

    compare_objects(
        FDTD.self_def,
        FDTD.compile(file("001", "rules.fdtd"))
    )

}

test_all();
