defmodule TomBase.Repo.Migrations.CreateFish do
  use Ecto.Migration

  def change do
    create table(:fish) do
      add :name, :string
      add :message, :string
      add :link, :string

      timestamps(type: :utc_datetime_usec)
    end
  end
end
