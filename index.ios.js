import { Navigation } from "react-native-navigation";
import App, {store} from './App';
import {setPushMessagesIos} from './src/utils/pushMessages';

setPushMessagesIos();

Navigation.events().registerAppLaunchedListener(() => {
  new App();
});
