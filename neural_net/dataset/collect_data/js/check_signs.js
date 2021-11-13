const url = "http://localhost:3000/examples/";
let data;
let frame = document.getElementById("image");
let current_frame = 0;

axios.get(url).then((response) => {
  data = response.data;
  loadImages(data);
});

function loadImages(data) {
  frame.src = data[current_frame].image;
}

document.addEventListener("keydown", (e) => {
  if (e.key == "s") {
    current_frame++;
  } else if (e.key == "ArrowLeft" && current_frame >= 0) {
    current_frame--;
  }
  loadImages(data);
});

document.addEventListener("keydown", (e) => {
  if (e.key == "d") {
    deleteFrame();
  }
});

function deleteFrame() {
  let frameUrl = url + data[current_frame].id;
  axios.delete(frameUrl).then((response) => {
    console.log(response);
  });
}
