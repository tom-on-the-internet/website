defmodule TomBase.Fish do
  @moduledoc false
  use TomBase.Schema

  import Ecto.Changeset

  schema "fish" do
    field :message, :string
    field :name, :string
    field :link, :string

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(fish, attrs) do
    fish
    |> cast(attrs, [:name, :message, :link])
    |> validate_required([:name, :message, :link])
  end
end
