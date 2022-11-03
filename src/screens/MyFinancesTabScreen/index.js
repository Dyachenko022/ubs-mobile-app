import React from 'react';
import {connect} from "react-redux";
import moment from "moment/moment";
import Header from './Header'
import Available from './Available';
import Costs from './Costs';
import {operationsProduct} from '../../api/actions';
import {View, Text, BackHandler} from 'react-native';
import {Navigation} from 'react-native-navigation';
import androidBeforeExit from '../../utils/androidBeforeExit';

class MyFinances extends React.Component {

  static options = (props) => {
      return {
        topBar: {
          title: {
            component: {
              name: 'unisab/CustomTopBar',
              passProps: {
                title: 'Мои финансы',
                badgeMenu: true,
                parentComponentId: props.componentId,
                innerComponent:
                  <Header
                    parentComponentId={props.componentId}
                  />
                ,
              }
            }
          },
        },
      }
    }

  componentDidMount() {
    this.navigationEvents = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this.navigationEvents?.remove();
  }

  componentDidAppear() {
    this.backButtonAndroidListener =  BackHandler.addEventListener('hardwareBackPress', this.androidBackButtonPress);
  }

  componentDidDisappear() {
    this.backButtonAndroidListener?.remove();
  }

  androidBackButtonPress = () => {
    androidBeforeExit();
    return true; // Это нужно, чтобы у Андроида не работала кнопка Назад
  };

  render(){
    if (this.props.activeTab === 'costs') {
      return (
        <Costs/>
      )
    } else {
      return (
        <Available/>
      )
    }
  }

  getOperations() {
    let date = moment().format('DD.MM.YYYY'),//'01.12.2017',//
      idObject = 0,
      code = "",
      type = 1;

    let format = 'DD.MM.YYYY';

    for (let i = 0; i < 12; i++) {
      this.props.dispatch(operationsProduct({period: date, idObject, code, type}));

      date = moment(date, format).subtract(1, 'months').format(format);
    }
  }
}

const mapStateToProps = (state) => ({
  activeTab: state.myFinancesPage.activeTab,
});
export default connect(mapStateToProps)(MyFinances)
