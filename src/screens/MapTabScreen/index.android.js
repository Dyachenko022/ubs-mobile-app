import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import HTML from 'react-native-render-html';
import {MapPage} from '../../api/actionTypes';
import Icon from 'react-native-vector-icons/Ionicons'
import {
  Dimensions,
  Text,
  Image,
  View,
  Animated,
  ScrollView,
  TouchableWithoutFeedback, BackHandler, Platform
} from 'react-native';
import Interactable from 'react-native-interactable';
import styles from './styles';
import {getMapPoints} from '../../api/actions'
import Header from "./Header";
import Touchable from "../../components/Touchable";
import {Navigation} from 'react-native-navigation';
import BankTheme from '../../utils/bankTheme';
import androidBeforeExit from '../../utils/androidBeforeExit';
import {showModal} from '../../utils/navigationUtils';
import DeviceInfo from 'react-native-device-info';

const iconT1 = BankTheme.images.mapPage.mapIconType1;
const iconT2 = BankTheme.images.mapPage.mapIconType2;
const iconT3 = BankTheme.images.mapPage.mapIconType3;

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
};

const MapComponent = require('./googleMap');


class MapTabScreen extends React.Component {

  static options = (props) => ({
    bottomTabs: {
      visible: !props.hideBottomTabs,
    }
  });

  getContainerHeight = (height) => {
    this.setState({
      containerHeight: height
    });
  };

  map = null;

  constructor(props) {
    super(props);
    this._deltaY = new Animated.Value(Screen.height);
    this._deltaX = new Animated.Value(0);
    this.markers = {};
    this.state = {
      types: [],
      selectedTypes: ['1', '2', '3'],
      containerHeight: 0,
      activePoint: null,
      activeBottomPanel: null,
    };
    this.selectType = this.selectType.bind(this);
    this.deleteType = this.deleteType.bind(this);
    this.filterInnerRenderer = this.filterInnerRenderer.bind(this);
    this.updateTypes = this.updateTypes.bind(this);
    this._onPressMarker = this._onPressMarker.bind(this);
    this.onFilterPress = this.onFilterPress.bind(this);
    this._onListPress = this._onListPress.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getMapPoints());
    this.updateTypes();
    this.navigationEvents = Navigation.events().bindComponent(this);
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
  }

  componentDidAppear() {
    this.androidBackButtonListener = BackHandler.addEventListener('hardwareBackPress', this.androidBackButtonPress);
  }

  componentDidDisappear() {
    this.androidBackButtonListener?.remove();
  }

  androidBackButtonPress = () => {
    androidBeforeExit();
    return true; // Это нужно, чтобы у Андроида не работала кнопка Назад
  }


  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.markers, this.props.markers)) {
      this.updateTypes();
    }
  }

  updateTypes() {
    const types = ['1', '2'];
    this.setState(() => ({types}), () => {
      this.props.dispatch({type: MapPage.SET_FILTER_TYPES, filterTypes: types})
    })
  }

  render() {

    const markers = this.props.markers.filter((marker) => {
      return this.state.selectedTypes.includes(marker.type);
    })

    const snapPoints = this.state.activeBottomPanel === 'info'
      ? [{y: 40}, {y: Screen.height - 300}, {y: Screen.height - 125}, {y: Screen.height}]
      : [{y: Screen.height}, {y: Screen.height - 300}, {y: Screen.height}, {y: Screen.height}];
    return (
      <View style={styles.container}>
        <View style={{width: '100%', height: '100%'}}>
          <MapComponent
            ref={(ref) => this.map = ref}
            markers={markers}
            onMarkerPress={this._onPressMarker}
            onMapPress={() => {
              this.infoPanel && this.infoPanel.snapTo({index: 3});
              setTimeout(() => this.setState({
                  activePoint: null,
                  activeBottomPanel: null
                }),
                250);
            }}
          />
        </View>


        <View style={[styles.panelContainer]} pointerEvents={'box-none'}>
          {
            !this.state.activeBottomPanel || this.state.activeBottomPanel === 'info' ?
              null
              :
              <TouchableWithoutFeedback
                onPressIn={() => {
                  this.setState(() => ({activeBottomPanel: null}), () => {
                    this.infoPanel.snapTo({index: 3})
                  })
                }}
              >
                <Animated.View
                  style={[styles.panelContainer, {
                    backgroundColor: 'black',
                    opacity: this._deltaY.interpolate({
                      inputRange: [0, Screen.height - 100],
                      outputRange: [0.5, 0],
                      extrapolateRight: 'clamp'
                    })
                  }]}/>
              </TouchableWithoutFeedback>
          }
          <Interactable.View
            ref={ref => this.infoPanel = ref}
            verticalOnly={true}
            snapPoints={snapPoints}
            boundaries={{top: -300}}
            initialPosition={{y: Screen.height}}
            animatedValueY={this._deltaY}
            animatedValueX={this._deltaX}
          >
            {
              this.state.activeBottomPanel === 'info' ?
                this.infoInnerRenderer()
                :
                this.filterInnerRenderer()
            }
          </Interactable.View>
        </View>
      </View>
    )
  }

  infoInnerRenderer = () => {
    const markerInfo = this.props.markers.find(el => el.id === this.state.activePoint);
    const {type} = markerInfo;
    const addres = (
      <View style={styles.infoBlock}>
        <View style={{height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc"}}/>
        <Text style={styles.infoTitle}>Адрес</Text>
        <Text style={styles.infoText}>{markerInfo.address}</Text>
      </View>
    );

    const time = (
      <View style={styles.infoBlock}>
        <View style={{height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc"}}/>
        <Text style={styles.infoTitle}>Время работы</Text>
        <HTML
          containerStyle={styles.infoText}
          html={markerInfo.working}
        />
      </View>
    );

    const boss = (
      <View style={styles.infoBlock}>
        <View style={{height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc"}}/>
        <Text style={styles.infoTitle}>Руководитель</Text>
        <Text style={styles.infoText}>{markerInfo.director}</Text>
      </View>
    );

    const services = (
      <View style={styles.infoBlock}>
        <View style={{height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc"}}/>
        <Text style={styles.infoTitle}>Услуги</Text>
        <Text style={styles.infoText}>{markerInfo.services}</Text>
      </View>
    );

    const phone = (
      <View style={[styles.infoBlock]}>
        <View style={{height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc"}}/>
        <Image sourse={{uri: markerInfo.logo}}
               style={{margin: 10, marginRight: 0, width: 40, height: 40, borderRadius: 20}}/>
        <Text style={{marginLeft: 15}}>{markerInfo.phone}</Text>
      </View>
    );


    const currencyIn = (
      <View style={styles.infoBlock}>
        <View style={{height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc"}}/>
        <Text style={styles.infoTitle}>Принимаемая валюта</Text>
        <Text style={styles.infoText}>{markerInfo.currencyIn}</Text>
      </View>
    );
    const currencyOut = (
      <View style={styles.infoBlock}>
        <View style={{height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc"}}/>
        <Text style={styles.infoTitle}>Выдаваемая валюта</Text>
        <Text style={styles.infoText}>{markerInfo.currencyOut}</Text>
      </View>
    );
    const cards = (
      <View style={styles.infoBlock}>
        <View style={{height: 1, width: Screen.width + 50, marginLeft: -50, backgroundColor: "#ccc"}}/>
        <Text style={styles.infoTitle}>Карты</Text>
        <Text style={styles.infoText}>{markerInfo.cards}</Text>
      </View>
    );


    return (
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle}/>
        </View>

        <Text style={styles.panelTitle}>{markerInfo.name}</Text>
        {/*<Text style={styles.panelSubtitle}>{type}</Text>*/}
        <ScrollView style={styles.info}>
          {addres}
          {time}
          {(type === '2' || type === '3') && boss}
          {(type === '2' || type === '3') && services}

          {(type === '1' || type === '3') && [currencyIn, currencyOut, cards]}

          {phone}
        </ScrollView>
      </View>
    )
  }

  filterInnerRenderer() {
    return (
      <View style={styles.panel}>
        {
          this.state.types.map((type, index) => {
            return (
              <Touchable
                key={index}
                onPress={() => {
                  if (this.state.selectedTypes.indexOf(type) !== -1) {
                    this.deleteType(type)
                  } else {
                    this.selectType(type)
                  }
                }}
                style={[styles.filterItem, {marginBottom: 10}]}
              >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Image style={{width: 30, height: 30}}
                           source={{uri: type === '1' ? iconT1 : type === '2' ? iconT2 : iconT3}}/>
                  </View>
                  <Text style={{marginLeft: 10}}>
                    {type === '1' ? 'Банкомат' : 'Отделение'}
                  </Text>
                </View>

                {this.state.selectedTypes.indexOf(type) !== -1 && <Icon name={'md-checkmark'} size={25}/>}
              </Touchable>
            )
          })
        }
      </View>
    )
  }

  selectType(type) {
    this.setState((prevState) => ({selectedTypes: [...prevState.selectedTypes, type]}))
  }

  deleteType(type) {
    let types = [...this.state.selectedTypes];
    types.splice(types.indexOf(type), 1);
    this.setState(() => ({selectedTypes: types}))
  }

  _onListPress() {
    showModal({
      screenName: 'unisab/MapListModal',
      title: 'Список',
      passProps: {
        onPressItem: (el, idx) => {
          this.map.fitToSuppliedMarkers([el.location], false);
          this._onPressMarker(idx);
        }
      }
    });
  }

  _onPressMarker = (idx) => {
    this.setState(() => ({activeBottomPanel: 'info', activePoint: idx}), () => {
      setTimeout(() => this.infoPanel.snapTo({index: 2}), 300);
    })
  }

  onFilterPress() {
    this.setState(() => ({activeBottomPanel: 'filter'}), () => {
      this.infoPanel.snapTo({index: 1})
    })
  }
}

function mapStateToProps(state) {
  return {
    markers: state.mapPage.points || []
  };
}

export default connect(mapStateToProps)(MapTabScreen);
