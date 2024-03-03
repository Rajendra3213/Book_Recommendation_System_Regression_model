from flask import Flask, request, jsonify
import pandas as pd
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

# Load your data
users = pd.read_csv('users.csv')
books = pd.read_csv('books.csv')
ratings = pd.read_csv('ratings.csv')

# Merge data
data = pd.merge(ratings, users, on='user_id')
data = pd.merge(data, books, on='book_id')

# Calculate average rating per book
average_ratings = data.groupby('book_id')['rating'].mean().reset_index()

# Merge average ratings with the original data
data = pd.merge(data, average_ratings, on='book_id', suffixes=('', '_avg'))

# Select relevant features
X = data[['user_id', 'book_id']]
y = data['rating']

# Create and train a linear regression model
model = LinearRegression()
model.fit(X, y)

@app.route('/predict', methods=['POST'])
def predict():
    input_data = request.get_json()
    user_id = input_data['user_id']
    book_id = input_data['book_id']

    # Make predictions using the trained model
    prediction = model.predict([[user_id, book_id]])

    return jsonify({'prediction': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
