# simple-sns

## Setup

### Dockerのセットアップ

Docker for Macを下記からインストール

https://hub.docker.com/editions/community/docker-ce-desktop-mac/

```sh
# Install docker-sync
sudo gem install docker-sync

# Start containers
make docker-up

# ログの確認
make docker-log
```

※ `Install unison for you? [y/N]` の無限ループが生じた場合、`Ctrl + C`してからリトライするとループがなくなる。

※ `Fatal error: No file monitoring helper program found` が出た場合は `brew unlink unox && brew link unox` で解決できる。場合によって`brew reinstall unison`も必要。

### Setup API Server

```sh
# Install dependencies
docker-compose exec api yarn install

# Copy Environment Variable （必要に応じて.envの中身を変更）
cp api/.env.sample api/.env

# Run migration
docker-compose exec api yarn typeorm migration:run

```
