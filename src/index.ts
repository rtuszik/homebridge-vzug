import { API } from 'homebridge';
import { VZugPlatform } from './VZugPlatform';

module.exports = (api: API) => {
  api.registerPlatform('homebridge-vzug', VZugPlatform);
};
