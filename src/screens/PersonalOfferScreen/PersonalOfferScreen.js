import React from 'react';
import PropTypes from 'prop-types';
import {View, Image, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Dimensions} from 'react-native'
import {Button} from 'react-native-ui-lib';
import questionIcon from '../../../assets/icons/question.png';
import AutoHeightWebView from 'react-native-autoheight-webview';
import BankTheme from '../../utils/bankTheme';
import styles from './styles';

export default class PersonalOfferScreen extends React.Component {

  render() {
    const {personalOffer, wasOfferDescriptionFetched} = this.props;

    if (!wasOfferDescriptionFetched) {
      return (
        <View style={{width: '100%', height: '100%',}}>
          <ActivityIndicator size="large" color={BankTheme.color1} />
        </View>
      )
    }

    return (
      <View style={styles.screenContainer}>

        <ScrollView style={{width: '100%'}}>

          <View style={styles.imageContainer}>

            <Image
              style={styles.imageContainer}
              source={{uri: personalOffer.logo}}
              resizeMode="cover"
            />

            <Text style={styles.panelValidUntil}>
              {`Действует до ${personalOffer.dateEnd}`}
            </Text>

            <View style={styles.questionIcon}>

              <TouchableOpacity
                onPress={() => Linking.openURL(personalOffer.linkInfo)}
              >
                <Image
                  style={{width: 32, height: 32}}
                  source={questionIcon}
                  />
              </TouchableOpacity>
            </View>
          </View>

          {personalOffer.appeal ? (
            <Text style={styles.appeal}>
              {personalOffer.appeal}
            </Text>
          ) : (
            <View style={styles.separatorHorizontal} />
          )}

          <AutoHeightWebView
            source={{html: `<meta name="viewport" content="initial-scale=0.9, maximum-scale=0.9">` + personalOffer.description}}
            containerStyle={styles.webViewContainer}
            style={styles.webView}
          />
        </ScrollView>


        <Button label={personalOffer.nameButtonAction || 'Принять'}
                style={styles.buttonAccept}
                onPress={() => this.props.acceptOffer(personalOffer)}
        />

        <Button label='Отклонить'
                color={'gray'}
                style={styles.buttonReject}
                onPress={() => this.props.refuseOffer(personalOffer)}
        />

      </View>
    );
  }
}

PersonalOfferScreen.defaultProps = {
  personalOffer: {}
}

PersonalOfferScreen.propTypes = {
  acceptOffer: PropTypes.func,
  refuseOffer: PropTypes.func,
  personalOffer: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    logo: PropTypes.string,
    dateEnd: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    actionType: PropTypes.string,
    actionParam: PropTypes.string,
    linkInfo: PropTypes.string,
    nameButtonInfo: PropTypes.string,
    nameButtonAction: PropTypes.string,
    state: PropTypes.number,
    stateName: PropTypes.string,
    appeal: PropTypes.string,
  }),
};
