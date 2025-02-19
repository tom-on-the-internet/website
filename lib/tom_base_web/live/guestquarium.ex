defmodule TomBaseWeb.Guestquarium do
  @moduledoc false
  use TomBaseWeb, :live_view

  alias Phoenix.PubSub

  def mount(_params, _session, socket) do
    PubSub.subscribe(TomBase.PubSub, TomBase.Guestquarium.topic())

    socket =
      socket
      |> assign(page_title: "Guestquarium")
      |> assign(intial_fish_loaded: false)

    {:ok, socket, layout: {TomBaseWeb.Layouts, :minimal}}
  end

  def handle_info({:fish_update, fish_update}, socket) do
    {:noreply, push_event(socket, :fish_update, fish_update)}
  end

  def handle_info({:fish_survey, fish}, socket) do
    if socket.assigns.intial_fish_loaded do
      {:noreply, socket}
    else
      socket =
        socket
        |> assign(intial_fish_loaded: true)
        |> push_event(:fish_survey, %{fish: fish})

      {:noreply, socket}
    end
  end
end
