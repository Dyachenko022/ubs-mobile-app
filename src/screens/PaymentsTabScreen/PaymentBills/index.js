import React from 'react';
import PropTypes from 'prop-types';
import {parseMoney} from '../../../utils/text';
import {View, Image, FlatList, Platform} from 'react-native'
import Touchable from '../../../components/Touchable'
import {TextRenderer as Text} from "../../../components/TextRenderer";
import {pushScreen} from '../../../utils/navigationUtils';
import styles, {Screen} from './styles'

export default class Payment extends React.Component {

  state = {
    data: []
  };

  openDocument = (idProvider, uin) => {
    pushScreen({
      componentId: this.props.parentComponentId,
      screenName: 'unisab/Document',
      passProps: {
        sid: 'UBS_SERVICE_PAYMENT',
        defaultValues: {
          'Документ.Идентификатор провайдера': idProvider,
          'Документ.УИН': uin
        }
      }
    })
  };

  render() {
    return (
      <View style={styles.payments}>
        <FlatList //style={styles.list}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={this.props.data}
          // extraData={this.state}
          keyExtractor={(el, idx) => `${el.date}${el.amount}${el.nameCategory}-${idx}`}
          renderItem={({item}) => (
            <Touchable style={styles.paymentWrapper} key={item.logo} underlayColor='#eee' onPress={() => {
              this.openDocument(item.idProvider, item.uin,);
            }}>
              <View style={styles.payment}>
                {!!item.logo !== '' && <Image source={{uri: item.logo}} style={styles.image}/>}
                <Text style={styles.paymenTitle}>{item.nameCategory.replace(' ', '\n')}</Text>
              </View>

              <View style={styles.info}>
                <Text style={{color: '#fff', fontSize: 12}}>{`до: ${item.date}`}</Text>
                <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 16}}>{parseMoney(item.amount, item.currency)}</Text>
              </View>
            </Touchable>
          )}
          getItemLayout={(data, index) => (
            {
              offset: Screen.width/2-25*index,
              length: Screen.width/2-25,
              index,
            }
          )}
        />
      </View>
    )
  }

  static propTypes = {
    data: PropTypes.array
  };
  static defaultProps = {
    data: {
      configuration: []
    }
  };
}
