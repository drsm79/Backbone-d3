#!/usr/bin/env python
# encoding: utf-8
import csv
import json
from collections import defaultdict

faa = open('/Users/metson/Downloads/AviationData.txt')
reader = csv.DictReader(faa, delimiter='|')
to_json =  defaultdict(int)

for event in reader:
    evt_date = '-'.join(reversed(event['Event Date'].split('/')))
    to_json[evt_date] += 1

def docify(tpl):
    return {'date': tpl[0], 'count':tpl[1]}

json.dump(map(docify, to_json.items()), open('calendar.json', 'w'))