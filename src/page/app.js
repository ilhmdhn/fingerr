var test = null;
var myVal = "";
var currentFormat = Fingerprint.SampleFormat.PngImage;
var autoScanActive = false;
var scanData = {};

var deviceTechn = {
    0: "Unknown", 1: "Optical", 2: "Capacitive", 3: "Thermal", 4: "Pressure"
};

var deviceModality = {
    0: "Unknown", 1: "Swipe", 2: "Area", 3: "AreaMultifinger"
};

var deviceUidType = {
    0: "Persistent", 1: "Volatile"
};

var FingerprintSdkTest = (function () {
    function FingerprintSdkTest() {
        var _instance = this;
        this.operationToRestart = null;
        this.acquisitionStarted = false;
        this.sdk = new Fingerprint.WebApi;

        this.sdk.onDeviceConnected = function (e) {
            connectionState('CONNECTED');
            if (!_instance.acquisitionStarted && myVal) {
                connectionState('SCANNING...');
                _instance.startCapture();
            }
        };

        this.sdk.onDeviceDisconnected = function (e) {
            connectionState('DISCONNECT');
            // showMessage("Device disconnected", "error");
            _instance.acquisitionStarted = false;
        };

        this.sdk.onCommunicationFailed = function (e) {
            connectionState('CONNECTING FAILED ' + JSON.stringify(e));
            // showMessage("Communication Failed", "error");
        };

        this.sdk.onSamplesAcquired = function (s) {
            sampleAcquired(s);

            setTimeout(() => {
                if (autoScanActive && myVal) {
                    _instance.startCapture();
                }
            }, 1000);
        };

        this.sdk.onQualityReported = function (e) {
            qualityState(e)
        };
    }

    FingerprintSdkTest.prototype.startCapture = function () {
        if (this.acquisitionStarted) return;

        var _instance = this;
        // showMessage("Place finger on scanner...", "scanning");
        this.operationToRestart = this.startCapture;

        this.sdk.startAcquisition(currentFormat, myVal).then(function () {
            _instance.acquisitionStarted = true;
        }, function (error) {
            // showMessage("Error: " + error.message, "error");
            _instance.acquisitionStarted = false;
        });
    };

    FingerprintSdkTest.prototype.stopCapture = function () {
        if (!this.acquisitionStarted) return;

        var _instance = this;
        this.sdk.stopAcquisition().then(function () {
            _instance.acquisitionStarted = false;
            // showMessage("Scan stopped", "ready");
        }, function (error) {
            // showMessage("Error stopping: " + error.message, "error");
        });
    };

    FingerprintSdkTest.prototype.getInfo = function () {
        return this.sdk.enumerateDevices();
    };

    FingerprintSdkTest.prototype.getDeviceInfoWithID = function (uid) {
        return this.sdk.getDeviceInfo(uid);
    };
    return FingerprintSdkTest;
})();

window.onload = function () {
    test = new FingerprintSdkTest();
    autoSelectReader();
    autoScanActive = true;
};

function autoSelectReader() {
    var allReaders = test.getInfo();
    allReaders.then(function (sucessObj) {

        if (sucessObj.length == 0) {
            // showMessage("No reader detected. Please connect a reader.", "error");
            setTimeout(() => {
                autoSelectReader();
            }, 1500);
            // autoScanActive = false;
        } else {
            // Auto select first available reader
            myVal = sucessObj[0];
            // showMessage("Reader selected: " + myVal, "ready");

            // Start auto scanning
            if (autoScanActive) {
                setTimeout(() => {
                    test.startCapture();
                }, 1000);
            }
        }
    }, function (error) {
        // showMessage("Error detecting readers: " + error.message, "error");
        autoScanActive = false;
    });
}



function onDeviceInfo(id, element) {
    var myDeviceVal = test.getDeviceInfoWithID(id);
}

function sampleAcquired(s) {
    if (currentFormat == Fingerprint.SampleFormat.PngImage) {
        scanData.imageSrc = "";
        var samples = JSON.parse(s.samples);
        scanData.imageSrc = "data:image/png;base64," + Fingerprint.b64UrlTo64(samples[0]);
        captured(scanData.imageSrc)

    }
}


function getFormatName() {
    if (currentFormat == Fingerprint.SampleFormat.Raw) return "RAW";
    if (currentFormat == Fingerprint.SampleFormat.Intermediate) return "Feature Set";
    if (currentFormat == Fingerprint.SampleFormat.Compressed) return "WSQ";
    if (currentFormat == Fingerprint.SampleFormat.PngImage) return "PNG";
    return "Unknown";
}

function hasDataForCurrentFormat() {
    if (currentFormat == Fingerprint.SampleFormat.PngImage) return !!scanData.imageSrc;
    if (currentFormat == Fingerprint.SampleFormat.Raw) return !!scanData.raw;
    if (currentFormat == Fingerprint.SampleFormat.Compressed) return !!scanData.wsq;
    if (currentFormat == Fingerprint.SampleFormat.Intermediate) return !!scanData.intermediate;
    return false;
}
