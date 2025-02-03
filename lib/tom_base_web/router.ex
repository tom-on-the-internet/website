defmodule TomBaseWeb.Router do
  use TomBaseWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {TomBaseWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :matrix do
    plug :accepts, ["html"]
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", TomBaseWeb, host: "matrix." do
    pipe_through :matrix
    get "/", PageController, :matrix
  end

  scope "/", TomBaseWeb do
    pipe_through :browser

    live "/", Home
    live "/about", About
    live "/projects", Projects
    live "/why-two-awaits", WhyTwoAwaits
    live "/cemetery-escape", CemeteryEscape
  end

  # Other scopes may use custom stacks.
  # scope "/api", TomBaseWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:tom_base, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: TomBaseWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
