from flask import Flask, jsonify
import mysql.connector
import pandas as pd
from sklearn.linear_model import LinearRegression

app = Flask(__name__)


# ==========================================
# MYSQL CONNECTION
# ==========================================

def get_database_connection():

    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="YOUR_MYSQL_PASSWORD",
        database="hospital_queue"
    )


# ==========================================
# CREATE SAMPLE ML MODEL
# ==========================================

def train_model():

    training_data = {

        "patients_waiting": [
            1, 2, 3, 4, 5,
            6, 7, 8, 9, 10
        ],

        "doctors_available": [
            1, 1, 1, 1, 1,
            1, 1, 1, 1, 1
        ],

        "average_service_time": [
            10, 10, 10, 10, 10,
            10, 10, 10, 10, 10
        ],

        "waiting_time": [
            10, 20, 30, 40, 50,
            60, 70, 80, 90, 100
        ]
    }

    df = pd.DataFrame(training_data)

    X = df[
        [
            "patients_waiting",
            "doctors_available",
            "average_service_time"
        ]
    ]

    y = df["waiting_time"]

    model = LinearRegression()

    model.fit(X, y)

    return model


model = train_model()


# ==========================================
# AI PREDICTION API
# ==========================================

@app.route("/predict", methods=["GET"])
def predict_waiting_time():

    connection = None
    cursor = None

    try:

        connection = get_database_connection()

        cursor = connection.cursor(dictionary=True)


        # ----------------------------------
        # COUNT WAITING PATIENTS
        # ----------------------------------

        cursor.execute("""
            SELECT COUNT(*) AS patients_waiting
            FROM queues
            WHERE status = 'Waiting'
        """)

        waiting_result = cursor.fetchone()

        patients_waiting = waiting_result["patients_waiting"]


        # ----------------------------------
        # COUNT DOCTORS
        # ----------------------------------

        cursor.execute("""
            SELECT COUNT(*) AS doctors_available
            FROM doctors
        """)

        doctor_result = cursor.fetchone()

        doctors_available = doctor_result["doctors_available"]


        # ----------------------------------
        # CALCULATE AVERAGE SERVICE TIME
        # ----------------------------------

        cursor.execute("""
            SELECT AVG(
                TIMESTAMPDIFF(
                    MINUTE,
                    start_time,
                    end_time
                )
            ) AS average_service_time

            FROM queues

            WHERE
                status = 'Served'
                AND start_time IS NOT NULL
                AND end_time IS NOT NULL
        """)

        service_result = cursor.fetchone()

        average_service_time = service_result[
            "average_service_time"
        ]


        # ----------------------------------
        # DEFAULT SERVICE TIME
        # ----------------------------------

        if average_service_time is None:

            average_service_time = 10

        else:

            average_service_time = float(
                average_service_time
            )


        # ----------------------------------
        # PREPARE DATA FOR AI
        # ----------------------------------

        input_data = pd.DataFrame({

            "patients_waiting": [
                patients_waiting
            ],

            "doctors_available": [
                doctors_available
            ],

            "average_service_time": [
                average_service_time
            ]
        })


        # ----------------------------------
        # MAKE PREDICTION
        # ----------------------------------

        prediction = model.predict(input_data)

        predicted_waiting_time = float(
            prediction[0]
        )


        # ----------------------------------
        # RETURN RESULT
        # ----------------------------------

        return jsonify({

            "patients_waiting":
                patients_waiting,

            "doctors_available":
                doctors_available,

            "average_service_time":
                round(
                    average_service_time,
                    2
                ),

            "predicted_waiting_time":
                round(
                    predicted_waiting_time,
                    2
                )

        })


    except Exception as error:

        print(error)

        return jsonify({

            "error":
                "AI prediction failed",

            "details":
                str(error)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ==========================================
# HOME
# ==========================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "message":
            "Hospital Queue AI is running"

    })


# ==========================================
# START PYTHON SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5001,
        debug=True
    )
