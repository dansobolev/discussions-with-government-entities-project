Installing dependencies using Poetry:
    
    poetry shell
    poetry install

To run server:
    
    poetry run python runserver.py


## API description

### Register

    /register "POST"
        request: {
            "login": str,
            "password": str,
            "email": str,
            "phone_number": str,
            "firstname": str,
            "lastname": str,
            "middlename": str,
            "profile_image_id": str (is user upload its profile image)
        }
        response: {
            201, Created
        }

### Log In

    /login "POST"
        request: {
            "identity": str (email or phone number),
            "password": str
        }

        response: {
            "id": str
            "login": str,
            "email": str,
            "phone_number": str,
            "firstname": str,
            "lastname": str,
            "middlename": str,
            "profile_image": {
                "id": str,
                "created_at": str,
                "type": str,
                ...
            },
            "role_type": str,
            "is_banned": bool
        }


### Logout

    /logout "GET"
        response: {
            200, ok
        }


### Password reset
Password reset request

    /password-reset-request "POST"
        request: {
            "email": str
        }

        response: {
            200, ok
        }
    
Password reset process

    /password-reset-procedure/{reset_id} "GET"
        response: {
            200, ok (if link is existing and not expired yet)
        }
        
    /password-reset-procedure/{reset_id} "POST"
        request: {
            "password": str
        }
        response: {
            200, ok
        }


### Change password

    /change-password "POST"
        request: {
            "password": str,
            "password_retry": str
        }
        response: {
            200, ok
        }


### Create discussion

    /dicussion "POST"
        request: {
            "name": str
        }
        response: {
            "id": str,
            "name": str,
            "participants": [{
                "id": str
                "login": str,
                "email": str,
                "phone_number": str,
                "firstname": str,
                "lastname": str,
                "middlename": str,
                "profile_image": {
                    "id": str,
                    "created_at": str,
                    "type": str,
                    ...
                },
                "role_type": str,
                "is_banned": bool
            }],
            "comments": []
        }


### User discussions

    /user-discussions/list "GET"
        response: [
            {
                "id": str,
                "name": str,
                "participants": [{
                    "id": str
                    "login": str,
                    "email": str,
                    "phone_number": str,
                    "firstname": str,
                    "lastname": str,
                    "middlename": str,
                    "profile_image": {
                        "id": str,
                        "created_at": str,
                        "type": str,
                        ...
                    },
                    "role_type": str,
                    "is_banned": bool
                }, ...],
                "comments": [{
                    "id": str,
                    "created_at": str,
                    "author": {
                        "id": str
                        "login": str,
                        "email": str,
                        "phone_number": str,
                        "firstname": str,
                        "lastname": str,
                        "middlename": str,
                        "profile_image": {
                            "id": str,
                            "created_at": str,
                            "type": str,
                            ...
                        },
                        "role_type": str,
                        "is_banned": bool
                    },
                    "comment_text": str,
                    "attachments": [{
                        "id": str,
                        "created_at": str,
                        "type": str,
                        ...
                    }, ...],
                    "replied_message": ???
                }, ...]
            }, ...]

### All users discussions

    /discussions/list "GET"
        response: {
            same as for /user-discussions/list
        }


### Create comment for discussion

    /{discussion_id}/comments "POST"
        request: {
            "author_id": str,
            "comment_text": str,
            "attachments": [{
                "id": str,
                "created_at": str,
                "type": str,
                ...
            }, ...],
            "replied_message": ???
        }
        response: {
            "id": str,
            "created_at": str,
            "author": {
                "id": str
                "login": str,
                "email": str,
                "phone_number": str,
                "firstname": str,
                "lastname": str,
                "middlename": str,
                "profile_image": {
                    "id": str,
                    "created_at": str,
                    "type": str,
                    ...
                },
                "role_type": str,
                "is_banned": bool
            },
            "comment_text": str,
            "attachments": [{
                "id": str,
                "created_at": str,
                "type": str,
                ...
            }
        }
