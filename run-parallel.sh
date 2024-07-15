#!/bin/bash
#for package.json: "cy:parallel:cloud:bash": "bash -c 'guid=$(uuidgen); eval \"npx concurrently \\\"npm run cy:auth:chrome:monitor -- --group auth-chrome-monitor --ci-build-id=$guid --record --key=0d95f9f5-66c6-4fa9-b19d-61a5107e8adc\\\" \\\"npm run cy:basic:electron:laptop -- --group basic-electron-laptop --ci-build-id=$guid --record --key=0d95f9f5-66c6-4fa9-b19d-61a5107e8adc\\\"\"'"
guid=$(uuidgen)
npx concurrently "npm run cy:auth:chrome:monitor -- --group auth-chrome-monitor --ci-build-id=$guid --record --key=0d95f9f5-66c6-4fa9-b19d-61a5107e8adc" "npm run cy:basic:electron:laptop -- --group basic-electron-laptop --ci-build-id=$guid --record --key=0d95f9f5-66c6-4fa9-b19d-61a5107e8adc"
