defmodule TomBaseWeb.Home do
  @moduledoc false
  use TomBaseWeb, :live_view

  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(:page_title, "Home")
      |> assign(:show_message, false)
      |> assign(:quote_header, "")
      |> assign(:quote, nil)
      |> assign(:quote_chars, [])
      |> assign(:fade_in, false)

    Process.send_after(self(), :start_qotd, 8_000)

    {:ok, socket}
  end

  def handle_info(:start_qotd, socket) do
    %{header: quote_header, body: quote} = qotd()
    Process.send_after(self(), {:show_qotd, String.graphemes(quote)}, 50)

    socket =
      socket
      |> assign(:quote_header, quote_header)
      |> assign(:quote_chars, [])

    {:noreply, socket}
  end

  def handle_info({:show_qotd, []}, socket) do
    {:noreply, socket}
  end

  def handle_info({:show_qotd, [char | rest]}, socket) do
    updated_chars = socket.assigns.quote_chars ++ [char]

    delay = :rand.uniform(40) + 20

    delay =
      if char in [".", "!", "?"] and rest != [] and hd(rest) != "." do
        delay + 300
      else
        delay
      end

    if socket.assigns.quote_chars == [] do
      send(self(), :start_fade_in)
    end

    Process.send_after(self(), {:show_qotd, rest}, delay)

    {:noreply, assign(socket, :quote_chars, updated_chars)}
  end

  def handle_info(:start_fade_in, socket) do
    {:noreply, assign(socket, :fade_in, true)}
  end

  defp qotd do
    quotes = [
      %{
        header: "While you're here...",
        body:
          ~s(I'm really curious, actually, how you found my website. It's not a popular website. You probably followed a link from my YouTube, right? My email address is tom@tomontheinternet.com. You can email me if you want.)
      },
      %{
        header: "What do you think?",
        body:
          ~s(While you're here, let me run something by you... I think a good question to ask a web developer is: "What's a website?" I used to think I knew. Maybe it's the equivalent of asking "What's a company?" or "What's a person?" because the answer is "Well, it depends." But I think how they answer could give you insight into how they think. I mean, maybe. Maybe not.)
      },
      %{
        header: "Random thought",
        body:
          ~s(You know what I realized recently? Most of the possible HTTP status codes are not in use. Like, 555 is a perfectly good 3 digit number, but it doesn't mean anything. It would be cool, don't you think, to start using one and by doing so make it become a reality. Maybe 555 could mean something important.)
      },
      %{
        header: "Do you remember this?",
        body:
          ~s(Back in the day, web pages would just play music. You'd click a link and music would play. It wasn't even weird. There was no convention that a website shouldn't play music. But these days, only video sites are allowed to autoplay audio. Maybe some game sites, too. But mostly just video. That's the new convention. Most sites should be quiet. I'm not going to play a song here, but we can pretend there's music. ♪♫ Strangers in the night, exchanging glaces... ♫♪)
      },
      %{
        header: "Hacking time",
        body:
          ~s(<script>console.log('shh, I'm trying to hack this site.'\);alert('hacked!!'\);</script> . . . . . . Huh. It didn't work.)
      },
      %{
        header: "I was just thinking...",
        body:
          ~s(Right now, when you go out into nature, you're pretty removed from technology. Except for whatever your bring, of course. But sooner than later, that won't be the case. Just like it used to be the case that there was very little "tech" in your grocery store, but now the grocery store is full of tech. Ok, so, what technology might you see in nature? I don't know. Maybe a tree that records animals. You could ask the tree to show you animals that have been in the area recently. Or maybe a bush that can protect you from bears. Those are both dumb ideas. But something is coming, I'm sure.)
      }
    ]

    Enum.random(quotes)
  end
end
