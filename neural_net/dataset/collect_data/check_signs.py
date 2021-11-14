import cv2
import os
import settings


def start_recording(dir, dataset_dir):
    print('---- Start Recording ----')

    font = cv2.FONT_HERSHEY_SIMPLEX
    font_color = (0, 255, 0)
    font_size = .6
    font_thickness = 1

    
    current_frame = 0

    while True:
        try:

            if current_frame == len(dir):
                current_frame = 0

            frame = cv2.imread(dir[current_frame])
            frame_width = frame.shape[1]
            frame_height = frame.shape[0]

            label = dir[current_frame].replace(dataset_dir, '')[1]

            #ref = cv2.imread('./references/single_signs/' + label + '.png')
            ref = cv2.imread('./references/single_signs/b.png')
            ref_width = ref.shape[1]
            ref_height = ref.shape[0]

            cv2.putText(frame,
                        'Image: ' + str(current_frame+1) + '/' + str(len(dir)),
                        (30, int(frame_height - 30)),
                        font,
                        font_size,
                        font_color,
                        font_thickness)

            cv2.putText(frame,
                        'Label: ' + label,
                        (30, int(frame_height - 60)),
                        font,
                        font_size,
                        font_color,
                        font_thickness)

            cv2.putText(ref,
                        'Label: ' + label,
                        (30, int(ref_height - 10)),
                        font,
                        font_size,
                        font_color,
                        font_thickness)

            cv2.imshow('Reference', ref)
            cv2.imshow('Check Signs', frame)

            keypress = cv2.waitKeyEx(1)
            
          

            if not keypress == -1:
                if keypress == 115:  # s
                    current_frame += 1
                elif keypress == 100:  # d
                    os.remove(dir[current_frame])
                    dir.remove(dir[current_frame])
                    print('delete ' + str(current_frame))
                elif keypress == 2424832:  # arrow left
                    current_frame -= 1
                elif keypress == 2555904:  # arrow right
                    current_frame += 1

            if keypress == 27:  # esc
                break

        except Exception as e:
            print(e)
            break

    cv2.destroyAllWindows()


def loadAllPaths(dataset_dir):
    dirs = []
    os.chdir(dataset_dir)
    label_dirs = os.listdir()
    for dir in label_dirs:
        path_to_example = os.path.join(dataset_dir, dir)
        os.chdir(path_to_example)
        examples = os.listdir()
        for example in examples:
            path = os.path.join(path_to_example, example)
            print(path)
            dirs.append(path)
    return dirs


def main():
    dataset_dir = settings.dataset_directory
    dirs = loadAllPaths(dataset_dir)
    dir_path = os.path.dirname(os.path.realpath(__file__))
    os.chdir(dir_path)
    start_recording(dirs, dataset_dir)

if __name__ == '__main__':
    main()
