import datetime
import os

def log_message(message):
    if not os.path.exists("Logs"):
        os.makedirs("Logs")

    timestamp = datetime.datetime.now()
    formatted_timestamp = timestamp.strftime('%d-%m-%Y')
    filename = os.path.join("Logs", f"{formatted_timestamp}.txt")
    
    with open(filename, 'a') as log_file:
        log_file.write(f"{timestamp} - {message}\n")
        print(message)