import helpers
import cv2


main_font = helpers.create_font_stack(cv2.FONT_HERSHEY_SIMPLEX,
                                        (0, 255, 0),
                                        .6,
                                        1)

bold_font = helpers.create_font_stack(cv2.FONT_HERSHEY_SIMPLEX,
                                      (0, 0, 255),
                                      .7,
                                      2)