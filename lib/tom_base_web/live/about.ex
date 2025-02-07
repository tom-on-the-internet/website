defmodule TomBaseWeb.About do
  @moduledoc false
  use TomBaseWeb, :live_view

  def mount(_params, _session, socket) do
    socket = assign(socket, :page_title, "About")

    {:ok, socket}
  end
end
