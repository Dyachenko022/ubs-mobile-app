import React from 'react';
import {connect} from 'react-redux';
import { Navigation } from 'react-native-navigation';
import {
  ScrollView, View, Button
} from 'react-native';
import {IconInput} from '../../components/Inputs';
import TouchableOpacity from '../../components/Touchable';
import {TextRenderer as Text} from '../../components/TextRenderer';
import {fetch, save, setValue} from '../../reducers/notificationsSettings/actions';

import styles from './styles'
import {appColors} from '../../utils/colors'
import {makeLeftBackButton} from '../../utils/navigationUtils';
import BankTheme from '../../utils/bankTheme';


const Field = (props) => (
  <View key={props.doc.type} style={styles.field}>
    <Text style={styles.inputTitle}>{props.doc.type}</Text>
    <IconInput
      inputProps={{
        value: props.doc.number,
        onChangeText: (text) => props.dispatch(setValue({type: props.doc.type, value: text}))
      }}
      placeholder={props.doc.type}
    />
  </View>
);

class NotificationsScreen extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount() {
    this.props.dispatch(fetch());
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        leftButtons: [
          makeLeftBackButton('notificationModalBack'),
        ]
      }
    });
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    if (this.navigationEventListener) this.navigationEventListener.remove();
  }

  navigationButtonPressed({ buttonId }) {
    Navigation.dismissModal(this.props.componentId);
  }

  render(){
    return(
      <View style={{flex: 1, backgroundColor: appColors.background}}>
        <ScrollView style={styles.container}>
          {
            Object.keys(this.props.groups).map(groupName => (
              <View style={styles.group}>
                <View><Text style={styles.groupTitle}>{groupName}</Text></View>
                <View>
                  {this.props.groups[groupName].map(doc => <Field doc={doc} dispatch={this.props.dispatch}/>)}
                </View>
              </View>
            ))
          }
        </ScrollView>

        <TouchableOpacity
          activeOpacity={.8}
          style={{ opacity: this.props.isLoading ? .8 : 1, backgroundColor: BankTheme.color1, height: 56, alignItems: 'center', justifyContent: 'center' }}
          disabled={this.props.isLoading}
          onPress={() => {
            this.props.dispatch(save({docs: this.props.docs}));
            Navigation.dismissAllModals();
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>Сохранить</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const groups = {};

  state.notificationsSettings.docs.forEach(doc => {
    if (!doc.group) return;

    if (!groups[doc.group]) {
      groups[doc.group] = [];
    }

    groups[doc.group].push(doc);
  });

  return {
    groups,
    docs: state.notificationsSettings.docs,
    isLoading: state.notificationsSettings.isLoading
  }
};

export default connect(mapStateToProps)(NotificationsScreen);
