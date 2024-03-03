document.addEventListener('DOMContentLoaded', function () {
    const predictionForm = document.getElementById('predictionForm');
    const inputUserId = document.getElementById('inputUserId');
    const inputBookId = document.getElementById('inputBookId');
    const predictionResult = document.getElementById('predictionResult');

    predictionForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const userId = inputUserId.value.trim();
        const bookId = inputBookId.value.trim();

        // Validate user and book IDs
        if (!userId || !bookId || isNaN(userId) || isNaN(bookId)) {
            alert('Please enter valid User ID and Book ID.');
            return;
        }

        // Make an API request to your server with the user and book IDs
        fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, bookId }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error predicting. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            // Update the UI with the prediction result
            predictionResult.innerHTML = `<p>Predicted Rating: <strong>${data.prediction.toFixed(2)}</strong></p>`;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error predicting. Please try again.');
        });
    });
});
