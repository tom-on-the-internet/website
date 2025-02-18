defmodule TomBase.FishUpdate do
  @moduledoc false
  use GenServer

  alias Phoenix.PubSub
  alias TomBase.Fish
  alias TomBase.Repo

  require Logger

  @topic "fish_update"
  @width 800
  @height 600
  @max_speed 5

  def start_link(_), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)

  def init(state) do
    Task.start(fn -> load_fish() end)
    schedule_next()
    {:ok, Map.put(state, :fish, [])}
  end

  def handle_info(:generate, state) do
    if :rand.uniform(10) >= 8 and length(state.fish) > 0 do
      fish = Enum.random(state.fish)

      fish_update = %{
        id: fish.id,
        x: :rand.uniform(@width),
        y: :rand.uniform(@height),
        speed: :rand.uniform(@max_speed),
        size: :medium
      }

      PubSub.broadcast(TomBase.PubSub, @topic, {:fish_update, fish_update})
    end

    schedule_next()
    {:noreply, state}
  end

  def handle_cast({:loaded_fish, fish_list}, state) do
    new_state = %{state | fish: fish_list}
    {:noreply, new_state}
  end

  defp schedule_next, do: Process.send_after(self(), :generate, 100)

  defp load_fish do
    fish_list = Repo.all(Fish)
    GenServer.cast(TomBase.FishUpdate, {:loaded_fish, fish_list})
  end
end
