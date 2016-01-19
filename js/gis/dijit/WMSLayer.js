define([
    // basics
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/dom-construct',

    'dojo/on',
    'dojo/keys',

    // mixins & base classes
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    // templates & widget css
    'dojo/text!./WMSLayer/templates/WMSLayer.html',
    'xstyle/css!./WMSLayer/css/WMSLayer.css',
    'dojo/i18n!./WMSLayer/nls/resource',
    'esri/layers/WMSLayer',
    'esri/config',

    // not referenced
    'dijit/form/Button',
    'dijit/form/TextBox',
    'dijit/form/Select'
], function (declare, lang, array, domConstruct,
             on, keys,
             _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
             template, css, i18n, WMSLayer, esriConfig) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'gis_WMSLayerDijit',
        i18n: i18n,
        loading: false,
        loadingWidget: undefined,
        legendDiv: undefined,

        postCreate: function () {
            this.inherited(arguments);
            this.setupConnections();
            this.loadWMSLayer();
        },
        loadWMSLayer: function () {

            var wmsLayerSelection = this.wmsSelect;
            array.forEach(this.wmslayers, function (item) {
                option = {
                    value: item.url + '||' + item.layers_id,
                    label: item.name,
                    selected: false
                };
                wmsLayerSelection.addOption(option);
            });
        },
        setupConnections: function () {
            this.addButton.on('click', lang.hitch(this, 'addWMSLayer'));
        },
        handleCoordInput: function (evt) {
            if (evt.charOrCode === keys.ENTER) {
                this.addWMSLayer();
            }
        },
        addWMSLayer: function () {

            esriConfig.defaults.io.proxyUrl = this.proxy_url;

            var str_value = this.wmsSelect.get('value');
            var str_value_res = str_value.split('||');


            var wmsLayerUrl = str_value_res[0];
            var numberOfLayer = str_value_res[1];


            var wmsLayer = new WMSLayer(wmsLayerUrl, {
                id: 'WMSLayer,' + numberOfLayer,
                format: 'png',
                visibleLayers: [numberOfLayer],
                opacity: 0.7
            });
            
            // Handle layer's events to set loading status
            wmsLayer.on("load", lang.hitch(this, 'setLoading', false));
            wmsLayer.on("update-start", lang.hitch(this, 'setLoading', true));
            wmsLayer.on("update-end", lang.hitch(this, 'setLoading', false));
            wmsLayer.on("error", lang.hitch(this, 'setLoading', false, true));
            
            // Adds loading widget/div
            this.addLoadingWidget();

            this.map.addLayer(wmsLayer, 1);

            var legend_url = wmsLayerUrl + '?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=' + numberOfLayer;
            this.legendDiv = domConstruct.create('div', {innerHTML: '<label>' + numberOfLayer + '</label></br><img src=' + legend_url + '>'}, this.wmsLayerLegend);

        },
        
        addLoadingWidget: function () {
        	this.widgetLoading = domConstruct.create('div', {
                innerHTML: '<img style="display:inline;" src="data:image/gif;base64,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"/>',
                'style': 'text-align:center;padding-top: 10px;'
            }, this.wmsLayerActionsContainer, 'last');
            this.loading = true;
        },

		setLoading: function (loading, error, evt) {
			if (loading === false && this.loading === true) {
				domConstruct.destroy(this.widgetLoading);
				this.loading = false;
				
				if (error === true && this.legendDiv) {
					domConstruct.destroy(this.legendDiv);
				}
			}
			else if (loading === true && this.loading === false) {
				this.addLoadingWidget();
			}
		},

        clearWMSLayers: function () {
            var map = this.map;
            domConstruct.empty(this.wmsLayerLegend);
            var layersIds = [];
            array.forEach(this.map.layerIds, function (layerId) {
                layersIds.push(layerId);
            });
            array.forEach(layersIds, function (layerId) {
                var layerIDpart = layerId.split(',');
                if (layerIDpart[0] == 'WMSLayer') {
                    var layer = map.getLayer(layerId);
                    map.removeLayer(layer);
                }
            });
        }
    });
});
