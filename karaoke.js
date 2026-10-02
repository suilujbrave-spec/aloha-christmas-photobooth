/* =========================================
   ALOHA CHRISTMAS KARAOKE
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
   SONG SETTINGS
========================================= */

const SONG_END = 228;

const FINAL_LYRIC_TIME = 211.90;

const FINALE_TIME = 222;

const PHOTO_CHANGE_SECONDS = 7;


/* =========================================
   TIMED LYRICS
========================================= */

const lyrics = [

    {
        time: 16.73,
        section: "VERSE 1",
        text: "Another year, another ride"
    },

    {
        time: 19.64,
        section: "VERSE 1",
        text: "From distant shores to the ocean wide"
    },

    {
        time: 23.98,
        section: "VERSE 1",
        text: "Ships are sailing, plans are made"
    },

    {
        time: 27.03,
        section: "VERSE 1",
        text: "Now it's time to let the workday fade"
    },

    {
        time: 30.60,
        section: "VERSE 1",
        text: "From Manila lights to Holland skies"
    },

    {
        time: 34.20,
        section: "VERSE 1",
        text: "We raise our glasses, no more deadlines"
    },

    {
        time: 38.46,
        section: "VERSE 1",
        text: "Different places, one big crew"
    },

    {
        time: 41.67,
        section: "VERSE 1",
        text: "Tonight we're celebrating you"
    },

    {
        time: 44.84,
        section: "PRE-CHORUS",
        text: "Leave the charts and schedules behind"
    },

    {
        time: 48.46,
        section: "PRE-CHORUS",
        text: "Tonight we're all on island time"
    },

    {
        time: 52.03,
        section: "CHORUS",
        text: "Aloha Christmas, everybody come along"
    },

    {
        time: 55.52,
        section: "CHORUS",
        text: "Jumbo family, singing our song"
    },

    {
        time: 59.03,
        section: "CHORUS",
        text: "Under the lights, with the whole crew tonight"
    },

    {
        time: 62.77,
        section: "CHORUS",
        text: "Aloha Christmas, everything feels right"
    },

    {
        time: 66.20,
        section: "CHORUS",
        text: "From ship to shore, wherever we may be"
    },

    {
        time: 69.43,
        section: "CHORUS",
        text: "One Jumbo family, one big company"
    },

    {
        time: 73.40,
        section: "CHORUS",
        text: "So raise your glass and let the good times flow"
    },

    {
        time: 77.20,
        section: "CHORUS",
        text: "Aloha Christmas, let's go, let's go!"
    },

    {
        time: 81.76,
        section: "VERSE 2",
        text: "Crewing keeps our people moving"
    },

    {
        time: 85.04,
        section: "VERSE 2",
        text: "Operations keeps the whole thing cruising"
    },

    {
        time: 88.70,
        section: "VERSE 2",
        text: "Commercial makes the deals come through"
    },

    {
        time: 92.18,
        section: "VERSE 2",
        text: "QHSE keeps us safe in all we do"
    },

    {
        time: 95.87,
        section: "VERSE 2",
        text: "Engineering makes the plans come true"
    },

    {
        time: 99.54,
        section: "VERSE 2",
        text: "Fleet keeps sailing, Purchasing too"
    },

    {
        time: 103.26,
        section: "VERSE 2",
        text: "Finance counts it, HR keeps us strong"
    },

    {
        time: 106.59,
        section: "VERSE 2",
        text: "Tonight we leave the spreadsheets all alone"
    },

    {
        time: 110.15,
        section: "PRE-CHORUS",
        text: "No more meetings, no more calls"
    },

    {
        time: 113.15,
        section: "PRE-CHORUS",
        text: "Tonight we're dancing through it all"
    },

    {
        time: 116.79,
        section: "CHORUS",
        text: "Aloha Christmas, everybody come along"
    },

    {
        time: 120.25,
        section: "CHORUS",
        text: "Jumbo family, singing our song"
    },

    {
        time: 123.90,
        section: "CHORUS",
        text: "Under the lights, with the whole crew tonight"
    },

    {
        time: 127.43,
        section: "CHORUS",
        text: "Aloha Christmas, everything feels right"
    },

    {
        time: 130.80,
        section: "CHORUS",
        text: "From ship to shore, wherever we may be"
    },

    {
        time: 134.31,
        section: "CHORUS",
        text: "One Jumbo family, one big company"
    },

    {
        time: 137.93,
        section: "CHORUS",
        text: "So raise your glass and let the good times flow"
    },

    {
        time: 141.80,
        section: "CHORUS",
        text: "Aloha Christmas, let's go, let's go!"
    },

    {
        time: 146.33,
        section: "BRIDGE",
        text: "Manila to the Netherlands"
    },

    {
        time: 149.81,
        section: "BRIDGE",
        text: "Across the sea, across the land"
    },

    {
        time: 153.28,
        section: "BRIDGE",
        text: "On every vessel, every crew"
    },

    {
        time: 156.36,
        section: "BRIDGE",
        text: "Tonight we're here because of you"
    },

    {
        time: 159.87,
        section: "BRIDGE",
        text: "So leave your worries by the door"
    },

    {
        time: 163.36,
        section: "BRIDGE",
        text: "We've worked hard, now let's have more"
    },

    {
        time: 167.24,
        section: "BRIDGE",
        text: "Good friends, good times, all around"
    },

    {
        time: 171.21,
        section: "BRIDGE",
        text: "Tonight the Jumbo beat is our sound"
    },

    {
        time: 174.24,
        section: "FINAL CHORUS",
        text: "Aloha Christmas, everybody come along"
    },

    {
        time: 177.71,
        section: "FINAL CHORUS",
        text: "Jumbo family, singing our song"
    },

    {
        time: 181.28,
        section: "FINAL CHORUS",
        text: "Under the lights, with the whole crew tonight"
    },

    {
        time: 184.87,
        section: "FINAL CHORUS",
        text: "Aloha Christmas, everything feels right"
    },

    {
        time: 188.43,
        section: "FINAL CHORUS",
        text: "From ship to shore, wherever we may be"
    },

    {
        time: 191.74,
        section: "FINAL CHORUS",
        text: "One Jumbo family, one big company"
    },

    {
        time: 195.68,
        section: "FINAL CHORUS",
        text: "Hands in the air, let the celebration flow"
    },

    {
        time: 199.40,
        section: "FINAL CHORUS",
        text: "Aloha Christmas, let's go, let's go!"
    },

    {
        time: 204.75,
        section: "OUTRO",
        text: "Aloha... Aloha..."
    },

    {
        time: 206.50,
        section: "OUTRO",
        text: "Aloha Christmas..."
    },

    {
        time: 209.30,
        section: "OUTRO",
        text: "Jumbo family..."
    },

    {
        time: 211.90,
        section: "OUTRO",
        text: "Merry Christmas, everyone!"
    }

];


/* =========================================
   ELEMENTS
========================================= */

const loginScreen =
    document.getElementById("loginScreen");

const readyScreen =
    document.getElementById("readyScreen");

const karaokeScreen =
    document.getElementById("karaokeScreen");

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

const startButton =
    document.getElementById("startButton");

const fullscreenBeforeStartButton =
    document.getElementById(
        "fullscreenBeforeStartButton"
    );

const soundtrack =
    document.getElementById("soundtrack");

const photoBackground =
    document.getElementById("photoBackground");

const partyPhoto =
    document.getElementById("partyPhoto");

const introTitle =
    document.getElementById("introTitle");

const lyricsPanel =
    document.getElementById("lyricsPanel");

const sectionLabel =
    document.getElementById("sectionLabel");

const previousLyric =
    document.getElementById("previousLyric");

const currentLyric =
    document.getElementById("currentLyric");

const nextLyric =
    document.getElementById("nextLyric");

const finaleScreen =
    document.getElementById("finaleScreen");

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

let photos = [];

let photoIndex = 0;

let currentLyricIndex = -1;

let currentPhotoSlot = -1;

let animationFrameId = null;

let running = false;

let paused = false;


/* =========================================
   SIGN IN
========================================= */

async function signIn(event) {

    event.preventDefault();

    loginError.classList.add(
        "hidden"
    );

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


        await prepareKaraoke();


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
   PREPARE KARAOKE
========================================= */

async function prepareKaraoke() {

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


    startButton.disabled =
        true;


    try {

        const result =
            await supabaseClient
                .from(
                    "party_photos"
                )
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


        photos =
            await createSignedUrls(
                result.data || []
            );


        approvedCount.textContent =
            photos.length;


        if (
            photos.length === 0
        ) {

            readyMessage.textContent =
                "Approve at least one photo before starting karaoke.";

            return;
        }


        readyMessage.textContent =
            "Karaoke is ready!";


        startButton.disabled =
            false;


    } catch (error) {

        console.error(
            "Prepare karaoke error:",
            error
        );


        readyMessage.textContent =
            "Could not prepare karaoke: " +
            error.message;

    }
}


/* =========================================
   CREATE SIGNED CLEAN PHOTO URLS
========================================= */

async function createSignedUrls(records) {

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


                    if (
                        !result.data ||
                        !result.data.signedUrl
                    ) {

                        throw new Error(
                            "No signed photo URL returned."
                        );

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

            return (
                photo !== null
            );

        }
    );
}


/* =========================================
   START KARAOKE
========================================= */
function shufflePhotos() {

    for (
        let index =
            photos.length - 1;

        index > 0;

        index--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (index + 1)
            );


        const temp =
            photos[index];

        photos[index] =
            photos[randomIndex];

        photos[randomIndex] =
            temp;
    }

}

async function startKaraoke() {

    if (
        photos.length === 0
    ) {
        return;
    }


    readyScreen.classList.add(
        "hidden"
    );


    karaokeScreen.classList.remove(
        "hidden"
    );


    soundtrack.pause();

    soundtrack.currentTime =
        0;


    /*
    Fresh randomized photo order every
    time Karaoke starts.
    */

    shufflePhotos();

    photoIndex = 0;

    currentPhotoSlot =
        -1;


    currentLyricIndex =
        -1;


    running =
        true;


    paused =
        false;


    pauseButton.textContent =
        "❚❚";


    finaleScreen.classList.add(
        "hidden"
    );


    lyricsPanel.classList.add(
        "hidden"
    );


    introTitle.classList.remove(
        "hidden"
    );


    changePhoto();


    try {

        await soundtrack.play();

    } catch (error) {

        console.error(
            "Audio error:",
            error
        );


        running =
            false;


        return;
    }


    startClock();
}


/* =========================================
   MASTER CLOCK
========================================= */

function startClock() {

    stopClock();


    function update() {

        if (!running) {
            return;
        }


        const time =
            soundtrack.currentTime;


        updateTimeDisplay(
            time
        );


        updatePhoto(
            time
        );


        updateLyrics(
            time
        );


        updateFinale(
            time
        );


        if (
            time >= SONG_END ||
            soundtrack.ended
        ) {

            finishKaraoke();

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
   STOP MASTER CLOCK
========================================= */

function stopClock() {

    if (
        animationFrameId === null
    ) {
        return;
    }


    cancelAnimationFrame(
        animationFrameId
    );


    animationFrameId =
        null;
}


/* =========================================
   PHOTO ROTATION
========================================= */

function updatePhoto(time) {

    const slot =
        Math.floor(
            time /
            PHOTO_CHANGE_SECONDS
        );


    if (
        slot ===
        currentPhotoSlot
    ) {
        return;
    }


    currentPhotoSlot =
        slot;


    changePhoto();
}


function changePhoto() {

    if (
        photos.length === 0
    ) {
        return;
    }


    const photo =
        photos[
            photoIndex %
            photos.length
        ];


    photoIndex++;


    const preloadImage =
        new Image();


    preloadImage.onload =
        function () {

            partyPhoto.style.opacity =
                "0";


            setTimeout(
                function () {

                    partyPhoto.src =
                        photo.url;


                    photoBackground
                        .style
                        .backgroundImage =
                        "url('" +
                        photo.url +
                        "')";


                    photoBackground
                        .classList
                        .add(
                            "visible"
                        );


                    partyPhoto.style.animation =
                        "none";


                    void partyPhoto.offsetWidth;


                    partyPhoto.style.animation =
                        "";


                    partyPhoto.style.opacity =
                        "1";

                },
                300
            );

        };


    preloadImage.onerror =
        function () {

            console.error(
                "Could not load party photo:",
                photo.captureId
            );

        };


    preloadImage.src =
        photo.url;
}


/* =========================================
   UPDATE LYRICS
========================================= */

function updateLyrics(time) {

    /*
        INTRO

        Keep title visible until the first
        lyric begins at 00:16.73.
    */

    if (
        time <
        lyrics[0].time
    ) {

        introTitle.classList.remove(
            "hidden"
        );


        lyricsPanel.classList.add(
            "hidden"
        );


        currentLyricIndex =
            -1;


        return;
    }


    /*
        POST-LYRIC INSTRUMENTAL

        Keep the final lyric on screen for
        approximately 3.5 seconds, then
        remove the lyrics while music
        continues.
    */

    if (
        time >=
        FINAL_LYRIC_TIME + 3.5
    ) {

        introTitle.classList.add(
            "hidden"
        );


        lyricsPanel.classList.add(
            "hidden"
        );


        return;
    }


    introTitle.classList.add(
        "hidden"
    );


    lyricsPanel.classList.remove(
        "hidden"
    );


    let lyricIndex =
        0;


    for (
        let index = 0;
        index < lyrics.length;
        index++
    ) {

        if (
            lyrics[index].time <=
            time
        ) {

            lyricIndex =
                index;

        } else {

            break;

        }

    }


    if (
        lyricIndex ===
        currentLyricIndex
    ) {
        return;
    }


    currentLyricIndex =
        lyricIndex;


    const current =
        lyrics[
            lyricIndex
        ];


    const previous =
        lyricIndex > 0
            ? lyrics[
                lyricIndex - 1
            ]
            : null;


    const next =
        lyricIndex <
        lyrics.length - 1
            ? lyrics[
                lyricIndex + 1
            ]
            : null;


    sectionLabel.textContent =
        current.section;


    previousLyric.textContent =
        previous
            ? previous.text
            : "";


    currentLyric.textContent =
        current.text;


    nextLyric.textContent =
        next
            ? next.text
            : "";
}


/* =========================================
   INSTRUMENTAL FINALE
========================================= */

function updateFinale(time) {

    if (
        time >=
        FINALE_TIME
    ) {

        introTitle.classList.add(
            "hidden"
        );


        lyricsPanel.classList.add(
            "hidden"
        );


        finaleScreen.classList.remove(
            "hidden"
        );


    } else {

        finaleScreen.classList.add(
            "hidden"
        );

    }
}


/* =========================================
   PAUSE / RESUME
========================================= */

async function togglePause() {

    if (!running) {
        return;
    }


    paused =
        !paused;


    if (paused) {

        soundtrack.pause();


        pauseButton.textContent =
            "▶";


        pauseButton.title =
            "Resume";


    } else {

        try {

            await soundtrack.play();


            pauseButton.textContent =
                "❚❚";


            pauseButton.title =
                "Pause";


        } catch (error) {

            console.error(
                "Resume error:",
                error
            );

        }
    }
}


/* =========================================
   RESTART
========================================= */

async function restartKaraoke() {

    soundtrack.pause();


    stopClock();


    soundtrack.currentTime =
        0;


    shufflePhotos();


    photoIndex =
        0;


    currentPhotoSlot =
        -1;


    currentLyricIndex =
        -1;


    running =
        true;


    paused =
        false;


    pauseButton.textContent =
        "❚❚";


    introTitle.classList.remove(
        "hidden"
    );


    lyricsPanel.classList.add(
        "hidden"
    );


    finaleScreen.classList.add(
        "hidden"
    );


    changePhoto();


    try {

        await soundtrack.play();


        startClock();


    } catch (error) {

        console.error(
            "Restart error:",
            error
        );

    }
}


/* =========================================
   FINISH KARAOKE
========================================= */

function finishKaraoke() {

    running =
        false;


    paused =
        false;


    stopClock();


    soundtrack.pause();


    finaleScreen.classList.remove(
        "hidden"
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


    const secondsPart =
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
        String(secondsPart)
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
   CHECK EXISTING SESSION
========================================= */

async function checkSession() {

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

            await prepareKaraoke();

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


startButton.addEventListener(
    "click",
    startKaraoke
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
    restartKaraoke
);


soundtrack.addEventListener(
    "ended",
    finishKaraoke
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
            running
        ) {

            event.preventDefault();


            togglePause();

        }


        if (
            event.key.toLowerCase() ===
            "r" &&
            running
        ) {

            restartKaraoke();

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


        stopClock();

    }
);


/* =========================================
   START
========================================= */

checkSession();