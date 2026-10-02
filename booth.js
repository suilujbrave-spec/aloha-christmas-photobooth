/* =========================================
   ALOHA CHRISTMAS PHOTOBOOTH
========================================= */


/* =========================================
   SUPABASE
========================================= */

const SUPABASE_URL =
    "https://lrajkpaqlrwtxuymmygz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_WlwmZmHDCL7brx5vadiHZQ_C0ay61KZ";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================
   ELEMENTS
========================================= */

const camera =
    document.getElementById("camera");

const liveFrame =
    document.getElementById("liveFrame");

const modeScreen =
    document.getElementById("modeScreen");

const cameraScreen =
    document.getElementById("cameraScreen");

const previewScreen =
    document.getElementById("previewScreen");

const successScreen =
    document.getElementById("successScreen");

const cameraMessage =
    document.getElementById("cameraMessage");

const cameraMessageText =
    document.getElementById("cameraMessageText");

const startCameraButton =
    document.getElementById("startCameraButton");

const switchCameraButton =
    document.getElementById("switchCameraButton");

const changeModeButton =
    document.getElementById("changeModeButton");

const portraitModeButton =
    document.getElementById("portraitModeButton");

const landscapeModeButton =
    document.getElementById("landscapeModeButton");

const captureButton =
    document.getElementById("captureButton");

const retakeButton =
    document.getElementById("retakeButton");

const addToPartyButton =
    document.getElementById("addToPartyButton");

const downloadCleanButton =
    document.getElementById("downloadCleanButton");

const downloadFramedButton =
    document.getElementById("downloadFramedButton");

const takeAnotherButton =
    document.getElementById("takeAnotherButton");

const photoPreview =
    document.getElementById("photoPreview");

const successPhotoPreview =
    document.getElementById("successPhotoPreview");

const photoCanvas =
    document.getElementById("photoCanvas");

const cameraContainer =
    document.querySelector(".camera-container");

const previewContainer =
    document.querySelector(".preview-container");

const cameraTopControls =
    document.getElementById("cameraTopControls");

const cameraBottomControls =
    document.getElementById("cameraBottomControls");

const timerOffButton =
    document.getElementById("timerOffButton");

const timer3Button =
    document.getElementById("timer3Button");

const timer5Button =
    document.getElementById("timer5Button");

const countdownOverlay =
    document.getElementById("countdownOverlay");

const countdownNumber =
    document.getElementById("countdownNumber");

const uploadStatus =
    document.getElementById("uploadStatus");

const uploadStatusText =
    document.getElementById("uploadStatusText");

const uploadError =
    document.getElementById("uploadError");

const previewActions =
    document.getElementById("previewActions");

const ctx =
    photoCanvas.getContext("2d");


/* =========================================
   STATE
========================================= */

let OUTPUT_WIDTH = 1080;
let OUTPUT_HEIGHT = 1920;

let photoMode = "portrait";
let facingMode = "user";

let currentStream = null;

let cleanPhotoBlob = null;
let framedPhotoBlob = null;

let currentCaptureId = null;

let timerSeconds = 0;
let countdownRunning = false;

let uploadRunning = false;
let uploadCompleted = false;


/* =========================================
   FULLSCREEN
========================================= */

async function enterCameraFullscreen() {

    document.body.classList.add(
        "camera-active"
    );

    try {

        if (
            document.fullscreenEnabled &&
            !document.fullscreenElement
        ) {

            await document.documentElement
                .requestFullscreen({
                    navigationUI: "hide"
                });
        }

    } catch (error) {

        console.log(
            "Fullscreen unavailable:",
            error
        );
    }
}


async function exitCameraFullscreen() {

    document.body.classList.remove(
        "camera-active"
    );

    try {

        if (document.fullscreenElement) {

            await document.exitFullscreen();

        }

    } catch (error) {

        console.log(
            "Fullscreen exit unavailable:",
            error
        );
    }
}


/* =========================================
   MODE SELECTION
========================================= */

function selectPortraitMode() {

    switchToPortrait();

    modeScreen.classList.add(
        "hidden"
    );

    cameraScreen.classList.remove(
        "hidden"
    );

    prepareCameraScreen();
}


function selectLandscapeMode() {

    switchToLandscape();

    modeScreen.classList.add(
        "hidden"
    );

    cameraScreen.classList.remove(
        "hidden"
    );

    prepareCameraScreen();
}


/* =========================================
   PORTRAIT
========================================= */

function switchToPortrait() {

    photoMode = "portrait";

    OUTPUT_WIDTH = 1080;
    OUTPUT_HEIGHT = 1920;

    photoCanvas.width =
        OUTPUT_WIDTH;

    photoCanvas.height =
        OUTPUT_HEIGHT;

    liveFrame.src =
        "frame.png";

    cameraContainer.classList.remove(
        "landscape"
    );

    cameraContainer.classList.add(
        "portrait"
    );

    document.body.classList.remove(
        "landscape-mode"
    );

    updateModeButton();
}


/* =========================================
   LANDSCAPE
========================================= */

function switchToLandscape() {

    photoMode = "landscape";

    OUTPUT_WIDTH = 1920;
    OUTPUT_HEIGHT = 1080;

    photoCanvas.width =
        OUTPUT_WIDTH;

    photoCanvas.height =
        OUTPUT_HEIGHT;

    liveFrame.src =
        "frame_landscape.png";

    cameraContainer.classList.remove(
        "portrait"
    );

    cameraContainer.classList.add(
        "landscape"
    );

    document.body.classList.add(
        "landscape-mode"
    );

    updateModeButton();
}


/* =========================================
   TOGGLE ORIENTATION
========================================= */

function changePhotoMode() {

    if (
        countdownRunning ||
        uploadRunning
    ) {
        return;
    }

    if (photoMode === "portrait") {

        switchToLandscape();

    } else {

        switchToPortrait();

    }
}


/* =========================================
   MODE BUTTON
========================================= */

function updateModeButton() {

    if (photoMode === "portrait") {

        changeModeButton.textContent =
            "🖼️";

        changeModeButton.setAttribute(
            "aria-label",
            "Switch to landscape"
        );

        changeModeButton.title =
            "Switch to Landscape";

    } else {

        changeModeButton.textContent =
            "📱";

        changeModeButton.setAttribute(
            "aria-label",
            "Switch to portrait"
        );

        changeModeButton.title =
            "Switch to Portrait";
    }
}


/* =========================================
   PREPARE CAMERA
========================================= */

function prepareCameraScreen() {

    stopCamera();

    captureButton.disabled = true;

    cameraTopControls.classList.add(
        "hidden"
    );

    cameraBottomControls.classList.add(
        "hidden"
    );

    cameraMessage.classList.remove(
        "hidden"
    );

    cameraMessageText.textContent =
        "Tap below to start the Aloha Christmas camera.";

    startCameraButton.classList.remove(
        "hidden"
    );
}


/* =========================================
   GET CAMERA STREAM
========================================= */

async function getCameraStream() {

    const constraints = {

        audio: false,

        video: {

            facingMode: {
                ideal: facingMode
            }

        }

    };

    currentStream =
        await navigator.mediaDevices
            .getUserMedia(
                constraints
            );

    camera.srcObject =
        currentStream;

    await camera.play();

    updateCameraMirror();
}


/* =========================================
   START CAMERA
========================================= */

async function startCamera() {

    stopCamera();

    await enterCameraFullscreen();

    cameraMessage.classList.remove(
        "hidden"
    );

    cameraMessageText.textContent =
        "Starting camera...";

    startCameraButton.classList.add(
        "hidden"
    );

    cameraTopControls.classList.add(
        "hidden"
    );

    cameraBottomControls.classList.add(
        "hidden"
    );

    captureButton.disabled = true;

    try {

        await getCameraStream();

        cameraMessage.classList.add(
            "hidden"
        );

        cameraTopControls.classList.remove(
            "hidden"
        );

        cameraBottomControls.classList.remove(
            "hidden"
        );

        captureButton.disabled =
            false;

    } catch (error) {

        console.error(
            "Camera error:",
            error
        );

        cameraTopControls.classList.add(
            "hidden"
        );

        cameraBottomControls.classList.add(
            "hidden"
        );

        cameraMessage.classList.remove(
            "hidden"
        );

        startCameraButton.classList.remove(
            "hidden"
        );

        await exitCameraFullscreen();

        if (
            error.name ===
            "NotAllowedError"
        ) {

            cameraMessageText.textContent =
                "Camera access was blocked. Please allow camera permission and try again.";

        } else if (
            error.name ===
            "NotFoundError"
        ) {

            cameraMessageText.textContent =
                "No camera was found on this device.";

        } else {

            cameraMessageText.textContent =
                "The camera could not be started. Please check camera permissions and try again.";
        }
    }
}


/* =========================================
   STOP CAMERA
========================================= */

function stopCamera() {

    if (currentStream) {

        currentStream
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();

                }
            );
    }

    camera.srcObject = null;

    currentStream = null;
}


/* =========================================
   SWITCH FRONT / REAR CAMERA
========================================= */

async function switchCamera() {

    if (countdownRunning) {
        return;
    }

    if (facingMode === "user") {

        facingMode =
            "environment";

    } else {

        facingMode =
            "user";
    }

    stopCamera();

    cameraMessage.classList.remove(
        "hidden"
    );

    cameraMessageText.textContent =
        "Switching camera...";

    cameraTopControls.classList.add(
        "hidden"
    );

    cameraBottomControls.classList.add(
        "hidden"
    );

    captureButton.disabled = true;

    try {

        await getCameraStream();

        cameraMessage.classList.add(
            "hidden"
        );

        cameraTopControls.classList.remove(
            "hidden"
        );

        cameraBottomControls.classList.remove(
            "hidden"
        );

        captureButton.disabled =
            false;

    } catch (error) {

        console.error(
            "Camera switch error:",
            error
        );

        cameraMessage.classList.remove(
            "hidden"
        );

        cameraMessageText.textContent =
            "Could not switch camera. Please try again.";

        startCameraButton.classList.remove(
            "hidden"
        );
    }
}


/* =========================================
   SELFIE MIRROR
========================================= */

function updateCameraMirror() {

    if (facingMode === "user") {

        camera.classList.add(
            "selfie"
        );

    } else {

        camera.classList.remove(
            "selfie"
        );
    }
}


/* =========================================
   TIMER
========================================= */

function setTimer(seconds) {

    if (countdownRunning) {
        return;
    }

    timerSeconds = seconds;

    timerOffButton.classList.remove(
        "active"
    );

    timer3Button.classList.remove(
        "active"
    );

    timer5Button.classList.remove(
        "active"
    );

    if (seconds === 0) {

        timerOffButton.classList.add(
            "active"
        );

    } else if (seconds === 3) {

        timer3Button.classList.add(
            "active"
        );

    } else if (seconds === 5) {

        timer5Button.classList.add(
            "active"
        );
    }
}


/* =========================================
   WAIT
========================================= */

function waitOneSecond() {

    return new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                1000
            );

        }
    );
}


/* =========================================
   DISABLE CAMERA CONTROLS
========================================= */

function setCameraControlsDisabled(
    disabled
) {

    captureButton.disabled =
        disabled;

    timerOffButton.disabled =
        disabled;

    timer3Button.disabled =
        disabled;

    timer5Button.disabled =
        disabled;

    changeModeButton.disabled =
        disabled;

    switchCameraButton.disabled =
        disabled;
}


/* =========================================
   COUNTDOWN
========================================= */

async function runCountdown() {

    if (
        countdownRunning ||
        !currentStream
    ) {
        return;
    }

    if (timerSeconds === 0) {

        await capturePhoto();

        return;
    }

    countdownRunning = true;

    setCameraControlsDisabled(
        true
    );

    countdownOverlay.classList.remove(
        "hidden"
    );

    try {

        for (
            let number = timerSeconds;
            number > 0;
            number--
        ) {

            countdownNumber.textContent =
                number;

            await waitOneSecond();
        }

        countdownOverlay.classList.add(
            "hidden"
        );

        countdownNumber.textContent =
            "";

        await capturePhoto();

    } finally {

        countdownRunning = false;

        countdownOverlay.classList.add(
            "hidden"
        );

        countdownNumber.textContent =
            "";

        setCameraControlsDisabled(
            false
        );

        if (currentStream) {

            captureButton.disabled =
                false;
        }
    }
}


/* =========================================
   DRAW VIDEO AS COVER
========================================= */

function drawVideoCover(
    context,
    videoElement,
    destinationWidth,
    destinationHeight
) {

    const videoWidth =
        videoElement.videoWidth;

    const videoHeight =
        videoElement.videoHeight;

    const videoRatio =
        videoWidth / videoHeight;

    const destinationRatio =
        destinationWidth /
        destinationHeight;

    let sourceWidth;
    let sourceHeight;
    let sourceX;
    let sourceY;

    if (
        videoRatio >
        destinationRatio
    ) {

        sourceHeight =
            videoHeight;

        sourceWidth =
            videoHeight *
            destinationRatio;

        sourceX =
            (
                videoWidth -
                sourceWidth
            ) / 2;

        sourceY = 0;

    } else {

        sourceWidth =
            videoWidth;

        sourceHeight =
            videoWidth /
            destinationRatio;

        sourceX = 0;

        sourceY =
            (
                videoHeight -
                sourceHeight
            ) / 2;
    }

    context.drawImage(

        videoElement,

        sourceX,
        sourceY,

        sourceWidth,
        sourceHeight,

        0,
        0,

        destinationWidth,
        destinationHeight
    );
}


/* =========================================
   DRAW CAMERA IMAGE
========================================= */

function drawCameraImage() {

    ctx.clearRect(
        0,
        0,
        OUTPUT_WIDTH,
        OUTPUT_HEIGHT
    );

    if (facingMode === "user") {

        ctx.save();

        ctx.translate(
            OUTPUT_WIDTH,
            0
        );

        ctx.scale(
            -1,
            1
        );

        drawVideoCover(
            ctx,
            camera,
            OUTPUT_WIDTH,
            OUTPUT_HEIGHT
        );

        ctx.restore();

    } else {

        drawVideoCover(
            ctx,
            camera,
            OUTPUT_WIDTH,
            OUTPUT_HEIGHT
        );
    }
}


/* =========================================
   CANVAS TO JPEG BLOB
========================================= */

function canvasToBlob() {

    return new Promise(
        function (resolve) {

            photoCanvas.toBlob(
                resolve,
                "image/jpeg",
                0.92
            );

        }
    );
}


/* =========================================
   WAIT FOR FRAME
========================================= */

function waitForFrame() {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            if (
                liveFrame.complete &&
                liveFrame.naturalWidth > 0
            ) {

                resolve();

                return;
            }

            function handleLoad() {

                cleanup();

                resolve();
            }

            function handleError() {

                cleanup();

                reject(
                    new Error(
                        "The selected photo frame could not be loaded."
                    )
                );
            }

            function cleanup() {

                liveFrame.removeEventListener(
                    "load",
                    handleLoad
                );

                liveFrame.removeEventListener(
                    "error",
                    handleError
                );
            }

            liveFrame.addEventListener(
                "load",
                handleLoad
            );

            liveFrame.addEventListener(
                "error",
                handleError
            );
        }
    );
}


/* =========================================
   CAPTURE PHOTO
========================================= */

async function capturePhoto() {

    try {

        if (
            !camera.videoWidth ||
            !camera.videoHeight
        ) {

            alert(
                "Camera is not ready yet. Please try again."
            );

            return;
        }

        captureButton.disabled = true;

        await waitForFrame();


        /*
            CLEAN PHOTO
        */

        drawCameraImage();

        cleanPhotoBlob =
            await canvasToBlob();

        if (!cleanPhotoBlob) {

            throw new Error(
                "Could not create clean photo."
            );
        }


        /*
            FRAMED PHOTO
        */

        ctx.drawImage(
            liveFrame,
            0,
            0,
            OUTPUT_WIDTH,
            OUTPUT_HEIGHT
        );

        framedPhotoBlob =
            await canvasToBlob();

        if (!framedPhotoBlob) {

            throw new Error(
                "Could not create framed photo."
            );
        }


        /*
            CAPTURE ID
        */

        currentCaptureId =
            createCaptureId();

        uploadCompleted = false;


        /*
            PREVIEW
        */

        setImageFromBlob(
            photoPreview,
            framedPhotoBlob
        );

        updatePreviewOrientation();


        /*
            STOP CAMERA / EXIT IMMERSIVE VIEW
        */

        stopCamera();

        cameraTopControls.classList.add(
            "hidden"
        );

        cameraBottomControls.classList.add(
            "hidden"
        );

        await exitCameraFullscreen();


        /*
            SHOW PREVIEW
        */

        cameraScreen.classList.add(
            "hidden"
        );

        previewScreen.classList.remove(
            "hidden"
        );

        resetUploadInterface();

    } catch (error) {

        console.error(
            "Photo error:",
            error
        );

        alert(
            "Photo error:\n\n" +
            error.message
        );

        captureButton.disabled =
            false;
    }
}


/* =========================================
   CAPTURE ID
========================================= */

function createCaptureId() {

    let randomPart;

    if (
        window.crypto &&
        typeof crypto.randomUUID ===
            "function"
    ) {

        randomPart =
            crypto.randomUUID()
                .replaceAll(
                    "-",
                    ""
                )
                .slice(
                    0,
                    12
                )
                .toUpperCase();

    } else {

        randomPart =
            (
                Date.now()
                    .toString(36) +
                Math.random()
                    .toString(36)
                    .slice(2)
            )
                .slice(
                    0,
                    12
                )
                .toUpperCase();
    }

    return (
        "AC26_" +
        randomPart
    );
}


/* =========================================
   BLOB PREVIEW
========================================= */

function setImageFromBlob(
    imageElement,
    blob
) {

    if (
        imageElement.dataset.objectUrl
    ) {

        URL.revokeObjectURL(
            imageElement.dataset.objectUrl
        );
    }

    const url =
        URL.createObjectURL(
            blob
        );

    imageElement.src =
        url;

    imageElement.dataset.objectUrl =
        url;
}


/* =========================================
   PREVIEW ORIENTATION
========================================= */

function updatePreviewOrientation() {

    if (!previewContainer) {
        return;
    }

    if (
        photoMode ===
        "landscape"
    ) {

        previewContainer.style.aspectRatio =
            "16 / 9";

    } else {

        previewContainer.style.aspectRatio =
            "9 / 16";
    }
}


/* =========================================
   RESET UPLOAD UI
========================================= */

function resetUploadInterface() {

    uploadRunning = false;

    uploadStatus.classList.add(
        "hidden"
    );

    uploadError.classList.add(
        "hidden"
    );

    uploadError.textContent = "";

    previewActions.classList.remove(
        "hidden"
    );

    addToPartyButton.disabled =
        false;

    retakeButton.disabled =
        false;
}


/* =========================================
   RETAKE
========================================= */

async function retakePhoto() {

    if (uploadRunning) {
        return;
    }

    previewScreen.classList.add(
        "hidden"
    );

    cameraScreen.classList.remove(
        "hidden"
    );

    cleanPhotoBlob = null;
    framedPhotoBlob = null;
    currentCaptureId = null;
    uploadCompleted = false;

    await startCamera();
}


/* =========================================
   ADD TO PARTY
========================================= */

async function addToParty() {

    if (
        uploadRunning ||
        uploadCompleted
    ) {
        return;
    }

    if (
        !cleanPhotoBlob ||
        !framedPhotoBlob ||
        !currentCaptureId
    ) {

        showUploadError(
            "The photo is not ready. Please retake the picture."
        );

        return;
    }

    uploadRunning = true;

    addToPartyButton.disabled =
        true;

    retakeButton.disabled =
        true;

    uploadError.classList.add(
        "hidden"
    );

    uploadStatus.classList.remove(
        "hidden"
    );

    try {

        const cleanPath =
            "clean/" +
            currentCaptureId +
            "_clean.jpg";

        const framedPath =
            "framed/" +
            currentCaptureId +
            "_framed.jpg";


        /*
            CLEAN UPLOAD
        */

        uploadStatusText.textContent =
            "Uploading clean photo...";

        const cleanResult =
            await supabaseClient
                .storage
                .from("party-photos")
                .upload(
                    cleanPath,
                    cleanPhotoBlob,
                    {
                        contentType:
                            "image/jpeg",

                        cacheControl:
                            "3600",

                        upsert:
                            false
                    }
                );

        if (cleanResult.error) {

            throw new Error(
                "Clean photo upload failed: " +
                cleanResult.error.message
            );
        }


        /*
            FRAMED UPLOAD
        */

        uploadStatusText.textContent =
            "Uploading framed photo...";

        const framedResult =
            await supabaseClient
                .storage
                .from("party-photos")
                .upload(
                    framedPath,
                    framedPhotoBlob,
                    {
                        contentType:
                            "image/jpeg",

                        cacheControl:
                            "3600",

                        upsert:
                            false
                    }
                );

        if (framedResult.error) {

            throw new Error(
                "Framed photo upload failed: " +
                framedResult.error.message
            );
        }


        /*
            DATABASE RECORD
        */

        uploadStatusText.textContent =
            "Adding photo to the party...";

        const databaseResult =
            await supabaseClient
                .from("party_photos")
                .insert(
                    {
                        capture_id:
                            currentCaptureId,

                        clean_path:
                            cleanPath,

                        framed_path:
                            framedPath,

                        photo_mode:
                            photoMode,

                        status:
                            "pending"
                    }
                );

        if (databaseResult.error) {

            throw new Error(
                "Photo record failed: " +
                databaseResult.error.message
            );
        }


        /*
            SUCCESS
        */

        uploadCompleted = true;

        uploadRunning = false;

        showSuccessScreen();

    } catch (error) {

        console.error(
            "Upload error:",
            error
        );

        uploadRunning = false;

        showUploadError(
            error.message
        );

        addToPartyButton.disabled =
            false;

        retakeButton.disabled =
            false;
    }
}


/* =========================================
   UPLOAD ERROR
========================================= */

function showUploadError(
    message
) {

    uploadStatus.classList.add(
        "hidden"
    );

    uploadError.classList.remove(
        "hidden"
    );

    uploadError.textContent =
        "Upload failed. " +
        message +
        " Please try again.";
}


/* =========================================
   SUCCESS SCREEN
========================================= */

function showSuccessScreen() {

    uploadStatus.classList.add(
        "hidden"
    );

    previewScreen.classList.add(
        "hidden"
    );

    setImageFromBlob(
        successPhotoPreview,
        framedPhotoBlob
    );

    successScreen.classList.remove(
        "hidden"
    );
}


/* =========================================
   TAKE ANOTHER
========================================= */

async function takeAnotherPhoto() {

    successScreen.classList.add(
        "hidden"
    );

    cameraScreen.classList.remove(
        "hidden"
    );

    cleanPhotoBlob = null;
    framedPhotoBlob = null;
    currentCaptureId = null;

    uploadCompleted = false;
    uploadRunning = false;

    await startCamera();
}


/* =========================================
   DOWNLOAD
========================================= */

function downloadBlob(
    blob,
    filename
) {

    if (!blob) {
        return;
    }

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        url;

    link.download =
        filename;

    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

    setTimeout(
        function () {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );
}


/* =========================================
   DOWNLOAD FILENAME
========================================= */

function createPhotoFilename(
    version
) {

    if (currentCaptureId) {

        return (
            currentCaptureId +
            "_" +
            version +
            ".jpg"
        );
    }

    return (
        "aloha-" +
        photoMode +
        "-" +
        Date.now() +
        "-" +
        version +
        ".jpg"
    );
}


/* =========================================
   DOWNLOAD CLEAN
========================================= */

function downloadCleanPhoto() {

    downloadBlob(
        cleanPhotoBlob,
        createPhotoFilename(
            "clean"
        )
    );
}


/* =========================================
   DOWNLOAD FRAMED
========================================= */

function downloadFramedPhoto() {

    downloadBlob(
        framedPhotoBlob,
        createPhotoFilename(
            "framed"
        )
    );
}


/* =========================================
   EVENTS
========================================= */

portraitModeButton.addEventListener(
    "click",
    selectPortraitMode
);

landscapeModeButton.addEventListener(
    "click",
    selectLandscapeMode
);

changeModeButton.addEventListener(
    "click",
    changePhotoMode
);

startCameraButton.addEventListener(
    "click",
    startCamera
);

switchCameraButton.addEventListener(
    "click",
    switchCamera
);

captureButton.addEventListener(
    "click",
    runCountdown
);

retakeButton.addEventListener(
    "click",
    retakePhoto
);

addToPartyButton.addEventListener(
    "click",
    addToParty
);

downloadCleanButton.addEventListener(
    "click",
    downloadCleanPhoto
);

downloadFramedButton.addEventListener(
    "click",
    downloadFramedPhoto
);

takeAnotherButton.addEventListener(
    "click",
    takeAnotherPhoto
);


/* =========================================
   TIMER EVENTS
========================================= */

timerOffButton.addEventListener(
    "click",
    function () {

        setTimer(0);

    }
);

timer3Button.addEventListener(
    "click",
    function () {

        setTimer(3);

    }
);

timer5Button.addEventListener(
    "click",
    function () {

        setTimer(5);

    }
);


/* =========================================
   CLEANUP
========================================= */

window.addEventListener(
    "pagehide",
    function () {

        stopCamera();

    }
);


/* =========================================
   INITIAL STATE
========================================= */

updateModeButton();

setTimer(0);
