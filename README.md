# CMV_addWMSLayer_Widget
A CMV widget for adding a wms layer

## Adding to CMV
```javascript
widgets: {
  ...
  wmslayer: {
  			  include: true,
  			  id: 'wmslayer',
  			  type: 'titlePane',
  			  canFloat: true,
  			  position: 17,
  			  path: 'gis/dijit/WMSLayer',
  			  placeAt: 'left',
  			  title: 'Add WMS Layer',
  			  options: {
  				map: true
  			  }
  			},
  wmslayer2: {
    		  include: true,
    		  id: 'wmslayer',
    		  type: 'titlePane',
    		  canFloat: true,
    		  position: 17,
    		  path: 'gis/dijit/WMSLayer2',
    		  placeAt: 'left',
    		  title: 'Add WMS Layer2',
    		  options: {
    			map: true
    		  }
    		},
  ...
}
```