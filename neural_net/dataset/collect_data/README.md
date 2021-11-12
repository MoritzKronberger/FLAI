# Dataset Collection

A simple, static webpage will be used to collect recordings of DGS-signs performed by team members using their webcam.

The videos must be labeled with their respective sign and will then be processed using the [mediapipe hand pose detection](https://google.github.io/mediapipe/solutions/hands.html).

## Requirements

Split application in 3 stages:

- record signs
- check labels 
- convert with handpose

### Record signs

Show video feed and sign chart for alphabet

Available labels: A-Y, without J

Keyboard input of label saves capture with label as filename

Show statistic of example count per label

Save image as \<label>_\<count-per-label>.jpg

### Check labels

./recorder_images

Allow selection of source directory

Show lableled image and ground truth example

Input 's' to keep and 'd' to delete
Input 'arrow_left' to go back one image

### Convert with handpose

Run handpose over all images and save normalized output as JSON in /dataset directory

Let users set name of JSON file
