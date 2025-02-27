import {View} from "../view.js";

// Main view.
class ViewMain extends View {
  constructor() {
    super();

    this.proxyEnabled = false;
  }

  syncShow(data) {
    if (data.proxyState !== PROXY_STATE_INACTIVE &&
        data.proxyState !== PROXY_STATE_ACTIVE) {
      throw new Error("Invalid proxy state for ViewMain");
    }

    View.showToggleButton(data.proxyState === PROXY_STATE_ACTIVE);

    let text;
    if (data.proxyState === PROXY_STATE_ACTIVE) {
      text = "viewMainActive";
    } else {
      text = "viewMainInactive";
    }

    let userInfo = escapedTemplate`
    <p>
      ${this.getTranslation(text)}
    </p>
    `;

    return userInfo;
  }

  syncPostShow(data) {
    this.proxyEnabled = data.proxyState === PROXY_STATE_ACTIVE;

    if (this.proxyEnabled) {
      View.setState("enabled", {text: this.getTranslation("heroProxyOn")});
    } else {
      View.setState("disabled", {text: this.getTranslation("heroProxyOff")});
    }
  }

  toggleButtonClicked(e) {
    // eslint-disable-next-line verify-await/check
    View.sendMessage("setEnabledState", {
      enabledState: e.target.checked,
      reason: "toggleButton",
    });
  }

  async stateButtonHandler() {
    this.proxyEnabled = !this.proxyEnabled;
    // Send a message to the background script to notify the proxyEnabled has chanded.
    // This prevents the background script from having to block on reading from the storage per request.
    // eslint-disable-next-line verify-await/check
    await View.sendMessage("setEnabledState", {
      enabledState: this.proxyEnabled,
      reason: "stateButton",
    });
  }
}

const view = new ViewMain();
export default view;
