import React from 'react'
import moment from 'moment'

import Collapsible from '../../components/Collapsible';
import {
  Animated,
  View,
  ScrollView,

  Image,
  ActivityIndicator
} from 'react-native'
import {default as TouchableOpacity} from '../../components/Touchable'
import {TextRenderer as Text} from '../../components/TextRenderer'

import {PieChart as Pie} from 'react-native-svg-charts'
import Icon from 'react-native-vector-icons/Ionicons';

import styles, {Screen} from './styles'
import {parseMoney} from "../../utils/text";

const width = Screen.width;

export default class PieChart extends React.Component {
  static WIDTH = width;

  constructor(props) {
    super(props);

    this._costsRenderer = this._costsRenderer.bind(this);

    this.state = {
      collapsed: [],
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data.pie.length !== 0) {
      return {data: nextProps.data.pie}
    }
    return null
  }

  render() {
    let {index, animatedValue, data} = this.props;
    return (
      <View key={`pie-${index}`} style={{width: width, backgroundColor: 'transparent'}}>
        <ScrollView style={{backgroundColor: 'transparent'}} contentContainerStyle={{backgroundColor: 'transparent'}}>
          <Animated.View
            key={`pie-${index}`}
            style={[
              styles.pieWrapper,
              {
                width: width,
                opacity: animatedValue.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [.25, 1, .25],
                }),
                transform: [
                  {
                    translateX: animatedValue.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: [-PieChart.WIDTH / 2, 0, PieChart.WIDTH / 2],
                      extrapolate: 'clamp',
                    })
                  },
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: [.7, 1, .7],
                      extrapolate: 'clamp',
                    }),
                  }
                ]
              }
            ]}
          >
            {
              data.loading ?
                <View style={{justifyContent: "center", flexDirection: 'row'}}>
                  <ActivityIndicator style={{marginRight: 10}}/>
                  <Text style={styles.pieAmount}>Загрузка...</Text>
                </View>
                :
                <Text style={styles.pieAmount}>{parseMoney(Math.abs(data.total), 'RUB')}</Text>
            }

            <Pie
              style={{height: 200, width: 200}}
              data={this.state.data}

              outerRadius={'90%'}
              innerRadius={'50%'}
              padAngle={0}

              activeIndex={0}
            />

            <View style={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,

              paddingTop: 36,

              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                {
                  /*false
                    ?
                    <ActivityIndicator/>
                    :*/
                  [
                    <Text key={'1'}>
                      {moment(data.date, 'DD.MM.YYYY').format('MMMM').charAt(0).toUpperCase() + moment(data.date, 'DD.MM.YYYY').format('MMMM').slice(1)}
                    </Text>,

                    <Text key={'2'}>
                      {moment(data.date, 'DD.MM.YYYY').format('YYYY')}
                    </Text>
                  ]
                }
              </View>
            </View>
          </Animated.View>


          <Animated.View style={{
            flex: 1,
            width: Screen.width,

            opacity: animatedValue.interpolate({
              inputRange: [index - .95, index, index + .95],
              outputRange: [0, 1, 0],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                translateX: animatedValue.interpolate({
                  inputRange: [index - 1, index, index + 1],
                  outputRange: [150, 0, -150],
                  extrapolate: 'clamp',
                }),
              }
            ]
          }}>

            {this._costsRenderer()}
          </Animated.View>
        </ScrollView>
      </View>
    )
  }

  _costsRenderer() {
    return this.props.data.pie.map((el, idx) => {
      return (

        <View key={el.key}>
          <TouchableOpacity
            style={styles.rowWrapper}
            onPress={
              () => this.setState(
                (prevState) => {
                  let newCollapsed = [...prevState.collapsed];

                  if (prevState.collapsed.indexOf(idx) === -1) {
                    newCollapsed.push(idx)
                  } else {
                    newCollapsed.splice(prevState.collapsed.indexOf(idx), 1)
                  }

                  return {collapsed: newCollapsed}
                }
              )
            }
          >
            <View style={[styles.costLogo, {backgroundColor: el.color}]}/>

            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>
                {el.name}
              </Text>
              <Text
                style={[styles.rowAmount]}>{parseMoney(Math.abs(el.amount.toFixed(2)), el.currency)}
              </Text>
            </View>
          </TouchableOpacity>

          <Collapsible collapsed={this.state.collapsed.indexOf(idx) === -1}>
            <View style={{paddingLeft: 60, paddingRight: 15}}>
              {
                el.operations.map(el => (
                  <View style={{paddingVertical: 15, flex: -1}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                      <View style={{flex: 1}}>
                        <Text>{el.nameDoc}</Text>
                      </View>

                      <Text style={{paddingLeft: 10}}>{parseMoney(el.amountRub, 'RUB')}</Text>
                    </View>

                    <Text style={{marginTop: 5, color: '#999'}}>{el.date}</Text>

                    <View style={{
                      height: 1,
                      position: 'absolute',
                      top: 0,
                      right: -15,
                      left: 0,
                      backgroundColor: '#ddd'
                    }}/>
                  </View>
                ))
              }
            </View>
          </Collapsible>

          <View style={styles.line}/>
        </View>
      )
    })
  }
}
