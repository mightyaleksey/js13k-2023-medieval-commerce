#!/bin/sh

# helpers

function message() {
  echo "\033[0;37m$1\033[0m";
}

function success() {
  echo "\033[0;32m$1\033[0m";
}

function error() {
  echo "\033[0;31m$1\033[0m";
}

function copy() {
  if [ ! -f "dist/$1" ]; then
    error "dist/$1 is missing"
    exit 1
  fi

  message "copy $1"
  cp "dist/$1" "docs/$1"
}

# logic

message "build"
npm run build

if [ ! -d "dist" ]; then
  error "build failed"
  exit 1
fi

message "update contents"
rm -rf docs
mkdir docs
copy "index.html"
copy "tiles.png"
success "demo is ready"