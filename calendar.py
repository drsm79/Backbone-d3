#!/usr/bin/env python
# encoding: utf-8
import csv
import json
from collections import defaultdict

faa = open('AviationData.csv')
reader = csv.DictReader(faa, delimiter='|')
to_json =  defaultdict(int)

for event in reader:
    d = reversed(event['Event Date'].split('/'))
    evt_date = '-'.join([d[0], d[2], d[1]])
    to_json[evt_date] += 1

def docify(tpl):
    return {'date': tpl[0], 'count':tpl[1]}

json.dump(map(docify, to_json.items()), open('calendar.json', 'w'))

# f = open('calendar.json')
# l = json.load(f)
# f.close()
# sl = []
#
# for i in l:
#   d = i['date'].split('-')
#   i['date'] = '-'.join([d[0], d[2], d[1]])
#   if d[0] in ['2004', '2005', '2006']:
#     sl.append(i)
#
# f = open('calendar_full.json', 'w')
# json.dump(l, f)
# f.close()
# f = open('calendar.json', 'w')
# json.dump(sl, f)
# f.close()
