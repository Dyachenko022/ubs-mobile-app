import React from 'react';

import {
  Dimensions,
  Platform,

  ActivityIndicator,

  View,
  ScrollView,

  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';
import { TextRenderer as Text } from '../../../components/TextRenderer';

import { getProductOperations } from '../../../api/actions'
import { parseMoney } from '../../../utils/text';


import styles from "../styles";
import { connect } from "react-redux";

import moment from 'moment';
import BankTheme from '../../../utils/bankTheme';


class OperationsHistory extends React.Component {
  static defaultProps = {
    operations: [],
    order: []
  };

  componentDidMount() {
    if (this.props.id && this.props.type && this.props.code) {
      this.props.dispatch(getProductOperations(this.props.id, this.props.type, this.props.code))
    }
  }

  componentWillUpdate(nextProps) {
    const isActiveTab = !this.props.isActiveTab && nextProps.isActiveTab;
    const activeProductWasChanged = nextProps.id && nextProps.id !== this.props.id && this.props.isActiveTab && nextProps.isActiveTab;
    const shouldUpdate = isActiveTab || activeProductWasChanged;
    if (shouldUpdate) {
      this.props.dispatch(getProductOperations(nextProps.id, nextProps.type, nextProps.code));
    }
  }

  render() {
    const BtnContainer = Platform.OS === 'ios' ? TouchableHighlight : TouchableNativeFeedback;

    return (
      <ScrollView style={{ flex: 1 }}>
        <Text style={{ textAlign: 'center', paddingVertical: 15, fontSize: 12 }}>10 последних операций</Text>

        {
          !this.props.loading && this.props.operations.length !== 0 && this.props.order.map((el) => this._renderOperations(el))
        }

        {
          this.props.type !== 'credits' &&

          <BtnContainer
            onPress={() => this.props.onPressAll(0)}
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}>

            <View style={{
              paddingVertical: 15,
              width: '100%',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: BankTheme.color1
            }}>
              <Text style={{ color: '#fff' }}>Справки и выписки</Text>
            </View>
          </BtnContainer>
        }

      </ScrollView>
    )
  }

  _renderOperations(date) {
    return (
      <View key={date}>
        <Text style={{ paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#f2f5f7' }}>{date}</Text>
        {
          this.props.operations[date].map((operation, idx) =>
            <View key={idx} style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '300' }}>{operation.description}</Text>
                <Text style={{
                  color: '#9b9b9b',
                  marginTop: 5,
                  fontSize: 12
                }}>{moment(operation.dateTrn, 'DD.MM.YYYYTHH:mm:ss.mmm').format('HH:mm')}</Text>
              </View>
              <Text
                style={{ color: operation.amount < 0 ? 'red' : 'green' }}>{parseMoney(operation.amount, this.props.currency)}</Text>

              <View
                style={{ backgroundColor: "#f2f5f7", height: 1, position: 'absolute', left: 15, right: 0, bottom: -1 }} />
            </View>
          )
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  order: state.productPage.order,
  operations: state.productPage.operations,
  loading: state.productPage.loadingOp,
});
export default connect(mapStateToProps)(OperationsHistory);
