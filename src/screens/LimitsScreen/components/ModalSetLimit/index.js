import React from 'react';
import {View, SafeAreaView, Button, Text, Platform, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions} from 'react-native';
import FilledButton from '../../../../components/buttons/FilledButton';
import PropTypes from 'prop-types';
import TextBoxMoney from '../../../../components/Inputs/TextBoxMoney';
import { parseMoney } from '../../../../utils/text';
import { Navigation } from 'react-native-navigation';
import {makeLeftBackButton} from '../../../../utils/navigationUtils';

const { height } = Dimensions.get('window');

export default class ModalSetLimit extends React.Component {

  static options = (props) => ({
    topBar: {
      leftButtons: [
        makeLeftBackButton('mapListButtonBack')
      ],
    }
  })

  constructor(props) {
    super(props);
    this.state = {
      limitValue: (props.limit === -1 || !props.limit) ? '' : props.limit.toFixed(2).toString(),
    }
  }

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this.navigationEventListener?.remove();
  }

  navigationButtonPressed({ buttonId }) {
    Navigation.dismissModal(this.props.componentId);
  }

  onChangeLimit = (newValue) => {
    let limitValue = newValue;
    if (limitValue > this.props.maxLimit) limitValue = this.props.maxLimit.toString();
    this.setState({limitValue});
  }

  saveLimitButtonClicked = () => {
    if (this.props.onChangeLimit) this.props.onChangeLimit(Number(this.state.limitValue || 0));
    Navigation.dismissModal(this.props.componentId);
  }

  get textSpending() {
    if (this.props.limitType === 'daily') return 'В день можно потратить';
    else return 'В месяц можно потратить';
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView style={{flex: 1}}
                                behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
                                keyboardVerticalOffset={100}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between',}}>
              <View style={styles.containerForMoneyBox}>

                <Text style={styles.textSpending}>
                  {this.textSpending}
                </Text>

                <View style={{height: 40, width: '70%'}}>
                  <TextBoxMoney
                    keyboardType={Platform.OS === 'ios' ? "decimal-pad" : "numeric"}
                    value={this.state.limitValue}
                    textAlign={'center'}
                    onChangeText={this.onChangeLimit}
                  />
                </View>
                <Text style={styles.maxLimitText}>
                  {`До ${parseMoney(this.props.maxLimit)}`}
                </Text>
              </View>

              <View>
                <FilledButton title="Сохранить лимит" onPress={this.saveLimitButtonClicked} />
              </View>
            </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

ModalSetLimit.propTypes = {
  limit: PropTypes.number,
  maxLimit: PropTypes.number,
  onChangeLimit: PropTypes.func,
  limitType: PropTypes.oneOf(['daily', 'monthly']),
}

ModalSetLimit.defaultProps = {
  limitType: 'daily',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerForMoneyBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.25,
  },
  textSpending: {
    fontSize: 20,
    paddingBottom: 15,
  },
  maxLimitText: {
    paddingTop: 5,
    color: 'gray',
    fontSize: 16,
  },
});
