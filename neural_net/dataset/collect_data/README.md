# Dataset Collection

A python project will be used to collect recordings of DGS-signs performed by team members using their webcam.

The videos must be labeled with their respective sign and will then be processed using the [mediapipe hand pose detection](https://google.github.io/mediapipe/solutions/hands.html).

[Python 3](https://www.python.org/downloads/) and [Python for VsCode](https://marketplace.visualstudio.com/items?itemName=ms-python.python) must be installed.

## Initial Setup

### Change directory

```bash
cd neural_net/collect_data
```

### Setup virtual environment

```bash
py -3 -m venv .venv
.venv/scripts/activate
```

### Use virtual environment in VsCode

#### Option 1

Press **STRG** + **SHIFT** + **P**

In VsCode Commandline:

```bash
> Python: Select Interpreter
+ Enter interpreter path...
> ./neural_net/dataset/collect_data/.venv/Scripts/python.exe
```

### Install requirements

```bash
pip install -r requirements.txt
```

### Create settings.py

```bash
bash create_settings.sh
```

### Change settings

In **settings.py**:

- Set **username** to your own name (lowercase).
- Set **image_directory** to the absolute path (C:\Users\...) of the folder, you want to save your images in.

## Record Dataset

Run **record_signs.py**.

(To run click 'Run Python File' in the top right corner, or right click -> 'Run Python File in Terminal')

If the wrong camera is being used, quit and adjust **camera** in **settings.py**.

Press any of the keys included in the labels to save an image with the respective label.

Press 'esc' to quit.

## Check images

Run **check_signs.py**.

Press 's' to keep an image, 'd' to delete it or the left or right arrow key to go back/ forward one image.

Press 'esc' to quit.

## Convert Dataset

Checkout the branch for dataset updates:

```bash
git checkout all-chore-update-flai-dataset
```

Run **convert_dataset.py**.

Choose if you want to overwrite existing entries with your username or keep them.

Commit the updated dataset.
