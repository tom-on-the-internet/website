defmodule TomBaseWeb.Sandbox do
  @moduledoc false
  use TomBaseWeb, :live_view

  alias TomBase.Fish
  alias TomBase.Repo

  def mount(_params, _session, socket) do
    # Generate a random fish name
    random_name = "Fish_#{:rand.uniform(1000)}"

    # Insert new fish into the database
    Repo.insert!(%Fish{name: random_name})

    # Fetch all fish records
    fish = Repo.all(Fish)

    socket =
      socket
      |> assign(:page_title, "Sandbox")
      |> assign(:fish, fish)

    {:ok, socket}
  end
end
