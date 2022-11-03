import {connect} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types'
import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Alert,
  Platform,
  Image
} from 'react-native';


import BadgeMenu from '../../components/BadgeMenu';
import { RNNDrawer } from "react-native-navigation-drawer-extension";
import BankTheme from '../../utils/bankTheme';

const Screen = {width, height} = Dimensions.get('window');

class CustomTopBar extends React.Component {
  constructor(props) {
    super(props);
    this._innerRenderer = this._innerRenderer.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        {this._innerRenderer()}
      </View>
    );
  }

  _innerRenderer() {
    if (this.props.innerComponent) {
      return this.props.innerComponent
    }

    let header = (
      <View key={1} style={[styles.wrapper, {borderWidth: 1, borderColor: 'transparent'}]}>
        {this.props.badgeMenu &&
          <TouchableOpacity stye={styles.button} onPress={() => {
            RNNDrawer.showDrawer({
              component: {
                name: 'unisab/Drawer/Login',
                passProps: {
                  animationOpenTime: 300,
                  animationCloseTime: 300,
                  direction: "left",
                  dismissWhenTouchOutside: true,
                  fadeOpacity: 0.6,
                  drawerScreenWidth: 300,
                  drawerScreenHeight: "100%" || 700,
                  parentComponentId: this.props.componentId,
                }
              }
            });
          }}>
            <Image source={require('../../../img/menu.png')} style={styles.menu}/>
          </TouchableOpacity>
        }

        <Image source={{uri: BankTheme.images.loginPageLogo}}
               style={styles.logo}
        />
      </View>
    );

    if (this.props.loginPage) {
      header = (
        <View key={1} style={[styles.wrapper, {borderWidth: 1, borderColor: 'transparent'}]}>
          {
            this.props.leftButton !== 'native' &&

            <TouchableOpacity stye={styles.button} onPress={() => {
              RNNDrawer.showDrawer({
                component: {
                  name: 'unisab/Drawer/Login',
                  passProps: {
                    animationOpenTime: 300,
                    animationCloseTime: 300,
                    direction: "left",
                    dismissWhenTouchOutside: true,
                    fadeOpacity: 0.6,
                    drawerScreenWidth: 300,
                    drawerScreenHeight: "100%" || 700,
                    parentComponentId: this.props.componentId,
                  }
                }
              });
            }}>
              <Image source={require('../../../img/menu.png')} style={styles.menu}/>
            </TouchableOpacity>
          }

          {this.props.title && (
            <View style={{marginLeft: 0, alignItems: 'center'}}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{this.props.title}</Text>
            </View>
          )}

          <Image source={{uri: BankTheme.images.loginPageLogo}}
                 style={styles.logo}
          />
        </View>
      )
    } else if (this.props.badgeMenu) {
      header = (
        <View key={1} style={[styles.wrapper, { borderWidth: 1, borderColor: 'transparent'}]}>
          {this.props.burger && <BadgeMenu parentComponentId={this.props.parentComponentId}/>}

          {this.props.title && (
            <View style={{marginLeft: 0, alignItems: 'center', flex: Platform.OS === 'ios' ? 1 : -1, paddingRight: 50}}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{this.props.title}</Text>
            </View>
          )}
        </View>
      )
    }

    return (
      <View style={{flexDirection: 'row', paddingLeft: 5, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent'}}>
        {header}

        <View style={{paddingTop: 5}}>
          {
            this.props.loginPage ?
              this.props.credentials && this.props.rightIcon
              :
              this.props.rightIcon && this.props.rightIcon
          }

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    paddingRight: Platform.OS === 'ios' ? 0 : 8,
    width: Screen.width - 16,
    backgroundColor: 'transparent',
    height: 44,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  wrapper: {
    flex: Platform.OS === 'ios' ? 1 : -1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',

    // borderWidth: 1,
    height: 44//'100%'
  },

  menu: {
    marginTop: 5
  },
  logo: {
    // resizeMode: 'contain',
    width: 155,
    height: 30,

    marginLeft: 10
  },
  button: {
    alignSelf: 'center',
    backgroundColor: 'green'
  },
  text: {
    alignSelf: 'center',
    color: Platform.OS === 'ios' ? 'black' : 'white'
  }
});

CustomTopBar.defaultProps = {
  badgeMenu: true,
  burger: true
}

function mapStateToProps(state) {
  return {
    credentials: state.login.credentials
  };
}

export default connect(mapStateToProps)(CustomTopBar);
