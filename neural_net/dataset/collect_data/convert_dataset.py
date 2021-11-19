import cv2
import os
import settings
import pandas
import numpy as np
import mediapipe as mp
from lib import helpers


def load_dataset(dataset_path):
    dataset = pandas.read_csv(dataset_path)
    return dataset


def save_dataset(dataset, dataset_path):
    dataset.to_csv(dataset_path, index_label=False)


def handpose_images(images, num_hands, min_confidence, images_dir):
    mp_hands = mp.solutions.hands
    handpose_results = []
    with mp_hands.Hands(static_image_mode=True,
                        max_num_hands=num_hands,
                        min_detection_confidence=min_confidence) as hands:
        for image in images:
            label = helpers.get_label_from_path(image, images_dir)
            image = cv2.imread(images[0])
            results = hands.process(image)
            handpose_results.append([label, results.multi_hand_landmarks])

    return handpose_results


def convert_to_data_frame(results):
    data = {'label': []}
    # Curretly hardcoded to only converts landmarks of first hand
    landmarks = results[0][1][0]
    for i in range(len(landmarks.landmark)):
        data['landmark ' + str(i)] = []

    for result in results:
        data['label'].append(result[0])
        for i, landmark in enumerate(result[1][0].landmark):
            vec = np.array([landmark.x, landmark.y, landmark.z])
            data['landmark ' + str(i)].append(vec)

    df = pandas.DataFrame(data=data)
    return df


def main():
    print('--- Converting Dataset ---')
    images_dir = settings.images_directory
    dataset_dir = settings.dataset_directory
    images = helpers.get_all_example_paths(images_dir, __file__)
    dataset = load_dataset(dataset_dir)
    results = handpose_images(images, 1, .7, images_dir)
    df = convert_to_data_frame(results[:1])
    dataset = dataset.append(df, ignore_index=True)
    save_dataset(dataset, dataset_dir)


if __name__ == '__main__':
    main()
