defmodule TomBaseWeb.AiThoughtsAndFears do
  @moduledoc false
  use TomBaseWeb, :live_view

  def mount(_params, _session, socket) do
    socket = assign(socket, :page_title, "AI Thoughts and Fears")

    {:ok, socket}
  end
end
