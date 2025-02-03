defmodule TomBaseWeb.PageController do
  use TomBaseWeb, :controller

  def home(conn, _params) do
    conn
    |> assign(:page_title, "Tom on the Internet")
    |> render(:home)
  end

  def about(conn, _params), do: render(conn, :about)
  def projects(conn, _params), do: render(conn, :projects)
  def matrix(conn, _params), do: render(conn, :matrix)
end
