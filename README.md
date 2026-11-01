# Personal Expense & Budget Manager

A web-based application designed to help users track their income, manage expenses, and monitor their remaining balance.

## Project Overview

The Personal Expense & Budget Manager is an ongoing web development project that provides a simple dashboard for managing personal finances. It allows users to record transactions and view their financial summary.

## Features

- Add income and expense transactions
- Categorize transactions
- Calculate total income and expenses
- Automatically calculate remaining balance
- View recent transactions
- Delete transactions
- Store transaction data using SQLite
- Category-wise expense breakdown (under development)

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python, Flask
- **Database:** SQLite

## Project Structure

```text
personal-expense-budget-manager/
├── static/
│   ├── script.js
│   └── style.css
├── templates/
│   └── index.html
├── app.py
└── .gitignore
```

## How to Run Locally

1. Clone the repository:

   `git clone https://github.com/sifatayesha013-spec/personal-expense-budget-manager.git`

2. Navigate to the project folder:

   `cd personal-expense-budget-manager`

3. Create a virtual environment:

   `python -m venv venv`

4. Activate the environment on Windows:

   `venv\Scripts\activate`

5. Install Flask:

   `pip install Flask`

6. Run the application:

   `python app.py`

7. Open your browser and visit:

   `http://127.0.0.1:5000`

## Project Status

**Ongoing Development**

More features and improvements are being added as the project progresses.
