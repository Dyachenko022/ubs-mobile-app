import React from 'react';
import PropTypes from 'prop-types';

import {View, Image} from 'react-native'
import Touchable from '../../../components/Touchable'
import {TextRenderer as Text} from "../../../components/TextRenderer";

import styles from './styles'
import {pushScreen} from '../../../utils/navigationUtils';

export default class Payment extends React.Component {
  static propTypes = {
    data: PropTypes.array
  };
  static defaultProps = {
    data: {
      configuration: []
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.getConf = this.getConf.bind(this);
  };


  render() {
    return (
      <View style={styles.payments}>
        {
          this.props.data.map(el => {
            return (
              <Touchable style={styles.paymentWrapper} key={el.logo} underlayColor='#eee' onPress={() => {this.onSelectProvider(el.id)}}>
                <View style={styles.payment}>
                  {!!el.logo !== '' && <Image source={{uri: el.logo}} style={styles.image}/>}
                  <Text style={styles.paymenTitle}>{el.name}</Text>
                </View>
              </Touchable>
            )
          })
        }
      </View>
    )
  }

  onSelectProvider = (idService) => {

    let providers = this.props.providers.filter(el => idService === el.idService);

    pushScreen({
      componentId: this.props.parentComponentId,
      screenName: 'unisab/ModalProvider',
      title: 'Modal',
      passProps: {
        data: providers,
        defaultDocumentValues: this.props.defaultDocumentValues
      },
    });
  };

  getConf() {
    const configurationObject = this.props.data;

    const newData = this.props.sids.map(sid => ({
      ...configurationObject[sid],
      name: this.props.rusSids[sid]
    }));

    this.setState({
      data: newData
    });
  };
}
