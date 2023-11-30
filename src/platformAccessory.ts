import { API, HAP, Logging, PlatformAccessory } from 'homebridge';
import fetch from 'node-fetch';

export class VZugAccessory {
  private readonly service: HAP.Service;
  private readonly hap: HAP;

  constructor(
    private readonly log: Logging,
    private readonly config: any,
    private readonly api: API,
    private readonly accessory: PlatformAccessory,
  ) {
    this.hap = api.hap;

    // Example: Service for a Switch (e.g., for a dishwasher)
    this.service = new this.hap.Service.Switch(this.accessory.displayName);
    this.service.getCharacteristic(this.hap.Characteristic.On)
      .on('get', this.getSwitchState.bind(this))
      .on('set', this.setSwitchState.bind(this));

    this.accessory.addService(this.service);
  }

  private async getSwitchState(callback: (error: Error | null, state?: boolean) => void): Promise<void> {
    try {
      const url = `http://${this.config.ip}/ai?command=getDeviceStatus`;
      const response = await fetch(url);
      const data = await response.json();
      // Logic to determine state from 'data'
      const isOn = ...; // Determine based on 'data'
      callback(null, isOn);
    } catch (error) {
      this.log.error('Error in getSwitchState:', error);
      callback(error as Error);
    }
  }

  private async setSwitchState(value: boolean, callback: (error: Error | null) => void): Promise<void> {
    try {
      const url = `http://${this.config.ip}/ai?command=setDeviceState&state=${value}`;
      await fetch(url, { method: 'POST' });
      this.log.info('Switch state set to:', value);
      callback(null);
    } catch (error) {
      this.log.error('Error in setSwitchState:', error);
      callback(error as Error);
    }
  }
}
