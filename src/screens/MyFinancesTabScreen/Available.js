import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import _ from 'lodash'

import {
  View,
  ScrollView
} from 'react-native'
import {TextRenderer as Text} from '../../components/TextRenderer'
import CheckBox from '../../components/Inputs/CheckBox';

import {PieChart as Pie} from 'react-native-svg-charts'

import styles, {Screen} from './styles'
import {parseMoney} from "../../utils/text";
import {colors as defaultColors} from "../../utils/colors";
import {MyFinancesPage} from '../../api/actionTypes';

const width = Screen.width;

const keyToLabel = {
  'cards': 'Карты',
  'deposits': 'Вклады и счета'
};

const isChildCard = (card, cards) => {
  return Boolean(cards.find(parentCard => parentCard.id === card.idParent));
};



class Available extends React.Component {
  static WIDTH = width;

  constructor(props) {
    super(props);

    this._costsRenderer = this._costsRenderer.bind(this);

    this.state = {
      pie: [],
      allMoney: 0,
      data: [{
        amount: 0,
        color: "#ddd",
        currency: "",
        key: "empty",
        name: "",
        value: 100
      }]
    }
  }

  componentDidMount() {
    this.calcPie();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.available, this.props.available)) {
      this.calcPie();
    }
  }

  render() {
    let {index, animatedValue, available} = this.props;
    let {allMoney, pie} = this.state;

    return (
      <ScrollView key={`pie-${index}`} style={{flex: 1, backgroundColor: "#fff"}}>
        <View
          key={`pie-${index}`}
          style={[
            styles.pieWrapper,
            {
              width: width,
            }
          ]}
        >
          <Text style={styles.pieAmount}>{parseMoney(Math.abs(allMoney), 'RUB')}</Text>

          <Pie
            style={{height: 200, width: 200, marginBottom: 20}}
            data={pie}

            outerRadius={'90%'}
            innerRadius={'50%'}
            padAngle={0}

            activeIndex={0}
          />

          <CheckBox
            label="Учитывать кредитные средства"
            value={this.props.isCredit}
            onValueChange={(value) => this.props.dispatch({
              type: MyFinancesPage.SET_IS_CREDIT,
              payload: {
                isCredit: value
              }
            })}
          />
        </View>

        <View style={{
          flex: 1
        }}>
          {this._costsRenderer()}
        </View>
      </ScrollView>
    )
  }

  _costsRenderer() {
    let {available} = this.props;

    return Object.keys(available).map((key, idx) => {
      return (
        <View key={`${idx}-${key}`}>
          <Text style={{
            paddingHorizontal: 15,
            paddingVertical: 10,
            fontSize: 16,
            fontWeight: '300',
            backgroundColor: "#fafafa"
          }}>
            {keyToLabel[key]}
          </Text>

          {
            available[key].map((el, idx) => {
                return (
                  <View style={[styles.rowWrapper]} key={`${idx}-${el.number}`}>
                    <View style={{flex: 1}}>
                      {/*<Icon name={el.icon} color={el.color} size={28}/>*/}

                      <View style={[styles.rowInfo, {justifyContent: 'space-between'}]}>

                        <View style={{flex: 1}}>
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              marginRight: 5,
                              backgroundColor: el.color
                            }}/>
                            <Text style={[styles.rowTitle, {textAlign: 'left'}]}>
                              {el.description}
                            </Text>
                          </View>

                          <Text style={{fontSize: 11, color: "#777", marginTop: 5}}>
                            {
                              el.information
                              || (el.productType === 'accounts' && el.account)
                              || (el.dateFinish !== '01.01.2222' &&  moment(el.dateFinish, ['DD.MM.YYYY']).format('до DD MMM YYYY'))
                            }
                          </Text>
                        </View>


                        <Text
                          style={[styles.rowAmount]}
                        >
                          {parseMoney(Math.abs(Number(el.balance || el.sumContract || 0).toFixed(2)), el.currency)}
                        </Text>
                      </View>
                    </View>

                    <View style={{
                      position: 'absolute',
                      bottom: -1,
                      right: 0,
                      left: 30,

                      height: 1,
                      backgroundColor: "#eee"
                    }}/>
                  </View>
                )
              }
            )
          }
        </View>
      )
    })
  }

  calcPie = () => {
    let {available} = this.props;
    let pie = [], allMoney = 0;

    Object.keys(available).forEach(key => {
      available[key].forEach((el, idx) => {
        if (key === 'cards') {
          if (!isChildCard(el, available[key])) {
            allMoney += el.balanceRub;
          }
        } else {
          allMoney += el.balanceRub;
        }

        pie.push({
          key: `${idx}-${key}`,
          color: el.color,
          value: el.balanceRub
        })
      })
    });

    this.setState({
      pie,
      allMoney
    })
  }
}

const mapStateToProps = (state) => {
  const isCredit = state.myFinancesPage.isCredit;
  let colors = [...defaultColors];
  if (state.settingsFront.colorDiagram && state.settingsFront.colorDiagram.length > 0) {
    state.settingsFront.colorDiagram.forEach(item => {
      if (item.rank >0 && item.rank < colors.length) colors[item.rank-1] = item.color
    });
  }
  const available = {
    cards: state.myBankPage.cards
      .filter(e => (isCredit || e.type === 0) && !isChildCard(e, state.myBankPage.cards))
      .sort((a, b) => b.balanceRub - a.balanceRub),
      deposits: [...state.myBankPage.deposits, ...state.myBankPage.accounts]
      .sort((a, b) => b.balanceRub - a.balanceRub),
  };

   // Берем все карты, счета и вклады, сортируем по убыванию суммы и красим цветами из settingsFront
  const {cards, deposits} = available;
  const coloring = [...cards, ...deposits,];
  coloring.sort((a,b) => b.balanceRub - a.balanceRub);
  coloring.forEach((item, idx) => item.color = colors[idx]);

  return {
    isCredit,
    available,
  }
};
export default connect(mapStateToProps)(Available);
