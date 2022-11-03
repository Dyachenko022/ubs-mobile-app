export function getTabsByProductType(productType, activeProduct) {
  const tabs = [{ key: '1', title: 'Информация' }, { key: '2', title: 'Выписка' }];

  switch (productType) {
    case 'cards':
      if (activeProduct.additionalCards && activeProduct.additionalCards.length > 0)
        tabs.push({key: '5', title: 'Доп. карты'});
      return tabs;
    case 'deposits':
      if (activeProduct.proxy && activeProduct.proxy.length > 0) {
        return [...tabs, {key: '3', title: 'Доверенности'}];
      }
      return tabs;
    case 'credits':
      return [...tabs, { key: '4', title: 'График платежей' }];
    default:
      return tabs;
  }
}