import React from 'react';
import PropTypes from 'prop-types';
import {Image, ScrollView, View} from 'react-native';
import styles from './styles';
import AutoHeightWebView from 'react-native-autoheight-webview';

/* Для оптимизации, а именно ради PureComponent, иначе при каждом свайпе будет re-rendering */
export default class CarouselItem extends React.PureComponent {
  render() {
    const { logo, infoProductCond, description } = this.props;
    return (
      <ScrollView style={{height: '84%',}}>
        <View style = {{flex:1, flexDirection: 'column', justifyContent: 'flex-start',}}>
          <View style={styles.lgw}>
            <Image
              source={{
                uri: logo,
              }}
              style={{height: 150, width: 300}} resizeMode="contain"
            />
          </View>

          <AutoHeightWebView
            containerStyle={styles.htmlContainer}
            scrollEnabled={false}
            source={{html: `<meta name="viewport" content="initial-scale=0.9, maximum-scale=0.9">` + description}}
          />

          <AutoHeightWebView
            containerStyle={styles.htmlContainer}
            source={{html: `<meta name="viewport" content="initial-scale=0.9, maximum-scale=0.9">` + infoProductCond}}
          />

        </View>
      </ScrollView>
    )
  }
}

CarouselItem.propTypes = {
  description: PropTypes.string,
  infoProductCond: PropTypes.string,
  logo: PropTypes.string,
}
