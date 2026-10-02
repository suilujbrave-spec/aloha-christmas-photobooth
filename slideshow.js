/* =========================================
   ALOHA CHRISTMAS LIVE SLIDESHOW
========================================= */


/* =========================================
   SUPABASE CONFIGURATION
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
   SLIDESHOW SETTINGS
========================================= */

const PHOTO_DURATION = 6000;

const TITLE_DURATION = 5000;

const SIGNED_URL_SECONDS = 21600;

const TITLE_EVERY = 6;


/* =========================================
   ELEMENTS
========================================= */

const loginScreen =
    document.getElementById("loginScreen");

const slideshowScreen =
    document.getElementById("slideshowScreen");

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

const photoBackground =
    document.getElementById("photoBackground");

const photoStage =
    document.getElementById("photoStage");

const mainPhoto =
    document.getElementById("mainPhoto");

const titleCard =
    document.getElementById("titleCard");

const waitingScreen =
    document.getElementById("waitingScreen");

const photoCount =
    document.getElementById("photoCount");

const previousButton =
    document.getElementById("previousButton");

const pauseButton =
    document.getElementById("pauseButton");

const nextButton =
    document.getElementById("nextButton");

const fullscreenButton =
    document.getElementById("fullscreenButton");


/* =========================================
   STATE
========================================= */

let approvedPhotos = [];

let currentIndex = -1;

let slideshowTimer = null;

let isPaused = false;

let slidesSinceTitle = 0;

let realtimeChannel = null;

let loadingPhotos = false;


/* =========================================
   SIGN IN
========================================= */

async function signIn(event) {

    event.preventDefault();

    loginError.classList.add("hidden");

    loginError.textContent = "";

    loginButton.disabled = true;

    loginButton.textContent =
        "Starting...";


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


        await startSlideshow();


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
            "Start Slideshow";

    }
}


/* =========================================
   START SLIDESHOW
========================================= */

async function startSlideshow() {

    loginScreen.classList.add(
        "hidden"
    );

    slideshowScreen.classList.remove(
        "hidden"
    );


    await loadApprovedPhotos();

    subscribeToChanges();
}


/* =========================================
   LOAD APPROVED PHOTOS
========================================= */

async function loadApprovedPhotos() {

    if (loadingPhotos) {
        return;
    }


    loadingPhotos = true;


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


        const preparedPhotos =
            await prepareCleanPhotoUrls(
                records
            );


        approvedPhotos =
            preparedPhotos;


        updatePhotoCount();


        /*
            No approved photos yet.
        */

        if (
            approvedPhotos.length === 0
        ) {

            currentIndex = -1;

            stopTimer();

            showWaitingScreen(
                "Waiting for approved party photos..."
            );

            return;
        }


        waitingScreen.classList.add(
            "hidden"
        );


        /*
            If slideshow has not started yet,
            begin with the first approved photo.
        */

        if (currentIndex < 0) {

            currentIndex = 0;

            showPhoto(
                approvedPhotos[
                    currentIndex
                ]
            );

            slidesSinceTitle = 1;

            scheduleNext();

            return;
        }


        /*
            Keep current index valid if a
            photo was removed from Approved.
        */

        if (
            currentIndex >=
            approvedPhotos.length
        ) {

            currentIndex =
                approvedPhotos.length - 1;

        }


    } catch (error) {

        console.error(
            "Load photos error:",
            error
        );


        stopTimer();


        showWaitingScreen(
            "Could not load approved photos."
        );


    } finally {

        loadingPhotos = false;

    }
}


/* =========================================
   CREATE SIGNED CLEAN PHOTO URLS
========================================= */

async function prepareCleanPhotoUrls(
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
                                SIGNED_URL_SECONDS
                            );


                    if (result.error) {
                        throw result.error;
                    }


                    if (
                        !result.data ||
                        !result.data.signedUrl
                    ) {

                        throw new Error(
                            "No signed URL was returned."
                        );

                    }


                    return {

                        id:
                            photo.id,

                        captureId:
                            photo.capture_id,

                        photoMode:
                            photo.photo_mode,

                        createdAt:
                            photo.created_at,

                        url:
                            result.data.signedUrl

                    };


                } catch (error) {

                    console.error(
                        "Clean photo URL error:",
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

            return (
                photo !== null
            );

        }
    );
}


/* =========================================
   UPDATE PHOTO COUNT
========================================= */

function updatePhotoCount() {

    const total =
        approvedPhotos.length;


    photoCount.textContent =
        total +
        " approved photo" +
        (
            total === 1
                ? ""
                : "s"
        );
}


/* =========================================
   WAITING SCREEN
========================================= */

function showWaitingScreen(message) {

    waitingScreen.classList.remove(
        "hidden"
    );


    titleCard.classList.add(
        "hidden"
    );


    photoStage.classList.add(
        "hidden"
    );


    photoBackground.classList.remove(
        "visible"
    );


    const paragraph =
        waitingScreen.querySelector(
            "p"
        );


    if (
        paragraph &&
        message
    ) {

        paragraph.textContent =
            message;

    }
}


/* =========================================
   SHOW PHOTO
========================================= */

function showPhoto(photo) {

    if (!photo) {
        return;
    }


    waitingScreen.classList.add(
        "hidden"
    );


    titleCard.classList.add(
        "hidden"
    );


    photoStage.classList.remove(
        "hidden"
    );


    photoStage.classList.add(
        "fade-out"
    );


    /*
        Preload image before fading it in.
    */

    const preloadImage =
        new Image();


    preloadImage.onload =
        function () {

            setTimeout(
                function () {

                    mainPhoto.src =
                        photo.url;


                    photoBackground
                        .style
                        .backgroundImage =
                        "url('" +
                        photo.url +
                        "')";


                    /*
                        Restart gentle zoom.
                    */

                    mainPhoto.style.animation =
                        "none";


                    void mainPhoto.offsetWidth;


                    mainPhoto.style.animation =
                        "";


                    photoStage.classList.remove(
                        "fade-out"
                    );


                    photoBackground.classList.add(
                        "visible"
                    );

                },
                250
            );

        };


    preloadImage.onerror =
        function () {

            console.error(
                "Could not load slideshow image:",
                photo.captureId
            );


            photoStage.classList.remove(
                "fade-out"
            );

        };


    preloadImage.src =
        photo.url;
}


/* =========================================
   SHOW TITLE CARD
========================================= */

function showTitleCard() {

    stopTimer();


    photoStage.classList.add(
        "fade-out"
    );


    photoBackground.classList.remove(
        "visible"
    );


    setTimeout(
        function () {

            photoStage.classList.add(
                "hidden"
            );


            titleCard.classList.remove(
                "hidden"
            );

        },
        500
    );


    slidesSinceTitle = 0;


    if (!isPaused) {

        slideshowTimer =
            setTimeout(
                function () {

                    titleCard.classList.add(
                        "hidden"
                    );


                    nextPhoto(
                        true
                    );

                },
                TITLE_DURATION
            );

    }
}


/* =========================================
   NEXT PHOTO
========================================= */

function nextPhoto(
    skipTitleCheck
) {

    stopTimer();


    if (
        approvedPhotos.length === 0
    ) {

        showWaitingScreen(
            "Waiting for approved party photos..."
        );

        return;
    }


    /*
        Insert title card every few photos.
    */

    if (
        !skipTitleCheck &&
        slidesSinceTitle >=
            TITLE_EVERY
    ) {

        showTitleCard();

        return;
    }


    currentIndex =
        (
            currentIndex + 1
        ) %
        approvedPhotos.length;


    showPhoto(
        approvedPhotos[
            currentIndex
        ]
    );


    slidesSinceTitle++;


    scheduleNext();
}


/* =========================================
   PREVIOUS PHOTO
========================================= */

function previousPhoto() {

    stopTimer();


    if (
        approvedPhotos.length === 0
    ) {
        return;
    }


    titleCard.classList.add(
        "hidden"
    );


    currentIndex--;


    if (currentIndex < 0) {

        currentIndex =
            approvedPhotos.length - 1;

    }


    showPhoto(
        approvedPhotos[
            currentIndex
        ]
    );


    scheduleNext();
}


/* =========================================
   SCHEDULE NEXT SLIDE
========================================= */

function scheduleNext() {

    stopTimer();


    if (
        isPaused ||
        approvedPhotos.length === 0
    ) {
        return;
    }


    slideshowTimer =
        setTimeout(
            function () {

                nextPhoto(
                    false
                );

            },
            PHOTO_DURATION
        );
}


/* =========================================
   STOP SLIDESHOW TIMER
========================================= */

function stopTimer() {

    if (!slideshowTimer) {
        return;
    }


    clearTimeout(
        slideshowTimer
    );


    slideshowTimer = null;
}


/* =========================================
   PAUSE / PLAY
========================================= */

function togglePause() {

    isPaused =
        !isPaused;


    if (isPaused) {

        stopTimer();


        pauseButton.textContent =
            "▶";


        pauseButton.title =
            "Resume slideshow";


    } else {

        pauseButton.textContent =
            "❚❚";


        pauseButton.title =
            "Pause slideshow";


        scheduleNext();

    }
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
   REALTIME DATABASE CHANGES
========================================= */

function subscribeToChanges() {

    /*
        Remove old subscription first.
    */

    if (realtimeChannel) {

        supabaseClient.removeChannel(
            realtimeChannel
        );

        realtimeChannel = null;

    }


    realtimeChannel =
        supabaseClient
            .channel(
                "aloha-slideshow-changes"
            )
            .on(
                "postgres_changes",
                {
                    event:
                        "*",

                    schema:
                        "public",

                    table:
                        "party_photos"
                },
                async function () {

                    /*
                        Reload when:
                        - new photo is uploaded
                        - photo becomes approved
                        - approved photo is hidden
                        - photo returns to pending
                    */

                    await loadApprovedPhotos();

                }
            )
            .subscribe(
                function (status) {

                    console.log(
                        "Realtime status:",
                        status
                    );

                }
            );
}


/* =========================================
   BUTTON EVENTS
========================================= */

loginForm.addEventListener(
    "submit",
    signIn
);


previousButton.addEventListener(
    "click",
    previousPhoto
);


pauseButton.addEventListener(
    "click",
    togglePause
);


nextButton.addEventListener(
    "click",
    function () {

        nextPhoto(
            true
        );

    }
);


fullscreenButton.addEventListener(
    "click",
    toggleFullscreen
);


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            slideshowScreen
                .classList
                .contains(
                    "hidden"
                )
        ) {
            return;
        }


        /*
            Right arrow:
            Next photo
        */

        if (
            event.key ===
            "ArrowRight"
        ) {

            nextPhoto(
                true
            );

        }


        /*
            Left arrow:
            Previous photo
        */

        if (
            event.key ===
            "ArrowLeft"
        ) {

            previousPhoto();

        }


        /*
            Space:
            Pause / Resume
        */

        if (
            event.key ===
            " "
        ) {

            event.preventDefault();

            togglePause();

        }


        /*
            F:
            Fullscreen
        */

        if (
            event.key.toLowerCase() ===
            "f"
        ) {

            toggleFullscreen();

        }

    }
);


/* =========================================
   CHECK EXISTING LOGIN SESSION
========================================= */

async function checkExistingSession() {

    try {

        const result =
            await supabaseClient.auth
                .getSession();


        if (result.error) {
            throw result.error;
        }


        if (
            result.data &&
            result.data.session
        ) {

            await startSlideshow();

        }


    } catch (error) {

        console.error(
            "Session check error:",
            error
        );

    }
}


/* =========================================
   CLEANUP
========================================= */

window.addEventListener(
    "pagehide",
    function () {

        stopTimer();


        if (realtimeChannel) {

            supabaseClient.removeChannel(
                realtimeChannel
            );


            realtimeChannel = null;

        }

    }
);


/* =========================================
   START APPLICATION
========================================= */

checkExistingSession();