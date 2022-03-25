from typing import Any, Dict, List
import json


def permissions_to_str(permissions: List) -> str:
    if not permissions:
        return ''
    permissions = ', '.join(permissions)
    return permissions


def permission_to_list(permissions: str) -> List:
    permissions = permissions.split(', ')
    return permissions


def load_with_default(default: Dict = None):
    if default is None:
        default = dict()

    def inner(body: str):
        if body:
            return json.loads(body)
        return default
    return inner


def object_response(response_body: Any) -> Dict:
    if isinstance(response_body, list):
        total = len(response_body)
    elif isinstance(response_body, dict):
        total = 1
        response_body = list(response_body)

    return {'items': response_body, 'total': total}
