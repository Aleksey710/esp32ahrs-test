#!/bin/bash

# начальная настройка 
#npm install

# dev режим:
npm run dev -- generate \
    -i ../asyncapi.yaml \
    -o ../generated

# production:
#npm run build
#node dist/cli.js generate \
#    -i ../asyncapi.yaml \
#    -o ../generated

# как глобальный CLI:
#npm link
#asyncapi-codegen generate \
#    -i ../asyncapi.yaml \
#    -o ../generated
