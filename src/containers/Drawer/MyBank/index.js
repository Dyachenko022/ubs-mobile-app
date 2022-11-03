import React from 'react';
import { connect } from 'react-redux';
import { DocumentPicker } from 'react-native-document-picker';
import { pushScreen, showModal } from '../../../utils/navigationUtils';
import { exit, changeUser, disconnectApp, saveFotoAbonent, getFotoAbonent } from '../../../api/actions';
import { RNNDrawer } from 'react-native-navigation-drawer-extension';
import {
  View,
  Image,
  Linking,
  ScrollView,
  AsyncStorage
} from 'react-native';
import TouchableOpacity from '../../../components/Touchable';
import { TextRenderer as Text } from '../../../components/TextRenderer';
import selectAvatar from './selectAvatar';
import WarningIcon from '../../../../assets/icons/attention.svg';
import Icon from 'react-native-vector-icons/Ionicons';
import IconSendMessage from '../../../../assets/icons/sendMessage.png';
import styles from './styles';
import BankTheme from '../../../utils/bankTheme';
import {openReceipt} from '../../Document/utils';
import messaging from '@react-native-firebase/messaging';
import {parseNewLines} from '../../../utils/text';
import { setAutoenrollFaceid } from '../../../reducers/login/actions';

class Drawer extends React.Component {
  constructor(props) {
    super(props);
  }

  closeDrawerWidthDelay = () => {
    RNNDrawer.dismissDrawer();
    return new Promise((resolve, reject) => setTimeout(() => resolve(), 300));
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentInsetAdjustmentBehavior='always'>
          <View style={styles.header}>
            <View
              style={{ backgroundColor: '#fff', position: 'absolute', height: 500, top: -500, left: 0, right: 0 }}
            />
            <View style={styles.aboutWrapper}>
              <TouchableOpacity
                opacity
                style={styles.aboutBtn}
                onPress={async () => {
                  await this.closeDrawerWidthDelay();
                  showModal({
                    screenName: 'unisab/AboutScreen',
                    title: `О приложении`,
                  });
                }}
              >
                <Text style={{ color: 'white', fontSize: 20 }}>i</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              opacity
              onPress={async () => {
                await this.closeDrawerWidthDelay();
                setTimeout(() =>
                  selectAvatar(file => {
                    if (!file) return;
                    this.props.dispatch(
                      saveFotoAbonent({
                        photo: file,
                        onSuccess: res => {
                          this.props.dispatch(getFotoAbonent());
                        },
                        onError: res => { }
                      })
                    );
                  }), 400);
              }}
              style={{
                flex: -1,
                alignItems: 'center',
                justifyContent: 'center',
                width: 100,
                height: 100
              }}
            >
              <View style={styles.avatarContainer}>
                {!!this.props.foto && <Image style={styles.avatar} source={{ uri: this.props.foto, cache: 'force-cache', }} />}
              </View>
            </TouchableOpacity>

            <Text style={styles.userName}>{this.props.fullname}</Text>

            {(this.props.contractDataText !== '') && (
              <View style={styles.iconAndWarningText}>
                <WarningIcon width={32} height={32} fill="orange" />
                <Text style={{paddingHorizontal: 15, fontSize: 12}}>
                  {parseNewLines(this.props.contractDataText)}
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.actionsContainer, { borderBottomWidth: 1, borderColor: '#464646' }]}>
            {BankTheme.bankMessagesUsed && (
              <TouchableOpacity
                opacity
                style={styles.action}
                onPress={async () => {
                  await this.closeDrawerWidthDelay();
                  pushScreen({
                    componentId: this.props.parentComponentId,
                    screenName: 'unisab/MessagesScreen',
                    title: `Сообщения`,
                  });
                }}
              >
                {this.props.unreadMessagesCount > 0 && (
                  <View style={styles.messagesCount}>
                    <Text style={styles.messagesCountText}>{this.props.unreadMessagesCount}</Text>
                  </View>
                )}
                <Icon name={'ios-mail-outline'} size={35} color={'#fff'} />
                <Text style={styles.actionText}>Сообщения</Text>
              </TouchableOpacity>
            )}

            {BankTheme.showNotificationsSetting &&
              <TouchableOpacity
                opacity
                style={styles.action}
                onPress={async () => {
                  await this.closeDrawerWidthDelay();
                  showModal({
                    screenName: 'unisab/NotificationsSettingsScreen',
                    title: 'Уведомления',
                  });
                }}
              >
                <Icon name={'ios-notifications-outline'} size={35} color={'#fff'} />
                <Text style={styles.actionText}>Уведомления</Text>
              </TouchableOpacity>
            }

            <TouchableOpacity
              opacity
              style={styles.action}
              onPress={async () => {
                await this.closeDrawerWidthDelay();

                pushScreen({
                  componentId: this.props.parentComponentId,
                  screenName: 'unisab/SettingsScreen',
                  title: 'Настройки',
                });
              }}
            >
              <Icon name={'ios-settings-outline'} size={35} color={'#fff'} />
              <Text style={styles.actionText}>Настройки</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.templatesContainer, { borderBottomWidth: 1, borderColor: '#464646' }]}>
            <TouchableOpacity style={styles.templatesHeader}
                              onPress={async () => {
                                await this.closeDrawerWidthDelay();
                                showModal({
                                  title: 'Шаблоны',
                                  screenName: 'unisab/TemplatesScreen'
                                });
                              }}
            >
              <Text style={styles.templatesHeaderText}>Шаблоны</Text>

              <View style={styles.templatesAction}>
                <Text style={styles.templatesActionText}>Все</Text>
                <Icon name={'ios-arrow-forward'} color={'#fff'} style={{ paddingTop: 2, marginLeft: 6 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.templatesList}>
              {this.props.templates.map(template => (
                <TouchableOpacity
                  opacity
                  key={template.id}
                  style={styles.menuAction}
                  onPress={async () => {
                    await this.closeDrawerWidthDelay();
                    if (!this.props.confAccess[template.sidDoc]) {
                      openReceipt({
                        componentId: this.props.parentComponentId,
                        id: template.id,
                      })
                    }
                    else pushScreen({
                      componentId: this.props.parentComponentId,
                      screenName: 'unisab/Document',
                      passProps: {
                        sid: 'getDocument',
                        defaultValues: {
                          'Идентификатор документа': template.id
                        }
                      }
                    });
                  }}
                >
                  <View style={styles.templateActionTextWrapper}>
                    <Text style={styles.menuActionText}>{template.kindDoc}</Text>
                    {/*<Text style={[styles.templateActionText, {color: "#7e7e7e"}]}>{template.kindDoc}</Text>*/}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.menuContainer}>

            <TouchableOpacity opacity style={styles.menuAction}
              onPress={async () => {
                await this.closeDrawerWidthDelay();
                pushScreen({
                  componentId: this.props.parentComponentId,
                  screenName: 'unisab/Document',
                  passProps: {
                    sid: 'UBS_MESSAGE',
                  },
                  title: 'Документ',
                })
              }}
            >
              <View style={styles.menuActionIcon}>
                <Image source={IconSendMessage} style={{width: 24, height: 24}} resizeMode="cover" />
              </View>
              <Text style={styles.menuActionText}>Написать в банк</Text>
            </TouchableOpacity>

            <TouchableOpacity opacity style={styles.menuAction} onPress={() => Linking.openURL('tel:'+ this.props.bankInfo.phone)}>
              <View style={styles.menuActionIcon}>
                <Icon name={'ios-call-outline'} size={30} color={'#fff'} />
              </View>
              <Text style={styles.menuActionText}>Позвонить в банк</Text>
            </TouchableOpacity>

            <TouchableOpacity opacity style={styles.menuAction} onPress={async () => {
              await this.closeDrawerWidthDelay();
              pushScreen({
                componentId: this.props.parentComponentId,
                screenName: 'unisab/BankInquiriesScreen',
                showBackButtonTitle: 'false',
              });
            }}>
              <View style={styles.menuActionIcon}>
                <Image style={{width: 30, height: 30}} source={require('../../../../assets/icons/inquiry.png')}/>
              </View>
              <Text style={styles.menuActionText}>Справки и выписки</Text>
            </TouchableOpacity>

            <TouchableOpacity
              opacity
              style={styles.menuAction}
              onPress={async () => {
                await this.closeDrawerWidthDelay();
                pushScreen({
                  componentId: this.props.parentComponentId,
                  screenName: 'unisab/NewsTabScreen',
                  passProps: {
                    header: 'native',
                    hideBottomTabs: true,
                  },
                  title: 'Новости',
                });
              }}
            >
              <View style={styles.menuActionIcon}>
                <Icon name={'ios-paper-outline'} size={28} color={'#fff'} />
              </View>
              <Text style={styles.menuActionText}>Новости</Text>
            </TouchableOpacity>

            <TouchableOpacity
              opacity
              style={styles.menuAction}
              onPress={async () => {
                await this.closeDrawerWidthDelay();

                pushScreen({
                  componentId: this.props.parentComponentId,
                  screenName: 'unisab/MapTabScreen',
                  passProps: {
                    hideBottomTabs: true
                  },
                })
              }}
            >
              <View style={styles.menuActionIcon}>
                <Icon name={'ios-pin-outline'} size={30} color={'#fff'} />
              </View>
              <Text style={styles.menuActionText}>На карте</Text>
            </TouchableOpacity>

            <TouchableOpacity
              opacity
              style={styles.menuAction}
              onPress={async () => {
                await this.closeDrawerWidthDelay();
                this.props.dispatch(setAutoenrollFaceid(false))
                this.props.dispatch(exit());
              }}
            >
              <View style={[styles.menuActionIcon, { paddingLeft: 4 }]}>
                <Icon name={'ios-log-out'} size={28} color={'#fff'} />
              </View>
              <Text style={[styles.menuActionText, { fontWeight: '500' }]}>Выход</Text>
            </TouchableOpacity>

            <TouchableOpacity
              opacity
              style={styles.menuAction}
              onPress={async () => {
                await this.closeDrawerWidthDelay();
                if (global.hasGms) {
                  messaging().deleteToken();
                }
                this.props.dispatch(disconnectApp(await AsyncStorage.getItem('registeredName')));
                this.props.dispatch(changeUser());
              }}
            >
              <View style={[styles.menuActionIcon, { paddingLeft: 4 }]}>
                <Icon name={'ios-contacts'} size={28} color={'#fff'} />
              </View>
              <Text style={[styles.menuActionText, { fontWeight: '500' }]}>Сменить пользователя</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  ...state.userInfo,
  confAccess: state.paymentsPage.configuration.length > 0 && state.paymentsPage.configuration.reduce((a, e) => {
    a[e.sid] = e.access;
    return a;
  }),
  contractDataText: state.userInfo.checkContractData.text,
  unreadMessagesCount: state.messagesPage.unreadMessagesCount,
  templates: state.templatesPage.templates.slice(0, 3),
  templatesLoading: state.templatesPage.loading,
  bankInfo: state.settingsFront.bankInfo,
});
export default connect(mapStateToProps)(Drawer);
