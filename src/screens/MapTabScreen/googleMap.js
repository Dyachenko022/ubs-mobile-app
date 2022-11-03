import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import styles from './styles';
import BankTheme from '../../utils/bankTheme';

const iconT1 = BankTheme.images.mapPage.mapIconType1;
const iconT2 = BankTheme.images.mapPage.mapIconType2;
const iconT3 = BankTheme.images.mapPage.mapIconType3;

export default class GoogleMap extends React.Component {

  state ={
    latitude: BankTheme.defaultMapLocation.latitude,
    longitude: BankTheme.defaultMapLocation.longitude,
  }

  map = null;

  fitToSuppliedMarkers = (location) => {
    this.map.fitToSuppliedMarkers(location, false);
  }

  renderMarker = (marker, idx) => {
    const latitude = parseFloat(marker.location.split(',')[0]);
    const longitude = parseFloat(marker.location.split(',')[1]);
    let icon = iconT1;
    switch (marker.type) {
      case '2':
        icon = iconT2;
        break;
      case '3':
        icon = iconT3;
        break;
      default:
        break;
    }
    return (
      <MapPin
        marker={marker}
        key={idx}
        location={marker.location}
        latitude={latitude}
        longitude={longitude}
        onPress={() => this.props.onMarkerPress(marker.id)}
        isActive={this.state.activePoint === marker.id}
        icon={icon}
      />
    )
  }

  render() {
    return (
      <MapView
        ref={ref => this.map = ref}
        style={styles.map}
        showsUserLocation
        onMarkerPress={() => null}
        onPress={this.props.onMapPress}

        initialRegion={{
          latitude: this.state.latitude,//55.661112,
          longitude: this.state.longitude,//37.626922,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}

        onLayout={() => {
          Geolocation.getCurrentPosition(
            (position) => {
              this.map && this.map.animateToRegion({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              })
            },
            () => {},
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
          );
        }}
      >
        {
          this.props.markers.map((el, idx) => {
            return this.renderMarker(el, idx);
          })
        }
      </MapView>
    );
  }
}

GoogleMap.propTypes = {
  markers: PropTypes.array,
  onMarkerPress: PropTypes.func,
  onMapPress: PropTypes.func,
}

GoogleMap.defaultProps = {
  markers: [],
}

class MapPin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: .5,
      initialRender: true
    }
  }

  render() {
    return (
      <MapView.Marker
        identifier={this.props.location}
        coordinate={{
          latitude: this.props.latitude,
          longitude: this.props.longitude,
        }}
        onPress={this.props.onPress}
      >
        <View style={{ width: 54, height: 54 }}>
          <Image
            style={{ width: 50, height: 50 }}
            source={{ uri: this.props.marker.logo }}
            key={`${this.state.initialRender}`}
          />
        </View>
      </MapView.Marker>
    )
  }
}

module.exports = GoogleMap;