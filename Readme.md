![Screenshot](https://github.com/elliotwoods/Rulr-2.0/raw/master/readme/streaming_arkit.png)

Screenshot of streaming ARKit data into Rulr.

# Installation

Warning : we use a more recent version of cefpython3 than is generally available, because we want advanced JS features.

## Python

```
conda create -n rulr2 python=3.7.7
conda activate rulr2
pip install -r requirements.txt 
```


## Javascript

All contents of /Client/node_modules are in the .gitignore.
We use [Yarn](https://yarnpkg.com/) for managing JavaScript and CSS packages.

If you don't have Yarn installed, please first install [npm](https://www.npmjs.com/get-npm) and then install Yarn using `npm install -g yarn`.

To setup the local packages, cd into the Client folder and run:

```
cd rulr-web
yarn install
```
