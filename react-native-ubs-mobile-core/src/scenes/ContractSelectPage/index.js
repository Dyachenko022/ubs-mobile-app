import React from 'react';
import PropTypes from 'prop-types';

import {
  Platform,
  Text,
  Image,
  ImageBackground,
  View,
  ScrollView,
  TextInput,
  Button,
  ActivityIndicator,

  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {authContract} from '../../coreApi';
import styles from './styles';


let navigator;
export class CloseModalButton extends React.Component {
  render() {
    return(
      <TouchableOpacity
        onPress={() => this.props.navigator.dismissModal()}
      >
        {this.props.button}
      </TouchableOpacity>
    )
  }
}


export default class ContractSelectPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    navigator = this.props.navigator;
  }

  static navigatorButtons = {
    rightButtons: Platform.OS === 'ios' ? [
      {
        component: 'ContractsSelectScreen/CloseModalButton',
        // title: 'Edit', // for a textual button, provide the button title (label)
        id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        passProps: {
          button: <Text style={{color:"#FFF"}}>Закрыть</Text>,
          navigator: navigator
        }
      }
    ] : []
  };

  render() {
    const loading = this.props.loading ?
      <View key={2} style={{
        display: this.props.loading ? 'flex' : 'none',
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

        position: 'absolute',
        zIndex: 2,
        width: '100%',
        height: '100%',

        backgroundColor: 'rgba(255,255,255,.5)'
      }}>
        <ActivityIndicator size="large" color={global.coreUiColor}/>
      </View>
      :
      null;

    return (
      <View style={styles.background}>
        <ScrollView contentContainerStyle={{paddingTop: 40}}>
        {this.props.contracts.map(contract => (
          <TouchableOpacity
            key={contract.id}
            style={styles.btn}
            onPress={() => {
                authContract(contract.id)
                .then((response) => this.props.onAuthContract(contract.id, response))

            }}>
            <Icon name={'user-circle-o'} color={'#2a71b3'} size={50}/>
            <Text style={{fontSize: 16, color: '#3e3e3e', textAlign: 'center'}}>{contract.name}</Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
        {loading}
      </View>
    )
  }
}

ContractSelectPage.propTypes = {
  contracts: PropTypes.array,
  onAuthContract: PropTypes.func.isRequired,
}
