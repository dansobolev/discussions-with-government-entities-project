echo "Applying fixtures"
python3 apply_fixtures.py

echo "Running migrations"
alembic upgrade head

echo "Running server"
poetry run python runserver.py
