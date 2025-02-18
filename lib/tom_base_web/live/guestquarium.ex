defmodule TomBaseWeb.Guestquarium do
  @moduledoc false
  use TomBaseWeb, :live_view

  alias Phoenix.PubSub

  @topic "fish_update"

  def mount(_params, _session, socket) do
    socket = assign(socket, page_title: "Guestquarium")
    PubSub.subscribe(TomBase.PubSub, @topic)

    {:ok, socket, layout: {TomBaseWeb.Layouts, :minimal}}
  end

  def handle_info({:fish_update, fish_update}, socket) do
    {:noreply, push_event(socket, "tick", %{fish_update: fish_update})}
  end
end
