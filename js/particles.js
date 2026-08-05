const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let width;
let height;

const mouse = {
    x: null,
    y: null
};

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

resize();

window.addEventListener("resize", resize);

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});


const particles = [];

const amount = 500;



for(let i = 0; i < amount; i++){

    particles.push({

        color:[
            "190,225,255",
            "170,215,250",
            "210,235,255",
            "150,205,245",
            "230,245,255"
        ][Math.floor(Math.random()*5)],
        
        x: Math.random() * width,
        y: Math.random() * height,

        size:
        Math.random() < .18
        ?
        Math.random()*40+20
        :
        Math.random()*6+1.5,


        // floating movement
        speedX: (Math.random() - .5) * .25,
        speedY: (Math.random() - .5) * .25,


        // cursor push velocity
        vx: 0,
        vy: 0,


        opacity: Math.random() * .35 + .05,

        pulse: Math.random() * Math.PI * 2

    });

}



function animate(){

    ctx.clearRect(0,0,width,height);


    particles.forEach(p => {


        // natural floating movement
        p.x += p.speedX;
        p.y += p.speedY;


        // apply cursor push velocity
        p.x += p.vx;
        p.y += p.vy;


        // slowly reduce push after interaction
        p.vx *= .92;
        p.vy *= .92;



        // gentle pulsing
        p.pulse += .01;

        let opacity =
            p.opacity +
            Math.sin(p.pulse) * .04;



        // mouse interaction
        if(mouse.x !== null){

            let dx = p.x - mouse.x;
            let dy = p.y - mouse.y;

            let distance = Math.sqrt(dx*dx + dy*dy);


            const radius = 100;


            if(distance < radius){

                // normalize direction
                let angle = Math.atan2(dy, dx);


                // stronger near the cursor
                let force = (radius - distance) / radius;


                let push = force * 2.5;


                p.vx += Math.cos(angle) * push;
                p.vy += Math.sin(angle) * push;

            }

        }



        // wrap edges
        if(p.x < 0) p.x = width;
        if(p.x > width) p.x = 0;

        if(p.y < 0) p.y = height;
        if(p.y > height) p.y = 0;



        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI*2
        );


        ctx.fillStyle =
        `rgba(${p.color},${opacity})`;

        ctx.fill();


    });


    requestAnimationFrame(animate);

}


animate();


