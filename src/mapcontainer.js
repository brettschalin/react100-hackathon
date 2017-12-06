import React, { Component } from 'react';
import fetch from 'node-fetch';
import MarkerClusterer from 'node-js-marker-clusterer';

export class MapContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            map: null,
            data: [],
        }
    }

    componentDidMount() {
        //how many records to grab from each resource
        //increase if you have lots of spare cpu cycles and bandwidth
        const limit = 1000;

        const data = [];
        const data_root = "https://moto.data.socrata.com/resource/";

        //Crime reports from Union City, Salinas, Riverside County, Santa Clara County, and San Leandro, CA
        const data_endpoints = ["xqci-zc8x.json", "9gts-2xyn.json", "2dfc-gktv.json", "wrmr-tdyp.json", "6nbc-apvm.json"];

        const promises = data_endpoints.map(end => {
            return fetch(data_root + end + `?$limit=${limit}`)
                .then(response => response.json())
        });

        Promise.all(promises).then(all_data => {
            let len = 0;
            console.log("All requests loaded. Starting final processing");
            for (let i = 0; i < all_data.length; i++) {
                for (let j = 0; j < all_data[i].length; j++) {
                    data.push(all_data[i][j]);
                    len++;
                }
            }
            console.log(`Done. this.state.data should have ${len} elements`);
            this.setState({ data: data });
        })

        window.initMap = this.initMap;
        this.loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAWmlnt3k64819WfwE66ZcNrsTr-XGRzDg&callback=initMap');
    }

    initMap() {
        this.setState({
            map:
            new window.google.maps.Map(this.refs.map, {
                center: this.props.center,
                zoom: 12,
                center_changed: this.onChangeCenter.bind(this),
                zoom_changed: this.onChangeZoom.bind(this),
            })
        });
    }
    initMap = this.initMap.bind(this);

    loadJS(src) {
        var ref = window.document.getElementsByTagName("script")[0];
        var script = window.document.createElement("script");
        script.src = src;
        script.async = true;
        ref.parentNode.insertBefore(script, ref);
    }

    onChangeCenter() {
        console.log("Center changed to " + this.state.map.getCenter());
        const center = this.state.map.getCenter();

        this.props.updateState("mapCenter", { lat: center.lat(), lng: center.lng() });
    }

    onChangeZoom() {
        console.log("Zoom changed to " + this.state.map.getZoom());
        this.props.updateState("mapZoom", this.state.map.getZoom());
    }


    updateMarkers() {
        const bounds = this.state.map.getBounds();
        let markers = [];
        this.state.data.forEach(point => {
            let loc = new window.google.maps.LatLng({ lat: parseFloat(point.latitude), lng: parseFloat(point.longitude) });
            if (bounds.contains(loc)) {
                markers.push(new window.google.maps.Marker({
                    map: this.state.map,
                    position: loc,
                    visible: true,
                }));
            }
        });
        new MarkerClusterer(this.state.map, markers, {
            imagePath: "https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m",
        });

    }
    updateMarkers = this.updateMarkers.bind(this);


    shouldComponentUpdate(newProps, newState) {
        if (newProps.center === this.props.center &&
            newProps.searchCenter === this.props.searchCenter &&
            newProps.zoom === this.props.zoom) return false;
        return true;
    }

    componentDidUpdate(oldProps, oldState) {
        if (this.props.searchCenter.lat !== oldProps.searchCenter.lat &&
            this.props.searchCenter.lng !== oldProps.searchCenter.lng) {
            this.state.map.setCenter(this.props.searchCenter);
            this.state.map.setZoom(15)
        }
    }

    render() {
        if (this.state.map) this.updateMarkers();        
        return (
            <div id="map-id" ref="map" />
        );

    }
}
export default MapContainer;