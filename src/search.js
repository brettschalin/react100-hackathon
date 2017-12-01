import React, { Component } from 'react';
import axios from 'axios';

class Search extends Component {


    onButtonClick() {
        const text = document.getElementById("search-text").value;
        if (!text) return;
        axios.get("https://maps.googleapis.com/maps/api/geocode/json", {params: {
            address: text,
            key: "AIzaSyAWmlnt3k64819WfwE66ZcNrsTr-XGRzDg",
        }}).then((response) => {
            //welcome to object nesting hell
            const loc = response.data.results[0].geometry.location;
            this.props.updateState("searchCenter",loc);    
        }).catch((err) => {
            console.log("Google Geocoding encountered an error: " + err);
        })
        this.props.updateState("searchText",text);
    }

    render() {
        return (
            <div className="search-box">
                <p id="search-label">Enter a location or scroll the map</p>
                <input type="text" id="search-text" placeholder="Enter e.g., 'Riverside, CA'"/>
                <button id="search-button" className="btn" onClick={this.onButtonClick.bind(this)}>Search</button>
            </div>
        )
    }


}


export default Search;