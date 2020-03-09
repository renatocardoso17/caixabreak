#!/usr/bin/env bash
set -e

WIREMOCKPORT=8080

ps aux | grep -v grep | grep wiremock-standalone.*${WIREMOCKPORT} | awk '{print $2}' | xargs kill -9

