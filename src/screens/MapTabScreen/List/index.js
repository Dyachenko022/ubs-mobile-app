import React from 'react';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import {Platform, Image, ImageBackground, View, ScrollView, TextInput, Button} from 'react-native';
import TouchableOpacity from '../../../components/Touchable';
import { makeLeftBackButton } from '../../../utils/navigationUtils';
import HTML from 'react-native-render-html';
import {TextRenderer as Text} from '../../../components/TextRenderer';
import styles from './styles';

export class CloseModalButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => Navigation.dismissAllModals()}
      >
        {this.props.button}
      </TouchableOpacity>
    )
  }
}

class MapListModal extends React.Component {

  static options = (props) => ({
    topBar: {
      modalPresentationStyle: 'fullScreen',
      leftButtons: [
        makeLeftBackButton('mapListButtonBack')
      ],
    }
  });

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this.navigationEventListener?.remove();
  }

  navigationButtonPressed({ buttonId }) {
    Navigation.dismissModal(this.props.componentId);
  }

  render() {
    return (
      <View style={styles.background}>

        <ScrollView>
          {
            this.props.points.map((el, idx) => (
              <View key={el.location}>
                <TouchableOpacity style={styles.row} onPress={() => {
                  Navigation.dismissAllModals();
                  this.props.onPressItem(el, el.id)
                }}>

                  {
                    el.logo !== null ?
                      !!el.logo && <Image source={{uri: el.logo}} style={styles.img}/>
                      :
                      <View style={styles.img}/>
                  }

                  <View style={styles.info}>
                    <Text style={styles.address}>{el.address}</Text>
                    <HTML
                      containerStyle={{backgroundColor: 'transparent'}}
                      html={el.working}
                    />
                    <Text style={styles.services}>{el.services}</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.bottomLine}/>
              </View>
            ))
          }
        </ScrollView>

      </View>
    )
  }
}


// which props do we want to inject, given the global state?
function mapStateToProps(state) {
  return {
    points: state.mapPage.points
  };
}

export default connect(mapStateToProps)(MapListModal);
