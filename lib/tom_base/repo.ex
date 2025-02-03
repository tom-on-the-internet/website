defmodule TomBase.Repo do
  use Ecto.Repo,
    otp_app: :tom_base,
    adapter: Ecto.Adapters.SQLite3
end
