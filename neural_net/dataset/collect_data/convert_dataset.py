import cv2
import os
import settings
import pandas
from lib import helpers


def load_dataset(dataset_path):
    dataset = pandas.read_csv(dataset_path)
    return dataset


def save_dataset(dataset, dataset_path):
    dataset.to_csv(dataset_path, index_label=False)


def main():
    print('--- Converting Dataset ---')
    images_dir = settings.images_directory
    dataset_dir = settings.dataset_directory
    dirs = helpers.get_all_example_paths(images_dir, __file__)
    dataset = load_dataset(dataset_dir)
    print(dataset)
    test = {'label': 'A', 'vectors': 'B'}
    dataset = dataset.append(test, ignore_index=True)
    print(dataset)
    save_dataset(dataset, dataset_dir)


if __name__ == '__main__':
    main()
