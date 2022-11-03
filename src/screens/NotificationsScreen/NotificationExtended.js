import React, {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback, Modal, Linking, PanResponder
} from 'react-native';
import Interactable from 'react-native-interactable';
import moment from 'moment';
import BankTheme from '../../utils/bankTheme';
import FileAttachment from '../../components/FileAttachment';
import HTML from 'react-native-render-html';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
};

const MAX_PANEL_HEIGHT = Screen.height * 0.8;


export default function NotificationExtendedWrapper(props) {
  if (!props.notification || !props.isVisible) return null;
  return (
    <NotificationExtended
      {...props}
    />
  );
}

function NotificationExtended(props) {
  const [attachments, setAttachments] = useState([]);
  const [contentHeight, setContentHeight] = useState(0);

  const deltaY = useRef(new Animated.Value(Screen.height)).current;
  const deltaX = useRef(new Animated.Value(0)).current;

  useEffect(async () => {
    if (props.notification.hasAttachments) {
      const files = await props.getAttachments(props.notification.guid);
      setAttachments(files);
    }
  }, []);

  const panelRef = useRef(null);

  const onSnap = useCallback((e) => {
    if (e.nativeEvent.index === 0) {
      props.onClose();
    }
  }, []);

  const onContentLayout = useCallback((e) => {
    let height = e.nativeEvent.layout.height;
    if (height < 300) {
      height = 300;
    } else if (height > MAX_PANEL_HEIGHT) {
      height = MAX_PANEL_HEIGHT;
    }
    setContentHeight(height);
  }, []);

  const onClose = useCallback(() => {
    panelRef?.current.snapTo({ index: 0});
  }, []);

  const onPressRead = useCallback(() => {
    if (props.notification.unread) {
      props.setMessageRead(props.notification.guid);
    }
    onClose();
  }, []);

  return (
    <Modal
      visible={props.isVisible}
      transparent={true}
      animationType="fade"
      onShow={() => panelRef?.current.snapTo({ index: 1})}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={styles.background}
        />
      </TouchableWithoutFeedback>

      <Interactable.View
        ref={panelRef}
        verticalOnly={true}
        onSnap={onSnap}
        snapPoints={[{y: Screen.height + 100} , { y: Screen.height - contentHeight } ]}
        initialPosition={{ y: Screen.height + 100, x:0, }}
        animatedValueY={deltaY}
        animatedValueX={deltaX}
      >
        <View style={{ ...styles.scrollContainer, height: contentHeight + 100 }}>
          <Text style={styles.header}>{props.notification.title}</Text>
          <Text style={styles.timeHeader}>{moment(props.notification.time).format('DD MM YYYY HH:mm')}</Text>
          <ScrollView
            style={{ height: contentHeight }}
            contentContainerStyle={styles.dialog}
          >
            <View style={{minHeight: 200}} onLayout={onContentLayout}>
              <HTML
                classesStyles={{
                  in_container: {
                    color: 'gray',
                    paddingLeft: 5,
                  }
                }}
                key={'msg-html-description'}
                containerStyle={{backgroundColor: 'transparent', flex: 1, color: 'green'}}
                html={`<div class="in_container">${props.notification.text}</div>`}
                onLinkPress={(e, url) => Linking.openURL(url)}
              />

              <ScrollView horizontal>
                {attachments.map(attachment => (
                  <FileAttachment
                    key={attachment.fileUrl}
                    fileName={attachment.fileName}
                    fileUrl={attachment.fileUrl}
                  />
                ))}
              </ScrollView>

            </View>
            <TouchableOpacity style={styles.buttonSetRead}
                              onPress={onPressRead}
            >
              <Text style={{color: 'white'}}>Прочитано</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Interactable.View>
    </Modal>
  );
}

NotificationExtended.propTypes = {
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  getAttachments: PropTypes.func,
  notification: PropTypes.shape({
      guid: PropTypes.string,
      type: PropTypes.string,
      title: PropTypes.string,
      text: PropTypes.string,
      unread: PropTypes.bool,
      time: PropTypes.string,
      hasAttachments: PropTypes.bool,
  }),
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    minHeight: 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  buttonSetRead: {
    alignContent: 'flex-end',
    width: '100%',
    backgroundColor: BankTheme.color1,
    marginBottom: 15,
    marginTop: 20,
    borderRadius: 15,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 10,
  },
  timeHeader: {
    fontSize: 10,
    color: 'gray',
    paddingBottom: 15,
    paddingLeft: 10,
  },
  text: {
    fontSize: 14,
    paddingBottom: 10,
  },
  background: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(127,127,127, 0.4)',
  },
  scrollContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  }
});
