const url = "http://localhost:3000/examples/";
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
  frame.src = data[current_frame].image;
}

function deleteFrame()
{
    let frameUrl = url + data[current_frame].id;
    axios
    .delete(frameUrl)
    .then((response) => {
        console.log(response);
      })
}