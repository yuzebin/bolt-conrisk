#!/bin/bash

# Build and deploy production containers
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Show container logs
docker-compose -f docker-compose.prod.yml logs -f