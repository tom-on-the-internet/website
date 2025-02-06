defmodule TomBaseWeb.Guestquarium do
  use TomBaseWeb, :live_view

  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(:page_title, "Guestquarium")

    {:ok, socket, layout: {TomBaseWeb.Layouts, :minimal}}
  end
end
