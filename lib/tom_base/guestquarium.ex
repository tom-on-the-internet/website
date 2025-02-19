defmodule TomBase.Guestquarium do
  @moduledoc false
  use GenServer

  alias Phoenix.PubSub
  alias TomBase.Fish
  alias TomBase.Repo

  require Logger

  @topic "guestquarium"
  @width 800
  @height 600
  @max_speed 5

  def topic, do: @topic

  def start_link(_), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)

  def init(state) do
    Task.start(fn -> load_fish() end)
    Process.send_after(self(), :fish_update, 100)
    Process.send_after(self(), :fish_survey, 1000)
    {:ok, Map.put(state, :fish, [])}
  end

  def handle_info(:fish_update, state) do
    if :rand.uniform(10) >= 8 and length(state.fish) > 0 do
      fish = Enum.random(state.fish)

      updated_fish = %{
        fish
        | x: :rand.uniform(@width),
          y: :rand.uniform(@height),
          speed: :rand.uniform(@max_speed)
      }

      updated_fish_list =
        Enum.map(state.fish, fn f ->
          if f.id == fish.id, do: updated_fish, else: f
        end)

      PubSub.broadcast(TomBase.PubSub, @topic, {:fish_update, updated_fish})

      new_state = %{state | fish: updated_fish_list}
      Process.send_after(self(), :fish_update, 100)
      {:noreply, new_state}
    else
      Process.send_after(self(), :fish_update, 100)
      {:noreply, state}
    end
  end

  def handle_info(:fish_survey, state) do
    PubSub.broadcast(TomBase.PubSub, @topic, {:fish_survey, state.fish})
    Process.send_after(self(), :fish_survey, 1000)
    {:noreply, state}
  end

  def handle_cast({:loaded_fish, fish_list}, state) do
    new_state = %{state | fish: fish_list}
    {:noreply, new_state}
  end

  defp load_fish do
    fish_list =
      Fish
      |> Repo.all()
      |> Enum.map(fn fish ->
        %{
          id: fish.id,
          name: fish.name,
          x: :rand.uniform(@width),
          y: :rand.uniform(@height),
          speed: :rand.uniform(@max_speed),
          size: :medium
        }
      end)

    GenServer.cast(TomBase.Guestquarium, {:loaded_fish, fish_list})
  end
end
