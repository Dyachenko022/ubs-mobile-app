import React from 'react'
import _ from 'lodash'

import {
  Platform,
  View,
  TouchableOpacity,
  TouchableNativeFeedback
} from 'react-native'

export default class Touchable extends React.Component {
  constructor (props){
    super(props);

    this.method = _.debounce(this.method, 450).bind(this);
  }
  method() { this.props.onPress() }
  render () {
    const TouchComponent = Platform.OS === 'ios' || this.props.opacity ? TouchableOpacity : TouchableNativeFeedback;
    return(
      <TouchComponent {...this.props} onPress={this.method}>
        {
          Platform.OS !== 'ios' ?
            <View style={this.props.style}>
              {this.props.children}
            </View>
            :
            this.props.children
        }
      </TouchComponent>
    )
  }
}
