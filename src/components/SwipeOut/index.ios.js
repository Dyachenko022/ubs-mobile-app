import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Interactable from 'react-native-interactable';

const Screen = Dimensions.get('window');

export default class SwipeOut extends Component {
  static defaultProps = {
    damping: 1 - 0.7,
    tension: 300,
    buttonsWidth: 80,
  };

  interactable = React.createRef();

  constructor(props) {
    super(props);
    this._deltaX = new Animated.Value(0);
    this._deltaY = new Animated.Value(0);
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.id = this.props.onRef(this);
    }
  }

  recenter() {
    if (this.interactable.current) {
      this.interactable.current.snapTo({ x: 0 });
    }
  }

  handleDrag = () => {
    setTimeout(() => {
      if (this.props.onSwipeStart) {
        this.props.onSwipeStart(this.id);
      }
    }, 50);

  };

  renderButton(btn, index) {
    const { rightButtons } = this.props;
    const maxDrag = rightButtons.length * this.props.buttonsWidth;
    return (
      <Animated.View style={
        [styles.trashHolder, {
          transform: [{
            translateX: this._deltaX.interpolate({
              inputRange: [-maxDrag, 0],
              outputRange: [0, maxDrag]
            })
          }]
        }
        ]}>
        <View style={[styles.button, {alignItems: 'center'}]}>
          {btn}
        </View>
      </Animated.View>
    );
  }

  render() {
    let rightButtons = this.props.rightButtons || [];
    const maxDrag = rightButtons.length * this.props.buttonsWidth ;
    return (
      <View style={{backgroundColor: '#ceced2'}}>
        <View style={{position: 'absolute', height: '100%', left: 0, right: 0, justifyContent: 'flex-end', flexDirection: 'row' }} pointerEvents='box-none'>
          {rightButtons.map((btn, index) => this.renderButton(btn, index))}
        </View>
        <Interactable.View
          animatedNativeDriver
          ref={this.interactable}
          horizontalOnly={true}
          friction={0.7}
          dragWithSpring={{tension: 2000, damping: 0.5}}
          frictionAreas={[{damping: 0, influenceArea: {left: Screen.width}}]}
          snapPoints={[
            {x: 0, damping: 1 - this.props.damping, tension: this.props.tension},
            {x: -maxDrag, damping: 1 - this.props.damping, tension: this.props.tension}
          ]}
          boundaries={{left: -maxDrag, right: 0, bounce: 0.5}}
          onDrag={this.handleDrag}
          animatedValueX={this._deltaX}
          animatedValueY={this._deltaY}
        >
          <View style={{left: 0, right: 0, backgroundColor: 'white'}}>
            {this.props.children}
          </View>
        </Interactable.View>

      </View>
    );
  }

  onButtonPress(name) {
    alert(`Button ${name} pressed`);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  trashHolder: {
    height: '100%',
    justifyContent: 'center'
  },
});
