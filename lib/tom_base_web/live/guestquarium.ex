defmodule TomBaseWeb.Guestquarium do
  @moduledoc false
  use TomBaseWeb, :live_view

  @tick_interval 1000
  @speed 5
  @width 800
  @height 600
  @num_fish 10

  def mount(_params, _session, socket) do
    fish =
      for _ <- 1..@num_fish do
        new_fish()
      end

    socket = assign(socket, fish: fish, page_title: "Guestquarium")

    Process.send_after(self(), :tick, 0)

    {:ok, socket, layout: {TomBaseWeb.Layouts, :minimal}}
  end

  def handle_info(:tick, socket) do
    {updated_fish, moved_fish} =
      Enum.reduce(socket.assigns.fish, {[], []}, fn fish, {acc, moved} ->
        if :rand.uniform() < 0.1 do
          # 10% chance to move the fish
          new_fish = move_fish(fish)
          {acc ++ [new_fish], moved ++ [new_fish]}
        else
          {acc ++ [fish], moved}
        end
      end)

    Process.send_after(self(), :tick, @tick_interval)

    if length(moved_fish) > 0 do
      {:noreply, socket |> push_event("tick", %{fish: moved_fish}) |> assign(:fish, updated_fish)}
    else
      {:noreply, assign(socket, :fish, updated_fish)}
    end
  end

  defp move_fish(fish) do
    %{fish | x: :rand.uniform(@width), y: :rand.uniform(@height), speed: :rand.uniform(@speed)}
  end

  defp new_fish do
    %{
      id: random_string(10),
      x: :rand.uniform(@width),
      y: :rand.uniform(@height),
      speed: :rand.uniform(@speed),
      size: random_size()
    }
  end

  defp random_string(length) do
    length
    |> :crypto.strong_rand_bytes()
    |> Base.url_encode64(padding: false)
    |> binary_part(0, length)
  end

  defp random_size do
    sizes = ["small", "medium", "large"]
    index = :rand.uniform(3) - 1
    Enum.at(sizes, index)
  end
end
