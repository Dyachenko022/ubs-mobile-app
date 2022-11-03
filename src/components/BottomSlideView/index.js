import React from 'react';
import {
  View,
  Animated
} from 'react-native';
import CustomStyleSheet from "../../resources/customStyleSheet";

const HEIGHT = 65;

export default class CardInput extends React.Component {
  static defaultProps = {
    data: [],
    renderItem: () => {},
    onSnapToItem: () => {},
    refCarousel: () => {},

    isShown: false
  };

  constructor(props) {
    super(props);

    this.state = {
      marginBottom: new Animated.Value(-HEIGHT * 3 - 16)
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isShown) {
      this.show();
    } else {
      this.hide();
    }
  }

  hide() {
    Animated.timing(
      this.state.marginBottom,
      {
        toValue: -HEIGHT * 3 - 16,
        duration: 0,
        seNativeDriver: true
      }
    ).start();
  }

  show() {
    Animated.timing(
      this.state.marginBottom,
      {
        toValue: 0,
        duration: 600,
        seNativeDriver: true
      }
    ).start();
  }

  render() {
    return (
      <Animated.View style={[styles.carouselContainer, {marginBottom: this.state.marginBottom}]}>
        <View style={[styles.carousel, styles.carouselContent]}>
          {this.props.children}
        </View>
      </Animated.View>
    )
  }
}

const styles = CustomStyleSheet({
  carouselContainer: {
    height: HEIGHT * 2.2,
    backgroundColor: 'white'
  },
  carousel: {
    backgroundColor: 'white',
    height: HEIGHT * 3
  },
  carouselContent: {
    backgroundColor: '#fefefe'
  }
})
