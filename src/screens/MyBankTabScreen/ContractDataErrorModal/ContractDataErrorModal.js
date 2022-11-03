import React from 'react';
import PropTypes from 'prop-types';
import {Modal, View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import WarningIcon from '../../../../assets/icons/oragngeWarningIcon.png';
import CrossIcon from '../../../../assets/icons/cross.svg';
import {parseNewLines} from '../../../utils/text';


export default function ContractDataErrorModal(props) {

  return (
      <View style={styles.backgroundLayout}>
        <View style={styles.container}>
          <View style={styles.absoluteIcon}>
            <Image source={WarningIcon} style={{width: 80, height: 80}}/>
          </View>
          <View style={styles.whiteBackgroundContainer}>
            <Text>
              {parseNewLines(props.text)}
            </Text>
          </View>
          <View style={styles.blackBackgroundContainer}>
            <TouchableOpacity onPress={props.onCloseModal}>
              <View style={styles.iconAndText}>
                <CrossIcon width={24} height={24} stroke="lightgray" />
                <Text style={{color: 'lightgray', textAlign: 'center'}} a>
                  Закрыть
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  )
}

ContractDataErrorModal.propTypes = {
  visible: PropTypes.bool,
  text: PropTypes.string,
  onCloseModal: PropTypes.func,
  shouldLogout: PropTypes.bool,
};

const styles= StyleSheet.create({
  backgroundLayout: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '80%',
    zIndex: 1,
    borderRadius: 8,
  },
  absoluteIcon: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
    zIndex: 3,
  },
  whiteBackgroundContainer: {
    backgroundColor: 'white',
    minHeight: 170,
    zIndex: 2,
    paddingTop: 70,
    paddingHorizontal: 15,
    paddingBottom: 20,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    alignItems: 'center',
  },
  blackBackgroundContainer: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  iconAndText: {
    alignItems: 'center',
    paddingVertical: 25,
  }
});
