from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user_obj):
        token = super().get_token(user_obj)
        token["user"] = {
            "username": user_obj.username,
            "email": user_obj.email,
        }
        return token


def generate_jwt_for_user(user):
    token = MyTokenObtainPairSerializer.get_token(user)
    tokens = {
        "refresh": str(token),
        "access": str(token.access_token),
    }
    return {"tokens": tokens}
