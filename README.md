# d3 zip code choropleth

Based on:
* ~~[US Venture Capital Landscape 2011](http://dc-js.github.io/dc.js/vc/)~~
* [Choropleth](http://bl.ocks.org/mbostock/4060606)
* [Map: Tax Statistics](http://bl.ocks.org/dougdowson/10734337)
* [GeoJson map of Colombia](http://bl.ocks.org/john-guerra/43c7656821069d00dcbc)
* [D3.js & Crossfilter.js: Brushing Ordinal Scales for Bars & Choropleths](https://nyquist212.wordpress.com/2015/06/05/d3-js-crossfilter-js-brushing-ordinal-scales-for-bars-choropleths/)
* [Hispanic Population by Congressional District](http://media.cq.com/pub/2013/hispanic/)

### Data sources

Retrieve shapefile for the state from census site. The following work for california, adapt to WA.

Convert shapefile into geojson format using `ogr2ogr`:
```bash
$ brew install gdal
$ ogr2ogr -f GeoJSON -s_srs crs:84 -t_srs crs:84 zip_code_crs84.geojson <input-shapefile-here>.shp
```

Convert geojson to topojson:
```bash
$ npm install -g topojson
$ topojson -o zip_code_crs84.topojson --properties zipcode=ZCTA5CE10 zip_code_crs84.geojson
```

### Todo

- [x] integrate [mousewheel-zoom + click-to-center](http://bl.ocks.org/mbostock/2206340) into ~~dc.js viz~~ d3 viz
- [ ] add data dimensions to filter
- [ ] add county shapefile layer
