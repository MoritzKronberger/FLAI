# Keras Neural Network

A neural network, detecting DGS-signs represented by hand pose vectors is designed and evaluated using Keras in Jupyter Notebooks. The model is afterwards converted to the TF.js Layer format for use in the browser.

To run the Jupyter Notebooks make sure [Anaconda](https://docs.anaconda.com/anaconda/navigator/index.html) is installed on your system.

To install all the required packages in your Conda environment run

```bash
pip install -r requirements.txt
```

in the **./neural_net/flai_net** directory in your selected Conda environment.

The noteboks can be run either by using Anaconda's Jupyter Notebooks directly or in VsCode by selecting your Conda evironment in the notebook.

## Model Training

The model is trained in the [train_neural_net notebook](./train_neural_net.ipynb). The dataset is imported and converted in the same notebook.

## Model Evaluation

The model is evaluated in the [evaluate_neural_net notebook](./evaluate_neural_net.ipynb).

After the evaluation it is converted to the TF.js Layer format and saved in the **deep_flai_tfjs** directory.
