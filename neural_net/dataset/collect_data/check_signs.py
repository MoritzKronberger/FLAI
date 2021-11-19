import cv2
import os
import settings
from lib import helpers
from lib import statistic
from lib import style


def start_recording(dir, dataset_dir):
    print('---- Start Sign Check ----')

    main_font = style.main_font
    ref_font = style.bold_font

    stats = statistic.update_statistic(dataset_dir, __file__)

    current_frame = 0

    while True:
        try:

            if current_frame == len(dir):
                current_frame = 0
            elif current_frame < 0:
                current_frame = len(dir) - 1

            frame = cv2.imread(dir[current_frame])
            frame_width = frame.shape[1]
            frame_height = frame.shape[0]

            label = helpers.get_label_from_path(dir[current_frame], dataset_dir)
         
            ref = cv2.imread('./references/single_signs/' + label + '.jpeg')
            ref_width = ref.shape[1]
            ref_height = ref.shape[0]
            helpers.put_base_ui(frame,
                                frame_width,
                                frame_height,
                                stats)

            cv2.putText(frame,
                        f'Image: {current_frame+1}/{len(dir)}',
                        (30, 30),
                        main_font['font_style'],
                        main_font['font_size'],
                        main_font['font_color'],
                        main_font['font_thickness'])

            cv2.putText(frame,
                        f'Label: {label.upper()}',
                        (30, 70),
                        main_font['font_style'],
                        main_font['font_size'] * 1.5,
                        ref_font['font_color'],
                        ref_font['font_thickness'])

            cv2.putText(ref,
                        f'Label: {label.upper()}',
                        (30, int(ref_height - 30)),
                        ref_font['font_style'],
                        ref_font['font_size'],
                        ref_font['font_color'],
                        ref_font['font_thickness'])

            cv2.imshow('Reference', ref)
            cv2.imshow('Check Signs', frame)

            keypress = cv2.waitKeyEx(1)

            if not keypress == -1:
                if keypress == 115:  # s
                    current_frame += 1
                elif keypress == 100:  # d
                    os.remove(dir[current_frame])
                    dir.remove(dir[current_frame])
                    stats = statistic.update_statistic(dataset_dir, __file__)
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


def main():
    dataset_dir = settings.images_directory
    dirs = helpers.get_all_example_paths(dataset_dir, __file__)
    start_recording(dirs, dataset_dir)


if __name__ == '__main__':
    main()
