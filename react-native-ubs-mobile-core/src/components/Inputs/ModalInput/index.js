import React from 'react'

import {
  Platform,
  Modal,
  ActivityIndicator,

  View,
  TouchableWithoutFeedback
} from 'react-native'
import IconInput from '../IconInput';
import Touchable from '../../Touchable';
import {TextRenderer as Text} from '../../TextRenderer';
import BankTheme from '../../../bankTheme';

export default class ModalInput extends React.Component {
  render() {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={this.props.visible}

        onRequestClose={() => {
          this.props.close()
        }}
      >
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TouchableWithoutFeedback onPress={this.props.close}><View style={{
            backgroundColor: 'rgba(0,0,0,.25)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}/></TouchableWithoutFeedback>

          <View style={{paddingTop: 20, backgroundColor: "#fff", borderRadius: Platform.OS === 'ios' ? 10 : 3}}>

            {
              this.props.title &&
              <View style={{paddingBottom: 20}}>
                <Text style={{textAlign: 'center', fontSize: 16, fontWeight: '500'}}>
                  {this.props.title}
                </Text>
              </View>
            }

            <IconInput
              styles={{width: 300, marginHorizontal: 20}}
              inputProps={{
                autoFocus: true,
                value: this.props.inputValue,
                onChangeText: this.props.onChangeInput,
                clearButtonMode: 'while-editing',
                disabled: this.props.isLoading
              }}
            />

            <View style={{borderTopWidth: 1, borderColor: "#ddd", marginTop: 40, flexDirection: 'row'}}>
              <Touchable onPress={this.props.close} style={{flex: 1, height: 50, justifyContent: 'center'}}>
                <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                  <Text style={{textAlign: 'center', fontSize: 16, color: BankTheme.color1}}>
                    Отмена
                  </Text>
                </View>
              </Touchable>

              <View style={{width: 1, height: '100%', backgroundColor: "#ddd"}}/>

              <Touchable onPress={this.props.onDone} style={{flex: 1, height: 50, justifyContent: 'center'}}>
                <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                  <Text style={{textAlign: 'center', fontSize: 16, color: BankTheme.color1, fontWeight: '500'}}>
                    Сохранить
                  </Text>
                </View>
              </Touchable>
            </View>

            {this.props.isLoading && (
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(100,100,100,0.2)'
              }}>
                <ActivityIndicator size="large" color={BankTheme.color1}/>
              </View>
            )}
          </View>
        </View>

      </Modal>
    )
  }
}
