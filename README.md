# cmv_addwmslayer_widget
A CMV widget for adding wms layers from combo box or from text box

![alt tag](https://github.com/vojvod/CMV_addWMSLayer_Widget/blob/master/cmv_addwmslayer_widget.png)

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
      	position: 18,
      	path: 'gis/dijit/WMSLayer2',
      	placeAt: 'left',
      	title: 'Add WMS Layer',
      	options: {
      	    map: true
      	}
    },
    ...
}
```
