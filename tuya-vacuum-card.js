((LitElement) => {
    const state = {
        status: {
            key: 'state',
            icon: 'mdi:robot-vacuum',
        },

        fan_speed: {
            key: 'fan_speed',
            icon: 'mdi:fan',
        },
        cleaning_mode: {
            key: 'cleaning_mode',
            icon: 'mdi:speedometer-slow'
        },
    };

    const attributes = {
        battery: {
            key: 'battery_level',
            unit: '%',
            icon: 'mdi:battery-charging-80',
        },
        clean_time: {
            key: 'clean_time',
            icon: 'mdi:clock-outline',
            unit: ' mins'
        },
        clean_area: {
            key: 'clean_area',
            icon: 'mdi:grid',
            unit: ' m2'
        },

    };

    const buttons = {
        start: {
            label: 'Start',
            icon: 'mdi:play',
            service: 'vacuum.start',
        },
        pause: {
            label: 'Pause',
            icon: 'mdi:pause',
            service: 'vacuum.pause',
        },
        stop: {
            label: 'Stop',
            icon: 'mdi:stop',
            service: 'vacuum.stop',
        },
        locate: {
            label: 'Locate',
            icon: 'mdi:map-marker',
            service: 'vacuum.locate',
        },
        return: {
            label: 'Return to Base',
            icon: 'mdi:home-map-marker',
            service: 'vacuum.return_to_base',
        },
    };

    const html = LitElement.prototype.html;
    const css = LitElement.prototype.css;

    class TuyaVacuumCard extends LitElement {

        static get properties() {
            return {
                _hass: {},
                config: {},
                stateObj: {},
                isOpen: Boolean,
            }
        }

        constructor() {
            super();
            this.isOpen = false;
        }

        static get styles() {
            return css`
                ha-icon-button ha-icon {
                    display: flex;
                }
                .tvac-dropdown{
                    padding: 0;
                    display: block;
                    position: relative;
                }
                .tvac-dropdown__button{
                    display: inline-flex;
                    font-size: 1em;
                    justify-content: space-between;
                    align-items: center;
                    margin: 2px 0;
                }
                .tvac-dropdown__button.icon{
                    margin: 0;
                }
                .tvac-dropdown__button > div {
                    display: flex;
                    flex: 1;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 100%;
                }
                mwc-list-item > *:nth-child(2) {
                    margin-left: 4px;
                }
                .tvac-dropdown-open tvac-button ha-icon{
                    transform: rotate(180deg);
                }
                .title {
                    font-size: 20px;
                    padding: 12px 16px 8px;
                    text-align: center;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .flex {
                    display: flex;
                    align-items: center;
                    justify-content: space-evenly;
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(2, auto);
                    cursor: pointer;
                }
                .grid-content {
                    display: grid;
                    align-content: space-between;
                    grid-row-gap: 6px;
                }
                .grid-left {
                    text-align: left;
                    font-size: 110%;
                    padding-left: 10px;
                    border-left: 2px solid var(--primary-color);
                }
                .grid-right {
                    text-align: right;
                    padding-right: 10px;
                    border-right: 2px solid var(--primary-color);
                }
                `;
        }

        firstUpdated() {
            const fan_speed_menu = this.shadowRoot.querySelector('#fan_speed-menu');
            const fan_speed_button = this.shadowRoot.querySelector('#fan_speed-button');
            const cleaning_mode_menu = this.shadowRoot.querySelector('#cleaning_mode-menu');
            const cleaning_mode_button = this.shadowRoot.querySelector('#cleaning_mode-button');
            fan_speed_menu.anchor = fan_speed_button;
            cleaning_mode_menu.anchor = cleaning_mode_button;
        }
        
        render() {
            return this.stateObj ? html`
            <ha-card>
              ${this.config.show.name ?
                    html`<div class="title">${this.config.name || this.stateObj.attributes.friendly_name}</div>`
                    : null}
              ${(this.config.show.state || this.config.show.attributes) ? html`
              <div class="grid" style="${this.config.styles.content}" @click="${() => this.fireEvent('hass-more-info')}">
                ${this.config.show.state ? html`
                <div class="grid-content grid-left">
                  ${Object.values(this.config.state).filter(v => v).map(this.renderAttribute.bind(this, "left"))}
                </div>` : null}
                ${this.config.show.attributes ? html`
                <div class="grid-content grid-right">
                  ${Object.values(this.config.attributes).filter(v => v).map(this.renderAttribute.bind(this, "right"))}
                </div>` : null}
              </div>` : null}
              ${this.config.show.buttons ? html`
              <div class="flex">
                ${Object.values(this.config.buttons).filter(v => v).map(this.renderButton.bind(this))}
              </div>` : null}
            </ha-card>` : html`<ha-card style="padding: 8px 16px">Entity '${this.config.entity}' not available...</ha-card>`;
        }

        renderAttribute(position, data) {
            const isValidAttribute = data && data.key in this.stateObj.attributes;
            const isValidEntityData = data && data.key in this.stateObj;

            var value = isValidAttribute ?
                this.stateObj.attributes[data.key] + (data.unit || '')
                : isValidEntityData ?
                    this.stateObj[data.key] + (data.unit || '')
                    : this._hass.localize('state.default.unavailable');

            if (data.key == 'state') {
                value = this._hass.localize('component.vacuum.state._.' + value)
            } else if (data.key == 'fan_speed' || data.key == 'cleaning_mode') {
                value = localize(value)
            }

            const attribute = position == 'left' ?
                html`<div>${this.renderIcon(data, position)}${value}</div>`
                : html`<div>${value}${this.renderIcon(data, position)}</div>`

            const hasDropdown = `${data.key}_list` in this.stateObj.attributes;

            return (hasDropdown && (isValidAttribute || isValidEntityData))
                ? this.renderDropdown(attribute, data.key, position)
                : attribute;
        }

        renderIcon(data, position) {
            const icon = (data.key === 'battery_level' && 'battery_icon' in this.stateObj.attributes)
                ? this.stateObj.attributes.battery_icon
                : data.icon;
            return position == 'left' ?
                html`<ha-icon .icon=${icon} style="margin-right: 10px;"></ha-icon>`
                : html`<ha-icon .icon=${icon} style="margin-left: 10px;"></ha-icon>`
        }

        renderButton(data) {
            return data && data.show !== false
                ? html`<ha-icon-button
                    @click="${() => this.callService(data.service, data.service_data)}"
                    .icon=${data.icon}
                    title="${data.label || ''}">
                    <ha-icon .icon=${data.icon}></ha-icon>
                    </ha-icon-button>`
                : null;
        }

        renderDropdown(attribute, key, position) {
            const selected = this.stateObj.attributes[key];
            const list = this.stateObj.attributes[`${key}_list`];

            return html`
                    <div
                        class="tvac-dropdown"
                        id=${`${key}-dropdown`}
                        @click=${e => e.stopPropagation()}>
                        <tvac-button class='tvac-dropdown__button'
                            id=${`${key}-button`}
                            @click=${e => this.toggleMenu(e, key)}>
                            <div>
                            <span class='tvac-dropdown__label ellipsis'>
                                ${attribute}
                            </span>
                            <ha-icon class='tvac-dropdown__icon' icon='mdi:chevron-down'></ha-icon>
                            </div>
                        </tvac-button>
                        <mwc-menu
                            id=${`${key}-menu`}
                            @selected="${list.indexOf(selected)}"
                            activatable
                            corner="BOTTOM_START"
                            @click="${e => this.handleChange(e, key)}">
                            ${list.map(item => html`<mwc-list-item value="${item}" style="text-shadow: none;">${localize(item)}</mwc-list-item>`)}
                        </mwc-menu>
                    </div>
                    `;
        }

        toggleMenu(e, id) {
            const menu = this.shadowRoot.querySelector(`#${id}-menu`);
            const dropdown = this.shadowRoot.querySelector(`#${id}-dropdown`);
            menu.open = !menu.open;
            dropdown.classList.toggle("tvac-dropdown-open");
        }

        getCardSize() {
            if (this.config.show.name && this.config.show.buttons) return 4;
            if (this.config.show.name || this.config.show.buttons) return 3;
            return 2;
        }

        shouldUpdate(changedProps) {
            return changedProps.has('stateObj');
        }

        setConfig(config) {
            if (!config.entity) throw new Error('Please define an entity.');
            if (config.entity.split('.')[0] !== 'vacuum') throw new Error('Please define a vacuum entity.');

            this.config = {
                name: config.name,
                entity: config.entity,
                show: {
                    name: config.name !== false,
                    state: config.state !== false,
                    attributes: config.attributes !== false,
                    buttons: config.buttons !== false,
                },
                buttons: buttons,
                state: state,
                attributes: attributes,
                styles: {
                    icon: `color: ${config.image ? 'white' : 'var(--paper-item-icon-color)'};`,
                    content: `padding: ${config.name !== false ? '8px' : '16px'} 16px ${config.buttons !== false ? '8px' : '16px'};`,
                },
            };
        }

        set hass(hass) {
            if (hass && this.config) {
                this.stateObj = this.config.entity in hass.states ? hass.states[this.config.entity] : null;
            }
            this._hass = hass;
        }

        handleChange(e, key) {
            const value = e.target.getAttribute('value');
            if (key == 'fan_speed')
                this.callService('vacuum.set_fan_speed', { entity_id: this.stateObj.entity_id, fan_speed: value });
            else if (key == 'cleaning_mode')
                this.callService('vacuum.send_command', { entity_id: this.stateObj.entity_id, command: 'set_mode', params: { mode: value } });
        }

        callService(service, data = { entity_id: this.stateObj.entity_id }) {
            const [domain, name] = service.split('.');
            this._hass.callService(domain, name, data);
        }

        fireEvent(type, options = {}) {
            const event = new Event(type, {
                bubbles: options.bubbles || true,
                cancelable: options.cancelable || true,
                composed: options.composed || true,
            });
            event.detail = { entityId: this.stateObj.entity_id };
            this.dispatchEvent(event);
        }
    }

    customElements.define('tuya-vacuum-card', TuyaVacuumCard);
})(window.LitElement || Object.getPrototypeOf(customElements.get("hui-masonry-view") || customElements.get("hui-view")));

const translations = {
    en: {
        smart: "Smart",
        standby: "Standby",
        chargego: "Go Charge",
        wall_follow: "Wall Follow",
        spiral: "Spiral",
        left_spiral: "Left Spiral",
        right_spiral: "Right Spiral",
        right_bow: "Right Bow",
        left_bow: "Left Bow",
        partial_bow: "Partial Bow",
        single: "Spot",
        mop: "Mop",
        gentle: "Low",
        low: "Low",
        normal: "Normal",
        quiet: "Quiet",
        high: "High",
        strong: "High"
    },
    es: {
        smart: "Inteligente",
        standby: "Reposo",
        chargego: "Cargar",
        wall_follow: "Rodapies",
        spiral: "Espiral",
        left_spiral: "Espiral Izquierda",
        right_spiral: "Espiral Derecha",
        right_bow: "Arco Derecha",
        left_bow: "Arco Izquierda",
        partial_bow: "Arco Parcial",
        single: "Punto",
        mop: "Fregar",
        gentle: "Bajo",
        low: "Bajo",
        normal: "Medio",
        quiet: "Silencioso",
        high: "Alto",
        strong: "Alto"
    },
};

function localize(string, search = undefined, replace = undefined) {
    let translated;

    const lang = (localStorage.getItem("selectedLanguage") || "en")
        .replace(/['"]+/g, "")
        .replace("-", "_");

    try {
        translated = translations[lang][string];
    } catch (e) {
        translated = translations["en"][string];
    }

    if (translated === undefined) {
        translated = translations["en"][string];
    }

    if (search !== undefined && replace !== undefined) {
        translated = translated.replace(search, replace);
    }
    return translated;
}