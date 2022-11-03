import React from 'react';
import PropTypes from 'prop-types';
import {Animated, View, ActivityIndicator} from 'react-native';
import TouchableOpacity from '../../../../../components/Touchable';
import {TextRenderer as Text} from '../../../../../components/TextRenderer';

import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import BankTheme from '../../../../../utils/bankTheme';

export default class CollapseHeader extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    onCollapse: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    isAddShown: PropTypes.bool,

    // icon: PropTypes.component,
    // collapseIcon: PropTypes.component,
    title: PropTypes.string.isRequired,

    addLable: PropTypes.string
  };

  static defaultProps = {
    loading: true,
    title: "Title",
    rotated: false,
    isAddShown: true,

    onCollapse: () => {
      alert(`Hi, i'm ${this.props.title}`)
    },
    type: 'Type',

    // icon: () => (<Icon name={'credit-card'}/>),
    // collapseIcon: () => (<Icon name={'credit-card'}/>)
  };

  constructor(props) {
    super(props);

    this.state = {
      iconRotate: new Animated.Value(this.props.rotated ? 0 : 90)
    };

    this.iconRotatedFlag = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.rotated !== this.props.rotated) {
      Animated.timing(
        this.state.iconRotate,
        {
          toValue: this.props.rotated ? 0 : 90,
          duration: 250,
          useNativeDriver: true,
        }
      ).start();
    }
  }

  render() {
    const rotate = this.state.iconRotate.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg']
    });

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.iconRotatedFlag = !this.iconRotatedFlag;
          this.props.onCollapse(this.props.type)
        }}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            {
              this.props.icon ?
                this.props.icon
                :
                <Icon name={'ios-card'} color={'#9fa2a4'} size={25}/>
            }
          </View>

          <Text style={styles.headerText}>{this.props.title}</Text>

          <Animated.View
            style={{transform: [{rotate: rotate}], marginLeft: 15}}
          >
            <Icon name={'ios-arrow-forward-outline'} color={'#9fa2a4'} size={20} style={{paddingTop: 1}}/>
          </Animated.View>
          {
            this.props.loading &&
            <ActivityIndicator size="small" color={BankTheme.color1} style={{marginLeft: 10}}/>
          }
        </View>

        {
          this.props.isAddShown && (
            <View style={styles.row}>
              <TouchableOpacity style={styles.addBtnWrapper} onPress={() => {
                this.props.navigator.push({
                  screen: 'unisab/NewProductScreen',
                  backButtonTitle: '',
                  title: this.props.title,//'Выбор карты',
                  passProps: {
                    type: this.props.type
                  }
                })
              }}>
                <View style={styles.addBtn}>
                  <Icon name={'md-add'} color={BankTheme.color1} size={16} style={{paddingTop: 1, marginRight: 0}}/>
                </View>
                {/*<Text style={styles.addText}>{this.props.addLable}</Text>*/}
              </TouchableOpacity>
            </View>
          )
        }
      </TouchableOpacity>
    )
  }
}
