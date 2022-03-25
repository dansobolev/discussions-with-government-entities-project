import json
import uuid


async def test_create_discussions_unauthorized_user(client, user):
    response = await client.post('/discussions', data=json.dumps({'name': 'test'}))
    assert response.status == 401
    assert (await response.json())['message'] == 'Unauthorized'


async def test_create_discussion_with_authorized_user(client, user):
    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))

    response = await client.post('/discussions',
                                 data=json.dumps({'name': 'test_discussion'}))
    assert response.status == 200


async def test_list_user_specific_discussions(client, users, user_discussions):
    user = users[0]
    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))
    response = await client.get('/user-discussions/list')
    assert response.status == 200
    assert (await response.json())['total'] == 1


async def test_list_all_discussions(client, user, discussions):
    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))
    response = await client.get('/discussions/list')
    assert response.status == 200
    assert (await response.json())['total'] == len(discussions)


async def test_get_non_existed_discussion(client, user):
    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))
    random_id = uuid.uuid4()
    response = await client.get(f'/discussions/{random_id}')
    assert response.status == 404
    assert (await response.json())['message'] == 'Discussion not found'


async def test_add_comment_to_non_existed_chat(client, user):
    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))
    random_id = uuid.uuid4()
    response = await client.post(f'/{random_id}/comments',
                                 data=json.dumps({'author_id': str(user.id),
                                                  'comment_text': 'test comment'}))
    assert response.status == 404
    assert (await response.json())['message'] == 'Discussion not found'


async def test_add_comment_to_chat_successful(client, users, discussions):
    user = users[0]
    discussion = discussions[0]
    comment_text = f'test comment by user {user.login}'
    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))
    response = await client.post(f'/{discussion.id}/comments',
                                 data=json.dumps({'author_id': str(user.id),
                                                  'comment_text': comment_text}))
    assert response.status == 200
    resp_data = await response.json()
    assert resp_data['items'][0]['author']['id'] == str(user.id)
    assert resp_data['items'][0]['comment_text'] == comment_text


async def test_add_comment_to_chat_user_is_not_participant(client, users, discussions):
    user = users[0]
    discussion = discussions[-1]
    comment_text = f'user not in this chat :('
    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))
    response = await client.post(f'/{discussion.id}/comments',
                                 data=json.dumps({'author_id': str(user.id),
                                                  'comment_text': comment_text}))
    assert response.status == 403
    assert (await response.json())['message'] == 'User not in dialogue'


async def test_add_participant_to_chat_successful(client, users, discussions):
    user = users[0]
    new_participant = users[1]
    discussion = discussions[0]
    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))
    response = await client.post(f'/{discussion.id}/participant',
                                 data=json.dumps({'login': f'{new_participant.login}'}))
    assert response.status == 200
    resp_data = await response.json()
    assert resp_data['items'][0]['inviter']['id'] == str(user.id)
    assert resp_data['items'][0]['participant']['id'] == str(new_participant.id)


async def test_add_participant_to_chat_user_is_not_participant(client, users, discussions):
    user = users[0]
    discussion = discussions[-1]
    new_participant = users[1]
    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))
    response = await client.post(f'/{discussion.id}/participant',
                                 data=json.dumps({'login': f'{new_participant.login}'}))
    assert response.status == 403
    assert (await response.json())['message'] == 'User not in dialogue'


async def test_add_already_existed_participant_in_chat(client, users, discussions):
    user = users[0]
    discussion = discussions[0]
    new_participant = users[1]
    await client.post('/login', data=json.dumps(
        {'login': user.login, 'password': 'test'}))
    await client.post(f'/{discussion.id}/participant',
                      data=json.dumps({'login': f'{new_participant.login}'}))
    response = await client.post(f'/{discussion.id}/participant',
                                 data=json.dumps({'login': f'{new_participant.login}'}))

    assert response.status == 400
    assert (await response.json())['message'] == \
           'User with such login is already in discussion'
