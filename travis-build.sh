#!/bin/sh
cd $TRAVIS_BUILD_DIR
dotnet build -c release
cd $TRAVIS_BUILD_DIR/Tests/Grafika.Test
dotnet test -c release
