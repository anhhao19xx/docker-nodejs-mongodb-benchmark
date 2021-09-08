# Docker, NodeJS and MongoDB benchmark

## Usage

Build

```bash
sudo docker-compose build
```

Run following command to start:

```bash
sudo docker-compose up
```

To clear containers and its volumes:

```bash
sudo docker rm -f $(sudo docker ps -a -q) && sudo docker volume rm $(sudo docker volume ls -q)
```