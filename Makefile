up:
	docker-compose up -d --build

up-prod-build:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

down:
	docker-compose down
