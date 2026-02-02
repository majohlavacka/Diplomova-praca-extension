#!/usr/bin/env bash

# konfiguracia
EXT_DIR="$HOME/extension"
BIN_DIR="$HOME/bin"
DESKTOP_DIR="$HOME/.local/share/applications"

# priprava adresarov
mkdir -p "$BIN_DIR"
mkdir -p "$DESKTOP_DIR"

# pole prehliadacov
declare -A BROWSERS=(
    ["chromium"]="chromium"
    ["chrome"]="google-chrome"
    ["edge"]="microsoft-edge"
)

# main loop
for BROWSER_NAME in "${!BROWSERS[@]}"; do
    EXEC_NAME="${BROWSERS[$BROWSER_NAME]}"

    if ! command -v "$EXEC_NAME" &> /dev/null; then
        echo "[!] $EXEC_NAME nie je nainstalovany, preskakujem..."
        continue
    fi

    # launcher skript
    LAUNCHER="$BIN_DIR/${BROWSER_NAME}-ext"
    cat <<EOF > "$LAUNCHER"
#!/bin/bash
$EXEC_NAME --load-extension="$EXT_DIR" "\$@"
EOF
    chmod +x "$LAUNCHER"

    # nova desktopova ikonka
    DESKTOP_FILE="$DESKTOP_DIR/${BROWSER_NAME}-ext.desktop"
    cat <<EOF > "$DESKTOP_FILE"
[Desktop Entry]
Name=${BROWSER_NAME^} (s extension)
Exec=$LAUNCHER
Type=Application
Icon=$EXEC_NAME
Categories=Network;WebBrowser;
EOF

    # skrytie povodnej desktopovej ikonky
    ORIGINAL_DESKTOP="/usr/share/applications/${EXEC_NAME}.desktop"
    if [ -f "$ORIGINAL_DESKTOP" ]; then
        echo "[Desktop Entry]" > "$DESKTOP_DIR/${EXEC_NAME}.desktop"
        echo "NoDisplay=true" >> "$DESKTOP_DIR/${EXEC_NAME}.desktop"
    fi
done

echo "Import hotovy..."
