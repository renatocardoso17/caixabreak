#!/usr/bin/env bash

printf "Shutting down previous Wiremock...\n"
sh ./tools/wiremock/scripts/wiremock-stop.sh
printf "Ok. Now do your stuff\n"

function finish {
	printf "Shutting down Wiremock on port ${WIREMOCKPORT}...\n"
    sh ./tools/wiremock/scripts/wiremock-stop.sh
    exit 0
    printf "Wiremock shutted down!\n"
}

trap finish EXIT

WIREMOCKPORT=8080
printf "Starting Wiremock on port ${WIREMOCKPORT}...\n"
java -jar ./tools/wiremock/bin/wiremock-standalone-2.21.0.jar --port=${WIREMOCKPORT} --root-dir=./tools/wiremock/mocks --no-request-journal=true
