import * as alt from 'alt-client'
import * as native from 'natives'

alt.log('Client-side has loaded')

const carEngineUrl = 'http://resource/client/carEngine/index.html'
const carPanelUrl = 'http://resource/client/panel/index.html'

let webview

alt.onServer('spawn:Player', spawnPlayer)
alt.onServer('vehicle:SetInto', setIntoVehicle)
alt.onServer('car:Enter', enterCar)
alt.on('keydown', vehicleStartStopMenu) //Alt -> start/stop vehicle menu
alt.onServer('fuel:End', stopEngine)
alt.on('keydown', vehicleStartStopMenu)

function closeWebview() {
    if (webview && webview.destroy) {
        webview.destroy()
        webview = undefined
    }
}

function spawnPlayer(pos) {
    alt.setTimeout(() => {
        alt.emitServer('spawn:Ready', pos)
    }, 500)
}

//refact
function enterCar(vehicle) {
    stopEngine(vehicle)
    closeWebview()
}

function setIntoVehicle(newVehicle) {
    const localPlayer = alt.Player.local.scriptID

    alt.setTimeout(() => {
        native.setPedIntoVehicle(localPlayer, newVehicle.scriptID, -1)
    }, 100)
}

function vehicleStartStopMenu(key) {
    if (key === 18) {
        const vehicle = alt.Player.local.vehicle
        if (vehicle) {
            // If the player is in a vehicle
            closeWebview()
            // if (!webview) {
            webview = new alt.WebView(carEngineUrl)
            webview.focus()
            webview.on('car:Start', () => {
                alt.emitServer('fuel:startSpend', vehicle)
                native.setVehicleEngineOn(vehicle.scriptID, true, true, true)
                closeWebview()
                alt.showCursor(false)
                alt.showCursor(false)
                vehiclePanelOn(vehicle)
            })
            webview.on('car:DrownOut', () => {
                alt.emitServer('fuel:stopSpend', vehicle)
                native.setVehicleEngineOn(vehicle.scriptID, false, true, true)
                closeWebview()
                alt.showCursor(false)
                alt.showCursor(false)
            })
            alt.showCursor(true)
        }
    } else if (key === 'F'.charCodeAt(0)) {
        closeWebview()
    }
}

function vehiclePanelOn(vehicle) {
    webview = new alt.WebView(carPanelUrl)
    alt.setInterval(() => {
        if (!webview) return
        let speed = native.getEntitySpeed(vehicle.scriptID)
        let kmh = speed * 3.6
        webview.emit('display:Velocity', kmh)
    }, 100)

    alt.onServer('fuel:Quantity', (fuel) => {
        if (!webview) return
        webview.emit('display:Fuel', fuel)
    })
}

function stopEngine(vehicle) {
    native.setVehicleEngineOn(vehicle.scriptID, false, true, true)
}
