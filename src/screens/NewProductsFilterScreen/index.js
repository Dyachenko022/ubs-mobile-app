import { connect } from 'react-redux';
import NewProductsFilterScreen from './NewProductsFilterScreen';
import * as actions from '../../reducers/newProductsPage/actions';
import {Navigation} from 'react-native-navigation';

const mapStateToProps = (state) => {

  const { selectedCategoryIndex } = state.newProductsPage;

  return{
    category: state.newProductsPage.categories[selectedCategoryIndex],
    filter: state.newProductsPage.filter,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const {componentId} = ownProps;
  return {
    applyFilter: (filter) => {
      dispatch(actions.applyFilter(filter));
      Navigation.pop(componentId);
    },

    clearFilter: () => {
      dispatch({type: actions.CLEAR_FILTER});
      Navigation.pop(componentId);
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(NewProductsFilterScreen);


