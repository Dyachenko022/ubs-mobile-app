import React from 'react';
import {connect} from 'react-redux';
import {
  View
} from 'react-native';
import Document from '../../containers/Document';


class DocumentScreen extends React.Component {
  static defaultProps = {
    sid: '',
    defaultValues: {},
    isDescriptionShown: true,
    action: '',
    type: ''
  };

  static options = {
    bottomTabs: {
      visible: false,
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Document sid={this.props.sid}
                  initialSidRequest={this.props.initialSidRequest}
                  defaultValues={this.props.defaultValues}
                  isDescriptionShown={this.props.isDescriptionShown}
                  action={this.props.action}
                  type={this.props.type}
                  componentId={this.props.componentId}
        />
      </View>
    );
  }
}


export default connect()(DocumentScreen);
