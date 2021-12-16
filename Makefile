# To apply self documented help command,
# make target with following two sharp '##' enable to show the help message.
# If you wish not to display the help message, create taget with no comment or single sharp to comment.
.PHONY: help
help: ## Show this help message.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: docker-up
docker-up: ## Start all containers.
	$(MAKE) docker-start

.PHONY: docker-start
docker-start: ## Start all containers.
	docker-sync start && docker-compose up -d

.PHONY: docker-stop
docker-stop: ## Stop all containers.
	docker-sync stop && docker-compose stop

.PHONY: docker-restart
docker-restart: ## Restart all containers.
	$(MAKE) docker-stop && $(MAKE) docker-start 


.PHONY: docker-down
docker-down: ## Stop and remove all container.
	docker-sync stop && docker-compose down

.PHONY: docker-clean
docker-clean: ## Stop and remove all container images and volumes.
	docker-sync clean && docker-compose down --rmi local --volumes

.PHONY: docker-log
docker-log: ## See logs.
	docker-compose logs -f --tail=200
