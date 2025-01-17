import firebase_admin
from firebase_admin import credentials, firestore
import json
import os

# Get the absolute path to the firebase-key.json file
current_dir = os.path.dirname(os.path.abspath(__file__))
cred = credentials.Certificate(os.path.join(current_dir, 'firebase-key.json'))
firebase_admin.initialize_app(cred)

db = firestore.client()

# Read the dashboards.json file
with open(os.path.join(current_dir, 'dashboards.json'), 'r') as f:
    dashboards_data = json.load(f)

# Upload the data to Firestore
doc_ref = db.collection('config').document('dashboards')
doc_ref.set(dashboards_data)

print("Successfully uploaded dashboards data to Firestore!")