import cv2
import os
import settings
from lib import helpers
from lib import statistic
from lib import style


def start_recording(dir, images_dir):
    print('---- Start Sign Check ----')

    main_font = style.main_font
    ref_font = style.bold_font

    stats = statistic.update_statistic(images_dir, __file__)

    current_image = 0

    while len(dir) > 0:
        try:

            if current_image == len(dir):
                current_image = 0
            elif current_image < 0:
                current_image = len(dir) - 1

            image = cv2.imread(dir[current_image])
            image_width = image.shape[1]
            image_height = image.shape[0]

            label = helpers.get_label_from_path(
                dir[current_image], images_dir)

            ref = cv2.imread('./references/single_signs/' + label + '.jpeg')
            ref = cv2.resize(ref, helpers.scale_image(ref, .5),
                             interpolation=cv2.INTER_AREA)
            ref_height = ref.shape[0]

            helpers.put_base_ui(image,
                                image_width,
                                image_height,
                                stats)

            cv2.putText(image,
                        f'Image: {current_image+1}/{len(dir)}',
                        (30, 30),
                        main_font['font_style'],
                        main_font['font_size'],
                        main_font['font_color'],
                        main_font['font_thickness'])

            cv2.putText(image,
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
            cv2.imshow('Check Signs', image)

            keypress = cv2.waitKeyEx(1)

            if not keypress == -1:
                if keypress == 115:  # s
                    current_image += 1
                elif keypress == 100:  # d
                    os.remove(dir[current_image])
                    dir.remove(dir[current_image])
                    stats = statistic.update_statistic(images_dir, __file__)
                elif keypress == 2424832:  # arrow left
                    current_image -= 1
                elif keypress == 2555904:  # arrow right
                    current_image += 1

            if keypress == 27:  # esc
                break

        except Exception as e:
            print(e)
            break

    cv2.destroyAllWindows()
    print('---- Finished Checking Signs ----')


def main():
    images_dir = settings.images_directory
    dirs = helpers.get_all_example_paths(images_dir, __file__)
    start_recording(dirs, images_dir)


if __name__ == '__main__':
    main()
