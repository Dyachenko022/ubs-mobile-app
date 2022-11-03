import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import HTML from 'react-native-render-html';
import { MapPage } from '../../api/actionTypes';
import YandexMap from './YandexMap';
import Icon from 'react-native-vector-icons/Ionicons'
import {
  Dimensions,
  Text,
  Image,
  View,
  Animated,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import Interactable from 'react-native-interactable';
import styles from './styles';
import { getMapPoints } from '../../api/actions'
import Header from "./Header";
import Touchable from "../../components/Touchable";
import Geolocation from '@react-native-community/geolocation';
import {Navigation} from 'react-native-navigation';
import BankTheme from '../../utils/bankTheme';

const iconT1 = BankTheme.images.mapPage.mapIconType1;
const iconT2 = BankTheme.images.mapPage.mapIconType2;
const iconT3 = BankTheme.images.mapPage.mapIconType3;

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
};

class MapTabScreen extends React.Component {

  static options = (props) => ({
      bottomTabs: {
        visible: props.hideBottomTabs ? false : true,
      }
    }
  );

  constructor(props) {
    super(props);
    this.state = {
      types: [],
      selectedTypes: ['1', '2'],
      mapPoints: [],
      containerHeight: 0,
      activePoint: '',
      activeBottomPanel: null,
      latitude: BankTheme.defaultMapLocation.latitude,
      longitude: BankTheme.defaultMapLocation.longitude,
    };
    this._deltaY = new Animated.Value(Screen.height);
    this._deltaX = new Animated.Value(0);
    this._onListPress = this._onListPress.bind(this);
    this.infoInnerRenderer = this.infoInnerRenderer.bind(this);
    this.filterInnerRenderer = this.filterInnerRenderer.bind(this);
    this.updateTypes = this.updateTypes.bind(this);
    this._onPressMarker = this._onPressMarker.bind(this);
    this.onFilterPress = this.onFilterPress.bind(this);
    this.selectType = this.selectType.bind(this);
    this.deleteType = this.deleteType.bind(this);
  }

  componentDidMount() {
   Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => { },
      // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
   );

   Navigation.mergeOptions(this.props.componentId, {
     topBar: {
         title: {
           component: {
             name: 'unisab/CustomTopBar',
             alignment: 'fill',
             passProps: {
               innerComponent:
                 <Header
                   burger={!this.props.hideBottomTabs}
                   ref={ref => this.header = ref}
                   onFilterPress={this.onFilterPress}
                   onListPress={this._onListPress}
                   parentComponentId={this.props.parentComponentId}
                   onInputPress={() => {}}
                 />
             }
           }
         }
       }
   });

    this.props.dispatch(getMapPoints());
    this.updateTypes()
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.markers && nextProps.markers.length !== 0) {
      const mapPoints = [];
      nextProps.markers.map((marker) => {
        const latitude = parseFloat(marker.location.split(',')[0]);
        const longitude = parseFloat(marker.location.split(',')[1]);
        mapPoints.push({
          type: marker.type,
          uId: marker.id,
          coordinates: [latitude, longitude],
          iconLayout: 'default#image',
          iconImageSize: [50, 50],
          iconImageHref: marker.logo,
          geometry: {
            coordinates: [latitude, longitude],
            type: "Point",
          },
        })
      });
      return { mapPoints }
    }
    return null
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.markers, this.props.markers)) {
      this.updateTypes();
      this.map && this.map.placeMarkers()
    }
  }

  updateTypes() {
    const types = ['1', '2'];
    this.setState(() => ({ types }), () => {
      this.props.dispatch({ type: MapPage.SET_FILTER_TYPES, filterTypes: types })
    })
  }

  render() {
    const pointsFilter = (pin) => {
      const result = this.state.selectedTypes.indexOf(pin.type) !== -1 || pin.type === '3'
      return result
    }
    let points = this.state.mapPoints.filter(pointsFilter);
    const snapPoints = this.state.activeBottomPanel === 'info'
      ? [{ y: 40 }, { y: Screen.height - 300 }, { y: Screen.height - 125 }, { y: Screen.height }, { y: Screen.height + 100 }]
      : [{ y: Screen.height }, { y: Screen.height - 300 }, { y: Screen.height }, { y: Screen.height }];
    return (
      <View style={styles.container}>
        <YandexMap
          ref={ref => this.map = ref}
          markers={points}
          onMarkerPress={(idx) => this._onPressMarker(idx)}
          initialCoordinates={{ latitude: this.state.latitude, longitude: this.state.longitude }}
        />
        <View style={[styles.panelContainer]} pointerEvents={'box-none'}>
          <TouchableWithoutFeedback
            onPressIn={() => {
              this.setState(() => ({ activeBottomPanel: null }), () => {
                this.infoPanel.snapTo({ index: 3 })
              })
            }}
          >
            <Animated.View
              style={[styles.panelContainer, {
                display: !this.state.activeBottomPanel || this.state.activeBottomPanel === 'info' ? 'none' : 'flex',
                backgroundColor: 'black',
                opacity: this._deltaY.interpolate({
                  inputRange: [0, Screen.height - 100],
                  outputRange: [0.5, 0],
                  extrapolateRight: 'clamp'
                })
              }]} />
          </TouchableWithoutFeedback>
          <Interactable.View
            ref={ref => this.infoPanel = ref}
            verticalOnly={true}
            snapPoints={snapPoints}
            initialPosition={{ y: Screen.height, x:0, }}
            animatedValueY={this._deltaY}
            animatedValueX={this._deltaX}
          >
            {this.state.activeBottomPanel === 'info' ? this.infoInnerRenderer() : this.filterInnerRenderer()}
          </Interactable.View>
        </View>
      </View>
    )
  }

  infoInnerRenderer() {
    const markerInfo = this.props.markers.find(el => el.id === this.state.activePoint);
    if (!markerInfo) return null;
    const { type } = markerInfo;

    const addres = (
      <View style={styles.infoBlock}>
        <View style={{ height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc" }} />
        <Text style={styles.infoTitle}>Адрес</Text>
        <Text style={styles.infoText}>{markerInfo.address}</Text>
      </View>
    );

    const time = (
      <View style={styles.infoBlock}>
        <View style={{ height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc" }} />
        <Text style={styles.infoTitle}>Время работы</Text>
        <HTML
          containerStyle={styles.infoText}
          html={markerInfo.working}
        />
        {/*<Text >{markerInfo.working}</Text>*/}
      </View>
    );

    const boss = (
      <View style={styles.infoBlock}>
        <View style={{ height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc" }} />
        <Text style={styles.infoTitle}>Руководитель</Text>
        <Text style={styles.infoText}>{markerInfo.director}</Text>
      </View>
    );

    const services = (
      <View style={styles.infoBlock}>
        <View style={{ height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc" }} />
        <Text style={styles.infoTitle}>Услуги</Text>
        <Text style={styles.infoText}>{markerInfo.services}</Text>
      </View>
    );

    const phone = (
      <View style={[styles.infoBlock]}>
        <View style={{ height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc" }} />
        <Image sourse={{ uri: markerInfo.logo }} style={{ margin: 10, marginRight: 0, width: 40, height: 40, borderRadius: 20 }} />
        <Text style={{ marginLeft: 15 }}>{markerInfo.phone}</Text>
      </View>
    );


    const currencyIn = (
      <View style={styles.infoBlock}>
        <View style={{ height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc" }} />
        <Text style={styles.infoTitle}>Принимаемая валюта</Text>
        <Text style={styles.infoText}>{markerInfo.currencyIn}</Text>
      </View>
    );
    const currencyOut = (
      <View style={styles.infoBlock}>
        <View style={{ height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc" }} />
        <Text style={styles.infoTitle}>Выдаваемая валюта</Text>
        <Text style={styles.infoText}>{markerInfo.currencyOut}</Text>
      </View>
    );
    const cards = (
      <View style={styles.infoBlock}>
        <View style={{ height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc" }} />
        <Text style={styles.infoTitle}>Карты</Text>
        <Text style={styles.infoText}>{markerInfo.cards}</Text>
      </View>
    );

    return (
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle} />
        </View>
        <Text style={styles.panelTitle}>{markerInfo.name}</Text>
        <ScrollView style={styles.info}>
          <View>
            {addres}
            {time}
            {(type === '2' || type === '3') && boss}
            {services}
            {(type === '1' || type === '3') && [currencyIn, currencyOut, cards]}
            {phone}
          </View>
        </ScrollView>
      </View>
    )
  }

  filterInnerRenderer() {
    return (
      <View style={styles.panel}>
        {
          this.state.types.map(type => {
            return (
              <Touchable
                key={type}
                onPress={() => {
                  if (this.state.selectedTypes.indexOf(type) !== -1) {
                    this.deleteType(type)
                  } else {
                    this.selectType(type)
                  }
                }}
                style={[styles.filterItem, { marginBottom: 10 }]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ width: 30, height: 30 }} source={{uri: type === '1' ? iconT1 : type === '2' ? iconT2 : iconT3}} />
                  </View>
                  <Text style={{ marginLeft: 10 }}>
                    {type === '1' ? 'Банкомат' : 'Отделение'}
                  </Text>
                </View>

                {this.state.selectedTypes.indexOf(type) !== -1 && <Icon name={'md-checkmark'} size={25} />}
              </Touchable>
            )
          })
        }
      </View>
    )
  }

  selectType(type) {
    this.setState((prevState) => ({ selectedTypes: [...prevState.selectedTypes, type] }), this.map.placeMarkers)
  }

  deleteType(type) {
    let types = [...this.state.selectedTypes];
    types.splice(types.indexOf(type), 1);
    this.setState(() => ({ selectedTypes: types }), this.map.placeMarkers)
  }

  _onListPress() {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'unisab/MapListModal',
            passProps: {
              onPressItem: (el, idx) => {
                this.map.fitToSuppliedMarkers([el.location], false);
                this._onPressMarker(idx);
              }
            },
            options: {
              topBar: {
                title: {
                  text: 'Список',
                  color: 'white',
                }
              }
            }
          },
        }]
      }
    }
   );
  }

  getContainerHeight = (height) => {
    this.setState({
      containerHeight: height
    });
  };

  _onPressMarker(idx) {
    this.setState(() => ({ activeBottomPanel: 'info', activePoint: idx }), () => {
      this.infoPanel && this.infoPanel.snapTo({ index: 2 })
    })
  }

  onFilterPress() {
    this.setState(() => ({ activeBottomPanel: 'filter' }), () => {
      this.infoPanel.snapTo({ index: 1 })
    })
  }
}

function mapStateToProps(state) {
  return {
    markers: state.mapPage.points
  };
}

export default connect(mapStateToProps)(MapTabScreen);
