from flask import Flask, request, jsonify
from flask_cors import CORS   # Import CORS

app = Flask(__name__)

# Enable CORS for all routes (React will run on a different port)
CORS(app)

# Temporary in-memory storage (replace with DB later)
orders = []

@app.route("/orders", methods=["GET"])
def get_orders():
    return jsonify(orders)

@app.route("/orders", methods=["POST"])
def add_order():
    data = request.json
    orders.append(data)
    return jsonify({"message": "Order added", "order": data}), 201

@app.route("/orders/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    global orders
    orders = [o for o in orders if o.get("id") != order_id]
    return jsonify({"message": f"Order {order_id} deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
