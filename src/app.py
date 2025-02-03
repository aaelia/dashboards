from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
import os

app = Flask(__name__)

CONFIG_FILE = os.path.join(os.path.dirname(__file__), 'config', 'dashboards.json')

def load_config():
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)

def save_config(config):
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)

@app.route('/')
def index():
    config = load_config()
    return render_template('index.html', panels=config['panels'])

@app.route('/admin')
def admin():
    config = load_config()
    return render_template('admin.html', panels=config['panels'])

@app.route('/admin/update', methods=['POST'])
def admin_update():
    config = load_config()
    
    new_panel = {
        'id': request.form['id'],
        'title': request.form['title'],
        'menuText': request.form['menuText'],
        'icon': request.form['icon'],
        'query': request.form['query'],
        'timeRange': int(request.form['timeRange']),
        'unit': request.form['unit']
    }
    
    # Add valueMultiplier only if provided
    if request.form.get('valueMultiplier'):
        new_panel['valueMultiplier'] = float(request.form['valueMultiplier'])
    
    # Check if panel with same ID exists
    panel_index = None
    for i, panel in enumerate(config['panels']):
        if panel['id'] == new_panel['id']:
            panel_index = i
            break
    
    if panel_index is not None:
        config['panels'][panel_index] = new_panel
    else:
        config['panels'].append(new_panel)
    
    save_config(config)
    return redirect(url_for('admin'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=50985, debug=True)