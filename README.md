# Spectacle

## Versions

Refer to [CHANGELOG](CHANGELOG.md)

## Development

Clone the repository code:

```
git clone git@bbpgitlab.epfl.ch:viz/veeone/spectacle.git
```

Install dependencies:

```
npm install
```

Start dev server:

```
npm run dev
```

### Run Chrome in insecure mode (dev only)

```
google-chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```

## How to

### How to restart Spectacle deployment

Log as `bbpvizuser` into one of the instances:

- bbpav04 (third floor)
- bbpav05 (fifth floor)

and restart supervisor:

```
sudo supervisorctl restart spectacle
```

### How to pull new image version to the sandbox?

Push the code to your feature branch. Then, run a pipeline with
a variable `SANDBOX=1`. After a new image has been built,
restart the respective deployment on Kubernetes:

```
kubectl rollout restart deployment veeone-spectacle-sandbox-1
```


# Funding & Acknowledgment

The development of this software was supported by funding to the Blue Brain Project, a research center of the École polytechnique fédérale de Lausanne (EPFL), from the Swiss government's ETH Board of the Swiss Federal Institutes of Technology.
