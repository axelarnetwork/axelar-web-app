# develop stage
FROM node:lts-stretch as build-stage
ARG npm_token
ARG react_app_login_password
ARG react_app_stage
ENV NPM_TOKEN=${npm_token}
ENV REACT_APP_LOGIN_PASSWORD=${react_app_login_password}
ENV REACT_APP_STAGE=${react_app_stage}
ENV NPM_TOKEN=${npm_token}
ENV REACT_APP_FIGMENT_API_KEY="0d5baf790b77a7e1b10e1964a81c4bf6"
ENV REACT_APP_UNDER_MAINTENANCE="false"
ENV REACT_APP_STAGE="testnet"
ENV REACT_APP_TERRA_RPC="https://cors-redirect.testnet.axelar.dev/https://bombay-12--rpc--full.datahub.figment.io"
ENV REACT_APP_TERRA_LCD="https://cors-redirect.testnet.axelar.dev/https://bombay-12--lcd--full.datahub.figment.io"
ENV REACT_APP_AXELAR_RPC="https://cors-redirect.testnet.axelar.dev/http://k8s-testnet-axelarco-b064f7f11c-262b46f96d341e0b.elb.us-east-2.amazonaws.com:26657"
ENV REACT_APP_AXELAR_LCD="https://cors-redirect.testnet.axelar.dev/http://k8s-testnet-axelarco-b064f7f11c-262b46f96d341e0b.elb.us-east-2.amazonaws.com:1317"
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm install
COPY . .
RUN rm -rf build
RUN npm run build

# production stage
FROM openresty/openresty:latest as production-stage
ENV REACT_APP_LOGIN_PASSWORD=${react_app_login_password}
ENV REACT_APP_STAGE=${react_app_stage}
ENV NPM_TOKEN=${npm_token}
ENV REACT_APP_FIGMENT_API_KEY="0d5baf790b77a7e1b10e1964a81c4bf6"
ENV REACT_APP_UNDER_MAINTENANCE="false"
ENV REACT_APP_STAGE="testnet"
ENV REACT_APP_TERRA_RPC="https://cors-redirect.testnet.axelar.dev/https://bombay-12--rpc--full.datahub.figment.io"
ENV REACT_APP_TERRA_LCD="https://cors-redirect.testnet.axelar.dev/https://bombay-12--lcd--full.datahub.figment.io"
ENV REACT_APP_AXELAR_RPC="https://cors-redirect.testnet.axelar.dev/http://k8s-testnet-axelarco-b064f7f11c-262b46f96d341e0b.elb.us-east-2.amazonaws.com:26657"
ENV REACT_APP_AXELAR_LCD="https://cors-redirect.testnet.axelar.dev/http://k8s-testnet-axelarco-b064f7f11c-262b46f96d341e0b.elb.us-east-2.amazonaws.com:1317"
COPY --from=build-stage /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/usr/bin/openresty", "-g", "daemon off;"]
