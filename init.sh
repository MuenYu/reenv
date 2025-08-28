# define variables
HOST="localhost"
PORT="5439"
USER="postgres"
DATABASE="postgres"

# install libpq through brew if not installed
if ! brew list libpq &>/dev/null; then
  brew install libpq
fi

export PATH="/opt/homebrew/opt/libpq/bin:$PATH"

if psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DATABASE" -c "SELECT 1" > /dev/null 2>&1; then
  # truncate svc_lab_audiences and svc_lab_audience_users
  psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DATABASE" -c "TRUNCATE TABLE svc_lab_audience_users, svc_lab_audiences RESTART IDENTITY CASCADE;"
  # import audience.csv
  psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DATABASE" -c "\COPY svc_lab_audiences(name) FROM '$PWD/audience.csv' DELIMITER ',' CSV HEADER;"
  # import audience_user.csv
  psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DATABASE" -c "\COPY svc_lab_audience_users(\"audienceId\", \"distinct_id\") FROM '$PWD/audience_user.csv' DELIMITER ',' CSV HEADER;"
  # import audience_user_temp.csv
  # psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DATABASE" -c "\COPY svc_lab_audience_users_temp(\"audienceId\", \"distinct_id\") FROM '$PWD/audience_user_temp.csv' DELIMITER ',' CSV HEADER;"
else
  echo "Failed to connect to Postgres."
  exit 1
fi

