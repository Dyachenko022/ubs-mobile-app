import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {appColors} from '../../utils/colors';
import SwipeOut from '../../components/SwipeOut';
import LeftSwipeIcon from '../../../assets/icons/leftSwipe.png';
import {formatAccountNumber} from '../../utils/text';
import moment from 'moment';

export default class SBPayScreen extends React.Component {
  swipes = [];

  static options = ({
    topBar: {
      title: {
        text: 'СБПэй',
      }
    },
    bottomTabs: {
      visible: false,
    }
  })

  componentDidMount() {
    this.props.getSBPayTokens();
  }

  onRefresh = () => {
    this.props.getSBPayTokens();
  }

  getStateColor = (tokenState) => {
    switch (tokenState) {
      case 2: // Активен
        return '#008000';
      case 4: // Заблокирован
        return '#ff0000';
      default:
        return '#545454';
    }
  }

  getSwipeButtons = (token) => {
    const buttons = [];

    const makeSwipeButton = (text, color, onPress) => (
      <TouchableOpacity style={{...styles.swipeButton, backgroundColor: color}} onPress={onPress}>
        <Text style={styles.swipeButtonText}>{text}</Text>
      </TouchableOpacity>
    );

    if (token.state === 2) {
      buttons.push(makeSwipeButton('Приостановить', appColors.green, () => this.props.openTokenOperation(token.id, 'Приостановить')));
      buttons.push(makeSwipeButton('Заблокировать', appColors.yellow, () => this.props.openTokenOperation(token.id, 'Заблокировать')));
      buttons.push(makeSwipeButton('Удалить', appColors.red, () => this.props.openTokenOperation(token.id, 'Удалить')));
    } else if (token.state === 4) {
      buttons.push(makeSwipeButton('Удалить', appColors.red, () => this.props.openTokenOperation(token.id, 'Удалить')));
    } else if (token.state === 5) {
      buttons.push(makeSwipeButton('Активировать', appColors.green, () => this.props.openTokenOperation(token.id, 'Активировать')));
      buttons.push(makeSwipeButton('Заблокировать', appColors.yellow, () => this.props.openTokenOperation(token.id, 'Заблокировать')));
      buttons.push(makeSwipeButton('Удалить', appColors.red, () => this.props.openTokenOperation(token.id, 'Удалить')));
    }
    if (buttons.length === 0) return null;
    return buttons;
  }

  recenterSw = (idx) => {
    this.swipes.forEach((sw, id) => {
      if (id !== idx && sw) {
        sw.recenter();
      }
    })
  }

  renderRow = (item) => {
    const token = item.item;
    return (
      <SwipeOut
        buttonsWidth={90}
        rightButtons={this.getSwipeButtons(token)}
        onRef={(ref) => {
          this.swipes.push(ref);
          return this.swipes.length - 1;
        }}
        onSwipeStart={(id) => this.recenterSw(id)}
      >
        <View style={styles.tokenRow}>
          <View style={styles.twoColumns}>
            <View style={{ flexDirection: 'column'}}>
              <Text style={styles.account}>
                {formatAccountNumber(token.account)}
              </Text>
              <Text>
                Добавлен: {moment(token.timeCreate).format('DD.MM.yyyy')}
              </Text>
            </View>
            <View>
              <Text style={{ color: this.getStateColor(token.state), fontSize: 12}}>
                {token.stateNote}
              </Text>
            </View>
          </View>
          {token.note !== '' && (
            <Text style={styles.note}>
              {token.note}
            </Text>
          )}
        </View>
      </SwipeOut>
    )
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, }}>
        <FlatList
          contentContainerStyle={{ alignSelf: 'stretch' }}
          onRefresh={this.onRefresh}
          refreshing={this.props.isLoading}
          data={this.props.tokens}
          renderItem={this.renderRow}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={{ height: 100, justifyContent: 'flex-end', alignItems: 'center', }}>
              {!this.props.isLoading && (
                <>
                  <Text>
                    У Вас нет счетов, подключенных к СБПэй
                  </Text>
                  <Text style={styles.textNoToken}>
                    Для подключения счета установите на свое мобильное устройство
                    приложение СБПэй и следуйте инструкциям
                  </Text>
                </>
              )}
            </View>
          }
          ListFooterComponent={
            <View style={{width: '100%', alignItems: 'center', marginTop: 32}}>
              <Text style={styles.textFooter}>
                Для выполнения операций над счетом
              </Text>
              <Text style={styles.textFooter}>
                проведите пальцем
              </Text>
              <Text style={styles.textFooter}>
                от правого края к левому
              </Text>
              <Image source={LeftSwipeIcon} style={{width: 32, height: 32, marginTop: 16}} />
            </View>
          }
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  tokenRow: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  twoColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  account: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  swipeButton: {
    height: '100%',
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeButtonText: {
    fontSize: 11,
    color: '#fff',
  },
  note: {
    color: 'grey',
    fontSize: 13,
    width: '80%',
  },
  textNoToken: {
    textAlign: 'center', paddingHorizontal: 8
  }
});

SBPayScreen.propTypes = {
  isLoading: PropTypes.bool,
  getSBPayTokens: PropTypes.func,
  openTokenOperation: PropTypes.func,
  tokens: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    account: PropTypes.string,
    state: PropTypes.number,
    stateNote: PropTypes.string,
    timeCreate: PropTypes.string,
    note: PropTypes.string,
  })),
}
