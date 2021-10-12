
## Commands
dev:tsc starts the compiler in watch mode, meaning it watches for any changes and automatically rebuilds.

dev:serve uses nodemon to automatically reload the server when the Javascript changes.

dev uses npm-run-all to run both commands at the same time, so you don't have to have two terminals open.

Can test by:

download Firecamp extension and connect to port 4000

Own notes

Docker build:
docker build --build-arg NPM_TOKEN=${NPM_TOKEN} -t axelar-bridge-rest-server .
docker run --network axelarate_default --env NPM_TOKEN=${NPM_TOKEN} -dp 4000:4000 axelar-bridge-rest-server

