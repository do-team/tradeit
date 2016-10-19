#!/usr/bin/env bash
lambda-local -l index.js -e ./test_events/event_help.json -t 20
lambda-local -l index.js -e ./test_events/event_products.json -t 20
lambda-local -l index.js -e ./test_events/event_wrongcommand.json -t 20
lambda-local -l index.js -e ./test_events/event_wrongproduct.json -t 20
lambda-local -l index.js -e ./test_events/event_checkbuyprices.json -t 20
lambda-local -l index.js -e ./test_events/event_checksellprices.json -t 20
lambda-local -l index.js -e ./test_events/event_goodsellorder.json -t 20
lambda-local -l index.js -e ./test_events/event_goodbuyorder.json -t 20