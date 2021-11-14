const loadWebcamVideo = async () => {
  // from https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/demo/index.js
  const video = document.querySelector("#webcamVideo");
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
};

const createCanvas = (video) => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  return canvas;
};

const mirrorToCanvas = (canvas, video) => {
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
};

const saveLabeledCapture = async (video, canvas, label) => {
  // image saving via canvas derived from https://stackoverflow.com/a/13765373/14906871
  mirrorToCanvas(canvas, video);
  const image = canvas.toDataURL("image/png");
  try {
    await axios.post("http://localhost:3000/examples/", {
      label: label,
      image: image,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateStatistic = async (labels, statistic) => {
  statistic.style.display = "none";
  statistic.innerHTML = "";
  const tr_th = document.createElement("tr");
  const tr_td = document.createElement("tr");
  const queryData = await axios.get(`http://localhost:3000/examples`);
  const examples = queryData.data;
  labels.forEach(async (label) => {
    const number = examples.filter((ex) => ex.label === label).length;
    const th = document.createElement("th");
    const td = document.createElement("td");
    th.innerText = label;
    td.innerText = number;
    tr_th.appendChild(th);
    tr_td.appendChild(td);
  });
  statistic.appendChild(tr_th);
  statistic.appendChild(tr_td);
  statistic.style.display = "";
};

const main = async () => {
  const video = await loadWebcamVideo();
  const labels = [..."abcdefghiklmnopqrstuvwxy"];

  const statistic = document.querySelector("#labelStatistic");
  await updateStatistic(labels, statistic);

  const canvas = createCanvas(video);

  document.addEventListener("keyup", async (event) => {
    const key = event.key;
    if (labels.includes(key)) {
      await saveLabeledCapture(video, canvas, key);
      await updateStatistic(labels, statistic);
    }
  });
};

main();
