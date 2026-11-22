# hammaridge-lotmap

## Weebly embed

The lot map page on hammaridge.com uses this Embed Code block. Google removed
`KmlLayer` in Maps API 3.66, so `lotmap.js` reads `HammaRidge.kml` and draws
the lots itself. Edit the KML here; the site picks it up with no Weebly change.

```html
<div id="HammaRidgeLotMap" style="width: 100%; height: 480px; color: #000;"></div>
<script>
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "AIzaSyA8za7ofXM8gmdHJz0SNnbnmq-Apti1hYU"
  });
</script>
<script src="https://cmackay.github.io/hammaridge-lotmap/lotmap.js"></script>
```
