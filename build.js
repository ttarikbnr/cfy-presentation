if (process.argv.length < 3) {
    console.log('Usage: node build.js your-cabvas-def.json')
    process.exit(1);
}
const iname = process.argv[2];
const rx = /(.*)\.js(on)?$/
if (! rx.test(iname)) {
    console.error('The input file should be a json or js file and have .json extension')
    process.exit(1);
}

const isarray = Array.prototype.isPrototypeOf;
const fs = require('fs');
const hb = require("handlebars");
const showit = el => { 
    if (Array.prototype.isPrototypeOf(el)) {
        return '<ul>' + el.map(e =>  `<li>${e}</li>`).join('') +
        '</ul>';
    } else {
        return el;
    }
}

let keys = Object.keys(JSON.parse(fs.readFileSync('./lean-canvas-tmpl.json')));
let template = hb.compile(fs.readFileSync("lean-canvas-tmpl.html").toString())
const def = JSON.parse(fs.readFileSync(iname));

const fname = './' + rx.exec(iname)[1] + '.html';
const input =     JSON.parse(fs.readFileSync(iname));
let data = {}
keys.forEach(key => {
    if (! input[key]) {
        console.warn(key, 'i: Not deyinod in input file');
        return;    
}
    data[key] = input[key].map(item => {
    return {item: showit(item)};
    })
});
const out = template(data);
fs.writeFileSync(fname, out);