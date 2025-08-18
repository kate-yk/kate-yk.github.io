# # server.py
# from flask import Flask, send_from_directory
# import os

# STATIC_SUBDIRS = [
#     'includes', 
#     'public', 
#     'src',
# ]

# app = Flask(__name__, static_folder="static")

# # Serve index.html
# @app.route('/')
# def index():
#     return app.send_static_file('public/index.html')

# # Custom handler for JS/CSS/etc.
# @app.route('/<path:filename>')
# def serve_file(filename):
#     for sub in STATIC_SUBDIRS:
#         _dir = os.path.join(app.static_folder, sub)
#         path = os.path.join(app.static_folder, sub, filename)
#         # Check if the file exists
#         if not os.path.exists(path): continue
#         # If it's a JS file, set the MIME type explicitly
#         if filename.endswith('.js'): 
#             return send_from_directory(_dir, filename, mimetype="application/javascript")
#         # If it's a CSS file, set the MIME type explicitly
#         if filename.endswith('.css'): 
#             return send_from_directory(_dir, filename, mimetype='text/css')
#         # Flask will set 'mime' automatically (not like `send_from_directory`)
#         return app.send_static_file(f"{sub}/{filename}")
#     return "File not found", 404

# if __name__ == "__main__":
#     app.run(port=8080)



# server.py
from flask import Flask, send_from_directory
import os
import sys

STATIC_SUBDIRS = [
    'includes', 
    'public', 
    'src',
]

def create_app(static_root):
    app = Flask(__name__, static_folder=static_root)

    # Serve index.html
    @app.route('/')
    def index():
        return app.send_static_file('public/index.html')

    # Custom handler for JS/CSS/etc.
    @app.route('/<path:filename>')
    def serve_file(filename):
        for sub in STATIC_SUBDIRS:
            _dir = os.path.join(app.static_folder, sub)
            path = os.path.join(_dir, filename)
            if not os.path.exists(path):
                continue
            if filename.endswith('.js'):
                return send_from_directory(_dir, filename, mimetype="application/javascript")
            if filename.endswith('.css'):
                return send_from_directory(_dir, filename, mimetype='text/css')
            return app.send_static_file(f"{sub}/{filename}")
        return "File not found", 404

    return app

if __name__ == "__main__":
    # Ensure a project directory name is provided
    if len(sys.argv) != 2:
        print("Usage: python server.py <project_directory>")
        sys.exit(1)

    project_dir = sys.argv[1]
    if not os.path.isdir(project_dir):
        print(f"Error: '{project_dir}' is not a valid directory.")
        sys.exit(1)

    app = create_app(project_dir)
    app.run(port=8080)


## Path specification
# '/{path}' for absolute path from the root (static folder)
# './{path}' or '../{path}' for relative path from current directory of the file (pwd).


### Abstraction Level
# human language:                   Korean / English / Spanish / Japanese
# programming language (human):     Python / Java / C++     <- computers cannot understand
# native language (machine):        Binary / Assembly       <- computers can undetstand 10101000101010110101
