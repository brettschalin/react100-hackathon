import React, { Component } from 'react';
import MapContainer from './mapcontainer';
import Search from './search';

class App extends Component {

    constructor() {
        super();
        this.state = {
            mapCenter: {
                //Riverside, CA
                lat: 33.95335,
                lng: -117.39616
            },  //lat lng pair (in center)
            mapZoom: 10,
            searchText: "", //where on the map to search for
            searchCenter: {},
        };
    }

    updateState(property, newValue) {
        const newObj = {};
        newObj[property] = newValue;
        this.setState(newObj);
    }


    render() {
        return (
            <div>

                <h1 id="title">React100 Hackathon: Crime Map Edition</h1>
                <div id="description">
                <p>This map is a visualization of select police deparment's crime data.</p>
                <p>Currently supported locations are the cities of Union City, San Leandro, and Salinas,
                    and the counties of Santa Clara and Riverside (all in California).</p>
                <p id="note"> Note: This data is current, but starts anywhere between 2008 and March 2017, depending on the area</p>
                </div>
                <Search updateState={this.updateState.bind(this)} />
                <br />

                <MapContainer center={this.state.mapCenter}
                    zoom={this.state.mapZoom}
                    searchCenter={this.state.searchCenter}
                    updateState={this.updateState.bind(this)} />
                <br />
            </div>
        )
    }

}

export default App;