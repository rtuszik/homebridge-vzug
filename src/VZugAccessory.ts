import { Service, PlatformAccessory, Logger, API } from 'homebridge';
import axios from 'axios';
import { DeviceConfig } from './VZugPlatform';
import * as fs from 'fs';
import * as path from 'path';

export class VZugAccessory {
  private service: Service;
  private models: ModelData[]; // To store the model data

  constructor(
    private readonly log: Logger,
    private readonly api: API,
    private readonly accessory: PlatformAccessory,
    private readonly config: DeviceConfig,
  ) {
    this.service = new this.api.hap.Service.Switch(accessory.displayName);

    this.service.getCharacteristic(this.api.hap.Characteristic.On)
      .on('get', this.handleOnGet.bind(this))
      .on('set', this.handleOnSet.bind(this));

    this.accessory.addService(this.service);

    // Load model data
    this.models = JSON.parse(fs.readFileSync(path.join(__dirname, 'vzugmodel.json'), 'utf8'));

    this.setSerialNumber();
    this.setManufacturer();

    setInterval(() => {
      this.fetchDeviceStatus();
    }, 10000);
  }

  async setSerialNumber() {
    try {
      const url = `http://${this.config.ip}/ai?command=getDeviceStatus`;
      const response = await axios.get(url);
      if (response.status === 200) {
        const serialNumber = response.data.Serial;
        const modelNumber = serialNumber.substring(0, 5);
        const modelName = this.findModelName(modelNumber);

        this.accessory.getService(this.api.hap.Service.AccessoryInformation)
          .setCharacteristic(this.api.hap.Characteristic.SerialNumber, serialNumber)
          .setCharacteristic(this.api.hap.Characteristic.Model, modelName);
      }
    } catch (error) {
      this.log.error('Error fetching serial number:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  findModelName(modelNumber: string): string {
    for (const model of this.models) {
      if (model.Model.includes(modelNumber)) {
        return model.Name;
      }
    }
    return 'Unknown Model';
  }

  private setManufacturer() {
    this.accessory.getService(this.api.hap.Service.AccessoryInformation)
      .setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'V-Zug');
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
    callback(null);
  }
}