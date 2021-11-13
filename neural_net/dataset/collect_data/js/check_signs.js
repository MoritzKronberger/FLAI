
const url = "http://localhost:3000/images/";
var data;
var frame = document.getElementById("image");
var current_frame = 0;


axios
  .get(url)
  .then((response) => {
    data = response.data;
    loadImages(data)
  })

function loadImages(data) {
  frame.src = data[current_frame].src;
}

function deleteFrame()
{
    let frameUrl = url + current_frame;
    axios
    .delete(frameUrl)
    .then((response) => {
        console.log(response);
      })
}