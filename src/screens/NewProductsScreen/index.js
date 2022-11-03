import { connect } from 'react-redux';
import NewProductsScreen from './NewProductsScreen';
import React from "react";
import {pushScreen} from '../../utils/navigationUtils';

const mapStateToProps = (state) => {
  return {
    products: state.newProductsPage.filteredProducts,
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { componentId } = ownProps;
  return {
    ...ownProps,
    ...stateProps,
    openFilter: () => {
      pushScreen({
        componentId,
        screenName: 'unisab/NewProductsFilterScreen',
        title: 'Подбор продуктов',
        showBackButtonTitle: false,
      })
    },

    selectProduct: (sid, id) => {
      pushScreen({
        componentId,
        screenName: 'unisab/Document',
        showBackButtonTitle: false,
        passProps: {
          sid: sid,
          defaultValues: {
            'Идентификатор продукта': id
          }
        }
      });
    },

  };
};

export default connect(mapStateToProps, null, mergeProps)(NewProductsScreen);
