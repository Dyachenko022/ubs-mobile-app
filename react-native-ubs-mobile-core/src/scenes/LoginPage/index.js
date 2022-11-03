import React from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, Text, Image, ImageBackground, View, TouchableOpacity as Touch, StyleSheet, Keyboard, Alert} from 'react-native';
import TouchableOpacity from '../../components/Touchable';
import Icon from 'react-native-vector-icons/FontAwesome';
import HTML from 'react-native-render-html';
import {IconInput} from '../../components/Inputs';
import styles from './styles';
import {authBase} from '../../coreApi';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = __DEV__ ? {
      username: 'ta',
      hash: '1111',
      loading:false,
    } : {
      username: '',
      hash: '',
      loading:false,
    };
    this._onPressLogin = this._onPressLogin.bind(this);
    this._onPressRegistration = this._onPressRegistration.bind(this);
    this._renderCarouselItem = this._renderCarouselItem.bind(this);
  }

  componentDidMount() {
    //this.props.dispatch(advertising());
  }

  render() {
    return (
      <TouchableOpacity onPress={Keyboard.dismiss} activeOpacity={1}>
      <ImageBackground
        source={this.props.loginImageBackground}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        {
          this.state.loading &&
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 2,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255,255,255,.85)',
          }}>
            <Text>Выполняется вход</Text>
            <ActivityIndicator size="large" color={global.coreUiColor}/>
          </View>
        }

        <View style={styles.loginFormWrapper}>

          <View style={{alignItems: 'center', marginTop: 20,}}>
            <IconInput
              styles={{marginBottom: 10}}
              placeholder={'Логин'}
              inputProps={{
                value: this.state.username,
                autoCapitalize: false,
                onChangeText: (text) => this.setState({username: text}),
                autoCapitalize: 'none',
              }}
              iconLeft={(style) => <Icon active name='user' size={17} style={style}/>}
            />

            <IconInput
              styles={{marginBottom: 15}}
              placeholder={'Пароль'}
              inputProps={{
                value: this.state.hash,
                onChangeText: (text) => this.setState({hash: text}),
                secureTextEntry: true,
              }}

              iconLeft={(iconProps) => <Icon active name='lock' size={20} color='#CDCDCD' {...iconProps}/>}
            />

            <TouchableOpacity activeOpacity={.8}
                              accessibilitylable={'Вход в личный кабинет банка ИПБ'}
                              style={StyleSheet.flatten([styles.button, {backgroundColor: global.coreUiColor}])}
                              onPress={this._onPressLogin}
            >
              <Text style={{color: '#fff'}}>
                ВОЙТИ
              </Text>
            </TouchableOpacity>

            <Touch onPress={this._onPressRegistration} style={styles.textBtn}>
              <Text style={{color: '#fff'}}>Регистрация</Text>
            </Touch>

            <Touch onPress={() => this.props.openRegistration(true)} style={styles.textBtn}>
              <Text style={{color: '#fff'}}>Забыли пароль?</Text>
            </Touch>
          </View>

          <Touch onPress={this.props.openInformationAboutSecurity} style={{...styles.textBtn, marginTop: 20,}}>
            <Text style={{color: '#fff'}}>Информация о безопасности</Text>
          </Touch>
        </View>
      </ImageBackground>
      </TouchableOpacity>

    );
  }

  _renderCarouselItem({item, index}) {
    return (

      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={() => {
          alert(`You've clicked '${item.title}'`);
        }}
      >
        {
          item.image &&
          <Image
            source={{uri: item.imageMobile}}
            style={styles.image}
          />
        }

        <HTML
          containerStyle={{backgroundColor: 'transparent'}}
          html={item.title}
        />

      </TouchableOpacity>
    );
  }

  _renderHtmlNode(node, index, siblings, parent, defaultRenderer) {
    if (node.type === 'tag') {

    }
  }

  _onPressLogin() {
    this.setState({loading: true});
    authBase({
      username: this.state.username,
      password: this.state.hash,
      source: 'MobileApplication',
    })
      .then(response => {
        this.setState({loading: false});
        this.props.onAuthBaseSuccess(response);
      })
      .catch(ex => {
        this.setState({loading: false});
        console.error(ex);
      });
  }

  _onPressRegistration() {
    this.props.openRegistration(false);
  }
}

LoginPage.propTypes = {
  onAuthBaseSuccess: PropTypes.func,
  openContractSelection: PropTypes.func,
  openRegistration: PropTypes.func,
}

LoginPage.defaultProps = {
  carouselADS: [],
};
