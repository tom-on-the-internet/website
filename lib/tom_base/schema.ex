# Tom, you made this. It's for UUIDv7.
defmodule TomBase.Schema do
  @moduledoc false
  defmacro __using__(_) do
    quote do
      use Ecto.Schema

      @primary_key {:id, Uniq.UUID, version: 7, autogenerate: true, dump: :default}
      @foreign_key_type Uniq.UUID
      @timestamps_opts [type: :utc_datetime_usec]
    end
  end
end
