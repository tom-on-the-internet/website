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
                rosewater: "#f2d5cf",
                flamingo: "#eebebe",
                pink: "#f4b8e4",
                mauve: "#ca9ee6",
                red: "#e78284",
                maroon: "#ea999c",
                peach: "#ef9f76",
                yellow: "#e5c890",
                green: "#a6d189",
                teal: "#81c8be",
                sky: "#99d1db",
                sapphire: "#85c1dc",
                blue: "#8caaee",
                lavender: "#babbf1",
                text: "#c6d0f5",
                subtext1: "#b5bfe2",
                subtext0: "#a5adce",
                overlay2: "#949cbb",
                overlay1: "#838ba7",
                overlay0: "#737994",
                surface2: "#626880",
                surface1: "#51576d",
                surface0: "#414559",
                base: "#303446",
                mantle: "#292c3c",
                crust: "#232634",
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
