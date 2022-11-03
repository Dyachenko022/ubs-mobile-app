import React, {Component} from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import Icon from 'react-native-vector-icons/Ionicons';
import {parseMoney} from '../../utils/text';

import {
  ActivityIndicator,
  View,
  ScrollView,
  Alert,
  Image, BackHandler
} from 'react-native'
import {default as Touchable} from '../../components/Touchable'
import {TextRenderer as Text} from "../../components/TextRenderer";
import styles from './styles';
import {Navigation} from 'react-native-navigation';
import androidBeforeExit from '../../utils/androidBeforeExit';


class BonusesPage extends Component {

  constructor(porps) {
    super(porps);

    this.state = {
      nextProgramms: [],
      lastSync: [],
    };

    this._programsRenderer = this._programsRenderer.bind(this);
    this._activeProgramsRenderer = this._activeProgramsRenderer.bind(this);
    this._onChangeActive = this._onChangeActive.bind(this);
  }

  componentDidMount() {
    this.navigationEvents = Navigation.events().bindComponent(this);
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          component: {
            name: 'unisab/CustomTopBar',
            passProps: {
              title: 'Бонусы',
              badgeMenu: true,
              parentComponentId: this.props.componentId,
            }
          }
        },
      },
    });
  }

  componentWillUnmount() {
    this.navigationEvents?.remove();
  }

  componentDidAppear() {
    this.androidBackButtonListener = BackHandler.addEventListener('hardwareBackPress', androidBeforeExit);
  }

  componentDidDisappear() {
    this.androidBackButtonListener?.remove();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.nextProgramms, prevState.lastSync)) {
      return {nextProgramms: nextProps.nextProgramms, lastSync: nextProps.nextProgramms};
    }
    return null;
  }

  render() {
    const { nextProgramms, activeProgramms, loading } = this.props;

    if (loading) {
      return <View style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size={'large'}/></View>
    }

    return (
      <ScrollView style={styles.container}>

        {
          !!this.props.cash.name &&
            <Text style={[styles.programsHeader, {color: "#000", fontWeight: '600', fontSize: 18}]}>
              {`${this.props.cash.name}   ${parseMoney(this.props.cash.value, 'RUB')}`}
            </Text>
        }

        {
          activeProgramms.length ?
            [
              <Text key={'1'} style={styles.programsHeader}>
                {`Действующ${activeProgramms.length > 1 ? 'ие' : 'ая'} программ${activeProgramms.length > 1 ? 'ы' : 'а'}`}
              </Text>,
              this._activeProgramsRenderer(activeProgramms)
            ]
          :
            null
        }

        {
          this.state.nextProgramms.length ?
            [
              <Text
                key={'1'}
                style={styles.programsHeader}
              >
                Программы на следующий месяц
              </Text>,
              <View
              key={'2'}
                style={styles.programsWrapper}
              >
                {this._programsRenderer(this.state.nextProgramms)}
              </View>
            ]
          :
          <Text>Программ лояльности не найдено</Text>
        }

      </ScrollView>
    );
  }

  _activeProgramsRenderer(programs) {
    return programs.map((el, idx) => (
      <View
        key={idx}
        style={{
          width: '100%',
          height: 75
        }}>
        <Image source={{uri: el.logo}} style={[styles.bonusLogo, {borderRadius: 0}]} />
        <View style={[styles.textWrapper]}>
          <Text style={[styles.bonusTitle, {color: '#fff'}]}>
            {el.name}
          </Text>
        </View>
      </View>
    ))
  };

  _programsRenderer(programs, background) {
    return programs .map((el, idx) => (
      <Touchable
        key={idx}
        style={[
          styles.bonusWrapper
        ]}
        onPress={() => {this._onChangeActive(el)}}
      >

        <Image source={{uri: el.logo}} style={styles.bonusLogo} />
        {
          <View style={[styles.textWrapper, el.active && styles.textWrapperActive]}>
            <Text style={[styles.bonusTitle, {color: '#fff'}]}>
              {el.name}
            </Text>
            { el.active && <Icon name="ios-checkmark" size={50} color="#fff" /> }
          </View>
        }
        {
          Boolean(el.text) &&
            <Text style={el.active ? {color: "#fff"} : {}}>
              Начисляем бонусы за покупки:
            </Text>
        }
      </Touchable>
    ))
  }

  _onChangeActive(el) {
    const newBon = cloneDeep(this.state.nextProgramms);

    newBon.forEach(bel => {
      if (bel.name === el.name) {
        bel.active = !bel.active
      }
    });

    const nNewActive = newBon.filter(el => Boolean(el.active)).length;

    if (nNewActive <= this.props.nMaxBonusesSelected) {
      this.setState({
        nextProgramms: newBon
      }, () => {
        this.handleServerSave();
      });
    } else {
      Alert.alert('Ошибка', 'Максимальное число бонусных программ выбрано!')
    }
  };

  handleServerSave = () => {
    const choosenProgram = this.state.nextProgramms.filter(i => i.active).map(i => [i.name]);

    this.props.saveParamContract([
      {
        name: 'Выбранная программа',
        value: choosenProgram,
        type: 'array',
        typeColumns: ['string']
      }
    ]);
  };
}

BonusesPage.propTypes = {};
BonusesPage.defaultProps = {
  activeProgramms: [],
  nextProgramms: [],
  cash: {
    name: '',
    value: ''
  }
};

export default BonusesPage;
