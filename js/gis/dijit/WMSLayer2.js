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
    'dojo/text!./WMSLayer2/templates/WMSLayer.html',
    'xstyle/css!./WMSLayer2/css/WMSLayer.css',
    'dojo/i18n!./WMSLayer2/nls/resource',
    'esri/layers/WMSLayer',
    'esri/layers/WMSLayerInfo',
    'dojox/image',
    'esri/config',

    // not referenced
    'dijit/form/Button',
    'dijit/form/TextBox',
    'dijit/form/Select'
], function (declare, lang, array, domConstruct,
             on, keys,
             _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
             template, css, i18n, WMSLayer, WMSLayerInfo, image, esriConfig) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'gis_WMSLayerDijit',
        i18n: i18n,

        postCreate: function () {
            this.inherited(arguments);
            this.setupConnections();
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

            //this.clearWMSLayers();

            esriConfig.defaults.io.proxyUrl = this.proxy_url;

            var wmsLayerUrl = this.wmsLayerTextBox.get('value');
            var numberOfLayer = this.numberOfLayerTextBox.get('value');

            var wmsLayer = new WMSLayer(wmsLayerUrl, {
                id: 'WMSLayer||' + numberOfLayer,
                format: 'png',
                visibleLayers: [numberOfLayer],
                opacity: 0.7
            });

            this.map.addLayer(wmsLayer);

            var numberOfLayerPart = numberOfLayer.split(',');

            domConstruct.empty(this.wmsLayerLegend2);

            array.forEach(numberOfLayerPart, function (layer) {
                var legend_url = wmsLayerUrl + '?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=' + layer;
                domConstruct.create('div', {innerHTML: '<label>' + layer + '</label></br><img src=' + legend_url + '>'}, this.wmsLayerLegend2);
            });


        },

        clearWMSLayers: function () {
            var map = this.map;
            domConstruct.empty(this.wmsLayerLegend2);
            var layersIds = [];
            array.forEach(this.map.layerIds, function (layerId) {
                layersIds.push(layerId);
            });
            array.forEach(layersIds, function (layerId) {
                var layerIDpart = layerId.split('||');
                if (layerIDpart[0] == 'WMSLayer') {
                    var layer = map.getLayer(layerId);
                    map.removeLayer(layer);
                }
            });
        }

    });
});
