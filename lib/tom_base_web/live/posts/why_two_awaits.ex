defmodule TomBaseWeb.WhyTwoAwaits do
  @moduledoc false
  use TomBaseWeb, :live_view

  def mount(_params, _session, socket) do
    socket = assign(socket, :page_title, "Why Two Awaits?")

    {:ok, socket}
  end
end
