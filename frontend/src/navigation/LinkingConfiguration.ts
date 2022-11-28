/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import {main, login, modal} from '../screens';

export default  {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Main: {
        screens:{
          ...main,
          ...login,
          NotFound: '*',
        }
      },
      ...modal
    },
  },
} as LinkingOptions;
