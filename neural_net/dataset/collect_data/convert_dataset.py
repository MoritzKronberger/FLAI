import cv2
import os
import settings
import pandas
import numpy as np
import mediapipe as mp
from lib import helpers


def load_dataset(dataset_path):
    try:
        dataset = pandas.read_csv(dataset_path)
    except Exception as e:
        print(e)
        dataset = pandas.DataFrame()
    return dataset


def remove_own_entries(df, username):
    try:
        df = df.drop(df[df.user == username].index)
    except Exception as e:
        print(e)
    return df


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
            img = cv2.imread(image)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            results = hands.process(img)
            norm_landmarks = results.multi_hand_landmarks
            if norm_landmarks:
                handpose_results.append([label, norm_landmarks])

    return handpose_results


def convert_to_data_frame(results, username):
    data = {'user':[], 'label': []}
    # Curretly hardcoded to only converts landmarks of first hand
    landmarks = results[0][1][0]
    for i in range(len(landmarks.landmark)):
        data['landmark ' + str(i)] = []

    for result in results:
        data['user'].append(username)
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
    username = settings.username
    images = helpers.get_all_example_paths(images_dir, __file__)
    dataset = load_dataset(dataset_dir)
    dataset = remove_own_entries(dataset, username)
    results = handpose_images(images, 1, 0, images_dir)
    df = convert_to_data_frame(results, username)
    dataset = dataset.append(df, ignore_index=True)
    save_dataset(dataset, dataset_dir)


if __name__ == '__main__':
    main()
