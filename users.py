from firebaseManager import FirebaseManager


class User:

    @staticmethod
    def registerUser(data):
        """
        registers a new user
        Returns:

        """
        userId = data["userId"]
        userInfo = data["userInfo"]

        FirebaseManager.saveToFB(userInfo, "users/"+userId)

