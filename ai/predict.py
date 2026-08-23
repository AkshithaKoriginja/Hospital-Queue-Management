import mysql.connector
import pandas as pd
from sklearn.linear_model import LinearRegression


# ==========================================
# 1. CONNECT TO MYSQL
# ==========================================

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="YOUR_MYSQL_PASSWORD",
    database="hospital_queue"
)

print("MySQL connected successfully!")


# ==========================================
# 2. GET ACTUAL QUEUE DATA
# ==========================================

cursor = db.cursor(dictionary=True)

query = """
SELECT
    q.queue_id,
    q.patient_id,
    q.doctor_id,
    q.status,
    q.waiting_time,
    q.start_time,
    q.end_time
FROM queues q
"""

cursor.execute(query)

queue_data = cursor.fetchall()


# ==========================================
# 3. CHECK QUEUE DATA
# ==========================================

print("\nCurrent Queue Data:")

for row in queue_data:
    print(row)


# ==========================================
# 4. COUNT PATIENTS CURRENTLY WAITING
# ==========================================

waiting_query = """
SELECT COUNT(*) AS patients_waiting
FROM queues
WHERE status = 'Waiting'
"""

cursor.execute(waiting_query)

waiting_result = cursor.fetchone()

patients_waiting = waiting_result["patients_waiting"]


# ==========================================
# 5. COUNT AVAILABLE DOCTORS
# ==========================================

doctor_query = """
SELECT COUNT(*) AS doctors_available
FROM doctors
"""

cursor.execute(doctor_query)

doctor_result = cursor.fetchone()

doctors_available = doctor_result["doctors_available"]


# ==========================================
# 6. CALCULATE AVERAGE SERVICE TIME
# ==========================================

service_query = """
SELECT
    AVG(
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
"""

cursor.execute(service_query)

service_result = cursor.fetchone()

average_service_time = service_result["average_service_time"]


# ==========================================
# 7. HANDLE EMPTY SERVICE TIME
# ==========================================

if average_service_time is None:

    # Use 10 minutes if there is not
    # enough historical data yet

    average_service_time = 10

else:

    average_service_time = float(
        average_service_time
    )


# ==========================================
# 8. SAMPLE TRAINING DATA
# ==========================================
#
# This is temporary training data.
# Later we will train using your
# actual historical hospital data.
#

training_data = {
    "patients_waiting": [
        2, 4, 6, 8, 10,
        12, 14, 16, 18, 20
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
        20, 40, 60, 80, 100,
        120, 140, 160, 180, 200
    ]
}


df = pd.DataFrame(training_data)


# ==========================================
# 9. MACHINE LEARNING FEATURES
# ==========================================

X = df[
    [
        "patients_waiting",
        "doctors_available",
        "average_service_time"
    ]
]

y = df["waiting_time"]


# ==========================================
# 10. TRAIN MODEL
# ==========================================

model = LinearRegression()

model.fit(X, y)


# ==========================================
# 11. USE ACTUAL MYSQL DATA
# ==========================================

actual_data = pd.DataFrame({

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


# ==========================================
# 12. PREDICT WAITING TIME
# ==========================================

prediction = model.predict(actual_data)

predicted_waiting_time = prediction[0]


# ==========================================
# 13. DISPLAY RESULT
# ==========================================

print("\n======================================")
print("HOSPITAL QUEUE AI")
print("======================================")

print(
    "Patients currently waiting:",
    patients_waiting
)

print(
    "Doctors available:",
    doctors_available
)

print(
    "Average service time:",
    round(average_service_time, 2),
    "minutes"
)

print(
    "Predicted waiting time:",
    round(predicted_waiting_time, 2),
    "minutes"
)

print("======================================")


# ==========================================
# 14. CLOSE MYSQL CONNECTION
# ==========================================

cursor.close()

db.close()

print("\nMySQL connection closed.")
