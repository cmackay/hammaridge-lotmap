// Draws the Hamma Ridge lot map from HammaRidge.kml.
// Google removed KmlLayer from the Maps JavaScript API in v3.66,
// so this script reads the KML itself and draws each lot as a polygon.
// The page must load the Maps bootstrap loader first and contain
// <div id="HammaRidgeLotMap">.
(async function () {
  var KML_URL = 'https://cmackay.github.io/hammaridge-lotmap/HammaRidge.kml';
  var el = document.getElementById('HammaRidgeLotMap');
  if (!el) return;

  var maps = await google.maps.importLibrary('maps');
  var map = new maps.Map(el, {
    zoom: 15,
    center: { lat: 47.519402, lng: -123.064338 }
  });

  var res = await fetch(KML_URL, { cache: 'no-cache' });
  var doc = new DOMParser().parseFromString(await res.text(), 'application/xml');

  function text(node, tag) {
    var n = node.getElementsByTagName(tag)[0];
    return n ? n.textContent.trim() : '';
  }

  // KML colors are aabbggrr hex.
  function kmlColor(c, fallback) {
    if (!/^[0-9a-f]{8}$/i.test(c)) return fallback;
    return {
      color: '#' + c.slice(6, 8) + c.slice(4, 6) + c.slice(2, 4),
      opacity: parseInt(c.slice(0, 2), 16) / 255
    };
  }

  var styles = {};
  Array.prototype.forEach.call(doc.getElementsByTagName('Style'), function (s) {
    var line = s.getElementsByTagName('LineStyle')[0];
    var poly = s.getElementsByTagName('PolyStyle')[0];
    styles['#' + s.getAttribute('id')] = {
      stroke: kmlColor(line ? text(line, 'color') : '', { color: '#000000', opacity: 1 }),
      fill: kmlColor(poly ? text(poly, 'color') : '', { color: '#aaff7f', opacity: 0.5 })
    };
  });
  Array.prototype.forEach.call(doc.getElementsByTagName('StyleMap'), function (sm) {
    Array.prototype.forEach.call(sm.getElementsByTagName('Pair'), function (p) {
      if (text(p, 'key') === 'normal') styles['#' + sm.getAttribute('id')] = styles[text(p, 'styleUrl')];
    });
  });

  function ring(node) {
    return text(node, 'coordinates').split(/\s+/).filter(Boolean).map(function (t) {
      var p = t.split(',');
      return { lat: parseFloat(p[1]), lng: parseFloat(p[0]) };
    });
  }

  var info = new maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  Array.prototype.forEach.call(doc.getElementsByTagName('Placemark'), function (pm) {
    var style = styles[text(pm, 'styleUrl')] || styles['#s_ylw-pushpin'] || {
      stroke: { color: '#000000', opacity: 1 },
      fill: { color: '#aaff7f', opacity: 0.5 }
    };
    var name = text(pm, 'name');
    var description = text(pm, 'description');

    Array.prototype.forEach.call(pm.getElementsByTagName('Polygon'), function (pg) {
      var paths = [];
      ['outerBoundaryIs', 'innerBoundaryIs'].forEach(function (tag) {
        Array.prototype.forEach.call(pg.getElementsByTagName(tag), function (b) {
          paths.push(ring(b));
        });
      });
      paths[0].forEach(function (pt) { bounds.extend(pt); });

      var polygon = new maps.Polygon({
        map: map,
        paths: paths,
        strokeColor: style.stroke.color,
        strokeOpacity: style.stroke.opacity,
        strokeWeight: 1,
        fillColor: style.fill.color,
        fillOpacity: style.fill.opacity
      });
      polygon.addListener('click', function (e) {
        info.setContent('<div style="color:#000"><strong>' + name + '</strong><br>' + description + '</div>');
        info.setPosition(e.latLng);
        info.open(map);
      });
    });
  });

  if (!bounds.isEmpty()) map.fitBounds(bounds);
})();
