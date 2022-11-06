## SHBOOKS (WIP)
[![AuthCI](https://github.com/sitatec/SH-Books/actions/workflows/auth-ci.yml/badge.svg)](https://github.com/sitatec/SH-Books/actions/workflows/auth-ci.yml)
[![CatalogCI](https://github.com/sitatec/SH-Books/actions/workflows/catalog-ci.yaml/badge.svg)](https://github.com/sitatec/SH-Books/actions/workflows/catalog-ci.yml)
[![OrderCI](https://github.com/sitatec/SH-Books/actions/workflows/order-ci.yaml/badge.svg)](https://github.com/sitatec/SH-Books/actions/workflows/order-ci.yml)
[![PaymentCI](https://github.com/sitatec/SH-Books/actions/workflows/payment-ci.yaml/badge.svg)](https://github.com/sitatec/SH-Books/actions/workflows/payment-ci.yml) 

A second hand books store

## How to run

### Requirements
- Docker
- Kubernetes
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/)
- [Skaffold](https://skaffold.dev/docs/install/#standalone-binary) (optional if you want to build all images push them and apply kubernetes config files  manually)

### Start services
- Update docker image name from `beretedocker/shbooks/xxx` to `[your-docker-id]/shbooks/xxx`.
- Map the `shbooks.com` domain to `localhost` in your host file or update the `infra/k8s/ingress.yaml` to your preferences.
- Run `skaffold dev` in the projects root directory

## Architecture

![SHBOOKS architecture diagram](https://raw.githubusercontent.com/sitatec/SH-Books/master/docs/diagrams/system-architecture-v2.png)
