import React from 'react';
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';
import CustomStyleSheet from "../../resources/customStyleSheet";

const HEIGHT = 65;

export default class CardInput extends React.Component {
  static defaultProps = {
    data: [],
    renderItem: () => {},
    onSnapToItem: () => {},
    refCarousel: () => {}
  };

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps.data, this.props.data)
      || !_.isEqual(nextProps.selectedIndex, this.props.selectedIndex);
  }

  componentDidUpdate() {
    // const index = this.props.data.indexOf(this.props.value);
    // if (this.props.selectedIndex > -1) {
    this.carousel.snapToItem(this.props.selectedIndex);
    // }
  }

  render() {
    const carouselHeight = (this.props.data.length + 2) * HEIGHT;
    return (
      <Carousel
        ref={e => this.carousel = e}
        inactiveSlideScale={0.9}
        activeSlideAlignment={'center'}
        containerCustomStyle={styles.carousel}
        contentContainerCustomStyle={{ height: carouselHeight}}
        vertical={true}
        enableSnap={false}
        data={this.props.data}
        renderItem={this.props.renderItem}
        onSnapToItem={this.props.onSnapToItem}
        itemWidth={150}
        itemHeight={HEIGHT}
        sliderHeight={HEIGHT}
        sliderWidth={412}
      />
    )
  }
}

const styles = CustomStyleSheet({
  carousel: {
    backgroundColor: 'white',
    height: HEIGHT * 3,
    marginBottom: 50,
  },
  carouselContent: {
    backgroundColor: '#fefefe',
  }
})
