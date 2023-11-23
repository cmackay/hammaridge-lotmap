const fs = require('fs');
const convert = require('xml-js');
const filePath = './MasonCountyLotMap.kml';
const data = fs.readFileSync(filePath, 'utf8');
const js = convert.xml2js(data, { compact: true });

js.kml.Document.Placemark.forEach((placemark) => {
  placemark.ExtendedData.Data.forEach((data) => {
    const name = data['_attributes'].name;
    if (name === 'PIN') {
        placemark.name['_text'] = data['value']['_text'];
    }
  });
});

const output = convert.js2xml(js, { compact: true, spaces: 2 });
console.log(output);