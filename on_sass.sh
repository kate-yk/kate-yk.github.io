#!/bin/bash
# Create a Node.js project environment (package.json + bash activation helper)
# Style matched to your Python script conventions; assumes Windows users use Git Bash.
# Notice: Jaehoon Song: manual20151276@gmail.com.

# Detect OS and source appropriate profile
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS (default shell is zsh)
    if [ -f ~/.zshrc ]; then
        source ~/.zshrc
    fi
    node -v
    npm -v
    npx -v
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if [ -f ~/.bashrc ]; then
        source ~/.bashrc
    fi
    node -v
    npm -v
    npx -v
    # < npx >
elif [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "cygwin"* || "$OSTYPE" == "win32"* ]]; then
    # Windows (assume Git Bash / msys / Cygwin -> use bash)
    if [ -f ~/.bashrc ]; then
        source ~/.bashrc
    fi

    TEMP=$PWD
    cd ..

    # Try user macro on_v8 if available (prints node/npm/npx versions)
    if command -v on_v8 &>/dev/null; then
        on_v8
    else
        echo "Error: 'on_v8' command is not found, reach out to the owner of the project"
        echo "Notice: Jaehoon Song: manual20151276@gmail.com."
        exit 1
    fi
    cd $TEMP
fi

    




# # install Bootstrap (for SCSS) and Sass compiler (Dart Sass)
# npm install bootstrap --save
# npm install --save-dev sass
npm install bootstrap@latest
npm install --save-dev sass@1.77.6


echo "==============================================================="
echo "Notice: (OR) Run the following command to put project bin on PATH for this shell session:"
if [[ "$OSTYPE" == "darwin"* || "$OSTYPE" == "linux-gnu"* ]]; then
    echo -e '\t# Bash: add node_modules/.bin to PATH for this session'
    echo -e '\texport PATH="$(pwd)/node_modules/.bin:$PATH" && npm install'
    echo -e '[Optional] npx <tool>'
elif [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "cygwin"* || "$OSTYPE" == "win32"* ]]; then
    # Windows (Git Bash assumed)
    echo -e "To enable Sass compiler use:"
    echo -e "  $(USRPROMPT 'TEMP=$PWD && cd .. && on_v8 && cd $TEMP && clear')"
    echo -e "To run Sass compiler as runtime use:"
    echo -e "  $(USRPROMPT 'sass --watch static/src/scss/custom.scss:static/src/css/custom.css --source-map --load-path=./node_modules')"
    echo -e "To run Sass compiler use:"
    echo -e "  $(USRPROMPT 'sass static/src/scss/custom.scss:static/src/css/custom.min.css --style=compressed --no-source-map --load-path=./node_modules')"
    echo -e '[Optional] npm run sass:shell'
    echo -e '[Optional] npm run sass:compile'
fi
echo "==============================================================="














# # Create bash activation helper (Activate-Node) that mirrors venv style and uses 'deactivate'
# cat > "./Activate-Node" <<'ACTNODE'
# # Activate-Node -- Bash / Git Bash activation for Node project
# # Usage: source ./Activate-Node
# if [ -z "$NODE_OLD_PATH" ]; then
#     export NODE_OLD_PATH="$PATH"
# fi
# # Prepend project-local node_modules/.bin to PATH
# export PATH="$(pwd)/node_modules/.bin:$PATH"
# # Indicate development environment
# export NODE_ENV=development
# # Modify prompt to show env (mirror venv style)
# if [ -z "$NODE_OLD_PS1" ]; then
#     NODE_OLD_PS1="$PS1"
#     export PS1="(node) $PS1"
# fi

# deactivate() {
#     # restore old PATH and PS1
#     if [ -n "$NODE_OLD_PATH" ]; then
#         export PATH="$NODE_OLD_PATH"
#         unset NODE_OLD_PATH
#     fi
#     if [ -n "$NODE_OLD_PS1" ]; then
#         PS1="$NODE_OLD_PS1"
#         unset NODE_OLD_PS1
#     fi
#     unset NODE_ENV
#     unset -f deactivate
# }
# ACTNODE







# # Make Activate-Node executable (helpful on some systems)
# chmod +x ./Activate-Node 2>/dev/null || true




# # Create README for usage
# cat > "./NODE_ENV_README.txt" <<'README'
# Node project environment helpers.

# How to use:
# - Git Bash / Bash:
#     source ./Activate-Node
#   (This prepends ./node_modules/.bin to PATH and sets NODE_ENV=development)

# After activation:
# - Local project binaries installed by npm (npm i --save-dev <pkg>) are available on PATH via node_modules/.bin
# - Use npm install or npm ci to install project dependencies
# - Use npx <tool> to execute local binaries without global install

# To deactivate:
# - run `deactivate` (this mirrors venv deactivate naming)

# README

# echo "Created activation helper: ./Activate-Node (Bash/Git Bash)."
# echo "A default package.json exists (created if absent). Local bins are available under ./node_modules/.bin."

# echo "==============================================================="
# echo "Notice: Run the following command to activate the Node project environment:."
# if [[ "$OSTYPE" == "darwin"* || "$OSTYPE" == "linux-gnu"* ]]; then
#     echo -e "\tsource ../Activate-Node && npm install"
# elif [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "cygwin"* || "$OSTYPE" == "win32"* ]]; then
#     # Windows users assumed to be on Git Bash -> bash commands only
#     echo -e "\tsource ../Activate-Node && npm install"
# fi
# echo -e "Optional: npm install --save-dev <dev-deps> && npm install --save <deps>"
# echo "==============================================================="
