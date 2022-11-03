import React from 'react'
import {AsyncStorage} from 'react-native'
import {connect} from 'react-redux'

import {getMapPoints} from "../../../api/actions";
import * as types from "../../../api/actionTypes";

import {
  View,
  TouchableOpacity
} from 'react-native'
import {TextRenderer as Text} from "../../../components/TextRenderer";
import BankTheme from '../../../utils/bankTheme';

class Region extends React.Component {
  render(){
    return(
       <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: '10%', backgroundColor: BankTheme.color1}}>

        <View style={{padding: 15}}>
          <Text style={{fontSize: 20, fontWeight: '400', color: "#fff", paddingBottom: '20%', textAlign: 'center'}}>Выберите регион</Text>
        {
          this.props.regions.map(el => (
            <TouchableOpacity
              key={el.num}
              style={{flexDirection: "row", alignItems: 'center', marginBottom: 20, maxWidth: 250}}
              onPress={() => {
                const url = el.urlApi;

                AsyncStorage.setItem('apiRoute', url);
                this.props.dispatch({
                  type: types.GetServiceBranch.SET_API_ROUTE,
                  route: url
                });
                this.props.dispatch(getMapPoints())
              }}
            >
              <View style={{width: 10, height: 10, borderRadius: 5, borderColor: '#fff', borderWidth: 1, marginRight: 8}}/>
              <Text style={{fontSize: 16, color: "#fff"}}>{el.name}</Text>
            </TouchableOpacity>
          ))
        }
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  regions: state.api.regions
});
export default connect(mapStateToProps)(Region)
