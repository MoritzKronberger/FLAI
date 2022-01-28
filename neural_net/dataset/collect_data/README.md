# Dataset Collection

## About

This python project is used to collect recordings of DGS-signs performed by team members using their webcam.

The images are labeled with their respective sign and are then be processed using the [mediapipe hand pose detection](https://google.github.io/mediapipe/solutions/hands.html).

## Initial Setup

[Python 3](https://www.python.org/downloads/) and [Python for VsCode](https://marketplace.visualstudio.com/items?itemName=ms-python.python) must be installed.

### Change directory

```bash
cd neural_net/dataset/collect_data
```

### Setup virtual environment

```bash
py -3 -m venv .venv
.venv/scripts/activate
```

### Use virtual environment in VsCode

```bash
code .
```

Or open the `collect_data` directory in new VsCode window

In the new window:

Press **STRG** + **SHIFT** + **P**

In VsCode Commandline:

```bash
> Python: Select Interpreter
+ Enter interpreter path...
> Python 3.9.0 64-bit ('venv':venv)
```

*Once the interpreter has been set from the `collect_data` directory, it is also available in parent directories after a VsCode restart.*

### Install requirements

Start any .py file to launch the VsCode Python terminal

(To run click 'Run Python File' in the top right corner, or right click -> 'Run Python File in Terminal')

In the Python Terminal:

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

## Dataset Recording Instructions

It would be awesome if everybody could collect around 50 to 100 samples per letter.

More variance between the examples is more important than how many you collect!

Maybe try different webcam angles, hand rotations, but make sure signs are still shown correctly.

If you collect less examples, that's fine, too, just try to collect roughly the same number of samples for every letter.

### Usage

1. Run **main.py**.

    (To run click 'Run Python File' in the top right corner, or right click -> 'Run Python File in Terminal')

2. Enter **collect**

    ```bash
    What action do you want to perform? (collect/check/convert) > collect
    ```

3. Press any of the keys included in the labels to save an image with the respective label.

4. Press 'esc' to quit.

Common errors:

- If the wrong camera is being used, quit and adjust **camera** in **settings.py**.

- If the script fails, make sure you have navigated into the `collect_data` directory in the Python Console.

## Check images

1. Run **main.py**.

2. Enter **check**

    ```bash
    What action do you want to perform? (collect/check/convert) > check
    ```

3. Press 's' to keep an image, 'd' to delete it or the left or right arrow key to go back/ forward one image.

4. Press 'esc' to quit.

## Convert Dataset

1. Run **main.py**.

2. Enter **convert**

    ```bash
    What action do you want to perform? (collect/check/convert) > convert
    ```

3. Choose if you want to overwrite existing entries with your username or keep them.

    ```bash
    Do you want to overwrite your existing entries? (y/n) > y/n
    ```

    - If you have already converted images from the folder you are converting right now, you should probably choose overwrite.

    - If you are using a new folder, you should probably choose not to overwrite your old entries.
