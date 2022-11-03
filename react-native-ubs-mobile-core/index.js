import React from 'react';
import LoginPage from './src/scenes/LoginPage';
import EnterPage from './src/scenes/EnterPage';
import ContractSelectPage from './src/scenes/ContractSelectPage';
import ConfirmationPage from './src/scenes/ConfirmationPage';
import CodeSettingPage from './src/scenes/CodeSettingPage';
import IdentitySelectPage from './src/scenes/IdentitySelectPage';
import { setBaseUrl, getBaseData, registration, forgot } from './src/coreApi';


global.coreUiColor = '#21207d';

function setUiColor(color) {
	global.coreUiColor = color;
}

export {
	setBaseUrl,
	setUiColor,
	LoginPage,
	EnterPage,
	ContractSelectPage,
	ConfirmationPage,
	CodeSettingPage,
	IdentitySelectPage,
	getBaseData,
	registration,
	forgot,
};
