# Installation

## Javascript
All contents of /Client/node_modules are in the .gitignore.
We use [Yarn](https://yarnpkg.com/) for managing JavaScript and CSS packages.

If you don't have Yarn installed, please first install [npm](https://www.npmjs.com/get-npm) and then install Yarn using `npm install -g yarn`.

To setup the local packages, cd into the Client folder and run:

```
yarn install
```

## Python

### Requirements

```
pip install -r requirements.txt 
```

### CEFPython

We're currently using a pre-release of cefpython. This is because we need to use relatively features only available in recent versions of the Chrome/Chromium browser framework (Version >63, notably because of dynamically loading js modules). To acquire the correct version of cefpython, it is currently necessary to build cefpython yourself. I'd suggest googling 'cefpython build' where you will find the full instructions. But the following may also work for you:

```
git clone https://github.com/cztomczak/cefpython --depth 1
pip install --upgrade -r ../tools/requirements.txt

# OSX
wget https://github.com/cztomczak/cefpython/releases/download/v66-upstream/cef66_3.3359.1774.gd49d25f_mac64.zip

# Win x64
wget https://github.com/cztomczak/cefpython/releases/download/v66-upstream/cef66_3.3359.1774.gd49d25f_win64.zip

# Linux x64
wget https://github.com/cztomczak/cefpython/releases/download/v66-upstream/cef66_3.3359.1774.gd49d25f_linux64.zip

tar -xvzf ./cef66_3.3359.1774.gd49d25f_mac64.zip

python ../tools/build.py 66.3
```