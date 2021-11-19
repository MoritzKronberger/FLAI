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
    dataset_dir = settings.dataset_directory
    dirs = helpers.get_all_example_paths(dataset_dir, __file__)
    dataset = load_dataset('../flai_data.csv')
    print(dataset)
    test = {'label': 'A', 'vectors': 'B'}
    dataset = dataset.append(test, ignore_index=True)
    print(dataset)
    save_dataset(dataset, '../flai_data.csv')


if __name__ == '__main__':
    main()
