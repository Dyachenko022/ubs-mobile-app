import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity, ScrollView, Platform, Image, RefreshControl, Dimensions, SafeAreaView} from 'react-native';
import {Button, Dialog} from 'react-native-ui-lib';
import SvgUri from 'react-native-svg-uri';
import ProcessedIcon from '../../../assets/icons/obrabotan.svg';
import InProcessingIcon from '../../../assets/icons/v_obrabotke.svg';
import BankTheme from '../../utils/bankTheme';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
};

export default class BankInquiriesScreen extends React.Component {

  static options = {
    bottomTabs: {
      visible: false,
    },
    topBar: {
      title: {
        text: 'Справки и выписки',
      }
    }
  };

  state = {
    isDialogVisible: false,
  }

  componentDidMount() {
    this.props.fetchOrderedInquiries();
  }

  onRefresh = () => {
    this.props.fetchOrderedInquiries();
  }

  inquiryToOrderSelected = (inquiry) =>{
    this.setState({isDialogVisible: false});
    setTimeout( () => this.props.inquiryToOrderSelected(inquiry), 400);
  }

  renderInquiriesToOrder() {
    return (
      <View>
        {this.props.inquiriesToOrder.map(item =>
          <TouchableOpacity
            style={{width: '100%', paddingTop: 15, paddingLeft: 15, paddingRight: 25, flexDirection: 'row', alignItems: 'center'}}
            onPress={() => this.inquiryToOrderSelected(item)}
          >
            <Image style={{width: 32, height: 32}} source={require('../../../assets/icons/inquiry.png')}/>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  renderOrderedInquiries() {
    return (
      <View>
        {this.props.orderedInquiries.map(item =>
          <View>
            <TouchableOpacity style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 10, alignItems: 'center', paddingLeft: 15,
              borderColor: '#9b9b9b', borderBottomWidth: 1, width:'100%',}}
              onPress={() => this.props.openOrderedInquiry(item.id)}
            >
              <SvgUri
                width={16}
                height={16}
                source={item.stateCode === 101 ? ProcessedIcon : InProcessingIcon }
                color={BankTheme.color1}
              />
              <Image style={{width: 30, height: 30}} source={require('../../../assets/icons/inquiry.png')}/>
              <View style={{flexDirection: 'column', width: Screen.width - 40}}>

                  <Text style={{fontSize: 16, flexShrink: 1 }}>
                    {item.kindDoc}
                  </Text>

                <Text style={{fontSize: 12, color: '#9b9b9b'}}>
                  Действительна до {item.date}</Text>
              </View>
            </TouchableOpacity>
          </View>
         )}
      </View>
    );
  }

  render() {
    const height = (this.props.inquiriesToOrder.length + 1) * 40 +  30;
    return (
      <SafeAreaView
        style={{width: '100%', height: '100%', backgroundColor: 'white'}}
      >
        <ScrollView style={{width: '100%', height: '95%'}}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.onRefresh}
            />
          }
        >
            {this.props.orderedInquiries.length > 0 ?
              this.renderOrderedInquiries()
            :
              <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{textAlign: 'center', padding: 20}}>
                  {'Заказанных справок и выписок нет. \r\nЗакажите справку или выписку, нажав на кнопку "Заказать"'}
                </Text>
              </View>
            }

            <Dialog
              migrate
              bottom
              visible={this.state.isDialogVisible}
              onDismiss={() => this.setState({isDialogVisible: false})}
              width="100%"
              containerStyle={{
                backgroundColor: 'white',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                height,
              }}
              panDirection={'down'}
              supportedOrientations={['portrait']} // iOS only
            >
              {this.renderInquiriesToOrder()}
            </Dialog>

        </ScrollView>
        <View style={{justifyContent: 'center', height:'6%'}}>
          <Button label='Заказать'
                  style={{width: '100%', height: '100%',  borderRadius: 0, fontSize: 16, backgroundColor: BankTheme.color1}}
                  onPress={() => this.setState({isDialogVisible: true})}
          />
        </View>
      </SafeAreaView>
    )
  }

}

BankInquiriesScreen.propTypes = {
  inquiryToOrderSelected: PropTypes.func,
  fetchOrderedInquiries: PropTypes.func,
  inquiriesToOrder: PropTypes.array,
  orderedInquiries: PropTypes.array,
  isLoading: PropTypes.bool,
}

BankInquiriesScreen.defaultProps = {
  inquiriesToOrder: [],
  orderedInquiries: [],
  isLoading: false,
}
