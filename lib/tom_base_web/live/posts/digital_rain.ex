defmodule TomBaseWeb.DigitalRain do
  @moduledoc false
  use TomBaseWeb, :live_view

  def mount(_params, _session, socket) do
    socket = assign(socket, :page_title, "Digital Rain")

    {:ok, socket}
  end
end
