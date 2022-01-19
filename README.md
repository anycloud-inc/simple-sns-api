# simple-sns

## Setup

### Dockerのセットアップ

Docker for Macを下記からインストール

https://hub.docker.com/editions/community/docker-ce-desktop-mac/

```sh
# クローン
git clone https://github.com/anycloud-inc/simple-sns.git
or 
git clone git@github.com:anycloud-inc/simple-sns.git

# リポジトリに移動
cd simple-sns

# Copy Environment Variable （必要に応じて.envの中身を変更）
cp simple-sns-api/.env.sample simple-sns-api/.env

# Install docker-sync
sudo gem install docker-sync

# Start containers
make docker-up

```

※ `Install unison for you? [y/N]` の無限ループが生じた場合、`Ctrl + C`してからリトライするとループがなくなる。

※ `Fatal error: No file monitoring helper program found` が出た場合は `brew unlink unox && brew link unox` で解決できる。場合によって`brew reinstall unison`も必要。

### Setup API Server

```sh
# Install dependencies
docker-compose exec api yarn install

# Run migration
docker-compose exec api yarn typeorm migration:run
```

http://localhost:3000/
にアクセスして、OKと表示されれば環境構築が完了

