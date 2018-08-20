import csv
import json

from uuid import uuid4

result = {}
with open('part.csv', 'rt') as csvfile:
    reader = csv.reader(csvfile)
    result = {}
    for row in reader:
        email = row[1].strip()
        name = row[2].strip()
        event = row[4].strip()
        result[str(uuid4())] = {
            'email': email,
            'name': name,
            'event': event
        }

with open('result.json', 'w') as f:
    f.write(json.dumps(result))
