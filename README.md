# Homebridge V-ZUG Plugin

Integrate your V-ZUG appliances into Apple HomeKit using this Homebridge plugin, which currently supports status monitoring via an unofficial REST API. This plugin provides a HomeKit switch to reflect the operational status of your V-ZUG appliance, allowing you to check if the device is active.


## Features

- **Status Monitoring**: Exposes the operational status of your V-ZUG appliances as a switch in HomeKit, showing if the device is active.

## Installation

1. **Install Homebridge**:
   ```bash
   npm install -g homebridge
   ```
2. **Install the V-ZUG Plugin**:
   ```bash
   npm install -g homebridge-vzug
   ```

## Configuration

Add your V-ZUG appliances to your Homebridge `config.json`:

```json
{
  "platform": "homebridge-vzug",
  "devices": [
    {
      "name": "DEVICE_NAME",
      "ip": "DEVICE_IP_ADDRESS"
    }
  ]
}
```

### Example Configuration

```json
{
  "platform": "homebridge-vzug",
  "devices": [
    {
      "name": "Oven",
      "ip": "192.168.1.10"
    },
    {
      "name": "Chef's Secret",
      "ip": "192.168.1.11"
    }
  ]
}
```


## Supported Models

- Currently tested with:
  - V-Zug CombairSteamer V6000 60Y
  - V-Zug CombairSteamer V6000 45F

The plugin will automatically find the Model and Serial Number of your Device and populate the relevant fields for HomeKit

## Developer's Note

This is my first Homebridge plugin, primarily aimed at status monitoring for V-ZUG appliances. It's pretty basic – mainly showing the on/off status. Since it's my initial release, there might be some room for improvement. I'm open to feedback and suggestions!

Regarding future updates, I plan to enhance the plugin as time allows, potentially adding new features based on the community's input and any additional API information I come across. Your thoughts and contributions are always welcome!


## Contributions and Support

- Your contributions and feedback are welcome! Please consider contributing if you have access to more API info or different V-ZUG devices.
- Report issues or suggest enhancements on the [GitHub issues page](https://github.com/rtuszik/homebridge-vzug/issues).

## Additional Resources

- [Unofficial V-ZUG Python API](https://github.com/mico-micic/vzug-api)
- [V-ZUG REST Integration](https://gist.github.com/MoritzBuetzer/6441d4045f989ef57aed915250bb4020)
