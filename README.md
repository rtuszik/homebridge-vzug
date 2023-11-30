# WIP - NOT WORKING

This Plugin is a work in progress and is currently not functional. 

# Homebridge V-ZUG Plugin

This Homebridge plugin integrates V-ZUG appliances into Apple HomeKit using unofficial REST API.

## Installation

1. Install Homebridge: `npm install -g homebridge`.
2. Install this plugin: `npm install -g homebridge-vzug`.
3. Update your Homebridge `config.json` file (see Configuration section below).

## Configuration

Add the following configuration in your Homebridge `config.json`:

```json
"platforms": [
  {
    "platform": "VZug",
    "devices": [
      {
        "name": "V-ZUG Appliance",
        "ip": "DEVICE_IP_ADDRESS"
      }
    ]
  }
]
```

Replace `DEVICE_IP_ADDRESS` with the IP address of your V-ZUG appliance.

## Features

- Control and monitor V-ZUG appliances like dishwashers, washing machines, and dryers.

## Sources

- Unofficial Python API for V-ZUG devices: [vzug-api](https://github.com/mico-micic/vzug-api)
- REST Integration for V-ZUG Home Appliances: [REST Integration Gist](https://gist.github.com/MoritzBuetzer/6441d4045f989ef57aed915250bb4020)

## Reporting Issues

Report issues on the [GitHub issues page](https://github.com/rtuszik/homebridge-vzug/issues).
