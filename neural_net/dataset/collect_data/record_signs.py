import cv2, os

def start_recording(dataset_dir, labels, image_format):
    print('---- Start Recording ----')

    capture = cv2.VideoCapture(0)
    width = capture.get(cv2.CAP_PROP_FRAME_WIDTH)
    height = capture.get(cv2.CAP_PROP_FRAME_HEIGHT)
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_color = (0, 255, 0)
    font_size = .6
    font_thickness = 1

    while True:
        try:
            ret, frame = capture.read()
            frame  = cv2.flip(frame, 1)
            display_frame = frame.copy()

            cv2.putText(display_frame, 
                        'Press \'esc\' to quit', 
                        (30, int(height - 30)), 
                        font, 
                        font_size,
                        font_color,
                        font_thickness)
                        
            cv2.imshow('Collect FLAI dataset', display_frame)

            keypress = cv2.waitKey(1)

            if not keypress == -1:
                key = chr(keypress)
                if key in labels:
                    path = os.path.join(dataset_dir, key)
                    os.chdir(path)
                    example_count = len(os.listdir()) + 1
                    filename = key + '_' + str(example_count) + image_format
                    cv2.imwrite(filename, frame)
                
            if keypress == 27: # esc
                break
                
        except Exception as e:
            print(e)
            break
        
    capture.release()
    cv2.destroyAllWindows()

def prepare_dataset_directory(dataset_dir, labels):
    for dir in labels:
        path = os.path.join(dataset_dir, dir)
        try:
            os.mkdir(path)
        except OSError as e:
            print(e)

def main ():
    labels = list('abcdefghiklmnopqrstuvwxy')
    image_format = '.jpg'
    dataset_dir = r'C:\Users\Moritz\Documents\Hochschule Augsburg\Semester 5\Teamprojekt WebApp\FLAI_dataset'
    prepare_dataset_directory(dataset_dir, labels)
    start_recording(dataset_dir, labels, image_format)

if __name__ == '__main__':
    main()
