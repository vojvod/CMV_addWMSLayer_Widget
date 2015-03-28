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

            this.map.addLayer(wmsLayer, 1);

            var legend_url = wmsLayerUrl + '?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=' + numberOfLayer;
            domConstruct.create('div', {innerHTML: '<label>' + numberOfLayer + '</label></br><img src=' + legend_url + '>'}, this.wmsLayerLegend);

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
