#!/usr/bin/env bash
set -e

echo "labels = 'abcdefghiklmnopqrstuvwxy'"> settings.py
echo "dataset_directory = r''" >> settings.py
echo "image_format = '.jpg'" >> settings.py
echo "camera = 0" >> settings.py

echo "------------> $0 has finished successfully"