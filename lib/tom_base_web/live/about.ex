defmodule TomBaseWeb.About do
  use TomBaseWeb, :live_view

  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(:page_title, "About")

    {:ok, socket}
  end
end
