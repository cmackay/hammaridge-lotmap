const fs = require('fs');
const convert = require('xml-js');

const oldVersion = convert.xml2js(fs.readFileSync('./lotmap.kml', 'utf8'), {
  compact: true
});

const oldPlacemarks = {};

oldVersion.kml.Document.Folder.Placemark.forEach((placemark) => {
  const id = placemark.name['_text'].split(' ');
  oldPlacemarks[id.length === 2 ? id[1] : id[0]] = placemark;
  if (id.length === 2) {
    placemark.lotNumber = id[0];
  }
});

const newVersion = convert.xml2js(
  fs.readFileSync('./HammaRidgeLotMap.kml', 'utf8'),
  {
    compact: true
  }
);

newVersion.kml.Document.Placemark.forEach((placemark) => {
  placemark.ExtendedData.Data.forEach((data) => {
    const name = data['_attributes'].name;
    if (name === 'PIN') {
      const id = data['value']['_text'];
      placemark.name['_text'] = id;
      if (oldPlacemarks[id]) {
        if (oldPlacemarks[id].lotNumber) {
          placemark.name['_text'] = `${oldPlacemarks[id].lotNumber} ${id}`;
        } else {
          console.log(`no lot number for ${id}`);
        }
        placemark.description['_cdata'] =
          oldPlacemarks[id].description['_cdata'];
      }
    }
  });
});

// console.log(convert.js2xml(newVersion, { compact: true, spaces: 2 }));
