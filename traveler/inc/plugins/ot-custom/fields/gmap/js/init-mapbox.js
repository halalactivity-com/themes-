/**
 * Created by me664 on 1/20/15.
 */
jQuery(document).ready(function($){
   // $('.bt_ot_gmap_wrap').each(function(){
        var self=$(this);
        var gmap_el=$('.bt_ot_gmap_wrap').find('.bt_ot_gmap');
        var bt_ot_gmap_input_zoom=$('.bt_ot_gmap_wrap').find('.bt_ot_gmap_input_zoom');
        var bt_ot_gmap_input_lat=$('.bt_ot_gmap_wrap').find('.bt_ot_gmap_input_lat');
        var bt_ot_gmap_input_lng=$('.bt_ot_gmap_wrap').find('.bt_ot_gmap_input_lng');
        var bt_ot_gmap_input_type=$('.bt_ot_gmap_wrap').find('.bt_ot_gmap_input_type');
        var st_token_mapbox =$('.bt_ot_gmap_wrap').find('.st_token_mapbox').val();

        var bt_ot_searchbox=$('.bt_ot_gmap_wrap').find('.bt_ot_searchbox');
        var gmap_obj;
        var current_marker,old_lat=37,old_lng=2,old_zoom=17;
        var    markers=[];

        if(bt_ot_gmap_input_lat.val()){
            old_lat=bt_ot_gmap_input_lat.val();
            old_lat=parseFloat(old_lat);
        }
        if(bt_ot_gmap_input_lng.val()){
            old_lng=bt_ot_gmap_input_lng.val();
            old_lng=parseFloat(old_lng);
        }
        if(bt_ot_gmap_input_zoom.val()){
            old_zoom=bt_ot_gmap_input_zoom.val();
            old_zoom=parseFloat(old_zoom);
        }

        var parent = $('.bt_ot_gmap_wrap'),
        mapEl = $('.google-map-mapbox', parent);
        mapboxgl.accessToken = st_token_mapbox;
        /* Map: This represents the map on the page. */
        // var map = new mapboxgl.Map({
        //     container: "st_mapbox_custom",
        //     style: "mapbox://styles/mapbox/streets-v11",
        //     zoom: old_zoom,
        //     center: [old_lng, old_lat]
        // });

        // map.on("load", function() {
        //     /* Image: An image is loaded and added to the map. */
        //     map.loadImage("https://i.imgur.com/MK4NUzI.png", function(error, image) {
        //         if (error) throw error;
        //         map.addImage("custom-marker", image);
        //         /* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
        //         map.addLayer({
        //             id: "markers",
        //             type: "symbol",
        //              Source: A data source specifies the geographic coordinate where the image marker gets placed. 
        //             source: {
        //                 type: "geojson",
        //                 data: {
        //                     type: 'FeatureCollection',
        //                     features: [{
        //                         type: 'Feature',
        //                         properties: {},
        //                         geometry: {
        //                             type: "Point",
        //                             coordinates: [old_lng, old_lat]
        //                         }
        //                     }]
        //                 }
        //             },
        //             layout: {
        //                 "icon-image": "custom-marker",
        //             }
        //         });
        //     });
        // });

        /*Resize map after popup modal*/
        

            /*Search */

            var map = new mapboxgl.Map({
                container: 'st_mapbox_custom',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [old_lng, old_lat],
                zoom: old_zoom,
            });
            map.on("load", function() {
                map.resize();
                map.loadImage("https://i.imgur.com/MK4NUzI.png", function(error, image) {
                    if (error) throw error;
                    map.addImage("custom-marker", image);
                    /* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
                    map.addLayer({
                        id: "markers",
                        type: "symbol",
                        source: {
                            type: "geojson",
                            data: {
                                type: 'FeatureCollection',
                                features: [{
                                    type: 'Feature',
                                    properties: {},
                                    geometry: {
                                        type: "Point",
                                        coordinates: [old_lng, old_lat]
                                    }
                                }]
                            }
                        },
                        layout: {
                            "icon-image": "custom-marker",
                        }
                    });
                });
            });

            var geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            });

            document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
            geocoder.on('result', function (result) {
                new_long=parseFloat(result.result.center[0]);
                new_lat=parseFloat(result.result.center[1]);
                bt_ot_gmap_input_lat.val(new_lat);
                bt_ot_gmap_input_lng.val(new_long);
            });

            $('#st-modal-show-map').on('shown.bs.modal', function () { // chooseLocation is the id of the modal.
                map.resize();
             });

    // });

});