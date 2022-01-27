# Dev Docs

## Requirements

Split application in 3 stages:

- record signs
- check labels
- convert with handpose

### Record signs

Show video feed and sign chart for alphabet

Available labels: A-Y, without J

Keyboard input of label saves capture with label as part of filename

Show statistic of example count per label

Save image as \<label>_\<uuid>\_\<count-per-label>.jpg

Allow saving in any directory

### Check labels

Allow selection of source directory

Show lableled image and ground truth example

Input 's' to keep and 'd' to delete

Input 'arrow_left' or 'arrow_right' to move between image

### Convert with handpose

Run handpose over all images and save normalized output as CSV in /dataset directory

Let users choose to overwrite their own existing entries or keep them
