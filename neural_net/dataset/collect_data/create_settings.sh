#!/usr/bin/env bash
set -e

echo "labels = 'abcdefghiklmnopqrstuvwxy'"> settings.py
echo "dataset_directory = ''" >> settings.py
echo "image_format = '.jpg'" >> settings.py
echo "camera = 1" >> settings.py

echo "------------> $0 has finished successfully"