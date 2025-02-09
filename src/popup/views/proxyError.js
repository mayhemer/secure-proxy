import {View} from "../view.js";

class ViewProxyError extends View {
  syncShow() {
    View.setState("disabled", {text: this.getTranslation("heroProxyOn")});
    View.showToggleButton(true);

    return escapedTemplate`
    <p class="warning">
      ${this.getTranslation("viewProxyError")}
    </p>`;
  }

  toggleButtonClicked(e) {
    // eslint-disable-next-line verify-await/check
    View.sendMessage("setEnabledState", {
      enabledState: false,
      reason: (typeof e === "string") ? e : "toggleButton",
    });
  }

  stateButtonHandler() {
    this.toggleButtonClicked("stateButton");
  }
}

const view = new ViewProxyError();
export default view;
