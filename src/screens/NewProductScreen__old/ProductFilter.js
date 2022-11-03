import React from 'react';
import {connect} from 'react-redux';

import {
  View,
} from 'react-native'
import TouchableOpacity from '../../components/Touchable';


import {
  paramProductByType, paramProductCard, listParamsProduct, paramProductCredit,
  paramProductDeposit
} from "../../api/actions";
import * as types from '../../api/actionTypes';

import {TextRenderer as Text} from "../../components/TextRenderer";
import Form from '../../containers/Document/Form';
import {getDocumentParameters} from '../../containers/Document/utils/getParameters';

class ProductFilter extends React.Component {

  componentDidMount() {
    let sidProductParams = '';
    switch (this.props.type) {
      case 'cards':
        sidProductParams = 'ProductCard';
        break;
      case 'credits':
        sidProductParams = 'ProductLoan';
        break;
      case 'deposits':
        sidProductParams = 'ProductFdep';
        break;
    }

    this.props.dispatch(listParamsProduct(sidProductParams));
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Form
          values={this.props.formData.values}
          currentGroupIndex={this.props.formData.currentGroupIndex}
          listValues={this.props.formData.listValues}
          fields={this.props.formData.fields}
          groups={this.props.formData.groups}
          valuesGroups={this.props.formData.valuesGroups}

          isFormControlShown={false}

          handleValuesChange={this.onChangeFilter}
        >
          <View style={{
            paddingHorizontal: 15,
            paddingBottom: 15
          }}>
            <TouchableOpacity onPress={this.onPressClear}>
              <Text style={{
                textAlign: 'right'
              }}>
                Сбросить фильтр
              </Text>
            </TouchableOpacity>
          </View>

          {this.props.children}
        </Form>


      </View>
    )
  }

  onPressClear = () => {
    this.props.dispatch({type: types.ProductsPage.CLEAR_FIELDS_VALUES});
    this.props.dispatch(paramProductByType(this.props.type));
  };

  onChangeFilter = (newValues) => {
    try {
      this.props.dispatch({type: types.ProductsPage.SET_FIELDS_VALUES, values: newValues});

      const parameters = getDocumentParameters(Object.assign({}, this.props.formData, {values: newValues}));
      this.props.dispatch(paramProductByType(this.props.type, {
        parameters: parameters.filter(param => param.value != '')
      }));
    } catch (e) {
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  formData: state.newProductPage.formData
});
export default connect(mapStateToProps)(ProductFilter);
