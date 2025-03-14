# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.17.11",
  tom_base: [
    args:
      [__DIR__, "../assets/js/*.ts"]
      |> Path.join()
      |> Path.wildcard()
      |> Enum.concat([
        "--bundle",
        "--target=es2017",
        "--outdir=../priv/static/assets",
        "--external:/fonts/*",
        "--external:/images/*"
      ]),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.4.3",
  tom_base: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/app.css
    ),
    cd: Path.expand("../assets", __DIR__)
  ]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :tom_base, TomBase.Mailer, adapter: Swoosh.Adapters.Local

# Tom, you added these.
config :tom_base, TomBase.Repo, migration_foreign_key: [type: :uuid]
config :tom_base, TomBase.Repo, migration_primary_key: [type: :uuid]
config :tom_base, TomBase.Repo, migration_timestamps: [type: :utc_datetime_usec]

# Configures the endpoint
config :tom_base, TomBaseWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: TomBaseWeb.ErrorHTML, json: TomBaseWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: TomBase.PubSub,
  live_view: [signing_salt: "L9BOQYZm"]

config :tom_base,
  ecto_repos: [TomBase.Repo],
  generators: [timestamp_type: :utc_datetime_usec]

import_config "#{config_env()}.exs"
