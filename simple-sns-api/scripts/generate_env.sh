SCRIPT_PATH=$(cd $(dirname $0); pwd)

# .env.production内の __SECRET_HOGE__ を環境変数 $HOGE で置き換え
cat ${SCRIPT_PATH}/../.env.production \
  | perl -pe 's/__SECRET_(.*)__/"$ENV{$1}"/' \
  | tee .env
  