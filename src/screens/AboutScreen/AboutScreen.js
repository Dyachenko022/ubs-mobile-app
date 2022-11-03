import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, FlatList, Image, Text, Platform, TouchableOpacity, SafeAreaView} from 'react-native';
import {Navigation} from 'react-native-navigation';
import DeviceInfo from "react-native-device-info";
import BankTheme from '../../utils/bankTheme';
import { makeLeftBackButton } from '../../utils/navigationUtils';
import ArrowRight from '../../../assets/icons/arrowRight.svg';
import {ReleaseNumber} from '../../../releaseNumber';

export default class AboutScreen extends Component {
  static options = (props) => ({
    topBar: {
      borderColor: BankTheme.navigationBackgroundColor,
      borderHeight: 0,
      elevation: 0,
      title: {
        text: 'О приложении',
      },
      leftButtons: [
        makeLeftBackButton('mapListButtonBack')
      ],
    }
  });

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this.navigationEventListener?.remove();
  }

  navigationButtonPressed({ buttonId }) {
    Navigation.dismissModal(this.props.componentId);
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.buttonLink}>
        <TouchableOpacity
          style={styles.buttonLinkTouchable}
          onPress={() => this.props.onPressOnLink(item.title, item.href)}
        >
          <Text style={{width: '80%', fontSize: 16, height: '100%', color: 'gray'}}>
            {item.title}
          </Text>
          <ArrowRight width={16} height={16} fill={BankTheme.color1}/>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const version =  Platform.OS === 'ios' ? `${DeviceInfo.getVersion()}.${DeviceInfo.getBuildNumber()}`
      : DeviceInfo.getVersion();
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.imageAndVersion}>
          <Image source={{uri: BankTheme.images.aboutScreenLogo}}
                 style={{width: 300, height: 100 }}
                 resizeMode="contain"
          />
          <Text style={{fontWeight: '500', fontSize: 20, color: 'white', paddingTop: 20, paddingBottom: 10}}>
            {`Версия ${version} (${ReleaseNumber})`}
          </Text>
        </View>

        <View style={{flex: 1}}>
          <FlatList
            data={this.props.aboutFormLinks}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.href}
            ListFooterComponent={this.footer}
          />

          <View style={styles.bankInfoContainer}>
            <Text style={styles.bankInfoRow}>{this.props.bankInfo.name}</Text>
            <Text style={styles.bankInfoRow}>{this.props.bankInfo.license}</Text>
            <Text style={styles.bankInfoRow}>{this.props.bankInfo.address}</Text>
          </View>

        </View>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Platform.OS !== 'ios' ? 'rgba(255,255,255,1)' : 'white',
    flex: 1,
  },
  imageAndVersion: {
    width: '100%',
    backgroundColor: BankTheme.navigationBackgroundColor,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  buttonLink: {
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10,
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    justifyContent: 'center',
  },
  buttonLinkTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingRight: 5,
  },
  bankInfoContainer: {
    alignItems: 'center',
    paddingBottom: 5,
  },
  bankInfoRow: {
    fontSize: 9,
    color: 'gray'
  },
});

AboutScreen.propTypes = {
  aboutFormLinks: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    href: PropTypes.string,
  })),
  onPressOnLink: PropTypes.func,
  bankInfo: PropTypes.shape({
    name: PropTypes.string,
    license: PropTypes.string,
    address: PropTypes.string,
  }),
}

AboutScreen.defaultProps = {
  aboutFormLinks: [],
  bankInfo: {},
}

