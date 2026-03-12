from flask import Flask, request, jsonify
from flask_cors import CORS

from db import get_connection   # import your helper
import uuid 

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/orders", methods=["GET"])
def get_orders():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM orders")
    result = cursor.fetchall()
    conn.close()
    return jsonify(result)

@app.route("/orders", methods=["POST"])
def add_order():
    data = request.get_json()
    print("Data received:", data)

    conn = get_connection()
    cursor = conn.cursor()

    sql = """
        INSERT INTO orders (id, user, service, link, qty, charges, status, date)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    new_id = int(uuid.uuid4().int % 1000000)  # generate unique ID

    values = (
        new_id,
        data["user"],
        data["service"],
        data["link"],
        data["qty"],
        data["charges"],
        data["status"],
        data["date"],
    )

    cursor.execute(sql, values)
    conn.commit()
    conn.close()

    # Return the inserted order with the new id
    return jsonify({"message": "Order added", "order": {**data, "id": new_id}}), 201

@app.route("/orders/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    conn = get_connection()
    cursor = conn.cursor()
    sql = "DELETE FROM orders WHERE id = %s"
    cursor.execute(sql, (order_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": f"Order {order_id} deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
