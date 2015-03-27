define({
    map: true,
    mapClickMode: true,
    mapRightClickMenu: true,
    proxy_url: 'http://localhost/cmv/proxy/PHP/proxy.php',
    wmslayers: [
        {
            name: 'Layer1_demo',
            url: 'http://demo.opengeo.org/geoserver/wms',
            layers_id: 'topp:states'
        },
        {
            name: 'Layer2_demo',
            url: 'http://demo.opengeo.org/geoserver/wms',
            layers_id: 'ne:NE1_HR_LC_SR_W_DR'
        }
    ]
});
