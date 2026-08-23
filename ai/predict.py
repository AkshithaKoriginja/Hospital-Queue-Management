import pandas as pd
from sklearn.linear_model import LinearRegression


# ==========================================
# TRAINING DATA
# ==========================================
# Example historical hospital queue data

data = {
    "patients_waiting": [
        2, 4, 6, 8, 10,
        12, 14, 16, 18, 20,
        5, 9, 15, 25
    ],

    "doctors_available": [
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1,
        2, 2, 3, 4
    ],

    "average_service_time": [
        10, 10, 10, 10, 10,
        10, 10, 10, 10, 10,
        10, 10, 10, 10
    ],

    "waiting_time": [
        20, 40, 60, 80, 100,
        120, 140, 160, 180, 200,
        25, 45, 50, 65
    ]
}


# Convert data into DataFrame
df = pd.DataFrame(data)


# ==========================================
# INPUT FEATURES
# ==========================================

X = df[
    [
        "patients_waiting",
        "doctors_available",
        "average_service_time"
    ]
]


# Target value
y = df["waiting_time"]


# ==========================================
# CREATE MACHINE LEARNING MODEL
# ==========================================

model = LinearRegression()


# Train the model
model.fit(X, y)


# ==========================================
# PREDICT WAITING TIME
# ==========================================

patients_waiting = 8
doctors_available = 2
average_service_time = 10


new_patient = pd.DataFrame({
    "patients_waiting": [patients_waiting],
    "doctors_available": [doctors_available],
    "average_service_time": [average_service_time]
})


predicted_waiting_time = model.predict(new_patient)


# ==========================================
# DISPLAY RESULT
# ==========================================

print("--------------------------------------")
print("HOSPITAL QUEUE AI")
print("--------------------------------------")

print("Patients waiting:", patients_waiting)

print("Doctors available:", doctors_available)

print(
    "Average service time:",
    average_service_time,
    "minutes"
)

print(
    "Predicted waiting time:",
    round(predicted_waiting_time[0], 2),
    "minutes"
)

print("--------------------------------------")
