defmodule TomBaseWeb.Guestquarium do
  @moduledoc false
  use TomBaseWeb, :live_view

  def mount(_params, _session, socket) do
    socket = assign(socket, :page_title, "Guestquarium")

    {:ok, socket, layout: {TomBaseWeb.Layouts, :minimal}}
  end
end
