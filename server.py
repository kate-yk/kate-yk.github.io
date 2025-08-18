#!/usr/bin/env python3
"""
server.py

Simple static-file Flask server with a CLI "build" feature.

Responsibilities
- Serve a static site from a project directory (expects subfolders like `public/`, `src/`, `includes/`).
- Provide a CLI option to create a build bundle (copies the configured static subdirectories
  into a new `build-<project_name>` directory or a custom output directory).

Design notes
- Static subdirectories to include in serve/build are listed in STATIC_SUBDIRS.
- Serving behavior:
    - '/' => serves <static_root>/public/index.html
    - '/<path:filename>' => looks for the requested file in each STATIC_SUBDIR in order.
      If found, `.js` files served with explicit JS mimetype, `.css` with CSS mimetype,
      otherwise served with Flask's static serving helper.
- Build behavior:
    - Default build directory name is `build-<basename(project_dir)>`.
    - If the build directory already exists it is removed and recreated.
    - Only directories that exist under the project directory and are listed in STATIC_SUBDIRS
      are copied. Missing subdirs are skipped with a warning.

Command-line interface
    python server.py <project_dir>             # run server on default port 8080
    python server.py <project_dir> -b          # create build-<project_dir> and exit
    python server.py <project_dir> --build          # create build-<project_dir> and exit
    python server.py <project_dir> -b -o dist  # copy into "dist" instead of build-...
    python server.py <project_dir> --port 5000 # run server on port 5000

Note for contributors
- If you want more production-ready serving (cache headers, gzip, etc.), use a proper build pipeline
  or front the app with nginx for static assets. This module is intended for dev/test usage.
"""
from __future__ import annotations

import os
import sys
import shutil
import argparse
from flask import Flask, send_from_directory
from typing import Optional




# List of static subdirectories that the server will look into for files.
# Put directories here in the order you want them searched.
STATIC_SUBDIRS = [
    "includes",
    "public",
    "src",
]


def create_app(static_root: str) -> Flask:
    """
    Create and return a Flask app instance configured to serve the project's static files.

    Args:
        static_root: Path to the project directory which contains the STATIC_SUBDIRS (e.g. ./myproject).

    Returns:
        A configured Flask instance.

    Behavior:
        - app.static_folder is set to the provided static_root so Flask's static helpers can be used.
        - Requests:
            - GET /  => returns public/index.html (relative to static_root)
            - GET /<filename> => searches each STATIC_SUBDIR for the filename and serves it if found.
    """
    app = Flask(__name__, static_folder=static_root)

    @app.route("/")
    def index():
        # Serve the project's public/index.html as the site entrypoint.
        # If that file doesn't exist, Flask will raise a 404.
        return app.send_static_file("index.html")
        return app.send_static_file("public/index.html")

    @app.route("/<path:filename>")
    def serve_file(filename: str):
        """
        Custom static handler:
        - For each subdir in STATIC_SUBDIRS, check if the requested file exists.
        - If found:
            - serve .js with JS mimetype
            - serve .css with CSS mimetype
            - otherwise use Flask's app.send_static_file so Flask picks an appropriate header
              and leverages the static path.
        - If not found in any subdir, return 404.
        """
        for sub in STATIC_SUBDIRS:
            sub_dir = os.path.join(app.static_folder, sub)
            candidate = os.path.join(sub_dir, filename)
            if not os.path.exists(candidate):
                # File not present in this subdir; continue searching the next one.
                continue

            # Found the file: choose how to serve it.
            if filename.endswith(".js"):
                # send_from_directory lets us set explicit mimetype
                return send_from_directory(sub_dir, filename, mimetype="application/javascript")
            if filename.endswith(".css"):
                return send_from_directory(sub_dir, filename, mimetype="text/css")

            # Generic static file serving -- preserves the subdirectory path relative to static_folder.
            # app.send_static_file expects a path relative to app.static_folder
            return app.send_static_file(f"{sub}/{filename}")

        # Not found anywhere -> 404
        return "File not found", 404

    return app


def build_project(project_dir: str, out_dir: Optional[str] = None) -> str:
    """
    Build the static bundle by copying the CONTENTS of each STATIC_SUBDIR
    directly into the top-level build directory (not into build_dir/<sub>).

    Example result structure:
      build-<project>/
        index.html        <-- from public/index.html
        css/
        js/
        includes-files...

    Notes:
    - If the build directory exists it is removed first (clean slate).
    - If a destination file/dir exists while merging, it will be removed and
      replaced by the incoming file/dir (later STATIC_SUBDIR entries can override earlier ones).
    """
    project_dir = os.path.abspath(project_dir)
    project_basename = os.path.basename(os.path.normpath(project_dir))
    build_dir = os.path.abspath(out_dir) if out_dir else os.path.abspath(f"build-{project_basename}")

    # Clean slate
    if os.path.exists(build_dir):
        print(f"Removing existing build directory: {build_dir}")
        shutil.rmtree(build_dir)
    os.makedirs(build_dir, exist_ok=True)

    copied_any = False

    for sub in STATIC_SUBDIRS:
        src = os.path.join(project_dir, sub)
        if not os.path.isdir(src):
            print(f"Warning: '{src}' not found; skipping.")
            continue

        # Copy each entry inside src into the top-level build_dir
        for entry in os.listdir(src):
            src_path = os.path.join(src, entry)
            dst_path = os.path.join(build_dir, entry)  # <<-- intentionally NOT os.path.join(build_dir, sub)

            # If a destination exists, remove it to avoid copytree/FileExistsError
            if os.path.exists(dst_path):
                try:
                    if os.path.isdir(dst_path) and not os.path.islink(dst_path):
                        shutil.rmtree(dst_path)
                    else:
                        os.remove(dst_path)
                except Exception as e:
                    print(f"Failed to remove existing destination '{dst_path}': {e}")
                    raise

            # Copy directory trees or files
            try:
                if os.path.isdir(src_path) and not os.path.islink(src_path):
                    shutil.copytree(src_path, dst_path)
                else:
                    # copy2 preserves metadata
                    shutil.copy2(src_path, dst_path)
                copied_any = True
            except Exception as e:
                print(f"Error copying '{src_path}' -> '{dst_path}': {e}")
                raise

        print(f"Copied contents of: {src} -> {build_dir}")

    if not copied_any:
        print("Warning: No static subdirectories were copied. Verify STATIC_SUBDIRS and project directory.")

    print(f"Build complete: {build_dir}")
    return build_dir


def parse_args(argv: Optional[list] = None) -> argparse.Namespace:
    """
    Parse CLI arguments.

    Positional:
        project_dir - required path to the project directory (where includes/, public/, src/ live)

    Flags:
        -b/--build : if present, create a build bundle and exit
        -o/--out   : optional custom output directory for the build
        --port     : port to run the Flask server on (default 8080)

    Returns:
        argparse.Namespace with parsed options.
    """
    parser = argparse.ArgumentParser(description="Serve static project or build static bundle.")
    parser.add_argument("project_dir", help="Path to project directory (contains includes/, public/, src/, ...)")
    parser.add_argument("-b", "--build", action="store_true", help="Create build-<project_dir> (or --out) instead of running server")
    parser.add_argument("-o", "--out", help="Optional output directory name for the build (overrides default build-<name>)")
    parser.add_argument("--port", type=int, default=8080, help="Port to run the Flask server on (default: 8080)")
    return parser.parse_args(argv)


def main(argv: Optional[list] = None) -> int:
    """
    Entrypoint used when run as a script.

    Returns:
        Exit code integer for the process (0 = success, non-zero = error).
    """
    args = parse_args(argv if argv is not None else sys.argv[1:])

    # Validate project directory early so users get an immediate error if something is wrong.
    if not os.path.isdir(args.project_dir):
        print(f"Error: '{args.project_dir}' is not a valid directory.")
        return 2

    if args.build:
        # Build and exit
        build_project(args.project_dir, out_dir=args.out)
        return 0

    # Otherwise, run the Flask development server for convenience.
    app = create_app(args.project_dir)
    print(f"Starting Flask dev server; serving from {os.path.abspath(args.project_dir)} on port {args.port}")
    try:
        # Note: in production, do not use Flask's built-in server.
        app.run(port=args.port)
    except KeyboardInterrupt:
        print("Server interrupted (KeyboardInterrupt).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())











### Original

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













## Path specification
# '/{path}' for absolute path from the root (static folder)
# './{path}' or '../{path}' for relative path from current directory of the file (pwd).


### Abstraction Level
# human language:                   Korean / English / Spanish / Japanese
# programming language (human):     Python / Java / C++     <- computers cannot understand
# native language (machine):        Binary / Assembly       <- computers can undetstand 10101000101010110101
