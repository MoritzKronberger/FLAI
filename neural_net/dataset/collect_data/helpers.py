import cv2
import os
import statistic


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

    cv2.putText(canv,
                'Press \'esc\' to quit',
                (30, int(height - 30)),
                font['font_style'],
                font['font_size'],
                font['font_color'],
                font['font_thickness'])

    statistic.put_statistic(stats,
                            canv,
                            (width - 100, 30),
                            font['font_style'],
                            font['font_size'],
                            18,
                            font['font_color'],
                            font['font_thickness'])


def return_to_root_dir():
    root_path = os.path.dirname(os.path.realpath(__file__))
    os.chdir(root_path)
