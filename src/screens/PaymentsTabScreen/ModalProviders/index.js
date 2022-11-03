import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'

import {ScrollView, View, TouchableHighlight, Image} from 'react-native'
import {TextRenderer as Text} from "../../../components/TextRenderer";
import {search} from '../../../reducers/paymentsPage/actions'

import styles from './styles'
import {pushScreen} from '../../../utils/navigationUtils';
import {Navigation} from 'react-native-navigation';

class ModalProviders extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    defaultDocumentValues: {}
  };

  state = {
    data: []
  };

  componentDidMount() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [],
        title: {
          component: {
            name: 'unisab/SearchTopBar',
            passProps: {
              parentComponentId: this.props.componentId,
            }
          }
        },
      },
    });
    this.props.dispatch(search(''))
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {
          this.props.data
            .filter(el => {
              return (new RegExp(this.props.search, 'gi'))
                .test(el.name)
            })
            .map(el => {
              return (
                <TouchableHighlight style={styles.providerWrapper} key={el.logo} underlayColor='#eee' onPress={() => {
                  pushScreen({
                    componentId: this.props.componentId,
                    screenName: 'unisab/Document',
                    passProps: {
                      sid: 'UBS_SERVICE_PAYMENT',
                      defaultValues: {
                        'Документ.Идентификатор провайдера': el.id,
                        ...this.props.defaultDocumentValues
                      }
                    }
                  })
                }}>
                  <View style={styles.provider}>
                    {!!el.logo && <Image source={{uri: el.logo}} style={styles.image}/>}
                    <View style={{flex: 1, flexWrap: 'wrap'}}>
                      <Text numberOfLines={1} style={styles.providerTitle}>{el.name}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )
            })
        }
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => ({
  search: state.paymentsPage.providerSearch
});
export default connect(mapStateToProps)(ModalProviders);
