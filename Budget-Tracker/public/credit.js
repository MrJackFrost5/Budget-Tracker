// creditScore.js
module.exports = {
    updateCreditScore: function(currentCreditScore, goalAmount, actualExpense) {
        let difference = actualExpense - goalAmount;
        let pointsChange = 0;

        if (difference > 0) {
            // User overspent
            pointsChange = -2 * Math.floor(difference / 10);
        } else if (difference < 0) {
            // User underspent
            pointsChange = 2 * Math.floor(Math.abs(difference) / 10);
        }
        // Update the credit score
        let newCreditScore = currentCreditScore + pointsChange;

        // Ensure the credit score stays within 0 and 100
        newCreditScore = Math.max(0, Math.min(newCreditScore, 100));

        return newCreditScore;
    }
};