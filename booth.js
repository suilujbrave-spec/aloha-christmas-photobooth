/* =========================================
   ALOHA CHRISTMAS PHOTOBOOTH V2
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
   SETTINGS
========================================= */

const MAX_SHOTS = 10;


/* =========================================
   ELEMENT HELPER
========================================= */

const $ =
    function (id) {

        return document.getElementById(id);

    };


/* =========================================
   ELEMENTS
========================================= */

const camera =
    $("camera");

const liveFrame =
    $("liveFrame");

const modeScreen =
    $("modeScreen");

const cameraScreen =
    $("cameraScreen");

const reviewScreen =
    $("reviewScreen");

const successScreen =
    $("successScreen");


const cameraMessage =
    $("cameraMessage");

const cameraMessageText =
    $("cameraMessageText");

const startCameraButton =
    $("startCameraButton");

const switchCameraButton =
    $("switchCameraButton");

const changeModeButton =
    $("changeModeButton");


const portraitModeButton =
    $("portraitModeButton");

const landscapeModeButton =
    $("landscapeModeButton");


const captureButton =
    $("captureButton");


/* =========================================
   FLASH
========================================= */

const flashButton =
    $("flashButton");

const flashState =
    $("flashState");


/* =========================================
   CAMERA CONTROLS
========================================= */

const cameraTopControls =
    $("cameraTopControls");

const cameraBottomControls =
    $("cameraBottomControls");

const shotStatus =
    $("shotStatus");

const shotCount =
    $("shotCount");

const reviewButton =
    $("reviewButton");


/* =========================================
   TIMER
========================================= */

const timerOffButton =
    $("timerOffButton");

const timer3Button =
    $("timer3Button");

const timer5Button =
    $("timer5Button");

const countdownOverlay =
    $("countdownOverlay");

const countdownNumber =
    $("countdownNumber");


/* =========================================
   REVIEW
========================================= */

const reviewGrid =
    $("reviewGrid");

const selectedCount =
    $("selectedCount");

const reviewHint =
    $("reviewHint");

const takeMoreButton =
    $("takeMoreButton");

const addSelectedButton =
    $("addSelectedButton");


/* =========================================
   UPLOAD
========================================= */

const uploadStatus =
    $("uploadStatus");

const uploadStatusText =
    $("uploadStatusText");

const uploadError =
    $("uploadError");

const reviewActions =
    $("reviewActions");


/* =========================================
   SUCCESS
========================================= */

const successTitle =
    $("successTitle");

const successMessage =
    $("successMessage");

const successDownloads =
    $("successDownloads");

const takeAnotherButton =
    $("takeAnotherButton");


/* =========================================
   CANVAS
========================================= */

const photoCanvas =
    $("photoCanvas");

const ctx =
    photoCanvas.getContext("2d");

const cameraContainer =
    document.querySelector(
        ".camera-container"
    );


/* =========================================
   STATE
========================================= */

let OUTPUT_WIDTH = 1080;
let OUTPUT_HEIGHT = 1920;

let photoMode =
    "portrait";

let facingMode =
    "user";

let currentStream =
    null;

let timerSeconds =
    0;

let countdownRunning =
    false;

let uploadRunning =
    false;


/* =========================================
   MULTI SHOT
========================================= */

let capturedShots =
    [];

let lastUploadedShots =
    [];


/* =========================================
   FLASH STATE

   flashMethod can be:

   "none"
   "still"
   "torch"
========================================= */

let flashEnabled =
    false;

let stillFlashSupported =
    false;

let flashMethod =
    "none";


/* =========================================
   DEVICE ORIENTATION
========================================= */

const landscapeOrientation =
    window.matchMedia(
        "(orientation: landscape)"
    );


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

            await document
                .documentElement
                .requestFullscreen(
                    {
                        navigationUI:
                            "hide"
                    }
                );

        }

    } catch (error) {

        console.log(
            "Fullscreen unavailable:",
            error
        );

    }
}


/* =========================================
   EXIT FULLSCREEN
========================================= */

async function exitCameraFullscreen() {

    document.body.classList.remove(
        "camera-active"
    );


    try {

        if (
            document.fullscreenElement
        ) {

            await document
                .exitFullscreen();

        }

    } catch (error) {

        console.log(
            "Fullscreen exit unavailable:",
            error
        );

    }
}


/* =========================================
   PORTRAIT
========================================= */

function switchToPortrait() {

    photoMode =
        "portrait";


    OUTPUT_WIDTH =
        1080;

    OUTPUT_HEIGHT =
        1920;


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


    updateModeButton();
}


/* =========================================
   LANDSCAPE
========================================= */

function switchToLandscape() {

    photoMode =
        "landscape";


    OUTPUT_WIDTH =
        1920;

    OUTPUT_HEIGHT =
        1080;


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


    updateModeButton();
}


/* =========================================
   AUTO ORIENTATION
========================================= */

function syncPhotoModeWithDevice() {

    if (
        countdownRunning ||
        uploadRunning
    ) {
        return;
    }


    if (
        landscapeOrientation.matches
    ) {

        switchToLandscape();

    } else {

        switchToPortrait();

    }
}


/* =========================================
   MANUAL ORIENTATION SWITCH
========================================= */

function changePhotoMode() {

    if (
        countdownRunning ||
        uploadRunning
    ) {
        return;
    }


    if (
        photoMode ===
        "portrait"
    ) {

        switchToLandscape();

    } else {

        switchToPortrait();

    }
}


/* =========================================
   MODE BUTTON
========================================= */

function updateModeButton() {

    if (
        photoMode ===
        "portrait"
    ) {

        changeModeButton.textContent =
            "🖼️";

        changeModeButton.title =
            "Switch to Landscape";


    } else {

        changeModeButton.textContent =
            "📱";

        changeModeButton.title =
            "Switch to Portrait";

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
   PREPARE CAMERA
========================================= */

function prepareCameraScreen() {

    stopCamera();


    captureButton.disabled =
        true;


    cameraTopControls.classList.add(
        "hidden"
    );


    cameraBottomControls.classList.add(
        "hidden"
    );


    shotStatus.classList.add(
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

    currentStream =
        await navigator
            .mediaDevices
            .getUserMedia(
                {

                    audio:
                        false,

                    video: {

                        facingMode: {
                            ideal:
                                facingMode
                        }

                    }

                }
            );


    camera.srcObject =
        currentStream;


    await camera.play();


    updateCameraMirror();


    await updateFlashCapability();
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


        shotStatus.classList.remove(
            "hidden"
        );


        captureButton.disabled =
            capturedShots.length >=
            MAX_SHOTS;


        updateShotStatus();


    } catch (error) {

        console.error(
            "Camera error:",
            error
        );


        await exitCameraFullscreen();


        cameraMessage.classList.remove(
            "hidden"
        );


        cameraMessageText.textContent =
            "The camera could not be started. Please check camera permission and try again.";


        startCameraButton.classList.remove(
            "hidden"
        );

    }
}


/* =========================================
   STOP CAMERA
========================================= */

function stopCamera() {

    if (
        currentStream
    ) {

        const videoTracks =
            currentStream
                .getVideoTracks();


        /*
            Disable torch before closing
            the camera if necessary.
        */

        if (
            flashMethod === "torch" &&
            videoTracks.length > 0
        ) {

            videoTracks[0]
                .applyConstraints(
                    {
                        advanced: [
                            {
                                torch:
                                    false
                            }
                        ]
                    }
                )
                .catch(
                    function () {

                        /*
                            Ignore cleanup failure.
                        */

                    }
                );

        }


        currentStream
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();

                }
            );

    }


    camera.srcObject =
        null;


    currentStream =
        null;


    flashEnabled =
        false;


    stillFlashSupported =
        false;


    flashMethod =
        "none";


    updateFlashButton();
}


/* =========================================
   SWITCH FRONT / REAR CAMERA
========================================= */

async function switchCamera() {

    if (
        countdownRunning
    ) {
        return;
    }


    if (
        facingMode ===
        "user"
    ) {

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


        shotStatus.classList.remove(
            "hidden"
        );


        captureButton.disabled =
            capturedShots.length >=
            MAX_SHOTS;


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
   CAMERA MIRROR
========================================= */

function updateCameraMirror() {

    camera.classList.toggle(
        "selfie",
        facingMode ===
            "user"
    );
}


/* =========================================
   FLASH CAPABILITY

   Preferred:
   still photographic flash

   Fallback:
   LED torch
========================================= */

async function updateFlashCapability() {

    stillFlashSupported =
        false;


    flashEnabled =
        false;


    flashMethod =
        "none";


    /*
        Flash is intended for the rear
        camera only.
    */

    if (
        facingMode !==
            "environment" ||
        !currentStream
    ) {

        updateFlashButton();

        return;
    }


    const track =
        currentStream
            .getVideoTracks()[0];


    /* =====================================
       METHOD 1
       Dedicated still-photo flash
    ====================================== */

    if (
        typeof ImageCapture !==
        "undefined"
    ) {

        try {

            const imageCapture =
                new ImageCapture(
                    track
                );


            if (
                typeof imageCapture
                    .getPhotoCapabilities ===
                "function"
            ) {

                const photoCapabilities =
                    await imageCapture
                        .getPhotoCapabilities();


                console.log(
                    "Photo capabilities:",
                    photoCapabilities
                );


                const modes =
                    Array.isArray(
                        photoCapabilities
                            .fillLightMode
                    )
                        ? photoCapabilities
                            .fillLightMode
                        : [];


                if (
                    modes.includes(
                        "flash"
                    )
                ) {

                    stillFlashSupported =
                        true;


                    flashMethod =
                        "still";

                }

            }

        } catch (error) {

            console.log(
                "Still-photo flash detection unavailable:",
                error
            );

        }

    }


    /* =====================================
       METHOD 2
       Torch fallback
    ====================================== */

    if (
        flashMethod ===
            "none" &&
        typeof track
            .getCapabilities ===
            "function"
    ) {

        try {

            const trackCapabilities =
                track.getCapabilities();


            console.log(
                "Track capabilities:",
                trackCapabilities
            );


            /*
                Different browser engines may
                expose torch as a boolean or
                boolean-array style capability.

                Accept both.
            */

            const torchCapability =
                trackCapabilities.torch;


            const torchSupported =
                torchCapability ===
                    true ||
                (
                    Array.isArray(
                        torchCapability
                    ) &&
                    torchCapability.includes(
                        true
                    )
                );


            if (
                torchSupported
            ) {

                stillFlashSupported =
                    true;


                flashMethod =
                    "torch";

            }

        } catch (error) {

            console.log(
                "Torch detection unavailable:",
                error
            );

        }

    }


    console.log(
        "Selected flash method:",
        flashMethod
    );


    updateFlashButton();
}


/* =========================================
   FLASH BUTTON UI
========================================= */

function updateFlashButton() {

    if (
        !flashButton
    ) {
        return;
    }


    flashButton.classList.toggle(
        "hidden",
        !stillFlashSupported
    );


    flashButton.classList.toggle(
        "active",
        flashEnabled &&
        stillFlashSupported
    );


    if (
        flashState
    ) {

        flashState.textContent =
            flashEnabled
                ? "ON"
                : "OFF";

    }


    flashButton.title =
        flashEnabled
            ? "Still flash on"
            : "Still flash off";


    flashButton.setAttribute(
        "aria-label",
        flashEnabled
            ? "Turn flash off"
            : "Turn flash on"
    );
}


/* =========================================
   FLASH ON / OFF
========================================= */

async function toggleFlash() {

    if (
        !stillFlashSupported ||
        !currentStream
    ) {
        return;
    }


    flashEnabled =
        !flashEnabled;


    /*
        Torch fallback immediately switches
        the rear LED on or off.
    */

    if (
        flashMethod ===
        "torch"
    ) {

        try {

            const track =
                currentStream
                    .getVideoTracks()[0];


            await track
                .applyConstraints(
                    {
                        advanced: [
                            {
                                torch:
                                    flashEnabled
                            }
                        ]
                    }
                );


        } catch (error) {

            console.error(
                "Torch control failed:",
                error
            );


            flashEnabled =
                false;

        }

    }


    updateFlashButton();
}


/* =========================================
   TIMER
========================================= */

function setTimer(
    seconds
) {

    if (
        countdownRunning
    ) {
        return;
    }


    timerSeconds =
        seconds;


    timerOffButton.classList.remove(
        "active"
    );


    timer3Button.classList.remove(
        "active"
    );


    timer5Button.classList.remove(
        "active"
    );


    if (
        seconds === 0
    ) {

        timerOffButton.classList.add(
            "active"
        );


    } else if (
        seconds === 3
    ) {

        timer3Button.classList.add(
            "active"
        );


    } else {

        timer5Button.classList.add(
            "active"
        );

    }
}


/* =========================================
   WAIT
========================================= */

function wait(
    milliseconds
) {

    return new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                milliseconds
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


    flashButton.disabled =
        disabled;


    reviewButton.disabled =
        disabled;
}


/* =========================================
   COUNTDOWN
========================================= */

async function runCountdown() {

    if (
        countdownRunning ||
        !currentStream ||
        capturedShots.length >=
            MAX_SHOTS
    ) {
        return;
    }


    if (
        timerSeconds === 0
    ) {

        await capturePhoto();

        return;
    }


    countdownRunning =
        true;


    setCameraControlsDisabled(
        true
    );


    countdownOverlay.classList.remove(
        "hidden"
    );


    try {

        for (
            let number =
                timerSeconds;

            number > 0;

            number--
        ) {

            countdownNumber.textContent =
                number;


            await wait(
                1000
            );

        }


        countdownOverlay.classList.add(
            "hidden"
        );


        countdownNumber.textContent =
            "";


        await capturePhoto();


    } finally {

        countdownRunning =
            false;


        countdownOverlay.classList.add(
            "hidden"
        );


        countdownNumber.textContent =
            "";


        setCameraControlsDisabled(
            false
        );


        captureButton.disabled =
            capturedShots.length >=
            MAX_SHOTS;


        reviewButton.disabled =
            capturedShots.length ===
            0;

    }
}


/* =========================================
   DRAW SOURCE AS COVER
========================================= */

function drawSourceCover(
    source,
    sourceWidth,
    sourceHeight
) {

    const sourceRatio =
        sourceWidth /
        sourceHeight;


    const destinationRatio =
        OUTPUT_WIDTH /
        OUTPUT_HEIGHT;


    let sourceX =
        0;

    let sourceY =
        0;

    let cropWidth =
        sourceWidth;

    let cropHeight =
        sourceHeight;


    if (
        sourceRatio >
        destinationRatio
    ) {

        cropWidth =
            sourceHeight *
            destinationRatio;


        sourceX =
            (
                sourceWidth -
                cropWidth
            ) / 2;


    } else {

        cropHeight =
            sourceWidth /
            destinationRatio;


        sourceY =
            (
                sourceHeight -
                cropHeight
            ) / 2;

    }


    ctx.drawImage(

        source,

        sourceX,
        sourceY,

        cropWidth,
        cropHeight,

        0,
        0,

        OUTPUT_WIDTH,
        OUTPUT_HEIGHT

    );
}


/* =========================================
   VIDEO FRAME CAPTURE
========================================= */

function drawVideoClean() {

    ctx.clearRect(
        0,
        0,
        OUTPUT_WIDTH,
        OUTPUT_HEIGHT
    );


    if (
        facingMode ===
        "user"
    ) {

        ctx.save();


        ctx.translate(
            OUTPUT_WIDTH,
            0
        );


        ctx.scale(
            -1,
            1
        );


        drawSourceCover(
            camera,
            camera.videoWidth,
            camera.videoHeight
        );


        ctx.restore();


    } else {

        drawSourceCover(
            camera,
            camera.videoWidth,
            camera.videoHeight
        );

    }
}


/* =========================================
   CANVAS → JPEG
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
                liveFrame.naturalWidth >
                    0
            ) {

                resolve();

                return;
            }


            function loaded() {

                cleanup();

                resolve();

            }


            function failed() {

                cleanup();


                reject(
                    new Error(
                        "Photo frame could not be loaded."
                    )
                );

            }


            function cleanup() {

                liveFrame.removeEventListener(
                    "load",
                    loaded
                );


                liveFrame.removeEventListener(
                    "error",
                    failed
                );

            }


            liveFrame.addEventListener(
                "load",
                loaded
            );


            liveFrame.addEventListener(
                "error",
                failed
            );

        }
    );
}


/* =========================================
   STILL PHOTO CAPTURE

   Preferred:
   ImageCapture.takePhoto()

   Fallback:
   video frame → canvas
========================================= */

async function drawStillCleanIfAvailable() {

    if (
        facingMode !==
            "environment" ||
        typeof ImageCapture ===
            "undefined" ||
        !currentStream
    ) {

        drawVideoClean();

        return;
    }


    try {

        const track =
            currentStream
                .getVideoTracks()[0];


        const imageCapture =
            new ImageCapture(
                track
            );


        const photoSettings =
            {};


        /*
            Dedicated photographic flash.
        */

        if (
            flashMethod ===
            "still"
        ) {

            photoSettings.fillLightMode =
                flashEnabled
                    ? "flash"
                    : "off";

        }


        /*
            With flashMethod === "torch",
            LED state has already been
            controlled by toggleFlash().
        */

        const photoBlob =
            await imageCapture
                .takePhoto(
                    photoSettings
                );


        const bitmap =
            await createImageBitmap(
                photoBlob
            );


        ctx.clearRect(
            0,
            0,
            OUTPUT_WIDTH,
            OUTPUT_HEIGHT
        );


        drawSourceCover(
            bitmap,
            bitmap.width,
            bitmap.height
        );


        bitmap.close();


    } catch (error) {

        console.log(
            "Still capture fallback:",
            error
        );


        drawVideoClean();

    }
}


/* =========================================
   CAPTURE ID
========================================= */

function createCaptureId() {

    let value;


    if (
        window.crypto &&
        typeof crypto.randomUUID ===
            "function"
    ) {

        value =
            crypto.randomUUID()
                .replaceAll(
                    "-",
                    ""
                );


    } else {

        value =
            Date.now()
                .toString(36) +
            Math.random()
                .toString(36)
                .slice(2);

    }


    return (
        "AC26_" +
        value
            .slice(
                0,
                12
            )
            .toUpperCase()
    );
}


/* =========================================
   CAPTURE PHOTO
========================================= */

async function capturePhoto() {

    if (
        !camera.videoWidth ||
        !camera.videoHeight
    ) {
        return;
    }


    captureButton.disabled =
        true;


    try {

        await waitForFrame();


        /* =================================
           CLEAN PHOTO
        ================================= */

        await drawStillCleanIfAvailable();


        const cleanBlob =
            await canvasToBlob();


        if (
            !cleanBlob
        ) {

            throw new Error(
                "Could not create clean photo."
            );

        }


        /* =================================
           FRAME
        ================================= */

        ctx.drawImage(
            liveFrame,
            0,
            0,
            OUTPUT_WIDTH,
            OUTPUT_HEIGHT
        );


        const framedBlob =
            await canvasToBlob();


        if (
            !framedBlob
        ) {

            throw new Error(
                "Could not create framed photo."
            );

        }


        /* =================================
           ADD SHOT
        ================================= */

        const shot = {

            id:
                createCaptureId(),

            cleanBlob:
                cleanBlob,

            framedBlob:
                framedBlob,

            mode:
                photoMode,

            selected:
                true

        };


        capturedShots.push(
            shot
        );


        /*
            Automatically attempt to save
            the clean original.
        */

        attemptCleanDownload(
            shot
        );


        updateShotStatus();


        flashCaptureEffect();


        /*
            Automatically open review at
            MAX_SHOTS.
        */

        if (
            capturedShots.length >=
            MAX_SHOTS
        ) {

            await openReview();

        }


    } catch (error) {

        console.error(
            "Photo error:",
            error
        );


        alert(
            "Photo error:\n\n" +
            error.message
        );


    } finally {

        captureButton.disabled =
            capturedShots.length >=
            MAX_SHOTS;

    }
}


/* =========================================
   VISUAL CAPTURE FLASH
========================================= */

function flashCaptureEffect() {

    if (
        !cameraContainer.animate
    ) {
        return;
    }


    cameraContainer.animate(
        [

            {
                filter:
                    "brightness(1)"
            },

            {
                filter:
                    "brightness(1.7)"
            },

            {
                filter:
                    "brightness(1)"
            }

        ],
        {
            duration:
                180
        }
    );
}


/* =========================================
   SHOT STATUS
========================================= */

function updateShotStatus() {

    shotCount.textContent =
        capturedShots.length +
        " / " +
        MAX_SHOTS;


    reviewButton.disabled =
        capturedShots.length ===
        0;
}


/* =========================================
   OPEN REVIEW
========================================= */

async function openReview() {

    if (
        capturedShots.length ===
        0
    ) {
        return;
    }


    stopCamera();


    cameraTopControls.classList.add(
        "hidden"
    );


    cameraBottomControls.classList.add(
        "hidden"
    );


    shotStatus.classList.add(
        "hidden"
    );


    await exitCameraFullscreen();


    cameraScreen.classList.add(
        "hidden"
    );


    reviewScreen.classList.remove(
        "hidden"
    );


    renderReview();
}


/* =========================================
   REVIEW GRID
========================================= */

function renderReview() {

    reviewGrid.innerHTML =
        "";


    capturedShots.forEach(
        function (
            shot,
            index
        ) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "review-shot " +
                (
                    shot.mode ===
                    "landscape"
                        ? "landscape "
                        : ""
                ) +
                (
                    shot.selected
                        ? "selected"
                        : ""
                );


            const image =
                document.createElement(
                    "img"
                );


            const objectUrl =
                URL.createObjectURL(
                    shot.framedBlob
                );


            image.src =
                objectUrl;


            image.onload =
                function () {

                    URL.revokeObjectURL(
                        objectUrl
                    );

                };


            const check =
                document.createElement(
                    "span"
                );


            check.className =
                "review-check";


            check.textContent =
                shot.selected
                    ? "✓"
                    : "○";


            button.append(
                image,
                check
            );


            button.addEventListener(
                "click",
                function () {

                    capturedShots[index]
                        .selected =
                        !capturedShots[index]
                            .selected;


                    renderReview();

                }
            );


            reviewGrid.appendChild(
                button
            );

        }
    );


    const count =
        capturedShots.filter(
            function (shot) {

                return shot.selected;

            }
        ).length;


    selectedCount.textContent =
        count +
        (
            count === 1
                ? " selected"
                : " selected"
        );


    if (
        count > 0
    ) {

        reviewHint.textContent =
            "Only selected photos will be added to the party.";

    } else {

        reviewHint.textContent =
            "Select at least one photo.";

    }


    addSelectedButton.disabled =
        count === 0 ||
        uploadRunning;


    takeMoreButton.disabled =
        uploadRunning ||
        capturedShots.length >=
            MAX_SHOTS;


    if (
        count > 0
    ) {

        addSelectedButton.textContent =
            "☁️ Add " +
            count +
            " Selected to Party";


    } else {

        addSelectedButton.textContent =
            "☁️ Add Selected to Party";

    }
}


/* =========================================
   TAKE MORE PHOTOS
========================================= */

async function takeMorePhotos() {

    reviewScreen.classList.add(
        "hidden"
    );


    cameraScreen.classList.remove(
        "hidden"
    );


    await startCamera();
}


/* =========================================
   UPLOAD ONE SHOT
========================================= */

async function uploadShot(
    shot
) {

    const cleanPath =
        "clean/" +
        shot.id +
        "_clean.jpg";


    const framedPath =
        "framed/" +
        shot.id +
        "_framed.jpg";


    /* =====================================
       CLEAN
    ====================================== */

    let result =
        await supabaseClient
            .storage
            .from(
                "party-photos"
            )
            .upload(
                cleanPath,
                shot.cleanBlob,
                {
                    contentType:
                        "image/jpeg",

                    cacheControl:
                        "3600",

                    upsert:
                        false
                }
            );


    if (
        result.error
    ) {

        throw result.error;

    }


    /* =====================================
       FRAMED
    ====================================== */

    result =
        await supabaseClient
            .storage
            .from(
                "party-photos"
            )
            .upload(
                framedPath,
                shot.framedBlob,
                {
                    contentType:
                        "image/jpeg",

                    cacheControl:
                        "3600",

                    upsert:
                        false
                }
            );


    if (
        result.error
    ) {

        throw result.error;

    }


    /* =====================================
       DATABASE
    ====================================== */

    result =
        await supabaseClient
            .from(
                "party_photos"
            )
            .insert(
                {
                    capture_id:
                        shot.id,

                    clean_path:
                        cleanPath,

                    framed_path:
                        framedPath,

                    photo_mode:
                        shot.mode,

                    status:
                        "pending"
                }
            );


    if (
        result.error
    ) {

        throw result.error;

    }
}


/* =========================================
   ADD SELECTED TO PARTY
========================================= */

async function addSelectedToParty() {

    if (
        uploadRunning
    ) {
        return;
    }


    const selectedShots =
        capturedShots.filter(
            function (shot) {

                return shot.selected;

            }
        );


    if (
        selectedShots.length ===
        0
    ) {
        return;
    }


    uploadRunning =
        true;


    reviewActions.classList.add(
        "hidden"
    );


    uploadError.classList.add(
        "hidden"
    );


    uploadStatus.classList.remove(
        "hidden"
    );


    try {

        for (
            let index = 0;

            index <
            selectedShots.length;

            index++
        ) {

            uploadStatusText.textContent =
                "Uploading photo " +
                (
                    index +
                    1
                ) +
                " of " +
                selectedShots.length +
                "...";


            await uploadShot(
                selectedShots[index]
            );

        }


        lastUploadedShots =
            selectedShots;


        uploadRunning =
            false;


        showSuccessScreen();


    } catch (error) {

        console.error(
            "Upload error:",
            error
        );


        uploadRunning =
            false;


        uploadStatus.classList.add(
            "hidden"
        );


        reviewActions.classList.remove(
            "hidden"
        );


        uploadError.classList.remove(
            "hidden"
        );


        uploadError.textContent =
            "Upload failed. " +
            error.message +
            " Please try again.";


        renderReview();

    }
}


/* =========================================
   AUTOMATIC CLEAN DOWNLOAD
========================================= */

function attemptCleanDownload(
    shot
) {

    try {

        downloadBlob(
            shot.cleanBlob,
            shot.id +
            "_clean.jpg"
        );


    } catch (error) {

        console.log(
            "Automatic clean download was blocked:",
            error
        );

    }
}


/* =========================================
   DOWNLOAD BLOB
========================================= */

function downloadBlob(
    blob,
    filename
) {

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
        1500
    );
}


/* =========================================
   SUCCESS SCREEN
========================================= */

function showSuccessScreen() {

    uploadStatus.classList.add(
        "hidden"
    );


    reviewScreen.classList.add(
        "hidden"
    );


    successScreen.classList.remove(
        "hidden"
    );


    const total =
        lastUploadedShots.length;


    successTitle.textContent =
        "🎄 " +
        total +
        (
            total === 1
                ? " photo joined the party!"
                : " photos joined the party!"
        );


    successMessage.textContent =
        "Clean photos were automatically offered for saving. Use the buttons below if your browser blocked any download.";


    successDownloads.innerHTML =
        "";


    lastUploadedShots.forEach(
        function (
            shot,
            index
        ) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "download-card";


            const image =
                document.createElement(
                    "img"
                );


            const imageUrl =
                URL.createObjectURL(
                    shot.framedBlob
                );


            image.src =
                imageUrl;


            image.onload =
                function () {

                    URL.revokeObjectURL(
                        imageUrl
                    );

                };


            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "download-info";


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                "Photo " +
                (
                    index +
                    1
                );


            const cleanButton =
                document.createElement(
                    "button"
                );


            cleanButton.type =
                "button";


            cleanButton.textContent =
                "🖼️ Save Clean";


            cleanButton.addEventListener(
                "click",
                function () {

                    downloadBlob(
                        shot.cleanBlob,
                        shot.id +
                        "_clean.jpg"
                    );

                }
            );


            const framedButton =
                document.createElement(
                    "button"
                );


            framedButton.type =
                "button";


            framedButton.textContent =
                "📸 Save Framed";


            framedButton.addEventListener(
                "click",
                function () {

                    downloadBlob(
                        shot.framedBlob,
                        shot.id +
                        "_framed.jpg"
                    );

                }
            );


            info.appendChild(
                title
            );


            info.appendChild(
                cleanButton
            );


            info.appendChild(
                document.createTextNode(
                    " "
                )
            );


            info.appendChild(
                framedButton
            );


            card.appendChild(
                image
            );


            card.appendChild(
                info
            );


            successDownloads.appendChild(
                card
            );

        }
    );
}


/* =========================================
   TAKE ANOTHER SET
========================================= */

async function takeAnotherSet() {

    successScreen.classList.add(
        "hidden"
    );


    capturedShots =
        [];


    lastUploadedShots =
        [];


    uploadRunning =
        false;


    syncPhotoModeWithDevice();


    cameraScreen.classList.remove(
        "hidden"
    );


    updateShotStatus();


    await startCamera();
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


flashButton.addEventListener(
    "click",
    toggleFlash
);


captureButton.addEventListener(
    "click",
    runCountdown
);


reviewButton.addEventListener(
    "click",
    openReview
);


takeMoreButton.addEventListener(
    "click",
    takeMorePhotos
);


addSelectedButton.addEventListener(
    "click",
    addSelectedToParty
);


takeAnotherButton.addEventListener(
    "click",
    takeAnotherSet
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
   DEVICE ROTATION
========================================= */

landscapeOrientation.addEventListener(
    "change",
    syncPhotoModeWithDevice
);


window.addEventListener(
    "resize",
    syncPhotoModeWithDevice
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

syncPhotoModeWithDevice();

updateModeButton();

setTimer(0);

updateShotStatus();

updateFlashButton();