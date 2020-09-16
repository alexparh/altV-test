import alt from 'alt-client';
import '/client/panel';

const url = `http://resource/client/html/auth/index.html`;
let webview;

alt.log(`[OS] Authentication - Loaded`);
alt.onServer('auth:Open', showAuthPanel); // Call this event server-side to show Auth panel.
alt.onServer('auth:Exit', exitAuthPanel); // Call this event server-side to exit Auth panel.
alt.onServer('auth:Error', errorAuthPanel); // Called when an error is present server-side.
alt.on('auth:Open', showAuthPanel); // Call this event client-side to show Auth panel.
alt.on('auth:Exit', exitAuthPanel); // Call this event server-side to show Auth panel.

function showAuthPanel() {
    if (webview && webview.destroy) {
        webview.destroy();
    }

    webview = new alt.WebView(url);
    webview.focus()
    webview.on('auth:Try', tryAuthPanel);
    webview.on('auth:Ready', readyAuthPanel);
    
    alt.showCursor(true);
    alt.toggleGameControls(false);
}

function exitAuthPanel() {
    if (webview && webview.destroy) {
        webview.destroy();
    }

    alt.showCursor(false);
    alt.toggleGameControls(true);
}

function errorAuthPanel(msg) {
    if (!webview) {
        return;
    }

    webview.emit('auth:Error', msg);
}

function readyAuthPanel() {
    if (!webview) {
        return;
    }

    webview.emit('auth:Ready');
}

function tryAuthPanel(username, password, email = null) {
    alt.emitServer('auth:Try', username, password, email);
}