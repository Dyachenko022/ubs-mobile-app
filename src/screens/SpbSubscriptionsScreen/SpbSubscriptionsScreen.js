import React, { useState, useEffect, useCallback, useRef } from 'react';

import { View,  AsyncStorage, TouchableOpacity, Text, SafeAreaView, Image, FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native';

import SbpLogo from '../../../assets/icons/logo-sbp.png';
import LeftSwipeIcon from '../../../assets/icons/leftSwipe.png';

import SwipeOut from '../../components/SwipeOut';

import { appColors } from '../../utils/colors';
import moment from 'moment';

import { pushScreen } from '../../utils/navigationUtils';

import { myFetch } from '../../api/actions';

import { useSelector } from 'react-redux';

import styles from './styles';

const SbpSubsctiptionsScreen = (props) => {

  const [subscriptions, setSubscriptions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const swipeableRefs = useRef([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSubscriptions().then(response => {
      setSubscriptions(response.subscriptions);
      setRefreshing(false);
    })
  }, []);

  const { api } = useSelector(state => state);

  useEffect(() => {
    fetchSubscriptions().then(response => {
      setLoading(false);
      setSubscriptions(response.subscriptions)
    })
  }, [])

  const fetchSubscriptions = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'UbsJWT': await AsyncStorage.getItem('jwt'), //new API
      'sidRequest': 'subscriptions'
    }
    try {
      return myFetch(api.apiRoute + 'execute', {body: { 'sidRequest': 'subscriptions' }, headers, method: 'POST'})
    } catch (error) {
      console.log(error)
      Alert.alert('Ошибка', error.textResult)
    }
  }

  const recenterSwipeable = (id = null ) => {
    if ( id === null ) {
      swipeableRefs.current.map(item => {
        item.recenter();
      })
    } else [
      swipeableRefs.current.map((item, index) => {
        index !== id && item.recenter();
      })
    ]
  }

  const ListItem = ({item}) => {
    const rightButtons = [
      item.state === 0 &&
      <TouchableOpacity style={[styles.itemRightButtonStyle, {backgroundColor: appColors.yellow}]}
                        onPress={() => {
                          pushScreen({
                            componentId: props.componentId,
                            screenName: 'unisab/Document',
                            title: 'Изменение счета',
                            passProps: {
                              sid: 'UBS_SBP_SUBSCR_CHANGE',
                              defaultValues: {
                                'Идентификатор подписки': item.id,
                                'Действие': 'Изменение счета',
                                'Код вида документа': 'UBS_SBP_SUBSCR_CHANGE'
                              }
                            },
                          })
                        }}>
        <Text style={{color: '#fff', textAlign: 'center'}}>
          Изменить счет
        </Text>
      </TouchableOpacity>,

      <TouchableOpacity style={[styles.itemRightButtonStyle, {backgroundColor: appColors.red}]}
                        onPress={() => {
                          pushScreen({
                            componentId: props.componentId,
                            screenName: 'unisab/Document',
                            title: 'Удаление подписки',
                            passProps: {
                              sid: 'UBS_SBP_SUBSCR_CHANGE',
                              defaultValues: {
                                'Идентификатор подписки': item.id,
                                'Действие': 'Удаление подписки',
                                'Код вида документа': 'UBS_SBP_SUBSCR_CHANGE'
                              }
                            },
                          })
                        }}>
        <Text style={{color: '#fff', textAlign: 'center'}}>
          Удалить
        </Text>
      </TouchableOpacity>
    ]
    return (
      <SwipeOut rightButtons={rightButtons} 
                buttonsWidth={90}
                style={styles.swipeableItemContainer}
                onSwipeStart={(id) => recenterSwipeable(id)}
                onRef={(ref) => {
                  swipeableRefs.current.push(ref)
                  return swipeableRefs.current.length - 1;
                }}>
        <View style={{padding: 10}}>
          <Text style={styles.headerText}>{item.account}</Text>
          
          <Text>
            Добавлен: {moment(item.timeCreate).format('DD.MM.YYYY')}
          </Text>

          <Text style={styles.subText}>
            {item.note}
          </Text>
        </View>
      </SwipeOut>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <FlatList ListFooterComponent={() => {
            return (
              <View style={{padding: 5, 
                            alignItems: 'center'}}>
                {(subscriptions.length === 0) ? (
                    <View style={{flex: 1}}>
                      <Text>
                        {'У Вас нет подписок, подключенных к СБПэй. \nПодписку можно оформить у поставщика услуг'}
                      </Text>
                    </View>
                  ) : (
                    <>
                      <Text style={{ textAlign: 'center' }}>
                        {'Для выполнения операций с подпиской\nпроведите пальцем\nот правого края к левому'}
                      </Text>
                      <Image source={LeftSwipeIcon} style={{ width: 30, height: 30, marginTop: 16}} />
                    </>
                  )
                }
                <Image source={SbpLogo} style={{ marginTop: 16}} />
              </View>
            )
          }}
          renderItem={ListItem}
          onScrollBeginDrag={() => recenterSwipeable()}
          data={subscriptions}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} />
        </View>
      )}
    </SafeAreaView>
  )
}

export default SbpSubsctiptionsScreen;
