defmodule TomBaseWeb.PageController do
  use TomBaseWeb, :controller

  def matrix(conn, _params), do: render(conn, :matrix, layout: false)
end
