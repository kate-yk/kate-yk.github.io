#!/bin/bash
# Detect OS and source appropriate profile
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS (default shell is zsh)
    if [ -f ~/.zshrc ]; then
        source ~/.zshrc
    fi
    python3 --version
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if [ -f ~/.bashrc ]; then
        source ~/.bashrc
    fi
    python3 --version
elif [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "cygwin"* || "$OSTYPE" == "win32"* ]]; then
    # Windows (Git Bash, Cygwin, etc.)
    if [ -f ~/.bashrc ]; then
        source ~/.bashrc
    fi
    TEMP=$PWD
    cd ..
    if command -v on_pvm &>/dev/null; then
        on_pvm
    elif command -v python --version &>/dev/null; then
        echo "You have your own python already..!"
    else
        echo "Error: 'on_pvm' command is not found, reach out to the owner of the project"
        echo "Notice: Jaehoon Song: manual20151276@gmail.com."
        exit 1
    fi
    cd $TEMP
fi



cd ..
echo -e "\n\n\n\n\n"




# Check for Python command (python3 or python)
if command -v python &>/dev/null; then
    PYTHON_CMD=python
elif command -v python3 &>/dev/null; then
    PYTHON_CMD=python3
else
    echo "Python is not installed or not found in PATH"
    exit 1
fi



# Check if virtual environment already exists
if [ -d "venv" ]; then
    echo "Debug: 'venv' directory already exists. Please remove it before creating a new virtual environment"
    echo "==============================================================="
    echo "Notice: (OR) Run the following command to activate the virtual environment:"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS (default shell is zsh)
        echo -e '\tsource ../venv/bin/activate && pip install setuptools && clear'
        echo -e '[Optional] python dev.py init && python dev.py build'
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo -e '\tsource ../venv/bin/activate && pip install setuptools && clear'
        echo -e '[Optional] python dev.py init && python dev.py build'
    elif [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "cygwin"* || "$OSTYPE" == "win32"* ]]; then
        # Windows (Git Bash, Cygwin, etc.)
        echo -e '\tsource ../venv/Scripts/activate && pip install setuptools && clear'
        echo -e '[Optional] python dev.py init && python dev.py build'
    fi
    
    echo "==============================================================="
    exit 1
fi

# Python Virtual Environment (PVE)
if $PYTHON_CMD -c "import venv" &>/dev/null; then
    echo "'venv' module is available. Creating virtual environment using 'venv'..."
    $PYTHON_CMD -m venv venv
elif $PYTHON_CMD -c "import virtualenv" &>/dev/null; then
    echo "'virtualenv' module is available. Creating virtual environment using 'virtualenv'..."
    $PYTHON_CMD -m virtualenv venv
else
    echo "Error: Neither 'venv' nor 'virtualenv' module is available. Please install one of them."
    exit 1
fi


echo "==============================================================="
echo "Notice: Run the following command to activate the virtual environment:."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS (default shell is zsh)
    echo -e "\tsource ../venv/bin/activate && pip install setuptools && clear"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo -e "\tsource ../venv/bin/activate && pip install setuptools && clear"
elif [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "cygwin"* || "$OSTYPE" == "win32"* ]]; then
    # Windows (Git Bash, Cygwin, etc.)
    echo -e "\tsource ../venv/Scripts/activate && pip install setuptools && clear"
fi
echo -e "python dev.py init"
echo "==============================================================="