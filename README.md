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

Push the code to your feature branch with a tag being either of `sandbox-1`, `sandbox-2` or `sandbox-3`.
Once you push it to the `origin`, it will trigger a pipeline. After the image has been built
you can restart the deployment for the respective sandbox:

```
kubectl rollout restart deployment veeone-spectacle-sandbox-1
```
