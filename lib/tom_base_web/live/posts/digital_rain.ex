defmodule TomBaseWeb.DigitalRain do
  use TomBaseWeb, :live_view

  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(:page_title, "Digital Rain")

    {:ok, socket}
  end
end
