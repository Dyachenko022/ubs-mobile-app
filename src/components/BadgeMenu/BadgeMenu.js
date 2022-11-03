import React, {Component} from 'react';

import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import {RNNDrawer} from 'react-native-navigation-drawer-extension';

export default class BadgeMenu extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          RNNDrawer.showDrawer({
            component: {
              name: 'unisab/Drawer/MyBank',
              passProps: {
                animationOpenTime: 300,
                animationCloseTime: 300,
                direction: "left",
                dismissWhenTouchOutside: true,
                fadeOpacity: 0.6,
                drawerScreenWidth: 300,
                drawerScreenHeight: "100%" || 700,
                parentComponentId: this.props.parentComponentId,
              }
            }
          });
        }}
        style={{width: 50, height: 30, justifyContent: 'center'}}
      >
        <View>
          {
            this.props.unreadMessagesCount > 0 && this.props.showBadgeUnreadMessages && (<View style={{
              position: 'absolute',
              backgroundColor: '#e62a0c',
              borderRadius: 9,
              zIndex: 2,
              top: 0,
              right: 15,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
              minWidth: 18,
              minHeight: 18,
              flex: 1,
            }}>
              <Text style={{fontSize: 12, color: '#fff'}}>{this.props.unreadMessagesCount}</Text>
            </View>)
          }
          <Image source={require('../../../img/menu.png')}/>
        </View>
      </TouchableOpacity>
    );
  }
}