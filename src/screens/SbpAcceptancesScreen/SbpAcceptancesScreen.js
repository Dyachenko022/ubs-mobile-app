import React from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet, Image,
} from 'react-native';
import SwipeOut from '../../components/SwipeOut';
import PropTypes from 'prop-types';
import {appColors} from '../../utils/colors';
import BankTheme from '../../utils/bankTheme';
import LeftSwipeIcon from '../../../assets/icons/leftSwipe.png';

export default class SbpAcceptancesScreen extends React.Component {
  swipes = [];

  static options = ({
    topBar: {
      title: {
        text: 'Акцепты на списание',
      }
    },
    bottomTabs: {
      visible: false,
    }
  })

  componentDidMount() {
    this.props.getAcceptances();
  }

  onRefresh = () => {
    this.props.getAcceptances();
  }

  getAcceptanceState = (acceptance) => {
    let color = 'gray';
    let text = acceptance.stateNote;
    if (acceptance.state === 1) color = 'green';
    else if (acceptance.state === 2) {
      color = 'red';
      text += ` до ${acceptance.dateEndBlock}`;
    }
    return (
      <Text style={{...styles.texReqRight, width: null, paddingLeft: 5, color}}>
        {text}
      </Text>
    );
  }

  getSwipeButtons = (acceptance) => {
    const buttons = [];

    const makeSwipeButton = (text, color, onPress) => (
      <TouchableOpacity style={{...styles.swipeButton, backgroundColor: color}} onPress={onPress}>
        <Text style={styles.swipeButtonText}>{text}</Text>
      </TouchableOpacity>
    );

    if (acceptance.state === 0) {
      buttons.push(makeSwipeButton('Активировать', appColors.green, () => this.props.changeAcceptanceState(acceptance.id, 'Активировать')));
    } else if (acceptance.state === 1) {
      buttons.push(makeSwipeButton('Приостановить', appColors.yellow, () => this.props.changeAcceptanceState(acceptance.id, 'Приостановить')));
    } else if (acceptance.state === 2) {
      buttons.push(makeSwipeButton('Возобновить', appColors.green, () => this.props.changeAcceptanceState(acceptance.id, 'Возобновить')));
    }
    buttons.push(makeSwipeButton('Отозвать', appColors.red, () => this.props.changeAcceptanceState(acceptance.id, 'Отозвать')));
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
    const acceptance = item.item;
    return (
      <SwipeOut
        buttonsWidth={90}
        rightButtons={this.getSwipeButtons(acceptance)}
        onRef={(ref) => {
          this.swipes.push(ref);
          return this.swipes.length - 1;
        }}
        onSwipeStart={(id) => this.recenterSw(id)}
      >
        <View style={styles.acceptanceRow}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <Text  numberOfLines={1} style={{fontSize: 16, flex: 2}}>{acceptance.description}</Text>
            {this.getAcceptanceState(acceptance)}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.textReq}>Получатель: {acceptance.nameRecipient}</Text>
            <Text style={styles.texReqRight}>
              {`Сумма: ${acceptance.amountMax === 0 ? 'Неограниченна' : 'до ' + acceptance.amountMax.toString()}`}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.textReq}>Телефон: {acceptance.phoneRecipient}</Text>
            <Text style={styles.texReqRight}>
              {acceptance.dateEnd === '01.01.2222' ? 'Бессрочно' : `Дата окончания: ${acceptance.dateEnd}`}
            </Text>
          </View>
          <View >
            <Text style={styles.textReq}>Банк: {acceptance.bankRecipient}</Text>
          </View>
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
          ListEmptyComponent={
            <View style={{ height: 100, justifyContent: 'flex-end', alignItems: 'center', }}>
              <Text>
              Акцепты на списание средств отсутствуют
              </Text>
            </View>
          }
          ListFooterComponent={
            <View style={{width: '100%', alignItems: 'center', marginTop: 32}}>
              <Text style={styles.textFooter}>
                Для выполнения операций над акцептом
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
          data={this.props.acceptances}
          renderItem={this.renderRow}
          keyExtractor={item => item.id}
        />
        <View>
          <TouchableOpacity style={styles.newAcceptanceButton} onPress={this.props.createNewAcceptance}>
            <Text style={{color: 'white'}}>
              Новый акцепт
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  newAcceptanceButton: {
    height: 50,
    backgroundColor: BankTheme.color1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textReq : {
    color: '#9b9b9b',
    fontSize: 12,
    marginLeft: 5,
    width: '50%',
  },
  textFooter: {
    color: '#9b9b9b',
    fontSize: 12,
  },
  texReqRight: {
    color: '#9b9b9b',
    fontSize: 12,
    width: '45%',
    textAlign: 'right',
  },
  acceptanceRow: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  }
});

SbpAcceptancesScreen.propTypes = {
  isLoading: PropTypes.bool,
  getAcceptances: PropTypes.func,
  changeAcceptanceState: PropTypes.func,
  createNewAcceptance: PropTypes.func,
  acceptances: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      description: PropTypes.string,
      bankRecipient: PropTypes.string,
      phoneRecipient: PropTypes.string,
      nameRecipient: PropTypes.string,
      amountMax: PropTypes.number,
      currency: PropTypes.string,
      dateEnd: PropTypes.string,
      dateEndBlock: PropTypes.string,
      reasonBlock: PropTypes.string,
      state: PropTypes.number,
      stateNote: PropTypes.string,
    }),
  )
}

SbpAcceptancesScreen.defaultProps = {
  isLoading: true,
  getAcceptances: () => {},
  acceptances: [],
}
