#!/usr/bin/env bash
set -e

echo "camera = 0" > settings.py
echo "model_name = 'Deep_FLAI_6'" >> settings.py
echo "labels = 'abcdefghiklmnopqrstuvwxy'" >> settings.py

echo "------------> $0 has finished successfully"