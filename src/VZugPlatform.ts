import { API, DynamicPlatformPlugin, Logger, PlatformConfig, PlatformAccessory } from 'homebridge';
import { VZugAccessory } from './VZugAccessory';

export interface DeviceConfig {
  name: string;
  ip: string;
}

export class VZugPlatform implements DynamicPlatformPlugin {
  private readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.debug('Finished initializing platform:', config.name);

    if (Array.isArray(config.devices)) {
      for (const device of config.devices) {
        this.log.info('Initializing device:', device.name);
        this.initializeDevice(device as DeviceConfig);
      }
    }

    this.api.on('didFinishLaunching', () => {
      this.log.debug('Executed didFinishLaunching callback');
      // Perform further operations here if necessary
    });
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);
    this.accessories.push(accessory);
  }

  initializeDevice(deviceConfig: DeviceConfig) {
    const uuid = this.api.hap.uuid.generate(deviceConfig.ip);
    const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

    if (existingAccessory) {
      this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
      new VZugAccessory(this.log, this.api, existingAccessory, deviceConfig);
    } else {
      this.log.info('Adding new accessory:', deviceConfig.name);
      const accessory = new this.api.platformAccessory(deviceConfig.name, uuid);
      new VZugAccessory(this.log, this.api, accessory, deviceConfig);
      this.api.registerPlatformAccessories('homebridge-vzug', 'VZugPlatform', [accessory]);
    }
  }
}
