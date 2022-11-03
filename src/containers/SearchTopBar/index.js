import React from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import {IconInput} from '../../components/Inputs';
import Icon from 'react-native-vector-icons/Ionicons';
import {search} from '../../reducers/paymentsPage/actions'

class SearchTopBar extends React.Component {

  render() {
    return (
      <View style={styles.container}>
          <IconInput
            inputProps={{
              onChangeText: (text) => this._onChangeText(text)
            }}
            styles={{height: 35, width: '85%'}}
            placeholder={'Поиск операций'}
            iconLeft={(iconProps) => <Icon name={'ios-search'} size={16} color={"#ddd"} {...iconProps}/>}
          />
      </View>
    );
  }

  _onChangeText = (text) => {
    this.props.dispatch(search(text))
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: '100%',
    paddingHorizontal: 16,
    width: Dimensions.get('window').width - 60,
  },
});

export default connect()(SearchTopBar);
