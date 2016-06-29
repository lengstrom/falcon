#!/bin/bash

tr -d '[:blank:]' | awk '!x[$0]++'
