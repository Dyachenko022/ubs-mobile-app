import React from 'react';
import {connect} from 'react-redux';
import {Linking, StyleSheet, View, Image, Button, Text, ScrollView, Platform} from 'react-native';
import TouchableOpacity from '../../../components/Touchable';
import Collapsible from '../../../components/Collapsible';
import Icon from 'react-native-vector-icons/Ionicons';
import { RNNDrawer } from "react-native-navigation-drawer-extension";
import {clearSession} from '../../../api/actions'
import styles from './styles';

import Currency from './Currency';
import {Navigation} from 'react-native-navigation';
import BankTheme from '../../../utils/bankTheme';
import {showModal} from '../../../utils/navigationUtils';

class Drawer extends React.Component {
  toggleDrawer = () => RNNDrawer.dismissDrawer();

  constructor(props) {
    super(props);

    this.state = {
      collapsed: true
    }
  }

  render() {
    const visibleRates = [];
    const hiddenRates = [];

    let ty = {};
    let ttyy = [];

    if (this.props.rates.ratesBank) {
      this.props.rates.ratesBank.map((el, idx) => {
        if (ty[el.type]) {
          let a = ty[el.type];
          a.push(el);
          ty[el.type] = a;
        } else {
          ty[el.type] = [el];
          ttyy.push(el.type)
        }
      });
    }

    ttyy.map((type, idx) => {
      if (idx > 0) {
        hiddenRates.push(type)
      } else {
        visibleRates.push(type)
      }
    });

    return (
      <ScrollView style={styles.container} contentContainerStyle={{paddingTop: 5}} contentInsetAdjustmentBehavior={'always'}>
        <Image source={{uri: BankTheme.images.loginPageLogo}}
               style={styles.logo}
        />
        <TouchableOpacity opacity style={styles.aboutBtn} onPress={() => {
          RNNDrawer.dismissDrawer();
          showModal({screenName: 'unisab/AboutScreen'});
        }}>
          <Text style={{ color: "#fff", fontSize: 20 }}>
            i
          </Text>
        </TouchableOpacity>

        <View style={styles.wrapper}>
          {visibleRates.map((visibleRates, index) => (
            <View key={`rates1_${index}`}>
              <Text style={{fontSize: 18, color: '#777', marginBottom: 10, textAlign: 'center'}}>{visibleRates}</Text>
              <View style={styles.currenciesWrapper}>
                {
                  ty[visibleRates].map((el, idx) => idx<=1 && (
                    <Currency
                      key={`cur1_${idx}`}
                      title={el.currency}
                      buy={el.rateBuy.toFixed(2)}
                      sell={el.rateSale.toFixed(2)}
                    />
                  ))
                }
              </View>
            </View>
          ))}
          <View style={{ /*borderWidth: 1, borderColor: 'red', */flex: 1, width: "100%" }}>

          <Collapsible collapsed={this.state.collapsed} duration={500} style={{ width: '100%' }} useNativeDriver={true}>
            {ty[visibleRates] && ty[visibleRates].length > 2 && visibleRates.map((visibleRates, index) => {
                return (
                    <View
                      key={`rates2_${index}`}
                      style={[styles.currenciesWrapper, {width: '100%', flex:1}]}
                    >
                      {
                        ty[visibleRates].map((el, idx) => idx>=2&&(
                          <Currency
                            key={`cur2_${idx}`}
                            title={el.currency}
                            buy={el.rateBuy.toFixed(2)}
                            sell={el.rateSale.toFixed(2)}
                          />
                        ))
                      }
                    </View>
                )
            })}

            {hiddenRates.map((hiddenRates, index) => (
              <View key={`hrates_${index}`}>
                <Text style={{
                  fontSize: 18,
                  color: '#777',
                  marginTop: 20,
                  marginBottom: 10,
                  textAlign: 'center'
                }}>{hiddenRates}</Text>
                {/*<View style={{ height: 1, width: 100, backgroundColor: "#777" }} />*/}
                <View style={[styles.currenciesWrapper, {paddingTop: 20}]}>
                  {
                    ty[hiddenRates].map((el, index) => (
                      <Currency
                        key={`cur3_${index}`}
                        title={el.currency}
                        buy={el.rateBuy.toFixed(2)}
                        sell={el.rateSale.toFixed(2)}
                      />
                    ))
                  }
                </View>
              </View>
            ))}
          </Collapsible>
          </View>

          {(ty[visibleRates]&&ty[visibleRates].length > 2 || !!hiddenRates.length) &&
          <TouchableOpacity style={styles.allBtl} onPress={() => {
            this.setState({
              collapsed: !this.state.collapsed
            })
          }}>
            <Text style={styles.text}>все валюты</Text>
          </TouchableOpacity>
          }
        </View>

        <View style={{flexDirection: 'row'}}>
          <Icon name={'md-chatbubbles'} size={20} color={"rgba(255,255,255,0.40)"} style={{marginRight: 10}}/>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${this.props.bankInfo.phone}`)}>
            <Text style={styles.btn}>
              {this.props.bankInfo.phone}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => Linking.openURL(`mailto:${this.props.bankInfo.email}`)}
                          style={{marginLeft: 30}}>
          <Text style={styles.btn}>
            {this.props.bankInfo.email}
          </Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Icon name={'ios-globe-outline'} size={20} color={"rgba(255,255,255,0.40)"} style={{marginRight: 10}}/>

          <TouchableOpacity onPress={() => Linking.openURL(this.props.linkLogo)}>
            <Text style={[styles.btn, {marginTop: 1}]}>{this.props.linkLogo}</Text>
          </TouchableOpacity>
        </View>

        {/*  Сейчас нет банков с разными регионами
        {this.props.changeRegion && <View style={{flexDirection: 'row', marginTop: 20}}>
          <TouchableOpacity onPress={() => this.props.dispatch(clearSession())}>
            <Text style={[styles.btn, {marginTop: 1}]}>Сменить регион</Text>
          </TouchableOpacity>
        </View> }
        */}

      </ScrollView>
    );
  }
}

Drawer.defaultProps = {
  rates: {
    ratesBank: []
  },
  changeRegion: false,
};

const mapStateToProps = (state) => ({
  rates: state.loginPage.rates,
  changeRegion: state.api.changeRegion,
  bankInfo: state.settingsFront.bankInfo,
  linkLogo: state.settingsFront.linkLogo,
});

export default connect(mapStateToProps)(Drawer);
