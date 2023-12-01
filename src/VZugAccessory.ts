import { Service, PlatformAccessory, Logger, API } from 'homebridge';
import axios from 'axios';
import { DeviceConfig } from './VZugPlatform';


export class VZugAccessory {
  private service: Service;

  constructor(
    private readonly log: Logger,
    private readonly api: API,
    private readonly accessory: PlatformAccessory,
    private readonly config: DeviceConfig,
  ) {
    // Assuming a Switch Service for demonstration
    this.service = new this.api.hap.Service.Switch(accessory.displayName);

    // Register handlers for the On/Off Characteristic
    this.service.getCharacteristic(this.api.hap.Characteristic.On)
      .on('get', this.handleOnGet.bind(this))
      .on('set', this.handleOnSet.bind(this));

    // Add the service to the accessory
    this.accessory.addService(this.service);

    // Set up polling to periodically fetch device status
    setInterval(() => {
      this.fetchDeviceStatus();
    }, 10000); // Poll every 10 seconds (10000 milliseconds)
  }

  async fetchDeviceStatus() {
    try {
      const url = `http://${this.config.ip}/ai?command=getDeviceStatus`;
      const response = await axios.get(url);
      if (response.status !== 200) {
        throw new Error(`Unexpected response code: ${response.status}`);
      }

      const data = response.data;
      const isActive = data.Inactive === 'false';
      this.service.updateCharacteristic(this.api.hap.Characteristic.On, isActive);
    } catch (error) {
      if (error instanceof Error) {
        this.log.error('Error fetching device status:', error.message);
      } else {
        this.log.error('An unknown error occurred in fetchDeviceStatus');
      }
    }
  }


  handleOnGet(callback) {
    this.fetchDeviceStatus().then(() => {
      const isActive = this.service.getCharacteristic(this.api.hap.Characteristic.On).value;
      callback(null, isActive);
    }).catch(error => {
      this.log.error('Error in handleOnGet:', error.message || 'Unknown error');
      callback(error, false);
    });
  }

  handleOnSet(value, callback) {
    // Implement logic to set the new state
    // This part is device-specific and depends on available API commands
    // Handle errors appropriately, similar to handleOnGet
    callback(null);
  }
}