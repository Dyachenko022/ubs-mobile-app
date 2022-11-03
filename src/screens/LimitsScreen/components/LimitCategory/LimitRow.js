import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Switch, Text, TouchableOpacity, View} from 'react-native';
import { parseMoney } from '../../../../utils/text';

export default function LimitRow(props) {

  const [limitSet, setLimitSet] = useState(props.limit > -1);

  const renderChart = () => {
    const limit = props.limit;
    let used = props.limitUsed;
    if (limit === -1) return null;
    if (used === -1) used = 0;
    if (used > limit) {
      used = limit;
    }
    const prcUsed =   Math.round(100.0 * used / limit );
    const prcAvailable = 100 - prcUsed;
    return (
      <View>
        <View style={{width: '100%',  height: 10, flexDirection: 'row'}}>
          <View style={{width: prcUsed + '%', height: 10, backgroundColor: 'red'}} />
          <View style={{width: prcAvailable + '%', height: 10, backgroundColor: 'green'}} />
        </View>
        <View style={styles.chartLimitsRow}>
          <View style={{width: '49%', flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={styles.redText}>
              Использовано
            </Text>
            <Text style={styles.redText}>
              {` ${parseMoney(used, props.limitCurrencyISO)}`}
            </Text>
          </View>
          <View style={{ width: '49%', textAlign: 'right', flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap'}}>
            <Text style={styles.greenText}>
              Доступно
            </Text>
            <Text style={styles.greenText}>
              {` ${parseMoney(limit - used, props.limitCurrencyISO)}`}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={{paddingTop: 8,}}>
      <View style={styles.limitsRow}>
        <Text style={styles.limitSetText}>{props.limitName}</Text>

        <Switch
          onValueChange={(v) => {
            setLimitSet(v)
            props.onSetLimitSet(v);
          }}
          value={limitSet}
        />
      </View>

      {limitSet && (
        <View style={{marginLeft: 15,}}>
          <TouchableOpacity onPress={props.onPressEditLimit}>
            {props.limit === -1 ? (
              <Text style={styles.limitText}>
                Лимит неустановлен
              </Text>
            ) : (
              <View style={{flexDirection: 'row', width: '100%'}}>
                <Text style={styles.limitText}>
                  {`Установленный лимит: `}
                </Text>
                <Text style={styles.limitTextBold}>
                  {parseMoney(props.limit, props.limitCurrencyISO)}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {renderChart()}
        </View>
      )}
    </View>
  );
}

LimitRow.propTypes = {
  limitName: PropTypes.string,
  onPressEditLimit: PropTypes.string,
  limit: PropTypes.number,
  limitUsed: PropTypes.number,
  limitCurrencyISO: PropTypes.string,
  onSetLimitSet: PropTypes.func,
}

const styles = {
  limitText: {
    fontSize: 14,
    paddingBottom: 4,
  },
  limitTextBold: {
    fontSize: 14,
    paddingBottom: 4,
    fontWeight: 'bold',
  },
  limitSetText: {
    fontSize: 18,
    color: 'gray',
  },
  limitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartLimitsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 15,
  },
  redText: {
    color: 'red',
    fontSize: 12,
  },
  greenText: {
    color: 'green',
    fontSize: 12,
  }
};