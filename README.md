# Alerts block tool for Editor.js

This block tool provides alert banners for [Editor.js](https://editorjs.io/). The tool also provides configuration to choose from different styles (see [Styles](https://github.com/CoolBytesIN/editorjs-alerts?tab=readme-ov-file#styles)) and to enable alignment options.

## Preview

#### Block Tool
![alerts](https://api.coolbytes.in/media/handle/view/image/302/)

#### Block Settings
![settings](https://api.coolbytes.in/media/handle/view/image/303/)

## Styles

##### Pastel (Default)
![pastel](https://api.coolbytes.in/media/handle/view/image/304/)

##### Solid
![solid](https://api.coolbytes.in/media/handle/view/image/305/)

##### Outlined
![outlined](https://api.coolbytes.in/media/handle/view/image/306/)

## Installation

**Using `npm`**

```sh
npm install @coolbytes/editorjs-alerts
```

**Using `yarn`**

```sh
yarn add @coolbytes/editorjs-alerts
```

## Usage

Include it in the `tools` property of Editor.js config:

```js
const editor = new EditorJS({
  tools: {
    alert: Alert
  }
});
```

## Config Params

|Field|Type|Optional|Default|Description|
|---|---|---|---|---|
|alertTypes|`string[]`|`Yes`|['info', 'success', 'blocked', 'warning', 'danger']|All supported alert types|
|defaultAlertType|`string`|`Yes`|'info'|Preferred alert type|
|alertStyles|`string[]`|`Yes`|['pastel', 'solid', 'outlined']|All supported alert styles|
|defaultAlertStyle|`string`|`Yes`|'pastel'|Preferred alert style|
|alignTypes|`string[]`|`Yes`|['left', 'center', 'right', 'justify']|All supported alignment options|
|defaultAlignType|`string`|`Yes`|'left'|Preferred alignment type|

&nbsp;

```js
const editor = EditorJS({
  tools: {
    alert: {
      class: Alert,
      config: {
        alertTypes: ['info', 'success', 'blocked', 'warning', 'danger'],
        defaultAlertType: 'info',
        alertStyles: ['pastel', 'solid', 'outlined'],
        defaultAlertStyle: 'pastel',
        alignTypes: ['left', 'center', 'right', 'justify'],
        defaultAlignType: 'left'
      }
    }
  }
});
```

## Output data

|Field|Type|Description|
|---|---|---|
|text|`string`|Alert's text|
|alert|`string`|Alert type|
|alertStyle|`string`|Alert style|
|align|`string`|Alignment type|

&nbsp;

Example:

```json
{
  "time": 1715969561758,
  "blocks": [
    {
      "id": "_K5QcJHHuK",
      "type": "alert",
      "data": {
        "text": "This is an info alert",
        "alert": "info",
        "alertStyle": "pastel",
        "align": "left"
      }
    }
  ],
  "version": "2.29.1"
}
```