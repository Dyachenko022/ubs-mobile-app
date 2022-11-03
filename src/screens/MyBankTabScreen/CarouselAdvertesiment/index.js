import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Linking} from 'react-native'
import {Carousel, View, Text, Image, TouchableOpacity} from 'react-native-ui-lib';

const screenWidth = Dimensions.get('window').width;

export default class CarouselAdvertisement extends React.Component {

  render() {
    const filtered = this.props.advertisement.filter(item => item.imageMobile);
    if (filtered.length === 0) return null;
    return (
      <Carousel
        pageControlPosition={'under'}
        pageWidth={screenWidth}
      >
        {filtered.map((item, idx) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(item.link)}
              key={idx}
            >
              <Image
                style={{width: screenWidth, height: 100,}}
                source={{uri: item.imageMobile}}
              />
            </TouchableOpacity>
          ))
        }
      </Carousel>
    );
  }
}

CarouselAdvertisement.propTypes = {
  advertisement: PropTypes.arrayOf(PropTypes.shape(
    {
      title: PropTypes.string,
      description: PropTypes.string,
      link: PropTypes.string,
      imageMobile: PropTypes.string,
    }
  )),
};

CarouselAdvertisement.defaultProps = {
  advertisement: [],
};
