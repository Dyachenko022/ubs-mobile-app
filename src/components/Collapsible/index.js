import React from 'react';
import PropTypes from 'prop-types';
import {LayoutAnimation, Platform, UIManager, View} from 'react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default class Collapsible extends React.Component {

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevProps.collapsed !== this.props.collapsed) {
      LayoutAnimation.configureNext({...LayoutAnimation.Presets.easeInEaseOut, duration: 300});
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Иначе варнинг, что с getSnapshotBeforeUpdate должен быть componentDidUpdate
  }

  render() {
    if (this.props.collapsed) return null;
    return (
      <View>
        {this.props.children}
      </View>
    );
  }
}

Collapsible.propTypes = {
  collapsed: PropTypes.bool,
}

