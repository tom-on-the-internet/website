// See the Tailwind configuration guide for advanced usage
// https://tailwindcss.com/docs/configuration

let plugin = require("tailwindcss/plugin");
let fs = require("fs");
let path = require("path");

module.exports = {
    content: [
        "./js/**/*.js",
        "../lib/*_web.ex",
        "../lib/*_web/**/*.*ex",
    ],
    theme: {
        extend: {
            colors: {
                // tokyo night moon
                // https://github.com/folke/tokyonight.nvim/blob/main/lua/tokyonight/colors/moon.lua
                // these are in use
                background: "#222436",
                bg_highlight: "#2f334d",
                blue: "#82aaff",
                dark_teal: "#41a6b5",
                fg: "#c8d3f5",
                green: "#c3e88d",
                orange: "#ff966c",
                purple: "#fca7ea",
                teal: "#4fd6be",
                terminal_black: "#444a73",
                text: "#949cbb",
                yellow: "#ffc777",
                // these are not in use
                // bg = "#222436",
                //  bg_dark = "#1e2030",
                //  bg_dark1 = "#191B29",
                //  bg_highlight = "#2f334d",
                //  blue = "#82aaff",
                //  blue0 = "#3e68d7",
                //  blue1= "#65bcff",
                //  blue2 = "#0db9d7",
                //  blue5 = "#89ddff",
                //  blue6 = "#b4f9f8",
                //  blue7 = "#394b70",
                //  comment = "#636da6",
                //  cyan = "#86e1fc",
                //  dark3 = "#545c7e",
                //  dark5 = "#737aa2",
                //  fg = "#c8d3f5",
                //  fg_dark = "#828bb8",
                //  fg_gutter = "#3b4261",
                //  green = "#c3e88d",
                //  green1 = "#4fd6be",
                //  green2 = "#41a6b5",
                //  magenta = "#c099ff",
                //  magenta2 = "#ff007c",
                //  orange = "#ff966c",
                //  purple = "#fca7ea",
                //  red = "#ff757f",
                //  red1 = "#c53b53",
                //  teal = "#4fd6be",
                //  terminal_black = "#444a73",
                //  yellow = "#ffc777",
            },
            fontFamily: {
                "sans": ["IBM Plex Mono", "monospace"],
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        // Allows prefixing tailwind classes with LiveView classes to add rules
        // only when LiveView classes are applied, for example:
        //
        //     <div class="phx-click-loading:animate-ping">
        //
        plugin(({ addVariant }) =>
            addVariant("phx-click-loading", [
                ".phx-click-loading&",
                ".phx-click-loading &",
            ])
        ),
        plugin(({ addVariant }) =>
            addVariant("phx-submit-loading", [
                ".phx-submit-loading&",
                ".phx-submit-loading &",
            ])
        ),
        plugin(({ addVariant }) =>
            addVariant("phx-change-loading", [
                ".phx-change-loading&",
                ".phx-change-loading &",
            ])
        ),

        // Embeds Heroicons (https://heroicons.com) into your app.css bundle
        // See your `CoreComponents.icon/1` for more information.
        //
        plugin(function ({ matchComponents, theme }) {
            let iconsDir = path.join(__dirname, "../deps/heroicons/optimized");
            let values = {};
            let icons = [
                ["", "/24/outline"],
                ["-solid", "/24/solid"],
                ["-mini", "/20/solid"],
                ["-micro", "/16/solid"],
            ];
            icons.forEach(([suffix, dir]) => {
                fs.readdirSync(path.join(iconsDir, dir)).forEach((file) => {
                    let name = path.basename(file, ".svg") + suffix;
                    values[name] = {
                        name,
                        fullPath: path.join(iconsDir, dir, file),
                    };
                });
            });
            matchComponents({
                "hero": ({ name, fullPath }) => {
                    let content = fs.readFileSync(fullPath).toString().replace(
                        /\r?\n|\r/g,
                        "",
                    );
                    let size = theme("spacing.6");
                    if (name.endsWith("-mini")) {
                        size = theme("spacing.5");
                    } else if (name.endsWith("-micro")) {
                        size = theme("spacing.4");
                    }
                    return {
                        [`--hero-${name}`]:
                            `url('data:image/svg+xml;utf8,${content}')`,
                        "-webkit-mask": `var(--hero-${name})`,
                        "mask": `var(--hero-${name})`,
                        "mask-repeat": "no-repeat",
                        "background-color": "currentColor",
                        "vertical-align": "middle",
                        "display": "inline-block",
                        "width": size,
                        "height": size,
                    };
                },
            }, { values });
        }),
    ],
};
