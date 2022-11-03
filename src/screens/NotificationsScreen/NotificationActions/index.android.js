import React from 'react';
import PropTypes from 'prop-types';
import Share from 'react-native-share';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dialog } from 'react-native-ui-lib';
import Clipboard from '@react-native-community/clipboard';

export default class NotificationsActions extends React.Component {

  state = {
    isDialogVisible: false,
    notification: null,
  }

  show = (notification) => {
    this.setState({
      isDialogVisible: true,
      notification,
    });
  }

  onDialogDismiss = () => {
    this.setState({
      isDialogVisible: false,
      notification: null,
    });
  }

  copy = () => {
    this.setState({isDialogVisible: false});
    Clipboard.setString(this.state.notification.text);
  }

  share = () => {
    this.setState({isDialogVisible: false});
    Share.open({ message: this.state.notification.text, subject: this.state.notification.title });
  }

  delete = () => {
    this.setState({isDialogVisible: false});
    this.props.deleteNotification(this.state.notification.guid);
  }

  render() {
    return (
      <Dialog
        migrate
        bottom
        visible={this.state.isDialogVisible}
        containerStyle={styles.dialog}
        width="100%"
        panDirection={'down'}
        onDismiss={this.onDialogDismiss}
      >
        <View>
          <TouchableOpacity style={styles.button} onPress={this.copy}>
            <Text style={styles.text}>Копировать</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={this.share}>
            <Text style={styles.text}>Поделиться</Text>
          </TouchableOpacity>

          {this.state.notification?.typeOfNotification !== 'sms' && (
          <TouchableOpacity style={styles.button} onPress={this.delete}>
            <Text style={{...styles.text, color: 'red'}}>Удалить</Text>
          </TouchableOpacity>
          )}
        </View>

      </Dialog>
    );
  }
}

NotificationsActions.propTypes = {
  deleteNotification: PropTypes.func,
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 220,
    padding: 20,
  },
  button: {
    width: '100%',
    padding: 20,
  },
  text: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
  }
});