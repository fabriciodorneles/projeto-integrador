#!/bin/sh
# Gera o arquivo compactado para entrega (páginas + Bootstrap local + wireframes)
cd "$(dirname "$0")"
rm -f sistema-academico-nexus.zip
zip -rq sistema-academico-nexus.zip \
  index.html notas.html README.md css js img assets \
  wireframe/wireframe-login.png wireframe/wireframe-notas.png
echo "Gerado: sistema-academico-nexus.zip"
