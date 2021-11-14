import cv2, os, settings

def start_recording(dataset_dir, labels, image_format):
    print('---- Start Recording ----')

    font = cv2.FONT_HERSHEY_SIMPLEX
    font_color = (0, 255, 0)
    font_size = .6
    font_thickness = 1

    capture = cv2.VideoCapture(0)
    capture_width = capture.get(cv2.CAP_PROP_FRAME_WIDTH)
    capture_height = capture.get(cv2.CAP_PROP_FRAME_HEIGHT)

    reference = cv2.imread('./references/alphabet.png')
    reference_width = reference.shape[1]
    reference_height = reference.shape[0]

    while True:
        try:
            ret, frame = capture.read()
            frame  = cv2.flip(frame, 1)
            display_frame = frame.copy()

            cv2.putText(display_frame, 
                        'Press \'esc\' to quit', 
                        (30, int(capture_height - 30)), 
                        font, 
                        font_size,
                        font_color,
                        font_thickness)
            cv2.putText(reference, 
                        'No copyright - for internal use only!', 
                        (30, int(reference_height - 30)), 
                        font, 
                        font_size,
                        font_color,
                        font_thickness)
                        
            cv2.imshow('Collect FLAI dataset', display_frame)            
            cv2.imshow('DGS alphabet reference', reference)

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
    labels = list(settings.labels)
    image_format = settings.image_format
    dataset_dir = settings.dataset_directory
    prepare_dataset_directory(dataset_dir, labels)
    start_recording(dataset_dir, labels, image_format)

if __name__ == '__main__':
    main()
