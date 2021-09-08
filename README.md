# Docker, NodeJS and MongoDB benchmark

## Usage

Run following command to start:

```bash
$ sudo docker rm -f $(sudo docker ps -a -q) && sudo docker volume rm $(sudo docker volume ls -q) && sudo docker-compose up
```