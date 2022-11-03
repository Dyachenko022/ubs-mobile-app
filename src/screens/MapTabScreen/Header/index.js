import React from 'react';
import {connect} from 'react-redux';
import {
  Platform,
  View,
  Image
} from "react-native";
import Touchable from '../../../components/Touchable';
import Input from '../../../components/Inputs/IconInput';
import {TextRenderer as Text} from '../../../components/TextRenderer/index';
import BankTheme from '../../../utils/bankTheme';

import Icon from 'react-native-vector-icons/Ionicons';

import styles, {Screen} from "./styles";
import {RNNDrawer} from 'react-native-navigation-drawer-extension';


class Header extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.filter !== prevState.filter) {
      return {filter: nextProps.filter}
    }
    return null
  }

  constructor(props) {
    super(props);

    this.state = {
      filter: 0
    }
  }

  render() {
    const {filter, onFilterPress, onListPress} = this.props;

    let head = (
      <View
        style={[styles.header, {flex: 1, justifyContent: 'center'}, this.props.burger ? {} : {
          flex: -1,
          width: Screen.width - 80,
          justifyContent: 'space-between'
        }]}>
        <View style={{width: '70%'}}>
          <Text style={{fontSize: 20, color: '#fff', fontWeight: '600', marginLeft: 30, width: '100%', textAlign: 'center'}}>
            На карте
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', height: '100%', flex: 1, justifyContent: 'flex-end'}}>
          {filter &&
          <Touchable style={{height: '100%', justifyContent: 'center', marginRight: 5, paddingHorizontal: 10}}
                     onPress={onFilterPress}>
            <Icon name={'ios-funnel'} size={25} color={'#fff'}/>
          </Touchable>
          }

          <Touchable style={{height: '100%', justifyContent: 'center', paddingHorizontal: 10}} onPress={onListPress}>
            <Icon name={'ios-list'} size={35} color={'#fff'}/>
          </Touchable>
        </View>
      </View>
    )

    if (this.props.burger) {
      head = (
        <View style={[styles.header, {backgroundColor: 'transparent',}]}>
          {
            this.props.burger &&
            <Touchable
              opacity
              stye={[styles.button, {marginRight: 10}]} onPress={() => {
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
              <Icon name="ios-menu" size={33} color="#fff" style={styles.menu}/>
            </Touchable>
          }
          {/*<Input styles={styles.input} iconLeft={() => <Icon name={'ios-search'} size={15} color={'#999'} />} />*/}
          {
            this.props.burger ?

              <View style={{flex: 1, paddingLeft: 10}}>
                <Image source={{uri: BankTheme.images.loginPageLogo}}
                       style={styles.logo}
                />
              </View>
              :
              <View style={{width: '100%',}}>
                <Text style={{fontSize: 20, color: '#fff', fontWeight: '600', width: '100%', textAlign: 'center'}}>
                  На карте
                </Text>
              </View>
          }

          <View style={{flexDirection: 'row', alignItems: 'center', height: '100%'}}>
            {filter &&
            <Touchable style={{height: '100%', justifyContent: 'center', marginRight: 5, paddingHorizontal: 10}}
                       onPress={onFilterPress}>
              <Icon name={'ios-funnel'} size={25} color={'#fff'}/>
            </Touchable>
            }

            <Touchable style={{height: '100%', justifyContent: 'center', paddingHorizontal: 10}} onPress={onListPress}>
              <Icon name={'ios-list'} size={35} color={'#fff'}/>
            </Touchable>
          </View>
        </View>
      )
    }

    return head;
  }
}

Header.defaultProps = {
  burger: true
}

function mapStateToProps(state) {
  return {
    filter: state.mapPage.filterTypes.length
  };
}

export default connect(mapStateToProps)(Header);
