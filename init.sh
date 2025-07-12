#!/bin/bash
git submodule update --init
(cd design-system && git checkout master)
(cd design-system/components && npm install)
(cd places && npm install)