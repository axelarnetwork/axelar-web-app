
## Commands
dev:tsc starts the compiler in watch mode, meaning it watches for any changes and automatically rebuilds.

dev:serve uses nodemon to automatically reload the server when the Javascript changes.

dev uses npm-run-all to run both commands at the same time, so you don't have to have two terminals open.

Can test by:

download Firecamp extension and connect to port 4000

## k8s Deployment notes

Docker build:
docker build --build-arg NPM_TOKEN=${NPM_TOKEN} -t axelarnet/axelar-bridge-rest-server:latest . --platform linux/amd64
docker run --network axelarate_default --env NPM_TOKEN=${NPM_TOKEN} -dp 4000:4000 axelar-bridge-rest-server

docker build --build-arg NPM_TOKEN=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 -t axelarnet/axelar-bridge-rest-server:latest . --platform linux/amd64
docker run --network axelarate_default --env NPM_TOKEN=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 -dp 4000:4000 axelarnet/axelar-bridge-rest-server:latest

Other deployment notes:

docker image tag axelarnet/axelar-bridge-rest-server:latest axelarnet/axelar-bridge-rest-server:latest
docker push axelarnet/axelar-bridge-rest-server:latest

docker image tag axelarnet/axelar-bridge-rest-server:latest registry.heroku.com/axelarnet/axelar-bridge-rest-server:latest

#make sure context is what you want
kubectl config current-context  

kubectl apply -f k8s/devnet/rest-server-deployment.yaml
kubectl apply -f k8s/devnet/rest-server-svc.yaml
kubectl create namespace rest-server-devnet 

#get pods
kubectl get pods -n rest-server-devnet

#get host for pod:
kubectl describe pod -n rest-server-devnet axelar-bridge-rest-server-56595bcd59-wp22h

#look at logs
kubectl logs -f -n rest-server-devnet axelar-bridge-rest-server-56595bcd59-wp22h

#delete pod (ahead of new deployment)
kubectl delete pod -n rest-server-devnet axelar-bridge-rest-server-56595bcd59-wp22h

#get services and see what the external IP of the deployment is
kubectl get svc -n rest-server-devnet  

## Heroku deployment notes

# to create heroku instance
heroku create

# to track newly-created-app
heroku git:remote -a $(app name from previous step)

# to set environment variables
heroku config:set ENV_VAR=$(ENV_VAR)

# to deploy: node server only, i.e. only rest-server directory
git subtree push --prefix axelarjs-rest-server heroku main  

# to open app
heroku open