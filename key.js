curl -H "Content-Type: application/json" -X POST --data '{ "client_id": "B26CDE9A12BE49F6A4263CCE43C7030C","client_secret": "12430cba2c97450ba3218cc841b8a0a20f0e104ccc6b59b91b27625c89a0fbe6" }'  https://xray.cloud.getxray.app/api/v2/authenticate


curl -v -H "Content-Type: text/xml" -X POST -H "Authorization: Bearer <token>"  --data @"test-results.xml" https://xray.cloud.getxray.app/api/v2/import/execution/junit?projectKey=SCRUM
