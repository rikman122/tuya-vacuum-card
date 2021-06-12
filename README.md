# tuya-vacuum-card

Simple Home Assistant custom card for vacuums based on Tuya platform provided by [LocalTuya](https://github.com/rospogrigio/localtuya

[![GH-release](https://img.shields.io/github/v/release/rikman122/tuya-vacuum-card.svg?style=flat-square)](https://github.com/rikman122/tuya-vacuum-card/releases)
[![GH-downloads](https://img.shields.io/github/downloads/rikman122/tuya-vacuum-card/total?style=flat-square)](https://github.com/rikman122/tuya-vacuum-card/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/rikman122/tuya-vacuum-card.svg?style=flat-square)](https://github.com/rikman122/tuya-vacuum-card/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/rikman122/tuya-vacuum-card.svg?color=red&style=flat-square)](https://github.com/rikman122/tuya-vacuum-card)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=flat-square)](https://github.com/hacs)

## Installation

Manually add [tuya-vacuum-card.js](https://raw.githubusercontent.com/rikman122/tuya-vacuum-card/master/tuya-vacuum-card.js)
to your `<config>/www/` folder and add the following to the `configuration.yaml` file:
```yaml
lovelace:
  resources:
    - url: /local/tuya-vacuum-card.js?v=1.0.0
      type: module
```

_OR_ install using [HACS](https://hacs.xyz/) (Comming soon) and add this (if in YAML mode):
```yaml
lovelace:
  resources:
    - url: /hacsfiles/tuya-vacuum-card/tuya-vacuum-card.js
      type: module
```

The above configuration can be managed directly in the Configuration -> Lovelace Dashboards -> Resources panel when not using YAML mode,
or added by clicking the "Add to lovelace" button on the HACS dashboard after installing the plugin.

## Configuration

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:tuya-vacuum-card`
| entity | string | **Required** | `vacuum.my_tuya_vacuum`

## Screenshots

![tuya-vacuum-card](https://raw.githubusercontent.com/rikman122/tuya-xiaomi-vacuum-card/master/images/default.png)

## Credits

This project is an adaptation of [Benct's Xiaomi Vacuum Card](https://github.com/benct/lovelace-xiaomi-vacuum-card) who did an awesome job! 

