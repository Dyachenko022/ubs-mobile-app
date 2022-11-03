import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image, View, Text } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import styles from './styles';
import { sliderWidth, itemWidth, slideHeight } from './styles';
import BankTheme from '../../utils/bankTheme';

export default class UniCarousel extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    renderItem: PropTypes.func.isRequired,

    paginationContainerStyle: PropTypes.object,

    sliderWidth: PropTypes.number,
    itemWidth: PropTypes.number,
    itemHeight: PropTypes.number,
    slideHeight: PropTypes.number,

    inactiveSlideOpacity: PropTypes.number,

    pagination: PropTypes.bool
  };

  static defaultProps = {
    pagination: true
  };

  constructor(props){
    super(props);

    this.state = {
      activeSlide: this.props.firstItem || 0
    }
  }

  render () {
    return (
      <View style={[styles.container, this.props.style ? this.props.style : {}]}>
        <Carousel
          firstItem={this.props.firstItem || 0}
          containerCustomStyle={this.props.containerCustomStyle || {maxHeight: this.props.sliderHeight}}

          ref={(carousel) => { this._carousel = carousel; }}
          data={this.props.data}
          renderItem={this.props.renderItem}

          sliderWidth={this.props.sliderWidth || sliderWidth}
          itemWidth={this.props.itemWidth || itemWidth}

          itemHeight={this.props.itemHeight || slideHeight}
          sliderHeight={this.props.sliderHeight || slideHeight}

          onSnapToItem={(index) => {this.props.onSlideChange&&this.props.onSlideChange(index); this.setState({ activeSlide: index })} }

          inactiveSlideOpacity={this.props.inactiveSlideOpacity}

          // contentContainerCustomStyle={{borderWidth: 3, borderColor: 'purple'}}
        />

        {
          this.props.pagination &&
          <Pagination
            dotsLength={this.props.data.length}
            activeDotIndex={this.state.activeSlide}
            containerStyle={[styles.paginationContainer, this.props.paginationContainerStyle ? this.props.paginationContainerStyle : {}, this.props.absoluteDots ? styles.paginationContainerAbsolute : {}]}
            dotColor={this.props.dotColor || BankTheme.color1}
            dotStyle={this.props.paginationDotStyle || styles.paginationDot}
            dotContainerStyle={this.props.dotContainerStyle || {}}
            inactiveDotColor={this.props.inactiveDotColor || "rgba(255, 255, 255, 0.92)"}
            inactiveDotOpacity={1}
            inactiveDotScale={0.8}
            carouselRef={this._carousel}
            tappableDots={!!this._carousel}
          />
        }
      </View>
    );
  }
}
