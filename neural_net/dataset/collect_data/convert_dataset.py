import cv2
import settings
import random
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


def set_overwrite():
    ans = input('Do you want to overwrite your existing entries? (y/n) ')
    if ans == 'y':
        print('--- overwrite enabled ---')
        return True
    elif ans == 'n':
        print('--- overwrite disabled ---')
        return False
    else:
        print('--- Could not process input ---')
        set_overwrite()


def save_dataset(dataset, dataset_path):
    dataset.to_csv(dataset_path, index=False)


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
            # flip image horizontal 50/50
            rand = random.randint(0, 1)
            if rand == 1:
                img = cv2.flip(img, 1)
            results = hands.process(img)
            norm_landmarks = results.multi_hand_landmarks
            if norm_landmarks:
                handpose_results.append([label, norm_landmarks])

    return handpose_results


def unpack_landmarks(results):
    res = []
    for result in results:
        landmarks = []
        for landmark in result[1][0].landmark:
            vec = [landmark.x, landmark.y, landmark.z]
            landmarks.append(vec)
        res.append([result[0], landmarks])
    return res


def linearize_landmarks(results):
    for result in results:
        coordinates = np.array(result[1])
        coordinates = coordinates.flatten()
        result[1] = coordinates
    return results


def convert_to_data_frame(results, username):
    try:
        results = linearize_landmarks(unpack_landmarks(results))
        data = {'user': [], 'label': []}
        # Currently hardcoded to only converts landmarks of first hand
        coordinates = results[0][1]
        for i in range(len(coordinates)):
            data[f'coordinate {i}'] = []

        for result in results:
            data['user'].append(username)
            data['label'].append(result[0])
            for i, coordinate in enumerate(result[1]):
                data[f'coordinate {i}'].append(coordinate)

        df = pandas.DataFrame(data=data)
        return df
    except Exception as e:
        print(f'Dataset conversion failed: {e}')


def main():
    print('--- Converting Dataset ---')
    images_dir = settings.images_directory
    dataset_dir = settings.dataset_directory
    username = settings.username
    if username == '':
        print('--- Dataset conversion failed: Username not set ---')
        return
    images = helpers.get_all_example_paths(images_dir, __file__)
    dataset = load_dataset(dataset_dir)
    overwrite = set_overwrite()
    if overwrite:
        dataset = remove_own_entries(dataset, username)
    results = handpose_images(images, 1, .7, images_dir)
    df = convert_to_data_frame(results, username)
    dataset = dataset.append(df, ignore_index=True)
    save_dataset(dataset, dataset_dir)
    print('--- Successfully Saved Dataset ---')


if __name__ == '__main__':
    main()
