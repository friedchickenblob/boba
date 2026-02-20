.PHONY: run

run:
	python3 manage.py migrate
	python3 manage.py runserver localhost:8000

