FROM python:3.12-slim

# nastavitev delovne mape
WORKDIR /app

# kopiraj requirements
COPY requirements.txt .

# namesti odvisnosti
RUN pip install --no-cache-dir -r requirements.txt

# kopiraj kodo
COPY . .

# izpostavi port (ti si uporabljala 6006)
EXPOSE 6006

# zagon aplikacije
CMD ["python", "app.py"]
