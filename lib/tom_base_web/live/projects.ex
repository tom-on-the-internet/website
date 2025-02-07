defmodule TomBaseWeb.Projects do
  @moduledoc false
  use TomBaseWeb, :live_view

  def mount(_params, _session, socket) do
    socket = assign(socket, :page_title, "Projects")

    {:ok, socket}
  end
end
