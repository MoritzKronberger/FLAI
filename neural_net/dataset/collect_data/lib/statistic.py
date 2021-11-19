import cv2
import os
from . import helpers


def put_statistic(stats, canv, pos, font, font_size, line_spacing, font_color, font_thickness):
    for i, (stat, value) in enumerate(stats.items()):
        cv2.putText(canv,
                    f'{stat}:',
                    (int(pos[0]), int(pos[1] + line_spacing * i)),
                    font,
                    font_size,
                    font_color,
                    font_thickness)
        cv2.putText(canv,
                    str(value),
                    (int(pos[0] + line_spacing * 1.5),
                     int(pos[1] + line_spacing * i)),
                    font,
                    font_size,
                    font_color,
                    font_thickness)


def update_statistic(dataset_dir, file):
    stats = {}
    os.chdir(dataset_dir)
    label_dirs = os.listdir()
    for dir in label_dirs:
        path_to_label = os.path.join(dataset_dir, dir)
        os.chdir(path_to_label)
        label_count = len(os.listdir())
        stats[dir] = label_count
    helpers.return_to_root_dir(file)

    return stats
