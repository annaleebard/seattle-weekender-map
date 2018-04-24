# Seattle Weekender Map

Seattle Washington is known for a handful of iconic tourist attractions including the Space Needle and Pike Place Market. However, Seattle is more than a handful of well known attractions. Every neighborhood in the city has it's own charm bursting with parks and public art. This map highlights these assets while visualizing bike route information. The perfect weekend is waiting for you in Seattle, use this weekender map to curate your own experience!  

## Data sources

* art POIs - [Seattle Open Data - Public Art](https://catalog.data.gov/dataset/seattle-parks-and-recreation-gis-map-layer-public-art-in-park)
* neighborhoods - [Seattle Open Data - neighborhoods](https://data.seattle.gov/dataset/Neighborhoods/2mbt-aqqx)
* parks - [Seattle Open Data - City Parks](https://data.seattle.gov/dataset/City-Of-Seattle-Parks/kxj9-se6t)
* bike routes - [Seattle Open Data - Existing Bike Facilities](https://data-seattlecitygis.opendata.arcgis.com/datasets/existing-bike-facilities/data?geometry=-122.505%2C47.626%2C-122.085%2C47.707)

### Data processing
* Mapshaper command line (-clip) used to trim large dataset of neighborhood polygons of the greater Seattle area to the proper city limit. 

### Authors

* Anna Bard
* Rich Donohue
