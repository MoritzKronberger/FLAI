import cv2
import os
import numpy as np
from . import statistic


def create_font_stack(font_style, font_color, font_size, font_thickness):
    font = {'font_style': font_style,
            'font_color': font_color,
            'font_size': font_size,
            'font_thickness': font_thickness}

    return font


def put_base_ui(canv, width, height, stats):

    font = create_font_stack(cv2.FONT_HERSHEY_SIMPLEX,
                             (0, 255, 0),
                             .6,
                             1)

    create_overlay(canv, (int(width) - 100, 0),
                   (int(width), int(height)), .65, 0)

    cv2.putText(canv,
                'Press \'esc\' to quit',
                (30, int(height - 30)),
                font['font_style'],
                font['font_size'],
                font['font_color'],
                font['font_thickness'])

    statistic.put_statistic(stats,
                            canv,
                            (width - 90, 30),
                            font['font_style'],
                            font['font_size'],
                            18,
                            font['font_color'],
                            font['font_thickness'])


def return_to_root_dir(file):
    root_path = os.path.dirname(os.path.realpath(file))
    os.chdir(root_path)


def get_all_example_paths(dataset_dir, file):
    paths = []
    os.chdir(dataset_dir)
    label_paths = os.listdir()
    for dir in label_paths:
        path_to_example = os.path.join(dataset_dir, dir)
        os.chdir(path_to_example)
        examples = os.listdir()
        for example in examples:
            path = os.path.join(path_to_example, example)
            paths.append(path)
    return_to_root_dir(file)
    return paths


def get_label_from_path(path, dataset_dir):
    return path.replace(dataset_dir, '')[1]


def scale_image(image, scale):
    width = int(image.shape[1] * scale)
    height = int(image.shape[0] * scale)
    return (width, height)


# derived from https://stackoverflow.com/a/56472613/14906871
def create_overlay(canv, start_point, end_point, alpha, shade):
    canv_crop = canv[start_point[1]:end_point[1] +
                     1, start_point[0]:end_point[0]+1]
    overlay = np.full(canv_crop.shape, shade, np.uint8)

    blend = cv2.addWeighted(overlay, alpha, canv_crop, 1 - alpha, 1.0)
    canv[start_point[1]:end_point[1]+1, start_point[0]:end_point[0]+1] = blend
