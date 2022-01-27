# Keras Neural Network

## About

A neural network, detecting DGS-signs represented by hand pose vectors is designed and evaluated using Keras in Jupyter Notebooks. The model is afterwards converted to the TF.js Layer format for use in the browser.

## Getting Started

To run the Jupyter Notebooks make sure [Anaconda](https://docs.anaconda.com/anaconda/navigator/index.html) is installed on your system.

To create a Conda Environment with all the packages required to run this project run

```bash
conda create --name <your_env_name> --file requirements.txt
```

in the `./neural_net/flai_net` directory.

The noteboks can be run either by using Anaconda's Jupyter Notebooks directly or in VsCode by selecting the newly created Conda evironment in Anaconda or the notebook in VsCode.

## Model Training

The model is trained in the [train_neural_net notebook](./train_neural_net.ipynb). The dataset is imported and converted in the same notebook.

## Model Evaluation

The model is evaluated in the [evaluate_neural_net notebook](./evaluate_neural_net.ipynb).

After the evaluation it is converted to the TF.js Layer format and saved in the `deep_flai_tfjs` directory.
