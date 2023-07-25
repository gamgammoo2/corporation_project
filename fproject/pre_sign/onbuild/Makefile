build:
	docker build -t ubuntu:x .
run:
	docker run -it -d -p 8000:80 --name ubuntu ubuntu:x 
exec:
	docker exec -it ubuntu /bin/bash 
ps:
	docker ps -a
img:
	docker images
rm:
	docker rm -f $$(docker ps -aq)
rmi:
	docker rmi $$(docker images -q)