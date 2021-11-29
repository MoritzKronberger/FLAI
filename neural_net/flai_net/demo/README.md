# FLAINET DEMO

FLAI NET Demo using [mediapipe hand pose detection](https://google.github.io/mediapipe/solutions/hands.html) and our custom neural net.

[Python 3](https://www.python.org/downloads/) and [Python for VsCode](https://marketplace.visualstudio.com/items?itemName=ms-python.python) must be installed.

## Initial Setup

### Change directory

```bash
cd neural_net/flai_net/demo
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

Or open the collect_data dir in new VsCode window

In the new window:

Press **STRG** + **SHIFT** + **P**

In VsCode Commandline:

```bash
> Python: Select Interpreter
+ Enter interpreter path...
> Python 3.9.0 64-bit ('venv':venv)
```

*Once the interpreter has been set from the collect_data folder, it might also be availiable in parent directories after a VsCode restart.*

### Install requirements

Start any .py file to launch the VsCode Python terminal

(To run click 'Run Python File' in the top right corner, or right click -> 'Run Python File in Terminal')

In the Python Terminal:

```bash
pip install -r requirements.txt
```

#### In case of Errno:2

For Windows:

1. Click Start, and then click Run.

2. In the Open box, paste **%systemroot%\syswow64\regedit** , and then click OK.

3. Navigate to:
**Computer/HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem**

4. Right Click **LongPathsEnabled** > **Change**

5. Set to 1

6. Run **pip install -r requirements.txt** again

### Create settings.py

```bash
bash create_settings.sh
```

## Usage

Run **demo.py**

(To run click 'Run Python File' in the top right corner, or right click -> 'Run Python File in Terminal')

- If the wrong camera is being used, quit and adjust **camera** in **settings.py**.

- If the script fails, make sure you have navigated into the **demo** directory in the Python Console.
