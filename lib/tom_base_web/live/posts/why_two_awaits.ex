defmodule TomBaseWeb.WhyTwoAwaits do
  use TomBaseWeb, :live_view

  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(:page_title, "Why Two Awaits?")

    {:ok, socket}
  end
end
