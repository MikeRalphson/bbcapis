#!/bin/bash
node fetchApis $1

node parseNitroApi

node parseIblApi
cd iblApi
if [ -e openapi.err ]; then
  patch < openapi.patch
  mv openapi.err openapi.yaml
fi
