/* =========================
   ENGAGE
   CATCH MY ATTENTION
========================= */

const words = document.querySelectorAll(".floating-word");

let pointerX = -1000;
let pointerY = -1000;

let pointerActive = false;

let interactions = 0;
let revealed = false;


/* =========================
   SETTINGS
========================= */

/*
 * How close the pointer needs to get
 * before a word reacts.
 */
const escapeDistance = 130;


/*
 * How strongly the word moves away.
 *
 * This is intentionally MUCH stronger
 * than the previous version.
 */
const escapeForce = 0.22;


/*
 * Momentum.
 *
 * Higher = words glide farther.
 * Lower = they stop sooner.
 */
const friction = 0.92;


/*
 * Very gentle pull back toward
 * the original position.
 *
 * This is intentionally weak.
 */
const returnForce = 0.00015;


/*
 * How many interactions before
 * the reveal.
 */
const interactionThreshold = 35;


/*
 * Prevents one word from counting
 * dozens of times per second.
 */
const interactionCooldown = 700;


/* =========================
   WORD DATA
========================= */

const wordData = [];


words.forEach((word) => {

    const rect =
        word.getBoundingClientRect();


    const originalX =
        (rect.left / window.innerWidth) * 100;

    const originalY =
        (rect.top / window.innerHeight) * 100;


    wordData.push({

        element: word,

        originalX,
        originalY,

        currentX: originalX,
        currentY: originalY,

        velocityX: 0,
        velocityY: 0,

        /*
         * Slight differences between
         * the words.
         */
        sensitivity:
            0.85 + Math.random() * 0.3,

        lastInteraction: 0

    });

});


/* =========================
   POINTER EVENTS
========================= */

/*
 * This works with:
 *
 * mouse
 * finger
 * stylus
 *
 * on desktop and mobile.
 */

document.addEventListener(
    "pointermove",
    (event) => {

        pointerX = event.clientX;
        pointerY = event.clientY;

        pointerActive = true;

    }
);


document.addEventListener(
    "pointerdown",
    (event) => {

        pointerX = event.clientX;
        pointerY = event.clientY;

        pointerActive = true;

    }
);


document.addEventListener(
    "pointerup",
    () => {

        pointerActive = false;

    }
);


document.addEventListener(
    "pointercancel",
    () => {

        pointerActive = false;

    }
);


/* =========================
   ESCAPE A WORD
========================= */

function pushWord(
    word,
    dx,
    dy,
    distance
) {

    if (distance === 0) {
        return;
    }


    /*
     * Direction AWAY from the pointer.
     */

    const directionX =
        dx / distance;

    const directionY =
        dy / distance;


    /*
     * The closer you get,
     * the harder the word escapes.
     */

    const closeness =
        1 -
        (distance / escapeDistance);


    /*
     * Give the word a real push.
     */

    word.velocityX +=
        directionX *
        escapeForce *
        closeness *
        word.sensitivity;


    word.velocityY +=
        directionY *
        escapeForce *
        closeness *
        word.sensitivity;


    /*
     * Count a meaningful interaction.
     */

    const now = Date.now();


    if (
        now -
        word.lastInteraction >
        interactionCooldown
    ) {

        interactions++;

        word.lastInteraction = now;


        if (
            interactions >=
            interactionThreshold
        ) {

            revealConnection();

        }

    }

}


/* =========================
   ANIMATION LOOP
========================= */

function animate() {

    wordData.forEach((word) => {

        const element =
            word.element;


        /*
         * Find the current center
         * of the word.
         */

        const rect =
            element.getBoundingClientRect();


        const wordX =
            rect.left +
            rect.width / 2;

        const wordY =
            rect.top +
            rect.height / 2;


        const dx =
            wordX -
            pointerX;

        const dy =
            wordY -
            pointerY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        /* =========================
           ESCAPE
        ========================= */

        if (
            pointerActive &&
            distance <
            escapeDistance
        ) {

            pushWord(
                word,
                dx,
                dy,
                distance
            );

        }


        /* =========================
           RETURN HOME
        ========================= */

        /*
         * Only pull very gently toward
         * the starting position.
         */

        word.velocityX +=
            (
                word.originalX -
                word.currentX
            ) *
            returnForce;


        word.velocityY +=
            (
                word.originalY -
                word.currentY
            ) *
            returnForce;


        /* =========================
           FRICTION
        ========================= */

        word.velocityX *= friction;
        word.velocityY *= friction;


        /* =========================
           MOVE
        ========================= */

        word.currentX +=
            word.velocityX;

        word.currentY +=
            word.velocityY;


        /* =========================
           BOUNDARIES
        ========================= */

        if (word.currentX < 5) {

            word.currentX = 5;

            word.velocityX =
                Math.abs(
                    word.velocityX
                ) * 0.7;

        }


        if (word.currentX > 90) {

            word.currentX = 90;

            word.velocityX =
                -Math.abs(
                    word.velocityX
                ) * 0.7;

        }


        if (word.currentY < 8) {

            word.currentY = 8;

            word.velocityY =
                Math.abs(
                    word.velocityY
                ) * 0.7;

        }


        if (word.currentY > 90) {

            word.currentY = 90;

            word.velocityY =
                -Math.abs(
                    word.velocityY
                ) * 0.7;

        }


        /* =========================
           APPLY
        ========================= */

        element.style.left =
            `${word.currentX}%`;

        element.style.top =
            `${word.currentY}%`;

    });


    requestAnimationFrame(animate);

}


/* =========================
   REVEAL
========================= */

function revealConnection() {

    if (revealed) {
        return;
    }

    revealed = true;


    const message =
        document.querySelector(".caught-message");

    const engage =
        document.querySelector(".engage");

    const contactSection =
        document.querySelector(".contact-section");


    /*
     * First:
     * show "okay, you found me."
     */

    message.classList.add("visible");


    /*
     * Give the visitor time to
     * see the message.
     */

    setTimeout(() => {

        /*
         * Shrink ENGAGE.
         */

        engage.classList.add("revealed");


        /*
         * Reveal contact section.
         */

        contactSection.classList.add(
            "revealed"
        );


        /*
         * Then actually scroll
         * the DOCUMENT.
         */

        setTimeout(() => {

            window.scrollTo({
                top:
                    contactSection.offsetTop,
                behavior: "smooth"
            });

        }, 500);

    }, 2200);

}
/* =========================
   START
========================= */

animate();