import BankInquiriesScreen from './BankInquiriesScreen';
import {connect} from 'react-redux';
import {listOrderedInquiries} from '../../api/actions';
import React from 'react';
import {openReceipt} from '../../containers/Document/utils';
import {pushScreen} from '../../utils/navigationUtils';

const mapStateProps = (state) => {
  return {
    inquiriesToOrder: state.bankInquiries.inquiriesToOrder,
    orderedInquiries: state.bankInquiries.orderedInquiries,
    isLoading: state.bankInquiries.isLoading,
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { componentId } = ownProps;
  return {
    inquiryToOrderSelected: (inquiry) => {
      pushScreen({
        componentId,
        screenName: 'unisab/Document',
        passProps: {
          sid: 'UBS_REQUEST_INFO',
          defaultValues: {
            'Код вида документа': 'UBS_REQUEST_INFO',
            'Документ.Тип документа': inquiry.sidRequest,
          },
        },
      });
    },
    fetchOrderedInquiries: () => dispatch(listOrderedInquiries({
      sidDoc: 'UBS_REQUEST_INFO',
      stateCode: [101],
      pageRows: 100,
      pageNum: 1,
    })),
    openOrderedInquiry: (id) => openReceipt({componentId, id}),
  };
}


export default connect(mapStateProps, mapDispatchToProps)(BankInquiriesScreen);