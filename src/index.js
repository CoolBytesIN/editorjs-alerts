require('./index.css');

const infoIcon = require('./icons/info.js');
const successIcon = require('./icons/success.js');
const blockedIcon = require('./icons/blocked.js');
const warningIcon = require('./icons/warning.js');
const dangerIcon = require('./icons/danger.js');
const pastelIcon = require('./icons/pastel.js');
const solidIcon = require('./icons/solid.js');
const outlinedIcon = require('./icons/outlined.js');
const getAlignmentIcon = require('./icons/alignment.js');

/**
 * Alert plugin for Editor.js
 * Supported config:
 *     * alertTypes {string[]} (Default: Alert.ALERT_TYPES)
 *     * defaultAlertType {string} (Default: 'info')
 *     * alertStyles {string[]} (Default: Alert.ALERT_STYLES)
 *     * defaultAlertStyle {string} (Default: 'pastel')
 *     * alignTypes {string[]} (Default: Alert.ALIGN_TYPES)
 *     * defaultAlignType {string} (Default: 'left')
 *
 * @export
 * @class Alert
 * @typedef {Alert}
 */
export default class Alert {
  /**
   * Editor.js Toolbox settings
   *
   * @static
   * @readonly
   * @type {{ icon: any; title: string; }}
   */
  static get toolbox() {
    return {
      icon: infoIcon, title: 'Alert',
    };
  }

  /**
   * To notify Editor.js core that read-only is supported
   *
   * @static
   * @readonly
   * @type {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * All supported alert types
   *
   * @static
   * @readonly
   * @type {string[]}
   */
  static get ALERT_TYPES() {
    return ['info', 'success', 'blocked', 'warning', 'danger'];
  }

  /**
   * Default alert type
   *
   * @static
   * @readonly
   * @type {string}
   */
  static get DEFAULT_ALERT_TYPE() {
    return 'info';
  }

  /**
   * All supported alert styles
   *
   * @static
   * @readonly
   * @type {string[]}
   */
  static get ALERT_STYLES() {
    return ['pastel', 'solid', 'outlined'];
  }

  /**
   * Default alert style
   *
   * @static
   * @readonly
   * @type {string}
   */
  static get DEFAULT_ALERT_STYLE() {
    return 'pastel';
  }

  /**
   * All supported alignment types
   *
   * @static
   * @readonly
   * @type {string[]}
   */
  static get ALIGN_TYPES() {
    return ['left', 'center', 'right', 'justify'];
  }

  /**
   * Default alignment type
   *
   * @static
   * @readonly
   * @type {string}
   */
  static get DEFAULT_ALIGN_TYPE() {
    return 'left';
  }

  /**
   * Automatic sanitize config for Editor.js
   *
   * @static
   * @readonly
   * @type {{ text: {}; alert: boolean; alertStyle: boolean; align: boolean; }}
   */
  static get sanitize() {
    return {
      text: {},
      alert: false,
      alertStyle: false,
      align: false,
    };
  }

  /**
   * Editor.js config to convert one block to another
   *
   * @static
   * @readonly
   * @type {{ export: string; import: string; }}
   */
  static get conversionConfig() {
    return {
      export: 'text', // this property of tool data will be used as string to pass to other tool
      import: 'text', // to this property imported string will be passed
    };
  }

  /**
   * Creates an instance of Alert.
   *
   * @constructor
   * @param {{ api: {}; readOnly: boolean; config: {}; data: {}; }} props
   */
  constructor({
    api, readOnly, config, data,
  }) {
    this._api = api;
    this._readOnly = readOnly;
    this._config = config || {};
    this._data = this._normalizeData(data);
    this._CSS = {
      wrapper: 'ce-alert',
      wrapperForAlertIcon: 'ce-alert-icon',
      wrapperForAlertContent: 'ce-alert-content',
      wrapperForAlertStyle: (alertType, alertStyle) => `ce-alert-${alertStyle}-${alertType}`,
      wrapperForAlignment: (alignType) => `ce-alert-align-${alignType}`,
    };
    this._element = this._getElement();
  }

  /**
   * All available alert types
   * - Finds intersection between supported and user selected types
   *
   * @readonly
   * @type {string[]}
   */
  get availableTypes() {
    return this._config.alertTypes ? Alert.ALERT_TYPES.filter(
      (type) => this._config.alertTypes.includes(type),
    ) : Alert.ALERT_TYPES;
  }

  /**
   * User's default alert type
   * - Finds union of user choice and the actual default
   *
   * @readonly
   * @type {string}
   */
  get userDefaultType() {
    if (this._config.defaultAlertType) {
      const userSpecified = this.availableTypes.find(
        (type) => type === this._config.defaultAlertType,
      );
      if (userSpecified) {
        return userSpecified;
      }
      // eslint-disable-next-line no-console
      console.warn('(ง\'̀-\'́)ง Alert Tool: the default alert type specified is invalid');
    }
    return Alert.DEFAULT_ALERT_TYPE;
  }

  /**
   * All available alert styles
   * - Finds intersection between supported and user selected styles
   *
   * @readonly
   * @type {string[]}
   */
  get availableStyles() {
    return this._config.alertStyles ? Alert.ALERT_STYLES.filter(
      (style) => this._config.alertStyles.includes(style),
    ) : Alert.ALERT_STYLES;
  }

  /**
   * User's default alert style
   * - Finds union of user choice and the actual default
   *
   * @readonly
   * @type {string}
   */
  get userDefaultStyle() {
    if (this._config.defaultAlertStyle) {
      const userSpecified = this.availableStyles.find(
        (style) => style === this._config.defaultAlertStyle,
      );
      if (userSpecified) {
        return userSpecified;
      }
      // eslint-disable-next-line no-console
      console.warn('(ง\'̀-\'́)ง Alert Tool: the default alert style specified is invalid');
    }
    return Alert.DEFAULT_ALERT_STYLE;
  }

  /**
   * All available alignment types
   * - Finds intersection between supported and user selected alignment types
   *
   * @readonly
   * @type {string[]}
   */
  get availableAlignTypes() {
    return this._config.alignTypes ? Alert.ALIGN_TYPES.filter(
      (align) => this._config.alignTypes.includes(align),
    ) : Alert.ALIGN_TYPES;
  }

  /**
   * User's default alignment type
   * - Finds union of user choice and the actual default
   *
   * @readonly
   * @type {string}
   */
  get userDefaultAlignType() {
    if (this._config.defaultAlignType) {
      const userSpecified = this.availableAlignTypes.find(
        (align) => align === this._config.defaultAlignType,
      );
      if (userSpecified) {
        return userSpecified;
      }
      // eslint-disable-next-line no-console
      console.warn('(ง\'̀-\'́)ง Alert Tool: the default align type specified is invalid');
    }
    return Alert.DEFAULT_ALIGN_TYPE;
  }

  /**
   * To normalize input data
   *
   * @param {*} data
   * @returns {{ text: string; alert: string; alertStyle: string; align: string; }}
   */
  _normalizeData(data) {
    const newData = {};
    if (typeof data !== 'object') {
      data = {};
    }

    newData.text = data.text || '';
    newData.alert = data.alert || this.userDefaultType;
    newData.alertStyle = data.alertStyle || this.userDefaultStyle;
    newData.align = data.align || this.userDefaultAlignType;
    return newData;
  }

  /**
   * Current alert type
   *
   * @readonly
   * @type {string}
   */
  get currentType() {
    let alertType = this.availableTypes.find((type) => type === this._data.alert);
    if (!alertType) {
      alertType = this.userDefaultType;
    }
    return alertType;
  }

  /**
   * Current alert style
   *
   * @readonly
   * @type {string}
   */
  get currentStyle() {
    let alertStyle = this.availableStyles.find((style) => style === this._data.alertStyle);
    if (!alertStyle) {
      alertStyle = this.userDefaultStyle;
    }
    return alertStyle;
  }

  /**
   * Current alignment type
   *
   * @readonly
   * @type {string}
   */
  get currentAlignType() {
    let alignType = this.availableAlignTypes.find((align) => align === this._data.align);
    if (!alignType) {
      alignType = this.userDefaultAlignType;
    }
    return alignType;
  }

  /**
   * Get Alert Type icon
   *
   * @param {string} alertType
   * @returns {string}
   */
  _getAlertIcon(alertType) {
    if (alertType === 'success') {
      return successIcon;
    } else if (alertType === 'blocked') {
      return blockedIcon;
    } else if (alertType === 'warning') {
      return warningIcon;
    } else if (alertType === 'danger') {
      return dangerIcon;
    } else {
      return infoIcon; // Default icon for when alertType doesn't match any key
    }
  }

  /**
   * Get Alert Style icon
   *
   * @param {string} alertStyle
   * @returns {string}
   */
  _getAlertStyleIcon(alertStyle) {
    if (alertStyle === 'solid') {
      return solidIcon;
    } else if (alertStyle === 'outlined') {
      return outlinedIcon;
    } else {
      return pastelIcon; // Default icon for when alertStyle doesn't match any key
    }
  }

  /**
   * Create and return block element
   *
   * @returns {*}
   */
  _getElement() {
    const alertContainer = document.createElement('div');
    alertContainer.classList.add(this._CSS.wrapper, this._CSS.wrapperForAlertStyle(this.currentType, this.currentStyle));

    const alertIcon = document.createElement('div');
    alertIcon.classList.add(this._CSS.wrapperForAlertIcon);
    alertIcon.innerHTML = this._getAlertIcon(this.currentType);

    this._alertContent = document.createElement('div');
    this._alertContent.classList.add(
      this._CSS.wrapperForAlertContent,
      this._CSS.wrapperForAlignment(this.currentAlignType)
    );
    this._alertContent.innerHTML = this._data.text || '';
    this._alertContent.contentEditable = !this._readOnly;

    alertContainer.appendChild(alertIcon);
    alertContainer.appendChild(this._alertContent);
    return alertContainer;
  }

  /**
   * Callback for Alert type block tune setting
   *
   * @param {string} newType
   */
  _setAlertType(newType) {
    this._data.text = this._alertContent.innerHTML;
    this._data.alert = newType|| this.userDefaultType;

    // Create new element and replace old one
    if (newType !== undefined && this._element.parentNode) {
      const newAlert = this._getElement();
      this._element.parentNode.replaceChild(newAlert, this._element);
      this._element = newAlert;
    }
  }

  /**
   * Callback for Alert style block tune setting
   *
   * @param {*} newStyle
   */
  _setAlertStyle(newStyle) {
    this._data.text = this._alertContent.innerHTML;
    this._data.alertStyle = newStyle|| this.userDefaultStyle;

    // Create new element and replace old one
    if (newStyle !== undefined && this._element.parentNode) {
      const newAlert = this._getElement();
      this._element.parentNode.replaceChild(newAlert, this._element);
      this._element = newAlert;
    }
  }

  /**
   * Callback for Alignment block tune setting
   *
   * @param {string} newAlign
   */
  _setAlignType(newAlign) {
    this._data.align = newAlign;

    // Remove old CSS class and add new class
    Alert.ALIGN_TYPES.forEach((align) => {
      const alignClass = this._CSS.wrapperForAlignment(align);
      this._alertContent.classList.remove(alignClass);
      if (newAlign === align) {
        this._alertContent.classList.add(alignClass);
      }
    });
  }

  /**
   * HTML element to render on the UI by Editor.js
   *
   * @returns {*}
   */
  render() {
    return this._element;
  }

  /**
   * Editor.js save method to extract block data from the UI
   *
   * @returns {{ text: string; alert: string; alertStyle: string; align: string; }}
   */
  save() {
    return {
      text: this._alertContent.innerHTML,
      alert: this.currentType,
      alertStyle: this.currentStyle,
      align: this.currentAlignType,
    };
  }

  /**
   * Editor.js validation (on save) code for this block
   * - Skips empty blocks
   *
   * @param {*} savedData
   * @returns {boolean}
   */
  // eslint-disable-next-line class-methods-use-this
  validate(savedData) {
    return savedData.text.trim() !== '';
  }

  /**
   * Get formatted label for Block settings menu
   *
   * @param {string} name
   * @returns {string}
   */
  _getFormattedLabel(name) {
    return this._api.i18n.t(name.charAt(0).toUpperCase() + name.slice(1));
  }

  /**
   * Create a Block menu setting
   *
   * @param {string} icon
   * @param {string} label
   * @param {*} onActivate
   * @param {boolean} isActive
   * @param {string} group
   * @returns {{ icon: string; label: string; onActivate: any; isActive: boolean; closeOnActivate: boolean; toggle: string; }}
   */
  _createSetting = (icon, label, onActivate, isActive, group) => ({
    icon,
    label,
    onActivate,
    isActive,
    closeOnActivate: true,
    toggle: group,
  });

  /**
   * Block Tunes Menu items
   *
   * @returns {[{*}]}
   */
  renderSettings() {
    const alertTypes = this.availableTypes.map((type) => 
      this._createSetting(
        this._getAlertIcon(type), this._getFormattedLabel(type), () => this._setAlertType(type), 
        type === this.currentType, 'alert'
      )
    );

    const alertStyles = this.availableStyles.map((style) => 
      this._createSetting(
        this._getAlertStyleIcon(style), this._getFormattedLabel(style), () => this._setAlertStyle(style), 
        style === this.currentStyle, 'alert-style'
      )
    );

    const alignTypes = this.availableAlignTypes.map((align) => 
      this._createSetting(
        getAlignmentIcon(align), this._getFormattedLabel(align), () => this._setAlignType(align), 
        align === this.currentAlignType, 'align'
      )
    );

    return [...alertTypes, ...alertStyles, ...alignTypes];
  }

  /**
   * Editor.js method to merge similar blocks on `Backspace` keypress
   *
   * @param {*} data
   */
  merge(data) {
    this._alertContent.innerHTML = this._alertContent.innerHTML + data.text || '';
  }
}
