defmodule TomBaseWeb.CemeteryEscape do
  use TomBaseWeb, :live_view

  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(:page_title, "Cemetery Escape")

    {:ok, socket}
  end
end
