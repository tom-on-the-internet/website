defmodule TomBase.Fish do
  use Ecto.Schema
  import Ecto.Changeset

  schema "fish" do
    field :message, :string
    field :name, :string
    field :link, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(fish, attrs) do
    fish
    |> cast(attrs, [:name, :message, :link])
    |> validate_required([:name, :link])
  end
end
