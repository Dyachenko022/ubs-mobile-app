import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Dialog } from 'react-native-ui-lib';


const qstyles = {
  mainContainer: {
    flex: 1,
    backgroundColor: "#f2f5f7",
    maxHeight: '100%',
    height: '100%',
    width: '100%',
  },
  dialog: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height:500,

  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  }
};

export default class CategoriesPanel extends React.Component {

  state = {
    isVisible: false,
  };

  show = () => {
    this.setState({isVisible: true});
  };

  hide = () => {
    this.setState({isVisible: false});
  };

  navigate = (index, name) => {
    this.hide();
    this.props.selectCategory(index, name);
    //setTimeout(() => this.props.selectCategory(index, name), 700);
  };

  renderCategoryButtons = (category, index) => {
    return (
      <TouchableOpacity style={{
        width: '100%',
        height: 50,
        marginBottom: 10,
      }}
        onPress={() => {this.navigate(index, category.name);}}
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginLeft: 20,
          marginRight: 20,
        }}>
          <Image
            source={{
              uri: category.logo,
            }}
            style={{height: 50, width: '20%', marginRight: 10,}} resizeMode="contain"
          />
          <Text>
            {category.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {categories} = this.props;
    const category = categories[0];
    const height = (categories.length + 1) * 60 +  30;
    return (
      <Dialog
        migrate
        bottom
        visible={this.state.isVisible}
        onDismiss={this.hide}

        width="100%"
        containerStyle={{...qstyles.dialog, height}}
        panDirection={'down'}
        supportedOrientations={['portrait']} // iOS only
      >
        <View style={qstyles.container}>
          <Text style={qstyles.title}>
            Оформить новый продукт
          </Text>
          {
            categories.map((category,idx) => this.renderCategoryButtons(category,idx))
          }

        </View>
      </Dialog>
    );
  }
}

CategoriesPanel.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    sid: PropTypes.string,
    name: PropTypes.string,
    logo: PropTypes.string,
  })),
  selectCategory: PropTypes.func,
};

CategoriesPanel.defaultProps = {
  categories: [],
}
