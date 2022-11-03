import React from 'react';
import {connect} from 'react-redux';
import {
  Platform,
  View,
  Image,
  TouchableHighlight
} from "react-native";
import {TextRenderer as Text} from '../../components/TextRenderer/index';
import BadgeMenu from '../../components/BadgeMenu';
import Icon from 'react-native-vector-icons/Ionicons';

import {CHANGE_TAB} from '../../reducers/myFinancesPage/actionTypes'

import styles from "./styles";


class Header extends React.Component {
  render() {
    let {
      dispatch,
      activeTab
    } = this.props;
    return (
      <View style={styles.header}>
        <BadgeMenu
          parentComponentId={this.props.parentComponentId}
        />

        <View style={{position: 'absolute', width: '100%', height: 30, alignItems: 'center', justifyContent: 'center'}}>
          <View style={styles.headerButtonsWrapper}>

            <TouchableHighlight
              underlayColor={'rgba(255,255,255,.8)'}
              onPress={() => {
                dispatch({type: CHANGE_TAB, activeTab: 'costs'})
              }}
              style={[activeTab === 'costs' ? styles.headerButtonActive : styles.headerButton, {
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5
              }]}>

              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={activeTab === 'costs' ? styles.headerButtonTextActive : styles.headerButtonText}>

                  Расходы

                </Text>
              </View>
            </TouchableHighlight>


            <TouchableHighlight
              underlayColor={'rgba(255,255,255,.8)'}
              onPress={() => {
                dispatch({type: CHANGE_TAB, activeTab: 'available'})
              }}
              style={[activeTab === 'available' ? styles.headerButtonActive : styles.headerButton, {
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                borderLeftWidth: 0
              }]}>

              <Text style={activeTab === 'available' ? styles.headerButtonTextActive : styles.headerButtonText}>

                Средства

              </Text>

            </TouchableHighlight>

          </View>
        </View>

        <View style={Platform.OS === 'ios' ? {width: 50} : {flex: 1}}/>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  activeTab: state.myFinancesPage.activeTab
});
export default connect(mapStateToProps)(Header);
