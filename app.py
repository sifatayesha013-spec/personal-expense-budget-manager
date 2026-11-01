from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = "expenses.db"


def init_db():
    conn = sqlite3.connect(DATABASE)

    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            type TEXT NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL
        )
    """)


    conn.commit()
    conn.close()


@app.route("/")
def home():
    return render_template("index.html")


from flask import request, jsonify

@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    with sqlite3.connect(DATABASE) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("""
            SELECT * FROM transactions
            ORDER BY date DESC, id DESC
        """).fetchall()

    return jsonify([dict(row) for row in rows])


@app.route("/api/transactions", methods=["POST"])
def add_transaction():
    data = request.get_json(silent=True) or {}

    title = str(data.get("title", "")).strip()
    category = str(data.get("category", "")).strip()
    transaction_type = data.get("type")
    date = str(data.get("date", ""))

    try:
        amount = float(data.get("amount", 0))
    except (ValueError, TypeError):
        return jsonify({"error": "Enter a valid amount"}), 400

    if not title or not category or not date:
        return jsonify({"error": "Please fill in all fields"}), 400

    if transaction_type not in ("income", "expense"):
        return jsonify({"error": "Invalid transaction type"}), 400

    if not 0 < amount < 1_000_000_000:
        return jsonify({"error": "Enter a valid positive amount"}), 400

    try:
        with sqlite3.connect(DATABASE) as conn:
            conn.execute("""
                INSERT INTO transactions
                    (title, amount, type, category, date)
                VALUES (?, ?, ?, ?, ?)
            """, (title, amount, transaction_type, category, date))
    except sqlite3.IntegrityError:
        return jsonify({"error": "Could not save transaction"}), 400

    return jsonify({"message": "Transaction saved"}), 201


@app.route("/api/transactions/<int:transaction_id>", methods=["DELETE"])
def delete_transaction(transaction_id):
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.execute(
            "DELETE FROM transactions WHERE id = ?",
            (transaction_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({"error": "Transaction not found"}), 404

    return jsonify({"message": "Transaction deleted successfully"})

@app.route("/api/expense-categories", methods=["GET"])
def get_expense_categories():
    with sqlite3.connect(DATABASE) as conn:
        rows = conn.execute("""
            SELECT category, SUM(amount)
            FROM transactions
            WHERE type = 'expense'
            GROUP BY category
        """).fetchall()

    return jsonify([
        {"category": row[0], "total": row[1]}
        for row in rows
    ])


if __name__ == "__main__":
    init_db()
    print("Database created successfully!")
    app.run(debug=True)

