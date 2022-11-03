import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Text} from 'react-native-ui-lib';
import {RefreshControl, Dimensions, View, ScrollView, Alert} from 'react-native';
import {parseLineSeparators} from '../../utils/text';
import BankTheme from '../../utils/bankTheme';

const screenWidth = Dimensions.get('window').width;

export default class PersonalOffersListScreen extends React.Component {

  componentDidMount() {
    this.props.updatePersonalOffers();
  }

  onRefresh = () => this.props.updatePersonalOffers();

  renderNoOffers = () => {
    return (
      <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <Text>Для вас пока нет ни одного предложения.</Text>
      </View>
    );
  }

  render() {
    const unreadOfferStyle = { borderColor: BankTheme.color1, borderLeftWidth: 12, };

    if (!this.props.personalOffers.length)
      return this.renderNoOffers();

    return (
      <View
        style={{width:'100%', height: '100%', backgroundColor: 'white'}}
      >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this.onRefresh}
          />
        }
      >
        {this.props.personalOffers.map(offer =>
          <Card key={offer.id}
            width={screenWidth-10}
            height={100}
            onPress={() => this.props.selectPersonalOffer(offer.id)}
            style={offer.status === 1 ? unreadOfferStyle : {}}
            containerStyle={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 5,
              marginBottom:5,
              marginLeft: 4,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <View style={{width: 110, height:'90%', marginTop: 5, marginBottom: 5,marginLeft: 10, marginRight: 10, }}>
              <Image
                style={{width: 110, height: 70,}}
                source={{uri: offer.logo}}
                resizeMode="contain"
              />
            </View>
            <Text style={{flex: 1, margin: 5, width: '50%', paddingTop: 3,  height: '100%', textAlign: 'left', fontSize: 14,}}>
              {parseLineSeparators(offer.title)}
            </Text>
            <View style={{flexDirection: 'column', width: '25%',  marginRight: 5, paddingTop: 15, height: '100%',}}>
              <Text style={{textAlign: 'right', color: '#999', fontSize: 12,}}>
                Действует
              </Text>
              <Text style={{textAlign: 'right', color: '#999', paddingTop: 5, fontSize: 12,}}>
                {`До ${offer.dateUntil}`}
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>
      </View>
    )

  }
}

PersonalOffersListScreen.propTypes = {
  updatePersonalOffers: PropTypes.func,
  selectPersonalOffer: PropTypes.func,
  personalOffers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.number,
    statusName: PropTypes.string,
    dateUntil: PropTypes.string,
    title: PropTypes.string,
    logo: PropTypes.string,
  })),
};
