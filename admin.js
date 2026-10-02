/* =========================================
   ALOHA CHRISTMAS PHOTO MANAGER
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
   ELEMENTS
========================================= */

const loginScreen =
    document.getElementById("loginScreen");

const managerScreen =
    document.getElementById("managerScreen");

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

const logoutButton =
    document.getElementById("logoutButton");

const refreshButton =
    document.getElementById("refreshButton");

const managerStatus =
    document.getElementById("managerStatus");

const photoGrid =
    document.getElementById("photoGrid");

const emptyState =
    document.getElementById("emptyState");

const emptyStateText =
    document.getElementById("emptyStateText");

const pendingCount =
    document.getElementById("pendingCount");

const approvedCount =
    document.getElementById("approvedCount");

const hiddenCount =
    document.getElementById("hiddenCount");

const statCards =
    document.querySelectorAll(".stat-card");


/* =========================================
   STATE
========================================= */

let allPhotos = [];

let currentFilter = "pending";

let signedImageUrls = new Map();


/* =========================================
   SIGN IN
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


        await showManager();


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
   SIGN OUT
========================================= */

async function signOut() {

    try {

        const result =
            await supabaseClient.auth
                .signOut();


        if (result.error) {
            throw result.error;
        }


    } catch (error) {

        console.error(
            "Sign out error:",
            error
        );

    }


    allPhotos = [];

    signedImageUrls.clear();

    photoGrid.innerHTML = "";

    pendingCount.textContent = "0";
    approvedCount.textContent = "0";
    hiddenCount.textContent = "0";

    managerScreen.classList.add(
        "hidden"
    );

    loginScreen.classList.remove(
        "hidden"
    );

    passwordInput.value = "";
}


/* =========================================
   SHOW PHOTO MANAGER
========================================= */

async function showManager() {

    loginScreen.classList.add(
        "hidden"
    );

    managerScreen.classList.remove(
        "hidden"
    );


    await loadPhotos();
}


/* =========================================
   LOAD PHOTO RECORDS
========================================= */

async function loadPhotos() {

    managerStatus.textContent =
        "Loading photos...";

    refreshButton.disabled = true;


    try {

        const result =
            await supabaseClient
                .from("party_photos")
                .select(
                    "id, capture_id, clean_path, framed_path, photo_mode, status, created_at"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (result.error) {
            throw result.error;
        }


        allPhotos =
            result.data || [];


        managerStatus.textContent =
            "Preparing photo previews...";


        await prepareSignedUrls(
            allPhotos
        );


        updateCounters();

        renderPhotos();


        managerStatus.textContent =
            allPhotos.length +
            " photo submission" +
            (
                allPhotos.length === 1
                    ? ""
                    : "s"
            ) +
            " loaded";


    } catch (error) {

        console.error(
            "Load error:",
            error
        );


        managerStatus.textContent =
            "Could not load photos: " +
            error.message;


    } finally {

        refreshButton.disabled = false;

    }
}


/* =========================================
   CREATE SIGNED IMAGE URLS

   party-photos is a private bucket.

   The authenticated organizer receives a
   temporary signed URL for each framed image.
========================================= */

async function prepareSignedUrls(photos) {

    signedImageUrls.clear();


    const jobs =
        photos.map(
            async function (photo) {

                try {

                    const result =
                        await supabaseClient
                            .storage
                            .from("party-photos")
                            .createSignedUrl(
                                photo.framed_path,
                                3600
                            );


                    if (result.error) {
                        throw result.error;
                    }


                    if (
                        result.data &&
                        result.data.signedUrl
                    ) {

                        signedImageUrls.set(
                            photo.id,
                            result.data.signedUrl
                        );

                    }


                } catch (error) {

                    console.error(
                        "Signed URL error:",
                        photo.capture_id,
                        error
                    );

                }

            }
        );


    await Promise.all(jobs);
}


/* =========================================
   UPDATE COUNTERS
========================================= */

function updateCounters() {

    const pending =
        allPhotos.filter(
            function (photo) {

                return (
                    photo.status ===
                    "pending"
                );

            }
        ).length;


    const approved =
        allPhotos.filter(
            function (photo) {

                return (
                    photo.status ===
                    "approved"
                );

            }
        ).length;


    const hidden =
        allPhotos.filter(
            function (photo) {

                return (
                    photo.status ===
                    "hidden"
                );

            }
        ).length;


    pendingCount.textContent =
        pending;

    approvedCount.textContent =
        approved;

    hiddenCount.textContent =
        hidden;
}


/* =========================================
   CHANGE FILTER
========================================= */

function setFilter(filter) {

    currentFilter =
        filter;


    statCards.forEach(
        function (card) {

            if (
                card.dataset.filter ===
                filter
            ) {

                card.classList.add(
                    "active"
                );

            } else {

                card.classList.remove(
                    "active"
                );

            }

        }
    );


    renderPhotos();
}


/* =========================================
   RENDER PHOTO GRID
========================================= */

function renderPhotos() {

    photoGrid.innerHTML = "";


    const filteredPhotos =
        allPhotos.filter(
            function (photo) {

                return (
                    photo.status ===
                    currentFilter
                );

            }
        );


    if (
        filteredPhotos.length === 0
    ) {

        emptyState.classList.remove(
            "hidden"
        );


        emptyStateText.textContent =
            getEmptyMessage(
                currentFilter
            );


        return;
    }


    emptyState.classList.add(
        "hidden"
    );


    filteredPhotos.forEach(
        function (photo) {

            const card =
                buildPhotoCard(
                    photo
                );


            photoGrid.appendChild(
                card
            );

        }
    );
}


/* =========================================
   BUILD PHOTO CARD
========================================= */

function buildPhotoCard(photo) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "photo-card";


    /* IMAGE WRAPPER */

    const imageWrapper =
        document.createElement(
            "div"
        );


    imageWrapper.className =
        "photo-image-wrapper " +
        photo.photo_mode;


    /* IMAGE */

    const image =
        document.createElement(
            "img"
        );


    image.className =
        "photo-image";


    image.alt =
        "Aloha Christmas party photo";


    image.loading =
        "lazy";


    const imageUrl =
        signedImageUrls.get(
            photo.id
        );


    if (imageUrl) {

        image.src =
            imageUrl;

    }


    /* ORIENTATION BADGE */

    const badge =
        document.createElement(
            "span"
        );


    badge.className =
        "mode-badge";


    badge.textContent =
        photo.photo_mode;


    imageWrapper.appendChild(
        image
    );


    imageWrapper.appendChild(
        badge
    );


    /* PHOTO INFORMATION */

    const info =
        document.createElement(
            "div"
        );


    info.className =
        "photo-info";


    const time =
        document.createElement(
            "p"
        );


    time.className =
        "photo-time";


    time.textContent =
        formatPhotoTime(
            photo.created_at
        );


    const captureId =
        document.createElement(
            "p"
        );


    captureId.className =
        "photo-id";


    captureId.textContent =
        photo.capture_id;


    info.appendChild(
        time
    );


    info.appendChild(
        captureId
    );


    /* MODERATION ACTIONS */

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "photo-actions";


    buildActionButtons(
        actions,
        photo
    );


    /* ASSEMBLE CARD */

    card.appendChild(
        imageWrapper
    );


    card.appendChild(
        info
    );


    card.appendChild(
        actions
    );


    return card;
}


/* =========================================
   MODERATION BUTTONS
========================================= */

function buildActionButtons(
    container,
    photo
) {

    if (
        photo.status ===
        "pending"
    ) {

        container.appendChild(
            createActionButton(
                "✓ Approve",
                "approve-button",
                function () {

                    updatePhotoStatus(
                        photo.id,
                        "approved"
                    );

                }
            )
        );


        container.appendChild(
            createActionButton(
                "✕ Hide",
                "hide-button",
                function () {

                    updatePhotoStatus(
                        photo.id,
                        "hidden"
                    );

                }
            )
        );

    }


    if (
        photo.status ===
        "approved"
    ) {

        container.appendChild(
            createActionButton(
                "↩ Pending",
                "pending-button",
                function () {

                    updatePhotoStatus(
                        photo.id,
                        "pending"
                    );

                }
            )
        );


        container.appendChild(
            createActionButton(
                "✕ Hide",
                "hide-button",
                function () {

                    updatePhotoStatus(
                        photo.id,
                        "hidden"
                    );

                }
            )
        );

    }


    if (
        photo.status ===
        "hidden"
    ) {

        container.appendChild(
            createActionButton(
                "✓ Approve",
                "approve-button",
                function () {

                    updatePhotoStatus(
                        photo.id,
                        "approved"
                    );

                }
            )
        );


        container.appendChild(
            createActionButton(
                "↩ Pending",
                "pending-button",
                function () {

                    updatePhotoStatus(
                        photo.id,
                        "pending"
                    );

                }
            )
        );

    }
}


/* =========================================
   CREATE MODERATION BUTTON
========================================= */

function createActionButton(
    label,
    className,
    action
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "photo-action " +
        className;


    button.textContent =
        label;


    button.addEventListener(
        "click",
        action
    );


    return button;
}


/* =========================================
   UPDATE PHOTO STATUS
========================================= */

async function updatePhotoStatus(
    photoId,
    newStatus
) {

    managerStatus.textContent =
        "Updating photo...";


    try {

        const result =
            await supabaseClient
                .from("party_photos")
                .update(
                    {
                        status:
                            newStatus
                    }
                )
                .eq(
                    "id",
                    photoId
                );


        if (result.error) {
            throw result.error;
        }


        const photo =
            allPhotos.find(
                function (item) {

                    return (
                        item.id ===
                        photoId
                    );

                }
            );


        if (photo) {

            photo.status =
                newStatus;

        }


        updateCounters();

        renderPhotos();


        managerStatus.textContent =
            "Photo moved to " +
            newStatus +
            ".";


    } catch (error) {

        console.error(
            "Moderation error:",
            error
        );


        managerStatus.textContent =
            "Could not update photo: " +
            error.message;

    }
}


/* =========================================
   FORMAT PHOTO TIME
========================================= */

function formatPhotoTime(dateString) {

    const date =
        new Date(
            dateString
        );


    return date.toLocaleString(
        undefined,
        {
            month:
                "short",

            day:
                "numeric",

            hour:
                "numeric",

            minute:
                "2-digit"
        }
    );
}


/* =========================================
   EMPTY STATE MESSAGE
========================================= */

function getEmptyMessage(status) {

    if (
        status ===
        "pending"
    ) {

        return (
            "No photos are waiting for approval."
        );

    }


    if (
        status ===
        "approved"
    ) {

        return (
            "No photos have been approved yet."
        );

    }


    return (
        "No photos have been hidden."
    );
}


/* =========================================
   EVENT LISTENERS
========================================= */

loginForm.addEventListener(
    "submit",
    signIn
);


logoutButton.addEventListener(
    "click",
    signOut
);


refreshButton.addEventListener(
    "click",
    loadPhotos
);


statCards.forEach(
    function (card) {

        card.addEventListener(
            "click",
            function () {

                setFilter(
                    card.dataset.filter
                );

            }
        );

    }
);


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

            await showManager();

        } else {

            loginScreen.classList.remove(
                "hidden"
            );


            managerScreen.classList.add(
                "hidden"
            );

        }


    } catch (error) {

        console.error(
            "Session error:",
            error
        );


        loginScreen.classList.remove(
            "hidden"
        );


        managerScreen.classList.add(
            "hidden"
        );

    }
}


/* =========================================
   START APPLICATION
========================================= */

checkSession();