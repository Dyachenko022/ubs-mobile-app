import React from 'react';
import PropTypes from 'prop-types';
import TouchableOpacity from '../../../components/Touchable';
import {
  Text, View, AsyncStorage, Alert, Dimensions, Modal, ActivityIndicator, Platform,    Image,
} from 'react-native';
import HTML from 'react-native-render-html';
import styles from './styles';

export default class LoginNotification extends React.Component {

  render() {

    return (
      <View style={{backgroundColor: this.props.backgroundColor}}>
        <View style={styles.logoView}>
          <Image
            style={{
              flex: 1,
              aspectRatio: 1.5,
              marginTop: 20,
              marginBottom: 20,
              resizeMode: 'contain',
            }}
            source={{uri: this.props.logo}}
          />
        </View>

        <HTML
          classesStyles={{
            notificationContent: {
              textAlign: 'center',
              width:'100%',
              display:'flex',
              flexFlow: 'column',
              fontSize: 22,
              paddingTop: 20,
              paddingRight: 15,
              paddingLeft: 15,
              paddingBottom: 20,
            }
          }}
          containerStyle={styles.textView}
          html={`<div class="notificationContent">${this.props.text}<br></div>`}
        />

        <View style={styles.buttonView}>
          {this.props.typeNotification !== 2 &&
          <TouchableOpacity activeOpacity={.8}
                            accessibilitylable={'Вход в личный кабинет банка ИПБ'}
                            style={styles.button}
                            onPress={this.props.onButtonPress}
          >
            <Text style={{color: '#fff'}}>
              {this.props.buttonText}
            </Text>
          </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}

LoginNotification.defaultProps = {
  typeNotification: 1,
  backgroundColor: '#808080',
  text: 'TEsting Text <br/> New Line text',
  buttonText: 'Закрыть',
};

LoginNotification.propTypes = {
  typeNotification: PropTypes.number,
  logo: PropTypes.string,
  backgroundColor: PropTypes.string,
  text: PropTypes.string,
  buttonText: PropTypes.string,
  isOpen: PropTypes.bool,
  textColor: PropTypes.string,
  onButtonPress: PropTypes.func,
};
