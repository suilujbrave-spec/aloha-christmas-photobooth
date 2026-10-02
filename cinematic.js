/* =========================================
   ALOHA CHRISTMAS 2026
   CINEMATIC SDE
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
   SONG TIMELINE
========================================= */

const SONG_END = 228;

const FIRST_LYRIC = 16.73;

const PRECHORUS_1 = 44.84;

const CHORUS_1 = 52.03;

const VERSE_2 = 81.76;

const PRECHORUS_2 = 110.15;

const CHORUS_2 = 116.79;

const BRIDGE = 146.33;

const FINAL_CHORUS = 174.24;

const OUTRO = 204.75;

const FINAL_LYRIC = 211.90;


/* =========================================
   ELEMENTS
========================================= */

const loginScreen =
    document.getElementById("loginScreen");

const readyScreen =
    document.getElementById("readyScreen");

const cinematicScreen =
    document.getElementById("cinematicScreen");

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const loginError =
    document.getElementById("loginError");

const approvedCount =
    document.getElementById("approvedCount");

const readyMessage =
    document.getElementById("readyMessage");

const startShowButton =
    document.getElementById("startShowButton");

const fullscreenBeforeStartButton =
    document.getElementById(
        "fullscreenBeforeStartButton"
    );

const soundtrack =
    document.getElementById("soundtrack");

const cinematicBackground =
    document.getElementById(
        "cinematicBackground"
    );

const singleScene =
    document.getElementById("singleScene");

const singlePhoto =
    document.getElementById("singlePhoto");

const doubleScene =
    document.getElementById("doubleScene");

const doublePhoto1 =
    document.getElementById("doublePhoto1");

const doublePhoto2 =
    document.getElementById("doublePhoto2");

const tripleScene =
    document.getElementById("tripleScene");

const triplePhoto1 =
    document.getElementById("triplePhoto1");

const triplePhoto2 =
    document.getElementById("triplePhoto2");

const triplePhoto3 =
    document.getElementById("triplePhoto3");

const titleScene =
    document.getElementById("titleScene");

const titleMain =
    document.getElementById("titleMain");

const titleSecondary =
    document.getElementById("titleSecondary");

const titleSubtext =
    document.getElementById("titleSubtext");

const blackout =
    document.getElementById("blackout");

const restartButton =
    document.getElementById("restartButton");

const pauseButton =
    document.getElementById("pauseButton");

const fullscreenButton =
    document.getElementById("fullscreenButton");

const timeDisplay =
    document.getElementById("timeDisplay");


/* =========================================
   STATE
========================================= */

let showPhotos = [];

let photoCursor = 0;

let animationFrameId = null;

let currentSceneKey = "";

let showRunning = false;

let isPaused = false;


/* =========================================
   LOGIN
========================================= */

async function signIn(event) {

    event.preventDefault();

    loginError.classList.add("hidden");

    loginError.textContent = "";

    loginButton.disabled = true;

    loginButton.textContent =
        "Signing in...";


    try {

        const result =
            await supabaseClient.auth
                .signInWithPassword(
                    {
                        email:
                            emailInput.value.trim(),

                        password:
                            passwordInput.value
                    }
                );


        if (result.error) {
            throw result.error;
        }


        await prepareShow();


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        loginError.textContent =
            error.message;


        loginError.classList.remove(
            "hidden"
        );


    } finally {

        loginButton.disabled = false;

        loginButton.textContent =
            "Sign In";

    }
}


/* =========================================
   PREPARE SHOW
========================================= */

async function prepareShow() {

    loginScreen.classList.add(
        "hidden"
    );

    readyScreen.classList.remove(
        "hidden"
    );


    approvedCount.textContent =
        "0";

    readyMessage.textContent =
        "Loading approved photos...";

    startShowButton.disabled =
        true;


    try {

        const result =
            await supabaseClient
                .from("party_photos")
                .select(
                    "id, capture_id, clean_path, photo_mode, created_at"
                )
                .eq(
                    "status",
                    "approved"
                )
                .order(
                    "created_at",
                    {
                        ascending: true
                    }
                );


        if (result.error) {
            throw result.error;
        }


        const records =
            result.data || [];


        showPhotos =
            await createSignedPhotoUrls(
                records
            );


        approvedCount.textContent =
            showPhotos.length;


        if (
            showPhotos.length === 0
        ) {

            readyMessage.textContent =
                "Approve at least one photo before starting the SDE.";

            return;
        }


        readyMessage.textContent =
            "The photo set is ready. Start when everyone is watching!";


        startShowButton.disabled =
            false;


    } catch (error) {

        console.error(
            "Prepare show error:",
            error
        );


        readyMessage.textContent =
            "Could not prepare the show: " +
            error.message;

    }
}


/* =========================================
   SIGNED CLEAN PHOTO URLS
========================================= */

async function createSignedPhotoUrls(
    records
) {

    const jobs =
        records.map(
            async function (photo) {

                try {

                    const result =
                        await supabaseClient
                            .storage
                            .from(
                                "party-photos"
                            )
                            .createSignedUrl(
                                photo.clean_path,
                                21600
                            );


                    if (result.error) {
                        throw result.error;
                    }


                    return {

                        id:
                            photo.id,

                        captureId:
                            photo.capture_id,

                        photoMode:
                            photo.photo_mode,

                        url:
                            result.data.signedUrl

                    };


                } catch (error) {

                    console.error(
                        "Photo URL error:",
                        photo.capture_id,
                        error
                    );


                    return null;

                }

            }
        );


    const results =
        await Promise.all(
            jobs
        );


    return results.filter(
        function (photo) {

            return photo !== null;

        }
    );
}


/* =========================================
   START CINEMATIC SHOW
========================================= */
function shuffleArray(array) {

    const shuffled =
        [...array];

    for (
        let index =
            shuffled.length - 1;

        index > 0;

        index--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (index + 1)
            );

        const temp =
            shuffled[index];

        shuffled[index] =
            shuffled[randomIndex];

        shuffled[randomIndex] =
            temp;
    }

    return shuffled;
}


function buildSmartPhotoSequence() {

    const landscapePhotos =
        shuffleArray(
            showPhotos.filter(
                function (photo) {

                    return (
                        photo.photoMode ===
                        "landscape"
                    );

                }
            )
        );


    const portraitPhotos =
        shuffleArray(
            showPhotos.filter(
                function (photo) {

                    return (
                        photo.photoMode ===
                        "portrait"
                    );

                }
            )
        );


    const sequence = [];

    /*
        Mix portrait and landscape photos.

        Landscape gets slight priority because
        the SDE screen itself is 16:9.
    */

    while (
        landscapePhotos.length > 0 ||
        portraitPhotos.length > 0
    ) {

        if (
            landscapePhotos.length > 0
        ) {

            sequence.push(
                landscapePhotos.shift()
            );

        }


        if (
            portraitPhotos.length > 0
        ) {

            sequence.push(
                portraitPhotos.shift()
            );

        }


        if (
            landscapePhotos.length > 0
        ) {

            sequence.push(
                landscapePhotos.shift()
            );

        }

    }


    /*
        Give the final mixed sequence one
        additional shuffle while still
        preserving the randomized pool.
    */

    showPhotos =
        shuffleArray(
            sequence
        );
}


async function startShow() {

    if (
        showPhotos.length === 0
    ) {
        return;
    }


    /*
        Generate a brand-new randomized SDE
        sequence whenever Start Show is pressed.
    */
    buildSmartPhotoSequence();

    photoCursor = 0;
    
    currentSceneKey = "";

    showRunning = true;

    isPaused = false;


    readyScreen.classList.add(
        "hidden"
    );

    cinematicScreen.classList.remove(
        "hidden"
    );


    pauseButton.textContent =
        "❚❚";


    soundtrack.pause();

    soundtrack.currentTime = 0;


    showOpeningTitle();


    blackout.classList.remove(
        "clear"
    );


    setTimeout(
        function () {

            blackout.classList.add(
                "clear"
            );

        },
        300
    );


    try {

        await soundtrack.play();

    } catch (error) {

        console.error(
            "Audio play error:",
            error
        );

        return;
    }


    startMasterClock();
}


/* =========================================
   MASTER CLOCK
========================================= */

function startMasterClock() {

    stopMasterClock();


    function update() {

        if (!showRunning) {
            return;
        }


        const time =
            soundtrack.currentTime;


        updateTimeDisplay(
            time
        );


        updateTimeline(
            time
        );


        if (
            time >= SONG_END ||
            soundtrack.ended
        ) {

            finishShow();

            return;
        }


        animationFrameId =
            requestAnimationFrame(
                update
            );

    }


    animationFrameId =
        requestAnimationFrame(
            update
        );
}


/* =========================================
   STOP CLOCK
========================================= */

function stopMasterClock() {

    if (
        animationFrameId !== null
    ) {

        cancelAnimationFrame(
            animationFrameId
        );


        animationFrameId =
            null;
    }
}


/* =========================================
   TIMELINE
========================================= */

function updateTimeline(time) {

    /*
        OPENING
        00:00 - 00:16.73
    */

    if (time < 5) {

        activateScene(
            "opening-title",
            showOpeningTitle
        );

        return;
    }


    if (time < 11) {

        activateScene(
            "opening-photo-1",
            function () {

                showSinglePhoto(
                    nextPhoto()
                );

            }
        );

        return;
    }


    if (time < FIRST_LYRIC) {

        activateScene(
            "opening-photo-2",
            function () {

                showSinglePhoto(
                    nextPhoto()
                );

            }
        );

        return;
    }


    /*
        VERSE 1
    */

    if (time < PRECHORUS_1) {

        const slot =
            Math.floor(
                (
                    time -
                    FIRST_LYRIC
                ) / 7
            );


        activateScene(
            "verse1-" + slot,
            function () {

                showSinglePhoto(
                    nextPhoto()
                );

            }
        );

        return;
    }


    /*
        PRE-CHORUS 1
    */

    if (time < CHORUS_1) {

        activateScene(
            "prechorus1",
            function () {

                showDoublePhotos(
                    nextPhotos(2)
                );

            }
        );

        return;
    }


    /*
        CHORUS 1
    */

    if (time < VERSE_2) {

        const slot =
            Math.floor(
                (
                    time -
                    CHORUS_1
                ) / 5
            );


        activateScene(
            "chorus1-" + slot,
            function () {

                if (
                    slot % 2 === 0
                ) {

                    showTriplePhotos(
                        nextPhotos(3)
                    );

                } else {

                    showSinglePhoto(
                        nextPhoto()
                    );

                }

            }
        );

        return;
    }


    /*
        VERSE 2
    */

    if (time < PRECHORUS_2) {

        const slot =
            Math.floor(
                (
                    time -
                    VERSE_2
                ) / 6.8
            );


        activateScene(
            "verse2-" + slot,
            function () {

                showSinglePhoto(
                    nextPhoto()
                );

            }
        );

        return;
    }


    /*
        PRE-CHORUS 2
    */

    if (time < CHORUS_2) {

        activateScene(
            "prechorus2",
            function () {

                showDoublePhotos(
                    nextPhotos(2)
                );

            }
        );

        return;
    }


    /*
        CHORUS 2
    */

    if (time < BRIDGE) {

        const slot =
            Math.floor(
                (
                    time -
                    CHORUS_2
                ) / 5
            );


        activateScene(
            "chorus2-" + slot,
            function () {

                if (
                    slot % 2 === 0
                ) {

                    showTriplePhotos(
                        nextPhotos(3)
                    );

                } else {

                    showDoublePhotos(
                        nextPhotos(2)
                    );

                }

            }
        );

        return;
    }


    /*
        BRIDGE
    */

    if (time < FINAL_CHORUS) {

        const slot =
            Math.floor(
                (
                    time -
                    BRIDGE
                ) / 7
            );


        activateScene(
            "bridge-" + slot,
            function () {

                showSinglePhoto(
                    nextPhoto()
                );

            }
        );

        return;
    }


    /*
        FINAL CHORUS
    */

    if (time < OUTRO) {

        const slot =
            Math.floor(
                (
                    time -
                    FINAL_CHORUS
                ) / 4.4
            );


        activateScene(
            "finalchorus-" + slot,
            function () {

                if (
                    slot % 3 === 0
                ) {

                    showTriplePhotos(
                        nextPhotos(3)
                    );

                } else if (
                    slot % 3 === 1
                ) {

                    showDoublePhotos(
                        nextPhotos(2)
                    );

                } else {

                    showSinglePhoto(
                        nextPhoto()
                    );

                }

            }
        );

        return;
    }


    /*
        OUTRO LYRICS
        03:24.75 - 03:31.90
    */

    if (time < FINAL_LYRIC) {

        activateScene(
            "outro-photo",
            function () {

                showSinglePhoto(
                    nextPhoto()
                );

            }
        );

        return;
    }


    /*
        INSTRUMENTAL FINALE
        03:31.90 - 03:48
    */

    if (time < 215) {

        activateScene(
            "finale-photo",
            function () {

                showSinglePhoto(
                    nextPhoto()
                );

            }
        );

        return;
    }


    if (time < 219) {

        activateScene(
            "finale-collage",
            function () {

                showTriplePhotos(
                    nextPhotos(3)
                );

            }
        );

        return;
    }


    if (time < 223) {

        activateScene(
            "finale-title",
            function () {

                showTitle(
                    "Aloha Christmas",
                    "2026",
                    "Memories Made Together"
                );

            }
        );

        return;
    }


    activateScene(
        "finale-mahalo",
        function () {

            showTitle(
                "Mele Kalikimaka!",
                "🌺 🎄 🌴",
                "Merry Christmas, everyone!"
            );

        }
    );
}


/* =========================================
   ACTIVATE SCENE ONCE
========================================= */

function activateScene(
    sceneKey,
    sceneFunction
) {

    if (
        currentSceneKey ===
        sceneKey
    ) {
        return;
    }


    currentSceneKey =
        sceneKey;


    sceneFunction();
}


/* =========================================
   PHOTO SELECTION
========================================= */

function nextPhoto() {

    if (
        showPhotos.length === 0
    ) {
        return null;
    }


    const photo =
        showPhotos[
            photoCursor %
            showPhotos.length
        ];


    photoCursor++;


    return photo;
}


function nextPhotos(count) {

    const photos = [];


    for (
        let index = 0;
        index < count;
        index++
    ) {

        const photo =
            nextPhoto();


        if (photo) {

            photos.push(
                photo
            );

        }
    }


    return photos;
}


/* =========================================
   HIDE ALL SCENES
========================================= */

function hideScenes() {

    singleScene.classList.add(
        "hidden"
    );

    doubleScene.classList.add(
        "hidden"
    );

    tripleScene.classList.add(
        "hidden"
    );

    titleScene.classList.add(
        "hidden"
    );
}


/* =========================================
   SET BACKGROUND
========================================= */

function setBackground(photo) {

    if (!photo) {
        return;
    }


    cinematicBackground
        .style
        .backgroundImage =
        "url('" +
        photo.url +
        "')";


    cinematicBackground
        .classList
        .add(
            "visible"
        );
}


/* =========================================
   SHOW SINGLE PHOTO
========================================= */

function showSinglePhoto(photo) {

    if (!photo) {
        return;
    }


    hideScenes();


    setBackground(photo);


    singlePhoto.src =
        photo.url;


    singlePhoto.style.animation =
        "none";


    void singlePhoto.offsetWidth;


    singlePhoto.style.animation =
        "";


    singleScene.classList.remove(
        "hidden"
    );
}


/* =========================================
   SHOW TWO PHOTOS
========================================= */

function showDoublePhotos(photos) {

    if (
        photos.length === 0
    ) {
        return;
    }


    hideScenes();


    setBackground(
        photos[0]
    );


    doublePhoto1.src =
        photos[0].url;


    doublePhoto2.src =
        photos[
            1 % photos.length
        ].url;


    doubleScene.classList.remove(
        "hidden"
    );
}


/* =========================================
   SHOW THREE PHOTOS
========================================= */

function showTriplePhotos(photos) {

    if (
        photos.length === 0
    ) {
        return;
    }


    hideScenes();


    setBackground(
        photos[0]
    );


    triplePhoto1.src =
        photos[0].url;


    triplePhoto2.src =
        photos[
            1 % photos.length
        ].url;


    triplePhoto3.src =
        photos[
            2 % photos.length
        ].url;


    tripleScene.classList.remove(
        "hidden"
    );
}


/* =========================================
   TITLE
========================================= */

function showTitle(
    main,
    secondary,
    subtext
) {

    hideScenes();


    cinematicBackground
        .classList
        .remove(
            "visible"
        );


    titleMain.textContent =
        main;


    titleSecondary.textContent =
        secondary;


    titleSubtext.textContent =
        subtext;


    titleScene.classList.remove(
        "hidden"
    );
}


/* =========================================
   OPENING TITLE
========================================= */

function showOpeningTitle() {

    showTitle(
        "Aloha Christmas",
        "2026",
        "Memories Made Together"
    );
}


/* =========================================
   PAUSE / RESUME
========================================= */

function togglePause() {

    if (!showRunning) {
        return;
    }


    isPaused =
        !isPaused;


    if (isPaused) {

        soundtrack.pause();


        pauseButton.textContent =
            "▶";


    } else {

        soundtrack.play();


        pauseButton.textContent =
            "❚❚";

    }
}


/* =========================================
   RESTART SHOW
========================================= */

async function restartShow() {

    soundtrack.pause();


    stopMasterClock();


    currentSceneKey = "";

    photoCursor = 0;


    soundtrack.currentTime = 0;


    showOpeningTitle();


    blackout.classList.remove(
        "clear"
    );


    setTimeout(
        function () {

            blackout.classList.add(
                "clear"
            );

        },
        300
    );


    try {

        await soundtrack.play();

        showRunning = true;

        isPaused = false;

        pauseButton.textContent =
            "❚❚";


        startMasterClock();


    } catch (error) {

        console.error(
            "Restart error:",
            error
        );

    }
}


/* =========================================
   FINISH SHOW
========================================= */

function finishShow() {

    showRunning = false;


    stopMasterClock();


    blackout.classList.remove(
        "clear"
    );


    setTimeout(
        function () {

            soundtrack.pause();

        },
        1500
    );
}


/* =========================================
   TIME DISPLAY
========================================= */

function updateTimeDisplay(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        Math.floor(
            seconds % 60
        );


    timeDisplay.textContent =
        String(minutes)
            .padStart(
                2,
                "0"
            ) +
        ":" +
        String(
            remainingSeconds
        )
            .padStart(
                2,
                "0"
            );
}


/* =========================================
   FULLSCREEN
========================================= */

async function toggleFullscreen() {

    try {

        if (
            !document.fullscreenElement
        ) {

            await document
                .documentElement
                .requestFullscreen();

        } else {

            await document
                .exitFullscreen();

        }


    } catch (error) {

        console.error(
            "Fullscreen error:",
            error
        );

    }
}


/* =========================================
   EXISTING SESSION
========================================= */

async function checkExistingSession() {

    try {

        const result =
            await supabaseClient.auth
                .getSession();


        if (
            result.data &&
            result.data.session
        ) {

            await prepareShow();

        }


    } catch (error) {

        console.error(
            "Session error:",
            error
        );

    }
}


/* =========================================
   EVENTS
========================================= */

loginForm.addEventListener(
    "submit",
    signIn
);


startShowButton.addEventListener(
    "click",
    startShow
);


fullscreenBeforeStartButton.addEventListener(
    "click",
    toggleFullscreen
);


fullscreenButton.addEventListener(
    "click",
    toggleFullscreen
);


pauseButton.addEventListener(
    "click",
    togglePause
);


restartButton.addEventListener(
    "click",
    restartShow
);


soundtrack.addEventListener(
    "ended",
    finishShow
);


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key.toLowerCase() ===
            "f"
        ) {

            toggleFullscreen();

        }


        if (
            event.key === " " &&
            showRunning
        ) {

            event.preventDefault();

            togglePause();

        }


        if (
            event.key.toLowerCase() ===
            "r" &&
            showRunning
        ) {

            restartShow();

        }

    }
);


/* =========================================
   CLEANUP
========================================= */

window.addEventListener(
    "pagehide",
    function () {

        soundtrack.pause();

        stopMasterClock();

    }
);


/* =========================================
   START
========================================= */

checkExistingSession();