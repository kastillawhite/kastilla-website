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

        x: Math.random() * width,
        y: Math.random() * height,

        size: Math.random() * 2 + .4,

        speedX: (Math.random() - .5) * .25,
        speedY: (Math.random() - .5) * .25,

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


        // gentle pulsing
        p.pulse += .01;


        let opacity =
            p.opacity +
            Math.sin(p.pulse) * .05;



        // mouse interaction
        if(mouse.x !== null){

            let dx = p.x - mouse.x;
            let dy = p.y - mouse.y;

            let distance = Math.sqrt(dx*dx + dy*dy);


            if(distance < 180){

                let force = (180-distance)/180;

                p.x += dx * force * .025;
                p.y += dy * force * .025;

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
            `rgba(70,60,50,${opacity})`;

        ctx.fill();


    });


    requestAnimationFrame(animate);

}


animate();