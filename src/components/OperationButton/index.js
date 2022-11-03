import React from 'react';

import {View, StyleSheet, Dimensions} from 'react-native';
import TouchableOpacity from '../../components/Touchable';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
import {TextRenderer as Text} from '../TextRenderer';
import Icon from 'react-native-vector-icons/Ionicons';
import BankTheme from '../../utils/bankTheme';

let styles = StyleSheet.create({
  operationButton: {
    // // marginLeft: -50,
    // // paddingLeft: 70,
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    //
    // alignItems: 'center',
    //
    // flexDirection: "row",
    //
    // // borderBottomWidth: 1

    width: '42.5%',
    height: 36,

    borderColor: BankTheme.color1,
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 7,
    marginVertical: 10,
    marginLeft: '5%',
  },

  icon: {
    width: 24,
    height: 24,
    // marginRight: 10
  },

  operationButtonText: {
    textAlign: 'center',
    // marginRight: 15,
    fontSize: 12,
    // fontWeight: '400'
  },

  operationButtonLine: {
    // height: 1,
    // width: viewportWidth - 15,
    // backgroundColor: "#eee",
    //
    // position: 'absolute',
    // bottom: 0,
    // right: 0
  }
});

export default class OperationButton extends React.Component {
  static defaultProps = {
    onPress: () => {},
    icon: false
  };

  render(){
    let {icon, onPress} = this.props;
    return(
      <View style={[styles.operationButton, {...this.props.buttonWrapperStyle}]}>
        <TouchableOpacity style={[{flex: 1,flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between'}, this.props.buttonStyle]}
                          onPress={onPress}
        >
          {icon && icon({style: styles.icon})}
          <Text style={styles.operationButtonText}>{this.props.text}</Text>
        </TouchableOpacity>

        { !this.props.noLine &&
          <View style={styles.operationButtonLine}/>
        }
      </View>
    )
  }
}
