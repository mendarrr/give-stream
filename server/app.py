from flask import Flask, jsonify, request
from models import db, Inventory, Beneficiary

app = Flask(__name__)

# Configuration and initialization
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create tables if they don't exist
with app.app_context():
    db.create_all()

# Inventory CRUD operations
@app.route('/inventory', methods=['POST'])
def create_inventory():
    data = request.json
    new_item = Inventory(charity_id=data['charity_id'], item_name=data['item_name'], quantity=data['quantity'])
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Inventory item created successfully'}), 201

@app.route('/inventory', methods=['GET'])
def get_inventory():
    items = Inventory.query.all()
    return jsonify([{'id': item.id, 'charity_id': item.charity_id, 'item_name': item.item_name, 'quantity': item.quantity} for item in items]), 200

@app.route('/inventory/<int:item_id>', methods=['PUT'])
def update_inventory(item_id):
    item = Inventory.query.get(item_id)
    if not item:
        return jsonify({'error': 'Inventory item not found'}), 404
    data = request.json
    item.item_name = data.get('item_name', item.item_name)
    item.quantity = data.get('quantity', item.quantity)
    db.session.commit()
    return jsonify({'message': 'Inventory item updated successfully'}), 200

@app.route('/inventory/<int:item_id>', methods=['DELETE'])
def delete_inventory(item_id):
    item = Inventory.query.get(item_id)
    if not item:
        return jsonify({'error': 'Inventory item not found'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Inventory item deleted successfully'}), 200

# # Beneficiary CRUD operations
# @app.route('/beneficiaries', methods=['POST'])
# def create_beneficiary():
#     data = request.json
#     new_beneficiary = Beneficiary(charity_id=data['charity_id'], name=data['name'], description=data.get('description', ''))
#     db.session.add(new_beneficiary)
#     db.session.commit()
#     return jsonify({'message': 'Beneficiary created successfully'}), 201

# @app.route('/beneficiaries', methods=['GET'])
# def get_beneficiaries():
#     beneficiaries = Beneficiary.query.all()
#     return jsonify([{'id': b.id, 'charity_id': b.charity_id, 'name': b.name, 'description': b.description} for b in beneficiaries]), 200

# @app.route('/beneficiaries/<int:beneficiary_id>', methods=['PUT'])
# def update_beneficiary(beneficiary_id):
#     beneficiary = Beneficiary.query.get(beneficiary_id)
#     if not beneficiary:
#         return jsonify({'error': 'Beneficiary not found'}), 404
#     data = request.json
#     beneficiary.name = data.get('name', beneficiary.name)
#     beneficiary.description = data.get('description', beneficiary.description)
#     db.session.commit()
#     return jsonify({'message': 'Beneficiary updated successfully'}), 200

# @app.route('/beneficiaries/<int:beneficiary_id>', methods=['DELETE'])
# def delete_beneficiary(beneficiary_id):
#     beneficiary = Beneficiary.query.get(beneficiary_id)
#     if not beneficiary:
#         return jsonify({'error': 'Beneficiary not found'}), 404
#     db.session.delete(beneficiary)
#     db.session.commit()
#     return jsonify({'message': 'Beneficiary deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
