#!/bin/bash
cd "$(dirname "$0")"
npx surge@0.23.1 . taam-project.surge.sh
