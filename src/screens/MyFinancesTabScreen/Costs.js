import React from 'react'
import {connect} from 'react-redux'
import moment from "moment";
import {colors as defaultColors} from "../../utils/colors";
import {
  ActivityIndicator,
  View,
} from 'react-native'
import {TextRenderer as Text} from '../../components/TextRenderer'
import SideSwipe from './Carousel';
import PieChart from './PieChart'
import {operationsProduct} from '../../api/actions'
import styles, {Screen} from './styles'


class Costs extends React.Component {
  constructor(props) {
    super(props);
    this.getOperations = this.getOperations.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this._makePies = this._makePies.bind(this);
    this._pieRenderer = this._pieRenderer.bind(this);
    const datesBuf = [];
    let date = moment().format('DD.MM.YYYY');
    for (let i = 0; i < 12; i++) {
      datesBuf.push(date);
      date = moment(date, 'DD.MM.YYYY').subtract(1, 'months').format('DD.MM.YYYY');
    }
    this.dates = datesBuf.reverse();
    let data = [];
    this.dates.forEach(() => {
      data.push({ loading: true, pie: [], });
    });

    this.state = {
      currentIndex: 11,
      data,
    }
  }

  componentDidMount(){
    this._makePies();
    this.getOperations(this.dates.length-1);
  }

  componentDidUpdate(prevProps, prevState) {
    // Так себе решение, но куда лучше чем то, что было. Вообще всю форму надо переделать...
    if (!this.props.costsLoading && prevProps.costsLoading) {
      this._makePies();
    }
    if (this.state.currentIndex !== prevState.currentIndex) {
      this.getOperations(this.state.currentIndex);
    }
  }

  render() {
    const offset = (Screen.width - PieChart.WIDTH) / 2;

    return (
      <View style={styles.container}>
        <View style={{backgroundColor: '#fff', flex: 1}}>
          <SideSwipe
            style={{
              flex: 1,
            }}

            itemWidth={PieChart.WIDTH}
            threshold={PieChart.WIDTH / 4}
            contentOffset={offset}
            onIndexChange={this.getOperations}

            data={this.state.data}
            renderItem={({itemIndex, currentIndex, item, animatedValue}) => (
                <PieChart
                  data={item}
                  index={itemIndex}
                  currentIndex={currentIndex}
                  animatedValue={animatedValue}
                />
              )
            }
          />
        </View>
      </View>
    )
  }

  getCategories = (date, operations) => {
    let idxCategoryInData = {},
      data = [];
    let colorIndex = 0;
    operations.forEach((operation) => {
      const {nameCategory, amountRub, expensePrc, currency, logoCategory} = operation;
      let prc = Math.ceil(expensePrc.toFixed()) > 1 ? expensePrc.toFixed() : 1;

      const nameId = operation.sidCategory;

      if (typeof idxCategoryInData[nameId] === 'undefined') {
        idxCategoryInData[nameId] = data.length;
        data.push({
          operations: [operation],
          date,
          key: nameId,
          name: nameCategory,
          amount: Number(amountRub),
          value: Number(prc),
          color: this.props.colors[colorIndex],
          icon: this.props.colors[colorIndex],
          currency: 'RUB',
          logoCategory
        });
        colorIndex +=1;
      } else {
        data[idxCategoryInData[nameId]].operations.push(operation);
        data[idxCategoryInData[nameId]].amount += Number(amountRub);
        data[idxCategoryInData[nameId]].value += Number(expensePrc.toFixed());
      }
    });

    return data
  }

  _makePies() {
    let {costs} = this.props;
    let data = [], pie = [];

    this.dates.forEach(el => {
      let amount = 0;
      pie = this.getCategories(el, costs[el].operations);
      pie.forEach(el => {
        amount += el.amount
      });

      data.push({
        pie,//: pie,
        total: costs[el].totalExpend || 0,
        operations: costs[el].operations,
        amount,
        date: el,
        loading: costs[el].loading
      })
    });

    this.setState({
      data,
    })
  }

  _pieRenderer(el) {
    return (
      <PieChart data={el.item}/>
    )
  }

  getOperations(idx) {
    let date = this.dates[idx],
      idObject = 0,
      code = "",
      type = 1;
      this.props.dispatch(operationsProduct({period: date, idObject, code, type}));
  }
}

const mapStateToProps = (state) => {
  let colors = [...defaultColors];
  if (state.settingsFront.colorDiagram && state.settingsFront.colorDiagram.length > 0) {
    state.settingsFront.colorDiagram.forEach(item => {
      if (item.rank >0 && item.rank < colors.length) colors[item.rank-1] = item.color
    });
  }
  return {
    costs: state.myFinancesPage.costs,
    costsLoading: state.myFinancesPage.costsLoading,
    colors,
  }
}
export default connect(mapStateToProps)(Costs)
