import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from "react-native";
import { View, Text, Image, Card} from 'react-native-ui-lib';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {parseLineSeparators} from '../../../utils/text';

const screenWidth = Dimensions.get('window').width;
const slideWidth = screenWidth - 80;

export default class CarouselPersonalOffers extends React.Component {

  _renderItem = ({item}) => {
    const offer = item;
    return (
      <Card key={offer.id}
            width={slideWidth}
            height={100}
            onPress={() => this.props.selectPersonalOffer(offer.id)}
            containerStyle={{
              backgroundColor: offer.background || 'lightblue',
              flexDirection: 'row',
              marginTop: 10,
              marginBottom: 10,
            }}
      >

        <View style={{marginLeft: 10, marginTop: 5, marginBottom: 5, width: '35%', height: '90%', }}>
          <Image style={{width: '100%', height: '100%',}}
            resizeMode="cover"
            source={{uri: offer.logo}}
          />
        </View>

        <Text style={{flex: 1, marginTop: 5, marginBottom: 5, marginRight: 10, marginLeft: 10,  width: '55%', height: '100%',}}>
          {parseLineSeparators(offer.title)}
        </Text>

      </Card>
    );
  };

  render() {
    return (
      <View style={{width:'100%'}}>
      <Carousel
        layout={"default"}
        ref={ref => this.carousel = ref}
        data={this.props.personalOffers}
        sliderWidth={screenWidth}
        itemWidth={slideWidth+10}
        autoplay={true}
        autoplayInterval={5000}
        loop={true}
        renderItem={this._renderItem}
        />
      </View>
    );
  }
}


CarouselPersonalOffers.propTypes = {
  selectPersonalOffer: PropTypes.func,
  personalOffers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    logo: PropTypes.string,
    background: PropTypes.string,
  }))
};

CarouselPersonalOffers.defaultProps = {
  personalOffers: [],
};
