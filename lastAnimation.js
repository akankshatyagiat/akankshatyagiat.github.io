let c = document.getElementById("my-canvas");
let ctx = c.getContext("2d");

// let make_base=()=>{
//     base_image = new Image();
//     base_image.src = 'images/background.jpg';
//     base_image.onload = ()=>{
//       ctx.drawImage(base_image, 0, 0,1000,500);
//     };
//   };

// make_base();

let loadImage = (src, callback) => {
  let myImg = document.createElement("img");
  //let myImg=new Image();

  myImg.onload = () => callback(myImg);
  myImg.src = src;
};

//settting the path for the images.
let imagePath = (frameNumber, animation) => {
  return "images/" + animation + "/" + frameNumber + ".png";
};

let frames = {
  idle: [1, 2, 3, 4, 5, 6, 7, 8],
  kick: [1, 2, 3, 4, 5, 6, 7],
  punch: [1, 2, 3, 4, 5, 6, 7],
  backward: [1, 2, 3, 4, 5, 6],
  block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  forward: [1, 2, 3, 4, 5, 6],
};

//loading images one by one
let loadImages = (callback) => {
  let images = {
    idle: [],
    kick: [],
    punch: [],
    backward: [],
    block: [],
    forward: [],
  };
  let imagesToLoad = 0;

  // callback for loading images
  ["idle", "kick", "punch", "backward", "block", "forward"].forEach(
    (animation) => {
      let animationFrames = frames[animation];
      imagesToLoad += animationFrames.length;

      animationFrames.forEach((frameNumber) => {
        let path = imagePath(frameNumber, animation);

        loadImage(path, (image) => {
          images[animation][frameNumber - 1] = image;
          imagesToLoad -= 1;

          if (imagesToLoad === 0) {
            callback(images);
          }
        });
      });
    }
  );
};

//this callback is for after the animation
let animate = (ctx, images, animation, callback) => {
  images[animation].forEach((image, index) => {
    setTimeout(() => {
      ctx.clearRect(0, 0, 500, 500); // clearing the canvas for the next image
      ctx.drawImage(image, 0, 0, 500, 500);
    }, index * 100);
  });
  setTimeout(callback, images[animation].length * 100);
};

// calling load function
loadImages((images) => {
  let queueAnimations = [];
  let aux = () => {
    let selectedAnimation;
    if (queueAnimations.length === 0) {
      selectedAnimation = "idle";
    } else {
      selectedAnimation = queueAnimations.shift();
    }
    animate(ctx, images, selectedAnimation, aux);
  };
  aux();

  document.getElementById("kick").onclick = () => {
    queueAnimations.push("kick");
  };

  document.getElementById("punch").onclick = () => {
    queueAnimations.push("punch");
  };
  document.getElementById("block").onclick = () => {
    queueAnimations.push("block");
  };

  document.getElementById("backward").onclick = () => {
    queueAnimations.push("backward");
  };
  document.getElementById("forward").onclick = () => {
    queueAnimations.push("forward");
  };

  document.addEventListener("keyup", (eventTrigger) => {
    const key = eventTrigger.key; // "arrowRight","ArrowLeft"
    if (key === "ArrowLeft") queueAnimations.push("kick");
    else if (key === "ArrowRight") queueAnimations.push("punch");
    else if (key === "ArrowUp") queueAnimations.push("forward");
    else if (key === "ArrowDown") queueAnimations.push("backward");
  });
});
