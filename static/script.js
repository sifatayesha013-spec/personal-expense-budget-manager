
const form = document.getElementById("expense-form");
const message = document.getElementById("message");
const dateInput = document.getElementById("date");

// Set today's date automatically
dateInput.value = new Date().toLocaleDateString("en-CA");

// Format amounts in Indian rupees
function formatMoney(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(amount);
}

// Load transactions from the Python backend
async function loadTransactions() {
    const response = await fetch("/api/transactions");
    const transactions = await response.json();

    if (!response.ok) {
        throw new Error("Could not load transactions");
    }

    let income = 0;
    let expenses = 0;

    const list = document.getElementById("transaction-list");
    list.replaceChildren();

    transactions.forEach(function (item) {
        const amount = Number(item.amount);

        if (item.type === "income") {
            income += amount;
        } else {
            expenses += amount;
        }

        // Create the transaction row safely
        const row = document.createElement("div");
        row.className = "transaction";

        const details = document.createElement("span");
        details.textContent =
            `${item.title} · ${item.category} · ${item.date}`;

        const value = document.createElement("strong");
        value.textContent =
            `${item.type === "income" ? "+" : "-"}${formatMoney(amount)}`;

        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.style.width = "auto";
        deleteButton.style.padding = "8px 12px";
        deleteButton.style.background = "#dc3545";

        deleteButton.addEventListener("click", async function () {
            const confirmed = confirm(
                `Delete "${item.title}"?`
            );

            if (!confirmed) return;

            try {
                const response = await fetch(
                    `/api/transactions/${item.id}`,
                    { method: "DELETE" }
                );

                const result = await response.json();

                if (!response.ok) {
                    alert(result.error || "Could not delete transaction.");
                    return;
                }

                await loadTransactions();
            } catch (error) {
                alert("Could not connect to the server.");
                console.error(error);
            }
        });

        row.append(details, value, deleteButton);
        list.appendChild(row);

    });

    document.getElementById("income").textContent =
        formatMoney(income);

    document.getElementById("expenses").textContent =
        formatMoney(expenses);

    document.getElementById("balance").textContent =
        formatMoney(income - expenses);
}

// Save a new transaction
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    message.textContent = "Saving transaction...";

    const data = {
        title: document.getElementById("title").value.trim(),
        amount: document.getElementById("amount").value,
        type: document.getElementById("type").value,
        category: document.getElementById("category").value,
        date: dateInput.value
    };

    try {
        const response = await fetch("/api/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            message.textContent = result.error || "Could not save transaction.";
            return;
        }

        form.reset();
        dateInput.value = new Date().toLocaleDateString("en-CA");

        await loadTransactions();
        message.textContent = "Transaction saved successfully!";
    } catch (error) {
        message.textContent =
            "Could not connect to the server. Check that Flask is running.";
        console.error(error);
    }
});

// Display saved transactions when the page opens
loadTransactions().catch(function (error) {
    message.textContent =
        "Could not load transactions. Check the Flask server.";
    console.error(error);
});


async function loadExpenseCategories() {
    const response = await fetch("/api/expense-categories");
    const categories = await response.json();

    const container = document.getElementById("category-breakdown");

    if (categories.length === 0) {
        container.innerHTML = "<p>No expense data available yet.</p>";
        return;
    }

    container.innerHTML = "";

    categories.forEach(item => {
        const row = document.createElement("p");
        row.textContent = `${item.category}: ₹${Number(item.total).toFixed(2)}`;
        container.appendChild(row);
    });
}
