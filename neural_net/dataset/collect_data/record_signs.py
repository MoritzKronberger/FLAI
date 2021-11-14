import cv2

def start_recording():
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
                
            if keypress == 27: # esc
                break
                
        except Exception as e:
            print(e)
            break
        
    capture.release()
    cv2.destroyAllWindows()

def main ():
    start_recording()

if __name__ == '__main__':
    main()
