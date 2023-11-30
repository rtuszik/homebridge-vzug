import { Service, PlatformAccessory, Logger, API } from 'homebridge';
import axios from 'axios';

export class VZugAccessory {
  private service: Service;

  constructor(
    private readonly log: Logger,
    private readonly api: API,
    private readonly accessory: PlatformAccessory,
    private readonly config: any,
  ) {
    // Assuming a Switch Service for demonstration (modify as needed)
    this.service = new this.api.hap.Service.Switch(accessory.displayName);

    // Register handlers for the On/Off Characteristic
    this.service.getCharacteristic(this.api.hap.Characteristic.On)
      .on('get', this.handleOnGet.bind(this))
      .on('set', this.handleOnSet.bind(this));

    // Add the service to the accessory
    this.accessory.addService(this.service);

    // Fetch initial status
    this.fetchDeviceStatus();
  }

  async fetchDeviceStatus() {
    try {
      const url = `http://${this.config.ip}/ai?command=getDeviceStatus`;
      const response = await axios.get(url);
      const data = response.data;

      const isActive = data.Inactive === 'false';
      this.service.updateCharacteristic(this.api.hap.Characteristic.On, isActive);
    } catch (error) {
      this.log.error('Error fetching device status:', error);
    }
  }

  handleOnGet(callback) {
    this.fetchDeviceStatus().then(() => {
      const isActive = this.service.getCharacteristic(this.api.hap.Characteristic.On).value;
      callback(null, isActive);
    }).catch(error => {
      callback(error);
    });
  }

  handleOnSet(value, callback) {
    // Implement logic to set the new state, e.g., start/stop a program
    // This part is device-specific and depends on available API commands
    callback(null);
  }
}
