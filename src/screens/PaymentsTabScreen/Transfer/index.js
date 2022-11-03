import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {View, Image, Alert} from 'react-native'
import Touchable from '../../../components/Touchable';
import {TextRenderer as Text} from '../../../components/TextRenderer';
import {pushScreen} from '../../../utils/navigationUtils';
import styles from './styles'

export default class Transfer extends React.Component {
  static propTypes = {
    data: PropTypes.array
  };
  static defaultProps = {
    data: {
      configuration: [],
    },
    defaultDocumentValues: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.getConf = this.getConf.bind(this);
  };

  componentDidMount() {
    this.getConf();
  };

  componentDidUpdate(nextProps) {
    if (!_.isEqual(nextProps.data, this.props.data)) {
      this.getConf(nextProps)
    }
  }

  getConf(props = this.props) {
    const configurationObject = this.props.data;

    const newData = props.sids.map(sid => ({
      ...configurationObject[sid],
      name: props.rusSids[sid]
    }));

    this.setState({
      data: newData
    });
  };

  render() {
    return (
      <View style={styles.payments}>
        {
          this.state.data.filter(el => {
            return el.access > 0;
          }).map(el => {
            return (
              <Touchable key={el.logo} style={styles.paymentWrapper} underlayColor="#eee" onPress={() => {
                pushScreen({
                    componentId: this.props.parentComponentId,
                    screenName: 'unisab/Document',
                    passProps: {
                      sid: el.sid,
                      defaultValues: this.props.defaultDocumentValues
                    },
                });
              }}>
                <View style={styles.payment}>
                  {el.logo !== '' && <Image source={{uri: el.logo}} style={styles.image}/>}
                  <Text style={styles.paymenTitle}>{el.name}</Text>
                </View>
              </Touchable>
            )
          })
        }
      </View>
    )
  }
}
