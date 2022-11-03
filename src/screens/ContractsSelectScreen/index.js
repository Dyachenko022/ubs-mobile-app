import React from 'react';
import {connect} from 'react-redux';
import {onAuthContract} from '../../actions/onAuthContract';
import {ContractSelectPage} from 'react-native-ubs-mobile-core';
import {Navigation} from 'react-native-navigation';
import {makeLeftBackButton} from '../../utils/navigationUtils';

class ContractsSelectScreen extends React.Component {

  static options = (props) => ({
    topBar: {
      leftButtons: [
        makeLeftBackButton('contractSelectBackButton'),
      ],
    }
  })

  constructor(props) {
    super(props);
    this.navigationEvents = Navigation.events().bindComponent(this);
  }

  navigationButtonPressed({buttonId}) {
    if (buttonId === 'contractSelectBackButton') Navigation.dismissModal(this.props.componentId);
  }

  componentWillUnmount() {
     this.navigationEvents?.remove();
  }

  render() {
    return (
      <ContractSelectPage
        {...this.props}
        />
    )
  }
}

ContractsSelectScreen.defaultProps = {
  contracts: []
};

function mapStateToProps(state) {
  return {
    contracts: state.loginPage.contracts,
    loading: state.login.loading
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const {dispatch} = dispatchProps;
  return {
    ...stateProps,
    ...ownProps,

    onAuthContract: (id, response) => onAuthContract(id,response, dispatch, null, true)
  }
}

export default connect(mapStateToProps, null, mergeProps)(ContractsSelectScreen);
