import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import {
  Text, Image, View,
  ScrollView, BackHandler, TouchableWithoutFeedback,
  ActivityIndicator,
  Slider
} from 'react-native';
import CustomStyleSheet from "../../resources/customStyleSheet";


const DocumentHeader = (props) => (
  <View style={[styles.header, props.containerStyle]}>
    <Image style={styles.logo} source={{uri: props.logo === '' ? 'none' : props.logo}}/>
    <View style={styles.headerContent}>
      <Text style={styles.title}>{props.name}</Text>
      <Text style={styles.description}>{props.description}</Text>
    </View>
  </View>
);

DocumentHeader.defaultProps = {
  logo: '',
  name: '',
  description: ''
};
DocumentHeader.propTypes = {
  logo: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string
};

const styles = CustomStyleSheet({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 10
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "800"
  },
  description: {},
  logo: {
    width: 40,
    height: 40,
    marginRight: 10
  }
});


export default DocumentHeader;
