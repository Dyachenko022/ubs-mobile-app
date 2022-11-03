import { connect } from 'react-redux';
import {getBonuses, saveParamContract} from '../../api/actions'

import BonusesScreen from './BonusesScreen';

const mapDispatchToProps = (dispatch) => ({
  loadBonuses: () => {dispatch(getBonuses())},
  saveParamContract: (data) => {dispatch(saveParamContract(data))},
});

const mapStateToProps = (state) => ({
  loading: state.bonusesPage.loading,
  bonuses: state.bonusesPage.bonuses,
  nextProgramms: state.bonusesPage.bonuses.nextProgramms,
  activeProgramms: state.bonusesPage.bonuses.activeProgramms,
  cash: state.bonusesPage.bonuses.cash,
  nMaxBonusesSelected: state.settingsFront.nMaxBonusesSelected,
});

export default connect(mapStateToProps, mapDispatchToProps)(BonusesScreen);
