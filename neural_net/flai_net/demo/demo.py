import cv2
import settings
import mediapipe as mp
import numpy as np
from numpy import core
from tensorflow.keras.models import load_model

mp_hands = mp.solutions.hands
camera = settings.camera
model_name = settings.model_name
labels = settings.labels

# Mediapipe Setup from https://google.github.io/mediapipe/solutions/hands.html


def process_mediapipe(frame, hands):
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(image)
    return results.multi_hand_landmarks


def image_capture(model, hands):
    cap = cv2.VideoCapture(camera)
    while True:
        ret, frame = cap.read()
        landmarks = process_mediapipe(frame, hands)
        output = 'no hand detected'
        if landmarks:
            landmarks = unpack_landmarks(landmarks)
            coordinates = linearize_landmarks(landmarks)
            prediction, confidence = process_flainet(coordinates, model)
            output = f'{prediction}: {confidence}'

        # Flip the image horizontally for a selfie-view display.
        image = frame.copy()
        image = cv2.flip(image, 1)
        cv2.putText(image,
                    output,
                    (30, 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    .6,
                    (0, 255, 0),
                    1)

        cv2.imshow('Flainet Demo', image)

        if cv2.waitKey(5) & 0xFF == 27:
            break
    cap.release()


def unpack_landmarks(landmarks):
    lm = []
    for landmark in landmarks[0].landmark:
        vec = [landmark.x, landmark.y, landmark.z]
        lm.append(vec)
    return lm


def linearize_landmarks(landmarks):
    coordinates = np.array(landmarks)
    coordinates = coordinates.flatten()
    return coordinates


def process_flainet(coordinates, model):
    examples = np.array([coordinates])
    predictions = model.predict(examples)
    prediction_classes = np.argmax(predictions, axis=-1)
    confidence = np.amax(predictions, axis=-1)
    return labels[prediction_classes[0]], confidence[0]


def main():
    hands = mp_hands.Hands(
        model_complexity=0,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5)
    model = load_model(f'../{model_name}.h5')
    image_capture(model, hands)


if __name__ == '__main__':
    main()
