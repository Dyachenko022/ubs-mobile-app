import React from 'react';
import PropTypes from 'prop-types';
import Swipeable from 'react-native-swipeable';

export default class SwipeOut extends React.Component {
  render(){
    return(
      <Swipeable
        onSwipeStart={this.props.onSwipeStart}
        rightButtonWidth={this.props.buttonsWidth}
        rightButtons={this.props.rightButtons}
        onRef={(ref) => this.props.onRef && this.props.onRef(ref)}
      >
        {this.props.children}
      </Swipeable>
    )
  }
}

SwipeOut.propTypes = {
  buttonsWidth: PropTypes.number,
}

SwipeOut.defaultProps = {
  buttonsWidth: 80,
}
