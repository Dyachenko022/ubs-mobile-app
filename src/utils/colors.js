import BankTheme from './bankTheme';

export const colors = [
  "#F2EFDA","#EAE6E3","#F2E479","#DDD9D7","#D8D3AD","#DDBBCC",
  "#DDAABB","#AA9988","#F47321","#998822","#7F783F","#887711","#775555","#A84100","#884411",
  "#4C433D","#881122","#662700","#662200","#c00d64","#331300","#FDDDC2","#AA9988","#F2DADE",
  "#DDDDBB","#DDDDAA","#D8ADB5","#F27990","#888811","#777755","#7F3F4C","#992233","#111188",
  "#c00d64","#FDDDC2"
];

export const getColor = (idx) => {
  return colors[idx % colors.length];
};

export const appColors = {
  base: BankTheme.color1,
  green: 'rgb(164, 186, 113)',
  yellow: 'rgb(235, 223, 161)',
  red: 'rgb(252, 104, 109)',

  background: '#f2f5f7'
};
